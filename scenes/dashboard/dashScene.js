const Scene = require("telegraf/scenes/base");
const Requests = require("../../services/utils");
const serviceRequest = new Requests();
const botButtons = require("../../keyboards/keyboard");
const buttons = new botButtons();
let position = null;
module.exports = dash = new Scene("dash");
const checkPosition = (position, ctx) => {
  if (position === "Repairer") {
    ctx.reply("Оберіть потрібну опцію ", buttons.getAllFeatures());
  } else if (position === "Cleaner") {
    ctx.reply("Оберіть потрібну опцію ", buttons.getCleanerFeatures());
  } else if (position === "Merchandiser") {
    ctx.reply("Оберіть потрібну опцію ", buttons.getMerchFeatures());
  }
};
dash.enter(async (ctx) => {
  if (!position) {
    serviceRequest
      .isAuth(`user/getByUsername/${ctx.from.id.toString()}`)
      .then((res) => {
        position = res.data.user.position;
        checkPosition(position, ctx);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    checkPosition(position, ctx);
  }
});
