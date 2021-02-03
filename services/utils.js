const axios = require("axios");
const config = require("../config/keys.config");
const imageToBase64 = require("image-to-base64");

class Requests {
  postRequest(url, body) {
    return axios.post(config.baseUrl + url, body);
  }
  getPosition(position) {
    return axios.get(`${config.baseUrl}user/getByPosition/${position}`);
  }
  isAuth(url) {
    return axios.get(`${config.baseUrl}${url}`);
  }
  getPhotoPath(id) {
    return axios.get(config.photoPathUrl + id);
  }
  getPhoto(path) {
    return imageToBase64(config.photoUrl + path);
  }
  getAllEntities(url) {
    return axios.get(config.baseUrl + url);
  }
  getDefectsByQuery(url, params) {
    return axios.get(config.baseUrl + url, { params: params });
  }
  getDefectsById(url, id) {
    return axios.get(`${config.baseUrl}${url}/${id}`);
  }
  getUpdates() {
    return axios.get(config.getUpdatesUrl);
  }
  updateDefectStatus(id, body) {
    return axios.patch(config.baseUrl + "defect/update/" + id, body);
  }
  postChecklist(url, body) {
    return axios.post(config.baseUrl + url, body);
  }
  updateOrderStatus(id, body) {
    return axios.patch(config.baseUrl + "order/update/" + id, body);
  }
}

module.exports = Requests;
