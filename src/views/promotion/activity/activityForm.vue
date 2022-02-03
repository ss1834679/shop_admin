<template>
  <!-- 用户表单 -->
  <div id="activityForm">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/promotion/voteactivity/voteActivityList' }">活动列表</el-breadcrumb-item>
          <el-breadcrumb-item
            :to="{name:'activiDetails',query:{id:$route.query.actId}}"
          >{{$route.params.routerTitle?$route.params.routerTitle:'用户表单'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="add-content">
        <el-form label-width="120px">
          <el-form-item v-for="it in activityFormList" :label="it.formTitle" :key="it.formTitle" :class="it.required?'is-required':''">
            <el-input v-if="it.type==1" v-model="it.value" :placeholder="it.placeholder" :maxlength="it.max?it.max:null"></el-input>
            <el-input v-if="it.type==2" v-model="it.value" type="textarea" :placeholder="it.placeholder" :maxlength="it.max?it.max:null"></el-input>
            <UploadImg
              v-if="it.type==3"
              :imgArr.sync="it.value"
              :limit="it.max?it.max:null"
              :notMultiple="it.max==1?true:null"
              :remindText="it.placeholder?it.placeholder:null"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import UploadImg from "../../../components/uploadImg";
import { getNewActivityUserRegisterById, updateNewActivityUserRegister } from "../../../api/promotion";
export default {
  components: { UploadImg },
  data() {
    return {
      activityFormList: [
        // { type: 1, formTitle: "姓名", required: true, max: 5, placeholder: "请输入姓名", value: "岳刘伟" },
        // { type: 2, formTitle: "年龄", required: false, max: 2, placeholder: "请输入年龄", value: "323" },
        // {
        //   type: 3,
        //   formTitle: "相片",
        //   required: true,
        //   max: 3,
        //   placeholder: "请上传头像",
        //   value: "5eeb08eeb92fa500013e8655,5eeb08eeb92fa500013e8655,5eeb08eeb92fa500013e8655,5eeb08eeb92fa500013e8655"
        // }
      ],
      showImg: true
    };
  },
  mounted() {
    if (this.$route.query.userId) {
      getNewActivityUserRegisterById(this.$route.query.userId).then(data => {
        if (data.data.status == 0) {
          this.activityFormList = JSON.parse(data.data.data.signFormAddContent);
        }
      });
    } else {
      this.$message.error("页面参数错误");
    }
  },
  methods: {
    submitForm() {
      new Promise((resolve, reject) => {
        let mistake = new Array();
        this.activityFormList.forEach(it => {
          if (it.required) {
            if (it.value == "" || it.value == null) {
              mistake.push(`${it.formTitle}不能为空`);
            }
          }
          if (it.max) {
            if (it.type == 3) {
              if (it.value && it.value.split(",").length > it.max) {
                mistake.push(`${it.formTitle}只能上传${it.max}张`);
              }
            } else {
              if (it.value && it.value.length > it.max) {
                mistake.push(`${it.formTitle}超过了长度限制`);
              }
            }
          }
        });
        mistake.length > 0 && reject(mistake);
        resolve();
      })
        .then(() => {
          const obj = {};
          obj.id = this.$route.query.userId;
          obj.signFormAddContent = JSON.stringify(this.activityFormList);
          updateNewActivityUserRegister(obj).then(data => {
            if (data.data.status == 0) {
              this.$router.go(-1);
              this.$message.success("修改用户表单成功");
            } else {
              this.$message.error(data.data.msg);
            }
          });
        })
        .catch(res => {
          res &&
            res.forEach((it, index) => {
              this.$message({
                type: "error",
                offset: 20 + 40 * index,
                message: it
              });
            });
        });
    }
  }
};
</script>
<style lang="less">
#activityForm {
  .el-card {
    .el-card__header {
      .clearfix {
        height: 100%;
        .el-breadcrumb {
          padding: 0;
          height: 100%;
          line-height: 50px;
          font-size: 16px;
          color: #02a7f0;
          background-color: #fff;
          .el-breadcrumb__item:last-child .el-breadcrumb__inner{
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>