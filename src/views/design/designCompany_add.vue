<template>
  <div id="designCompany_add">
    <!-- 添加设计公司-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">添加设计公司</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form :model="designCompanyForm" ref="designCompanyForm" label-width="150px" class="demo-ruleForm">
          <div style="font-weight: 800;font-size: 18px;">基本信息</div>
          <el-form-item label="设计公司名称" :prop="this.designCompanyForm.designCompany.name" required>
            <el-input v-model="designCompanyForm.designCompany.name" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="设计公司logo" :prop="this.designCompanyForm.designCompany.logo">
            <upload-img
              @getimgArr="(imgarr)=>{this.designCompanyForm.designCompany.logo = imgarr}"
              :notMultiple="true"
              :imgArr="this.designCompanyForm.designCompany.logo"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="联系人姓名" :prop="this.designCompanyForm.designCompany.contacts" required>
            <el-input v-model="designCompanyForm.designCompany.contacts" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="电话：" :prop="this.designCompanyForm.designCompany.telephone" required>
            <el-input v-model="designCompanyForm.designCompany.telephone" style="width:300px" @blur="resPhone"></el-input>
          </el-form-item>
          <el-form-item label="等级" required>
            <div class="search_box">
              <el-select v-model="designCompanyForm.designCompany.companyLevel" placeholder="默认等级" filterable clearable>
                <el-option :label="item.name" :value="item.id" v-for="item in companyLevelList" :key="item.id"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="位置:" required>
            <div class="searchBar">
              <div class="search_box">
                <el-select
                  v-model="designCompanyForm.designCompany.province"
                  placeholder="省"
                  @change="changeProvince({level:1})"
                  filterable
                  clearable
                >
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in provinceList" :key="item.id"></el-option>
                </el-select>
              </div>
              <div class="search_box">
                <el-select v-model="designCompanyForm.designCompany.city" placeholder="市" @change="changeProvince({level:2})" filterable clearable>
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in cityList" :key="item.id"></el-option>
                </el-select>
              </div>
              <div class="search_box">
                <el-select v-model="designCompanyForm.designCompany.county" placeholder="区" @change="changeProvince({level:3})" filterable clearable>
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in conutyList" :key="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="公司地址" :prop="this.designCompanyForm.designCompany.address" required>
            <el-input v-model="designCompanyForm.designCompany.address" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="简介" :prop="this.designCompanyForm.designCompany.introduce">
            <el-input type="textarea" :rows="5" placeholder="请输入设计公司简介" v-model="designCompanyForm.designCompany.introduce" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="营业执照照片" :prop="this.designCompanyForm.designCompany.businessLicense" required>
            <upload-img
              @getimgArr="(imgarr)=>{this.designCompanyForm.designCompany.businessLicense = imgarr}"
              :notMultiple="true"
              :imgArr="this.designCompanyForm.designCompany.businessLicense"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="法人身份证照片" :prop="this.designCompanyForm.designCompany.idCards" required>
            <upload-arr @getimgArr="(imgarr)=>{this.images2 = imgarr}" :imgArr="this.images2" :limit="2"></upload-arr>
          </el-form-item>
          <el-form-item label="办公环境照片" :prop="this.designCompanyForm.designCompany.environmentalPhotos">
            <upload-arr @getimgArr="(imgarr)=>{this.images = imgarr}" :imgArr="this.images" :limit="3"></upload-arr>
          </el-form-item>
          <el-form-item label="排序" :prop="this.designCompanyForm.designCompany.sort" required>
            <el-input v-model="designCompanyForm.designCompany.sort" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="前端显示" prop="isShow">
            <el-radio-group v-model="designCompanyForm.designCompany.isShow">
              <el-radio :label="'1'">显示</el-radio>
              <el-radio :label="'0'">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item>
            <el-button type="primary" @click="submitForm('designCompanyForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getInsertCompany, getCompanyLevel } from "../../api/designer";
import { getProvinceList, getRegionList } from "../../api/usercenter";
import uploadArr from "../../components/uploadImgArr";
import uploadImg from "../../components/uploadImg";
export default {
  data() {
    return {
      images2: [],
      images: [] /*添加设计师公司环境照片数组 */,
      designCompanyForm: {
        designCompany: {
          companyLevel: "" /**设计师公司等级 */,
          name: "" /* 用户名 */,
          logo: "" /* logo图片 */,
          contacts: "" /* 联系人名称 */,
          telephone: "" /* 电话 */,
          address: "" /* 详细地址 */,
          sort: "" /* 排序 */,
          introduce: "" /* 输入的简介 */,
          businessLicense: "",
          province: "" /* 省市 */,
          city: "" /* 城市 */,
          county: "" /* 区县 */,
          isShow: "1" /* 是否显示 */
        },
        idCards: [],
        environmentalPhotos: [] /* 设计师公司环境照片数组 */
      },
      companyLevelList: [] /**设计师公司等级列表 */,
      provinceList: [] /* 省市列表 */,
      cityList: [] /* 城市列表*/,
      conutyList: [] /* 区县列表 */
      // cityOperationRules: { /* 验证规则 */
      //   name: [{ required: true, message: "请填写名称" }],
      //   contacts: [{ required: true, message: "请填写联系人"}],
      //   address: [{ required: true, message: "请输入详细地址" }],
      //   sort: [{ required: true, message: "请输入排序，只能输入整数"}],
      //   introduce: [{ required: true, message: "请输入简介"}],
      //   logo: [{ required: true, message: "请上传logo图" }],
      // }
    };
  },
  watch: {
    images: {
      /* 轮播图转换成添加删除的值 */
      handler() {
        this.designCompanyForm.environmentalPhotos = this.images;
        console.log(this.designCompanyForm.environmentalPhotos);
      }
    },
    images2: {
      /* 轮播图转换成添加删除的值 */
      handler() {
        this.designCompanyForm.idCards = this.images2;
        console.log(this.designCompanyForm.idCards);
      }
    }
  },
  mounted() {
    getCompanyLevel(1, {
      pageSize: 20
    }).then(data => {
      this.companyLevelList = data.data.content.list;
    });
    /**
     * 获取省直辖市地址列表
     */
    getProvinceList().then(data => {
      this.provinceList = data.data.content;
    });
  },
  methods: {
    // 手机号码验证
    resPhone(e) {
      if (!/^1[3456789]\d{9}$/.test(e.target.value)) {
        this.$message.warning("请输入正确手机号");
        this.designCompanyForm.designCompany.telephone = "";
      }
    },
    // 切换省市区
    changeProvince(obj) {
      if (obj.level == 1) {
        getRegionList(this.designCompanyForm.designCompany.province).then(data => {
          this.cityList = data.data.content;
        });
        this.designCompanyForm.designCompany.city = "";
      } else if (obj.level == 2) {
        getRegionList(this.designCompanyForm.designCompany.city).then(data => {
          this.conutyList = data.data.content;
        });
        this.designCompanyForm.designCompany.county = "";
      }
    },
    // 提交
    submitForm(designCompanyForm) {
      this.$refs[designCompanyForm].validate(valid => {
        if (valid) {
          console.log(this.designCompanyForm);
          getInsertCompany(this.designCompanyForm).then(data => {
            if (data.status == 200) {
              this.$message({
                message: data.data.content.state,
                type: "success"
              });
              this.$router.go(-1);
            } else {
              this.$message({
                message: data.data.content.msg,
                type: "error"
              });
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },

  //是否有富文本编辑
  components: { uploadImg, uploadArr }
};
</script>

<style lang='less' scoped>
#designCompany_add {
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
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>