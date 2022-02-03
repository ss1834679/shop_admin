<template>
  <div id="delivery-add">
    <!-- 添加发货点页 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">添加发货点</span>
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
      </div>

      <div class="add-content">
        <el-form :model="deliveryForm" :rules="deliveryRules" ref="deliveryForm" label-width="100px">
          <el-form-item label="发货点名称:" prop="name">
            <el-input v-model="deliveryForm.name"></el-input>
          </el-form-item>
          <el-form-item label=" 发货人姓名:" prop="fullName">
            <el-input v-model="deliveryForm.fullName"></el-input>
          </el-form-item>
          <el-form-item label="所在区域：">
            <div class="searchBar">
              <div class="search_box">
                <el-select v-model="selPro" @change="changeOrigin({level:1})" value-key="id" placeholder="选择省" filterable clearable>
                  <el-option v-for="item in provinceList" :key="item.id" :label="item.criName" :value="item"></el-option>
                </el-select>
              </div>
              <div class="search_box">
                <el-select v-model="selCity" @change="changeOrigin({level:2})" value-key="id" placeholder="选择市" filterable clearable>
                  <el-option v-for="item in cityList" :key="item.id" :label="item.criName" :value="item"></el-option>
                </el-select>
              </div>
              <div class="search_box">
                <el-select v-model="deliveryForm.areaId" placeholder="选择区" filterable clearable>
                  <el-option v-for="item in areaList" :key="item.id" :label="item.criName" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input v-model="deliveryForm.address" type="textarea" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="phone">
            <el-input v-model="deliveryForm.phone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('deliveryForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getProvinceList, getRegionList } from "../../api/usercenter";
import { insertAddressSup } from "../../api/supplier";
export default {
  data() {
    return {
      deliveryForm: {
        name: "",
        fullName: "",
        provinceId: "",
        cityId: "",
        areaId: "",
        address: "",
        phone: ""
      },
      deliveryRules: {
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { min: 11, max: 11, message: "电话的长度不对", trigger: "blur" }
        ],
        address: [{ required: true, message: "请填写详细地址", trigger: "blur" }],
        fullName: [{ required: true, message: "请填写发货人姓名", trigger: "blur" }],
        name: [{ required: true, message: "请填写发货点名称", trigger: "blur" }]
      },
      provinceList: [] /* 省列表 */,
      selPro: {},
      cityList: [] /* 市列表 */,
      selCity: {},
      areaList: [] /* 区列表 */
    };
  },
  watch: {
    selPro: {
      handler() {
        this.selPro.id != false && (this.deliveryForm.provinceId = this.selPro.id);
      }
    },
    selCity: {
      handler() {
        this.selCity.id != false && (this.deliveryForm.cityId = this.selCity.id);
      }
    }
  },
  mounted() {
    getProvinceList().then(data => {
      this.provinceList = data.data.content;
    });
  },
  methods: {
    changeOrigin(obj) {
      if (obj.level == 1) {
        getRegionList(this.selPro.criCode).then(data => {
          this.cityList = data.data.content;
        });
        this.deliveryForm.cityId = "";
        this.deliveryForm.areaId = "";
        this.selCity = {};
        this.areaList = [];
      } else if (obj.level == 2) {
        getRegionList(this.selCity.criCode).then(data => {
          this.areaList = data.data.content;
        });
        this.deliveryForm.areaId = "";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          insertAddressSup(this.deliveryForm).then(data => {
            if (data.data.status == 200) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.$router.push({ name: "delivery-information" });
            } else {
              this.$message.error("添加失败");
            }
          });
        } else {
          this.$message.error("请填写完必填参数");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
#delivery-add {
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
  .add-content {
    margin: 0 auto;
    width: 500px;
  }
}
</style>