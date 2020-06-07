const ytdl = require('ytdl-core');
const nextSong = require('../../recursive/nextSong');
const timeStringAudio = require('../../util/timeStringAudio');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const join = require('./join');

module.exports = {
	name: 'play',
	type: 'audio',

	async execute(message, args, client) {
		//Value of the guild in the global queue Map()
		const serverQueueCheck = queue.get(message.guild.id);

		//If the guild has no active slot in the Map()
		if (!serverQueueCheck) {
			try {
				await join.execute(message, args, client);
			} catch (err) {
				return;
			}
		}

		this.trySearch(message, args, client);
	},

	async trySearch(message, args, client) {
		serverQueue = queue.get(message.guild.id);
		//voice channel the user is in
		const voiceChannel = message.member.voice.channel;

		//search terms
		const search = message.content.slice(this.name.length + 2);

		const urlSearch = 'https://youtube.com/';
		const playlistSearch = 'https://youtube.com/playlist';

		if (!voiceChannel) {
			//If the user is not in a voice channel
			message.reply('you must be in a voice channel to use this command');
		} else if (voiceChannel.id !== serverQueue.connection.channel.id) {
			message.reply('you must be in the same channel as me you doofus');
		} else {
			//If the user has not provided a link to youtube
			if (!args[0]) {
				message.reply('Please supply a valid url from Youtube');
			} else {
				//Decide what kind of link/search has been given
				message.channel.send('Searching for: `' + search + '`');
				if (search.startsWith(playlistSearch) && args.length === 1) {
					try {
						await this.youtubePlaylist(message, search);
					} catch (error) {
						message.channel.send('Youtube Playlist could not be enqueued :(');
					}
				} else if (search.startsWith(urlSearch) && args.length === 1) {
					try {
						await this.youtubeURL(message, search);
					} catch (error) {
						message.channel.send('Youtube URL could not be enqueued :(');
					}
				} else {
					try {
						await this.youtubeSearch(message, search);
					} catch (error) {
						message.channel.send('Youtube search could not be enqueued :(');
					}
				}
			}
		}
	},

	//Retrieves info from a youtube video URL
	async youtubeURL(message, search) {
		await ytdl.getBasicInfo(search).then((songInfo) => {
			//pushes the songs into the queue to play
			const song = this.buildSong(songInfo, message);
			serverQueue.songs.push(song);
			this.constructEmbed(message, song);
		});
	},

	//Retrieves info from a youtube playlist URL -- then retrieves info and enqueues each video
	async youtubePlaylist(message, search) {
		await ytpl(search).then((playlistInfo) => {
			var duration = 0;
			var counter = 0;
			var toAdd = [];
			for (var i = 0; i < playlistInfo.items.length; i++) {
				ytdl.getInfo(playlistInfo.items[i].url).then((songInfo) => {
					const song = this.buildSong(songInfo, message);
					toAdd.push(song);
					duration += parseInt(songInfo.length_seconds);
					counter++;

					if (counter === playlistInfo.items.length) {
						serverQueue.songs.push(...toAdd);
						this.constructEmbedPlaylist(message, playlistInfo, duration);
					}
				});
			}
		});
	},

	//Retrieves the first search result from youtube and retrieves basic info of the result
	async youtubeSearch(message, search) {
		await ytsr(search, { limit: 1 }).then((songInfo) => {
			ytdl.getBasicInfo(songInfo.items[0].link).then((songInfo) => {
				//pushes the songs into the queue to play
				const song = this.buildSong(songInfo, message);
				serverQueue.songs.push(song);
				this.constructEmbed(message, song);
			});
		});
	},

	//builds a song object to be put into serverQueue
	buildSong(songInfo, message) {
		//create a song object to be pushed into the song queue
		const song = {
			title: songInfo.title,
			url: songInfo.video_url,
			thumbnail: `https://img.youtube.com/vi/${songInfo.video_id}/hqdefault.jpg`,
			channel: songInfo.author.name,
			time: parseInt(songInfo.length_seconds),
			requestedBy: message.author.username
		};
		return song;
	},

	//constructs the embed message used for video URL's and searches
	constructEmbed(message, song) {
		//embed message to be displayed
		const embed = {
			title: song.title,
			url: song.url,
			color: '#f5db47',
			author: {
				name: 'Added to Queue'
			},
			thumbnail: {
				url: song.thumbnail
			},
			fields: [
				{
					name: 'Position in Queue:',
					value: serverQueue.songs.indexOf(song),
					inline: true
				},
				{
					name: 'Channel:',
					value: song.channel,
					inline: true
				},
				{
					name: 'Length',
					value: timeStringAudio.convert(song.time),
					inline: true
				}
			]
		};

		this.sendMessage(message, embed);
	},

	//constructs the embed message for youtube playlist URL's
	constructEmbedPlaylist(message, playlistInfo, duration) {
		const embed = {
			title: playlistInfo.title,
			url: playlistInfo.url,
			color: '#f5db47',
			author: {
				name: 'Added Playlist to Queue'
			},
			fields: [
				{
					name: 'Enqueued:',
					value: `${playlistInfo.total_items}`,
					inline: true
				},
				{
					name: 'Channel:',
					value: playlistInfo.author.name,
					inline: true
				},
				{
					name: 'Duration:',
					value: timeStringAudio.convert(duration),
					inline: true
				}
			]
		};

		this.sendMessage(message, embed);
	},

	//sends the embed message and executes the nextSong function if needed
	sendMessage(message, embed) {
		//Only executes the nextSong function (recursive) if there is no audio currently playing
		if (!serverQueue.playing) {
			try {
				// The next song function is recursive --it will call itself until there are no more songs left in the songs[] array
				nextSong.execute(message.guild);
			} catch (err) {
				console.log(err);
			}
		}

		message.channel.send({ embed: embed });
	}
};
