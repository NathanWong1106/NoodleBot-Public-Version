const Guild = require('../../models/guild-model');
const commandCheck = require('../../util/validAudioCommand');
const nextSong = require('../../recursive/nextSong');
const join = require('./join');
const timeStringAudio = require('../../util/timeStringAudio');

module.exports = {
	name: 'enqueue',
	type: 'audio',

	async execute(message, args, client) {
		const pName = message.content.slice(this.name.length + 2).toLowerCase(); //+2 accounts for PREFIX and WHITESPACE
		serverQueue = queue.get(message.guild.id);

		//check for a valid command
		if (!serverQueue) {
			try {
				await join.execute(message, args, client);
			} catch (err) {
				return;
			}
		} else if (!commandCheck.isValid(message)) {
			return;
		} else if (!pName) {
			message.channel.send("Use 'enqueue [playlist name]' to add a playlist to the queue!");
			return;
		}

		this.enqueuePlaylist(message, args, client);
	},

	enqueuePlaylist(message, args, client) {
		const pName = message.content.slice(this.name.length + 2).toLowerCase(); //+2 accounts for PREFIX and WHITESPACE
		serverQueue = queue.get(message.guild.id);

		//Get the guild DB
		Guild.findOne({ guildID: message.guild.id })
			.then((guildDB) => {
				//find the playlist by name in the server's DB and save it as a constant
				const playlist = guildDB.playlists.find((element) => element.name === pName);

				//if the playlist exists
				if (playlist) {
					//concat the two arrays together
					serverQueue.songs = [ ...serverQueue.songs, ...playlist.songs ];

					//if the queue is not playing, make it start
					if (!serverQueue.playing) {
						nextSong.execute(message.guild);
					}

					message.channel.send({ embed: this.constructEmbed(playlist) });
				} else {
					message.channel.send('No playlists with the name `' + pName + '` were found in this server!');
				}
			})
			.catch((err) => {
				console.log(err);
				message.channel.send('A problem occurred. The playlist could not be added to the queue');
			});
	},

	//constructs the embed message for youtube playlist URL's
	constructEmbed(playlist) {
		var duration = 0;

		playlist.songs.forEach((song) => {
			duration += song.time;
		});

		const embed = {
			author: 'Enqueued',
			title: playlist.name,
			color: '#f5db47',
			author: {
				name: 'Added Playlist to Queue'
			},
			thumbnail: {
				url: playlist.songs[0].thumbnail
			},
			fields: [
				{
					name: 'Enqueued:',
					value: `${playlist.songs.length}`,
					inline: true
				},
				{
					name: 'Duration:',
					value: timeStringAudio.convert(duration),
					inline: true
				}
			]
		};

		return embed;
	}
};
