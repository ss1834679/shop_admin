<template>
  <div id="houseCategory_add">
    <!-- 添加户型-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">添加户型</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form :model="houseCategoryAddForm" ref="houseCategoryAddForm" :rules="houseCategoryAddRules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="houseCategoryAddForm.name" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="排序:" prop="sort">
            <template slot-scope>
              <el-input placeholder="0" v-model="houseCategoryAddForm.sort" style="width:300px"></el-input>
              <div style="font-size:13px;color:#888">数字越大前端显示越靠前，数字相同按添加时间显示</div>
            </template>
          </el-form-item>
          <el-form-item label="是否显示" prop="status" v-if="radioShow">
            <el-radio-group v-model="houseCategoryAddForm.status">
              <el-radio :label="'1'">显示</el-radio>
              <el-radio :label="'0'">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否显示" prop="status" v-if="!radioShow">
            <el-radio-group v-model="houseCategoryAddForm.status">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传图片：" v-if="showImg" prop="houseDesignImg">
            <upload-img
              @getimgArr="(imgarr)=>{this.houseCategoryAddForm.houseDesignImg = imgarr}"
              :imgArr="this.houseCategoryAddForm.houseDesignImg"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('houseCategoryAddForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { addHouseType, getHouseType, updateHouseType } from "../../api/house";
import uploadImg from "../../components/uploadImg";
export default {
  components: {
    uploadImg
  },
  data() {
    return {
      radioShow: true,
      showImg: true /*是否回显图片 */,
      houseCategoryAddForm: {
        /*添加户型数据 */
        name: "",
        sort: "",
        status: "1",
        houseDesignImg: ""
      },
      houseCategoryAddRules: {
        /*添加户型输入验证 */
        name: [{ required: true, message: "请填写名称", trigger: "blur" }],
        status: [{ required: true, message: "选择是否显示", trigger: "blur" }],
        slot: [{ required: true, message: "请输入排序", trigger: "blur" }]
        // houseDesignImg: [{ required: true, message: "请上传图片", trigger: "blur" }],
      }
    };
  },
  mounted() {
    //  如果重编辑按钮点进来，根据id获取数据回显
    if (this.$route.query.grade == "3") {
      this.radioShow = false;
      getHouseType({ code: this.$route.query.code }).then(data => {
        this.houseCategoryAddForm = data.data.data;
        this.houseCategoryAddForm.houseDesignImg = this.houseCategoryAddForm.img;
        this.refreshImg();
      });
    }
  },
  methods: {
    // 刷新图片
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    // 提交
    submitForm(houseCategoryAddForm) {
      this.$refs[houseCategoryAddForm].validate(valid => {
        if (valid) {
          //  添加子菜单提交
          if (this.$route.query.grade == "2") {
            addHouseType({
              grade: this.$route.query.grade,
              img: this.houseCategoryAddForm.houseDesignImg,
              name: this.houseCategoryAddForm.name,
              parentCode: this.$route.query.code,
              sort: this.houseCategoryAddForm.sort,
              status: this.houseCategoryAddForm.status
            }).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  message: data.data.data,
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: data.data.msg,
                  type: "error"
                });
              }
            });
            // 添加父菜单提交
          } else if (this.$route.query.grade == "1") {
            addHouseType({
              grade: "1",
              img: this.houseCategoryAddForm.houseDesignImg,
              name: this.houseCategoryAddForm.name,
              sort: this.houseCategoryAddForm.sort,
              status: this.houseCategoryAddForm.status
            }).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  message: data.data.data,
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: data.data.msg,
                  type: "error"
                });
              }
            });
            // 编辑菜单提交
          } else if (this.$route.query.grade == "3") {
            updateHouseType({
              code: this.$route.query.code,
              img: this.houseCategoryAddForm.houseDesignImg,
              name: this.houseCategoryAddForm.name,
              sort: this.houseCategoryAddForm.sort,
              status: this.houseCategoryAddForm.status
            }).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  message: data.data.data,
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: data.data.msg,
                  type: "error"
                });
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang='less'>
#houseCategory_add {
  width: 100%;
  height: auto;

  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
        .el-button {
          margin-right: 20px;
          height: 36px;
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