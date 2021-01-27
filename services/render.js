const botButtons = require("../keyboards/keyboard");
const buttons = new botButtons();
class Render {
  getDefects(ctx, defects, attachmentId) {
    const details = defects.map((elem) => {
      if (elem.attachment_id !== "") {
        attachmentId.push({
          type: "photo",
          media: elem.attachment_id,
        });
      }
      ctx.replyWithHTML(
        `Дефект під номером ${elem._id}\n
         Кімната: <b><i>${elem.room}</i></b>\n
         Опис пошкодження ${elem.title}`,
        buttons.detailsBtn(elem._id)
      );
    });
    return details;
  }

  // defectsByRoom(defects) {
  //   const rooms = defects.map((elem) => elem.room);
  //   const uniqeRooms = new Set(rooms);
  //   return [...uniqeRooms];
  // }
  // getDefectByRoom(room, ctx, defects, attachmentId) {
  //   const details = defects
  //     .filter((elem) => elem.room === room)
  //     .map((elem, index) => {
  //       if (elem.attachment_id !== "") {
  //         attachmentId.push({
  //           type: "photo",
  //           media: elem.attachment_id,
  //         });
  //       }
  //       return `<i>${index + 1})</i> Опис пошкодження: <b><i>${
  //         elem.title
  //       }</i></b> під номером: ${elem._id}\n`;
  //     })
  //     .join("");
  //   return ctx.replyWithHTML(
  //     `Кімната: <b><i>${room}</i></b>\n${details}`,
  //     buttons.showPhoto()
  //   );
  // }
  // getRooms(rooms, ctx) {
  //   return rooms.map((room) => {
  //     return ctx.replyWithHTML(
  //       `Кімната: <b><i>${room}</i></b>\n`,
  //       buttons.detailsBtn(room)
  //     );
  //   });
  // }
  showPicture(ctx, attachmentId) {
    if (
      attachmentId.every((elem) => elem.media === "") ||
      attachmentId.length === 0
    ) {
      return ctx.reply("Фото відсутні");
    } else {
      return ctx.replyWithMediaGroup(attachmentId);
    }
  }
}

module.exports = Render;
