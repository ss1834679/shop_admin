<template>
  <div id="inspiration_check">
    <!-- 灵感审核列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">灵感审核</span>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="请输入标题关键字" v-model="searchInput" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="inspirationList" border style="width: 100%" row-key="id" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="bigImage" label="封面图片" align="center">
            <template slot-scope="scope" v-if="scope.row.bigImage">
              <Thumbnail :image="scope.row.bigImage" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="villageName" label="区域"></el-table-column>
          <el-table-column prop="decorateStyleName" label="风格"></el-table-column>
          <el-table-column prop="userName" label="作者" align="center"></el-table-column>
          <el-table-column prop="state" label="审核" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.state=='2'">审核通过</span>
              <span v-if="scope.row.state=='0'">未通过</span>
              <span v-if="scope.row.state=='1'">待审核</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间"></el-table-column>
          <el-table-column label="相关">
            <template slot-scope="scope">
              <div>收藏：{{scope.row.collecteNum}}</div>
              <div>阅读：{{scope.row.visitNum}}</div>
              <div>转发：{{scope.row.transferNum}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="checkInspiration(scope.row)">审核</el-button>
                <el-button type="text" @click="deleteArticel(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <div>
            <el-select v-model="batchValue" placeholder="批量操作">
              <el-option v-for="(item,idx) in options" :key="idx" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button @click="batchOperation">确认</el-button>
          </div>
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
        <el-dialog title="灵感审核" :visible.sync="checkVisible">
          <el-form ref="checkform" label-width="80px">
            <el-form-item label="灵感标题:">
              <span>{{checkTitle}}</span>
            </el-form-item>
            <el-form-item label="商品审核:">
              <el-radio-group v-model="checkForm.state">
                <el-radio label="2">审核通过</el-radio>
                <el-radio label="0">审核不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="反馈详情:">
              <el-input type="textarea" v-model="checkForm.reviewNote"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCheck({type:'cancel'})">取 消</el-button>
            <el-button type="primary" @click="handleCheck({type:'confirm'})">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getInspirationList, getChannelAll, deleteInspiration, verifyInspiration } from "../../api/circle";
import paginationCom from "../../components/paginationCom";
import Thumbnail from "../../components/thumbnail";
export default {
  data() {
    return {
      batchValue: "" /* 批量操作的类型 */,
      options: [{ label: "批量删除", value: "delete" }],
      searchInput: "" /* 标题 */,
      inspirationList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      batchArr: [] /* 批量操作 id 数组 */,
      topicList: [],
      checkTitle: "",
      checkVisible: false,
      checkForm: {
        id: "",
        state: "",
        reviewNote: ""
      }
    };
  },
  mounted() {
    this.showAll();
    /* 初始化话题列表 */
    getChannelAll(1, 20).then(data => {
      if (data.status == 200) {
        this.topicList = data.data.data.list;
      }
    });
  },
  methods: {
    alterInspiration(rows) {
      this.$router.push({ name: "inspiration_alter", query: { id: rows.id } });
    },
    addInspiration() {
      this.$router.push({ name: "inspiration_add" });
    },
    /* 审核灵感 */
    checkInspiration(rows) {
      this.checkVisible = true;
      this.checkTitle = rows.title;
      this.checkForm.id = rows.id;
    },
    handleCheck(obj) {
      if (obj.type == "cancel") {
        this.checkForm = {
          id: "",
          state: "",
          reviewNote: ""
        };
        this.checkVisible = false;
      } else if (obj.type == "confirm") {
        /* 接口 */
        if (this.checkForm.state == "2") {
          if (this.checkForm.reviewNote == "") {
            this.checkForm.reviewNote = "审核通过";
          }
          this.verify();
        } else if (this.checkForm.state == "0") {
          if (this.checkForm.reviewNote == "") {
            this.$message.error("请填写未通过理由！");
          } else {
            this.verify();
          }
        }
      }
    },
    verify() {
      verifyInspiration(this.checkForm).then(data => {
        if (data.data.status == 0) {
          this.showAll();
          this.$message({
            message: "审核成功",
            type: "success"
          });
        } else {
          this.$message.error("审核失败");
        }
        this.checkVisible = false;
        this.checkForm = {
          id: "",
          state: "",
          reviewNote: ""
        };
      });
    },
    /* 批量操作 判断是什么操作 */
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些灵感, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            deleteInspiration(this.batchArr).then(data => {
              if (data.status == 200) {
                this.$message({
                  message: "批量删除灵感成功",
                  type: "success"
                });
                this.selectByKwd("get");
              } else {
                this.$message.error("批量删除灵感失败");
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
    },
    /* 获取批量操作的id数组 */
    getSelection(val) {
      this.batchArr = []; /* 先置空 */
      val.forEach(item => {
        this.batchArr.push(item.id);
      });
    },
    /* 删除单个灵感 */
    deleteArticel(rows) {
      this.$confirm("此操作将删除该灵感, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 调接口 */
          deleteInspiration([rows.id]).then(data => {
            if (data.status == 200) {
              this.$message({
                message: "删除灵感成功",
                type: "success"
              });
              this.selectByKwd("get");
            } else {
              this.$message.error("删除灵感失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchInput = "";
      this.showAll();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput != "") {
        // 执行查询中的分页;
        this.selectByKwd({ page: val });
      } else {
        // 执行全部中的分页;
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(obj) {
      getInspirationList(obj.val || 1, 20, {
        title: this.searchInput || null,
        state: "1"
      }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.inspirationList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    showAll(val) {
      getInspirationList(val || 1, 20, { state: "1" }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    }
  },
  components: { paginationCom, Thumbnail }
};
</script>

<style lang='less'>
#inspiration_check {
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
