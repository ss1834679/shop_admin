import comIdx from '../views/comIndex'

export default {
    path: '/order',
    name: 'order'/* 订单 */,
    component: comIdx,
    meta: { title: '订单' },
    redirect: '/order/order/index',
    children: [
        {
            path: 'order',
            name: 'orders',
            meta: { title: '订单管理' },
            redirect: '/order/order/index',
            component: () => import( /* webpackChunkName: "order" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'index',
                    name: 'order_Idx',
                    meta: { title: '订单列表' },
                    component: () => import( /* webpackChunkName: "orderIdx" */ '../views/order/order_idx.vue')
                }, {
                    path: 'view',
                    name: 'order_view',
                    meta: { title: '订单详情' },
                    component: () => import( /* webpackChunkName: "viewOrder" */ '../views/order/order_view.vue')
                }, {
                    path: 'alter',
                    name: 'alterGoodsInfo',
                    meta: { title: '修改商品信息' },
                    component: () => import( /* webpackChunkName: "alterInfo" */ '../views/order/order_goodsInfo.vue')
                }, {
                    path: 'tracking',
                    name: 'order_tracking',
                    meta: { title: '订单跟踪' },
                    component: () => import( /* webpackChunkName: "orderTracking" */ '../views/order/order_tracking.vue')
                }, {
                    path: 'quxiao',
                    name: 'quxiao_order',
                    meta: { title: '取消订单' },
                    component: () => import( /* webpackChunkName: "quxiaoOrder" */ '../views/order/quxiao_order.vue')
                }, {
                    path: 'addorder',
                    name: 'add_order',
                    meta: { title: '合并订单' },
                    component: () => import( /* webpackChunkName: "cocatOrder" */ '../views/order/add_order.vue')
                }, {
                    path: 'printorder',
                    name: 'print-order',
                    meta: { title: '打印发货单' },
                    component: () => import( /* webpackChunkName: "printOrder" */ '../views/order/print-order.vue')
                }, {
                    path: 'bulkShipment',
                    name: 'bulk-shipment',
                    meta: { title: '批量发货' },
                    component: () => import( /* webpackChunkName: "bulkShipment" */ '../views/order/bulk-shipment.vue')
                }
            ]
        },
        {
            path: 'return',
            name: 'return',
            meta: { title: '退款及退货' },
            redirect: '/order/return/returnGoods',
            component: () => import( /* webpackChunkName: "return" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'returnGoods',
                    name: 'return_Goods',
                    meta: { title: '退货申请处理' },
                    component: () => import( /* webpackChunkName: "returnGoods" */ '../views/order/return_goods.vue')
                }, {
                    path: 'returnMoney',
                    name: 'return_Money',
                    meta: { title: '退款申请处理' },
                    component: () => import( /* webpackChunkName: "returnMoney" */ '../views/order/return_money.vue')
                }, {
                    path: 'returnGoodsDetails',
                    name: 'return_Goods_Details',
                    meta: { title: '服务单详情' },
                    component: () => import( /* webpackChunkName: "returnGoodsDetails" */ '../views/order/returnGoodsDetails.vue')
                }, {
                    path: 'returnMoneyDetails',
                    name: 'return_Money_Details',
                    meta: { title: '服务单详情' },
                    component: () => import( /* webpackChunkName: "returnMoneyDetails" */ '../views/order/returnMoneyDetails.vue')
                },

            ]
        },

        {
            path: 'confirm',
            name: 'confirm',
            meta: { title: '确认收货' },
            redirect: '/order/confirm/confirmOrder',
            component: () => import( /* webpackChunkName: "return" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'confirmOrder',
                    name: 'confirm-order',
                    meta: { title: '确认收货' },
                    component: () => import( /* webpackChunkName: "confirmOrder" */ '../views/order/confirm-order.vue')
                }

            ]
        },
        {
            path: 'remind',
            name: 'remind',
            meta: { title: '到货提醒' },
            redirect: '/order/remind/remindOrder',
            component: () => import( /* webpackChunkName: "remind" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'remindOrder',
                    name: 'remind-order',
                    meta: { title: '到货提醒' },
                    component: () => import( /* webpackChunkName: "remindOrder" */ '../views/order/remind-order.vue')
                }

            ]
        },
        {
            path: 'set',
            name: 'set',
            meta: { title: '订单设置' },
            redirect: '/order/set/orderSet',
            component: () => import( /* webpackChunkName: "remind" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'orderSet',
                    name: 'order-set',
                    meta: { title: '订单设置' },
                    component: () => import( /* webpackChunkName: "orderSet" */ '../views/order/order-set.vue')
                }

            ]
        }, {
            path: 'why',
            name: 'why',
            meta: { title: '退货原因管理' },
            redirect: '/order/why/whyReturn',
            component: () => import( /* webpackChunkName: "remind" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'whyReturn',
                    name: 'why-return',
                    meta: { title: '退货原因管理' },
                    component: () => import( /* webpackChunkName: "whyReturnOrder" */ '../views/order/why-return.vue')
                }

            ]
        },
        {
            path: 'bill',
            name: 'bill',
            meta: { title: '快递单模板' },
            redirect: '/order/bill/billTemplate',
            component: () => import( /* webpackChunkName: "remind" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'billTemplate',
                    name: 'bill-template',
                    meta: { title: '快递单模板' },
                    component: () => import( /* webpackChunkName: "billTemplate" */ '../views/order/bill-template.vue')
                }, {
                    path: 'addTemplate',
                    name: 'add-template',
                    meta: { title: '添加模板' },
                    component: () => import( /* webpackChunkName: "add-template" */ '../views/order/add-template.vue')
                },

            ]
        },
        {
            path: 'custom',
            name: 'custom',
            meta: { title: '自定义打印项' },
            redirect: '/order/custom/customPrint',
            component: () => import( /* webpackChunkName: "remind" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'customPrint',
                    name: 'custom-print',
                    meta: { title: '自定义打印项' },
                    component: () => import( /* webpackChunkName: "customPrint" */ '../views/order/custom-print.vue')
                }

            ]
        },
    ]
}