import net from 'node:net';

class Peer {
	_ip: string
	_port: number
   _client: net.Socket

	constructor(ip: string, port: number) {
		this._ip = ip
		this._port = port
      this._client = net.createConnection({port: port})
	}

   /**
    * 
    * @param data 
    * @returns 
    */
   send(data: any) {
      this._client.write('hello\r\n');
      return;
   }


   /**
    * Disconnect from peer
    */
   disconnect() {
      this._client.end()
   }
}

export default Peer