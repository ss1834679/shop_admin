<template>
  <div id="trimAppend">
    <!-- 装修增项 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">装修增项</span>
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
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button v-if="orderDetails.orderStatus==7" @click="handleAppend">添加增项</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>增项状态：</span>
            <el-select v-model="searchStatus" @change="showAll" placeholder="请选择增项状态" clearable>
              <el-option label="已创建" :value="1"></el-option>
              <el-option label="已完成" :value="2"></el-option>
            </el-select>
          </div>
        </div>
        <el-table :data="appendList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="title" label="增项标题" align="center"></el-table-column>
          <el-table-column prop="price" label="增项金额" align="center">
            <template slot-scope="scope">{{"¥"+(scope.row.price/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="explain" label="增项说明" align="center"></el-table-column>
          <el-table-column prop="accountPrice" label="已分账" align="center">
            <template slot-scope="scope">{{"¥"+(scope.row.accountPrice/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="status" label="增项状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status==1">已创建</span>
              <span v-if="scope.row.status==2">已完成</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitUser" label="提交人" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" v-if="scope.row.status==1" @click="handleDelete(scope.row)">删除</el-button>
                <el-button type="text" @click="handleApply(scope.row)">申请分账</el-button>
                <el-button type="text" @click="handleMaterial(scope.row)">增项资料</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <Paginationcom :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
      </div>
      <!-- 添加增项 -->
      <el-dialog :visible.sync="addAppendVisible" center width="500px" @close="handleCloseAppend">
        <el-form :model="addAppendForm" ref="addAppendForm" :rules="appendRules">
          <el-form-item prop="title">
            <el-input v-model.trim="addAppendForm.title" placeholder="请输入增项标题"></el-input>
          </el-form-item>
          <el-form-item prop="price">
            <PrecisionInput :num.sync="addAppendForm.price" type="price" placeholder="请输入增项金额（元）" :width="450" />
          </el-form-item>
          <el-form-item prop="explain">
            <el-input type="textarea" :rows="4" v-model.trim="addAppendForm.explain" placeholder="请输入增项说明"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseAppend">取 消</el-button>
          <el-button type="primary" @click="handleSubmitAppend('addAppendForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 申请分账 -->
      <el-dialog :visible.sync="applyVisible" center width="500px" @close="handleCloseApply">
        <p>
          用户账户剩余：
          <span style="color:red" v-if="userRemain">¥{{(userRemain/100).toFixed(2)}}</span>
        </p>
        <el-form :model="applyForm" ref="applyForm" :rules="applyRules">
          <el-form-item prop="serviceAccount">
            <el-select
              v-model="applySelectItem"
              filterable
              remote
              value-key="id"
              :remote-method="searchProAndSerByPhone"
              @change="handleChangeApplySelect"
              placeholder="输入服务商或项目经理手机号"
            >
              <el-option v-for="item in selectProAndSerList" :key="item.id" :label="item.mobile" :value="item">
                <span>{{`${item.roleName}：${item.name}，${item.mobile}`}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="accountPaid">
            <PrecisionInput :num.sync="applyForm.accountPaid" type="price" placeholder="请输入申请分账数（元）" :width="218" />
          </el-form-item>
          <el-form-item prop="remark">
            <el-input type="textarea" :rows="4" v-model.trim="applyForm.remark" placeholder="请输入增项说明"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseApply">取 消</el-button>
          <el-button type="primary" @click="handleSubmitApply('applyForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Paginationcom from "../../../components/paginationCom";
import {
  getDecorateAdditionsBaseInfo,
  getDecorateAdditionsPage,
  addDecorateAdditions,
  getSelectServiceOrProjectManagerByMobile,
  deleteDecorateAdditions,
  applyAccountDecorateAdditions
} from "../../../api/trim";
import PrecisionInput from "../../../components/precisionInput.vue";
import { getOwnerByOutUserId } from "../../../api/pay";
export default {
  components: { Paginationcom, PrecisionInput },
  data() {
    return {
      searchStatus: "" /* 审核状态 */,
      appendList: [],
      orderDetails: {},
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
      addAppendVisible: false,
      addAppendForm: { decorateOrderId: "", explain: "", price: "", title: "" } /* 添加增项 */,
      appendRules: {
        title: [
          { required: true, message: "请输入增项标题！", trigger: "blur" },
          { max: 50, message: "增项标题不能超过50个字！", trigger: "change" }
        ],
        price: [{ required: true, message: "请输入增项金额！", trigger: "blur" }],
        explain: [
          { required: true, message: "请输入增项说明！", trigger: "blur" },
          { max: 200, message: "增项说明不能超过200个字！", trigger: "change" }
        ]
      } /* 增项规则 */,
      applyVisible: false,
      applySelectItem: {},
      applyForm: {
        id: "" /* 增项id */,
        accountPaid: undefined /* 分账金额 */,
        decorateOrderId: "",
        remark: "" /* 备注 */,
        serviceAccount: "" /* 资金账户 */,
        type: null /* 0 服务商 2 项目经理 */
      } /* 申请分账 */,
      applyRow: {} /* 申请分账的哪一行 */,
      applyRules: {
        serviceAccount: [{ validator: this.checkAccount, trigger: "submit" }],
        accountPaid: [{ validator: this.checkAccountPaid, trigger: "submit" }],
        remark: [{ required: true, message: "请输入申请分账备注！", trigger: "blur" }]
      } /* 申请分账规则 */,
      userRemain: null /* 用户剩余金额 */,
      selectProAndSerList: [] /* 通过电话号码搜索的项目经理和服务商的列表 */,
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  mounted() {
    this.showAll();
    getDecorateAdditionsBaseInfo(this.$route.query.orderId).then(data => {
      if (data.data.status == 0) {
        this.orderDetails = data.data.data;
        this.orderDetailsList[0].value = `${this.orderDetails.ownerPhone}，${this.orderDetails.ownerName}`;
        this.orderDetailsList[1].value = `${this.orderDetails.accountNum}，${this.orderDetails.keeperName}`;
        this.orderDetailsList[2].value = `${this.orderDetails.communityName}，${this.orderDetails.houseNumber}，${
          this.orderDetails.roomNum
            ? this.orderDetails.roomNumDesc
            : "" + this.orderDetails.hallNum
            ? this.orderDetails.hallNumDesc
            : "" + this.orderDetails.toiletNum
            ? this.orderDetails.toiletNumDesc
            : ""
        }，${this.orderDetails.acreage + "㎡"}，${this.orderDetails.styleDesc}`;
        this.orderDetailsList[3].value = `${this.orderDetails.position}`;
        this.orderDetailsList[4].value = `<span style='color:red'>¥${(this.orderDetails.earnestMoney / 100).toFixed(
          2
        )}</span>`;
        this.orderDetailsList[5].value = this.orderDetails.decoratePrice
          ? `<span style='color:red'>¥${(this.orderDetails.decoratePrice / 1000000).toFixed(2)}万</span>`
          : null;
        switch (this.orderDetails.orderStatus) {
          case 1:
            this.orderDetailsList[6].value = `<span style="color:red">订单创建</span>`;
            break;
          case 2:
            this.orderDetailsList[6].value = `<span style="color:red">已下定</span>`;
            break;
          case 3:
            this.orderDetailsList[6].value = `<span style="color:red">已确定方案</span>`;
            break;
          case 4:
            this.orderDetailsList[6].value = `<span style="color:red">已配置流程</span>`;
            break;
          case 5:
            this.orderDetailsList[6].value = `<span style="color:red">已确定报价</span>`;
            break;
          case 6:
            this.orderDetailsList[6].value = `<span style="color:red">发起流程</span>`;
            break;
          case 7:
            this.orderDetailsList[6].value = `<span style="color:red">装修中</span>`;
            break;
          case 8:
            this.orderDetailsList[6].value = `<span style="color:red">装修完毕</span>`;
            break;
          case 9:
            this.orderDetailsList[6].value = `<span style="color:red">已确定签约</span>`;
            break;
          default:
            break;
        }
        if (this.orderDetails.endStatus == 1) {
          this.orderDetailsList[6].value = `<span style="color:red">装修终止</span>`;
        }
        this.imglist = this.orderDetails.houseImg.split(",");
      }
    });
  },
  methods: {
    checkAccountPaid(rule, value, callback) {
      if (this.applyForm.accountPaid == undefined || this.applyForm.accountPaid == null) {
        callback(new Error("请输入申请分账数！"));
      }
      if (this.applyForm.accountPaid > this.userRemain) {
        callback(new Error("实际剩余款项已不足，请联系客户打款！"));
      }
      callback();
    },
    checkAccount(rule, value, callback) {
      if (
        this.applyForm.serviceAccount == undefined ||
        this.applyForm.serviceAccount == null ||
        this.applyForm.serviceAccount == ""
      ) {
        callback(new Error("请输入服务商或项目经理手机号"));
      }
      callback();
    },
    /** 添加增项 */
    handleAppend() {
      this.addAppendVisible = true;
    },
    /** 关闭添加增项弹窗 */
    handleCloseAppend() {
      this.addAppendVisible = false;
      this.addAppendForm = { decorateOrderId: "", explain: "", price: "", title: "" }; // 增项的对象
      setTimeout(() => {
        this.$refs.addAppendForm.clearValidate();
      }, 10);
    },
    /** 提交添加增项 */
    handleSubmitAppend(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addAppendForm.decorateOrderId = this.$route.query.orderId;
          addDecorateAdditions(this.addAppendForm).then(data => {
            if (data.data.status == 0) {
              this.$message.success(data.data.data);
              this.handleCloseAppend();
              this.showAll();
            } else {
              this.$message.error(data.data.msg);
            }
          });
        } else {
          this.$message.warning("请检查是否填完参数");
        }
      });
    },
    /** 申请分账 */
    handleApply(row) {
      this.applyRow = JSON.parse(JSON.stringify(row));
      getOwnerByOutUserId(this.orderDetails.outUserId).then(res => {
        if (res.status == 200) {
          this.userRemain = res.data;
          this.applyVisible = true;
        } else {
          this.$message.warning("查询用户剩余款项失败");
        }
      });
    },
    handleChangeApplySelect() {
      this.applyForm.serviceAccount = this.applySelectItem.id;
      this.applyForm.type = this.applySelectItem.type;
    },
    /** 关闭申请分账弹窗 */
    handleCloseApply() {
      this.applyVisible = false;
      this.applyRow = new Object();
      this.applyForm = {
        id: "",
        accountPaid: undefined /* 分账金额 */,
        decorateOrderId: "",
        remark: "" /* 备注 */,
        serviceAccount: "" /* 资金账户 */,
        type: null /* 0 服务商 2 项目经理 */
      };
      setTimeout(() => {
        this.$refs.applyForm.clearValidate();
      }, 10);
    },
    /** 提交申请分账 */
    handleSubmitApply(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.applyForm.decorateOrderId = this.$route.query.orderId;
          this.applyForm.id = this.applyRow.id;
          applyAccountDecorateAdditions(this.applyForm).then(data => {
            if (data.data.status == 0) {
              this.applyVisible = false;
              this.applyForm = {
                id: "",
                accountPaid: undefined /* 分账金额 */,
                decorateOrderId: "",
                remark: "" /* 备注 */,
                serviceAccount: "" /* 资金账户 */,
                type: null /* 0 服务商 2 项目经理 */
              };
              this.$message.success("申请分账成功");
            } else {
              this.$message.error(data.data.msg);
            }
          });
        } else {
          this.$message.warning("请检查是否填完参数");
        }
      });
    },
    handleMaterial(row) {
      this.$router.push({ name: "appendMaterialList", query: { id: row.id } });
    },
    handleDelete(row) {
      this.$confirm("此操作将删除该增项，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDecorateAdditions(row.id).then(data => {
            if (data.data.status == 0) {
              this.$message.success("删除增项成功");
              this.showAll();
            } else {
              this.$message.error("删除增项失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    searchProAndSerByPhone(val) {
      if (val !== "") {
        getSelectServiceOrProjectManagerByMobile({ mobile: val }).then(data => {
          this.selectProAndSerList = data.data.data;
        });
      }
    },
    showAll(val = {}) {
      getDecorateAdditionsPage({
        decorateOrderId: this.$route.query.orderId,
        pageNo: this.cPage,
        pageSize: 20,
        status: this.searchStatus == "" ? undefined : this.searchStatus
      }).then(data => {
        if (data.data.status == 0) {
          this.appendList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#trimAppend {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
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
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      .orderDetailsDiv {
        display: flex;
        margin-bottom: 10px;
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
              width: 100px;
              float: left;
              text-align: right;
            }
            .infoContent {
              height: 35px;
              width: calc(~"100% - 120px");
              margin-left: 120px;
            }
          }
        }
        .imgDiv {
          img {
            margin-right: 10px;
            width: 150px;
            height: 150px;
          }
        }
      }
    }
  }
}
</style>