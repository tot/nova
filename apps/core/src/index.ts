// import net module from node
import net from 'node:net';
import readline from 'node:readline'
// import dotenv package
// import * as dotenv from 'dotenv';
// load environment variables
// dotenv.config();

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
    console.log(key.name)
	if(key.name == "j") process.exit() 
})

// creates the server
const server = net.createServer();

// on 'error' Event, throw error
server.on('error', (err) => {
   if (err.message === 'EADDRINUSE') {
      console.log('Address in use, retrying...');
      setTimeout(() => {
         server.close();
         server.listen(1337, 'localhost');
      }, 1000);
   }
   console.log(err);
   throw err;
});

server.on('connection', (socket) => {
   console.log('Client connected to server.');

   // Server details
   const address = socket.localAddress;
   const port = socket.localPort;
   console.log(`Server is listening at local address: ${address}:${port}`);

   // Client details
   const remoteAddress = socket.remoteAddress;
   const remotePort = socket.remotePort;
   console.log(`Remote socket is listening at address: ${remoteAddress}:${remotePort}`);

   // Get number of concurrent connections to server
   server.getConnections((err, count) => {
      console.log(`Number of connections: ${count}`);
   });

   socket.on('data', (data) => {
      socket.write(data + '\r\n');
   });

   // Client disconnected
   socket.on('end', () => {
      console.log('Client disconnected!');
   });

   // Socket timed out -- stalled, couldn't create, etc
   socket.on('timeout', () => {
      console.log('Socket timed out');
      socket.end('Timed out');
   });
});

server.listen(1337)
