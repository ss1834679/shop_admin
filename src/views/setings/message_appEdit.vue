<template>
  <!-- 编辑app推送消息模板 -->
  <div id="message_email">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>编辑app推送消息模板</span>
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
      </div>

      <div class="add-content">
        <el-form :model="messageEmailForm" ref="messageEmailForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="消息类型：" prop="name">
            <el-select v-model="typeValue" disabled>
              <el-option v-for="item in messageTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签说明:" prop="nickName">
            <template>
              <div style="display:flex;flex-wrap: wrap;width:60%">
                <div v-for="item in instructionsList" :key="item.id" class="instructionsbox">
                  <div class="itemInstr">{{item}}</div>
                </div>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="APP推送标题：" prop="title" required>
            <el-input v-model="messageEmailForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容模板：" prop="content" required>
            <el-input type="textarea" placeholder="感谢您的订购，您的订单已经提交成功，订单号：$OrderId$。" v-model="messageEmailForm.content" :rows="8" maxlength="300"></el-input>
          </el-form-item>
          <el-form-item label prop="from">
            <div>
              <span class="spa">{{from}}</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('messageEmailForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { selectMessageTypeList, saveOrUpdate, selectModeByModeId } from "../../api/message";
export default {
  data() {
    return {
      messageEmailForm: {
        id: "",
        content: "",
        title: "",
        modeTypeId: "",
        type: ""
      },
      typeValue: "",
      modeTypeId: "",
      from: "app推送消息內容不能为空，长度限不能超过4000个字符",
      messageTypes: [],
      instructionsList: [
        "用户昵称:$username$",
        "订单号：$orderId$",
        "支付金额：$orderFee$",
        "商品名称：$goodsName$",
        "物流公司：$discoveryName$",
        "物流公司：$discoveryName$",
        "收货人地址：$addressInfo$",
        "收货人电话：$phone$",
        "退款金额：$refundFee$ "
      ]
    };
  },
  mounted() {
    console.log(this.$route.query.rows);
    if (this.$route.query.rows || this.$route.query.type) {
      this.modeTypeId = this.$route.query.rows.id;
      this.messageEmailForm.type = this.$route.query.type;
      this.typeValue = this.$route.query.rows.name;
      console.log(this.typeValue);
    }
    if (this.$route.query.rows.msgPushSlaves !== " ") {
      selectModeByModeId({
        id: this.$route.query.rows.msgPushSlaves[0].dictionaryId,
        type: this.$route.query.type
      }).then(data => {
        console.log(data);
        this.messageEmailForm = data.data.data.msgPushSlave;
      });
    }
    // 查询消息类型列表
    selectMessageTypeList().then(data => {
      if (data.status == 200) {
        this.messageTypes = data.data.data;
        console.log(this.messageTypes);
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitShow = true;
          if (this.$route.query.rows.msgPushSlaves == " " || this.$route.query.rows.msgPushSlaves == null) {
            saveOrUpdate({
              id: this.modeTypeId, //模板类型id
              msgPushSlave: {
                content: this.messageEmailForm.content, //内容
                title: this.messageEmailForm.title, //标题
                dictionaryId: this.modeTypeId,
                type: this.messageEmailForm.type
              }
            }).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  message: "app推送消息编辑成功",
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: "app推送消息编辑失败",
                  type: "success"
                });
              }
            });
          } else if (this.$route.query.rows.msgPushSlaves !== " ") {
            saveOrUpdate({
              id: this.modeTypeId, //模板类型id
              msgPushSlave: {
                content: this.messageEmailForm.content, //内容
                title: this.messageEmailForm.title, //标题
                dictionaryId: this.modeTypeId,
                type: this.messageEmailForm.type,
                id: this.messageEmailForm.id
              }
            }).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  message: "app推送消息编辑成功",
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: "app推送消息编辑失败",
                  type: "success"
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
#message_email {
  padding: 20px;
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.add-content {
  margin: 0 auto;
}

.spa {
  color: #cccccc;
  margin-right: 20px;
  font-size: 12px;
}
.el-card .el-card__header {
  background: #f2f2f2 !important;
  height: 50px;
}
.itemInstr {
  line-height: 27px;
  font-size: 12px;
  color: #888;
  width: 250px;
}
</style>