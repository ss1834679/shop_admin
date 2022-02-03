import comIdx from '../views/comIndex'

export default {
    path: '/magic',
    name: 'magic',
    component: comIdx,
    meta: { title: '家魔方' },
    children: [
        {
            path: 'cdkey',
            name: 'cdkeyList',
            meta: { title: '激活码' },
            component: () => import( /* webpackChunkName: "cdkeyList" */ '../views/magicHome/cdkeyList')
        },
        {
            path: 'editCdkey',
            name: 'editCdkey',
            meta: { title: '编辑激活码' },
            component: () => import( /* webpackChunkName: "editCdkey" */ '../views/magicHome/editCdkey')
        },
        {
            path: 'recommend',
            name: 'homeRecommend',
            meta: { title: '推荐管理' },
            component: () => import( /* webpackChunkName: "homeRecommend" */ '../views/magicHome/homeRecommend')
        }
    ]
}