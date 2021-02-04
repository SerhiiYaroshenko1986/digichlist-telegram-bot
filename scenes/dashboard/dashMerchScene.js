const Scene = require("telegraf/scenes/base");

const botButtons = require("../../keyboards/keyboard");
const buttons = new botButtons();

module.exports = dashMerch = new Scene("dashMerch");
dashMerch.enter(async (ctx) => {
  await ctx.reply("Оберіть потрібну опцію ", buttons.getMerchFeatures());
});
