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

let attachmentId = [];
module.exports = defect = new Scene("date");
defect.enter(async (ctx) => {
  await ctx.reply(
    "Введіть дату (у форматі дд/мм/рррр)",
    buttons.exitKeyboard()
  );
});
defect.action("yes", async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    activeRender.showPicture(ctx, attachmentId);
  }
});
defect.hears("в головне меню", (ctx) => ctx.scene.enter("dash"));
defect.on("text", (ctx) => {
  const startDate = ctx.message.text;
  getDefectsDate(ctx, startDate);
});

const createAction = (triger) => {
  console.log(triger);
  defect.action(triger, async (ctx) => {
    const room = ctx.callbackQuery.data;
    activeRender.getDefectByRoom(room, ctx, defects, attachmentId);
  });
};
const getDefectsDate = (ctx, startDate) => {
  //const start = new Date(Date.now());
  //   const end = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
  //const endHours = new Date(new Date().setHours(new Date().getHours() - 1));

  const start = moment(startDate, "DD MM YYYY L").format();
  const status = "open";
  params = { start: start, status: status };
  serviceRequest
    .getDefectsByDate("defect/getByDate", params)
    .then((res) => {
      if (res.data.defects.length > 0) {
        defects = res.data.defects;
        const rooms = activeRender.defectsByRoom(defects);
        createAction(rooms);
        activeRender.getRooms(rooms, ctx);
      } else {
        ctx.reply("За вказаний період дефектів не знайдено");
        ctx.scene.leave();
      }
    })
    .catch((err) => {
      ctx.scene.leave();
    });
};
