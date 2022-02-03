
import comIdx from '../views/comIndex'

export default {
    path: '/setings',
    name: 'seting',
    component: comIdx,
    meta: { title: '设置' },
    children: [{
        path: 'freight',
        name: 'freight',
        meta: { title: '支付配送' },
        component: () => import( /* webpackChunkName: "freight" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'freightIdx',
            meta: { title: '运费模板' },
            component: () => import( /* webpackChunkName: "freightIdx" */ '../views/setings/freight_idx')
        }, {
            path: 'add',
            name: 'freightAdd',
            meta: { title: '添加运费模板' },
            component: () => import( /* webpackChunkName: "freightAdd" */ '../views/setings/freight_add')
        }, {
            path: 'alter',
            name: 'freightAlter',
            meta: { title: '修改运费模板' },
            component: () => import( /* webpackChunkName: "freightAlter" */ '../views/setings/freight_alter')
        }
        ]
    }, {
        path: 'index',
        name: 'configure',
        meta: { title: '配置管理' },
        component: () => import( /* webpackChunkName: "setingIdx" */ '../views/comIndex.vue'),
        children: [{
            path: 'houseType',
            name: 'houseType_idx',
            meta: { title: '房型管理' },
            component: () => import( /* webpackChunkName: "houseType_idx" */ '../views/setings/houseType_idx')
        }
        ]
    }, {
        path: 'imManage',
        name: 'imManage',
        meta: { title: 'IM管理' },
        component: () => import( /* webpackChunkName: "immanage" */ '../views/comIndex.vue'),
        children: [{
            path: 'imRoleManage',
            name: 'imRoleManage',
            meta: { title: 'IM角色管理' },
            component: () => import( /* webpackChunkName: "imRoleManage" */ '../views/setings/imRoleManage')
        }, {
            path: 'imRoleEdit',
            name: 'imRoleEdit',
            meta: { title: 'IM角色编辑' },
            component: () => import( /* webpackChunkName: "imRoleEdit" */ '../views/setings/imRoleEdit')
        }
        ]
    },
    {
        path: 'message',
        name: 'message',
        meta: { title: '推送管理' },
        component: () => import( /* webpackChunkName: "freight" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'messageApp_idx',
            meta: { title: 'app推送消息模板' },
            component: () => import( /* webpackChunkName: "messageIdx" */ '../views/setings/messageApp_idx')
        }, {
            path: 'weiXin',
            name: 'message_weiXin',
            meta: { title: '小程序订阅消息' },
            component: () => import( /* webpackChunkName: "messageEmail" */ '../views/setings/message_weiXin')
        }, {
            path: 'appEdit',
            name: 'message_appEdit',
            meta: { title: 'app推送消息编辑' },
            component: () => import( /* webpackChunkName: "messageEmail" */ '../views/setings/message_appEdit')
        }
        ]
    }, {
        path: 'edition',
        name: 'edition',
        meta: { title: '版本' },
        component: () => import( /* webpackChunkName: "edition" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'edition_idx',
            meta: { title: '版本管理' },
            component: () => import( /* webpackChunkName: "edition_idx" */ '../views/setings/edition_idx')
        }
        ]
    },
    ]
}
