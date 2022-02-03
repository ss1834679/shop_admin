<template>
  <div id="imRoleEdit">
    <!-- 编辑im角色-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">编辑IM角色</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="imRoleForm" ref="imRoleForm" :rules="imRoleRules" label-width="150px">
          <el-form-item label="角色名称：" prop="name">
            <el-input v-model="imRoleForm.name" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="角色头像：" v-if="showImg" prop="icon">
            <upload-img @getimgArr="(imgarr)=>{this.imRoleForm.icon = imgarr}" :imgArr="this.imRoleForm.icon" :limit="1" :notMultiple="true"></upload-img>
          </el-form-item>
          <el-form-item label="服务分类:" prop="type">
            <el-select v-model="imRoleForm.type">
              <el-option label="新房装修" :value="1"></el-option>
              <el-option label="旧房翻新" :value="2"></el-option>
              <el-option label="房屋设计" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色简介" prop="roleDesc">
            <el-input v-model="imRoleForm.roleDesc" type="textarea" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('imRoleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getImRoleById, updateImRole, addImRole } from "../../api/setings";
import uploadImg from "../../components/uploadImg";
export default {
  components: { uploadImg },
  data() {
    return {
      showImg: true,
      imRoleForm: {
        /* im角色数据 */
        name: null,
        roleDesc: null,
        type: null,
        icon: null
      },
      imRoleRules: {
        /* 添加风格输入验证 */
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 0, max: 10, message: "角色姓名不能大于10个字", trigger: "blur" }
        ],
        icon: [{ required: true, message: "请上传角色头像", trigger: "blur" }],
        type: [{ required: true, message: "请选择服务分类", trigger: "blur" }],
        roleDesc: [
          { required: true, message: "请输入角色简介", trigger: "blur" },
          { min: 0, max: 100, message: "角色简介不能大于100个字", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      /* 编辑商品风格 */
      getImRoleById(this.$route.query.id).then(data => {
        if (data.data.status == 200) {
          this.imRoleForm = data.data.content;
          this.refreshImg();
        }
      });
    }
  },
  methods: {
    // 刷新图片
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    submitForm(imRoleForm) {
      this.$refs[imRoleForm].validate(valid => {
        if (valid) {
          if (this.$route.query.id) {
            updateImRole(this.imRoleForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success("修改成功");
                this.$router.go(-1);
              } else {
                this.$message.error("修改失败");
              }
            });
          } else {
            addImRole(this.imRoleForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success("添加成功");
                this.$router.go(-1);
              } else {
                this.$message.error("添加失败");
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang='less'>
#imRoleEdit {
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