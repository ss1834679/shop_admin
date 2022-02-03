import comIdx from '../views/comIndex'

export default {
    path: '/operate',
    name: 'operate'/* 运营 */,
    component: comIdx,
    meta: { title: '运营' },
    redirect: '/operate/ad/index',
    children: [
        {
            path: 'ad',
            name: 'ad',
            meta: { title: '广告管理' },
            redirect: '/operate/ad/index',
            component: () => import( /* webpackChunkName: "order" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'index',
                    name: 'ad_Idx',
                    meta: { title: '广告列表' },
                    component: () => import( /* webpackChunkName: "adIdx" */ '../views/operate/ad_idx.vue')
                }, {
                    path: 'add',
                    name: 'ad_add',
                    meta: { title: '添加广告' },
                    component: () => import( /* webpackChunkName: "adAdd" */ '../views/operate/ad_add.vue')
                }, {
                    path: 'alter',
                    name: 'ad_alter',
                    meta: { title: '修改广告' },
                    component: () => import( /* webpackChunkName: "adAlter" */ '../views/operate/ad_alter.vue')
                }
            ]
        },
        {
            path: 'messages',
            name: 'messages',
            meta: { title: '消息管理' },
            redirect: '/operate/messages/index',
            component: () => import( /* webpackChunkName: "messages" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'index',
                    name: 'messages_idx',
                    meta: { title: '系统消息' },
                    component: () => import( /* webpackChunkName: "messagesIdxc" */ '../views/operate/messages_idx.vue')
                }
                // , {
                //     path: 'add',
                //     name: 'ad_add',
                //     meta: { title: '添加广告' },
                //     component: () => import( /* webpackChunkName: "adAdd" */ '../views/operate/ad_add.vue')
                // }, {
                //     path: 'alter',
                //     name: 'ad_alter',
                //     meta: { title: '修改广告' },
                //     component: () => import( /* webpackChunkName: "adAlter" */ '../views/operate/ad_alter.vue')
                // }
            ]
        },
    ]
}