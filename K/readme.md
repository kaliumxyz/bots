# K
> markov bot replacement of me so that people leave me alone

## install
configure a config.json file or use the defaults, the format is as below.

```json
{
	"nick": "K",
	"room": "xkcd",
	"dataset": "dataset.txt",
	"human": 1,
	"override": true,
	"afk": {
		"delay": 600
	},
	"reply": {
		"delay": 5,
		"type": "markov"
	}
}

```
A default dataset is not included and should be added.

## usage
It will reply with any @mentions to the set nickname with a generated reply of 2 to 40 words.

### CLI functionality
Its also a functional CLI for [euphoria.io](https://euphoria.io).

### starting commands
To avoid disambiguatie it will listen to any fully typed out agruments that matches an option in the root of the config.json.
Examples:
```
$ --nick ><>
```
will set the bots name to `><>`.
```
$ node . --room music
```

There are no prefixes to commands, all commands can be either send in declarative English or as the first letter of the command; here follows a list of the commands:
### post
Post a single post to the root thread.
```
K> post Hi guys :D
```

### reply
Reply to the last message send.
```
xyzzy: how are you?
K> reply Good :D
```

### markov
Post a markov chain generated reply to the last post.
```
K> markov
```

### nick
Sets the nick of the bot.
```
K> nick ><>
><>>
```

### afk
Affixes - AFK to the nick.
```
K> afk
K - AFK>
```

### quit
Quits the program entirely.

## tests
To run the unit tests simply run: `npm test`

## license
MIT © [Kalium](https://kalium.xyz)
