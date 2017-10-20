const fs = require('fs');
const path = require('path');
const readline = require('readline');

const Discord = require('discord.js');
const client = new Discord.Client();

/* configurtation */
const config = require('./.config.json') || { api: void(0) };

/* logging */
const logStream = fs.createWriteStream(path.join(__dirname, `application.log`), { flags: 'a' });
const log = require('k-log')(logStream);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true
});

client.on('ready', () => {
	log('bot initiated');
	rl.prompt();
});

client.on('message', message => {
	// log anything posted
	log(`user: ${message.author.username}, ID: ${message.author.id}`, message.cleanContent);
	let msgTimeout;

	if (message.channel.type === "dm" && !message.author.bot) {
		// rl.question('would you like to reply?', x => {
		// 	message.reply(x);
		// 	rl.close();
		// 	clearTimeout(msgTimeout);
		// });

		// setTimeout(_ => {
			// rl.close();
			message.reply("yes!");
		// }, 4000);

	}
});


rl.on('line', line => {
	switch(line){
		case('status'):
		console.log(client.status.toString());
		break;
		case('help'):
		console.log(`
status - gets the status number.
users - logs the users the bot has access to at any given moment.
			`.trim());
		break;
		case('users'):
		client.users.forEach(x => console.log(x));
		break;
		case (line.match(/^send.*/) || {}).input:
		console.log('this feature has not yet been implemented')
		break;
		default:
		console.log('we have not yet implemented this feature, use "help" for an overview of commands')
		break;
	}
	rl.prompt();
})


client.login(config.client);
