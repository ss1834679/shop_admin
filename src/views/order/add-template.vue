<template>
  <div id="add-template">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">添加模板</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>
      <div class="template-content">
        <div class="content-top">
          <div class="order-name" style="width:20%">
            <div>单据名称</div>
            <div>
              <el-input v-model="orderNameInput" placeholder="请输入单据名称"></el-input>
            </div>
          </div>
          <div class="order-name" style="width:25%">
            <div>单据尺寸</div>
            <div style="display:flex;align-items: center;">
              <div style="display:flex;align-items: center;">
                <span>宽:</span>
                <el-input v-model="sizeiInput" placeholder="228" style="width:80%">
                  <template slot="append">MM</template>
                </el-input>
              </div>
              <div style="display:flex;align-items: center;">
                <span>高:</span>
                <el-input v-model="sizeiInput2" placeholder="227" style="width:80%">
                  <template slot="append">MM</template>
                </el-input>
              </div>
            </div>
          </div>
          <div class="order-name" style="width:20%">
            <div>单据背景图</div>
            <div style="display:flex;align-items: center;">
              <el-button type="text" @click="onPickFile">上传</el-button>
              <el-button type="text" @click="deleteClick">删除</el-button>
            </div>
          </div>
          <div class="order-name" style="width:20%">
            <div>单据打印项</div>
            <div>
              <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="order-name" style="width:15%">
            <div>操作</div>
            <el-button size="mini" @click="onUpload">保存</el-button>
          </div>
        </div>
        <div class="te-contents">
          <input type="file" ref="fileInput" accept="image/*" @change="getFile" style="display: none" />
          <img :src="imageUrl" :width="sizeiInput" :height="sizeiInput2" />
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: "", //img绑定的src地址
      postUrl: "", //需要上传到的地址
      orderNameInput: "",
      order_sn: "",
      order_size: "",
      order_image: "",
      pint_order: "",
      type: "",
      sizeiInput: "",
      sizeiInput2: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: ""
      // templateList:[
      //     {
      //         order_sn:'1111111',
      //         order_size:'1',
      //         order_image:'ddddd'
      //     }
      // ]
    };
  },
  mounted() {},
  watch: {
    sizeiInput2() {
      this.sizeiInput2 = this.sizeiInput2;
    },
    sizeiInput() {
      this.sizeiInput = this.sizeiInput;
    },
    orderNameInput() {
      this.orderNameInput = this.orderNameInput;
    }
  },
  methods: {
    // 保存
    onUpload(event) {
      event.preventDefault();
      let fd = new FormData();
      fd.append("file", this.image); //把image添加进去
    },
    // 获取上传的图片
    getFile(event) {
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return console.log("Please add a valid image!"); //判断图片是否有效
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.image = files[0];
      //到这里后, 选择图片就可以显示出来了
    },
    // 上传图片选择图片
    onPickFile() {
      this.$refs.fileInput.click();
    },
    // 删除图片
    deleteClick() {
      this.imageUrl = "";
    }
  }
};
</script>
<style lang="less" scoped>
#add-template {
  padding: 20px;
  .clearfix {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .template-content {
    width: 100%;
    min-height: 600px;
    border: 1px solid #f2f2f2;
    .content-top {
      display: flex;
      height: 100px;
      border-bottom: 1px solid #f2f2f2;
      .order-name {
        display: flex;
        flex-direction: column;
        height: 100px;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #f2f2f2;
        div {
          height: 35px;
        }
      }
    }
  }
}
</style>