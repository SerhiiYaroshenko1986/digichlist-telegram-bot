const Scene = require("telegraf/scenes/base");
const Requests = require("../services/utils");
const serviceRequest = new Requests();
const Render = require("../services/render");
const activeRender = new Render();

const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();

module.exports = fixDef = new Scene("fix");
let defects = [];
let actionTriger = [];
let defectId = "";
let payload = {};
fixDef.hears("в головне меню", (ctx) => ctx.scene.enter("dash"));
fixDef.action(["yes", "no"], async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    ctx.reply("Будь ласка введіть причину");
  } else {
    changeDefectStatus(ctx, defectId);
  }
});
const changeDefectStatus = (ctx, defectId) => {
  serviceRequest
    .updateDefectStatus(defectId, payload)
    .then((res) => {
      if (res.data.response === "ok") {
        ctx.replyWithHTML(`Статус дефекту успішно змінено на <b>закритий</b>`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const createAction = () => {
  fixDef.action(actionTriger, async (ctx) => {
    defectId = ctx.callbackQuery.data;
    payload = defects.filter((elem) => elem._id === defectId)[0];
    payload.status = "solved";
    ctx.reply("Бажаєте ввести причину закриття", buttons.yesNoKeyboard());
  });
};

const getFixingDefects = (ctx) => {
  serviceRequest
    .getDefectsByQuery("defect/getByStatus/", { status: "fixing" })
    .then((res) => {
      if (res.data.response === "ok") {
        defects = res.data.defects;
      }
      if (defects.length === 0) {
        ctx.reply("Дефекти відсутні");
      } else {
        activeRender.getFixingDefects(ctx, defects, actionTriger);
        createAction();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
fixDef.on("text", async (ctx) => {
  payload.close_reason = ctx.message.text;
  changeDefectStatus(ctx, defectId);
});
fixDef.enter((ctx) => {
  ctx.reply(
    "Тут ви можете здійснювати операції зі зміни статусу дефекту",
    buttons.exitKeyboard()
  );
  getFixingDefects(ctx);
});
