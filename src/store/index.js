import Vue from 'vue'
import Vuex from 'vuex'

import Chat from "./chat";
import FriendModule from "./friendModule";
import Emedia from "./emedia";
import WebIM from '../utils/WebIM'

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
              { path: "/description", title: "使用文档" },
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
              { path: "/goods/goods/indexSup", title: "商品列表(供)" },
              { path: "/goods/goods/add", title: "添加商品 " },
              { path: "/goods/goods/addSup", title: "添加商品(供)" },
              { path: "/goods/goods/check", title: "商品审核" },
              { path: "/goods/supplier/index", title: "店铺管理", status: false },
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
          },
          {
            title: "设计师",
            children: [
              { path: "/goods/designer/index", title: "设计师列表" },
              { path: "/goods/designer/add", title: "添加设计师" },
              { path: "/goods/designer/check", title: "设计师审核" }
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
        title: "促销",
        name: "promotion",
        icon: "el-icon-discount",
        children: [
          {
            title: "秒杀专区",
            children: [
              { path: "/promotion/seckill/index", title: "秒杀活动列表" }
              // { path: "/promotion/seckill/time", title: "时间段列表" },
              // { path: "/promotion/seckill/remind", title: "秒杀提醒通知" }
            ],
            status: false
          },
          {
            title: "优惠券管理",
            children: [
              { path: "/promotion/coupon/index", title: "优惠券列表" },
              { path: "/promotion/coupon/add", title: "添加优惠券" }
            ],
            status: false
          },
          {
            title: "活动管理",
            children: [
              { path: "/promotion/discount/index", title: "活动列表" },
              { path: "/promotion/discount/add", title: "添加活动" },
            ],
            status: false
          },
          {
            title: "投票活动",
            children: [
              { path: "/promotion/voteactivity/voteActivityList", title: "活动列表" }
            ]
          },
          {
            title: "落地页",
            children: [
              { path: "/promotion/landing/landingConfig", title: "页面配置" }
            ]
          },
          {
            title: "拼团",
            children: [
              { path: "/promotion/groupShopping/index", title: "拼团商品" },
              { path: "/promotion/groupShopping/order", title: "拼团管理" },
              { path: "/promotion/groupShopping/setting", title: "拼团设置" }
            ]
          },
          {
            title: "分销管理",
            children: [
              { path: "/promotion/distribuManage/disGroupList", title: "团队列表" },
              { path: "/promotion/distribuManage/distribuList", title: "分销列表" },
              { path: "/promotion/distribuManage/distribuSet", title: "分销设置" },
              { path: "/promotion/distribuManage/withdrawalList", title: "提现列表" },
              { path: "/promotion/distribuManage/withdrawalSet", title: "提现设置" }
            ]
          },
          {
            title: "首页推荐",
            children: [
              { path: "/promotion/indexRecommend/brandday", title: "涂邦品牌日" },
              { path: "/promotion/indexRecommend/tbSeckill", title: "涂邦快抢" },
              { path: "/promotion/indexRecommend/popularRecommend", title: "人气推荐" },
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
        title: "设计",
        name: "design",
        icon: "el-icon-s-opportunity",
        children: [
          {
            title: "设计公司",
            children: [
              { path: "/design/company/index", title: "设计公司列表" },
              { path: "/design/company/companyLevel", title: "设计师公司等级" },
              { path: "/design/company/companyinSet", title: "入驻设置" },
              { path: "/design/company/orderDemand", title: "预约需求" },
            ]
          }
        ]
      },
      {
        title: "区域",
        name: "cityOperation",
        icon: "el-icon-office-building",
        children: [
          {
            title: "运营中心管理",
            children: [
              { path: "/cityOperation/CityOpera/CityOperation_idx", title: "运营中心列表" },
              { path: "/cityOperation/decorate/decorate_company", title: "装修公司列表" },
            ]
          }
        ]
      },
      {
        title: "全屋",
        name: "house",
        icon: "el-icon-folder-add",
        children: [
          {
            title: "全屋设计管理",
            children: [
              { path: "/house/houseDesign/houseDesign_idx", title: "设计方案列表" },
              { path: "/house/houseType/houseTypeCategory", title: "户型分类" },
              // { path: "/house/houseStyle/houseStyleCategory", title: "风格分类" },
              { path: "/house/demand/demand_idx", title: "需求列表" }
            ]
          }
        ],
        status: false
      },
      {
        title: "设置",
        name: "setings",
        icon: "el-icon-setting",
        children: [
          {
            title: "设置管理",
            children: [
              { path: "/setings/index/houseType", title: "户型管理" }
            ]
          },
          {
            title: "支付配送",
            children: [
              { path: "/setings/freight/index", title: "运费模板" }
            ]
          },
          {
            title: "消息提醒",
            children: [
              { path: "/setings/message/index", title: "app推送消息模板", status: 0 },
              { path: "/setings/message/weiXin", title: "小程序订阅消息", status: 0 },
            ]
          },
          {
            title: "IM管理",
            children: [
              { path: "/setings/imManage/imRoleManage", title: "IM角色管理" }
            ]
          },
          {
            title: "版本",
            children: [
              { path: "/setings/edition/index", title: "版本管理" }
            ]
          }
        ]
      },
      {
        title: "内容",
        name: "content",
        icon: "el-icon-menu",
        children: [
          {
            title: "圈子详情",
            children: [
              { path: "/content/circle/topic_index", title: "话题列表" },
              { path: "/content/circle/article_index", title: "文章列表" },
              { path: "/content/circle/article_check", title: "文章审核" }
            ]
          }, {
            title: "灵感详情",
            children: [
              { path: "/content/circle/inspiration_index", title: "灵感列表" },
              { path: "/content/circle/inspiration_check", title: "灵感审核" },
            ]
          }, {
            title: "设计师",
            children: [
              { path: "/content/circle/editDesigner", title: "设计师基本信息" },
            ]
          }, {
            title: "涂邦资讯",
            children: [
              { path: "/content/circle/tbinformation-idx", title: "资讯列表" },
              { path: "/content/circle/tbinformation_check", title: "资讯审核" },
            ]
          }, {
            title: "案例管理",
            children: [
              { path: "/content/promanage/prolist", title: "案例列表" },
              { path: "/content/promanage/offerDemand", title: "报价需求" },
              { path: "/content/promanage/villageList", title: "小区列表" },
              { path: "/content/promanage/styleList", title: "风格列表" }
            ]
          }
        ]
      },
      {
        title: "统计",
        name: "statistics",
        icon: "el-icon-s-data",
        children: [
          {
            title: "商城数据",
            children: [
              { path: "/statistics/shopData/goodsdata", title: "商品数据" },
              { path: "/statistics/shopData/shopdata", title: "店铺数据" }
            ]
          }
        ]
      },
      {
        title: "财务",
        name: "finance",
        icon: "el-icon-coin",
        children: [
          {
            title: "财务管理",
            children: [
              { path: "/finance/pa/reconciliationList", title: "对账列表" },
              { path: "/finance/pa/capitalAccount/list", title: "资金账户" }
            ]
          }
        ]
      },
      {
        title: "装修",
        name: "trim",
        icon: "el-icon-brush",
        children: [
          {
            title: "装修角色管理",
            children: [
              { path: "/trim/trimrole/trimmanage", title: "装修管家" },
              { path: "/trim/trimrole/trimSerproviderRole", title: "服务商角色" },
              { path: "/trim/trimrole/trimSerprovider", title: "服务商" },
              { path: "/trim/trimrole/trimPromanage", title: "项目经理" },
              { path: "/trim/trimrole/proprietor", title: "业主" }
            ]
          },
          {
            title: "装修流程管理",
            children: [
              { path: "/trim/trimprocess/trimprocesslist", title: "装修流程配置" },
              { path: "/trim/trimorder/list", title: "装修订单" },
              { path: "/trim/trimorder/trimProfitList", title: "装修订单利润" },
              { path: "/trim/trimorder/applyProfitCheck", title: "分账审核" }
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
      },
      {
        title: "商家",
        name: "supplier",
        icon: "el-icon-s-shop",
        children: [
          {
            title: "店铺管理",
            children: [
              { path: "/supplier/editSupplier", title: "编辑店铺信息" },
            ]
          },
          {
            title: "权限管理",
            children: [
              { path: "/supplier/department/departmentManagement", title: "部门管理" },
              { path: "/supplier/member/member", title: "成员管理" }
            ]
          },
          {
            title: "发货点信息管理",
            children: [
              { path: '/supplier/delivery/deliveryInformation', title: "发货点信息管理" },
              { path: '/supplier/delivery/addDelivery', title: "添加发货点" },
            ]
          }
        ]
      },
      {
        title: "家魔方",
        name: "magic",
        icon: "el-icon-magic-stick",
        children: [
          {
            title: "家魔方管理",
            children: [
              { path: "/magic/cdkey", title: "激活码" },
              { path: "/magic/recommend", title: "推荐管理" }
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
            const user = localStorage.getItem("UCGSashAUaf") && JSON.parse(localStorage.getItem("UCGSashAUaf"));
            if (user) {
              const alihfa = user.UxuafX;
              const pachabdk = user.PauYAFawjT;
              var options = {
                apiUrl: WebIM.config.apiURL,
                user: alihfa,
                pwd: pachabdk,
                appKey: WebIM.config.appkey
              };
              (alihfa && pachabdk) && (WebIM.conn.open(options), commit("changeIsConnect", true))
            }
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
  },
  modules: {
    chat: Chat,
    friendModule: FriendModule,
    emedia: Emedia
  }
})