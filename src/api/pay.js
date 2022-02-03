import pay from '../utils/pay'

/**
 * 查询快递
 * @param {String} deliveryCode 快递公司code
 * @param {String} deliverySn 快递单号
 */
export function getExpress(deliveryCode, deliverySn) {
    return pay({
        url: `/express/query`,
        method: "POST",
        params: {
            deliveryCode,
            deliverySn
        }
    })
}


/**
 * 快捷支付退款
 * @param {*} obj {amount:"退款金额",memo:"备注",origMerchOrderNo:"原订单号",reason:"退款原因",refundAdvanceAmount:"原交易垫资退还金额"}
 */
// export function quickRefund(obj) {
//     return pay({
//         url: `/merge/refund`,
//         method: "POST",
//         data: obj
//     })
// }

/**
 * 快捷支付退款 V3.1
 * @param {*} obj {amount:"退款金额",memo:"备注",origMerchOrderNo:"原订单号",reason:"退款原因",refundAdvanceAmount:"原交易垫资退还金额"}
 */
export function quickRefundV3_1(data) {
    return pay({
        url: "/merge/refund",
        method: "post",
        data: data
    })
}

/**
 * 开通资金账户
 * @param {*} data {outUserId:"",roleType:"1 业主 2 服务商 3 项目经理"}
 */
export function openAccount(data) {
    return pay({
        url: "/account/open",
        method: "post",
        params: data
    })
}

/**
 * 查询账户可用金额
 * @param {String} outUserId 第三方凭证id
 */
export function getOwnerByOutUserId(outUserId) {
    return pay({
        url: "/account/selectAmountAvailable",
        method: "get",
        params: { outUserId }
    })
}