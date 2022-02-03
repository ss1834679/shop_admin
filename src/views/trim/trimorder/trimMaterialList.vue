<template>
  <div id="trimMaterialList">
    <!-- 装修资料列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title">装修资料</span>
        </div>
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
            <el-select v-model="searchBig" @change="changeSmall" placeholder="请选择大节点" clearable>
              <el-option v-for="item in bigNodeList" :key="item.id" :label="item.nodeName" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="searchSmall" @change="showAll" placeholder="请选择小节点" clearable>
              <el-option v-for="item in smallNodeList" :key="item.id" :label="item.nodeName" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <el-table :data="materialList" border>
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="title" label="标题" align="center"></el-table-column>
          <el-table-column prop="bigNodeName" label="大节点" align="center"></el-table-column>
          <el-table-column prop="smallNodeName" label="小节点" align="center"></el-table-column>
          <el-table-column prop="releaseTime" label="发布时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="handleViewMaterial(scope.row)">查看</el-button>
                <el-button type="text" v-if="managerVisible" @click="handleDelete(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <Paginationcom :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
      </div>
    </el-card>
  </div>
</template>

<script>
import Paginationcom from "../../../components/paginationCom";
import {
  getDecorationInfoPage,
  getDecorationInfoBigNode,
  getDecorationInfoSmallNode,
  deleteDecorationInfo
} from "../../../api/trim";
import { mapGetters } from "vuex";
export default {
  components: { Paginationcom },
  data() {
    return {
      searchBig: "",
      searchSmall: "",
      bigNodeList: [],
      smallNodeList: [],
      materialList: [],
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  computed: {
    ...mapGetters({
      managerVisible: "onGetIsManager"
    })
  },
  mounted() {
    this.showAll();
    getDecorationInfoBigNode(this.$route.query.id).then(data => {
      if (data.data.status == 0) {
        this.bigNodeList = data.data.data;
      }
    });
  },
  methods: {
    /** 查看装修资料 */
    handleViewMaterial(row) {
      this.$router.push({ name: "trimMaterialDetails", query: { id: row.id } });
    },
    handleDelete(row) {
      this.$confirm("此操作将删除该装修资料，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDecorationInfo(row.id).then(data => {
            if (data.data.status == 0) {
              this.$message.success(data.data.data);
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
    changeSmall() {
      if (this.searchBig) {
        getDecorationInfoSmallNode(this.searchBig, this.$route.query.id).then(data => {
          if (data.data.status == 0) {
            this.smallNodeList = data.data.data;
            this.searchSmall = "";
            this.showAll();
          }
        });
      }
    },
    showAll(val = {}) {
      getDecorationInfoPage({
        decorateOrderId: this.$route.query.id,
        pageNo: val.page ? val.page : 1,
        pageSize: this.size,
        bigNodeId: this.searchBig == "" ? undefined : this.searchBig,
        smallNodeId: this.searchSmall == "" ? undefined : this.searchSmall
      }).then(data => {
        if (data.data.status == 0) {
          this.materialList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#trimMaterialList {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
      padding: 0;
      .clearfix {
        width: calc(~"100% - 40px");
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        span.title {
          line-height: 50px;
          margin-left: 20px;
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