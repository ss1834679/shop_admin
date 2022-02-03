<template v-if="showTag">
  <!-- 添加属性，添加标签组件 -->
  <div>
    <template>
      <div class="inlinetag" :key="item.specParamName" v-for="(item,i) in tagData">
        <el-tag
          closable
          v-if="i!=alterIndex"
          :disable-transitions="true"
          @close="handleClose(item.specParamName)"
          @click="handleVeiw(i)"
        >{{item.specParamName}}</el-tag>
        <el-input
          class="alter-tag"
          v-else
          v-model="inputValue"
          size="small"
          @keyup.enter.native="handleInputConfirm(i)"
          @blur="handleInputConfirm(i)"
        ></el-input>
      </div>
    </template>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    ></el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">添加新规格</el-button>
  </div>
</template>

<script>
export default {
  name: "tagAdd",
  props: {
    arrData: { required: true }
  },
  data() {
    return {
      tagData: [],
      inputVisible: false,
      inputValue: "",
      alterIndex: -1
    };
  },
  beforeMount() {
    this.tagData = this.arrData;
  },
  watch: {
    arrData: {
      handler() {
        this.tagData = this.arrData;
      }
    }
  },
  //   beforeUpdate() {
  //     this.tagData = this.arrData;
  //     console.log(this.tagData);
  //   },
  methods: {
    /* 规格tags的函数 */
    handleClose(tag) {
      let idx;
      this.tagData.forEach((item, i) => {
        if (item.specParamName == tag) {
          idx = i;
        }
      });
      /* 判断这个属性是否挂载商品 传item.specParamId */
      // if (true) {
      this.tagData.splice(idx, 1);
      this.$emit("getArrData", this.tagData);
      // }
    },
    handleVeiw(idx) {
      this.alterIndex = idx;
      this.inputValue = this.tagData[idx].specParamName;
    },
    showInput() {
      this.alterIndex = -1;
      this.inputValue = "";
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(idx) {
      if (Number.isInteger(idx)) {
        this.alterIndex = -1;
        this.tagData[idx].specParamName = this.inputValue;
        this.inputValue = "";
        this.$emit("getArrData", this.tagData);
      } else {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.tagData.push({ specParamId: "", isDisplay: 1, isSearch: 1, specParamName: inputValue });
        }
        this.inputVisible = false;
        this.inputValue = "";
        this.$emit("getArrData", this.tagData);
      }
    }
  }
};
</script>

<style lang='less'>
.inlinetag {
  display: inline;
}
.tagsdiv {
  .el-tag {
    background-color: white;
    border-color: #e4e4e4;
    height: 40px;
    line-height: 40px;
    color: #464c5b;
    font-size: 14px;
    border-radius: 0px;
    .el-icon-close:hover {
      background-color: red;
      color: #fff;
    }
    .el-tag__close {
      color: #464c5b;
    }
  }
  .el-button:focus,
  .el-button:hover {
    background-color: #2ecc71;
    color: white;
  }
}
.inlinetag + .inlinetag {
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
  width: auto;
  margin-left: 10px;
  vertical-align: bottom;
}
.alter-tag {
  width: auto;
  vertical-align: bottom;
}
</style>
