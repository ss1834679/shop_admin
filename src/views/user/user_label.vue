<template>
  <div id="order_idx">
    <!-- 用户标签列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">用户标签</span>
      </div>

      <!-- 筛选 -->
      <div class="content">
        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
            <div class="box-r">
              <el-button size="mini" @click="addUserLabel({ type: 'open' })">添加</el-button>
            </div>
          </div>
       
        <!-- 表格标题 -->
        <el-table :data="userTagList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="tagName" label="标签名称"></el-table-column>
          <el-table-column prop="vipCount" label=" 会员人数"></el-table-column>
          <el-table-column prop="term" label="自动打标签条件"></el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="addUserLabel2(scope.row,{ type: 'open' })">编辑</el-button>
                <el-button type="text" size="medium" @click="delUser(scope.row )">删除</el-button>
              </el-button-group>
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
      </div>
      <!-- 添加用户标签弹框 -->
    <el-dialog title="添加标签类型" :visible.sync="isAppProject" >
        <el-form label-width="150px" >
          <el-form-item label="标签名称:" prop="tagNameInput" required>
             <el-input  v-model="userTagListForm.tagNameInput" class="input-with-select"> </el-input>
          </el-form-item>
          自动打标签条件：
          <el-form-item label="累计成功交易 " prop="vipCountInput" >
             <div style="width:200px">
                 <el-input  placeholder="请输入交易数量" v-model="userTagListForm.vipCountInput" class="input-with-select"><template slot="append">笔</template> </el-input>
             </div>
          </el-form-item>
          或者：
           <el-form-item label="累计购买金额 " prop="termInput" >
             <div style="width:200px">
                 <el-input placeholder="请输入以分为单位的金额"  v-model="userTagListForm.termInput" class="input-with-select"><template slot="append">分</template> </el-input>
             </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isAppProject = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder()">确 定</el-button>
        </div>
      </el-dialog>
         <!-- 编辑用户标签弹框 -->
    <el-dialog title="添加标签类型" :visible.sync="isAppProject2" >
        <el-form label-width="150px" >
          <el-form-item label="标签名称:" prop="tagNameInput" required>
             <el-input  v-model="userTagListForm.tagNameInput" class="input-with-select"> </el-input>
          </el-form-item>
          自动打标签条件：
          <el-form-item label="累计成功交易 " prop="vipCountInput" >
             <div style="width:200px">
                 <el-input  placeholder="请输入交易数量" v-model="userTagListForm.vipCountInput" class="input-with-select"><template slot="append">笔</template> </el-input>
             </div>
          </el-form-item>
          或者：
           <el-form-item label="累计购买金额 " prop="termInput" >
             <div style="width:200px">
                 <el-input  placeholder="请输入以分为单位的金额" v-model="userTagListForm.termInput" class="input-with-select"><template slot="append">分</template> </el-input>
             </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isAppProject2 = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder2()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {getUserTagList,addUserTag,deleteUserTag,editUserTag} from "../../api/user";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      batchArr: [] /* 批量操作 id 数组 */,
      // 返回的订单列表
      userTagList: [],
      userTagListForm:{
          id:'',
          tagNameInput:'',
          vipCountInput:'',
          termInput:''
      },
      // 批量输入值
      batchValue: "",
      isAppProject:false,
      isAppProject2:false,
      status: true /* 当前状态 大的筛选条件 */,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      // 批量删除按钮
      batchOptions: [{ label: "批量删除", value: "delete" }],
      // 用户i
      userId: "1231937359092551682",
      ids:[]
    };
  },
  watch: {
    status: {
      /* 改变大的筛选条件 */
      handler() {
        this.selectByKwd();
      }
    }
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // 跳转到编辑资料页 '1243355107257446402'
    // editData(rows) {
      
    // },
    handleCloseOrder(){
        addUserTag({
        tagName:this.userTagListForm.tagNameInput,
        tradeNum: this.userTagListForm.vipCountInput,
        tradePrice: this.userTagListForm.termInput,
        }).then(data=>{
         if(data.data.status==0){
             this.$message({
                 message:data.data.data,
                 type:'success'
             })
             this.showAll()
             this.isAppProject=false
         }else{
              this.$message({
                 message:data.data.msg,
                 type:'error'
             })
         }

 })
    },
    // 添加用户标签
    addUserLabel(obj1){
 if (obj1.type == "open") {
        this.isAppProject = true;
      } else if (obj1.type == "close") {
        this.isAppProject = false;
      }
    },
    // 编辑用户标签
    addUserLabel2(rows,obj1){
 if (obj1.type == "open") {
        this.isAppProject2 = true;
      } else if (obj1.type == "close") {
         this.isAppProject2 = false;
      }
      this.userTagListForm.tagNameInput=rows.tagName
      this.userTagListForm.id=rows.id
    },
    // 编辑弹框确定
    handleCloseOrder2(){
        console.log(this.userTagListForm.id)
    editUserTag({
    id:this.userTagListForm.id,
    tagName:this.userTagListForm.tagNameInput,
    tradeNum: this.userTagListForm.vipCountInput,
    tradePrice: this.userTagListForm.termInput,
    }).then(data=>{
      if(data.data.status==0){
          this.$message({
              message:data.data.data,
              type:'success'
          })
          this.isAppProject2=false
           this.showAll()
      }else{
           this.$message({
              message:data.data.msg,
              type:'error'
          })
      }
    })
    },
    // 批量操作id拼接
    getSelection(val) {
      this.batchArr = [];
      val.forEach(item => {
        this.batchArr.push(item.id);
        console.log(this.batchArr);
      });

    },
    /* 分页点击 */
    handleCurrentChange(val) {
         this.selectByKwd(val);
          this.showAll(val);
    },
    // 批量删除
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些用户标签, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            deleteUserTag(this.batchArr).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  message: "批量删除用户标签成功",
                  type: "success"
                });
                this.showAll()
              } else {
                this.$message.error("批量删除用户标签失败");
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
    },
    // 点击删除
    delUser(rows) {
      this.$confirm("此操作将删除这个用户标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 调接口 */
         
          this.batchArr.push(rows.id);
           console.log( this.batchArr)
          deleteUserTag(this.batchArr).then(data => {
            console.log(data);
            if (data.data.status == 0) {
              this.$message({
                message: "批量删除用户标签成功",
                type: "success"
              });
          this.showAll()
              
            } else {
              this.$message.error("批量删除用户标签失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 反复调用显示全部 */
    showAll() {
      getUserTagList().then(data => {
        console.log(data);
        if (data.data.status == 0) {  
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.userTagList = data.data.data;
    //   this.total = data.data.data.total;
    //   this.cPage = data.data.data.pageNum;
    //   this.size = data.data.data.pageSize;
    },
  }
};
</script>

<style lang="less">
#order_idx {
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

      span.title {
        line-height: 50px;
        margin-left: 20px;
      }
    }
    .clearfix {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      .s-size {
        font-size: 13px;
      }

      .el-button-group.alterDel,
      .el-button-group.setup {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
      }
      // 批量删除
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
// 弹出窗
.mo-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.ca-order {
  display: flex;
  align-items: center;
  margin-top: 25px;
}
.mode {
  width: 60%;
  height: 300px;
  // border: 1px solid #cccccc;
  padding: 10px;
}
.mode2 {
  width: 60%;
  height: 100px;
  // border: 1px solid #cccccc;
  padding: 10px;
}
.mo-text {
  font-size: 12px;
  color: #cccccc;
  span {
    color: #ff0000;
  }
}
.e-form {
  display: flex;
  line-height: 40px;
  justify-content: space-around;
  align-items: center;
}
.btn-co {
  position: absolute;
  top: 50px;
  left: 0;
  z-index: 20;
  line-height: 1;
  text-align: center;
  font-size: 13px;
  background: #cccccc;
}
</style>
