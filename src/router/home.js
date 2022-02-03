import comIdx from '../views/comIndex'
import homeIndex from '../views/home/homeIndex'

export default {
    path: '/index',
    name: 'home',
    component: comIdx,
    redirect: '/index/index',
    meta: { title: '首页' },
    children: [
        // {
        //     path: 'index',
        //     name: 'homeIndex',
        //     meta: { title: '系统首页' },
        //     component: homeIndex
        // },
        {
            path: "setMyInfo",
            name: "setMyInfo",
            meta: { title: "个人信息" },
            component: () => import( /* webpackChunkName: "setMyInfo" */ '../views/home/setMyInfo.vue')
        },
        {
            path: "mallData",
            name: "mallData",
            meta: { title: "商城数据" },
            component: comIdx,
            children: [
                {
                    path: "board",
                    name: "bulletinBoard",
                    meta: { title: "看板" },
                    component: () => import( /* webpackChunkName: "bulletinBoard" */ '../views/home/mallData/bulletinBoard.vue')
                }
            ]
        },
        /* {
            path: 'indexSet',
            name: 'indexSet',
            meta: { title: '首页设置' },
            component: comIdx,
            children: [
                {
                    path: 'entrySet',
                    name: 'entrySet',
                    meta: { title: '图片设置' },
                    component: () => import( '../views/home/entrySet')
                }
            ]
        }, */
        {
            path: "honeIndexSet",
            name: "honeIndexSet",
            meta: { title: "首页设置" },
            component: () => import( /* webpackChunkName: "honeIndexSet" */ '../views/home/homeIndexSet.vue')
        },
    ]
}