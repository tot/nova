import readline from 'node:readline'
import server from './server/Server'

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
    console.log(key.name)
	if(key.name == "j") process.exit() 
})

server.listen(1337)
