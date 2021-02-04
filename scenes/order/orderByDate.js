const Scene = require("telegraf/scenes/base");
const botButtons = require("../../keyboards/keyboard");
const buttons = new botButtons();
const Requests = require("../../services/utils");
const serviceRequest = new Requests();
const OrderRender = require("../../services/order");
const orderService = new OrderRender();

let payload = {};
let firstStep = false;
let secondStep = false;
let update = false;
let actionTriger = [];
module.exports = dateOrder = new Scene("dateOrder");
const getOrdersByDate = (ctx) => {
  const date_type = "open_date";
  const done = false;
  const params = {
    done: done,
    date_type: date_type,
    start: payload.start.split("/").reverse().join("-"),
    end: payload.end.split("/").reverse().join("-"),
  };
  serviceRequest
    .getEntitiesByQuery("order/getByDateAndDone", params)
    .then((res) => {
      if (res.data.orders.length === 0) {
        ctx.reply("Замовлення за вказаний період відсутні");
      } else {
        orderService.ordersTemplate(
          ctx,
          res.data.orders,
          actionTriger,
          dateOrder
        );
      }
    })
    .catch((err) => {
      ctx.reply("Сталась помилка на сервері спробуйте пізніше");
      ctx.scene.leave();
      console.log(err);
    });
};
dateOrder.enter(async (ctx) => {
  firstStep = true;
  await ctx.reply(
    "Введіть початкову дату (у форматі дд/мм/рррр)",
    buttons.exitKeyboard()
  );
});
dateOrder.hears("⏪ в головне меню", (ctx) => ctx.scene.enter("dashMerch"));
dateOrder.on("text", async (ctx) => {
  if (firstStep) {
    payload.start = ctx.message.text.toString();
    firstStep = false;
    secondStep = true;
    await ctx.reply("Введіть кінцеву дату (у форматі дд/мм/рррр)");
  } else if (secondStep) {
    secondStep = false;
    payload.end = ctx.message.text.toString();
    getOrdersByDate(ctx);
  }
});
