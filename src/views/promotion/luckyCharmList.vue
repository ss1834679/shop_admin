<template>
  <div id="luckyCharmList">
    <!-- 装小鲤展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">装小鲤</span>
        <el-button size="small" @click="setLucky()">设置活动</el-button>
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
            <el-input placeholder="请输入用户账号" v-model="searchInput" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>报名时间：</span>
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
        <div class="peoplenum">
          <div class="peopleItem">
            <p>活动参与人数</p>
            <span style="color:red">{{number.takePartInPerson}}</span>
          </div>
          <div class="peopleItem">
            <p>报名人数</p>
            <span style="color:red">{{number.signPerson}}</span>
          </div>
          <div class="peopleItem">
            <p>投票人数</p>
            <span style="color:red">{{number.votePerson}}</span>
          </div>
          <div class="peopleItem">
            <p>总投票数</p>
            <span style="color:red">{{number.sumAllVotes}}</span>
          </div>
          <div class="peopleItem">
            <p>入围人数</p>
            <span style="color:red">{{number.selectedPerson}}</span>
          </div>
        </div>
        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
        </div>
        <el-table :data="luckyCharmUserList" border style="width: 100%">
          <el-table-column prop="no" label="编号"></el-table-column>
          <el-table-column prop="nickName" label="用户昵称"></el-table-column>
          <el-table-column prop="userPhone" label="账号"></el-table-column>
          <el-table-column prop="sumVotes" label="得票数" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.sumVotes}}</div>
              <el-button type="text" @click="viewDetails(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="villageName" label="小区名称"></el-table-column>
          <el-table-column prop="layout" label="户型" width="80px">
            <template slot-scope="scope" v-if="scope.row.layout">
              <Thumbnail :image="scope.row.layout" />
            </template>
          </el-table-column>
          <el-table-column prop="area" label="面积">
            <template slot-scope="scope">
              <span v-if="scope.row.area">{{scope.row.area}}㎡</span>
            </template>
          </el-table-column>
          <el-table-column prop="wish" label="心愿"></el-table-column>
          <el-table-column prop="createTime" label="报名时间"></el-table-column>
          <el-table-column prop="isDisplay" label="状态">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.isDisplay" activeText="显示" inactiveText="隐藏" @changeBoolen="handleChangeStatus(scope.row)"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="editLuckychartUser(scope.row)">编辑</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
    <el-dialog :title="`投票详情(${userNum})`" width="500px" :visible.sync="userlistVisible" @close="closeuserlist()">
      <ul class="userlistul">
        <li v-for="i in userlist" class="list-item" :key="i.nickname">
          <div class="imgbox">
            <img :src="i.avatar.includes('http')?`${i.avatar}`:`${base}${i.avatar}`" />
          </div>
          <div class="userdetils">
            <div>
              <span class="nickname">{{i.nickname}}</span>
              <span style="margin-left:40px">{{i.userPhone}}</span>
            </div>
            <span>{{i.createTime}}</span>
          </div>
        </li>
      </ul>
      <pagination-com :total="userNum" :size="size1" :cPage="cPage1" @getJump="(val)=>{handleChange(val)}"></pagination-com>
    </el-dialog>
  </div>
</template>

<script>
import { luckyKoiSelectList, koiSelectVoteDetailById, koiOperationDisplay } from "../../api/luckyCharm";
import paginationCom from "../../components/paginationCom";
import Thumbnail from "../../components/thumbnail";
import switchCom from "../../components/switch";
export default {
  components: { paginationCom, switchCom, Thumbnail },
  data() {
    return {
      searchInput: "" /* 用户账号 */,
      searchTime: [],
      startTime: null,
      endTime: null,
      luckyCharmUserList: [],
      number: {
        takePartInPerson: 0 /* 参与人数 */,
        selectedPerson: 0 /* 入围人数 */,
        signPerson: 0 /* 报名人数 */,
        sumAllVotes: 0 /* 总投票数 */,
        votePerson: 0 /* 投票人数 */
      },
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      detailsId: "",
      userlistVisible: false,
      userlist: [],
      userNum: 0,
      cPage1: 1 /* 当前页码 */,
      size1: 20 /* 每页个数 */,
      base: ""
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
    this.base = this.$store.state.base_url;
  },
  methods: {
    setLucky() {
      this.$router.push({ name: "luckyCharmSet" });
    },
    editLuckychartUser(rows) {
      this.$router.push({ name: "luckyCharmAlter", query: { id: rows.id } }); /* 传入心愿的id */
    },
    viewDetails(row) {
      this.detailsId = row.id;
      koiSelectVoteDetailById({ id: row.id, pageNo: 1, pageSize: 20 }).then(data => {
        this.userlist = data.data.data.list;
        this.userNum = data.data.data.total;
        this.size1 = data.data.data.pageSize;
        this.cPage1 = data.data.data.pageNum;
        this.userlistVisible = true;
      });
    },
    handleChange(val) {
      koiSelectVoteDetailById({ id: this.detailsId, pageNo: val, pageSize: 20 }).then(data => {
        this.userlist = data.data.data.list;
        this.userNum = data.data.data.total;
        this.size1 = data.data.data.pageSize;
        this.cPage1 = data.data.data.pageNum;
      });
    },
    closeuserlist() {
      this.userNum = 0;
      this.userlist = [];
    },
    handleChangeStatus(row) {
      koiOperationDisplay(row.id).then(data => {
        if (data.data.status == 0) {
          this.$message({ type: "success", message: "修改成功" });
        } else {
          this.$message.error("修改失败");
          this.selectByKwd("", "alter");
        }
      });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchInput = "";
      this.searchTime = [];
      this.startTime = null;
      this.endTime = null;
      this.showAll();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput != "" || this.startTime != null) {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val = {}, type) {
      luckyKoiSelectList({
        pageNo: val.page ? val.page : 1,
        pageSize: this.size,
        userPhone: this.searchInput == "" ? null : this.searchInput,
        startTime: this.startTime,
        endTime: this.endTime
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
          !type && this.$message({ message: "已执行查询", type: "success" });
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.luckyCharmUserList = data.data.data.list.list;
      this.total = data.data.data.list.total;
      this.cPage = data.data.data.list.pageNum;
      this.size = data.data.data.list.pageSize;
      this.number = data.data.data.statistics;
    },
    showAll(val) {
      luckyKoiSelectList({ pageNo: Number.isInteger(val) ? val : 1, pageSize: 20 }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    }
  }
};
</script>

<style lang='less'>
#luckyCharmList {
  width: 100%;
  height: auto;
  .peoplenum {
    display: flex;
    margin-bottom: 10px;
    .peopleItem {
      width: 100px;
      text-align: center;
      p {
        padding: 0;
        margin: 0;
      }
    }
  }
  .userlistul {
    list-style: none;
    .list-item {
      height: 35px;
      display: flex;
      .imgbox {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: none;
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .userdetils {
        height: 100%;
        margin-left: 10px;
        .nickname {
          display: inline-block;
          max-width: 80px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
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