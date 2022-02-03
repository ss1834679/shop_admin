<template>
  <!-- 首页入口图设置 -->
  <div id="entrySet">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">首页入口图设置</span>
      </div>

      <div class="add-content">
        <div v-for="(item,idx) in setImgForm" :key="item.id" :class="idx===nowStyle?'nowStyle listdiv':'listdiv'" @click="nowStyle=idx">{{item.title}}</div>
        <div style="margin:10px 0" v-if="setImgForm[nowStyle]&&setImgForm[nowStyle].img">
          <el-image
            :src="setImgForm[nowStyle].img.includes('http')?setImgForm[nowStyle].img:`${base}${setImgForm[nowStyle].img}`"
            :preview-src-list="[setImgForm[nowStyle].img.includes('http')?setImgForm[nowStyle].img:base+setImgForm[nowStyle].img]"
          ></el-image>
        </div>
        <div class="imgAndTitle" v-for="(item,idx) in setImgForm[nowStyle].specialOffersPlates" :key="item.id">
          <div class="listdiv">{{setImgForm[nowStyle].specialOffersPlates[idx].title}}</div>
          <upload-img
            v-if="showImg"
            @getimgArr="(imgarr)=>{setImgForm[nowStyle].specialOffersPlates[idx].img = imgarr}"
            :imgArr="setImgForm[nowStyle].specialOffersPlates[idx].img"
            :limit="1"
            :notMultiple="true"
          ></upload-img>
          <el-radio-group v-model="setImgForm[nowStyle].specialOffersPlates[idx].type" v-if="setImgForm[nowStyle].specialOffersPlates[idx].type!=0">
            <el-radio :label="1">拼团</el-radio>
            <el-radio :label="2">活动</el-radio>
          </el-radio-group>
        </div>

        <el-button type="primary" @click="submitForm()">提交</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import uploadImg from "../../components/uploadImg";
import { getSpecialOffers, updateSpeciaOffers } from "../../api/home";
export default {
  components: { uploadImg },
  data() {
    return {
      setImgForm: [
        {
          id: "1",
          specialOffersPlates: []
        }
      ],
      nowStyle: 0,
      base: "",
      showImg: true
    };
  },
  mounted() {
    this.base = this.$store.state.base_url;
    getSpecialOffers().then(data => {
      if (data.data.status == 200) {
        this.setImgForm = data.data.content;
        this.refreshImg();
      }
    });
  },
  methods: {
    submitForm() {
      let arr = [];
      this.setImgForm.forEach(item => {
        item.specialOffersPlates.forEach(i => {
          let obj = {
            id: i.id,
            img: i.img,
            type: i.type
          };
          arr.push(obj);
        });
      });
      updateSpeciaOffers(arr).then(data => {
        if (data.data.status == 200) {
          this.$router.go(0);
        }
      });
    },
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    }
  }
};
</script>
<style lang="less">
#entrySet {
  width: 100%;
  height: auto;

  .el-card {
    height: 100%;
    .el-card__body {
      margin-left: 100px;
    }
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
        .el-button {
          margin-right: 20px;
          height: 36px;
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .nowStyle {
    background: #ccc;
  }
  .imgAndTitle {
    margin: 10px 0;
  }
  .listdiv {
    display: inline-block;
    font-weight: 800;
    font-size: 18px;
    padding: 4px 8px;
  }
}
</style>