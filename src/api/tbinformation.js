import server from "../utils/server"


/**
 * 查询资讯列表
 * @param {Number} pageNo 当前页码
 * @param {Number} pageSize 每页数量
 *  * @param {Number} search 搜索
 */
export function getAllNewsByPage(obj) {
    return server({
        url: `/index/getAllNewsByPage`,
        method: "get",
        params: obj
    })
}



/**
 * 分页查询资讯审核
 * @param {*}  查询资讯审核的所有信息
 */
export function getAllCheckNews(obj) {
    return server({
        url: "/index/getAllCheckNews",
        method: "get",
        data: obj
    })
}

/**
 * 审核资讯
 * @param {*}  审核资讯
 */
export function approvalNews(obj) {
    return server({
        url: "/index/approvalNews",
        method: "post",
        data: obj
    })
}


/**
 * 根据id删除资讯
 * @param {String} id 资讯id
 */
export function deleteNewsByBatch(obj) {
    return server({
        url: `/index/deleteNewsByBatch`,
        method: "post",
        data: obj
    })
}

/**
 * 添加资讯
 * @param {String} id 资讯id
 */
export function addNews(obj) {
    return server({
        url: `/index/addNews`,
        method: "post",
        data: obj
    })
}

/**
 * 涂邦资讯详情
 * @param {String} id 资讯id
 */
export function getNewDetailBy(obj) {
    return server({
        url: `/index/getNewDetailById`,
        method: "get",
        params: obj
    })
}


/**
 * 编辑资讯
 * @param {String} id 资讯id
 */
export function editNews(obj) {
    return server({
        url: `/index/editNews`,
        method: "post",
        data: obj
    })
}



/**
 * 咨询浏览数增加
 * @param {String} id 资讯id
 */
export function addViews(id) {
    return server({
        url: `/index/addViews`,
        method: "get",
        params: id
    })
}

