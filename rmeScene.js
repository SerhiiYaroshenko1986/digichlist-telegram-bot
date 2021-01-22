const Scene = require("telegraf/scenes/base");

class UserInfo {
  genUserInfo() {
    const rme = new Scene("rme");
    rme.enter(async (ctx) => {
      const requestBody = ctx.from;
      await ctx.reply(
        `Ваш запит вислано для підтвердження ${JSON.stringify(requestBody)}`
      );
    });
    return rme;
  }
}

module.exports = UserInfo;
