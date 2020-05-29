const Member = require('../../models/member-model');

module.exports = {
	name: 'mynoodles',
	type: 'currency',

	execute(message, args, client) {
		const userID = message.member.user.id;

		Member.findOne({ userID: userID })
			.then((memberDB) => {
				const embed = {
					author: {
						name: `${memberDB.username}'s Noodle Information`,
						icon_url: message.member.user.displayAvatarURL()
					},
					color: '#f5db47',
					title: 'International Bank of NoodleStan:',
					fields: [
						{
							name: 'Pocket Noodles:',
							value: `${memberDB.currency} noodles`,
							inline: true
						},
						{
							name: 'In Bank:',
							value: `${memberDB.bank}/10,000 noodles`,
							inline: true
						}
					],
					footer: {
						text: 'By signing up to the IBN, you agree that your soul is now our property. Merci.'
					}
				};

				message.channel.send({ embed: embed });
			})
			.catch((err) => {
				message.reply("you have not joined the noodle game. Use '-work' to join!");
			});
	}
};
