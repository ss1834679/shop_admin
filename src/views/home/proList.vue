<template>
  <div id="pro_list">
    <!-- 方案列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">方案列表</span>
        <el-button @click="addNewPro" size="small" plain>添加方案</el-button>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="text" @click="clearSearch">清空搜索</el-button>
            <el-button size="small" @click="selectByKwd()">查询结果</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>方案标题：</span>
            <el-input placeholder="请输入方案标题" v-model="searchInput" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>作者：</span>
            <el-input placeholder="作者" v-model="searchAuthor" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>小区：</span>
            <el-input placeholder="小区名字" v-model="searchVillage" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>户型：</span>
            <el-select v-model="searchHouseType" @change="selectByKwd" filterable placeholder="请选择户型" clearable>
              <el-option v-for="item in houseTypeList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>风格：</span>
            <el-select v-model="searchBrandId" @change="selectByKwd" filterable placeholder="请选择风格" clearable>
              <el-option v-for="item in styleList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>报价：</span>
            <el-select v-model="searchIsQuote" @change="selectByKwd">
              <el-option label="全部" value="all"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
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
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="goodsImage" align="center" label="户型图" width="80">
            <template slot-scope="scope" v-if="scope.row.goodsImage">
              <el-image :src="base+scope.row.goodsImage" style=" height: 40px" :preview-src-list="(base+scope.row.goodsImage).split(',')"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="goodsTitle" label="标题" width="280"></el-table-column>
          <el-table-column prop="saleNum" label="小区名称"></el-table-column>
          <el-table-column prop="goodsWeight" label="位置"></el-table-column>
          <el-table-column prop="goodsTitle" label="户型" width="280"></el-table-column>
          <el-table-column prop="saleNum" label="风格"></el-table-column>
          <el-table-column prop="goodsWeight" label="作者"></el-table-column>
          <el-table-column prop="goodsTitle" label="发布时间" width="280"></el-table-column>
          <el-table-column align="center" label="显示" v-if="showSwitch" width="110">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.goodsStatus" activeText="显示" inactiveText="隐藏" @changeBoolen="handleChangeStatus($event,scope.row.id)"></switch-com>
            </template>
          </el-table-column>
          <el-table-column align="center" label="审核状态">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.goodsStatus==2">待审核</span>
                <span v-if="scope.row.goodsStatus==-1">未通过</span>
                <span v-if="scope.row.goodsStatus==0">已下架</span>
                <span v-if="scope.row.goodsStatus==1">已审核</span>
              </div>
              <el-button type="text" @click="checkDetails(scope.row)">审核详情</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="报价">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.goodsStatus==2">已报价</span>
                <span v-if="scope.row.goodsStatus==-1">未报价</span>
              </div>
              <el-button type="text" @click="quoteDetails(scope.row)">报价详情</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="saleNum" label="相关">
            <template slot-scope="scope">
              <div>浏览：{{scope.row.saleNum}}</div>
              <div>报价：{{scope.row.saleNum}}</div>
              <div>预约：{{scope.row.saleNum}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterPro(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteGoods(scope.row)">删除</el-button>
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
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
        <el-dialog title="审核详情" :visible.sync="checkVisible" @close="closeCheck">
          <el-table :data="checkList" border style="width: 100%">
            <el-table-column prop="createTime" align="center" label="审核时间"></el-table-column>
            <el-table-column prop="operator" align="center" label="审核人员"></el-table-column>
            <el-table-column prop="resultType" align="center" label="审核结果">
              <template slot-scope="scope">
                <span v-if="scope.row.resultType==1">审核通过</span>
                <span v-if="scope.row.resultType==0">未通过</span>
              </template>
            </el-table-column>
            <el-table-column prop="message" align="center" label="反馈详情"></el-table-column>
          </el-table>
        </el-dialog>
        <el-dialog title="方案审核" :visible.sync="checkProVisible" @close="handleCheck({type:'cancel'})">
          <el-form ref="checkform" label-width="80px">
            <el-form-item label="方案名称:">
              <span>{{checkName}}</span>
            </el-form-item>
            <el-form-item label="商品审核:">
              <el-radio-group v-model="checkForm.status">
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="-1">审核不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="反馈详情:">
              <el-input type="textarea" v-model="checkForm.message"></el-input>
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
import { getGoodsList, getVerify, deleteGoods, updateGoodDown, updateGoodUp } from "../../api/good";
import paginationCom from "../../components/paginationCom";
import switchCom from "../../components/switch";
export default {
  data() {
    return {
      searchInput: "" /* 方案标题 */,
      searchAuthor: "" /* 作者 */,
      searchVillage: "" /* 小区名称 */,
      searchHouseType: "" /* 户型id */,
      searchIsQuote: "all" /* 是否报价 */,
      searchTime: [],
      startTime: null,
      endTime: null,
      batchArr: [],
      batchValue: "",
      batchOptions: [{ label: "批量删除", value: "delete" }],
      showSwitch: true,
      checkVisible: false,
      checkName: "",
      checkForm: {
        id: "",
        status: 0,
        message: ""
      },
      checkProVisible: false,
      checkButtonVisible: false,
      categoryOne: "",
      categoryTwo: "",
      categoryThree: "",
      checkList: [],
      projectList: [],
      styleList: [] /* 获取的品牌列表 */,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      base: "" /* 图片前ip */
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
      }
    }
  },
  beforeUpdate() {
    let boolen = false;
    if (
      this.$store.state.userinfo &&
      this.$store.state.userinfo.sysRoleList &&
      this.$store.state.userinfo.sysRoleList.length > 0
    ) {
      this.$store.state.userinfo.sysRoleList.forEach(item => {
        if (item.name.includes("管理员")) {
          boolen = true;
        }
      });
    }
    this.checkButtonVisible = boolen;
  },
  mounted() {
    this.base = this.$store.state.base_url;
    this.showAll();
  },
  methods: {
    /** 添加方案 */
    addNewPro() {
      this.$router.push({ name: "addProject" });
    },
    alterPro(rows) {
      this.$router.push({ name: "addProject", query: { id: rows.id } });
    },
    checkPro(rows) {
      this.checkName = rows.goodsTitle;
      this.checkForm.id = rows.id;
      this.checkProVisible = true;
    },
    /* 点击提交审核 */
    handleCheck(obj) {
      if (obj.type == "cancel") {
        this.checkForm = {
          id: "",
          status: null,
          message: ""
        };
        this.checkProVisible = false;
      } else if (obj.type == "confirm") {
        /* 接口 */
        if (this.checkForm.status == 1) {
          if (this.checkForm.message == "") {
            this.checkForm.message = "审核通过";
          }
          this.verify();
        } else if (this.checkForm.status == "-1") {
          if (this.checkForm.message == "") {
            this.$message.error("请填写未通过理由！");
          } else {
            this.verify();
          }
        }
      }
    },
    verify() {
      // verifyAssembleGoods(this.checkForm).then(data => {
      //   if (data.data.status == 0) {
      //     this.selectByKwd();
      //     this.$message({ message: "审核成功", type: "success" });
      //   } else {
      //     this.$message.error("审核失败");
      //   }
      //   this.checkgoodVisible = false;
      //   this.checkForm = {
      //     id: "",
      //     status: null,
      //     message: ""
      //   };
      // });
    },
    /** 报价详情 */
    quoteDetails(rows) {
      let routeUrl = this.$router.resolve({ name: "goods_view", query: { id: rows.id, type: "newtag" } });
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
      this.disableds = false;
      this.disabled = true;
      val.forEach(item => {
        this.batchArr.push(item.orderId);
        if (this.batchArr !== " " || this.batchArr !== null) {
          this.disabled = false;
        }
        if (item.orderStatus != "2") {
          this.disableds = true;
        }
      });
    },
    /* 打开审核详情 */
    checkDetails(row) {
      /* 获取审核信息 */
      getVerify({ id: row.id }).then(data => {
        this.checkList = data.data.data;
      });
      this.checkVisible = true;
    },
    /* 关闭审核详情 */
    closeCheck() {
      this.checkList = [];
    },
    /* 删除商品 */
    deleteproject(rows) {
      this.$confirm("此操作将删除这个方案及相关数据，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids;
          if (rows instanceof Array) {
            ids = rows;
          } else {
            ids = rows.id;
          }
          deleteGoods({ idStr: ids }).then(data => {
            if (data.data.status == 0) {
              this.selectByKwd(this.cPage, "delete");
              this.$message({ message: "删除方案成功", type: "success" });
            } else {
              this.$message.error("删除方案失败");
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
    /* 分页点击 */
    handleCurrentChange(val) {
      if (
        this.searchInput != "" ||
        this.searchIsQuote != "all" ||
        this.searchAuthor != "" ||
        this.searchHouseType != "" ||
        this.searchVillage != "" ||
        this.startTime != null
      ) {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val = {}, type) {
      getGoodsList({
        pageNo: val.page ? val.page : 1,
        author: this.searchAuthor == "" ? null : this.searchAuthor,
        village: this.searchVillage == "" ? null : this.searchVillage,
        isQuote: this.searchIsQuote == "all" ? null : this.searchIsQuote,
        title: this.searchInput == "" ? null : this.searchInput,
        houseType: this.searchHouseType == "" ? null : this.searchHouseType,
        startTime: this.startTime,
        endTime: this.endTime
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
          !type && this.$message({ message: "已执行查询", type: "success" });
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.projectList = data.data.data.data.list;
      this.total = data.data.data.data.total;
      this.cPage = data.data.data.data.pageNum;
      this.size = data.data.data.data.pageSize;
    },
    showAll(val) {
      getGoodsList({ pageNo: Number.isInteger(val) ? val : 1 }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 上下架 */
    handleChangeStatus(event, id) {
      if (event) {
        updateGoodUp(id).then(data => {
          if (data.data.status == 200) {
            this.$message({ type: "success", message: "上架成功" });
          } else {
            this.$message.error("上架失败");
            this.selectByKwd("", "update");
          }
        });
      } else {
        updateGoodDown(id).then(data => {
          if (data.data.status == 200) {
            this.$message({ type: "success", message: "下架成功" });
          } else {
            this.$message.error("下架失败");
            this.selectByKwd("", "update");
          }
        });
      }
    }
  },
  components: { paginationCom, switchCom }
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
