module.exports = {
	name: 'pause',
	type: 'audio',

	execute(message, args, client) {
		const voiceChannel = message.member.voice.channel;
		const serverQueue = queue.get(message.guild.id);

		if (!voiceChannel) {
			message.reply('you need to be in a voice channel!');
		} else if (!serverQueue) {
			message.reply("I'm not in your voice channel. Use -join to let me in!");
			return;
		} else if (voiceChannel.id !== serverQueue.connection.channel.id) {
			message.channel.send('You must be in the same channel as me to pause!');
		} else if (serverQueue.songs.length === 0) {
			message.channel.send('There are no songs to pause right now!');
		} else if (!serverQueue.playing) {
			message.channel.send('Already paused!');
		} else {
			if (serverQueue.dispatcher) {
				serverQueue.dispatcher.pause(true);
				serverQueue.playing = false;
				message.channel.send('Paused!');
			} else {
				message.channel.send('There was a problem pausing the song :(');
			}
		}
	}
};
