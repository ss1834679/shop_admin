import server from '../utils/server'

/**
 * 登录接口
 * @param {*} obj 登录的信息
 */
export function getLogin(obj) {
    return server({
        url: '/shiro/login',
        method: "post",
        params: obj
    })
}
/**
 * 退出登录
 */
export function getLogOut() {
    return server({
        url: "/shiro/logout",
        method: "get"
    })
}