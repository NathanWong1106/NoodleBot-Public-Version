const commandCheck = require('../../util/validAudioCommand');

module.exports = {
	name: 'move',
	type: 'audio',

	execute(message, args, client) {
		serverQueue = queue.get(message.guild.id);
		const index = parseInt(args[0]);
		const to = args[1];
		const position = parseInt(args[2]);

		//if the bot is currently in
		if (serverQueue) {
			if (commandCheck.isValid(message)) {
				if (isNaN(args[0]) || index <= 0 || index % 1 != 0 || index >= serverQueue.songs.length) {
					message.channel.send('Invalid index!');
					return;
				} else {
					//if there is second argument in the command
					if (to) {
						if (to === 'to') {
							//check if the position to be moved to is a valid number
							if (
								isNaN(args[2]) ||
								position <= 0 ||
								position % 1 != 0 ||
								position >= serverQueue.songs.length ||
								position == index
							) {
								message.channel.send('Invalid position!');
								return;
							} else {
								const moved = serverQueue.songs.splice(index, 1);
								serverQueue.songs.splice(position, 0, moved[0]);
								message.channel.send('Moved `' + moved[0].title + '` to position ' + position);
							}
						} else {
							message.channel.send('Use -move [index] to [position]!');
							return;
						}

						//if there is no second argument, default move command moves the indicated index to the 1st position
					} else {
						const moved = serverQueue.songs.splice(index, 1);
						serverQueue.songs.splice(1, 0, moved[0]);
						message.channel.send('Moved `' + moved[0].title + '` to position 1');
					}
				}
			}
		} else {
			message.channel.send("I'm not in your voice channel. Use !join to let me in!");
			return;
		}
	}
};
