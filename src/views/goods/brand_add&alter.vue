<template>
  <div id="addAlter">
    <!-- 品牌的修改和添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.query.id">修改品牌</span>
          <span class="title" v-else>添加品牌</span>
        </div>
      </div>
      <!-- 品牌的 表数据验证 -->
      <div class="content">
        <el-form :model="brandform" ref="brandform" label-width="110px" class="demo-ruleForm">
          <el-form-item label="品牌名称">
            <el-input v-model="brandform.brandName"></el-input>
          </el-form-item>
          <el-form-item label="品牌故事">
            <el-input v-model="brandform.brandDesc"></el-input>
          </el-form-item>
          <el-form-item label="品牌首字母">
            <el-input v-model="brandform.first"></el-input>
          </el-form-item>
          <el-form-item label="所属分类(多选)" class="cascader">
            <el-cascader
              ref="categoryList"
              placeholder="请选择分类"
              v-model="categoryIds"
              :props="props"
              :options="categoryList"
              :show-all-levels="false"
              @visible-change="elCascaderOnlick"
              @expand-change="elCascaderOnlick"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="品牌图片">
            <upload-img
              v-if="showImg"
              @getimgArr="(imgarr)=>{this.brandform.brandLogo = imgarr}"
              :size="{ height: 100, width: 100 }"
              :imgArr="this.brandform.brandLogo"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="品牌专区大图">
            <upload-img v-if="showImg" @getimgArr="(imgarr)=>{this.brandform.brandImage = imgarr}" :imgArr="this.brandform.brandImage" :limit="1"></upload-img>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="brandform.brandPhone"></el-input>
          </el-form-item>
          <el-form-item label="品牌状态">
            <el-radio-group v-model="brandform.brandStatus">
              <!-- label就是值 -->
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
import { getCategory } from "../../api/category";
import { getBrand, addBrand, updateBrand } from "../../api/brand";
export default {
  data() {
    return {
      brandform: {
        brandName: "" /* 品牌名称 */,
        brandDesc: "" /* 品牌简介 */,
        brandLogo: "" /* 品牌LOGO */,
        brandImage: "" /* 品牌图片 */,
        brandPhone: "" /* 品牌联系电话 */,
        brandStatus: 1 /* 品牌是否显示，0代表不显示，1代表显示 */,
        first: "" /* 品牌首字母 */,
        isDelete: 0 /* 是否删除 */,
        categoryIds: "" /* 所属分类的id数组 目前先没有这个功能 */,
        categoryIdList: []
      },
      categoryIds: [] /* 所属分类的中间变量 */,
      showImg: true,
      props: {
        value: "id",
        label: "categoryName",
        checkStrictly: true /* 子父不关联 */,
        disabled: "isParent" /* 只能选择三级 */,
        multiple: true /* 多选 */,
        emitPath: false /* 只返回选中id */,
        children: "childList"
      } /* 级联选择配置 */,
      categoryList: [
        {
          id: "1214083248477495298",
          createTime: "2020-01-06 15:16:18",
          updateTime: "2020-01-06 15:16:18",
          operator: "admin",
          isDelete: 0,
          categoryName: "一级分类1",
          categorySort: 1,
          categoryStatus: true,
          isParent: false,
          parentId: "1",
          categoryIcon: "http://192.168.0.233:8400/file/5e12cd54a1a09a0baeb1443e",
          childList: null
        }
      ]
    };
  },
  mounted() {
    if (this.$route.query.id) {
      /* 通过id获取品牌信息 */
      getBrand({ id: this.$route.query.id }).then(data => {
        if (data.data.status == 0) {
          let obj = data.data.data;
          Object.keys(obj).forEach(key => {
            if (this.brandform.hasOwnProperty(key)) {
              this.brandform[key] = obj[key];
            }
          });
          this.categoryIds = this.brandform.categoryIdList;
          this.refreshImg();
        }
      });
    }
    /* 初始化级联列表 */
    getCategory().then(data => {
      if (data.data.status == 0) {
        this.categoryList = data.data.data;
      }
    });
  },
  methods: {
    submitForm() {
      if (this.$route.query.id) {
        this.brandform.brandId = this.$route.query.id;
        /* 对分类id进行拼接 */
        if (Array.isArray(this.categoryIds)) {
          this.brandform.categoryIds = this.categoryIds.join(",");
        }
        updateBrand(this.brandform).then(data => {
          if (data.data.status == 0) {
            this.$message({
              type: "success",
              message: "品牌修改成功",
              center: true
            });
            this.$router.go(-1);
          } else {
            this.$message({
              type: "error",
              message: "品牌修改失败",
              center: true
            });
          }
        });
      } else {
        /* 对分类id进行拼接 */
        this.brandform.categoryIds = this.categoryIds.join(",");
        addBrand(this.brandform).then(data => {
          if (data.data.status == 0) {
            this.$message({
              type: "success",
              message: "品牌添加成功",
              center: true
            });
            this.$router.go(-1);
          } else {
            this.$message({
              type: "error",
              message: "品牌添加失败",
              center: true
            });
          }
        });
      }
    },
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    elCascaderOnlick() {
      let that = this;
      setTimeout(function() {
        document.querySelectorAll(".el-cascader-panel .el-radio").forEach(el => {
          el.onclick = function() {
            that.$refs.categoryList.dropDownVisible = false;
          };
        });
      }, 100);
    }
  },
  components: { uploadImg }
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
      .cascader {
        .el-form-item__content {
          .el-cascader {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
