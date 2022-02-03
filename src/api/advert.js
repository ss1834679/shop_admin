import advert from '../utils/server'
/* 获取广告列表 */
export function getAdvertList(obj) {
    return advert({
        url: "/advert/getAdvertByPage",
        method: 'get',
        params: obj
    })
}
/* 修改广告 */
export function editAdvert(obj) {
    return advert({
        url: "/advert/editAdvert",
        method: "post",
        data: obj
    })
}
/**
 * 根据id查询广告
 * @param {String} id 广告的id
 */
export function getAdvertById(id) {
    return advert({
        url: "/advert/getAdvertById",
        method: "get",
        params: { id: id }
    })
}
/**
 * 添加广告
 * @param {*} obj 广告的所有参数
 */
export function addAdvert(obj) {
    return advert({
        url: "/advert/addAdvert",
        method: "post",
        data: obj
    })
}
/* 删除广告 */
export function deleteAdvert(obj) {
    return advert({
        url: "/advert/deleteAdvertBatch",
        method: "post",
        data: obj
    })
}
/* 设置置顶 */
export function editIstop(obj) {
    return advert({
        url: "/advert/editIsTopStatus",
        method: "post",
        data: obj
    })
}
/* 设置上线下线 */
export function editIsonline(obj) {
    return advert({
        url: "/advert/editOnlineStatus",
        method: "post",
        data: obj
    })
}