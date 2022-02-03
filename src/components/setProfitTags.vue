<template>
  <!-- 设置服务商分账 tag 组件 -->
  <div class="setProfitTag">
    <el-tag :key="item.serviceAccount" v-for="item in tagData" :closable="isAlter" @close="handleClose(item)">
      <span v-html="`${item.roleName}：${item.name}，${item.mobile}，分账<span class='red'>¥${(item.accountPaid/100).toFixed(2)}</span>`"></span>
    </el-tag>

    <template v-if="showInput&&isAlter">
      <div>
        <el-select
          v-model="selectedProfit"
          filterable
          remote
          value-key="id"
          :remote-method="searchSerByPhone"
          placeholder="输入服务商手机号"
          style="margin-right:10px;width:150px"
        >
          <el-option v-for="item in selectSerList" :key="item.id" :label="item.mobile" :value="item">
            <span>{{`${item.roleName}：${item.name}，${item.mobile}`}}</span>
          </el-option>
        </el-select>
        <PrecisionInput :num.sync="profitMoney" text="元" placeholder="请输入分账数" :width="130" type="price" />
        <el-button class="button-new-tag" size="small" @click="handleInputConfirm">确定添加</el-button>
      </div>
    </template>

    <el-button v-if="(!showInput)&&isAlter" class="button-new-tag" size="small" @click="showInput=true">添加服务商</el-button>
  </div>
</template>

<script>
import PrecisionInput from "./precisionInput";
import { getSelectServiceOrProjectManagerByMobile } from "../api/trim";
export default {
  name: "profitTag",
  props: {
    isAlter: { required: true, type: Boolean },
    arrData: { required: true },
    remainCost: { required: false },
    bigNodeId: { required: true }
  },
  components: { PrecisionInput },
  data() {
    return {
      tagData: "",
      inputVisible: false,
      showInput: false,
      selectSerList: [] /* 搜索得到的服务商列表 */,
      selectedProfit: {} /* 选中的服务商 */,
      profitMoney: undefined /* 分账数 */
    };
  },
  watch: {
    arrData: {
      handler() {
        this.tagData = this.arrData;
      },
      deep: true
    }
  },
  mounted() {
    this.tagData = this.arrData;
    this.tagData.map(it => {
      it.originalId = this.bigNodeId;
      return it;
    });
    this.$emit("update:arrData", this.tagData);
  },
  methods: {
    searchSerByPhone(val) {
      if (val != "") {
        getSelectServiceOrProjectManagerByMobile({ mobile: val, type: 0 }).then(data => {
          this.selectSerList = data.data.data;
        });
      }
    },
    /* 规格tags的函数 */
    handleClose(item) {
      this.tagData.splice(this.tagData.indexOf(item), 1);
      this.$emit("update:arrData", this.tagData);
      this.$emit("addProfit", this.tagData);
    },
    handleInputConfirm() {
      new Promise((resolve, reject) => {
        if (!this.selectedProfit.id) {
          reject("请输入服务商手机号");
        }
        if (!this.profitMoney) {
          reject("请输入分账数");
        }
        if (this.profitMoney > this.remainCost) {
          reject("剩余成本不足，请重新输入");
        }
        this.tagData.forEach(item => {
          item.serviceAccount == this.selectedProfit.id && reject("服务商不能重复添加");
        });
        resolve();
      })
        .then(() => {
          const obj = {
            originalId: this.bigNodeId /* 源id 大节点id */,
            serviceAccount: "" /* 服务商id */,
            accountPaid: undefined,
            type: "" /* 0 服务商 1 业主 2 项目经理 */
          };
          let { id, type, roleName, name, mobile, outUserId } = this.selectedProfit;
          obj.serviceAccount = id;
          obj.outUserId = outUserId; // 项目经理和服务商的资金账号
          obj.type = type;
          obj.accountPaid = this.profitMoney;
          obj["roleName"] = roleName;
          obj["name"] = name;
          obj["mobile"] = mobile;
          this.tagData.push(obj);
          this.$emit("update:arrData", this.tagData);
          this.$emit("addProfit", this.tagData);
          this.showInput = false;
          this.selectedProfit = new Object();
          this.profitMoney = undefined;
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  }
};
</script>

<style lang='less'>
.setProfitTag {
  text-align: left;
  .red {
    color: red;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
