<template>
  <div>
    <el-cascader
      ref="list"
      placeholder="请选择分类(可搜索)"
      v-model="tempValue"
      :props="tempProps"
      :options="tempList"
      @change="change"
      filterable
    ></el-cascader>
    {{tempValue}}
  </div>
</template>

<script>
export default {
  name: "casCader",
  props: {
    list: { required: true },
    props: { required: true },
    value: { required: true }
  },
  data() {
    return {
      tempList: [],
      tempProps: {},
      tempValue: []
    };
  },
  beforeMount() {
    this.tempList = this.list;
    this.tempProps = this.props;
    // this.tempValue = this.value.split(",").splice(0,3);
    for (let i = 0; i < 3; i++) {
      this.tempValue.push(this.value.split(",")[i]);
    }
  },
  methods: {
    change(val) {
      let arr = [];
      for (let i = 0; i < 3; i++) {
        if (val[i]) {
          arr[i] = val[i];
        } else {
          arr[i] = "";
        }
      }
      this.$emit("getCategoryId", arr.join(","));
    }
  }
};
</script>

<style lang='less'>
</style>

