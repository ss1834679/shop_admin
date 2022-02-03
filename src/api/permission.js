/* 权限的接口 */
import server from "../utils/server"
/* 添加部门 */
export function insertBranch(obj) {
    return server({
        url: "/sys/branch/insert",
        method: 'post',
        data: obj
    })
}
/* 获取部门 分页 */
export function getBranchPage(obj) {
    return server({
        url: `/sys/branch/page/${obj.pageIndex}`,
        method: "get",
        params: obj.filter
    })
}
/**
 * 查询登录用户所在公司的部门 添加成员时获取部门
 */
export function getBranchListLogin() {
    return server({
        url: "/sys/branch/list/login",
        method: "get"
    })
}
/* 修改部门 */
export function updateBranch(obj) {
    return server({
        url: "/sys/branch/update",
        method: "post",
        data: obj
    })
}
/**
 * 删除部门
 * @param {String} branchId 部门id
 */
export function deleteBranch(branchId) {
    return server({
        url: `/sys/branch/delete/${branchId}`,
        method: "DELETE"
    })
}
/**
 * 通过部门id获取角色
 * @param {String} branchId 部门id
 */
export function getRoleByBranch(branchId) {
    return server({
        url: `/sys/role/list/branch/${branchId}`,
        method: "GET"
    })
}
/**
 * 添加角色
 * @param {*} obj {...:角色信息 , menu:[]菜单ID数组 , permission:[]权限ID数组}
 */
export function insertRole(obj) {
    /* 传数组 到服务器 */
    let arr1 = new URLSearchParams()
    arr1.append('menuIdList', obj.menu);
    arr1.append("permissionIdList", obj.permission)
    return server({
        url: "/sys/role/insert",
        method: 'post',
        data: obj.sysRole,
        params: arr1
    })
}
/**
 * 通过roleId 获取角色
 * @param {String} roleId 角色id
 */
export function getRoleById(roleId) {
    return server({
        url: `/sys/role/query/${roleId}`,
        method: "get"
    })
}
/**
 * 修改角色 权限
 * @param {*} obj {id:角色id,permission:[]权限id数组}
 */
export function alterRolePermission(obj) {
    let arr = new URLSearchParams()
    arr.append("permissionIdList", obj.permission)
    return server({
        url: `/sys/role/update/permission/${obj.id}`,
        method: "post",
        params: arr
    })
}
/**
 * 修改角色 菜单
 * @param {Array} menu 菜单id集合 
 * @param {String} id 角色id 
 */
export function alterRoleMenu(menu, id) {
    let arr = new URLSearchParams()
    arr.append("menuIdList", menu)
    return server({
        url: `/sys/role/update/menu/${id}`,
        method: "post",
        params: arr
    })
}
/* 修改角色信息 */
export function updateRole(obj) {
    return server({
        url: "/sys/role/update",
        method: "post",
        data: obj
    })
}
/**
 * 修改角色状态
 * @param {String} roleId 角色id
 */
export function updateRoleStatus(roleId) {
    return server({
        url: `/sys/role/update/status/${roleId}`,
        method: "post"
    })
}
/**
 * 删除角色
 * @param {String} roleId 角色id
 */
export function deleteRole(roleId) {
    return server({
        url: `/sys/role/delete/${roleId}`,
        method: "DELETE"
    })
}
/**
 * 添加菜单
 * @param {Object} obj 菜单的所有字段
 */
export function addmenu(obj) {
    return server({
        url: "/sys/menu/insert",
        method: "post",
        data: obj
    })
}
/**
 * 修改菜单
 * @param {*} obj 菜单的所有信息
 */
export function alterMenu(obj) {
    return server({
        url: "/sys/menu/update",
        method: "post",
        data: obj
    })
}
/**
 * 修改菜单状态
 * @param {String} sysMenuId 菜单id
 */
export function changeMenuStatus(sysMenuId) {
    return server({
        url: `/sys/menu/update/status/${sysMenuId}`,
        method: "post"
    })
}
/**
 * 删除菜单
 * @param {String} sysMenuId 菜单id
 */
export function deleteMenu(sysMenuId) {
    return server({
        url: `/sys/menu/delete/${sysMenuId}`,
        method: "delete"
    })
}
/**
 * 通过菜单id获取菜单信息
 * @param {String} sysMenuId 菜单id
 */
export function getMenuById(sysMenuId) {
    return server({
        url: `/sys/menu/query/${sysMenuId}`,
        method: "get"
    })
}
/**
 * 根据父级菜单id查询所有子菜单
 * @param {String} parentId 父级菜单id
 */
export function getMenuByParent(parentId) {
    return server({
        url: `/sys/menu/list/parent/${parentId}`,
        method: "get"
    })
}
/**
 * 超级管理获取所有菜单
 */
export function getMenu() {
    return server({
        url: "/sys/menu/list",
        method: "get"
    })
}
/**
 * 权限分配者查询所有已经启用的菜单
 */
export function getStatusMenu() {
    return server({
        url: "/sys/menu/list/status",
        method: "get"
    })
}
/**
 * 获取当前用户的菜单目录
 */
export function getMyMenu() {
    return server({
        url: "/sys/menu/list/user",
        method: "get"
    })
}
/**
 * 通过 roleId 获取菜单
 * @param {String} roleId 角色id
 */
export function getMenuByRole(roleId) {
    return server({
        url: `/sys/menu/list/role/${roleId}`,
        method: "get"
    })
}
/**
 * 获取所有权限
 */
export function getPermissionAll() {
    return server({
        url: "/sys/permission/list/all",
        method: "get"
    })
}
/**
 * 获取当前用户拥有的权限  
 */
export function getPermissionLogin() {
    return server({
        url: "/sys/permission/list/login",
        method: "get"
    })
}
/**
 * 通过 roleId 获取权限
 * @param {String} roleId 角色ID
 */
export function getPermissionByRole(roleId) {
    return server({
        url: `/sys/permission/list/role/${roleId}`,
        method: "get"
    })
}
/**
 * 通过userID 获取权限
 * @param {String} userId 用户的userID
 */
export function getPermissionByUserId(userId) {
    return server({
        url: `/sys/permission/list/user/${userId}`,
        method: "get"
    })
}
/**
 * 添加后台用户
 * @param {obj} obj {...添加的用户信息,roleId:[]角色id的数组}
 */
export function insertUser(obj) {
    let arr = new URLSearchParams();
    arr.append("roleIdList", obj.roleId)
    return server({
        url: '/sys/user/insert',
        method: "post",
        params: arr,
        data: obj
    })
}
/**
 * 根据部门查询未绑定设计师的账号
 * @param {String} branchId 设计师的部门id
 */
export function getUserDesigner(branchId) {
    return server({
        url: `/sys/user/list/branch/designer/${branchId}`,
        method: 'get'
    })
}
/**
 * 分页获取用户列表
 * @param {*} obj {page:1页码,search:{}搜索的对象里面是键值对}
 */
export function getUser(obj) {
    return server({
        url: `/sys/user/page/${obj.pageIndex}`,
        method: 'get',
        params: obj.search
    })
}
/**
 * 通过userid获取用户信息
 * @param {String} userId userId 
 */
export function getUserById(userId) {
    return server({
        url: `/sys/user/query/${userId}`,
        method: "get"
    })
}
/**
 * 获取当前登录用户的信息
 */
export function getUserMe() {
    return server({
        url: '/sys/user/query/login/me',
        method: "get"
    })
}
/**
 * 修改当前登陆的用户信息
 * @param {*} sysUser 修改的信息{id:"",fullName:"",phone:""}
 */
export function updateUserMe(sysUser) {
    return server({
        url: "/sys/user/update/login/me",
        method: "post",
        data: sysUser
    })
}
/**
 * 修改用户信息
 * @param {*} obj 修改的用户信息的所有参数 包含userId 
 */
export function updateUser(role, obj) {
    let arr = new URLSearchParams();
    arr.append("roleIdList", role)
    return server({
        url: `/sys/user/update`,
        method: "post",
        params: arr,
        data: obj
    })
}
/**
 * 修改用户密码
 * @param {*} data {username:"",password:"",newPassword :""}
 */
export function updateUserPassword(data) {
    return server({
        url: "/sys/user/update/password",
        method: "post",
        params: data
    })
}
/**
 * 修改用户状态
 * @param {String} userId 用户的id 
 */
export function updateUserStatus(userId) {
    return server({
        url: `/sys/user/update/${userId}`,
        method: "post"
    })
}
/**
 * 修改用户与角色的关联信息
 * @param {String} userId 要修改的用户id
 * @param {Array} roleIdList 角色id数组
 */
export function updateUserRole(userId, roleIdList) {
    let arr = new URLSearchParams()
    arr.append("roleIdList", roleIdList)
    return server({
        url: `/sys/user/update/role/${userId}`,
        method: "post",
        params: arr
    })
}
/**
 * 单独修改用户的权限
 * @param {Array} permissionIdList 权限数组 
 * @param {String} userId 用户ID 
 */
export function updateUserPermission(permissionIdList, userId) {
    let arr = new URLSearchParams()
    arr.append("permissionIdList", permissionIdList)
    return server({
        url: `/sys/user/update/permission/${userId}`,
        method: "post",
        params: arr
    })
}
/**
 * 根据ID删除用户
 * @param {String} sysUserId 用户ID
 */
export function deleteUser(sysUserId) {
    return server({
        url: `/sys/user/delete/${sysUserId}`,
        method: "delete"
    })
}
/**
 * 批量删除用户
 * @param {Array} idList 用户ID数组
 */
export function deleteUserLot(idList) {
    let arr = new URLSearchParams();
    arr.append("idList", idList)
    return server({
        url: "/sys/user/delete",
        method: "delete",
        params: arr
    })
}
/**
 * 分页查询供应商公司信息
 * @param {Number} pageIndex 当前页码
 * @param {Number} pageSize 每页数量
 * @param {String} content 搜索公司内容
 */
export function getCompanyList(pageIndex, pageSize, content) {
    return server({
        url: "/sys/company/page",
        method: "get",
        params: { pageIndex, pageSize, content }
    })
}
/**
 * 生成一个不重复的账号
 */
export function creatUsername() {
    return server({
        url: "/sys/user/create",
        method: "get"
    })
}

/**
 * 添加公司信息 需要先添加店铺
 * @param {*} data 公司信息 包括店铺id 账号信息
 */
export function insertCompany(data) {
    return server({
        url: "/sys/company/insert/supplier",
        method: "post",
        data: data
    })
}
/**
 * 修改公司信息  应该只能修改公司的名称
 * @param {*} data 公司信息 包括店铺id 账号信息
 */
export function updateCompany(data) {
    return server({
        url: "/sys/company/update",
        method: "post",
        data: data
    })
}
/**
 * 根据ID查询公司信息
 * @param {String} id 公司id
 */
export function getCompanyById(id) {
    return server({
        url: "/sys/company/query",
        method: "get",
        params: { id }
    })
}
/**
 * 根据ID删除公司信息
 * @param {String} id 公司id
 */
export function deleteCompany(id) {
    let idstring = new URLSearchParams()
    idstring.append("id", id)
    return server({
        url: "/sys/company/delete",
        method: "delete",
        params: idstring
    })
}
/**
 * 获取所有公司信息 用于本级用户管理的筛选 部门管理的筛选
 */
export function getCompanyAll() {
    return server({
        url: "/sys/company/list/all",
        method: "get"
    })
}
/**
 * 根据登录用户查询本公司所有部门角色 添加用户的时候选择
 */
export function getRoleLogin() {
    return server({
        url: "/sys/role/list/login",
        method: "get"
    })
}
/**
 * 根据公司ID获取部门信息
 * @param {String} companyId 公司id
 */
export function getBranchByCom(companyId) {
    return server({
        url: "/sys/branch/list/company",
        method: "get",
        params: { companyId }
    })
}