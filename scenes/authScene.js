const Scene = require("telegraf/scenes/base");
const Requests = require("../services/utils");
const serviceRequest = new Requests();

module.exports = auth = new Scene("auth");
auth.enter(async (ctx) => {
  serviceRequest
    .isAuth(`user/getByUsername/${ctx.from.id.toString()}`)
    .then((res) => {
      if (res.data.response === "ok") {
        console.log(ctx.message);

        ctx.scene.enter("dash", { response: true });
      } else {
        ctx.reply("Ви ще не зареєстровані");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
