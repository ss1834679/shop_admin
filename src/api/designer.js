import server from "../utils/server";

/**
 * 根据设计师姓名，等级分页查询设计师
 * @param {Number} pageIndex 当前页面
 */
export function getDesignerList(pageIndex, search) {
    return server({
        url: `/designer/page/${pageIndex}`,
        method: "get",
        params: search
    })
}
/**
 * 根据设计师 id 删除设计师
 * @param {Array} idList 需要删除的设计师 id 数组
 */
export function deleteDesigner(idList) {
    let arr = new URLSearchParams;
    arr.append("idList", idList)
    return server({
        url: "/designer/delete",
        method: 'delete',
        params: arr
    })
}
/**
 * 添加设计师
 * @param {*} designer 设计师所有信息
 * @param {Array} images 设计师轮播图数组
 */
export function insertDesigner(designer, images) {
    let arr = new URLSearchParams
    arr.append("images", images)
    return server({
        url: '/designer/insert',
        method: "post",
        params: arr,
        data: designer
    })
}
/**
 * 修改设计师
 * @param {*} designer 设计师所有信息
 * @param {Array} images 设计师轮播图数组
 */
export function updateDesigner(designer, images) {
    let arr = new URLSearchParams
    arr.append("images", images)
    return server({
        url: '/designer/update',
        method: "post",
        params: arr,
        data: designer
    })
}
/**
 * 根据 ID 获取设计师信息
 * @param {String} designerId 设计师ID
 */
export function getDesignerById(designerId) {
    return server({
        url: `/designer/query/${designerId}`,
        method: "get"
    })
}
/**
 * 添加设计师的审核信息
 * @param {*} designerApproval 设计师审核信息
 */
export function approvalDesigner(designerApproval) {
    return server({
        url: "/designer-approval/insert",
        method: "post",
        data: designerApproval
    })
}
/**
 * 根据设计师查询该设计师的审核信息
 * @param {String} designerId 设计师ID
 * @param {Number} pageIndex 当前页 默认为1
 * @param {Number} pageSize 分页数量 默认为50条
 */
export function getDesignerApproval(designerId, pageIndex = 1, pageSize = 50) {
    return server({
        url: `/designer-approval/page/${designerId}/${pageIndex}`,
        method: "get",
        params: { pageSize: pageSize }
    })
}
/**
 * 设计师作品分页查询
 * @param {Number} pageIndex 当前页
 * @param {*} obj {designerId:"",title:""}设计师信息
 */
export function getDesignerDraw(pageIndex, obj) {
    return server({
        url: `/designer-drawing/page/${pageIndex}`,
        method: "get",
        params: obj
    })
}
/**
 * 根据ID获取设计师作品信息
 * @param {String} designerDrawingId 设计师作品ID
 */
export function getDesignerDrawById(designerDrawingId) {
    return server({
        url: `/designer-drawing/query/${designerDrawingId}`,
        method: "get"
    })
}
/**
 * 添加设计师作品接口
 * @param {*} designerDrawing 设计师作品信息
 * @param {Array} images 设计师作品图
 */
export function addDesignerDraw(designerDrawing, images) {
    let arr = new URLSearchParams
    arr.append("images", images)
    return server({
        url: "/designer-drawing/insert",
        method: "post",
        data: designerDrawing,
        params: arr
    })
}
/**
 * 修改设计师作品接口
 * @param {*} designerDrawing 设计师作品信息
 * @param {Array} images 设计师作品图
 */
export function updateDesignerDraw(designerDrawing, images) {
    let arr = new URLSearchParams
    arr.append("images", images)
    return server({
        url: "/designer-drawing/update",
        method: "post",
        data: designerDrawing,
        params: arr
    })
}


/**
 * 设计师各种状态数量
 * @param {String} designerDrawingId 设计师作品ID
 */
export function getDesignerStatus() {
    return server({
        url: `/designer/query/designer/status`,
        method: "get"
    })
}


/**
 * 分页查询设计师公司信息
 * @param {String} pageIndex 页数
 * @param {*} pageSize 页码
 */
export function getDesignerCompany(pageIndex, obj) {
    return server({
        url: `/designer/query/company/${pageIndex}`,
        method: "get",
        params: obj
    })
}


/**
 * 添加设计师公司信息
 * @param {*} obj 
 */
export function getInsertCompany(obj) {
    let arr1 = new URLSearchParams()
    arr1.append('idCards', obj.idCards);
    arr1.append("images", obj.environmentalPhotos)
    return server({
        url: "/designer/insert/company",
        method: 'post',
        data: obj.designCompany,
        params: arr1
    })
}


/**
 * 根据ID获取设计师信息
 * @param {*} obj 
 */
export function getDesignerInsertCompanyquery(designerCompanyId) {
    return server({
        url: `/designer/query/company/detail/${designerCompanyId}`,
        method: "get"
    })
}



/**
 * 根据ID集合删除设计师公司信息
 * @param {*} obj 
 */
export function deleteDesignerCompany(idList) {
    let arr = new URLSearchParams()
    arr.append("idList", idList)
    return server({
        url: `/designer/delete/company`,
        method: "DELETE",
        params: arr
    })
}



/**
 根据ID获取设计师公司信息
 * @param {*} obj 
 */
export function designerdetailCompany(companyId, pageIndex) {
    return server({
        url: `/designer/page/${companyId}/${pageIndex}`,
        method: "get"
    })
}


/**
 编辑设计师公司
 * @param {*} obj
 */
export function updateDesignerCompany(obj) {
    let arr1 = new URLSearchParams
    arr1.append('idCards', obj.idCards);
    arr1.append("images", obj.environmentalPhotos)
    return server({
        url: "/designer/update/company",
        method: 'put',
        data: obj.designCompany,
        params: arr1
    })
}

export function updateCompanyStatus(obj) {
    return server({
        url: `/designer/update/company/status`,
        method: "PATCH",
        data: obj
    })
}

/**
 * 获取全部的设计师公司
 */
export function getDesignerCompanyAll() {
    return server({
        url: "/designer/query/companyName",
        method: "get"
    })
}



/**
 * 获取全部的设计师公司等级
 */
export function getCompanyLevel(pageIndex, obj) {
    return server({
        url: `/designer/query/company/level/${pageIndex}`,
        method: "get",
        params: obj

    })
}

/**
 * 添加设计师公司等级
 */
export function addInsertCompanyLevel(designerCompanyLevel) {
    return server({
        url: `/designer/insert/company/level`,
        method: "post",
        data: designerCompanyLevel

    })
}



/**
 * 添加设计师公司等级
 */
export function addUpdateCompanyLevel(designerCompanyLevel) {
    return server({
        url: `/designer/update/company/level`,
        method: "put",
        data: designerCompanyLevel

    })
}


/**
 * 根据ID集合删除设计师公司等级信息
 * @param {*} obj 
 */
export function deleteCompanyLevel(idList) {
    let arr = new URLSearchParams()
    arr.append("idList", idList)
    return server({
        url: `/designer/delete/company/level`,
        method: "DELETE",
        params: arr
    })
}


/**
 * 根据公司等级ID查询等级详情
 * @param {*} obj 
 */
export function detailCompanyLevel(levelId) {
    return server({
        url: `/designer/query/company/level/detail/${levelId}`,
        method: "get"
    })
}

/**
 * 添加设计师公司入住图片
 * @param {*} ruleIntroduction { "id": "string", "isDelete": 0, "operator": "string", "picture": "string"}
 */
export function insertDesignerCompanyInRule(ruleIntroduction) {
    return server({
        url: "/designer/insert/company/ruleIntroduction",
        method: "post",
        data: ruleIntroduction
    })
}

/**
 * 查询设计师公司入住图片
 */
export function getDesignerCompanyInRule() {
    return server({
        url: "/designer/query/company/ruleIntroduction",
        method: "get"
    })
}

/**
 * 根据公司ID修改审核状态
 * @param {*} designerCompanyAudit { "companyId": "string", "feedbackDetails": "string", "operator": "string", "status": 0 }
 */
export function updateAuditCompany(designerCompanyAudit) {
    return server({
        url: "/designer/update/company/audit",
        method: "patch",
        data: designerCompanyAudit
    })
}


/**
 * 根据公司ID查询审核详情
 * @param {String} companyId 设计师公司id
 */
export function getAuditCompany(companyId) {
    return server({
        url: `/designer/query/company/audit/${companyId}`,
        method: "get"
    })
}

/**
 * 设计师各种状态数量
 */
export function getDesignerCompanyStatusNum() {
    return server({
        url: "/designer/query/company/status",
        method: "get"
    })
}

/**
 * 设计师装修风格
 */
export function getDesignerStyle() {
    return server({
        url: "/decorate/getAllUsableDecorateStyle",
        method: "get"
    })
}

/**
 * 报价需求列表查询
 */
export function getPriceList(obj) {
    return server({
        url: "/quoteDemand/page",
        method: "post",
		data:obj
		
    })
}
/**
 * 报价需求列表标记联系修改
 */
export function changeState(contactStatus,ids) {
    return server({
        url: "/quoteDemand/markContacted",
        method: "post",
		params:{contactStatus},
		data:ids
    })
}

/**
 * 报价需求列表日志查询
 */
export function getPriceJournalList(id) {
    return server({
        url: "/quoteDemand/logs",
        method: "get",
		params:{id}
    })
}

/**
 * 根据设计师姓名，等级分页查询设计师(预约需求)
 */
export function getDesignerOrderList(pageIndex,pageSize,reserveAdvisoryVo) {
    return server({
        url: "/reverse/selectReserveAdvisoryList",
        method: "post",
		params:{pageIndex,pageSize},
		data:reserveAdvisoryVo
		
    })
}

/**
 * 查询预约操作日志(预约需求)
 */
export function getDesignerJournalList(id,pageIndex,pageSize) {
    return server({
        url: "/reverse/selectReserveAdvisoryLogsList",
        method: "post",
		params:{id,pageIndex,pageSize},
		
    })
}

/**
 * 修改联系状态(预约需求)
 */
export function operatorContactStatus(ids) {
    return server({
        url: "/reverse/operatorContactStatus",
        method: "post",
		data:ids,
		
    })
}