import server from "../utils/server"

/**
 * 商品--商品列表
 * @param {*} statisticsVo {pageNum:1,pageSize:20,sort:"1 金额 2 订单量",goodId:"",title:""}
 */
export function getGoodsStatisticsList(statisticsVo) {
    return server({
        url: "/goodsStatistics/selectGoodsStatisticsList",
        method: "post",
        data: statisticsVo
    })
}

/**
 * 商品列表导出数据
 * @param {*} goodsStatisticsVo {sort:"1 订单量 2 金额",goodId:"",title:""}
 */
export function exportGoodsExcel(goodsStatisticsVo) {
    return server({
        url: "/userStatistics/exportGoodsExcel",
        method: "post",
        data: goodsStatisticsVo,
        responseType: "blob"
    })
}

/**
 * V3.1统计--商品--商品查询单条统计数据
 * @param {*} obj {goodsId:"",startTime:"",endTime:""}
 */
export function getGoodsStatisticsOne(obj) {
    return server({
        url: "/goodsStatistics/selectGoodsStatisticsOne",
        method: "post",
        data: obj
    })
}

/**
 * V3.1统计--商品--PV/UV
 * @param {*} obj {goodsId:"",startTime:"",endTime:""}
 */
export function getGoodsVisitStatistic(obj) {
    return server({
        url: "/goodsStatistics/selectGoodsVisitStatistic",
        method: "post",
        data: obj
    })
}

/**
 * V3.1统计--商品--指标分析订单量
 * @param {*} obj {goodsId:"",startTime:"",endTime:""}
 */
export function getGoodsOrderNumStatistic(obj) {
    return server({
        url: "/goodsStatistics/selectGoodsOrderNumStatistic",
        method: "post",
        data: obj
    })
}

/**
 * V3.1统计--商品--指标分析交易额
 * @param {*} obj {goodsId:"",startTime:"",endTime:""}
 */
export function getGoodsPayNumStatistic(obj) {
    return server({
        url: "/goodsStatistics/selectGoodsPayNumStatistic",
        method: "post",
        data: obj
    })
}

/**
 * 店铺--店铺列表
 * @param {*} statisticsVo {pageNum:1,pageSize:20,sort:"1 金额 2 订单量",supplierName:""}
 */
export function getShopStatisticsList(statisticsVo) {
    return server({
        url: "/shopStatistics/selectShopList",
        method: "post",
        data: statisticsVo
    })
}

/**
 * 店铺列表导出数据
 * @param {*} shopStatisticsDTO {sort:"1 订单量 2 金额",supplierName:""}
 */
export function exportShopExcel(shopStatisticsDTO) {
    return server({
        url: "/userStatistics/exportShopExcel",
        method: "post",
        data: shopStatisticsDTO,
        responseType: "blob"
    })
}

/**
 * V3.1统计--商铺--店铺交易概况
 * @param {*} obj {id:"",endTime:"",startTime:""}
 */
export function getShopTradeStatistic(obj) {
    return server({
        url: "/shopStatistics/selectShopTradeStatistic",
        method: "post",
        data: obj
    })
}

/**
 * V3.1统计--商铺--PV/UV
 * @param {*} obj {id:"",endTime:"",startTime:""}
 */
export function getShopVisitStatistic(obj) {
    return server({
        url: "/shopStatistics/selectShopVisitStatistic",
        method: "post",
        data: obj
    })
}

/**
 * V3.1统计--商铺--新增订单数
 * @param {*} obj {id:"",endTime:"",startTime:""}
 */
export function getNewAddOrderNumStatistic(obj) {
    return server({
        url: "/shopStatistics/selectNewAddOrderNumStatistic",
        method: "post",
        data: obj
    })
}

/**
 * V3.1统计--商铺--支付订单数
 * @param {*} obj {id:"",endTime:"",startTime:""}
 */
export function getPayOrderNumStatistic(obj) {
    return server({
        url: "/shopStatistics/selectPayOrderNumStatistic",
        method: "post",
        data: obj
    })
}