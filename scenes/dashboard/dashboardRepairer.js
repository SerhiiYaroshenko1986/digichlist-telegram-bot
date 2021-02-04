const Scene = require("telegraf/scenes/base");

const botButtons = require("../../keyboards/keyboard");
const buttons = new botButtons();

module.exports = dashRep = new Scene("dashRep");
dashRep.enter(async (ctx) => {
  await ctx.reply("Оберіть потрібну опцію ", buttons.getAllFeatures());
});
