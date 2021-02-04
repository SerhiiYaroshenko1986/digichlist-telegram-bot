const Scene = require("telegraf/scenes/base");
const Requests = require("../../services/utils");
const serviceRequest = new Requests();
const Render = require("../../services/defect");
const activeRender = new Render();

const botButtons = require("../../keyboards/keyboard");
const buttons = new botButtons();

module.exports = fixDef = new Scene("fix");
let defects = [];
let actionTriger = [];
let defectId = "";
let payload = {};
let checkAction = false;
fixDef.hears("⏪ в головне меню", (ctx) => {
  ctx.scene.leave();
  ctx.scene.enter("dashRep");
});
fixDef.action(["yes", "no"], async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    checkAction = true;
    ctx.reply("Будь ласка введіть причину");
  } else {
    activeRender.changeDefectStatus(ctx);
  }
});

const getFixingDefects = (ctx) => {
  serviceRequest
    .getEntitiesByQuery("defect/getByStatus/", { status: "fixing" })
    .then((res) => {
      if (res.data.response === "ok") {
        defects = res.data.defects;
      }
      if (defects.length === 0) {
        ctx.reply("Дефекти відсутні");
      } else {
        const feature = ["comment", "solved"];
        activeRender.getDefectsTemplate(
          ctx,
          defects,
          actionTriger,
          feature,
          buttons.fixingBtn
        );
        activeRender.createAction(fixDef, actionTriger, defects);
      }
    })
    .catch((err) => {
      if (err.response.data === "Unauthorized") {
        ctx.scene.leave();
        return ctx.reply("Ви не авторизовані");
      }
      ctx.scene.leave();
      console.log(err);
    });
};
fixDef.on("text", async (ctx) => {
  if (checkAction) {
    const closeReason = ctx.message.text;
    activeRender.changeDefectStatus(ctx, closeReason);
  } else {
    checkAction = false;
    const comments = [
      {
        user: "",
        username: "",
        message: "",
      },
    ];
    comments[0].message = ctx.message.text;
    activeRender.getUser(ctx, comments);
  }
});
fixDef.enter((ctx) => {
  ctx.reply(
    "Тут ви можете здійснювати операції зі зміни статусу дефекту  та залишати коментарі",
    buttons.exitKeyboard()
  );
  getFixingDefects(ctx);
});
