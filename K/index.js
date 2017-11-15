const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MarkovChain = require('markovchain');
const euphoriaConnection = require('euphoria-connection');

/* configurtation */
// this doesn't actually work for replacing the default, left in because some update will probably add it
const config = require('./config.json') || { nick: "K", room: "test", dataset: "dataset.txt" };
// reads the entire dataset into RAM (will crash if your ram is smaller then the dataset)
const dataset = fs.readFileSync(config.dataset, 'utf-8');
const markov = new MarkovChain(dataset);

const connection = new euphoriaConnection(config.room, 1);

/* logging */
const logStream = fs.createWriteStream(path.join(__dirname, `application.log`), { flags: 'a' });
const log = require('k-log')(logStream);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true
});

connection.on('send-event', message => {
	// log anything posted
	log(`user: ${message.data.sender.name}, ${message.data.sender.id}`, message.data.content);

	if (new RegExp(`${config.nick}`).test(message.data.content))
		connection.post(markov.end(Math.ceil(Math.random() * 100 % 40)).process(), message.data.id);
	if (new RegExp(`^!kill @${config.nick}`).test(message.data.content))
		process.exit();

});


rl.on('line', line => {
	if (/^quit/.test(line))
		process.exit();
	if (/^post/.test(line))
		connection.post(line)

	rl.prompt();

})

connection.once('ready', () => {
	connection.nick(config.nick)
	log('bot initiated');
	rl.prompt();
})

connection.on('message', console.log)