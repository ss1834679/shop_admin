<template>
  <div id="demand_idx">
    <!-- 需求列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">需求列表</span>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span style="font-size:13px;width:30%">用户名称:</span>
            <el-input placeholder="请输入用户名称" v-model="searchPackageNameInput" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span style="font-size:13px;width:30%">手机号:</span>
            <el-input placeholder="请输入手机号" v-model="searchPackageNumInput" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span style="font-size:13px;width:30%">联系状态:</span>
            <el-select v-model="reviewStatusValue" placeholder="请选择是否联系" @keydown.native.enter="selectByKwd" @change="selectByKwd">
              <el-option v-for="item in reviewStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class style="  display: flex;  align-items: center;">
            <el-date-picker v-model="searchStartTime" type="date" @change="selectByKwd" value-format="yyyy-MM-dd" placeholder="请输入提交时间"></el-date-picker>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="tbinformationList" border style="width: 100%" row-key="id" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机号码"></el-table-column>
          <el-table-column prop="userName" label="关联案例名" align="center"></el-table-column>
          <el-table-column prop="designName" label="案例创建者"></el-table-column>
          <el-table-column prop="contactStatus" label="联系状态" align="center">
            <template slot-scope="scope">
              <div style="display:flex;align-items: center;justify-content: center;">
                <switch-com
                  :boolen="scope.row.contactStatus"
                  activeText="已联系"
                  inactiveText="未联系"
                  @changeValue="(value)=>{changeStatus(scope.row.id,value)}"
                ></switch-com>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="demandLog(scope.row)">日志</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <div>
            <el-select v-model="batchValue" placeholder="批量操作">
              <el-option v-for="(item,idx) in options" :key="idx" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
            <el-button @click="batchOperation">确认</el-button>
          </div>
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
      </div>
      <!-- 联系状态修改日志 -->
      <el-dialog title="联系状态修改日志" :visible.sync="checkVisible" @close="closeCheck">
        <el-table :data="demandLogList" border style="width: 100%">
          <el-table-column prop="createTime" align="center" label="时间"></el-table-column>
          <el-table-column prop="userName" align="center" label="修改人员"></el-table-column>
          <el-table-column prop="contactStatus" align="center" label="联系状态">
            <template slot-scope="scope">
              <span v-if="scope.row.contactStatus==1">已联系</span>
              <span v-if="scope.row.contactStatus==0">未联系</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../components/switch";
import { getDemandByPage, getDemandLog, updateContactStatus, batchApprovalDemand } from "../../api/house";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    switchCom,
    paginationCom
  },
  data() {
    return {
      demandLogList: [] /* 日志详情弹框数据列表 */,
      reviewStatusValue: "" /* 搜索选择联系状态值 */,
      reviewStatus: [
        /* 选择联系状态列表 */
        { label: "已联系", value: "1" },
        { label: "未联系", value: "0" }
      ],
      searchPackageNameInput: "" /* 搜索的用户名称 */,
      searchPackageNumInput: "" /* 搜索的手机号码*/,
      searchStartTime: "" /* /* 搜索的设计案例时间 */,
      batchValue: "" /* 批量操作的类型 */,
      options: [
        { label: "批量标记已联系", value: "upShelves", disabled: false },
        { label: "批量标记未联系", value: "shelves", disabled: false }
      ] /* 批量操作列列表 */,
      searchInput: "" /* 标题 */,
      tbinformationList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      batchArr: [] /* 批量操作 id 数组 */,
      checkVisible: false /* 是否打开联系状态日志弹窗 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    //   打开日志弹框
    demandLog(rows) {
      this.checkVisible = true;
      getDemandLog({ id: rows.id }).then(data => {
        this.demandLogList = data.data.data;
      });
    },
    /* 关闭审核详情 */
    closeCheck() {
      this.checkList = [];
    },
    // 批量操作修改为已联系
    batchOperation() {
      if (this.batchValue == "upShelves") {
        batchApprovalDemand({ contactStatus: "1", deamndIds: this.batchArr }).then(data => {
          if (data.data.status == 0) {
            this.$message({
              message: data.data.data,
              type: "success"
            });
            this.$router.go(0);
          } else {
            this.$message({
              message: data.data.msg,
              type: "error"
            });
          }
        });
        // 批量操作修改为未联系
      } else if (this.batchValue == "shelves") {
        batchApprovalDemand({ contactStatus: "0", deamndIds: this.batchArr }).then(data => {
          if (data.data.status == 0) {
            this.$message({
              message: data.data.data,
              type: "success"
            });
            this.$router.go(0);
          } else {
            this.$message({
              message: data.data.msg,
              type: "error"
            });
          }
        });
      }
    },
    // switch开关状态
    changeStatus(id, value) {
      /* 改变状态 并重新请求 */
      updateContactStatus({ contactStatus: value, deamndId: id }).then(data => {
        if (data.data.status == 0) {
          this.$message({
            message: "状态修改成功",
            type: "success"
          });
          this.showAll();
        } else {
          this.$message({
            message: "状态修改失败",
            type: "error"
          });
        }
      });
    },
    /* 获取批量操作的id数组 */
    getSelection(val) {
      this.batchArr = []; /* 先置空 */
      val.forEach(item => {
        this.batchArr.push(item.id);
        if (item.contactStatus == 1) {
          this.options[0].disabled = true;
        } else {
          this.options[0].disabled = false;
          this.options[1].disabled = true;
        }
      });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchPackageNameInput = "";
      this.searchPackageNumInput = "";
      this.reviewStatusValue = "";
      this.searchStartTime = "";
      this.showAll();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (
        this.searchPackageNameInput !== "" ||
        this.searchPackageNumInput !== "" ||
        this.reviewStatusValue !== "" ||
        this.searchStartTime !== ""
      ) {
        // 执行查询中的分页;
        this.selectByKwd({ page: val });
      } else {
        // 执行全部中的分页;
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getDemandByPage({
        pageSize: 20,
        pageNo: Number.isInteger(val) ? val : 1,
        name: this.searchPackageNameInput == "" ? null : this.searchPackageNameInput,
        phone: this.searchPackageNumInput == "" ? null : this.searchPackageNumInput,
        time: this.searchStartTime == "" ? null : this.searchStartTime,
        contactStatus: this.reviewStatusValue
      }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.tbinformationList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    // 获取初始需求列表数据
    showAll(val) {
      getDemandByPage({
        pageSize: 20,
        pageNo: Number.isInteger(val) ? val : 1
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    }
  }
};
</script>

<style lang='less'>
#demand_idx {
  width: 100%;
  height: auto;

  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
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
          height: 36px;
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      .search {
        /* 几个查询一起 */
        display: flex;
        flex-wrap: wrap;
        height: 123px;
        // justify-content: flex-start;
        margin-bottom: 15px;
        div.search_box {
          display: flex;
          align-items: center;
          margin-right: 6px;
          span {
            line-height: 40px;
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
    }
  }
}
</style>
