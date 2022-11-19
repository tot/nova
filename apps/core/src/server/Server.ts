const Hyperswarm = require('hyperswarm');
const DHT = require('@hyperswarm/dht');
const { Subject } = require('rxjs');
import fs from 'node:fs/promises';
import path from 'node:path';
import sha256 from '../utils/hash';
import { KeyPair } from '../types/types';
class Server {
   private _swarm: typeof Hyperswarm;
   private _peerCount: number;
   private _connections: any[];
   private _events: typeof Subject;
   private _keyPair: KeyPair;

   constructor(seed: string) {
      this._peerCount = 0;
      this._events = new Subject();
      this._connections = [];
      this._keyPair = DHT.keyPair(Buffer.alloc(32).fill(sha256(seed)));
   }

   public async initialize() {
      this._swarm = new Hyperswarm({ keyPair: this._keyPair });
      this._swarm.on('connection', (conn: any, info: any) => {
         console.log('connected');
         this._peerCount += 1;
         this._connections.push(conn);

         conn.on('data', (data: any) => console.log('client got message:', data.toString()));

         this._events.subscribe((event: any) => {
            if (event.type === 'send') {
               console.log('sending data: ', event.content);
               return conn.write(
                  JSON.stringify({
                     content: event.content
                  })
               );
            }

            if (event.type === 'disconnect') {
               this._peerCount = 0;
               console.log('disconnect');
               conn.end();
               conn.destroy();
               return;
            }
         });

         conn.write('this is a server connection');
      });
   }

   public async join(topic: Buffer) {
      return new Promise(async (resolve, reject) => {
         console.time('joinServer');
         console.log('joining server');
         const discovery = this._swarm.join(topic, { server: true, client: true });
         await discovery.flushed();
         console.timeEnd('joinServer');
         resolve(true);
      });
   }

   public async send() {
      const filePath = path.join(__dirname, '../file.txt');
      console.log(filePath);
      const file = await fs.readFile(filePath);
      console.log(file);
      this._events.next({ type: 'send', content: file });
   }

   public async listen() {
      await this._swarm.listen();
      console.log('listening)');
   }

   public info() {
      console.log(this._swarm.connections);
      console.log(this._swarm.peers);
   }

   async joinPeer(seed: string) {
      const pubKey = DHT.keyPair(Buffer.alloc(32).fill(sha256(seed))).publicKey;
      this._swarm.joinPeer(pubKey);
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
}
export default Server;