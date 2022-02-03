import server from '../utils/server'
/* 添加商品 */
export function addGood(obj) {
    return server({
        url: '/goods/add',
        method: 'post',
        data: obj,
    })
}
/* 分页查询商品 */
export function getGoodsList(obj) {
    /* 默认的每页数量 */
    obj['pageSize'] = 20
    return server({
        url: '/goods/list',
        method: 'get',
        params: obj
    })
}
/* 获取单个商品 */
export function getGood(obj) {
    return server({
        url: "/goods/get",
        method: "get",
        params: obj
    })
}
/* 修改商品 */
export function updateGood(obj) {
    return server({
        url: "/goods/update",
        method: "post",
        data: obj
    })
}
/* 删除商品 */
export function deleteGoods(obj) {
    return server({
        url: "/goods/delete",
        method: "delete",
        params: obj
    })
}
/* 商品审核 */
export function verifyGood(obj) {
    return server({
        url: '/goods/verify',
        method: "post",
        params: obj
    })
}
/* 获取商品审核信息 */
export function getVerify(obj) {
    return server({
        url: '/goods/getVerify',
        method: 'get',
        params: obj
    })
}
/**
 * 查询所有售后服务信息
 */
export function getAfterSale() {
    return server({
        url: "/after-sale/list/all",
        method: "get"
    })
}
/**
 * 将商品调整为下架状态
 * @param {String} goodsId 商品ID
 */
export function updateGoodDown(goodsId) {
    return server({
        url: "/goods/update/down",
        method: "post",
        params: { goodsId }
    })
}
/**
 * 将商品调整为上架状态
 * @param {String} goodsId 商品ID
 */
export function updateGoodUp(goodsId) {
    return server({
        url: "/goods/update/up",
        method: "post",
        params: { goodsId }
    })
}


/**
 * 将商品调整为上架状态
 * @param {String} goodsId 商品ID
 */
export function getGoodsItem(goodsId) {
    return server({
        url: "/goods-item/list/goods",
        method: "get",
        params: { goodsId }
    })
}

/**
 * 查询所有可用商品风格
 * @param {String} categoryId 一级分类id
 */
export function getAllEnableGoodsStyle(categoryId) {
    return server({
        url: "/goodsStyle/getAllEnableGoodsStyle",
        method: "get",
        params: { categoryId }
    })
}

/**
 * 根据商品一级分类id查询风格
 * @param {String} categoryId 一级分类id
 */
export function getGoodsStyleByCategoryId(categoryId) {
    return server({
        url: "/goodsStyle/getGoodsStyleByCategoryId",
        method: "get",
        params: { categoryId }
    })
}

/**
 * 根据商品风格id查询风格详情
 * @param {String} id 商品风格的id
 */
export function getGoodsStyleById(id) {
    return server({
        url: "/goodsStyle/getGoodsStyleById",
        method: "get",
        params: { id }
    })
}

/**
 * 添加商品风格
 * @param {*} obj 商品风格对象
 */
export function addGoodsStyle(obj) {
    return server({
        url: "/goodsStyle/addGoodsStyle",
        method: "post",
        data: obj
    })
}

/**
 * 编辑商品风格
 * @param {*} obj 商品风格对象
 */
export function editGoodsStyle(obj) {
    return server({
        url: "/goodsStyle/editGoodsStyle",
        method: "post",
        data: obj
    })
}

/**
 * 删除商品风格
 * @param {String} id 商品风格id
 */
export function deleteGoodsStyle(id) {
    return server({
        url: "/goodsStyle/deleteGoodsStyle",
        method: "post",
        data: { id }
    })
}

/**
 * 设置商品风格的显示状态
 * @param {*} obj { id: "", status: 0 不显示 1 显示 }
 */
export function setGoodsStyleShowStatus(obj) {
    return server({
        url: "/goodsStyle/setShowStatus",
        method: "post",
        data: obj
    })
}