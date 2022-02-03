<template>
  <div id="cityOperation_idx">
    <!-- 城市运营列表页 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">城市运营中心</span>
        <el-button plain size="small" @click="addCityOperation" icon="el-icon-plus">添加城市运营中心</el-button>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="请输入运营中心名称" v-model="searchInput" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <el-input
              placeholder="请输入联系人"
              v-model="searchContractName"
              @keyup.native.enter="selectByKwd"
              @blur="selectByKwd"
              class="input-with-select"
            ></el-input>
          </div>
          <div>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="cityoperationList" border style="width: 100%" row-key="id" @selection-change="getSelection" ref="cityoperationLists">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="logoImage" label="logo" align="center">
            <template slot-scope="scope" v-if="scope.row.logoImage">
              <Thumbnail :image="scope.row.logoImage" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="contractName" label="联系人" align="center"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="addressDetail" label="地址" align="center"></el-table-column>
          <el-table-column prop="sort" label="排序"></el-table-column>
          <el-table-column prop="createTime" label="添加时间" align="center"></el-table-column>
          <el-table-column prop="isDisplay" label="显示" align="center">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.isDisplay" activeText="显示" inactiveText="隐藏" @changeValue="(value)=>{changeStatus(scope.row.id,value)}"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="cityOperationEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteArticel(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <div>
            <el-select v-model="batchValue" placeholder="批量操作">
              <el-option v-for="(item,idx) in options" :key="idx" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
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
import switchCom from "../../components/switch";
import Thumbnail from "../../components/thumbnail";
import paginationCom from "../../components/paginationCom";
import { getBusinessCenterList, deleteBusinessCenter, isDisplayBusinessCenter } from "../../api/cityOperation";
export default {
  components: {
    switchCom,
    paginationCom,
    Thumbnail
  },
  data() {
    return {
      searchInput: "" /* 搜索的城市运营中心名称 */,
      searchContractName: "" /* 搜索的城市运营中心联系人 */,
      searchTime: [] /* 搜索过滤时间 */,
      startTime: null /* 搜索过滤开始时间 */,
      endTime: null /* 搜索过滤结束时间 */,
      batchValue: "" /* 批量操作的类型 */,
      options: [
        { label: "批量删除", value: "delete" },
        { label: "批量显示", value: "show", disabled: false },
        { label: "批量隐藏", value: "hide", disabled: false }
      ],
      cityoperationList: [] /* 城市运营中心数据列表 */,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      batchArr: [] /* 批量操作 id 数组 */
    };
  },
  watch: {
    // 监听搜索的时间
    searchTime: {
      handler() {
        if (this.searchTime && this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
          this.selectByKwd("search");
        } else {
          this.startTime = null;
          this.endTime = null;
          this.selectByKwd("search");
        }
      }
    }
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // switch开关状态
    changeStatus(id) {
      /* 改变状态 并重新请求 */
      this.batchArr.push(id);
      isDisplayBusinessCenter({ centerIds: this.batchArr }).then(data => {
        if (data.data.status == 0) {
          this.$message({
            message: "状态修改成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "状态修改失败",
            type: "error"
          });
        }
      });
    },
    // 编辑城市运营
    cityOperationEdit(rows) {
      this.$router.push({ name: "edit_CityOperation", query: { id: rows.id } });
    },
    // 发布城市运营
    addCityOperation() {
      this.$router.push({ name: "add_cityOperation" });
    },
    /* 批量操作 判断是什么操作 */
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些城市运营, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            deleteBusinessCenter({
              centerIds: this.batchArr
            }).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  message: "删除城市运营成功",
                  type: "success"
                });
                this.selectByKwd("get");
              } else {
                this.$message({
                  message: data.data.msg,
                  type: "error"
                });
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
        // 批量修改显示
      } else if (this.batchValue == "show") {
        isDisplayBusinessCenter({ centerIds: this.batchArr }).then(data => {
          if (data.data.status == 0) {
            this.$message({
              message: "状态修改成功",
              type: "success"
            });
            this.$router.go(0);
          } else {
            this.$message({
              message: data.data.msg,
              type: "error"
            });
          }
        });
      } else {
        // 批量修改为隐藏
        isDisplayBusinessCenter({ centerIds: this.batchArr }).then(data => {
          if (data.data.status == 0) {
            this.$message({
              message: "状态修改成功",
              type: "success"
            });
            this.$router.go(0);
          } else {
            this.$message.error(data.data.msg);
          }
        });
      }
    },
    /* 获取批量操作的id数组 */
    getSelection(val) {
      this.batchArr = []; /* 先置空 */
      val.forEach(item => {
        this.batchArr.push(item.id);
        if (item.isDisplay == 0) {
          this.options[2].disabled = true;
        } else {
          this.options[2].disabled = false;
          this.options[1].disabled = true;
        }
      });
    },
    /* 删除单个城市运营 */
    deleteArticel(rows) {
      this.batchArr.push(rows.id);
      this.$confirm("此操作将删除该城市运营, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 调接口 */
          deleteBusinessCenter({
            centerIds: this.batchArr
          }).then(data => {
            if (data.data.status == 0) {
              this.$message({
                message: "删除城市运营成功",
                type: "success"
              });
              this.selectByKwd("get");
            } else {
              this.$message({
                message: data.data.msg,
                type: "error"
              });
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
      this.searchContractName = "";
      this.searchTime = "";
      this.searchContractName = "";
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
      getBusinessCenterList({
        params: { pageNo: obj.page ? obj.page : 1, pageSize: 20 },
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          contractName: this.searchContractName == "" ? null : this.searchContractName,
          name: this.searchInput == "" ? null : this.searchInput
        }
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.cityoperationList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    // 获取最初返回是列表数据
    showAll(val) {
      getBusinessCenterList({ params: { pageNo: val ? val : 1, pageSize: 20 }, data: {} }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    }
  }
};
</script>

<style lang='less'>
#cityOperation_idx {
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
