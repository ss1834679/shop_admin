import server from "../utils/server"

/**
 * 分页查询小区
 * @param {*} obj {endTime:"",startTime:"",isPosition:"有无位置",pageNo:1,pageSize:20,title:"小区名称"}
 */
export function getAllVillageByPage(obj) {
    return server({
        url: "/quote/getAllVillageByPage",
        method: "get",
        params: obj
    })
}

/**
 * 批量删除小区
 * @param {*} dto { ids: [] }
 */
export function deleteVillageBatch(ids) {
    return server({
        url: "/quote/deleteVillageBatch",
        method: "post",
        data: { ids }
    })
}

/**
 * 批量添加经度纬度
 * @param {*} data {bos:[]}
 */
export function addLngLatBatch(data) {
    return server({
        url: "/quote/addLngLatBatch",
        method: "post",
        data: data
    })
}

/**
 * 批量获取小区
 * @param {*} data {ids:[]}
 */
export function getVillageBatch(data) {
    return server({
        url: "/quote/getVillageBatch",
        method: "post",
        data: data
    })
}

/**
 * 后台添加/编辑小区信息
 * @param {*} obj
 */
export function addOrEditVillage(obj) {
    return server({
        url: `/adminsUsers/addOrEditVillage`,
        method: "POST",
        data: obj
    })
}

/**
 * 根据id查询小区信息
 * @param {String} villageId 小区id
 */
export function getVillageById(villageId) {
    return server({
        url: "/adminsUsers/getVillageById",
        method: "get",
        params: { villageId }
    })
}

/**
 * 分页查询装修风格
 * @param {*} obj {pageNo: 1, pageSize: 20,}
 */
export function getDecorateStylePage(obj) {
    return server({
        url: "/decorateStyle/page",
        method: "post",
        data: obj
    })
}

/**
 * 修改装修风格状态
 * @param {*} obj { "id": "", "status": 0 }
 */
export function editDecorateStyleStatus(obj) {
    return server({
        url: "/decorate/editDecorateStyleStatus",
        method: "post",
        data: obj
    })
}

/**
 * 删除装修风格
 * @param {*} obj {id:""}
 */
export function deleteDecorateStyled(obj) {
    return server({
        url: "/decorate/deleteDecorateStyle",
        method: "post",
        data: obj
    })
}

/**
 * 保存装修风格
 * @param {*} decorateStyleDetail {id: "",imageUrl: "","sort": "","status": 0,"title": ""}
 */
export function saveDecorateStyle(decorateStyleDetail) {
    return server({
        url: "/decorateStyle/save",
        method: "post",
        data: decorateStyleDetail
    })
}

/**
 * 修改装修风格
 * @param {*} decorateStyleDetail {id: "",imageUrl: "","sort": "","status": 0,"title": ""}
 */
export function updateDecorateStyle(decorateStyleDetail) {
    return server({
        url: "/decorateStyle/update",
        method: "put",
        data: decorateStyleDetail
    })
}

/**
 * 查看风格详情
 * @param {String} id 风格id
 */
export function getOneDecorateStyle(id) {
    return server({
        url: "/decorateStyle/one",
        method: "get",
        params: { id }
    })
}

/**
 * 分页查询案例
 * @param {*} obj {author:"案例作者",communityName:"小区名",endTime:null,startTime:null,style:"风格",isQuote:"0未报价 1已报价",pageNo:1,pageSize:20,specName:"户型",title:"案例标题"}
 */
export function getAllQuoteByPage(obj) {
    return server({
        url: "/quote/getAllQuoteByPage",
        method: "get",
        params: obj
    })
}

/**
 * 删除案例
 * @param {Array} ids 案例id数组
 */
export function deleteQuoteIdBatch(ids) {
    return server({
        url: "/quote/deleteQuote",
        method: "post",
        data: { ids }
    })
}

/**
 * 审核案例
 * @param {*} obj { "approvalMsg": "", "approvalStatus": 0, "id": "" }
 */
export function approvalQuote(obj) {
    return server({
        url: "/quote/approvalQuote",
        method: "post",
        data: obj
    })
}

/**
 * 添加案例
 * @param {*} obj 
 */
export function addQuote(obj) {
    return server({
        url: "/quote/addQuote",
        method: "post",
        data: obj
    })
}

/**
 * 编辑案例
 * @param {*} obj 
 */
export function editQuote(obj) {
    return server({
        url: "/quote/editQuote",
        method: "post",
        data: obj
    })
}

/**
 * 获取案例的审核详情
 * @param {String} id 案例id
 */
export function getApprovalDetail(id) {
    return server({
        url: "/quote/getApprovalDetail",
        method: "post",
        params: { id }
    })
}

/**
 * 设置案例显示状态
 * @param {*} obj { "id": "string", "isShowStatus": 0 }
 */
export function setShowStatusPro(obj) {
    return server({
        url: "/quote/setShowStatus",
        method: "post",
        data: obj
    })
}

/**
 * 上传案例时导入Excel
 * @param {String} id 案例id
 * @param {File} file 文件流
 */
export function uploadQuote(id, file) {
    let afile = new FormData()
    afile.append("file", file)
    return server({
        url: "/quote/uploadQuote",
        method: "post",
        data: afile,
        params: { id }
    })
}

/**
 * 根据案例id获取案例
 * @param {String} id 案例id
 */
export function getQuoteById(id) {
    return server({
        url: "/quote/getQuoteById",
        method: "get",
        params: { id }
    })
}

/**
 * 根据id获取案例清单
 * @param {String} id 案例id
 */
export function getQuoteListById(id) {
    return server({
        url: "/quote/getQuoteListById",
        method: "get",
        params: { id }
    })
}

/**
 * 获取所有的设计师基本信息
 */
export function getAllDesignerInfo() {
    return server({
        url: "/designer-info/getAllDesignerInfo",
        method: "get"
    })
}