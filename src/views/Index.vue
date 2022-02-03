<template>
  <div id="index">
    <!-- 最大的首页 -->
    <el-container>
      <el-header>
        <div class="logoTitle">
          <!-- <img src="../../public/img/logo_small.png" alt /> -->
          <span>涂邦之家后台业务管理系统</span>
        </div>
        <div class="imformation">
          <el-popover placement="bottom" width="400" trigger="hover" class="firstSpan">
            <div>
              <div class="infoHead">
                <span>账户信息</span>
                <el-button type="text" @click="setMyInfo">账户设置</el-button>
              </div>
              <div class="info" v-if="userInfo.sysBranch">
                <ul>
                  <li>所在部门：{{userInfo.sysBranch.name}}</li>
                </ul>
              </div>
            </div>
            <div slot="reference" class="headImg">
              <img
                v-if="userInfo.sysUser&&userInfo.sysUser.icon!=null"
                :src="userInfo.sysUser.icon.includes('http')?`${userInfo.sysUser.icon}`:`${base}${userInfo.sysUser.icon}`"
                alt
              />
              <img v-else src="../../public/img/default_head.png" title="暂无头像" />
              <span v-if="userInfo.sysUser&&userInfo.sysUser.nickName!=null">{{userInfo.sysUser.nickName}}</span>
              <span v-else>暂无姓名</span>
            </div>
          </el-popover>
          <el-button icon="el-icon-s-home" class="headImg" @click="goIndex"></el-button>
          <el-button icon="el-icon-switch-button" class="headImg" @click="logOut"></el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside>
          <tabs-menu></tabs-menu>
        </el-aside>
        <el-container>
          <div class="bread">
            <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
              <template v-for="(item)  in levelList">
                <el-breadcrumb-item :key="item.path" v-if="item.meta.title">
                  <!-- <router-link :to="item.redirect||item.path">{{item.meta.title}}</router-link> -->
                  <span>{{item.meta.title}}</span>
                </el-breadcrumb-item>
              </template>
            </el-breadcrumb>
            <el-button size="small" class="freshBtn" @click="refresh" v-if="!$route.params.isAdd" icon="el-icon-refresh">刷新</el-button>
          </div>
          <el-main v-if="showRouter">
            <router-view></router-view>
          </el-main>
          <el-footer>CopyRight @ 涂邦之家 2020 - 2022</el-footer>
        </el-container>
      </el-container>
    </el-container>
    <div class="IMbutton" v-if="isConnect">
      <el-badge :value="unread" :hidden="unread===0">
        <el-button type="success" plain icon="el-icon-chat-dot-round" @click="chatVisible=true"></el-button>
      </el-badge>
    </div>
    <el-dialog :visible="chatVisible" class="chatWindow" width="75%" @close="chatVisible=false">
      <chat-index></chat-index>
    </el-dialog>
  </div>
</template>

<script>
import tabsMenu from "../components/tabsMenu";
import chatIndex from "../components/chat/chatIndex";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      isCollapse: false,
      activeName: "order-menu",
      gridData: [],
      userInfo: {},
      base: "",
      chatVisible: false,
      showRouter: true
    };
  },
  components: {
    tabsMenu,
    chatIndex
  },
  computed: {
    ...mapGetters({
      unread: "onGetUnReadNum",
      isConnect: "onGetIsConnect",
      levelList: "onGetBreadList"
    })
  },
  mounted() {
    this.base = this.$store.state.base_url;
  },
  watch: {
    "$store.state.userinfo": {
      handler() {
        this.userInfo = this.$store.state.userinfo;
        // console.log(this.userInfo, "999");
      },
      deep: true
    },
    chatVisible: {
      handler() {
        this.$store.commit("changeChatRouter", { name: "contact" });
      }
    }
  },
  methods: {
    ...mapActions(["getlogout"]),
    logOut() {
      this.$router.push({ name: "login" });
      localStorage.setItem("loginState", "false");
      localStorage.removeItem("reqHeaders");
      this.getlogout();
    },
    setMyInfo() {
      this.$router.push({ name: "setMyInfo" });
    },
    goIndex() {
      this.$router.go({ name: "index" });
    },
    refresh() {
      this.showRouter = false;
      this.$nextTick(() => {
        this.showRouter = true;
      });
    }
  }
};
</script>

<style lang='less'>
#index {
  width: 100%;
  height: 100%;
  position: relative;
  .IMbutton {
    position: absolute;
    bottom: 55px;
    right: 30px;
    width: 50px;
    height: 50px;
    z-index: 2000;
    .el-badge {
      height: 100%;
      width: 100%;
      .el-button {
        padding: 0;
        width: 100%;
        height: 100%;
        font-size: 22px;
      }
    }
  }
  .chatWindow {
    .el-dialog__header {
      position: absolute;
      width: 50px;
      right: 0;
      z-index: 1;
    }
    .chatBoxTitle {
      position: absolute;
    }
    .el-dialog {
      width: 75%;
      height: 700px;
      display: flex;
      flex-direction: column;
      .el-dialog__header {
        padding: 0;
        height: 50px;
        line-height: 50px;
      }
      .el-dialog__body {
        height: 700px;
        box-sizing: border-box;
        position: relative;
        padding: 0;
      }
    }
  }
  .el-container {
    .el-header {
      display: flex;
      justify-content: space-between;
      background-color: #31c3a6;
      .logoTitle {
        height: 50px;
        display: flex;
        span {
          line-height: 50px;
          // margin-left: 14px;
          font-weight: 800;
          color: white;
        }
      }
      .imformation {
        height: 100%;
        display: flex;
        align-items: center;
        .firstSpan {
          margin-right: 10px;
        }
      }
      .imformation > span {
        display: inline-block;
        height: 40px;
        padding-top: 5px;
        padding-bottom: 5px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
        }
      }
      .headImg {
        height: 40px;
        display: flex;
        align-items: center;
        position: relative;
        span {
          line-height: 40px;
          color: white;
          font-size: 20px;
        }
      }
      button.headImg::after {
        position: absolute;
        content: "";
        display: block;
        height: 18px;
        width: 1px;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background-color: #279c85;
      }
      .imformation:nth-last-child::after {
        display: none;
      }
      button.headImg {
        height: 50px;
        padding: 0;
        padding-left: 10px;
        padding-right: 10px;
        background-color: transparent;
        border: none;
        color: white !important;
        margin-left: 0;
        font-size: 22px;
      }
    }
    .bread {
      height: 40px;
      position: relative;
      .app-breadcrumb {
        line-height: 40px;
        padding: 0;
        padding-left: 10px;
      }
      .freshBtn {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .el-aside {
      background-color: #d3dce6;
      color: #333;
      height: 100%;
      width: auto !important;
      .el-tabs {
        height: 100%;
        .el-tabs__header {
          background-color: #464c5b;
          margin: 0;
          .el-tabs__nav {
            .el-tabs__active-bar {
              display: none;
            }
            .el-tabs__item {
              color: #ccc;
              padding: 0 12px;
              text-align: center;
            }
            .el-tabs__item.is-active {
              color: #fff;
              background-color: #6c7b8b;
              position: relative;
              overflow: hidden;
            }
            .el-tabs__item.is-active::after {
              display: block;
              content: "";
              position: absolute;
              background-color: #fff;
              right: -5px;
              top: 15px;
              width: 10px;
              height: 10px;
              transform: rotate(45deg);
            }
          }
          .el-tabs__nav-wrap::after {
            background-color: #464c5b;
          }
        }
        .el-tabs__content {
          height: 100%;
          .el-tab-pane {
            height: 100%;
            overflow-y: auto;
          }
          .el-menu {
            .el-menu-item.is-active {
              color: #31c3a6;
            }
            .el-menu-item-group {
              .el-menu-item-group__title {
                background-color: #f2f2f2;
              }
              .el-menu-item {
                position: relative;
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #e4e4e4;
              }
              .el-menu-item::after {
                display: block;
                content: "";
                position: absolute;
                width: 4px;
                height: 4px;
                background-color: #333;
                border-radius: 50%;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
              }
              .el-menu-item.is-active::after {
                background-color: #31c3a6;
              }
            }
          }
        }
      }
      .el-menu-vertical-demo:not(.el-menu--collapse) {
        /* 菜单宽度 */
        width: 120px;
      }
      .el-menu {
        background-color: #eaedf1;
        border: none;
        .logo {
          text-align: center;
          max-height: 60px;
          margin-top: 10px;
          margin-bottom: 10px;
          padding-left: 5px;
          padding-right: 5px;
        }
        .el-submenu .el-menu-item {
          height: 35px;
          line-height: 35px;
        }
      }
      .el-menu--collapse {
        text-align: center;
      }
    }
    .el-breadcrumb {
      padding: 7px 20px;
      background-color: #f9f9f9;
    }
    .el-main {
      padding: 10px;
      overflow-y: scroll;
      .el-card {
        border-radius: 0;
      }
    }
    .el-main > div {
      background-color: #fff;
      width: 100%;
    }
  }
  .red {
    /* 输入金额的红色提示 */
    width: 160px !important;
    .el-input-group__append {
      color: red !important;
    }
    .el-input__inner {
      padding: 0 6px;
    }
  }
  .inputRemaid {
    /* 输入金额的红色提示 */
    width: 160px !important;
    .el-input__inner {
      padding: 0 6px;
    }
  }
  .el-header,
  .el-footer {
    height: 50px !important;
    line-height: 50px !important;
    color: #333;
    text-align: center;
  }
  .el-footer {
    font-size: 11px;
    color: #cccccc;
    text-align: center;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
}
.infoHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 各个页面的搜索部分css */
.search {
  padding: 0 30px;
  /* 几个查询一起 */
  border: 1px solid #f2f2f2;
  line-height: 60px;
  // height: 60px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 15px;
  div.search_box {
    margin-right: 10px;
    span {
      line-height: 40px;
    }
    .el-input {
      width: auto;
    }
    .input-with-select {
      .el-input--suffix {
        .el-input__inner {
          width: 80px;
        }
      }
    }
  }
}
.se-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
  text-align: left;
  background: #f2f2f2;
  font-size: 13px;
}

/* 层级table区分颜色 */
.el-table__body {
  .el-table__row--level-1 {
    background: #fdf5e6;
  }
  .el-table__row--level-2 {
    background: #f0f9eb;
  }
}

/* 关联 或 选择商品 */
.relatGoodsbox {
  height: 300px;
  display: flex;
  .relatGoodsRight {
    width: 700px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
    overflow-y: scroll;
    label.el-checkbox {
      display: block;
      text-align: left;
      margin-left: 10px;
      margin-right: 0px;
      border-bottom: 1px solid #ccc;
    }
  }
}
.s-size {
  font-size: 13px;
}
.box-r {
  padding: 3px 5px;
  margin-left: 5px;
}
.box-r2 {
  width: 110px;
  height: 45px;
  margin-left: 5px;
}
.se-right {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
/* 一行搜索 */
.searchBar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  .search_box {
    width: 200px;
    margin-right: 10px;
  }
}
/* 页面分页部分样式 */
.batchOperation {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-pagination {
    padding: 0;
  }
  .el-select {
    width: 120px;
    margin-right: 15px;
  }
}
.el-pagination {
  padding: 0;
  margin-top: 20px;
}
/* 页面表格的操作一列的样式 */
.el-button-group.alterDel,
.el-button-group.setup {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
/* 有缩略图的加这个样式 */
.el-image__inner {
  width: auto !important;
}
/* 有批量操作的全选 */
.el-table__header .el-table-column--selection .cell .el-checkbox:after {
  content: "全选";
  margin-left: 5px;
}
/* 筛选按钮 */
.status {
  .el-tabs {
    .el-tabs__header {
      margin: 0;
      border-bottom: none;
      .el-tabs__nav-wrap {
        margin-bottom: 0;
        .el-tabs__nav {
          border-radius: 0px;
        }
        .el-tabs__item.is-active {
          color: white;
          background-color: #1abc9c;
        }
        .el-tabs__item:hover {
          color: #1abc9c;
        }
        .el-tabs__item.is-active:hover {
          color: white;
        }
      }
    }
  }
}

#index > .el-container.is-vertical {
  height: 100%;
  width: 100%;
  display: -webkit-box !important;
}
</style>
