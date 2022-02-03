import server from "../utils/server"

/**
 * 结余金额
 */
export function getSettlementBalance() {
    return server({
        url: "/finance/settlementBalance",
        method: "get",
    })
}
/**
 * 总收入笔数
 */
export function getTotalOrders() {
    return server({
        url: "/finance/totalOrders",
        method: "get",
    })
}
/**
 * 总收入金额
 */
export function getTotalRevenueAmount() {
    return server({
        url: "/finance/totalRevenueAmount",
        method: "get",
    })
}
/**
 * 总支出笔数
 */
export function getTotalExpenditure() {
    return server({
        url: "/finance/totalExpenditure",
        method: "get",
    })
}
/**
 * 总支出金额
 */
export function getTotalExpenditureAmount() {
    return server({
        url: "/finance/totalExpenditureAmount",
        method: "get",
    })
}
/**
 * 总收入金额
 */
export function postReconciliationList(obj) {
    return server({
        url: "/finance/reconciliationList",
        method: "post",
        data: obj
    })
}
/**
 * 导出对账列表
 */
export function getExportReconciliationList(obj) {
    return server({
        url: "/finance/exportReconciliationList",
        method: "get",
        params: obj,
        responseType: "blob"
    })
}

//财务明细接口
/**
 * 财务明细-基本信息
 */
export function getReconciliation(obj) {
    return server({
        url: "/finance/reconciliation",
        method: "get",
        params: obj
    })
}
/**
 * 财务明细-数据列表
 */
export function getDetailedList(obj) {
    return server({
        url: "/finance/reconciliationDetailedList",
        method: "post",
        data: obj
    })
}
/**
 *
 财务明细-修改开票状态
 */
export function getBillStatus(obj) {
    return server({
        url: "/finance/updataBillStatus",
        method: "get",
        params: obj
    })
}
/**
 *
 财务明细-修改对账状态
 */
export function getImportButton(obj) {
    return server({
        url: "/finance/importButton",
        method: "get",
        params: obj
    })
}

/**
 * 财务明细-支出导入对账
 */
export function uploadImport(obj, file) {
    let afile = new FormData()
    afile.append("file", file)
    return server({
        url: "/finance/expenditureImport",
        method: "post",
        data: afile,
        params: obj
    })
}
/**
 * 财务明细-收入导入对账
 */
export function uploadIncomeImport(obj, file) {
    let afile = new FormData()
    afile.append("file", file)
    return server({
        url: "/finance/incomeImport",
        method: "post",
        data: afile,
        params: obj
    })
}
/**
 *财务明细-修改对账状态
 */
export function uploadStatus(obj) {
    return server({
        url: "/finance/updataReconciliationStatus",
        method: "get",
        params: obj
    })
}

/**
 * 资金账户列表
 * @param {*} data 
 */
export function getCapitalAccountPage(data) {
    return server({
        url: "/capitalAccount/selectPage",
        method: "post",
        data: data
    })
}

/**
 * 资金账户-个人信息
 * @param {String} userAccount 资金账户
 */
export function getCapitalAccountDetailsByAccount(userAccount) {
    return server({
        url: "/capitalAccount/selectByUserAccount",
        method: "get",
        params: { userAccount }
    })
}

/**
 * 财务 角色类型列表
 */
export function getCapitalAccountRoleList() {
    return server({
        url: "/capitalAccount/roleList",
        method: "get"
    })
}

/**
 * 资金账户-总金额、可用金额、冻结金额
 * @param {String} userAccount 资金账户
 */
export function getCapitalAccountMoney(userAccount) {
    return server({
        url: "/capitalAccount/selectMoney",
        method: "get",
        params: { userAccount }
    })
}

/**
 * 资金账户-提现（金额和笔数）
 * @param {String} userAccount 资金账户
 */
export function getCapitalAccountWithdrawal(userAccount) {
    return server({
        url: "/capitalAccount/selectWithdrawal",
        method: "get",
        params: { userAccount }
    })
}

/**
 * 资金账户-转入（金额和笔数）
 * @param {String} userAccount 资金账户
 */
export function getCapitalAccountInto(userAccount) {
    return server({
        url: "/capitalAccount/selectInto",
        method: "get",
        params: { userAccount }
    })
}

/**
 * 资金账户-转出（金额和笔数）
 * @param {String} userAccount 资金账户
 */
export function getCapitalAccountRollout(userAccount) {
    return server({
        url: "/capitalAccount/selectRollout",
        method: "get",
        params: { userAccount }
    })
}

/**
 * 资金账户-应收（金额和笔数）
 * @param {String} outUserId 资金账户
 */
export function getCapitalAccountReceivable(outUserId) {
    return server({
        url: "/capitalAccount/selectReceivable",
        method: "get",
        params: { outUserId }
    })
}

/**
 * 转账分页
 * @param {*} data 
 */
export function getCapitalAccountTransferPage(data) {
    return server({
        url: "/capitalAccount/selectTransferPage",
        method: "post",
        data: data
    })
}

/**
 * 提现分页
 * @param {*} data 
 */
export function getCapitalAccountWithdrawalPage(data) {
    return server({
        url: "/capitalAccount/selectWithdrawalPage",
        method: "post",
        data: data
    })
}

/**
 * 充值分页
 * @param {*} data 
 */
export function getCapitalAccountRechargePage(data) {
    return server({
        url: "/capitalAccount/selectRechargePage",
        method: "post",
        data: data
    })
}

/**
 * 应收款明细分页
 * @param {*} data 
 */
export function getCapitalAccountReceivablesPage(data) {
    return server({
        url: "/capitalAccount/selectReceivablesPage",
        method: "post",
        data: data
    })
}

/**
 * 资金明细导出
 * @param {String} outUserId 资金账户
 */
export function exportCapitalAccountFundDetails(outUserId) {
    return server({
        url: "/capitalAccount/fundDetailsExport",
        method: "get",
        responseType: "blob",
        params: { outUserId }
    })
}

/**
 * 资金账户导出
 * @param {*} data 
 */
export function exportCapitalAccount(data) {
    return server({
        url: "/capitalAccount/selectExport",
        method: "post",
        data: data,
        responseType: "blob"
    })
}

/**
 * 对账查询账户可用金额
 * @param {String} outUserId 第三方账户凭证id
 */
export function getPayAccountReconciliationAmountAvailable(outUserId) {
    return server({
        url: "/payAccountReconciliation/selectAmountAvailable",
        params: { outUserId }
    })
}

/**
 * 对账查询总收入
 * @param {String} outUserId 第三方账户凭证id
 */
export function getPayAccountReconciliationRevenue(outUserId) {
    return server({
        url: "/payAccountReconciliation/selectRevenue",
        params: { outUserId }
    })
}

/**
 * 对账查询总支出
 * @param {String} outUserId 第三方账户凭证id
 */
export function getPayAccountReconciliationExpenditure(outUserId) {
    return server({
        url: "/payAccountReconciliation/selectExpenditure",
        params: { outUserId }
    })
}

/**
 * 对账查询总提现
 * @param {String} outUserId 第三方账户凭证id
 */
export function getPayAccountReconciliationWithdraw(outUserId) {
    return server({
        url: "/payAccountReconciliation/selectWithdraw",
        params: { outUserId }
    })
}

/**
 * 对账分页
 * @param {*} data 
 */
export function getPayAccountReconciliationTransferPage(data) {
    return server({
        url: "/payAccountReconciliation/selectTransferPage",
        method: "post",
        data: data
    })
}

/**
 * 对账详情 单个
 * @param {String} id 
 */
export function getPayAccountReconciliationTransferOne(id) {
    return server({
        url: "/payAccountReconciliation/selectTransferOne",
        params: { id }
    })
}

/**
 * 财务明细分页
 * @param {*} data 
 */
export function getPayAccountReconciliationTransferInfoPage(data) {
    return server({
        url: "/payAccountReconciliation/selectTransferInfoPage",
        method: "post",
        data: data
    })
}

/**
 * 修改对账状态
 * @param {*} data {id:"财务明细id",reconciliationStatus:"对账状态（0.未对账、1.已对账、-1异常）",reconciliationRemark:"对账备注"}
 */
export function udpatePayAccountReconciliationReconciliation(data) {
    return server({
        url: "/payAccountReconciliation/udpateReconciliation",
        method: "post",
        params: data
    })
}

/**
 * 修改开票状态
 * @param {*} data {id:"",invoicingStatus:"开票状态 0.未开票、1.已开票"}
 */
export function updatePayAccountReconciliationInvoicing(data) {
    return server({
        url: "/payAccountReconciliation/updateInvoicing",
        method: "post",
        params: data
    })
}

/**
 * 修改备注
 * @param {*} data {id:"",remark:""}
 */
export function updatePayAccountReconciliationRemark(data) {
    return server({
        url: "/payAccountReconciliation/updateRemark",
        method: "post",
        params: data
    })
}

/**
 * 查询订单对账、异常状态值
 * @param {*} data {billDate:"",outUserId:""}
 */
export function getOrderStatusValuePayAccountReconciliation(data) {
    return server({
        url: "/payAccountReconciliation/queryOrderStatusValue",
        params: data
    })
}

/**
 * 财务明细导出
 * @param {*} data {billDate:"",outUserId:"",endDate:"",startDate:""}
 */
export function exportPayAccountReconciliationTransferInfo(data) {
    return server({
        url: "/payAccountReconciliation/selectTransferInfoExport",
        method: "post",
        data: data,
        responseType: "blob"
    })
}