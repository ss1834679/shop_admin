import server from "../utils/server"

/**
 * 分页查询品牌特卖日信息
 * @param {Number} pageIndex 当前页码
 * @param {Number} pageSize 分页数量
 * @param {String} search 搜索内容
 */
export function getBrandDay(pageIndex, pageSize, search = "") {
    return server({
        url: "/brand-day/page",
        method: "get",
        params: {
            pageIndex, pageSize, search
        }
    })
}
/**
 * 添加品牌特卖日信息
 * @param {*} data brandDay
 */
export function insertBrandDay(data) {
    return server({
        url: "/brand-day/insert/model",
        method: "post",
        data: data
    })
}
/**
 * 修改品牌特卖日信息
 * @param {*} data brandDay,discount,isAll
 */
export function updateBrandDay(data) {
    return server({
        url: "/brand-day/update",
        method: "post",
        data: data
    })
}
/**
 * 修改品牌特卖日是否上线状态
 * @param {String} id 品牌特卖日 id
 */
export function alterBrandDayRecommend(id) {
    return server({
        url: "/brand-day/update/recommend",
        method: "post",
        params: { id }
    })
}
/**
 * 根据ID删除品牌特卖日信息
 * @param {String} id 品牌特卖日 id
 */
export function deleteBrandDay(id) {
    return server({
        url: "/brand-day/delete",
        method: "delete",
        params: { id }
    })
}
/**
 * 品牌活动日添加单品
 * @param {*} data { brandDayGoods:{} ,brandDayItemModelList:[{brandDayItem:{}}] }
 */
export function insertAGood(data) {
    return server({
        url: "/brand-day-goods/insert",
        method: "post",
        data: data
    })
}
/**
 * 分页查询品牌特卖商品信息
 * @param {*} data {brandDayId:"",goodsName:"",pageIndex:1,pageSize:20,status:1`推荐中` 2`不推荐`}
 */
export function getBrandDayGoodsList(data) {
    return server({
        url: "/brand-day-goods/page",
        method: "get",
        params: data
    })
}
/**
 * 修改特卖商品推荐状态
 * @param {String} brandDayGoodsId 特卖商品ID
 */
export function changeBrandDayGood(brandDayGoodsId) {
    let param = new URLSearchParams
    param.append("brandDayGoodsId", brandDayGoodsId)
    return server({
        url: "/brand-day-goods/update/status",
        method: "post",
        params: param
    })
}
/**
 * 根据特卖商品ID查询item信息
 * @param {String} brandDayGoodsId 特卖商品ID
 */
export function getBrandDayGoodsItem(brandDayGoodsId) {
    return server({
        url: "/brand-day-item/list",
        method: "get",
        params: { brandDayGoodsId }
    })
}
/**
 * 根据goodsID查询item信息
 * @param {String} goodsId 商品 Id
 */
export function getGoodsItem(goodsId) {
    return server({
        url: "/goods-item/list/goods",
        method: "get",
        params: { goodsId }
    })
}
/**
 * 修改特卖商品折扣信息
 * @param {*} data 
 */
export function updateBrandDayGood(data) {
    return server({
        url: "/brand-day-goods/update/discount",
        method: "post",
        data: data
    })
}
/**
 * 分页查询涂邦快抢信息
 * @param {*} data {name:"",pageIndex :"",pageSize :""}
 */
export function getFastBuyList(data) {
    return server({
        url: "/fast-buy/page",
        method: "get",
        params: data
    })
}
/**
 * 添加快抢商品信息
 * @param {*} data 快抢信息
 */
export function insertFastBuy(data) {
    return server({
        url: "/fast-buy/insert",
        method: "post",
        data: data
    })
}
/**
 * 根据ID查询快抢商品信息
 * @param {String} id 快抢id
 */
export function getFastBuyById(id) {
    return server({
        url: "/fast-buy/query",
        method: "get",
        params: { id }
    })
}
/**
 * 修改快抢商品的信息
 * @param {*} data 快抢信息
 */
export function updateFastBuy(data) {
    return server({
        url: "/fast-buy/update",
        method: "post",
        data: data
    })
}
/**
 * 根据ID修改快抢商品自动上线状态
 * @param {String} id 快抢id
 */
export function updateFastBuyUp(id) {
    return server({
        url: "/fast-buy/update/up",
        method: "post",
        params: { id }
    })
}
/**
 * 根据ID删除快抢商品信息
 * @param {String} id 快抢id
 */
export function deleteFastBuy(id) {
    return server({
        url: "/fast-buy/delete",
        method: "delete",
        params: { id }
    })
}
/**
 * 获取人气推荐列表
 * @param {*} data {pageNo:"",pageSize:"",status:"",title:""}
 */
export function getPushMassage(data) {
    return server({
        url: "/index/getPushMassageByPage",
        method: "get",
        params: data
    })
}
/**
 * 添加人气推荐
 * @param {*} data 
 */
export function addOrEditPushMassage(data) {
    return server({
        url: "/index/addOrEditPuahMassage",
        method: "post",
        data: data
    })
}
/**
 * 删除人气推荐
 * @param {*} data ids
 */
export function deletePushMassage(data) {
    return server({
        url: "/index/deletePuahMassage",
        method: "post",
        data: data
    })
}
/**
 * 设置/取消 推荐
 * @param {String} id 推荐的id
 * @param {String} status 推荐的状态
 */
export function setPushMassageStatus(id, status) {
    return server({
        url: "/index/setPuahMassage",
        method: "post",
        params: { id, status }
    })
}
/**
 * 根据id查询推荐
 * @param {String} id 推荐的id
 */
export function getPushMassageById(id) {
    return server({
        url: "/index/getPuahMassageById",
        method: "get",
        params: { id }
    })
}