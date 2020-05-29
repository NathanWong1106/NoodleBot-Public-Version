const ytdl = require('ytdl-core');

module.exports = {
	execute(guild) {
		//Get the value from the global queue Map()
		serverQueue = queue.get(guild.id);
		song = serverQueue.songs[0];

		//if there is no song then halt recursion
		if (!song) {
			console.log('No songs left');
			return;
		} else {
			//set the status to playing audio
			serverQueue.playing = true;

			//establish a dispatcher to the connection --highWaterMark fixes an error where audio cuts off early (no idea why?)
			const dispatcher = serverQueue.connection
				.play(ytdl(song.url, { filter: 'audioonly', highWaterMark: 1 << 25 }))
				.once('finish', () => {
					//end doesn't work with this bot (?)

					//set the status to stop playing audio
					serverQueue.playing = false;

					//shift the songs to reference the next one --only executes if the bot is not looping
					if (serverQueue.looping) {
						serverQueue.songs[0].requestedBy = 'Loop';
						this.execute(guild);
						return;
					} else if (serverQueue.loopingQueue) {
						serverQueue.songs.push(serverQueue.songs.shift());
						serverQueue.songs[serverQueue.songs.length - 1].requestedBy = 'Loop Queue';
						this.execute(guild);
						return;
					}

					serverQueue.songs.shift();
					//execute() in this file is a recursive function --calls itself until there are no songs left in the guild's queue
					this.execute(guild);
				})
				.on('error', (err) => {
					console.log(err);
				});

			//dispatcher.pause(true);
			serverQueue.dispatcher = dispatcher;
			//volume settings
			dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		}
	}
};
