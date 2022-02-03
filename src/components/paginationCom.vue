<template>
  <div>
    <el-pagination
      v-if="isChangeSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page="cPage"
      :page-sizes="[20, 50, 100, 200, 300, 400]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-pagination
      v-else
      @current-change="handleCurrentChange"
      background
      :current-page="cPage"
      :page-size="size"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "paginationCom",
  props: {
    total: { required: true, type: Number },
    cPage: { required: true, type: Number },
    size: { required: true, type: Number },
    isChangeSize: { required: false, type: Boolean }
  },
  data() {
    return {};
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("getJump", val);
    },
    handleSizeChange(val) {
      this.$emit("update:size", val);
      this.$emit("changeSizes", val);
    }
  }
};
</script>

<style lang='less'>
</style>
