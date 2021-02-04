const Scene = require("telegraf/scenes/base");
const Requests = require("../../services/utils");
const serviceRequest = new Requests();

const botButtons = require("../../keyboards/keyboard");
const buttons = new botButtons();

module.exports = dash = new Scene("dash");
dash.enter(async (ctx) => {
  serviceRequest.get;
  await ctx.reply("Оберіть потрібну опцію ", buttons.getCleanerFeatures());
});
