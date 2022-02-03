<template>
  <div id="homeRecommend">
    <!-- 推荐管理 -->
    <el-card class="recommendCard" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">推荐策略</span>
      </div>
      <div class="content">
        <el-form label-position="top" :model="tacticsForm" ref="tacticsForm" :rules="tacticsRules" label-width="150px">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="tacticsForm.name" placeholder="请输入规则名称"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-select v-model="ageItem" placeholder="请选择年龄段" value-key="label">
              <el-option v-for="(item,index) in ageList" :key="index" :label="item.label" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐风格" prop="adviseStyle">
            <el-select v-model="tacticsForm.adviseStyle" :multiple-limit="5" multiple placeholder="请选择风格" clearable>
              <el-option v-for="(item,index) in styleList" :key="index" :label="item.title" :value="item.title"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('tacticsForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="dataTable">
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
      </div>
      <el-table :data="recommendList" border style="width: 100%">
        <el-table-column align="center" prop="id" label="ID"></el-table-column>
        <el-table-column align="center" prop="name" label="规则名称"></el-table-column>
        <el-table-column align="center" prop="adviseStyle" label="推荐风格">
          <template slot-scope="scope">
            <span v-if="scope.row.adviseStyle&&scope.row.adviseStyle.length>0">{{scope.row.adviseStyle.join(",")}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="年龄段">
          <template slot-scope="scope">
            <span v-if="scope.row.maxAge==null">{{scope.row.minAge}}岁以上</span>
            <span v-else-if="scope.row.minAge==null">{{scope.row.maxAge}}岁以下</span>
            <span v-else>{{scope.row.minAge}}-{{scope.row.maxAge}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" align="center" width="95">
          <template slot-scope="scope">
            <el-button type="text" @click="editRecommend(scope.row)">编辑</el-button>
            <el-button type="text" @click="handledelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { editStrategy, addStrategy, getAllStrategy, deleteStrategy } from "../../api/magichome";
import { getAllUsableDecorateStyle } from "../../api/setings";
export default {
  data() {
    const checkAge = (rule, value, callback) => {
      if (this.ageItem.label) {
        callback();
      } else {
        callback(new Error("请选择年龄段"));
      }
    };
    return {
      recommendList: [],
      tacticsForm: {
        adviseStyle: [] /* 推荐风格 */,
        maxAge: 1,
        minAge: 1,
        name: "" /* 规则名称 */
      },
      ageList: [
        { label: "20岁以下", minAge: null, maxAge: 20 },
        { label: "20-29", minAge: 20, maxAge: 29 },
        { label: "30-39", minAge: 30, maxAge: 39 },
        { label: "40-49", minAge: 40, maxAge: 49 },
        { label: "50岁及以上", minAge: 50, maxAge: null }
      ],
      ageItem: {} /* 年龄的对象 */,
      styleList: [],
      tacticsRules: {
        name: [
          { required: true, message: "请输入规则名称", trigger: "blur" },
          { min: 0, max: 20, message: "规则名称不能大于20个字", trigger: "blur" }
        ],
        age: [{ validator: checkAge, required: true, trigger: "blur" }],
        adviseStyle: [{ required: true, message: "请选择推荐风格", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.showAll();
    getAllUsableDecorateStyle().then(data => {
      if (data.data.status == 0) {
        this.styleList = data.data.data;
      }
    });
  },
  methods: {
    handledelete(row) {
      this.$confirm("删除后将不可恢复，确认要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteStrategy(row.id).then(data => {
            if (data.data.status == 0) {
              this.$message.success(data.data.data);
              this.showAll();
            } else {
              this.$message.error(data.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    editRecommend(rows) {
      let { minAge, maxAge, ...last } = rows;
      this.tacticsForm = last;
      this.ageItem = this.ageList.find(item => {
        return item.minAge == minAge && item.maxAge == maxAge;
      });
    },
    submitForm(tacticsForm) {
      this.$refs[tacticsForm].validate(valid => {
        if (valid) {
          this.tacticsForm.maxAge = this.ageItem.maxAge;
          this.tacticsForm.minAge = this.ageItem.minAge;
          if (this.tacticsForm.id) {
            editStrategy(this.tacticsForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success(data.data.data);
                this.showAll();
                this.tacticsForm = {
                  adviseStyle: [] /* 推荐风格 */,
                  maxAge: 1,
                  minAge: 1,
                  name: "" /* 规则名称 */
                };
                this.ageItem = {};
              } else {
                this.$message.error(data.data.msg);
              }
            });
          } else {
            addStrategy(this.tacticsForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success(data.data.data);
                this.showAll();
                this.tacticsForm = {
                  adviseStyle: [] /* 推荐风格 */,
                  maxAge: 1,
                  minAge: 1,
                  name: "" /* 规则名称 */
                };
                this.ageItem = {};
              } else {
                this.$message.error(data.data.msg);
              }
            });
          }
        }
      });
    },
    showAll() {
      getAllStrategy().then(data => {
        if (data.data.status == 0) {
          this.recommendList = data.data.data;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#homeRecommend {
  width: 100%;
  height: auto;
  display: flex;
  background-color: #f1f1f1;
  .se-content {
    background: #ddd;
  }
  .recommendCard {
    // height: 100%;
    width: 400px;
    margin-right: 10px;
    display: inline-block;
    .el-card__header {
      padding: 0;
      background-color: #ddd;
      .clearfix {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        span.title {
          line-height: 50px;
          font-size: 14px;
        }
        .el-button {
          margin-right: 20px;
          height: 36px;
        }
      }
    }
    .content {
      // height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      .search {
        .search_box {
          .el-input-number {
            width: 110px;
          }
        }
      }
    }
  }

  .dataTable {
    width: calc(~"100% - 360px");
    height: auto;
    display: inline-block;
  }
}
</style>