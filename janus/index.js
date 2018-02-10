'use strict';
/* libs */
const Connection = require('instant-connection')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const nick = "janus"

/* logging */
const logStream = fs.createWriteStream(path.join(__dirname, `monitor.log`), { flags: 'a' });
function log(...text) {
		text.forEach(text => {
			logStream.write(`${Date.now()} - ${JSON.stringify(text)}\n`)
		})
	}

/* config */
// checks if an argument for the room is given else it will monitor test
const room = (process.argv.join().match(/-r,(\w+)/) || [,'test'])[1]

// a two dimensional array serving as a stack per nick. allowing hashmap like lookups.
const tellstack = [];

// instantiate the connection with the room
const connection = new Connection(room)
// set our funcitonal code on the ready event, so we are sure that the socket has been created and is connected to the server
connection.once('ready', _ => {
	// set nick so people know what we are doing
	connection.nick(nick)
	// get prior logs from anyone who wants to give me
	// on any message send log to console
	connection.on('broadcast', ev => {
		if(ev.data && ev.data.text && ev.id){
			if(ev.data.text.startsWith(`!ping @${nick}`))
				connection.post('pong!', ev.id)
			if(ev.data.text.startsWith('!tell')){
				let match = ev.data.text.match(/@(\S*) (.*)/)
				if(match && match[1] && match[2]){
					// if the nick does yet have a stack in our "tellstack", make one
					if(!tellstack[match[1]])
						tellstack[match[1]] = [match[2]]
					else // else just add it to the stack
						tellstack[match[1]].push(match[2])

					connection.post(`will tell @${match[1]}`, ev.id)
				}
			}
			if(ev.data.text.startsWith(`!kill @${nick}`))
				process.exit();
			if(ev.data.text.startsWith(`!help @${nick}`))
				connection.post(`I'm @${nick} I'll !tell @{person} {whatever you want them to be told.}`, ev.id);
			if(tellstack[ev.data.nick]){
				while(tellstack[ev.data.nick].length)
					connection.post(tellstack[ev.data.nick].shift(), ev.id)
			}

		log(`${ev.data.nick}: ${ev.data.text}`)
		console.log(`${ev.data.nick}: ${ev.data.text}`)
		}
	})
	// join event (someone joining)
	connection.on('joined', ev => log(`${ev.data.nick || 'someone'} joined`))
	// part event (someone leaving)
	connection.on('left', ev => log(`${ev.data.nick || 'someone'} left`))

	// join event (someone joining)
	connection.on('joined', ev => console.log(chalk.green(`${ev.data.nick || 'someone'} joined`)))
	// part event (someone leaving)
	connection.on('left', ev => console.log(chalk.red(`${ev.data.nick || 'someone'} left`)))
})
