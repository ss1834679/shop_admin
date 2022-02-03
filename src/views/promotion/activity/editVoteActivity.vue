<template>
  <div id="editVoteActivity">
    <!-- 编辑活动-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title" v-if="$route.query.id">编辑活动</span>
          <span class="title" v-else>添加活动</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="activityForm" ref="activityForm" :rules="activityRules" label-width="100px">
          <el-form-item label="活动名称" prop="title">
            <el-input v-model.trim="activityForm.title" placeholder="请输入活动名称" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="活动时间" prop="activiTime">
            <el-date-picker
              v-model="selectTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
              :disabled="disable"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="活动头图" prop="headImg">
            <UploadImg
              v-if="showImg"
              :imgArr.sync="activityForm.headImg"
              remindText="支持jpg、png、gif ，限制大小500kb，推荐尺寸：750px*380px"
              :limit="1"
              :notMultiple="true"
            />
          </el-form-item>
          <el-form-item label="活动背景图" prop="backgroundImg">
            <UploadImg
              v-if="showImg"
              :imgArr.sync="activityForm.backgroundImg"
              @getimgArr="(imgarr)=>{this.activityForm.backgroundImg = imgarr}"
              remindText="支持jpg、png、gif ，限制大小500kb，推荐尺寸：宽度750px，高度不限"
              :limit="1"
              :notMultiple="true"
            />
          </el-form-item>
          <el-form-item label="排行榜" prop="displayStatus">
            <el-radio-group v-model="activityForm.displayStatus">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="报名表单" class="is-required" prop="signForm">
            <el-table :data="formList" border style="width: 100%">
              <el-table-column align="center" prop="formTitle" label="*字段名称">
                <template slot-scope="scope">
                  <span v-if="disable">{{scope.row.formTitle}}</span>
                  <el-input v-model.trim="scope.row.formTitle" v-else :maxlength="6" placeholder="请输入字段名称（必填）"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="type" label="组件类型">
                <template slot-scope="scope">
                  <div v-if="scope.$index==0||disable">
                    <span v-if="scope.row.type==1">单行文本</span>
                    <span v-if="scope.row.type==2">多行文本</span>
                    <span v-if="scope.row.type==3">图片</span>
                  </div>
                  <el-select v-else v-model="scope.row.type" @change="changeMax(scope.row)">
                    <el-option v-for="it in typeList" :key="it.value" :label="it.title" :value="it.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="max" label="长度或数量限制">
                <template slot-scope="scope">
                  <span v-if="disable">{{scope.row.max}}</span>
                  <el-input-number v-else v-model="scope.row.max" :max="scope.row.type==3?5:999" :min="1" :controls="false"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="required" label="是否必填">
                <template slot-scope="scope">
                  <span v-if="scope.$index==0||disable">{{scope.row.required?'必填':'选填'}}</span>
                  <el-select v-else v-model="scope.row.required">
                    <el-option label="必填" :value="true"></el-option>
                    <el-option label="选填" :value="false"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="placeholder" label="提示文案">
                <template slot-scope="scope">
                  <span v-if="disable">{{scope.row.placeholder}}</span>
                  <el-input v-else v-model.trim="scope.row.placeholder" :disabled="scope.row.type==3" :maxlength="15" placeholder="请输入提示文案（选填）"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" v-if="scope.$index!=0" @click="handleDeleteRow(scope.$index)" :disabled="disable">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="success" @click="handleAddFormKey()" :disabled="formList.length>=10||disable" icon="el-icon-plus">增加字段</el-button>
          </el-form-item>
          <el-form-item label="投票限制" prop="limit" class="limit">
            <div class="limitItem">
              <div>
                <span>每个用户可投</span>
                <el-input-number v-model="activityForm.perUser" :disabled="disable" :min="0" :controls="false"></el-input-number>
                <span class="piao">票</span>
              </div>
              <span class="remind">默认为0，表示不限制</span>
            </div>
            <div class="limitItem">
              <div>
                <span>可为同一用户</span>
                <el-input-number v-model="activityForm.sameUser" :disabled="disable" :min="0" :controls="false"></el-input-number>
                <span class="piao">票</span>
              </div>
              <span class="remind">默认为1，输入0表示不限制</span>
            </div>
            <div class="limitItem">
              <div>
                <span>每人每天可投</span>
                <el-input-number v-model="activityForm.perPersonPerDay" :disabled="disable" :min="0" :controls="false"></el-input-number>
                <span class="piao">票</span>
              </div>
              <span class="remind">默认为0，表示不限制</span>
            </div>
          </el-form-item>
          <el-form-item label="活动规则" prop="rule">
            <WangEditor :value.sync="activityForm.rule" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('activityForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import UploadImg from "../../../components/uploadImg";
import WangEditor from "../../../components/wangEditor";
import { editNewActivity, getNewActivityById } from "../../../api/promotion";
export default {
  components: { UploadImg, WangEditor },
  data() {
    return {
      selectTime: [],
      showImg: true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date(new Date().toDateString());
        }
      },
      activityForm: {
        title: "" /* 活动名称 */,
        endTime: "" /* 结束时间 */,
        startTime: "" /* 开始时间 */,
        headImg: "" /* 活动头图 */,
        backgroundImg: "" /* 活动背景图 */,
        displayStatus: 1 /* 排行榜 0 不显示;1 显示 */,
        signForm: "" /* 报名表单 json 字符串 */,
        perUser: 0 /* 每个用户可投 */,
        sameUser: 1 /* 可为同一用户 */,
        perPersonPerDay: 0 /* 每人每天可投 */,
        rule: "" /* 活动规则 */
      },
      defaultKey: {
        type: 1 /* 字段类型 */,
        formTitle: "" /* 字段名称 */,
        required: true /* 是否必填 true:必填 false:选填 */,
        max: 20 /* 当前字段的长度 图片为限制张数 文字为字符长度 */,
        placeholder: "" /* 提示文字 */,
        value: "" /* 用户传到后台的值 */
      },
      formList: [
        {
          type: 1 /* 字段类型 */,
          formTitle: "" /* 字段名称 */,
          required: true /* 是否必填 true:必填 false:选填 */,
          max: 20 /* 当前字段的长度 图片为限制张数 文字为字符长度 */,
          placeholder: "" /* 提示文字 */,
          value: "" /* 用户传到后台的值 */
        }
      ],
      typeList: [
        { title: "单行文本", value: 1, defaultMax: 20 },
        { title: "多行文本", value: 2, defaultMax: 140 },
        { title: "图片", value: 3, defaultMax: 1 }
      ],
      activityRules: {}
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getNewActivityById(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          this.activityForm = data.data.data;
          this.$set(this.selectTime, 0, this.activityForm.startTime);
          this.$set(this.selectTime, 1, this.activityForm.endTime);
          this.formList = JSON.parse(this.activityForm.signForm);
          this.refreshImg();
        }
      });
    } else {
      this.$set(this.selectTime, 0, new Date().format("yyyy-MM-dd hh:mm:ss"));
      this.$set(
        this.selectTime,
        1,
        new Date(new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 15)).format("yyyy-MM-dd hh:mm:ss")
      );
    }
  },
  created() {
    this.activityRules = {
      title: [
        { required: true, message: "请输入活动名称", trigger: "blur" },
        { min: 0, max: 20, message: "活动名称不能大于20个字", trigger: "blur" }
      ],
      activiTime: [{ required: true, validator: this.checkTime, trigger: "blur" }],
      headImg: [{ required: true, message: "请上传活动头图", trigger: "blur" }],
      backgroundImg: [{ required: true, message: "请上传活动背景图", trigger: "blur" }],
      signForm: [{ required: true, validator: this.checkSignForm, trigger: "blur" }],
      limit: [{ required: true, validator: this.checkLimit, trigger: "blur" }],
      rule: [{ required: true, message: "请设置活动规则", trigger: "blur" }]
    };
  },
  computed: {
    disable() {
      if (this.activityForm.startTime) {
        if (new Date(this.activityForm.startTime) < new Date()) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  methods: {
    checkTime(rule, value, callback) {
      if (this.$route.query.id && new Date(this.selectTime[0]) < new Date()) {
        callback();
      } else {
        if (this.selectTime === null || this.selectTime.length == 0) {
          callback(new Error("请选择活动时间"));
        } else if (new Date(this.selectTime[0]) < new Date(new Date().toDateString())) {
          callback(new Error("开始时间不能选择当天之前"));
        } else if (new Date(this.selectTime[0]).toDateString() === new Date(this.selectTime[1]).toDateString()) {
          callback(new Error("结束时间不能小于等于开始时间同一天"));
        } else {
          callback();
        }
      }
    },
    checkSignForm(rule, value, callback) {
      let isNull = false;
      let isRepeat = false;
      let isMaxNull = false;
      for (let index = 0; index < this.formList.length; index++) {
        const item = this.formList[index];
        if (item.formTitle == "") {
          isNull = true;
          break;
        }
        if (!item.max) {
          isMaxNull = true;
          break;
        }
      }
      for (let i = 0; i < this.formList.length; i++) {
        for (let it = i + 1; it < this.formList.length; it++) {
          if (this.formList[i].formTitle == this.formList[it].formTitle) {
            isRepeat = true;
            break;
          }
        }
      }
      isNull && callback(new Error("报名表单的字段名称不能为空"));
      isMaxNull && callback(new Error("报名表单的长度或数量限制不能为空或零"));
      isRepeat && callback(new Error("报名表单的字段名称不能重复"));
      callback();
    },
    checkLimit(rule, value, callback) {
      if (this.activityForm.perUser === undefined) {
        callback(new Error("请填写每个用户可投数"));
      } else if (this.activityForm.sameUser === undefined) {
        callback(new Error("请填写可为同一用户投票数"));
      } else if (this.activityForm.perPersonPerDay === undefined) {
        callback(new Error("请填写每人每天可投票数"));
      } else {
        callback();
      }
    },
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    changeMax(row) {
      row.type == 1 && (row.max = 20);
      row.type == 2 && (row.max = 140);
      row.type == 3 && (row.max = 1);
    },
    handleAddFormKey() {
      const key = JSON.parse(JSON.stringify(this.defaultKey));
      this.formList.push(key);
    },
    handleDeleteRow(index) {
      this.formList.splice(index, 1);
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.activityForm.signForm = JSON.stringify(this.formList);
          this.activityForm.startTime = this.selectTime[0];
          this.activityForm.endTime = this.selectTime[1];
          editNewActivity(this.activityForm).then(data => {
            if (data.data.status == 0) {
              this.$message.success("编辑活动成功");
              this.$router.go(-1);
            } else {
              this.$message.error(data.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang='less'>
#editVoteActivity {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        div {
          margin-left: 15px;
        }
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      .is-error {
        .el-table {
          border: 1px solid red;
          input {
            border: 1px solid #dcdfe6;
          }
        }
      }
      .el-table {
        margin-bottom: 20px;
        .cell {
          .el-input-number {
            width: 100%;
            .el-input__inner {
              border: none;
            }
          }
          .el-input {
            width: 100%;
          }
        }
      }
      .cell > .el-input > .el-input__inner {
        border: none;
      }
      .limit {
        .el-form-item__content {
          display: flex;
          flex-wrap: wrap;
          .limitItem {
            width: 300px;
            margin-right: 20px;
            .remind {
              color: #aaa;
              font-size: 14px;
            }
          }
          .limitItem > div {
            display: flex;
            span {
              display: inline-block;
              border: 1px solid #dcdfe6;
              padding: 0px 10px;
              box-sizing: border-box;
              height: 40px;
              border-right: none;
            }
            .piao {
              background-color: #ddd;
              border: 1px solid #dcdfe6;
            }
            .el-input-number {
              width: 130px;
              .el-input__inner {
                border-radius: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>