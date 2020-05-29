module.exports = {
	name: 'help',
	type: 'general',

	execute(message, args, client) {
		message.channel.send(
			'Documentation is available in the README of: https://github.com/NathanWong1106/NoodleBot-Public-Version'
		);
	}
};
