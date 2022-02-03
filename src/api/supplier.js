import server from '../utils/server'

export function getSupplier(obj) {
    return server({
        url: '/supplier/list',
        method: 'get',
        params: obj
    })
}
export function getSupplierById(obj) {
    return server({
        url: '/supplier/get',
        method: "get",
        params: obj
    })
}
export function updateSupplier(obj) {
    return server({
        url: '/supplier/update',
        method: 'put',
        data: obj
    })
}
export function addSupplier(obj) {
    return server({
        url: '/supplier/add',
        method: 'post',
        params: obj
    })
}
/**
 * 获取所有供应商的id和名称
 */
export function getSupplierAll() {
    return server({
        url: "/supplier/list/all",
        method: "get"
    })
}
/**
 * 供应商删除商品信息
 * @param {String} idStr 商品id
 */
export function deleteGoodBySup(idStr) {
    return server({
        url: "/goods/supplier/delete",
        method: "delete",
        params: { idStr }
    })
}
/**
 * 供应商添加商品信息
 * @param {*} data 商品的信息
 */
export function insertGoodBySup(data) {
    return server({
        url: "/goods/supplier/insert",
        method: "post",
        data: data
    })
}
/**
 * 供应商查询商品信息
 * @param {*} data 筛选信息
 */
export function getGoodsListBySup(data) {
    return server({
        url: "/goods/supplier/list",
        method: "get",
        params: data
    })
}
/**
 * 供应商获取单个商品信息
 * @param {String} goodsId 商品id
 */
export function getGoodByIdSup(goodsId) {
    return server({
        url: "/goods/supplier/query",
        method: "get",
        params: { goodsId }
    })
}
/**
 * 供应商修改商品信息
 * @param {*} data 商品信息
 */
export function updateGoodBySup(data) {
    return server({
        url: "/goods/supplier/update",
        method: "post",
        data: data
    })
}
/**
 * 供应商添加发货地址信息
 * @param {*} data 地址信息
 */
export function insertAddressSup(data) {
    return server({
        url: "/sys/address/insert",
        method: "post",
        data: data
    })
}
/**
 * 供应商修改发货地址信息
 * @param {*} data 地址信息
 */
export function updateAddressSup(data) {
    return server({
        url: "/sys/address/update",
        method: "post",
        data: data
    })
}
/**
 * 根据登录的供应商信息获取所有地址信息
 */
export function getAddressList() {
    return server({
        url: "/sys/address/list",
        method: "get"
    })
}
/**
 * 根据ID获取地址信息
 * @param {String} id 地址id
 */
export function getAddressById(id) {
    return server({
        url: "/sys/address/query",
        method: "get",
        params: { id }
    })
}
/**
 * 根据ID删除地址信息
 * @param {String} id 地址id
 */
export function deleteAddressSup(id) {
    return server({
        url: "/sys/address/delete",
        method: "delete",
        params: { id }
    })
}