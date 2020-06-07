const commandCheck = require('../../util/validAudioCommand');

module.exports = {
	name: 'remove',
	type: 'audio',

	execute(message, args, client) {
		const serverQueue = queue.get(message.guild.id);
		const index = parseInt(args[0]);

		if (commandCheck.isValid(message)) {
			if (!index) {
				message.channel.send('Please give me an index to remove!');
				return;
			}

			if (serverQueue) {
				if (isNaN(args[0]) || index <= 0 || index % 1 != 0) {
					message.channel.send(`No songs are located in index ${args[0]}`);
				} else {
					if (index < serverQueue.songs.length) {
						const removed = serverQueue.songs.splice(index, 1);
						message.channel.send('Removed `' + removed[0].title + '` from the queue!');
					} else {
						message.channel.send(`No songs are located in index ${args[0]}`);
					}
				}
			} else {
				message.channel.send("I'm not in any voice channels in this server. Type -join to let me in!");
			}
		}
	}
};
