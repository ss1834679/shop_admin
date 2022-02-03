<template>
  <div id="popular_recommend">
    <!-- 人气推荐 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">人气推荐</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span class="s-size">请输入:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="推荐标题" v-model="searchTitle" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-select v-model="searchStatus" @change="selectByKwd" placeholder="推荐状态" clearable>
              <el-option label="未推荐" :value="0"></el-option>
              <el-option label="推荐中" :value="1"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div class="se-right">
            <div class="box-r">
              <el-button plain @click="addPopular({type:'good'})" size="small">选择商品</el-button>
            </div>
            <div class="box-r">
              <el-button plain @click="addPopular({type:'ins'})" size="small">选择灵感</el-button>
            </div>
            <div class="box-r">
              <el-button plain @click="addPopular({type:'art'})" size="small">选择文章</el-button>
            </div>
          </div>
        </div>
        <el-table :data="popularList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="编号" width="135"></el-table-column>
          <el-table-column prop="title" label="推荐名称"></el-table-column>
          <el-table-column prop="sort" align="center" label="排序"></el-table-column>
          <el-table-column prop="statue" align="center" label="是否推荐">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.status" @changeValue="(value)=>{changeStatus(value,scope.row)}"></switch-com>
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status==0">未推荐</span>
              <span v-if="scope.row.status==1">推荐中</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterPopular(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" @click="deletePopular(scope.row)">删除</el-button>
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

        <el-dialog title="添加人气推荐" :visible.sync="addVisible" @close="closeForm">
          <el-form label-width="120px" :rules="addFormRules" :model="addForm" ref="addForm">
            <el-form-item label="标题" prop="title">
              <el-input v-model="addForm.title"></el-input>
            </el-form-item>
            <el-form-item label="左角标" prop="subtitle">
              <el-input v-model="addForm.subtitle"></el-input>
            </el-form-item>
            <el-form-item label="右脚标" prop="describ">
              <el-input v-model="addForm.describ"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model.number="addForm.sort"></el-input>
            </el-form-item>
            <el-form-item label="选择商品" v-if="addType==1" prop="contentId">
              <div class="searchBar">
                <div class="search_box">
                  <el-select
                    v-model="addForm.contentId"
                    filterable
                    remote
                    value-key="id"
                    :remote-method="selectGood"
                    placeholder="请选择商品(关键字搜索)"
                    clearable
                  >
                    <el-option v-for="item in searchGoodList" :key="item.id" :label="item.goodsTitle" :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="选择文章" v-if="addType==2" prop="contentId">
              <div class="searchBar">
                <div class="search_box">
                  <el-select
                    v-model="addForm.contentId"
                    filterable
                    remote
                    value-key="id"
                    :remote-method="selectArt"
                    placeholder="请选择文章(关键字搜索)"
                    clearable
                  >
                    <el-option v-for="item in searchArtList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="选择灵感" v-if="addType==3" prop="contentId">
              <div class="searchBar">
                <div class="search_box">
                  <el-select
                    v-model="addForm.contentId"
                    filterable
                    remote
                    value-key="id"
                    :remote-method="selectIns"
                    placeholder="请选择灵感(关键字搜索)"
                    clearable
                  >
                    <el-option v-for="item in searchInsList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="展示图片" prop="image">
              <upload-img
                v-if="showImg"
                @getimgArr="(imgarr)=>{this.addForm.image = imgarr}"
                :imgArr="this.addForm.image"
                :limit="1"
                :notMultiple="true"
              ></upload-img>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeForm">取 消</el-button>
            <el-button type="primary" @click="submitform('addForm')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList } from "../../api/good";
import {
  getPushMassage,
  addOrEditPushMassage,
  deletePushMassage,
  setPushMassageStatus
} from "../../api/indexRecommend";
import { getArticleListAll, getInspirationListAll } from "../../api/circle";
import switchCom from "../../components/switch";
import uploadImg from "../../components/uploadImg";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      batchValue: "" /* 批量操作的类型 */,
      options: [{ label: "批量删除", value: "delete" }],
      searchTitle: "" /* 推荐的标题 */,
      searchStatus: "" /* 推荐状态 */,
      popularList: [] /* 人气推荐的列表 */,
      searchGoodList: [] /* 搜索商品的列表 */,
      searchArtList: [] /* 搜索的文章列表 */,
      searchInsList: [] /* 搜索的灵感列表 */,
      addVisible: false,
      addType: null /* 1 商品 2 文章 3 灵感 */,
      showImg: true,
      cPage: 1,
      size: 20,
      total: 0,
      addFormRules: {
        title: [{ required: true, message: "请填写人气推荐标题" }],
        image: [{ required: true, message: "请上传人气推荐首页展示图片" }],
        contentId: [{ required: true, message: "请选择需要展示的内容" }]
      },
      addForm: {
        title: "" /* 标题 */,
        subtitle: "" /* 左角标 */,
        describ: "" /* 右脚标 */,
        contentId: "" /* 商品id 文章id 灵感id */,
        image: "" /* 首页展示图 */,
        sort: 0 /* 排序 */,
        type: "" /* 1 商品 2 文章 3 灵感 */
      }
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    addPopular(obj) {
      if (obj.type == "good") {
        this.addForm.type = "1";
        this.addType = 1;
      } else if (obj.type == "ins") {
        this.addForm.type = "3";
        this.addType = 3;
      } else if (obj.type == "art") {
        this.addForm.type = "2";
        this.addType = 2;
      }
      this.addVisible = true;
    },
    /* 编辑人气推荐 */
    alterPopular(rows) {
      this.$router.push({ name: "editPopular", query: { id: rows.id } });
    },
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    /* 关闭添加人气推荐 */
    closeForm() {
      this.addVisible = false;
      this.addForm = {
        title: "" /* 标题 */,
        subtitle: "" /* 左角标 */,
        describ: "" /* 右脚标 */,
        contentId: "" /* 商品id 文章id 灵感id */,
        image: "" /* 首页展示图 */,
        sort: 0 /* 排序 */,
        type: "" /* 1 商品 2 文章 3 灵感 */
      };
      this.refreshImg();
    },
    /* 提交添加 */
    submitform(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addOrEditPushMassage(this.addForm).then(data => {
            if (data.data.status == 200) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.addVisible = false;
              this.showAll();
            } else {
              this.$message.error("添加失败");
            }
          });
        } else {
          this.$message.error("请检查参数是否填写完整！！");
          return false;
        }
      });
    },
    /* 获取批量操作的id数组 */
    getSelection(val) {
      this.batchArr = []; /* 先置空 */
      val.forEach(item => {
        this.batchArr.push(item.id);
      });
    },
    /* 批量操作 判断是什么操作 */
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些推荐, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deletePushMassage(this.batchArr).then(data => {
              if (data.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "批量删除成功"
                });
                this.selectByKwd("delete");
              } else {
                this.$message.error("批量删除失败");
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
    },
    /* 删除人气推荐 */
    deletePopular(row) {
      this.$confirm("此操作将删除该首页人气推荐, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletePushMassage([row.id]).then(data => {
            if (data.data.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.selectByKwd("delete");
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 设置上线下线 */
    changeStatus(value, rows) {
      setPushMassageStatus(rows.id, value).then(data => {
        if (data.data.status == 200) {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.showAll();
        } else {
          this.$message.error("修改失败");
          this.showAll();
        }
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchTitle != "" || this.searchStatus != "") {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(obj) {
      getPushMassage({
        pageNo: obj.page ? obj.page : 1,
        status: this.searchStatus === "" ? null : this.searchStatus,
        title: this.searchTitle == "" ? null : this.searchTitle
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
          this.$message({
            type: "success",
            message: "已执行查询"
          });
        }
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getPushMassage({ pageNo: val ? val : 1 }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 通过商品名搜索 */
    selectGood(val) {
      if (val != "") {
        getGoodsList({ goodsTitle: val, pageNo: 1 }).then(data => {
          if (data.data.status == 0) {
            this.searchGoodList = data.data.data.data.list;
          }
        });
      }
    },
    /* 通过文章名搜索 */
    selectArt(val) {
      if (val != "") {
        getArticleListAll(val).then(data => {
          if (data.data.status == 0) {
            this.searchArtList = data.data.data;
          }
        });
      }
    },
    /* 通过文灵感名搜索 */
    selectIns(val) {
      if (val != "") {
        getInspirationListAll(val).then(data => {
          if (data.data.status == 0) {
            this.searchInsList = data.data.data;
          }
        });
      }
    },
    /* 渲染表格 */
    setView(data) {
      this.popularList = data.data.content.list;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageNum;
      this.size = data.data.content.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchTitle = "";
      this.searchStatus = "";
      this.showAll();
    }
  },
  components: { switchCom, uploadImg, paginationCom }
};
</script>

<style lang="less">
#popularRecommend {
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
