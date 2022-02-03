import server from '../utils/server'

/**
 * 后台分页查询小区信息
 * @param {*} obj 
 */
export function getVillageByPage(obj) {
    return server({
        url: `/adminsUsers/getVillageByPage`,
        method: "get",
        params: obj
    })
}

/**
 * 删除小区信息
 * @param {*} obj
 */
export function deleteVillageByBatch(obj) {
    return server({
        url: `/adminsUsers/deleteVillageByBatch`,
        method: "POST",
        data: obj
    })
}

/**
 * 获取所有的装修户型
 */
export function getHouseTypeList() {
    return server({
        url: "/decorate/getAllHouseType",
        method: 'get'
    })
}
/**
 * 获取所有的装修风格
 */
export function getDecorateStyleList() {
    return server({
        url: "/decorate/getAllDecorateStyle",
        method: "get"
    })
}

/**
 * 获取所有可用的装修风格
 */
export function getAllUsableDecorateStyle() {
    return server({
        url: "/decorate/getAllUsableDecorateStyle",
        method: "get"
    })
}

/**
 * 获取所有可用的装修户型
 */
export function getAllUsableHouseType() {
    return server({
        url: "/decorate/getAllUsableHouseType",
        method: "get"
    })
}

/**
 * 添加或修改户型
 * @param {*} obj 户型信息 { "content": "", "id": "", "image": "", "sort": "", "typeName": "" }
 */
export function addOrEditHouseType(obj) {
    return server({
        url: "/decorate/addOrEditHouseType",
        method: "post",
        data: obj
    })
}
/**
 * 添加或修改装修风格
 * @param {*} obj 装修风格信息 { "id": "", "imageUrl": "", "sort": "", "title": "" }
 */
export function addOrEditDecorateStyle(obj) {
    return server({
        url: "/decorate/addOrEditDecorateStyle",
        method: "post",
        data: obj
    })
}
/**
 * 修改户型状态
 * @param {*} obj { "id": "", "status": 0 }
 */
export function editHouseTypeStatus(obj) {
    return server({
        url: "/decorate/editHouseTypeStatus",
        method: "post",
        data: obj
    })
}
/**
 * 根据ID获取模板model
 * @param {string} id 模板ID
 */
export function getTemplatesById(id) {
    return server({
        url: "/templates/query",
        method: "get",
        params: { id }
    })
}
/**
 * 分页查询模板信息
 * @param {String} search 搜索内容
 */
export function getTemplatesList(search) {
    return server({
        url: "/templates/list",
        method: "get",
        params: { search }
    })
}
/**
 * 添加模板信息
 * @param {*} data 模板信息
 */
export function insertTemplates(data) {
    return server({
        url: "/templates/insert",
        method: "post",
        data: data
    })
}
/**
 * 修改模板信息
 * @param {*} data 模板信息
 */
export function updateTemplates(data) {
    return server({
        url: "/templates/update",
        method: "post",
        data: data
    })
}
/**
 * 删除模板信息
 * @param {String} id 模板id
 */
export function deleteTemplates(id) {
    return server({
        url: "/templates/delete",
        method: "delete",
        params: { id }
    })
}
/**
 * 修改模板状态
 * @param {String} id 模板ID
 */
export function updateTemplatesStatus(id) {
    return server({
        url: "/templates/update/status",
        method: "post",
        params: { id }
    })
}

/**
 * 根据店铺id获取店铺的运费模板
 * @param {String} supplierId 店铺id
 */
export function getTemplatesListBySup(supplierId) {
    return server({
        url: "/templates/list/supplier",
        method: "get",
        params: { supplierId }
    })
}

/**
 * 删除移动端版本号相关信息
 * @param {String} id 版本id
 */
export function deleteAppInfo(id) {
    return server({
        url: "/adminsUsers/delete/appInfo",
        method: "delete",
        params: { id }
    })
}

/**
 * 添加移动端版本号相关信息
 * @param {*} data { "updateMsg": "string", "version": "string", "versionUrl": "string" }
 */
export function insertAppInfo(data) {
    return server({
        url: "/adminsUsers/insert/appInfo",
        method: "post",
        data: data
    })
}

/**
 * 修改移动端版本号相关信息
 * @param {*} data { "updateMsg": "string", "version": "string", "versionUrl": "string" }
 */
export function updateAppInfo(data) {
    return server({
        url: "/adminsUsers/update/appInfo",
        method: "put",
        data: data
    })
}

/**
 * 
 * @param {Number} pageIndex 页码
 * @param {*} data { pageSize:20,updateMsg:"",version:"" }
 */
export function getAppInfoList(pageIndex, data) {
    return server({
        url: `/adminsUsers/query/appInfo/${pageIndex}`,
        method: "get",
        params: data
    })
}

/**
 * 修改IM角色
 * @param {*} imRole im角色对象
 */
export function updateImRole(imRole) {
    return server({
        url: "/im/update/imRole",
        method: "put",
        data: imRole
    })
}

/**
 * 新增IM角色
 * @param {*} imRole im角色对象
 */
export function addImRole(imRole) {
    return server({
        url: "/im/insert/imRole",
        method: "post",
        data: imRole
    })
}

/**
 * 查询所有IM角色
 */
export function getAllImRole() {
    return server({
        url: "/im/query/imRole",
        method: "get"
    })
}

/**
 * 根绝ID查询IM角色
 * @param {String} id IM角色ID
 */
export function getImRoleById(id) {
    return server({
        url: `/im/query/imRole/${id}`,
        method: "get"
    })
}
