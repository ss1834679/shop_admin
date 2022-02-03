import order from '../utils/server'

/**
 * 查询订单列表
 * @param {*} obj
 */
export function getOrderList(obj) {
  return order({
    url: "/order/page",
    method: "post",
    data: obj
  })
}
/**
 * 查询订单各个状态的数量
 * @param {string} userId 用户id
 */
export function GetOrderByStatusCount() {
  return order({
    url: `/order/orderByStatusCount`,
    method: "get",
  })
}

/**
 * 获取订单详情
 * @param {string} oborderId 
 */
export function findOrderOne(oborderId) {
  return order({
    url: `/order/findOne/${oborderId}`,
    method: "get",
  })
}

/**
 * 删除订单
 * @param {string} orderId 
 */
export function deleteOrder(orderId) {
  return order({
    url: "/order/deleteOrder",
    method: "delete",
    data: orderId
  })
}


/**
 * 关闭订单
 * @param {*} obj 
 */
export function closeOrder(obj) {
  return order({
    url: "/order/closeOrder",
    method: "PUT",
    data: obj
  })
}

/**
 * 订单设置数据查询展示
 */
export function settingOrderList() {
  return order({
    url: "/order/settingOrder/find",
    method: "GET",
  })
}



/**
 * 订单设置信息提交
 * @param {*} obj 
 */
export function settingOrderPut(obj) {
  return order({
    url: "/order/settingOrder/update",
    method: "PUT",
    data: obj
  })
}


/**
 * 订单发货列表
 * @param {*} obj 
 */
export function shipList(obj) {
  return order({
    url: "/order/shipList",
    method: "PUT",
    data: obj
  })
}


/**
 * 订单发货
 * @param {string} shipModels 
 */
export function orderShip(shipModels) {
  return order({
    url: "/order/ship",
    method: "PUT",
    data: shipModels
  })
}


/**
 * 打印订单
 * @param {string} orderId 
 */
export function printShipments(orderId) {
  return order({
    url: "/order/printShipments",
    method: "post",
    data: orderId
  })
}

/**
 * 合并订单
 * @param {String} fromOrderSn 
 * @param {string} mainOrderSn 
 */
export function mergeOrder(fromOrderSn, mainOrderSn) {
  return order({
    url: `/order/mergeOrder/${fromOrderSn}/${mainOrderSn}`,
    method: "post",
  })
}




/**
 * 查询订单物流列表
 */
export function GetDeliveryInfoList() {
  return order({
    url: `/deliveryInfo/list`,
    method: "get",
  })
}


/**
 * 修改收货人信息
 * @param {*} obj 
 */
export function updateConsigneeInfo(obj) {
  return order({
    url: `/order/updateConsigneeInfo`,
    method: "PUT",
    data: obj
  })
}


/**
 * 获取订单下的商品列表
 * @param {string} orderId 
 */
export function getOrderItemList(orderId) {
  return order({
    url: `/orderItem/getOrderItemList/${orderId}`,
    method: "get",
  })
}



/**
 * 确认收货操作
 * @param {*} arr 
 */
export function getConfirmReceipt(arr) {
  return order({
    url: `/order/confirmReceipt`,
    method: "get",
    data: arr
  })
}


/**
 * 确认收货操作
 * @param {*} obj
 */
export function getOrderRemarks(obj) {
  return order({
    url: `/order/orderRemarks`,
    method: "PUT",
    data: obj
  })
}


/**
 * 修改订单商品费用
 * @param {*} obj 
 */
export function updateOrderGoodsPrice(obj) {
  return order({
    url: `/order/updateOrderGoodsPrice`,
    method: "PUT",
    data: obj
  })
}


/**
 * 确认收货操作
 * @param {*} obj 
 */
export function confirmReceipt(obj) {
  return order({
    url: `/order/confirmReceipt`,
    method: "PUT",
    data: obj
  })
}


/**
 *
退货列表查询
 * @param {*} obj 
 */
export function getAfterSaleList(obj) {
  return order({
    url: `/afterSale/page`,
    method: "post",
    data: obj
  })
}

/**
 * 查询退货各个状态的数量
 * @param {string} userId
 */
export function afterSaleByStatusCount() {
  return order({
    url: `/afterSale/afterSaleByStatusCount`,
    method: "GET",
  })
}

/**
 *
查询退款详情
 * @param {string} userId
 */
export function afterSaleReturnsInfo(id) {
  return order({
    url: `/afterSale/returnsInfo/${id}`,
    method: "GET",
  })
}

/**
 *

确认退货
 * @param {string} userId
 */
export function confirmedReturn(obj) {
  return order({
    url: `/afterSale/confirmedReturn`,
    method: "PUT",
    data: obj
  })
}

/**
 *

退货列表收货
 * @param {string} userId
 */
export function confirmedReceiving(obj) {
  return order({
    url: `/afterSale/confirmedReceiving`,
    method: "PUT",
    data: obj
  })
}




/**
 *

退款列表查询
 * @param {string} userId
 */
export function getRefundPage(obj) {
  return order({
    url: `/afterSale/refundPage`,
    method: "post",
    data: obj
  })
}


/**
 *

查询退款各个状态的数量
 * @param {string} userId
 */
export function afterSaleRefundByMoneyStatusCount() {
  return order({
    url: `/afterSale/afterSaleRefundByStatusCount`,
    method: "get"
  })
}



/**
 *
退款详情查询
 * @param {string} userId
 */
export function getRefundInfo(id) {
  return order({
    url: `/afterSale/refundInfo/${id}`,
    method: "post"
  })
}


/**
 *

确认退款
 * @param {string} userId
 */
export function refundMoneyInfo(obj) {
  return order({
    url: `/afterSale/confirmRefund`,
    method: "PUT",
    data: obj
  })
}



/**
 *

退货原因列表查询
 * @param {} userId
 */
export function getReturnReasonPage(obj) {
  return order({
    url: `/returnReason/page`,
    method: "post",
    data: obj
  })
}




/**
 *

退货原因添加
 * @param {} userId
 */
export function getReturnReasonSave(obj) {
  return order({
    url: `/returnReason/save`,
    method: "post",
    data: obj
  })
}


/**
 *

退货原因修改
 * @param {} userId
 */
export function getReturnReasonUpdate(obj) {
  return order({
    url: `/returnReason/update`,
    method: "PUT",
    data: obj
  })
}




/**
 *

退货原因修改
 * @param {} userId
 */
export function returnReasonDeleteBatch(obj) {
  return order({
    url: `/returnReason/deleteBatch`,
    method: "DELETE",
    data: obj
  })
}

/**
 * 导出订单
 * @param {Array} orderIds 订单id集
 */
export function exportOrderExcel(orderIds) {
  return order({
    url: "/order/exportOrderExcelV2",
    method: "post",
    data: orderIds,
    responseType: "blob"
  })
}

/**
 * 导出订单 筛选条件
 * @param {*} orderExcelParam {endTime:"",orderSn:"",orderStatus:"",receive:"",startTime:""}
 */
export function exportOrderExcelCon(orderExcelParam) {
  return order({
    url: "/order/exportOrderExcelV3",
    method: "post",
    data: orderExcelParam,
    responseType: "blob"
  })
}