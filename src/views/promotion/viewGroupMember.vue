<template>
  <div id="viewGroupMember">
    <!-- 团员列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">团员列表</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="text" @click="clearSearch">清空搜索</el-button>
            <el-button size="small" @click="selectByKwd()">查询结果</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>用户账号：</span>
            <el-input placeholder="请输入手机号码" v-model="searchInput" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>昵称：</span>
            <el-input placeholder="请输入用户昵称" v-model="searchNick" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>入团时间：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            ></el-date-picker>
          </div>
        </div>
        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
        </div>
        <el-table :data="groupMemberList" border style="width: 100%">
          <el-table-column prop="ordinalNum" label="编号"></el-table-column>
          <el-table-column prop="nickname" label="用户昵称"></el-table-column>
          <el-table-column prop="phone" label="用户账号"></el-table-column>
          <el-table-column prop="resultsAmount" label="当前个人业绩">
            <template slot-scope="scope">{{"¥"+(scope.row.resultsAmount/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="extractPrice" label="已提现">
            <template slot-scope="scope">{{"¥"+(scope.row.extractPrice/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="level" label="等级">
            <template slot-scope="scope">
              <span v-if="scope.row.level==1">团长</span>
              <span v-if="scope.row.level==2">1级团员</span>
              <span v-if="scope.row.level==3">2级团员</span>
            </template>
          </el-table-column>
          <el-table-column prop="clusteringTime" label="入团时间"></el-table-column>
          <el-table-column label="操作" align="center" width="170">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="viewMember(scope.row)">查看详情</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGroupMemberPage } from "../../api/distribuManage";
import paginationCom from "../../components/paginationCom";
export default {
  components: { paginationCom },
  data() {
    return {
      searchInput: "" /* 手机号码 */,
      searchNick: "" /* 用户昵称 */,
      searchTime: [],
      startTime: null,
      endTime: null,
      groupMemberList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  watch: {
    searchTime: {
      handler() {
        if (this.searchTime) {
          this.endTime = this.searchTime[1];
          this.startTime = this.searchTime[0];
        } else {
          this.endTime = null;
          this.startTime = null;
        }
      }
    }
  },
  mounted() {
    this.showAll();
  },
  methods: {
    viewMember(rows) {
      this.$router.push({ name: "groupMemberdetails", query: { id: rows.uid } }); /* 用户的id */
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchInput = "";
      this.searchNick = "";
      this.searchTime = [];
      this.startTime = null;
      this.endTime = null;
      this.selectByKwd();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput != "" || this.searchNick != "" || this.startTime != null) {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val = {}, type) {
      getGroupMemberPage({
        id: this.$route.query.id,
        pageIndex: val.page ? val.page : 1,
        pageSize: 20,
        endTime: this.endTime,
        startTime: this.startTime,
        nickname: this.searchNick == "" ? null : this.searchNick,
        phone: this.searchInput == "" ? null : this.searchInput
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
          !type && this.$message({ message: "已执行查询", type: "success" });
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.groupMemberList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    showAll(val) {
      getGroupMemberPage({
        id: this.$route.query.id,
        pageIndex: val ? val : 1,
        pageSize: 20
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
#viewGroupMember {
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
    }
  }
}
</style>
