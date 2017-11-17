#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MarkovChain = require('markovchain');
const euphoriaConnection = require('euphoria-connection');

/* configurtation */
const config = require('./config.json');

// allows the user to override any setting in the config file by affixing --{setting} {option} when calling the script 
const args = process.argv
		.join()
		.match(/-\w+,\w+/g) || [];
args.forEach( arg => {
		let key = arg
			.split(',')[0]
			.replace('-','');
		config[key] = arg.split(',')[1];
	})

// reads the entire dataset into RAM (will crash if your ram is smaller then the dataset)
const dataset = fs.readFileSync(config.dataset, 'utf-8');
const markov = new MarkovChain(dataset);

const connection = new euphoriaConnection(config.room, config.human, "wss://euphoria.io", { origin: "https://euphoria.io" });

/* logging */
const logStream = fs.createWriteStream(path.join(__dirname, `application.log`), { flags: 'a' });
function log(...text) {
		text.forEach(text => {
			process.stdout.write(`\n${text}\n`)
			logStream.write(`${Date.now()} - ${JSON.stringify(text)}\n`)
		});
	}

/* memory */
const memory = []; // post memory
const stack = []; // planned event stack (timeouts) to allow us to override default acctions from CLI
let afkCounter = config.afk.delay * 1000;

const rl = readline.createInterface({
	prompt: `${config.nick}>`,
	input: process.stdin,
	output: process.stdout,
	terminal: true
});

connection.on('send-event', message => {
	// log anything posted
	const data = message.data;
	log(`${data.sender.name}: ${data.sender.id}> ${data.content}`);
	memory.push(data);

	if (new RegExp(`@${config.nick}`).test(data.content))
		if(!config.override)
			stack.push(setTimeout( () => {
				connection.post(markov.end(Math.ceil(Math.random() * 100 % 40)).process(), data.id);
				stack.shift()
			}, 1000 * config.reply.delay));

	if (new RegExp(`^!kill @${config.nick}`).test(data.content))
		process.exit();

	rl.prompt();
});


rl.on('line', line => {
	line = line.split(' ');
	let command = line.shift();
	line = line.join(' ');
	if (command.startsWith('q'))
		process.exit();

	if (command.startsWith('p')){
		command.shift
		connection.post(line);
		connection.once('send-reply', post => memory.push(post.data));
		clearTimeout(stack.shift());
	}

	if (command.startsWith('r')){
		connection.post(line, memory[memory.length-1].id);
		clearTimeout(stack.shift());
	}

	if (command.startsWith('m'))
		connection.post(markov.end(Math.ceil(Math.random() * 100 % 40)).process(), memory[memory.length-1].id);

	if (command.startsWith('n')){
		config.nick = line;
		connection.nick(config.nick);
	}

	if (command.startsWith('a'))
		connection.nick(config.nick + " - AFK");

	rl.prompt();
	afkCounter = config.afk.delay * 1000;

});


connection.once('ready', () => {
	connection.nick(config.nick)
	log('bot initiated');
	rl.prompt();

	setInterval( () => {
		if(!--afkCounter)
			connection.nick(config.nick + " - AFK");

	});
});

connection.on('close', (...ev) => log('closed:', ev));
