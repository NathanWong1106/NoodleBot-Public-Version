const Member = require('../../models/member-model');

module.exports = {
    async execute(user){

        const MemberCreate = new Member({
            userID: user.id,
            username: user.username,
            currency: 0,
            bank: 0,
            items: []
        })

        await MemberCreate.save()
        .catch(err => {
            console.log(err);
        })

    }
}
