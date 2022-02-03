<template>
  <div id="addAD">
    <!-- 广告的添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">添加广告</span>
        </div>
      </div>
      <!-- 广告的 表数据验证 -->
      <div class="content">
        <el-form :model="adform" ref="adform" :rules="adRules" label-width="110px" class="demo-ruleForm">
          <el-form-item label="广告名称" required prop="name">
            <el-input v-model="adform.name" placeholder="广告名称只是作为辨别多个广告条目之用，并不显示在广告中"></el-input>
          </el-form-item>
          <el-form-item label="广告位置" required prop="position">
            <el-select v-model="adform.position" placeholder="选择广告位置">
              <el-option v-for="item in position" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" required prop="startTime">
            <el-date-picker v-model="adform.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="到期时间" required prop="invalidTime">
            <el-date-picker v-model="adform.invalidTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="上线/下线">
            <el-radio-group v-model="adform.isOnline">
              <el-radio :label="1">上线</el-radio>
              <el-radio :label="0">下线</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="广告图片" required prop="imgFileId">
            <!-- 有限制宽高比例 -->
            <upload-img
              v-if="showImg"
              :size="this.size"
              @getimgArr="(imgarr)=>{this.adform.imgFileId = imgarr}"
              :imgArr="this.adform.imgFileId"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="广告跳转类型">
            <el-radio-group v-model="adform.type">
              <el-radio :label="0">外网链接</el-radio>
              <el-radio :label="1">商品</el-radio>
              <el-radio :label="2">文章</el-radio>
              <el-radio :label="3">灵感</el-radio>
              <el-radio :label="4">团购商品</el-radio>
              <el-radio v-if="adform.position=='APP首页轮播'" :label="10">团购列表</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="adform.type==0" label="外网链接">
            <el-input v-model="adform.url"></el-input>
          </el-form-item>
          <el-form-item v-if="adform.type==1" label="跳转商品">
            <div class="searchBar">
              <div class="search_box">
                <el-select v-model="added" filterable remote value-key="id" :remote-method="selectGoods" placeholder="请选择商品(可搜索)" clearable>
                  <el-option v-for="item in goodsList" :key="item.id" :label="item.goodsTitle" :value="item"></el-option>
                </el-select>
              </div>
            </div>
            <span v-if="added.goodsTitle" class="added">已添加 : {{added.goodsTitle}}</span>
          </el-form-item>
          <el-form-item v-if="adform.type==4" label="跳转团购商品">
            <div class="searchBar">
              <div class="search_box">
                <el-select v-model="added" filterable remote value-key="id" :remote-method="selectGroupGoods" placeholder="请选择拼团商品(可搜索)" clearable>
                  <el-option v-for="item in groupGoodsList" :key="item.id" :label="item.goodsTitle" :value="item"></el-option>
                </el-select>
              </div>
            </div>
            <span v-if="added.goodsTitle" class="added">已添加 : {{added.goodsTitle}}</span>
          </el-form-item>
          <el-form-item v-if="adform.type==2" label="跳转文章">
            <div class="searchBar">
              <div class="search_box">
                <el-select v-model="added" filterable remote value-key="id" :remote-method="selectArticle" placeholder="请选择文章(可搜索)" clearable>
                  <el-option v-for="item in articleList" :key="item.id" :label="item.title" :value="item"></el-option>
                </el-select>
              </div>
            </div>
            <span v-if="added.title" class="added">已添加 : {{added.title}}</span>
          </el-form-item>
          <el-form-item v-if="adform.type==3" label="跳转灵感">
            <div class="searchBar">
              <div class="search_box">
                <el-select v-model="added" filterable remote value-key="id" :remote-method="selectInspiration" placeholder="请选择灵感(可搜索)" clearable>
                  <el-option v-for="item in inspirationList" :key="item.id" :label="item.title" :value="item"></el-option>
                </el-select>
              </div>
            </div>
            <span v-if="added.title" class="added">已添加 : {{added.title}}</span>
          </el-form-item>
          <el-form-item label="广告备注">
            <el-input v-model="adform.comment"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('adform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
import { addAdvert } from "../../api/advert";
import { getArticleListAll, getInspirationListAll } from "../../api/circle";
import { getGoodsList } from "../../api/good";
import { getAssembleGoods } from "../../api/promotion";
export default {
  data() {
    return {
      adform: {
        name: "" /* 广告名称 */,
        position: "" /* 广告位置 */,
        imgFileId: "" /* 广告图片 */,
        url: "" /* 广告连接 */,
        startTime: "" /* 开始时间 */,
        invalidTime: "" /* 失效时间 */,
        comment: "" /* 备注 */,
        isOnline: 1 /* 是否上线 */,
        type: 0
      },
      position: [
        { label: "APP首页轮播", value: "APP首页轮播" },
        { label: "APP一级分类1", value: "APP一级分类1" },
        { label: "APP一级分类2", value: "APP一级分类2" },
        { label: "APP一级分类3", value: "APP一级分类3" },
        { label: "APP一级分类4", value: "APP一级分类4" },
        { label: "APP一级分类5", value: "APP一级分类5" },
        { label: "APP一级分类6", value: "APP一级分类6" },
        { label: "APP一级分类7", value: "APP一级分类7" },
        { label: "APP一级分类8", value: "APP一级分类8" },
        { label: "APP一级分类9", value: "APP一级分类9" },
        { label: "APP一级分类10", value: "APP一级分类10" },
        { label: "APP一级分类11", value: "APP一级分类11" },
        { label: "APP一级分类12", value: "APP一级分类12" },
        { label: "APP二级页面分类", value: "APP二级页面分类" },
        { label: "APP二级页面品牌", value: "APP二级页面品牌" },
        { label: "APP涂邦资讯广告位", value: "APP涂邦资讯广告位" },
        { label: "APP涂邦资讯视频位", value: "APP涂邦资讯视频位" },
        { label: "APP圈子页面广告位", value: "APP圈子页面广告位" },
        { label: "APP品牌特卖广告位", value: "APP品牌特卖广告位" },
        { label: "APP团购页面广告位", value: "APP团购页面广告位" },
        { label: "新版设计师主页轮播图", value: "新版设计师主页轮播图" }
      ] /* 广告位置 */,
      size: null /* 图片上传的尺寸 */,
      goodsList: [] /* 获取搜索的商品列表 */,
      groupGoodsList: [] /* 获取搜索的拼团商品列表 */,
      articleList: [] /* 获取搜索的文章列表 */,
      inspirationList: [] /* 获取搜索的灵感列表 */,
      showImg: false /* 刷新img */,
      added: {} /* 现在添加的商品或者文章或者灵感的对象 */,
      adRules: {
        name: [{ required: true, message: "请填写广告名称", trigger: "blur" }],
        position: [{ required: true, message: "请选择广告位置", trigger: "blur" }],
        imgFileId: [{ required: true, message: "请上传广告图片", trigger: "blur" }],
        startTime: [{ required: true, message: "请选择广告开始时间", trigger: "blur" }],
        invalidTime: [{ required: true, message: "请选择广告结束时间", trigger: "blur" }]
      }
    };
  },
  watch: {
    "adform.position": {
      handler() {
        this.adform.imgFileId = "";
        this.refreshImg();
        if (this.adform.position == "APP首页轮播") {
          this.size = { height: 250, width: 693 };
        } else if (this.adform.position == "APP二级页面分类" || this.adform.position == "APP二级页面品牌") {
          this.size = { height: 249, width: 547 };
        } else if (this.adform.position == "APP涂邦资讯广告位") {
          this.size = { height: 330, width: 330 };
        } else if (this.adform.position == "APP涂邦资讯视频位") {
          this.size = null;
        } else {
          this.size = { height: 250, width: 690 };
        }
      }
    },
    "adform.type": {
      handler() {
        this.adform.url = "";
        this.added = {};
      }
    },
    added: {
      handler() {
        if (this.added.id) {
          this.adform.url = this.added.id;
        } else {
          this.adform.url = "";
        }
      }
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.adform.type == 10 && (this.adform.url = "group");
          addAdvert(this.adform).then(data => {
            if (data.data.state == "Success") {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.$router.push({ name: "ad_Idx" });
            } else {
              this.$message.error("添加失败 请检查参数或联系管理员");
            }
          });
        } else {
          this.$message.error("请检查参数是否填写完整！！");
          return false;
        }
      });
    },
    selectGoods(val) {
      if (val != "") {
        getGoodsList({
          pageNo: 1,
          goodsTitle: val
        }).then(data => {
          if (data.data.status == 0) {
            this.goodsList = data.data.data.data.list;
          }
        });
      }
    },
    selectGroupGoods(val) {
      if (val != "") {
        getAssembleGoods({
          pageNo: 1,
          pageSize: 40,
          goodsTitle: val
        }).then(data => {
          if (data.data.status == 0) {
            this.groupGoodsList = data.data.data.data.list;
          }
        });
      }
    },
    selectArticle(val) {
      if (val != "") {
        getArticleListAll(val).then(data => {
          if (data.data.status == 0) {
            this.articleList = data.data.data;
          }
        });
      }
    },
    selectInspiration(val) {
      if (val != "") {
        getInspirationListAll(val).then(data => {
          if (data.data.status == 0) {
            this.inspirationList = data.data.data;
          }
        });
      }
    }
  },
  components: { uploadImg }
};
</script>

<style lang='less'>
#addAD {
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
          span.remind {
            color: red;
          }
        }
      }
    }
  }
}
</style>
