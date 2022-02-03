<template>
  <div class="levelTwoPermission">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll2">{{permissionOptions.name}}</el-checkbox>
      </div>
      <div class="content">
        <el-checkbox-group v-if="showTable" v-model="checkedPermission2">
          <el-checkbox
            v-for="(permissionItem) in permissionOptions.children"
            :label="permissionItem.id"
            :checked="nowPermission.includes(permissionItem.id)"
            :key="permissionItem.id"
          >{{permissionItem.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "menuTableTwo",
  props: {
    twoLevle: { required: true } /* 二级里面包含的所有权限 包含有id name */,
    isCheckAll: { required: true } /* 父级的全选 */,
    nowPermission: { type: Array } /* 当前的权限数组 */
  },
  data() {
    return {
      checkAll2: false,
      checkedPermission2: [],
      permissionOptions: {},
      isIndeterminate: false,
      isAll: [],
      isFull: [],
      showTable: true
    };
  },
  watch: {
    checkedPermission2: {
      handler() {
        this.handleCheckedMenuChangeW(this.checkedPermission2);
      },
      deep: true
    },
    checkAll2: {
      handler() {
        this.handleCheckAllChange(this.checkAll2);
      }
    },
    isCheckAll: {
      handler() {
        this.checkAll2 = this.isCheckAll;
      }
    },
    nowPermission: {
      handler() {
        this.refreshTable();
      },
      deep: true
    }
  },
  mounted() {
    this.permissionOptions = this.twoLevle;
    this.isAll = new Array(this.permissionOptions.children.length);
    this.isFull = new Array(this.permissionOptions.children.length);
  },
  methods: {
    handleCheckAllChange(val) {
      let arr = this.permissionOptions.children.map(item => {
        return item.id;
      });
      this.checkedPermission2 = val ? arr : [];
      this.isIndeterminate = false;
    },
    handleCheckedMenuChangeW(value) {
      if (value.length == 0) {
        this.checkAll2 = false;
      } else if (value.length == this.twoLevle.children.length) {
        this.checkAll2 = true;
      }
      this.isIndeterminate = value.length > 0 && value.length < this.twoLevle.children.length;
      let arr = JSON.parse(JSON.stringify(value));
      if (arr.length > 0) {
        arr.push(this.permissionOptions.id);
      }
      this.$emit("changeChecked", {
        data: arr,
        hasCheck: this.checkAll2,
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