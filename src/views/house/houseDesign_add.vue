<template>
  <div id="houseDesign_add">
    <!-- 添加设计方案-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">添加设计方案</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form :model="houseDesignForm" ref="houseDesignForm" :rules="houseDesignRules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="houseDesignForm.name" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="户型" prop="houseTypeId">
            <el-cascader
              ref="houseTypeList"
              placeholder="请选择分类"
              v-model="houseDesignForm.houseTypeId"
              :props="props"
              :options="houseTypeList"
              :show-all-levels="false"
              @visible-change="elCascaderOnlick"
              @expand-change="elCascaderOnlick"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="风格" prop="houseStyleId">
            <el-select v-model="houseDesignForm.houseStyleId" placeholder="请选择风格">
              <el-option v-for="item in houseStyleList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传封面图" prop="img" v-if="showImg">
            <upload-img @getimgArr="(imgarr)=>{this.houseDesignForm.img = imgarr}" :imgArr="this.houseDesignForm.img" :limit="1" :notMultiple="true"></upload-img>
          </el-form-item>
          <el-form-item label="3D图链接" prop="threedLink">
            <el-input v-model="houseDesignForm.threedLink" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="施工图" prop="constructionImg" v-if="showImg">
            <uploadimg-arr v-if="showImg" @getimgArr="(imgarr)=>{this.image1 = imgarr}" :imgArr="image1" :limit="10"></uploadimg-arr>
          </el-form-item>
          <el-form-item label="报价单" prop="quotation" v-if="showImg">
            <uploadimg-arr v-if="showImg" @getimgArr="(imgarr)=>{this.image = imgarr}" :imgArr="image" :limit="1"></uploadimg-arr>
          </el-form-item>
          <el-form-item label="平面图" prop="planImg" v-if="showImg">
            <uploadimg-arr v-if="showImg" @getimgArr="(imgarr)=>{this.image2 = imgarr}" :imgArr="image2" :limit="10"></uploadimg-arr>
          </el-form-item>
          <el-form-item label="可见时长:" prop="watchTime">
            <template slot-scope>
              <el-input placeholder="-1" v-model="houseDesignForm.watchTime" style="width:300px">
                <template slot="append">秒</template>
              </el-input>
              <div style="font-size:13px;color:#888">用户可浏览当前方案的时长，默认-1秒,没有时间限制</div>
            </template>
          </el-form-item>
          <el-form-item label="查看次数:" prop="watchNum">
            <template slot-scope>
              <el-input placeholder="-1" v-model="houseDesignForm.watchNum" style="width:300px" disabled>
                <template slot="append">次</template>
              </el-input>
              <div style="font-size:13px;color:#888">用户可浏览当前方案的次数，默认1次</div>
            </template>
          </el-form-item>
          <el-form-item label="排序:" prop="sort">
            <template slot-scope>
              <el-input placeholder="0" v-model="houseDesignForm.sort" style="width:300px"></el-input>
              <div style="font-size:13px;color:#888">数字越大前端显示越靠前，数字相同按添加时间显示</div>
            </template>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('houseDesignForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllUsableDecorateStyle } from "../../api/setings";
import { getAllUsableHouseType, addHouseDetail, getHouseDetailById } from "../../api/house";
import uploadimgArr from "../../components/uploadImgArr";
import uploadImg from "../../components/uploadImg";
export default {
  data() {
    return {
      showImg: true /*是否回显图片 */,
      image: [] /*报价单图片数组 */,
      image1: [] /*施工图图片数组 */,
      image2: [] /*平面图数组 */,
      houseStyleList: [] /* 风格列表 */,
      houseTypeList: [] /* 户型分类列表 */,
      houseDesignForm: {
        houseStyleId: "" /* 选择户型风格id值 */,
        houseTypeId: "" /* 选择户型id值 */,
        name: "" /* 方案名称 */,
        threedLink: "" /*https://720.tbzj.net/ 3D链接 */,
        img: "" /* 封面图 */,
        quotation: [] /* 报价单 */,
        planImg: [] /* 平面图 */,
        constructionImg: [] /* 施工图 */,
        watchTime: "-1" /* 输入的浏览时长 */,
        watchNum: "-1" /* 输入的可浏览次数 */,
        sort: "" /* 输入的浏览排序 */
      },
      props: {
        value: "id",
        label: "name",
        checkStrictly: true /* 子父不关联 */,
        disabled: "grade" /* 只能选择二级 */,
        multiple: false /* 多选 */,
        emitPath: false /* 只返回选中id */,
        children: "bos"
      } /* 级联选择配置 */,
      houseDesignRules: {
        /* 添加全屋方案输入验证 */
        name: [{ required: true, message: "请填写名称", trigger: "blur" }],
        watchTime: [{ required: true, message: "请输入浏览时长，只能输入整数", trigger: "blur" }],
        watchNum: [{ required: true, message: "请输入查看次数，只能输入整数", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序，只能输入整数", trigger: "blur" }],
        houseStyleId: [{ required: true, message: "请选择风格", trigger: "blur" }],
        houseTypeId: [{ required: true, message: "请选择户型", trigger: "blur" }],
        img: [{ required: true, message: "请上传封面图", trigger: "blur" }]
        // constructionImg: [{ required: true, message: "请上传户型施工图", trigger: "blur" }],
        // quotation: [{ required: true, message: "请上传户型报价单", trigger: "blur" }],
        // planImg: [{ required: true, message: "请上传户型平面图", trigger: "blur" }],
      }
    };
  },
  watch: {
    image: {
      /* 监听上传的报价单 */
      handler() {
        this.houseDesignForm.quotation = this.image;
      }
    },
    image2: {
      /* 监听上传的平面图 */
      handler() {
        this.houseDesignForm.planImg = this.image2;
      }
    },
    image1: {
      /* 监听上传的施工图 */
      handler() {
        this.houseDesignForm.constructionImg = this.image1;
      }
    }
  },
  mounted() {
    //  如果是重编辑按钮点击进来的，根据id获取方案详情信息
    if (this.$route.query.type == "2") {
      getHouseDetailById({ id: this.$route.query.id }).then(data => {
        this.houseDesignForm = data.data.data;
        this.image = JSON.parse(this.houseDesignForm.quotation);
        this.image2 = JSON.parse(this.houseDesignForm.planImg);
        this.image1 = JSON.parse(this.houseDesignForm.constructionImg);
        this.refreshImg();
      });
    }
    //  获取选择户型列表
    getAllUsableHouseType().then(data => {
      this.houseTypeList = data.data.data;
    });
    //  获取选择风格列表
    getAllUsableDecorateStyle().then(data => {
      this.houseStyleList = data.data.data;
    });
  },
  methods: {
    // 刷新图片
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    // 级联选择
    elCascaderOnlick() {
      let that = this;
      setTimeout(function() {
        document.querySelectorAll(".el-cascader-panel .el-radio").forEach(el => {
          el.onclick = function() {
            that.$refs.houseTypeList.dropDownVisible = false;
          };
        });
      }, 100);
    },
    // 提交
    submitForm(houseDesignForm) {
      this.$refs[houseDesignForm].validate(valid => {
        if (valid) {
          // 新增全屋设计方案提交
          if (
            this.houseDesignForm.threedLink &&
            this.houseDesignForm.threedLink.indexOf("/tiao?url=") == -1 &&
            this.houseDesignForm.threedLink.indexOf("https://720.tbzj.net") == -1 &&
            this.houseDesignForm.threedLink != ""
          ) {
            this.houseDesignForm.threedLink = "https://720.tbzj.net/tiao?url=" + this.houseDesignForm.threedLink;
          }
          if (this.$route.query.type == "1") {
            addHouseDetail({
              constructionImg: this.houseDesignForm.constructionImg,
              houseStyleId: this.houseDesignForm.houseStyleId,
              houseTypeId: this.houseDesignForm.houseTypeId,
              img: this.houseDesignForm.img,
              name: this.houseDesignForm.name,
              planImg: this.houseDesignForm.planImg,
              quotation: this.houseDesignForm.quotation,
              sort: this.houseDesignForm.sort,
              threedLink: this.houseDesignForm.threedLink,
              watchNum: this.houseDesignForm.watchNum,
              watchTime: this.houseDesignForm.watchTime
            }).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  type: "success",
                  message: data.data.msg,
                  center: true
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  type: "error",
                  message: data.data.msg,
                  center: true
                });
              }
            });
            // 编辑全屋设计方案提交
          } else if (this.$route.query.type == "2") {
            addHouseDetail({
              id: this.$route.query.id,
              constructionImg: this.houseDesignForm.constructionImg,
              houseStyleId: this.houseDesignForm.houseStyleId,
              houseTypeId: this.houseDesignForm.houseTypeId,
              img: this.houseDesignForm.img,
              name: this.houseDesignForm.name,
              planImg: this.houseDesignForm.planImg,
              quotation: this.houseDesignForm.quotation,
              sort: this.houseDesignForm.sort,
              threedLink: this.houseDesignForm.threedLink,
              watchNum: this.houseDesignForm.watchNum,
              watchTime: this.houseDesignForm.watchTime
            }).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  type: "success",
                  message: data.data.msg,
                  center: true
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  type: "error",
                  message: data.data.msg,
                  center: true
                });
              }
            });
          }
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },

  //是否有富文本编辑
  components: { uploadImg, uploadimgArr }
};
</script>

<style lang='less' scoped>
#houseDesign_add {
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
