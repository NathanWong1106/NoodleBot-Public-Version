module.exports = {
	name: 'bound',
	type: 'moderation-non-essential',

	execute(message, args, client) {
		const binded = () => {
			const getChannels = () => {
				let list = '';
				let counter = 0;

				boundChannels.get(message.guild.id).binded.forEach((channel) => {
					counter++;
					list += '`' + counter + '.` ' + channel.channelName + '\n';
				});

				return list;
			};
			if (boundChannels.get(message.guild.id).binded.length === 0) {
				return {
					name: 'I am unbound from my shackles of pain and suffering:',
					value: 'This server has not binded me to any channels!'
				};
			} else {
				return {
					name: 'Bound to Channels:',
					value: `${getChannels()}`
				};
			}
		};

		const embed = {
			color: '#f5db47',
			author: {
				name: `Bound Channels in ${message.guild.name}`,
				icon_url: message.guild.iconURL()
			},
			fields: [ binded() ],
			footer: {
				text: "If you can modify channels, use 'bind' to bind me to a channel!"
			}
		};

		message.channel.send({ embed: embed });
	}
};
