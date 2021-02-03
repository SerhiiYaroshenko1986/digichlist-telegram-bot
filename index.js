const Telegraf = require("telegraf");
const { Stage, session } = Telegraf;
const bot = require("./bot");
const allOrders = require("./scenes/allOrdersScene");
const userInfo = require("./scenes/rmeScene");
const defect = require("./scenes/newDefectScene");
const auth = require("./scenes/authScene");
const dash = require("./scenes/dashboardCleaner");
const dashRep = require("./scenes/dashboardRepairer");
const dashMerch = require("./scenes/dashMerchScene");
const order = require("./scenes/orderScene");
const active = require("./scenes/activeDefects");
const searchByDate = require("./scenes/defectsByDateScene");
const fixingDefects = require("./scenes/fixingDefects");
const help = require("./scenes/helpScene");
const botButtons = require("./keyboards/keyboard");
const mainMenuBtn = new botButtons();

//bot.use(Telegraf.log());

const stage = new Stage([
  userInfo,
  defect,
  auth,
  dash,
  active,
  searchByDate,
  fixingDefects,
  order,
  dashRep,
  help,
  dashMerch,
  allOrders,
]);

bot.use(session());
bot.use(stage.middleware());

bot.start(({ reply }) => {
  return reply("Вітаю оберіть дію", mainMenuBtn.getMainMenu());
});
bot.help((ctx) => ctx.scene.enter("help"));

bot.hears("📖 реєстрація", async (ctx) => {
  ctx.scene.enter("rme");
});
bot.hears("⏸️ не опрацьовані замовлення", async (ctx) => {
  ctx.scene.enter("allOrders");
});
bot.hears("▶️ додати дефект", async (ctx) => {
  ctx.scene.enter("new");
});
bot.hears("💬 допомога", async (ctx) => {
  ctx.scene.enter("help");
});
bot.hears("📆 не опрацьовані дефекти за датою", async (ctx) => {
  ctx.scene.enter("date");
});
bot.hears("🛠 дефекти в роботі", async (ctx) => {
  ctx.scene.enter("fix");
});
bot.hears("🔐 вхід", async (ctx) => {
  ctx.scene.enter("auth");
});
bot.hears("⏸️ не опрацьовані дефекти", async (ctx) => {
  ctx.scene.enter("active");
});
bot.hears("📝 замовити", async (ctx) => {
  ctx.scene.enter("order");
});
bot.launch();
