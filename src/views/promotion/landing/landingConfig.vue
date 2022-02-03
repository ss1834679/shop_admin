<template>
  <!-- 落地页配置 -->
  <div id="landingConfig">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>页面配置</span>
      </div>

      <div class="add-content">
        <el-form :model="pageSetForm" ref="pageSetForm" :rules="pageSetRules" label-width="120px">
          <el-form-item label="页面标题" prop="title">
            <el-input v-model="pageSetForm.title"></el-input>
          </el-form-item>
          <el-form-item label="背景海报" v-if="showImg" prop="activityImg">
            <UploadImg
              :imgArr.sync="pageSetForm.activityImg"
              :limit="1"
              :notMultiple="true"
              remindText="支持jpg、png、gif ，限制大小500kb 、推荐尺寸：宽度750px，高度不限"
            />
          </el-form-item>
          <el-form-item label="活动" v-if="showImg" prop="activity">
            <el-table :data="pageSetForm.detailVOList" border style="width: 500px">
              <el-table-column align="center" label="活动按钮图片" width="100" class-name="uploadimg">
                <template slot-scope="scope">
                  <UploadImg :imgArr.sync="scope.row.entranceImg" :limit="1" :notMultiple="true" />
                </template>
              </el-table-column>
              <el-table-column align="center" prop="activity" label="关联活动">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.activityId" filterable placeholder="请选择活动(可搜索)" clearable>
                    <el-option v-for="item in actList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                  <SwitchCom
                    :boolen="scope.row.activityStatus"
                    activeText="启用"
                    inactiveText="禁用"
                    @changeBoolen="(event)=>{scope.row.activityStatus=event?1:0}"
                  />
                </template>
              </el-table-column>
            </el-table>
            <p class="mind">活动入口图片支持jpg、png、gif ，限制大小500kb，推荐尺寸：286px*120px</p>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('pageSetForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import UploadImg from "../../../components/uploadImg";
import SwitchCom from "../../../components/switch";
import { getLandingEntranceConfig, getNewActivityByTitle, addOrUpDateLandingEntrance } from "../../../api/promotion";
export default {
  components: { UploadImg, SwitchCom },
  data() {
    return {
      pageSetForm: {
        activityImg: "" /* 背景海报 */,
        title: "活动" /* 页面标题 */,
        detailVOList: [
          { entranceImg: "", activityId: "", activityStatus: true },
          { entranceImg: "", activityId: "", activityStatus: true }
        ]
      },
      showImg: true,
      actList: [] /* 活动搜索列表 */,
      pageSetRules: {
        activityImg: [{ required: true, message: "请上传背景海报", trigger: "blur" }],
        title: [
          { required: true, message: "请填写页面标题", trigger: "blur" },
          { max: 10, message: "页面标题不可以超过10个字", trigger: "blur" }
        ],
        activity: [{ required: true, validator: this.checkActivity, trigger: "blur" }]
      }
    };
  },
  mounted() {
    getLandingEntranceConfig().then(data => {
      if (data.data.status == 0) {
        this.pageSetForm = data.data.data;
        this.refreshImg();
      }
    });
    getNewActivityByTitle().then(data => {
      if (data.data.status == 0) {
        this.actList = data.data.data;
      }
    });
  },
  methods: {
    checkActivity(rule, value, callback) {
      let isRepeat = false;
      let isNull = false;
      if (this.pageSetForm.detailVOList) {
        for (let i = 0; i < this.pageSetForm.detailVOList.length; i++) {
          for (let j = i + 1; j < this.pageSetForm.detailVOList.length; j++) {
            if (
              this.pageSetForm.detailVOList[i].activityId == this.pageSetForm.detailVOList[j].activityId &&
              this.pageSetForm.detailVOList[i].activityId != "" &&
              this.pageSetForm.detailVOList[j].activityId != ""
            ) {
              isRepeat = true;
              break;
            }
          }
          if (
            this.pageSetForm.detailVOList[i].activityStatus == 1 &&
            (this.pageSetForm.detailVOList[i].entranceImg == "" || this.pageSetForm.detailVOList[i].activityId == "")
          ) {
            isNull = true;
            break;
          }
        }
      }
      if (isRepeat) {
        callback(new Error("两个活动不能一样"));
      } else if (isNull) {
        callback(new Error("启用的活动图片或者选择的活动不能为空"));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addOrUpDateLandingEntrance(this.pageSetForm).then(data => {
            if (data.data.status == 0) {
              this.$message.success("修改落地页配置成功");
            } else {
              this.$message.error(data.data.msg);
            }
          });
        } else {
          this.$message.error("请检查是否填完所有参数");
          return false;
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
#landingConfig {
  .el-card .el-card__header {
    background: #f2f2f2 !important;
    height: 50px;
  }
  .el-form-item {
    .el-table {
      .uploadimg {
        .el-upload-list--picture-card .el-upload-list__item {
          /* 图片上传的样式 */
          width: 80px;
          height: 80px;
        }
        .el-upload--picture-card {
          width: 80px;
          height: 80px;
          line-height: 86px;
        }
      }
    }
  }
  .mind {
    margin: 0;
    padding: 0;
    line-height: normal;
    color: #999999;
  }
}
</style>