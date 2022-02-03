<template>
  <div id="user_idx">
    <!-- 会员列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">会员列表</span>
      </div>
      <div class="content">
        <div class="tool">
          <div class="filtrate">
            <el-button icon="el-icon-plus" type="primary" @click="addNewUser">新增</el-button>
          </div>
          <div class="search_box">
            <!-- <el-input
              :placeholder="(select=='不限'?'':'请输入'+select)"
              v-model="searchInput"
              class="input-with-select"
            >
            <el-select v-model="select" slot="prepend">-->
            <!-- 筛选的条件 默认为不限 -->
            <!-- <el-option
                  v-for="item in allSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>-->
          </div>
        </div>
        <el-table :data="userList" border row-key="id" height="200" style="width: 100%">
          <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
          <!-- 会员头像 -->
          <el-table-column prop="avatar" align="center" label="会员头像" width="160">
            <template slot-scope="scope" v-if="scope.row.avatar">
              <el-image
                :src="base+scope.row.avatar"
                style=" height: 40px"
                :preview-src-list="(base+scope.row.avatar).split(',')"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="后台人员备注"></el-table-column>
          <el-table-column prop="userEmail" label="邮箱"></el-table-column>

          <el-table-column prop="gender" label="性别">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.gender==1">男</el-tag>
              <el-tag v-if="scope.row.gender==2" type="success">女</el-tag>
              <el-tag v-if="scope.row.gender==3" type="warning">保密</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="会员状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isDelete" type="danger">禁用</el-tag>
              <el-tag v-else type="success">启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="115">
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="alterUser(scope.row)"
                  ></el-button>
                </el-tooltip>
                <!-- 一开始没有删除功能 -->
                <el-tooltip v-if="scope.row.isDelete" effect="dark" content="启用" placement="top">
                  <el-button
                    type="success"
                    size="mini"
                    icon="el-icon-open"
                    @click="handleIsDelete({type:'up',row:scope.row})"
                  ></el-button>
                </el-tooltip>
                <el-tooltip v-else effect="dark" content="禁用" placement="top">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-turn-off"
                    @click="handleIsDelete({type:'down',row:scope.row})"
                  ></el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: "不限",
      maringLeft: { marginLeft: "10px" },
      searchInput: "",
      userList: [
        {
          id: "1",
          userName: "可购买沙发保养服务" /* 用户名 */,
          avatar: "5e12ecf7a1a09a0baeb145fb" /* 会员头像 */,
          nickname: "dabnkca" /* 昵称 */,
          realname: "asgfa" /* 真实姓名 */,
          remark: "alkhfa" /* 后台人员备注的信息 */,
          phone: "12353536457" /* 电话 */,
          userEmail: "123414@qq.com" /* 邮箱 */,
          gender: "3" /* 性别 1:男 2:女 3:保密 */,
          birthday: "2011-10-23" /* 生日 */,
          identityCardType: 1 /* 证件类型：1 身份证 2 军官证 3 护照 */,
          identityCardNo: "12114253253456" /* 证件号码 */,
          isDelete: 0 /* 是否删除 */
        },
        {
          id: "2",
          userName: "可购买沙发保养服务" /* 用户名 */,
          avatar: "5e12ecf7a1a09a0baeb145fb" /* 会员图片地址 */,
          nickname: "dabnkca" /* 昵称 */,
          realname: "asgfa" /* 真实姓名 */,
          remark: "alkhfa" /* 后台人员备注的信息 */,
          phone: "12353536457" /* 电话 */,
          userEmail: "123414@qq.com" /* 邮箱 */,
          gender: "2" /* 性别 1:男 2:女 3:保密 */,
          birthday: "2011-10-23" /* 生日 */,
          identityCardType: 2 /* 证件类型：1 身份证 2 军官证 3 护照 */,
          identityCardNo: "12114253253456" /* 证件号码 */,
          isDelete: 0 /* 是否删除 */
        },
        {
          id: "3",
          userName: "可购买沙发保养服务" /* 用户名 */,
          avatar: "5e12ecf7a1a09a0baeb145fb" /* 会员图片地址 */,
          nickname: "dabnkca" /* 昵称 */,
          realname: "asgfa" /* 真实姓名 */,
          remark: "alkhfa" /* 后台人员备注的信息 */,
          phone: "12353536457" /* 电话 */,
          userEmail: "123414@qq.com" /* 邮箱 */,
          gender: "1" /* 性别 1:男 2:女 3:保密 */,
          birthday: "2011-10-23" /* 生日 */,
          identityCardType: 3 /* 证件类型：1 身份证 2 军官证 3 护照 */,
          identityCardNo: "12114253253456" /* 证件号码 */,
          isDelete: 0 /* 是否删除 */
        }
      ],
      base: "" /* 图片链接开头 */
    };
  },
  mounted() {
    this.base = this.$store.state.base_url;
  },
  methods: {
    addNewUser() {
      this.$router.push({ name: "user_add" });
    },
    alterUser(rows) {
      this.$router.push({ name: "user_alter", params: { data: rows } });
    },
    selectToSearch() {
      console.log(this.statusSearch);
    },
    /* 状态的启用和禁用 */
    handleIsDelete(obj) {
      if (obj.type == "up") {
        obj.row.isDelete = 0;
        console.log("启用成功");
        /* 调用接口 */
      }
      if (obj.type == "down") {
        obj.row.isDelete = 1;
        console.log("禁用成功");
        /* 调用接口 */
      }
    }
  },
  components: {}
};
</script>

<style lang='less'>
#user_idx {
  width: 100%;
  height: auto;
  .el-image__inner {
    //有缩略图的加这个样式
    width: auto !important;
  }
  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        width: 100%;
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
      .tool {
        //table上的一栏按钮
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        .search_box {
          width: 270px;
        }
        .filtrate {
          // .el-button{
          //   margin-right: 10px;
          // }
          display: flex;
          align-items: center;
          width: auto;
          .el-select .el-input__inner {
            width: 110px; //搜索框宽度
          }
          .el-select:last-child {
            .el-input__inner {
              width: 140px; //搜索框宽度
            }
          }
        }
        .el-select .el-input__inner {
          width: 90px; //搜索框宽度
        }
        .el-input__inner {
          width: 120px;
          height: 37px;
        }
      }
      .el-pagination {
        padding: 0;
        margin-top: 20px;
      }
    }
  }
}
</style>
