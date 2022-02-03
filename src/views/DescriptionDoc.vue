<template>
  <div>
    <mavon-editor v-model="value" @change="(value,render)=>{this.htmlData=render}"></mavon-editor>
    <div v-html="htmlData"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      htmlData: "",
      defaultData: "preview"
    };
  },
  watch: {
    value: {
      handler() {
        console.log(this.htmlData);
      }
    }
  }
};
</script>