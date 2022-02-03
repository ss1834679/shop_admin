<template>
  <div id="freight_add">
    <!-- 添加运费模板页 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">添加运费模板</span>
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
      </div>
      <div class="add-content">
        <el-form :model="freightForm" ref="freightForm" label-width="130px">
          <el-form-item label="运费模板名称：" class="is-required">
            <el-input v-model="freightForm.templates.name"></el-input>
          </el-form-item>
          <el-form-item label="计价方式：" class="is-required">
            <el-radio-group v-model="freightForm.templates.type">
              <el-radio :label="1">按重量计费</el-radio>
              <el-radio :label="2">按件计费</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="全局规则(默认)：" class="is-required" v-if="typeshow">
            <div class="addPrice" v-if="freightForm.templates.type==1">
              <precision-input
                :num="freightForm.defaultValuationModel.valuation.first"
                :placeholder="'首重'"
                :type="'weight'"
                @getNum="(value)=>{this.freightForm.defaultValuationModel.valuation.first=value}"
              ></precision-input>
              <span class="text">千克（kg）内</span>
              <precision-input
                :num="freightForm.defaultValuationModel.valuation.firstPrice"
                :placeholder="'首重价格'"
                :type="'price'"
                @getNum="(value)=>{this.freightForm.defaultValuationModel.valuation.firstPrice=value}"
              ></precision-input>
              <span class="text">元，</span>
              <span class="text">每增加</span>
              <precision-input
                :num="freightForm.defaultValuationModel.valuation.num"
                :placeholder="'续重'"
                :type="'weight'"
                @getNum="(value)=>{this.freightForm.defaultValuationModel.valuation.num=value}"
              ></precision-input>
              <span class="text">千克（kg），增加运费</span>
              <precision-input
                :num="freightForm.defaultValuationModel.valuation.price"
                :placeholder="'续重价格'"
                :type="'price'"
                @getNum="(value)=>{this.freightForm.defaultValuationModel.valuation.price=value}"
              ></precision-input>
              <span class="text">元</span>
            </div>
            <div class="addPrice" v-if="freightForm.templates.type==2">
              <el-input v-model.number="freightForm.defaultValuationModel.valuation.first" placeholder="首件"></el-input>
              <span class="text">件（个）内</span>
              <precision-input
                :num="freightForm.defaultValuationModel.valuation.firstPrice"
                :placeholder="'首件价格'"
                :type="'price'"
                @getNum="(value)=>{this.freightForm.defaultValuationModel.valuation.firstPrice=value}"
              ></precision-input>
              <span class="text">元，</span>
              <span class="text">每增加</span>
              <el-input v-model.number="freightForm.defaultValuationModel.valuation.num" placeholder="续件"></el-input>
              <span class="text">件（个），增加运费</span>
              <precision-input
                :num="freightForm.defaultValuationModel.valuation.price"
                :placeholder="'续件价格'"
                :type="'price'"
                @getNum="(value)=>{this.freightForm.defaultValuationModel.valuation.price=value}"
              ></precision-input>
              <span class="text">元</span>
            </div>
          </el-form-item>
          <el-form-item label="例外区域规则：" class="is-required">
            <add-temp
              :templateType="freightForm.templates.type"
              :type="2"
              :aimArr="freightForm.valuationModelList"
              @getChange="(value)=>{this.freightForm.valuationModelList=value}"
            ></add-temp>
          </el-form-item>
          <el-form-item label="不配送区域：">
            <add-temp
              :templateType="freightForm.templates.type"
              :type="3"
              :aimArr="freightForm.cityIdList"
              @getChange="(value)=>{this.freightForm.cityIdList=value}"
            ></add-temp>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import precisionInput from "../../components/precisionInput";
import addTemp from "../../components/addTemp";
import { insertTemplates } from "../../api/setings";
export default {
  data() {
    return {
      typeshow: true,
      freightForm: {
        templates: {
          name: "" /* 模板名称 */,
          type: 1 /* 1代表重量计价，2代表数量计价 */
        },
        defaultValuationModel: {
          valuation: {
            first: null /* 首重 首件 */,
            firstPrice: null /* 首重 续件 价格 */,
            num: null /* 续重 续件 */,
            price: null /* 续重 续件 价格 */,
            type: 1 /* 1代表默认地址，2代表例外地区，3代表不配送地区 */
          },
          cityIdList: []
        },
        valuationModelList: [
          /* 例外 */
          // {
          //   valuation: {
          //     first: 1,
          //     firstPrice: 122,
          //     num: 3,
          //     price: 100,
          //     type: 2
          //   },
          //   cityIdList: ["395", "387"]
          // }
        ],
        cityIdList: [] /* 不配送 */
      }
    };
  },
  mounted() {},
  methods: {
    submitForm() {
      let valid =
        this.freightForm.templates.name != "" &&
        this.freightForm.defaultValuationModel.valuation.first != null &&
        this.freightForm.defaultValuationModel.valuation.firstPrice != null &&
        this.freightForm.defaultValuationModel.valuation.num != null &&
        this.freightForm.defaultValuationModel.valuation.price != null;
      if (valid) {
        insertTemplates(this.freightForm).then(data => {
          if (data.data.status == 200) {
            this.$router.push({ name: "freightIdx" });
            this.$message({
              type: "success",
              message: "添加成功"
            });
          } else {
            this.$message.error(data.data.msg);
          }
        });
      } else {
        this.$message.error("请填写完必填参数");
        return false;
      }
    }
  },
  components: { addTemp, precisionInput }
};
</script>
<style lang="less">
#freight_add {
  width: 100%;
  height: auto;
  .el-card .el-card__header {
    height: 50px;
  }
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .addPrice {
    width: 100%;
    .el-input {
      width: 120px;
    }
    span.text {
      margin: 0 4px;
    }
  }
}
</style>