<template>
  <div id="delivery-information">
    <!--发货点信息管理页 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">发货点信息管理</span>
      </div>
      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
        <div class="se-right">
          <div class="box-r">
            <el-button size="small" @click="toAddDelivery">添加</el-button>
          </div>
        </div>
      </div>
      <!-- 表格标题 -->
      <el-table :data="deliveryList" border row-key="id" style="width: 100%">
        <el-table-column prop="name" label="发货点名称"></el-table-column>
        <el-table-column prop="fullName" label="发货人姓名"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="toAlterDelivery(scope.row.id)">编辑</el-button>
            <el-button type="text" size="medium" @click="deleteClick(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAddressList, deleteAddressSup } from "../../api/supplier";
export default {
  data() {
    return {
      deliveryList: [
        // {
        //   id: "123124323423432",
        //   name: "地址1",
        //   fullName: "张大大",
        //   provinceId: "22",
        //   cityId: "289",
        //   areaId: "2402",
        //   address: "天安数码城云谷2栋4楼",
        //   phone: "13100000000"
        // }
      ]
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    deleteClick(row) {
      this.$confirm("此操作将删除该发货点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteAddressSup(row.id).then(data => {
            if (data.data.status == 200) {
              this.showAll();
              this.$message({
                type: "success",
                message: "删除成功"
              });
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    // 添加按钮
    toAddDelivery() {
      this.$router.push({ name: "add-delivery" });
    },
    toAlterDelivery(id) {
      this.$router.push({ name: "alter-delivery", query: { id: id } });
    },
    showAll() {
      getAddressList().then(data => {
        if (data.data.status == 200) {
          this.deliveryList = data.data.content;
        } else {
          this.$message.error("获取失败请刷新重新获取");
        }
      });
    }
  }
};
</script>

<style lang="less">
#delivery-information {
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
