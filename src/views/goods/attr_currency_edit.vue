<template>
  <div id="attrCurrency">
    <!-- 属性添加和修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.query.paramsId">修改属性</span>
          <span class="title" v-else>添加属性</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="paramForm" :rules="paramRules" ref="paramForm" label-width="140px" class="demo-ruleForm">
          <el-form-item label="属性名称" required prop="specParamName">
            <el-input v-model="paramForm.specParamName"></el-input>
          </el-form-item>
          <el-form-item label="商品类型" required>
            <span v-if="this.$route.query.categoryId">{{this.$route.query.name}}</span>
            <template v-else>
              <div>
                <el-cascader
                  ref="categoryList"
                  placeholder="请选择类型"
                  v-model="categoryId"
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
          <el-form-item label="该属性值的录入方式">
            <el-radio-group v-model="methods">
              <el-radio :label="0">手工录入</el-radio>
              <el-radio :label="1">从下面的列表中选择</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="属性值可选值列表" required prop="specCurrencyValue">
            <tag-add
              text="添加新属性值"
              v-if="showTag"
              :arrData="paramForm.specCurrencyValue||[]"
              @getArrData="(arr)=>{this.paramForm.specCurrencyValue=arr;this.refreshTag()}"
            ></tag-add>
          </el-form-item>
          <el-form-item label="是否支持手动新增">
            <el-radio-group v-model="auto">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="属性排序">
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
import { getCategoryByPar, insertSpecparam, updateSpecparam, getParamsById } from "../../api/category";
export default {
  data() {
    return {
      paramForm: {
        specParamId: "",
        specGroupId: null,
        specParamName: "",
        specOptionalValue: null,
        specCurrencyValue: [],
        isDisplay: 1,
        isSearch: 1
      },
      categoryId: "",
      methods: 1 /* 属性键值录入方式 */,
      auto: 1 /* 是否支持手动新增 */,
      rank: null /* 属性排序 */,
      paramRules: {
        isDisplay: [{ required: true, message: "该属性是否展示", trigger: "blur" }],
        specParamName: [{ required: true, message: "请输入属性名称", trigger: "blur" }],
        specCurrencyValue: [{ required: true, message: "请填写属性值", trigger: "blur" }],
        isSearch: [{ required: true, message: "该属性是否可被搜索", trigger: "blur" }]
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
    if (this.$route.query.paramsId) {
      getParamsById(this.$route.query.paramsId).then(data => {
        if (data.data.status == 200) {
          this.paramForm = data.data.content;
          this.refreshTag();
        }
      });
      this.categoryId = this.$route.query.categoryId;
    } else {
      /* 初始化级联列表 */
      getCategoryByPar({ pageNo: 1, pageSize: 40 }).then(data => {
        if (data.data.status == 0) {
          this.categoryList = data.data.data.list;
        }
      });
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$route.params.data) {
            updateSpecparam(this.categoryId, this.paramForm).then(data => {
              if (data.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.$router.go(-1);
              } else {
                this.$message.error("修改失败");
              }
            });
          } else {
            insertSpecparam(this.categoryId, this.paramForm).then(data => {
              if (data.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.$router.go(-1);
              } else {
                this.$message.error("添加失败");
              }
            });
          }
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
#attrCurrency {
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
