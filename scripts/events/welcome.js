const { getTime, drive } = global.utils;
const axios = require("axios");

let createCanvas, loadImage;
let canvasAvailable = false;
try {
	const canvas = require("canvas");
	createCanvas = canvas.createCanvas;
	loadImage = canvas.loadImage;
	canvasAvailable = true;
	console.log("✅ [ยินดีต้อนรับจ้่า] โหลดโมดูล Canvas สำเร็จ - จะสร้างภาพต้อนรับอัตโนมัติ");
} catch (err) {
	console.log("❌ [ยินดีต้อนรับไอ้ควาย] ไม่พบ Canvas - จะใช้ข้อความแทน Error:", err.message);
	canvasAvailable = false;
}

if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

function roundRect(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

async function createWelcomeCard(userName, groupName, memberCount, avatarUrl) {
	if (!canvasAvailable) return null;

	try {
		const canvas = createCanvas(1400, 650);
		const ctx = canvas.getContext("2d");

		roundRect(ctx, 0, 0, 1400, 650, 30);
		ctx.clip();

		const gradient = ctx.createLinearGradient(0, 0, 1400, 650);
		gradient.addColorStop(0, "#0f0c29");
		gradient.addColorStop(0.5, "#302b63");
		gradient.addColorStop(1, "#24243e");
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 1400, 650);

		for (let i = 0; i < 80; i++) {
			const x = Math.random() * 1400;
			const y = Math.random() * 650;
			const radius = Math.random() * 100 + 50;
			const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
			glowGradient.addColorStop(0, `rgba(138, 43, 226, ${Math.random() * 0.15})`);
			glowGradient.addColorStop(1, "rgba(138, 43, 226, 0)");
			ctx.fillStyle = glowGradient;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fill();
		}

		for (let i = 0; i < 120; i++) {
			const x = Math.random() * 1400;
			const y = Math.random() * 650;
			const radius = Math.random() * 2 + 1;
			const starGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
			starGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
			starGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
			ctx.fillStyle = starGradient;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.shadowColor = "rgba(255, 215, 0, 0.5)";
		ctx.shadowBlur = 50;
		roundRect(ctx, 30, 30, 1340, 590, 30);
		ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
		ctx.lineWidth = 4;
		ctx.stroke();
		ctx.shadowBlur = 0;

		roundRect(ctx, 60, 60, 1280, 140, 25);
		const headerGradient = ctx.createLinearGradient(60, 60, 60, 200);
		headerGradient.addColorStop(0, "rgba(255, 215, 0, 0.15)");
		headerGradient.addColorStop(1, "rgba(255, 215, 0, 0.05)");
		ctx.fillStyle = headerGradient;
		ctx.fill();
		ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
		ctx.lineWidth = 2;
		ctx.stroke();

		const titleGradient = ctx.createLinearGradient(0, 100, 0, 160);
		titleGradient.addColorStop(0, "#FFD700");
		titleGradient.addColorStop(0.5, "#FFA500");
		titleGradient.addColorStop(1, "#FFD700");
		ctx.fillStyle = titleGradient;
		ctx.font = "bold 70px Arial";
		ctx.textAlign = "center";
		ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
		ctx.shadowBlur = 35;
		ctx.fillText("ยินดีต้อนรับสู่กลุ่ม!", 700, 150);
		ctx.shadowBlur = 0;

		const avatarSize = 180;
		const avatarX = 700 - avatarSize / 2;
		const avatarY = 240;

		try {
			const avatar = await loadImage(avatarUrl);
			ctx.save();
			ctx.shadowColor = "rgba(255, 215, 0, 0.6)";
			ctx.shadowBlur = 40;
			ctx.beginPath();
			ctx.arc(700, avatarY + avatarSize / 2, avatarSize / 2 + 6, 0, Math.PI * 2);
			ctx.closePath();
			const avatarBorderGrad = ctx.createLinearGradient(0, avatarY, 0, avatarY + avatarSize);
			avatarBorderGrad.addColorStop(0, "#FFD700");
			avatarBorderGrad.addColorStop(1, "#FFA500");
			ctx.strokeStyle = avatarBorderGrad;
			ctx.lineWidth = 6;
			ctx.stroke();
			ctx.shadowBlur = 0;

			ctx.beginPath();
			ctx.arc(700, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
			ctx.restore();
		} catch (err) {
			console.error("โหลดรูปโปรไฟล์ล้มเหลว:", err);
		}

		const nameGradient = ctx.createLinearGradient(400, 460, 1000, 460);
		nameGradient.addColorStop(0, "#FFD700");
		nameGradient.addColorStop(0.5, "#FFA500");
		nameGradient.addColorStop(1, "#FFD700");
		ctx.fillStyle = nameGradient;
		ctx.font = "bold 62px Arial";
		ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
		ctx.shadowBlur = 30;
		ctx.textAlign = "center";
		const nameText = userName.length > 24 ? userName.substring(0, 21) + "..." : userName;
		ctx.fillText(nameText, 700, 470);
		ctx.shadowBlur = 0;

		ctx.font = "38px Arial";
		ctx.fillStyle = "#E0E0E0";
		const groupText = groupName.length > 38 ? groupName.substring(0, 35) + "..." : groupName;
		ctx.fillText(groupText, 700, 520);

		roundRect(ctx, 320, 550, 760, 55, 15);
		const infoGradient = ctx.createLinearGradient(320, 550, 320, 605);
		infoGradient.addColorStop(0, "rgba(255, 215, 0, 0.15)");
		infoGradient.addColorStop(1, "rgba(255, 215, 0, 0.05)");
		ctx.fillStyle = infoGradient;
		ctx.fill();
		ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.font = "bold 30px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(`สมาชิกทั้งหมด ${memberCount} คน - ขอให้สนุกนะ!`, 700, 587);

		ctx.font = "italic 20px Arial";
		ctx.fillStyle = "rgba(255, 215, 0, 0.6)";
		ctx.fillText("สร้างโดย NeoKEX", 700, 633);

		const buffer = canvas.toBuffer();
		const tempPath = `./tmp/welcome_${Date.now()}.png`;
		const fs = require("fs-extra");
		await fs.outputFile(tempPath, buffer);
		return fs.createReadStream(tempPath);
	} catch (error) {
		console.error("เกิดข้อผิดพลาดในการสร้างภาพต้อนรับ:", error);
		throw error;
	}
}

module.exports = {
	config: {
		name: "welcome",
		version: "3.0.0",
		author: "NTKhang / แปลโดย NeoKEX (TH)",
		category: "เหตุการณ์"
	},

	langs: {
		th: {
			session1: "ตอนเช้า",
			session2: "ตอนเที่ยง",
			session3: "ตอนบ่าย",
			session4: "ตอนเย็น",
			welcomeMessage: "ขอบคุณที่เชิญฉันเข้ากลุ่ม!\nคำนำหน้าคำสั่งบอทคือ: %1\nพิมพ์ %1help เพื่อดูคำสั่งทั้งหมด",
			multiple1: "คุณ",
			multiple2: "ทุกคน",
			defaultWelcomeMessage: "สวัสดีตัวตลก {userName}\nยินดีต้อนรับ{multiple}เข้าสู่กลุ่ม {boxName}\nขอให้มีความสุขใน{session}นี้ 🤮"
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;

				if (dataAddedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send(getLang("welcomeMessage", prefix));
				}

				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;

					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [], mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1) multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some(item => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}

					if (userName.length == 0) return;
					let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;

					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};

					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
						.replace(/\{session\}/g,
							hours <= 10 ? getLang("session1") :
							hours <= 12 ? getLang("session2") :
							hours <= 18 ? getLang("session3") : getLang("session4")
						);

					form.body = welcomeMessage;

					try {
						let memberCount = 0;
						try {
							const threadInfo = await api.getThreadInfo(threadID);
							memberCount = threadInfo.participantIDs ? threadInfo.participantIDs.length : 0;
						} catch (e) { memberCount = 0; }

						const firstUserID = dataAddedParticipants[0]?.userFbId;
						const avatarUrl = firstUserID ? `https://graph.facebook.com/${firstUserID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662` : null;

						const welcomeCard = await createWelcomeCard(userName.join(", "), threadName, memberCount, avatarUrl);
						const attachments = [];

						if (welcomeCard) attachments.push(welcomeCard);

						if (threadData.data.welcomeAttachment) {
							const files = threadData.data.welcomeAttachment;
							const additionalAttachments = files.reduce((acc, file) => {
								acc.push(drive.getFile(file, "stream"));
								return acc;
							}, []);
							attachments.push(...(await Promise.allSettled(additionalAttachments))
								.filter(({ status }) => status == "fulfilled")
								.map(({ value }) => value));
						}

						if (attachments.length > 0) form.attachment = attachments;

					} catch (err) {
						console.error("เกิดข้อผิดพลาดในการสร้างภาพต้อนรับ:", err);
					}

					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
