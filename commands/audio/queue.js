module.exports = {
    name: 'queue',

    execute(message, args, client){
        serverQueue = queue.get(message.guild.id);

        if(!serverQueue){
            message.channel.send("I'm not in any voice channels in this server. Type !join to let me in!");
            return;
        }
        else{
            if(serverQueue.songs.length === 0){
                message.channel.send("No songs are playing at the moment.")
                return;
            }
            else if (serverQueue.songs.length === 1){
                const embed = {
                    title: 'Queue:',
                    description: `Now Playing: ${serverQueue.songs[0].title}`
                }

                message.channel.send({embed: embed});
            }
            else {
                
                const songArr = serverQueue.songs.slice(1);
                let songNameArr = [];
                let position = 1;
                songArr.forEach(song => {songNameArr.push("`"+ position +")` "+ song.title + "\n"); position++});

                const embed = {
                    author:{
                        name: `Queue for ${message.guild.name}`,
                        icon_url: client.user.displayAvatarURL()
                    },
                    title: `Now Playing: ${serverQueue.songs[0].title}`,
                    color:'#f5db47',
                    fields: [{
                        name: '>>>**Up Next**<<<',
                        value: songNameArr
                    }]
                }

                message.channel.send({embed: embed});
            }
        }
    }
}