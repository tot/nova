import sha256 from '../utils/hash';
import { KeyPair } from '../types/types';
const Hyperswarm = require('hyperswarm');
const DHT = require('@hyperswarm/dht');

class Client {
   private _swarm: typeof Hyperswarm;
   private _keyPair: KeyPair;

   constructor(seed: string) {
      this._keyPair = DHT.keyPair(Buffer.alloc(32).fill(sha256(seed)));
   }

   async initialize() {
      this._swarm = new Hyperswarm({ keyPair: this.keyPair });
      this._swarm.on('connection', (conn: any, info: any) => {
         conn.on('data', (data: any) => console.log('client got message:', data.toString()));
         conn.write('this is a client connection');
         console.log('connected');
      });
   }

   async join(topic: Buffer) {
      this._swarm.join(topic, { server: true, client: true });
      await this._swarm.flush();
   }

   async joinPeer(seed: string) {
      const pubKey = await DHT.keyPair(Buffer.alloc(32).fill(sha256(seed))).publicKey;
      this._swarm.joinPeer(pubKey);
   }

   public info() {
      console.log(this._swarm.connections);
      console.log(this._swarm.peers);
   }

   public get keyPair() {
      return this._keyPair;
   }

   public get publicKey() {
      return this._swarm.keyPair.publicKey;
   }
}
export default Client;
