const Scene = require("telegraf/scenes/base");
const Requests = require("../services/utils");
const serviceRequest = new Requests();

module.exports = auth = new Scene("auth");
auth.enter(async (ctx) => {
  serviceRequest
    .isAuth(`user/getByUsername/${ctx.from.id.toString()}`)
    .then((res) => {
      if (res.data.message === "User found") {
        if (res.data.user.position === "None") {
          ctx.reply(
            "Для Вас ще не призначена посада будь ласка зверніться до адміністратора"
          );
        } else {
          ctx.scene.enter("dash");
        }
      } else if (res.data.message === "No user") {
        ctx.reply("Ви ще не зареєстровані");
      }
    })
    .catch((err) => {
      ctx.scene.leave();
      console.log(err);
    });
});
