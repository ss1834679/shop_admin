<template>
  <div id="houseDesign_add">
    <!-- 添加方案-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">添加方案</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form :model="projectform" ref="projectform" :rules="projectRules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="方案标题" prop="name">
            <el-input v-model="projectform.name" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="方案封面图" prop="bigimg" class="is-required" v-if="showImg">
            <upload-img @getimgArr="(imgarr)=>{this.projectform.bigimg = imgarr}" :imgArr="this.projectform.bigimg" :limit="1" :notMultiple="true"></upload-img>
          </el-form-item>
          <el-form-item label="小区名称" prop="villageId">
            <el-select v-model="projectform.villageId" placeholder="请选择小区">
              <el-option v-for="item in villageList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="户型图" prop="houseimg" class="is-required" v-if="showImg">
            <upload-img
              @getimgArr="(imgarr)=>{this.projectform.houseimg = imgarr}"
              :imgArr="this.projectform.houseimg"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
          </el-form-item>
          <el-form-item label="面积" prop="area">
            <el-input-number v-model="projectform.area" :precision="2" :step="0.1" :min="0" :controls="false"></el-input-number>㎡
          </el-form-item>
          <el-form-item label="风格" prop="houseStyleId">
            <el-select v-model="projectform.houseStyleId" placeholder="请选择风格">
              <el-option v-for="item in houseStyleList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="户型" class="is-required">
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
          <el-form-item label="3D图链接" prop="threedLink">
            <el-input v-model="projectform.threedLink"></el-input>
          </el-form-item>
          <el-form-item label="显示状态">
            <el-radio-group v-model="projectform.isDisplay">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="报价" prop="quotation">
            <el-button v-if="isquota" size="small" @click="viewquota()">查看报价</el-button>
            <el-button v-else size="small" @click="addquota()">添加报价</el-button>
          </el-form-item>
          <el-form-item label="正文" prop="zhengwen" v-if="showImg">
            <wang-editor :value="projectform.zhengwen" @getHtmlFromWang="(value)=>{this.projectform.zhengwen=value}"></wang-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('projectform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllUsableDecorateStyle } from "../../api/setings";
import { addHouseDetail, getHouseDetailById } from "../../api/house";
import uploadImg from "../../components/uploadImg";
import wangEditor from "../../components/wangEditor";
export default {
  components: { uploadImg, wangEditor },
  data() {
    return {
      showImg: true /*是否回显图片 */,
      villageList: [] /* 小区列表 */,
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
        name: "" /* 方案标题 */,
        bigimg: "" /* 封面图 */,
        villageId: "" /* 小区 */,
        houseimg: "" /* 户型图 */,
        area: undefined /* 面积 */,
        houseStyleId: "" /* 风格id */,
        houseTypeId: "" /* 户型字符串 */,
        threedLink: "https://720.tbzj.net/" /* 3D链接 */,
        isDisplay: 1 /* 是否显示 */,
        zhengwen: "" /* 正文 */
      },
      projectRules: {
        name: [{ required: true, message: "请填写方案标题", trigger: "blur" }],
        bigimg: [{ required: true, message: "请上传封面图", trigger: "blur" }],
        villageId: [{ required: true, message: "请选择小区", trigger: "blur" }],
        houseimg: [{ required: true, message: "请上传户型图", trigger: "blur" }],
        houseStyleId: [{ required: true, message: "请选择风格", trigger: "blur" }],
        houseTypeId: [{ required: true, message: "请选择户型", trigger: "blur" }],
        area: [{ required: true, message: "请填写面积", trigger: "blur" }],
        threedLink: [{ required: true, message: "请填写3d链接", trigger: "blur" }]
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
        } else {
          type = "";
        }
        this.projectform.houseTypeId = type;
      },
      deep: true
    }
  },
  mounted() {
    if (this.$route.query.id) {
      getHouseDetailById({ id: this.$route.query.id }).then(data => {
        this.projectform = data.data.data;
        this.refreshImg();
      });
    }
    /* 获取选择风格列表 */
    getAllUsableDecorateStyle().then(data => {
      this.houseStyleList = data.data.data;
    });
  },
  methods: {
    addquota() {
      this.$router.push({ name: "importalterquota" });
    },
    viewquota() {
      this.$router.push({ name: "importalterquota", query: { id: this.projectform.id } });
    },
    // 刷新图片
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    /* 提交 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          new Promise((resolve, reject) => {
            if (this.projectform.threedLink == "https://720.tbzj.net/") {
              reject("请填写3d图链接");
            }
            resolve();
          })
            .then(() => {
              addHouseDetail(this.projectform).then(data => {
                if (data.data.status == 0) {
                  this.$message({ type: "success", message: data.data.msg });
                  this.$router.go(-1);
                } else {
                  this.$message.error(data.data.msg);
                }
              });
            })
            .catch(msg => {
              this.$message.warning(msg);
            });
        }
      });
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
