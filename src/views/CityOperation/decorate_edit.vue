<template>
  <div id="add_CityOperation">
    <!-- 修改装修公司-->
    <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
        <span class="title">编辑装修公司</span>
        <div>
           <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form :model="decorateEditForm" ref="decorateEditForm" :rules="cityOperationRules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="名称"   prop="name">
            <el-input v-model="decorateEditForm.name" style="width:300px" ></el-input>
          </el-form-item>
        <el-form-item label="logo" v-if="showImg" prop="logoImage">
            <upload-img @getimgArr="(imgarr)=>{this.decorateEditForm.logoImage = imgarr}" :imgArr="decorateEditForm.logoImage" :limit="1"></upload-img>
          </el-form-item>
     <el-form-item label="所属区域运营中心" prop="cityOperationValue" >
            <el-select v-model="decorateEditForm.cityOperationValue" filterable placeholder="请选择所属区域运营中心">
              <el-option v-for="item in cityoperationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
             <el-form-item label="联系人姓名"  prop="contractName">
            <el-input v-model="decorateEditForm.contractName" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="电话："  prop="mobile" >
            <el-input v-model.number="decorateEditForm.mobile" style="width:300px" @blur="blueText"></el-input>
          </el-form-item>
             <el-form-item label="城市:" >
                <div style="display:flex">
                  <div style="width:140px;">
                    <el-select v-model="decorateEditForm.province" placeholder="省"  @change="changeProvince({level:1})" filterable clearable>
                      <el-option :label="item.criName" :value="item.criCode" v-for="item in provinceList" :key="item.id"></el-option>
                    </el-select>
                  </div>
                  <div style="width:140px;">
                    <el-select v-model="decorateEditForm.city" placeholder="市" @change="changeProvince({level:2})" filterable clearable>
                      <el-option :label="item.criName" :value="item.criCode" v-for="item in cityList" :key="item.id"></el-option>
                    </el-select>
                  </div>
                  <div style="width:140px;">
                    <el-select v-model="decorateEditForm.district" placeholder="区"  @change="changeProvince({level:3})" filterable clearable>
                      <el-option :label="item.criName" :value="item.criCode" v-for="item in conutyList" :key="item.id"></el-option>
                    </el-select>
                  </div>
                </div>
              </el-form-item>
         <el-form-item label="详细地址" prop="addressDetail">
            <el-input v-model="decorateEditForm.addressDetail" style="width:300px"></el-input>
          </el-form-item>
         <el-form-item label="简介" prop="remark">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="decorateEditForm.remark" style="width:400px"></el-input>
          </el-form-item>
         <el-form-item label="排序" prop="sort">
            <el-input v-model.number="decorateEditForm.sort" style="width:300px"></el-input>
          </el-form-item>
         <el-form-item label="列表显示" prop="isDisplay">
            <el-radio-group v-model="decorateEditForm.isDisplay">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
            <el-form-item label="虚拟好评率:" prop="goodRate">
                <template slot-scope="">
                    <el-input placeholder="请输入内容" v-model.number="decorateEditForm.goodRate" style="width:300px">
                <template slot="append">%</template> </el-input>
                <div style="font-size:13px;color:#888">前端显示好评率=真实好评率+虚拟好评率</div>
                </template>
           </el-form-item>
            <el-form-item label="虚拟进行中订单数:" prop="startingOrder">
                <template slot-scope="">
                    <el-input placeholder="请输入内容" v-model.number="decorateEditForm.startingOrder" style="width:300px"> </el-input>
                <div style="font-size:13px;color:#888">前端显示进行中的订单数=真实进行中的订单数+虚拟进行中的订单数</div>
                </template>
           </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="submitForm('decorateEditForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {trimCompanyFindOne,trimCompanySaveOrUpdate,businessCenterSelectAll} from "../../api/cityOperation";
import {getProvinceList,getRegionList} from "../../api/usercenter";
import uploadImg from "../../components/uploadImg";
export default {
  data() {
    return {
      showImg:true,/*是否回显图片 */
      cityoperationList:[],/*所属区域运营中心的数据列表 */
      decorateEditForm: {
        cityOperationValue:'',/*所属区域运营中心 */
        id:'',/*装修公司id */
        name: "" /* 用户名 */,
        logoImage: "" /* logo图片 */,
        contractName: "" /* 联系人名称 */,
        mobile: "" /* 电话 */,
        city:'',/* 城市 */
        addressDetail:'',/* 详细地址 */
        sort:'',/* 排序 */
        remark:'',/* 输入的简介 */
        province:'', /* 省市 */
        goodRate:'',/* 虚理评论输入 */
        startingOrder:'',/* 虚拟进行中订单数输入 */
        completeOrder:'',/* 虚拟已完成订单数输入 */
        isDisplay:'',/* 是否显示 */
        district:'' /* 区县 */
        },
        provinceList:[],/* 省市列表 */
        cityList:[],/* 城市列表*/
        conutyList:[],/* 区县列表 */
        cityOperationRules: {
        name: [{ required: true, message: "请填写名称", trigger: "blur" }],
        contractName: [{ required: true, message: "请填写联系人", trigger: "blur" }],
        goodRate: [{ required: true, message: '请输入虚拟好评率', trigger: 'blur' }],
        addressDetail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        startingOrder: [{ required: true, message: '请输入虚拟进行中订单数', trigger: 'blur' }],
        completeOrder: [{ required: true, message: '请输入虚拟已完成订单数', trigger: 'blur' }],
        logoImage: [{ required: true, message: "请上传logo图", trigger: "blur" }],
        cityOperationValue: [{ required: true, message: "请选择区域运营中心", trigger: "blur" }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
            ],
      },
    };
  },
  watch:{
    //   根据搜索关联的商品，获取sku商品
    searchGoodId(){
      this.goodsItem={}
      this.searchGoodsList.map(item=>{
        if(this.searchGoodId==item.id){
          this.goodsItem={
            id:item.id,
            goodsTitle:item.goodsTitle,
            num:1
          }
        }
      })
    },

  },
  mounted() {
    // 查询单个装修公司
    trimCompanyFindOne({
      id:this.$route.query.id
    }).then(data=>{
     this.decorateEditForm=data.data.data
     this.getCityOperationValue()
     this.refreshImg()
    //  回显城市，请求城市数据
    getRegionList(this.decorateEditForm.province).then(data => {
      this.cityList = data.data.content;
     this.cityList.forEach(item=>{
       if(this.decorateEditForm.city==item.criCode){
         this.decorateEditForm.city=item.criName
       }
     })
    });    
    //  回显城市，请求城市数据
      getRegionList(this.decorateEditForm.city).then(data => {
          this.conutyList = data.data.content;
           this.conutyList.forEach(item=>{
       if(this.decorateEditForm.district==item.criCode){
         this.decorateEditForm.district=item.criName
       }
     })
        });
      
    })
       // 获取所属区域运营中心
    businessCenterSelectAll().then(data=>{
     this.cityoperationList=data.data.data
    })
    /**
     * 获取省直辖市地址列表
     */
    getProvinceList().then(data => {
      this.provinceList = data.data.content;
       this.provinceList.forEach(item=>{
       if(this.decorateEditForm.province==item.criCode){
         this.decorateEditForm.province=item.criName
       }
     })
    });
 
  },
  methods: {
    // 手机号码验证
      blueText(e) {
      if (!/^1[3456789]\d{9}$/.test(e.target.value)) {
        this.$message.warning("请输入正确手机号");
        this.decorateEditForm.mobile = "";
      }
    },
    getCityOperationValue(){
  //  获取对应的所属城市区域运营中心
      this.cityoperationList.forEach(item=>{
       if(this.decorateEditForm.centerId==item.id){
       this.decorateEditForm.cityOperationValue=item.name
       }
    })
    },
    // 刷新图片
      refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
     // 切换省市区
    changeProvince(obj) {
      if (obj.level == 1) {
        getRegionList(this.decorateEditForm.province).then(data => {
          this.cityList = data.data.content;
        });
        this.decorateEditForm.city = "";
      } else if(obj.level==2){
           getRegionList(this.decorateEditForm.city).then(data => {
          this.conutyList = data.data.content;
        });
        this.decorateEditForm.district=""
      }
    },
    //提交
    submitForm(decorateEditForm) {
         this.provinceList.forEach(item=>{
       if(this.decorateEditForm.province==item.criName ){
         this.decorateEditForm.province=item.criCode
       }
     })
        this.cityList.forEach(item=>{
       if(this.decorateEditForm.city==item.criName){
         this.decorateEditForm.city=item.criCode
       }
     })
        this.conutyList.forEach(item=>{
       if(this.decorateEditForm.district==item.criName){
         this.decorateEditForm.district=item.criCode
       }
     })
      this.$refs[decorateEditForm].validate(valid=>{
        if(valid){
         trimCompanySaveOrUpdate({
  addressDetail:this.decorateEditForm.addressDetail,
  centerId:this.decorateEditForm.cityOperationValue,
  city: this.decorateEditForm.city,
  id: this.decorateEditForm.id,
  completeOrder:this.decorateEditForm.commentsInput2,
  contractName: this.decorateEditForm.contractName,
  isDisplay: this.decorateEditForm.isDisplay,
  district: this.decorateEditForm.district,
  goodRate: this.decorateEditForm.goodRate,
  logoImage:this.decorateEditForm.logoImage,
  mobile: this.decorateEditForm.mobile,
  name: this.decorateEditForm.name,
  province: this.decorateEditForm.province,
  remark:this.decorateEditForm.remark,
  sort: this.decorateEditForm.sort,
  startingOrder:this.decorateEditForm.startingOrder,
         }).then(data=>{
          if(data.data.status==0){
            this.$message({
              message:'成功修改装修公司',
              type:'success'
            })
            this.$router.go(-1)
            
          }else{
           this.$message({
              message:'修改装修公司失败',
              type:'error'
            })
          }
         })
        }
      })
       
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  
  },
  
  //上传图片组件
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
.se-box{
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
