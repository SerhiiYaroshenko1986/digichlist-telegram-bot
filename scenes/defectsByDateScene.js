const WizardScene = require("telegraf/scenes/wizard");
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
let actionTriger = [];
module.exports = date = new WizardScene(
  "date",
  async (ctx) => {
    await ctx.reply("Введіть початкову дату (у форматі дд/мм/рррр)");
    return ctx.wizard.next();
  },
  async (ctx) => {
    payload.start = ctx.message.text.toString();
    await ctx.reply("Введіть кінцеву дату (у форматі дд/мм/рррр)");
    return ctx.wizard.next();
  },
  async (ctx) => {
    payload.end = ctx.message.text;
    getDefectsDate(ctx);
  },
  buttons.exitKeyboard()
);

const getDefectsDate = (ctx) => {
  const status = "open";
  const date_type = "open_date";
  params = {
    status: status,
    date_type: date_type,
    start: payload.start.split("-").reverse().join("-"),
    end: payload.end.split("-").reverse().join("-"),
  };
  serviceRequest
    .getDefectsByQuery("defect/getByDateAndStatus", params)
    .then((res) => {
      console.log(res);
      defects = res.data.defects;
      if (defects.length === 0) {
        ctx.reply("Дефекти відсутні");
        ctx.scene.leave();
      } else {
        activeRender.getDefectsTemplate(ctx, defects, actionTriger);
        activeRender.createAction(date, actionTriger, defects);
      }
    })
    .catch((err) => {
      ctx.reply("Некоректно введені дані");
      ctx.scene.leave();
      console.log(err);
    });
};
