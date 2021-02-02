module.exports = {
  token: process.env.TOKEN,
  url: process.env.URL,
  port: process.env.PORT,
  baseUrl: process.env.BASEURL,
  photoPathUrl: `https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=`,
  photoUrl: `https://api.telegram.org/file/bot${process.env.TOKEN}/`,
  getUpdatesUrl: `https://api.telegram.org/bot${process.env.TOKEN}/getUpdates`,
};
