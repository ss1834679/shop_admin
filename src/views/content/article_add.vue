<template>
  <div id="articleAdd">
    <!-- 文章的添加和修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">添加文章</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="articelform" ref="articelform" label-width="100px" class="demo-ruleForm">
          <el-form-item label="文章标题" required prop="title">
            <el-input v-model="articelform.title"></el-input>
          </el-form-item>
          <el-form-item label="部门">设计部</el-form-item>
          <el-form-item label="所属话题" required prop="channelId">
            <el-select v-model="articelform.channelId" placeholder="请选择话题">
              <el-option v-for="item in topicList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示设置" required prop="isPublic">
            <el-switch v-model="articelform.isPublic" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="文章正文" required prop="content">
            <wang-editor :value="articelform.content" @getHtmlFromWang="(value)=>{this.articelform.content=value}"></wang-editor>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="关联商品" class="relatGoods">
            <div class="searchBar">
              <div class="search_box">
                <el-select v-model="searchGoodId" filterable remote value-key="id" :remote-method="selectByKwd" placeholder="请选择商品(可搜索)" clearable>
                  <el-option v-for="item in searchGoodsList" :key="item.id" :label="item.goodsTitle" :value="item"></el-option>
                </el-select>
              </div>
              <div class="search_box">
                <el-button @click="appendToArticle" size="small" plain>添加</el-button>
              </div>
            </div>
            <div class="relatGoodsbox">
              <div class="relatGoodsRight">
                <el-checkbox-group v-model="relatedList">
                  <div class="related" v-if="related.length>0">
                    <el-checkbox v-for="item in related" :label="item.id" checked :key="item.id">{{item.goodsTitle}}</el-checkbox>
                  </div>
                  <div v-if="appendGoodList.length>0&&appendShow" class="searchgood">
                    <el-checkbox v-for="item in appendGoodList" :label="item.id" :key="item.id">{{item.goodsTitle}}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="文章封面" required>
            <upload-img @getimgArr="(imgarr)=>{this.imageArr = imgarr}" :imgArr="imageArr" :limit="3"></upload-img>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('articelform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import wangEditor from "../../components/wangEditor";
import uploadImg from "../../components/uploadImgArr";
import { getGoodsList } from "../../api/good";
import { getChannelAll, insertOrUpdateArticle } from "../../api/circle";
export default {
  data() {
    return {
      articelform: {
        channelId: "" /* 话题id */,
        content: "" /* 文章正文富文本 */,
        goodIdList: [] /* 关联的商品id */,
        title: "" /* 标题 */,
        image: [] /* 文章封面 */,
        isPublic: true /* 是否显示 */
      },
      searchInput: "",
      searchGoodId: "",
      searchGoodsList: [] /* 搜索的商品列表 */,
      relatedList: [] /* 已经关联的列表 最终提交的 */,
      related: [] /* 文章之前关联的 */,
      appendGoodList: [] /* 文章新加的关联 */,
      appendShow: true,
      imageArr: [] /* 文章封面图中间变量 */,
      topicList: [],
      articelRules: {
        title: [{ required: true, message: "请填写文章标题", trigger: "blur" }],
        channelId: [{ required: true, message: "请选择话题", trigger: "blur" }],
        content: [{ required: true, message: "请填写文章内容", trigger: "blur" }],
        isPublic: [{ required: true, message: "请选择是否显示", trigger: "blur" }]
      }
    };
  },
  mounted() {
    /* 初始化话题列表 */
    getChannelAll(1, 20).then(data => {
      if (data.status == 200) {
        this.topicList = data.data.data.list;
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.articelform.goodIdList = this.relatedList;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.imageArr.length == 3) {
            this.articelform.image = JSON.stringify(this.imageArr);
            insertOrUpdateArticle(this.articelform).then(data => {
              if (data.status == 200) {
                this.$router.push({ name: "article_Idx" });
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
              } else {
                this.$message.error("添加失败");
              }
            });
          } else {
            this.$message.error("上传三张封面图");
          }
        } else {
          this.$message.error("请检查参数是否填写完整！！");
          return false;
        }
      });
    },
    appendToArticle() {
      if (this.appendGoodList.indexOf(this.searchGoodId) == -1 && this.relatedList.indexOf(this.searchGoodId) == -1) {
        this.appendGoodList.push(this.searchGoodId);
        this.relatedList.push(this.searchGoodId.id);
      } else {
        this.$message.error("已经存在在列表中了");
      }
    },
    selectByKwd(val) {
      if (val != "") {
        getGoodsList({
          pageNo: 1,
          goodsTitle: val
        }).then(data => {
          if (data.data.status == 0) {
            this.searchGoodsList = data.data.data.data.list;
          }
        });
      }
    }
  },
  components: { wangEditor, uploadImg }
};
</script>

<style lang='less'>
#articleAdd {
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
      .el-form-item.relatGoods {
        .el-form-item__content {
          display: flex;
          flex-direction: column;
          .relatGoodsbox {
            height: 300px;
            display: flex;
            .relatGoodsRight {
              width: 700px;
              border: 1px solid #ccc;
              border-radius: 4px;
              text-align: center;
              overflow-y: scroll;
              label.el-checkbox {
                display: block;
                text-align: left;
                margin-left: 10px;
                margin-right: 0px;
                border-bottom: 1px solid #ccc;
              }
            }
          }
        }
      }
    }
  }
}
</style>
