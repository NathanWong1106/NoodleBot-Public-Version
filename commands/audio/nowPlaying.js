module.exports = {
    name: 'np',

    execute(message, args, client){
        const guildID = message.guild.id;
        const serverQueue = queue.get(guildID);

        if(!serverQueue){
            message.channel.send("I'm not in any voice channels! Use '-join' to let me in!");
        } else {
            if(serverQueue.songs.length === 0){
                message.channel.send("No songs are playing at the moment!");
            } else {
                const song = serverQueue.songs[0];
                const embed = {
                   
                    author:{
                        name: 'Now Playing:',
                        icon_url: client.user.displayAvatarURL()
                    },
                    color:'#f5db47',
                    
                    title: song.title,
                    url: song.url,
                    thumbnail: {
                        url: song.thumbnail
                    },
                    fields:[{
                        name: 'Channel:',
                        value: song.channel,
                        inline: true
                    }]
                }

                message.channel.send({embed: embed})
            }
        }
    }
}