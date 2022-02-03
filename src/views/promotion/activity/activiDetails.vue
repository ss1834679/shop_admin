<template>
  <div id="activiDetails">
    <!-- 活动详情 -->
    <div class="activiHead">
      <div class="title">
        <p>{{activityDetails.title}}</p>
        <span v-if="activityDetails.activityStatus==1">未开始</span>
        <span v-else-if="activityDetails.activityStatus==2">进行中</span>
        <span v-else-if="activityDetails.activityStatus==3">已结束</span>
      </div>
      <div class="center">
        <span>活动ID:{{activityDetails.id}}</span>
        <span>创建时间：{{activityDetails.createTime}}</span>
        <span>活动时间：{{activityDetails.startTime}} 至 {{activityDetails.endTime}}</span>
      </div>
      <div class="bottom">
        <div class="bottomItem">
          <p class="red">{{activityDetails.takePartInPerson}}</p>
          <p>活动参与人数</p>
        </div>
        <div class="bottomItem">
          <p class="red">{{activityDetails.signNum}}</p>
          <p>报名人数</p>
        </div>
        <div class="bottomItem">
          <p class="red">{{activityDetails.votePerson}}</p>
          <p>投票人数</p>
        </div>
        <div class="bottomItem">
          <p class="red">{{activityDetails.sumVotes}}</p>
          <p>总投票数</p>
        </div>
      </div>
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
          <span>用户账号：</span>
          <el-input placeholder="手机号码" v-model="searchPhone" @keydown.native.enter="showAll"></el-input>
        </div>
        <div class="search_box">
          <span>标记状态：</span>
          <el-select v-model="searchStatus" @change="showAll">
            <el-option label="全部" value="all"></el-option>
            <el-option label="已标记" :value="1"></el-option>
            <el-option label="未标记" :value="0"></el-option>
          </el-select>
        </div>
      </div>
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
        <div class="se-right">
          <div class="box-r">
            <el-dropdown @command="handleExport">
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
      </div>
      <el-table :data="activityLsit" border style="width: 100%">
        <el-table-column align="center" prop="id" label="编号" width="80">
          <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
        </el-table-column>
        <el-table-column align="center" prop="nickname" label="用户昵称"></el-table-column>
        <el-table-column align="center" prop="accountNum" width="300" label="账号"></el-table-column>
        <el-table-column align="center" prop="voteNum" label="得票数">
          <template slot-scope="scope">
            <p>{{scope.row.voteNum}}</p>
            <el-button type="text" @click="handleVoteNum(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="报名时间" width="180"></el-table-column>
        <el-table-column align="center" v-if="showStatus" prop="status" label="显示状态" width="90px">
          <template slot-scope="scope">
            <switch-com :boolen="scope.row.displayStatus" activeText="显示" inactiveText="隐藏" @changeBoolen="handleViewStatus(scope.row.id)"></switch-com>
          </template>
        </el-table-column>
        <el-table-column align="center" v-if="showStatus" prop="status" label="标记状态" width="90px">
          <template slot-scope="scope">
            <switch-com :boolen="scope.row.markStatus" activeText="已标记" inactiveText="未标记" @changeBoolen="handleChangeStatus(scope.row.id)"></switch-com>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEditForm(scope.row)">表单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="batchOperation">
        <Paginationcom :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({ page: val })}" />
      </div>
      <el-dialog :title="`投票详情（${voteNum}）`" :visible.sync="voteNumDetails" @close="closeVoteNum">
        <el-table
          :data="voteNumDetailsList"
          height="500px"
          :show-header="false"
          v-loading="isLoading"
          v-el-table-infinite-scroll="loadMore"
          class="voteNumTable"
        >
          <el-table-column prop="nickname" label="123">
            <template slot-scope="scope">
              <div class="userDetails">
                <div class="headImg">
                  <img
                    v-if="scope.row.headImg"
                    :src="scope.row.headImg.includes('http')?`${scope.row.headImg}?x-oss-process=image/resize,m_fill,h_35,w_35`:`${baseSize}?fileId=${scope.row.headImg}&h=35&w=35`"
                  />
                  <img src="https://cdn-file.tbzj.net/fileserver/file/5eb642be1b49c64fd53ad6c2" v-else />
                </div>
                <div class="details">
                  <p class="top">
                    <span>{{scope.row.nickname}}</span>
                    <span>{{scope.row.phone}}</span>
                  </p>
                  <p class="bot">{{scope.row.createTime}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import switchCom from "../../../components/switch";
import Paginationcom from "../../../components/paginationCom";
import {
  getNewActivityDetailById,
  getNewActivityUserRegisterList,
  setNewActivityDisplayStatus,
  setNewActivityMarkStatus,
  exportNewActivityExcel,
  getVoteNumList
} from "../../../api/promotion";
export default {
  components: { Paginationcom, switchCom },
  data() {
    return {
      searchPhone: "" /* 用户账号 */,
      searchStatus: "all" /* 标记状态 */,
      showStatus: true /* 刷新 */,
      activityLsit: [],
      activityDetails: {},
      voteNumDetails: false /* 投票详情是否显示 */,
      voteNumDetailsList: [] /* 投票详情的列表数据 */,
      voteNum: 0 /* 当前投票的总数 */,
      votePage: 1 /* 投票的页数 */,
      voteId: "" /* 投票查询的id */,
      isLoading: false /* 是否正在加载 */,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      baseSize: ""
    };
  },
  computed: {
    isSearch() {
      let boolean = true;
      if (this.searchPhone != "" || this.searchStatus != "all") {
        boolean = false;
      }
      return boolean;
    }
  },
  mounted() {
    this.baseSize = this.$store.state.baseSize_url;
    getNewActivityDetailById(this.$route.query.id).then(data => {
      if (data.data.status == 0) {
        this.activityDetails = data.data.data;
      }
    });
    this.showAll();
  },
  methods: {
    /** 表单 */
    handleEditForm(row) {
      this.$router.push({
        name: "activityForm",
        query: { userId: row.id /* 用户id */, actId: this.$route.query.id },
        params: { routerTitle: this.activityDetails.title }
      });
    },
    /* 刷新 */
    refreshTable() {
      this.showStatus = false;
      this.$nextTick(() => {
        this.showStatus = true;
      });
    },
    handleExport(key) {
      if (key == "all") {
        exportNewActivityExcel({
          newActivityId: this.$route.query.id
        }).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      } else if (key == "search") {
        exportNewActivityExcel({
          accountNum: this.searchPhone == "" ? undefined : this.searchPhone,
          markStatus: this.searchStatus == "all" ? undefined : this.searchStatus,
          newActivityId: this.$route.query.id
        }).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      }
    },
    /** 标记状态 */
    handleChangeStatus(id) {
      setNewActivityMarkStatus(id).then(data => {
        if (data.data.status == 0) {
          this.$message.success("设置标记状态成功");
        } else {
          this.$message.error("设置标记状态失败");
          this.refreshTable();
        }
      });
    },
    /** 显示状态 */
    handleViewStatus(id) {
      setNewActivityDisplayStatus(id).then(data => {
        if (data.data.status == 0) {
          this.$message.success("设置显示状态成功");
        } else {
          this.$message.error("设置显示状态失败");
          this.refreshTable();
        }
      });
    },
    handleVoteNum(row) {
      this.voteId = row.id;
      getVoteNumList({ userRegisterId: row.id, pageNo: 1, pageSize: 20 }).then(data => {
        if (data.data.status == 0) {
          this.voteNumDetailsList = data.data.data.list;
          this.voteNum = data.data.data.total;
          this.votePage = data.data.data.pageNum;
        }
      });
      this.voteNumDetails = true;
    },
    closeVoteNum() {
      this.voteId = "";
      this.votePage = 1;
      this.voteNumDetailsList = new Array(0);
    },
    loadMore() {
      if (!this.isLoading && this.votePage * 20 < this.voteNum) {
        this.isLoading = true;
        getVoteNumList({ userRegisterId: this.voteId, pageNo: this.votePage + 1, pageSize: 20 }).then(data => {
          if (data.data.status == 0) {
            this.voteNumDetailsList = this.voteNumDetailsList.concat(data.data.data.list);
            this.votePage = data.data.data.pageNum;
            this.voteNum = data.data.data.total;
            this.isLoading = false;
          }
        });
      }
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchPhone = "";
      this.searchStatus = "all";
      this.showAll();
    },
    showAll(obj = {}) {
      getNewActivityUserRegisterList({
        accountNum: this.searchPhone == "" ? undefined : this.searchPhone,
        markStatus: this.searchStatus == "all" ? undefined : this.searchStatus,
        newActivityId: this.$route.query.id,
        pageNo: obj.page ? obj.page : 1,
        pageSize: this.size
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
#activiDetails {
  width: 100%;
  height: auto;
  .activiHead {
    padding: 0 30px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    .title {
      position: relative;
      p {
        margin: 0 80px;
        text-align: center;
        line-height: 40px;
        font-weight: 600;
      }
      span {
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .center {
      line-height: 40px;
      display: flex;
      justify-content: space-between;
    }
    .bottom {
      display: flex;
      .bottomItem {
        margin-right: 40px;
        p {
          margin: 5px 0;
          text-align: center;
        }
        .red {
          color: red;
          font-weight: 600;
        }
      }
    }
  }
  .voteNumTable {
    .userDetails {
      width: 260px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .headImg {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .details {
        width: 215px;
        .top {
          margin-top: 0;
          display: flex;
          justify-content: space-between;
        }
        .bot {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>