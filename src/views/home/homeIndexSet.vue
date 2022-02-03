<template>
  <!-- 首页设置 -->
  <div id="honmIndexSet">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="背景图片" required prop="backgroundImage">
        <upload-img
          v-if="showImg"
          @getimgArr="(imgArr)=>{ruleForm.backgroundImage = imgArr}"
          :imgArr="ruleForm.backgroundImage"
          remindText="建议尺寸750x*1334px，支持jpg、png、gif"
          :limit="1"
          :notMultiple="true"
        ></upload-img>
      </el-form-item>
      <el-form-item label="浮动按钮">
        <el-radio-group v-model="ruleForm.isDisplay">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="浮动按钮图片" required prop="floatImage" v-show="ruleForm.isDisplay==1">
        <upload-img
          v-if="showImg"
          @getimgArr="(imgArr)=>{ruleForm.floatImage = imgArr}"
          :imgArr="ruleForm.floatImage"
          remindText="建议尺寸165px*165px，支持jpg、png、gif"
          :limit="1"
          :notMultiple="true"
        ></upload-img>
      </el-form-item>
      <el-form-item label="适用渠道">
        <el-checkbox-group v-model="ruleForm.channels">
          <el-checkbox label="1">ios</el-checkbox>
          <el-checkbox label="2">Android</el-checkbox>
          <el-checkbox label="3">小程序</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="跳转类型" v-show="ruleForm.isDisplay==1">
        <el-radio-group v-model="ruleForm.jumpType">
          <el-radio :label="0">外网链接</el-radio>
          <el-radio :label="1">商品</el-radio>
          <el-radio :label="2">文章</el-radio>
          <el-radio :label="3">案例</el-radio>
          <el-radio :label="4">拼团商品</el-radio>
          <el-radio :label="5">活动</el-radio>
          <el-radio :label="6">内页跳转</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="ruleForm.jumpType==0" label="外网链接">
        <el-input v-model.trim="ruleForm.activityId"></el-input>
      </el-form-item>
      <el-form-item v-if="ruleForm.jumpType==1" label="跳转商品" required prop="activityId">
        <div class="searchBar">
          <div class="search_box">
            <el-select
              v-model="ruleForm.activityId"
              filterable
              remote
              value-key="id"
              :remote-method="searchByTypeAndTitle"
              placeholder="请选择商品(可搜索)"
              clearable
            >
              <el-option v-for="item in selectList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="ruleForm.jumpType==2" label="跳转文章" required prop="activityId">
        <div class="searchBar">
          <div class="search_box">
            <el-select
              v-model="ruleForm.activityId"
              filterable
              remote
              value-key="id"
              :remote-method="searchByTypeAndTitle"
              placeholder="请选择文章(可搜索)"
              clearable
            >
              <el-option v-for="item in selectList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="ruleForm.jumpType==3" label="跳转案例" required prop="activityId">
        <div class="searchBar">
          <div class="search_box">
            <el-select
              v-model="ruleForm.activityId"
              filterable
              remote
              value-key="id"
              :remote-method="searchByTypeAndTitle"
              placeholder="请选择案例(可搜索)"
              clearable
            >
              <el-option v-for="item in selectList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="ruleForm.jumpType==4" label="跳转团购商品" required prop="activityId">
        <div class="searchBar">
          <div class="search_box">
            <el-select
              v-model="ruleForm.activityId"
              filterable
              remote
              value-key="id"
              :remote-method="searchByTypeAndTitle"
              placeholder="请选择拼团商品(可搜索)"
              clearable
            >
              <el-option v-for="item in selectList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="活动名称" v-if="ruleForm.jumpType==5" required prop="activityId">
        <div class="searchBar">
          <div class="search_box">
            <el-select
              v-model="ruleForm.activityId"
              filterable
              remote
              value-key="id"
              :remote-method="searchByTypeAndTitle"
              placeholder="请输入活动名称(可搜索)"
              clearable
            >
              <el-option v-for="item in selectList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="ruleForm.jumpType==6" label="内页路径">
        <el-input v-model.trim="ruleForm.activityId"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
import { getHomeIndexSet, addChangeSet, getListByTypeTitle } from "../../api/home";
import { getGood } from "../../api/good";
import { getAssembleGoodsById, getNewActivityDetailById } from "../../api/promotion";
import { getArticleById } from "../../api/circle";
import { getQuoteById } from "../../api/promanage";
export default {
  components: { uploadImg },
  data() {
    return {
      ruleForm: {
        backgroundImage: "", //背景图片
        floatImage: "",
        activityId: "", //活动名称
        jumpType: "" /* 0 外网链接 1 商品 2 文章 3 案例 4 拼团商品 5 活动 6 内页跳转 */,
        isDisplay: "", //浮动按钮
        channels: "", //适用渠道
        channel: ""
      },
      times: 0,
      selectList: [] /* 所有的下拉列表 */,
      rules: {
        backgroundImage: [{ required: true, trigger: "blur", message: "请上传背景图片" }],
        floatImage: [{ required: true, message: "请选择一张浮动按钮图", trigger: "blur" }],
        activityId: [{ required: true, message: "请选择跳转地址", trigger: "blur" }]
      },
      showImg: true
    };
  },
  mounted() {
    getHomeIndexSet().then(data => {
      if (data.data.status == 200) {
        ({
          backgroundImage: this.ruleForm.backgroundImage,
          floatImage: this.ruleForm.floatImage,
          jumpType: this.ruleForm.jumpType,
          isDisplay: this.ruleForm.isDisplay,
          channels: this.ruleForm.channels,
          activityId: this.ruleForm.activityId,
          id: this.ruleForm.id
        } = { ...data.data.content });
        this.refreshImg();
        if (this.ruleForm.jumpType == 1) {
          getGood({ goodsId: this.ruleForm.activityId }).then(data => {
            const obj = {};
            obj.id = data.data.data.goodsId;
            obj.title = data.data.data.goodsTitle;
            this.selectList.push(obj);
          });
        }
        if (this.ruleForm.jumpType == 2) {
          getArticleById(this.ruleForm.activityId).then(data => {
            this.selectList.push(data.data.data);
          });
        }
        if (this.ruleForm.jumpType == 3) {
          getQuoteById(this.ruleForm.activityId).then(data => {
            this.selectList.push(data.data.data);
          });
        }
        if (this.ruleForm.jumpType == 4) {
          getAssembleGoodsById(this.ruleForm.activityId).then(data => {
            const obj = {};
            obj.id = data.data.data.goodsId;
            obj.title = data.data.data.goodsTitle;
            this.selectList.push(obj);
          });
        }
        if (this.ruleForm.jumpType == 5) {
          getNewActivityDetailById(this.ruleForm.activityId).then(data => {
            this.selectList.push(data.data.data);
          });
        }
      }
    });
  },
  watch: {
    "ruleForm.jumpType": {
      handler() {
        if (this.times == 0) {
          this.times++;
        } else {
          this.ruleForm.activityId = "";
          this.selectList = [];
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
    /* 通过jumpType 全局查询 */
    searchByTypeAndTitle(val) {
      if (val != "") {
        getListByTypeTitle(val, this.ruleForm.jumpType).then(data => {
          this.selectList = data.data.content;
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.channel = this.ruleForm.channels.toString();
          addChangeSet(this.ruleForm).then(data => {
            if (data.data.status == 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
            } else {
              this.$message.error(data.data.msg);
            }
          });
        } else {
          this.$message.warning("请填完参数");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
#honmIndexSet {
  width: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>