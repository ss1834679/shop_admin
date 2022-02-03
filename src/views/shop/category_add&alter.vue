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
        <el-form :model="categoryform" ref="categoryform" label-width="100px" class="demo-ruleForm">
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
          <el-form-item label="分类名称">
            <el-input v-model="categoryform.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="分类排序">
            <el-input v-model.number="categoryform.categorySort"></el-input>
          </el-form-item>

          <el-form-item label="筛选属性">
            <div v-for="item in categoryform.specCurrency" :key="item.groupName">
              <div class="tableHead">
                <span>{{item.groupName}}</span>
              </div>
              <div class="tagsdiv">
                <spec-table :arrData="item.specParams" @getArrData="(arr)=>{item.specParams=arr}"></spec-table>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="分类图片">
            <upload-img @getimgArr="(imgarr)=>{this.categoryform.categoryIcon = imgarr}" :imgArr="this.categoryform.categoryIcon" :limit="1"></upload-img>
          </el-form-item>
          <el-form-item label="分类状态">
            <el-radio-group v-model="categoryform.categoryStatus">
              <!-- label就是值 -->
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
import specTable from "../../components/specTable";
// import { addCategory, updateCategory, getCategoryByPar } from "../../api/category";
import { addCategory, getCategoryByPar } from "../../api/category";
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
        specCurrency: [
          {
            isSearch: 1,
            specParams: []
          }
        ]
      },
      cateId: [] /* 中间变量 */,
      props: {
        value: "id",
        label: "categoryName",
        checkStrictly: true,
        disabled: "isParent",
        lazy: true,
        lazyLoad(node, resolve) {
          console.log(node.data.id);
          getCategoryByPar({
            parentId: node.data.id,
            pageNo: 1,
            pageSize: 40
          }).then(data => {
            console.log(data.data.data.list, 88888);
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
      ]
    };
  },
  watch: {
    cateId: {
      handler() {
        if (this.cateId.length >= 3) {
          this.categoryform.isParent = false;
        } else {
          this.categoryform.isParent = true;
        }
        this.categoryform.parentId = this.cateId[this.cateId.length - 1];
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      // const loading = this.$loading({
      //   lock: true,
      //   text: "Loading",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      getCategoryByPar({ id: this.$route.query.id }).then(data => {
        if (data.data.status == 0) {
          console.log(data);
          this.categoryform = data.data.data;
          console.log(this.categoryform);
          // loading.close();
        }
      });
    }
    /* 初始化级联列表 */
    getCategoryByPar({ pageNo: 1, pageSize: 40 }).then(data => {
      if (data.data.status == 0) {
        this.categoryList = data.data.data.list;
        console.log(this.categoryList);
      }
    });
  },
  methods: {
    submitForm() {
      // if (this.$route.query.id) {
      //   this.categoryform.id = this.$route.query.id;
      //   console.log(this.categoryform);
      //   updateCategory(this.categoryform).then(data => {
      //     console.log(data);
      //     if (data.data.status == 0) {
      //       this.$message({
      //         type: "success",
      //         message: "分类修改成功",
      //         center: true
      //       });
      //       this.$router.go(-1);
      //     }
      //   });
      // } else if (this.$route.query.parentId) {
      //   this.categoryform.parentId = this.$route.query.parentId;
      //   if (this.$route.query.level == 1) {
      //     this.categoryform.isParent = true;
      //   } else if (this.$route.query.level == 2) {
      //     this.categoryform.isParent = false;
      //   }
      //   console.log(this.categoryform);
      //   addCategory(this.categoryform).then(data => {
      //     console.log(data);
      //     if (data.data.status == 0) {
      //       this.$message({
      //         type: "success",
      //         message: "子分类添加成功",
      //         center: true
      //       });
      //       this.$router.go(-1);
      //     }
      //   });
      // } else {
      console.log(this.categoryform);
      addCategory(this.categoryform).then(data => {
        console.log(data);
        if (data.data.status == 0) {
          this.$message({
            type: "success",
            message: "分类添加成功",
            center: true
          });
          this.$router.go(-1);
        }
      });
      // }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
    }
  },
  //是否有富文本编辑
  components: {
    uploadImg,
    specTable
  }
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
