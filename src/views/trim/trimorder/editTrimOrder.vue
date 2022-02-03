<template>
  <div id="editTrimOrder">
    <!-- 创建装修订单-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title">{{$route.params.routerTitle||"编辑装修订单"}}</span>
        </div>
      </div>

      <div class="content">
        <el-form :model="trimOrderform" ref="trimOrderform" :rules="trimOrderRules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="业主手机号" prop="ownerSelect">
            <span v-if="$route.query.id">{{trimOrderform.ownerPhone}}</span>
            <el-select
              v-else
              v-model="ownerSelect"
              placeholder="请输入业主手机号，将作为用户登录账号"
              @change="handleGetMoney"
              remote
              filterable
              value-key="id"
              :remote-method="handleUserByPhone"
            >
              <el-option v-for="item in prietorList" :key="item.id" :label="item.account" :value="item">
                <span>{{item.name}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业主姓名" v-if="$route.query.id&&trimOrderform.ownerName">
            <span>{{trimOrderform.ownerName}}</span>
          </el-form-item>
          <el-form-item label="业主姓名" v-if="!$route.query.id&&ownerSelect.name">
            <span v-if="ownerSelect.name">{{ownerSelect.name}}</span>
          </el-form-item>
          <el-form-item label="小区名称" prop="communityId">
            <el-select v-model="villageItem" placeholder="请输入小区名搜索" filterable remote value-key="id" :remote-method="selectVillage" clearable>
              <el-option v-for="item in villageList" :key="item.id" :label="item.title" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门牌号" prop="houseNumber">
            <el-input v-model.trim="trimOrderform.houseNumber"></el-input>
          </el-form-item>
          <el-form-item label="面积" prop="acreage">
            <el-input-number v-model="trimOrderform.acreage" :precision="2" :step="0.1" :min="0" :max="9999" :controls="false"></el-input-number>㎡
          </el-form-item>
          <el-form-item label="风格" prop="style">
            <el-select v-model="styleItem" placeholder="请选择风格" value-key="id">
              <el-option v-for="item in houseStyleList" :key="item.id" :label="item.title" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="户型" prop="room">
            <el-select v-model="houseType.roomnum" placeholder="选择室数量">
              <el-option v-for="item in roomList" :key="item.value" :label="item.title" :value="item"></el-option>
            </el-select>
            <el-select v-model="houseType.livingnum" placeholder="选择厅数量">
              <el-option v-for="item in livingList" :key="item.value" :label="item.title" :value="item"></el-option>
            </el-select>
            <el-select v-model="houseType.tolietnum" placeholder="选择卫生间数量">
              <el-option v-for="item in tolietList" :key="item.value" :label="item.title" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="定金" prop="earnestMoney" v-if="trimOrderform.earnestMoney!=null">
            <span style="color:red">¥{{(trimOrderform.earnestMoney/100).toFixed(2)}}</span>
            <!-- <PrecisionInput v-else :num.sync="trimOrderform.earnestMoney" text="元" placeholder="填写定金" type="price" /> -->
          </el-form-item>
          <el-form-item label="户型图" v-if="showImg" prop="houseImg">
            <UploadImg :imgArr.sync="trimOrderform.houseImg" :limit="2" />
          </el-form-item>
          <div class="infoItem">
            <p class="itemTitle">初步方案</p>
            <el-form-item label="选择方案" prop="planId">
              <el-select v-model="planItem" placeholder="请输入方案名称" filterable value-key="id" remote :remote-method="selectPlan">
                <el-option v-for="item in planList" :key="item.id" :label="item.title" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="planItem.planUrl" label="3D链接地址">
              <a :href="planItem.planUrl" target="_blank" v-if="planItem.planUrl">{{planItem.planUrl}}</a>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('trimOrderform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllUsableDecorateStyle } from "../../../api/setings";
import PrecisionInput from "../../../components/precisionInput";
import UploadImg from "../../../components/uploadImg";
import { getAllVillageByPage } from "../../../api/promanage";
import {
  addDecorateOrder,
  getdecorateOrderOne,
  updateDecorateOrder,
  getQuoteListByDecorate,
  getOwnerByPhone
} from "../../../api/trim";
import { getOwnerByOutUserId } from "../../../api/pay";
export default {
  components: { PrecisionInput, UploadImg },
  data() {
    return {
      villageList: [] /* 小区列表 */,
      houseStyleList: [] /* 风格列表 */,
      prietorList: [] /* 业主列表 */,
      planList: [],
      planItem: {},
      showImg: true,
      roomList: [
        { title: "1室", value: 1 },
        { title: "2室", value: 2 },
        { title: "3室", value: 3 },
        { title: "4室", value: 4 },
        { title: "5室", value: 5 },
        { title: "6室", value: 6 },
        { title: "7室", value: 7 },
        { title: "8室", value: 8 },
        { title: "9室", value: 9 },
        { title: "10室", value: 10 }
      ],
      livingList: [
        { title: "0厅", value: 0 },
        { title: "1厅", value: 1 },
        { title: "2厅", value: 2 },
        { title: "3厅", value: 3 },
        { title: "4厅", value: 4 },
        { title: "5厅", value: 5 },
        { title: "6厅", value: 6 },
        { title: "7厅", value: 7 },
        { title: "8厅", value: 8 },
        { title: "9厅", value: 9 },
        { title: "10厅", value: 10 }
      ],
      tolietList: [
        { title: "0卫", value: 0 },
        { title: "1卫", value: 1 },
        { title: "2卫", value: 2 },
        { title: "3卫", value: 3 },
        { title: "4卫", value: 4 },
        { title: "5卫", value: 5 },
        { title: "6卫", value: 6 },
        { title: "7卫", value: 7 },
        { title: "8卫", value: 8 },
        { title: "9卫", value: 9 },
        { title: "10卫", value: 10 }
      ],
      houseType: {
        roomnum: {},
        livingnum: {},
        tolietnum: {}
      },
      styleItem: {},
      villageItem: {},
      trimOrderform: {
        ownerName: "" /* 业主名称	*/,
        ownerPhone: "" /* 业主手机号 */,
        communityId: "" /* 小区id */,
        houseNumber: "" /* 门牌号 */,
        acreage: undefined /* 面积 */,
        style: "" /* 风格id */,
        styleDesc: "" /* 风格title */,
        roomNum: null /* 室数量 */,
        roomNumDesc: "" /* 室描述 */,
        hallNum: null /* 厅数量 */,
        hallNumDesc: "" /* 厅描述 */,
        toiletNum: null /* 卫数量 */,
        toiletNumDesc: "" /* 卫描述 */,
        earnestMoney: null /* 定金 */,
        quoteId: "" /* 方案id */,
        houseImg: "" /* 户型图 */
      },
      ownerSelect: {} /* 选择的用户 */,
      trimOrderRules: {}
    };
  },
  created() {
    this.trimOrderRules = {
      // ownerName: [
      //   { required: true, message: "请输入业主姓名", trigger: "blur" },
      //   { min: 0, max: 5, message: "业主姓名不能大于5个字", trigger: "blur" }
      // ],
      // ownerPhone: [
      //   { required: true, message: "请输入业主手机号", trigger: "blur" },
      //   { validator: this.$checkPhone, trigger: "blur" }
      // ],
      ownerSelect: [{ required: true, validator: this.checkOwner, trigger: "submit" }],
      communityId: [{ required: true, validator: this.checkVillage, trigger: "blur" }],
      houseNumber: [{ required: true, message: "请输入门牌号", trigger: "blur" }],
      acreage: [{ required: true, message: "请输入面积", trigger: "blur" }],
      style: [{ required: true, validator: this.checkStyle, trigger: "blur" }],
      room: [{ required: true, validator: this.checkRoom, trigger: "blur" }],
      earnestMoney: [{ required: true, message: "请输入定金", trigger: "blur" }, { validator: this.checkMoney }],
      houseImg: [{ required: true, message: "请上传户型图", trigger: "blur" }],
      planId: [{ required: true, validator: this.checkQuote, trigger: "change" }]
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getdecorateOrderOne(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          let {
            id,
            acreage,
            ownerName,
            ownerPhone,
            communityId,
            houseNumber,
            style,
            styleDesc,
            roomNum,
            roomNumDesc,
            hallNum,
            hallNumDesc,
            toiletNum,
            toiletNumDesc,
            earnestMoney,
            villageTitle,
            houseImg,
            ...rest
          } = data.data.data;
          this.trimOrderform = {
            id,
            acreage,
            ownerName,
            ownerPhone,
            communityId,
            houseNumber,
            style,
            styleDesc,
            roomNum,
            roomNumDesc,
            hallNum,
            hallNumDesc,
            toiletNum,
            toiletNumDesc,
            earnestMoney,
            houseImg
          };
          this.styleItem = { id: style, title: styleDesc };
          this.villageItem = { id: communityId, title: villageTitle };
          this.villageList.push({ id: communityId, title: villageTitle });
          this.houseType.roomnum = { value: roomNum, title: roomNumDesc };
          this.houseType.livingnum = { value: hallNum, title: hallNumDesc };
          this.houseType.tolietnum = { value: toiletNum, title: toiletNumDesc };
          this.planList.push({
            id: rest.decorateOrderPlan.quoteId,
            planUrl: rest.decorateOrderPlan.planUrl,
            title: rest.decorateOrderPlan.title
          });
          this.planItem = {
            id: rest.decorateOrderPlan.quoteId,
            planUrl: rest.decorateOrderPlan.planUrl,
            title: rest.decorateOrderPlan.title
          };
          this.refreshImg();
        }
      });
    }
    /* 获取选择风格列表 */
    getAllUsableDecorateStyle().then(data => {
      this.houseStyleList = data.data.data;
    });
  },
  methods: {
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    checkOwner(rule, value, callback) {
      if (!this.ownerSelect.account && !this.trimOrderform.ownerPhone) {
        callback(new Error("请输入业主手机号"));
      } else {
        callback();
      }
    },
    checkQuote(rule, value, callback) {
      if (this.planItem.id) {
        callback();
      } else {
        callback(new Error("请选择一个初步方案"));
      }
    },
    checkVillage(rule, value, callback) {
      if (this.villageItem.id) {
        callback();
      } else {
        callback(new Error("请输入小区名称"));
      }
    },
    checkStyle(rule, value, callback) {
      if (this.styleItem.id) {
        callback();
      } else {
        callback(new Error("请选择风格"));
      }
    },
    checkRoom(rule, value, callback) {
      if (this.houseType.roomnum && this.houseType.roomnum.value === undefined) {
        callback(new Error("请选择室数量"));
      } else if (this.houseType.livingnum && this.houseType.livingnum.value === undefined) {
        callback(new Error("请选择厅数量"));
      } else if (this.houseType.tolietnum && this.houseType.tolietnum.value === undefined) {
        callback(new Error("请选择卫生间数量"));
      } else {
        callback();
      }
    },
    checkMoney(rule, value, callback) {
      if (this.trimOrderform.earnestMoney <= 0) {
        callback(new Error("用户账户剩余为0，请联系用户转账"));
      } else {
        callback();
      }
    },
    handleUserByPhone(val) {
      if (val != "") {
        getOwnerByPhone(val).then(data => {
          this.prietorList = data.data.data;
        });
      }
    },
    /** 获取用户虚户剩余金额 */
    handleGetMoney() {
      if (this.ownerSelect.outUserId) {
        getOwnerByOutUserId(this.ownerSelect.outUserId).then(res => {
          if (res.status == 200) {
            this.trimOrderform.earnestMoney = res.data;
          }
        });
      }
    },
    selectPlan(val) {
      if (val != "") {
        getQuoteListByDecorate(val).then(data => {
          if (data.data.status == 0) {
            this.planList = data.data.data;
          }
        });
      }
    },
    selectVillage(val) {
      if (val != "") {
        getAllVillageByPage({ pageNo: 1, pageSize: 20, title: val }).then(data => {
          if (data.data.status == 0) {
            this.villageList = data.data.data.list;
          }
        });
      }
    },
    /* 提交 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.trimOrderform.communityId = this.villageItem.id;
          this.trimOrderform.style = this.styleItem.id;
          this.trimOrderform.styleDesc = this.styleItem.title;
          this.trimOrderform.roomNum = this.houseType.roomnum.value;
          this.trimOrderform.roomNumDesc = this.houseType.roomnum.title;
          this.trimOrderform.hallNum = this.houseType.livingnum.value;
          this.trimOrderform.hallNumDesc = this.houseType.livingnum.title;
          this.trimOrderform.toiletNum = this.houseType.tolietnum.value;
          this.trimOrderform.toiletNumDesc = this.houseType.tolietnum.title;
          this.trimOrderform.quoteId = this.planItem.id;
          if (this.$route.query.id) {
            updateDecorateOrder(this.trimOrderform).then(data => {
              if (data.data.status == 0) {
                this.$message.success("修改成功");
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          } else {
            this.trimOrderform.ownerPhone = this.ownerSelect.account;
            this.trimOrderform.ownerName = this.ownerSelect.name;
            this.trimOrderform.outUserId = this.ownerSelect.outUserId;
            this.$confirm(
              `<div class="dilogHtml">
            <div class="item">
              <div class="label">业主</div>
              <div class="content">${this.trimOrderform.ownerPhone}，${this.trimOrderform.ownerName}</div>
            </div>
            <div class="item">
              <div class="label">小区</div>
              <div
                class="content"
              >${this.villageItem.title}，${this.trimOrderform.houseNumber}，${
                this.houseType.roomnum.value
                  ? this.houseType.roomnum.title
                  : "" + this.houseType.livingnum.value
                  ? this.houseType.livingnum.title
                  : "" + this.houseType.tolietnum.value
                  ? this.houseType.tolietnum.title
                  : ""
              }，${this.trimOrderform.acreage}㎡，${this.styleItem.title}</div>
            </div>
            <div class="item">
              <div class="label">位置</div>
              <div class="content">${this.villageItem.province ? this.villageItem.province : ""}${
                this.villageItem.city ? this.villageItem.city : ""
              }</div>
            </div>
            <div class="item">
              <div class="label">定金</div>
              <div class="content" style="color:red">¥${(this.trimOrderform.earnestMoney / 100).toFixed(2)}</div>
            </div>
            <p>创建订单后，定金将不可修改，确认创建吗？</p>
          </div>`,
              {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定创建",
                cancelButtonText: "取消",
                center: true
              }
            )
              .then(() => {
                addDecorateOrder(this.trimOrderform).then(data => {
                  if (data.data.status == 0) {
                    this.$message.success("添加成功");
                    this.$router.go(-1);
                  } else {
                    this.$message.error(data.data.msg);
                  }
                });
              })
              .catch(() => {
                this.$message("已取消添加");
              });
          }
        }
      });
    }
  }
};
</script>

<style lang='less'>
#editTrimOrder {
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
      .infoItem {
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
      }
    }
  }
}
.dilogHtml {
  .label {
    float: left;
  }
  .item {
    .content {
      margin-left: 50px;
      text-align: left;
    }
  }
}
</style>