<template>
  <div class="levelThreeMenu">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll3" @change="handleCheckAllChange">{{menuOptions.title}}</el-checkbox>
    <el-checkbox-group v-if="showTable" v-model="checkedMenu3">
      <el-checkbox
        v-for="(menuItem) in menuOptions.children"
        :label="menuItem.id"
        :checked="nowMenu.includes(menuItem.id)"
        :key="menuItem.id"
      >{{menuItem.title}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  name: "menuTableThree",
  props: {
    threeLevle: { required: true } /* 三级名 三级菜单列表 */,
    isCheckAll: { required: true } /* 父级的全选 */,
    nowMenu: { type: Array } /* 当前的role的菜单 */
  },
  data() {
    return {
      checkAll3: false,
      checkedMenu3: [],
      menuOptions: [],
      isIndeterminate: false,
      showTable: true
    };
  },
  mounted() {
    this.menuOptions = this.threeLevle;
  },
  watch: {
    isCheckAll: {
      handler() {
        this.checkAll3 = this.isCheckAll;
      }
    },
    checkAll3: {
      handler() {
        this.handleCheckAllChange(this.checkAll3);
      }
    },
    checkedMenu3: {
      handler() {
        this.handleCheckedMenuChangeT(this.checkedMenu3);
      },
      deep: true
    },
    nowMenu: {
      handler() {
        this.refreshTable();
      },
      deep: true
    }
  },
  methods: {
    handleCheckAllChange(val) {
      let arr = this.menuOptions.children.map(item => {
        return item.id;
      });
      this.checkedMenu3 = val ? arr : [];
      this.isIndeterminate = false;
    },
    handleCheckedMenuChangeT(value) {
      let checkedCount = value.length;
      let arr = JSON.parse(JSON.stringify(value));
      if (arr.length > 0) {
        arr.push(this.menuOptions.id);
      }
      if (value.length == 0) {
        this.checkAll3 = false;
      } else if (value.length == this.threeLevle.children.length) {
        this.checkAll3 = true;
      }
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.threeLevle.children.length;
      this.$emit("changeChecked", {
        data: arr,
        hasCheck: this.checkAll3,
        isFull: value.length > 0 ? true : false
      });
    },
    /* 刷新 */
    refreshTable() {
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
      });
    }
  }
};
</script>