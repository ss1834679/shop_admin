import server from "../utils/server"

/**
 * 商城看板接口汇总
 */
const DATAAPI = {

    /**
     * 获取入驻商家数
     */
    getEntryBusinesses() {
        return server({
            url: "/mallData/entryBusinesses",
            method: "get"
        })
    },

    /**
     * 获取商品总数
     */
    getGoodsNum() {
        return server({
            url: "/mallData/goodsNum",
            method: "get"
        })
    },

    /**
     * 获取商品销量排行榜数据
     * @param {*} datepick {endDate:"",startDate:""}
     */
    getGoodsSalesRanking(datepick) {
        return server({
            url: "/mallData/goodsSalesRanking",
            method: "get",
            params: datepick
        })
    },

    /**
     * 获取已上架商品数量
     */
    getListingGoodsNum() {
        return server({
            url: "/mallData/listingGoodsNum",
            method: "get"
        })
    },

    /**
     * 订单统计-曲线图
     * @param {*} datepick 
     */
    getOrderStatisticsDiagram(datepick) {
        return server({
            url: "/mallData/orderStatisticsDiagram",
            method: "get",
            params: datepick
        })
    },

    /**
     * 订单统计-本月成交总额
     */
    getOrderTotalTurnoverOfThisMonth() {
        return server({
            url: "/mallData/orderTotalTurnoverOfThisMonth",
            method: "get"
        })
    },

    /**
     * 订单统计-本周成交总额
     */
    getOrderTotalTurnoverThisWeek() {
        return server({
            url: "/mallData/orderTotalTurnoverThisWeek",
            method: "get"
        })
    },

    /**
     * 用户购买力排行榜
     * @param {*} datepick 
     */
    getPurchasingPowerOfUsersRanking(datepick) {
        return server({
            url: "/mallData/purchasingPowerOfUsersRanking",
            method: "get",
            params: datepick
        })
    },

    /**
     * 销售统计-曲线图
     * @param {*} datepick 
     */
    getSalesStatisticsDiagram(datepick) {
        return server({
            url: "/mallData/salesStatisticsDiagram",
            method: "get",
            params: datepick
        })
    },

    /**
     * 销售统计-本月成交总额
     */
    getSalesTotalTurnoverOfThisMonth() {
        return server({
            url: "/mallData/salesTotalTurnoverOfThisMonth",
            method: "get"
        })
    },

    /**
     * 销售统计-本周成交总额
     */
    getSalesTurnoverThisWeek() {
        return server({
            url: "/mallData/salesTurnoverThisWeek",
            method: "get"
        })
    },

    /**
     * 今日客单价
     */
    getTodayCustomerUnitPrice() {
        return server({
            url: "/mallData/todayCustomerUnitPrice",
            method: "get"
        })
    },

    /**
     * 今日新增用户
     */
    getTodayNewUsers() {
        return server({
            url: "/mallData/todayNewUsers",
            method: "get"
        })
    },

    /**
     * 今日支付金额
     */
    getTodayPayMoneyNum() {
        return server({
            url: "/mallData/todayPayMoneyNum",
            method: "get"
        })
    },

    /**
     * 今日支付订单
     */
    getTodayPayOrderNum() {
        return server({
            url: "/mallData/todayPayOrderNum",
            method: "get"
        })
    },

    /**
     * 订单总数
     */
    getTotalOrderNum() {
        return server({
            url: "/mallData/totalOrderNum",
            method: "get"
        })
    },

    /**
     * 成交总额
     */
    getTotalTurnover() {
        return server({
            url: "/mallData/totalTurnover",
            method: "get"
        })
    },

    /**
     * 用户总数
     */
    getTotalUsers() {
        return server({
            url: "/mallData/totalUsers",
            method: "get"
        })
    },

    /**
     * 店铺成交额排行榜
     * @param {*} datepick 
     */
    getTurnoverOfStoresRanking(datepick) {
        return server({
            url: "/mallData/turnoverOfStoresRanking",
            method: "get",
            params: datepick
        })
    },

    /**
     * 待审核商品
     */
    getWaitExamineGoods() {
        return server({
            url: "/mallData/waitExamineGoods",
            method: "get"
        })
    },

    /**
     * 待处理退款
     */
    getWaitHandleRefund() {
        return server({
            url: "/mallData/waitHandleRefund",
            method: "get"
        })
    },

    /**
     * 待处理退货
     */
    getWaitHandleReturn() {
        return server({
            url: "/mallData/waitHandleReturn",
            method: "get"
        })
    },

    /**
     * 待付款订单
     */
    getWaitPayOrder() {
        return server({
            url: "/mallData/waitPayOrder",
            method: "get"
        })
    },

    /**
     * 待发货订单
     */
    getWaitSendOrder() {
        return server({
            url: "/mallData/waitSendOrder",
            method: "get"
        })
    },

    /**
     * 昨日客单价
     */
    getYesterdayCustomerUnitPrice() {
        return server({
            url: "/mallData/yesterdayCustomerUnitPrice",
            method: "get"
        })
    },

    /**
     * 昨日新增用户
     */
    getYesterdayNewUsers() {
        return server({
            url: "/mallData/yesterdayNewUsers",
            method: "get"
        })
    },

    /**
     * 昨日支付金额
     */
    getYesterdayPayMoneyNum() {
        return server({
            url: "/mallData/yesterdayPayMoneyNum",
            method: "get"
        })
    },

    /**
     * 昨日支付订单
     */
    getYesterdayPayOrderNum() {
        return server({
            url: "/mallData/yesterdayPayOrderNum",
            method: "get"
        })
    }
}

export default DATAAPI