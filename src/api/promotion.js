import server from '../utils/server'
/* 优惠 */

/**
 * 分页查询
 * @param {*} data 查询的筛选条件
 */
export function getCouponList(data) {
    return server({
        url: "/coupon/getCouponListByPage",
        method: "get",
        params: data
    })
}
/**
 * 根据id查询优惠券详情
 * @param {String} id 优惠券id
 */
export function getCouponById(id) {
    return server({
        url: "/coupon/getCouponInfoById",
        method: "get",
        params: { id }
    })
}
/**
 * 获取编辑页面数据
 * @param {String} couponId 优惠券id
 */
export function getCouponEditById(couponId) {
    return server({
        url: "/coupon/getEditPageByCouponId",
        method: "get",
        params: { couponId }
    })
}
/**
 * 查询优惠券的领取记录
 * @param {*} data {couponId:"",pageNo:1,pageSize:20,orderId:"",status:""}
 */
export function getReceiveList(data) {
    return server({
        url: "/coupon/getReceiveListByPage",
        method: "get",
        params: data
    })
}
/**
 * 添加/编辑优惠券
 * @param {*} data 优惠券的信息
 */
export function addOrEditCoupon(data) {
    return server({
        url: "/coupon/addOrEditCoupon",
        method: "post",
        data: data
    })
}
/**
 * 删除优惠券
 * @param {Array} ids 优惠券id数组
 */
export function deleteCouponById(ids) {
    return server({
        url: "/coupon/deleteCoupon",
        method: "post",
        data: ids
    })
}
/**
 * 添加拼团商品
 * @param {*} data 
 */
export function assembleGoodsAdd(data) {
    return server({
        url: "/assembleGoods/add",
        method: "post",
        data: data
    })
}
/**
 * 修改拼团商品
 * @param {*} data 
 */
export function updateAssembleGood(data) {
    return server({
        url: "/assembleGoods/update",
        method: "post",
        data: data
    })
}
/**
 * 通过id获取拼团商品
 * @param {String} goodsId 拼团商品id
 */
export function getAssembleGoodsById(goodsId) {
    return server({
        url: "/assembleGoods/get",
        method: "get",
        params: { goodsId }
    })
}
/**
 * 查询拼团商品
 * @param {*} data 
 */
export function getAssembleGoods(data) {
    return server({
        url: "/assembleGoods/list",
        method: "get",
        params: data
    })
}
/**
 * 删除拼团商品
 * @param {String} idStr 拼团商品id
 */
export function deleteAssembleGoods(idStr) {
    return server({
        url: "/assembleGoods/delete",
        method: "delete",
        params: { idStr }
    })
}
/**
 * 拼团商品审核
 * @param {*} data 审核信息
 */
export function verifyAssembleGoods(data) {
    return server({
        url: "/assembleGoods/verify",
        method: "post",
        params: data
    })
}

/**
 * 获取审核信息
 * @param {String} id 商品id
 */
export function getVerifyAssembleGoods(id) {
    return server({
        url: "/assembleGoods/getVerify",
        method: "get",
        params: { id }
    })
}

/**
 * 将拼团商品调整为下架状态
 * @param {String} goodsId 拼团商品ID
 */
export function updateAssembleGoodDown(goodsId) {
    return server({
        url: "/assembleGoods/update/down",
        method: "post",
        params: { goodsId }
    })
}

/**
 * 将拼团商品调整为上架架状态
 * @param {String} goodsId 拼团商品ID
 */
export function updateAssembleGoodUp(goodsId) {
    return server({
        url: "/assembleGoods/update/up",
        method: "post",
        params: { goodsId }
    })
}

/**
 * 获取拼团设置详情
 */
export function getAssembleSetInfo() {
    return server({
        url: "/assembleSet/info",
        method: "get"
    })
}

/**
 * 拼团设置修改
 * @param {*} assembleSet 拼团设置
 */
export function updateAssembleSet(assembleSet) {
    return server({
        url: "/assembleSet/update",
        method: "post",
        data: assembleSet
    })
}

/**
 * 团单列表查询
 * @param {*} assembleManagePage 筛选条件
 */
export function getAssembleManagePage(assembleManagePage) {
    return server({
        url: "/assembleManage/page",
        method: "post",
        data: assembleManagePage
    })
}

/**
 * 获取团队那详情
 * @param {String} assembleId 团单id
 */
export function getAssembleInfoById(assembleId) {
    return server({
        url: "/assembleManage/info",
        method: "post",
        params: { assembleId }
    })
}

/**
 * 查询活动管理列表
 * @param {*} data {title:"",activityStatus:"活动状态1，未开始；2，进行中；3，已结束",endTime:"",startTime:""}
 */
export function getNewActivityPage(data) {
    return server({
        url: "/newActivity/selectList",
        method: "post",
        data: data
    })
}

/**
 * 设置活动可用
 * @param {String} id 活动id
 */
export function setNewActivityStatus(id) {
    return server({
        url: "/newActivity/operateActivity",
        method: "put",
        params: { id }
    })
}

/**
 * 添加或者修改 活动
 * @param {*} data {title:"",endTime:"",startTime:"",headImg:"",backgroundImg:"",displayStatus:"排行榜 0 不显示;1 显示",signForm:"",sameUser:"",perUser:"",perPersonPerDay:"",rule:""}
 */
export function editNewActivity(data) {
    return server({
        url: "/newActivity/saveOrUpdate",
        method: "post",
        data: data
    })
}

/**
 * 通过id查询活动
 * @param {String} id 活动id
 */
export function getNewActivityById(id) {
    return server({
        url: "/newActivity/selectById",
        method: "get",
        params: { id }
    })
}

/**
 * 查询当前活动详情列表
 * @param {*} data {accountNum:"用户账号",markStatus:"标记状态 0 不标记;1 标记",newActivityId:"",pageNo:"",pageSize:""}
 */
export function getNewActivityUserRegisterList(data) {
    return server({
        url: "/newActivity/selectUserRegisterList",
        method: "post",
        data: data
    })
}

/**
 * 详情数据列表设置显示状态
 * @param {String} id 详情id
 */
export function setNewActivityDisplayStatus(id) {
    return server({
        url: "/newActivity/operateUserRegisterDisplayStatus",
        method: "put",
        params: { id }
    })
}

/**
 * 详情数据列表设置标记状态
 * @param {String} id 详情id
 */
export function setNewActivityMarkStatus(id) {
    return server({
        url: "/newActivity/operateUserRegisterMarkStatus",
        method: "put",
        params: { id }
    })
}

/**
 * 导出
 * @param {*} data {accountNum:"",newActivityId:"",markStatus:""}
 */
export function exportNewActivityExcel(data) {
    return server({
        url: "/newActivity/exportUserRegisterExcel",
        method: "post",
        data: data,
        responseType: "blob"
    })
}

/**
 * 通过活动id查询当前活动详情
 * @param {String} id 
 */
export function getNewActivityDetailById(activityId) {
    return server({
        url: "/newActivity/selectActivityDetailById",
        method: "get",
        params: { activityId }
    })
}

/**
 * 活动详情列表表单入口
 * @param {String} id 详情id
 */
export function getNewActivityUserRegisterById(id) {
    return server({
        url: "/newActivity/selectUserRegisterById",
        method: "get",
        params: { id }
    })
}

/**
 * 活动详情表单修改
 * @param {*} data 
 */
export function updateNewActivityUserRegister(data) {
    return server({
        url: "/newActivity/updateUserRegister",
        method: "post",
        data: data
    })
}

/**
 * 查询落地页配置
 */
export function getLandingEntranceConfig() {
    return server({
        url: "/landingEntrance/selectAll",
        method: "get"
    })
}

/**
 * 修改落地页配置
 * @param {*} data {title:"页面标题",activityImg:"背景海报",detailVOList:[activityId:"",activityStatus:"",entranceImg:""]}
 */
export function addOrUpDateLandingEntrance(data) {
    return server({
        url: "/landingEntrance/saveOrUpdate",
        method: "post",
        data: data
    })
}

/**
 * 通过标题模糊查询活动
 * @param {String} title 活动标题
 */
export function getNewActivityByTitle(title) {
    return server({
        url: "/newActivity/selectByTitle",
        method: "get",
        params: { title }
    })
}

/**
 * 投票详情列表接口查询
 * @param {*} data {id:"",pageNo:1,pageSize:20}
 */
export function getVoteNumList(data) {
    return server({
        url: "/newActivity/selectVoteListByUserRegisterId",
        method: "post",
        data: data
    })
}