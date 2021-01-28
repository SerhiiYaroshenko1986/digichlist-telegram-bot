const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();
const Requests = require("./utils");
const serviceRequest = new Requests();
class Render {
  defect_id = "";
  payload = {};
  status = "";
  getDefectsTemplate(ctx, defects, actionTriger) {
    const details = defects.map((elem) => {
      actionTriger.push(`${elem._id},fixing`);
      actionTriger.push(`${elem._id},solved`);
      if (elem.attachment_id !== "" && elem.attachment_id !== "id") {
        ctx.replyWithMediaGroup([
          {
            type: "photo",
            media: elem.attachment_id,
          },
        ]);
        ctx.replyWithHTML(
          `Дефект під номером <b><i>${elem._id}</i></b>\n
           Кімната: <b><i>${elem.room}</i></b>\n
           Опис пошкодження <b><i>${elem.title}</i></b>`,
          buttons.detailsBtn(elem._id)
        );

        // ctx.replyWithPhoto({
        //   photo: elem.attachment_id,
        //   caption: `Дефект під номером <b><i>${elem._id}</i></b>\n
        // Кімната: <b><i>${elem.room}</i></b>\n
        // Опис пошкодження <b><i>${elem.title}</i></b>`,
        //   reply_markup: buttons.detailsBtn(elem._id),
        // });
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
      ctx.replyWithHTML(
        `Дефект під номером ${elem._id}\n
         Кімната: <b><i>${elem.room}</i></b>\n
         Опис пошкодження ${elem.title}`,
        buttons.fixingBtn(elem._id)
      );
      if (elem.attachment_id !== "" && elem.attachment_id !== "id") {
        ctx.replyWithMediaGroup([
          {
            type: "photo",
            media: elem.attachment_id,
          },
        ]);
      }
    });
    return details;
  }

  changeDefectStatus(ctx) {
    serviceRequest
      .updateDefectStatus(this.defect_id, this.payload)
      .then((res) => {
        if (res.data.response === "ok") {
          const changeStatus =
            this.payload.status === "fixing" ? "в роботі" : "закритий";
          ctx.replyWithHTML(
            `Статус дефекту  успішно змінено на <b>${changeStatus}</b>`
          );
        }
      })
      .catch((err) => {
        if (
          err.response.data.message ===
          "This user is not in a position to update the defect information"
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
      if (this.status === "fixing") {
        this.changeDefectStatus(ctx);
      } else if (this.status === "solved") {
        ctx.reply("Бажаєте ввести причину закриття", buttons.yesNoKeyboard());
      }
    });
  }
}

module.exports = Render;
