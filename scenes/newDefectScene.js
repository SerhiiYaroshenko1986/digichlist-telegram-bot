const WizardScene = require("telegraf/scenes/wizard");
const Composer = require("telegraf");
const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();
const stepHandler = new Composer();
const Requests = require("../services/utils");
const serviceRequest = new Requests();
const bot = require("../bot");

const payload = {};
const createDefect = (ctx) => {
  serviceRequest
    .postRequest("defect/create", payload)
    .then((res) => {
      if (res.data.response === "ok") {
        ctx.reply(
          `Дефект успішно збережено\nпід номером ${res.data.defect._id}`
        );
        bot.telegram.sendMessage(
          941725387,
          `Дефект успішно збережено\nпід номером ${res.data.defect._id}`
        );
        if (res.data.defect.attachment_id !== "") {
          bot.telegram.sendPhoto(941725387, res.data.defect.attachment_id);
        }
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.response.data.message === "Incorrect new defect data") {
        ctx.reply("Перевірте правельність введених даних ");
      } else {
        console.log(err.response.data.message);
      }
    });
};
const getPhotoBase64 = (path, ctx) => {
  serviceRequest
    .getPhoto(path)
    .then((res) => {
      payload.attachment = `data:image/jpeg;base64,${res}`;
      createDefect(ctx);
    })
    .catch((err) => {
      console.log(err);
    });
};

stepHandler.action(["yes", "no"], async (ctx) => {
  if (ctx.callbackQuery.data === "yes") {
    await ctx.reply("Будь ласка завантажте фото");
    return ctx.wizard.next();
  } else {
    payload.attachment = "";
    payload.attachment_id = "";
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
    payload.room = ctx.message.text.toString();
    await ctx.reply("Введіть опис пошкодження");
    return ctx.wizard.next();
  },
  async (ctx) => {
    payload.title = ctx.message.text;
    await ctx.reply("Завантажити фото?", buttons.yesNoKeyboard());
    return ctx.wizard.next();
  },
  stepHandler,
  async (ctx) => {
    payload.status = "open";
    payload.username = ctx.from.id.toString();
    if (ctx.message) {
      let filePath = "";
      const lastPhotoIndex = ctx.message.photo.length - 1;
      const attachmentId = ctx.message.photo[lastPhotoIndex].file_id;
      payload.attachment_id = attachmentId;
      serviceRequest
        .getPhotoPath(attachmentId)
        .then((res) => {
          if (res.data.ok) {
            filePath = res.data.result.file_path;
            getPhotoBase64(filePath, ctx);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      createDefect(ctx);
    }
    return await ctx.scene.leave();
  }
);
