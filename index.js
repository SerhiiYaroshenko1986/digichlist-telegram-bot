const Telegraf = require("telegraf");
const { Stage, session } = Telegraf;
const bot = require("./bot");
const userInfo = require("./scenes/rmeScene");
const defect = require("./scenes/newDefectScene");
const auth = require("./scenes/authScene");
const dash = require("./scenes/dasnboardScene");
const active = require("./scenes/activeDefects");
const searchByDate = require("./scenes/defectsByDateScene");
const botButtons = require("./keyboards/keyboard");
const mainMenuBtn = new botButtons();

//bot.use(Telegraf.log());

const stage = new Stage([userInfo, defect, auth, dash, active, searchByDate]);

bot.use(session());
bot.use(stage.middleware());

bot.start(({ reply }) => {
  return reply("Вітаю оберіть дію", mainMenuBtn.getMainMenu());
});
bot.help((ctx) => ctx.reply("Send me a sticker"));

bot.hears("реєстрація", async (ctx) => {
  ctx.scene.enter("rme");
});
bot.hears("додати дефект", async (ctx) => {
  ctx.scene.enter("new");
});

bot.hears("список дефектів за датою", async (ctx) => {
  ctx.scene.enter("date");
});
bot.hears("вхід", async (ctx) => {
  ctx.scene.enter("auth");
});
bot.hears("список активних дефектів", async (ctx) => {
  ctx.scene.enter("active");
});
bot.launch();
