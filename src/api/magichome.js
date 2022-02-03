import server from "../utils/server"


/**
 * 添加激活码
 * @param {*} dto { address: , city: "市", code: , companyName: "公司名称", contactInfo: "联系方式", district: "区", province: "省", quoteScope: 0, status: 0 禁用 1 启用, storeAddress: "门店地址", village: "小区id"}
 */
export function addActivation(dto) {
    return server({
        url: "/activation/add",
        method: "post",
        data: dto
    })
}

/**
 * 删除激活码
 * @param {String} id 激活码id
 */
export function deleteActivation(id) {
    return server({
        url: "/activation/delete",
        method: "post",
        data: { id }
    })
}

/**
 * 编辑激活码
 * @param {*} dto { id:"", address: , city: "市", code: , companyName: "公司名称", contactInfo: "联系方式", district: "区", province: "省", quoteScope: 0, status: 0 禁用 1 启用, storeAddress: "门店地址", village: "小区id"}
 */
export function editActivation(dto) {
    return server({
        url: "/activation/edit",
        method: "post",
        data: dto
    })
}

/**
 * 生成激活码
 */
export function generateActivation() {
    return server({
        url: "/activation/generate",
        method: "get"
    })
}

/**
 * 分页查询激活码
 * @param {*} data {code:"",createTime:"",endTime:"",deviceId:"设备id",isUse:"0 1",pageNo:1,pageSize:20}
 */
export function getActivationPage(data) {
    return server({
        url: "/activation/getAllByPage",
        method: "get",
        params: data
    })
}

/**
 * 查询单个激活码信息
 * @param {String} id 激活码id
 */
export function getOneActivation(id) {
    return server({
        url: "/activation/getOne",
        method: "get",
        params: { id }
    })
}

/**
 * 启用/禁用激活码
 * @param {String} id 激活码id
 * @param {Number} status 0 1
 */
export function setStatusActivation(id, status) {
    return server({
        url: "/activation/setStatus",
        method: "post",
        data: { id, status }
    })
}

/**
 * 查询所有推荐
 */
export function getAllStrategy() {
    return server({
        url: "/strategy/getAll",
        method: "get"
    })
}

/**
 * 获取单个详情
 * @param {String} id 推荐id
 */
export function getOneStrategy(id) {
    return server({
        url: "/strategy/getOne",
        method: "get",
        params: { id }
    })
}

/**
 * 添加推荐
 * @param {*} data {adviseStyle:[],maxAge:1,minAge:1,name:""}
 */
export function addStrategy(data) {
    return server({
        url: "/strategy/add",
        method: "post",
        data: data
    })
}

/**
 * 删除推荐
 * @param {String} id 推荐id
 */
export function deleteStrategy(id) {
    return server({
        url: "/strategy/delete",
        method: "post",
        data: { id }
    })
}

/**
 * 编辑推荐
 * @param {*} data {adviseStyle:[],maxAge:1,minAge:1,name:"",id:""}
 */
export function editStrategy(data) {
    return server({
        url: "/strategy/edit",
        method: "post",
        data: data
    })
}