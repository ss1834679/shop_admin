<template>
  <div id="customerService">
    <!-- 客服列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">客服管理</span>
        <el-button plain size="small" @click="serverVisible = true">添加</el-button>
      </div>
      <div class="content">
        <div class="dataSheet">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </div>
        <el-table :data="customerServiceList" border row-key="specParamId" style="width: 100%">
          <el-table-column prop="username" label="成员账号" width="130" align="center"></el-table-column>
          <el-table-column prop="nickName" label="客服昵称" align="center"></el-table-column>
          <el-table-column prop="createTime" label="添加时间" align="center"></el-table-column>
          <el-table-column prop="status" label="是否启用" align="center">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.status" @changeValue="(value)=>{changeStatus(scope.row.id,value)}"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="viewHistory(scope.row)" disabled>查看记录</el-button>
                <el-button type="text" size="medium" @click="alterServer(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" @click="deleteDepart(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :title="alter?'修改客服':'添加客服'" :visible.sync="serverVisible" @close="closeForm">
        <el-form label-width="80px" :model="serverForm" ref="serverForm" :rules="formRules">
          <el-form-item label="客服昵称" required prop="nickName">
            <el-input v-model="serverForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="成员账号" required prop="username">
            <el-select v-model="departValue" @change="showName" filterable placeholder="请选择部门">
              <!-- 后台获取 -->
              <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="serverForm.username" filterable placeholder="请选择成员">
              <!-- 后台获取 -->
              <el-option v-for="item in usernameList" :key="item.id" :label="item.nickName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeForm">取 消</el-button>
          <el-button type="primary" @click="submitAlter('serverForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../components/switch";
export default {
  data() {
    return {
      /* 客服列表 */
      customerServiceList: [
        {
          id: "11233",
          username: "qweic" /* 成员账号 */,
          nickName: "大力" /* 姓名 */,
          phone: "18392999808" /* 手机号码 */,
          branchName: "平台部" /* 所属部门 */,
          createTime: "2020-01-22 12:12:12" /* 添加时间 */,
          lastTime: "2020-01-22 12:12:12" /*  */,
          status: 0 /* 是否启用 */
        },
        {
          id: "11233",
          username: "qweic" /* 成员账号 */,
          nickName: "大力2" /* 姓名 */,
          phone: "18392999808" /* 手机号码 */,
          branchName: "平台部" /* 所属部门 */,
          createTime: "2020-01-22 12:12:12" /* 添加时间 */,
          lastTime: "2020-01-22 12:12:12" /*  */,
          status: 0 /* 是否启用 */
        }
      ],
      formRules: {
        nickName: { required: true, message: "请输入客服昵称", trigger: "blur" },
        username: { required: true, message: "请选择成员账号", trigger: "blur" }
      },
      serverForm: {
        id: "",
        nickName: "",
        username: ""
      },
      departmentList: [
        {
          id: "1" /* 部门id */,
          name: "bm1",
          desc: "bm1",
          userNum: 10,
          companyName: "隶属于1gs",
          status: 0,
          createTime: "2019-12-20 12:39:44"
        },
        {
          id: "2" /* 部门id */,
          name: "bm2",
          desc: "bm2",
          userNum: 10,
          companyName: "隶属于2gs",
          status: 1,
          createTime: "2019-12-20 12:39:44"
        }
      ],
      usernameList: [
        {
          id: "3",
          username: "admin" /* 成员账号 */,
          nickName: "大力" /* 姓名 */,
          phone: "18392999808" /* 手机号码 */,
          branchName: "平台部" /* 所属部门 */,
          createTime: "2020-01-22 12:12:12" /* 添加时间 */,
          lastTime: "2020-01-22 12:12:12" /*  */,
          status: 0 /* 是否启用 */
        }
      ],
      departValue: "",
      serverVisible: false,
      alter: false
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 修改客服 */
    alterServer(rows) {
      this.serverForm = JSON.parse(JSON.stringify(rows));
      this.alter = true;
      this.serverVisible = true;
    },
    /* 查看记录 */
    viewHistory(row) {
      console.log(row);
      /* 现在还没有记录 */
      //   this.route.push({ name: "setPermission", query: { id: row.id } });
    },
    /* 选择部门获取成员数组 */
    showName(event) {
      console.log(event);
      /* 获取到部门id  获取部门的user列表  usernameList赋值 */
      if (event == "") {
        this.serverForm.username = "";
      }
    },
    /* 关闭修改 添加 */
    closeForm() {
      this.serverVisible = false;
      this.alter = false;
      /* 重置表单 */
      this.serverForm = {
        id: "",
        name: "",
        desc: ""
      };
    },
    /* 提交修改 添加 */
    submitAlter(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.serverForm);
          /* 调接口 */
        } else {
          return false;
        }
      });
    },
    changeStatus(id, value) {
      console.log(id, value);
      /* 改变状态 并重新请求 */
    },
    showAll() {
      //   const loading = this.$loading({
      //     lock: true,
      //     text: "Loading",
      //     spinner: "el-icon-loading",
      //     background: "rgba(0, 0, 0, 0.7)"
      //   });
      //   loading.close();
    },
    deleteDepart(rows) {
      console.log(rows.id);
      this.$confirm("此操作将删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //   deleteDepart({ id: rows.id }).then(data => {
          //     if (data.data.status == 0) {
          //       this.showAll();
          //       this.$message({
          //         message: "删除部门成功",
          //         type: "success"
          //       });
          //     } else {
          //       this.$message({
          //         message: "删除部门失败",
          //         type: "error"
          //       });
          //     }
          //   });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  components: { switchCom }
};
</script>

<style lang='less'>
#customerService {
  width: 100%;
  height: auto;
  
  .el-card {
    height: 100%;
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
      /* table上面有可视化的格子的时候 */
      .dataSheet {
        width: 100%;
        height: 100px;
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        div {
          height: 100px;
          width: 260px;
          margin-right: 10px;
          background-color: deeppink;
        }
      }
      .el-table__body-wrapper {
        min-height: 600px;
      }
      .el-pagination {
        padding: 0;
        margin-top: 20px;
      }
    }
  }
}
</style>
