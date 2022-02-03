<template>
  <div id="designer_idx">
    <!-- 设计师列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">设计师列表</span>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="请输入设计师姓名" v-model="searchInput" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <el-select v-model="searchLevel" @change="selectByKwd" placeholder="请选择设计师等级" clearable>
              <el-option label="精英设计师" :value="1"></el-option>
              <el-option label="主任设计师" :value="2"></el-option>
              <el-option label="首席设计师" :value="3"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <el-select v-model="searchType" @change="selectByKwd" placeholder="请选择设计师来源" clearable>
              <el-option label="平台" :value="0"></el-option>
              <el-option label="入驻" :value="1"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <div class="status">
          <el-tabs v-model="status" type="card" @tab-click="selectByKwd">
            <el-tab-pane :label="'全部设计师('+designerStatus.total+')'" name=" "></el-tab-pane>
            <el-tab-pane :label="'待审核('+designerStatus.wait+')'" name="0"></el-tab-pane>
            <el-tab-pane :label="'已通过('+designerStatus.pass+')'" name="1"></el-tab-pane>
            <el-tab-pane :label="'已拒绝('+designerStatus.refuse+')'" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <el-table :data="designerList" border style="width: 100%">
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="designerImage" align="center" label="设计师图片" width="100">
            <template slot-scope="scope" v-if="scope.row.designerImage">
              <Thumbnail :image="scope.row.designerImage" />
            </template>
          </el-table-column>
          <el-table-column label="设计师资料">
            <template slot-scope="scope">
              <div>昵称：{{scope.row.designerFullName}}</div>
              <div>姓名：{{scope.row.designerName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="价格(元/㎡)" width="100">
            <template slot-scope="scope">{{"¥"+(scope.row.designerPrice/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column label="标签" align="center" width="120">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.designerLevel==3" type="warning" effect="dark">首席设计师</el-tag>
              <el-tag v-if="scope.row.designerLevel==2" effect="dark">主任设计师</el-tag>
              <el-tag v-if="scope.row.designerLevel==1" type="info" effect="dark">精英设计师</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="designerWeight" label="排序"></el-table-column>
          <el-table-column prop="designerFollow" label="收藏"></el-table-column>
          <el-table-column prop="designerSale" label="销量"></el-table-column>
          <el-table-column prop="designerScore" label="评分"></el-table-column>
          <el-table-column prop="designerStatus" align="center" label="审核状态">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.designerStatus==0">待审核</span>
                <span v-if="scope.row.designerStatus==1">已通过</span>
                <span v-if="scope.row.designerStatus==2">已拒绝</span>
              </div>
              <el-button type="text" @click="checkDetails(scope.row)">审核详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterDesigner(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteDesigner(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="审核详情" :visible.sync="checkVisible" @close="closeCheck">
          <el-table :data="checkList" border style="width: 100%">
            <el-table-column prop="createTime" align="center" label="审核时间"></el-table-column>
            <el-table-column prop="operator" align="center" label="审核人员"></el-table-column>
            <el-table-column prop="resultType" align="center" label="审核结果">
              <template slot-scope="scope">
                <span v-if="scope.row.resultType==1">审核通过</span>
                <span v-if="scope.row.resultType==0">未通过</span>
              </template>
            </el-table-column>
            <el-table-column prop="message" align="center" label="反馈详情"></el-table-column>
          </el-table>
        </el-dialog>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getDesignerList, deleteDesigner, getDesignerApproval, getDesignerStatus } from "../../api/designer";
import paginationCom from "../../components/paginationCom";
import Thumbnail from "../../components/thumbnail";
export default {
  data() {
    return {
      status: " " /* 大的筛选条件 */,
      searchInput: "" /* 名称 / 货号 */,
      searchLevel: "" /* 设计师等级 */,
      searchType: "" /* 设计师来源 */,
      designerStatus: {
        total: "" /* 全部 */,
        pass: "" /* 已上架 */,
        wait: "" /* 待审核 */,
        refuse: "" /* 未通过 */,
        passstatus: "",
        waitstatus: "",
        refusestatus: ""
      },
      designerList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      checkVisible: false,
      checkList: []
    };
  },
  watch: {
    status: {
      /* 改变大的筛选条件 */
      handler() {
        // this.selectByKwd();
      }
    }
  },
  mounted() {
    this.showAll();
    getDesignerStatus().then(data => {
      this.designerStatus = data.data.content;
    });
  },
  methods: {
    alterDesigner(rows) {
      this.$router.push({ name: "designer_alter", query: { id: rows.id } });
    },
    /* 审核详情 */
    checkDetails(row) {
      getDesignerApproval(row.id).then(data => {
        if (data.data.status == 200) {
          this.checkList = data.data.content.result;
          this.checkVisible = true;
        }
      });
    },
    /* 关闭审核详情 */
    closeCheck() {
      this.checkList = [];
    },
    deleteDesigner(rows) {
      this.$confirm("此操作将删除该设计师, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDesigner([rows.id]).then(data => {
            if (data.data.status == 200) {
              this.$message({
                message: "删除设计师成功",
                type: "success"
              });
              this.selectByKwd("");
            } else {
              this.$message.error("删除设计师失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 清空搜索 */
    clearSearch() {
      this.status = " ";
      this.searchInput = "";
      this.searchLevel = "";
      this.searchType = "";
      this.showAll();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput != "" || this.status != " " || this.searchLevel != "" || this.searchType != "") {
        // 执行查询中的分页;
        this.selectByKwd({ page: val });
      } else {
        // 执行全部中的分页;
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(obj) {
      getDesignerList(Number.isInteger(obj.page) ? obj.page : 1, {
        designerLevel: this.searchLevel || null,
        designerName: this.searchInput || null,
        designerType: Number.isInteger(this.searchType) ? this.searchType : null,
        designerStatus: this.status != " " ? this.status : null,
        pageSize: this.size
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        } else {
          this.$message.error("搜索失败");
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.designerList = data.data.content.list;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageNum;
      this.size = 20;
    },
    showAll(val) {
      getDesignerList(val || 1).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    }
  },
  components: { paginationCom, Thumbnail }
};
</script>

<style lang='less'>
#designer_idx {
  width: 100%;
  height: auto;

  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        width: 100%;
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
