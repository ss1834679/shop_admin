<template>
  <div id="uploadImg">
    <!-- 图片上传组件 -->
    <!-- action 为上传地址 -->
    <el-upload
      :file-list="fileList"
      :multiple="(notMultiple!=null?false:true)"
      list-type="picture-card"
      ref="upload"
      :action="upload_url"
      :http-request="handleUpload"
      accept="*/*"
      name="file"
      :on-preview="handlePictureCardPreview"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :on-remove="removePicture"
      :limit="(limit!=null?limit:0)"
      :class="{hide:hideUpload}"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <template v-if="size!=null">
      <p>{{`宽高最小为 ${this.size.width}px*${this.size.height}px`}}</p>
      <p>{{`宽高比例为 ${this.size.width}*${this.size.height}`}}</p>
    </template>
    <template v-if="remindText">
      <p style="color:#AAAAAA">{{remindText}}</p>
    </template>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import { uploadFileOss } from "../api/fileSever";
// import imageConversion from "image-conversion"; /* 图片压缩的包 */

export default {
  name: "uploadImgArr",
  props: {
    imgArr: { required: true } /* 图片传入的字符串 */,
    limit: { required: false } /* 传入则有上传限制，不传则没有限制 */,
    notMultiple: { required: false } /* 传入则不可多选 */,
    remindText: { required: false } /* 提示信息，不传没有 */,
    size: { required: false } /* 图片上传的宽高限制 */,
    isFullUrl: { required: false, type: Boolean, default: false } /* 是否为完整连接 */,
    path: { required: false, type: String } /* 自定义路径 可不传 */
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
      hideUpload: false /* 上传数量限制 */,
      base_url: "" /* 获取到仓库的base_url */,
      upload_url: "" /* 上传地址 */,
      errorSubmit: false /* 是否是上传错误的判断 */
    };
  },
  watch: {
    // imgArr() {
    //   this.showImg(this.imgArr);
    // },
    fileList() {
      this.hideUpload = this.fileList.length >= this.limit;
    }
  },
  mounted() {
    this.upload_url = this.$store.state.upload_url;
    this.base_url = this.$store.state.base_url;
    this.showImg(this.imgArr);
  },
  methods: {
    beforeUpload(file) {
      /* 在上传之前对图片进行压缩 */
      return new Promise((resolve, reject) => {
        if (file.size / 1024 > 500) {
          this.$message.error("图片大小不能超过500Kb");
          this.errorSubmit = true;
          reject();
        }
        /* 限制图片上传的宽高 */
        if (this.size != null) {
          let width = this.size.width;
          let height = this.size.height;
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.src = _URL.createObjectURL(file);
          img.onload = () => {
            /* 查看图片 */
            // console.log(img.width, width, 1);
            // console.log(img.height, height, 2);
            // console.log(img.width / img.height, width / height, 3);
            /* 上传的图片宽高是不是比规定的宽高大 并且长宽比例一致 */
            let valid = img.width >= width && img.height >= height && img.width / img.height == width / height;
            if (valid) {
              if (file.type.split("/")[0] == "image") {
                /* 上传图片压缩 */
                // if (file.size / 1024 > 400) {
                //   imageConversion.compressAccurately(file, 360).then(res => {
                //     resolve(res);
                //   });
                // } else if (file.size / 1024 > 150) {
                //   imageConversion.compress(file, 0.99).then(res => {
                //     resolve(res);
                //   });
                // } else {
                resolve(file);
                // }
              }
            } else {
              this.$message({
                showClose: true,
                message: `上传的图片最小尺寸为${this.size.width}*${this.size.height}  且宽高比例一致`,
                type: "error",
                duration: 5000
              });
              this.errorSubmit = true;
              reject();
            }
          };
        } else {
          resolve(file);
        }
        // if (file.type.split("/")[0] == "video") {
      });
    },
    showImg(imgArr) {
      if (imgArr.length > 0) {
        this.fileList = imgArr.map(item => {
          /* 这里是返回给这个element 组件的固定格式，item这里先设置为完整网址 */
          return {
            status: "success" /* 这个值是这个图片是否上传的标志 */,
            url: item.includes("http") ? item : this.base_url + item,
            response: {
              state: "Success",
              content: [{ name: item, url: item }]
            }
          };
        });
      }
    },
    /* 图片预览 */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleError(response) {
      console.log(response);
    },
    /* 将图片的数组传递出子组件 */
    sendImgArr() {
      const imgArr = this.fileList.map(item => {
        return item.response.content[0].url;
      });
      this.$emit("update:imgArr", imgArr);
      this.$emit("getimgArr", imgArr);
    },
    /* 移除图片 */
    removePicture(file, fileList) {
      if (this.errorSubmit) {
        this.errorSubmit = false;
      } else {
        this.$message({
          type: "success",
          message: "图片删除成功！",
          center: true
        });
        this.fileList = fileList;
        this.sendImgArr();
      }
      /* 长度限制 */
      this.hideUpload = fileList.length >= this.limit;
    },
    handleUpload(file) {
      uploadFileOss(file.file, this.path).then(data => {
        if (data.data.state == "Success") {
          file.onSuccess(data.data);
        } else {
          file.onError(data.data.content);
        }
      });
    },
    handleSuccess(res, file, fileList) {
      if (file.status == "success") {
        if (file.response.state == "Success") {
          this.$message.success("图片上传成功！");
        } else {
          this.$message.error("上传出错了！");
        }
        /* 这个是确保是上传成功的最后一次情况，这样就不会报错 */
        if (
          this.$refs.upload.uploadFiles.filter(i => {
            return i.status !== "success";
          }).length === 0
        ) {
          this.fileList = fileList.filter(item => {
            return item.response.state == "Success";
          });
          this.sendImgArr();
        }
      } else if (file.status == "fail") {
        this.$message.error("图片上传失败");
      }
      /* 限制长度隐藏 */
      this.hideUpload = fileList.length >= this.limit;
    }
  }
};
</script>

<style lang="less">
#uploadImg {
  p {
    margin: 0;
    line-height: 20px;
  }
  .hide .el-upload--picture-card {
    display: none;
  }
  .remind {
    margin-left: 10px;
  }
}
</style>