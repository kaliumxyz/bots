# K
> markov bot replacement so that people leave me alone

## install
configure a config.json file containing the nick, room, and dataset (defaults are K, &xkcd, ./dataset.txt) in the following format:

```json
{
	"nick": "K",
	"room": "xkcd",
	"dataset": "dataset.txt",
	"human": 1
}
```
A default dataset is not included and should be added.

## usage
It will reply with any @mentions to the nickname with a generated reply of 1 to 40 words.

## tests
No tests are implemented yet.

## license
MIT © [Kalium](https://kalium.xyz)
