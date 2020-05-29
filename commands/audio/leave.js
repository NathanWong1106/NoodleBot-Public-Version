module.exports = {
	name: 'leave',
	type: 'audio',

	async execute(message, args, client) {
		serverQueue = queue.get(message.guild.id);
		voiceChannel = message.member.voice.channel;

		if (!voiceChannel) {
			message.reply('You must be in the voice channel to use this command');
		} else if (serverQueue.connection.channel.id !== voiceChannel.id) {
			message.channel.send('Go into my channel to make me leave!');
		} else {
			queue.delete(message.guild.id);
			try {
				voiceChannel.leave();
			} catch (err) {
				console.log(err);
				message.channel.send('Oops. Something went wrong.');
			}
		}
	}
};
