<template>
  <div id="addAlter">
    <!-- 菜单添加和修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.query.id">修改菜单</span>
          <span class="title" v-else>添加菜单</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="menuform" ref="menuform" label-width="100px" class="demo-ruleForm">
          <el-form-item label="所属菜单">
            <template v-if="!this.$route.query.parentId">
              <div>
                <el-cascader
                  ref="menuList"
                  placeholder="请选择父级菜单"
                  v-model="menuform.parentId"
                  :props="props"
                  :options="menuList"
                  @visible-change="elCascaderOnlick"
                  @expand-change="elCascaderOnlick"
                  @change="clearValue"
                  clearable
                ></el-cascader>
                <span style="margin-left:15px">若为一级菜单请清空</span>
              </div>
            </template>
            <!-- <span v-else>{{this.$route.query.parentName}}</span> -->
          </el-form-item>
          <el-form-item label="菜单标题" required>
            <el-input v-model="menuform.title"></el-input>
          </el-form-item>
          <el-form-item label="name(英文)">
            <el-input v-model="menuform.name"></el-input>
          </el-form-item>
          <el-form-item label="路由地址">
            <el-input v-model="menuform.path"></el-input>
          </el-form-item>
          <el-form-item label="菜单排序" required>
            <el-input v-model.number="menuform.sort"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('menuform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addmenu, getMenu } from "../../api/permission";
export default {
  data() {
    return {
      menuform: {
        title: "" /* 最左侧的标题 */,
        name: "" /* 路由的根路径下的第一个 以这个为名字的路由都在这个下面 */,
        icon: "" /* 左侧的图标 */,
        path: "",
        parentId: "" /* 父ID */,
        sort: 0 /* 菜单排序 */,
        isDelete: 0 /* 逻辑删除 */
      },
      props: {
        value: "id",
        label: "title",
        checkStrictly: true,
        emitPath: false
      },
      menuList: []
    };
  },
  mounted() {
    /* 初始化级联列表 */
    getMenu().then(data => {
      if (data.data.status == 200) {
        this.menuList = this.initMenu(data.data.content);
      }
    });
  },
  methods: {
    submitForm() {
      addmenu(this.menuform).then(data => {
        if (data.data.status == 200) {
          this.$message({
            type: "success",
            message: "菜单添加成功",
            center: true
          });
        } else {
          this.$message({
            type: "error",
            message: "添加失败",
            center: true
          });
        }
      });
    },
    elCascaderOnlick() {
      let that = this;
      setTimeout(function() {
        document.querySelectorAll(".el-cascader-panel .el-radio").forEach(el => {
          el.onclick = function() {
            that.$refs.menuList.dropDownVisible = false;
          };
        });
      }, 100);
    },
    /* 获取菜单转化格式 */
    initMenu(arr) {
      if (Array.isArray(arr)) {
        let arr1 = new Array(arr.length);
        arr.forEach((item, index) => {
          arr1[index] = item.sysMenu;
          arr1[index]["children"] = this.initMenu(item.menuModelList);
        });
        return arr1;
      } else {
        return null;
      }
    },
    clearValue(value) {
      if (value == null) {
        this.menuform.parentId = "1";
      }
    }
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
