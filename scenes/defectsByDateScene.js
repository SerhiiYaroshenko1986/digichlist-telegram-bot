const Scene = require("telegraf/scenes/base");
const Composer = require("telegraf");
const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();
const stepHandler = new Composer();
const Requests = require("../services/utils");
var moment = require("moment");
const serviceRequest = new Requests();
const Render = require("../services/render");
const activeRender = new Render();

let payload = {};
let defects = [];
let defectId = "";
let actionTriger = [];
module.exports = date = new Scene("date");
date.enter(async (ctx) => {
  await ctx.reply(
    "Введіть дату (у форматі дд/мм/рррр)",
    buttons.exitKeyboard()
  );
});
date.hears("в головне меню", (ctx) => ctx.scene.enter("dash"));
date.action(["yes", "no"], async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    ctx.reply("Будь ласка введіть причину");
  } else {
    activeRender.changeDefectStatus(ctx, defectId, payload);
  }
});

date.on("text", async (ctx) => {
  payload.close_reason = ctx.message.text;
  getDefectsDate(ctx);
  activeRender.changeDefectStatus(ctx, defectId, payload);
});

const getDefectsDate = (ctx) => {
  const start = ctx.message.txt;
  const status = "open";
  const date_type = "open_date";
  params = { start: start, status: status, date_type: date_type };
  serviceRequest
    .getDefectsByQuery("defect/getByDateAndStatus/", params)
    .then((res) => {
      console.log(res);
      defects = res.data.defects;
      if (defects.length === 0) {
        ctx.reply("Дефекти відсутні");
      } else {
        activeRender.getDefectsTemplate(ctx, defects, actionTriger);
        activeRender.createAction(date, actionTriger, defects);
      }
    })
    .catch((err) => {
      ctx.scene.leave();
    });
};
