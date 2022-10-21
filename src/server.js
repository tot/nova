// import net module from node
import net from 'node:net';

// creates the server
const server = net.createServer();

// on 'error' Event, throw error
server.on('error', (err) => {
   if (err.message === 'EADDRINUSE') {
      console.log('Address in use, retrying...');
      setTimeout(() => {
         server.close();
         server.listen(1337, '127.0.0.1');
      }, 1000);
   }
   console.log(err);
   throw err;
});

// on client connection event
server.on('connection', (socket) => {
   console.log('Client connected to server.');

   // Server details
   const address = socket.address().address;
   const port = socket.address().port;
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