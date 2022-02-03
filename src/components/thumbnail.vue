<template>
  <el-image
    :src="image.includes('http')?`${image}?x-oss-process=image/resize,m_fill,h_${h},w_${w}`:`${baseSize}?fileId=${image}&h=${h}&w=${w}`"
    :style="`height :${h}px`"
    :preview-src-list="[image.includes('http')?image:base+image]"
    lazy
  ></el-image>
</template>
<script>
export default {
  name: "thumbnail",
  props: {
    image: { required: true, type: String },
    w: { required: false, default: 60, type: Number },
    h: { required: false, default: 60, type: Number }
  },
  data() {
    return {
      baseSize: "",
      base: ""
    };
  },
  beforeMount() {
    this.baseSize = this.$store.state.baseSize_url;
    this.base = this.$store.state.base_url;
  }
};
</script>