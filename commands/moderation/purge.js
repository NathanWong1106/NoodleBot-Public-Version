module.exports = {
    name: 'purge',
    description: 'clears the specified amount of messages from the channel',
    execute(message, args){
        if(!message.member.hasPermission('MANAGE_CHANNELS')){
            message.reply('You must be able to manage channels in order to use this command');
        }else{
            if (!args[0]){
                message.reply("Perhaps you typed the command wrong, it's !purge [count]")
            } else {
                message.channel.bulkDelete(args[0]); 
                message.channel.send(`purged ${args[0]} messages in this channel`);
            }
            
        }
        
    }
    
}