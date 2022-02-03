<template>
  <div id="why-return">
    <!-- 退货原因管理页 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">退货原因管理</span>
      </div>
      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
        <div class="se-right">
          <div class="box-r">
            <el-button size="mini" @click="addwhyReturn({type:'open'})">添加</el-button>
          </div>
        </div>
      </div>
      <!-- 表格标题 -->
      <el-table :data="afterSaleList" border row-key="id"  style="width: 100%" @selection-change="getSelection">
        <el-table-column type="selection" align="center" width="70"></el-table-column>
        <el-table-column prop="reason" label="原因类型">
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column align="center" label="是否启用" width="115" prop="isUsed">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isUsed" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
         <el-table-column prop="createTime" label="添加时间"></el-table-column>
        <el-table-column label="操作" align="center" width="135">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="editOrder(scope.row,{type:'open'})">编辑</el-button>
            <!-- 每一个阶段 不同的操作 已取消 -->
            <el-button  type="text" size="medium" @click="deleteClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="batchOperation">
        <div>
          <el-select v-model="batchValue" placeholder="批量操作">
            <el-option v-for="item in batchOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button @click="batchOperation">确认</el-button>
        </div>
        <!-- 分页 -->
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>

      <!-- 编辑弹窗框 -->
      <el-dialog :title="title" :visible.sync="closeVisible" style="width:70%">
        <el-form :model="afterSaleListForm" ref="afterSaleListForm" label-width="100px" class="demo-dynamic">
         <div style="width:50%">
              <el-form-item  label="原因类型：" :rules="{ required: true }">
            <el-input v-model="afterSaleListForm.reason"></el-input>
          </el-form-item>
         </div>
          <div style="width:30%">
              <el-form-item label="排序:"  :rules="{required: true}">
            <el-input v-model="afterSaleListForm.sort"></el-input>
          </el-form-item>
          </div>
          <el-form-item label="是否启用:" :rules="{required: true}">
            <el-switch v-model="afterSaleListForm.isUsed" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeVisible = false">取 消</el-button>
          <el-button type="primary" v-show="showEdit" @click="submitOrder('afterSaleListForm')">确 定</el-button>
           <el-button type="primary" v-show="!showEdit" @click="submitOrder2('afterSaleListForm')">提交</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getReturnReasonPage,returnReasonDeleteBatch,getReturnReasonSave,getReturnReasonUpdate } from "../../api/order";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      title:'添加退货原因',
      afterSaleListForm:{
        id:'',/* 退货原因id */
        reason:'',/* 退货原因 */
        sort:'',/* 排序 */
        isUsed:false,/* 是否启用 */
        createTime:'',/* 创建时间 */
      },
       batchOptions: [{ label: "批量删除", value: "delete" }],
      status: "all" /* 当前状态 */,
      closeVisible: false,
      noteform: {
        text: "" /* 操作备注 */
      },
      afterSaleList:[],/* 返回的退货原因列表 */
      batchValue: "",/* 批量选择的值 */
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      value: "",
      batchArr:[],/* 批量选择的数组 */
      showEdit:true,
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // 删除
    deleteClick(rows){
      this.batchArr.push(rows.id)
       this.$confirm("此操作将删除退货原因, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=>{
          returnReasonDeleteBatch(this.batchArr).then(data=>{
              if(data.data.status==0){
                  this.$message({
                  message: "批量删除退货原因成功",
                  type: "success"
                });
                this.showAll();
              }else{
                 this.$message.error("批量删除退货原因失败");
              }
})
        })

    },
    // 确认
    batchOperation() {
       if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些退货原因, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            returnReasonDeleteBatch(this.batchArr).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  message: "批量删除退货原因成功",
                  type: "success"
                });
                this.showAll();
              } else {
                this.$message.error("批量删除退货原因失败");
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
    },
    // 编辑按钮，打开编辑框
    editOrder(rows,obj1) {
      this.showEdit=false
      this.title="修改退货原因"
      this.afterSaleListForm=rows
      if (obj1.type == "open") {
        this.noteform = { text: "", info: obj1.obj1 };
        this.closeVisible = true;
      } 
    },
    // 添加按钮，打开编辑框
    addwhyReturn(obj1){
      this.showEdit=true
       this.title="添加退货原因"
    if (obj1.type == "open") {
        this.noteform = { text: "", info: obj1.obj1 };
        this.closeVisible = true;
      } 
    },
        // 确认添加
    submitOrder(afterSaleListForm) {
   this.$refs[afterSaleListForm].validate(valid=>{
     if(valid){
       getReturnReasonSave({
          isUsed:this.afterSaleListForm.isUsed,
          reason: this.afterSaleListForm.reason,
          sort: this.afterSaleListForm.sort
       }).then(data=>{
        if(data.data.status==0){
          this.$message({
            message:'添加成功',
            type:'success'
          })
          this.closeVisible=false
          this.showAll()
        }else{
          this.$message({
            message:'添加失败',
            type:'error'
          })
        }
       })
     }
   })
    },
      // 提交修改
    submitOrder2(afterSaleListForm){
this.$refs[afterSaleListForm].validate(valid=>{
     if(valid){
       getReturnReasonUpdate({
         id:this.afterSaleListForm.id,
          isUsed:this.afterSaleListForm.isUsed,
          reason: this.afterSaleListForm.reason,
          sort: this.afterSaleListForm.sort
       }).then(data=>{
        if(data.data.status==0){
          this.$message({
            message:'修改成功',
            type:'success'
          })
          this.closeVisible=false
          this.showAll()
        }else{
          this.$message({
            message:'修改失败',
            type:'error'
          })
        }
       })
     }
   })
    },
    // 批量选择
    getSelection(val) {
      this.batchArr = [];
      val.forEach(item => {
        this.batchArr.push(item.id);
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
        this.showAll(val);
    },
    /* 反复调用显示全部 */
    showAll(val) {
        getReturnReasonPage({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize:20
        }).then(data => {
      if (data.data.status == 0) {
      this.setView(data);
          }
        });
    },
    /* 更改筛选条件 */
    changeStatus() {},
    /* 渲染表格 */
    setView(data) {
      this.afterSaleList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
    },
  }
};
</script>

<style lang="less">
#why-return {
  width: 100%;
  height: auto;
    .clearfix{
display: flex;
justify-content: space-between;
align-items: center;
  }
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
    .el-table__header .el-table-column--selection .cell .el-checkbox:after {
      content: "全选";
      margin-left: 5px;
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      /* 筛选按钮 */
      .status {
        .el-tabs {
          .el-tabs__header {
            margin: 0;
            border-bottom: none;
            .el-tabs__nav-wrap {
              margin-bottom: 0;
              .el-tabs__nav {
                border-radius: 0px;
              }
              .el-tabs__item.is-active {
                color: white;
                background-color: #1abc9c;
              }
              .el-tabs__item:hover {
                color: #1abc9c;
              }
              .el-tabs__item.is-active:hover {
                color: white;
              }
            }
          }
        }
      }
      .search {
        /* 几个查询一起 */
        display: flex;
        justify-content: flex-start;
        margin-bottom: 15px;
        div.search_box {
          margin-right: 6px;
          span {
            line-height: 40px;
          }
        }
      }
      .el-button-group.alterDel,
      .el-button-group.setup {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
      }
      .batchOperation {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-pagination {
          padding: 0;
          // margin-top: 20px;
        }
        .el-select {
          width: 120px;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
