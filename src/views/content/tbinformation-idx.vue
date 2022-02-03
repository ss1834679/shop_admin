<template>
  <div id="tbinformation-idx">
    <!-- 资讯列表列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">资讯列表</span>
        <el-button plain size="small" @click="addTbinformation">发布资讯</el-button>
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
        <el-table :data="tbinformationList" border style="width: 100%" row-key="id" @selection-change="getSelection" ref="tbinformationLists">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="newsTitle" label="标题" align="center"></el-table-column>
          <el-table-column prop="department" label="部门"></el-table-column>
          <el-table-column prop="author" label="作者" align="center"></el-table-column>
          <el-table-column prop="status" label="审核" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status=='1'">审核通过</span>
              <span v-if="scope.row.status=='-1'">未通过</span>
              <span v-if="scope.row.status=='0'">待审核</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间"></el-table-column>
          <el-table-column label="相关" >
            <template slot-scope="scope">
              <!-- <div>收藏：{{scope.row.collecteNum}}</div> -->
              <div>阅读：{{scope.row.views}}次</div>
              <!-- <div>转发：{{scope.row.transferNum}}</div> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="tbinformationEdit(scope.row)">编辑</el-button>
                <el-button type="text"  @click="viewTbinformation(scope.row)">查看</el-button>
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
import { getAllNewsByPage,deleteNewsByBatch,addViews } from "../../api/tbinformation";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      batchValue: "" /* 批量操作的类型 */,
      options: [{ label: "批量删除", value: "delete" }],
      searchInput: "" /* 标题 */,
      tbinformationList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      batchArr: [] /* 批量操作 id 数组 */,
      tbinformationLists:{
        id:''
      },
      tbinformationId:'',
    };
  },
  watch:{
    searchInput(){
      this.searchInput=this.searchInput
    }
  },
  mounted() {
    this.showAll();

  },
  methods: {
    // 查看资讯
    viewTbinformation(rows) {
      this.$router.push({ name: "tbinformation_detail", query: { id: rows.id } });
      addViews({id:rows.id}).then(data=>{
        console.log(data)
})
    },
    // 编辑资讯
    tbinformationEdit(rows) {
      this.$router.push({ name: "tbinformation-edit", query: {id: rows.id } });
    },
    // 发布资讯
    addTbinformation() {
      this.$router.push({ name: "tbinformation-add" });
    },
    /* 批量操作 判断是什么操作 */
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些资讯, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            deleteNewsByBatch(this.batchArr).then(data => {
              if (data.status == 200) {
                this.$message({
                  message: "批量删除资讯成功",
                  type: "success"
                });
                this.selectByKwd("get");
              } else {
                this.$message.error("批量删除资讯失败");
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
      this.$confirm("此操作将删除该资讯, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 调接口 */
          deleteNewsByBatch([rows.id]).then(data => {
            if (data.status == 200) {
              this.$message({
                message: "删除资讯成功",
                type: "success"
              });
              this.selectByKwd("get");
            } else {
              this.$message.error("删除资讯失败");
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
    selectByKwd(val) {
      getAllNewsByPage({
        pageSize:20,
        pageNo: Number.isInteger(val) ? val : 1,
        title: this.searchInput=="" ? null :this.searchInput
      }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.tbinformationList = data.data.content.list;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pages;
      this.size = data.data.content.size;
    },
    showAll(val) {
      getAllNewsByPage({
        pageSize: Number.isInteger(val) ? val : 20,
        pageNo: Number.isInteger(val) ? val : 1,
      }).then(data => {
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
#tbinformation-idx {
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
