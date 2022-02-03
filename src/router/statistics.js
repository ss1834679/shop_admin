import comIdx from '../views/comIndex'

export default {
    path: '/statistics',
    name: 'statistics',
    component: comIdx,
    meta: { title: '统计' },
    children: [
        {
            path: "shopData",
            name: "shopMallData",
            meta: { title: "商城数据" },
            component: comIdx,
            children: [
                {
                    path: "goodsdata",
                    name: "goodsData",
                    meta: { title: "商品数据" },
                    component: () => import( /* webpackChunkName: "goodsData" */ '../views/statistics/shopData/goodsData.vue')
                },
                {
                    path: "goodsdataview",
                    name: "goodsDataView",
                    meta: { title: "数据详情" },
                    component: () => import( /* webpackChunkName: "goodsDataView" */ '../views/statistics/shopData/goodsDataView.vue')
                },
                {
                    path: "shopdata",
                    name: "shopData",
                    meta: { title: "店铺数据" },
                    component: () => import( /* webpackChunkName: "shopData" */ '../views/statistics/shopData/shopData.vue')
                },
                {
                    path: "shopdataview",
                    name: "shopDataView",
                    meta: { title: "数据详情" },
                    component: () => import( /* webpackChunkName: "shopDataView" */ '../views/statistics/shopData/shopDataView.vue')
                }
            ]
        }
    ]
}