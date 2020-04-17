const ytdl = require('ytdl-core');
const nextSong = require('../../recursive/nextSong');
const search = require('youtube-search');
const keys = require('../../config/keys');
const opts = {
    maxResults: 1,
    key: keys.youtube_api_key,
    type: 'video'
}

module.exports = {
    name: 'play',

    async execute(message, args, client){
        
        //voice channel the user is in
        const voiceChannel = message.member.voice.channel;
        
        //Value of the guild in the global queue Map()
        const serverQueue = queue.get(message.guild.id);

        //If the guild has no active slot in the Map()
        if(!serverQueue){
            message.reply("I'm not in your voice channel. Use !join to let me in!");
            return;
        } 

        //If the user is not in a voice channel
        else if (!voiceChannel){
            message.reply("you must be in a voice channel to use this command");
        }
        else if (voiceChannel.id !== serverQueue.connection.channel.id){
            message.reply("you must be in the same channel as me you doofus");
        }
        else {

            //If the user has not provided a link to youtube
            if(!args[0]){
                message.reply("Please supply a valid url from Youtube");
            } else {

                //Gets info about the video (url, title, etc)
                await ytdl.getInfo(args[0])
                .then(songInfo => {
                    //create a song object to be pushed into the song queue
                    const song = {
                        title: songInfo.title,
                        url: songInfo.video_url,
                        thumbnail: `https://img.youtube.com/vi/${songInfo.video_id}/default.jpg`,
                        channel: songInfo.author.name
                    };

                    //pushes the songs into the queue to play
                    serverQueue.songs.push(song);

                    //embed message to be displayed
                    const embed = {
                        title: song.title,
                        url: song.url,
                        color:'#f5db47',
                        author:{
                            name: 'Added to Queue'
                        },
                        thumbnail:{
                            url: song.thumbnail
                        },
                        fields: [{
                            name: 'Position in Queue:',
                            value: serverQueue.songs.indexOf(song) + 1,
                            inline: true
                        },
                        {
                            name: 'Channel:',
                            value: song.channel,
                            inline: true
                        }]
                    }
                    //Only executes the nextSong function (recursive) if there is no audio currently playing
                    if(!serverQueue.playing){
                        try{
                            // The next song function is recursive --it will call itself until there are no more songs left in the songs[] array
                            nextSong.execute(message.guild);
                        } catch (err){
                            console.log(err);
                        }
                        message.channel.send({embed: embed});
                    } else {
                        message.channel.send({embed: embed});
                    }
                })

                //If the arguments where not a link then try searching on youtube
                .catch(err => {
                    //if the first arg isn't a link, then prepare the query to youtube
                    let query = '';

                    args.forEach(word => {
                        query += word + ' ';
                    })
                    console.log('youtube search');

                    //searches youtube (query, options) --returns promise
                    search(query, opts)
                    .then(songInfoObj => {

                        const songInfo = songInfoObj.results[0];
                        const song = {
                            title: songInfo.title,
                            url: songInfo.link,
                            thumbnail: `https://img.youtube.com/vi/${songInfo.id}/default.jpg`,
                            channel: songInfo.channelTitle
                        };  
    
                        //pushes the songs into the queue to play
                        serverQueue.songs.push(song);

                        //embed message to be displayed
                        const embed = {
                            title: song.title,
                            url: song.url,
                            color:'#f5db47',
                            author:{
                                name: 'Added to Queue',
                                icon_url: client.user.displayAvatarURL()
                            },
                            thumbnail:{
                                url: song.thumbnail
                            },
                            fields: [{
                                name: 'Position in Queue:',
                                value: serverQueue.songs.indexOf(song) + 1,
                                inline: true
                            },
                            {
                                name: 'Channel:',
                                value: song.channel,
                                inline: true
                            }],
                            footer: {
                                text: 'Please use Youtube searches sparingly. Youtube API V3 only allows around 100 searches a day.'
                            }
                        }
    
                        //Only executes the nextSong function (recursive) if there is no audio currently playing
                        if(!serverQueue.playing){
                            try{
                                // The next song function is recursive --it will call itself until there are no more songs left in the songs[] array
                                nextSong.execute(message.guild);
                            } catch (err){
                                console.log(err);
                            }

                            message.channel.send({embed: embed});
                        } else {
                            message.channel.send({embed: embed});
                        }
                    })

                    //catches a failed search or any searches made over the daily limit
                    .catch(err => {
                        console.log(err);
                        message.channel.send('No results where found for ', query);
                        return;
                    })

                });

            }

        }

    }
}