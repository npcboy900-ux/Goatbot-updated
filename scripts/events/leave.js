const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
		version: "1.5",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		th: {
			defaultLeaveMessage: "ตัวตลก({userName}) ออกกลุ่มแล้วจ้า"
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType == "log:unsubscribe")
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				if (!threadData.settings.sendLeaveMessage) return;

				const { leftParticipantFbId } = event.logMessageData;
				if (leftParticipantFbId == api.getCurrentUserID()) return;

				const userName = await usersData.getName(leftParticipantFbId);

				// สร้างข้อความออกกลุ่ม
				let leaveMessage = getLang("defaultLeaveMessage", "th").replace(/\{userName\}/g, userName);

				const form = {
					body: leaveMessage
				};

				// แนบไฟล์ถ้ามี
				if (threadData.data.leaveAttachment) {
					const files = threadData.data.leaveAttachment;
					const attachments = files.map(file => drive.getFile(file, "stream"));
					form.attachment = (await Promise.allSettled(attachments))
						.filter(({ status }) => status === "fulfilled")
						.map(({ value }) => value);
				}

				message.send(form);
			};
	}
};
