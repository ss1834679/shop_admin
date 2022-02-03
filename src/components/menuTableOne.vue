<template>
  <div id="levelOneMenu">
    <menu-tablew
      v-for="(item,index) in menuOptions"
      :key="item.title"
      :twoLevle="item"
      :isCheckAll="checkAll"
      :nowMenu="nowMenu||[]"
      @changeChecked="(value)=>{handleCheckedMenuChangeO(value,index)}"
    ></menu-tablew>
    <el-card class="box-card allMenu" shadow="never">
      <div slot="header" class="clearfix">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll">全选</el-checkbox>
      </div>
    </el-card>
  </div>
</template>

<script>
import menuTablew from "./menuTableTwo";
import { getMyMenu } from "../api/permission";
export default {
  name: "mmenuTableOne",
  props: {
    nowMenu: { type: Array } /* 当前角色的 菜单的数组 */
  },
  data() {
    return {
      isIndeterminate: false,
      checkedMenu: [],
      menuOptions: [],
      checkAll: false,
      childrenList: [],
      isAll: [],
      isFull: []
    };
  },
  mounted() {
    /* 权限分配者查询自身拥有的菜单 */
    getMyMenu()
      .then(data => {
        if (data.data.status == 200) {
          this.menuOptions = this.initMenu(data.data.content);
          this.childrenList = new Array(this.menuOptions.length);
          this.isAll = new Array(this.menuOptions.length);
          this.isFull = new Array(this.menuOptions.length);
        } else {
          this.$message({
            showClose: true,
            message: "获取数据失败，请刷新页面重新获取！",
            type: "error"
          });
        }
      })
      .catch(error => {
        this.$message({
          message: error,
          type: "error"
        });
      });
  },
  methods: {
    handleCheckedMenuChangeO(value, index) {
      let arr = [];
      if (value.isFull) {
        this.childrenList[index] = value.data;
      } else {
        this.childrenList[index] = null;
      }
      this.isAll[index] = value.hasCheck;
      this.isFull[index] = value.isFull;
      let num = 0;
      let num2 = 0;
      this.isFull.forEach(item => {
        if (item == true) {
          num2++;
        }
      });
      this.isAll.forEach(item => {
        if (item == true) {
          num++; /* 判断是否全为true */
        }
      });
      if (num2 == this.isFull.length) {
        if (num == this.isAll.length) {
          this.isIndeterminate = false;
        } else {
          this.isIndeterminate = true;
        }
      } else {
        if (num2 > 0) {
          this.isIndeterminate = true;
        } else {
          this.isIndeterminate = false;
        }
      }
      if (num == this.isAll.length) {
        this.checkAll = true;
      } else if (num == 0) {
        this.checkAll = false;
      }
      this.childrenList.forEach(item => {
        arr = arr.concat(item);
      });
      arr = arr.filter(item => {
        return item != null;
      });
      this.$emit("getMenu", arr);
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
    }
  },
  components: { menuTablew }
};
</script>

<style lang="less">
#levelOneMenu {
  .el-card__header {
    padding: 0;
    padding-left: 20px;
    .clearfix {
      height: 50px;
      line-height: 50px;
    }
  }
  .levelTwoMenu {
    width: 100%;
    font-size: 24px;
    margin-bottom: 10px;
    .el-card__header {
      background-color: #f9fafc;
    }
    .levelThreeMenu {
      padding-bottom: 10px;
      .el-checkbox-group {
        padding-left: 30px;
        padding-top: 15px;
      }
    }
  }
  .allMenu {
    .el-card__body {
      display: none;
    }
  }
}
</style>