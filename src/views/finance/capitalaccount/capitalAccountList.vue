<template>
  <div id="capitalAccountList">
    <!-- 资金账户 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">资金账户</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="small" @click="clearSearch">重置搜索</el-button>
            <el-button size="small" @click="showAll()">搜索</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>资金账户：</span>
            <el-input placeholder="资金账户" v-model="searchAccount" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>账户名称：</span>
            <el-input placeholder="账户名称" v-model="searchName" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>用户账号：</span>
            <el-input placeholder="用户账号" v-model="searchUserAccount" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>角色类型：</span>
            <el-select v-model="searchRole" @change="showAll" placeholder="请选择角色" clearable>
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>注册时间：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            ></el-date-picker>
          </div>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div>
            <el-dropdown @command="downLoadList">
              <el-button size="small">
                数据导出
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="all">全部数据</el-dropdown-item>
                <el-dropdown-item command="search" :disabled="isSearch">筛选数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <el-table :data="capitalAccountList" border style="width: 100%">
          <el-table-column label="编号" align="center">
            <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
          </el-table-column>
          <el-table-column prop="userAccount" label="资金账户" align="center"></el-table-column>
          <el-table-column prop="acctName" label="账户名称" align="center"></el-table-column>
          <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
          <el-table-column prop="account" label="用户账号" align="center"></el-table-column>
          <el-table-column prop="acctType" label="账户类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.acctType=='PERSON'">个人</span>
              <span v-else>企业</span>
            </template>
          </el-table-column>
          <el-table-column prop="idNo" align="center">
            <template slot="header">
              <span>证件号</span>
              <el-tooltip effect="dark" content="资金账户类型为个人时，身份证件号码;如果是企业，企业营业执照号或社会统一编码" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="bankCardNo" label="银行卡号" align="center"></el-table-column>
          <el-table-column prop="bankCardName" label="银行" align="center"></el-table-column>
          <el-table-column prop="roleName" label="角色类型" align="center"></el-table-column>
          <el-table-column prop="createTime" label="注册时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="handleCapitalDetails(scope.row)">资金明细</el-button>
                <el-button type="text" @click="handleUserDetails(scope.row)">用户详情</el-button>
              </el-button-group>
              <el-button-group class="alterDel">
                <el-button type="text" @click="handleRecord(scope.row)">对账</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <Paginationcom :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
      </div>
    </el-card>
  </div>
</template>

<script>
import Paginationcom from "../../../components/paginationCom";
import { getCapitalAccountPage, getCapitalAccountRoleList, exportCapitalAccount } from "../../../api/finance";
export default {
  components: { Paginationcom },
  data() {
    return {
      searchAccount: "" /* 资金账户 */,
      searchName: "" /* 账户名称 */,
      searchUserAccount: "" /* 用户账号 */,
      searchRole: "" /* 角色搜索 */,
      searchTime: [],
      startTime: undefined /* 开始时间 */,
      endTime: undefined /* 结束时间 */,
      capitalAccountList: [] /* 服务商列表 */,
      roleList: [] /* 角色列表 */,
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  watch: {
    searchTime: {
      handler() {
        if (this.searchTime && this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
        } else {
          this.startTime = undefined;
          this.endTime = undefined;
        }
      }
    }
  },
  computed: {
    isSearch() {
      let boolean = true;
      if (
        this.startTime ||
        this.endTime ||
        this.searchUserAccount != "" ||
        this.searchName != "" ||
        this.searchRole != "" ||
        this.searchAccount != ""
      ) {
        boolean = false;
      }
      return boolean;
    }
  },
  mounted() {
    this.showAll();
    getCapitalAccountRoleList().then(data => {
      if (data.data.status == 0) {
        this.roleList = data.data.data;
      }
    });
  },
  methods: {
    /** 资金明细 */
    handleCapitalDetails(row) {
      this.$router.push({
        name: "capitalAccountDetails",
        query: { capitalId: row.userAccount, outUserId: row.outUserId }
      });
    },
    downLoadList(key) {
      if (key == "all") {
        exportCapitalAccount({}).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}资金账户导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      } else {
        exportCapitalAccount({
          accountName: this.searchUserAccount == "" ? undefined : this.searchUserAccount,
          acctName: this.searchName == "" ? undefined : this.searchName,
          endDate: this.endTime,
          roleId: this.searchRole == "" ? undefined : this.searchRole,
          startDate: this.startTime,
          userAccount: this.searchAccount == "" ? undefined : this.searchAccount
        }).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}资金账户导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      }
    },
    /** 用户详情 */
    handleUserDetails(row) {
      // 用户id  用户类型  是否确定  '1.业主；2.服务商；3.项目经理'
      let routeUrl = "";
      if (row.roleType == 2) {
        routeUrl = this.$router.resolve({
          name: "editSerprovider",
          params: { routerTitle: "修改服务商" },
          query: { outUserId: row.outUserId }
        });
        window.open(routeUrl.href, "_blank");
      } else if (row.roleType == 1) {
        routeUrl = this.$router.resolve({
          name: "editproprietor",
          params: { routerTitle: "修改业主" },
          query: { outUserId: row.outUserId }
        });
        window.open(routeUrl.href, "_blank");
      } else if (row.roleType == 3) {
        routeUrl = this.$router.resolve({
          name: "editPromanage",
          params: { routerTitle: "修改项目经理" },
          query: { outUserId: row.outUserId }
        });
        window.open(routeUrl.href, "_blank");
      }
    },
    /** 对账 */
    handleRecord(row) {
      this.$router.push({
        name: "capitalAccountVerifyList",
        query: { capitalId: row.userAccount, outUserId: row.outUserId }
      });
    },
    /** 重置搜索 */
    clearSearch() {
      this.searchAccount = "";
      this.searchName = "";
      this.searchUserAccount = "";
      this.searchRole = "";
      this.searchTime = [];
      this.startTime = undefined;
      this.endTime = undefined;
      this.showAll();
    },
    showAll(val = {}) {
      getCapitalAccountPage({
        accountName: this.searchUserAccount == "" ? undefined : this.searchUserAccount,
        acctName: this.searchName == "" ? undefined : this.searchName,
        endDate: this.endTime,
        pageNo: val.page ? val.page : this.cPage,
        pageSize: 20,
        roleId: this.searchRole == "" ? undefined : this.searchRole,
        startDate: this.startTime,
        userAccount: this.searchAccount == "" ? undefined : this.searchAccount
      }).then(data => {
        console.log(data);
        if (data.data.status == 0) {
          this.capitalAccountList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#capitalAccountList {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
      padding: 0;
      .clearfix {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
        .el-button {
          margin-right: 20px;
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>