<template>
  <div id="imRoleManege">
    <!-- im 角色列表管理 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">IM角色列表</span>
        <el-button @click="addImRole()">添加角色</el-button>
      </div>
      <div class="content">
        <el-table :data="imRoleList" border style="width: 100%">
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="name" label="角色姓名"></el-table-column>
          <el-table-column prop="icon" label="角色头像">
            <template slot-scope="scope" v-if="scope.row.icon">
              <Thumbnail :image="scope.row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="type" label="服务分类">
            <template slot-scope="scope">
              <span v-if="scope.row.type==1">新房装修</span>
              <span v-if="scope.row.type==2">旧房翻新</span>
              <span v-if="scope.row.type==3">房屋设计</span>
            </template>
          </el-table-column>
          <el-table-column prop="roleDesc" label="角色简介"></el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterImRole(scope.row)">编辑</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllImRole } from "../../api/setings";
import Thumbnail from "../../components/thumbnail";
export default {
  components: { Thumbnail },
  data() {
    return {
      imRoleList: []
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 添加IM角色 */
    addImRole() {
      this.$router.push({ name: "imRoleEdit" });
    },
    /* 编辑IM角色 */
    alterImRole(row) {
      this.$router.push({ name: "imRoleEdit", query: { id: row.id } });
    },
    showAll(val) {
      getAllImRole().then(data => {
        if (data.data.status == 0) {
          this.imRoleList = data.data.data;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#imRoleManege {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
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
    }
  }
}
</style>