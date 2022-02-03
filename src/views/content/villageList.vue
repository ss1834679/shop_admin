<template>
  <div id="villageList">
    <!-- 小区列表页 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">小区列表</span>
      </div>
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
          <span>小区名称：</span>
          <el-input placeholder="小区名称" v-model="searchInput" @keydown.native.enter="showAll"></el-input>
        </div>
        <div class="search_box">
          <span>有无位置：</span>
          <el-select v-model="searchIsPosition" @change="showAll">
            <el-option label="全部" value="all"></el-option>
            <el-option label="有" :value="1"></el-option>
            <el-option label="无" :value="0"></el-option>
          </el-select>
        </div>
        <div class="search_box">
          <span>添加时间：</span>
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
      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
        <div class="se-right">
          <div class="box-r">
            <el-button size="mini" @click="Address">添加小区</el-button>
          </div>
        </div>
      </div>
      <!-- 表格标题 -->
      <el-table :data="villageByPageList" ref="villagetable" border row-key="id" style="width: 100%" @selection-change="getSelection">
        <el-table-column type="selection" align="center" width="70"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="title" label="小区名称"></el-table-column>
        <el-table-column prop="street" label="位置"></el-table-column>
        <el-table-column prop="lng" label="经度"></el-table-column>
        <el-table-column prop="lat" label="纬度"></el-table-column>
        <el-table-column prop="createTime" label="添加时间"></el-table-column>
        <el-table-column prop="operatorId" label="操作人"></el-table-column>
        <el-table-column align="center" prop="linkQuoteCount" label="关联案例"></el-table-column>
        <el-table-column label="操作" align="center" width="125">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="toAddress(scope.row)">编辑</el-button>
            <el-button type="text" size="medium" @click="deleteVillage(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="batchOperation">
        <div>
          <el-select v-model="batchValue" placeholder="批量操作">
            <el-option v-for="item in batchOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button @click="batchOperation">确认</el-button>
        </div>
        <pagination-com
          :total="total"
          :size.sync="size"
          :cPage="cPage"
          :isChangeSize="true"
          @changeSizes="showAll()"
          @getJump="(val)=>{showAll({page:val})}"
        ></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllVillageByPage, deleteVillageBatch } from "../../api/promanage";
import paginationCom from "../../components/paginationCom";
export default {
  components: { paginationCom },
  data() {
    return {
      searchInput: "" /* 小区名称 */,
      searchIsPosition: "all" /* 有无位置 */,
      searchTime: [],
      startTime: null,
      endTime: null,
      villageByPageList: [],
      rules2: [{ required: true, trigger: "blur" }],
      batchValue: "",
      batchOptions: [
        { label: "批量删除", value: "delete" },
        { label: "填写位置", value: "edit" }
      ],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      batchArr: [],
      hasLink: false /* 是否有关联案例 */,
      hasLinkList: []
    };
  },
  watch: {
    searchTime: {
      handler() {
        if (this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
        } else {
          this.startTime = null;
          this.endTime = null;
        }
      }
    }
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // 删除
    deleteVillage(rows) {
      new Promise((resolve, reject) => {
        if (rows.linkQuoteCount > 0) {
          reject("当前小区存在关联案例，无法删除");
        }
        resolve();
      })
        .then(() => {
          this.$confirm("此操作将删除这个小区, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              deleteVillageBatch([rows.id]).then(data => {
                if (data.data.status == 0) {
                  this.$message({ message: "删除小区成功", type: "success" });
                  this.showAll();
                } else {
                  this.$message.error("删除小区失败");
                }
              });
            })
            .catch(() => {
              this.$message("已取消删除");
            });
        })
        .catch(res => {
          this.$alert(res, "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
        });
    },
    // 批量删除确认
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        new Promise((resolve, reject) => {
          if (this.batchArr.length == 0) {
            reject("请选择小区！");
          }
          if (this.hasLink) {
            this.hasLinkList.forEach(item => {
              this.$refs.villagetable.toggleRowSelection(item, false);
            });
            reject("选中的小区含有关联案例的小区，已经剔除这些小区");
          }
          resolve();
        })
          .then(() => {
            this.$confirm("此操作将删除这些小区, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                deleteVillageBatch(this.batchArr).then(data => {
                  if (data.data.status == 0) {
                    this.$message({ message: "批量删除小区成功", type: "success" });
                    this.showAll();
                  } else {
                    this.$message.error("批量删除小区失败");
                  }
                });
              })
              .catch(() => {
                this.$message("已取消删除");
              });
          })
          .catch(res => {
            this.$alert(res, "提示", { confirmButtonText: "确定", type: "warning" });
          });
      }
      if (this.batchValue == "edit") {
        new Promise((resolve, reject) => {
          if (this.batchArr.length == 0) {
            reject("请选择小区！");
          }
          resolve();
        })
          .then(() => {
            this.$router.push({ name: "villageBatch", query: { idList: this.batchArr } });
          })
          .catch(res => {
            this.$alert(res, "提示", { confirmButtonText: "确定", type: "warning" });
          });
      }
    },
    // 编辑按钮，打开编辑框
    toAddress(rows) {
      this.$router.push({ name: "villageEdit", query: { id: rows.id } });
    },
    // 添加小区
    Address() {
      this.$router.push({ name: "villageEdit" });
    },
    getSelection(val) {
      this.batchArr = [];
      this.hasLink = false;
      this.hasLinkList = [];
      val.forEach(item => {
        if (item.linkQuoteCount > 0) {
          this.hasLink = true;
          this.hasLinkList.push(item);
        }
        this.batchArr.push(item.id);
      });
    },
    clearSearch() {
      this.searchInput = "";
      this.searchTime = [];
      this.startTime = null;
      this.endTime = null;
      this.searchIsPosition = "all";
      this.showAll();
    },
    /* 反复调用显示全部 */
    showAll(val = {}) {
      getAllVillageByPage({
        endTime: this.endTime,
        startTime: this.startTime,
        isPosition: this.searchIsPosition == "all" ? null : this.searchIsPosition,
        pageNo: val.page ? val.page : 1,
        pageSize: this.size,
        title: this.searchInput == "" ? null : this.searchInput
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.villageByPageList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
    }
  }
};
</script>

<style lang="less">
#villageList {
  width: 100%;
  height: auto;
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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