module.exports = {
	name: 'ping',
	type: 'general',
	description: 'ping',
	execute(message) {
		message.channel.send('Pong');
	}
};
