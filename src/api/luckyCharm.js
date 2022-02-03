import server from "../utils/server"

/**
 * 查询装小鲤的设置
 */
export function getLuckyCharmSet() {
    return server({
        url: "/activityManage/selectAll",
        method: "get"
    })
}

/**
 * 修改装小鲤设置
 * @param {*} obj { "content": "", "effectiveEndTime":"", "effectiveStartTime":"" , "headImage": "", "image": "", "isPublic": 0, "title": ""}
 */
export function saveOrUpdateLuckyCharmSet(obj) {
    return server({
        url: "/activityManage/saveOrUpdate",
        method: "post",
        data: obj
    })
}

/**
 * 查询锦小鲤活动列表
 * @param {*} obj {userPhone:"",startTime:"",endTime:"",pageNo:1,pageSize:20}
 */
export function luckyKoiSelectList(obj) {
    return server({
        url: "/koi/selectList",
        method: "post",
        params: obj
    })
}


/**
 * 通过id查询投票详情
 * @param {*} obj {id:"",pageNo:1,pageSize:20}
 */
export function koiSelectVoteDetailById(obj) {
    return server({
        url: "/koi/selectVoteDetailById",
        method: "post",
        params: obj
    })
}

/**
 * 通过id查询单条装小鲤数据
 * @param {*} id 
 */
export function koiSelectById(id) {
    return server({
        url: "/koi/selectById",
        method: "get",
        params: { id }
    })
}

/**
 * 设置心愿是否显示
 * @param {*} id 
 */
export function koiOperationDisplay(id) {
    return server({
        url: "/koi/operationDisplay",
        method: "get",
        params: { id }
    })
}

/**
 * 修改心愿
 * @param {*} obj 
 */
export function koiUpdate(obj) {
    return server({
        url: "/koi/update",
        method: "post",
        data: obj
    })
}

/**
 * 通过id查询活动
 * @param {String} id 活动id
 */
export function getActivityById(id) {
    return server({
        url: "/activityManage/selectById",
        method: "get",
        params: { id }
    })
}