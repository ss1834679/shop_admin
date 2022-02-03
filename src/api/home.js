import server from "../utils/server"


/**
 * 优惠精选回显 获取首页入口图片设置
 */
export function getSpecialOffers() {
    return server({
        url: "/specialOffers/find",
        method: "get"
    })
}


/**
 * 优惠精选修改  修改首页入口图片设置
 * @param {*} specialOffersPlates 
 */
export function updateSpeciaOffers(specialOffersPlates) {
    return server({
        url: "/specialOffers/update",
        method: "post",
        data: specialOffersPlates
    })
}

/**
 * 查询首页设置（首页设置）
 */
export function getHomeIndexSet() {
    return server({
        url: "/indexSettings/selectOne",
        method: "post"
    })
}

/**
 * 通过标题模糊查询活动（首页设置）
 */
export function getActivityName(title) {
    return server({
        url: "/activityManage/selectByTitle",
        method: "get",
        params: { title }
    })
}

/**
 * 添加或者修改设置（首页设置）
 */
export function addChangeSet(changeObj) {
    return server({
        url: "/indexSettings/saveOrUpdate",
        method: "post",
        data: changeObj
    })
}

/**
 * 通过类型查询通过审核可用的下拉列表
 * @param {String} title 需要查询的标题
 * @param {Number} type 1 商品 2 文章 3 案例 4 拼团商品 5 活动
 */
export function getListByTypeTitle(title, type) {
    return server({
        url: "/indexSettings/selectActivityByTypeAndTitle",
        method: "get",
        params: { title, type }
    })
}