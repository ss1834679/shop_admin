<template>
  <div id="decorateStyle_idx">
    <!-- 风格列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">风格管理</span>
      </div>
      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
        <div class="se-right">
          <div class="box-r">
            <el-button plain @click="addDecorateStyle" size="small">添加风格</el-button>
          </div>
        </div>
      </div>
      <div class="content">
        <el-table :data="decorateStyleList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="title" label="风格名称" align="center"></el-table-column>
           <el-table-column prop="sort" label="排序" align="center"></el-table-column>
           <el-table-column prop="updateTime" label="添加时间" align="center"></el-table-column>
          <el-table-column prop="status" label="是否启用" align="center">
            <template slot-scope="scope">
                 <switch-com :boolen="scope.row.status" activeText="显示" inactiveText="隐藏" @changeValue="(value)=>{changeStatus(scope.row.id,value)}"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterDecorateStyle(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" @click="deleteStyle(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import {editDecorateStyleStatus, getDecorateStyleList,deleteDecorateStyled } from "../../api/setings";
import switchCom from "../../components/switch";
export default {
  components:{switchCom},
  data() {
    return {
      decorateStyleList: [],
      alterForm: {
        imageUrl: "",
        sort:'',
        title: "",
        // status:''
      },
      alter: false
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    alterDecorateStyle(rows) {
      this.$router.push({name:'houseStyleCategory_add',query:{rows:rows,type:'2'}})
    },
    closeForm() {
      this.styleVisible = false;
      this.alter = false;
      this.alterForm = {
        imageUrl: "",
        sort: 0,
        title: ""
      };
    },
    addDecorateStyle() {
       this.$router.push({name:'houseStyleCategory_add', query:{type:'1'}})
    },
    submitAlter() {
      this.$router.push({name:'houseStyleCategory_add'})
    },
    showAll() {
      getDecorateStyleList().then(data => {
        if (data.data.status == 0) {
          this.decorateStyleList = data.data.data;
        }
      });
    },
    deleteStyle(rows){
 this.$confirm("此操作将删除该装修风格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDecorateStyled({ id:rows.id}).then(data => {
            if (data.data.status == 0) {
              this.$message({
                type: "success",
                message: data.data.data
              });
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
    changeStatus(id,value) {
          editDecorateStyleStatus({ id: id, status: value }).then(data => {
            if (data.data.status == 0) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
               this.showAll();
            } else {
              this.$message.error("修改失败");
             
            }
          });

    }
  }
};
</script>

<style lang='less'>
#decorateStyle_idx {
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
      .el-table__body-wrapper {
        min-height: 600px;
      }
    }
  }
}
</style>
