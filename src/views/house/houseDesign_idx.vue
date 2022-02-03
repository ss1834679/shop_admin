<template>
  <div id="houseDesign_idx">
    <!-- 设计方案列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">设计方案列表</span>
        <el-button plain size="small" @click="addHouseDesign">添加全屋设计方案</el-button>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span style="font-size:13px;width:30%">方案名称:</span>
            <el-input placeholder="请输入方案名称" v-model="searchPackageNameInput" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span style="font-size:13px;width:20%">户型:</span>
            <el-cascader
              ref="houseTypeList"
              placeholder="请选择分类"
              v-model="searchHouseType"
              :props="props"
              :options="houseTypeList"
              :show-all-levels="false"
              @visible-change="elCascaderOnlick"
              @expand-change="elCascaderOnlick"
              @keyup.native.enter="selectByKwd"
              @change="selectByKwd"
              clearable
            ></el-cascader>
          </div>
          <div class="search_box">
            <span style="font-size:13px;width:20%">风格:</span>
            <el-select v-model="searchHouseStyle" placeholder="请选择风格" @keyup.native.enter="selectByKwd" @change="selectByKwd">
              <el-option v-for="item in houseStyleList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span style="font-size:13px;width:30%">审核状态:</span>
            <el-select v-model="reviewStatusValue" placeholder="请选择审核状态">
              <el-option v-for="item in reviewStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class style="  display: flex;  align-items: center;">
            <span style="font-size:13px;width:20%">时间:</span>
            <el-date-picker v-model="searchStartTime" type="date" @change="selectByKwd" value-format="yyyy-MM-dd" placeholder="请开始日期"></el-date-picker>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="tbinformationList" border style="width: 100%" row-key="id" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="name" label="方案名称" align="center"></el-table-column>
          <el-table-column prop="houseTypeName" label="户型"></el-table-column>
          <el-table-column prop="houseStyleName" label="风格" align="center"></el-table-column>
          <el-table-column prop="userName" label="创建者"></el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column prop="subscribeNum" label="预约数"></el-table-column>
          <el-table-column prop="updateTime" label="添加时间" align="center"></el-table-column>
          <el-table-column prop="status" label="显示" align="center">
            <template slot-scope="scope">
              <div style="display:flex;align-items: center;justify-content: center;">
                <switch-com :boolen="scope.row.status" @changeValue="(value)=>{changeStatus(scope.row.id,value)}"></switch-com>
                <div style="margin-left:10px" v-if="scope.row.status==1">显示</div>
                <div style="margin-left:10px" v-if="scope.row.status==0">隐藏</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="审核状态" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.status == '1'" >已审核</div>
              <div v-if="scope.row.status == '2'">待审核</div>
              <el-button type="text" size="medium" @click="reviewDetails(scope.row)">审核详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="tbinformationEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteArticel(scope.row)">删除</el-button>
                <el-button type="text" @click="checkDesign(scope.row)">审核</el-button>
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
      </div>
      <!-- 审核详情弹窗 -->
      <el-dialog title="审核详情" :visible.sync="checkVisible" @close="closeCheck">
        <el-table :data="approvalDetailList" border style="width: 100%">
          <el-table-column prop="approvalTime" align="center" label="审核时间"></el-table-column>
          <el-table-column prop="approvalUser" align="center" label="审核人员"></el-table-column>
          <el-table-column prop="approvalStatus" align="center" label="审核结果">
            <template slot-scope="scope">
              <span v-if="scope.row.approvalStatus==1">审核通过</span>
              <span v-if="scope.row.approvalStatus==0">未通过</span>
            </template>
          </el-table-column>
          <el-table-column prop="approvalMsg" align="center" label="反馈详情"></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 审核弹框 -->
      <el-dialog title="方案审核" :visible.sync="checkVisible2">
        <el-form ref="checkform" label-width="80px">
          <el-form-item label="方案标题:">
            <span>{{checkTitle}}</span>
          </el-form-item>
          <el-form-item label="资讯审核:">
            <el-radio-group v-model="checkForm.status">
              <el-radio label="1">审核通过</el-radio>
              <el-radio label="2">审核未通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="反馈详情:">
            <el-input type="textarea" v-model="checkForm.msg"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCheck({type:'cancel'})">取 消</el-button>
          <el-button type="primary" @click="handleCheck({type:'confirm'})">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../components/switch";
import {
  getAllHouseDetailByPage,
  getApprovalDetail,
  approvalHouseDetail,
  getAllUsableHouseType,
  isShowHouseDetail,
  deleteHouseDetail
} from "../../api/house";
import { getAllUsableDecorateStyle } from "../../api/setings";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    switchCom,
    paginationCom
  },
  data() {
    return {
      houseStyleList: [] /* 风格列表 */,
      houseTypeList: [] /* 户型分类列表 */,
      approvalDetailList: [] /* 审核详情弹框数据 */,
      reviewStatusValue: "" /* 搜索选择审核状态值 */,
      reviewStatus: [
        { label: "待审核", value: "待审核" },
        { label: "已审核", value: "已审核" }
      ] /* 搜索选择审核状态列表 */,
      searchPackageNameInput: "" /* 搜索的设计方案名称 */,
      searchHouseStyle: "" /* 搜索的设计方案风格 */,
      searchHouseType: "" /* 搜索的设计方案户型 */,
      searchStartTime: "" /* /* 搜索的设计方案开始时间 */,
      // searchEndTime: "" /* 搜索的设计方案结束时间 */,
      batchValue: "" /* 批量操作的类型 */,
      options: [{ label: "批量删除", value: "delete" }] /* 批量操作列列表 */,
      tbinformationList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      base: "" /* 图片前ip */,
      batchArr: [] /* 批量操作 id 数组 */,
      checkForm: {
        id: "" /* 审核对应的id */,
        status: "" /* 审核状态 */,
        msg: "" /* 审核反馈内容 */
      },
      checkTitle: "" /* 审核标题 */,
      tbinformationLists: {
        id: ""
      },
      props: {
        value: "id",
        label: "name",
        checkStrictly: true /* 子父不关联 */,
        disabled: "grade" /* 只能选择二级 */,
        multiple: false /* 多选 */,
        emitPath: false /* 只返回选中id */,
        children: "bos"
      } /* 级联选择配置 */,
      tbinformationId: "",
      checkVisible2: false /* 是否打开审核框 */,
      checkVisible: false /* 是否打开审核详情列表弹框 */
    };
  },
  watch: {},
  mounted() {
    this.base = this.$store.state.base_url;
    this.showAll();
    getAllUsableHouseType().then(data => {
      this.houseTypeList = data.data.data;
    });
    //  选择风格列表
    getAllUsableDecorateStyle().then(data => {
      this.houseStyleList = data.data.data;
    });
  },
  methods: {
    // 级联选择
    elCascaderOnlick() {
      let that = this;
      setTimeout(function() {
        document.querySelectorAll(".el-cascader-panel .el-radio").forEach(el => {
          el.onclick = function() {
            that.$refs.houseTypeList.dropDownVisible = false;
          };
        });
      }, 100);
    },
    //   打开审核详情弹框
    reviewDetails(rows) {
      this.checkVisible = true;
      getApprovalDetail({ id: rows.id }).then(data => {
        this.approvalDetailList.push(data.data.data);
      });
    },
    /* 关闭审核详情 */
    closeCheck() {
      this.checkList = [];
    },
    // 点击列表审核设计
    checkDesign(rows) {
      this.checkForm.id = rows.id;
      this.checkTitle = rows.name;
      this.checkVisible2 = true;
    },
    // 点击弹框的审核按钮
    handleCheck(obj) {
      if (obj.type == "cancel") {
        this.checkForm = {
          id: "",
          status: "",
          msg: ""
        };
        this.checkVisible2 = false;
      } else if (obj.type == "confirm") {
        /* 接口 */
        if (this.checkForm.status == "1") {
          if (this.checkForm.msg == "") {
            this.checkForm.msg = "审核通过";
          }
          this.verify();
        } else if (this.checkForm.status == "-1") {
          if (this.checkForm.msg == "") {
            this.$message.error("请填写未通过理由！");
          } else {
            this.verify();
          }
        }
      }
    },
    // 审核方法函数
    verify() {
      approvalHouseDetail({
        id: this.checkForm.id == "" ? null : this.checkForm.id,
        msg: this.checkForm.msg == "" ? null : this.checkForm.msg,
        status: this.checkForm.status == "" ? null : this.checkForm.status
      }).then(data => {
        if (data.data.status == 0) {
          this.showAll();
          this.$message({
            message: "审核成功",
            type: "success"
          });
        } else {
          this.$message.error("审核失败");
        }
        this.checkVisible2 = false;
        this.checkForm = {
          id: "",
          status: "",
          msg: ""
        };
      });
    },
    // switch开关状态
    changeStatus(id, value) {
      /* 改变状态 并重新请求 */
      isShowHouseDetail({ status: value, id: id }).then(data => {
        if (data.status == 200) {
          this.$message({
            message: data.data.data,
            type: "success"
          });
          this.showAll();
        } else {
          this.$message({
            message: data.data.msg,
            type: "error"
          });
        }
      });
    },
    // 编辑城市运营
    tbinformationEdit(rows) {
      this.$router.push({ name: "houseDesign_add", query: { id: rows.id, type: "2" } });
    },
    // 添加全屋设计方案
    addHouseDesign() {
      this.$router.push({ name: "houseDesign_add", query: { type: "1" } });
    },
    /* 批量操作 判断是什么操作 */
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些方案, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            deleteHouseDetail({ ids: this.batchArr }).then(data => {
              if (data.status == 200) {
                this.$message({
                  message: data.data.data,
                  type: "success"
                });
                this.showAll();
              } else {
                this.$message({
                  message: data.data.msg,
                  type: "error"
                });
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
    },
    /* 获取批量操作的id数组 */
    getSelection(val) {
      this.batchArr = []; /* 先置空 */
      val.forEach(item => {
        this.batchArr.push(item.id);
      });
    },
    /* 删除单个城市运营 */
    deleteArticel(rows) {
      this.batchArr.push(rows.id);
      this.$confirm("此操作将删除该方案, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 调接口 */
          deleteHouseDetail({ ids: this.batchArr }).then(data => {
            if (data.status == 200) {
              this.$message({
                message: data.data.data,
                type: "success"
              });
              this.showAll();
            } else {
              this.$message({
                message: data.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searsearchPackageNameInputchInput = "";
      this.searchHouseStyle = "";
      this.searchHouseStyle = "";
      this.searchStartTime = "";
      this.showAll();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (
        this.searchInput !== "" ||
        this.searchHouseStyle !== "" ||
        this.searchHouseStyle !== "" ||
        this.searchStartTime !== ""
      ) {
        // 执行查询中的分页;
        this.selectByKwd({ page: val });
      } else {
        // 执行全部中的分页;
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getAllHouseDetailByPage({
        pageSize: 20,
        pageNo: Number.isInteger(val) ? val : 1,
        name: this.searchPackageNameInput == "" ? null : this.searchPackageNameInput,
        houseStyleId: this.searchHouseStyle,
        houseTypeId: this.searchHouseType,
        time: this.searchStartTime
      }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.tbinformationList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pages;
      this.size = data.data.data.size;
    },
    // 获取初始的全屋设计方案列表数据
    showAll(val) {
      getAllHouseDetailByPage({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20
      }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    }
  }
};
</script>

<style lang='less'>
#houseDesign_idx {
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
      .search {
        /* 几个查询一起 */
        display: flex;
        flex-wrap: wrap;
        height: 123px;
        // justify-content: flex-start;
        margin-bottom: 15px;
        div.search_box {
          display: flex;
          align-items: center;
          margin-right: 6px;
          span {
            line-height: 40px;
          }
          .input-with-select {
            .el-input--suffix {
              .el-input__inner {
                width: 80px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
