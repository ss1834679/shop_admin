import server from '../utils/server'

/**
 * 获取供应商部门信息
 * @param {String} search 搜索内容
 */
export function getSupBranchList(search) {
    return server({
        url: "/sys/branch/supplier/list",
        method: "get",
        params: { search }
    })
}
/**
 * 供应商查询用户
 * @param {*} data {branchId:"",pageIndex:1,pageSize:20,search:""}
 */
export function getSupUserList(data) {
    return server({
        url: "/sys/user/supplier/page",
        method: "get",
        params: data
    })
}
/**
 * 供应商添加部门信息
 * @param {*} data sysBranch部门信息
 */
export function insertBranchSup(data) {
    return server({
        url: "/sys/branch/supplier/insert",
        method: "post",
        data: data
    })
}
/**
 * 供应商根据ID删除部门信息
 * @param {String} id 部门ID
 */
export function deleteBranchSup(id) {
    return server({
        url: "/sys/branch/supplier/delete",
        method: "delete",
        params: { id }
    })
}
/**
 * 供应商修改部门信息
 * @param {*} data sysBranch部门信息
 */
export function updateBranchSup(data) {
    return server({
        url: "/sys/branch/supplier/update",
        method: "post",
        data: data
    })
}
/**
 * 添加后台用户
 * @param {obj} obj {...添加的用户信息,roleId:[]角色id的数组}
 */
export function insertUserSup(obj) {
    let arr = new URLSearchParams();
    arr.append("roleIdList", obj.roleId)
    return server({
        url: '/sys/user/supplier/insert',
        method: "post",
        params: arr,
        data: obj
    })
}
/**
 * 修改用户信息
 * @param {Array} role 角色id数组
 * @param {*} data 用户信息
 */
export function updateUserSup(role, data) {
    let arr = new URLSearchParams();
    arr.append("roleIdList", role)
    return server({
        url: `/sys/user/supplier/update`,
        method: "post",
        params: arr,
        data: data
    })
}
/**
 * 供应商根据ID删除用户信息
 * @param {String} sysUserId 用户ID
 */
export function deleteUserSup(sysUserId) {
    return server({
        url: "/sys/user/supplier/delete",
        method: "delete",
        params: { sysUserId }
    })
}
/**
 * 供应商修改用户状态
 * @param {String} sysUserId 用户id
 */
export function updateUserStatusSup(sysUserId) {
    return server({
        url: "/sys/user/supplier/update/status",
        method: "post",
        params: { sysUserId }
    })
}
/**
 * 供应商添加角色信息
 * @param {*} obj {...:角色信息 , menu:[]菜单ID数组 , permission:[]权限ID数组}
 */
export function insertRoleSup(obj) {
    let arr = new URLSearchParams()
    arr.append("menuIdList", obj.menu)
    arr.append("permissionIdList", obj.permission)
    return server({
        url: "/sys/role/supplier/insert",
        method: "post",
        params: arr,
        data: obj.sysRole
    })
}
/**
 * 供应商修改角色的信息
 * @param {*} obj 角色的信息
 */
export function updateRoleSup(obj) {
    return server({
        url: "/sys/role/supplier/update",
        method: "post",
        data: obj
    })
}
/**
 * 供应商修改角色与菜单的关联关系
 * @param {Array} menu 菜单id数组
 * @param {*} roleId 角色id
 */
export function alterRoleMenuSup(menu, roleId) {
    let arr = new URLSearchParams()
    arr.append("menuIdList", menu)
    return server({
        url: `/sys/role/supplier/update/menu/${roleId}`,
        method: "post",
        params: arr
    })
}
/**
 * 供应商修改权限与菜单的关联关系
 * @param {Array} permission 权限id数组
 * @param {*} roleId 角色id
 */
export function alterRolePermissionSup(permission, roleId) {
    let arr = new URLSearchParams()
    arr.append("permissionIdList", permission)
    return server({
        url: `/sys/role/supplier/update/permission/${roleId}`,
        method: "post",
        params: arr
    })
}
/**
 * 供应商修改角色状态
 * @param {String} roleId 角色id
 */
export function updateRoleStatusSup(roleId) {
    return server({
        url: `/sys/role/supplier/update/status/${roleId}`,
        method: "post"
    })
}
/**
 * 根据ID删除角色信息
 * @param {String} roleId 角色id
 */
export function deleteRoleSup(roleId) {
    return server({
        url: `/sys/role/supplier/delete/${roleId}`,
        method: "delete"
    })
}
/**
 * 获取登录用户的店铺信息
 */
export function getSupplierLogin() {
    return server({
        url: "/supplier/query/login",
        method: "get"
    })
}
/**
 * 根据ID获取地址信息
 * @param {String} id 地址id
 */
export function getDeliveryById(id) {
    return server({
        url: "/sys/address/query",
        method: "get",
        params: { id }
    })
}



/* 供应商查询商品信息*/
export function getSupplierList(obj) {
    return server({
        url: `/goods/supplier/list`,
        method: "get",
        params:obj
    })
    
}
