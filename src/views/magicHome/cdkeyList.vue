<template>
  <div id="cdkeyList">
    <!-- 激活码列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">激活码</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="text" @click="clearSearch">清空搜索</el-button>
            <el-button size="small" @click="showAll()">查询结果</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>设备ID：</span>
            <el-input placeholder="设备唯一识别码" v-model="searchCode" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>激活码：</span>
            <el-input placeholder="激活码" v-model="searchAuthor" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>使用状态：</span>
            <el-select v-model="searchStatus" @change="showAll">
              <el-option label="全部" value="all"></el-option>
              <el-option label="未使用" :value="0"></el-option>
              <el-option label="已使用" :value="1"></el-option>
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
              <el-button size="mini" @click="addCdkey" icon="el-icon-plus">添加激活码</el-button>
            </div>
          </div>
        </div>
        <el-table :data="cdkeyLsit" border style="width: 100%">
          <el-table-column align="center" prop="id" label="ID"></el-table-column>
          <el-table-column align="center" prop="code" label="激活码"></el-table-column>
          <el-table-column align="center" prop="deviceId" label="设备ID">
            <template slot-scope="scope">
              <span v-if="scope.row.isUse==0">N/A</span>
              <span v-else>{{scope.row.deviceId}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="address" label="位置" width="180"></el-table-column>
          <el-table-column align="center" prop="quoteScope" label="范围">
            <template slot-scope="scope">
              <span v-if="scope.row.quoteScope==1">全部</span>
              <span
                v-if="scope.row.quoteScope==2"
              >{{`${scope.row.province}${scope.row.city?scope.row.city:""}${scope.row.district?scope.row.district:""}`}}</span>
              <span v-if="scope.row.quoteScope==3">{{scope.row.village}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
          <el-table-column align="center" prop="useTime" label="激活时间">
            <template slot-scope="scope">
              <span v-if="scope.row.isUse==0">N/A</span>
              <span v-else>{{scope.row.useTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isUse" label="是否使用">
            <template slot-scope="scope">
              <span v-if="scope.row.isUse==0">未使用</span>
              <span v-else>已使用</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="scanFaceCount" label="刷脸次数"></el-table-column>
          <el-table-column align="center" prop="regCount" label="注册用户数"></el-table-column>
          <el-table-column align="center" v-if="showStatus" prop="status" label="状态" width="90px">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.status" activeText="启用" inactiveText="禁用" @changeBoolen="handleChangeStatus($event,scope.row.id)"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="editCdkey(scope.row)">编辑</el-button>
              <el-button type="text" v-if="scope.row.isUse==0" @click="handleDeleteCdkey(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <pagination-com :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({ page: val })}"></pagination-com>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getActivationPage, setStatusActivation, deleteActivation } from "../../api/magichome";
import switchCom from "../../components/switch";
import paginationCom from "../../components/paginationCom";
export default {
  components: { paginationCom, switchCom },
  data() {
    return {
      searchCode: "" /* 设备ID */,
      searchAuthor: "" /* 激活码 */,
      searchStatus: "all" /* 使用状态 */,
      searchTime: [],
      startTime: undefined /* 注册时间 */,
      endTime: undefined /* 注册时间 */,
      showStatus: true /* 刷新 */,
      cdkeyLsit: [],
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
    addCdkey() {
      this.$router.push({ name: "editCdkey" });
    },
    editCdkey(rows) {
      this.$router.push({ name: "editCdkey", query: { id: rows.id } });
    },
    /* 刷新 */
    refreshTable() {
      this.showStatus = false;
      this.$nextTick(() => {
        this.showStatus = true;
      });
    },
    handleDeleteCdkey(row) {
      this.$confirm("删除后将不可恢复，确认要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteActivation(row.id).then(data => {
            if (data.data.status == 0) {
              this.$message.success(data.data.data);
              this.showAll();
            } else {
              this.$message.error(data.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    handleChangeStatus(event, id) {
      setStatusActivation(id, event ? 1 : 0).then(data => {
        if (data.data.status == 0) {
          this.$message.success(data.data.data);
        } else {
          this.$message.error(data.data.msg);
        }
      });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchCode = "";
      this.searchAuthor = "";
      this.searchStatus = "all";
      this.searchTime = [];
      this.startTime = undefined;
      this.endTime = undefined;
      this.showAll();
    },
    /* 渲染表格 */
    setView(data) {
      this.cdkeyLsit = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
      this.refreshTable();
    },
    showAll(obj = {}) {
      getActivationPage({
        code: this.searchAuthor == "" ? undefined : this.searchAuthor,
        createTime: this.startTime,
        endTime: this.endTime,
        deviceId: this.searchCode == "" ? undefined : this.searchCode,
        isUse: this.searchStatus == "all" ? undefined : this.searchStatus,
        pageNo: obj.page ? obj.page : 1,
        pageSize: this.size
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
#cdkeyList {
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
        .search_box {
          .el-input-number {
            width: 110px;
          }
        }
      }
    }
  }
}
</style>