<template>
  <div id="discount_idx">
    <!-- 活动 列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">活动列表</span>
        <el-button plain @click="addAdvert" size="small">添加活动</el-button>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="活动名称" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-select v-model="searchStatus" @change="selectByKwd" placeholder="广告位置" clearable>
              <el-option label="未开始" :value="0"></el-option>
              <el-option label="进行中" :value="0"></el-option>
              <el-option label="已结束" :value="1"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="discountList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="编号" width="135"></el-table-column>
          <el-table-column prop="name" label="活动名称"></el-table-column>
          <el-table-column prop="position" align="center" label="开始时间"></el-table-column>
          <el-table-column prop="imgFileId" align="center" label="结束时间"></el-table-column>
          <el-table-column label="上线/下线" align="center" width="100"></el-table-column>
          <el-table-column prop="clickNum" label="状态" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="viewDiscount(scope.row)">查看</el-button>
                <el-button type="text" size="medium" @click="alterDiscount(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" disabled @click="alterDiscount(scope.row)">发布到活动</el-button>
                <el-button type="text" size="medium" @click="deleteDiscount(scope.row)">删除</el-button>
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
import { getAdvertList } from "../../api/advert";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      batchArr: [] /* id 数组 */,
      batchValue: "" /* 批量操作的类型 */,
      options: [{ label: "批量删除", value: "delete" }] /* 批量操作的类型 */,
      searchName: null /* 活动名称 搜索 */,
      searchStatus: null /* 活动状态 搜索 */,
      discountList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 10 /* 单页数量 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 批量操作 */
    batchOperation() {
      if (this.batchValue == "delete") {
        this.deleteAd(this.batchArr);
      }
    },
    /* 批量操作id获取 */
    getSelection(val) {
      this.batchArr = []; /* 先置空 */
      val.forEach(item => {
        this.batchArr.push(item.id);
      });
    },
    /* 编辑活动 */
    alterAd(rows) {
      this.$router.push({ name: "ad_alter", params: { data: rows } });
    },
    /* 添加活动 */
    addAdvert() {
      this.$router.push({ name: "ad_add" });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchName != null || this.searchStatus != null) {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getAdvertList({
        pageNo: val.page || 1,
        name: this.searchName || null,
        position: this.searchStatus || null
      }).then(data => {
        if (data.data.state == "Success") {
          this.setView(data);
          this.$message({
            message: "已执行查询",
            type: "success"
          });
        }
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getAdvertList({ pageNo: val || 1 }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.discountList = data.data.content.list;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageNum;
      this.size = data.data.content.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchName = null;
      this.searchStatus = null;
      this.showAll();
    }
  },
  components: { paginationCom }
};
</script>

<style lang="less">
#discount_idx {
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
    
    .isOnline.el-tag {
      cursor: pointer;
    }

    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
