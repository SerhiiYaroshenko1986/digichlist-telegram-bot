const Scene = require("telegraf/scenes/base");
const Requests = require("../services/utils");
const serviceRequest = new Requests();

module.exports = auth = new Scene("auth");
auth.enter(async (ctx) => {
  serviceRequest
    .isAuth(`user/getByUsername/${ctx.from.id.toString()}`)
    .then((res) => {
      if (res.data.message === "User found") {
        ctx.scene.enter("dash", { response: true });
      } else if (res.data.message === "No user") {
        ctx.reply("Ви ще не зареєстровані");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
