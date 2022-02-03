import server from '../utils/server'

/**
 * 查询运营中心列表
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function getBusinessCenterList({ data, params }) {
    return server({
        url: "/business/businessCenter/selectList",
        method: "post",
        params: params,
        data: data
    })
}


/**
 * 添加运营中心
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function saveOrUpdateBusinessCenter(obj) {
    return server({
        url: "business/businessCenter/saveOrUpdate",
        method: "post",
        data: obj
    })
}


/**
 *
查询单篇运营中心
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function findOneBusinessCenter(obj) {
    return server({
        url: "/business/businessCenter/findOne",
        method: "get",
        params: obj
    })
}


/**
 * 删除运营中心
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function deleteBusinessCenter(obj) {
    return server({
        url: "/business/businessCenter/delete",
        method: "post",
        data: obj
    })
}



/**
 * 运营中心是否显示
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function isDisplayBusinessCenter(obj) {
    return server({
        url: "/business/businessCenter/isDisplay",
        method: "post",
        data: obj
    })
}




/**
 * 查询装修公司列表
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function trimCompanySelectList({ data, params }) {
    return server({
        url: "/business/trimCompany/selectList",
        method: "post",
        params: params,
        data: data
    })
}




/**
 * 添加装修公司
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function trimCompanySaveOrUpdate(obj) {
    return server({
        url: "/business/trimCompany/saveOrUpdate",
        method: "post",
        data: obj
    })
}




/**
 * 所有审核通过运营中心查询
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function businessCenterSelectAll() {
    return server({
        url: "/business/businessCenter/selectAll",
        method: "post"
    })
}




/**
 * 所有审核通过运营中心查询
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function trimCompanyFindOne(obj) {
    return server({
        url: "/business/trimCompany/findOne",
        method: "get",
        params: obj
    })
}


/**
 * 删除装修公司
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function trimCompanyDelete(obj) {
    return server({
        url: "/business/trimCompany/delete",
        method: "post",
        data: obj
    })
}



/**
 * 删除装修公司
 * @param {*} obj { parmas: { pageNo: 1, pageSize: 20 }, data: { businessCenterVo: { startTime:"",endTime:""} }}
 */
export function trimCompanyVerify(obj) {
    return server({
        url: "/business/trimCompany/verify",
        method: "post",
        data: obj
    })
}

