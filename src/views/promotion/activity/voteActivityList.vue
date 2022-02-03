<template>
  <div id="voteActivityList">
    <!-- 活动列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">活动列表</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="text" @click="clearSearch">重置搜索</el-button>
            <el-button size="small" @click="showAll()">搜索</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>活动名称：</span>
            <el-input placeholder="活动名称" v-model="searchName" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>活动状态：</span>
            <el-select v-model="searchStatus" @change="showAll">
              <el-option label="全部" value="all"></el-option>
              <el-option label="未开始" :value="1"></el-option>
              <el-option label="进行中" :value="2"></el-option>
              <el-option label="已结束" :value="3"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>创建时间：</span>
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
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div class="se-right">
            <div class="box-r">
              <el-button size="mini" @click="addActivity" icon="el-icon-plus">添加活动</el-button>
            </div>
          </div>
        </div>
        <el-table :data="activityLsit" border style="width: 100%">
          <el-table-column align="center" prop="id" label="ID"></el-table-column>
          <el-table-column align="center" prop="title" width="300" label="活动名称"></el-table-column>
          <el-table-column align="center" prop="takePartInPerson" label="参与人数" width="100"></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column align="center" label="活动时间">
            <template slot-scope="scope">
              <span>{{`${scope.row.startTime}—${scope.row.endTime}`}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="活动状态" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.activityStatus==1">未开始</span>
              <span v-if="scope.row.activityStatus==2">进行中</span>
              <span v-if="scope.row.activityStatus==3">已结束</span>
            </template>
          </el-table-column>
          <el-table-column align="center" v-if="showStatus" label="状态" width="90px">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.status" activeText="启用" inactiveText="禁用" @changeBoolen="handleChangeStatus(scope.row.id)"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="editActivity(scope.row)">编辑</el-button>
              <el-button type="text" @click="handlerDetails(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <Paginationcom :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({ page: val })}" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../../components/switch";
import Paginationcom from "../../../components/paginationCom";
import { getNewActivityPage, setNewActivityStatus } from "../../../api/promotion";
export default {
  components: { Paginationcom, switchCom },
  data() {
    return {
      searchName: "" /* 活动名称 */,
      searchStatus: "all" /* 活动状态 */,
      searchTime: [],
      startTime: undefined /* 注册时间 */,
      endTime: undefined /* 注册时间 */,
      showStatus: true /* 刷新 */,
      activityLsit: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  mounted() {
    this.showAll();
  },
  watch: {
    searchTime: {
      handler() {
        if (this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
        } else {
          this.startTime = undefined;
          this.endTime = undefined;
        }
      }
    }
  },
  methods: {
    addActivity() {
      this.$router.push({ name: "editvoteActivity", params: { isAdd: true } });
    },
    editActivity(rows) {
      this.$router.push({ name: "editvoteActivity", params: { routerTitle: "编辑活动" }, query: { id: rows.id } });
    },
    handlerDetails(row) {
      this.$router.push({ name: "activiDetails", query: { id: row.id } });
    },
    /* 刷新 */
    refreshTable() {
      this.showStatus = false;
      this.$nextTick(() => {
        this.showStatus = true;
      });
    },
    handleChangeStatus(id) {
      setNewActivityStatus(id).then(data => {
        if (data.data.status == 0) {
          this.$message.success("设置状态成功");
        } else {
          this.$message.success("设置状态失败");
          this.refreshTable();
        }
      });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchName = "";
      this.searchStatus = "all";
      this.searchTime = [];
      this.startTime = undefined;
      this.endTime = undefined;
      this.showAll();
    },
    showAll(obj = {}) {
      getNewActivityPage({
        pageNo: obj.page ? obj.page : 1,
        pageSize: this.size,
        title: this.searchName == "" ? undefined : this.searchName,
        activityStatus: this.searchStatus == "all" ? undefined : this.searchStatus,
        endTime: this.endTime,
        startTime: this.startTime
      }).then(data => {
        if (data.data.status == 0) {
          this.activityLsit = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
          this.refreshTable();
        }
      });
    }
  }
};
</script>

<style lang='less'>
#voteActivityList {
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
  }
}
</style>