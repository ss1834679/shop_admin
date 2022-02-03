import server from '../utils/server'

/**
 * 消息
 * @param {*} obj 查询消息类型列表
 */
export function selectMessageTypeList() {
    return server({
        url: '/message/selectMessageTypeList',
        method: "get",
    })
}


/**
 * 消息模板添加或者修改
 */
export function saveOrUpdate(obj) {
    return server({
        url: "/message/saveOrUpdate",
        method: "post",
        data:obj
    })
}

/**
 * 查询消息列表
 */
export function selectList(obj) {
    return server({
        url: "/message/selectList",
        method: "post",
        data: obj
    })
}



/**
 * 查询单条数据
 */
export function findOne(obj) {
    return server({
        url: "/message/findOne",
        method: "post",
        data: obj
    })
}



/**
 *
是否发送
 */
export function isPush(obj) {
    return server({
        url: "/message/isPush",
        method: "post",
        data: obj
    })
}





/**
 *
查询所有订阅号模板消息

 */
export function subTemplateSelectList(obj) {
    return server({
        url: "/subTemplate/selectList",
        method: "post",
        data: obj
    })
}



/**
 *
添加订阅号模板消息

 */
export function subTemplateSaveOrUpdate(obj) {
    return server({
        url: "/subTemplate/saveOrUpdate",
        method: "post",
        data: obj
    })
}



/**
 *
查询单个订阅号模板消息

 */
export function subTemplateSelectById(obj) {
    return server({
        url: "/subTemplate/selectById",
        method: "get",
        params: obj
    })
}


/**
 *
删除订阅号模板消息

 */
export function subTemplateDelete(obj) {
    return server({
        url: "/subTemplate/delete",
        method: "post",
        params: obj
    })
}



/**
 *
查询单个app消息

 */
export function selectModeByModeId(obj) {
    return server({
        url: `/message/findOne`,
        method: "post",
        data: obj
    })
}
