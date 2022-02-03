import server from "../utils/server"

/**
 * 查询话题（频道）列表
 * @param {Number} pageNo 当前页码
 * @param {Number} pageSize 每页数量
 */
export function getChannelAll(pageNo, pageSize) {
    return server({
        url: `/circle/selectList`,
        method: "post",
        params: { pageNo, pageSize }
    })
}

/**
 * 操作灵感置顶
 * @param {String} inspirationId 灵感id
 */
export function changeInspirationIsTop(inspirationId) {
    return server({
        url: "/inspiration/operationTop",
        method: "get",
        params: { inspirationId: inspirationId }
    })
}

/**
 * 话题添加或者修改
 * @param {*} channel 添加话题的所有信息
 */
export function insertOrUpdateChannel(channel) {
    return server({
        url: "/circle/saveOrUpdate",
        method: "post",
        data: channel
    })
}
/**
 * 修改话题是否显示
 * @param {String} id 话题的id
 */
export function changeChannelStatus(id) {
    return server({
        url: `/circle/updateStatus/${id}`,
        method: "post"
    })
}
/**
 * 根据id删除话题
 * @param {String} id 话题id
 */
export function deleteChannel(id) {
    return server({
        url: `/circle/deleteById/${id}`,
        method: "put"
    })
}
/**
 * 批量删除话题
 * @param {*} channel {idList:["","",""]} id数组
 */
export function deleteChannelBatch(channel) {
    return server({
        url: "/circle/deleteBatch",
        method: "post",
        data: channel
    })
}
/**
 * 查询文章列表
 * @param {Number} pageNo 当前页数
 * @param {Number} pageSize 每页数量
 * @param {*} search 筛选信息
 */
export function getArticleList(pageNo, pageSize, search) {
    return server({
        url: "/circle/article/selectList",
        method: "post",
        data: {
            "currentPage": 1,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "queryFields": search,
            "rowSrt": 0
        }
    })
}
/**
 * 查询单篇文章
 * @param {String} articleId 文章 id
 */
export function getArticleById(articleId) {
    return server({
        url: `/circle/article/findOne/${articleId}`,
        method: "get"
    })
}
/**
 * 文章添加或者修改
 * @param {*} articleVo 文章的所有信息
 */
export function insertOrUpdateArticle(articleVo) {
    return server({
        url: "/circle/article/saveOrUpdate",
        method: "post",
        data: articleVo
    })
}
/**
 * 删除文章/批量删除文章
 * @param {*} articleVo {articleIdList:[""]}删除的数组
 */
export function deleteArticle(articleVo) {
    return server({
        url: "/circle/article/delete",
        method: "post",
        data: articleVo
    })
}
/**
 * 文章审核
 * @param {*} articleVo 
 */
export function verifyArticle(articleVo) {
    return server({
        url: "/circle/article/verify",
        method: "post",
        data: articleVo
    })
}
/**
 * 
 * @param {Number} pageNo 当前页数
 * @param {Number} pageSize 每页数量
 * @param {*} search 筛选信息
 */
export function getInspirationList(pageNo, pageSize, search) {
    return server({
        url: "/inspiration/selectList",
        method: "post",
        data: {
            "currentPage": 1,
            "pageNo": pageNo,
            "pageSize": pageSize,
            "queryFields": search,
            "rowSrt": 0
        }
    })
}
/**
 * 删除灵感/批量删除
 * @param {Array} arr 删除id数组
 */
export function deleteInspiration(arr) {
    return server({
        url: "/inspiration/delete",
        method: "post",
        data: {
            inspirationIdList: arr
        }
    })
}
/**
 * 灵感添加或者修改
 * @param {*} inspirationVo 灵感的基本信息
 */
export function insertOrUpdateInspiration(inspirationVo) {
    return server({
        url: "/inspiration/saveOrUpdate",
        method: "post",
        data: inspirationVo
    })
}
/**
 * 查询单篇灵感
 * @param {String} inspirationId 灵感id
 */
export function getInspirationById(inspirationId) {
    return server({
        url: `/inspiration/findOne/${inspirationId}`,
        method: "get"
    })
}
/**
 * 灵感审核
 * @param {*} inspirationVo { id:"", state:"", reviewNote:"" }
 */
export function verifyInspiration(inspirationVo) {
    return server({
        url: "/inspiration/verify",
        method: "post",
        data: inspirationVo
    })
}
/**
 * 查询所有审核通过的文章
 * @param {String} title 通过搜索文章的标题来搜索所有文章
 */
export function getArticleListAll(title) {
    return server({
        url: "/circle/selectAll",
        method: "post",
        params: { title: title }
    })
}
/**
 * 查询所有审核通过的灵感
 * @param {String} title 通过搜索文章的标题来搜索所有文章
 */
export function getInspirationListAll(title) {
    return server({
        url: "/inspiration/selectAll",
        method: "post",
        params: { title: title }
    })
}
/**
 * 获取登录用户的设计师信息
 */
export function getDesignerByLogin() {
    return server({
        url: "/designer-info/query/login",
        method: "get"
    })
}
/**
 * 有ID则修改，无ID则添加 设计师信息
 * @param {*} data 设计师信息
 */
export function updateDesignerInfo(data) {
    return server({
        url: "/designer-info/update",
        method: "post",
        data: data
    })
}
