const WizardScene = require("telegraf/scenes/wizard");
const Composer = require("telegraf");
const botButtons = require("./keyboard");
const buttons = new botButtons();
const payload = {};
const stepHandler = new Composer();
stepHandler.action(["yes", "no"], async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    await ctx.reply("Будь ласка завантажте фото");
    return ctx.wizard.next();
  } else {
    payload.attempts = "";
    ctx.wizard.next();
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
  }
});
module.exports = deffect = new WizardScene(
  "new",
  async (ctx) => {
    await ctx.reply("Введіть номер або назву кімнати");
    return ctx.wizard.next();
  },
  async (ctx) => {
    payload.room = ctx.message.text;
    await ctx.reply("Введіть опис пошкодження");
    return ctx.wizard.next();
  },
  async (ctx) => {
    payload.description = ctx.message.text;
    await ctx.reply("Завантажити фото?", buttons.yesNoKeyboard());
    return ctx.wizard.next();
  },
  stepHandler,
  async (ctx) => {
    if (ctx.message) {
      const lastPhotoIndex = ctx.message.photo.length - 1;
      payload.attempts = ctx.message.photo[lastPhotoIndex];
    }
    await ctx.reply(payload);
    return await ctx.scene.leave();
  }
);
