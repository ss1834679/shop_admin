<template>
  <div id="addAlter">
    <!-- 文章的添加和修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.params.data">修改文章</span>
          <span class="title" v-else>添加文章</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="articelform" ref="articelform" label-width="100px" class="demo-ruleForm">
          <el-form-item label="所属分类">
            <el-select v-model="articelform.categoryId" placeholder="请选择分类">
              <template v-for="item in catelist">
                <el-option :key="item._id" :label="item.name" :value="item._id"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="articelform.name"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <wang-editor
              :value="articelform.detail"
              @getHtmlFromWang="(value)=>{this.articelform.detail=value}"
            ></wang-editor>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="articelform.desc"></el-input>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="articelform.name"></el-input>
          </el-form-item>
          <el-form-item label="商品图片">
            <upload-img
              v-if="this.$route.params.data"
              @getimgArr="(imgarr)=>{this.articelform.imgs = imgarr}"
              :imgArr="this.articelform.imgs"
            ></upload-img>
            <upload-img
              v-else
              @getimgArr="(imgarr)=>{this.articelform.imgs = imgarr}"
              :imgArr="imgArr"
            ></upload-img>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="articelform.name"></el-input>
          </el-form-item>
          <el-form-item label="是否热门">
            <el-radio-group v-model="articelform.resource">
              <!-- label就是值 -->
              <el-radio label="线上品牌商赞助">线上</el-radio>
              <el-radio label="线下场地免费">线下</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model.number="articelform.rank"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('articelform')">提交</el-button>
            <el-button @click="resetForm('articelform')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import wangEditor from "../../components/wangEditor";
import uploadImg from "../../components/uploadImg";
export default {
  data() {
    return {
      articelform: {
        title: "",
        desc: "",
        price: "",
        categoryId: "",
        pCategoryId: "0",
        detail: "",
        resource: true,
        imgs: [],
        rank: 0
      },
      catelist: [],
      detailtext: null,
      imgArr: []
    };
  },
  mounted() {
    if (this.$route.params.data) {
      this.articelform = this.$route.params.data;
      console.log(this.$route.params.data);
    }
  },
  methods: {
    // submitForm(formName) {
    // addProduct(this.productform).then(res => {
    //   if (res.data.status == 0) {
    //     this.$message({
    //       type: "success",
    //       message: "商品添加成功",
    //       center: true
    //     });
    //     this.$router.go(-1);
    //   }
    // });
    // },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  //是否有富文本编辑
  components: {
    wangEditor,
    uploadImg
  }
};
</script>

<style lang='less'>
#addAlter {
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
    }
  }
}
</style>
