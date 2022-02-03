
import comIdx from '../views/comIndex'

export default {
    path: '/design',
    name: 'design',
    component: comIdx,
    meta: { title: '设计' },
    children: [
        {
            path: 'company',
            name: 'designCompany',
            meta: { title: '设计公司管理' },
            component: () => import( /* webpackChunkName: "designCompany" */ '../views/comIndex.vue'),
            children: [{
                path: 'index',
                name: 'designCompany_idx',
                meta: { title: '设计公司列表' },
                component: () => import( /* webpackChunkName: "designCompany_idx" */ '../views/design/designCompany_idx')
            }, {
                path: 'add',
                name: 'add_designCompany',
                meta: { title: '添加设计公司' },
                component: () => import( /* webpackChunkName: "addDesignCompany" */ '../views/design/designCompany_add')
            }, {
                path: 'alter',
                name: 'alter_designCompany',
                meta: { title: '修改设计公司' },
                component: () => import( /* webpackChunkName: "alterDesignCompany" */ '../views/design/designCompany_alter')
            }, {
                path: 'companyLevel',
                name: 'designCompanyLevel_idx',
                meta: { title: '设计师公司等级' },
                component: () => import( /* webpackChunkName: "designCompanyLevelIdx" */ '../views/design/designCompanyLevel_idx')
            }, {
                path: 'addCompanyLevel',
                name: 'designCompanyLevel_add',
                meta: { title: '编辑设计师公司等级' },
                component: () => import( /* webpackChunkName: "designCompanyLevelAdd" */ '../views/design/designCompanyLevel_add')
            }, {
                path: 'companyinSet',
                name: 'companyinSet',
                meta: { title: '入驻规则设置' },
                component: () => import( /* webpackChunkName: "companyinSet" */ '../views/design/companyinSet')
            }, {
                path: 'orderDemand',
                name: 'orderDemand',
                meta: { title: '预约需求' },
                component: () => import( /* webpackChunkName: "companyinSet" */ '../views/design/orderDemand')
            }
            ]
        }
    ]
}

