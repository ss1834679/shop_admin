<template>
  <div id="pro_list">
    <!-- 案例列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">案例列表</span>
        <el-button @click="addNewPro" size="small" plain>添加案例</el-button>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="text" @click="clearSearch">清空搜索</el-button>
            <el-button size="small" @click="showAll()">查询结果</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>案例标题：</span>
            <el-input placeholder="请输入案例标题" v-model="searchInput" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>作者：</span>
            <el-input placeholder="作者" v-model="searchAuthor" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>小区：</span>
            <el-input placeholder="小区名字" v-model="searchVillage" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>户型：</span>
            <el-input placeholder="户型" v-model="searchHouseType" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>风格：</span>
            <el-select v-model="searchStyleId" @change="showAll" filterable placeholder="请选择风格" clearable>
              <el-option v-for="item in styleList" :key="item.id" :label="item.title" :value="item.title"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>报价：</span>
            <el-select v-model="searchIsQuote" @change="showAll">
              <el-option label="全部" value="all"></el-option>
              <el-option label="已报价" :value="1"></el-option>
              <el-option label="未报价" :value="0"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>发布时间：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            ></el-date-picker>
          </div>
        </div>
        <el-table :data="projectList" border style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="houseTypeImg" align="center" label="户型图" width="80">
            <template slot-scope="scope" v-if="scope.row.houseTypeImg">
              <Thumbnail :image="scope.row.houseTypeImg" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" width="180"></el-table-column>
          <el-table-column prop="communityName" label="小区名称"></el-table-column>
          <el-table-column prop="floorPlanAddress" label="位置"></el-table-column>
          <el-table-column prop="specName" label="户型" width="70"></el-table-column>
          <el-table-column prop="style" label="风格"></el-table-column>
          <el-table-column prop="author" label="作者"></el-table-column>
          <el-table-column prop="createTime" label="发布时间"></el-table-column>
          <el-table-column align="center" label="显示" v-if="showSwitch" width="110">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.isShow" activeText="显示" inactiveText="隐藏" @changeBoolen="handleChangeStatus($event,scope.row.id)"></switch-com>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="sort" label="排序"></el-table-column>
          <el-table-column align="center" label="审核状态">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.approvalStatus==2">已拒绝</span>
                <span v-if="scope.row.approvalStatus==0">待审核</span>
                <span v-if="scope.row.approvalStatus==1">已通过</span>
              </div>
              <el-button type="text" @click="checkDetails(scope.row)">审核详情</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="报价">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.isQuote==1">已报价</span>
                <span v-if="scope.row.isQuote==0">未报价</span>
              </div>
              <el-button type="text" @click="quoteDetails(scope.row)">报价详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="相关">
            <template slot-scope="scope">
              <div>浏览：{{scope.row.browseCount}}</div>
              <div>报价：{{scope.row.quoteCount}}</div>
              <div>收藏：{{scope.row.realCollectCount}}</div>
              <!-- <div>预约：{{scope.row.consultCount}}</div> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterPro(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteproject(scope.row)">删除</el-button>
                <el-button type="text" @click="checkPro(scope.row)" v-if="checkButtonVisible">审核</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <div>
            <el-select v-model="batchValue" placeholder="批量操作">
              <el-option v-for="item in batchOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="disabled"></el-option>
            </el-select>
            <el-button @click="batchOperation">确认</el-button>
          </div>
          <pagination-com
            :total="total"
            :size="size"
            :cPage="cPage"
            :isChangeSize="true"
            @changeSizes="(val)=>{handleCurrentSize(val)}"
            @getJump="(val)=>{showAll({ page: val })}"
          ></pagination-com>
        </div>
        <el-dialog title="审核详情" :visible.sync="checkVisible" @close="closeCheck">
          <el-table :data="checkList" border style="width: 100%">
            <el-table-column prop="approvalTime" align="center" label="审核时间"></el-table-column>
            <el-table-column prop="approvalUser" align="center" label="审核人员"></el-table-column>
            <el-table-column prop="approvalStatus" align="center" label="审核结果">
              <template slot-scope="scope">
                <span v-if="scope.row.approvalStatus==1">审核通过</span>
                <span v-if="scope.row.approvalStatus==2">未通过</span>
                <span v-if="scope.row.approvalStatus==0">待审核</span>
              </template>
            </el-table-column>
            <el-table-column prop="approvalMsg" align="center" label="反馈详情"></el-table-column>
          </el-table>
        </el-dialog>
        <el-dialog title="案例审核" :visible.sync="checkProVisible" @close="handleCheck({type:'cancel'})">
          <el-form ref="checkform" label-width="80px">
            <el-form-item label="案例名称:">
              <span>{{checkName}}</span>
            </el-form-item>
            <el-form-item label="商品审核:">
              <el-radio-group v-model="checkForm.approvalStatus">
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="2">审核不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="反馈详情:">
              <el-input type="textarea" v-model="checkForm.approvalMsg"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCheck({type:'cancel'})">取 消</el-button>
            <el-button type="primary" @click="handleCheck({type:'confirm'})">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getAllQuoteByPage,
  setShowStatusPro,
  deleteQuoteIdBatch,
  getApprovalDetail,
  approvalQuote
} from "../../api/promanage";
import { getDecorateStyleList } from "../../api/setings";
import paginationCom from "../../components/paginationCom";
import Thumbnail from "../../components/thumbnail";
import switchCom from "../../components/switch";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      searchInput: "" /* 案例标题 */,
      searchAuthor: "" /* 作者 */,
      searchVillage: "" /* 小区名称 */,
      searchHouseType: "" /* 户型id */,
      searchStyleId: "" /* 风格id */,
      searchIsQuote: "all" /* 是否报价 */,
      searchTime: [],
      startTime: null,
      endTime: null,
      disabled: true,
      batchArr: [],
      batchValue: "",
      batchOptions: [{ label: "批量删除", value: "delete" }],
      showSwitch: true,
      checkVisible: false,
      checkName: "",
      checkForm: { approvalMsg: "", approvalStatus: null, id: "" },
      checkProVisible: false,
      checkList: [],
      projectList: [],
      styleList: [] /* 获取的风格列表 */,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  watch: {
    searchTime: {
      handler() {
        if (this.searchTime && this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
        } else {
          this.startTime = null;
          this.endTime = null;
        }
        this.showAll();
      }
    }
  },
  computed: {
    ...mapGetters({
      checkButtonVisible: "onGetIsManager"
    })
  },
  mounted() {
    this.showAll();
    getDecorateStyleList().then(data => {
      if (data.data.status == 0) {
        this.styleList = data.data.data;
      }
    });
  },
  methods: {
    /** 添加案例 */
    addNewPro() {
      this.$router.push({ name: "addProject" });
    },
    alterPro(rows) {
      this.$router.push({ name: "addProject", query: { id: rows.id } });
    },
    checkPro(rows) {
      this.checkName = rows.title;
      this.checkForm.id = rows.id;
      this.checkProVisible = true;
    },
    /* 点击提交审核 */
    handleCheck(obj) {
      if (obj.type == "cancel") {
        this.checkForm = { approvalMsg: "", approvalStatus: null, id: "" };
        this.checkProVisible = false;
      } else if (obj.type == "confirm") {
        /* 接口 */
        if (this.checkForm.approvalStatus == 1) {
          if (this.checkForm.approvalMsg == "") {
            this.checkForm.approvalMsg = "审核通过";
          }
          this.verify();
        } else if (this.checkForm.approvalStatus == 2) {
          if (this.checkForm.approvalMsg == "") {
            this.$message.error("请填写未通过理由！");
          } else {
            this.verify();
          }
        }
      }
    },
    verify() {
      approvalQuote(this.checkForm).then(data => {
        if (data.data.status == 0) {
          this.showAll();
          this.$message({ message: "审核成功", type: "success" });
        } else {
          this.$message.error("审核失败");
        }
        this.checkProVisible = false;
        this.checkForm = { approvalMsg: "", approvalStatus: null, id: "" };
      });
    },
    /** 报价详情 */
    quoteDetails(rows) {
      let routeUrl = this.$router.resolve({ name: "importalterquota", query: { id: rows.id, type: "newtag" } });
      window.open(routeUrl.href, "_blank");
    },
    /* 批量操作 */
    batchOperation() {
      if (this.batchValue == "delete") {
        this.deleteproject(this.batchArr);
      }
    },
    /** 获取批量id */
    getSelection(val) {
      this.batchArr = [];
      this.disabled = true;
      val.forEach(item => {
        this.batchArr.push(item.id);
      });
      this.batchArr.length > 0 && (this.disabled = false);
    },
    /* 打开审核详情 */
    checkDetails(row) {
      /* 获取审核信息 */
      getApprovalDetail(row.id).then(data => {
        if (data.data.status == 0) {
          this.checkList.push(data.data.data);
        }
      });
      this.checkVisible = true;
    },
    /* 关闭审核详情 */
    closeCheck() {
      this.checkList = [];
    },
    /* 删除案例 */
    deleteproject(rows) {
      this.$confirm("此操作将删除这个案例及相关数据，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids;
          if (rows instanceof Array) {
            ids = rows;
          } else {
            ids = [rows.id];
          }
          deleteQuoteIdBatch(ids).then(data => {
            if (data.data.status == 0) {
              this.showAll();
              this.$message({ message: data.data.data, type: "success" });
            } else {
              this.$message.error(data.data.data);
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchHouseType = "";
      this.searchVillage = "";
      this.searchAuthor = "";
      this.searchIsQuote = "all";
      this.searchInput = "";
      this.searchTime = [];
      this.startTime = null;
      this.endTime = null;
      this.showAll();
    },
    /* 页数改变 */
    handleCurrentSize(val) {
      this.size = val;
      this.showAll();
    },
    /* 渲染表格 */
    setView(data) {
      this.projectList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
      this.refreshSwitch();
    },
    showAll(obj = {}) {
      getAllQuoteByPage({
        pageNo: obj.page ? obj.page : 1,
        pageSize: this.size,
        author: this.searchAuthor == "" ? null : this.searchAuthor,
        communityName: this.searchVillage == "" ? null : this.searchVillage,
        endTime: this.endTime,
        startTime: this.startTime,
        style: this.searchStyleId == "" ? null : this.searchStyleId,
        isQuote: this.searchIsQuote == "all" ? null : this.searchIsQuote,
        specName: this.searchHouseType == "" ? null : this.searchHouseType,
        title: this.searchInput == "" ? null : this.searchInput
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 刷新 */
    refreshSwitch() {
      this.showSwitch = false;
      this.$nextTick(() => {
        this.showSwitch = true;
      });
    },
    /* 显示隐藏 */
    handleChangeStatus(event, id) {
      setShowStatusPro({ id: id, isShowStatus: event ? 1 : 0 }).then(data => {
        if (data.data.status == 0) {
          this.$message({ type: "success", message: data.data.data });
        } else {
          this.$message.error("修改失败");
        }
      });
    }
  },
  components: { paginationCom, switchCom, Thumbnail }
};
</script>

<style lang='less'>
#pro_list {
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
