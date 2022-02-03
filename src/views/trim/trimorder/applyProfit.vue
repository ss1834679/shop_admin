<template>
  <div id="applyProfit">
    <!-- 申请分账 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title">申请分账</span>
        </div>
      </div>
      <div class="content">
        <div class="orderDetailsDiv">
          <div class="infoItem">
            <p class="itemTitle">基本信息</p>
            <div>
              <template v-for="item in orderDetailsList">
                <div class="infoinfoItem" v-if="item.value" :key="item.title">
                  <div class="leftInfo">{{item.title}}</div>
                  <div class="infoContent" v-html="item.value"></div>
                </div>
              </template>
            </div>
          </div>
          <div class="imgDiv">
            <p>户型图</p>
            <img v-for="(it,index) in imglist" :key="index" :src="it" />
          </div>
        </div>
        <div class="infoItem">
          <p class="itemTitle">装修流程</p>
          <div>
            <template v-for="item in processList">
              <div class="infoinfoItem" v-if="item.value" :key="item.title">
                <div class="leftInfo">{{item.title}}</div>
                <div class="infoContent" v-html="item.value"></div>
              </div>
            </template>
            <div class="infoinfoItem">
              <div class="leftInfo">请选择分账对象</div>
              <div class="formTable">
                <el-radio-group v-model="profitObject">
                  <el-radio :label="1">已设置的服务商</el-radio>
                  <el-radio :label="2">其他服务商</el-radio>
                </el-radio-group>
              </div>
            </div>
            <el-form :model="selectedProfit" ref="subForm" :rules="subFormRules">
              <div class="outofItem">
                <el-form-item prop="profitPeople">
                  <el-table :data="profitDataList" border style="width:680px">
                    <el-table-column prop="nodeName" label="节点名" align="center" width="180px"></el-table-column>
                    <el-table-column prop="nodeStep" label="步骤" align="center"></el-table-column>
                    <el-table-column label="设置服务商分账" align="center" width="400px">
                      <template slot-scope="scope">
                        <el-select
                          v-if="scope.row.decorateAccountingRecordsVoList"
                          v-model="scope.row.select"
                          @change="(event)=>{handleChangeSelect(event,scope.row)}"
                          value-key="mobile"
                          placeholder="请选择服务商"
                          clearable
                          :disabled="profitObject==2"
                        >
                          <el-option
                            v-for="(item,index) in scope.row.decorateAccountingRecordsVoList"
                            :key="index"
                            :label="item.mobile"
                            :value="item"
                          >
                            <span>{{`${item.roleName}：${item.name}，${item.mobile}${item.accountPaid?'，应分¥'+(item.accountPaid/100).toFixed(2):''}${item.remaining===null?'':'，剩余¥'+(item.remaining/100).toFixed(2)}`}}</span>
                          </el-option>
                        </el-select>
                        <span v-else>无服务商</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button @click="handleProManager" :disabled="profitObject==2" v-html="proManageText" v-if="proManageText" style="margin:10px 0"></el-button>
                  <div class="setProfit">
                    <div v-if="profitObject==1">
                      <p style="color:red">请选择一个服务商或项目经理，并为其申请分账！</p>
                      <div v-if="selectedProfit.mobile" class="selectform">
                        <span>{{selectedProfit.roleName}}：{{selectedProfit.name}}，{{selectedProfit.mobile}}</span>
                        <span>{{selectedProfit.accountPaid?'，应分':''}}</span>
                        <span style="color:red">{{selectedProfit.accountPaid?'¥'+(selectedProfit.accountPaid/100).toFixed(2):''}}</span>
                        <span>{{selectedProfit.remaining===null?'':'，剩余'}}</span>
                        <span style="color:red">{{selectedProfit.remaining===null?'':'¥'+(selectedProfit.remaining/100).toFixed(2)}}</span>
                        <el-form-item class="inlineForm" prop="profitMoney">
                          <PrecisionInput
                            style="margin-left:10px"
                            :num.sync="profitMoney"
                            text="元"
                            :placeholder="`请输入申请分账数，不超过¥ ${selectedProfit.remaining?(selectedProfit.remaining/100).toFixed(2):(selectedProfit.accountPaid/100).toFixed(2)}`"
                            :width="300"
                            type="price"
                          />
                        </el-form-item>
                      </div>
                    </div>
                    <div v-if="profitObject==2">
                      <el-select
                        v-model="selectedProfit"
                        filterable
                        remote
                        value-key="id"
                        :remote-method="searchProAndSerByPhone"
                        placeholder="输入服务商或项目经理手机号"
                        style="margin-right:10px"
                      >
                        <el-option v-for="item in selectProAndSerList" :key="item.id" :label="item.mobile" :value="item">
                          <span>{{`${item.roleName}：${item.name}，${item.mobile}`}}</span>
                        </el-option>
                      </el-select>
                      <el-form-item class="inlineForm" prop="profitMoney">
                        <PrecisionInput :num.sync="profitMoney" text="元" placeholder="请输入申请分账数" :width="300" type="price" />
                      </el-form-item>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item prop="profitMark">
                  <el-input type="textarea" style="width:450px" :rows="6" placeholder="请输入申请分账备注" v-model.trim="profitMark"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitProfitForm('subForm')">确认分账</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getDecorateDictProcess,
  getDecorateProcessPage,
  updateDecorateProcessIsEnable,
  deleteDecorateProcess,
  getdecorateOrderOne,
  applyServiceAccountDecorateOrder,
  getSelectServiceOrProjectManagerByMobile
} from "../../../api/trim";
import PrecisionInput from "../../../components/precisionInput";
export default {
  components: { PrecisionInput },
  data() {
    return {
      profitDataList: [] /* 各个节点的数据 */,
      proManager: {
        // roleName: "项目经理",
        // name: "老聂",
        // mobile: "1892349234",
        // accountPaid: 9800000,
        // remaining: 2800000
      } /* 项目经理的信息 */,
      proManageText: "" /* 项目经理显示的文本 需要在获取到项目经理时编辑 */,
      trimOrderAllDetail: {},
      profitObject: 1 /* 分账对象 1 已设置的服务商 2 其他服务商 */,
      selectedProfit: {} /* 选中的服务商或者项目经理 */,
      type: null /* 选择的用户类型 0 服务商 2 项目经理 */,
      selectedNodeId: "" /* 选择的服务商 的节点id */,
      profitMoney: undefined /* 申请分账数 */,
      profitMark: "" /* 分账备注 */,
      selectProAndSerList: [] /* 通过电话号码搜索的项目经理和服务商的列表 */,
      orderDetailsList: [
        { title: "业主", value: "" },
        { title: "管家", value: "" },
        { title: "小区", value: "" },
        { title: "位置", value: "" },
        { title: "定金", value: "" },
        { title: "价格", value: "" },
        { title: "状态", value: "" }
      ],
      imglist: [],
      processList: [
        { title: "装修流程", value: "" },
        { title: "项目经理", value: "" },
        { title: "装修分账", value: "" }
      ],
      subFormRules: {}
    };
  },
  watch: {
    profitObject: {
      handler() {
        if (this.profitObject == 2) {
          this.profitDataList.forEach(item => {
            this.$set(item, "select", new Object());
          });
          this.selectedProfit = new Object();
          this.selectedNodeId = "";
          this.profitMoney = undefined;
        }
        this.type = null;
      }
    }
  },
  created() {
    this.subFormRules = {
      profitMoney: [{ validator: this.checkMoney, trigger: "blur" }],
      profitMark: [{ validator: this.checkMark, trigger: "blur" }],
      profitPeople: [{ validator: this.checkPeople, trigger: "blur" }]
    };
  },
  mounted() {
    getdecorateOrderOne(this.$route.query.orderId).then(data => {
      if (data.data.status == 0) {
        this.trimOrderAllDetail = data.data.data;
        switch (this.trimOrderAllDetail.orderStatus) {
          case 1:
            this.orderStep = 1;
            this.orderDetailsList[6].value = `<span style="color:red">订单创建</span>`;
            break;
          case 2:
            this.orderDetailsList[6].value = `<span style="color:red">已下定</span>`;
            break;
          case 3:
            this.orderStep = 2;
            this.orderDetailsList[6].value = `<span style="color:red">已确定方案</span>`;
            break;
          case 4:
            this.orderStep = 5;
            this.orderDetailsList[6].value = `<span style="color:red">已配置流程</span>`;
            break;
          case 5:
            this.orderStep = 3;
            this.orderDetailsList[6].value = `<span style="color:red">已确定报价</span>`;
            break;
          case 6:
            this.orderStep = 6;
            this.orderDetailsList[6].value = `<span style="color:red">发起流程</span>`;
            break;
          case 7:
            this.orderStep = 7;
            this.orderDetailsList[6].value = `<span style="color:red">装修中</span>`;
            break;
          case 8:
            this.orderStep = 8;
            this.orderDetailsList[6].value = `<span style="color:red">装修完毕</span>`;
            break;
          case 9:
            this.orderStep = 4;
            this.orderDetailsList[6].value = `<span style="color:red">已确定签约</span>`;
            break;
          default:
            break;
        }
        if (this.trimOrderAllDetail.endStatus == 1) {
          this.orderDetailsList[6].value = `<span style="color:red">装修终止</span>`;
        }
        this.orderDetailsList[0].value = `${this.trimOrderAllDetail.ownerPhone}，${this.trimOrderAllDetail.ownerName}`;
        this.orderDetailsList[1].value = `${this.trimOrderAllDetail.keeperId}，${this.trimOrderAllDetail.keeperName}`;
        this.orderDetailsList[2].value = `${this.trimOrderAllDetail.villageTitle}，${
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
        this.orderDetailsList[3].value = `${
          this.trimOrderAllDetail.villageProvince ? this.trimOrderAllDetail.villageProvince : ""
        }${this.trimOrderAllDetail.villageCity ? this.trimOrderAllDetail.villageCity : ""}${
          this.trimOrderAllDetail.villageDistrict ? this.trimOrderAllDetail.villageDistrict : ""
        }`;
        this.orderDetailsList[4].value = `<span style="color:red">¥${(
          this.trimOrderAllDetail.earnestMoney / 100
        ).toFixed(2)}</span>`;
        this.orderDetailsList[5].value = this.trimOrderAllDetail.decoratePrice
          ? `<span style="color:red">¥${(this.trimOrderAllDetail.decoratePrice / 1000000).toFixed(2)}万</span>`
          : this.trimOrderAllDetail.quoteInfo &&
            this.trimOrderAllDetail.quoteInfo.officialHome &&
            this.trimOrderAllDetail.quoteInfo.officialHome.totalPrice
          ? `<span style="color:red">¥${(this.trimOrderAllDetail.quoteInfo.officialHome.totalPrice / 10000).toFixed(
              2
            )}万</span>`
          : null;
        this.imglist = this.trimOrderAllDetail.houseImg.split(",");
        this.processList[0].value = `${this.trimOrderAllDetail.decorateOrderDecorateProcess.processName}`;
        this.processList[1].value = `${this.trimOrderAllDetail.pmName}，${this.trimOrderAllDetail.pmPhone}`;
        this.processList[2].value = `<p style='margin:0'>毛利润：<span style='color:red;margin-right:40px'>¥${(
          this.trimOrderAllDetail.decorateOrderAccountPriceVo.grossProfit / 100
        ).toFixed(2)}</span>成本价 <span style='color:red'>¥${(
          this.trimOrderAllDetail.decorateOrderAccountPriceVo.orderCost / 100
        ).toFixed(2)}</span>，已分账<span style='color:red'> ¥${
          this.trimOrderAllDetail.decorateOrderAccountPriceVo.applied
            ? (this.trimOrderAllDetail.decorateOrderAccountPriceVo.applied / 100).toFixed(2)
            : 0
        }</span>，申请中 <span style='color:red'>¥${
          this.trimOrderAllDetail.decorateOrderAccountPriceVo.applying
            ? (this.trimOrderAllDetail.decorateOrderAccountPriceVo.applying / 100).toFixed(2)
            : 0
        }</span>，待分账 <span style='color:red'>¥${
          this.trimOrderAllDetail.decorateOrderAccountPriceVo.waitingNum
            ? (this.trimOrderAllDetail.decorateOrderAccountPriceVo.waitingNum / 100).toFixed(2)
            : 0
        }</span>，用户账户剩余 <span style='color:red'>¥${
          this.trimOrderAllDetail.decorateOrderAccountPriceVo.virtualNum
            ? (this.trimOrderAllDetail.decorateOrderAccountPriceVo.virtualNum / 100).toFixed(2)
            : 0
        }</span></p>`;
        this.profitDataList = this.trimOrderAllDetail.decorateOrderAccountPriceVo.bigNodeVoList;
        this.proManager = {
          roleName: "项目经理",
          name: this.trimOrderAllDetail.pmName,
          mobile: this.trimOrderAllDetail.pmPhone,
          accountPaid: this.trimOrderAllDetail.decorateOrderAccountPriceVo.projectManagerAccountPaid,
          remaining: this.trimOrderAllDetail.decorateOrderAccountPriceVo.projectManagerRemaining,
          serviceAccount: this.trimOrderAllDetail.pmId,
          outUserId: this.trimOrderAllDetail.pmOutUserId // 项目经理和服务商的资金账号
        };
        this.proManageText = `<span>项目经理：${this.proManager.name}，${
          this.proManager.mobile
        }，应分 <i style='color:red'>¥${
          this.proManager.accountPaid ? (this.proManager.accountPaid / 100).toFixed(2) : 0
        } </i></span>`;
      }
    });
  },
  methods: {
    /** item 选择服务商 row 哪一个节点 */
    handleChangeSelect(item, row) {
      this.profitMoney = undefined;
      this.type = 0;
      this.profitDataList.forEach(it => {
        if (row != it) {
          this.$set(it, "select", new Object());
        } else {
          this.selectedProfit = JSON.parse(JSON.stringify(item));
          this.selectedNodeId = row.name;
        }
      });
      this.$refs.subForm.clearValidate();
    },
    handleProManager() {
      this.profitMoney = undefined;
      this.selectedProfit = JSON.parse(JSON.stringify(this.proManager));
      this.profitDataList.forEach(it => {
        this.$set(it, "select", new Object());
      });
      this.type = 2;
      this.$refs.subForm.clearValidate();
    },
    searchProAndSerByPhone(val) {
      if (val !== "") {
        getSelectServiceOrProjectManagerByMobile({ mobile: val }).then(data => {
          this.selectProAndSerList = data.data.data;
        });
      }
    },
    checkMoney(rule, value, callback) {
      if (this.profitObject == 1) {
        if (this.profitMoney == undefined || this.profitMoney == 0 || this.profitMoney == null) {
          callback(new Error("请输入申请分账数！"));
        }
        if (
          this.profitMoney >
          (this.selectedProfit.remaining === null ? this.selectedProfit.accountPaid : this.selectedProfit.remaining)
        ) {
          this.profitMoney = undefined;
          callback(new Error("分账数不可超过剩余成本！"));
        }
      }
      if (this.profitObject == 2) {
        if (this.profitMoney == undefined || this.profitMoney == 0 || this.profitMoney == null) {
          callback(new Error("请输入申请分账数！"));
        }
      }
      if (
        this.profitMoney >
        this.trimOrderAllDetail.decorateOrderAccountPriceVo.virtualNum -
          this.trimOrderAllDetail.decorateOrderAccountPriceVo.applying
      ) {
        callback(new Error("实际剩余款项已不足，请联系客户打款！"));
      }
      callback();
    },
    checkMark(rule, value, callback) {
      if (this.profitMark == undefined || this.profitMark == "" || this.profitMark == null) {
        callback(new Error("请输入申请分账备注！"));
      }
      if (this.profitMark.length > 200) {
        callback(new Error("申请分账备注不能超过200个字！"));
      }
      callback();
    },
    checkPeople(rule, value, callback) {
      if (this.profitObject == 1) {
        if (this.selectedProfit.mobile == undefined || this.selectedProfit.mobile == "") {
          callback(new Error("请选择一个已设置的服务商或项目经理！"));
        }
      }
      if (this.profitObject == 2) {
        if (this.selectedProfit.mobile == undefined || this.selectedProfit.mobile == "") {
          callback(new Error("请输入服务商或项目经理手机号"));
        }
      }
      callback();
    },
    submitProfitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          applyServiceAccountDecorateOrder({
            type: this.type === null ? this.selectedProfit.type : this.type,
            serviceAccount: this.selectedProfit.serviceAccount || this.selectedProfit.id,
            outUserId: this.selectedProfit.outUserId, // 项目经理和服务商的资金账号
            remark: this.profitMark,
            bigNodeId: this.selectedProfit.bigNodeId ? this.selectedProfit.bigNodeId : undefined,
            decorateOrderId: this.$route.query.orderId,
            accountPaid: this.profitMoney
          }).then(data => {
            if (data.data.status == 0) {
              this.$message.success("申请分账成功");
              this.$router.go(-1);
            } else {
              this.$message.error(data.data.msg);
            }
          });
        } else {
          this.$message.warning("请检查是否填完参数");
        }
      });
    }
  }
};
</script>

<style lang='less'>
#applyProfit {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
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
      height: 100%;
      display: flex;
      flex-direction: column;
      .infoItem {
        margin-right: 30px;
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
            width: 120px;
            float: left;
            text-align: right;
          }
          .infoContent {
            // height: 35px;
            width: calc(~"100% - 130px");
            margin-left: 130px;
          }
          .formTable {
            width: calc(~"100% - 130px");
            margin-left: 130px;
          }
        }
      }
      .orderDetailsDiv {
        display: flex;
        margin-bottom: 10px;
        .imgDiv {
          img {
            margin-right: 10px;
            width: 150px;
            height: 150px;
          }
        }
      }
      .moneyDiv {
        margin-bottom: 15px;
      }
      .outofItem {
        margin-left: 60px;
        .managerDiv {
          height: 40px;
          max-width: 100%;
          display: inline-block;
          line-height: 40px;
          margin-top: 5px;
          span {
            display: inline-block;
            padding: 0 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
        }
      }
      .inlineForm {
        display: inline-block;
      }
    }
  }
}
</style>