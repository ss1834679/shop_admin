
import comIdx from '../views/comIndex'

export default {
    path: '/house',
    name: 'house',
    component: comIdx,
    meta: { title: '全屋设计' },
    children: [
        {
            path: 'houseDesign',
            name: 'houseDesign',
            meta: { title: '全屋设计管理' },
            component: () => import( /* webpackChunkName: "houseDesign" */ '../views/comIndex.vue'),
            children: [{
                path: 'houseDesign_idx',
                name: 'houseDesign_idx',
                meta: { title: '设计方案列表' },
                component: () => import( /* webpackChunkName: "houseDesignIdx" */ '../views/house/houseDesign_idx.vue')
            }, {
                path: 'houseDesign_add',
                name: 'houseDesign_add',
                meta: { title: '添加全屋设计方案' },
                component: () => import( /* webpackChunkName: "houseDesignAdd" */ '../views/house/houseDesign_add.vue')
            }
            ]
        },
        {
            path: 'houseType',
            name: 'houseType',
            meta: { title: '户型管理' },
            component: () => import( /* webpackChunkName: "houseType" */ '../views/comIndex.vue'),
            children: [{
                path: 'houseTypeCategory',
                name: 'houseTypeCategory',
                meta: { title: '户型分类' },
                component: () => import( /* webpackChunkName: "houseTypeCategory" */ '../views/house/houseTypeCategory.vue')
            }, {
                path: 'houseCategory_add',
                name: 'houseCategory_add',
                meta: { title: '添加户型分类' },
                component: () => import( /* webpackChunkName: "houseCategoryAdd" */ '../views/house/houseCategory_add.vue')
            }
            ]
        },
        // {
        //     path: 'houseStyle',
        //     name: 'houseStyle',
        //     meta: { title: '风格管理' },
        //     component: () => import( /* webpackChunkName: "houseStyle" */ '../views/comIndex.vue'),
        //     children: [{
        //         path: 'houseStyleCategory',
        //         name: 'houseStyleCategory',
        //         meta: { title: '风格分类' },
        //         component: () => import( /* webpackChunkName: "houseStyleCategory" */ '../views/house/houseStyleCategory.vue')
        //     }, {
        //         path: 'houseStyleCategory_add',
        //         name: 'houseStyleCategory_add',
        //         meta: { title: '添加风格分类' },
        //         component: () => import( /* webpackChunkName: "houseStyleCategoryAdd" */ '../views/house/houseStyleCategory_add.vue')
        //     }
        //     ]
        // },
        {
            path: 'demand',
            name: 'demand',
            meta: { title: '需求管理' },
            component: () => import( /* webpackChunkName: "demand" */ '../views/comIndex.vue'),
            children: [{
                path: 'demand_idx',
                name: 'demand_idx',
                meta: { title: '需求列表' },
                component: () => import( /* webpackChunkName: "demandIdx" */ '../views/house/demand_idx.vue')
            }
            ]
        }
    ]
}