import net from 'node:net';

class Peer {
   _id: string
	_ip: string
	_port: number
   _client: net.Socket

	constructor(ip: string, port: number) {
      this._id = "id"
		this._ip = ip
		this._port = port
      this._client = net.createConnection({port: port})
	}


   /**
    * Set unique identification for peer
    * @param id Unique identification for peer
    */
   setId(id: string) {
      // generate/retrieve id
      this._id = id
   }

   /**
    * Send data to connected peer
    * @param data Data to send to peer
    * @returns 
    */
   send(data: any) {
      this._client.write(data);
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