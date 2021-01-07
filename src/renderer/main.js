import Vue from 'vue';
import axios from 'axios';
import QS from 'qs';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import log4js from "log4js";

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.prototype.$http = axios;

Vue.prototype.qs = QS;

Vue.config.productionTip = false;
log4js.configure({
  appenders: {frakta: {type: 'file', filename: __dirname + '/static/frakta.log', layout: {type: "pattern", pattern: "[%d] [%p] %c - %m%n"}}},
  categories: {default: {appenders: ['frakta'], level: 'info'}},
});

// let dst = "/Users/oliver/Desktop/log"
const dst = "/home/dntech";
const fs = require("fs");
fs.exists(dst, function(exists) {
  if (exists) {
  } else {
    fs.mkdir(dst, function(error) {
      if (error) {
        console.log(error);
        return;
      }
      const path = require("path");
      const detailDirtory = __dirname+'/static';
      const filename = 'frakta.log';
      const sourceFile = path.join(detailDirtory, filename);
      const destPath = path.join(dst, filename);
      const readStream = fs.createReadStream(sourceFile);
      const writeStream = fs.createWriteStream(destPath);
      readStream.pipe(writeStream);
    });
  }
});


Vue.prototype.$logger = log4js.getLogger("frakta");
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>',
}).$mount('#app');
