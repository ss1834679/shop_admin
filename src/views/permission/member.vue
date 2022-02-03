<template>
  <div id="member">
    <!-- 成员展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">成员管理</span>
        <el-button @click="addUser" plain size="small">添加成员</el-button>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="请输用户姓名查询" v-model="searchValue" @keyup.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <el-select v-model="searchCompanyId" @change="changeCompany" filterable placeholder="请选择公司（可搜索）" clearable>
              <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <el-select v-model="searchDepartId" @change="selectByKwd" filterable placeholder="请选择部门" clearable>
              <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="userList" border style="width: 100%">
          <el-table-column align="center" label="成员账号">
            <template slot-scope="scope">{{scope.row.sysUser.username}}</template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">{{scope.row.sysUser.nickName}}</template>
          </el-table-column>
          <el-table-column align="center" label="手机号码">
            <template slot-scope="scope">{{scope.row.sysUser.phone}}</template>
          </el-table-column>
          <el-table-column align="center" label="所属部门">
            <template slot-scope="scope">
              <span v-if="scope.row.sysBranch">{{scope.row.sysBranch.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="角色">
            <template slot-scope="scope">
              <span v-if="scope.row.sysRoleNameList">{{scope.row.sysRoleNameList.join(",")}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="添加时间">
            <template slot-scope="scope">{{scope.row.sysUser.createTime}}</template>
          </el-table-column>
          <el-table-column align="center" label="是否启用">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.sysUser.status" @changeValue="changeStatus(scope.row.sysUser.id)"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <!-- <el-button type="text" size="medium" @click="setPermission(scope.row.sysUser)">权限设置</el-button> -->
                <el-button type="text" size="medium" @click="alterDetails(scope.row.sysUser)">编辑</el-button>
                <el-button type="text" size="medium" @click="deleteUser(scope.row.sysUser)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../components/switch";
import { getUser, updateUserStatus, deleteUser, getCompanyAll, getBranchByCom } from "../../api/permission";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      searchValue: "" /* 姓名 */,
      searchDepartId: "" /* 部门搜索id */,
      searchCompanyId: "" /* 公司搜索id */,
      userList: [
        // {
        //   sysUser: {
        //     id: "1233337753156976640" /* 用户id */,
        //     username: "admin01" /* 成员账号 */,
        //     password: "",
        //     fullName: "昵称呢" /* 成员昵称 */,
        //     nickName: "姓名" /* 成员姓名 */,
        //     icon: "5e58e7d096ad4c3634e1d8fd" /* 成员头像 */,
        //     userDesc: "" /* 成员描述 */,
        //     dataRange: 0 /* 数据范围 */,
        //   },
        //   sysBranch: {
        //     id: "1233043589341118464",
        //     name: "第一个部门啊124" /* 部门名称 */,
        //   }
        // }
      ],
      companyList: [] /* 公司列表 */,
      departmentList: [] /* 获取的品牌列表 */,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  mounted() {
    this.showAll();
    /* 初始化公司搜索列表 */
    getCompanyAll().then(data => {
      if (data.data.status == 200) {
        this.companyList = data.data.content;
      }
    });
  },
  methods: {
    /* 是否启用 */
    changeStatus(id) {
      /* 改变状态 并重新请求 */
      updateUserStatus(id).then(data => {
        if (data.data.status == 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        } else {
          this.showAll();
          this.$message.error("修改失败");
        }
      });
    },
    // /* 权限设置 */
    // setPermission(row) {
    //   console.log(row);
    //   this.$router.push({ name: "memberSetPermission", query: { id: row.id } });
    // },
    /* 修改账户 */
    alterDetails(row) {
      this.$router.push({ name: "memberAlter", query: { id: row.id } });
    },
    /* 删除账户 */
    deleteUser(row) {
      this.$confirm("此操作将删除该成员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(row.id).then(data => {
            if (data.data.status == 200) {
              this.showAll();
              this.$message({
                message: "删除成功",
                type: "success"
              });
            } else {
              this.$message.error("删除失败！");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 添加用户 */
    addUser() {
      this.$router.push({ name: "memberAdd" });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchDepartId = "";
      this.searchValue = "";
      this.selectByKwd();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchValue != "" || this.searchDepartId != "" || this.searchCompanyId != "") {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(obj) {
      getUser({
        pageIndex: obj.page ? obj.page : 1,
        search: {
          branchId: this.searchDepartId || null,
          search: this.searchValue || null,
          companyId: this.searchCompanyId || null
        }
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
          this.$message({
            message: "查询成功",
            type: "success"
          });
        }
      });
    },
    changeCompany(val) {
      this.searchDepartId = "";
      this.departmentList = [];
      if (val != "") {
        getBranchByCom(val).then(data => {
          if (data.data.status == 200) {
            this.departmentList = data.data.content;
          }
        });
      }
      this.selectByKwd("change");
    },
    /* 渲染表格 */
    setView(data) {
      this.userList = data.data.content.result.map(item => {
        let obj = {
          sysUser: item.sysUser,
          sysBranch: item.sysBranch,
          sysRoleNameList: item.sysRoleList.map(i => {
            return i.name;
          })
        };
        return obj;
      });
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageIndex;
      this.size = data.data.content.pageSize;
    },
    showAll(val) {
      getUser({ pageIndex: Number.isInteger(val) ? val : 1 }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        } else {
          this.$message.error(data.data.msg);
        }
      });
    }
  },
  components: { switchCom, paginationCom }
};
</script>

<style lang='less'>
#member {
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
    }
  }
}
</style>
