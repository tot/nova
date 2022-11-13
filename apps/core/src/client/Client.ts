import net from 'node:net'

const client = net.createConnection({
	port: 1337
}, () => {
	client.write('hello\r\n')
})

client.on('data', data => {
	console.log(data.toString())
	client.end()
})