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
let checkAction = false;
fixDef.hears("в головне меню", (ctx) => ctx.scene.enter("dashRep"));
fixDef.action(["yes", "no"], async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    checkAction = true;
    ctx.reply("Будь ласка введіть причину");
  } else {
    activeRender.changeDefectStatus(ctx);
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
      if (err.response.data.response === "notRepairer") {
        ctx.reply("У Вас немає доступу для здійснення цієї операції");
      } else {
        console.log(err);
      }
    });
};
// const createAction = () => {
//   fixDef.action(actionTriger, async (ctx) => {
//     defectId = ctx.callbackQuery.data;
//     payload = defects.filter((elem) => elem._id === defectId)[0];
//     payload.status = "solved";
//     payload.username = ctx.from.id.toString();
//     ctx.reply("Бажаєте ввести причину закриття", buttons.yesNoKeyboard());
//   });
// };

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
      console.log(err);
    });
};
fixDef.on("text", async (ctx) => {
  if (checkAction) {
    const closeReason = ctx.message.text;
    activeRender.changeDefectStatus(ctx, closeReason);
  } else {
    checkAction = false;
    console.log(ctx.message.text);
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
