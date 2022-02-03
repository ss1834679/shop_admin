<template>
  <div id="houseDesign_add">
    <!-- 添加案例-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title" v-if="$route.query.id">编辑案例</span>
        <span class="title" v-else>添加案例</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form :model="projectform" ref="projectform" :rules="projectRules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="案例标题" prop="title">
            <el-input type="textarea" v-model="projectform.title" maxlength="100" show-word-limit style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="案例封面图" prop="smallCoverPic" class="is-required" v-if="showImg">
            <upload-img
              @getimgArr="(imgarr)=>{this.projectform.smallCoverPic = imgarr}"
              :imgArr="this.projectform.smallCoverPic"
              :limit="1"
              :isFullUrl="true"
              :notMultiple="true"
            ></upload-img>
          </el-form-item>
          <el-form-item label="作者" prop="author" v-if="!designerVisible">
            <el-select v-model="projectform.author" placeholder="请选择作者" filterable clearable>
              <el-option v-for="item in designerList" :key="item.id" :label="item.NAME" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小区名称" prop="communityName">
            <el-select v-model="projectform.communityName" placeholder="请输入小区名搜索" filterable remote :remote-method="selectVillage" clearable>
              <el-option v-for="item in villageList" :key="item.id" :label="item.title" :value="item.title"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="户型图" prop="houseTypeImg" class="is-required" v-if="showImg">
            <upload-img
              @getimgArr="(imgarr)=>{this.projectform.houseTypeImg = imgarr}"
              :imgArr="this.projectform.houseTypeImg"
              :limit="1"
              :notMultiple="true"
              remindText="支持jpg、png，建议尺寸：390px*390px"
            ></upload-img>
          </el-form-item>
          <el-form-item label="面积" prop="srcArea">
            <el-input-number v-model="projectform.srcArea" :precision="2" :step="0.1" :min="0" :max="9999" :controls="false"></el-input-number>㎡
          </el-form-item>
          <el-form-item label="风格" prop="style">
            <el-select v-model="projectform.style" placeholder="请选择风格">
              <el-option v-for="item in houseStyleList" :key="item.id" :label="item.title" :value="item.title"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="户型" class="is-required" prop="specName">
            <el-select v-model="houseType.roomnum" placeholder="选择室数量">
              <el-option v-for="(item,index) in roomList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <el-select v-model="houseType.livingnum" placeholder="选择厅数量">
              <el-option v-for="(item,index) in livingList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <el-select v-model="houseType.tolietnum" placeholder="选择卫生间数量">
              <el-option v-for="(item,index) in tolietList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="3D图链接" prop="planUrl">
            <el-input v-model="projectform.planUrl" placeholder="请输入3D案例链接地址"></el-input>
          </el-form-item>
          <el-form-item label="显示状态">
            <el-radio-group v-model="projectform.isShow">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="projectform.sort" :controls="false" :min="0" placeholder="排序"></el-input-number>
          </el-form-item>
          <el-form-item label="正文" prop="description" v-if="showImg">
            <wang-editor :value="projectform.description" @getHtmlFromWang="(value)=>{this.projectform.description=value}"></wang-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('projectform')">下一步，导入报价</el-button>
            <el-button type="primary" @click="submitForm('projectform','skip')">跳过报价，直接提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllUsableDecorateStyle } from "../../api/setings";
import { getAllVillageByPage, addQuote, editQuote, getAllDesignerInfo, getQuoteById } from "../../api/promanage";
import uploadImg from "../../components/uploadImg";
import wangEditor from "../../components/wangEditor";
import { mapGetters } from "vuex";
export default {
  components: { uploadImg, wangEditor },
  data() {
    return {
      showImg: true /*是否回显图片 */,
      villageList: [] /* 小区列表 */,
      designerList: [] /* 作者（设计师）列表 */,
      roomList: ["1室", "2室", "3室", "4室", "5室", "6室", "7室", "8室", "9室", "10室"],
      livingList: ["0厅", "1厅", "2厅", "3厅", "4厅", "5厅", "6厅", "7厅", "8厅", "9厅", "10厅"],
      tolietList: ["0卫", "1卫", "2卫", "3卫", "4卫", "5卫", "6卫", "7卫", "8卫", "9卫", "10卫"],
      houseType: {
        roomnum: "",
        livingnum: "",
        tolietnum: ""
      },
      houseStyleList: [] /* 风格列表 */,
      isqouta: false /* 是否报价 */,
      projectform: {
        title: "" /* 案例标题 */,
        author: "" /* 作者 */,
        smallCoverPic: "" /* 封面图 */,
        communityName: "" /* 小区名字 */,
        houseTypeImg: "" /* 户型图 */,
        srcArea: undefined /* 面积 */,
        style: "" /* 风格值字符串 */,
        specName: "" /* 户型字符串 */,
        planUrl: "" /* 3D链接 https://720.tbzj.net/ */,
        isShow: 1 /* 是否显示 */,
        description: "" /* 正文 */,
        sort: 0 /* 排序 */
      },
      projectRules: {
        title: [{ required: true, message: "请填写案例标题", trigger: "blur" }],
        smallCoverPic: [{ required: true, message: "请上传封面图", trigger: "blur" }],
        communityName: [{ required: true, message: "请选择小区", trigger: "blur" }],
        houseTypeImg: [{ required: true, message: "请上传户型图", trigger: "blur" }],
        style: [{ required: true, message: "请选择风格", trigger: "blur" }],
        specName: [{ required: true, message: "请选择户型", trigger: "blur" }],
        srcArea: [{ required: true, message: "请填写面积", trigger: "blur" }],
        planUrl: [{ required: true, message: "请填写3d链接", trigger: "blur" }]
      }
    };
  },
  watch: {
    houseType: {
      handler() {
        let type = "";
        if (this.houseType.roomnum != "") {
          for (let item in this.houseType) {
            if (this.houseType[item] == "" || this.houseType[item] == "0厅" || this.houseType[item] == "0卫") {
              type = type + "";
            } else {
              type = type + this.houseType[item];
            }
          }
        }
        this.projectform.specName = type;
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      designerVisible: "onGetIsDesigner"
    })
  },
  mounted() {
    if (this.$route.query.id) {
      getQuoteById(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          this.projectform = data.data.data;
          this.splitSpecName(this.projectform.specName);
          this.refreshImg();
        }
      });
    }
    /* 获取选择风格列表 */
    getAllUsableDecorateStyle().then(data => {
      this.houseStyleList = data.data.data;
    });
    /* 获取所有设计师基本信息列表 */
    getAllDesignerInfo().then(data => {
      if (data.data.status == 200) {
        this.designerList = data.data.content;
      }
    });
  },
  methods: {
    addquota() {
      this.$router.push({ name: "importalterquota" });
    },
    viewquota() {
      this.$router.push({ name: "importalterquota", query: { id: this.projectform.id } });
    },
    splitSpecName(string) {
      let room = string.indexOf("室");
      let living = string.indexOf("厅");
      let toliet = string.indexOf("卫");
      this.houseType.roomnum = string.substring(0, room + 1);
      if (living != -1) {
        this.houseType.livingnum = string.substring(room + 1, living + 1);
        if (toliet != -1) {
          this.houseType.tolietnum = string.substring(living + 1, toliet + 1);
        } else {
          this.houseType.tolietnum = "0卫";
        }
      } else {
        this.houseType.livingnum = "0厅";
        if (toliet != -1) {
          this.houseType.tolietnum = string.substring(room + 1, toliet + 1);
        } else {
          this.houseType.tolietnum = "0卫";
        }
      }
    },
    // 刷新图片
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    selectVillage(val) {
      if (val != "") {
        getAllVillageByPage({ pageNo: 1, pageSize: 20, title: val }).then(data => {
          if (data.data.status == 0) {
            this.villageList = data.data.data.list;
          }
        });
      }
    },
    /* 提交 */
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          new Promise((resolve, reject) => {
            if (this.projectform.planUrl == "") {
              reject("请填写3d图链接");
            }
            resolve();
          })
            .then(() => {
              if (
                this.projectform.planUrl &&
                this.projectform.planUrl.indexOf("/tiao?url=") == -1 &&
                this.projectform.planUrl.indexOf("https://720.tbzj.net") == -1 &&
                this.projectform.planUrl != ""
              ) {
                this.projectform.planUrl = "https://720.tbzj.net/tiao?url=" + this.projectform.planUrl;
              }
              if (this.$route.query.id) {
                editQuote(this.projectform).then(data => {
                  if (data.data.status == 0) {
                    !type && this.$router.push({ name: "importalterquota", query: { id: this.$route.query.id } });
                    type && this.$router.push({ name: "proList" });
                  } else {
                    this.$message.error(data.data.msg);
                  }
                });
              } else {
                addQuote(this.projectform).then(data => {
                  if (data.data.status == 0) {
                    if (data.data.data) {
                      !type && this.$router.push({ name: "importalterquota", query: { id: data.data.data } });
                      type && this.$router.push({ name: "proList" });
                    }
                  } else {
                    this.$message.error(data.data.msg);
                  }
                });
              }
            })
            .catch(msg => {
              this.$message.warning(msg);
            });
        }
      });
    },
    go() {
      this.$router.push({ name: "importalterquota", query: { id: "14" } });
    }
  }
};
</script>

<style lang='less'>
#houseDesign_add {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      padding: 0;
      .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
  }
}
</style>
