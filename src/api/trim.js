import server from "../utils/server"

/**
 * 获取装修订单状态集合
 */
export function getDecorateDictOrderStatus() {
    return server({
        url: "/decorateDataDict/decorateOrderStatus",
        method: "get"
    })
}

/**
 * 获取装修流程分类集合
 */
export function getDecorateDictProcess() {
    return server({
        url: "/decorateDataDict/decorateProcessClassify",
        method: "get"
    })
}

/**
 * 装修订单分页
 * @param {*} data {"orderStatus": "", "pageNo":1, "pageSize": 20,}
 */
export function getDecorateOrderPage(data) {
    return server({
        url: "/decorateOrder/selectPage",
        method: "post",
        data: data
    })
}

/**
 * 查询装修订单详情
 * @param {String} id 装修订单id
 */
export function getdecorateOrderOne(id) {
    return server({
        url: "/decorateOrder/selectOne",
        method: "get",
        params: { id }
    })
}

/**
 * 添加装修订单
 * @param {*} data 
 */
export function addDecorateOrder(data) {
    return server({
        url: "/decorateOrder/save",
        method: "post",
        data: data
    })
}

/**
 * 修改装修订单
 * @param {*} data 
 */
export function updateDecorateOrder(data) {
    return server({
        url: "/decorateOrder/update",
        method: "put",
        data: data
    })
}

/**
 * 删除装修订单
 * @param {String} id 装修订单id
 */
export function deleteDecorateOrder(id) {
    return server({
        url: "/decorateOrder/delete",
        method: "delete",
        params: { id }
    })
}

/**
 * 管家分页查询
 * @param {Number} pageNum 
 * @param {Number} pageSize 
 */
export function getHouseKeeperPage(pageNum, pageSize) {
    return server({
        url: "/merchant/houseKeeper/selectList",
        method: "post",
        params: { pageNum, pageSize }
    })
}

/**
 * 添加或者修改装修管家
 * @param {*} data {accountNum:"管家账号",houseKeeperName:"管家名称",sort:0}
 */
export function editHouseKeeper(data) {
    return server({
        url: "/merchant/houseKeeper/save",
        method: "post",
        data: data
    })
}

/**
 * 查询单个管家
 * @param {String} id 管家id
 */
export function getHouseKeeperOne(id) {
    return server({
        url: "/merchant/houseKeeper/selectOne",
        method: "post",
        params: { id }
    })
}

/**
 * 删除管家
 * @param {String} id 管家id
 */
export function deleteHouseKeeper(id) {
    return server({
        url: "/merchant/houseKeeper/delete",
        method: "post",
        params: { id }
    })
}

/**
 * 装修经理分页查询
 * @param {Number} pageNum
 * @param {Number} pageSize
 */
export function getProjectManagerPage(pageNum, pageSize) {
    return server({
        url: "/merchant/projectManager/selectList",
        method: "post",
        params: { pageNum, pageSize }
    })
}

/**
 * 添加或者修改装修经理
 * @param {*} data {accountNum:"装修经理账号",projectManagerName:"装修经理名称",sort:0}
 */
export function editProjectManager(data) {
    return server({
        url: "/merchant/projectManager/save",
        method: "post",
        data: data
    })
}

/**
 * 查询单个装修经理
 * @param {*} data {id:"",outUserId:""}
 */
export function getProjectManagerOne(data) {
    return server({
        url: "/merchant/projectManager/selectOne",
        method: "post",
        params: data
    })
}

/**
 * 删除装修经理
 * @param {String} id 装修经理id
 */
export function deleteProjectManager(id) {
    return server({
        url: "/merchant/projectManager/delete",
        method: "post",
        params: { id }
    })
}

/**
 * 添加装修流程
 * @param {*} data {"id": "","processClassify": "","processName": "","processSort": 0}
 */
export function addDecorateProcess(data) {
    return server({
        url: "/decorateProcess/save",
        method: "post",
        data: data
    })
}

/**
 * 修改装修流程
 * @param {*} data {"id": "","processClassify": "","processName": "","processSort": 0}
 */
export function updateDecorateProcess(data) {
    return server({
        url: "/decorateProcess/update",
        method: "put",
        data: data
    })
}

/**
 * 分页查询装修流程
 * @param {*} data {pageNo:1,pageSize:20,processClassify:"装修分类"}
 */
export function getDecorateProcessPage(data) {
    return server({
        url: "/decorateProcess/selectPage",
        method: "post",
        data: data
    })
}

/**
 * 查询装修流程详情
 * @param {string} id 装修流程id
 */
export function getDecorateProcessOne(id) {
    return server({
        url: "/decorateProcess/selectOne",
        method: "get",
        params: { id }
    })
}

/**
 * 通过装修分类查询装修流程集合
 * @param {string} processClassify 装修分类id
 */
export function getDecorateProcessListByCate(processClassify) {
    return server({
        url: "/decorateProcess/selectList",
        method: "get",
        params: { processClassify }
    })
}

/**
 * 修改装修流程是否启用
 * @param {String} id 装修流程id
 * @param {*} isEnable 1：启用；2:未启用
 */
export function updateDecorateProcessIsEnable(id, isEnable) {
    return server({
        url: "/decorateProcess/isEnable",
        method: "put",
        params: { id, isEnable }
    })
}

/**
 * 删除装修流程
 * @param {String} id 装修流程id
 */
export function deleteDecorateProcess(id) {
    return server({
        url: "/decorateProcess/delete",
        method: "delete",
        params: { id }
    })
}

/**
 * 查询装修流程大节点列表
 * @param {*} decorateProcessId {"decorateProcessId": ""}
 */
export function getBigNodeByDecoId(decorateProcessId) {
    return server({
        url: "/bigNode/selectList",
        method: "post",
        params: { decorateProcessId }
    })
}

/**
 * 查询装修流程大节点详情
 * @param {String} id 装修流程大节点id
 */
export function getBigNodeOne(id) {
    return server({
        url: "/bigNode/selectOne",
        method: "get",
        params: { id }
    })
}

/**
 * 添加装修流程大节点
 * @param {*} data {"decorateProcessId": "装修流程id", "nodeName": "节点名", "nodeStep": 0,}
 */
export function addBigNode(data) {
    return server({
        url: "/bigNode/save",
        method: "post",
        data: data
    })
}

/**
 * 修改装修流程大节点
 * @param {*} data {"decorateProcessId": "装修流程id", "nodeName": "节点名", "nodeStep": 0,id:""}
 */
export function updateBigNode(data) {
    return server({
        url: "/bigNode/update",
        method: "put",
        data: data
    })
}

/**
 * 删除装修流程大节点
 * @param {String} id 装修流程大节点id
 */
export function deleteBigNode(id) {
    return server({
        url: "/bigNode/delete",
        method: "delete",
        params: { id }
    })
}

/**
 * 查询装修流程小节点列表
 * @param {String} bigNodeId 装修流程大节点id
 */
export function getSmallNodePage(bigNodeId) {
    return server({
        url: "/smallNode/selectList",
        method: "post",
        params: { bigNodeId }
    })
}

/**
 * 查询装修流程小节点详情
 * @param {String} id 装修流程小节点id
 */
export function getSmallNodeOne(id) {
    return server({
        url: "/smallNode/selectOne",
        method: "get",
        params: { id }
    })
}

/**
 * 添加装修流程小节点
 * @param {*} data {"bigNodeId": "", "decorateProcessId": "", "nodeName": "", "nodeSort": 0}
 */
export function addSmallNode(data) {
    return server({
        url: "/smallNode/save",
        method: "post",
        data: data
    })
}

/**
 * 修改装修流程小节点
 * @param {*} data {"bigNodeId": "", "decorateProcessId": "", "nodeName": "", "nodeSort": 0,id}
 */
export function updateSmallNode(data) {
    return server({
        url: "/smallNode/update",
        method: "put",
        data: data
    })
}

/**
 * 删除装修流程小节点
 * @param {String} id 装修流程小节点id
 */
export function deleteSmallNode(id) {
    return server({
        url: "/smallNode/delete",
        method: "delete",
        params: { id }
    })
}

/**
 * 获取管家的方案
 * @param {String} title 方案标题
 */
export function getQuoteListByDecorate(title) {
    return server({
        url: "/quote/getListByDecorate",
        method: "get",
        params: { title }
    })
}

/**
 * 添加装修订单方案
 * @param {*} data {decorateOrderId:"",quoteId:"",userOpinion:""}
 */
export function addDecorateOrderPlan(data) {
    return server({
        url: "/decorateOrderPlan/save",
        method: "post",
        data: data
    })
}

/**
 * 修改装修订单方案
 * @param {*} data {decorateOrderId:"",quoteId:"",userOpinion:""}
 */
export function updateDecorateOrderPlan(data) {
    return server({
        url: "/decorateOrderPlan/update",
        method: "put",
        data: data
    })
}

/**
 * 获取项目经理所有列表
 */
export function getProjectManagerAll() {
    return server({
        url: "/projectManager/list",
        method: "get"
    })
}

/**
 * 添加装修订单流程
 * @param {*} data { "decorateOrderId": "", "originalId": "装修流程模板id", "pmPhone": "项目经理", "processClassifyDesc": "装修分类描述"}
 */
export function addDecorateOrderDecorateProcess(data) {
    return server({
        url: "/decorateOrderDecorateProcess/save",
        method: "post",
        data: data
    })
}

/**
 * 修改装修订单流程
 * @param {*} data { "decorateOrderId": "", "originalId": "装修流程模板id", "pmPhone": "项目经理", "processClassifyDesc": "装修分类描述"}
 */
export function updateDecorateOrderDecorateProcess(data) {
    return server({
        url: "/decorateOrderDecorateProcess/update",
        method: "put",
        data: data
    })
}

/**
 * 添加装修订单报价
 * @param {*} data { "decorateOrderId": "",  userRecord: "" , workRecord: "" }
 */
export function addDecorateOrderQuote(data) {
    return server({
        url: "/decorateOrderQuote/save",
        method: "post",
        data: data
    })
}

/**
 * 修改装修订单报价
 * @param {*} data { "decorateOrderId": "",  userRecord: "" , workRecord: "" ,id:""}
 */
export function updateDecorateOrderQuote(data) {
    return server({
        url: "/decorateOrderQuote/update",
        method: "put",
        data: data
    })
}

/**
 * 发起流程 添加装修订单附加信息
 * @param {*} data {"constructionImgs": "",	"contractImgs": "",	"decorateOrderId": ""}
 */
export function addDecorateOrderInfo(data) {
    return server({
        url: "/decorateOrderInfo/save",
        method: "post",
        data: data
    })
}

/**
 * 3.3发起流程 添加装修订单附加信息
 * @param {*} data {"constructionImgs": "",	"contractImgs": "",	"decorateOrderId": "",decorateOrderBigNodeVoList:[]}
 */
export function addDecorateOrderInfoNew(data) {
    return server({
        url: "/decorateOrderInfo/saveNew",
        method: "post",
        data: data
    })
}

/**
 * 3.3-修改装修订单附加信息
 * @param {*} data {"constructionImgs": "",	"contractImgs": "",	"decorateOrderId": "",decorateOrderBigNodeVoList:[]}
 */
export function updateDecorateOrderInfoNew(data) {
    return server({
        url: "/decorateOrderInfo/updateNew",
        method: "put",
        data: data
    })
}

/**
 * 分页查询装修资料
 * @param {*} data {decorateOrderId:"",pageNo:1,pageSize:20,bigNodeId:"",smallNodeId:""}
 */
export function getDecorationInfoPage(data) {
    return server({
        url: "/decorationInfo/selectPage",
        method: "post",
        data: data
    })
}

/**
 * 查询装修资料详情
 * @param {String} id 装修资料id
 */
export function getDecorationInfoOne(id) {
    return server({
        url: "/decorationInfo/selectOne",
        method: "post",
        params: { id }
    })
}

/**
 * 查询装修资料列表大节点列表
 * @param {String} id 装修订单id
 */
export function getDecorationInfoBigNode(id) {
    return server({
        url: "/decorationInfo/selectDecorationProcessBigNode",
        method: "post",
        params: { id }
    })
}

/**
 * 查询装修资料列表小节点列表
 * @param {String} decorateOrderBigNodeId 装修订单大节点id
 * @param {String} decorateOrderId 装修订单id
 */
export function getDecorationInfoSmallNode(decorateOrderBigNodeId, decorateOrderId) {
    return server({
        url: "/decorationInfo/selectDecorationProcessSmallNode",
        method: "post",
        params: { decorateOrderBigNodeId, decorateOrderId }
    })
}

/**
 * 分页服务商角色
 * @param {*} data {pageNo:1,pageSize:20}
 */
export function getServiceProvidersRolePage(data) {
    return server({
        url: "/serviceProvidersRole/selectPage",
        method: "post",
        data: data
    })
}

/**
 * 删除服务商角色
 * @param {String} id 服务商角色id
 */
export function deleteServiceProvidersRole(id) {
    return server({
        url: "/serviceProvidersRole/delete",
        method: "delete",
        params: { id }
    })
}

/**
 * 删除前的校验，校验其是否被关联引用，有关联true,无关联false
 * @param {String} id 服务商角色id
 */
export function checkIsRelevServiceProvidersRoleBefDelete(id) {
    return server({
        url: "/serviceProvidersRole/deleteCheckIsRelevance",
        method: "delete",
        params: { id }
    })
}

/**
 * 校验服务商角色名是否存在，存在true,不存在false
 * @param {*} data {roleName:"服务商角色名",id:"服务商角色id 修改传"}
 */
export function checkNameIsExistServiceProvidersRole(data) {
    return server({
        url: "/serviceProvidersRole/checkNameIsExist",
        method: "post",
        params: data
    })
}

/**
 * 添加服务商角色
 * @param {*} data {roleName:"",roleSort:0}
 */
export function addServiceProvidersRole(data) {
    return server({
        url: "/serviceProvidersRole/save",
        method: "post",
        data: data
    })
}

/**
 * 查询单个服务商角色详情
 * @param {String} id 服务商角色id
 */
export function getServiceProvidersRoleById(id) {
    return server({
        url: "/serviceProvidersRole/selectOne",
        method: "get",
        params: { id }
    })
}

/**
 * 修改服务商角色
 * @param {*} data {id:"",roleName:"",roleSort:0}
 */
export function updateServiceProvidersRole(data) {
    return server({
        url: "/serviceProvidersRole/update",
        method: "put",
        data: data
    })
}

/**
 * 查询服务商角色集合 下拉列表
 */
export function getServiceProvidersRoleSelect() {
    return server({
        url: "/serviceProvidersRole/selectAll",
        method: "post"
    })
}

/**
 * 分页服务商
 * @param {*} data {pageNo:1,pageSize:20}
 */
export function getServiceProvidersPage(data) {
    return server({
        url: "/serviceProviders/selectPage",
        method: "post",
        data: data
    })
}

/**
 * 删除服务商
 * @param {String} id 服务商id
 */
export function deleteServiceProviders(id) {
    return server({
        url: "/serviceProviders/delete",
        method: "delete",
        params: { id }
    })
}

/**
 * 校验账号是否存在，存在true,不存在false
 * @param {*} data {account:"",id:"修改是传 服务商id"}
 */
export function checkAccountIsExistServiceProviders(data) {
    return server({
        url: "/serviceProviders/checkAccountIsExist",
        method: "post",
        params: data
    })
}

/**
 * 添加服务商
 * @param {*} data 
 */
export function addServiceProviders(data) {
    return server({
        url: "/serviceProviders/save",
        method: "post",
        data: data
    })
}

/**
 * 查询服务商详情
 * @param {*} data {id:"",outUserId:""}
 */
export function getServiceProvidersById(data) {
    return server({
        url: "/serviceProviders/selectOne",
        method: "get",
        params: data
    })
}

/**
 * 修改服务商
 * @param {*} data 
 */
export function updateServiceProviders(data) {
    return server({
        url: "/serviceProviders/update",
        method: "put",
        data: data
    })
}

/**
 * 分页业主
 * @param {*} data {"pageNo": 1,"pageSize": 20,}
 */
export function getOwnerPage(data) {
    return server({
        url: "/owner/selectPage",
        method: "post",
        data: data
    })
}

/**
 * 校验账号是否存在，存在true,不存在false
 * @param {*} data {account:"",id:""}
 */
export function checkAccountIsExistOwner(data) {
    return server({
        url: "/owner/checkAccountIsExist",
        method: "post",
        params: data
    })
}

/**
 * 添加业主
 * @param {*} data 
 */
export function addOwner(data) {
    return server({
        url: "/owner/save",
        method: "post",
        data: data
    })
}

/**
 * 查询业主详情
 * @param {*} data {id:"",outUserId:""}
 */
export function getOwnerById(data) {
    return server({
        url: "/owner/selectOne",
        method: "get",
        params: data
    })
}

/**
 * 修改业主
 * @param {*} data 
 */
export function updateOwner(data) {
    return server({
        url: "/owner/update",
        method: "put",
        data: data
    })
}

/**
 * 删除业主
 * @param {String} id 业主id
 */
export function deleteOwner(id) {
    return server({
        url: "/owner/delete",
        method: "delete",
        params: { id }
    })
}


/**
 * 确认签约/修改签约信息
 * @param {*} data {signInfo,id}
 */
export function updateDecorateOrderSignInfo(data) {
    return server({
        url: "/decorateOrder/updateSignInfo",
        method: "put",
        data: data
    })
}

/**
 * 通过装修流程ID查询装修流程大节点
 * @param {String} id 装修流程id
 */
export function getBigNodeByProcessId(id) {
    return server({
        url: "/bigNode/selectBigNodeListByProcessId",
        method: "get",
        params: { id }
    })
}

/**
 * 通过手机号查询服务商或者项目经理
 * @param {*} data {mobile:""}
 */
export function getSelectServiceOrProjectManagerByMobile(data) {
    return server({
        url: "/decorateOrderAccountingRecords/selectServiceOrProjectManager",
        method: "post",
        data: data
    })
}

/**
 * 获取装修增项的基本信息
 * @param {String} decorateOrderId 订单id
 */
export function getDecorateAdditionsBaseInfo(decorateOrderId) {
    return server({
        url: "/decorateAdditions/getBaseInfo",
        method: "get",
        params: { decorateOrderId }
    })
}

/**
 * 分页查询所有增项
 * @param {*} data {decorateOrderId:"",pageNo:1,pageSize:20,status:""}
 */
export function getDecorateAdditionsPage(data) {
    return server({
        url: "/decorateAdditions/getAllByPage",
        method: "get",
        params: data
    })
}

/**
 * 添加装修增项
 * @param {*} data {decorateOrderId:"",explain:"",price:"",title:""}
 */
export function addDecorateAdditions(data) {
    return server({
        url: "/decorateAdditions/add",
        method: "post",
        data: data
    })
}

/**
 * 申请增项分账
 * @param {*} data {accountPaid:分账金额,decorateOrderId:"",remark:"备注",serviceAccount:"资金账户"}
 */
export function applyAccountDecorateAdditions(data) {
    return server({
        url: "/decorateAdditions/applyAccount",
        method: "post",
        data: data
    })
}

/**
 * 删除装修增项
 * @param {String} id 增项id
 */
export function deleteDecorateAdditions(id) {
    return server({
        url: "/decorateAdditions/delete",
        method: "get",
        params: { id }
    })
}

/**
 * 分页查询所有增项资料
 * @param {*} data { additionsId, pageNo, pageSize }
 * @param {String} additionsId 增项id
 * @param {Number} pageNo 页码
 * @param {Number} pageSize 数量
 */
export function getDecorateAdditionsInfoPage(data) {
    return server({
        url: "/decorateAdditionsInfo/getAllByPage",
        method: "get",
        params: data
    })
}

/**
 * 删除增项资料
 * @param {String} id 增项资料id
 */
export function deleteDecorateAdditionsInfo(id) {
    return server({
        url: "/decorateAdditionsInfo/delete",
        method: "get",
        params: { id }
    })
}

/**
 * 通过资料ID查询增项资料
 * @param {String} additionsId 增项id
 */
export function getAdditionsInfoById(additionsId) {
    return server({
        url: "/decorateAdditionsInfo/getAdditionsInfo",
        method: "get",
        params: { additionsId }
    })
}

/**
 * 3.3版本接口--终止订单
 * @param {*} data {id}
 */
export function stopDecorateOrder(data) {
    return server({
        url: "/decorateOrder/stopDecorateOrder",
        method: "put",
        data: data
    })
}

/**
 * 查询分账记录数据列表
 * @param {*} data {decorateOrderId:"",	pageNo: 1,pageSize: 20,accountType:0 人工 1 系统,status:"0，审核中，1，审核通过，2，审核不通过"}
 */
export function getDecorateOrderAccountingRecordsPage(data) {
    return server({
        url: "/decorateOrderAccountingRecords/selectListPage",
        method: "post",
        data: data
    })
}

/**
 * 删除单个装修资料
 * @param {String} id 装修资料id
 */
export function deleteDecorationInfo(id) {
    return server({
        url: "/decorationInfo/delete",
        method: "get",
        params: { id }
    })
}

/**
 * 申请服务商/项目经理分账
 * @param {*} data {type:"用户类型 0 服务商 2 项目经理",serviceAccount:"分账手机号",remark:"分账备注",bigNodeId:"大节点id",decorateOrderId:"订单id",accountPaid:"分账数"}
 */
export function applyServiceAccountDecorateOrder(data) {
    return server({
        url: "/decorateOrderAccountingRecords/applyServiceAccount",
        method: "post",
        data: data
    })
}

/**
 * 审核分账
 * @param {*} data {id:"",decorateOrderId:"",opinion:"审核意见"}
 */
export function checkAccountDecorateOrderAccountingRecords(data) {
    return server({
        url: "/decorateOrderAccountingRecords/checkAccount",
        method: "post",
        data: data
    })
}

/**
 * 申请业主剩余分账
 * @param {*} data 
 */
export function applyOwnerAccountDecorateOrderAccountingRecords(data) {
    return server({
        url: "/decorateOrderAccountingRecords/applyOwnerAccount",
        method: "post",
        data: data
    })
}

/**
 * 根据业主手机号查询信息
 * @param {String} phone 业主手机号
 */
export function getOwnerByPhone(phone) {
    return server({
        url: "/owner/selectByPhone",
        method: "get",
        params: { phone }
    })
}

/**
 * 分页查询利润列表
 * @param {*} data {orderType:"",page:1,pagesize:20}
 */
export function getProfitDecorateOrderPage(data) {
    return server({
        url: "/decorateOrder/query/profit",
        method: "get",
        params: data
    })
}

/**
 * 查询该订单利润记录
 * @param {String} decorateOrderId 订单id
 */
export function getProfitRecordPageByOrderId(decorateOrderId) {
    return server({
        url: "/profit/query/record",
        method: "post",
        params: { decorateOrderId }
    })
}

/**
 * 查询该订单提现记录
 * @param {String} decorateOrderId 订单id
 */
export function getWithdrawRecordPageByOrderId(decorateOrderId) {
    return server({
        url: "/withdraw/query/record",
        method: "post",
        params: { decorateOrderId }
    })
}

/**
 * 保存提现记录
 * @param {*} data {decorateOrderId:"",withdraw:1}
 */
export function saveWithdrawRecord(data) {
    return server({
        url: "/withdraw/save/record",
        method: "post",
        params: data
    })
}