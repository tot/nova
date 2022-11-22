import Hyperswarm from 'hyperswarm';
import DHT from '@hyperswarm/dht';
import { Subject } from 'rxjs';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import fileHandle from 'node:fs/promises';
import path from 'node:path';
import sha256 from '../utils/hash';
import { KeyPair, SendEvent } from '../types/types';
import { buffer } from 'node:stream/consumers';
class Server {
   private _swarm: typeof Hyperswarm;
   private _peerCount: number;
   private _connections: any[];
   private _peers: any[];
   private _events: Subject<SendEvent>;
   private _id: string;
   private _keyPair: KeyPair;

   constructor(id: string) {
      this._peerCount = 0;
      this._events = new Subject();
      this._connections = [];
      this._peers = [];
      this._id = id;
      this._keyPair = DHT.keyPair(Buffer.alloc(32).fill(sha256(id)));
   }

   public async initialize() {
      this._swarm = new Hyperswarm({ keyPair: this._keyPair });
      this._swarm.on('connection', (conn: any, info: any) => {
         console.log('connected');
         this._peerCount += 1;
         this._connections.push(conn);
         this._peers.push(info);

         conn.on('data', (data: any) => console.log('client sent message:', data.toString()));

         this._events.subscribe((event: any) => {
            if (event.type === 'send') {
               console.log(event);
               return conn.write(
                  JSON.stringify({
                     target: event.target,
                     content: event.content
                  })
               );
            }

            if (event.type === 'disconnect') {
               this._peerCount -= 1;
               console.log('disconnect');
               conn.end();
               conn.destroy();
               return;
            }
         });

         conn.write(
            Buffer.from(
               JSON.stringify({
                  target: 'all',
                  content: { type: 'String', data: 'server connected to client' }
               })
            )
         );
      });
   }

   public async join(topic: Buffer) {
      return new Promise(async (resolve, reject) => {
         const discovery = this._swarm.join(topic, { server: true, client: true });
         await discovery.flushed();
         console.log('Server joined topic!');
         resolve(true);
      });
   }

   public async send() {
      const filePath = path.join(__dirname, '../file.txt');
      console.log('Sending ', filePath);
      const buf = new Buffer();
      const filehandle = await fs.promises.open(filePath, 'r+');
      const file = await filehandle.read(buf, 0, null, 0);
      // const file = await fs.readFile(filePath);
      const jsonBuffer = JSON.parse(file.toString());
      console.log('JSON: ', jsonBuffer);
      // const data = {
      //    type: 'send',
      //    content: {
      //       type: 'Buffer',
      //       data: file
      //    }
      // };
      // this._events.next(data);
   }

   public async listen() {
      await this._swarm.listen();
   }

   async joinPeer(seed: string) {
      const pubKey = DHT.keyPair(Buffer.alloc(32).fill(sha256(seed))).publicKey;
      this._swarm.joinPeer(pubKey);
   }

   public get id() {
      return this._id;
   }

   public get keyPair() {
      return this._keyPair;
   }

   public get publicKey() {
      return this._swarm.keyPair.publicKey;
   }

   public get peerCount() {
      return this._peerCount;
   }

   public get peers() {
      return this._swarm.peers;
   }
}
export default Server;
