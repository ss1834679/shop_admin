<template>
  <div id="articel_idx">
    <!-- 文章列表列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">文章列表</span>
        <el-button plain size="small" @click="addArticel">发布文章</el-button>
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
            <el-select v-model="searchchannel" @change="selectByKwd" placeholder="请选择话题分类" clearable>
              <el-option v-for="item in topicList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="articleList" border style="width: 100%" row-key="id" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="channelName" label="话题"></el-table-column>
          <!-- <el-table-column prop="id" label="转化订单"></el-table-column> -->
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
              <div>收藏：{{scope.row.collectionNum}}</div>
              <div>阅读：{{scope.row.visits}}</div>
              <div>点赞：{{scope.row.thumbUp}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterArticel(scope.row)">编辑</el-button>
                <el-button type="text" disabled @click="viewArticel(scope.row)">查看</el-button>
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
      </div>
    </el-card>
  </div>
</template>

<script>
import { getArticleList, getChannelAll, deleteArticle } from "../../api/circle";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      batchValue: "" /* 批量操作的类型 */,
      options: [{ label: "批量删除", value: "delete" }],
      searchInput: "" /* 标题 */,
      searchchannel: "" /* 话题分类 */,
      articleList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      batchArr: [] /* 批量操作 id 数组 */,
      topicList: []
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
    viewArticel(rows) {
      console.log(rows.id);
    },
    alterArticel(rows) {
      this.$router.push({ name: "article_alter", query: { id: rows.id } });
    },
    addArticel() {
      this.$router.push({ name: "article_add" });
    },
    /* 批量操作 判断是什么操作 */
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些文章, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            deleteArticle({ articleIdList: this.batchArr }).then(data => {
              if (data.status == 200) {
                this.$message({
                  message: "批量删除文章成功",
                  type: "success"
                });
                this.selectByKwd("get");
              } else {
                this.$message.error("批量删除文章失败");
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
    /* 删除单个文章 */
    deleteArticel(rows) {
      this.$confirm("此操作将删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 调接口 */
          deleteArticle({ articleIdList: [rows.id] }).then(data => {
            if (data.status == 200) {
              this.$message({
                message: "删除文章成功",
                type: "success"
              });
              this.selectByKwd("get");
            } else {
              this.$message.error("删除文章失败");
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
      this.searchchannel = "";
      this.showAll();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput != "" || this.searchchannel != "") {
        // 执行查询中的分页;
        this.selectByKwd({ page: val });
      } else {
        // 执行全部中的分页;
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(obj) {
      getArticleList(obj.val || 1, 20, {
        title: this.searchInput || null,
        channelId: this.searchchannel || null
      }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.articleList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    showAll(val) {
      getArticleList(val || 1, 20).then(data => {
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
#articel_idx {
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
