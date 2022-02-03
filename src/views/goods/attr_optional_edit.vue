<template>
  <div id="attrOptional">
    <!-- 参数添加和修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.params.id">修改参数</span>
          <span class="title" v-else>添加参数</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="paramForm" :rules="paramRules" ref="paramForm" label-width="140px" class="demo-ruleForm">
          <el-form-item label="参数名称" required prop="specParamName">
            <el-input v-model="paramForm.specParamName"></el-input>
          </el-form-item>
          <el-form-item label="商品类型" required prop="categoryId">
            <span v-if="this.$route.params.name">{{this.$route.params.name}}</span>
            <template v-else>
              <div>
                <el-cascader
                  ref="categoryList"
                  placeholder="请选择类型"
                  v-model="paramForm.categoryId"
                  :props="props"
                  :options="categoryList"
                  @visible-change="elCascaderOnlick"
                  @expand-change="elCascaderOnlick"
                  clearable
                ></el-cascader>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="是否在列表页展示" required prop="isDisplay">
            <el-radio-group v-model="paramForm.isDisplay">
              <el-radio :label="1">展示</el-radio>
              <el-radio :label="0">不展示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="能否进行检索" required prop="isSearch">
            <el-radio-group v-model="paramForm.isSearch">
              <el-radio :label="1">可检索</el-radio>
              <el-radio :label="0">不可检索</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="该参数值的录入方式">
            <el-radio-group v-model="methods">
              <el-radio :label="0">手工录入</el-radio>
              <el-radio :label="1">从下面的列表中选择</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="参数值可选值列表" required prop="specOptionalValue">
            <tag-add
              text="添加新参数值"
              v-if="showTag"
              :arrData="paramForm.specOptionalValue"
              @getArrData="(arr)=>{this.paramForm.specOptionalValue=arr;this.refreshTag()}"
            ></tag-add>
          </el-form-item>
          <el-form-item label="是否支持手动新增">
            <el-radio-group v-model="auto">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="参数排序">
            <el-input v-model="rank"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('paramForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import tagAdd from "../../components/tags";
import {  getCategoryByPar } from "../../api/category";
export default {
  data() {
    return {
      paramForm: {
        categoryId: "",
        specParamId: "",
        specGroupId: null,
        specParamName: "",
        specOptionalValue: [],
        specCurrencyValue: null,
        isDisplay: 1,
        isSearch: 1
      },
      methods: 1 /* 参数键值录入方式 */,
      auto: 1 /* 是否支持手动新增 */,
      rank: null /* 参数排序 */,
      paramRules: {
        categoryId: [{ required: true, message: "请选择类型", trigger: "blur" }],
        isDisplay: [{ required: true, message: "该参数是否展示", trigger: "blur" }],
        specParamName: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
        specOptionalValue: [{ required: true, message: "请填写参数值", trigger: "blur" }],
        isSearch: [{ required: true, message: "该参数是否可被搜索", trigger: "blur" }]
      },
      props: {
        value: "id",
        label: "categoryName",
        checkStrictly: true,
        emitPath: false,
        lazy: true,
        lazyLoad(node, resolve) {
          getCategoryByPar({
            parentId: node.data.id,
            pageNo: 1,
            pageSize: 40
          }).then(data => {
            if (data.data.status == 0) {
              resolve(data.data.data.list);
            }
          });
        }
      },
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
      ],
      showTag: true
    };
  },
  mounted() {
    if (this.$route.params.data) {
      this.paramForm = this.$route.params.data;
      this.paramForm["categoryId"] = this.$route.params.id;
      this.refreshTag();
    }
    /* 初始化级联列表 */
    getCategoryByPar({ pageNo: 1, pageSize: 40 }).then(data => {
      if (data.data.status == 0) {
        this.categoryList = data.data.data.list;
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (this.$route.params.data) {
            // updateParam(this.paramForm);

            //   if (data.data.status == 0) {
            //     this.$message({
            //       type: "success",
            //       message: "参数修改成功",
            //       center: true
            //     });
            //     this.$router.go(-1);
            //   } else {
            //     this.$message({
            //       type: "error",
            //       message: "修改失败",
            //       center: true
            //     });
            //   }
          // } else {
            // addParam(this.paramForm);

            //   if (data.data.status == 0) {
            //     this.$message({
            //       type: "success",
            //       message: "参数添加成功",
            //       center: true
            //     });
            //     this.$router.go(-1);
            //   } else {
            //     this.$message({
            //       type: "error",
            //       message: "添加失败",
            //       center: true
            //     });
            //   }
          // }
        } else {
          return false;
        }
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
    },
    refreshTag() {
      this.showTag = false;
      this.$nextTick(() => {
        this.showTag = true;
      });
    }
  },
  components: { tagAdd }
};
</script>

<style lang='less'>
#attrOptional {
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
      .el-cascader .el-input__inner {
        width: 300px; //搜索框宽度
      }
    }
  }
}
</style>
