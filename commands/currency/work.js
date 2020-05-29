const Member = require('../../models/member-model');
const memberCreate = require('../../data/currency/memberCreate');
const workConfig = require('../../currency-config/workConfig');
const workResponses = require('../../responses/currency/workResponses');
const timeString = require('../../util/timeString');
const memberObj = require('../../objects/memberObj');

module.exports = {
	name: 'work',
	type: 'currency',

	execute(message, args, client) {
		const userID = message.member.user.id;

		//get the member and check if they are available for work
		const member = members.get(userID);
		if (member) {
			if (member.workTime > 0) {
				message.reply(`you can work again in ${timeString.convert(member.workTime)}.`);
				return;
			}
		}

		//returns random int from 1-4
		const randomInt = Math.floor(Math.random() * 4) + 1;

		let workType = 0;

		switch (randomInt) {
			case 1:
				workType = workConfig.work.AMAZINGWORK;
				break;
			case 2:
				workType = workConfig.work.GOODWORK;
				break;
			case 3:
				workType = workConfig.work.MEDIUMWORK;
				break;
			case 4:
				workType = workConfig.work.BADWORK;
				break;
		}

		Member.findOne({ userID: userID })
			.then((memberDB) => {
				if (!members.get(userID)) {
					const memberObject = memberObj.create(userID);

					members.set(userID, memberObject);
				}

				members.get(userID).workTime = workConfig.work.TIME;
				memberDB.currency += workType;
				memberDB.save();

				message.channel.send(
					`${message.member.user.username} ${workResponses.getResponse(workType)} ${workType} noodles!`
				);
			})
			.catch((err) => {
				memberCreate.execute(message.member.user).then(() => {
					const memberObject = memberObj.create(userID);

					members.set(userID, memberObject);
					members.get(userID).workTime = workConfig.work.TIME;

					Member.findOne({ userID: userID })
						.then((memberDB) => {
							memberDB.currency += workType;
							memberDB
								.save()
								.then(() => {
									message.channel.send(
										`${message.member.user.username} ${workResponses.getResponse(
											workType
										)} ${workType} noodles!`
									);
								})
								.catch((err) => console.log(err));
						})
						.catch((err) => console.log(err));
				});
			});
	}
};
