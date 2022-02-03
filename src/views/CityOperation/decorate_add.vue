<template>
  <div id="add_CityOperation">
    <!-- 添加装修公司-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">添加装修公司</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form :model="CityOperationForm" ref="CityOperationForm" :rules="cityOperationRules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="公司名称" prop="nickname">
            <el-input v-model="CityOperationForm.nickname" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="logo" prop="logo">
            <upload-img @getimgArr="(imgarr)=>{this.CityOperationForm.logo = imgarr}" :imgArr="this.CityOperationForm.logo" :limit="1"></upload-img>
          </el-form-item>
          <el-form-item label="所属区域运营中心" prop="userName">
            <el-select v-model="CityOperationForm.cityOperationValue" filterable placeholder="请选择所属区域运营中心">
              <el-option v-for="item in cityoperationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人姓名" prop="userName">
            <el-input v-model="CityOperationForm.userName" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="phone">
            <el-input v-model.number="CityOperationForm.phone" style="width:300px" @blur="blueText"></el-input>
          </el-form-item>
          <el-form-item label="位置:" required>
            <div style="display:flex">
              <div style="width:140px;">
                <el-select v-model="CityOperationForm.provinceId" placeholder="省" @change="changeProvince({level:1})" filterable clearable>
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in provinceList" :key="item.id"></el-option>
                </el-select>
              </div>
              <div style="width:140px;">
                <el-select v-model="CityOperationForm.cityId" placeholder="市" @change="changeProvince({level:2})" filterable clearable>
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in cityList" :key="item.id"></el-option>
                </el-select>
              </div>
              <div style="width:140px;">
                <el-select v-model="CityOperationForm.countyId" placeholder="区" @change="changeProvince({level:3})" filterable clearable>
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in conutyList" :key="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="CityOperationForm.address" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="introduction">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="CityOperationForm.introduction" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.number="CityOperationForm.sort" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="列表显示" prop="isDisplay">
            <el-radio-group v-model="CityOperationForm.isDisplay">
              <el-radio :label="'1'">显示</el-radio>
              <el-radio :label="'0'">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="虚拟好评率:" prop="commentsInput">
            <template slot-scope>
              <el-input placeholder="请输入内容" v-model.number="CityOperationForm.commentsInput" style="width:300px">
                <template slot="append">%</template>
              </el-input>
              <div style="font-size:13px;color:#888">前端显示好评率=真实好评率+虚拟好评率</div>
            </template>
          </el-form-item>
          <el-form-item label="虚拟进行中订单数:" prop="commentsInput1">
            <template slot-scope>
              <el-input placeholder="请输入内容" v-model.number="CityOperationForm.commentsInput1" style="width:300px"></el-input>
              <div style="font-size:13px;color:#888">前端显示进行中的订单数=真实进行中的订单数+虚拟进行中的订单数</div>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('CityOperationForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { trimCompanySaveOrUpdate,businessCenterSelectAll } from "../../api/cityOperation";
import { getProvinceList, getRegionList } from "../../api/usercenter";
import uploadImg from "../../components/uploadImg";
export default {
  data() {
    return {
      cityoperationList:[],/*所属区域运营中心的数据列表 */
      CityOperationForm: {
        cityOperationValue:'',
        nickname: "" /* 用户名 */,
        logo: "" /* logo图片 */,
        userName: "" /* 联系人名称 */,
        phone: "" /* 电话 */,
        cityId: "" /* 城市 */,
        address: "" /* 详细地址 */,
        sort: "" /* 排序 */,
        introduction: "" /* 输入的简介 */,
        provinceId: "" /* 省市 */,
        commentsInput: "" /* 虚理评论输入 */,
        commentsInput1: "" /* 虚拟进行中订单数输入 */,
        isDisplay: "1" /* 是否显示 */,
        countyId: "" /* 区县 */
      },
      provinceList: [] /* 省市列表 */,
      cityList: [] /* 城市列表*/,
      conutyList: [] /* 区县列表 */,
      cityOperationRules: {
        nickname: [{ required: true, message: "请填写名称", trigger: "blur" }],
        cityOperationValue: [{ required: true, message: "请选择所属区域运营中心", trigger: "blur" }],
        userName: [{ required: true, message: "请填写联系人", trigger: "blur" }],
        commentsInput: [{ required: true, message: "请输入虚拟好评率", trigger: "blur" }],
        address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
        introduction: [{ required: true, message: "请输入简介", trigger: "blur" }],
        commentsInput1: [{ required: true, message: "请输入虚拟进行中订单数", trigger: "blur" }],
        commentsInput2: [{ required: true, message: "请输入虚拟已完成订单数", trigger: "blur" }],
        logo: [{ required: true, message: "请上传logo图", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ]
      }
    };
  },
  watch: {
 
  },
  mounted() {
    /**
     * 获取省直辖市地址列表
     */
    getProvinceList().then(data => {
      this.provinceList = data.data.content;
    });
    // 获取所属区域运营中心
    businessCenterSelectAll().then(data=>{
     this.cityoperationList=data.data.data
    })
  },
  methods: {
    // 手机号码验证
     blueText(e) {
      if (!/^1[3456789]\d{9}$/.test(e.target.value)) {
        this.$message.warning("请输入正确手机号");
        this.decorateEditForm.mobile = "";
      }
    },
    // 切换省市区
    changeProvince(obj) {
      if (obj.level == 1) {
        getRegionList(this.CityOperationForm.provinceId).then(data => {
          this.cityList = data.data.content;
        });
        this.CityOperationForm.cityId = "";
      } else if (obj.level == 2) {
        getRegionList(this.CityOperationForm.cityId).then(data => {
          this.conutyList = data.data.content;
        });
        this.CityOperationForm.countyId = "";
      }
    },
    // 提交
    submitForm(CityOperationForm) {
      this.$refs[CityOperationForm].validate(valid => {
        if (valid) {
          trimCompanySaveOrUpdate({
            addressDetail: this.CityOperationForm.address,
            centerId:this.CityOperationForm.cityOperationValue,
            city: this.CityOperationForm.cityId,
            contractName: this.CityOperationForm.userName,
            isDisplay: this.CityOperationForm.isDisplay,
            district: this.CityOperationForm.countyId,
            goodRate: this.CityOperationForm.commentsInput,
            logoImage: this.CityOperationForm.logo,
            mobile: this.CityOperationForm.phone,
            name: this.CityOperationForm.nickname,
            province: this.CityOperationForm.provinceId,
            remark: this.CityOperationForm.introduction,
            sort: this.CityOperationForm.slot,
            startingOrder: this.CityOperationForm.commentsInput1
          }).then(data => {
            if (data.data.status == 0) {
              this.$message({
                message: "成功发布装修公司",
                type: "success"
              });
              this.$router.go(-1);
            } else {
              this.$message({
                message: "发布装修公司失败",
                type: "error"
              });
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },

  //是否有富文本编辑
  components: { uploadImg }
};
</script>

<style lang='less' scoped>
#add_CityOperation {
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
      //   width: 60%;
      text-align: left;
      .img_box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          width: 100px;
          height: 100px;
          margin-left: 25px;
        }
      }
      .el-cascader .el-input__inner {
        width: 300px; //搜索框宽度
      }
    }
  }
}
.se-box {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
