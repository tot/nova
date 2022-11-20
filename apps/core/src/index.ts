import readline from 'readline';
import Server from './server/Server';
import Client from './client/Client';

const topic = Buffer.alloc(32).fill('hello world this is a test'); // A topic must be 32 bytes
const server = new Server('bean figure economy pear shield');
const peer = new Client('bean figure economy pear mute');

server.initialize();
peer.initialize();

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
   console.log(key.name);
   if (key.name == 'j') process.exit();
   if (key.name === 't') server.send();
   if (key.name === 'n') console.log(server.peerCount);
});

(async () => {
   await server.join(topic);
   await peer.join(topic);
   // console.log('Peers: ', server.peers);
})();
