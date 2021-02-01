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
  console.log(payload);
  serviceRequest
    .postChecklist("order/create", payload)
    .then((res) => {
      ctx.reply(`Замовлення успішно збережено`);
    })
    .catch((err) => {
      console.log(err);
      ctx.reply("Замовлення не збережено.");
      ctx.scene.leave();
    });
};

stepHandler.action(["yes", "no"], async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    await ctx.reply("Введіть коментар");
    return ctx.wizard.next();
  } else {
    payload.note = "No description provided";
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
