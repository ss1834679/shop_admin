<template>
  <div id="houseTypeCategory">
    <!-- 户型分类展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">户型分类</span>
        <el-button @click="addCategory()" size="small" icon="el-icon-plus" plain>添加分类</el-button>
      </div>
      <div class="content">
        <el-table :data="houseTypeCateList" border row-key="id" style="width: 100%"  >
          <el-table-column prop="code" label="ID"></el-table-column>
          <el-table-column prop="name" align="center" label="户型分类名称"></el-table-column>
          <!-- <el-table-column prop="sort" label="菜单排序" width="80"></el-table-column> -->
          <el-table-column label="状态" align="center" width="120">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.status" activeText="显示" inactiveText="隐藏" @changeValue="(value)=>{changeStatus(scope.row.code,value)}"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="290" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel" :disabled="disableded">
                <el-button type="text" size="medium"  @click="addChildren(scope.row)">添加子分类</el-button>
                <el-button type="text" size="medium" @click="alterHouseCate(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" @click="deleteHouseCate(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </el-card>
  </div>
</template>

<script>
import {getAllHouseType,updateStatus,deleteHouseType} from "../../api/house";
import switchCom from "../../components/switch";
export default {
  data() {
    return {
      disableded:false,/**添加子分类是否显示按钮 */
      houseTypeCateList:[],/*户型数据列表 */
      status:''/*户型是否显示状态 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // 添加子分类
    addChildren(rows,) {
      this.$router.push({ name: "houseCategory_add", query: { code: rows.code,grade:'2'} });
    },
    // 添加户型分类
    addCategory() {
      this.$router.push({ name: "houseCategory_add", query: {grade:'1' }  });
    },
    // 编辑按钮
    alterHouseCate(rows) {
      this.$router.push({ name: "houseCategory_add", query: { code: rows.code,grade:'3'} });
    },
    // 改变Switch开关状态
    changeStatus(code,value) {
   updateStatus({
     code:code,
     status:value,
   }).then(data=>{
      if(data.data.status==0){
        this.$message({
            message:data.data.data,
            type:'success'
        })
        this.showAll()
    }else{
        this.$message({
            message:data.data.msg,
            type:'error'
        })
    }

   })
    },
    // 获取最初户型列表数据
    showAll() {
      getAllHouseType().then(data=>{
        if (data.status == 200) {
          this.setView(data);
        }
      })
      
    },
    // 删除户型
    deleteHouseCate(rows) {
      this.$confirm("此操作将删除该户型分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
     deleteHouseType({code:rows.code}).then(data=>{
       if(data.data.status==0){
         this.$message({
           message:data.data.data,
           type:'success'
         })
         this.showAll()
       }else{
         this.$message({
           message:data.data.msg,
           type:'error'
         })
       }
     })     
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    // 表格渲染
    setView(data) {
this.houseTypeCateList =data.data.data;
this.houseTypeCateList.forEach(item=>{
  item.children=item.bos
}) 
    }
  },
  components: { switchCom }
};
</script>

<style lang='less'>
#houseTypeCategory {
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