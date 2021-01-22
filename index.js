const Telegraf = require("telegraf");
const { Stage, session } = Telegraf;
const config = require("config");
const bot = new Telegraf(config.get("token"));
const UserInfo = require("./rmeScene");
const userScene = new UserInfo();
const userInfo = userScene.genUserInfo();
const deffect = require("./newScene");
const botButtons = require("./keyboard");
const mainMenuBtn = new botButtons();

bot.use(Telegraf.log());

const stage = new Stage([userInfo, deffect]);

bot.use(session());
bot.use(stage.middleware());

bot.start(({ reply }) => {
  return reply("Вітаю оберіть дію", mainMenuBtn.getMainMenu());
});
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.hears("реєстрація", async (ctx) => {
  ctx.scene.enter("rme");
});
bot.hears("дефект", async (ctx) => {
  ctx.scene.enter("new");
});
bot.hears("вихід", async (ctx) => {
  ctx.leaveChat();
});
bot.launch();
