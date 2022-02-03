import server from '../utils/server'
/* 添加分类 */
export function addCategory(obj) {
    return server({
        url: '/category/add',
        method: "post",
        data: obj
    })
}
/* 获取所有分类 */
export function getCategory(obj) {
    return server({
        url: '/category/list',
        method: 'get',
        params: obj
    })
}
/* 通过父级id查分类列表 */
export function getCategoryByPar(obj) {
    return server({
        url: '/category/get',
        method: 'get',
        params: obj
    })
}
/* 修改分类 */
export function updateCategory(obj) {
    return server({
        url: '/category/update',
        method: 'post',
        data: obj
    })
}
/* 删除分类 */
export function deleteCategory(obj) {
    return server({
        url: '/category/delete',
        method: 'delete',
        params: obj
    })
}
/**
 * 获取在首页展示的分类
 */
export function getIndexCategory() {
    return server({
        url: "/category-index/list/category",
        method: "get"
    })
}
/**
 * 修改该分类是否在首页展示
 * @param {String} categoryId 分类id
 * @param {*} sort 分类排序
 */
export function changeIndexCategory(categoryId, sort) {
    return server({
        url: `/category-index/update/${categoryId}/${sort}`,
        method: "get"
    })
}
/**
 * 查询分类信息
 * @param {String} id 分类的id
 */
export function getCategoryById(id) {
    return server({
        url: `/category/query/${id}`,
        method: "get"
    })
}
/**
 * 添加参数信息
 * @param {String} categoryId 分类ID
 * @param {*} specParamVO specParamVO
 */
export function insertSpecparam(categoryId, specParamVO) {
    return server({
        url: "/spec-param/insert",
        method: "post",
        data: specParamVO,
        params: { categoryId: categoryId }
    })
}
/**
 * 根据ID删除参数信息
 * @param {String} id paramid
 */
export function deleteSpecParam(id) {
    return server({
        url: "/spec-param/delete",
        method: "delete",
        params: { id: id }
    })
}
/**
 * 修改参数信息
 * @param {String} categoryId 分类ID
 * @param {*} specParamVO specParamVO
 */
export function updateSpecparam(categoryId, specParamVO) {
    return server({
        url: "/spec-param/update",
        method: "post",
        data: specParamVO,
        params: { categoryId: categoryId }
    })
}
/**
 * 根据分类查询参数信息
 * @param {string} categoryId 分类ID
 */
export function getParamsList(categoryId) {
    return server({
        url: "/spec-param/list",
        method: "get",
        params: { categoryId: categoryId }
    })
}
/**
 * 根据ID查询参数信息
 * @param {String} specParamId 参数id
 */
export function getParamsById(specParamId) {
    return server({
        url: "/spec-param/query",
        method: "get",
        params: { specParamId: specParamId }
    })
}
/**
 * 根据父ID查询分类信息
 * @param {String} parentId 父级分类id 一级为1
 */
export function getCategoryByLevel(parentId) {
    return server({
        url: "/category/list/parent",
        method: "get",
        params: { parentId: parentId }
    })
}