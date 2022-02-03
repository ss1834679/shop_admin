<template>
  <div id="goods_idx">
    <!-- 商品列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">商品列表</span>
      </div>
      <div class="content">
        <div class="tool">
          <div class="filtrate">
            <el-button icon="el-icon-plus" type="primary" @click="addNewGoods">新增</el-button>
            <el-select :style="maringLeft" v-model="statusSearch" placeholder="请选择" @change="selectToSearch">
              <el-option v-for="item in statusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select :style="maringLeft" v-model="classSearch" placeholder="请选择" @change="selectToSearch">
              <el-option v-for="item in classSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select :style="maringLeft" v-model="msStatusSearch" placeholder="请选择" @change="selectToSearch">
              <el-option v-for="item in msStatusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <el-input :placeholder="(select=='不限'?'':'请输入'+select)" v-model="searchInput" class="input-with-select">
              <el-select v-model="select" slot="prepend">
                <!-- 筛选的条件 默认为不限 -->
                <el-option v-for="item in allSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </div>
        <el-table :data="goodsList" border height="200" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column label="店铺">
            <template slot-scope="scope">{{scope.row.supplierId.split(',')[1]}}</template>
          </el-table-column>
          <el-table-column prop="goodsTitle" label="名称" width="280"></el-table-column>
          <el-table-column label="分类">
            <template slot-scope="scope">{{scope.row.categoryId.split(',')[3]}}</template>
          </el-table-column>
          <el-table-column label="品牌">
            <template slot-scope="scope">{{scope.row.brandId.split(',')[1]}}</template>
          </el-table-column>
          <el-table-column prop="goodsPrice" label="价格(元)" width="100">
            <template slot-scope="scope">{{"¥"+(scope.row.goodsPrice/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="goodsWeight" label="权重"></el-table-column>
          <el-table-column prop="isDelete" label="商品状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isDelete" type="danger">禁用</el-tag>
              <el-tag v-else type="success">启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="155">
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="预览" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-view"></el-button>
                  <!-- 预览 -->
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="alterGoods(scope.row)"></el-button>
                </el-tooltip>
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
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10,30, 50, 70]"
          :page-size="10"
          layout="sizes, prev, pager, next"
          :total="1189"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: "不限",
      statusSearch: "全部状态",
      classSearch: "全部类型",
      msStatusSearch: "全部秒杀状态",
      statusSelect: [
        { value: "全部状态", label: "全部状态" },
        { value: "上架", label: "上架" },
        { value: "下架", label: "下架" }
      ],
      classSelect: [
        { value: "全部类型", label: "全部类型" },
        { value: "普通", label: "普通" },
        { value: "秒杀", label: "秒杀" },
        { value: "拼团", label: "拼团" },
        { value: "积分", label: "积分" }
      ],
      msStatusSelect: [
        { value: "全部秒杀状态", label: "全部秒杀状态" },
        { value: "未审核", label: "未审核" },
        { value: "审核通过", label: "审核通过" },
        { value: "审核不通过", label: "审核不通过" }
      ],
      allSelect: [
        { value: "不限", label: "不限" },
        { value: "名称", label: "名称" },
        { value: "店铺", label: "店铺" },
        { value: "分类", label: "分类" },
        { value: "品牌", label: "品牌" }
      ],
      maringLeft: { marginLeft: "10px" },
      searchInput: "",
      goodsList: [
        {
          id: "1241" /* 商品id  修改则有  添加则无  */,
          goodsTitle: "这是一个商品" /* 商品标题 √*/,
          goodsSubtitle: "" /* 简介  √*/,
          goodsStatus: 1 /* 商品状态，0代表下架，1代表上架，2代表待审核 √ */,
          goodsWeight: 0 /* 商品权重值 √*/,
          brandId: "12314,华帝" /* 品牌ID , 品牌名称 */,
          /* 一级分类id,二级分类id,三级分类id √*/
          categoryId: "123,124,345,沙发",
          /* 供货商ID,名称 */
          supplierId: "12qf252,重庆永川五洲店",
          goodsPrice: 6134 /* 默认价格 */,
          saleNum: 1 /* 销售量 √*/,
          goodsScore: 5.0 /* 商品评分 √*/,
          goodsComment: 0 /* 评论数量 √*/,
          goodsFollow: 0 /* 关注数 √*/,
          afterSaleId: [] /* 售后服务的数组 √*/,
          discountId: [] /* 优惠活动的数组 √*/,
          goodsImage: "" /* 商品主图√ */,
          goodsImages: {
            imageType: 0,
            imageUrl: "5e12ecf9a1a09a0baeb14607,5e12ecf7a1a09a0baeb145fb,5e12ec66a1a09a0baeb145f7" /*商品主图和幻灯片√*/
          },
          goodsSeckill: {
            seckillStart: "2020-01-15 00:02:02" /*开始时间√*/,
            seckillEnd: "2020-01-31 02:02:02" /*结束时间√*/,
            seckillPrice: 10000 /* 秒杀价格√ */,
            seckillNum: 10 /* 秒杀数量  秒杀则有  不秒杀则为0 √*/
          },
          isGift: 1,
          descUrl: "" /* 商品详情的富文本√ */,
          goodsSpecCurrency: [
            {
              groupName: "基本信息",
              specParams: [
                { specParamName: "上市月份", specCurrencyValue: "2019" },
                { specParamName: "净含量", specCurrencyValue: "50kg" }
              ]
            },
            {
              groupName: "产品外观",
              specParams: [
                { specParamName: "颜色", specCurrencyValue: "红色" },
                { specParamName: "尺寸", specCurrencyValue: "1米" }
              ]
            }
          ] /* 只可看的规格组 √*/,
          goodsSpecOptional: {
            goodsGroupSpecParmList: [
              {
                groupName: "内存容量",
                specParam: ["64GB"]
              }
            ],
            goodsItemList: [
              {
                goodsOptional: {
                  specOptionalValue: ["64GB", "4英寸", "磨砂黑"]
                },
                goodsItem: {
                  img: "" /* 商品图片  选择规格之后的图片 */,
                  itemCore: "124fsw" /* 编码 */,
                  itemTitle: "af w234" /* 商品标题 */,
                  itemPrice: 0 /* 商品价格 */,
                  itemNum: "afa " /* 商品库存 */,
                  /* 礼包内的商品个数 (可以直接购买的商品)选项 */
                  giftDetails: [{ itemId: "", itemNum: 0 }]
                }
              }
            ]
          } /* 可选的规格组 √*/,
          isDelete: 0
        }
      ],
      supplierList: []
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    addNewGoods() {
      this.$router.push({ name: "goods_add" });
    },
    alterGoods(rows) {
      this.$router.push({ name: "goods_alter", params: { data: rows } });
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
#goods_idx {
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
