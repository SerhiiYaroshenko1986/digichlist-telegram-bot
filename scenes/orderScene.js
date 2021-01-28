const WizardScene = require("telegraf/scenes/wizard");
const Composer = require("telegraf");
const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();
const stepHandler = new Composer();
const Requests = require("../services/utils");
const serviceRequest = new Requests();
const bot = require("../bot");

const payload = {};
const createOrder = (ctx) => {
  serviceRequest
    .postChecklist("order/create", payload)
    .then((res) => {
      console.log(res);
      ctx.reply(`Замовлення успішно збережено`);
      // bot.telegram.sendMessage(
      //   1288065659,
      //   `Дефект успішно збережено\nпід номером ${res.data.defect._id}`
      // );
    })
    .catch((err) => {
      console.log(err);
      ctx.reply("Замовлення не збережено.");
    });
};
// const getPhotoBase64 = (path, ctx) => {
//   serviceRequest
//     .getPhoto(path)
//     .then((res) => {
//       payload.attachment = `data:image/jpeg;base64,${res}`;
//       createDefect(ctx);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

stepHandler.action(["yes", "no"], async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    await ctx.reply("Введіть коментар");
    return ctx.wizard.next();
  } else {
    payload.attachment = "";
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  }
});

stepHandler.action(["yes", "no"], async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    await ctx.reply("Додати коментар?");
    return ctx.wizard.next();
  } else {
    payload.note = "";
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  }
});

module.exports = deffect = new WizardScene(
  "order",
  async (ctx) => {
    await ctx.reply("Введіть назву предмету");
    return ctx.wizard.next();
  },
  async (ctx) => {
    payload.title = ctx.message.text.toString();
    await ctx.reply("Введіть кількість");
    return ctx.wizard.next();
  },
  async (ctx) => {
    payload.quantity = ctx.message.text;
    await ctx.reply("Додати коментар?", buttons.yesNoKeyboard());
    return ctx.wizard.next();
  },
  stepHandler,
  async (ctx) => {
    payload.username = ctx.from.id.toString();
    if (ctx.message) {
      payload.note = ctx.message.text;
    }
    createOrder(ctx);
    return await ctx.scene.leave();
  }
);
