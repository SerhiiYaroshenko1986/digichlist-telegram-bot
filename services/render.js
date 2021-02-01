const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();
const Requests = require("./utils");
const serviceRequest = new Requests();

const bot = require("../bot");

class Render {
  defect_id = "";
  payload = {};
  status = "";
  getDefectsTemplate(ctx, defects, actionTriger, feature, buttonTemplate) {
    let comments = null;
    const details = defects.map((elem) => {
      actionTriger.push(`${elem._id},${feature[0]}`);
      actionTriger.push(`${elem._id},${feature[1]}`);
      if (elem.comments.length !== 0) {
        comments = elem.comments.map((item) => item.message).join(", ");
      }
      if (elem.attachment_id !== "") {
        const send = buttonTemplate(elem._id);
        send.parse_mode = "markdown";

        send.caption = `*Дефект під номером:* ${elem._id}\n*Кімната:* ${
          elem.room
        }\n*Опис пошкодження:* ${elem.title}\n*Коментарі:* ${
          comments ? comments : "відсутні"
        }`;
        ctx.replyWithPhoto(elem.attachment_id, send);
      } else {
        ctx.replyWithHTML(
          `<b><i>Дефект під номером:</i></b> ${elem._id}\n
           <b><i>Кімната:</i></b> ${elem.room}\n
           <b><i>Опис пошкодження:</i></b> ${
             elem.title
           }\n<b><i>Коментарі:</i></b>${comments ? comments : "відсутні"}`,
          buttonTemplate(elem._id)
        );
      }
    });
    return details;
  }

  changeDefectStatus(ctx, closeReason = "Defect not yet fixed") {
    this.payload.close_reason = closeReason;
    serviceRequest
      .updateDefectStatus(this.defect_id, this.payload)
      .then((res) => {
        console.log(res);
        if (res.data.response === "ok") {
          const changeStatus =
            this.payload.status === "fixing" ? "в роботі" : "закритий";
          ctx.replyWithHTML(
            `Статус дефекту  успішно змінено на <b>${changeStatus}</b>`
          );
          ctx.scene.leave();
        }
      })
      .catch((err) => {
        console.log(err);
        if (
          err.response.data.message ===
            "This user is not in a position to update the defect information" ||
          err.response.data.message ===
            "The user is not in the system. To update the defect information, you must register and gain access."
        ) {
          ctx.reply("У Вас немає доступу для здійснення цієї операції");
          ctx.scene.leave();
        } else if (err.response.data.message === "Incorrect defect data") {
          ctx.reply(
            "Опис занадто короткий будь ласка введіть не менше 5 символів"
          );
        } else {
          console.log(err);
        }
      });
  }
  getUser(ctx, comments) {
    serviceRequest
      .isAuth(`user/getByUsername/${ctx.from.id.toString()}`)
      .then((res) => {
        comments[0].user = res.data.user._id;
        comments[0].username = res.data.username;
        this.payload.comments.push(comments[0]);
        this.payload.status = "fixing";
        this.addComment(ctx);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  addComment(ctx) {
    serviceRequest
      .updateDefectStatus(this.defect_id, this.payload)
      .then((res) => {
        if ((res.data.message = "Defect was successfully updated")) {
          ctx.reply("Коментар успішно додано");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  createAction(scene, actionTriger, defects) {
    scene.action(actionTriger, async (ctx) => {
      const response = ctx.callbackQuery.data.split(",");
      this.defect_id = response[0];
      this.status = response[1];
      this.payload = defects.filter((elem) => elem._id === this.defect_id)[0];
      this.payload.status = this.status;
      this.payload.username = ctx.from.id.toString();
      if (this.status === "fixing") {
        this.changeDefectStatus(ctx);
      } else if (this.status === "comment") {
        ctx.reply("Введіть ваш коментар");
      } else if (this.status === "solved") {
        ctx.reply("Бажаєте ввести причину закриття", buttons.yesNoKeyboard());
      }
    });
  }
}

module.exports = Render;
