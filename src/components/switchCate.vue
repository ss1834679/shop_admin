
<template>
  <div>
    <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" @change="submit"></el-switch>
  </div>
</template>
<script>
export default {
  name: "switchCate",
  props: {
    boolen: { required: true }
  },
  data() {
    return {};
  },
  computed: {
    value: {
      get() {
        return this.boolen;
      },
      set() {
        // this.value = val;
      }
    }
  },
  mounted() {},
  methods: {
    submit(event) {
      if (event) {
        this.$emit("changeIndex", 1);
      } else {
        this.$emit("changeIndex", 0);
      }
    }
  }
};
</script>