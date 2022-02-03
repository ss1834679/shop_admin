
import comIdx from '../views/comIndex'

export default {
    path: '/finance',
    name: 'finance',
    component: comIdx,
    meta: { title: '财务' },
    redirect: '/finance/pa/reconciliationList',
    children: [{
        path: 'pa',
        name: 'pa',
        meta: { title: '财务管理' },
        redirect: '/finance/pa/reconciliationList',
        component: comIdx,
        children: [
            {
                path: 'reconciliationList',
                name: 'reconciliationList',
                meta: { title: '对账列表' },
                component: () => import( /* webpackChunkName: "freightIdx" */ '../views/finance/reconciliationList.vue')
            },
            {
                path: 'reconciliationDetail',
                name: 'reconciliationDetail',
                meta: { title: '账单明细' },
                component: () => import( /* webpackChunkName: "freightIdx" */ '../views/finance/reconciliationDetail.vue')
            },
            {
                path: 'capitalAccount',
                name: 'capitalAccount',
                meta: { title: '资金账户' },
                component: comIdx,
                children: [
                    {
                        path: 'list',
                        name: 'capitalAccountList',
                        component: () => import( /* webpackChunkName: "capitalAccountList" */ '../views/finance/capitalaccount/capitalAccountList')
                    },
                    {
                        path: 'details',
                        name: 'capitalAccountDetails',
                        meta: { title: '明细' },
                        component: () => import( /* webpackChunkName: "capitalAccountDetails" */ '../views/finance/capitalaccount/capitalAccountDetails')
                    },
                    {
                        path: 'verify',
                        name: 'capitalAccountVerify',
                        meta: { title: '对账' },
                        component: comIdx,
                        children: [
                            {
                                path: 'list',
                                name: 'capitalAccountVerifyList',
                                component: () => import( /* webpackChunkName: "capitalAccountVerifyList" */ '../views/finance/capitalaccount/capitalAccountVerifyList')
                            },
                            {
                                path: 'recorddetails',
                                name: 'capitalAccountVerifyRecorddetails',
                                meta: { title: "财务明细" },
                                component: () => import( /* webpackChunkName: "capitalAccountVerifyRecorddetails" */ '../views/finance/capitalaccount/capitalAccountVerifyRecorddetails')
                            }
                        ]
                    }
                ]
            }
        ]
    }]
}
