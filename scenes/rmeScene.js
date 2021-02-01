const Scene = require("telegraf/scenes/base");
const Requests = require("../services/utils");
const serviceRequest = new Requests();
module.exports = rme = new Scene("rme");
rme.enter(async (ctx) => {
  const requestBody = {
    chat_id: ctx.message.chat.id.toString(),
    first_name: ctx.from.first_name ? ctx.from.first_name : "",
    last_name: ctx.from.last_name ? ctx.from.last_name : "",
    username: ctx.from.id.toString(),
  };
  serviceRequest
    .postRequest("user/create", requestBody)
    .then((res) => {
      ctx.reply(`Ваш запит вислано для підтвердження очікуйте на відповідь`);
    })
    .catch((err) => {
      if (err.response.data.message.includes("duplicate key")) {
        ctx.reply(`Ви уже зареєстровані`);
      } else {
        ctx.reply(`Сталась помилка на серсері спробуйте пізніше`);
      }
      ctx.scene.leave();
    });
});
