const Member = require('../../models/member-model');
const validNum = require('../../util/validNum');

module.exports = {
	name: 'withdraw',
	type: 'currency',

	execute(message, args, client) {
		const userID = message.member.user.id;
		const amountToWithdraw = parseInt(args[0]);

		if (!validNum.isValid(message, amountToWithdraw)) {
			return;
		}

		Member.findOne({ userID: userID })
			.then((memberDB) => {
				if (amountToWithdraw > memberDB.bank) {
					message.channel.send("You buffoon, you don't even have that many noodles in your account!");
				} else {
					memberDB.bank = memberDB.bank - amountToWithdraw;
					memberDB.currency = memberDB.currency + amountToWithdraw;
					memberDB.save((err) => {
						if (err) {
							console.log(err);
						}
					});
					message.channel.send(
						`${amountToWithdraw} noodles have been taken from your account and given to you!`
					);
				}
			})
			.catch((err) => {
				message.reply("you have not joined the noodle game. Use '-work' to join!");
			});
	}
};
