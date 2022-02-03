import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import elTableInfiniteScroll from 'el-table-infinite-scroll';

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import WebIM from './utils/WebIM';

Vue.use(mavonEditor)
Vue.use(ElementUI)
Vue.use(elTableInfiniteScroll)
Vue.prototype.imgUrl = 'https://cdn-file.tbzj.net/fileserver/file/'

/**
 * Date格式化
 * @param {String} fmt 格式
 */
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份   
    "d+": this.getDate(),                    //日   
    "h+": this.getHours(),                   //小时   
    "m+": this.getMinutes(),                 //分   
    "s+": this.getSeconds(),                 //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')// 引入提示框和title组件，图例
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')//图例滚动
require('echarts/lib/component/axis')
require('echarts/lib/component/grid')
require('echarts/lib/component/toolbox')
Vue.prototype.$echarts = echarts

router.beforeEach((to, from, next) => {
  if (to.path == "/login" && from.path != "/login") {
    next()
  }
  if (true) { // localStorage.getItem("loginState") == "true"
    if (to.path) {
      store.commit('changePath', to.path.split('/')[1])
    }
    next()
  } else {
    next("/login")
  }
  let matched = to.matched.filter(item => item.path != "");
  if (to.params && to.params.routerTitle) {
    matched.map((item, index, array) => {
      index == array.length - 1 && (item.meta.title = to.params.routerTitle)
      return item
    })
  }
  store.commit("changeBread", matched)
})

Vue.prototype.$checkPhone = (rule, value, callback) => {
  if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error("请输入正确的手机格式"));
  } else {
    callback();
  }
}
Vue.prototype.$checkCardId = (rule, value, callback) => {
  if (
    !/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/.test(
      value
    )
  ) {
    callback(new Error("请输入正确的身份证"));
  } else {
    callback();
  }
}

var vue = new Vue({
  router,
  store,
  WebIM,
  render: h => h(App)
}).$mount('#app')

export default vue