import server from '../utils/server'
/* 分销 */

/**
 * 获取提现设置
 */
export function getCashOutSet() {
    return server({
        url: "/cashOut/selectAll",
        method: "post"
    })
}

/**
 * 提现设置添加或者修改
 * @param {*} obj {"agreement": "", "id": "", "requirement": 0, "rule": ""}
 */
export function saveOrUpdateCashOut(obj) {
    return server({
        url: "/cashOut/saveOrUpdate",
        method: "post",
        data: obj
    })
}

/**
 * 获取分销设置
 */
export function getRetailStoreSet() {
    return server({
        url: "/retailStore/selectAll",
        method: "post"
    })
}

/**
 * 分销设置添加或者修改
 * @param {*} obj {"agreement": "", "id": "", "requirement": 0, "rule": ""}
 */
export function saveOrUpdateRetailStore(obj) {
    return server({
        url: "/retailStore/saveOrUpdate",
        method: "post",
        data: obj
    })
}

/**
 * 查询分销团长
 * @param {*} obj {pageIndex:1,pageSize:20,endTime:"",startTime:"",nickname:"",phone:""}
 */
export function getGroupCommanderPage(obj) {
    return server({
        url: "/group/v1/page/commander",
        method: "get",
        params: obj
    })
}

/**
 * 查询分销团队团员
 * @param {*} obj {id:"团长id",pageIndex:1,pageSize:20,endTime:"",startTime:"",nickname:"",phone:""}
 */
export function getGroupMemberPage(obj) {
    return server({
        url: "/group/v1/page/member",
        method: "get",
        params: obj
    })
}

/**
 * 查看业绩明细
 * @param {*} obj {id:"用户id",pageIndex:1,pageSize:20,endTime:"",startTime:"",orderSn:"订单编号",performanceStatus:"业绩状态"}
 */
export function getGroupPerformance(obj) {
    return server({
        url: "/group/v1/page/performance",
        method: "get",
        params: obj
    })
}

/**
 * 分销用户详情
 * @param {String} id 用户id
 */
export function getGroupMemberDetail(id) {
    return server({
        url: "/group/v1/query/member/detail",
        method: "get",
        params: { id }
    })
}

/**
 * 查询提现列表
 * @param {*} obj {pageIndex:1,pageSize:20,endTime:"",startTime:"",status:1审核状态,phone:"用户账号"}
 */
export function getExtractList(obj) {
    return server({
        url: "/extract/v1/page/list",
        method: "get",
        params: obj
    })
}

/**
 * 查询提现审核详情
 * @param {String} id 提现id
 */
export function getExtractAuditDetail(id) {
    return server({
        url: "/extract/v1/query/audit/detail",
        method: "get",
        params: { id }
    })
}

/**
 * 查询审核失败原因
 * @param {String} id 提现id
 */
export function getExtractFailMsg(id) {
    return server({
        url: "/extract/v1/query/fail/msg",
        method: "get",
        params: { id }
    })
}

/**
 * 提现审核
 * @param {*} obj {id:"提现id",mark:"审核备注",status:"审核状态 1通过，-1拒绝"}
 */
export function updateExtractAudit(obj) {
    return server({
        url: "/extract/v1/update/audit",
        method: "patch",
        params: obj
    })
}

/**
 * 
 * @param {*} data {pageIndex:1,pageSize:20,endTime:"",startTime:"",nickname:"",phone:"用户账号"}
 */
export function getSubunderwritingList(data) {
    return server({
        url: "/subunderwriting/v1/page/list",
        method: "get",
        params: data
    })
}


/**
 * 备注
 * @param {*} performanceMark { "id": "", "mark": "" }
 */
export function updatePerformanceMark(performanceMark) {
    return server({
        url: "/performance/updateMark",
        method: "post",
        data: performanceMark
    })
}