<template>
  <div id="editNode">
    <!-- 编辑节点-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">编辑节点{{nodeName?"-"+nodeName:""}}</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="nodeForm" ref="nodeForm" :rules="nodeRules" label-width="100px">
          <el-form-item label="节点名" prop="name">
            <el-input v-model.trim="nodeForm.name" placeholder="请输入节点名" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="步骤" v-if="$route.query.nodeType=='big'" prop="sort">
            <el-input-number v-model="nodeForm.sort" :controls="false" :min="0" :max="10" placeholder="请输入大节点步骤，装修流程按步骤数值顺序执行，如从1-10"></el-input-number>
          </el-form-item>
          <el-form-item label="排序" v-else prop="sort">
            <el-input-number v-model="nodeForm.sort" :controls="false" :min="0" placeholder="排序"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('nodeForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getBigNodeOne,
  addBigNode,
  updateBigNode,
  addSmallNode,
  updateSmallNode,
  getSmallNodeOne
} from "../../../api/trim";
export default {
  data() {
    return {
      nodeForm: {
        /* 节点数据 */
        name: "",
        sort: undefined
      },
      nodeRules: {},
      nodeName: null
    };
  },
  created() {
    if (this.$route.query.nodeType == "big") {
      this.nodeRules = {
        name: [
          { required: true, message: "请输入节点名", trigger: "blur" },
          { min: 0, max: 4, message: "节点名不能大于4个字", trigger: "blur" }
        ],
        sort: [{ required: true, message: "请输入步骤", trigger: "blur" }]
      };
    } else {
      this.nodeRules = {
        name: [
          { required: true, message: "请输入节点名", trigger: "blur" },
          { min: 0, max: 10, message: "节点名不能大于10个字", trigger: "blur" }
        ],
        sort: [{ required: true, message: "请输入排序值", trigger: "blur" }]
      };
    }
  },
  mounted() {
    if (this.$route.query.nodeType == "big") {
      this.nodeName = this.$route.query.processName;
      /* 大节点修改 */
      if (this.$route.query.bigNodeId) {
        getBigNodeOne(this.$route.query.bigNodeId).then(data => {
          if (data.data.status == 0) {
            let { id, nodeName, nodeStep } = data.data.data;
            this.nodeForm = { id, name: nodeName, sort: nodeStep };
          }
        });
      }
    } else {
      this.nodeName = this.$route.query.bigNodeName;
      /* 小节点修改 */
      if (this.$route.query.smallNodeId) {
        getSmallNodeOne(this.$route.query.smallNodeId).then(data => {
          if (data.data.status == 0) {
            let { id, nodeName, nodeSort } = data.data.data;
            this.nodeForm = { id, name: nodeName, sort: nodeSort };
          }
        });
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$route.query.nodeType == "big") {
            /* 大节点增删 */
            if (this.$route.query.bigNodeId) {
              updateBigNode({
                decorateProcessId: this.$route.query.decorateId,
                nodeName: this.nodeForm.name,
                nodeStep: this.nodeForm.sort,
                id: this.nodeForm.id
              }).then(data => {
                if (data.data.status == 0) {
                  this.$message.success("修改大节点成功");
                  this.$router.go(-1);
                } else {
                  this.$message.error(data.data.msg);
                }
              });
            } else {
              addBigNode({
                decorateProcessId: this.$route.query.decorateId,
                nodeName: this.nodeForm.name,
                nodeStep: this.nodeForm.sort
              }).then(data => {
                if (data.data.status == 0) {
                  this.$message.success("添加大节点成功");
                  this.$router.go(-1);
                } else {
                  this.$message.error(data.data.msg);
                }
              });
            }
          } else {
            /* 小节点增删 */
            if (this.$route.query.smallNodeId) {
              updateSmallNode({
                bigNodeId: this.$route.query.bigNodeId,
                decorateProcessId: this.$route.query.decorateId,
                nodeName: this.nodeForm.name,
                nodeSort: this.nodeForm.sort,
                id: this.nodeForm.id
              }).then(data => {
                if (data.data.status == 0) {
                  this.$message.success("编辑小节点成功");
                  this.$router.go(-1);
                } else {
                  this.$message.error(data.data.msg);
                }
              });
            } else {
              addSmallNode({
                bigNodeId: this.$route.query.bigNodeId,
                decorateProcessId: this.$route.query.decorateId,
                nodeName: this.nodeForm.name,
                nodeSort: this.nodeForm.sort
              }).then(data => {
                if (data.data.status == 0) {
                  this.$message.success("添加小节点成功");
                  this.$router.go(-1);
                } else {
                  this.$message.error(data.data.msg);
                }
              });
            }
          }
        }
      });
    }
  }
};
</script>

<style lang='less'>
#editNode {
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
  }
}
</style>