<template>
  <div id="popularEdit">
    <!-- 人气推荐修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">修改人气推荐</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="addForm" ref="addForm" :rules="addFormRules" label-width="120px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="左角标" prop="subtitle">
            <el-input v-model="addForm.subtitle"></el-input>
          </el-form-item>
          <el-form-item label="右脚标" prop="describ">
            <el-input v-model="addForm.describ"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model.number="addForm.sort"></el-input>
          </el-form-item>
          <el-form-item label="选择商品" v-if="addForm.type==1" prop="contentId">
            <span v-if="!alter">
              已选商品： {{title}}
              <el-button type="text" @click="getChoose">重新选择</el-button>
            </span>
            <div class="searchBar" v-else>
              <div class="search_box">
                <el-select
                  v-model="addForm.contentId"
                  filterable
                  remote
                  value-key="id"
                  :remote-method="selectGood"
                  placeholder="请选择商品(关键字搜索)"
                  clearable
                >
                  <el-option v-for="item in searchGoodList" :key="item.id" :label="item.goodsTitle" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="选择文章" v-if="addForm.type==2" prop="contentId">
            <span v-if="!alter">
              已选文章： {{title}}
              <el-button type="text" @click="getChoose">重新选择</el-button>
            </span>
            <div class="searchBar" v-else>
              <div class="search_box">
                <el-select
                  v-model="addForm.contentId"
                  filterable
                  remote
                  value-key="id"
                  :remote-method="selectArt"
                  placeholder="请选择文章(关键字搜索)"
                  clearable
                >
                  <el-option v-for="item in searchArtList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="选择灵感" v-if="addForm.type=='3'" prop="contentId">
            <span v-if="!alter">
              已选灵感： {{title}}
              <el-button type="text" @click="getChoose">重新选择</el-button>
            </span>
            <div class="searchBar" v-else>
              <div class="search_box">
                <el-select
                  v-model="addForm.contentId"
                  filterable
                  remote
                  value-key="id"
                  :remote-method="selectIns"
                  placeholder="请选择灵感(关键字搜索)"
                  clearable
                >
                  <el-option v-for="item in searchInsList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="展示图片" prop="image">
            <upload-img
              v-if="showImg"
              @getimgArr="(imgarr)=>{this.addForm.image = imgarr}"
              :imgArr="this.addForm.image"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitform('addForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
import { getGoodsList, getGood } from "../../api/good";
import { getArticleListAll, getInspirationListAll, getArticleById, getInspirationById } from "../../api/circle";
import { getPushMassageById, addOrEditPushMassage } from "../../api/indexRecommend";
export default {
  data() {
    return {
      addForm: {
        title: "" /* 标题 */,
        subtitle: "" /* 左角标 */,
        describ: "" /* 右脚标 */,
        contentId: "" /* 商品id 文章id 灵感id */,
        image: "" /* 首页展示图 */,
        sort: 0 /* 排序 */,
        type: 1 /* 1 商品 2 文章 3 灵感 */
      },
      alter: false,
      title: "",
      showImg: true,
      searchGoodList: [] /* 搜索商品的列表 */,
      searchArtList: [] /* 搜索的文章列表 */,
      searchInsList: [] /* 搜索的灵感列表 */,
      addFormRules: {
        title: [{ required: true, message: "请填写人气推荐标题" }],
        image: [{ required: true, message: "请上传人气推荐首页展示图片" }],
        contentId: [{ required: true, message: "请选择需要展示的内容" }]
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getPushMassageById(this.$route.query.id).then(data => {
        if (data.data.status == 200) {
          this.addForm = data.data.content;
          this.refreshImg();
          if (this.addForm.type == 1) {
            getGood({ goodsId: this.addForm.contentId }).then(data => {
              if (data.data.status == 0) {
                this.title = data.data.data.goodsTitle;
              }
            });
          } else if (this.addForm.type == 3) {
            getInspirationById(this.addForm.contentId).then(data => {
              if (data.data.status == 0) {
                this.title = data.data.data.title;
              }
            });
          } else if (this.addForm.type == 2) {
            getArticleById(this.addForm.contentId).then(data => {
              if (data.data.status == 0) {
                this.title = data.data.data.title;
              }
            });
          }
        }
      });
    }
  },
  methods: {
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    /* 提交修改 */
    submitform(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addOrEditPushMassage(this.addForm).then(data => {
            if (data.data.status == 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.addVisible = false;
              this.$router.push({ name: "popularRecommend" });
            } else {
              this.$message.error("修改失败");
            }
          });
        } else {
          this.$message.error("请检查参数是否填写完整！！");
          return false;
        }
      });
    },
    getChoose() {
      this.alter = true;
      this.addForm.contentId = "";
    },
    /* 通过商品名搜索 */
    selectGood(val) {
      if (val != "") {
        getGoodsList({ goodsTitle: val, pageNo: 1 }).then(data => {
          if (data.data.status == 0) {
            this.searchGoodList = data.data.data.data.list;
          }
        });
      }
    },
    /* 通过文章名搜索 */
    selectArt(val) {
      if (val != "") {
        getArticleListAll(val).then(data => {
          if (data.data.status == 0) {
            this.searchArtList = data.data.data;
          }
        });
      }
    },
    /* 通过文灵感名搜索 */
    selectIns(val) {
      if (val != "") {
        getInspirationListAll(val).then(data => {
          if (data.data.status == 0) {
            this.searchInsList = data.data.data;
          }
        });
      }
    }
  },
  components: { uploadImg }
};
</script>

<style lang='less'>
#popularEdit {
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
  }
}
</style>
