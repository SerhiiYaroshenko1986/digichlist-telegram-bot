const Scene = require("telegraf/scenes/base");

module.exports = help = new Scene("help");
help.enter((ctx) => {
  ctx.replyWithHTML(
    "Якщо Ви тут у перше будь ласка натисніть кнопку <b>РЕЄСТРАЦІЯ</b> і очікуйте на підтвердження від адміністратора\nЯкщо ж ні тоді Ви знаєте що робити)))"
  );
});
