const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MarkovChain = require('markovchain');
const euphoriaConnection = require('euphoria-connection');

/* configurtation */
const config = require('./config.json');
// reads the entire dataset into RAM (will crash if your ram is smaller then the dataset)
const dataset = fs.readFileSync(config.dataset, 'utf-8');
const markov = new MarkovChain(dataset);

const connection = new euphoriaConnection(config.room, config.human, "wss://euphoria.io", { origin: "https://euphoria.io" });

/* logging */
const logStream = fs.createWriteStream(path.join(__dirname, `application.log`), { flags: 'a' });
const log = require('k-log')(logStream);

/* memory */
const memory = [];

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true
});

connection.on('send-event', message => {
	// log anything posted
	const data = message.data;
	log(`user: ${data.sender.name}, ${data.sender.id}`, data.content);
	memory.push(data);

	if (new RegExp(`${config.nick}`).test(data.content))
		setTimeout( () => {
			connection.post(markov.end(Math.ceil(Math.random() * 100 % 40)).process(), data.id);
		})
	if (new RegExp(`^!kill @${config.nick}`).test(data.content))
		process.exit();

});


rl.on('line', line => {
	if (line.startsWith('quit'))
		process.exit();
	if (line.startsWith('post'))
		connection.post(line.slice(5));
	if (line.startsWith('reply'))
		connection.post(line.slice(6), memory[memory.length-1].id);

	rl.prompt();

})

connection.once('ready', () => {
	connection.nick(config.nick)
	log('bot initiated');
	rl.prompt();
})

connection.on('close', (...ev) => log('closed:', ev));