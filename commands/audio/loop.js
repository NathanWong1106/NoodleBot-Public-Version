const ytdl = require('ytdl-core');

module.exports = {
    name: 'loop',

    execute(message, args, client){
        const voiceChannel = message.member.voice.channel;
        const serverQueue = queue.get(message.guild.id);

        if(!voiceChannel){
            message.reply("you need to be in a voice channel!");
            return;
        }
        else if (!serverQueue){
            message.reply("I'm not in your voice channel. Use -join to let me in!")
            return;
        }
        else if (voiceChannel.id !== serverQueue.connection.channel.id){
            message.channel.send("You must be in the same channel as me to loop!");
        }
        else if (serverQueue.songs.length === 0){
            message.channel.send("There are no songs to loop right now!")
        }
        else {
            if(serverQueue.looping){
                serverQueue.looping = false;
                message.channel.send("Stopped looping!")
            } else {
                serverQueue.looping = true
                message.channel.send(`Now looping: ${serverQueue.songs[0].title}`)
            }
        }
    }
}