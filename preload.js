const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");
const os = require("os");
const Toastify = require("toastify-js");
const axios = require("axios");

contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld("Toastify", {
  toast: (options) => Toastify(options).showToast(),
});

contextBridge.exposeInMainWorld("axios", {
  get: (url, config) => axios.get(url, config),
  post: (url, data, config) => axios.post(url, data, config),
  // Add more Axios methods as needed
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});
