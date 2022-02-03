<template>
  <div id="designer_check">
    <!-- 设计师审核列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">设计师审核</span>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="请输入设计师姓名" v-model="searchInput" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <el-select v-model="searchLevel" @change="selectByKwd" placeholder="请选择等级" clearable>
              <el-option label="精英设计师" :value="1"></el-option>
              <el-option label="主任设计师" :value="2"></el-option>
              <el-option label="首席设计师" :value="3"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <el-select v-model="searchType" @change="selectByKwd" placeholder="请选择设计师来源" clearable>
              <el-option label="平台" :value="0"></el-option>
              <el-option label="入驻" :value="1"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="designerList" border style="width: 100%">
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="designerImage" align="center" label="设计师图片" width="100">
            <template slot-scope="scope" v-if="scope.row.designerImage">
              <Thumbnail :image="scope.row.designerImage" />
            </template>
          </el-table-column>
          <el-table-column label="设计师资料">
            <template slot-scope="scope">
              <div>昵称：{{scope.row.designerFullName}}</div>
              <div>姓名：{{scope.row.designerName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="价格(元/㎡)" width="100">
            <template slot-scope="scope">{{"¥"+(scope.row.designerPrice/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column label="标签" align="center" width="120">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.designerLevel==3" type="warning" effect="dark">首席设计师</el-tag>
              <el-tag v-if="scope.row.designerLevel==2" effect="dark">主任设计师</el-tag>
              <el-tag v-if="scope.row.designerLevel==1" type="info" effect="dark">精英设计师</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="designerWeight" label="排序"></el-table-column>
          <el-table-column prop="designerSale" label="销量"></el-table-column>
          <el-table-column prop="designerScore" label="评价"></el-table-column>
          <el-table-column prop="designerStatus" align="center" label="审核状态">
            <template slot-scope="scope">
              <span v-if="scope.row.designerStatus==-1">待审核</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="checkDesigner(scope.row)">审核</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        <el-dialog title="设计师审核" :visible.sync="checkVisible">
          <el-form ref="checkform" label-width="100px">
            <el-form-item label="设计师名称:">
              <span>{{checkName}}</span>
            </el-form-item>
            <el-form-item label="设计师审核:">
              <el-radio-group v-model="checkForm.resultType">
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="0">审核不通过</el-radio>
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
import { getDesignerList, approvalDesigner } from "../../api/designer";
import paginationCom from "../../components/paginationCom";
import Thumbnail from "../../components/thumbnail";
export default {
  data() {
    return {
      searchInput: "" /* 设计师姓名 */,
      searchType: "" /* 设计师来源 */,
      searchLevel: "" /* 设计师登记 */,
      designerList: [],
      checkForm: {
        designerId: "" /* 审核的id */,
        resultType: null /* 审核是否通过 */,
        message: null /* 未通过的备注 */
      } /* 审核表单 */,
      checkName: "" /* 审核的设计师名称 */,
      checkVisible: false,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    checkDesigner(row) {
      this.checkName = row.designerName;
      this.checkForm.designerId = row.id;
      this.checkVisible = true;
    },
    handleCheck(obj) {
      if (obj.type == "cancel") {
        this.checkForm = {
          designerId: "",
          resultType: null,
          message: ""
        };
        this.checkVisible = false;
      } else if (obj.type == "confirm") {
        approvalDesigner(this.checkForm).then(data => {
          if (data.data.status == 200) {
            this.showAll();
            this.$message({
              message: "审核成功",
              type: "success"
            });
          } else {
            this.$message.error("审核失败");
          }
          this.checkVisible = false;
          this.checkForm = {
            designerId: "",
            status: null,
            message: ""
          };
        });
      }
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchLevel = "";
      this.searchType = "";
      this.searchInput = "";
      this.showAll();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput != "" || this.searchType != "" || this.searchLevel != "") {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(obj) {
      getDesignerList(Number.isInteger(obj.page) ? obj.page : 1, {
        designerLevel: this.searchLevel || null,
        designerName: this.searchInput || null,
        designerType: Number.isInteger(this.searchType) ? this.searchType : null,
        designerStatus: 0,
        pageSize: this.size
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        } else {
          this.$message.error("搜索失败！");
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.designerList = data.data.content.list;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageNum;
      this.size = 20;
    },
    /*  */
    showAll(val) {
      getDesignerList(val || 1, { designerStatus: 0 }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    }
  },
  components: { paginationCom, Thumbnail }
};
</script>

<style lang='less'>
#designer_check {
  width: 100%;
  height: auto;

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

    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      .el-pagination {
        padding: 0;
        margin-top: 20px;
      }
    }
  }
}
</style>
