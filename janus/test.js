import test from 'ava';

const Connection = require('instant-connection');


test('can hold 10 mgs', async t => {
	let connection = new Connection('test')

	await new Promise((res, rej) => {
		connection.once('ready', _ => {
			connection.nick('<><', _ => {
				for(let i = 0; i < 10; i++)
					connection.post(`!tell @><> ${i}`)
					res()
			})

		})
	})
	t.pass()
});

test('can send 10 mgs', async t => {
	let connection = new Connection('test')

	await new Promise((res, rej) => {
		connection.once('ready', _ => {
			connection.nick('><>', _ => {
				connection.post('pew')
				res()
			})
		})
	})
	t.pass()
});
