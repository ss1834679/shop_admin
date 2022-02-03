<template>
  <div id="villageEdit">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>编辑小区</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>
      <div class="ads-content">
        <el-form :model="residentialLocation" :rules="residentialLocationRules" ref="residentialLocation" label-width="100px" class="form">
          <el-form-item label="选择省市区:" class="region" prop="region">
            <el-select v-model="provinceids" placeholder="选择省" value-key="id" @change="changeProvince({level:1})" filterable clearable>
              <el-option :label="item.criName" :value="item" v-for="item in provinceList" :key="item.id"></el-option>
            </el-select>
            <el-select v-model="cityids" placeholder="选择市" value-key="id" @change="changeProvince({level:2})" filterable clearable>
              <el-option :label="item.criName" :value="item" v-for="item in cityList" :key="item.id"></el-option>
            </el-select>
            <el-select v-model="districtids" placeholder="选择区" value-key="id" @change="changeProvince({level:3})" filterable clearable>
              <el-option :label="item.criName" :value="item" v-for="item in districtList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="选择城市:" prop="region">
          </el-form-item>
          <el-form-item label="选择区县:" prop="region">
          </el-form-item>-->
          <el-form-item label="小区名称" prop="title">
            <el-input v-model="residentialLocation.title" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="street">
            <el-input v-model="residentialLocation.street" style="width:450px"></el-input>
            <el-button type="primary" @click="searchadd">获取坐标</el-button>
            <div style="line-height: 20px">
              <span class="sp-text">输入小区名称 如（重庆永川天籁城），点击获取坐标，选取需要的坐标，自动填充到经纬度</span>
            </div>
          </el-form-item>
          <el-form-item label="经度" prop="lng">
            <el-input v-model="residentialLocation.lng" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="residentialLocation.lat" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sumbint('residentialLocation')">提交</el-button>
          </el-form-item>
        </el-form>
        <div id="allmap" style="width:500px;height:500px"></div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getProvinceList, getRegionList, getCityById } from "../../api/usercenter";
import { addOrEditVillage, getVillageById } from "../../api/promanage";
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
      },
      local: null,
      map: null
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
    searchadd() {
      this.local.search(this.residentialLocation.street);
    },
    getAttr(event) {
      this.residentialLocation.lng = event.point.lng;
      this.residentialLocation.lat = event.point.lat;
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
    new Promise(resolve => {
      this.map = new BMap.Map("allmap");
      this.map.centerAndZoom(new BMap.Point(106.555, 29.567), 11);
      this.map.enableScrollWheelZoom();
      this.local = new BMap.LocalSearch(this.map, {
        renderOptions: { map: this.map },
        onSearchComplete: e => {
          this.local.setMarkersSetCallback(e => {
            e &&
              e.forEach(item => {
                item.marker.addEventListener("click", this.getAttr);
              });
          });
        }
      });
      resolve();
    });
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
#villageEdit {
  padding: 20px;
  .clearfix {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ads-content {
    .form {
      .el-form-item {
        margin-bottom: 18px;
      }
      .region {
        .el-form-item__content {
          display: flex;
        }
      }
    }
    #allmap {
      width: 500px;
      height: 500px;
      margin-left: 100px;
    }
  }
}
.lat,
.lng {
  width: 200px;
}
.sp-text {
  font-size: 12px;
  color: #888;
  line-height: normal;
}
</style>