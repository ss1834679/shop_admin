<template>
  <div id="addAlter">
    <!-- 分类添加和修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.query.id">修改分类</span>
          <span class="title" v-else>添加分类</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="categoryform" :rules="categoryRules" ref="categoryform" label-width="100px" class="demo-ruleForm">
          <el-form-item label="所属分类">
            <template v-if="!this.$route.query.parentId">
              <div>
                <el-cascader
                  ref="categoryList"
                  placeholder="请选择分类"
                  v-model="cateId"
                  :props="props"
                  :options="categoryList"
                  @visible-change="elCascaderOnlick"
                  @expand-change="elCascaderOnlick"
                  clearable
                ></el-cascader>
                <span style="margin-left:15px">若为一级分类请清空</span>
              </div>
            </template>
            <span v-else>{{this.$route.query.parentName}}</span>
          </el-form-item>
          <el-form-item label="分类名称" required prop="categoryName">
            <el-input v-model="categoryform.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="分类首字母" required prop="first">
            <el-input v-model="categoryform.first"></el-input>
          </el-form-item>
          <el-form-item label="分类排序" required prop="categorySort">
            <el-input v-model.number="categoryform.categorySort"></el-input>
          </el-form-item>

          <el-form-item label="筛选属性">
            <el-button
              v-if="categoryform.specCurrencyVOs&&categoryform.specCurrencyVOs[0].specParamVOs.length==0"
              type="primary"
              @click="addGroup('currency')"
            >添加筛选属性</el-button>
            <el-table
              v-if="categoryform.specCurrencyVOs&&categoryform.specCurrencyVOs[0].specParamVOs.length!=0&&showTable"
              :data="categoryform.specCurrencyVOs[0].specParamVOs"
              style="width: 100%"
            >
              <el-table-column prop="specParamName" label="属性名称" width="180" v-if="this.$route.query.id">
                <template slot-scope="scope">
                  <span>{{scope.row.specParamName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="specParamName" label="属性名称" width="180" v-else>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.specParamName" placeholder="输入属性的名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="参数值" v-if="this.$route.query.id">
                <template slot-scope="scope">
                  <el-tag :key="tag" v-for="tag in scope.row.specCurrencyValue">{{tag}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="参数值" v-else>
                <template slot-scope="scope">
                  <tag-add :arrData="scope.row.specCurrencyValue" @getArrData="(arr)=>{scope.row.specCurrencyValue=arr;refreshTag()}"></tag-add>
                </template>
              </el-table-column>
              <el-table-column label="是否可搜索" align="center" width="130" v-if="!this.$route.query.id">
                <template slot-scope="scope">
                  <switch-com :boolen="scope.row.isSearch" @changeValue="(value)=>{scope.row.isSearch=value}"></switch-com>
                </template>
              </el-table-column>
              <el-table-column label="添加/删除属性" width="180" v-if="!this.$route.query.id">
                <template slot-scope="scope">
                  <el-button
                    v-if="categoryform.specCurrencyVOs[0].specParamVOs.length!=0"
                    type="danger"
                    @click="delteGroup('currency',scope.$index)"
                    icon="el-icon-close"
                    size="mini"
                    circle
                  ></el-button>
                  <el-button
                    v-if="scope.$index==categoryform.specCurrencyVOs[0].specParamVOs.length-1"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addGroup('currency')"
                    size="mini"
                    circle
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- <el-form-item label="购买属性">
            <el-button
              v-if="categoryform.specOptionalVOs&&categoryform.specOptionalVOs[0].specParamVOs.length==0"
              type="primary"
              @click="addGroup('optional')"
            >添加购买属性</el-button>
            <el-table
              v-if="categoryform.specOptionalVOs&&categoryform.specOptionalVOs[0].specParamVOs.length!=0&&showTable"
              :data="categoryform.specOptionalVOs[0].specParamVOs"
              style="width: 100%"
            >
              <el-table-column prop="specParamName" label="规格名称" width="180">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.specParamName" placeholder="输入规格的名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="规格值">
                <template slot-scope="scope">
                  <tag-add :arrData="scope.row.specOptionalValue" @getArrData="(arr)=>{scope.row.specOptionalValue=arr;refreshTag()}"></tag-add>
                </template>
              </el-table-column>
              <el-table-column label="添加/删除规格" width="180">
                <template slot-scope="scope">
                  <el-button
                    v-if="categoryform.specOptionalVOs[0].specParamVOs.length!=0"
                    type="danger"
                    @click="delteGroup('optional',scope.$index)"
                    icon="el-icon-close"
                    size="mini"
                    circle
                  ></el-button>
                  <el-button
                    v-if="scope.$index==categoryform.specOptionalVOs[0].specParamVOs.length-1"
                    type="primary"
                    icon="el-icon-plus"
                    @click="addGroup('optional')"
                    size="mini"
                    circle
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>-->
          <el-form-item label="分类图片" required prop="categoryIcon">
            <upload-img
              v-if="showImg"
              @getimgArr="(imgarr)=>{this.categoryform.categoryIcon = imgarr}"
              :imgArr="this.categoryform.categoryIcon"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="分类状态">
            <el-radio-group v-model="categoryform.categoryStatus">
              <!-- label就是值 -->
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('categoryform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
import tagAdd from "../../components/tags";
import switchCom from "../../components/switch";
import { addCategory, updateCategory, getCategoryByPar, getCategoryById } from "../../api/category";
export default {
  data() {
    return {
      categoryform: {
        parentId: null /* 父ID */,
        categoryName: "" /* 分类名称 */,
        categorySort: 0 /* 分类排序 */,
        categoryIcon: "" /* 分类图片 */,
        categoryStatus: true /* 分类状态 */,
        isDelete: 0 /* 逻辑删除 */,
        isParent: null /* 和父节点一起处理为几级节点 */,
        first: "" /* 分类首字母 */,
        level: 1 /* 分类级数 */,
        specCurrencyVOs: [
          {
            isSearch: 1,
            specParamVOs: [
              //     {
              //       specParamId: "",
              //       isDisplay: 1,
              //       isSearch: 1,
              //       specParamName: "124",
              //       specCurrencyValue: ["64gb", "128gb"]
              //     }
            ]
          }
        ],
        specOptionalVOs: [
          {
            isSearch: 1,
            specParamVOs: [
              //     {
              //       specParamId: "",
              //       isDisplay: 1,
              //       isSearch: 1,
              //       specParamName: "124",
              //       specOptionalValue: ["64gb", "128gb"]
              //     }
            ]
          }
        ]
      },
      categoryRules: {
        categoryName: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        categorySort: [{ required: true, message: "请输入分类排序", trigger: "blur" }],
        first: [
          { required: true, message: "请输入分类首字母", trigger: "blur" },
          { max: 1, message: "分类首字母为一个字母", trigger: "blur" }
        ],
        categoryIcon: [{ required: true, message: "请上传分类图片", trigger: "blur" }]
      },
      cateId: [] /* 中间变量 */,
      showImg: true,
      props: {
        value: "id",
        label: "categoryName",
        checkStrictly: true,
        disabled: "isParent",
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
      showTable: true,
      showTag: true
    };
  },
  watch: {
    cateId: {
      handler() {
        if (this.cateId.length == 2) {
          this.categoryform.isParent = false;
          this.categoryform.parentId = this.cateId[this.cateId.length - 1];
          this.categoryform.level = 3;
        } else if (this.cateId.length == 1) {
          this.categoryform.isParent = true;
          this.categoryform.parentId = this.cateId[this.cateId.length - 1];
          this.categoryform.level = 2;
        } else {
          this.categoryform.isParent = true;
          this.categoryform.parentId = null;
          this.categoryform.level = 1;
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      getCategoryById(this.$route.query.id).then(data => {
        if (data.data.status == 200) {
          this.categoryform = data.data.content;
          this.refreshImg();
          if (this.categoryform.specCurrencyVOs == null || this.categoryform.specCurrencyVOs[0].specParamVOs == null) {
            this.categoryform.specCurrencyVOs = [{ isSearch: 1, specParamVOs: [] }];
          }
          if (this.categoryform.specOptionalVOs == null || this.categoryform.specOptionalVOs[0].specParamVOs == null) {
            this.categoryform.specOptionalVOs = [{ isSearch: 1, specParamVOs: [] }];
          }
        }
      });
    }
    /* 初始化级联列表 */
    getCategoryByPar({ pageNo: 1, pageSize: 40 }).then(data => {
      if (data.data.status == 0) {
        this.categoryList = data.data.data.list;
      }
    });
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
          this.categoryform.categoryId = this.$route.query.id;
          if (this.$route.query.id) {
            updateCategory(this.categoryform)
              .then(data => {
                if (data.data.status == 0) {
                  this.$message({
                    type: "success",
                    message: "分类修改成功",
                    center: true
                  });
                  this.$router.go(-1);
                } else {
                  this.$message({
                    type: "error",
                    message: "添加失败",
                    center: true
                  });
                }
              })
              .catch(error => {
                this.$message({
                  type: "error",
                  message: `${error}`,
                  center: true
                });
              });
          } else if (this.$route.query.parentId) {
            this.categoryform.parentId = this.$route.query.parentId;
            if (this.$route.query.level == 1) {
              this.categoryform.isParent = true;
              this.categoryform.level = 2;
            } else if (this.$route.query.level == 2) {
              this.categoryform.isParent = false;
              this.categoryform.level = 3;
            }
            addCategory(this.categoryform)
              .then(data => {
                if (data.data.status == 0) {
                  this.$message({
                    type: "success",
                    message: "子分类添加成功",
                    center: true
                  });
                  this.$router.go(-1);
                } else {
                  this.$message({
                    type: "error",
                    message: "添加失败",
                    center: true
                  });
                }
              })
              .catch(error => {
                this.$message({
                  type: "error",
                  message: `${error}`,
                  center: true
                });
              });
          } else {
            if (this.categoryform.isParent == null) {
              this.categoryform.isParent = true;
            }
            addCategory(this.categoryform)
              .then(data => {
                if (data.data.status == 0) {
                  this.$message({
                    type: "success",
                    message: "分类添加成功",
                    center: true
                  });
                  this.$router.go(-1);
                } else {
                  this.$message({
                    type: "error",
                    message: "添加失败",
                    center: true
                  });
                }
              })
              .catch(error => {
                this.$message({
                  type: "error",
                  message: `${error}`,
                  center: true
                });
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
    /* 分类的编辑属性 */
    delteGroup(type, idx) {
      if (type == "currency") {
        this.categoryform.specCurrencyVOs[0].specParamVOs.splice(idx, 1);
      }
      if (type == "optional") {
        this.categoryform.specOptionalVOs[0].specParamVOs.splice(idx, 1);
      }
      this.refreshTable();
    },
    addGroup(type) {
      let obj = {
        specParamId: "",
        isDisplay: 1,
        isSearch: 1,
        specParamName: "",
        specCurrencyValue: []
      };
      let obj1 = {
        specParamId: "",
        isDisplay: 1,
        isSearch: 1,
        specParamName: "",
        specOptionalValue: []
      };
      this.refreshTag();
      if (type == "currency") {
        this.categoryform.specCurrencyVOs[0].specParamVOs.push(obj);
      }
      if (type == "optional") {
        this.categoryform.specOptionalVOs[0].specParamVOs.push(obj1);
      }
    },
    /* 刷新 */
    refreshTable() {
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
      });
    },
    refreshTag() {
      this.showTag = false;
      this.$nextTick(() => {
        this.showTag = true;
      });
    }
  },
  components: { uploadImg, tagAdd, switchCom }
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
      .el-cascader .el-input__inner {
        width: 300px; //搜索框宽度
      }
    }
  }
}
</style>
