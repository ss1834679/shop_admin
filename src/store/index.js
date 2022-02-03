import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { getUserMe, getMyMenu } from "../api/permission"
import vue from '../main';
export default new Vuex.Store({
  state: {
    userinfo: {
      sysRoleList: []
    },
    loginState: false,
    allofMenu: []/* 当前服务器的所有菜单 */,
    provinceCityDistrict: []/* 省市区列表 */,
    // 这里本来是没有值的userMenu
    userMenu: []/* 当前用户的菜单 */,
    chatRouter: { name: "contact" },
    breadCrumbList: [],
    unReadNum: 0/* 所有未读条数 */,
    isConnect: false,
    allMenu: [
      {
        title: "首页" /* 最左侧的标题 */,
        name: "index" /* 路由的根路径下的第一个 以这个为名字的路由都在这个下面 */,
        icon: "el-icon-s-home" /* 左侧的图标 */,
        children: [
          {
            title: "系统首页" /* 每个分组的名称 原型图 */,
            children: [
              { path: "/index/index", title: "系统首页", status: false },
              //{ path: "/index/indexSet/entrySet", title: "首页入口设置" },
              { path: "/index/setMyInfo", title: "账户设置" },
              { path: "/index/honeIndexSet", title: "首页设置" }
            ]
          }, {
            title: "商城数据",
            children: [
              { path: "/index/mallData/board", title: "看板" }
            ]
          }
        ]
      },
      {
        title: "商品",
        name: "goods",
        icon: "el-icon-s-goods",
        children: [
          {
            title: "商品管理",
            children: [
              { path: "/goods/goods/index", title: "商品列表 " },
              { path: "/goods/goods/add", title: "添加商品 " },
              { path: "/goods/goods/check", title: "商品审核" },
              { path: "/goods/goods_comment", title: "商品评论", status: false }
            ]
          },
          {
            title: "商品配置",
            children: [
              { path: "/goods/attribute/index", title: "商品类型" },
              { path: "/goods/category/index", title: "商品分类" },
              { path: "/goods/brand/index", title: "品牌管理" }
            ]
          }
        ]
      },
      {
        title: "订单",
        name: "order",
        icon: "el-icon-s-order",
        children: [
          {
            title: "订单管理",
            children: [
              { path: "/order/order/index", title: "订单列表" },
              { path: "/order/confirm/confirmOrder", title: "确认收货" },
              { path: "/order/remind/remindOrder", title: "到货提醒", status: false },
              { path: '/order/set/orderSet', title: "订单设置" },
            ]
          },
          {
            title: "退款及退货",
            children: [
              { path: "/order/return/returnGoods", title: "退货申请列表" },
              { path: "/order/return/returnMoney", title: "退款申请列表" },
              { path: '/order/why/whyReturn', title: "退货原因管理" },
            ]
          },
          {
            title: "快递单管理",
            children: [
              { path: '/order/bill/billTemplate', title: "快递单模板" },
              { path: "/order/bill/addTemplate", title: "添加模板" },
              { path: '/order/custom/customPrint', title: "自定义打印项" },
            ],
            status: false
          }
        ]
      },
      {
        title: "用户",
        name: "user",
        icon: "el-icon-user",
        children: [
          {
            title: "用户管理",
            children: [
              { path: "/user/user/index", title: "用户列表" }
            ]
          }
        ]
      },
      {
        title: "运营",
        name: "operate",
        icon: "el-icon-s-platform",
        children: [
          {
            title: "广告管理",
            children: [
              { path: "/operate/ad/index", title: "广告列表" },
              { path: "/operate/ad/add", title: "添加广告" }
            ]
          }
        ]
      },
      {
        title: "本级",
        name: "permission",
        icon: "el-icon-lock",
        children: [
          {
            title: "权限管理",
            children: [
              { path: "/permission/department/departmentManagement", title: "部门管理" },
              { path: "/permission/member/member", title: "成员管理" },
              { path: "/permission/customerService", title: "客服管理", status: false },
              { path: "/permission/supplier/index", title: "供应商管理" },
              { path: "/permission/menu/management", title: "菜单管理" }
            ]
          }
        ]
      }
    ]/* 当前项目的所有菜单 包括还没有传到服务器的菜单 */,
    activeName: "index-menu",
    base_url: process.env.VUE_APP_GETFILE,
    baseSize_url: process.env.VUE_APP_GETFILESIZE,
    upload_url: process.env.VUE_APP_FILEUPLOAD,
  },
  mutations: {
    GETLOGIN: (state, obj) => {
      state.userinfo = obj
    },
    GETLOGOUT: (state) => {
      state.userinfo = {};
      state.loginState = false;
      state.userMenu = []
    },
    GETMENU: (state, obj) => {
      if (obj.type == "admin") {
        state.userMenu = state.allMenu;
      } else {
        state.userMenu = obj.menu
      }
    },
    changePath: (state, active) => {
      state.activeName = active
    },
    getprovinceCityDistrict: (state, arr) => {
      state.provinceCityDistrict = arr
    },
    changeChatRouter: (state, obj) => {
      state.chatRouter = obj
    },
    changeUnReadNum: (state, num) => {
      state.unReadNum = num
    },
    changeIsConnect: (state, bellon) => {
      state.isConnect = bellon
    },
    changeBread: (state, arr) => {
      state.breadCrumbList = arr
    }
  },
  actions: {
    /**
     * 获取用户菜单 1 获取当前用户信息 2 通过用户信息的userName是不是admin 如果是则userMenu是当前的所有列表
     * 如果不是 则通过查询当前用户的菜单列表进保存在store中的userMenu
     */
    getMyMenu({ commit }) {
      getUserMe().then(data => {
        if (data.data.status == 200) {
          if (!(vue.$route.query.type == "newtag")) {
            let huanUesr = { UxuafX: "", PauYAFawjT: "" }
            localStorage.removeItem("UCGSashAUaf")
            if (data.data.content.huanXinUser) {
              huanUesr.UxuafX = data.data.content.huanXinUser.id/* 环信用户id */
              huanUesr.PauYAFawjT = data.data.content.huanXinUser.password/* 环信用户密码 */
              localStorage.setItem("UCGSashAUaf", JSON.stringify(huanUesr))
            }
            // const user = localStorage.getItem("UCGSashAUaf") && JSON.parse(localStorage.getItem("UCGSashAUaf"));
          }
          commit("GETLOGIN", data.data.content)
          let origin = JSON.stringify(document.URL)
          let test = ["//192.168.124.252", "//localhost", "//192.168.124.249"]
          let req = () => {
            let bellon = false
            test.forEach(item => {
              if (origin.indexOf(item) == 6) {
                bellon = true
              }
            })
            return bellon
          }
          if (data.data.content.sysUser.username == "admin" || req()) {
            commit("GETMENU", { type: "admin" })
          } else {
            getMyMenu().then(data => {
              let initMenu = (arr, level) => {
                let le = level || 1
                if (Array.isArray(arr)) {
                  let arr1 = new Array(arr.length);
                  arr.forEach((item, index) => {
                    if (item.sysMenu.level == le) {
                      arr1[index] = item.sysMenu;
                      arr1[index]["children"] = initMenu(item.menuModelList, le + 1);
                    }
                  });
                  arr1 = arr1.filter(item => {
                    return item != null
                  })
                  return arr1;
                } else {
                  return null;
                }
              }
              commit("GETMENU", { type: "user", menu: initMenu(data.data.content) })
            })
          }
        }
      })
    },
    getlogout({ commit }) {
      commit("GETLOGOUT")
    }
  },
  getters: {
    onGetUnReadNum(state) {
      return state.unReadNum;
    },
    onGetIsConnect(state) {
      return state.isConnect;
    },
    /** 获取当前用户是否是供应商 */
    onGetIsSupplier(state) {
      let boolean = false
      if (state.userinfo && state.userinfo.sysCompany && state.userinfo.sysCompany.id != "1243456383387967488") {
        boolean = true
      }
      return boolean;
    },
    /** 获取当前用户是否是管理员 */
    onGetIsManager(state) {
      let boolean = false
      state.userinfo.sysRoleList && state.userinfo.sysRoleList.forEach(item => {
        if (item.name.includes("管理员")) {
          boolean = true
        }
      })
      return boolean;
    },
    /** 获取当前用户是否是设计师 */
    onGetIsDesigner(state) {
      let boolean = false
      state.userinfo.sysRoleList && state.userinfo.sysRoleList.forEach(item => {
        if (item.name == "设计师") {
          boolean = true
        }
      })
      return boolean;
    },
    /** 获取当前用户是否是管家 */
    onGetIsButler(state) {
      let boolean = false
      state.userinfo.sysRoleList && state.userinfo.sysRoleList.forEach(item => {
        if (item.id == "1281416119806599168") {
          boolean = true
        }
      })
      return boolean;
    },
    /** 获取当前用户是否是运营部的用户 */
    onGetIsOperate(state) {
      let boolean = false
      if (state.userinfo.sysBranch && state.userinfo.sysBranch.id && state.userinfo.sysBranch.id == "1234818130534989824") {
        boolean = true
      }
      return boolean;
    },
    onGetUserMenu(state) {
      return state.userMenu
    },
    /** 面包屑列表 */
    onGetBreadList(state) {
      return state.breadCrumbList
    }
  }
})