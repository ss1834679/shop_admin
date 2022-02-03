<template>
  <div id="bigNodeList">
    <!-- 大节点列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">大节点列表{{processName?"-"+processName:""}}</span>
        </div>
        <el-button @click="addBigNode">添加大节点</el-button>
      </div>
      <div class="content">
        <el-table :data="bigNodeList" border>
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="nodeName" label="节点名" align="center"></el-table-column>
          <el-table-column prop="nodeStep" label="步骤" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="handleSmallNode(scope.row)">小节点列表</el-button>
                <el-button type="text" @click="alterBigNode(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteBigNode(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getBigNodeByDecoId, deleteBigNode } from "../../../api/trim";
export default {
  data() {
    return {
      processName: null /* 流程名 */,
      bigNodeList: []
    };
  },
  mounted() {
    this.processName = this.$route.query.processName;
    this.showAll();
  },
  methods: {
    /* 添加大节点 */
    addBigNode() {
      this.$router.push({
        name: "editNode",
        query: { decorateId: this.$route.query.id, nodeType: "big", processName: this.processName },
        params: { isAdd: true }
      });
    },
    /* 编辑大节点 */
    alterBigNode(row) {
      this.$router.push({
        name: "editNode",
        query: {
          bigNodeId: row.id,
          decorateId: this.$route.query.id,
          nodeType: "big",
          processName: this.processName
        }
      });
    },
    handleSmallNode(row) {
      this.$router.push({
        name: "smallNodeList",
        query: { bigNodeId: row.id, bigNodeName: row.nodeName, decorateId: this.$route.query.id }
      });
    },
    deleteBigNode(row) {
      this.$confirm("此操作将删除该大节点，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteBigNode(row.id).then(data => {
            if (data.data.status == 0) {
              this.$message.success("删除大节点成功");
              this.showAll();
            } else {
              this.$message.error(data.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    showAll() {
      getBigNodeByDecoId(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          this.bigNodeList = data.data.data;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#bigNodeList {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
      padding: 0;
      .clearfix {
        width: calc(~"100% - 40px");
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>