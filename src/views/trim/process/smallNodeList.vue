<template>
  <div id="smallNodeList">
    <!-- 小节点列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">小节点列表{{nodeName?"-"+nodeName:""}}</span>
        </div>
        <el-button @click="addSmallNode">添加小节点</el-button>
      </div>
      <div class="content">
        <el-table :data="smallNodeList" border>
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="nodeName" label="节点名" align="center"></el-table-column>
          <el-table-column prop="nodeSort" label="排序" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
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
import { getSmallNodePage, deleteSmallNode } from "../../../api/trim";
export default {
  data() {
    return {
      nodeName: null /* 大节点名 */,
      smallNodeList: []
    };
  },
  mounted() {
    this.nodeName = this.$route.query.bigNodeName;
    this.showAll();
  },
  methods: {
    /* 添加小节点 */
    addSmallNode() {
      this.$router.push({
        name: "editNode",
        query: {
          bigNodeId: this.$route.query.bigNodeId,
          bigNodeName: this.nodeName,
          decorateId: this.$route.query.decorateId,
          nodeType: "small"
        },
        params: { isAdd: true }
      });
    },
    /* 编辑小节点 */
    alterBigNode(row) {
      this.$router.push({
        name: "editNode",
        query: {
          bigNodeId: row.bigNodeId,
          bigNodeName: this.nodeName,
          decorateId: row.decorateProcessId,
          smallNodeId: row.id,
          nodeType: "small"
        }
      });
    },
    deleteBigNode(row) {
      this.$confirm("此操作将删除该小节点，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteSmallNode(row.id).then(data => {
            if (data.data.status == 0) {
              this.$message.success("删除小节点成功");
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
      getSmallNodePage(this.$route.query.bigNodeId).then(data => {
        if (data.data.status == 0) {
          this.smallNodeList = data.data.data;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#smallNodeList {
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