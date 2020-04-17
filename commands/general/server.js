module.exports = {
    name:'server',
    description:'returns some basic server information to the user in an embed message',
    execute(message, args, client){
        const guild = message.guild;

        //embed object
        const embed = {
            title: 'Server Info',
            description: `Here is some basic information about ${guild.name}`,
            color:'#f5db47',
            author: {
                name: guild.name,
                icon_url: message.author.avatarURL
            },
            fields: [{
                    name: 'Members',
                    value: `${guild.memberCount} members`,
                    inline: true
                },
                {
                    name: 'Owner',
                    value: guild.owner.user.username,
                    inline: true
                },
                {
                    name: 'Region',
                    value: guild.region,
                    inline:true
                }
            ]
        }

        message.channel.send({embed: embed})
    }
}