const commandCheck = require('../../util/validAudioCommand');

module.exports = {
	name: 'clearq',
	type: 'audio',

	execute(message, args, client) {
		serverQueue = queue.get(message.guild.id);

		if (commandCheck.isValid(message)) {
			if (serverQueue) {
				if (serverQueue.songs.length > 1) {
					const numSongs = serverQueue.songs.length - 1;
					serverQueue.songs.splice(1);
					message.channel.send('`' + numSongs + '` songs have been cleared from the queue');
				} else {
					message.channel.send('There is no queue at the moment');
					return;
				}
			} else {
				message.channel.send("I'm not in your voice channel. Use !join to let me in!");
				return;
			}
		}
	}
};
