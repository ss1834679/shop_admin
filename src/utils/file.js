import axios from 'axios'
import { Message } from 'element-ui';

const file = axios.create({
    baseURL: process.env.VUE_APP_FILE
})

file.interceptors.request.use(config => {
    // 在发送请求之前加请求头
    return config;
}, function (error) {
    // 请求错误
    Message.error(`请联系管理员! 错误提示:${error}`)
    return Promise.reject(error);
});

file.interceptors.response.use(response => {
    return response
}, error => {
    if (error && error.response) {
        /* 响应错误 */
        Message.error(`请联系管理员! 错误提示:${error.response.data.error}  ${error.response.data.path}`)
    } else {
        /* 其他错误 */
        Message.error("遇到错误了！联系管理员")
    }
})

export default file;