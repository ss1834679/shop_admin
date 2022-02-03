import axios from 'axios'
import { Message } from 'element-ui';
import vue from "../main"

/* 定义遮罩层变量 */
let Loading = null

const pay = axios.create({
    baseURL: process.env.VUE_APP_PAY
})

pay.interceptors.request.use(config => {
    Loading = vue.$loading({
        lock: true,
        text: "请求中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
    })
    return config;
}, function (error) {
    // 请求错误
    Message.error(`请联系管理员! 错误提示:${error}`)
    return Promise.reject(error);
});

pay.interceptors.response.use(response => {
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

export default pay;
