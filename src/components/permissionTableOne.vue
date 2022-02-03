<template>
  <div id="levelOnePermission">
    <permission-tablew
      v-for="(item,index) in permissionOptions"
      :key="item.name"
      :twoLevle="item"
      :isCheckAll="checkAll"
      :nowPermission="nowPermission||[]"
      @changeChecked="(value)=>{handleCheckedMenuChangeO(value,index)}"
    ></permission-tablew>
    <el-card class="box-card allPermission" shadow="never">
      <div slot="header" class="clearfix">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll">全选</el-checkbox>
      </div>
    </el-card>
  </div>
</template>

<script>
import permissionTablew from "./permissionTableTwo";
import { getPermissionLogin } from "../api/permission";
export default {
  name: "permissionTableOne",
  props: {
    nowPermission: { type: Array } /* 这个角色、用户当前的权限 */,
    roleId: {
      type: String
    } /* 传入角色id  首先判断当前用户是否为超级管理员 如果不是 通过角色id获取当前角色id全部权限 如果没有传roleId说明是添加 则获取全部权限 */
  },
  data() {
    return {
      isIndeterminate: false,
      checkAll: false,
      permissionOptions: [
        /* 后台获取 */
        // {
        //   name: "商品",
        //   children: [
        //     { id: "1-1", name: "添加商品" },
        //     { id: "1-2", name: "修改商品" },
        //     { id: "1-3", name: "商品审核" },
        //     { id: "1-4", name: "查看商品" }
        //   ]
        // },
        // {
        //   name: "订单",
        //   children: [
        //     { id: "2-1", name: "修改发货地址" },
        //     { id: "2-2", name: "修改订单" },
        //     { id: "2-3", name: "订单审核" },
        //     { id: "2-4", name: "查看订单" },
        //     { id: "2-5", name: "分发订单" }
        //   ]
        // },
        // {
        //   name: "内容",
        //   children: [
        //     { id: "3-1", name: "发布文章" },
        //     { id: "3-2", name: "修改文章" },
        //     { id: "3-3", name: "文章审核" }
        //   ]
        // }
      ],
      childrenList: [],
      isAll: [],
      isFull: []
    };
  },
  mounted() {
    getPermissionLogin().then(data => {
      this.permissionOptions = this.initPermission(data.data.content);
    });

    this.childrenList = new Array(this.permissionOptions.length);
    this.isAll = new Array(this.permissionOptions.length);
    this.isFull = new Array(this.permissionOptions.length);
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
      this.$emit("getPermission", arr);
    },
    initPermission(arr) {
      if (Array.isArray(arr)) {
        let arr1 = new Array(arr.length);
        arr.forEach((item, index) => {
          arr1[index] = item.sysPermissionParent;
          arr1[index]["children"] = item.sysPermissionList;
        });
        return arr1;
      } else {
        return null;
      }
    }
  },
  components: { permissionTablew }
};
</script>

<style lang="less">
#levelOnePermission {
  .el-card__header {
    padding: 0;
    padding-left: 20px;
    .clearfix {
      height: 50px;
      line-height: 50px;
    }
  }
  .levelTwoPermission {
    width: 100%;
    font-size: 24px;
    margin-bottom: 10px;
    .el-card__header {
      background-color: #f9fafc;
    }
  }
  .allPermission {
    .el-card__body {
      display: none;
    }
  }
}
</style>