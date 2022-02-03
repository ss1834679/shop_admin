<template>
  <div id="set-address">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>区域设置</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>
      <div class="ads-content">
        <el-form :model="residentialLocation" :rules="residentialLocationRules" ref="residentialLocation" label-width="100px" class="demo-ruleForm">
          <el-form-item label="选择城市:" prop="region">
            <el-select v-model="provinceids" placeholder="选择省" value-key="id" @change="changeProvince({level:1})" filterable clearable>
              <el-option :label="item.criName" :value="item" v-for="item in provinceList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择城市:" prop="region">
            <el-select v-model="cityids" placeholder="选择市" value-key="id" @change="changeProvince({level:2})" filterable clearable>
              <el-option :label="item.criName" :value="item" v-for="item in cityList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择区县:" prop="region">
            <el-select v-model="districtids" placeholder="选择区" value-key="id" @change="changeProvince({level:3})" filterable clearable>
              <el-option :label="item.criName" :value="item" v-for="item in districtList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小区名称" prop="title">
            <el-input v-model="residentialLocation.title"></el-input>
          </el-form-item>
          <el-form-item label="街道" prop="street">
            <el-input v-model="residentialLocation.street"></el-input>
          </el-form-item>
          <el-form-item label="经度" prop="lng">
            <div class="lng">
              <el-input v-model="residentialLocation.lng"></el-input>
              <span style="color:red;font-size:12px">已修复bug,经度大约在100左右</span>
            </div>
          </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <div class="lat">
              <el-input v-model="residentialLocation.lat"></el-input>
              <span style="color:red;font-size:12px">已修复bug,纬度大约在30-40左右</span>
            </div>
          </el-form-item>
          <el-form-item>
            <div style="line-height: 20px">
              <span class="sp-text">在网页打开，输入小区名称 如（重庆永川天籁城 （经度105.889525,纬度29.356509）），获取经纬度（请选填百度的经纬度）</span>
              <el-button type="text" style="margin-right:30px" size="mini" @click="jump">http://api.map.baidu.com/lbsapi/getpoint/index.html</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sumbint('residentialLocation')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getProvinceList, getRegionList, getCityById } from "../../api/usercenter";
import { addOrEditVillage, getVillageById } from "../../api/setings";
export default {
  data() {
    return {
      provinceList: [] /* 省级列表 */,
      cityList: [] /* 市级列表 */,
      districtList: [] /* 区级列表 */,
      residentialLocation: {
        provinceId: "" /* 省级id */,
        cityId: "" /* 市级id */,
        districtId: "" /* 区级id */,
        title: "" /* 小区名称 */,
        street: "" /* 街道 */,
        lng: "" /* 经度 */,
        lat: "" /* 纬度 */
      },
      provinceids: {},
      cityids: {},
      districtids: {},
      // 省市区选择
      residentialLocationRules: {
        title: [{ required: true, message: "请输入小区名称" }],
        lng: [{ required: true, message: "请输入经度" }],
        lat: [{ required: true, message: "请输入纬度" }]
      }
    };
  },
  watch: {
    districtids: {
      handler() {
        if (this.districtids.id) {
          this.residentialLocation.districtId = this.districtids.id;
        } else {
          this.residentialLocation.districtId = "";
        }
      }
    },
    cityids: {
      handler() {
        if (this.cityids.id) {
          this.residentialLocation.cityId = this.cityids.id;
        } else {
          this.residentialLocation.cityId = "";
        }
      }
    },
    provinceids: {
      handler() {
        if (this.provinceids.id) {
          this.residentialLocation.provinceId = this.provinceids.id;
        } else {
          this.residentialLocation.provinceId = "";
        }
      }
    }
  },
  methods: {
    jump() {
      window.open("http://api.map.baidu.com/lbsapi/getpoint/index.html", "_blank");
    },
    // 提交
    sumbint(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          new Promise((resolve, reject) => {
            if (
              this.residentialLocation.cityId == "" ||
              this.residentialLocation.districtId == "" ||
              this.residentialLocation.provinceId == ""
            ) {
              reject("请选择省市区！");
            } else {
              resolve();
            }
          })
            .then(() => {
              addOrEditVillage(this.residentialLocation).then(data => {
                if (data.data.status == 0) {
                  this.$message({ message: "小区地址编辑成功", type: "success" });
                  this.$router.go(-1);
                } else {
                  this.$message.error("小区地址编辑失败");
                }
              });
            })
            .catch(res => {
              this.$message.error(res);
            });
        }
      });
    },
    // 选择省市区
    changeProvince(obj) {
      if (obj.level == 1) {
        getRegionList(this.provinceids.criCode).then(data => {
          this.cityList = data.data.content;
        });
        this.cityids = {};
        this.districtids = {};
        this.districtList = [];
      } else if (obj.level == 2) {
        getRegionList(this.cityids.criCode).then(data => {
          this.districtList = data.data.content;
        });
        this.districtids = {};
      }
    }
  },
  mounted() {
    /* 获取省级列表 */
    getProvinceList().then(data => {
      this.provinceList = data.data.content;
    });
    if (this.$route.query.id) {
      getVillageById(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          this.residentialLocation = data.data.data;
          this.provinceids.id = this.residentialLocation.provinceId;
          this.cityids.id = this.residentialLocation.cityId;
          this.districtids.id = this.residentialLocation.districtId;
          getCityById(this.residentialLocation.provinceId).then(data => {
            getRegionList(data.data.content.criCode).then(da => {
              this.cityList = da.data.content;
            });
          });
          getCityById(this.residentialLocation.cityId).then(data => {
            getRegionList(data.data.content.criCode).then(da => {
              this.districtList = da.data.content;
            });
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
#set-address {
  padding: 20px;
  .clearfix {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ads-content {
    margin: 0 auto;
    width: 400px;
  }
}
.lat,
.lng {
  width: 200px;
}
.sp-text {
  font-size: 12px;
  color: #888;
}
</style>