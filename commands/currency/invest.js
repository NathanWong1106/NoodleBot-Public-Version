const Member = require('../../models/member-model');
const investmentConfig = require('../../currency-config/investmentConfig');
const timeString = require('../../util/timeString');
const validNum = require('../../util/validNum');
const memberObj = require('../../objects/memberObj');

module.exports = {
	name: 'invest',
	type: 'currency',

	execute(message, args, client) {
		const userID = message.member.user.id;
		const amountToInvest = parseFloat(args[0]);
		let member = members.get(userID);

		if (!validNum.isValid(message, amountToInvest)) {
			return;
		}

		if (!member) {
			const memberObject = memberObj.create(userID);
			members.set(userID, memberObject);
			member = members.get(userID);
		} else if (member.investmentTime > 0) {
			message.reply(`you can invest again in ${timeString.convert(member.investmentTime)}`);
			return;
		}

		Member.findOne({ userID: userID })
			.then((memberDB) => {
				if (amountToInvest > memberDB.currency) {
					message.reply(
						"you don't have that many noodles on you. Maybe try withdrawing some noodles from the IBN?"
					);
				} else {
					//subtract the original amount from their pocket
					memberDB.currency -= amountToInvest;

					//randomly chooses a multiplier to affect their investment --TODO make different responses based on the multiplier value
					const multiplier = parseFloat((Math.random() * investmentConfig.MULTIMAX).toFixed(1));
					let returnInvest = amountToInvest;
					returnInvest = Math.round(returnInvest * multiplier);
					memberDB.currency += returnInvest;

					memberDB.save();

					const embed = {
						color: '#f5db47',
						author: {
							name: `${memberDB.username}'s Noodle Investment`,
							icon_url: message.member.user.displayAvatarURL()
						},
						title: 'NoodleStan Stock Exchange:',
						fields: [
							{
								name: 'Original Investment:',
								value: `${amountToInvest} noodles`,
								inline: true
							},
							{
								name: 'Return (ROI):',
								value: `${returnInvest} noodles`,
								inline: true
							},
							{
								name: 'Multiplier:',
								value: `x${multiplier}`,
								inline: true
							}
						],
						footer: {
							text: 'By signing up to the IBN, you agree that your soul is now our property. Merci.'
						}
					};

					member.investmentTime = investmentConfig.TIME;
					message.channel.send({ embed: embed });
				}
			})
			.catch((err) => {
				message.reply("you have not joined the noodle game. Use '-work' to join!");
			});
	}
};
