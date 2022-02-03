<template>
  <div id="designCompany_idx">
    <!-- 设计公司列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">设计公司</span>
        <el-button plain size="small" @click="addDesignCompany">添加设计公司</el-button>
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
            <span>公司名称：</span>
            <el-input placeholder="请输入公司名称" v-model="searchInput" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>联系人：</span>
            <el-input placeholder="请输入公司联系人" v-model="searchContractName" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div>
            <span>注册时间：</span>
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
        <div class="status">
          <el-tabs v-model="status" type="card">
            <el-tab-pane :label="'全部('+number.total+')'" name="all"></el-tab-pane>
            <el-tab-pane :label="'待审核('+number.wait+')'" name="0"></el-tab-pane>
            <el-tab-pane :label="'已通过('+number.pass+')'" name="1"></el-tab-pane>
            <el-tab-pane :label="'已拒绝('+number.refuse+')'" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <el-table :data="designCompanyList" border style="width: 100%" ref="designCompanyList">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="logo" label="公司logo" align="center">
            <template slot-scope="scope" v-if="scope.row.logo">
              <Thumbnail :image="scope.row.logo" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="公司名称"></el-table-column>
          <el-table-column prop="contacts" label="联系人" align="center"></el-table-column>
          <el-table-column prop="telephone" label="联系电话"></el-table-column>
          <el-table-column prop="designerNumber" label="设计师数量" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.designerNumber}}</div>
              <el-button type="text" @click="designDetail(scope.row)">设计师详情</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="灵感数量"></el-table-column>
          <el-table-column prop="updateTime" label="注册时间" align="center" width="100"></el-table-column>
          <el-table-column prop="isShow" label="显示" align="center" width="100">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.isShow" activeText="显示" inactiveText="隐藏" @changeValue="(value)=>{changeStatus(scope.row.id,value)}"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="审核" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status==0">待审核</div>
              <div v-if="scope.row.status==1">审核通过</div>
              <div v-if="scope.row.status==2">已拒绝</div>
              <el-button type="text" @click="checkDetail(scope.row)">审核详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" v-if="scope.row.status==0" @click="designCompanyCheck(scope.row)">审核</el-button>
                <el-button type="text" @click="designCompanyEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteDesiCompany(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
      <el-dialog title="设计师公司审核" :visible.sync="checkCompanyVisible">
        <el-form ref="checkCompanyForm" label-width="80px">
          <el-form-item label="公司名称:">
            <span>{{checkName}}</span>
          </el-form-item>
          <el-form-item label="审核:">
            <el-radio-group v-model="checkCompanyForm.status">
              <el-radio :label="1">审核通过</el-radio>
              <el-radio :label="2">审核不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="反馈详情:">
            <el-input type="textarea" v-model="checkCompanyForm.feedbackDetails"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCheck({type:'cancel'})">取 消</el-button>
          <el-button type="primary" @click="handleCheck({type:'confirm'})">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 设计师详情弹窗 -->
      <el-dialog title="设计师详情" :visible.sync="checkVisible" @close="designerdetailList=[]">
        <el-table :data="designerdetailList" border style="width: 100%">
          <el-table-column prop="id" align="center" label="序号"></el-table-column>
          <el-table-column prop="designerHead" align="center" label="头像">
            <template slot-scope="scope" v-if="scope.row.designerHead">
              <Thumbnail style="border-radius: 50%" :image="scope.row.designerHead" />
            </template>
          </el-table-column>
          <el-table-column prop="designerName" align="center" label="姓名"></el-table-column>
          <el-table-column prop="phone" align="center" label="电话"></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 审核详情 -->
      <el-dialog title="审核详情" :visible.sync="checkDetailsVisible" @close="checkDetailClose">
        <el-table :data="checkDetailList" border style="width: 100%">
          <el-table-column prop="auditTime" align="center" label="审核时间"></el-table-column>
          <el-table-column prop="operator" align="center" label="审核人员"></el-table-column>
          <el-table-column prop="status" align="center" label="审核结果">
            <template slot-scope="scope">
              <span v-if="scope.row.status==1">审核通过</span>
              <span v-if="scope.row.status==2">未通过</span>
            </template>
          </el-table-column>
          <el-table-column prop="feedbackDetails" align="center" label="反馈详情"></el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import paginationCom from "../../components/paginationCom";
import {
  getDesignerCompany,
  deleteDesignerCompany,
  designerdetailCompany,
  updateCompanyStatus,
  updateAuditCompany,
  getAuditCompany,
  getDesignerCompanyStatusNum
} from "../../api/designer";
import Thumbnail from "../../components/thumbnail";
import switchCom from "../../components/switch";
export default {
  components: { paginationCom, switchCom, Thumbnail },
  data() {
    return {
      designerdetailList: [] /*设计师详情列表 */,
      showImg: false /*是否回显图片 */,
      status: "all",
      searchInput: "" /* 搜索的城市运营中心名称 */,
      searchContractName: "" /* 搜索的城市运营中心联系人 */,
      searchTime: [] /*搜索时间 */,
      startTime: null /*搜索开始时间 */,
      endTime: null /*搜索结束时间 */,
      designCompanyList: [] /*返回的设计师公司数据列表 */,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      checkVisible: false /*设计师详情弹窗是否开启 */,
      deleteArr: [] /*批量删除数组 */,
      checkDetailsVisible: false,
      checkDetailList: [],
      checkCompanyVisible: false,
      checkName: "",
      checkCompanyForm: {
        companyId: "",
        feedbackDetails: "",
        status: 0
      },
      number: {
        total: 0,
        wait: 0,
        pass: 0,
        refuse: 0
      }
    };
  },
  watch: {
    // 监听搜索时间
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
    },
    status: {
      handler() {
        this.selectByKwd();
      }
    }
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // 修改状态
    changeStatus(id, value) {
      // 请求修改状态接口
      updateCompanyStatus({ companyId: id, isShow: value }).then(data => {
        if (data.data.status == 200) {
          this.$message({
            message: "状态修改成功",
            type: "success"
          });
          this.showAll();
        } else {
          this.$message({
            message: data.data.content.msg,
            type: "error"
          });
        }
      });
    },
    /* 编辑设计公司 */
    designCompanyEdit(rows) {
      this.$router.push({ name: "alter_designCompany", query: { id: rows.id, type: "2" } });
    },
    /* 添加设计公司 */
    addDesignCompany() {
      this.$router.push({ name: "add_designCompany", query: { type: "1" } });
    },
    // 设计师详情
    designDetail(rows, val) {
      this.checkVisible = true;
      // 获取设计师详情数据
      designerdetailCompany(rows.id, Number.isInteger(val) ? val : 1).then(data => {
        this.designerdetailList = data.data.content.list;
      });
    },
    designCompanyCheck(row) {
      console.log(row);
      this.checkCompanyVisible = true;
      this.checkCompanyForm.companyId = row.id;
      this.checkName = row.name;
    },
    handleCheck(obj) {
      if (obj.type == "cancel") {
        this.checkCompanyForm = {
          companyId: "",
          feedbackDetails: "",
          status: 0
        };
        this.checkCompanyVisible = false;
      } else if (obj.type == "confirm") {
        /* 接口 */
        if (this.checkCompanyForm.status == 1) {
          if (this.checkCompanyForm.feedbackDetails == "") {
            this.checkCompanyForm.feedbackDetails = "审核通过";
          }
          this.verify();
        } else if (this.checkCompanyForm.status == 2) {
          if (this.checkCompanyForm.feedbackDetails == "") {
            this.$message.error("请填写未通过理由！");
          } else {
            this.verify();
          }
        }
      }
    },
    verify() {
      updateAuditCompany(this.checkCompanyForm).then(data => {
        if (data.data.status == 200) {
          this.$message({ type: "success", message: "审核成功" });
          this.checkCompanyVisible = false;
          this.checkCompanyForm = {
            companyId: "",
            feedbackDetails: "",
            status: 0
          };
          this.selectByKwd("check");
          getDesignerCompanyStatusNum().then(data => {
            if (data.data.status == 200) {
              this.setNum(data);
            }
          });
        } else {
          this.$message.error("审核失败");
        }
      });
    },
    checkDetail(row) {
      getAuditCompany(row.id).then(data => {
        if (data.data.status == 200) {
          this.checkDetailList.push(data.data.content);
          this.checkDetailsVisible = true;
        }
      });
    },
    checkDetailClose() {
      this.checkDetailList = [];
    },
    /* 删除单个设计师公司 */
    deleteDesiCompany(rows) {
      this.deleteArr = [];
      this.deleteArr.push(rows.id);
      this.$confirm("此操作将删除该设计师公司, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 调接口 */
          deleteDesignerCompany(this.deleteArr).then(data => {
            if (data.data.status == 200) {
              this.$message({ type: "success", message: "删除成功" });
              this.selectByKwd("get");
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
      this.searchInput = "";
      this.searchContractName = "";
      this.searchTime = [];
      this.status = "all";
      this.showAll();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (
        this.searchInput !== "" ||
        this.searchContractName !== "" ||
        this.endTime !== null ||
        this.startTime !== null ||
        this.status != "all"
      ) {
        // 执行查询中的分页;
        this.selectByKwd(val);
      } else {
        // 执行全部中的分页;
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getDesignerCompany(Number.isInteger(val) ? val : 1, {
        pageSize: 20,
        name: this.searchInput == "" ? null : this.searchInput,
        contacts: this.searchContractName == "" ? null : this.searchContractName,
        registerTime: this.startTime,
        endTime: this.endTime,
        status: this.status == "all" ? null : Number.parseInt(this.status)
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.designCompanyList = data.data.content.list;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageNum;
      this.size = data.data.content.pageSize;
    },
    setNum(data) {
      this.number = data.data.content;
    },
    // 获取初始设计师列表数据
    showAll(val) {
      getDesignerCompany(Number.isInteger(val) ? val : 1, { pageSize: 20 }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
      getDesignerCompanyStatusNum().then(data => {
        if (data.data.status == 200) {
          this.setNum(data);
        }
      });
    }
  }
};
</script>

<style lang='less'>
#designCompany_idx {
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
