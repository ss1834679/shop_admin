import comIdx from '../views/comIndex'

export default {
    path: '/permission',
    name: 'permission'/* 权限 */,
    component: comIdx,
    meta: { title: '本级' },
    redirect: '/permission/department/departmentManagement',
    children: [
        {
            path: 'department',
            name: 'department',
            meta: { title: '部门管理' },
            redirect: '/permission/department/departmentManagement',
            component: comIdx,
            children: [
                {
                    path: 'departmentManagement',
                    name: 'departmentManagement',
                    meta: { title: '部门管理' },
                    component: () => import( /* webpackChunkName: "departmentManagement" */ '../views/permission/department.vue'),
                }, {
                    path: 'roleManagement',
                    name: 'roleManagement',
                    meta: { title: '角色管理' },
                    component: () => import( /* webpackChunkName: "roleManagement" */ '../views/permission/roleManagement.vue'),
                }, {
                    path: 'roleSetMenu',
                    name: 'roleSetMenu',
                    meta: { title: '设置角色菜单' },
                    component: () => import( /* webpackChunkName: "roleSetMenu" */ '../views/permission/roleSetMenu.vue'),
                }, {
                    path: 'roleSetPermission',
                    name: 'roleSetPermission',
                    meta: { title: '设置角色权限' },
                    component: () => import( /* webpackChunkName: "roleSetPermission" */ '../views/permission/roleSetPermission.vue'),
                }, {
                    path: 'roleAdd',
                    name: 'roleAdd',
                    meta: { title: '添加角色' },
                    component: () => import( /* webpackChunkName: "roleAdd" */ '../views/permission/roleAdd.vue'),
                }
            ]
        }, {
            path: 'member',
            name: 'member',
            meta: { title: '成员管理' },
            redirect: "/permission/member/member",
            component: comIdx,
            children: [
                {
                    path: 'member',
                    name: 'member_idx',
                    meta: { title: '成员列表' },
                    component: () => import( /* webpackChunkName: "member" */ '../views/permission/member.vue'),
                }, {
                    path: 'add',
                    name: 'memberAdd',
                    meta: { title: '添加成员' },
                    component: () => import( /* webpackChunkName: "memberAdd" */ '../views/permission/memberAdd.vue'),
                }, {
                    path: 'alter',
                    name: 'memberAlter',
                    meta: { title: '修改成员' },
                    component: () => import( /* webpackChunkName: "memberAlter" */ '../views/permission/memberAlter.vue'),
                }, {
                    path: 'memberSetPermission',
                    name: 'memberSetPermission',
                    meta: { title: '设置角色权限' },
                    component: () => import( /* webpackChunkName: "memberSetPermission" */ '../views/permission/memberSetPermission.vue'),
                },
            ]
        }, {
            path: 'customerService',
            name: 'customerService',
            meta: { title: '客服管理' },
            component: () => import( /* webpackChunkName: "customerService" */ '../views/permission/customerService.vue'),
        }, {
            path: 'operationLog',
            name: 'operationLog',
            meta: { title: '操作日志' },
            component: () => import( /* webpackChunkName: "operationLog" */ '../views/permission/operationLog.vue'),
        }, {
            path: 'menu',
            name: 'menu',
            meta: { title: '菜单管理' },
            redirect: '/permission/menu/management',
            component: comIdx,
            children: [
                {
                    path: 'add',
                    name: 'menuAdd',
                    meta: { title: '添加菜单' },
                    component: () => import( /* webpackChunkName: "menuAdd" */ '../views/permission/menuAdd.vue'),
                }, {
                    path: 'alter',
                    name: 'menuAlter',
                    meta: { title: '修改菜单' },
                    component: () => import( /* webpackChunkName: "menuAlter" */ '../views/permission/menuAdd.vue'),
                }, {
                    path: 'management',
                    name: 'menuManagement',
                    meta: { title: '菜单管理' },
                    component: () => import( /* webpackChunkName: "menuManagement" */ '../views/permission/menuManagement.vue')
                }
            ]
        }, {
            path: 'supplier',
            name: 'perSupplier',
            meta: { title: '供应商' },
            component: comIdx,
            children: [
                {
                    path: "index",
                    name: "per_supplier_index",
                    meta: { title: "供应商管理" },
                    component: () => import( /* webpackChunkName: "supplierManagement" */ '../views/permission/supplier_management')
                }, {
                    path: "add",
                    name: "per_supplier_add",
                    meta: { title: "添加供应商" },
                    component: () => import( /* webpackChunkName: "supplierAdd" */ '../views/permission/per_supplier_add')
                }
            ]
        },
    ]
}