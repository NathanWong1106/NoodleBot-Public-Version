const ytdl = require('ytdl-core');

module.exports = {
	name: 'loopq',
	type: 'audio',

	execute(message, args, client) {
		const voiceChannel = message.member.voice.channel;
		const serverQueue = queue.get(message.guild.id);

		if (!voiceChannel) {
			message.reply('you need to be in a voice channel!');
			return;
		} else if (!serverQueue) {
			message.reply("I'm not in your voice channel. Use -join to let me in!");
			return;
		} else if (voiceChannel.id !== serverQueue.connection.channel.id) {
			message.channel.send('You must be in the same channel as me to loop!');
		} else if (serverQueue.songs.length <= 1) {
			message.channel.send('There is no queue to loop right now!');
		} else {
			if (serverQueue.loopingQueue) {
				serverQueue.loopingQueue = false;
				message.channel.send('Stopped looping!');
			} else {
				serverQueue.loopingQueue = true;
				message.channel.send(`Now looping the queue! You can add more songs to this loop by using 'play'`);
			}
		}
	}
};
