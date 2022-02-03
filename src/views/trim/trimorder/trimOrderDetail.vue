<template>
  <div id="trimOrderDetail">
    <!-- 创建装修订单-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title" v-if="$route.params.routerTitle">{{$route.params.routerTitle}}</span>
          <span v-else>订单详情</span>
        </div>
      </div>

      <div class="content">
        <div v-show="!processAlter">
          <div class="infoItem">
            <p class="itemTitle">基本信息</p>
            <div>
              <template v-for="item in fieIdOneList">
                <div class="infoinfoItem" v-if="item.value" :key="item.title">
                  <div class="leftInfo">{{item.title}}</div>
                  <div class="infoContent" v-html="item.value"></div>
                </div>
              </template>
            </div>
          </div>
          <div class="infoItem" v-if="orderStep>0">
            <p class="itemTitle">方案</p>
            <el-form
              v-if="(orderStep==1||orderStep==2)&&$route.query.editPlan&&butlerVisible"
              :model="fieIdTwoForm"
              ref="fieIdTwoForm"
              :rules="trimOrderRules"
              label-width="100px"
            >
              <el-form-item label="方案" prop="planId" class="planFormItem">
                <p>{{trimOrderAllDetail.decorateOrderPlan.title}}</p>
                <p>
                  请修改初步方案，为业主完成Ta的具体方案，
                  <router-link tag="a" target="_blank" :to="{name:'addProject',query:{id:trimOrderAllDetail.decorateOrderPlan.quoteId}}">去修改</router-link>
                </p>
              </el-form-item>
              <el-form-item v-if="trimOrderAllDetail.decorateOrderPlan.planUrl" label="3D链接地址">
                <a
                  :href="trimOrderAllDetail.decorateOrderPlan.planUrl"
                  target="_blank"
                  v-if="trimOrderAllDetail.decorateOrderPlan.planUrl"
                >{{trimOrderAllDetail.decorateOrderPlan.planUrl}}</a>
              </el-form-item>
              <el-form-item label="用户意见" prop="userOpinion">
                <el-input v-model="fieIdTwoForm.userOpinion" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitFieIdTwo('fieIdTwoForm')">提交</el-button>
              </el-form-item>
            </el-form>
            <div v-else>
              <template v-for="item in fieIdTwoList">
                <div class="infoinfoItem" v-if="item.value" :key="item.title">
                  <div class="leftInfo" style="width:120px">{{item.title}}</div>
                  <div class="infoContent" v-html="item.value" style="margin-left:140px"></div>
                </div>
              </template>
            </div>
          </div>
          <div class="infoItem" v-if="orderStep>3&&signInfo">
            <p class="itemTitle">签约</p>
            <div class="infoinfoItem" v-if="signInfo">
              <div class="leftInfo" style="width:120px">签约信息</div>
              <div class="infoContent" v-html="signInfo" style="margin-left:140px"></div>
            </div>
          </div>
          <div class="infoItem" v-if="orderStep>4||(orderStep==4&&operateVisible&&$route.query.editProcess)">
            <p class="itemTitle">装修流程</p>
            <el-form
              v-if="(orderStep==4||orderStep==5)&&$route.query.editProcess&&operateVisible"
              :model="fieIdThrForm"
              ref="fieIdThrForm"
              :rules="trimOrderRules"
              label-width="100px"
            >
              <el-form-item label="装修流程" prop="originalId">
                <el-select v-model="cateId" @change="searchProcess" placeholder="请选择分类">
                  <el-option v-for="item in cateList" :key="item.id" :label="item.flagDesc" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="fieIdThrForm.originalId" @change="handleGetNode" placeholder="请选择装修流程" value-key="id">
                  <el-option v-for="item in processList" :key="item.id" :label="item.processName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目经理" prop="pmPhone">
                <el-select v-model="fieIdThrForm.pmPhone" placeholder="请选择项目经理" value-key="id">
                  <el-option v-for="item in pmList" :key="item.id" :label="item.projectManagerName" :value="item.accountNum"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleNextStep">下一步</el-button>
              </el-form-item>
            </el-form>
            <div v-else>
              <template v-for="item in fieIdThrList">
                <div class="infoinfoItem" v-if="item.value" :key="item.title">
                  <div class="leftInfo">{{item.title}}</div>
                  <div class="infoContent" v-html="item.value"></div>
                </div>
              </template>
              <div class="infoinfoItem">
                <div class="leftInfo">装修分账</div>
                <div class="infoContent">
                  <p>
                    <span>总价：</span>
                    <span class="red" style="margin-right:20px">¥{{(orderTotalPrice/100).toFixed(2)}}</span>
                    <span>毛利润：</span>
                    <span class="red" style="margin-right:20px">¥{{(fieIdThrForm.decorateOrderAccountPriceVo.grossProfit/100).toFixed(2)}}</span>
                    <span>成本价：</span>
                    <span class="red" style="margin-right:20px">¥{{(fieIdThrForm.decorateOrderAccountPriceVo.orderCost/100).toFixed(2)}}</span>
                    <span>剩余成本：</span>
                    <span class="red" style="margin-right:20px">¥{{(fieIdThrForm.decorateOrderAccountPriceVo.remainCost/100).toFixed(2)}}</span>
                  </p>
                  <el-table :data="bigNodeMoneyList" border style="width: 100%">
                    <el-table-column prop="nodeName" label="节点名" width="200" align="center"></el-table-column>
                    <el-table-column prop="nodeStep" label="步骤" width="100" align="center"></el-table-column>
                    <el-table-column prop="setProfitList" label="设置服务商分账" align="center">
                      <template slot-scope="scope">
                        <SetProfitTags
                          :arrData="scope.row.setProfitList"
                          :remainCost="fieIdThrForm.decorateOrderAccountPriceVo.remainCost"
                          :isAlter="false"
                          :bigNodeId="scope.row.originalId"
                          @addProfit="handleAddProfit"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                  <p>
                    <span>操作人：{{fieIdThrForm.decorateOrderAccountPriceVo.operator}}，配置时间：{{fieIdThrForm.decorateOrderAccountPriceVo.updateTime}}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="infoItem" v-if="(orderStep>2&&!$route.query.editProcess)||(orderStep==2&&butlerVisible&&$route.query.editQuote)">
            <p class="itemTitle">报价</p>
            <div v-if="trimOrderAllDetail.quoteInfo&&trimOrderAllDetail.quoteInfo.officialHome" class="msgbox">
              <div class="space">
                <div class="spacehead">
                  <div class="spacetitle">
                    <span>按空间报价</span>
                  </div>
                  <div class="spaceprice">
                    <p>
                      总计：
                      <span style="color:red">{{trimOrderAllDetail.quoteInfo.officialHome.totalPrice}}</span> 元
                    </p>
                    <p>
                      均价：
                      <span style="color:red">{{trimOrderAllDetail.quoteInfo.officialHome.averagePrice}}</span> 元
                    </p>
                  </div>
                </div>
                <div class="spacecontent">
                  <ul>
                    <li class="contentLi">
                      <span>客餐厅</span>
                      <p>
                        <span style="color:red">{{trimOrderAllDetail.quoteInfo.officialHome.restaurant}}</span>元
                      </p>
                    </li>
                    <li class="contentLi">
                      <span>卧室</span>
                      <p>
                        <span style="color:red">{{trimOrderAllDetail.quoteInfo.officialHome.bedroom}}</span>元
                      </p>
                    </li>
                    <li class="contentLi">
                      <span>厨房</span>
                      <p>
                        <span style="color:red">{{trimOrderAllDetail.quoteInfo.officialHome.kitchen}}</span>元
                      </p>
                    </li>
                    <li class="contentLi">
                      <span>厕所</span>
                      <p>
                        <span style="color:red">{{trimOrderAllDetail.quoteInfo.officialHome.toilet}}</span>元
                      </p>
                    </li>
                    <li class="contentLi">
                      <span>其他</span>
                      <p>
                        <span style="color:red">{{trimOrderAllDetail.quoteInfo.officialHome.other}}</span>元
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <el-table
                :data="itemList"
                :show-header="false"
                style="width: 100%"
                row-key="key"
                :expand-row-keys="expandKey"
                @expand-change="expandChange"
              >
                <el-table-column prop="title" width="200px"></el-table-column>
                <el-table-column>
                  <template slot-scope="scope">{{trimOrderAllDetail.quoteInfo.officialHome[`${scope.row.key}TotalCount`]}}项</template>
                </el-table-column>
                <el-table-column align="right">
                  <template slot-scope="scope">
                    <p style="margin:0">
                      小计：
                      <span style="color:red">{{trimOrderAllDetail.quoteInfo.officialHome[`${scope.row.key}TotalPrcie`]}}</span>
                      元
                    </p>
                  </template>
                </el-table-column>
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-table :data="trimOrderAllDetail.quoteInfo.officialHome[`${scope.row.key}Materials`]">
                      <el-table-column label="序号">
                        <template slot-scope="scope">{{scope.$index+1}}</template>
                      </el-table-column>
                      <el-table-column prop="name" label="名称"></el-table-column>
                      <el-table-column prop="brand" label="品牌"></el-table-column>
                      <el-table-column prop="model" label="型号"></el-table-column>
                      <el-table-column prop="specs" label="规格"></el-table-column>
                      <el-table-column prop="price" label="价格">
                        <template slot-scope="scope">
                          <span style="color:red">{{scope.row.price}}</span>元
                        </template>
                      </el-table-column>
                      <el-table-column prop="comment" label="备注"></el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else class="nomsg">暂无数据</div>
            <el-form
              v-if="(trimOrderAllDetail.quoteInfo&&trimOrderAllDetail.quoteInfo.officialHome)&&$route.query.editQuote&&butlerVisible"
              :model="fieIdForForm"
              ref="fieIdForForm"
              :rules="trimOrderRules"
              label-width="120px"
            >
              <el-form-item label="成控部工作记录" prop="workRecord">
                <el-input v-model.trim="fieIdForForm.workRecord" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="用户意见" prop="userRecord">
                <el-input v-model.trim="fieIdForForm.userRecord" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitFieIdRor('fieIdForForm')">提交</el-button>
              </el-form-item>
            </el-form>
            <div v-else>
              <template v-for="item in fieIdForList">
                <div class="infoinfoItem" v-if="item.value" :key="item.title">
                  <div class="leftInfo" style="width:120px">{{item.title}}</div>
                  <div class="infoContent" v-html="item.value" style="margin-left:140px"></div>
                </div>
              </template>
            </div>
          </div>
          <div class="infoItem" v-if="orderStep>5||(orderStep==5&&$route.query.editStart&&butlerVisible)">
            <p class="itemTitle">发起流程</p>
            <el-form
              v-if="(orderStep==5||orderStep==6)&&$route.query.editStart&&butlerVisible"
              :model="fieIdFiveForm"
              ref="fieIdFiveForm"
              :rules="trimOrderRules"
              label-width="100px"
            >
              <el-form-item label="装修合同" prop="contractImgs">
                <Uploadimg :imgArr.sync="fieIdFiveForm.contractImgs" />
              </el-form-item>
              <el-form-item label="施工图" prop="constructionImgs">
                <Uploadimg :imgArr.sync="fieIdFiveForm.constructionImgs" />
              </el-form-item>
              <el-form-item label="施工计划" prop="decorateInfoPlan">
                <el-table :data="fieIdFiveForm.decorateOrderBigNodeVoList" border style="width: 600px">
                  <el-table-column prop="nodeName" label="节点名" width="200" align="center"></el-table-column>
                  <el-table-column prop="nodeStep" label="步骤" width="100" align="center"></el-table-column>
                  <el-table-column prop="completeTime" label="计划完成时间" align="center">
                    <template slot-scope="scope">
                      <DateCom
                        :time.sync="scope.row.completeTime"
                        :disable="scope.$index!=0&&!(fieIdFiveForm.decorateOrderBigNodeVoList[scope.$index-1]&&fieIdFiveForm.decorateOrderBigNodeVoList[scope.$index-1].completeTime)"
                        type="date"
                        :clear="false"
                        place="请选择本节点完成时间"
                        :start="(fieIdFiveForm.decorateOrderBigNodeVoList[scope.$index-1]&&fieIdFiveForm.decorateOrderBigNodeVoList[scope.$index-1].completeTime)?new Date(new Date(fieIdFiveForm.decorateOrderBigNodeVoList[scope.$index-1].completeTime).getTime()):new Date(new Date().toDateString())"
                        :end="(fieIdFiveForm.decorateOrderBigNodeVoList[scope.$index+1]&&fieIdFiveForm.decorateOrderBigNodeVoList[scope.$index+1].completeTime)?new Date(new Date(fieIdFiveForm.decorateOrderBigNodeVoList[scope.$index+1].completeTime).getTime()-3600*1000*24):null"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitFieIdFive('fieIdFiveForm')">提交</el-button>
              </el-form-item>
            </el-form>
            <div v-else>
              <template v-for="item in fieIdFiveList">
                <div class="infoinfoItem" v-if="item.value" :key="item.title">
                  <div class="leftInfo">{{item.title}}</div>
                  <div class="infoContent imageContent">
                    <Thumbnail v-for="it in item.value" :key="it" :image="it" :h="150" :w="150" />
                  </div>
                </div>
              </template>
              <div class="infoinfoItem">
                <div class="leftInfo">施工计划</div>
                <div class="infoContent">
                  <el-table :data="fieIdFiveForm.decorateOrderBigNodeVoList" border style="width: 600px">
                    <el-table-column prop="nodeName" label="节点名" width="200" align="center"></el-table-column>
                    <el-table-column prop="nodeStep" label="步骤" width="100" align="center"></el-table-column>
                    <el-table-column prop="completeTime" label="计划完成时间" align="center"></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="infoItem" v-show="processAlter">
          <el-form :model="fieIdThrForm" class="orderPrice" ref="fieIdThrForm" :rules="trimOrderRules">
            <div class="infoinfoItem">
              <div class="leftInfo">装修分账</div>
              <div class="infoContent">
                <span>总价：</span>
                <span class="red" style="margin-right:20px" v-if="orderTotalPrice">¥{{(this.orderTotalPrice/100).toFixed(2)}}</span>
                <PrecisionInput
                  v-if="(!isSuccess)&&isFalse"
                  :num.sync="fieIdThrForm.decorateOrderAccountPriceVo.orderCost"
                  type="price"
                  placeholder="请输入成本价"
                  :width="130"
                  @getNum="handleChangeOrderCost"
                  text="元"
                />
              </div>
            </div>
            <div class="infoinfoItem" v-if="fieIdThrForm.decorateOrderAccountPriceVo.orderCost&&isSuccess">
              <div class="leftInfo">装修分账</div>
              <div class="infoContent">
                <p>
                  <span>毛利润：</span>
                  <span class="red" style="margin-right:20px">¥{{(fieIdThrForm.decorateOrderAccountPriceVo.grossProfit/100).toFixed(2)}}</span>
                  <span>成本价：</span>
                  <span class="red" style="margin-right:20px">¥{{(fieIdThrForm.decorateOrderAccountPriceVo.orderCost/100).toFixed(2)}}</span>
                  <el-button type="primary" @click="handleInputAgain" style="margin-right:20px">重新输入成本价</el-button>
                  <span>剩余成本：</span>
                  <span class="red" style="margin-right:20px">¥{{(fieIdThrForm.decorateOrderAccountPriceVo.remainCost/100).toFixed(2)}}</span>
                </p>
                <el-table :data="bigNodeMoneyList" border style="width: 100%">
                  <el-table-column prop="nodeName" label="节点名" width="200" align="center"></el-table-column>
                  <el-table-column prop="nodeStep" label="步骤" width="100" align="center"></el-table-column>
                  <el-table-column prop="setProfitList" label="设置服务商分账" align="center">
                    <template slot-scope="scope">
                      <SetProfitTags
                        :arrData="scope.row.setProfitList"
                        :remainCost="fieIdThrForm.decorateOrderAccountPriceVo.remainCost"
                        :isAlter="true"
                        :bigNodeId="scope.row.originalId"
                        @addProfit="handleAddProfit"
                      />
                    </template>
                  </el-table-column>
                </el-table>
                <p>
                  <span>项目经理：</span>
                  <PrecisionInput
                    v-if="isFalse"
                    :num.sync="fieIdThrForm.decorateOrderAccountPriceVo.projectManagerAccountPaid"
                    type="price"
                    placeholder="请输入项目经理分账数"
                    :width="190"
                    text="元"
                  />
                </p>
                <el-button type="primary" @click="processAlter=false">返回上一步</el-button>
                <el-button type="primary" @click="submitFieIdThr('fieIdThrForm')">提交</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getdecorateOrderOne,
  updateDecorateOrderPlan,
  getDecorateDictProcess,
  getDecorateProcessListByCate,
  getProjectManagerAll,
  addDecorateOrderDecorateProcess,
  updateDecorateOrderDecorateProcess,
  addDecorateOrderQuote,
  updateDecorateOrderQuote,
  getBigNodeByProcessId,
  addDecorateOrderInfoNew,
  updateDecorateOrderInfoNew
} from "../../../api/trim";
import Uploadimg from "../../../components/uploadImg";
import Thumbnail from "../../../components/thumbnail";
import DateCom from "../../../components/dateCom";
import SetProfitTags from "../../../components/setProfitTags";
import PrecisionInput from "../../../components/precisionInput";
import { mapGetters } from "vuex";
export default {
  components: { Uploadimg, Thumbnail, PrecisionInput, DateCom, SetProfitTags },
  data() {
    return {
      /**
       * 1 订单创建
       * 2 已确定方案
       * 3 已确定报价
       * 4 已确定签约
       * 5 已配置流程
       * 6 发起流程
       * 7 装修中
       * 8 装修完毕
       * 9 装修终止
       */
      orderStep: 0 /* 页面上的订单步骤 通过订单的状态来判断 */,
      cateList: [] /* 装修分类列表 */,
      cateId: "",
      processList: [] /* 装修流程列表 */,
      pmList: [] /* 项目经理列表 */,
      processAlter: false,
      fieIdTwoForm: { decorateOrderId: "", quoteId: "" /* 方案id */, userOpinion: "" /* 用户意见 */ },
      orderTotalPrice: undefined /* 订单总价 在确认报价之后需要赋值 */,
      isSuccess: false /* 是否成功输入订单成本价 */,
      isFalse: true /* 输入错误时修改 */,
      bigNodeMoneyList: [],
      fieIdThrForm: {
        decorateOrderId: "",
        originalId: "" /* 装修流程模板id */,
        pmPhone: "" /* 项目经理 */,
        decorateOrderAccountPriceVo: {
          orderCost: undefined /* 订单成本 */,
          decorateOrderId: "",
          remainCost: undefined /* 订单剩余成本 */,
          grossProfit: undefined /* 毛利润 */,
          projectManagerAccountPaid: undefined /* 项目经理分账数 */,
          decorateAccountingRecordsVoList: [
            // {
            //   bigNodeId: "" /* 大节点id */,
            //   serviceAccount: "" /* 服务商id */,
            //   accountPaid: undefined,
            //   type: "" /* 0 服务商 1 业主 2 项目经理 */
            // }
          ] /* 节点list */
        } /* 这些钱的数据 */
      },
      fieIdForForm: { decorateOrderId: "", userRecord: "" /* 用户意见 */, workRecord: "" /* 成控部工作记录 */ },
      fieIdFiveForm: {
        decorateOrderId: "",
        contractImgs: "" /* 装修合同图 */,
        constructionImgs: "" /* 施工图 */,
        decorateOrderBigNodeVoList: []
      },
      /** 基本信息 */
      fieIdOneList: [
        { title: "业主", value: "" },
        { title: "管家", value: "" },
        { title: "小区", value: "" },
        { title: "位置", value: "" },
        { title: "定金", value: "" },
        { title: "价格", value: "" },
        { title: "状态", value: "" }
      ],
      /** 方案 */
      fieIdTwoList: [
        { title: "方案", value: "" },
        { title: "3D图链接地址", value: "" },
        { title: "用户意见", value: "" }
      ],
      /** 装修流程 */
      fieIdThrList: [
        { title: "装修流程", value: "" },
        { title: "项目经理", value: "" }
      ],
      /** 报价 */
      fieIdForList: [
        { title: "成控部工作记录", value: "" },
        { title: "用户意见", value: "" }
      ],
      /** 发起流程 */
      fieIdFiveList: [
        { title: "装修合同", value: "" },
        { title: "施工图", value: "" }
      ],
      /** 签约 */
      signInfo: "" /* 签约信息 */,
      expandKey: [],
      itemList: [
        { title: "基装", key: "base" },
        { title: "主材", key: "main" },
        { title: "家具", key: "furniture" },
        { title: "家电", key: "electrica" },
        { title: "窗帘", key: "curtain" },
        { title: "灯具", key: "lamps" }
      ],
      trimOrderAllDetail: {},
      trimOrderRules: {}
    };
  },
  watch: {
    "fieIdThrForm.decorateOrderAccountPriceVo.projectManagerAccountPaid": {
      handler() {
        let serTotal = 0;
        this.bigNodeMoneyList.forEach(item => {
          item.setProfitList.forEach(it => {
            serTotal = serTotal + it.accountPaid;
          });
        });
        if (this.fieIdThrForm.decorateOrderAccountPriceVo.projectManagerAccountPaid) {
          this.fieIdThrForm.decorateOrderAccountPriceVo.remainCost =
            this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost -
            this.fieIdThrForm.decorateOrderAccountPriceVo.projectManagerAccountPaid -
            serTotal;
        } else {
          this.fieIdThrForm.decorateOrderAccountPriceVo.remainCost =
            this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost - serTotal;
        }
        if (this.fieIdThrForm.decorateOrderAccountPriceVo.remainCost < 0) {
          this.fieIdThrForm.decorateOrderAccountPriceVo.projectManagerAccountPaid = undefined;
          this.$message.error("剩余成本不足，请重新输入");
          this.refreshNum();
        }
      },
      deep: true
    }
  },
  created() {
    this.trimOrderRules = {
      // planId: [{ required: true, validator: this.checkPlan, trigger: "blur" }],
      userOpinion: [
        { required: true, message: "请输入用户意见", trigger: "blur" },
        { max: 250, message: "用户意见不超过250字", trigger: "submit" }
      ],
      originalId: [{ required: true, validator: this.checkOringin, trigger: "blur" }],
      pmPhone: [{ required: true, message: "请选择项目经理", trigger: "blur" }],
      workRecord: [
        { required: true, message: "请输入成控部工作记录", trigger: "blur" },
        { max: 250, message: "成控部工作记录不超过250字", trigger: "submit" }
      ],
      userRecord: [
        { required: true, message: "请输入用户意见", trigger: "blur" },
        { max: 250, message: "用户意见不超过250字", trigger: "submit" }
      ],
      contractImgs: [{ required: true, message: "请上传装修合同", trigger: "blur" }],
      constructionImgs: [{ required: true, message: "请上传施工图", trigger: "blur" }],
      decorateInfoPlan: [{ validator: this.checkDecoratePlan, trigger: "submit" }]
    };
  },
  computed: {
    ...mapGetters({
      butlerVisible: "onGetIsButler",
      operateVisible: "onGetIsOperate",
      managerVisible: "onGetIsManager"
    })
  },
  mounted() {
    getdecorateOrderOne(this.$route.query.id).then(data => {
      if (data.data.status == 0) {
        this.trimOrderAllDetail = data.data.data;
        switch (this.trimOrderAllDetail.orderStatus) {
          case 1:
            this.orderStep = 1;
            this.fieIdOneList[6].value = `<span style="color:red">订单创建</span>`;
            break;
          case 2:
            this.fieIdOneList[6].value = `<span style="color:red">已下定</span>`;
            break;
          case 3:
            this.orderStep = 2;
            this.fieIdOneList[6].value = `<span style="color:red">已确定方案</span>`;
            break;
          case 4:
            this.orderStep = 5;
            this.fieIdOneList[6].value = `<span style="color:red">已配置流程</span>`;
            break;
          case 5:
            this.orderStep = 3;
            this.fieIdOneList[6].value = `<span style="color:red">已确定报价</span>`;
            break;
          case 6:
            this.orderStep = 6;
            this.fieIdOneList[6].value = `<span style="color:red">发起流程</span>`;
            break;
          case 7:
            this.orderStep = 7;
            this.fieIdOneList[6].value = `<span style="color:red">装修中</span>`;
            break;
          case 8:
            this.orderStep = 8;
            this.fieIdOneList[6].value = `<span style="color:red">装修完毕</span>`;
            break;
          case 9:
            this.orderStep = 4;
            this.fieIdOneList[6].value = `<span style="color:red">已确定签约</span>`;
            break;
          default:
            break;
        }
        if (this.trimOrderAllDetail.endStatus == 1) {
          this.fieIdOneList[6].value = `<span style="color:red">装修终止</span>`;
        }
        this.fieIdOneList[0].value = `${this.trimOrderAllDetail.ownerPhone}，${this.trimOrderAllDetail.ownerName}`;
        this.fieIdOneList[1].value = `${this.trimOrderAllDetail.keeperId}，${this.trimOrderAllDetail.keeperName}`;
        this.fieIdOneList[2].value = `${this.trimOrderAllDetail.villageTitle}，${
          this.trimOrderAllDetail.houseNumber
        }，${
          this.trimOrderAllDetail.roomNum
            ? this.trimOrderAllDetail.roomNumDesc
            : "" + this.trimOrderAllDetail.hallNum
            ? this.trimOrderAllDetail.hallNumDesc
            : "" + this.trimOrderAllDetail.toiletNum
            ? this.trimOrderAllDetail.toiletNumDesc
            : ""
        }，${this.trimOrderAllDetail.acreage + "㎡"}，${this.trimOrderAllDetail.styleDesc}`;
        this.fieIdOneList[3].value = `${
          this.trimOrderAllDetail.villageProvince ? this.trimOrderAllDetail.villageProvince : ""
        }${this.trimOrderAllDetail.villageCity ? this.trimOrderAllDetail.villageCity : ""}${
          this.trimOrderAllDetail.villageDistrict ? this.trimOrderAllDetail.villageDistrict : ""
        }`;
        this.fieIdOneList[4].value = `<span style="color:red">¥${(this.trimOrderAllDetail.earnestMoney / 100).toFixed(
          2
        )}</span>`;
        this.fieIdOneList[5].value = this.trimOrderAllDetail.decoratePrice
          ? `<span style="color:red">¥${(this.trimOrderAllDetail.decoratePrice / 1000000).toFixed(2)}万</span>`
          : this.trimOrderAllDetail.quoteInfo &&
            this.trimOrderAllDetail.quoteInfo.officialHome &&
            this.trimOrderAllDetail.quoteInfo.officialHome.totalPrice
          ? `<span style="color:red">¥${(this.trimOrderAllDetail.quoteInfo.officialHome.totalPrice / 10000).toFixed(
              2
            )}万</span>`
          : null;
        /* 首次配置流程之后订单价格 取定死的订单价格 不取方案里面的价格 */
        if (this.trimOrderAllDetail.decoratePrice) {
          this.orderTotalPrice = this.trimOrderAllDetail.decoratePrice;
        } else if (
          this.trimOrderAllDetail.quoteInfo &&
          this.trimOrderAllDetail.quoteInfo.officialHome &&
          this.trimOrderAllDetail.quoteInfo.officialHome.totalPrice
        ) {
          this.orderTotalPrice = this.trimOrderAllDetail.quoteInfo.officialHome.totalPrice * 100;
        } else {
          this.orderTotalPrice = undefined;
        }
        /* 已确定方案之后 */
        if (this.orderStep > 0) {
          this.fieIdTwoList[0].value = `<span>${this.trimOrderAllDetail.decorateOrderPlan.title}</span>${
            this.trimOrderAllDetail.quoteInfo && this.trimOrderAllDetail.quoteInfo.officialHome
              ? "<span class='alreadyQuote'>已报价</span>"
              : "<span class='yetQuote'>未报价</span>"
          }`;
          this.fieIdTwoList[1].value = this.trimOrderAllDetail.decorateOrderPlan.planUrl
            ? `<a href="${this.trimOrderAllDetail.decorateOrderPlan.planUrl}" target="_blank">${this.trimOrderAllDetail.decorateOrderPlan.planUrl}</a>`
            : null;
          this.fieIdTwoList[2].value = this.trimOrderAllDetail.decorateOrderPlan.userOpinion;
          /* 修改方案 */
          if (this.orderStep == 1 || this.orderStep == 2) {
            this.fieIdTwoForm.userOpinion = this.trimOrderAllDetail.decorateOrderPlan.userOpinion;
            this.fieIdTwoForm.id = this.trimOrderAllDetail.decorateOrderPlan.id;
          }
          /* 配置/修改装修流程 */
          if (this.orderStep == 4 || this.orderStep == 5) {
            getDecorateDictProcess().then(data => {
              if (data.data.status == 0) {
                this.cateList = data.data.data;
              }
            });
            getProjectManagerAll().then(data => {
              if (data.data.status == 0) {
                this.pmList = data.data.data;
              }
            });
          }
        }
        /* 已确认报价之后 */
        if (this.orderStep > 2) {
          this.fieIdForList[0].value = this.trimOrderAllDetail.decorateOrderQuote.workRecord;
          this.fieIdForList[1].value = this.trimOrderAllDetail.decorateOrderQuote.userRecord;
          /* 修改报价 */
          this.fieIdForForm = {
            workRecord: this.trimOrderAllDetail.decorateOrderQuote.workRecord,
            userRecord: this.trimOrderAllDetail.decorateOrderQuote.userRecord,
            id: this.trimOrderAllDetail.decorateOrderQuote.id
          };
        }
        /* 已确认签约之后 显示签约信息 */
        if (this.orderStep > 3) {
          this.signInfo = this.trimOrderAllDetail.signInfo;
        }
        /* 已确认签约后 */
        if (this.orderStep > 4) {
          /* 配置装修流程 修改装修流程 */
          this.fieIdThrList[0].value = this.trimOrderAllDetail.decorateOrderDecorateProcess.processName;
          this.fieIdThrList[1].value = `${this.trimOrderAllDetail.pmName ? this.trimOrderAllDetail.pmName + "，" : ""}${
            this.trimOrderAllDetail.pmPhone ? this.trimOrderAllDetail.pmPhone : "无"
          }，分账 <span class='red'>¥${(
            this.trimOrderAllDetail.decorateOrderAccountPriceVo.projectManagerAccountPaid / 100
          ).toFixed(2)}</span>`;
          this.fieIdThrForm = {
            originalId: this.trimOrderAllDetail.decorateOrderDecorateProcess.originalId,
            pmPhone: this.trimOrderAllDetail.decorateOrderDecorateProcess.pmPhone,
            decorateOrderAccountPriceVo: this.trimOrderAllDetail.decorateOrderAccountPriceVo
          };
          this.trimOrderAllDetail.decorateOrderAccountPriceVo &&
            this.trimOrderAllDetail.decorateOrderAccountPriceVo.bigNodeVoList &&
            (this.bigNodeMoneyList = this.trimOrderAllDetail.decorateOrderAccountPriceVo.bigNodeVoList.map(item => {
              item["setProfitList"] = item.decorateAccountingRecordsVoList || new Array();
              return item;
            }));
          this.isSuccess = true;
          if (this.orderStep == 5) {
            this.cateId = this.trimOrderAllDetail.decorateOrderDecorateProcess.processClassify;
            this.processList.push({
              processName: this.trimOrderAllDetail.decorateOrderDecorateProcess.processName,
              id: this.trimOrderAllDetail.decorateOrderDecorateProcess.originalId
            });
          }
        }
        /* 已发起流程之后 */
        if (this.orderStep > 4) {
          /* 获取节点和图片 */
          this.fieIdFiveForm = {
            contractImgs:
              this.trimOrderAllDetail.decorateOrderInfo && this.trimOrderAllDetail.decorateOrderInfo.contractImgs
                ? this.trimOrderAllDetail.decorateOrderInfo.contractImgs
                : "",
            constructionImgs:
              this.trimOrderAllDetail.decorateOrderInfo && this.trimOrderAllDetail.decorateOrderInfo.constructionImgs
                ? this.trimOrderAllDetail.decorateOrderInfo.constructionImgs
                : "",
            id:
              this.trimOrderAllDetail.decorateOrderInfo && this.trimOrderAllDetail.decorateOrderInfo.id
                ? this.trimOrderAllDetail.decorateOrderInfo.id
                : undefined,
            decorateOrderBigNodeVoList: this.trimOrderAllDetail.decorateOrderBigNodeEntity
              ? this.trimOrderAllDetail.decorateOrderBigNodeEntity
              : []
          };
          if (this.orderStep == 6) {
            this.fieIdFiveList[0].value = this.trimOrderAllDetail.decorateOrderInfo.contractImgs.split(",");
            this.fieIdFiveList[1].value = this.trimOrderAllDetail.decorateOrderInfo.constructionImgs.split(",");
          }
        }
      }
    });
  },
  methods: {
    checkDecoratePlan(rule, value, callback) {
      this.fieIdFiveForm.decorateOrderBigNodeVoList.map(it => {
        if (it.completeTime == null) {
          callback(new Error("请设置所有节点的计划完成时间"));
        }
      });
      callback();
    },
    checkPlan(rule, value, callback) {
      if (this.planItem.id) {
        callback();
      } else {
        callback(new Error("请输入选择方案"));
      }
    },
    checkOringin(rule, value, callback) {
      if (this.fieIdThrForm.originalId) {
        callback();
      } else {
        callback(new Error("请选择装修流程"));
      }
    },
    searchProcess(val) {
      this.fieIdThrForm.originalId = "";
      if (val !== null && val !== undefined) {
        getDecorateProcessListByCate(val).then(data => {
          if (data.data.status == 0) {
            this.processList = data.data.data;
          }
        });
      }
    },
    /** 改变流程时获取节点列表 */
    handleGetNode(val) {
      if (val !== null && val !== undefined) {
        getBigNodeByProcessId(val).then(data => {
          if (data.data.status == 0) {
            this.bigNodeMoneyList = data.data.data.map(item => {
              let { id, nodeName, nodeStep } = item;
              let obj = {};
              obj = { originalId: id, nodeName, nodeStep, setProfitList: new Array() };
              return obj;
            });
            this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost = undefined;
            this.handleChangeOrderCost();
          }
        });
      }
    },
    /** 下一步 */
    handleNextStep() {
      new Promise((resolve, reject) => {
        if (!this.fieIdThrForm.originalId) {
          reject("请选择装修流程");
        }
        if (!this.fieIdThrForm.pmPhone) {
          reject("请选择项目经理");
        }
        resolve();
      })
        .then(() => {
          this.processAlter = true;
        })
        .catch(res => {
          this.$message.warning(res);
        });
    },
    /** 重新输入按钮 */
    handleInputAgain() {
      this.$confirm("重新输入成本价后所有分账设置也会清空，确认重新输入吗？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isSuccess = false;
          this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost = undefined;
        })
        .catch(() => {});
    },
    refreshNum() {
      this.isFalse = false;
      this.$nextTick(() => {
        this.isFalse = true;
      });
    },
    /** 成本价改变触发 */
    handleChangeOrderCost() {
      if (
        this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost == null ||
        this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost == undefined ||
        this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost <= 0
      ) {
        /* 没有输入成本价时，下面的所有价格都清空 */
        this.isSuccess = false;
        this.fieIdThrForm.decorateOrderAccountPriceVo.grossProfit = undefined;
        this.fieIdThrForm.decorateOrderAccountPriceVo.remainCost = undefined;
        this.fieIdThrForm.decorateOrderAccountPriceVo.projectManagerAccountPaid = undefined;
        this.bigNodeMoneyList.forEach(it => {
          it.setProfitList = new Array();
        });
        if (this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost == 0) {
          this.$message.warning("装修成本不能小于等于0");
        }
      } else if (this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost > this.orderTotalPrice) {
        this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost = undefined;
        this.$message.error("成本价不能大于总价");
        this.refreshNum();
        /* 输入错误也会清空 */
        this.isSuccess = false;
        this.fieIdThrForm.decorateOrderAccountPriceVo.grossProfit = undefined;
        this.fieIdThrForm.decorateOrderAccountPriceVo.remainCost = undefined;
        this.fieIdThrForm.decorateOrderAccountPriceVo.projectManagerAccountPaid = undefined;
        this.bigNodeMoneyList.forEach(it => {
          it.setProfitList = new Array();
        });
      } else {
        /* 输入成功之后 有利润和剩余成本的赋值 */
        this.fieIdThrForm.decorateOrderAccountPriceVo.grossProfit =
          this.orderTotalPrice - this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost;
        this.fieIdThrForm.decorateOrderAccountPriceVo.remainCost = this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost;
        /* 清空项目经理和服务商 */
        this.fieIdThrForm.decorateOrderAccountPriceVo.projectManagerAccountPaid = undefined;
        this.bigNodeMoneyList.forEach(it => {
          it.setProfitList = new Array();
        });
        this.isSuccess = true;
      }
    },
    /** 添加一个服务商分账的触发函数 改变剩余成本 */
    handleAddProfit() {
      let serTotal = 0;
      this.bigNodeMoneyList.forEach(item => {
        item.setProfitList.forEach(it => {
          serTotal = serTotal + it.accountPaid;
        });
      });
      if (this.fieIdThrForm.decorateOrderAccountPriceVo.projectManagerAccountPaid) {
        this.fieIdThrForm.decorateOrderAccountPriceVo.remainCost =
          this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost -
          this.fieIdThrForm.decorateOrderAccountPriceVo.projectManagerAccountPaid -
          serTotal;
      } else {
        this.fieIdThrForm.decorateOrderAccountPriceVo.remainCost =
          this.fieIdThrForm.decorateOrderAccountPriceVo.orderCost - serTotal;
      }
    },
    expandChange(row) {
      if (this.expandKey.length > 0 && row.key == this.expandKey[0]) {
        this.expandKey = [];
      } else {
        this.expandKey = [row.key];
      }
    },
    /* 修改方案 */
    submitFieIdTwo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.fieIdTwoForm.decorateOrderId = this.trimOrderAllDetail.id;
          this.fieIdTwoForm.quoteId = this.trimOrderAllDetail.decorateOrderPlan.quoteId;
          updateDecorateOrderPlan(this.fieIdTwoForm).then(data => {
            if (data.data.status == 0) {
              this.$message.success("修改初步方案成功");
              this.$router.go(-1);
            } else {
              this.$message.error(data.data.msg);
            }
          });
        }
      });
    },
    /** 添加/修改装修订单流程 */
    submitFieIdThr(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.fieIdThrForm.decorateOrderId = this.trimOrderAllDetail.id;
          this.fieIdThrForm.decorateOrderAccountPriceVo.decorateOrderId = this.trimOrderAllDetail.id;
          this.fieIdThrForm.decorateOrderAccountPriceVo.decorateAccountingRecordsVoList = new Array();
          this.bigNodeMoneyList.forEach(item => {
            this.fieIdThrForm.decorateOrderAccountPriceVo.decorateAccountingRecordsVoList = this.fieIdThrForm.decorateOrderAccountPriceVo.decorateAccountingRecordsVoList.concat(
              item.setProfitList
            );
          });
          if (this.orderStep == 4) {
            this.fieIdThrForm["decoratePrice"] = this.orderTotalPrice;
            addDecorateOrderDecorateProcess(this.fieIdThrForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success("添加装修订单流程成功");
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          } else if (this.orderStep == 5) {
            updateDecorateOrderDecorateProcess(this.fieIdThrForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success("修改装修订单流程成功");
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          }
        }
      });
    },
    /* 确定/修改报价 */
    submitFieIdRor(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.fieIdForForm.decorateOrderId = this.trimOrderAllDetail.id;
          if (this.orderStep == 2) {
            addDecorateOrderQuote(this.fieIdForForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success("确认报价成功");
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          } else {
            updateDecorateOrderQuote(this.fieIdForForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success("修改报价成功");
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          }
        }
      });
    },
    /** 发起流程 */
    submitFieIdFive(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            "发起流程后，用户将在App上看到所有订单相关信息。用户确认后，订单将进入正式装修流程，确认发起流程吗？",
            {
              confirmButtonText: "确认发起",
              cancelButtonText: "取消",
              center: true
            }
          )
            .then(() => {
              this.fieIdFiveForm.decorateOrderId = this.trimOrderAllDetail.id;
              if (this.orderStep == 5) {
                addDecorateOrderInfoNew(this.fieIdFiveForm).then(data => {
                  if (data.data.status == 0) {
                    this.$message.success("发起装修成功");
                    this.$router.go(-1);
                  } else {
                    this.$message.error(data.data.msg);
                  }
                });
              } else if (this.orderStep == 6) {
                updateDecorateOrderInfoNew(this.fieIdFiveForm).then(data => {
                  if (data.data.status == 0) {
                    this.$message.success("修改施工信息");
                    this.$router.go(-1);
                  } else {
                    this.$message.error(data.data.msg);
                  }
                });
              }
            })
            .catch(() => {
              this.$message("已取消发起");
            });
        }
      });
    }
  }
};
</script>

<style lang='less'>
#trimOrderDetail {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      padding: 0;
      .clearfix {
        width: calc(~"100% - 40px");
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
      }
    }
    .content {
      .red {
        color: red;
      }
      .orderPrice {
        .el-form-item {
          display: inline-block;
          margin-bottom: 0;
        }
      }
      .infoItem {
        width: 100%;
        .alreadyQuote {
          margin-left: 30px;
          color: #d9001b;
        }
        .yetQuote {
          margin-left: 30px;
          color: #aaaaaa;
        }
        p.itemTitle {
          font-size: 16px;
          padding-left: 6px;
          position: relative;
        }
        p.itemTitle::before {
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background-color: red;
          content: "";
        }
        .infoinfoItem {
          // height: 35px;
          font-size: 16px;
          line-height: 35px;
          .leftInfo {
            height: 100%;
            width: 100px;
            float: left;
            text-align: right;
          }
          .infoContent {
            // height: 35px;
            width: calc(~"100% - 120px");
            margin-left: 120px;
          }
          .imageContent {
            height: 160px;
            // margin: 0 10px 0 10px;
            .el-image {
              margin: 0 10px 10px 0;
            }
          }
        }
        .planFormItem {
          p {
            margin: 0;
          }
          margin-bottom: 0;
        }
        .nomsg {
          width: 100%;
          height: 250px;
          line-height: 250px;
          text-align: center;
        }
        .msgbox {
          width: 100%;
          margin-bottom: 20px;
          .space {
            border: 1px solid #333;
            .spacehead {
              padding: 10px 20px;
              display: flex;
              justify-content: space-between;
              p {
                margin: 0;
              }
              .spaceprice {
                display: flex;
                justify-content: space-between;
                width: 300px;
              }
            }
            .spacecontent {
              * {
                margin: 0;
                padding: 0;
              }
              border-top: 1px solid #333;
              ul {
                list-style: none;
                .contentLi {
                  display: flex;
                  justify-content: space-between;
                  padding: 10px 20px;
                  position: relative;
                }
                .contentLi::before {
                  display: block;
                  position: absolute;
                  bottom: 0;
                  width: calc(~"100% - 40px");
                  height: 1px;
                  content: "";
                  background-color: #333;
                }
                .contentLi:last-child::before {
                  display: none;
                }
              }
            }
          }
          .el-table {
            border: 1px solid #ddd;
          }
        }
      }
    }
  }
}
</style>