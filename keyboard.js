const { Markup } = require("telegraf");

class BotButtons {
  getMainMenu() {
    return Markup.keyboard([["реєстрація", "дефект"]])
      .resize()
      .extra();
  }
  getExit() {
    return Markup.keyboard([["вихід"]])
      .resize()
      .extra();
  }
  yesNoKeyboard() {
    return Markup.inlineKeyboard(
      [Markup.callbackButton("Так", "yes"), Markup.callbackButton("Ні", "no")],
      { columns: 2 }
    ).extra();
  }
}
module.exports = BotButtons;
