const config = require("config");
const Telegraf = require("telegraf");
module.exports = bot = new Telegraf(config.get("token"));
