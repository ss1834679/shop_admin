
import comIdx from '../views/comIndex'

export default {
    path: '/cityOperation',
    name: 'cityOperation',
    component: comIdx,
    meta: { title: '城市运营中心' },
    children: [
        {
            path: 'CityOpera',
            name: 'CityOpera',
            meta: { title: '城市运营中心管理' },
            component: () => import( /* webpackChunkName: "setings" */ '../views/comIndex.vue'),
            children: [{
                path: 'cityOperation_idx',
                name: 'cityOperation_idx',
                meta: { title: '城市运营中心列表' },
                component: () => import( /* webpackChunkName: "cityOperationIdx" */ '../views/CityOperation/CityOperation_idx')
            }, 
            {
               
                path: 'add_cityOperation',
                name: 'add_cityOperation',
                meta: { title: '添加城市运营中心' },
                component: () => import( /* webpackChunkName: "addCityOperation" */ '../views/CityOperation/add_CityOperation')
                }, 
                {
                    path: 'edit_CityOperation',
                    name: 'edit_CityOperation',
                    meta: { title: '编辑城市运营中心' },
                    component: () => import( /* webpackChunkName: "editCityOperation" */ '../views/CityOperation/edit_CityOperation')
                },
               
            ]
        },
        {
            path: 'decorate',
            name: 'decorate',
            meta: { title: '装修公司管理' },
            component: () => import( /* webpackChunkName: "setings" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'decorate_company',
                    name: 'decorate_company',
                    meta: { title: '装修公司列表' },
                    component: () => import( /* webpackChunkName: "decorateCompany" */ '../views/CityOperation/decorate_company')
                },
                {
                    path: 'decorate_add',
                    name: 'decorate_add',
                    meta: { title: '添加装修公司' },
                    component: () => import( /* webpackChunkName: "decorateAdd" */ '../views/CityOperation/decorate_add')
                },
                {
                    path: 'decorate_edit',
                    name: 'decorate_edit',
                    meta: { title: '编辑装修公司' },
                    component: () => import( /* webpackChunkName: "decorateEdit" */ '../views/CityOperation/decorate_edit')
                }

            ]
        }

         
    ]
}