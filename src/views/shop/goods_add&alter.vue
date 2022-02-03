<template>
  <div id="addAlter">
    <!-- 商品的添加和修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.params.data">修改商品</span>
          <span class="title" v-else>添加商品</span>
        </div>
      </div>
      <div class="content">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="选择商品分类"></el-step>
          <el-step title="填写商品信息"></el-step>
          <el-step title="填写商品属性/规格"></el-step>
          <el-step title="选择商品关联"></el-step>
        </el-steps>
        <el-form :model="goodsform" ref="goodsform" label-width="100px" class="demo-ruleForm">
          <!-- <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">-->
          <div class="steps" v-if="active==0">
            <el-form-item label="所属分类" class="cascader">
              <el-cascader ref="categoryList" placeholder="请选择分类" v-model="categoryIds" :props="props" :options="categoryList"></el-cascader>
            </el-form-item>
          </div>
          <div class="steps" v-if="active==1">
            <el-form-item label="商品标题">
              <el-input v-model="goodsform.goodsTitle"></el-input>
            </el-form-item>
            <el-form-item label="商品副标题(简介)">
              <el-input v-model="goodsform.goodsSubtitle"></el-input>
            </el-form-item>
            <el-form-item prop="goodsStatus" label="商品状态">
              <el-radio-group v-model="goodsform.goodsStatus">
                <el-radio :label="0">下架</el-radio>
                <el-radio :label="1">上架</el-radio>
                <el-radio :label="2">待审核</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="所属店铺">
              <el-select v-model="goodsform.supplierId" filterable placeholder="请选择店铺(可搜索)">
                <!-- 这里应该是 supplierList 后台获取 -->
                <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属品牌">
              <!-- <el-input v-model="goodsform.brandId"></el-input> -->
              <el-select v-model="goodsform.brandId" filterable placeholder="请选择品牌(可搜索)">
                <!-- 后台获取 -->
                <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优惠卷">
              <el-select class="discount" v-model="goodsform.discountId" multiple placeholder="请选择">
                <!-- 这里为优惠卷列表 discountList 后台获取 -->
                <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权重">
              <el-input v-model.number="goodsform.goodsWeight"></el-input>
            </el-form-item>
            <el-form-item label="销售量">
              <el-input v-model.number="goodsform.saleNum"></el-input>
            </el-form-item>
            <el-form-item label="商品评分">
              <el-input v-model="goodsform.goodsScore"></el-input>
            </el-form-item>
            <el-form-item label="评论数量">
              <el-input v-model.number="goodsform.goodsComment"></el-input>
            </el-form-item>
            <el-form-item label="关注数量">
              <el-input v-model.number="goodsform.goodsFollow"></el-input>
            </el-form-item>
            <!-- </el-tab-pane> -->
            <!-- <el-tab-pane label="商品信息" name="second"> -->
            <el-form-item label="封面图片">
              {{goodsform.goodsImage}}
              <upload-img
                @getimgArr="(imgarr)=>{this.goodsform.goodsImage = imgarr}"
                :imgArr="this.goodsform.goodsImage"
                :limit="1"
                :notMultiple="true"
              ></upload-img>
            </el-form-item>
            {{goodsform.goodsImages.imageUrl}}
            <el-form-item label="幻灯片">
              <upload-img
                @getimgArr="(imgarr)=>{this.goodsform.goodsImages.imageUrl = imgarr}"
                :imgArr="this.goodsform.goodsImages.imageUrl"
                :limit="6"
              ></upload-img>
            </el-form-item>
            <el-form-item label="详情">
              <wang-editor :value="goodsform.descUrl" @getHtmlFromWang="getHtmlFromWang"></wang-editor>
            </el-form-item>
            <el-form-item label="是否为礼包">
              <el-switch v-model="goodsform.isGift" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="售后服务">
              <el-select v-model="goodsform.afterSaleId" class="afterSale" multiple placeholder="请选择售后服务">
                <!-- 这个列表为 afterSaleList 后台获取 -->
                <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="steps" v-if="active==2">
            <el-form-item label="添加商品属性">
              <!-- <template v-for="(item,i) in goodsform.goodsSpecCurrency"> -->
              <template v-for="item in goodsform.specCurrency">
                <div :key="item.specParams.specCurrencyValue">
                  <!-- <div class="tableHead">
                    <el-input class="groupName" v-model="item.groupName" placeholder="规格组名称"></el-input>
                    <span>{{item.groupName}}</span>
                    <el-tooltip effect="light" content="添加新规格组" placement="top-end">
                      <el-button
                        v-if="i==goodsform.goodsSpecCurrency.length-1"
                        type="primary"
                        icon="el-icon-plus"
                        @click="addCurrencyGroup()"
                        size="mini"
                        circle
                      ></el-button>
                    </el-tooltip>

                    <el-tooltip effect="light" content="删除规格组" placement="right">
                      <el-button
                        v-if="goodsform.goodsSpecCurrency.length-1!=0"
                        type="danger"
                        icon="el-icon-close"
                        @click="delteCurrencyGroup(i)"
                        size="mini"
                        circle
                      ></el-button>
                    </el-tooltip>
                  </div>-->
                  <el-table v-if="showTable" :data="item.specParams" :show-header="false" style="width: 100%">
                    <el-table-column prop="specParamName">
                      <!-- <template slot-scope="scope">
                        <el-input class="specParamName" v-model="scope.row.specParamName" placeholder="规格参数名"></el-input>
                      </template>-->
                    </el-table-column>
                    <el-table-column prop="specCurrencyValue">
                      <template slot-scope="scope">
                        <el-input class="specCurrencyValue" v-model="scope.row.specCurrencyValue" placeholder="属性值"></el-input>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column>
                      <template slot-scope="scope">
                        <el-button
                          v-if="item.specParams.length-1!=0"
                          type="danger"
                          @click="delteSpec(i,scope.$index)"
                          icon="el-icon-close"
                          size="mini"
                          circle
                        ></el-button>
                        <el-button
                          v-if="scope.$index==item.specParams.length-1"
                          type="primary"
                          icon="el-icon-plus"
                          @click="addSpec(i)"
                          size="mini"
                          circle
                        ></el-button>
                      </template>
                    </el-table-column>-->
                  </el-table>
                </div>
              </template>
            </el-form-item>
            <el-form-item label="编辑规格">
              <el-table v-if="showTable" :data="goodsform.goodsSpecOptional.goodsGroupSpecParmList" style="width: 100%">
                <el-table-column prop="groupName" label="规格名称" width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.groupName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="specParam" label="规格值">
                  <template slot-scope="scope">
                    <!-- 组件引用 -->
                    <tag-add :arrData="scope.row.specParam" @getArrData="(arr)=>{scope.row.specParam=arr;refreshTag()}"></tag-add>
                  </template>
                </el-table-column>
                <el-table-column label="添加/删除规格组" width="180">
                  <template slot-scope="scope">
                    <el-button
                      v-if="goodsform.goodsSpecOptional.goodsGroupSpecParmList.length-1!=0"
                      type="danger"
                      @click="delteGroup(scope.$index)"
                      icon="el-icon-close"
                      size="mini"
                      circle
                    ></el-button>
                    <el-button
                      v-if="scope.$index==goodsform.goodsSpecOptional.goodsGroupSpecParmList.length-1"
                      type="primary"
                      icon="el-icon-plus"
                      @click="addGroup()"
                      size="mini"
                      circle
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-table :data="placeform">
                <el-table-column label="批量填充标题(所有的数据建议在规格值和规格组确认之后再填写)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.placeTitle" placeholder="批量填充标题"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="批量填充库存">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.placeNum" placeholder="批量填充标题"></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <auto-table
                v-if="showTag"
                :placeTitle="placeform[0].placeTitle"
                :placeNum="placeform[0].placeNum"
                :goodsGroupSpecParmList="goodsform.goodsSpecOptional.goodsGroupSpecParmList"
                :goodsItemList="goodsform.goodsSpecOptional.goodsItemList"
                @getItemList="({list})=>{goodsform.goodsSpecOptional.goodsItemList = list}"
              ></auto-table>
            </el-form-item>
          </div>
          <div class="steps" v-if="active==3">
            <span>暂无参数</span>
          </div>
        </el-form>
        <div class="gosteps">
          {{active}}
          <el-button type="success" v-if="active!=0" plain @click="goSteps('prev')">上一步</el-button>
          <el-button type="success" v-if="active!=3" @click="goSteps('next')">下一步</el-button>
          <el-button type="success" v-if="active==3" @click="submitForm">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import wangEditor from "../../components/wangEditor";
import uploadImg from "../../components/uploadImg";
import tagAdd from "../../components/tags";
import autoTable from "../../components/autoTable";
import { getCategory } from "../../api/category";

export default {
  data() {
    return {
      va: [3, 8, 12],
      goodsform: {
        id: "" /* 商品id  修改则有  添加则无  */,
        goodsTitle: "" /* 商品标题 √*/,
        goodsSubtitle: "" /* 简介  √*/,
        goodsStatus: 1 /* 商品状态，0代表下架，1代表上架，2代表待审核 √ */,
        goodsWeight: 0 /* 商品权重值 √*/,
        brandId: "231" /* 品牌ID,品牌名称 √*/,
        categoryOne: "" /* 一级分类id */,
        categoryTwo: "" /* 二级分类id */,
        categoryThree: "" /* 三级分类id */,
        saleNum: 1 /* 销售量 √*/,
        supplierId: "3411" /* 供应商ID,名称 √*/,
        goodsScore: 5.0 /* 商品评分 √*/,
        goodsComment: 0 /* 评论数量 √*/,
        goodsFollow: 0 /* 关注数 √*/,
        afterSaleId: [] /* 售后服务的数组 √*/,
        discountId: [] /* 优惠卷活动的数组 √*/,
        goodsImage: "" /* 商品主图√ */,
        goodsImages: {
          imageType: 0,
          imageUrl: "5e12ecf9a1a09a0baeb14607,5e12ecf7a1a09a0baeb145fb,5e12ec66a1a09a0baeb145f7" /*商品主图和幻灯片√*/
        },
        goodsSeckill: {
          seckillStart: "" /*开始时间√*/,
          seckillEnd: "" /*结束时间√*/,
          seckillPrice: 0 /* 秒杀价格√ */,
          seckillNum: 0 /* 秒杀数量  秒杀则有  不秒杀则为0 √*/
        },
        isGift: 0 /* 是否为礼包产品 */,
        descUrl: "" /* 商品详情的富文本√ */,
        specCurrency: [
          {
            groupName: "基本信息",
            specParams: [
              { specParamId: "12314", specParamName: "上市月份", specCurrencyValue: "2019" },
              { specParamId: "1234", specParamName: "净含量", specCurrencyValue: "50kg" }
            ]
          }
        ] /* 只可看的规格组 √*/,
        goodsSpecOptional: {
          goodsGroupSpecParmList: [
            {
              groupName: "内存容量",
              specParam: ["64GB", "128GB"]
            }
          ],
          goodsItemList: [
            {
              goodsOptional: {
                specOptionalValue: ["64GB"]
              },
              goodsItem: {
                itemId: "123" /* 添加编辑时无 请求时有 */,
                img: "" /* 商品图片  选择规格之后的图片 */,
                itemCore: "124fsw" /* 编码 */,
                itemTitle: "af w234" /* 商品标题 */,
                itemPrice: 0.0 /* 商品价格 */,
                itemNum: "afa " /* 商品库存 */,
                /* 礼包内的商品个数 (可以直接购买的商品)选项 */
                giftDetails: [
                  {
                    /* 修改添加的时候没有详细 从后台请求数据的时候有这个 itemId 的所有信息 */
                    itemId: "" /* 规格id */,
                    itemNum: 0 /* 规格数量 */
                  }
                ]
              }
            },
            {
              goodsOptional: {
                specOptionalValue: ["128GB"]
              },
              goodsItem: {
                itemId: "123" /* 添加编辑时无 请求时有 */,
                img: "" /* 商品图片  选择规格之后的图片 */,
                itemCore: "124fsw" /* 编码 */,
                itemTitle: "af w234" /* 商品标题 */,
                itemPrice: 0.0 /* 商品价格 */,
                itemNum: "afa " /* 商品库存 */,
                /* 礼包内的商品个数 (可以直接购买的商品)选项 */
                giftDetails: [
                  {
                    /* 修改添加的时候没有详细 从后台请求数据的时候有这个 itemId 的所有信息 */
                    itemId: "" /* 规格id */,
                    itemNum: 0 /* 规格数量 */
                  }
                ]
              }
            }
          ]
        } /* 可选的规格组 √*/
      },
      activeName: "first" /* tabs激活变量 */,
      active: 0 /* 步骤 */,
      props: {
        value: "id",
        label: "categoryName",
        checkStrictly: true /* 子父不关联 */,
        disabled: "isParent" /* 只能选择三级 */,
        children: "childList"
      } /* 级联选择配置 */,
      timeRange: [] /* 时间范围 传后台时需要分别去取 */,
      categoryIds: ["1214083248787873794", "1214083248846594049", "1214083248854982658"],
      showTable: true /* 刷新table */,
      showTag: true,
      placeform: [{ placeTitle: "131", placeNum: 0 }],
      brandList: [
        { value: "1", label: "add" },
        { value: "2", label: "nik" },
        { value: "3", label: "kapp" },
        { value: "4", label: "linin" },
        { value: "5", label: "ant" }
      ] /* 品牌表(获取) */,
      categoryList: [] /* 分类表(获取) */,
      seckill: false /* 是否秒杀 */
    };
  },
  mounted() {
    if (this.$route.params.data) {
      /* 调接口获取goods信息然后执行 */

      this.goodsform = this.$route.params.data;
      console.log(this.$route.params.data.isGift, 999);
      this.goodsform.brandId = this.goodsform.brandId.split(",")[0];
      this.goodsform.categoryId = this.goodsform.categoryId.split(",").splice(0, 3);
      this.goodsform.supplierId = this.goodsform.supplierId.split(",")[0];
      this.timeRange[0] = this.goodsform.goodsSeckill.seckillStart;
      this.timeRange[1] = this.goodsform.goodsSeckill.seckillEnd;
      this.categoryIds[0] = this.goodsform.categoryOne;
      this.categoryIds[1] = this.goodsform.categoryTwo;
      this.categoryIds[2] = this.goodsform.categoryThree;
      this.seckill = this.goodsform.goodsSeckill.seckillNum > 0;
    }
    /* 初始化级联列表 */
    getCategory().then(data => {
      if (data.data.status == 0) {
        this.categoryList = data.data.data;
      }
    });
    /* 是否为礼包 */
    console.log(this.goodsform.isGift);
    this.goodsform.isGift = this.goodsform.isGift ? true : false;
    console.log(this.goodsform.isGift);
  },
  watch: {
    goodsform: {
      handler() {
        console.log(this.goodsform);
      },
      deep: true
    },
    timeRange: {
      handler() {
        console.log(this.timeRange);
        this.goodsform.goodsSeckill.seckillStart = this.timeRange[0];
        this.goodsform.goodsSeckill.seckillEnd = this.timeRange[1];
      }
    },
    seckill: {
      handler() {
        /* 在秒杀按钮变化时对秒杀的数据清空 */
        /* 秒杀时间还在不用管 */
        if (!this.seckill) {
          this.goodsform.goodsSeckill = {
            seckillStart: "" /*开始时间√*/,
            seckillEnd: "" /*结束时间√*/,
            seckillPrice: 0 /* 秒杀价格√ */,
            seckillNum: 0 /* 秒杀数量  秒杀则有  不秒杀则为0 √*/
          };
          console.log(this.goodsform.goodsSeckill);
        }
      }
    },
    categoryIds: {
      /* 每当选择分类 换成三级的分类的id */
      handler() {
        this.goodsform.categoryOne = this.categoryIds[0];
        this.goodsform.categoryTwo = this.categoryIds[1];
        this.goodsform.categoryThree = this.categoryIds[2];
      }
    }
  },
  methods: {
    // change() {
    //   let nodesObj = this.$refs["categoryList"].getCheckedNodes(true);
    //   console.log(nodesObj);
    // },
    /* 富文本接参 */
    getHtmlFromWang(value) {
      this.goodsform.descUrl = value; //在这里接受子组件传过来的参数，赋值给data里的参数
      console.log(this.goodsform.descUrl);
    },
    /* tabs栏点击事件 */
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /* 提交表单 */
    submitForm() {
      console.log(this.goodsform);
      // addProduct(this.productform).then(res => {
      //   if (res.data.status == 0) {
      //     this.$message({
      //       type: "success",
      //       message: "商品添加成功",
      //       center: true
      //     });
      //     this.$router.go(-1);
      //   }
      // });
    },
    /* 上一步 下一步 */
    goSteps(type) {
      if (type == "prev") {
        this.active--;
      } else if (type == "next") {
        this.active++;
      }
    },
    /* 添加 删除 可选规格 */
    addTag() {
      this.refreshTable();
    },
    delteGroup(idx) {
      this.goodsform.goodsSpecOptional.goodsGroupSpecParmList.splice(idx, 1);
      this.refreshTable();
    },
    addGroup() {
      let obj = {
        groupName: "",
        specParam: []
      };
      this.refreshTag();
      this.goodsform.goodsSpecOptional.goodsGroupSpecParmList.push(obj);
    },
    /* 添加删除 不变的规格 */
    addCurrencyGroup() {
      let obj = {
        groupName: "",
        specParams: [{ specParamName: "", specCurrencyValue: "" }]
      };
      this.goodsform.goodsSpecCurrency.push(obj);
    },
    addSpec(idx) {
      let obj = { specParamName: "", specCurrencyValue: "" };
      this.goodsform.goodsSpecCurrency[idx].specParams.push(obj);
    },
    delteCurrencyGroup(idx) {
      this.goodsform.goodsSpecCurrency.splice(idx, 1);
    },
    delteSpec(i, idx) {
      this.goodsform.goodsSpecCurrency[i].specParams.splice(idx, 1);
    },
    /* 刷新 */
    refreshTable() {
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
      });
    },
    refreshTag() {
      this.showTag = false;
      this.$nextTick(() => {
        this.showTag = true;
      });
    }
  },
  components: {
    wangEditor /* 富文本 */,
    uploadImg /* 图片上传 */,
    tagAdd /* 添加标签 */,
    autoTable /* 自动排列表单 */
  }
};
</script>

<style lang='less'>
#addAlter {
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
      .el-steps {
        margin: 10px 0 14px 0;
      }
      .el-form-item.cascader {
        .el-form-item__content {
          .el-cascader {
            width: 100%;
          }
        }
      }
      .img_box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          width: 100px;
          height: 100px;
          margin-left: 25px;
        }
      }
      .submitGroup {
        margin-top: 15px;
      }
      .discount .el-input__inner {
        width: 500px; //搜索框宽度
      }
      .afterSale .el-input__inner {
        width: 600px; /* 搜索框宽度 */
      }
      .tableHead {
        .groupName {
          width: 160px;
        }
        .el-input {
          .el-input__inner {
            width: 150px;
          }
        }
      }
      .gosteps {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
