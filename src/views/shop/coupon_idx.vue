<template>
  <div id="coupon_idx">
    <!-- 优惠券列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">优惠券列表</span>
      </div>
      <div class="content">
        <div class="tool">
          <div class="filtrate">
            <el-button icon="el-icon-plus" type="primary" @click="addNewCoupon">新增</el-button>
          </div>
          <div class="search_box">
            <!-- <el-input
              :placeholder="(select=='不限'?'':'请输入'+select)"
              v-model="searchInput"
              class="input-with-select"
            >
            <el-select v-model="select" slot="prepend">-->
            <!-- 筛选的条件 默认为不限 -->
            <!-- <el-option
                  v-for="item in allSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>-->
          </div>
        </div>
        <el-table :data="couponList" border row-key="id" height="200" style="width: 100%">
          <el-table-column prop="id" label="ID" align="center" width="80"></el-table-column>
          <el-table-column prop="couponName" label="优惠券名称"></el-table-column>
          <!-- 优惠券logo -->
          <el-table-column prop="couponImg" align="center" label="优惠券LOGO" width="160">
            <template slot-scope="scope" v-if="scope.row.couponImg">
              <el-image :src="base+scope.row.couponImg" style=" height: 40px" :preview-src-list="(base+scope.row.couponImg).split(',')"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="couponRemarks" label="说明"></el-table-column>
          <el-table-column prop="couponStart" label="开始时间"></el-table-column>
          <el-table-column prop="couponEnd" label="结束时间"></el-table-column>
          <el-table-column prop="couponFullMoney" label="满(元)">
            <template slot-scope="scope">{{scope.row.couponFullMoney/100}}</template>
          </el-table-column>
          <el-table-column prop="couponPrice" label="减(元)">
            <template slot-scope="scope">{{scope.row.couponPrice/100}}</template>
          </el-table-column>
          <el-table-column prop="couponQuota" label="库存"></el-table-column>
          <el-table-column prop="couponType" align="center" label="类型" width="120">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.couponType==1" type="success">满减券</el-tag>
              <el-tag v-if="scope.row.couponType==2" type="warning">叠加满减券</el-tag>
              <el-tag v-if="scope.row.couponType==3" type="danger">无门槛券</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="couponUsed" align="center" label="可用于" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.couponUsed==1">商品</el-tag>
              <el-tag v-if="scope.row.couponUsed==2">工人</el-tag>
              <el-tag v-if="scope.row.couponUsed==3">设计师</el-tag>
              <el-tag v-if="scope.row.couponUsed==4">家政</el-tag>
              <el-tag v-if="scope.row.couponUsed==5">全场</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否有效" align="center" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.couponStatus" type="success">有效</el-tag>
              <el-tag v-else type="danger">无效</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="优惠券状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isDelete" type="danger">禁用</el-tag>
              <el-tag v-else type="success">启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="115">
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="alterCoupon(scope.row)"></el-button>
                </el-tooltip>
                <!-- 一开始没有删除功能 -->
                <el-tooltip v-if="scope.row.isDelete" effect="dark" content="启用" placement="top">
                  <el-button type="success" size="mini" icon="el-icon-open" @click="handleIsDelete({type:'up',row:scope.row})"></el-button>
                </el-tooltip>
                <el-tooltip v-else effect="dark" content="禁用" placement="top">
                  <el-button type="danger" size="mini" icon="el-icon-turn-off" @click="handleIsDelete({type:'down',row:scope.row})"></el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: "不限",
      maringLeft: { marginLeft: "10px" },
      searchInput: "",
      couponList: [
        {
          id: "1",
          couponName: "可购买沙发保养服务" /* 优惠券名称 */,
          couponImg: "5e12ecf7a1a09a0baeb145fb" /* 优惠券图片地址 */,
          couponFullMoney: 29900 /* 优惠券金额满减 */,
          couponPrice: 3000 /* 优惠券金额单位到分 */,
          couponStart: "2019-12-27 21:17:59" /* 优惠券开始时间 */,
          couponEnd: "2019-12-28 21:18:01" /* 优惠券结束时间 */,
          couponStatus: 1 /* 0无效 1有效 */,
          couponRemarks: "仅能使用沙发保养服务" /* 优惠券说明 */,
          couponQuota: 20 /* 优惠券数量 */,
          couponType: 3 /* 优惠券类型 1满减券 2叠加满减券 3无门槛券(需要限制大小) */,
          couponUsed: 1 /* 可用于：1商品 2工人 3设计师 4家政 5全场 */,
          isDelete: 0 /* 是否删除 */
        },
        {
          id: "2",
          couponName: "可购买台灯" /* 优惠券名称 */,
          couponImg: "5e12ecf9a1a09a0baeb14607" /* 优惠券图片地址 */,
          couponFullMoney: 20000 /* 优惠券金额满减 */,
          couponPrice: 2000 /* 优惠券金额单位到分 */,
          couponStart: "2019-11-20 21:20:42" /* 优惠券开始时间 */,
          couponEnd: "2019-12-27 21:20:45" /* 优惠券结束时间 */,
          couponStatus: 1 /* 0无效 1有效 */,
          couponRemarks: "用于xxx商家购买" /* 优惠券说明 */,
          couponQuota: 50 /* 优惠券数量 */,
          couponType: 1 /* 优惠券类型 1满减券 2叠加满减券 3无门槛券(需要限制大小) */,
          couponUsed: 1 /* 可用于：1商品 2工人 3设计师 4家政 5全场 */,
          isDelete: 0 /* 是否删除 */
        },
        {
          id: "3",
          couponName: "购买小说" /* 优惠券名称 */,
          couponImg: "5e12ec66a1a09a0baeb145f7" /* 优惠券图片地址 */,
          couponFullMoney: 50099 /* 优惠券金额满减 */,
          couponPrice: 7000 /* 优惠券金额单位到分 */,
          couponStart: "2019-12-03 21:22:07" /* 优惠券开始时间 */,
          couponEnd: "2019-12-27 21:22:10" /* 优惠券结束时间 */,
          couponStatus: 1 /* 0无效 1有效 */,
          couponRemarks: "可用于购买台灯" /* 优惠券说明 */,
          couponQuota: 100 /* 优惠券数量 */,
          couponType: 2 /* 优惠券类型 1满减券 2叠加满减券 3无门槛券(需要限制大小) */,
          couponUsed: 1 /* 可用于：1商品 2工人 3设计师 4家政 5全场 */,
          isDelete: 0 /* 是否删除 */
        }
      ],
      base: "" /* 图片链接开头 */
    };
  },
  mounted() {
    this.base = this.$store.state.base_url;
  },
  methods: {
    addNewCoupon() {
      this.$router.push({ name: "coupon_add" });
    },
    alterCoupon(rows) {
      this.$router.push({ name: "coupon_alter", params: { data: rows } });
    },
    selectToSearch() {
      console.log(this.statusSearch);
    },
    /* 状态的启用和禁用 */
    handleIsDelete(obj) {
      if (obj.type == "up") {
        obj.row.isDelete = 0;
        console.log("启用成功");
        /* 调用接口 */
      }
      if (obj.type == "down") {
        obj.row.isDelete = 1;
        console.log("禁用成功");
        /* 调用接口 */
      }
    }
  },
  components: {}
};
</script>

<style lang='less'>
#coupon_idx {
  width: 100%;
  height: auto;
  .el-image__inner {
    //有缩略图的加这个样式
    width: auto !important;
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
          // .el-button{
          //   margin-right: 10px;
          // }
          display: flex;
          align-items: center;
          width: auto;
          .el-select .el-input__inner {
            width: 110px; //搜索框宽度
          }
          .el-select:last-child {
            .el-input__inner {
              width: 140px; //搜索框宽度
            }
          }
        }
        .el-select .el-input__inner {
          width: 90px; //搜索框宽度
        }
        .el-input__inner {
          width: 120px;
          height: 37px;
        }
      }
      .el-pagination {
        padding: 0;
        margin-top: 20px;
      }
    }
  }
}
</style>
