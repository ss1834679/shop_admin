import comIdx from '../views/comIndex'

export default {
    path: '/supplier',
    name: 'supplier_per'/* 权限 */,
    component: comIdx,
    meta: { title: '权限' },
    redirect: '/supplier/department/departmentManagement',
    children: [
        {
            path: 'department',
            name: 'department_sup',
            meta: { title: '部门管理' },
            redirect: '/supplier/department/departmentManagement',
            component: comIdx,
            children: [
                {
                    path: 'departmentManagement',
                    name: 'departmentManagement_sup',
                    meta: { title: '部门管理' },
                    component: () => import( /* webpackChunkName: "departmentManagementSup" */ '../views/supplier/department.vue'),
                }, {
                    path: 'roleManagement',
                    name: 'roleManagement_sup',
                    meta: { title: '角色管理' },
                    component: () => import( /* webpackChunkName: "roleManagementSup" */ '../views/supplier/roleManagement.vue'),
                }, {
                    path: 'roleSetMenu',
                    name: 'roleSetMenu_sup',
                    meta: { title: '设置角色菜单' },
                    component: () => import( /* webpackChunkName: "roleSetMenuSup" */ '../views/supplier/roleSetMenu.vue'),
                }, {
                    path: 'roleSetPermission',
                    name: 'roleSetPermission_sup',
                    meta: { title: '设置角色权限' },
                    component: () => import( /* webpackChunkName: "roleSetPermissionSup" */ '../views/supplier/roleSetPermission.vue'),
                }, {
                    path: 'roleAdd',
                    name: 'roleAdd_sup',
                    meta: { title: '添加角色' },
                    component: () => import( /* webpackChunkName: "roleAddSup" */ '../views/supplier/roleAdd.vue'),
                }
            ]
        }, {
            path: 'member',
            name: 'member_sup',
            meta: { title: '成员管理' },
            redirect: "/supplier/member/member",
            component: comIdx,
            children: [
                {
                    path: 'member',
                    name: 'member_idx_sup',
                    meta: { title: '成员列表' },
                    component: () => import( /* webpackChunkName: "memberSup" */ '../views/supplier/member.vue'),
                }, {
                    path: 'add',
                    name: 'memberAdd_sup',
                    meta: { title: '添加成员' },
                    component: () => import( /* webpackChunkName: "memberAddSup" */ '../views/supplier/memberAdd.vue'),
                }, {
                    path: 'alter',
                    name: 'memberAlter_sup',
                    meta: { title: '修改成员' },
                    component: () => import( /* webpackChunkName: "memberAlterSup" */ '../views/supplier/memberAlter.vue'),
                }, {
                    path: 'memberSetPermission',
                    name: 'memberSetPermission_sup',
                    meta: { title: '设置角色权限' },
                    component: () => import( /* webpackChunkName: "memberSetPermissionSup" */ '../views/supplier/memberSetPermission.vue'),
                },
            ]
        }, {
            path: "editSupplier",
            name: "editSupplier",
            meta: { title: "编辑店铺信息" },
            component: () => import( /* webpackChunkName: "editSupplier" */ '../views/supplier/editSupplier')
        }, {
            path: 'delivery',
            name: 'delivery',
            meta: { title: '发货点信息管理' },
            redirect: '/supplier/delivery/deliveryInformation',
            component: () => import( /* webpackChunkName: "remind" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'deliveryInformation',
                    name: 'delivery-information',
                    meta: { title: '发货点信息管理' },
                    component: () => import( /* webpackChunkName: "deliveryInformation" */ '../views/supplier/delivery-information')
                }, {
                    path: 'addDelivery',
                    name: 'add-delivery',
                    meta: { title: '添加发货点' },
                    component: () => import( /* webpackChunkName: "add-delivery" */ '../views/supplier/delivery-add')
                }, {
                    path: 'alterDelivery',
                    name: 'alter-delivery',
                    meta: { title: '修改发货点' },
                    component: () => import( /* webpackChunkName: "alter-delivery" */ '../views/supplier/delivery-alter')
                }
            ]
        },
    ]
}