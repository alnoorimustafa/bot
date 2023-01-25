require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios").default;
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
	ctx.reply("اختر", {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: "بحث عن مستمسك", callback_data: "btn-1" },
					{
						text: "اضافة مستمسك",
						callback_data: "btn-2",
						url: `${process.env.URL}/index.html`,
					},
				],
			],
		},
	})
);

bot.on("callback_query", async (ctx) => {
	if (ctx.callbackQuery.data === "yes") {
		ctx.reply(`تواصل مع الادمن \n \n ${process.env.ADMIN}`);
		ctx.answerCbQuery();
	}
	if (ctx.callbackQuery.data === "btn-1") {
		ctx.reply("ادخل الاسم الثلاثي لصاحب المستمسك");
		ctx.answerCbQuery();
	}
	if (ctx.callbackQuery.data === "no") {
		ctx.reply("/start");
		ctx.answerCbQuery();
	}
});

bot.launch();

bot.command("upload", async (ctx) => {
	await ctx.reply("upload image");
});

bot.on("text", (ctx) => {
	axios
		.get(
			`${process.env.API_URL}/api/documents?filters[name][$eq]=${ctx.message.text}`
		)
		.then(function (response) {
			let res = response.data.data;
			console.log(res);
			if (response.data.data.length > 0) {
				axios
					.get(
						`${process.env.API_URL}/api/documents/${response.data.data[0].id}?populate=*`
					)
					.then(function async(response) {
						let image_url =
							response.data.data.attributes.images.data[0].attributes.url;
						ctx.replyWithPhoto(
							{
								url: `${process.env.API_URL}${image_url}`,
							},
							{
								caption: `
							\n
							 اذا كان المستمسك يعود لك تواصل مع الادمن
							\n ${process.env.ADMIN}`,
							}
						);
					});
			} else {
				ctx.reply("لا يوجد");
			}
		})
		.catch(function (error) {
			console.log(error);
		});
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
