const TOKEN = "1546937945:AAHk3ilaKrpWIAWhYjDCfFREUcdtyw842O4";

module.exports = {
  token: TOKEN,
  url: "https://digichlist-bot.herokuapp.com",
  port: 3000,
  baseUrl: "https://digichlist-api.herokuapp.com/api/",
  photoPathUrl: `https://api.telegram.org/bot${TOKEN}/getFile?file_id=`,
  photoUrl: `https://api.telegram.org/file/bot${TOKEN}/`,
  getUpdatesUrl: `https://api.telegram.org/bot${TOKEN}/getUpdates`,
};
