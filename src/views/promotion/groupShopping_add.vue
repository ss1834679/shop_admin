<template>
  <div id="groupShopping_add">
    <!-- 拼团商品的添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">添加拼团商品</span>
        </div>
      </div>
      <div class="content">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="选择商品分类"></el-step>
          <el-step title="填写商品信息"></el-step>
          <el-step title="填写商品属性/规格"></el-step>
          <el-step title="选择商品关联"></el-step>
        </el-steps>
        <el-form :model="goodsform" ref="goodsform" :rules="goodsRules" label-width="120px" class="demo-ruleForm">
          <div class="steps" v-show="active==0">
            <el-form-item label="所属分类" class="categoryBox">
              <div class="levelOne">
                <div>
                  <div>请选择一级分类</div>
                  <div
                    v-for="(item) in cateOneList"
                    :key="item.id"
                    @click="getChildren({level:1,id:item.id,name:item.categoryName})"
                  >{{item.categoryName}}</div>
                </div>
              </div>
              <div class="levelTwo">
                <div>
                  <div>请选择二级分类</div>
                  <div
                    v-for="(item) in cateTwoList"
                    :key="item.id"
                    @click="getChildren({level:2,id:item.id,name:item.categoryName})"
                  >{{item.categoryName}}</div>
                </div>
              </div>
              <div class="levelThree">
                <div>
                  <div>请选择三级分类</div>
                  <div
                    v-for="(item) in cateThreeList"
                    :key="item.id"
                    @click="getChildren({level:3,id:item.id,name:item.categoryName})"
                  >{{item.categoryName}}</div>
                </div>
              </div>
            </el-form-item>
            <el-form-item>所选分类：{{categoryNameList[0]}}>>{{categoryNameList[1]}}>>{{categoryNameThree}}</el-form-item>
          </div>
          <div class="steps" v-if="active==1">
            <el-form-item label="商品标题" required prop="goodsTitle">
              <el-input v-model="goodsform.goodsTitle"></el-input>
            </el-form-item>
            <el-form-item label="商品副标题(简介)" required prop="goodsSubtitle">
              <el-input v-model="goodsform.goodsSubtitle"></el-input>
            </el-form-item>
            <el-form-item label="所属品牌" required prop="brandId">
              <el-select v-model="goodsform.brandId" filterable placeholder="请选择品牌(可搜索)">
                <el-option v-for="(item,index) in brandList" :key="index" :label="item.brandName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属店铺" prop="supplierId" v-if="!isSupplier">
              <el-select v-model="goodsform.supplierId" filterable placeholder="请选择店铺(可搜索)">
                <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="优惠卷">
            <el-select class="discount" v-model="goodsform.discountId" multiple placeholder="请选择">-->
            <!-- 这里为优惠卷列表 discountList 后台获取 -->
            <!-- <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>-->

            <el-form-item label="运费模板" class="is-required" prop="templatesId">
              <el-select v-model="goodsform.templatesId" filterable placeholder="请选择运费模板">
                <el-option v-for="item in templateList" :key="item.templates.id" :label="item.templates.name" :value="item.templates.id"></el-option>
              </el-select>
              <span>平台提供一个默认的免邮的模板</span>
            </el-form-item>
            <el-form-item label="权重" required prop="goodsWeight">
              <el-input v-model.number="goodsform.goodsWeight"></el-input>
            </el-form-item>
            <el-form-item label="成团人数" required prop="assemblePersonNum">
              <el-input-number v-model="goodsform.assemblePersonNum" :min="2" :controls="false"></el-input-number>人
            </el-form-item>
            <el-form-item label="历史限购" required prop="historyLimit">
              <el-input-number v-model="goodsform.historyLimit" :min="0" :controls="false"></el-input-number>
              <div>用户历史累计可购买数量，默认为0表示不限制</div>
            </el-form-item>
            <el-form-item label="成团倒计时" required prop="assembleCountDown">
              <el-input-number v-model="goodsform.assembleCountDown" :min="1" :controls="false"></el-input-number>时
            </el-form-item>
            <el-form-item label="新人参团" required prop="isNewPerson">
              <el-switch v-model="goodsform.isNewPerson"></el-switch>
            </el-form-item>

            <el-form-item label="是否上传3D图">
              <el-switch v-model="isThreeImage" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item v-if="isThreeImage" label="3D图链接">
              <el-input v-model="goodsform.goodsImageThree" placeholder="3D图的链接"></el-input>
            </el-form-item>
            <el-form-item label="满减价格">
              <el-button v-if="priceReduction.length==0" plain @click="addPriceGroup()">添加价格满减活动</el-button>
              <el-table v-else :data="priceReduction" style="width: 700px">
                <el-table-column label="满" prop="discountMax">
                  <template slot-scope="scope">
                    <precision-input
                      :num="scope.row.discountMax"
                      :text="'元'"
                      :placeholder="'填写金额'"
                      :type="'price'"
                      @getNum="(value)=>{scope.row.discountMax=value}"
                    ></precision-input>
                  </template>
                </el-table-column>
                <el-table-column label="减" prop="discountPrice">
                  <template slot-scope="scope">
                    <precision-input
                      :num="scope.row.discountPrice"
                      :text="'元'"
                      :placeholder="'填写金额'"
                      :type="'price'"
                      @getNum="(value)=>{scope.row.discountPrice=value}"
                    ></precision-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" @click="deletePriceGroup(scope.$index)" icon="el-icon-close" size="mini" circle></el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="addPriceGroup()" size="mini" circle></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <!-- <el-form-item label="满减邮费">
              <el-button v-if="postageReduction.length==0" plain @click="addPostageGroup()">添加邮费满减活动</el-button>
              <el-table v-else :data="postageReduction" style="width: 700px">
                <el-table-column label="满" prop="discountMax">
                  <template slot-scope="scope">
                    <precision-input
                      :num="scope.row.discountMax"
                      :text="'元'"
                      :placeholder="'填写金额'"
                      :type="'price'"
                      @getNum="(value)=>{scope.row.discountMax=value}"
                    ></precision-input>
                  </template>
                </el-table-column>
                <el-table-column label="减" prop="discountPrice">
                  <template slot-scope="scope">
                    <precision-input
                      :num="scope.row.discountPrice"
                      :text="'元'"
                      :placeholder="'填写金额'"
                      :type="'price'"
                      @getNum="(value)=>{scope.row.discountPrice=value}"
                    ></precision-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" @click="deletePostageGroup(scope.$index)" icon="el-icon-close" size="mini" circle></el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="addPostageGroup()" size="mini" circle></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>-->
            <el-form-item label="封面图片" required prop="goodsImage">
              <upload-img
                @getimgArr="(imgarr)=>{this.goodsform.goodsImage = imgarr}"
                :imgArr="this.goodsform.goodsImage"
                :size="{ height: 300, width: 300 }"
                :limit="1"
                :notMultiple="true"
              ></upload-img>
            </el-form-item>
            <el-form-item label="商品轮播图" required prop="goodsImages">
              <upload-arr @getimgArr="(imgarr)=>{this.images = imgarr}" :size="{ height: 800, width: 800 }" :imgArr="this.images" :limit="6"></upload-arr>
            </el-form-item>
            <el-form-item label="详情" required>
              <wang-editor :value="goodsform.goodsDesc.descContent" @getHtmlFromWang="(value)=>{this.goodsform.goodsDesc.descContent=value}"></wang-editor>
            </el-form-item>
            <el-form-item label="虚拟销量" prop="virtualSaleNum" v-if="!isSupplier">
              <el-input-number v-model="goodsform.virtualSaleNum" :controls="false" placeholder="虚拟销量" :min="0"></el-input-number>
            </el-form-item>
            <!-- <el-form-item label="订单分发" required prop="isDistribute">
              <el-radio-group v-model="goodsform.isDistribute">
                <el-radio :label="0">不分发</el-radio>
                <el-radio :label="1">分发</el-radio>
              </el-radio-group>
            </el-form-item>-->
            <!-- <el-form-item label="售后服务">
            <el-select v-model="goodsform.afterSaleId" class="afterSale" multiple placeholder="请选择售后服务">-->
            <!-- 这个列表为 afterSaleList 后台获取 -->
            <!-- <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>-->
          </div>
          <div class="steps" v-show="active==2">
            <el-form-item label="填写商品属性" required prop="goodsSpecCurrencyVOS">
              <div>
                <!-- <div class="tableHead">
                    <el-input class="groupName" v-model="item.groupName" placeholder="规格组名称"></el-input>
                    <span>{{item.groupName}}</span>
                </div>-->
                <el-table :data="specCurr" :show-header="false" style="width: 100%">
                  <el-table-column prop="specParamName" width="200">
                    <template slot-scope="scope">
                      <span>{{scope.row.specParamName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="specCurrencyValue" class-name="selectandinput">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.specCurrencyValue" placeholder="属性值"></el-input>
                      <el-select
                        v-if="scope.row.specCurrencyValues&& Array.isArray(scope.row.specCurrencyValues)&&scope.row.specCurrencyValues.length>0"
                        v-model="scope.row.specCurrencyValue"
                        placeholder="请选择属性值"
                      >
                        <el-option v-for="(item,index) in scope.row.specCurrencyValues" :key="index" :label="item" :value="item"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- <el-button type="primary" @click="addSpecCurr()" size="mini">添加属性组</el-button> -->
              </div>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label="是否为礼包" required prop="isGift">
              <el-switch v-model="goodsform.isGift" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="编辑规格:" v-if="goodsform.specOptionals.specParamVOs" class="editOptional">
              <el-button v-if="goodsform.specOptionals.specParamVOs.length==0" type="primary" @click="addGroup()" size="mini">添加规格组</el-button>
              <el-table v-if="showTable" :data="goodsform.specOptionals.specParamVOs" style="width: 100%">
                <el-table-column prop="specParamName" label="规格名称" width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.specParamName" placeholder="输入规格组的名称"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="规格值">
                  <template slot-scope="scope">
                    <tag-add
                      domref="good"
                      :tableindex="scope.$index"
                      @delete="handleDeleteOption"
                      @add="handleAddOption"
                      :arrData="optionValues[scope.$index]?optionValues[scope.$index]:[]"
                      @getArrData="(arr)=>{refreshTag(arr,scope.$index)}"
                    ></tag-add>
                  </template>
                </el-table-column>
                <el-table-column label="添加/删除规格组" width="180">
                  <template slot-scope="scope">
                    <el-button
                      v-if="goodsform.specOptionals.specParamVOs.length-1!=0"
                      type="danger"
                      @click="delteGroup(scope.$index)"
                      icon="el-icon-close"
                      size="mini"
                      circle
                    ></el-button>
                    <el-button
                      v-if="scope.$index==goodsform.specOptionals.specParamVOs.length-1"
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
                <el-table-column label="批量填充编码">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.placeCore" placeholder="批量填充编码"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="批量填充库存">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.placeNum" placeholder="批量填充库存"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="批量填充重量">
                  <template slot-scope="scope">
                    <precision-input
                      :num="scope.row.placeWeight"
                      :placeholder="'重量'"
                      text="千克/KG"
                      :type="'weight'"
                      @getNum="(value)=>{scope.row.placeWeight=value}"
                    ></precision-input>
                  </template>
                </el-table-column>
              </el-table>
              <auto-table
                type="group"
                :placeForm="placeform[0]"
                :paramNameArr="goodsform.specOptionals.specParamVOs"
                :optionValues="optionValues"
                :goodsItemList="goodsform.specOptionals.goodsItemVOS"
                @getItemList="({list})=>{goodsform.specOptionals.goodsItemVOS = list}"
                ref="good"
              ></auto-table>
            </el-form-item>
          </div>
          <div class="steps" v-show="active==3">
            <el-form-item label="关联商品" prop="isGift" class="relatGoods">
              <!-- 开始 -->
              <div class="searchBar">
                <div class="search_box">
                  <el-cascader
                    ref="categoryList"
                    placeholder="请选择分类"
                    v-model="searchCateId"
                    :props="props"
                    :options="categoryList"
                    :show-all-levels="false"
                    clearable
                  ></el-cascader>
                </div>
                <div class="search_box">
                  <el-select v-model="searchBrandId" filterable placeholder="请选择品牌(可搜索)" clearable>
                    <!-- 后台获取 -->
                    <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
                  </el-select>
                </div>
                <div class="search_box">
                  <el-input :placeholder="'请输入搜索关键词'" v-model="searchInput"></el-input>
                </div>
                <div class="search_box">
                  <el-button @click="searchGoods" size="small" plain>搜索</el-button>
                </div>
              </div>
              <div class="relatGoodsbox">
                <div class="relatGoodsLeft">
                  <div v-if="goodsform.goodsTitle">{{goodsform.goodsTitle}}</div>
                </div>
                <div class="relatGoodsCenter">
                  <el-radio-group v-model="goodsform.isDouble">
                    <el-radio :label="false">单项关联</el-radio>
                    <el-radio :label="true">双向关联</el-radio>
                  </el-radio-group>
                </div>
                <div class="relatGoodsRight">
                  <el-checkbox-group v-model="relatedList">
                    <div class="related" v-if="related.length>0">
                      <el-checkbox v-for="item in related" :label="item.id" checked :key="item.id">{{item.goodsTitle}}</el-checkbox>
                    </div>
                    <div v-if="searchgoodList.length>0" class="searchgood">
                      <el-checkbox v-for="item in searchgoodList" :label="item.id" :key="item.id">{{item.goodsTitle}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
              <!-- 结束 -->
            </el-form-item>
          </div>
        </el-form>
        <div class="gosteps">
          <el-button type="success" v-if="active!=0" plain @click="goSteps('prev')">上一步</el-button>
          <el-button type="success" v-if="active!=3" @click="goSteps('next')">下一步</el-button>
          <el-button type="success" v-if="active==3" @click="submitForm('goodsform')">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import wangEditor from "../../components/wangEditor";
import uploadImg from "../../components/uploadImg";
import uploadArr from "../../components/uploadImgArr";
import precisionInput from "../../components/precisionInput";
import tagAdd from "../../components/tags";
import autoTable from "../../components/autoTable";
import { getCategoryByPar, getCategoryById, getCategory } from "../../api/category";
import { getBrandList } from "../../api/brand";
import { getSupplierAll } from "../../api/supplier";
import { getTemplatesListBySup } from "../../api/setings";
import { assembleGoodsAdd, getAssembleGoods } from "../../api/promotion";
import { getTemplatesList } from "../../api/setings";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      goodsform: {
        goodsId: "",
        goodsTitle: "" /* 商品标题 √*/,
        goodsSubtitle: "" /* 简介  √*/,
        goodsStatus: 2 /* 商品状态 0 下架 1 上架 2 待审核 -1 未通过√ */,
        goodsWeight: 0 /* 商品排序值 √*/,
        brandId: "" /* 品牌ID,品牌名称 √*/,
        categoryOne: "" /* 一级分类id */,
        categoryTwo: "" /* 二级分类id */,
        categoryThree: "" /* 三级分类id */,
        supplierId: "" /* 供应商ID,名称 √*/,
        templatesId: "" /* 运费模板ID */,
        goodsImageThree: "" /* https://720.tbzj.net/3D图的链接 */,
        discountList: [] /* 满减数组 包括价格和邮费 */,
        virtualSaleNum: 0 /* 虚拟销量 */,
        isDistribute: 0 /* 是否需要分发订单 */,
        isNewPerson: false /* 是否仅新人参团 */,
        assembleCountDown: null /* 成团倒计时 */,
        assemblePersonNum: null /* 成团人数 */,
        historyLimit: 0 /* 历史限购数 0 为不限制 */,
        // afterSaleId: [] /* 售后服务的数组 √*/,
        // discountId: [] /* 优惠卷活动的数组 √*/,
        goodsImage: "" /* 商品主图√ */,
        goodsImages: [
          {
            imageDesc: "",
            imageSort: 0,
            imageType: 0,
            imageUrl: ""
          }
        ] /* 轮播图 */,
        isGift: 0 /* 是否为礼包产品 */,
        goodsDesc: {
          descSort: 0,
          descContent: ""
        },
        goodsSpecCurrencyVOS: [] /* 只可看的规格组 √*/,
        specOptionals: {
          specParamVOs: [],
          isSearch: 1,
          goodsItemVOS: [
            // {
            //   giftDetailsVOS: [
            //     {
            //       detailsNum: 0 /* 礼包的goodsitem数量 */,
            //       goodsItemId: "" /* 是哪一个goodsitem */
            //     }
            //   ],
            //   isGift: false /* 是否为礼包 */,
            //   itemCore: "" /* 编码 */,
            //   itemImage: "" /* 商品图片  选择规格之后的图片 */,
            //   itemNum: 0 /* 商品库存 */,
            //   itemPrice: 0 /* 商品价格 */,
            //   itemTitle: "" /* 商品标题 */,
            //   optionalIds: "",
            //   saleNum: 0,
            //   specOptionalValue: ""
            // }
          ]
        } /* 可选的规格组 √*/,
        isDouble: false /* true 为双向 false 为单向 */,
        goodsIdList: [] /* 绑定推荐商品的id对象集合 */
      },
      active: 0 /* 步骤 */,
      images: [] /* 轮播图中间变量 */,
      specCurr: [] /* 属性中间变量 */,
      optionValues: [] /* 规格值数组中间变量 */,
      showTable: true /* 刷新table */,
      goodsRules: {
        goodsTitle: [{ required: true, message: "请填写商品名称", trigger: "blur" }],
        goodsSubtitle: [{ required: true, message: "请填写商品简介", trigger: "blur" }],
        brandId: [{ required: true, message: "请选择品牌", trigger: "blur" }],
        goodsWeight: [{ required: true, message: "请填写商品权重", trigger: "blur" }],
        goodsImage: [{ required: true, message: "请上传商品主图", trigger: "blur" }],
        goodsImages: [{ required: true, message: "请上传商品轮播图", trigger: "blur" }],
        isGift: [{ required: true, message: "请选择是否为礼包", trigger: "blur" }],
        isDistribute: [{ required: true, message: "请选择是否分发订单", trigger: "blur" }],
        goodsSpecCurrencyVOS: [{ required: true, message: "请填写至少一个商品属性", trigger: "blur" }]
      },
      userInfo: {},
      cateOneList: [],
      cateTwoList: [],
      cateThreeList: [],
      categoryNameList: [],
      categoryNameThree: "",
      placeform: [{ placeTitle: "", placeNum: 100, placeWeight: null, placeCore: "" }] /* 批量填充数据 */,
      brandList: [] /* 品牌表(获取) */,
      templateList: [] /* 运费模板列表（供应商） */,
      supplierList: [] /* 店铺列表 */,
      isThreeImage: false /* 是否上传3D图 */,
      priceReduction: [] /* 满减价格 */,
      postageReduction: [] /* 满减邮费 */,
      related: [],
      searchgoodList: [] /* 搜索的商品列表 */,
      relatedList: [],
      searchInput: "" /* 搜索关键词 */,
      searchBrandId: "" /* 搜索品牌id */,
      searchCateId: "" /* 搜索分类id */,
      categoryOne: "",
      categoryTwo: "",
      categoryThree: "",
      categoryList: [],
      props: {
        value: "id",
        label: "categoryName",
        checkStrictly: true /* 子父不关联 */,
        children: "childList"
      } /* 级联选择配置 */
    };
  },
  computed: {
    ...mapGetters({
      isSupplier: "onGetIsSupplier"
    })
  },
  mounted() {
    /* 售后服务 活动 优惠券 */
    /* 初始化运费模板列表 */
    getTemplatesList().then(data => {
      if (data.data.status == 200) {
        this.templateList = data.data.content;
      }
    });
    /* 初始化品牌搜索列表 */
    getBrandList({ pageNo: 1, pageSize: 250 }).then(data => {
      if (data.data.status == 0) {
        this.brandList = data.data.data.list;
      }
    });

    getSupplierAll().then(data => {
      if (data.data.status == 200) {
        this.supplierList = data.data.content;
      }
    });
    /* 初始化一级分类 */
    getCategoryByPar({ pageNo: 1, pageSize: 40 }).then(data => {
      this.cateOneList = data.data.data.list;
    });
    /* 初始化级联列表 */
    getCategory().then(data => {
      if (data.data.status == 0) {
        this.categoryList = data.data.data;
      }
    });
    /* 是否为礼包 */
    this.goodsform.isGift = this.goodsform.isGift ? true : false;
  },
  watch: {
    "goodsform.categoryThree": {
      handler() {
        if (this.goodsform.categoryThree != "") {
          this.initSpecArr(this.goodsform.categoryThree);
        }
      },
      deep: true
    },
    /* 初始化的时候获取的 currency name 在发生更改的时候 实时返回到goodsform */
    specCurr: {
      handler() {
        // console.log(this.specCurr, "999");
        this.goodsform.goodsSpecCurrencyVOS = [];
        this.specCurr.forEach(item => {
          if (item.specCurrencyValue != "") {
            let obj = {
              specParamId: item.specParamId,
              specParamName: item.specParamName,
              specCurrencyValue: item.specCurrencyValue
            };
            this.goodsform.goodsSpecCurrencyVOS.push(obj);
          }
        });
      },
      deep: true
    },
    images: {
      /* 轮播图转换成添加删除的值 */
      handler() {
        this.goodsform.goodsImages = [];
        this.images.forEach((item, index) => {
          this.goodsform.goodsImages[index] = {
            imageDesc: "",
            imageSort: 0,
            imageType: 0,
            imageUrl: item
          };
        });
      }
    },
    isThreeImage: {
      handler() {
        if (this.isThreeImage == false) {
          this.goodsform.goodsImageThree = "";
        }
      }
    },
    searchCateId: {
      /* 筛选分类改变 */
      handler() {
        this.categoryOne = this.searchCateId[0] == undefined ? "" : this.searchCateId[0];
        this.categoryTwo = this.searchCateId[1] == undefined ? "" : this.searchCateId[1];
        this.categoryThree = this.searchCateId[2] == undefined ? "" : this.searchCateId[2];
      }
    },
    relatedList: {
      handler() {
        this.goodsform.goodsIdList = this.relatedList;
      }
    },
    /* 通过选择供应商获取模板 */
    "goodsform.supplierId": {
      handler() {
        if (this.goodsform.supplierId) {
          getTemplatesListBySup(this.goodsform.supplierId).then(data => {
            if (data.data.status == 200) {
              this.templateList = data.data.content;
            }
          });
        }
      }
    }
  },
  methods: {
    handleDeleteOption(obj) {
      this.$refs.good.deleteOption(obj);
    },
    handleAddOption(obj) {
      this.$refs.good.addOption(obj);
    },
    /* 提交表单 */
    submitForm(formName) {
      this.goodsStatus = 2;
      this.goodsform.discountList = this.priceReduction.concat(this.postageReduction);
      this.$refs[formName].validate(valid => {
        if (valid) {
          new Promise((resolve, reject) => {
            if (this.goodsform.goodsDesc.descContent == "" && this.goodsform.goodsDesc.descContent == "<p><br></p>") {
              reject("请填写商品详情！");
            }
            let isItem = false;
            let mistakeMsg = "";
            this.goodsform.specOptionals.goodsItemVOS.forEach((item, index) => {
              if (item.itemTitle == "" || item.itemTitle == null) {
                mistakeMsg = mistakeMsg + `<li>第${index + 1}个规格中的规格标题不能为空</li>`;
                isItem = true;
              }
              if (item.itemCore == "" || item.itemCore == null) {
                mistakeMsg = mistakeMsg + `<li>第${index + 1}个规格中的编码不能为空</li>`;
                isItem = true;
              }
              if (item.itemPrice == "" || item.itemPrice == null) {
                mistakeMsg = mistakeMsg + `<li>第${index + 1}个规格中的单独购买价不能为空</li>`;
                isItem = true;
              }
              if (item.itemMarketPrice == "" || item.itemMarketPrice == null) {
                mistakeMsg = mistakeMsg + `<li>第${index + 1}个规格中的团购价不能为空</li>`;
                isItem = true;
              }
              if (item.goodsItemInfo.weight == "" || item.goodsItemInfo.weight == null) {
                mistakeMsg = mistakeMsg + `<li>第${index + 1}个规格中的重量不能为空</li>`;
                isItem = true;
              }
              if (item.costPrice == "" || item.costPrice == null) {
                mistakeMsg = mistakeMsg + `<li>第${index + 1}个规格中的成本价不能为空</li>`;
                isItem = true;
              }
              if (this.goodsform.isRetailStore && (item.memberPrice == "" || item.memberPrice == null)) {
                mistakeMsg = mistakeMsg + `<li>第${index + 1}个规格中的会员价不能为空</li>`;
                isItem = true;
              }
            });
            isItem && reject(`<ol>${mistakeMsg}</ol>`);
            resolve();
          })
            .then(() => {
              if (
                this.goodsform.goodsImageThree &&
                this.goodsform.goodsImageThree.indexOf("/tiao?url=") == -1 &&
                this.goodsform.goodsImageThree.indexOf("https://720.tbzj.net") == -1 &&
                this.goodsform.goodsImageThree != ""
              ) {
                this.goodsform.goodsImageThree = "https://720.tbzj.net/tiao?url=" + this.goodsform.goodsImageThree;
              }
              assembleGoodsAdd(this.goodsform).then(data => {
                if (data.data.status == 0) {
                  this.$message({
                    showClose: true,
                    message: "添加成功",
                    type: "success"
                  });
                  this.$router.push({ name: "groupShopping_idx" });
                } else {
                  this.$message.error(data.data.msg);
                }
              });
            })
            .catch(res => {
              this.$message({
                type: "warning",
                dangerouslyUseHTMLString: true,
                message: res,
                showClose: true,
                duration: 0
              });
            });
        } else {
          this.$message.error("请检查参数是否填写完整！！");
          return false;
        }
      });
    },
    getChildren({ level, id, name }) {
      if (level == 1) {
        getCategoryByPar({ parentId: id, pageNo: 1, pageSize: 50 }).then(data => {
          if (data.data.status == 0) {
            this.cateTwoList = data.data.data.list;
            this.cateThreeList = [];
            this.categoryNameList = new Array(2);
            this.categoryNameList[0] = name;
            this.categoryNameList[1] = "";
            this.categoryNameThree = "";
            this.goodsform.categoryOne = id;
            this.goodsform.categoryTwo = "";
            this.goodsform.categoryThree = "";
          }
        });
      } else if (level == 2) {
        getCategoryByPar({ parentId: id, pageNo: 1, pageSize: 50 }).then(data => {
          if (data.data.status == 0) {
            this.cateThreeList = data.data.data.list;
            this.goodsform.categoryTwo = id;
            this.goodsform.categoryThree = "";
            this.categoryNameList[1] = name;
            this.categoryNameThree = "";
          }
        });
      } else if (level == 3) {
        this.goodsform.categoryThree = id;
        this.categoryNameThree = name;
      }
    },
    /* 上一步 下一步 */
    goSteps(type) {
      if (type == "prev") {
        this.active--;
      } else if (type == "next") {
        if (this.active == 0) {
          if (this.goodsform.categoryThree == "") {
            this.$message({
              showClose: true,
              message: "请选择分类之后再进行下一步",
              type: "error"
            });
          } else {
            this.active++;
          }
        } else {
          this.active++;
        }
      }
    },
    /* 初始化属性填写数组 */
    initSpecArr(id) {
      /* 获取第三级分类的 属性列表 */
      getCategoryById(id).then(data => {
        /* 获取属性列表 */
        let specParam = data.data.content.specCurrencyVOs[0].specParamVOs;
        /* 获取规格列表 */
        // let specParamOpt = data.data.content.specOptionalVOs[0].specParamVOs;
        // let specParamOpt = [];
        if (Array.isArray(specParam)) {
          this.specCurr = [];
          specParam.forEach(item => {
            this.specCurr.push({
              specParamId: item.specParamId,
              specParamName: item.specParamName,
              specCurrencyValue: "" /* 加入一个空的值 */,
              specCurrencyValues: item.specCurrencyValue
            });
          });
        }
        // if (Array.isArray(specParamOpt) && specParamOpt.length > 0) {
        //   this.goodsform.specOptionals.specParamVOs = [];
        //   specParamOpt.forEach(item => {
        //     if (item.specOptionalValue.length > 0) {
        //       this.goodsform.specOptionals.specParamVOs.push(item);
        //       this.optionValues.push(item.specOptionalValue);
        //     }
        //   });
        // }
        if (this.optionValues.length <= 0) {
          /* 如果不是修改 就push一个空数组 */
          this.goodsform.specOptionals.specParamVOs.forEach(() => {
            this.optionValues.push([]);
          });
        }
      });
    },
    /* 添加 删除 可选规格 */
    addTag() {
      this.refreshTable();
    },
    delteGroup(idx) {
      this.goodsform.specOptionals.specParamVOs.splice(idx, 1);
      this.optionValues.splice(idx, 1);
      this.refreshTable();
      this.$refs.good.deleteGroup(idx);
    },
    addGroup() {
      let obj = {
        isDisplay: 1,
        isSearch: 1,
        specGroupId: "",
        specParamId: "",
        specParamName: ""
      };
      this.goodsform.specOptionals.specParamVOs.push(obj);
    },
    /* 满减价格 */
    deletePriceGroup(index) {
      this.priceReduction.splice(index, 1);
    },
    addPriceGroup() {
      let obj = { discountMax: null, discountPrice: null, discountType: 0 };
      this.priceReduction.push(obj);
    },
    /* 满减邮费 */
    deletePostageGroup(index) {
      this.postageReduction.splice(index, 1);
    },
    addPostageGroup() {
      let obj = { discountMax: null, discountPrice: null, discountType: 1 };
      this.postageReduction.push(obj);
    },
    // addSpecCurr() {
    //   let obj = {
    //     specParamId: "",
    //     specParamName: "",
    //     specCurrencyValue: ""
    //   };
    //   this.specCurr.push(obj);
    // },
    /* 刷新 */
    refreshTable() {
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
      });
    },
    refreshTag(arr, index) {
      if (arr.length > 0) {
        this.$set(this.optionValues, index, arr);
        this.optionValues.forEach((item, index) => {
          this.goodsform.specOptionals.specParamVOs[index].specOptionalValue = item;
        });
      }
    },
    searchGoods() {
      getAssembleGoods({
        pageNo: 1,
        pageSize: 30,
        categoryOne: this.categoryOne == "" ? null : this.categoryOne,
        categoryTwo: this.categoryTwo == "" ? null : this.categoryTwo,
        categoryThree: this.categoryThree == "" ? null : this.categoryThree,
        brandId: this.searchBrandId == "" ? null : this.searchBrandId,
        goodsTitle: this.searchInput == "" ? null : this.searchInput
      }).then(data => {
        if (data.data.status == 0) {
          this.searchgoodList = data.data.data.data.list;
          this.$message({
            message: "已执行查询",
            type: "success"
          });
        }
      });
    }
  },
  components: {
    wangEditor /* 富文本 */,
    uploadImg /* 图片上传 */,
    uploadArr /* 图片上传数组 */,
    tagAdd /* 添加标签 */,
    autoTable /* 自动排列表单 */,
    precisionInput
  }
};
</script>

<style lang='less'>
#groupShopping_add {
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
      .el-form-item.categoryBox {
        .el-form-item__content {
          display: flex;
          justify-content: left;
          align-items: center;
        }
        .el-form-item__content > div {
          width: 200px;
          height: 400px;
          margin-right: 50px;
          border: 1px solid #ccc;
          border-radius: 4px;
          overflow: hidden;
        }
        .el-form-item__content > div > div {
          width: 108%;
          height: 100%;
          overflow-y: scroll;
          position: relative;
        }
        .el-form-item__content > div > div > div {
          cursor: pointer;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        .el-form-item__content > div > div > div:first-child {
          cursor: default;
          background-color: #f9fafc;
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
      .selectandinput {
        .cell {
          display: flex;
          justify-content: left;
          .el-input {
            width: auto;
            .el-input__inner {
              width: auto;
            }
          }
          .el-select {
            margin-left: 10px;
          }
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
      .editOptional {
        .el-form-item__label {
          text-align: left;
          font-size: 20px;
          font-weight: 500;
        }
        .el-form-item__content {
          margin-left: 0px !important;
        }
      }
      .el-form-item.relatGoods {
        .el-form-item__content {
          display: flex;
          flex-direction: column;
          .relatGoodsbox {
            height: 300px;
            display: flex;
            .relatGoodsLeft {
              width: 200px;
              margin-right: 10px;
              border: 1px solid #ccc;
              border-radius: 4px;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              text-align: center;
            }
            .relatGoodsCenter {
              width: 100px;
              margin-right: 10px;
            }
            .relatGoodsRight {
              width: 400px;
              border: 1px solid #ccc;
              border-radius: 4px;
              text-align: center;
              overflow-y: scroll;
              label.el-checkbox {
                display: block;
                text-align: left;
                margin-left: 10px;
                margin-right: 0px;
                border-bottom: 1px solid #ccc;
              }
            }
          }
        }
      }
    }
  }
}
</style>
