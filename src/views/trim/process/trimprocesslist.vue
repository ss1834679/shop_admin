<template>
  <div id="trimprocesslist">
    <!-- 装修流程配置 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">装修流程配置</span>
        <el-button @click="addTrimProcess">添加装修流程</el-button>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>分类：</span>
            <el-select v-model="searchCate" @change="showAll" placeholder="请选择分类" clearable>
              <el-option v-for="item in cateList" :key="item.id" :label="item.flagDesc" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <el-table :data="trimprocessList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="processName" label="流程名" align="center"></el-table-column>
          <el-table-column prop="processClassifyDesc" label="分类" align="center"></el-table-column>
          <el-table-column prop="bigNodeNum" label="大节点数" align="center"></el-table-column>
          <el-table-column prop="smallNodeNum" label="小节点数" align="center"></el-table-column>
          <el-table-column prop="processSort" label="排序" align="center"></el-table-column>
          <el-table-column prop="isEnable" label="启用" v-if="showSwitch" align="center">
            <template slot-scope="scope">
              <Switchcom :boolen="scope.row.isEnable==1" activeText="启用" inactiveText="不启用" @changeBoolen="handleChangeStatus($event,scope.row.id)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="handleBigNode(scope.row)">大节点列表</el-button>
                <el-button type="text" @click="alterTrimProcess(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteTrimProcess(scope.row)">删除</el-button>
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
import Switchcom from "../../../components/switch";
import {
  getDecorateDictProcess,
  getDecorateProcessPage,
  updateDecorateProcessIsEnable,
  deleteDecorateProcess
} from "../../../api/trim";
export default {
  components: { Switchcom, Paginationcom },
  data() {
    return {
      searchCate: "" /* 搜索分类 */,
      cateList: [],
      trimprocessList: [],
      showSwitch: true,
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  mounted() {
    this.showAll();
    getDecorateDictProcess().then(data => {
      if (data.data.status == 0) {
        this.cateList = data.data.data;
      }
    });
  },
  methods: {
    handleChangeStatus(value, id) {
      updateDecorateProcessIsEnable(id, value ? 1 : 2).then(data => {
        if (data.data.status == 0) {
          this.$message.success("修改状态成功");
        } else {
          this.$message.error(data.data.msg);
          this.showAll({ page: this.cPage });
        }
      });
    },
    /* 添加装修流程 */
    addTrimProcess() {
      this.$router.push({ name: "editTrimProcess", params: { isAdd: true } });
    },
    /* 编辑装修流程 */
    alterTrimProcess(row) {
      this.$router.push({ name: "editTrimProcess", query: { id: row.id } });
    },
    handleBigNode(row) {
      this.$router.push({ name: "bigNodeList", query: { id: row.id, processName: row.processName } });
    },
    deleteTrimProcess(row) {
      this.$confirm("此操作将删除该装修流程，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDecorateProcess(row.id).then(data => {
            if (data.data.status == 0) {
              this.$message.success("删除流程成功");
              this.showAll({ page: this.cPage });
            } else {
              this.$message.error(data.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 刷新 */
    refreshSwitch() {
      this.showSwitch = false;
      this.$nextTick(() => {
        this.showSwitch = true;
      });
    },
    showAll(val = {}) {
      getDecorateProcessPage({
        pageNo: val.page ? val.page : 1,
        pageSize: this.size,
        processClassify: this.searchCate == "" ? undefined : this.searchCate
      }).then(data => {
        if (data.data.status == 0) {
          this.trimprocessList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
          this.refreshSwitch();
        }
      });
    }
  }
};
</script>

<style lang='less'>
#trimprocesslist {
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