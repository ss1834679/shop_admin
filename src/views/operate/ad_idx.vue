<template>
  <div id="advart_idx">
    <!-- 轮播图 (广告) 列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">广告列表</span>
        <el-button plain @click="addAdvert" size="small">新增广告</el-button>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="广告名称" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-select v-model="searchPosition" @change="selectByKwd" placeholder="广告位置" clearable>
              <el-option v-for="item in position" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <el-date-picker v-model="searchDate" type="date" value-format="yyyy-MM-dd" @change="selectByKwd" placeholder="过期时间"></el-date-picker>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="adList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="编号" width="135"></el-table-column>
          <el-table-column prop="name" label="广告名称"></el-table-column>
          <el-table-column prop="position" align="center" label="广告位置" width="135"></el-table-column>
          <el-table-column prop="imgFileId" align="center" label="广告图片" width="160">
            <template slot-scope="scope" v-if="scope.row.imgFileId">
              <Thumbnail :image="scope.row.imgFileId" />
            </template>
          </el-table-column>
          <el-table-column label="时间" width="230">
            <template slot-scope="scope">
              <div>
                <span>{{"开始时间："+scope.row.startTime}}</span>
              </div>
              <div>
                <span>{{"结束时间："+scope.row.invalidTime}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="上线/下线" align="center" width="100" class="isOnline">
            <template slot-scope="scope">
              <el-tag class="isOnline" v-if="scope.row.isOnline==1" @click="changeIsOnline(0,scope.row)" type="danger">点击下线</el-tag>
              <el-tag class="isOnline" v-if="scope.row.isOnline==0" @click="changeIsOnline(1,scope.row)">点击上线</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="clickNum" label="点击次数"></el-table-column>
          <el-table-column prop="generateOrderNum" label="生成订单"></el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterAd(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.isTop==0" type="text" size="medium" @click="changeIsTop(1,scope.row)">置顶</el-button>
                <el-button v-else type="text" size="medium" @click="changeIsTop(0,scope.row)">取消置顶</el-button>
                <el-button type="text" size="medium" @click="deleteAd(scope.row)">删除</el-button>
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
import { getAdvertList, deleteAdvert, editIsonline, editIstop } from "../../api/advert";
import Thumbnail from "../../components/thumbnail";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      batchArr: [] /* id 数组 */,
      batchValue: "" /* 批量操作的类型 */,
      options: [{ label: "批量删除", value: "delete" }] /* 批量操作的类型 */,
      searchName: null /* 服务单id 搜索 */,
      searchPosition: null /* 广告位置 搜索 */,
      searchDate: "" /* 时间搜索 */,
      position: [
        { label: "APP首页轮播", value: "APP首页轮播" },
        { label: "APP一级分类1", value: "APP一级分类1" },
        { label: "APP一级分类2", value: "APP一级分类2" },
        { label: "APP一级分类3", value: "APP一级分类3" },
        { label: "APP一级分类4", value: "APP一级分类4" },
        { label: "APP一级分类5", value: "APP一级分类5" },
        { label: "APP一级分类6", value: "APP一级分类6" },
        { label: "APP一级分类7", value: "APP一级分类7" },
        { label: "APP一级分类8", value: "APP一级分类8" },
        { label: "APP一级分类9", value: "APP一级分类9" },
        { label: "APP一级分类10", value: "APP一级分类10" },
        { label: "APP一级分类11", value: "APP一级分类11" },
        { label: "APP一级分类12", value: "APP一级分类12" },
        { label: "APP二级页面分类", value: "APP二级页面分类" },
        { label: "APP二级页面品牌", value: "APP二级页面品牌" },
        { label: "APP涂邦资讯广告位", value: "APP涂邦资讯广告位" },
        { label: "APP涂邦资讯视频位", value: "APP涂邦资讯视频位" },
        { label: "APP圈子页面广告位", value: "APP圈子页面广告位" },
        { label: "APP品牌特卖广告位", value: "APP品牌特卖广告位" },
        { label: "APP团购页面广告位", value: "APP团购页面广告位" },
        { label: "新版设计师主页轮播图", value: "新版设计师主页轮播图" }
      ] /* 广告位置 */,
      adList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 10 /* 单页数量 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 删除广告 */
    deleteAd(obj) {
      this.$confirm("此操作将删除该广告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids;
          if (obj instanceof Array) {
            /* 批量删除 */
            ids = obj;
          } else {
            /* 单个删除 */
            ids = obj.id.split(",");
          }
          deleteAdvert({ ids: ids }).then(data => {
            if (data.data.state == "Success") {
              this.selectByKwd();
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
    /* 编辑广告 */
    alterAd(rows) {
      this.$router.push({ name: "ad_alter", query: { id: rows.id } });
    },
    /* 添加广告 */
    addAdvert() {
      this.$router.push({ name: "ad_add" });
    },
    /* 设置上线下线 */
    changeIsOnline(value, rows) {
      editIsonline({ id: rows.id, isOnline: value }).then(data => {
        if (data.data.state == "Success") {
          this.selectByKwd("", "online");
        }
      });
    },
    /* 设置置顶 */
    changeIsTop(istop, row) {
      editIstop({ id: row.id, isTop: istop }).then(data => {
        if (data.data.status == 200) {
          this.$message({ message: "设置成功", type: "success" });
          this.selectByKwd("", "istop");
        }
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchDate != "" || this.searchName != "" || this.searchPosition != "") {
        //执行查询中的分页
        this.selectByKwd(val);
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val, type) {
      getAdvertList({
        pageNo: Number.isInteger(val) ? val : 1,
        invalidTime: this.searchDate == "" ? null : this.searchDate,
        name: this.searchName == "" ? null : this.searchName,
        position: this.searchPosition == "" ? null : this.searchPosition
      }).then(data => {
        if (data.data.state == "Success") {
          this.setView(data);
          !type && this.$message({ message: "已执行查询", type: "success" });
        }
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getAdvertList({ pageNo: Number.isInteger(val) ? val : 1 }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.adList = data.data.content.list;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageNum;
      this.size = data.data.content.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchName = "";
      this.searchPosition = "";
      this.searchDate = "";
      this.showAll();
    }
  },
  components: { paginationCom, Thumbnail }
};
</script>

<style lang="less">
#advart_idx {
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
