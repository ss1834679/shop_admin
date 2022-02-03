<template>
  <div id="edition_idx">
    <!-- 版本更新展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">版本更新</span>
        <el-button @click="addNewEdition" size="small" icon="el-icon-plus" plain>添加版本</el-button>
      </div>
      <div class="content">
        <!-- <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="text" @click="clearSearch">清空搜索</el-button>
            <el-button size="small" @click="selectByKwd($event)">查询结果</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>更新内容：</span>
            <el-input placeholder="请输入更新内容" v-model="searchInput" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>更新版本：</span>
            <el-input placeholder="请输入更新版本" v-model="searchEdition" @keydown.native.enter="selectByKwd"></el-input>
          </div>
        </div>-->
        <el-table :data="editionList" border style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="version" label="版本号"></el-table-column>
          <el-table-column prop="updateMsg" label="更新内容"></el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterEdition(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteEdition(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
    <el-dialog :title="alter?'修改版本':'添加版本'" :visible.sync="editionVisible" @close="closeForm">
      <el-form label-width="80px" :model="alterForm" ref="alterForm">
        <el-form-item label="版本号">
          <el-input v-model="alterForm.version"></el-input>
        </el-form-item>
        <el-form-item label="更新内容">
          <el-input type="textarea" v-model="alterForm.updateMsg"></el-input>
        </el-form-item>
        <el-form-item label="更新端">
          <el-radio-group v-model="alterForm.type">
            <el-radio :label="1">安卓端</el-radio>
            <el-radio :label="2">IOS端</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="更新状态">
          <el-radio-group v-model="alterForm.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">废弃</el-radio>
            <el-radio :label="2">更新</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="alterForm.versionUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeForm">取 消</el-button>
        <el-button type="primary" @click="submitAlter()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import paginationCom from "../../components/paginationCom";
import { getAppInfoList, deleteAppInfo, updateAppInfo, insertAppInfo } from "../../api/setings";
export default {
  data() {
    return {
      searchInput: "" /* 更新内容 */,
      searchEdition: "" /* 更新版本 */,
      editionList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      alterForm: {
        updateMsg: "",
        version: "",
        type: 2 /* 2 ios 1 安卓 */,
        status: 0 /*  0 正常 1 废弃 2 更新 */,
        versionUrl: "https://apps.apple.com/cn/app/%E5%8E%9F%E5%B0%9Ae%E5%AE%B6/id1505279319"
      },
      editionVisible: false,
      alter: false
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    addNewEdition() {
      this.editionVisible = true;
    },
    alterEdition(rows) {
      this.alterForm = JSON.parse(JSON.stringify(rows));
      this.alter = true;
      this.editionVisible = true;
    },
    closeForm() {
      this.editionVisible = false;
      this.alter = false;
      this.alterForm = {
        updateMsg: "",
        version: "",
        type: 2,
        status: 0,
        versionUrl: "https://apps.apple.com/cn/app/%E5%8E%9F%E5%B0%9Ae%E5%AE%B6/id1505279319"
      };
    },
    submitAlter() {
      if (this.alter) {
        updateAppInfo(this.alterForm).then(data => {
          if (data.data.status == 200) {
            this.$message({ type: "success", message: "修改版本成功" });
            this.editionVisible = false;
            this.alterForm = {
              updateMsg: "",
              version: "",
              type: 2,
              status: 0,
              versionUrl: "https://apps.apple.com/cn/app/%E5%8E%9F%E5%B0%9Ae%E5%AE%B6/id1505279319"
            };
            this.showAll();
          } else {
            this.$message.error(data.data.msg);
          }
        });
      } else {
        insertAppInfo(this.alterForm).then(data => {
          if (data.data.status == 200) {
            this.$message({ type: "success", message: "添加版本成功" });
            this.editionVisible = false;
            this.alterForm = {
              updateMsg: "",
              version: "",
              type: 2,
              status: 0,
              versionUrl: "https://apps.apple.com/cn/app/%E5%8E%9F%E5%B0%9Ae%E5%AE%B6/id1505279319"
            };
            this.showAll();
          } else {
            this.$message.error(data.data.msg);
          }
        });
      }
    },
    /* 删除版本号 */
    deleteEdition(rows) {
      this.$confirm("此操作将删除该版本, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteAppInfo(rows.id).then(data => {
            if (data.data.status == 200) {
              // this.selectByKwd("delete");
              this.showAll();
              this.$message({ type: "success", message: "删除成功" });
            } else {
              this.$message.error(data.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchInput = "";
      this.searchEdition = "";
      this.selectByKwd("clear");
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput != "" || this.searchEdition != "") {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getAppInfoList(Number.isInteger(val.page) ? val.page : 1, {
        pageSize: 20,
        updateMsg: this.searchInput ? this.searchInput : null,
        version: this.searchEdition ? this.searchEdition : null
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
          this.$message({ message: "已执行查询", type: "success" });
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.editionList = data.data.content.list;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageNum;
      this.size = data.data.content.pageSize;
    },
    showAll(val) {
      getAppInfoList(Number.isInteger(val) ? val : 1, { pageSize: 20 }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    }
  },
  components: { paginationCom }
};
</script>

<style lang='less'>
#edition_idx {
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
