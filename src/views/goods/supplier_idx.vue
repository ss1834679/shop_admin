<template>
  <div id="supplier_idx">
    <!-- 店铺列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">店铺列表</span>
      </div>
      <div class="content">
        <div class="tool">
          <div class="filtrate">
            <el-button icon="el-icon-plus" type="primary" @click="addNewSupplier">新增</el-button>
          </div>
          <div class="search_box">
            <el-input placeholder="请输入内容" v-model="selectValue" @keyup.native.enter="selectByKwd" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="selectByKwd"></el-button>
            </el-input>
          </div>
        </div>
        <el-table :data="supplierList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="ID" width="130"></el-table-column>
          <el-table-column prop="supplierName" label="店铺名称"></el-table-column>
          <el-table-column prop="supplierDesc" label="简介"></el-table-column>
          <!-- 店铺logo -->
          <el-table-column prop="supplierIcon" align="center" label="店铺LOGO" width="160">
            <template slot-scope="scope" v-if="scope.row.supplierIcon">
              <Thumbnail :image="scope.row.supplierIcon" />
            </template>
          </el-table-column>
          <el-table-column prop="supplierType" align="center" label="类型" width="70">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.supplierType" type="success">商家</el-tag>
              <el-tag v-else type="warning">自营</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isDelete" align="center" label="商家状态" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isDelete" type="danger">禁用</el-tag>
              <el-tag v-else type="success">启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="135">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterSupplier(scope.row)">编辑</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getSupplier, updateSupplier } from "../../api/supplier";
import Thumbnail from "../../components/thumbnail";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      select: "不限",
      searchInput: "",
      supplierList: [],
      total: 0 /* 页码总数 */,
      cPage: 1 /* 当前页码 */,
      size: 0,
      selectValue: "" /* 搜索的值 */,
      selectedList: "" /* 选中的列有哪些 */,
      batchValue: "" /* 批量操作的动作 */,
      options: [
        { value: 1, label: "显示店铺" },
        { value: 2, label: "隐藏店铺" }
      ]
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    addNewSupplier() {
      this.$router.push({ name: "supplier_add" });
    },
    alterSupplier(rows) {
      this.$router.push({ name: "supplier_alter", query: { id: rows.id } });
    },
    getSelection(val) {
      this.selectedList = ""; /* 先置空 */
      /* 批量操作id拼接 */
      val.forEach((item, index, arr) => {
        if (index == arr.length - 1) {
          this.selectedList = this.selectedList + item.id;
        } else {
          this.selectedList = this.selectedList + item.id + ",";
        }
      });
    },
    /* 批量操作 */
    batchOperation() {
      let obj = {};
      let callback1 = () => {
        this.$message({
          showClose: true,
          message: "批量操作成功",
          type: "success"
        });
      };
      let callback2 = () => {
        this.$message.error("批量操作失败");
      };
      obj.id = this.selectedList;
      switch (this.batchValue) {
        case 1:
          obj["isDelete"] = 0;
          updateSupplier(obj).then(data => {
            if (data.data.status == 0) {
              this.showAll();
              callback1();
            } else {
              this.showAll();
              callback2();
            }
          });
          break;
        case 2:
          obj["isDelete"] = 1;
          updateSupplier(obj).then(data => {
            if (data.data.status == 0) {
              this.showAll();
              callback1();
            } else {
              this.showAll();
              callback2();
            }
          });
          break;
        default:
          break;
      }
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.selectValue != "") {
        //执行查询中的分页
        this.selectByKwd(val);
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    selectByKwd(val) {
      getSupplier({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20,
        supplierName: this.selectValue
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
          this.$message({
            message: "已执行查询",
            type: "success"
          });
        }
      });
    },
    setView(data) {
      this.supplierList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getSupplier({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 状态的启用和禁用 */
    handleIsDelete(obj) {
      updateSupplier({
        id: obj.row.id,
        isDelete: obj.type == "up" ? 0 : 1
      }).then(data => {
        if (data.data.status == 0) {
          obj.row.isDelete = obj.type == "up" ? 0 : 1;
          this.$message({
            message: data.data.data,
            type: "success"
          });
        } else {
          this.$message.error(data.data.data);
        }
      });
    }
  },
  components: { paginationCom, Thumbnail }
};
</script>

<style lang='less'>
#supplier_idx {
  width: 100%;
  height: auto;

  .el-table__header .el-table-column--selection .cell .el-checkbox:after {
    content: "全选";
    margin-left: 5px;
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
      .tool {
        //table上的一栏按钮
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        .search_box {
          width: 270px;
        }
        .filtrate {
          display: flex;
          align-items: center;
          width: auto;
        }
      }
      .batchOperation {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-pagination {
          padding: 0;
        }
        .el-select {
          width: 120px;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
