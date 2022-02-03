<template>
  <div id="tbinformation_check">
    <!-- 资讯审核列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">资讯审核</span>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="请输入标题关键字" v-model="searchInput" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span class="demonstration">发布日期:</span>
            <el-date-picker v-model="createTime" type="date" @change="selectByKwd" value-format="yyyy-MM-dd hh:mm:ss" placeholder="请选择日期"></el-date-picker>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="AllCheckNewsList" border style="width: 100%" row-key="id" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="newsTitle" label="标题"></el-table-column>
          <el-table-column prop="department" label="部门"></el-table-column>
          <el-table-column prop="author" label="作者" align="center"></el-table-column>
          <el-table-column prop="createTime" label="发布时间"></el-table-column>
          <el-table-column label="相关">
            <template slot-scope="scope">
              <!-- <div>收藏：{{scope.row.collecteNum}}</div> -->
              <div>阅读：{{scope.row.views}}</div>
              <!-- <div>转发：{{scope.row.transferNum}}</div> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="checkTbinformation(scope.row)">审核</el-button>
                <!-- <el-button type="text" disabled @click="viewInspiration(scope.row)">查看</el-button> -->
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
        <!-- 审核弹框 -->
        <el-dialog title="资讯审核" :visible.sync="checkVisible">
          <el-form ref="checkform" label-width="80px">
            <el-form-item label="资讯标题:">
              <span>{{checkTitle}}</span>
            </el-form-item>
            <el-form-item label="资讯审核:">
              <el-radio-group v-model="checkForm.status">
                <el-radio label="1">审核通过</el-radio>
                <el-radio label="-1">审核不通过</el-radio>
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
import { getAllCheckNews, deleteNewsByBatch, approvalNews } from "../../api/tbinformation";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      batchValue: "" /* 批量操作的类型 */,
      options: [{ label: "批量删除", value: "delete" }],
      searchInput: "" /* 标题 */,
      createTime: "",
      AllCheckNewsList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      batchArr: [] /* 批量操作 id 数组 */,
      topicList: [],
      checkTitle: "",
      checkVisible: false,
      checkForm: {
        id: "",
        status: "",
        reviewNote: ""
      }
    };
  },
  watch: {
    searchInput() {
      this.searchInput = this.searchInput;
    },
    createTime() {
      this.createTime = this.createTime;
    }
  },
  mounted() {
    this.showAll();
  },
  methods: {
    viewInspiration(rows) {
      console.log(rows)
    },
    alterInspiration(rows) {
      this.$router.push({ name: "inspiration_alter", query: { id: rows.id } });
    },
    addInspiration() {
      this.$router.push({ name: "inspiration_add" });
    },
    /* 审核资讯 */
    checkTbinformation(rows) {
      this.checkVisible = true;
      this.checkTitle = rows.newsTitle;
      this.checkForm.id = rows.id;
    },
    handleCheck(obj) {
      if (obj.type == "cancel") {
        this.checkForm = {
          id: "",
          status: "",
          reviewNote: ""
        };
        this.checkVisible = false;
      } else if (obj.type == "confirm") {
        /* 接口 */
        if (this.checkForm.status == "1") {
          if (this.checkForm.reviewNote == "") {
            this.checkForm.reviewNote = "审核通过";
          }
          this.verify();
        } else if (this.checkForm.status == "-1") {
          if (this.checkForm.reviewNote == "") {
            this.$message.error("请填写未通过理由！");
          } else {
            this.verify();
          }
        }
      }
    },
    // 审核
    verify() {
      approvalNews({
        id: this.checkForm.id == "" ? null : this.checkForm.id,
        status: this.checkForm.status == "" ? null : this.checkForm.status
      }).then(data => {
        if (data.data.status == 200) {
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
          status: "",
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
            deleteNewsByBatch(this.batchArr).then(data => {
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
          deleteNewsByBatch([rows.id]).then(data => {
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
      this.createTime = "";
      this.showAll();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput !== "" || this.createTime !== "") {
        // 执行查询中的分页;
        this.selectByKwd({ page: val });
      } else {
        // 执行全部中的分页;
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getAllCheckNews({
        pageSize: Number.isInteger(val) ? val : 20,
        pageNo: Number.isInteger(val) ? val : 1,
        createTime: this.createTime == "" ? null : this.createTime,
        title: this.searchInput == "" ? null : this.searchInput
      }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.AllCheckNewsList = data.data.content.list;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageNum;
      this.size = data.data.content.pageSize;
    },
    showAll(val) {
      getAllCheckNews(val || 1, 20, { status: "1" }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    }
  },
  components: { paginationCom }
};
</script>

<style lang='less'>
#tbinformation_check {
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
