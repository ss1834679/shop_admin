<template>
  <!-- 拼团设置页 -->
  <div id="add-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>拼团设置</span>
      </div>

      <div class="add-content">
        <el-form :model="spellGoodsForm" ref="spellGoodsForm" :rules="spellGoodsRules" label-width="200px" class="demo-ruleForm">
          <el-form-item label="拼团功能 :" prop="spellFunctions" required>
            <el-radio-group v-model="spellGoodsForm.spellFunctions">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="首页拼团入口商品:" prop="goodsId" required>
            <!-- <el-select v-model="spellGoodsForm.goodsId" placeholder="请选择">
              <el-option v-for="item in spellGoodsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>-->

            <el-select
              v-model="spellGoodsForm.goodsId"
              filterable
              remote
              value-key="id"
              :remote-method="selectGood"
              placeholder="请选择商品(搜索)"
              clearable
            >
              <el-option v-for="item in spellGoodsList" :key="item.id" :label="item.goodsTitle" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="拼团详情页，为你推荐：" prop="detailPage" required>
            <el-radio-group v-model="spellGoodsForm.detailPage">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="拼团规则介绍：" prop="rule" class="is-required">
            <wang-editor :value="spellGoodsForm.rule" @getHtmlFromWang="(value)=>{this.spellGoodsForm.rule=value}"></wang-editor>
          </el-form-item>
          <el-form-item label="拼团分享标题：" v-if="showImg" prop="title" required>
            <el-input v-model="spellGoodsForm.title"></el-input>
          </el-form-item>
          <el-form-item label="拼团分享图片：" v-if="showImg" prop="img" required>
            <upload-img @getimgArr="(imgarr)=>{this.spellGoodsForm.img = imgarr}" :imgArr="this.spellGoodsForm.img" :limit="1" :notMultiple="true"></upload-img>
          </el-form-item>
          <el-form-item label="自动虚拟成团 :" prop="virtualClusters" required>
            <el-radio-group v-model="spellGoodsForm.virtualClusters">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否显示分类 :" class="is-required">
            <el-radio-group v-model="spellGoodsForm.isViewSort">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div
              style="color:#888;font-size:13px;width:800px"
            >注：开启虚拟成团后，拼团有效期内人数未满的团，系统将会模拟“匿名买家”凑满人数，使该团成团。 商家只需要对已付款参团的真实买家发货，匿名买家不生成订单。建议合理开启，以提高成团率。</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('spellGoodsForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import wangEditor from "../../components/wangEditor";
import uploadImg from "../../components/uploadImg";
import { getAssembleSetInfo, getAssembleGoods, updateAssembleSet } from "../../api/promotion";
export default {
  components: { wangEditor, uploadImg },
  data() {
    return {
      spellGoodsForm: {
        // virtualClusters: 1 /* 自动虚拟成团(1:开启;0:关闭) */,
        // rule: "" /* 拼团规则介绍 */,
        // title: "" /* 拼团分享标题 */,
        // goodsId: "" /* 首页拼团入口商品 */,
        // detailPage: 1 /* 拼团详情页，为你推荐(1:开启;0关闭) */,
        // spellFunctions: 1 /**拼团功能 (1:开启;0:关闭) */,
        // img: "" /* 拼团分享图片 */
      },
      showImg: true,
      spellGoodsList: [] /**拼团关联的商品 */,
      spellGoodsRules: {
        isViewSort: [{ required: true, message: "请选择是否显示分类", trigger: "blur" }],
        virtualClusters: [{ required: true, message: "请选择是否自动虚拟成团", trigger: "blur" }],
        title: [{ required: true, message: "请填写拼团分享标题", trigger: "blur" }],
        goodsId: [{ required: true, message: "请选择首页拼团入口商品", trigger: "blur" }],
        detailPage: [{ required: true, message: "请选择是否开启拼团详情页的为你推荐功能", trigger: "blur" }],
        spellFunctions: [{ required: true, message: "请选择是否开启拼团功能", trigger: "blur" }],
        img: [{ required: true, message: "请上传拼团分享的图片", trigger: "blur" }]
      }
    };
  },
  mounted() {
    getAssembleSetInfo().then(data => {
      if (data.data.status == 0) {
        this.spellGoodsForm = data.data.data;
        this.refreshImg();
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateAssembleSet(this.spellGoodsForm).then(data => {
            if (data.data.status == 0) {
              this.$message({ type: "success", message: "编辑成功" });
            } else {
              this.$message.error("编辑失败");
            }
          });
        } else {
          this.$message.error("请检查是否填完所有参数");
          return false;
        }
      });
    },
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    /* 搜索当前的拼团商品 通过商品名搜索 */
    selectGood(val) {
      if (val != "") {
        getAssembleGoods({ goodsTitle: val, pageNo: 1, pageSize: 30 }).then(data => {
          if (data.data.status == 0) {
            this.spellGoodsList = data.data.data.data.list;
          }
        });
      }
    }
  }
};
</script>
<style lang="less">
#add-page {
  padding: 20px;
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.spa {
  color: #cccccc;
  margin-right: 20px;
  font-size: 12px;
}
.el-card .el-card__header {
  background: #f2f2f2 !important;
  height: 50px;
}
</style>