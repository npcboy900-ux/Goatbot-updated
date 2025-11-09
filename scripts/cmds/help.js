const fs = require("fs-extra");
const path = require("path");
const https = require("https");

module.exports = {
	config: {
		name: "help",
		aliases: ["menu", "commands"],
		version: "4.8",
		author: "NEVELOP SIZE56",
		shortDescription: "แสดงคำสั่งทั้งหมดที่มีอยู่",
		longDescription: "แสดงรายการคำสั่งทั้งหมดอย่างเป็นหมวดหมู่ในรูปแบบที่สวยงามและพรีเมียม",
		category: "system",
		guide: "{pn}help [ชื่อคำสั่ง]"
	},

	onStart: async function ({ message, args, prefix }) {
		const allCommands = global.GoatBot.commands;
		const categories = {};

		const emojiMap = {
			ai: "➥", "ai-image": "➥", group: "➥", system: "➥",
			fun: "➥", owner: "➥", config: "➥", economy: "➥",
			media: "➥", "18+": "➥", tools: "➥", utility: "➥",
			info: "➥", image: "➥", game: "➥", admin: "➥",
			rank: "➥", boxchat: "➥", others: "➥"
		};

		const cleanCategoryName = (text) => {
			if (!text) return "others";
			return text
				.normalize("NFKD")
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase();
		};

		// จัดกลุ่มคำสั่งตามหมวดหมู่
		for (const [name, cmd] of allCommands) {
			const cat = cleanCategoryName(cmd.config.category);
			if (!categories[cat]) categories[cat] = [];
			categories[cat].push(cmd.config.name);
		}

		// ลิงก์ GIF
		const gifURLs = [
			"https://i.imgur.com/ejqdK51.gif",
			"https://i.imgur.com/ltIztKe.gif",
			"https://i.imgur.com/5oqrQ0i.gif",
			"https://i.imgur.com/qf2aZH8.gif",
			"https://i.imgur.com/3QzYyye.gif",
			"https://i.imgur.com/ffxzucB.gif",
			"https://i.imgur.com/3QSsSzA.gif",
			"https://i.imgur.com/Ih819LH.gif"
		];

		// เลือก GIF แบบสุ่ม
		const randomGifURL = gifURLs[Math.floor(Math.random() * gifURLs.length)];
		const gifFolder = path.join(__dirname, "cache");
		if (!fs.existsSync(gifFolder)) fs.mkdirSync(gifFolder, { recursive: true });
		const gifName = path.basename(randomGifURL);
		const gifPath = path.join(gifFolder, gifName);

		// ดาวน์โหลดถ้ายังไม่มี
		if (!fs.existsSync(gifPath)) {
			await downloadGif(randomGifURL, gifPath);
		}

		// แสดงรายละเอียดคำสั่งเดียว
		if (args[0]) {
			const query = args[0].toLowerCase();
			const cmd =
				allCommands.get(query) ||
				[...allCommands.values()].find((c) => (c.config.aliases || []).includes(query));
			if (!cmd) return message.reply(`❌ ไม่พบคำสั่ง "${query}"`);

			const {
				name,
				version,
				author,
				guide,
				category,
				shortDescription,
				longDescription,
				aliases
			} = cmd.config;

			const desc =
				typeof longDescription === "string"
					? longDescription
					: longDescription?.th || shortDescription?.th || shortDescription || "ไม่มีคำอธิบาย";

			const usage =
				typeof guide === "string"
					? guide.replace(/{pn}/g, prefix)
					: guide?.th?.replace(/{pn}/g, prefix) || `${prefix}${name}`;

			return message.reply({
				body:
					`☠️ 𝗪𝗜𝗗𝗘𝗧 𝗞𝗔𝗠𝗦𝗔𝗡𝗚 ☠️\n\n` +
					`➥ ชื่อคำสั่ง: ${name}\n` +
					`➥ หมวดหมู่: ${category || "ไม่ระบุ"}\n` +
					`➥ รายละเอียด: ${desc}\n` +
					`➥ คำสั่งย่อ: ${aliases?.length ? aliases.join(", ") : "ไม่มี"}\n` +
					`➥ วิธีใช้: ${usage}\n` +
					`➥ ผู้สร้าง: ${author || "ไม่ทราบ"}\n` +
					`➥ เวอร์ชัน: ${version || "1.0"}`,
				attachment: fs.createReadStream(gifPath)
			});
		}

		// แสดงรายการคำสั่งทั้งหมด
		const formatCommands = (cmds) =>
			cmds.sort().map((cmd) => `│ ∘ ${cmd}`).join("\n");

		let msg = `╭━ 🎯 𝑳𝑰𝑺𝑻 𝑲𝑨𝑴𝑺𝑨𝗡𝗚 ━╮\n`;
		const sortedCategories = Object.keys(categories).sort();
		for (const cat of sortedCategories) {
			const emoji = emojiMap[cat] || "➥";
			msg += `\n${emoji} ${cat.toUpperCase()}\n`;
			msg += `${formatCommands(categories[cat])}\n`;
		}
		msg += `\n╰➤ ใช้: ${prefix}help [ชื่อคำสั่ง] เพื่อดูรายละเอียดเพิ่มเติม`;

		return message.reply({
			body: msg,
			attachment: fs.createReadStream(gifPath)
		});
	}
};

// ฟังก์ชันช่วยดาวน์โหลด GIF
function downloadGif(url, dest) {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(dest);
		https.get(url, (res) => {
			if (res.statusCode !== 200) {
				fs.unlink(dest, () => {});
				return reject(new Error(`ดาวน์โหลดล้มเหลว '${url}' (${res.statusCode})`));
			}
			res.pipe(file);
			file.on("finish", () => file.close(resolve));
		}).on("error", (err) => {
			fs.unlink(dest, () => {});
			reject(err);
		});
	});
}
