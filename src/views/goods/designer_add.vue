<template>
  <div id="designer_add">
    <!-- 设计师的修改和添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <span class="title">添加设计师</span>
        </div>
      </div>
      <!-- 设计师的 表数据验证 -->
      <div class="content">
        <el-form :model="designerform" ref="designerform" :rules="designerRule" label-width="110px" class="demo-ruleForm">
          <el-form-item label="分类" required class="cascader">设计师</el-form-item>
          <el-form-item label="设计师姓名" required prop="designerName">
            <el-input v-model="designerform.designerName" required></el-input>
          </el-form-item>
          <el-form-item label="设计师昵称">
            <el-input v-model="designerform.designerFullName" required></el-input>
          </el-form-item>
          <el-form-item label="设计师职称" required prop="designerLevel">
            <el-radio-group v-model="designerform.designerLevel">
              <el-radio :label="1">精英设计师</el-radio>
              <el-radio :label="2">主任设计师</el-radio>
              <el-radio :label="3">首席设计师</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="设计师类型" required prop="designerType">
            <el-radio-group v-model="designerform.designerType">
              <el-radio :label="0">平台认证</el-radio>
              <el-radio :label="1">入驻</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="设计师简介" required prop="designerDesc">
            <el-input type="textarea" v-model="designerform.designerDesc"></el-input>
          </el-form-item>
          <el-form-item label="排序" required prop="designerWeight">
            <el-input v-model.number="designerform.designerWeight"></el-input>
          </el-form-item>
          <!-- <el-form-item label="虚拟评分" required prop="virtualScore">
            <el-input-number v-model="designerform.virtualScore" :precision="2" :controls="false" placeholder="虚拟评分" :min="0"></el-input-number>
          </el-form-item>-->
          <el-form-item label="从业时间" required prop="designerYear">
            <el-input v-model.number="designerform.designerYear">
              <template slot="append">年</template>
            </el-input>
          </el-form-item>
		  <el-form-item label="擅长风格" prop="designerStyle">
		    <el-select class="styleLength" v-model="designerform.designerStyle" multiple :multiple-limit="5" placeholder="请选择擅长的装修设计风格（可多选，最多5项）">
		        <el-option
		          v-for="item in designerStyleList"
		          :key="item.id"
		          :label="item.title"
		          :value="item.title">
		        </el-option>
		      </el-select>
		  </el-form-item>
          <el-form-item label="设计师售价" class="is-required" prop="designerPrice">
            <precision-input
              :num="designerform.designerPrice"
              :text="'元/㎡'"
              :type="'price'"
              @getNum="(value)=>{this.designerform.designerPrice=value}"
            ></precision-input>
          </el-form-item>
          <el-form-item label="展示区间价" required>
            <precision-input :num="designerform.designerMin" :text="'元'" :type="'price'" @getNum="(value)=>{this.designerform.designerMin=value}"></precision-input>
            <span>~~</span>
            <precision-input :num="designerform.designerMax" :text="'元'" :type="'price'" @getNum="(value)=>{this.designerform.designerMax=value}"></precision-input>
          </el-form-item>
          <el-form-item label="账号关联" required prop="designerAccount">
            <el-select v-model="designerform.designerAccount" filterable placeholder="请选择设计师账号">
              <el-option v-for="item in accountList" :key="item.id" :label="item.nickName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属设计公司" required prop="companyId">
            <el-select v-model="designerform.companyId" filterable placeholder="选择所属设计公司">
              <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="设计师关键词" required>
            <tag-add :arrData="styleList" text="添加关键词" @getArrData="(value)=>{getStyleArr(value)}"></tag-add>
          </el-form-item>-->
          <el-form-item label="设计师头像" required prop="designerHead">
            <upload-img @getimgArr="(imgarr)=>{this.designerform.designerHead = imgarr}" :imgArr="this.designerform.designerHead" :limit="1"></upload-img>
          </el-form-item>
          <el-form-item label="设计师主图" required prop="designerImage">
            <upload-img @getimgArr="(imgarr)=>{this.designerform.designerImage = imgarr}" :imgArr="this.designerform.designerImage" :limit="1"></upload-img>
          </el-form-item>
          <el-form-item label="设计师组图" required>
            <uploadimg-arr @getimgArr="(imgarr)=>{this.image = imgarr}" :imgArr="image" :limit="5"></uploadimg-arr>
          </el-form-item>
          <el-form-item label="设计师详情" required>
            <wang-editor :value="designerform.designerDetails" @getHtmlFromWang="(value)=>{this.designerform.designerDetails=value}"></wang-editor>
          </el-form-item>
          <!-- <el-form-item label="赠送涂邦币">
            <el-input disabled placeholder="此功能暂不开放"></el-input>
          </el-form-item>
          <el-form-item label="赠送等级成长值">
            <el-input disabled placeholder="此功能暂不开放"></el-input>
          </el-form-item>
          <el-form-item label="涂邦币购买金额">
            <el-input disabled placeholder="此功能暂不开放"></el-input>
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="submitForm('designerform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
import uploadimgArr from "../../components/uploadImgArr";
import precisionInput from "../../components/precisionInput";
import wangEditor from "../../components/wangEditor";
// import tagAdd from "../../components/tags";
import { insertDesigner, getDesignerCompanyAll ,getDesignerStyle} from "../../api/designer";
import { getUserDesigner } from "../../api/permission";
export default {
  components: { uploadImg, uploadimgArr, wangEditor, precisionInput },
  data() {
    return {
      designerform: {
        virtualScore: 0 /* 虚拟评分 */,
        designerName: "" /* 设计师姓名 */,
        designerAccount: "" /* 设计师账号信息 */,
        companyId: "" /* 所属设计师公司id */,
        designerDetails: "" /* 设计师详情 */,
        designerHead: "" /* 设计师头像链接 */,
        designerImage: "" /* 设计师主图链接 */,
        designerDesc: "" /* 设计师简介 */,
        designerLevel: 1 /* 设计师等级，1代表精英设计师，2代表主任设计师，3代表首席设计师 */,
        designerPicture: "" /* 设计师展示轮播图 不传 */,
        designerPrice: "" /* 设计师价格 */,
        designerStyle: "" /* 设计师商场风格 不同风格用逗号隔开 */,
        designerType: 0 /* 设计师类型，设计师类型，0代表平台认证， 1代表未认证 */,
        designerWeight: 0 /* 设计师权重值 */,
        designerYear: 1 /* 设计师从业年限 */,
        designerMin: null /* 设计师展示价格最小值 */,
        designerMax: null /* 设计师展示价格最大值  */,
        designerFullName: "" /*,, 设计师昵称 */,
      },
      image: [] /* 设计师展示轮播图 */,
      accountList: [] /* 设计师部门的成员 1236128796805955584 设计师部门id 后期如果改动则改动这里的数据*/,
      companyList: [] /* 设计师公司列表 */,
      styleList: [] /* 设计师关键字 */,
      designerRule: {
        designerName: [{ required: true, message: "请填写设计师姓名", trigger: "blur" }],
        designerAccount: [{ required: true, message: "请选择设计师账号", trigger: "blur" }],
        designerHead: [{ required: true, message: "请上传设计师头像", trigger: "blur" }],
        designerImage: [{ required: true, message: "请上传设计师主图", trigger: "blur" }],
        designerLevel: [{ required: true, message: "请选择设计师等级", trigger: "blur" }],
        designerPrice: [{ required: true, message: "请填写设计师单价", trigger: "blur" }],
        designerWeight: [{ required: true, message: "请填写设计师排序", trigger: "blur" }],
        designerType: [{ required: true, message: "请选择设计师类型", trigger: "blur" }],
        designerYear: [{ required: true, message: "请填写从业年限", trigger: "blur" }],
        designerFullName: [{ required: true, message: "请填写设计师昵称", trigger: "blur" }],
        designerDesc: [{ required: true, message: "请填写设计师简介", trigger: "blur" }],
		designerStyle:[{required: true, message: "请选择设计师擅长风格", trigger: "blur" }],
      },
	  designerStyleList:[],//设计师风格
    };
  },
  mounted() {
    /* 初始化用户表 */
    getUserDesigner("1236128796805955584").then(data => {
      if (data.data.status == 200) {
        this.accountList = data.data.content;
      }
    });
    /* 初始化设计师公司列表 */
    getDesignerCompanyAll().then(data => {
      if (data.data.status == 200) {
        this.companyList = data.data.content;
      }
    });
	/* 设计师装修风格 */
	getDesignerStyle().then(data =>{
		if(data.status == 200){
			this.designerStyleList = data.data.data;
		}
	})
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.image.length == 0 ||
            this.designerform.designerDetails == "" ||
            this.designerform.designerDetails == "<p><br></p>"
          ) {
            this.$message.error("请上传完信息！");
          } else {
			this.designerform.designerStyle = this.designerform.designerStyle.toString();
            insertDesigner(this.designerform, this.image).then(data => {
              if (data.data.status == 200) {
                this.$router.push({ name: "designer_Idx" });
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
				this.designerform.designerStyle = this.designerform.designerStyle.split(",");
              } else {
                this.$message.error(data.data.msg);
				this.designerform.designerStyle = this.designerform.designerStyle.split(",");
              }
            });
          }
        } else {
          this.$message.error("请上传完信息！");
        }
      });
    },
    getStyleArr(value) {
      //this.designerform.designerStyle = value.join(",");
    }
  }
};
</script>

<style lang='less'>
#designer_add {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        margin-left: 20px;
        width: 100%;
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      text-align: left;
    }
  }
  .styleLength{
	  width: 100%;
  }
}
</style>
