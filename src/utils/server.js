import axios from 'axios'
import { Message } from "element-ui"
import router from "../router"
import vue from "../main"

/* 定义遮罩层变量 */
let Loading = null

/**
 * 全局请求
 * 在请求create的时候浏览器的所有数据都还没有装载好 所以这里不能配置动态的数据 只能配置静态的数据
 */
const server = axios.create({
    baseURL: process.env.VUE_APP_SERVER
})

server.interceptors.request.use(config => {
    // 在发送请求之前加请求头
    // Loading = vue.$loading({
    //     lock: true,
    //     text: "请求中",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.7)"
    // })
    config.headers["Authorization"] = localStorage.getItem("reqHeaders")
    return config;
}, function (error) {
    // 请求错误
    Message.error(`请联系管理员! 错误提示:${error}`)
    return Promise.reject(error);
});

server.interceptors.response.use(response => {
    /* 响应正确 */
    // if (response.data.status == 202) {
    //     if (router.history.current.name != "login") {
    //         let routeUrl = router.resolve({ name: 'login', query: { type: "reLogin" } });
    //         window.open(routeUrl.href, "_blank")
    //     }
    //     localStorage.setItem("loginState", "false")
    //     localStorage.removeItem("reqHeaders")
    // }
    // if (response.data.status == 203) {
    //     Message.error(`权限不足`)
    // }
    /* 关闭遮罩层 */
    Loading.close()
    return response
}, error => {
    /* 关闭遮罩层 */
    Loading.close();
    if (error && error.response) {
        /* 响应错误 */
        Message.error(`请联系管理员! 错误提示:${error.response.data.error}  ${error.response.data.path}`)
    } else {
        /* 其他错误 */
        Message.error("遇到错误了！联系管理员")
    }
})

export default server;