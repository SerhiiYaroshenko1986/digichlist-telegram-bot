const Telegraf = require("telegraf");
const config = require("./config/keys.config");
module.exports = bot = new Telegraf(config.token);

bot.telegram.setWebhook(`${config.url}/bot${config.token}`);
bot.startWebhook(`/bot${config.token}`, null, config.port);
