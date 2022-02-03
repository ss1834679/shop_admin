<template>
  <div id="editCdkey">
    <!-- 编辑激活码-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">编辑激活码</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="keyForm" ref="keyForm" :rules="keyRules" label-width="150px">
          <el-form-item label="案例范围" prop="quoteScope">
            <el-radio-group v-model="keyForm.quoteScope">
              <el-radio :label="1">全部</el-radio>
              <el-radio :label="2">地区</el-radio>
              <el-radio :label="3">小区</el-radio>
            </el-radio-group>
            <div v-if="keyForm.quoteScope==2">
              <el-select v-model="province" placeholder="选择省" value-key="id" @change="changeProvince({level:1})" filterable clearable>
                <el-option :label="item.criName" :value="item" v-for="item in provinceList" :key="item.id"></el-option>
              </el-select>
              <el-select v-model="city" placeholder="选择市" value-key="id" @change="changeProvince({level:2})" filterable clearable>
                <el-option :label="item.criName" :value="item" v-for="item in cityList" :key="item.id"></el-option>
              </el-select>
              <el-select v-model="district" placeholder="选择区" value-key="id" @change="changeProvince({level:3})" filterable clearable>
                <el-option :label="item.criName" :value="item" v-for="item in districtList" :key="item.id"></el-option>
              </el-select>
            </div>
            <div v-if="keyForm.quoteScope==3">
              <el-select v-model="villageId" filterable remote :remote-method="selectVillage" placeholder="请输入小区名以搜索" clearable>
                <el-option v-for="item in villageList" :key="item.id" :label="item.title" :value="item.id"></el-option>
              </el-select>
              <div v-if="villageName">已选择小区：{{villageName}}</div>
            </div>
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="keyForm.companyName" placeholder="家魔方显示公司名称，默认为：重庆涂邦之家科技有限责任公司" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="门店地址" prop="storeAddress">
            <el-input v-model="keyForm.storeAddress" placeholder="家魔方显示门店地址，默认为：重庆市大渡口区春晖路街道翠柏路101号" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="contactInfo">
            <el-input v-model="keyForm.contactInfo" placeholder="家魔方显示门店联系方式，默认为：400 888 4044" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="激活码" prop="code">
            <span v-if="keyForm.code&&keyForm.code!=''" style="margin-right:15px">{{keyForm.code}}</span>
            <el-button size="mini" v-if="!$route.query.id" @click="createCdKye">生成激活码</el-button>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model.trim="keyForm.address" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
            <el-radio-group v-model="keyForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('keyForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addActivation, editActivation, generateActivation, getOneActivation } from "../../api/magichome";
import uploadImg from "../../components/uploadImg";
import { getProvinceList, getRegionList } from "../../api/usercenter";
import { getAllVillageByPage } from "../../api/promanage";
export default {
  components: { uploadImg },
  data() {
    return {
      province: {} /* 省级对象 */,
      city: {} /* 实际对象 */,
      district: {} /* 区级对象 */,
      provinceList: [] /* 省级列表 */,
      cityList: [] /* 市级列表 */,
      districtList: [] /* 区级列表 */,
      villageId: "" /* 小区id */,
      villageList: [] /* 小区列表 */,
      villageName: "" /* 小区名称 */,
      keyForm: {
        address: null /* 地址  家魔方设备的安放位置 */,
        quoteScope: 1 /* 案例范围 1 全部 2 区域 3 小区 */,
        companyName: "" /* 公司名称 */,
        storeAddress: "" /* 门店地址 */,
        contactInfo: "" /* 联系方式 */,
        code: "" /* 激活码 */,
        status: 1 /* 启用状态 */
      },
      keyRules: {
        address: [
          { required: true, message: "请输入家魔方设备安放地址", trigger: "blur" },
          { min: 0, max: 100, message: "地址不能大于100个字", trigger: "blur" }
        ],
        companyName: [{ max: 20, message: "公司名称不能大于20个字", trigger: "blur" }],
        storeAddress: [{ max: 20, message: "门店地址不能大于20个字", trigger: "blur" }],
        contactInfo: [{ max: 20, message: "联系方式不能大于20个字", trigger: "blur" }],
        code: [{ required: true, message: "请获取设备激活码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getOneActivation(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          this.keyForm = data.data.data;
          getProvinceList().then(data => {
            this.provinceList = data.data.content;
            if (this.keyForm.quoteScope == 2) {
              this.province = this.provinceList.find(item => {
                return item.criName == this.keyForm.province;
              });
              this.province.criCode &&
                getRegionList(this.province.criCode).then(res => {
                  this.cityList = res.data.content;
                  this.city = this.cityList.find(item => {
                    return item.criName == this.keyForm.city;
                  });
                  this.city.criCode &&
                    getRegionList(this.city.criCode).then(res => {
                      this.districtList = res.data.content;
                      this.district = this.districtList.find(item => {
                        return item.criName == this.keyForm.district;
                      });
                    });
                });
            }
          });
          if (this.keyForm.quoteScope == 3) {
            this.villageName = data.data.data.villageName;
            this.villageId = data.data.data.village;
          }
        }
      });
    } else {
      getProvinceList().then(data => {
        this.provinceList = data.data.content;
      });
    }
  },
  methods: {
    /** 小区搜索 */
    selectVillage(val) {
      if (val != "") {
        getAllVillageByPage({ pageNo: 1, pageSize: 20, title: val }).then(data => {
          if (data.data.status == 0) {
            this.villageList = data.data.data.list;
          }
        });
      }
    },
    /** 生成激活码 */
    createCdKye() {
      generateActivation().then(data => {
        if (data.data.status == 0) {
          this.keyForm.code = data.data.msg;
        } else {
          this.$message.warning("获取失败，请稍后获取");
        }
      });
    },
    /** 地区变化 */
    changeProvince(obj) {
      if (obj.level == 1) {
        getRegionList(this.province.criCode).then(data => {
          this.cityList = data.data.content;
        });
        this.city = {};
        this.district = {};
        this.districtList = [];
      } else if (obj.level == 2) {
        getRegionList(this.city.criCode).then(data => {
          this.districtList = data.data.content;
        });
        this.district = {};
      }
    },
    submitForm(keyForm) {
      this.$refs[keyForm].validate(valid => {
        if (valid) {
          if (this.keyForm.companyName == "") {
            this.keyForm.companyName = "重庆涂邦之家科技有限责任公司";
          }
          if (this.keyForm.storeAddress == "") {
            this.keyForm.storeAddress = "重庆市大渡口区春晖路街道翠柏路101号";
          }
          if (this.keyForm.contactInfo == "") {
            this.keyForm.contactInfo = "400 888 4044";
          }
          new Promise((resolve, reject) => {
            if (this.keyForm.quoteScope == 1) {
              this.keyForm.province = "";
              this.keyForm.city = "";
              this.keyForm.district = "";
              this.keyForm.village = "";
              resolve();
            } else if (this.keyForm.quoteScope == 2) {
              if (this.province && this.province.id) {
                this.keyForm["province"] = this.province.id;
              } else {
                this.keyForm["province"] = undefined;
                reject("选择范围为地区时，至少需要选择省");
              }
              if (this.city && this.city.id) {
                this.keyForm["city"] = this.city.id;
              } else {
                this.keyForm["city"] = undefined;
              }
              if (this.district && this.district.id) {
                this.keyForm["district"] = this.district.id;
              } else {
                this.keyForm["district"] = undefined;
              }
              resolve();
            } else if (this.keyForm.quoteScope == 3) {
              if (this.villageId == "") {
                reject("请选择小区");
              } else {
                this.keyForm["village"] = this.villageId;
                resolve();
              }
            }
            resolve();
          })
            .then(() => {
              if (this.$route.query.id) {
                this.keyForm["id"] = this.$route.query.id;
                editActivation(this.keyForm).then(data => {
                  if (data.data.status == 0) {
                    this.$message.success(data.data.data);
                    this.$router.push({ name: "cdkeyList" });
                  } else {
                    this.$message.error(data.data.msg);
                  }
                });
              } else {
                addActivation(this.keyForm).then(data => {
                  if (data.data.status == 0) {
                    this.$message.success(data.data.data);
                    this.$router.push({ name: "cdkeyList" });
                  } else {
                    this.$message.error(data.data.msg);
                  }
                });
              }
            })
            .catch(res => {
              this.$message.warning(res);
            });
        }
      });
    }
  }
};
</script>

<style lang='less'>
#editCdkey {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        div {
          margin-left: 15px;
        }
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
  }
}
</style>