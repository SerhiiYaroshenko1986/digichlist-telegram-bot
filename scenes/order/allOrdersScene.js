const Scene = require("telegraf/scenes/base");
const Requests = require("../../services/utils");
const serviceRequest = new Requests();
const botButtons = require("../../keyboards/keyboard");
const buttons = new botButtons();
const OrderRender = require("../../services/order");
const orderService = new OrderRender();

module.exports = allOrders = new Scene("allOrders");
let ordersData = [];
let actionTriger = [];
allOrders.hears("⏪ в головне меню", (ctx) => {
  ctx.scene.leave();
  ctx.scene.enter("dashMerch");
});

const getOrders = (ctx) => {
  serviceRequest
    .getEntitiesByQuery("order/getByDone", { done: false })
    .then((res) => {
      if (res.data.orders.length !== 0) {
        ordersData = res.data.orders;
        orderService.ordersTemplate(ctx, ordersData, actionTriger, allOrders);
      }
    })
    .catch((err) => {
      ctx.scene.leave();
      console.log(err);
    });
};

allOrders.enter(async (ctx) => {
  ctx.reply(
    "Тут ви можете змінювати статус замовлення",
    buttons.exitKeyboard()
  );
  getOrders(ctx);
});
