const Scene = require("telegraf/scenes/base");
const Requests = require("../services/utils");
const serviceRequest = new Requests();
const Render = require("../services/render");
const activeRender = new Render();

const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();

module.exports = active = new Scene("active");

let defects = [];
active.action("yes", async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    activeRender.showPicture(ctx, attachmentId);
  }
});

const createAction = (triger) => {
  active.action(triger, async (ctx) => {
    const room = ctx.callbackQuery.data;
    activeRender.getDefectByRoom(room, ctx, defects, attachmentId);
  });
};

const getDeffects = (ctx) => {
  serviceRequest
    .getAllDefects("defect/all")
    .then((res) => {
      defects = res.data.defects;
      console.log(defects);
      // return activeRender.getDefects(ctx, defects, attachmentId);
      // const rooms = activeRender.defectsByRoom(defects);
      // createAction(rooms);
      // activeRender.getRooms(rooms, ctx);
    })
    .catch((err) => {
      console.log(err);
      return ctx.reply("Ви не авторизовані");
    });
};

active.enter(async (ctx) => {
  getDeffects(ctx);
});
