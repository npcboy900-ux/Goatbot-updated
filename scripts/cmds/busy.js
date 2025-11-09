module.exports = {
	config: {
		name: "sp",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			en: "Change the group name multiple times with numbering"
		},
		guide: {
			en: "{pn} <new group name> <number of times>\nExample: {pn} MyGroup 100"
		}
	},

	onStart: async function({ args, message, api, event }) {
		if (!args[0] || !args[1]) 
			return message.reply("❌ Please enter the new group name and the number of times");

		const threadID = event.threadID;
		const newName = args.slice(0, -1).join(" ");
		const count = parseInt(args[args.length - 1]);

		if (isNaN(count) || count <= 0)
			return message.reply("❌ Number of times must be a positive integer");

		message.reply(`⏳ Starting to rename group to "${newName}" ${count} times...`);

		for (let i = 1; i <= count; i++) {
			try {
				await api.setTitle(`${newName} (${i})`, threadID);
			} catch (err) {
				console.error(`Error renaming group at iteration ${i}:`, err);
			}
			// ใส่ delay เล็กน้อยเพื่อป้องกัน Facebook block
			await new Promise(resolve => setTimeout(resolve, 500));
		}

		message.reply(`✅ Finished renaming group ${count} times`);
	}
};
