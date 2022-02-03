<template>
  <div id="set-address-list">
    <!-- 小区地理位置列表页 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">小区地理位置列表</span>
      </div>
      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
        <div class="se-right">
          <div class="box-r">
            <el-button size="mini" @click="Address">添加</el-button>
          </div>
        </div>
      </div>
      <!-- 表格标题 -->
      <el-table :data="villageByPageList" border row-key="id" style="width: 100%" @selection-change="getSelection">
        <el-table-column type="selection" align="center" width="70"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="title" label="小区名称"></el-table-column>
        <el-table-column prop="createTime" label="添加时间"></el-table-column>
        <el-table-column prop="lng" label="经度"></el-table-column>
        <el-table-column prop="lat" label="纬度"></el-table-column>
        <el-table-column prop="operatorId" label="操作人"></el-table-column>
        <el-table-column label="操作" align="center" width="135">
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
        <!-- 分页 -->
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
import paginationCom from "../../components/paginationCom";
import { getVillageByPage, deleteVillageByBatch } from "../../api/setings";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      villageByPageList: [],
      rules2: [{ required: true, trigger: "blur" }],
      batchValue: "",
      batchOptions: [{ label: "批量删除", value: "delete" }],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      batchArr: []
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // 删除
    deleteVillage(rows) {
      this.$confirm("此操作将删除这个小区, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 调接口 */
          deleteVillageByBatch([rows.id]).then(data => {
            if (data.status == 200) {
              this.$message({
                message: "删除小区成功",
                type: "success"
              });
              this.showAll();
            } else {
              this.$message.error("删除小区失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    // 批量删除确认
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些小区, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            deleteVillageByBatch(this.batchArr).then(data => {
              if (data.status == 200) {
                this.$message({
                  message: "批量删除小区成功",
                  type: "success"
                });
                this.showAll();
              } else {
                this.$message.error("批量删除小区失败");
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
    },
    // 编辑按钮，打开编辑框
    toAddress(rows) {
      this.$router.push({ name: "set-address", query: { id: rows.id } });
    },
    // 添加小区
    Address() {
      this.$router.push({ name: "set-address" });
    },
    getSelection(val) {
      this.batchArr = [];
      val.forEach(item => {
        this.batchArr.push(item.id);
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      this.showAll(val);
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getVillageByPage({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20
      }).then(data => {
        if (data.status == 200) {
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
#set-address-list {
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
