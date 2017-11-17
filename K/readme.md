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

There are no prefixes to commands, all commands are declarative english, the commands are as follows:
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

### quit
Quits the program entirely.

## tests
To run the unit tests simply run: `npm test`

## license
MIT © [Kalium](https://kalium.xyz)
