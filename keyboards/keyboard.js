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
  detailsBtn(id) {
    return Markup.inlineKeyboard(
      [
        Markup.callbackButton("В роботі", `${id},fixing`),
        Markup.callbackButton("Закрити", `${id},solved`),
      ],
      {
        columns: 3,
      }
    ).extra();
  }
  fixingBtn(id) {
    return Markup.inlineKeyboard([
      Markup.callbackButton("Закрити", id),
    ]).extra();
  }
  getAllFeatures() {
    return Markup.keyboard([
      [
        "додати дефект",
        "список активних дефектів",
        "список активних дефектів за датою",
        "список дефектів в роботі",
      ],
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
