import comIdx from '../views/comIndex'

export default {
    path: '/user',
    name: 'user'/* 用户 */,
    component: comIdx,
    meta: { title: '用户' },
    redirect: '/user/user/index',
    children: [
        {
            path: 'user',
            name: 'users',
            meta: { title: '用户管理' },
            component: () => import( /* webpackChunkName: "users" */ '../views/comIndex.vue'),
            children: [
                // {
                //     path: 'index',
                //     name: 'user_Idx',
                //     meta: { title: '用户列表' },
                //     component: () => import( /* webpackChunkName: "userIdx" */ '../views/user/user_idx.vue')
                // }, {
                //     path: 'edit',
                //     name: 'user_edit',
                //     meta: { title: '编辑资料' },
                //     component: () => import( /* webpackChunkName: "userEdit" */ '../views/user/user_edit.vue')
                // }, {
                //     path: 'log',
                //     name: 'user_log',
                //     meta: { title: '登录日志' },
                //     component: () => import( /* webpackChunkName: "userLog" */ '../views/user/user_log.vue')
                // }, {
                //     path: 'detail',
                //     name: 'user_detail',
                //     meta: { title: '用户详情' },
                //     component: () => import( /* webpackChunkName: "userDetail" */ '../views/user/user_detail.vue')
                // }, {
                //     path: 'label',
                //     name: 'user_label',
                //     meta: { title: '用户标签' },
                //     component: () => import( /* webpackChunkName: "userLabel" */ '../views/user/user_label.vue')
                // }, {
                //     path: "screening",
                //     name: "powerScreening",
                //     meta: { title: "购买力筛选" },
                //     component: () => import( /* webpackChunkName: "powerScreening" */ '../views/user/powerScreening')
                // }
                {
                    path: 'index',
                    name: 'userList',
                    meta: { title: '用户列表' },
                    component: () => import( /* webpackChunkName: "userList" */ '../views/user/manager/userList')
                },
                {
                    path: 'details',
                    name: 'userDetails',
                    meta: { title: '用户详情' },
                    component: () => import( /* webpackChunkName: "userDetails" */ '../views/user/manager/userDetails')
                }
            ]
        },
    ]
}