const { Markup } = require("telegraf");

class BotButtons {
  getMainMenu() {
    return Markup.keyboard([["реєстрація", "вхід"]])
      .resize()
      .extra();
  }
  exitKeyboard() {
    return Markup.keyboard([["в головне меню"]])
      .resize()
      .extra();
  }
  yesNoKeyboard() {
    return Markup.inlineKeyboard(
      [Markup.callbackButton("Так", "yes"), Markup.callbackButton("Ні", "no")],
      { columns: 2 }
    ).extra();
  }
  detailsBtn(index) {
    return Markup.inlineKeyboard([Markup.callbackButton("Деталі", index)], {
      columns: 2,
    }).extra();
  }
  getAllFeatures() {
    return Markup.keyboard([
      ["додати дефект", "список активних дефектів", "список дефектів за датою"],
    ])
      .resize()
      .extra();
  }
  showPhoto() {
    return Markup.inlineKeyboard(
      [Markup.callbackButton("Показати фото", "yes")],
      {
        columns: 2,
      }
    ).extra();
  }
}
module.exports = BotButtons;
