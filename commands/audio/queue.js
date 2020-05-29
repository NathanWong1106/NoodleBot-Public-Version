const timeStringAudio = require('../../util/timeStringAudio');

module.exports = {
	name: 'queue',
	type: 'audio',

	execute(message, args, client) {
		serverQueue = queue.get(message.guild.id);
		const page = parseInt(args[0]);

		if (args[0]) {
			if (isNaN(args[0])) {
				message.channel.send('Invalid page number!');
				return;
			} else if (page <= 0) {
				message.channel.send('Please use a number above 0');
				return;
			}
		}

		if (!serverQueue) {
			message.channel.send("I'm not in any voice channels in this server. Type -join to let me in!");
			return;
		} else {
			//Edge cases of no songs playing or only one song playing
			if (serverQueue.songs.length === 0) {
				message.channel.send('No songs are playing at the moment.');
				return;
			} else if (serverQueue.songs.length === 1) {
				const embed = {
					author: {
						name: `Queue for ${message.guild.name}`,
						icon_url: client.user.displayAvatarURL()
					},
					title: `Now Playing: ${serverQueue.songs[0].title}`,
					url: serverQueue.songs[0].url,
					thumbnail: {
						url: serverQueue.songs[0].thumbnail
					}
				};

				message.channel.send({ embed: embed });
			} else {
				//queue beginning at the 1st index of the arr
				const songArr = serverQueue.songs.slice(1);

				//default to the first page if the user has not specified a queue page to view
				if (page) {
					this.embedBuilder(songArr, message, client, page);
				} else {
					this.embedBuilder(songArr, message, client, 1);
				}
			}
		}
	},

	//builds pages of the server queue and sends and embed message
	embedBuilder(songArr, message, client, page) {
		let queueArr = [];
		let position = 1;
		let index = 0;
		let lastPage = '';
		let duration = 0;

		queueArr.push('');

		songArr.forEach((song) => {
			duration += song.time;

			//append to the current page with the song
			queueArr[index] +=
				'`' +
				position +
				')` ' +
				'[' +
				song.title +
				']' +
				'(' +
				song.url +
				')' +
				'  `|| ' +
				timeStringAudio.convert(song.time) +
				' Requested By: ' +
				song.requestedBy +
				'`' +
				'\n\n';

			//song to append to the next page if the length is over 100
			const lastSong =
				'`' +
				position +
				')` ' +
				'[' +
				song.title +
				']' +
				'(' +
				song.url +
				')' +
				'  `|| ' +
				timeStringAudio.convert(song.time) +
				' Requested By: ' +
				song.requestedBy +
				'`' +
				'\n\n';

			//make a new page if the characters exceed 1000 on one page of the queue
			if (queueArr[index].length > 1000) {
				//revert the current page to the previous version
				queueArr[index] = lastPage;

				//append a new array element(page) with the next song
				queueArr.push(lastSong);

				//increment the index(page) and set the last page equivalent to the current page
				index++;
				lastPage = lastSong;
			} else {
				//save this iteration and continue
				lastPage = queueArr[index];
			}
			//accumulator for song position throughout the queue
			position++;
		});

		//check for a page number that exceeds the number of queue pages
		if (page > queueArr.length) {
			message.channel.send(`There are only ${queueArr.length} page(s) in this queue!`);
		} else {
			const embed = {
				author: {
					name: `Queue for ${message.guild.name}`,
					icon_url: client.user.displayAvatarURL()
				},
				title: `Now Playing: ${serverQueue.songs[0].title}`,
				url: serverQueue.songs[0].url,
				thumbnail: {
					url: serverQueue.songs[0].thumbnail
				},
				color: '#f5db47',
				fields: [
					{
						name: '>>>**Up Next**<<<',
						value:
							queueArr[page - 1] +
							`\n\n**Songs: ${serverQueue.songs.length} || Duration: ${timeStringAudio.convert(
								duration
							)}**`
					}
				],
				footer: {
					text: `Looping Song: ${serverQueue.looping}\nLooping Queue: ${serverQueue.loopingQueue}\nPage: ${page}/${queueArr.length}`
				}
			};
			message.channel.send({ embed: embed });
		}
	}
};
