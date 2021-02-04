const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();
const Requests = require("./utils");
const serviceRequest = new Requests();
const bot = require("../bot");

class OrderRender {
  ordersTemplate(ctx, ordersData, actionTriger, scene) {
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
    this.createAction(scene, actionTriger, ordersData);
  }
  createAction(scene, triger, ordersData) {
    scene.action(triger, async (ctx) => {
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
          ctx.scene.enter("dashMerch");
        });
    });
  }
}

module.exports = OrderRender;
