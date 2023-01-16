require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios").default;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
	// ctx.reply(
	// 	"مرحبا بك في بوت البحث عن المستمسكات الضائعة" +
	// 		"\n" +
	// 		"يرجى ادخال الاسم الثلاثي لصاحب المستمسك الضائع"
	// )
	ctx.reply("اختر", {
		reply_markup: {
			inline_keyboard: [
				/* Inline buttons. 2 side-by-side */
				[
					{ text: "بحث عن مستمسك", callback_data: "btn-1" },
					{ text: "اضافة مستمسك", callback_data: "btn-2" },
				],

				/* Also, we can have URL buttons. */
				// [{ text: "Open in browser", url: "telegraf.js.org" }],
			],
		},
	})
);

bot.on("callback_query", (ctx) => {
	if (ctx.callbackQuery.data === "btn-1") {
		ctx.reply("ادخل الاسم الثلاثي لصاحب المستمسك");
	} else {
		ctx.reply("باجر اسويها");
	}
	// console.log("callback");
	// console.log(ctx.callbackQuery);
	// Using context shortcut
	ctx.answerCbQuery();
});

bot.launch();

bot.command("upload", async (ctx) => {
	await ctx.reply("upload image");
});

bot.on("text", (ctx) => {
	axios
		.get(
			`http://192.168.0.132:1337/api/documents?filters[description][$eq]=${ctx.message.text}`
		)
		.then(function (response) {
			let res = response.data.data;
			console.log(response.data.data.length);
			let results = [];
			res.forEach((element) => {
				results.push(
					element.attributes.description +
						"\n" +
						"-------------------------" +
						"\n" +
						element.attributes.phone +
						"-------------------------" +
						"\n"
				);
			});
			console.log(results.length);
			if (results.length > 0) {
				ctx.reply(
					"تم العثور على هذه النتيجة" +
						"\n" +
						"\n" +
						`${results.toString().replaceAll(",", "")}`
				);
			} else {
				ctx.reply("لم يتم العثور على نتائج");
			}
		})
		.catch(function (error) {
			console.log(error);
		});
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
