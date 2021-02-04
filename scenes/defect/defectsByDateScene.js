const Scene = require("telegraf/scenes/base");
const botButtons = require("../../keyboards/keyboard");
const buttons = new botButtons();
const Requests = require("../../services/utils");
const serviceRequest = new Requests();
const Render = require("../../services/defect");
const activeRender = new Render();

let payload = {};
let defects = [];
let actionTriger = [];
let firstStep = false;
let secondStep = false;
let update = false;
module.exports = date = new Scene("date");
date.enter(async (ctx) => {
  firstStep = true;
  await ctx.reply(
    "Введіть початкову дату (у форматі дд/мм/рррр)",
    buttons.exitKeyboard()
  );
});
date.hears("⏪ в головне меню", (ctx) => ctx.scene.enter("dashRep"));
date.on("text", async (ctx) => {
  if (firstStep) {
    payload.start = ctx.message.text.toString();
    firstStep = false;
    secondStep = true;
    await ctx.reply("Введіть кінцеву дату (у форматі дд/мм/рррр)");
  } else if (secondStep) {
    payload.end = ctx.message.text.toString();
    getDefectsDate(ctx);
  } else if (update) {
    activeRender.changeDefectStatus(ctx, ctx.message.text);
  }
});

const getDefectsDate = (ctx) => {
  const status = "open";
  const date_type = "open_date";
  params = {
    status: status,
    date_type: date_type,
    start: payload.start.split("/").reverse().join("-"),
    end: payload.end.split("/").reverse().join("-"),
  };
  serviceRequest
    .getEntitiesByQuery("defect/getByDateAndStatus", params)
    .then((res) => {
      defects = res.data.defects;
      if (defects.length === 0) {
        ctx.reply("Дефекти відсутні");
        ctx.scene.leave();
      } else {
        const feature = ["fixing", "solved"];
        activeRender.getDefectsTemplate(
          ctx,
          defects,
          actionTriger,
          feature,
          buttons.detailsBtn
        );
        activeRender.createAction(date, actionTriger, defects);
      }
    })
    .catch((err) => {
      ctx.reply("Некоректно введені дані");
      ctx.scene.leave();
      console.log(err);
    });
  date.action(["yes", "no"], async (ctx) => {
    if (ctx.callbackQuery.data === "yes") {
      update = true;
      secondStep = false;
      await ctx.reply("Будь ласка введіть причину (не менше 5 символів)");
    } else {
      activeRender.changeDefectStatus(ctx);
    }
  });
};
