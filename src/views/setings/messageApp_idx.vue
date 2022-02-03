<template>
  <div id="custom-print">
    <!-- 消息提醒 -->
    <el-card class="box-card" shadow="never">
      <!-- <div slot="header" class="clearfix">
        <span class="title">消息提醒</span>
      </div>-->
      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>消息提醒</span>
        </div>
        <div class="se-right">
          <!-- <div class="box-r">
            <el-button size="mini" @click="addReutrnOrder({type:'open'})">添加</el-button>
          </div>-->
        </div>
      </div>
      <!-- 表格标题 -->
      <el-table :data="selectLists" v-if="showTable" border row-key="id" style="width: 100%" @selection-change="getSelection">
        <el-table-column prop="name" label="消息类型"></el-table-column>
        <!-- <el-table-column prop="type" label="电子邮件">
          <template slot-scope="scope">
            <el-checkbox label=" 是否发送 " v-model="scope.row.checked1" @change="getChecked(scope.row,1)" style="margin-right:20px"></el-checkbox>
            <el-button type="text" @click="toEmailMessage(scope.row,1)">编辑邮件</el-button>
            <el-button type="text" @click="toEmailMessage1(scope.row,1,masterId)">修改内容</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="站内消息">
          <template slot-scope="scope">
            <el-checkbox label=" 是否发送 " v-model="scope.row.checked2" style="margin-right:20px" @change="getChecked(scope.row,2)"></el-checkbox>
            <el-button type="text" @click="toZnMessage(scope.row,2)">编辑消息</el-button>
            <el-button type="text" @click="toZnMessage1(scope.row,2,masterId)">修改内容</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="手机短信">
          <template slot-scope="scope">
            <el-checkbox label=" 是否发送 " style="margin-right:20px" v-model="scope.row.checked3" @change="getChecked(scope.row,3)"></el-checkbox>
            <el-button type="text" @click="toDxMessage(scope.row,3)">编辑短信</el-button>
            <el-button type="text" @click="toDxMessage1(scope.row,3,masterId)">修改内容</el-button>
          </template>
        </el-table-column> -->
        <el-table-column prop="type" label="APP消息推送">
          <template slot-scope="scope">
            <el-checkbox label=" 是否发送 " style="margin-right:20px" v-model="scope.row.checked4" @change="getChecked(scope.row,4)"></el-checkbox>
            <el-button type="text" @click="toAppMessage(scope.row,4)">编辑app消息</el-button>
            <!-- <el-button type="text" @click="toAppMessage1(scope.row,4,masterId)">修改内容</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="batchOperation">
        <!-- 分页 -->
        <!-- <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com> -->
      </div>
    </el-card>
  </div>
</template>

<script>
import { selectList, isPush } from "../../api/message";
// import paginationCom from "../../components/paginationCom";
export default {
  components: {
    // paginationCom
  },
  data() {
    return {
      masterId: "",
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      selectLists: [],
      dataLists: [],
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
    // // 调整编辑邮件信息
    // toEmailMessage(rows, type) {
    //   this.$router.push({ name: "message_email", query: { id: rows.id, type: type } });
    // },
    // // 修改邮件信息
    // toEmailMessage1(rows, type) {
    //   rows.msgPushSlaves.forEach(item => {
    //     this.masterId = item.id;
    //   });
    //   this.$router.push({ name: "message_emailEdit", query: { id: rows.id, type: type, masterId: this.masterId } });
    // },
    // // 调整编辑站内信信息
    // toZnMessage(rows, type) {
    //   this.$router.push({ name: "message_zn", query: { id: rows.id, type: type } });
    // },
    // // 修改站内信信息
    // toZnMessage1(rows, type) {
    //    rows.msgPushSlaves.forEach(item => {
    //     this.masterId = item.id;
    //   });
    //   this.$router.push({ name: "message_dxEdit", query: { id: rows.id, type: type, masterId: this.masterId } });
    // },
    // // 调整编辑短信信息
    // toDxMessage(rows, type) {
    //   this.$router.push({ name: "message_dx", query: { id: rows.id, type: type } });
    // },
    // // 修改短信信息
    // toDxMessage1(rows, type) {
    //    rows.msgPushSlaves.forEach(item => {
    //     this.masterId = item.id;
    //   });
    //   this.$router.push({ name: "message_dxEdit", query: { id: rows.id, type: type, masterId: this.masterId } });
    // },
    // 调整编辑app信息
    toAppMessage(rows, type) {
      this.$router.push({ name: "message_appEdit", query: { rows: rows, type: type } });
    },
    // // 修改app信息
    // toAppMessage1(rows, type) {
    //    rows.msgPushSlaves.forEach(item => {
    //     this.masterId = item.id;
    //   });
    //   this.$router.push({ name: "message_appEdit", query: { id: rows.id, type: type, masterId: this.masterId } });
    // },
    // 删除
    deleteClick() {},
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
    // handleCurrentChange(val) {
    //   if (this.searchOrderSn != "" || this.searchDate != "" || this.addressId != "" || this.status != "all") {
    //     // 执行查询中的分页
    //     this.selectByKwd(val);
    //   } else {
    //     // 执行全部中的分页
    //     this.showAll(val);
    //   }
    // },
    // /* 搜索分页 */
    // selectByKwd(val) {
    //   console.log(val)
    // },
    /* 反复调用显示全部 */
    showAll(val) {
      selectList({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20
      }).then(data => {
        if (data.status == 200) {
          console.log(data)
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.selectLists = data.data.data;
      this.selectLists.forEach((item, index) => {
        if (item.msgPushSlaves && item.msgPushSlaves.length > 0) {
          item.msgPushSlaves.forEach(it => {
            if (it.status == 1) {
              this.selectLists[index][`checked${it.type}`] = true;
            }else{
              this.selectLists[index][`checked${it.type}`] = false;
            }
          });
        }
      });
    },
    // 切换变换
    getChecked(row, type) {
      this.refreshTable();
  isPush({
        id: row.id,
        type: type
      }).then(data => {
        if(data.data.status==0){
          this.$message({
            message:'操作成功',
            type:'success'
          })
        }else{
          this.$message({
            message:data.data.msg,
            type:'error'
          })
        }
      });

      
      
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