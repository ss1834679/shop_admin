<template>
  <!-- 富文本编辑器组件 -->
  <div id="wangeditor">
    <div id="editorElem" ref="editor" style="text-align:left"></div>
  </div>
</template>
<script>
import E from "wangeditor";
// import imageConversion from "image-conversion"; /* 图片压缩的包 */
export default {
  name: "editor",
  props: {
    value: { required: false }
  },
  data() {
    return {
      editor: "",
      editorContent: "",
      upload_url: "",
      isChange: false
    };
  },
  watch: {
    value: {
      handler() {
        if (!this.isChange) {
          this.editor.txt.html(this.value);
        }
        this.isChange = false;
      }
    }
  },
  mounted() {
    this.upload_url = this.$store.state.upload_url;
    this.editor = new E(this.$refs.editor);
    // this.editor.customConfig.uploadImgShowBase64 = true; /* 图片以base64形式保存 */
    this.editor.customConfig.uploadImgTimeout = 100000000; /* 图片上传超时 */
    this.editor.customConfig.uploadImgServer = this.upload_url;
    this.editor.customConfig.uploadFileName = "file";
    this.editor.customConfig.uploadImgHooks = {
      // before: function(xhr, editor, files) {
      // 图片上传之前触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
      // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
      // return {
      //     prevent: true,
      //     msg: '放弃上传'
      // }
      // if (xhr.readyState == 4) {
      //   console.log(xhr, editor);
      // }
      // let fileList = new Array(files.length);
      /* 图片压缩 也不知道现在有没有用 */
      // files.forEach((item, index) => {
      //   if (item.size / 1024 > 400) {
      //     imageConversion.compressAccurately(item, 300).then(res => {
      //       fileList[index] = res;
      //     });
      //   } else {
      //     imageConversion.compress(item, 0.99).then(res => {
      //       fileList[index] = res;
      //     });
      //   }
      // });
      // files = fileList;
      // },
      // success: function(xhr, editor, result) {
      // 图片上传并返回结果，图片插入成功之后触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      // },
      // fail: function(xhr, editor, result) {
      // 图片上传并返回结果，但图片插入错误时触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      // },
      // error: function(xhr, editor) {
      // 图片上传出错时触发
      // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      // },
      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: (insertImg, result) => {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
        result.content.forEach((item, index, arr) => {
          let url = item.url;
          insertImg(url);
          if (index == arr.length - 1) {
            this.$message({
              type: "success",
              message: `上传${result.content.length}张图片成功`
            });
          }
        });
      }
    };
    this.editor.customConfig.customAlert = info => {
      // info 是需要提示的内容
      this.$message({
        showClose: true,
        message: info,
        type: "error"
      });
    };
    this.editor.customConfig.onchange = html => {
      /* 获取富文本内容 */
      this.editorContent = html;
      this.isChange = true;
      if (html == "<p><br></p>") {
        this.$emit("getHtmlFromWang", "");
        this.$emit("update:value", "");
      } else {
        this.$emit("getHtmlFromWang", html);
        this.$emit("update:value", html);
      }
    };
    this.editor.customConfig.pasteTextHandle = content => {
      /* 支持粘贴 */
      return content;
    };
    this.editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "video", // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    this.editor.customConfig.zIndex = 100;
    this.editor.create();
    this.editor.txt.html(this.value);
  }
};
</script>
<style lang="less">
#wangeditor {
  line-height: normal;
}
#editorElem .w-e-text-container {
  //设置富文本高度，富文本有个默认300px的高度
  height: 450px !important;
}
</style>
