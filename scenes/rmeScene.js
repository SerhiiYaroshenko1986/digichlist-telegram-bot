const Scene = require("telegraf/scenes/base");
const Requests = require("../services/utils");
const serviceRequest = new Requests();
module.exports = rme = new Scene("rme");
rme.enter(async (ctx) => {
  const requestBody = {
    chat_id: ctx.message.chat.id,
    first_name: ctx.from.first_name,
    last_name: ctx.from.last_name,
    username: ctx.from.id.toString(),
  };
  serviceRequest
    .postRequest("user/create", requestBody)
    .then((res) => {
      //console.log(res);
      ctx.reply(`Ваш запит вислано для підтвердження очікуйте на відповідь`);
    })
    .catch((err) => {
      ctx.reply(`Ви уже зареєстровані`);
    });
});
