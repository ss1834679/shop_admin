import server from '../utils/server'


/**
 * 分页获取所有的方案
 * @param {*} obj 
 */
export function getAllHouseDetailByPage(obj) {
    return server({
        url: "/house/getAllHouseDetailByPage",
        method: "get",
        params: obj
    })
}


/**
 * 获取方案审核详情
 * @param {*} obj 
 */
export function getApprovalDetail(obj) {
    return server({
        url: "/house/getApprovalDetail",
        method: "get",
        params: obj
    })
}



/**
 * 审核方案
 * @param {*} obj {id:"",msg:"",status:}
 */
export function approvalHouseDetail(obj) {
    return server({
        url: "/house/approvalHouseDetail",
        method: "post",
        data: obj
    })
}


/**
 * 获取所有的户型
 */
export function getAllHouseType() {
    return server({
        url: "/house/getAllHouseType",
        method: "post"
    })
}




/**
 * 添加户型
 * @param {*} obj 
 */
export function addHouseType(obj) {
    return server({
        url: "/house/addHouseType",
        method: "post",
        data: obj
    })
}



/**
 * 获取户型信息
 * @param {*} obj 
 */
export function getHouseType(obj) {
    return server({
        url: "/house/getHouseType",
        method: "get",
        params: obj
    })
}



/**
 * 修改户型信息
 * @param {*} obj 
 */
export function updateHouseType(obj) {
    return server({
        url: "/house/updateHouseType",
        method: "post",
        data: obj
    })
}


/**
 * 显示/不显示方案
 * @param {*} obj 
 */
export function updateStatus(obj) {
    return server({
        url: "/house/updateStatus",
        method: "post",
        data: obj
    })
}


/**
 * 删除户型
 * @param {*} obj 
 */
export function deleteHouseType(obj) {
    return server({
        url: "/house/deleteHouseType",
        method: "post",
        params: obj
    })
}



/**
 * 获取所有前端显示的户型
 */
export function getAllUsableHouseType() {
    return server({
        url: "/house/getAllUsableHouseType",
        method: "post"
    })
}


/**
 * 添加方案
 * @param {*} obj 
 */
export function addHouseDetail(obj) {
    return server({
        url: "/house/addHouseDetail",
        method: "post",
        data: obj
    })
}


/*显示/不显示方案*/
export function isShowHouseDetail(obj) {
    return server({
        url: "/house/isShowHouseDetail",
        method: "post",
        data: obj
    })
}



/*
删除方案*/
export function deleteHouseDetail(obj) {
    return server({
        url: "/house/deleteHouseDetail",
        method: "post",
        data: obj
    })
}

/**
 * 获取方案详情
 * @param {*} id {id:""}
 */
export function getHouseDetailById(id) {
    return server({
        url: "/house/getHouseDetailById",
        method: "get",
        params: id
    })
}



/**
 * 获取需求列表
 * @param {*} obj 
 */
export function getDemandByPage(obj) {
    return server({
        url: "/house/getDemandByPage",
        method: "get",
        params: obj
    })
}


/**
 * 获取操作记录
 * @param {*} obj {id:""}
 */
export function getDemandLog(obj) {
    return server({
        url: "/house/getDemandLog",
        method: "get",
        params: obj
    })
}



/**
 * 更新需求状态
 * @param {*} obj { "contactStatus": 0, "deamndId": "string"}
 */
export function updateContactStatus(obj) {
    return server({
        url: "/house/updateContactStatus",
        method: "post",
        data: obj
    })
}


/**
 * 批量更新需求状态
 * @param {*} obj { "contactStatus": 0, "deamndIds": [] }
 */
export function batchApprovalDemand(obj) {
    return server({
        url: "/house/batchApprovalDemand",
        method: "post",
        data: obj
    })
}