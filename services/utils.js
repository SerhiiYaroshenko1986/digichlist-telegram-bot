const axios = require("axios");
const config = require("config");
const querystring = require("querystring");
const url = require("url");
const imageToBase64 = require("image-to-base64");

class Requests {
  postRequest(url, body) {
    return axios.post(config.baseUrl + url, body);
  }
  isAuth(url, id) {
    return axios.get(`${config.baseUrl}${url}`);
  }
  getPhotoPath(id) {
    return axios.get(config.photoPathUrl + id);
  }
  getPhoto(path) {
    return imageToBase64(config.photoUrl + path);
  }
  getAllDefects(url) {
    return axios.get(config.baseUrl + url);
  }
  getDefectsByDate(url, params) {
    console.log(params);
    return axios.get(config.baseUrl + url, { params: params });
  }
  getDefectsById(url, id) {
    return axios.get(`${config.baseUrl}${url}/${id}`);
  }
  getUpdates() {
    return axios.get(config.getUpdatesUrl);
  }
}

module.exports = Requests;