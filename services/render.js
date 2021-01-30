const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();
const Requests = require("./utils");
const serviceRequest = new Requests();

const bot = require("../bot");
const { Markup, Extra } = require("telegraf");
class Render {
  defect_id = "";
  payload = {};
  status = "";
  getDefectsTemplate(ctx, defects, actionTriger) {
    const details = defects.map((elem) => {
      actionTriger.push(`${elem._id},fixing`);
      actionTriger.push(`${elem._id},solved`);
      if (elem.attachment_id !== "" && elem.attachment_id !== "id") {
        const send = buttons.detailsBtn(elem._id);
        send.caption = `Дефект під номером ${elem._id}\nКімната: ${elem.room}\nОпис пошкодження ${elem.title}`;
        ctx.replyWithPhoto(elem.attachment_id, send);
      } else {
        ctx.replyWithHTML(
          `Дефект під номером <b><i>${elem._id}</i></b>\n
           Кімната: <b><i>${elem.room}</i></b>\n
           Опис пошкодження <b><i>${elem.title}</i></b>`,
          buttons.detailsBtn(elem._id)
        );
      }
    });
    return details;
  }
  getFixingDefects(ctx, defects, actionTriger) {
    const details = defects.map((elem) => {
      actionTriger.push(elem._id);
      if (elem.attachment_id !== "" && elem.attachment_id !== "id") {
        const send = buttons.fixingBtn(elem._id);
        send.caption = `Дефект під номером: ${elem._id}\nКімната: ${elem.room}\nОпис пошкодження ${elem.title}`;
        ctx.replyWithPhoto(elem.attachment_id, send);
      } else {
        ctx.replyWithHTML(
          `Дефект під номером ${elem._id}\n
           Кімната: <b><i>${elem.room}</i></b>\n
           Опис пошкодження <b><i>${elem.title}</i></b>`,
          buttons.fixingBtn(elem._id)
        );
      }
    });
    return details;
  }

  changeDefectStatus(ctx) {
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
        } else {
          console.log(err);
        }
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
      } else if (this.status === "solved") {
        ctx.reply("Бажаєте ввести причину закриття", buttons.yesNoKeyboard());
      }
    });
  }
}

module.exports = Render;
