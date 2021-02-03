const Scene = require("telegraf/scenes/base");
const Requests = require("../services/utils");
const serviceRequest = new Requests();
const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();

module.exports = allOrders = new Scene("allOrders");
let ordersData = [];
let actionTriger = [];
allOrders.hears("⏪ в головне меню", (ctx) => {
  ctx.scene.leave();
  ctx.scene.enter("dashMerch");
});

const getAllOrders = (ctx) => {
  serviceRequest
    .getDefectsByQuery("order/getByDone", { done: false })
    .then((res) => {
      if (res.data.orders.length !== 0) {
        ordersData = res.data.orders;
        ordersTemplate(ctx);
      }
    })
    .catch((err) => {
      ctx.scene.leave();
      console.log(err);
    });
};
const ordersTemplate = (ctx) => {
  ordersData.map((elem) => {
    actionTriger.push(elem._id);
    if (elem.note === "No description provided") {
      elem.note = "відсутній";
    }
    ctx.replyWithHTML(
      `<b>Назва предмету:</b> ${elem.title}\n<b>Кількість:</b> ${elem.quantity}\n<b>Коментар:</b> ${elem.note}`,
      buttons.ordersBtn(elem._id)
    );
  });
  createAction(actionTriger);
};
allOrders.enter(async (ctx) => {
  ctx.reply(
    "Тут ви можете змінювати статус замовлення",
    buttons.exitKeyboard()
  );
  getAllOrders(ctx);
});
const createAction = (triger) => {
  allOrders.action(triger, async (ctx) => {
    const orderId = ctx.callbackQuery.data;
    const updateOrder = ordersData.filter((elem) => elem._id === orderId)[0];
    updateOrder.done = true;
    serviceRequest
      .updateOrderStatus(orderId, updateOrder)
      .then((res) => {
        if (res.data.message === "Order was successfully updated") {
          ctx.replyWithHTML(
            `Статус замовлення <b>${updateOrder.title}</b> успішно змінено`
          );
        }
      })
      .catch((err) => {
        if (err.response.data.message === "Incorrect new order data") {
          ctx.reply("Сталась помилка спробуйте пізніше");
        }
        ctx.scene.leave();
      });
  });
};
