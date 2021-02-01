const config = require("config");
const Telegraf = require("telegraf");
module.exports = bot = new Telegraf(config.get("token"));

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://digihlist-bot.herokuapp.com";

bot.telegram.setWebhook(`${URL}/bot${config.get("token")}`);
bot.startWebhook(`/bot${config.get("token")}`, null, PORT);
