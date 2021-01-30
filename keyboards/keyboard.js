const { Markup, Extra } = require("telegraf");

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
    return Extra.markup(
      Markup.inlineKeyboard([
        Markup.callbackButton("В роботі", `${id},fixing`),
        Markup.callbackButton("Закрити", `${id},solved`),
      ])
    );
  }
  fixingBtn(id) {
    return Extra.markup(
      Markup.inlineKeyboard([Markup.callbackButton("Закрити", id)])
    );
  }
  getAllFeatures() {
    return Markup.keyboard([
      ["додати дефект", "не опрацьовані дефекти"],
      ["не опрацьовані дефекти за датою", "дефекти в роботі"],
      ["замовити"],
    ])
      .resize()
      .extra();
  }
  getCleanerFeatures() {
    return Markup.keyboard([["додати дефект", "замовити"]])
      .resize()
      .extra();
  }
}
module.exports = BotButtons;
