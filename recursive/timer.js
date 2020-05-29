module.exports = {
	//async function containing a timeout with a callback to execute() --timeout for 1s
	async delay() {
		setTimeout(() => {
			this.execute();
		}, 1 * 1000);
	},

	//calls on functions to decrement timers for each member in the global members Map()
	async execute() {
		members.forEach((member) => {
			if (member.isDeletable()) {
				members.delete(member.userID);
			} else {
				member.decrement();
			}
		});

		//recursive --called every second
		this.delay();
	}
};
