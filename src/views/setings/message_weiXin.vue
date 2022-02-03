<template>
  <div id="custom-print">
    <!-- 小程序订阅消息 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">小程序订阅消息</span>
      </div>
      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>消息提醒</span>
        </div>
        <el-button plain size="small" @click="addWeiXinMessage()">+添加模板</el-button>
      </div>
      <!-- 表格标题 -->
      <el-table :data="selectLists" v-if="showTable" border row-key="id" style="width: 100%" @selection-change="getSelection">
        <!-- <el-table-column type="selection" align="center" width="70"></el-table-column> -->
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="消息类型"></el-table-column>
         <el-table-column prop="templateId" label="订阅消息模板ID"></el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editAppMessage(scope.row)">编辑</el-button>
             <el-button type="text" @click="deleteAppMessage(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="batchOperation">
        <!-- <div>
          <el-select v-model="batchValue" placeholder="批量操作">
            <el-option v-for="item in batchOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button @click="batchOperation">确认</el-button>
        </div> -->
        <!-- 分页 -->
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>

    <!-- 添加弹框 -->
        <el-dialog title="添加订阅消息" :visible.sync="checkVisible" >
          <el-form :model="toAppMessageForm" ref="toAppMessageForm" label-width="80px" >
            <el-form-item label="名称:" required>
              <el-input type="text" v-model="toAppMessageForm.name" ></el-input>
            </el-form-item>
            <el-form-item label="模板ID:" required>
              <el-input type="text" v-model="toAppMessageForm.templateId" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeclick()">取 消</el-button>
            <el-button type="primary" @click="handleCheck('toAppMessageForm')">确 定</el-button>
          </div>
        </el-dialog>
       <!-- 编辑弹框 -->
        <el-dialog title="添加订阅消息" :visible.sync="checkVisible2" >
          <el-form :model="toAppMessageForm"  ref="toAppMessageForm" label-width="80px" >
            <el-form-item label="名称:" required>
              <el-input type="text" v-model="toAppMessageForm.name" ></el-input>
            </el-form-item>
            <el-form-item label="模板ID:" required>
              <el-input type="text" v-model="toAppMessageForm.templateId" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeclick()">取 消</el-button>
            <el-button type="primary" @click="handleCheck2('toAppMessageForm')">确 定</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
import { subTemplateSelectList,subTemplateSaveOrUpdate,subTemplateSelectById,subTemplateDelete  } from "../../api/message";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
       toAppMessageForm:{
        id:'',
        name:'',
        templateId:''
      },
      visibleShow:false,
      checkVisible:false,
      checkVisible2:false,
      masterId: "",
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      batchOptions: [{ label: "批量删除", value: "delete" }],
      noteform: {
        text: "" /* 操作备注 */
      },
      selectLists: [],
      dataLists: [],
      batchValue: "",
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      value: "",
      valueSwitch: true,
      msgPushSlave: {
        status: ""
      },
      showTable: true
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // 关闭弹窗
    closeclick(){
this.checkVisible=false
this.checkVisible2=false
    },
    // 添加小程序
    addWeiXinMessage() {
  this.checkVisible=true
    this.checkVisible2=false
    this.toAppMessageForm.id=""
    this.toAppMessageForm.name=""
    this.toAppMessageForm.templateId=""
    },
    handleCheck(toAppMessageForm){
   this.$refs[toAppMessageForm].validate(valid=>{
     if(valid){
         subTemplateSaveOrUpdate({
         name:this.toAppMessageForm.name,
         templateId:this.toAppMessageForm.templateId
       }).then(data=>{
        if(data.data.status==200){
          this.$message({
            message:data.data.content,
            type:'success'
          })
          this.checkVisible=false
           this.showAll()
        }else{
           this.$message({
            message:data.data.msg,
            type:'error'
          })
        }
       }) 
     }
   })
    },
    handleCheck2(toAppMessageForm){
   this.$refs[toAppMessageForm].validate(valid=>{
     if(valid){
         subTemplateSaveOrUpdate({
         id:this.toAppMessageForm.id,
         name:this.toAppMessageForm.name,
         templateId:this.toAppMessageForm.templateId
       }).then(data=>{
        if(data.data.status==200){
          this.$message({
            message:data.data.content,
            type:'success'
          })
          this.checkVisible2=false
           this.showAll()
        }else{
           this.$message({
            message:data.data.msg,
            type:'error'
          })
        }
       }) 
     }
   })
    },
    // 修改app信息
    editAppMessage(rows) {
      console.log(rows)
      this.checkVisible2=true
      this.checkVisible=false
     subTemplateSelectById({
     id:rows.id
   }).then(data=>{
     if(data.data.status==200){
       this.toAppMessageForm=data.data.content[0]
      //  console.log(this.toAppMessageForm)
     }
   })   
    },
    // 删除
    deleteAppMessage(rows) {
        this.$confirm("确定要删除这条订阅消息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
subTemplateDelete({id:rows.id}).then(data=>{
  console.log(data)
if(data.data.status==200){
    this.$message({
           message:data.data.content,
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
      }).catch(() => {
          this.$message("已取消删除");
        });

    },
    // 确认
    batchOperation() {},
    // 编辑按钮，打开编辑框
    viewOrder(obj1) {
      if (obj1.type == "open") {
        this.noteform = { text: "", info: obj1.obj1 };
        this.closeVisible = true;
      } 
    },
    // 添加按钮，打开编辑框
    addReutrnOrder(obj1) {
      if (obj1.type == "open") {
        this.noteform = { text: "", info: obj1.obj1 };
        this.closeVisible = true;
      } 
    },
    closeOrder(obj) {
      if (obj.type == "open") {
        this.noteform = { text: "", info: obj.obj };
        this.closeVisible = true;
      } 
    },
    getSelection(val) {
      this.selectedList = ""; /* 先置空 */
      /* 批量操作id拼接 */
      val.forEach((item, index, arr) => {
        if (index == arr.length - 1) {
          this.selectedList = this.selectedList + item.id;
        } else {
          this.selectedList = this.selectedList + item.id + ",";
        }
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchOrderSn != "" || this.searchDate != "" || this.addressId != "" || this.status != "all") {
        // 执行查询中的分页
        this.selectByKwd(val);
      } else {
        // 执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      console.log(val)
    },
    /* 反复调用显示全部 */
    showAll(val) {
      subTemplateSelectList({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20
      }).then(data => {
        console.log(data)
        if (data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 更改筛选条件 */
    changeStatus() {},
    /* 渲染表格 */
    setView(data) {
      this.selectLists = data.data.content.list;
      this.total=data.data.content.total
      this.cPage=data.data.content.pages
      this.size=data.data.content.size
    },
    /* 刷新 */
    refreshTable() {
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
      });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchId = null;
      this.searchName = null;
      this.searchDate = null;
      this.showAll()
    },
  }
};
</script>

<style lang="less">
#custom-print {
  width: 100%;
  height: auto;
  .clearfix {
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
