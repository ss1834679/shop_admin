<template>
  <div id="topic_idx">
    <!-- 话题 列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">话题列表</span>
        <el-button plain @click="addTopic" size="small">添加话题</el-button>
      </div>
      <div class="content">
        <el-table :data="topicList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="编号" width="135"></el-table-column>
          <el-table-column prop="img" label="话题图标" align="center">
            <template slot-scope="scope" v-if="scope.row.img">
              <Thumbnail :image="scope.row.img" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="话题名称" align="center"></el-table-column>
          <el-table-column prop="articleNum" label="文章数量" align="center"></el-table-column>
          <el-table-column prop="collectionNum" label="收藏数" align="center"></el-table-column>
          <el-table-column prop="status" label="是否显示" align="center" width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="changeChaStatus(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterTopic(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" @click="deleteTopic(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <div>
            <el-select v-model="batchValue" placeholder="批量操作">
              <el-option v-for="(item,idx) in options" :key="idx" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button @click="batchOperation">确认</el-button>
          </div>
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
        <el-dialog title="修改话题" :visible.sync="channelVisible">
          <el-form ref="alterForm" label-width="80px">
            <el-form-item label="话题名称:">
              <el-input v-model="alterForm.name"></el-input>
            </el-form-item>
            <el-form-item label="话题图片:" v-if="this.alterForm.name">
              <upload-img @getimgArr="(imgarr)=>{this.alterForm.img = imgarr}" :imgArr="alterForm.img" :limit="1" :notMultiple="true"></upload-img>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleAlter({type:'cancel'})">取 消</el-button>
            <el-button type="primary" @click="handleAlter({type:'confirm'})">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
import Thumbnail from "../../components/thumbnail";
import paginationCom from "../../components/paginationCom";
import {
  getChannelAll,
  changeChannelStatus,
  insertOrUpdateChannel,
  deleteChannel,
  deleteChannelBatch
} from "../../api/circle";
export default {
  data() {
    return {
      batchArr: [] /* id 数组 */,
      batchValue: "" /* 批量操作的类型 */,
      options: [{ label: "批量删除", value: "delete" }] /* 批量操作的类型 */,
      topicList: [],
      alterForm: {
        id: "",
        name: "" /* 话题名称 */,
        img: "" /* 话题图标 */
      } /* 编辑话题 */,
      channelVisible: false,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 10 /* 单页数量 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 批量操作 */
    batchOperation() {
      if (this.batchValue == "delete") {
        this.$confirm("此操作将删除这些话题, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteChannelBatch({ idList: this.batchArr }).then(data => {
              if (data.status == 200) {
                this.showAll();
                this.$message({
                  message: "批量删除话题成功",
                  type: "success"
                });
              } else {
                this.$message.error("批量删除话题失败");
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
    },
    /* 批量操作id获取 */
    getSelection(val) {
      this.batchArr = []; /* 先置空 */
      val.forEach(item => {
        this.batchArr.push(item.id);
      });
    },
    deleteTopic(row) {
      /* 删除单个话题 */
      this.$confirm("此操作将删除该话题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteChannel(row.id).then(data => {
            if (data.status == 200) {
              this.showAll();
              this.$message({
                message: "删除话题成功",
                type: "success"
              });
            } else {
              this.$message.error("删除话题失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 改变话题的状态 */
    changeChaStatus(row) {
      changeChannelStatus(row.id).then(data => {
        if (data.status == 200) {
          this.$message({
            type: "success",
            message: "修改成功"
          });
        } else {
          this.showAll();
          this.$message.error("修改失败");
        }
      });
    },
    /* 编辑话题 */
    alterTopic(rows) {
      // this.$router.push({ name: "ad_alter", params: { data: rows } });
      this.alterForm = JSON.parse(JSON.stringify(rows));
      this.channelVisible = true;
    },
    handleAlter(obj) {
      if (obj.type == "cancel") {
        this.channelVisible = false;
        this.alterForm = {};
      }
      if (obj.type == "confirm") {
        insertOrUpdateChannel(this.alterForm).then(data => {
          if (data.status == 200) {
            this.alterForm = {};
            this.channelVisible = false;
            this.showAll();
            this.$message({
              type: "success",
              message: "修改成功"
            });
          } else {
            this.$message.error("修改失败");
          }
        });
      }
    },
    /* 添加话题 */
    addTopic() {
      this.$router.push({ name: "topic_add" });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      //执行全部中的分页
      this.showAll(val);
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getChannelAll(val || 1, 20).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.topicList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    }
  },
  components: { uploadImg, paginationCom, Thumbnail }
};
</script>

<style lang="less">
#topic_idx {
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

    .isOnline.el-tag {
      cursor: pointer;
    }

    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
