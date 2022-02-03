import server from '../utils/server'

/**
 * 获取用户列表
 * @param {*} obj 
 */
export function getUserList(obj) {
    return server({
        url: `/adminsUsers/getUserList`,
        method: "get",
        params: obj
    })
}




/**
 * 用户详情个人信息
 *
 * @param {*} obj 
 */
export function userDetailPersonInfo(obj) {
    return server({
        url: `/adminsUsers/userDetailPersonInfo`,
        method: "get",
        params: obj
    })
}




/**
 *
用户列表编辑资料
 *
 * @param {*} obj 
 */
export function update_userInfo(obj) {
    return server({
        url: `/adminsUsers/update_userInfo`,
        method: "post",
        data: obj
    })
}






/**
 *

用户详情统计信息
 *
 * @param {*} obj 
 */
export function userDetailPersonStatisticsInfo(user_id) {
    return server({
        url: `/adminsUsers/userDetailPersonStatisticsInfo`,
        method: "GET",
        params: {
            user_id
        }
    })
}





/**
 *

用户地址信息
 *
 * @param {*} obj 
 */
export function userDeliveryAddress(user_id) {
    return server({
        url: `/adminsUsers/userDeliveryAddress`,
        method: "GET",
        params: {
            user_id
        }
    })
}




/**
 *

用户登录日志
 *
 * @param {*} obj 
 */
export function findLandingLog(obj) {
    return server({
        url: `/adminsUsers/findLandingLog`,
        method: "GET",
        params: obj
    })
}



/**
 *

用户登录日志
 *
 * @param {*} obj 
 */
export function deleteUser(obj) {
    return server({
        url: `/adminsUsers/deleteUser`,
        method: "post",
        data: obj
    })
}


/**
 *

用户是否禁用
 *
 * @param {*} obj 
 */
export function setUserEnable(obj) {
    return server({
        url: `/adminsUsers/setUserEnable`,
        method: "post",
        data: obj
    })
}




/**
 *

用户标签

 *
 * @param {*} obj 
 */
export function getUserTagList() {
    return server({
        url: `/adminsUsers/getUserTagList`,
        method: "get"
    })
}


/**
 *

添加用户标签

 *
 * @param {*} obj 
 */
export function addUserTag(obj) {
    return server({
        url: `/adminsUsers/addUserTag`,
        method: "post",
        data: obj
    })
}



/**
 *

删除用户标签

 *
 * @param {*} obj 
 */
export function deleteUserTag(obj) {
    return server({
        url: `/adminsUsers/deleteUserTag`,
        method: "post",
        data: obj
    })
}


/**
 *

编辑用户标签

 *
 * @param {*} obj 
 */
export function editUserTag(obj) {
    return server({
        url: `/adminsUsers/editUserTag`,
        method: "post",
        data: obj
    })
}



/**
 *

用户详情订单记录

 *
 * @param {*} obj 
 */
export function userDeliOrders(obj) {
    return server({
        url: `/adminsUsers/userDeliOrders`,
        method: "get",
        params: obj
    })
}


/**
 *
分页查询优惠卷

 *
 * @param {*} obj 
 */
export function getCouponListByPage(obj) {
    return server({
        url: `/coupon/getCouponListByPage`,
        method: "get",
        params: obj
    })
}


/**
 *
系统赠送优惠券

 *
 * @param {*} obj 
 */
export function systemGiveCoupon(obj) {
    return server({
        url: `/coupon/systemGiveCoupon`,
        method: "post",
        data: obj
    })
}



/**
 * 购买力筛选
 * @param {*} obj {averagePrice:"",days:1,shoppingMoney:'',shoppingNum:"",shoppingSort:"",userTag:"",vipGrade:""}
 */
export function getUserListByPower(obj) {
    return server({
        url: "/adminsUsers/shoppingPowerFilter",
        method: "post",
        params: obj
    })
}

/**
 * V3.1统计--用户--用户列表
 * @param {*} data {pageNum: 0,pageSize: 0,nickname:"",phone:"",endNum:0,startNum:0,endPrice:0,startPrice:0,startTime:"",endTime:"",sort:"1 订单量 2 消费额"}
 */
export function getUserStatisticsList(data) {
    return server({
        url: "/userStatistics/selectUserList",
        method: "post",
        data: data
    })
}

/**
 * V3.1统计--用户--用户列表导出数据
 * @param {*} data {nickname:"",phone:"",endNum:0,startNum:0,endPrice:0,startPrice:0,startTime:"",endTime:"",sort:"1 订单量 2 消费额"}
 */
export function exportUserExcel(data) {
    return server({
        url: "/userStatistics/exportUserExcel",
        method: "post",
        data: data,
        responseType: "blob"
    })
}

/**
 * V3.1统计--用户--成交订单列表
 * @param {*} data {userId:"",pageNum:0,pageSize:20}
 */
export function getUserDealOrderList(data) {
    return server({
        url: "/userStatistics/selectDealOrderList",
        method: "post",
        data: data
    })
}

/**
 * V3.1统计--用户--下单商品列表
 * @param {*} data {userId:"",pageNum:0,pageSize:20}
 */
export function getUserOrderGoodsList(data) {
    return server({
        url: "/userStatistics/selectOrderGoodsList",
        method: "post",
        data: data
    })
}

/**
 * V3.1统计--用户--浏览记录列表
 * @param {*} data {userId:"",pageNum:0,pageSize:20}
 */
export function getUserViewRecordsList(data) {
    return server({
        url: "/userStatistics/selectViewRecordsList",
        method: "post",
        data: data
    })
}