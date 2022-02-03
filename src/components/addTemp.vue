
<template>
  <div id="addTemp">
    <el-cascader ref="cityList111" v-model="initName" :props="areaProps" :options="cityList" :show-all-levels="false" clearable class="dontshow"></el-cascader>
    <el-button v-if="type==2" size="small" @click="addANew" icon="el-icon-plus" style="margin-right:30px">新增例外</el-button>
    <el-button v-if="type==3" size="small" @click="addANew" icon="el-icon-plus" style="margin-right:30px">修改不配送地区</el-button>
    <div class="regularArray" v-if="type==2&&templateType==1">
      <div class="regularInfo" v-for="(item,index) in getArrFromPre" :key="index">
        <span
          v-if="item&&item.valuation"
        >{{item.valuation.first/1000}} Kg 内 {{item.valuation.firstPrice/100}} 元，每增加 {{item.valuation.num/1000}} Kg，增加运费 {{item.valuation.price/100}} 元</span>

        <div class="area">
          <span v-if="item&&item.cityNameList">区域：{{item.cityNameList.join(",")}}</span>
          <el-button type="text" @click="deleteThis(index)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="regularArray" v-if="type==2&&templateType==2">
      <div class="regularInfo" v-for="(item,index) in getArrFromPre" :key="index">
        <span
          v-if="item&&item.valuation"
        >{{item.valuation.first}} 件(个)内 {{item.valuation.firstPrice/100}} 元，每增加 {{item.valuation.num}} 件(个)，增加运费 {{item.valuation.price/100}} 元</span>
        <div class="area">
          <span v-if="item&&item.cityNameList">区域：{{item.cityNameList.join(",")}}</span>
          <el-button type="text" @click="deleteThis(index)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="regularArray" v-if="type==3">
      <div class="regularInfo">
        <div>
          <span v-if="cityListName">不配送区域：{{cityListName}}</span>
          <span v-else>不配送区域：暂无</span>
        </div>
      </div>
    </div>
    <el-dialog title="选择例外区域" :visible.sync="visible" @close="closeForm" center>
      <el-form v-if="type==2" label-width="80px" :model="valuationForm" ref="valuationForm">
        <el-form-item label="价格">
          <div class="addPrice" v-if="templateType==1">
            <div class="upPrice">
              <precision-input
                :num="valuationForm.valuation.first"
                :placeholder="'首重'"
                :type="'weight'"
                @getNum="(value)=>{this.valuationForm.valuation.first=value}"
              ></precision-input>
              <span class="text">千克（kg）内</span>
              <precision-input
                :num="valuationForm.valuation.firstPrice"
                :placeholder="'首重价格'"
                :type="'price'"
                @getNum="(value)=>{this.valuationForm.valuation.firstPrice=value}"
              ></precision-input>
              <span class="text">元，</span>
            </div>
            <div class="prePrice">
              <span class="text">每增加</span>
              <precision-input
                :num="valuationForm.valuation.num"
                :placeholder="'续重'"
                :type="'weight'"
                @getNum="(value)=>{this.valuationForm.valuation.num=value}"
              ></precision-input>
              <span class="text">千克（kg），增加运费</span>
              <precision-input
                :num="valuationForm.valuation.price"
                :placeholder="'续重价格'"
                :type="'price'"
                @getNum="(value)=>{this.valuationForm.valuation.price=value}"
              ></precision-input>
              <span class="text">元</span>
            </div>
          </div>
          <div class="addPrice" v-if="templateType==2">
            <div class="upPrice">
              <el-input v-model.number="valuationForm.valuation.first" placeholder="首件"></el-input>
              <span class="text">件（个）内</span>
              <precision-input
                :num="valuationForm.valuation.firstPrice"
                :placeholder="'首件价格'"
                :type="'price'"
                @getNum="(value)=>{this.valuationForm.valuation.firstPrice=value}"
              ></precision-input>
              <span class="text">元，</span>
            </div>
            <div class="prePrice">
              <span class="text">每增加</span>
              <el-input v-model.number="valuationForm.valuation.num" placeholder="续件"></el-input>
              <span class="text">件（个），增加运费</span>
              <precision-input
                :num="valuationForm.valuation.price"
                :placeholder="'续件价格'"
                :type="'price'"
                @getNum="(value)=>{this.valuationForm.valuation.price=value}"
              ></precision-input>
              <span class="text">元</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="区域" class="areaselect">
          <el-cascader
            ref="cityList"
            placeholder="请选择例外区域"
            v-model="valuationForm.cityIdList"
            :props="areaProps"
            :options="cityList"
            :show-all-levels="false"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <el-form v-if="type==3" label-width="80px">
        <el-form-item label="区域" class="areaselect">
          <el-cascader
            ref="cityList"
            placeholder="请选择不配送区域"
            v-model="getArrFromPre"
            :props="areaProps"
            :options="cityList"
            :show-all-levels="false"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeForm">取 消</el-button>
        <el-button type="primary" @click="addToAim()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import precisionInput from "./precisionInput";
import { getProvinceCityDistrict } from "../api/usercenter";
export default {
  name: "addTemp",
  props: {
    templateType: { required: true },
    type: { required: true },
    aimArr: { type: Array }
  },
  components: { precisionInput },
  data() {
    return {
      initName: [] /* 初始化时需要的的变量 */,
      visible: false /* 添加的可视 */,
      getArrFromPre: [] /* 最后要传递给父组件的数组 */,
      cityList: [] /* 省市区三级列表 */,
      checkAllIdList: [] /* 所有的选择的id */,
      valuationForm: {
        valuation: {
          first: null /* 首重 首件 */,
          firstPrice: null /* 首重 续件 价格 */,
          num: null /* 续重 续件 */,
          price: null /* 续重 续件 价格 */,
          type: 2 /* 1代表默认地址，2代表例外地区，3代表不配送地区 */
        },
        cityIdList: []
      } /* 添加例外的对象 */,
      cityListName: "" /* 不配送的地区的名字 */,
      areaProps: {
        value: "id",
        label: "name",
        multiple: true /* 多选 */,
        emitPath: false /* 只返回选中id */,
        children: "citys"
      }
    };
  },
  mounted() {
    if (this.$store.state.provinceCityDistrict.length == 0) {
      getProvinceCityDistrict().then(data => {
        if (data.data.status == 200) {
          this.cityList = data.data.content;
          this.$store.commit("getprovinceCityDistrict", data.data.content);
        }
      });
    } else {
      this.cityList = this.$store.state.provinceCityDistrict;
    }
    this.getCheckedNodesName(this.aimArr);
  },
  watch: {
    getArrFromPre: {
      handler() {
        this.$emit("getChange", this.getArrFromPre);
      },
      deep: true
    }
  },
  methods: {
    addANew() {
      this.visible = true;
    },
    closeForm() {
      this.visible = false;
    },
    getCheckedNodesName(cityArr) {
      /* cityArr 传入的aimArr  2则为每个对象  3则为一个市级的数组 */
      if (this.type == 2) {
        /* 例外 */
        this.getArrFromPre = cityArr;
      } else if (this.type == 3) {
        /* 不配送 */
        new Promise(resolve => {
          this.$refs.cityList111.checkedValue = cityArr;
          resolve();
        }).then(() => {
          this.getArrFromPre = cityArr;
          let arr = this.$refs.cityList111.getCheckedNodes(true);
          let name = arr.map(item => {
            return item.data.name;
          });
          this.cityListName = name.join(",");
        });
      }
    },
    deleteThis(index) {
      this.getArrFromPre.splice(index, 1);
    },
    addToAim() {
      if (this.type == 2) {
        let name = [];
        let status = false;
        new Promise(resolve => {
          new Promise(res => {
            this.valuationForm.cityIdList = this.valuationForm.cityIdList.filter(item => {
              this.checkAllIdList.includes(item) && (status = true);
              return !this.checkAllIdList.includes(item);
            });
            res();
          }).then(() => {
            let arr = this.$refs.cityList.getCheckedNodes(true);
            name = arr.map(item => {
              return item.data.name;
            });
            resolve();
          });
        }).then(() => {
          status &&
            this.$message({
              type: "warning",
              message: "选择的城市中与之前选中的城市有重复，系统已经剔除了重复的例外城市"
            });
          let vaild =
            this.valuationForm.valuation.first != null &&
            this.valuationForm.valuation.firstPrice != null &&
            this.valuationForm.valuation.num != null &&
            this.valuationForm.valuation.price != null &&
            this.valuationForm.cityIdList.length != 0;
          this.valuationForm.cityNameList = name;
          if (vaild) {
            this.checkAllIdList = this.checkAllIdList.concat(this.valuationForm.cityIdList);
            this.getArrFromPre.push(JSON.parse(JSON.stringify(this.valuationForm)));
            this.visible = false;
            let obj = {
              first: null /* 首重 首件 */,
              firstPrice: null /* 首重 续件 价格 */,
              num: null /* 续重 续件 */,
              price: null /* 续重 续件 价格 */,
              type: 2 /* 1代表默认地址，2代表例外地区，3代表不配送地区 */
            };
            this.$set(this.valuationForm, "valuation", obj);
            this.$set(this.valuationForm, "cityIdList", []);
            // this.valuationForm = {
            //   valuation: {
            //     first: null /* 首重 首件 */,
            //     firstPrice: null /* 首重 续件 价格 */,
            //     num: null /* 续重 续件 */,
            //     price: null /* 续重 续件 价格 */,
            //     type: 2 /* 1代表默认地址，2代表例外地区，3代表不配送地区 */
            //   },
            //   cityIdList: []
            // };
          } else {
            this.$message.error("请填写完参数");
          }
        });
      }
      if (this.type == 3) {
        let arr1 = this.$refs.cityList.getCheckedNodes(true);
        let name = arr1.map(item => {
          return item.data.name;
        });
        this.cityListName = name.join(",");
        this.visible = false;
      }
    }
  }
};
</script>
<style lang="less">
#addTemp {
  .area {
    display: flex;
    justify-content: space-between;
  }
  .addPrice {
    width: 100%;
    display: flex;
    display: -ms-flexbox;
    display: -webkit-flex;
    flex-direction: column;
    .el-input {
      width: 120px;
    }
    span.text {
      margin: 0 4px;
    }
    .upPrice,
    .prePrice {
      width: 100%;
      height: 40px;
      padding: 5px 0;
      line-height: 40px;
    }
  }
  .regularArray {
    .regularInfo {
      margin-top: 4px;
      padding: 0 10px;
      border: 1px #797979 solid;
      border-radius: 3px;
    }
  }
  .dontshow {
    float: left;
    width: 0;
    height: 0;
    overflow: hidden;
  }
  .el-dialog {
    width: 65%;
    .areaselect {
      .el-form-item__content {
        .el-cascader {
          width: 100%;
        }
      }
    }
  }
}
</style>