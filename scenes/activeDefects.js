const Scene = require("telegraf/scenes/base");
const Requests = require("../services/utils");
const serviceRequest = new Requests();
const Render = require("../services/render");
const activeRender = new Render();

const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();

module.exports = active = new Scene("active");
let payload = {};
let defects = [];
let defectId = "";
let actionTriger = [];
active.hears("в головне меню", (ctx) => ctx.scene.enter("dashRep"));
active.action(["yes", "no"], async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    ctx.reply("Будь ласка введіть причину");
  } else {
    activeRender.changeDefectStatus(ctx);
  }
});

const getDeffects = (ctx) => {
  serviceRequest
    .getDefectsByQuery("defect/getByStatus/", { status: "open" })
    .then((res) => {
      defects = res.data.defects;
      if (defects.length === 0) {
        ctx.reply("Дефекти відсутні");
      } else {
        const feature = ["fixing", "solved"];
        activeRender.getDefectsTemplate(
          ctx,
          defects,
          actionTriger,
          feature,
          buttons.detailsBtn
        );
        activeRender.createAction(active, actionTriger, defects);
      }
    })
    .catch((err) => {
      console.log(err);
      return ctx.reply("Ви не авторизовані");
    });
};
active.on("text", async (ctx) => {
  payload.close_reason = ctx.message.text;
  activeRender.changeDefectStatus(ctx);
});
active.enter(async (ctx) => {
  ctx.reply(
    "Тут ви можете здійснювати операції зі зміни статусу дефекту",
    buttons.exitKeyboard()
  );
  getDeffects(ctx);
});
