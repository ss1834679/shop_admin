<template>
  <div id="freight_idx">
    <!--运费模板管理 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">运费模板管理</span>
      </div>
      <div class="se-content">
        <div>
          <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
          <span>筛选查询:</span>
        </div>
      </div>
      <div class="search">
        <div class="search_box">
          <span class="s-size">请输入:</span>
        </div>
        <div class="search_box">
          <el-input placeholder="模板名称" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
        </div>
        <el-button type="text" @click="clearSearch">清空搜索</el-button>
      </div>

      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
        <div class="se-right">
          <div class="box-r">
            <el-button size="small" @click="toAddTemp">添加</el-button>
          </div>
        </div>
      </div>
      <el-table :data="freightList" border row-key="id" style="width: 100%">
        <el-table-column prop="templates.id" label="编号" align="center"></el-table-column>
        <el-table-column prop="templates.name" label="模板名称" align="center"></el-table-column>
        <el-table-column label="计价方式" align="center">
          <template slot-scope="scope" v-if="scope.row.templates">
            <span v-if="scope.row.templates.type==1">按重量计费</span>
            <span v-if="scope.row.templates.type==2">按件数计费</span>
          </template>
        </el-table-column>
        <el-table-column prop="defaultValuationModel.valuation.firstPrice" label="首重（首件）价格" align="center">
          <template slot-scope="scope">{{"¥"+(scope.row.defaultValuationModel.valuation.firstPrice/100).toFixed(2)}}</template>
        </el-table-column>
        <el-table-column prop="defaultValuationModel.valuation.price" label="续重（续件）价格" align="center">
          <template slot-scope="scope">{{"¥"+(scope.row.defaultValuationModel.valuation.price/100).toFixed(2)}}</template>
        </el-table-column>
        <el-table-column prop="templates.createTime" label="添加时间" align="center"></el-table-column>
        <el-table-column prop="goodsNum" label="关联商品数" align="center"></el-table-column>
        <el-table-column prop="templates.status" label="是否启用" align="center">
          <template slot-scope="scope" v-if="scope.row.templates">
            <switch-com :boolen="scope.row.templates.status" @changeValue="(value)=>{changeStatus(scope.row.templates.id)}"></switch-com>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="toAlterFreight(scope.row.templates.id)">编辑</el-button>
            <el-button type="text" size="medium" @click="deleteClick(scope.row.templates.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../components/switch";
import { getTemplatesList, updateTemplatesStatus, deleteTemplates } from "../../api/setings";
import { getProvinceCityDistrict } from "../../api/usercenter";
export default {
  components: { switchCom },
  data() {
    return {
      searchName: "" /* 模板名称 */,
      freightList: [
        // {
        //   id: "123124323423432",
        //   name: "模板1发货点A",
        //   method: "1" /* 计价方式 1 按件数计数  2 按重量计数 */,
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
    if (this.$store.state.provinceCityDistrict.length == 0) {
      getProvinceCityDistrict().then(data => {
        if (data.data.status == 200) {
          this.$store.commit("getprovinceCityDistrict", data.data.content);
        }
      });
    }
  },
  methods: {
    changeStatus(id) {
      /* 修改是否启用 */
      updateTemplatesStatus(id).then(data => {
        if (data.data.status == 200) {
          this.$message({ type: "success", message: "修改状态成功" });
        } else {
          this.$message.error("修改失败");
          this.showAll();
        }
      });
    },
    deleteClick(id) {
      this.$confirm("此操作将删除该运费模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTemplates(id).then(data => {
            if (data.data.status == 200) {
              this.$message({ type: "success", message: "删除成功" });
              this.selectByKwd("delete");
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    // 添加模板按钮
    toAddTemp() {
      this.$router.push({ name: "freightAdd" });
    },
    toAlterFreight(id) {
      this.$router.push({ name: "freightAlter", query: { id: id } });
    },
    selectByKwd(event) {
      getTemplatesList(this.searchName ? this.searchName : null).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
          event != "delete" && this.$message({ type: "success", message: "查询成功" });
        } else {
          this.$message.error("查询失败");
        }
      });
    },
    clearSearch() {
      this.searchName = "";
      this.showAll();
    },
    setView(data) {
      this.freightList = data.data.content;
    },
    showAll() {
      getTemplatesList().then(data => {
        this.setView(data);
      });
    }
  }
};
</script>

<style lang="less">
#freight_idx {
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
