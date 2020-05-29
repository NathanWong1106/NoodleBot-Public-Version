module.exports = {
	isValid(message) {
		const voiceChannel = message.member.voice.channel;
		serverQueue = queue.get(message.guild.id);

		if (!voiceChannel) {
			message.channel.send('Connect to my voice channel to use music commands!');
			return false;
		}

		if (serverQueue.connection.channel.id !== voiceChannel.id) {
			message.channel.send("I'm already connected to another voice channel!");
			return false;
		} else {
			return true;
		}
	}
};
