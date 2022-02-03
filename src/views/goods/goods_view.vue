<template>
  <div id="good_veiw">
    <!-- 商品的添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <span class="title">商品详情</span>
        </div>
      </div>
      <div class="content">
        <el-form label-width="100px">
          <el-form-item label="商品ID">{{goodsform.goodsId}}</el-form-item>
          <el-form-item label="所属分类">{{goodsform.categoryOneName}}/{{goodsform.categoryTwoName}}/{{goodsform.categoryThreeName}}</el-form-item>
          <el-form-item label="商品标题">{{goodsform.goodsTitle}}</el-form-item>
          <el-form-item label="商品副标题">{{goodsform.goodsSubtitle}}</el-form-item>
          <el-form-item label="商品状态">
            <span v-if="goodsform.goodsStatus==0">已下架</span>
            <span v-if="goodsform.goodsStatus==1">已上架</span>
            <span v-if="goodsform.goodsStatus==2">待审核</span>
            <span v-if="goodsform.goodsStatus==-1">未通过</span>
          </el-form-item>
          <el-form-item label="所属店铺">{{goodsform.supplierName}}</el-form-item>
          <el-form-item label="所属品牌">{{goodsform.brandName}}</el-form-item>
          <!-- <el-form-item label="优惠卷">
          <el-select class="discount" v-model="goodsform.discountId" multiple placeholder="请选择">-->
          <!-- 这里为优惠卷列表 discountList 后台获取 -->
          <!-- <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
          </el-form-item>-->
          <el-form-item label="排序">{{goodsform.goodsWeight}}</el-form-item>

          <el-form-item label="默认sku价格">{{"¥"+(goodsform.goodsPrice/100).toFixed(2)}}</el-form-item>
          <!-- <el-form-item label="销售量">{{goodsform.saleNum}}</el-form-item> -->
          <el-form-item label="商品评分">{{goodsform.goodsScore}}</el-form-item>
          <el-form-item label="好评度">{{goodsform.commentProportion}}</el-form-item>
          <el-form-item label="评论数量">{{goodsform.goodsComment}}</el-form-item>
          <el-form-item label="关注数量">{{goodsform.goodsFollow}}</el-form-item>
          <el-form-item label="是否为礼包">
            <span v-if="goodsform.isGift">是</span>
            <span v-else>否</span>
          </el-form-item>
          <el-form-item prop="isDistribute" label="订单分发">
            <span v-if="goodsform.isDistribute==0">不分发</span>
            <span v-else>分发</span>
          </el-form-item>

          <el-form-item label="封面图片" class="imgItem">
            <Thumbnail v-if="goodsform.goodsImage!=''" :image="goodsform.goodsImage" :h="200" :w="200" />
          </el-form-item>
          <el-form-item label="幻灯片" class="imgItem">
            <div class="imgbox">
              <Thumbnail v-for="(item,index) in goodsform.goodsImages" :key="index" :image="item.imageUrl" :h="200" :w="200" />
            </div>
          </el-form-item>
          <el-form-item label="详情" class="detailsItem">
            <div>
              <div id="mobileDetails">
                <div class="bigcontent">
                  <div class="detcontent">
                    <div class="scollConten" v-html="goodsform.goodsDesc.descContent"></div>
                  </div>
                </div>
              </div>
              <div class="scollConten" v-html="goodsform.goodsDesc.descContent"></div>
            </div>
          </el-form-item>
          <el-form-item label="商品规格" class="optionalItem">
            <auto-view
              v-if="showTable"
              :isRetailStore="goodsform.isRetailStore"
              type="plain"
              :paramNameArr="goodsform.specOptionals.specParamVOs"
              :optionValues="optionValues"
              :goodsItemList="goodsform.specOptionals.goodsItemVOS"
            ></auto-view>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import Thumbnail from "../../components/thumbnail";
import autoView from "../../components/autoTableView";
import { getGood } from "../../api/good";
export default {
  data() {
    return {
      goodsform: {
        goodsId: "",
        goodsTitle: "" /* 商品标题 √*/,
        goodsSubtitle: "" /* 简介  √*/,
        goodsStatus: null /* 商品状态 0 下架 1 上架 2 待审核 -1 未通过√ */,
        goodsWeight: null /* 商品排序值 √*/,
        brandName: "",
        categoryOneName: "",
        categoryTwoName: "",
        supplierName: "",
        categoryThreeName: "",
        brandId: "" /* 品牌ID,品牌名称 √*/,
        categoryOne: "" /* 一级分类id */,
        categoryTwo: "" /* 二级分类id */,
        categoryThree: "" /* 三级分类id */,
        saleNum: 1 /* 销售量 √*/,
        supplierId: "" /* 供应商ID,名称 √*/,
        goodsScore: 5.0 /* 商品评分 √*/,
        goodsComment: 0 /* 评论数量 √*/,
        goodsFollow: 0 /* 关注数 √*/,
        commentProportion: 1 /* 好评度 */,
        isDistribute: 0 /* 是否需要分发订单 */,
        // afterSaleId: [] /* 售后服务的数组 √*/,
        // discountId: [] /* 优惠卷活动的数组 √*/,
        goodsImage: "" /* 商品主图√ */,
        goodsImages: [] /* 轮播图 */,
        goodsPrice: 12356 /* 默认SKU商品价格 */,
        isGift: 0 /* 是否为礼包产品 */,
        goodsDesc: {
          descSort: 0,
          descContent: ""
        },
        goodsSpecCurrencyVOS: [] /* 只可看的规格组 √*/,
        specOptionals: {
          specGroupVOS: [
            {
              goodsId: "",
              groupName: "规格参数",
              specParamVOS: [
                {
                  isDisplay: 1,
                  isSearch: 1,
                  specGroupId: "",
                  specParamId: "",
                  specParamName: ""
                }
              ]
            }
          ],
          goodsItemVOS: []
        } /* 可选的规格组 √*/
      },
      showTable: false /* 刷新table */,
      optionValues: [] /* 规格值数组中间变量 */
    };
  },
  beforeMount() {
    getGood({ goodsId: this.$route.query.id }).then(data => {
      if (data.data.status == 0) {
        this.goodsform = data.data.data;
        /* 规格值获取 去重 */
        if (Array.isArray(this.goodsform.specOptionals.specParamVOs)) {
          this.goodsform.specOptionals.specParamVOs.forEach(item => {
            this.optionValues.push(item.specOptionalValue);
          });
          if (this.optionValues.length == 0) {
            this.optionValues.push([]);
          }
        }
      }
    });
  },
  watch: {
    goodsform: {
      handler() {
        this.refreshTable();
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    /* 刷新 */
    refreshTable() {
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
      });
    }
  },
  components: {
    autoView /* 规格 */,
    Thumbnail
  }
};
</script>

<style lang='less' scoped>
#good_veiw {
  .box-card {
    height: 100%;
  }

  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        margin-left: 20px;
        width: 100%;
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      text-align: left;
      .el-form {
        .el-form-item {
          margin: 0;
          .el-form-item__label {
            border-left: 1px solid #ebeef5;
            border-top: 1px solid #ebeef5;
            background-color: #f9fafc;
          }
          .el-form-item__content {
            padding-left: 20px;
            border-left: 1px solid #ebeef5;
            border-right: 1px solid #ebeef5;
            border-top: 1px solid #ebeef5;
            display: flex;
            align-items: center;
            #autoTable {
              width: 100%;
            }
          }
        }
        .el-form-item.imgItem {
          .el-form-item__label {
            height: 210px;
            line-height: 210px;
          }
          .el-form-item__content {
            height: 210px;
            overflow-x: scroll;
            overflow-y: hidden;
            .imgbox {
              height: 100%;
              width: 2000px;
              display: flex;
              justify-content: flex-start;
              .el-image {
                margin-right: 15px;
              }
            }
          }
        }
        .el-form-item.detailsItem {
          .el-form-item__label {
            height: 585px;
            line-height: 585px;
          }
        }
        .el-form-item.optionalItem {
          .el-form-item__content {
            padding: 0;
          }
        }
        #mobileDetails {
          background: url("../../../public/img/phone.png") no-repeat center;
          background-size: 100% 100%;
          width: 298px;
          height: 583px;
          position: relative;
          .bigcontent {
            position: absolute;
            top: 65px;
            left: 20px;
            width: 258px;
            height: 451px;
            overflow: hidden;
            .detcontent {
              width: 275px;
              height: 451px;
              overflow-y: scroll;
              .scollConten {
                width: 100%;
                max-width: 800px;
              }
            }
          }
        }
      }
      .scollConten {
        width: 100%;
        max-width: 800px;
      }
      .discount .el-input__inner {
        width: 500px; //搜索框宽度
      }
      .afterSale .el-input__inner {
        width: 600px; /* 搜索框宽度 */
      }
    }
  }
}
</style>
