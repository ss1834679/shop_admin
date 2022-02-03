<template>
  <div class="levelTwoMenu">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll2">{{menuOptions.title}}</el-checkbox>
      </div>
      <div class="content">
        <menu-tablet
          v-for="(menuItem,index) in menuOptions.children"
          :key="menuItem.title"
          :threeLevle="menuItem"
          :isCheckAll="checkAll2"
          :nowMenu="nowMenu||[]"
          @changeChecked="(value)=>{handleCheckedMenuChangeW(value,index)}"
        ></menu-tablet>
      </div>
    </el-card>
  </div>
</template>
<script>
import menuTablet from "./menuTableThree";
export default {
  name: "menuTableTwo",
  props: {
    twoLevle: { required: true } /* 二级名 三级菜单列表 */,
    nowMenu: { type: Array } /* 当前role的菜单 */,
    isCheckAll: { required: true } /* 父级的全选 */
  },
  data() {
    return {
      checkAll2: false,
      checkedMenu2: [],
      menuOptions: {},
      isIndeterminate: false,
      childrenList: [],
      isAll: [],
      isFull: []
    };
  },
  mounted() {
    this.menuOptions = this.twoLevle;
    this.childrenList = new Array(this.menuOptions.children.length);
    this.isAll = new Array(this.menuOptions.children.length);
    this.isFull = new Array(this.menuOptions.children.length);
  },
  watch: {
    isCheckAll: {
      handler() {
        this.checkAll2 = this.isCheckAll;
      }
    }
  },
  methods: {
    handleCheckedMenuChangeW(value, index) {
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
        this.checkAll2 = true;
      } else if (num == 0) {
        this.checkAll2 = false;
      }
      this.childrenList.forEach(item => {
        arr = arr.concat(item);
      });
      arr = arr.filter(item => {
        return item != null;
      });
      if (arr.length > 0) {
        arr.push(this.menuOptions.id);
      }
      this.$emit("changeChecked", {
        data: arr,
        hasCheck: this.checkAll2,
        isFull: arr.length > 0 ? true : false
      });
    }
  },
  components: { menuTablet }
};
</script>