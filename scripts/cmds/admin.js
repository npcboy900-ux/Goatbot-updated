const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		version: "1.6",
		author: "NEVELOP SIZE56",
		countDown: 5,
		role: 2,
		description: {
			th: "เพิ่ม ลบ หรือแก้ไขสิทธิ์แอดมินของบอท",
			en: "Add, remove, or edit admin role of the bot"
		},
		category: "box chat",
		guide: {
			th:
				'   {pn} [add | -a] <uid | @แท็ก>: เพิ่มสิทธิ์แอดมินให้ผู้ใช้' +
				'\n   {pn} [remove | -r] <uid | @แท็ก>: ลบสิทธิ์แอดมินของผู้ใช้' +
				'\n   {pn} [list | -l]: แสดงรายชื่อผู้ดูแลทั้งหมด',
			en:
				'   {pn} [add | -a] <uid | @tag>: Add admin role for user' +
				'\n   {pn} [remove | -r] <uid | @tag>: Remove admin role of user' +
				'\n   {pn} [list | -l]: List all admins'
		}
	},

	langs: {
		th: {
			added: "✅ | เพิ่มสิทธิ์แอดมินให้กับ %1 ผู้ใช้แล้ว:\n%2",
			alreadyAdmin: "\n⚠️ | %1 ผู้ใช้มีสิทธิ์แอดมินอยู่แล้ว:\n%2",
			missingIdAdd: "⚠️ | โปรดกรอก ID หรือแท็กผู้ใช้ที่ต้องการเพิ่มสิทธิ์แอดมิน",
			removed: "✅ | ลบสิทธิ์แอดมินของ %1 ผู้ใช้แล้ว:\n%2",
			notAdmin: "⚠️ | %1 ผู้ใช้นี้ไม่มีสิทธิ์แอดมิน:\n%2",
			missingIdRemove: "⚠️ | โปรดกรอก ID หรือแท็กผู้ใช้ที่ต้องการลบสิทธิ์แอดมิน",
			listAdmin: "👑 | รายชื่อผู้ดูแลระบบทั้งหมด:\n%1"
		},
		en: {
			added: "✅ | Added admin role for %1 users:\n%2",
			alreadyAdmin: "\n⚠️ | %1 users already have admin role:\n%2",
			missingIdAdd: "⚠️ | Please enter ID or tag user to add admin role",
			removed: "✅ | Removed admin role of %1 users:\n%2",
			notAdmin: "⚠️ | %1 users don't have admin role:\n%2",
			missingIdRemove: "⚠️ | Please enter ID or tag user to remove admin role",
			listAdmin: "👑 | List of admins:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));

					const notAdminIds = [];
					const adminIds = [];

					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid =>
						usersData.getName(uid).then(name => ({ uid, name }))
					));

					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "") +
						(adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				} else return message.reply(getLang("missingIdAdd"));
			}

			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));

					const notAdminIds = [];
					const adminIds = [];

					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					for (const uid of adminIds)
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);

					const getNames = await Promise.all(adminIds.map(uid =>
						usersData.getName(uid).then(name => ({ uid, name }))
					));

					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

					return message.reply(
						(adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "") +
						(notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				} else return message.reply(getLang("missingIdRemove"));
			}

			case "list":
			case "-l": {
				const getNames = await Promise.all(config.adminBot.map(uid =>
					usersData.getName(uid).then(name => ({ uid, name }))
				));
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}

			default:
				return message.SyntaxError();
		}
	}
};
