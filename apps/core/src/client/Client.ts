import sha256 from '../utils/hash';
import { KeyPair } from '../types/types';
import Hyperswarm from 'hyperswarm';
import DHT from '@hyperswarm/dht';

class Client {
   private _swarm: typeof Hyperswarm;
   private _id: string;
   private _keyPair: KeyPair;

   constructor(id: string) {
      this._keyPair = DHT.keyPair(Buffer.alloc(32).fill(sha256(id)));
      this._id = id;
   }

   async initialize() {
      this._swarm = new Hyperswarm({ keyPair: this._keyPair });
      this._swarm.on('connection', (conn: any, info: any) => {
         conn.on('data', (res: any) => {
            const parsed = JSON.parse(res.toString());
            // console.log('Response: ', parsed);
            if (parsed.target !== 'all' && parsed.target !== this._id) {
               console.log('Pass: Target destination not me');
            } else {
               if (parsed.content.type === 'String') {
                  console.log(`Received ${parsed.content.type}: ${parsed.content.data.trim()}`);
               } else {
                  console.log(`Received ${parsed.content.type}: ${parsed.content.data}`);
               }
            }
         });
         conn.write('this is a client connection');
      });
   }

   async join(topic: Buffer) {
      this._swarm.join(topic, { server: true, client: true });
      await this._swarm.flush();
      console.log(`${this._id} joined topic!`);
   }

   async joinPeer(seed: string) {
      const pubKey = await DHT.keyPair(Buffer.alloc(32).fill(sha256(seed))).publicKey;
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

   public get peers() {
      return this._swarm.peers;
   }
}
export default Client;
