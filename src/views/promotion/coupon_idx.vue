<template>
  <div id="coupon_idx">
    <!-- 优惠券列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">优惠券列表</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span class="s-size">优惠券名称:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="优惠券名称" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <span class="s-size">优惠券类型:</span>
          </div>
          <div class="search_box">
            <el-select v-model="searchType" @change="selectByKwd" clearable>
              <el-option label="注册赠券" :value="1"></el-option>
              <el-option label="购物赠券" :value="2"></el-option>
              <el-option label="全场赠券" :value="3"></el-option>
              <el-option label="会员赠券" :value="4"></el-option>
            </el-select>
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
              <el-button plain @click="addCoupon()" size="small">添加优惠券</el-button>
            </div>
          </div>
        </div>
        <el-table :data="couponList" border row-key="id" style="width: 100%">
          <!-- <el-table-column prop="id" label="ID" align="center" width="80"></el-table-column> -->
          <el-table-column prop="name" label="优惠券名称" align="center"></el-table-column>
          <el-table-column prop="couponCategory" align="center" label="优惠券类型">
            <template slot-scope="scope">
              <span v-if="scope.row.couponCategory==1">注册赠券</span>
              <span v-if="scope.row.couponCategory==2">购物赠券</span>
              <span v-if="scope.row.couponCategory==3">全场赠券</span>
              <span v-if="scope.row.couponCategory==4">会员赠券</span>
            </template>
          </el-table-column>
          <el-table-column prop="fullMoney" align="center" label="满(元)">
            <template slot-scope="scope">{{"¥"+(scope.row.fullMoney/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="price" align="center" label="减(元)">
            <template slot-scope="scope">{{"¥"+(scope.row.price/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column label="有效期" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.days">领取日起{{scope.row.days}}天</span>
              <span v-else>{{scope.row.startTime}}到{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quota" align="center" label="库存"></el-table-column>
          <el-table-column prop="appoint" align="center" label="可用于">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.appoint==1">指定商品</el-tag>
              <el-tag v-if="scope.row.appoint==2">指定商品分类</el-tag>
              <el-tag v-if="scope.row.appoint==3">全场</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="135">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="viewCoupon(scope.row)">查看</el-button>
                <el-button type="text" size="medium" @click="alterCoupon(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" @click="deleteCoupon(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
import paginationCom from "../../components/paginationCom";
import { getCouponList, deleteCouponById } from "../../api/promotion";
export default {
  data() {
    return {
      searchName: "" /* 优惠券名称 */,
      searchType: "" /* 优惠券类型 */,
      couponList: [
        // {
        //   id: "1",
        //   name: "可购买沙发保养服务" /* 优惠券名称 */,
        //   couponImg: "5e12ecf7a1a09a0baeb145fb" /* 优惠券图片地址 */,
        //   fullMoney: 29900 /* 优惠券金额满减 */,
        //   price: 3000 /* 优惠券金额单位到分 */,
        //   startTime: "2019-12-27 21:17:59" /* 优惠券开始时间 */,
        //   endTime: "2019-12-28 21:18:01" /* 优惠券结束时间 */,
        //   couponStatus: 1 /* 0无效 1有效 */,
        //   couponRemarks: "仅能使用沙发保养服务" /* 优惠券说明 */,
        //   quota: 20 /* 优惠券数量 */,
        //   couponCategory: 1 /* 1:注册赠券 2.购物赠券 3.全场赠券 4.会员赠券 */,
        //   type: 3 /* 优惠券类型 1满减券 2叠加满减券 3无门槛券(需要限制大小) */,
        //   appoint: 1 /* 可用于：1商品 2工人 3设计师 4家政 5全场 */,
        //   isDelete: 0 /* 是否删除 */
        // }
      ],
      total: 0 /* 总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    viewCoupon(row) {
      this.$router.push({ name: "coupon_view", query: { id: row.id } });
    },
    addCoupon() {
      this.$router.push({ name: "coupon_add" });
    },
    alterCoupon(rows) {
      this.$router.push({ name: "coupon_alter", query: { id: rows.id } });
    },
    deleteCoupon(row) {
      this.$confirm("此操作将删除该优惠券, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCouponById([row.id]).then(data => {
            if (data.data.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
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
    handleCurrentChange(val) {
      if (this.searchName != "" || this.searchType != "") {
        this.selectByKwd({ page: val });
      } else {
        this.showAll(val);
      }
    },
    selectByKwd(obj) {
      getCouponList({
        pageNo: obj.page ? obj.page : 1,
        pageSize: 20,
        name: this.searchName ? this.searchName : null,
        category: this.searchType ? this.searchType : null
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
          this.$message({
            type: "success",
            message: "搜索成功"
          });
        }
      });
    },
    showAll(val) {
      getCouponList({ pageNo: val ? val : 1, pageSize: 20 }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    setView(data) {
      this.couponList = data.data.content.data.list;
      this.total = data.data.content.CouponNum;
      this.cPage = data.data.content.CouponNo;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchName = "";
      this.searchType = "";
      this.showAll();
    }
  },
  components: { paginationCom }
};
</script>

<style lang='less'>
#coupon_idx {
  width: 100%;
  height: auto;

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
    .el-pagination {
      padding: 0;
      margin-top: 20px;
    }
  }
}
</style>
