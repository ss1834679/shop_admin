<template v-if="showTag">
  <!-- 添加规格，添加标签组件 -->
  <div>
    <el-tag :key="index" v-for="(tag,index) in tagData" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    ></el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">{{text==undefined?'添加新规格':text}}</el-button>
  </div>
</template>

<script>
export default {
  name: "tagAdd",
  props: {
    tableindex: { required: false },
    domref: { required: false },
    arrData: { required: true },
    text: { required: false }
  },
  data() {
    return {
      tagData: "",
      inputVisible: false,
      inputValue: ""
    };
  },
  watch: {
    arrData: {
      handler() {
        this.tagData = this.arrData;
      },
      deep: true
    }
  },
  mounted() {
    this.tagData = this.arrData;
  },
  methods: {
    /* 规格tags的函数 */
    handleClose(tag) {
      if (this.domref) {
        this.domref && this.$emit("delete", { tableindex: this.tableindex, oValue: tag, len: this.tagData.length });
      }
      this.tagData.splice(this.tagData.indexOf(tag), 1);
      this.$emit("getArrData", this.tagData);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      if (this.inputValue != "") {
        if (this.tagData.indexOf(this.inputValue) == -1) {
          let inputValue = this.inputValue;
          if (inputValue) {
            this.tagData.push(inputValue);
          }
          this.inputVisible = false;
          this.inputValue = "";
          this.$emit("getArrData", this.tagData);
          this.domref &&
            this.$emit("add", { tableindex: this.tableindex, oValue: inputValue, len: this.tagData.length - 1 });
        } else {
          this.$message.warning("该项已存在");
        }
      }
    }
  }
};
</script>

<style lang='less'>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
