const Discord = require('discord.js');
const client = new Discord.Client();
const readline = require('readline');
const config = require('./.config.json')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.on('ready', () => {
	console.log('I am ready!');
});

client.on('message', message => {
	// console.log(message)
	if (message.channel.type === "dm" && !message.author.bot) {
		// rl.question('would you like to reply?', x =>
		// 	message.reply(x)
		// );
		message.reply("yes!");
		console.log(message.content);
	}
});



client.login(config.client);
