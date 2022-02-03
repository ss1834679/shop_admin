<template>
  <div id="trimorderlist">
    <!-- 装修订单 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">装修订单</span>
        <el-button @click="addTrimOrder" v-if="butlerVisible">创建装修订单</el-button>
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
            <span>状态：</span>
            <el-select v-model="searchStatus" @change="showAll" placeholder="请选择状态" clearable>
              <el-option v-for="item in statusList" :key="item.id" :label="item.flagDesc" :value="item.flagCode"></el-option>
            </el-select>
          </div>
        </div>
        <el-table :data="trimOrderList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column label="业主" align="center" width="110">
            <template slot-scope="scope">
              <div v-if="scope.row.ownerName&&scope.row.ownerPhone">
                <p>{{scope.row.ownerPhone}}</p>
                <p>{{scope.row.ownerName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="管家" align="center" width="110">
            <template slot-scope="scope">
              <div v-if="scope.row.keeperName&&scope.row.keeperPhone">
                <p>{{scope.row.keeperPhone}}</p>
                <p>{{scope.row.keeperName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="项目经理" align="center" width="110">
            <template slot-scope="scope">
              <div v-if="scope.row.pmName&&scope.row.pmPhone">
                <p>{{scope.row.pmPhone}}</p>
                <p>{{scope.row.pmName}}</p>
              </div>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="villageTitle" label="小区名称" align="center" min-width="100"></el-table-column>
          <el-table-column prop="houseNumber" label="门牌号" align="center"></el-table-column>
          <el-table-column label="户型" align="center">
            <template slot-scope="scope">
              <span>{{`${scope.row.roomNum?scope.row.roomNumDesc:""}${scope.row.hallNum?scope.row.hallNumDesc:""}${scope.row.toiletNum?scope.row.toiletNumDesc:""}`}}</span>
            </template>
          </el-table-column>
          <el-table-column label="面积" align="center">
            <template slot-scope="scope">{{scope.row.acreage}}㎡</template>
          </el-table-column>
          <el-table-column prop="styleDesc" label="风格" align="center"></el-table-column>
          <el-table-column label="定金" align="center">
            <template slot-scope="scope">
              <span style="color:red">¥{{(scope.row.earnestMoney/100).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.decoratePrice" style="color:red">¥{{(scope.row.decoratePrice/10000).toFixed(2)}}万</span>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column label="位置" align="center">
            <template slot-scope="scope">
              <span>{{`${scope.row.villageProvince?scope.row.villageProvince:""}${scope.row.villageCity?scope.row.villageCity:""}${scope.row.villageDistrict?scope.row.villageDistrict:""}`}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="decorateProcessTitle" label="使用装修流程" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.decorateProcessTitle">{{scope.row.decorateProcessTitle}}</span>
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="状态" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.endStatus==1">
                <span style="color:red">装修终止</span>
              </p>
              <p v-else>
                <span v-if="scope.row.orderStatus==1" style="color:red">订单创建</span>
                <!-- <span v-if="scope.row.orderStatus==2" style="color:red">已下定</span> -->
                <span v-if="scope.row.orderStatus==3" style="color:red">已确定方案</span>
                <span v-if="scope.row.orderStatus==4" style="color:red">已配置流程</span>
                <span v-if="scope.row.orderStatus==5" style="color:red">已确定报价</span>
                <span v-if="scope.row.orderStatus==6" style="color:red">发起流程</span>
                <span v-if="scope.row.orderStatus==7" style="color:red">装修中</span>
                <span v-if="scope.row.orderStatus==8" style="color:red">装修完毕</span>
                <span v-if="scope.row.orderStatus==9" style="color:red">已确定签约</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="350">
            <template slot-scope="scope">
              <!-- 订单创建 -->
              <el-button-group v-if="scope.row.orderStatus==1" class="alterDel">
                <el-button type="text" v-if="butlerVisible" @click="confirmAlterPlan({row:scope.row,type:'confirm'})">确定方案</el-button>
                <el-button type="text" v-if="butlerVisible" @click="alterTrimOrder(scope.row)">编辑</el-button>
                <el-button type="text" v-if="butlerVisible" @click="handleDeleteTrimOrder(scope.row)">删除</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>
              <!-- <el-button-group v-if="scope.row.orderStatus==2" class="alterDel">
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>-->
              <!-- 已确定方案 -->
              <el-button-group v-if="scope.row.orderStatus==3" class="alterDel">
                <el-button type="text" v-if="butlerVisible" @click="confirmQuote({row:scope.row,type:'confirm'})">确定报价</el-button>
                <el-button type="text" v-if="butlerVisible" @click="confirmAlterPlan({row:scope.row,type:'alter'})">修改方案</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>
              <!-- 已确定报价 -->
              <el-button-group v-if="scope.row.orderStatus==5" class="alterDel">
                <el-button type="text" v-if="butlerVisible" @click="confirmSignup({row:scope.row,type:'confirm'})">确认签约</el-button>
                <el-button type="text" v-if="butlerVisible" @click="confirmQuote({row:scope.row,type:'alter'})">修改报价</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>
              <!-- 已确定签约 -->
              <el-button-group v-if="scope.row.orderStatus==9" class="alterDel">
                <el-button type="text" v-if="butlerVisible" @click="confirmSignup({row:scope.row,type:'alter'})">修改签约信息</el-button>
                <el-button type="text" v-if="operateVisible" @click="configTrimProcess({row:scope.row,type:'confirm'})">配置装修流程</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>
              <!-- 已配置流程 -->
              <el-button-group v-if="scope.row.orderStatus==4" class="alterDel">
                <el-button type="text" v-if="butlerVisible" @click="handleBulid({row:scope.row,type:'confirm'})">发起装修流程</el-button>
                <el-button type="text" v-if="operateVisible" @click="configTrimProcess({row:scope.row,type:'alter'})">修改装修流程</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>
              <!-- 发起流程 -->
              <el-button-group v-if="scope.row.orderStatus==6" class="alterDel">
                <el-button type="text" v-if="butlerVisible" @click="handleBulid({row:scope.row,type:'alter'})">修改施工信息</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>
              <!-- 装修中 -->
              <el-button-group v-if="scope.row.orderStatus==7" class="alterDel">
                <el-button type="text" v-if="managerVisible&&scope.row.endStatus==0" @click="handleTermination(scope.row)">终止装修</el-button>
                <el-button type="text" @click="handleAdditions(scope.row)">装修增项</el-button>
                <el-button type="text" @click="handleProfit(scope.row)">分账记录</el-button>
                <el-button type="text" @click="handleMaterial(scope.row)">装修资料</el-button>
                <el-button type="text" v-if="scope.row.contentComplaint" @click="handleAppeal(scope.row)">用户申诉</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>
              <!-- 装修完毕 -->
              <el-button-group v-if="scope.row.orderStatus==8" class="alterDel">
                <el-button type="text" @click="handleAdditions(scope.row)">装修增项</el-button>
                <el-button type="text" @click="handleProfit(scope.row)">分账记录</el-button>
                <el-button type="text" @click="handleMaterial(scope.row)">装修资料</el-button>
                <el-button type="text" v-if="scope.row.contentComplaint" @click="handleAppeal(scope.row)">用户申诉</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>
              <!-- 装修终止 -->
              <el-button-group v-if="scope.row.orderStatus==10" class="alterDel">
                <el-button type="text" @click="handleAdditions(scope.row)">装修增项</el-button>
                <el-button type="text" @click="handleProfit(scope.row)">分账记录</el-button>
                <el-button type="text" @click="handleMaterial(scope.row)">装修资料</el-button>
                <el-button type="text" v-if="scope.row.contentComplaint" @click="handleAppeal(scope.row)">用户申诉</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <Paginationcom :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
      </div>
      <el-dialog :visible.sync="signVisible" center width="500px" @close="handleCloseSign">
        <p>
          业务：
          <span v-html="signUser"></span>
        </p>
        <el-form :model="signForm" ref="signForm" :rules="signRules" label-position="top">
          <el-form-item label="签约信息：" prop="signInfo">
            <el-input type="textarea" :rows="4" v-model.trim="signForm.signInfo" placeholder="请输入签约相关信息，并说明装修款缴纳情况"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseSign">取 消</el-button>
          <el-button type="primary" @click="handleSubmitSign('signForm')">{{signAlter?'确定修改':'确定签约'}}</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getDecorateOrderPage,
  getDecorateDictOrderStatus,
  deleteDecorateOrder,
  updateDecorateOrderSignInfo,
  stopDecorateOrder
} from "../../../api/trim";
import Paginationcom from "../../../components/paginationCom";
import { mapGetters } from "vuex";
export default {
  components: { Paginationcom },
  data() {
    return {
      searchStatus: "" /* 搜索分类 */,
      statusList: [],
      trimOrderList: [],
      signVisible: false,
      signForm: {
        id: "",
        signInfo: ""
      },
      signRules: {
        signInfo: [
          { required: true, message: "请输入签约信息", trigger: "blur" },
          { max: 200, message: "签约信息不能大于200字", trigger: "change" }
        ]
      },
      signUser: "" /* 签约用户信息 */,
      signAlter: false,
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  mounted() {
    this.showAll();
    getDecorateDictOrderStatus().then(data => {
      if (data.data.status == 0) {
        this.statusList = data.data.data;
      }
    });
  },
  computed: {
    ...mapGetters({
      butlerVisible: "onGetIsButler",
      operateVisible: "onGetIsOperate",
      managerVisible: "onGetIsManager"
    })
  },
  methods: {
    handleCloseSign() {
      this.signVisible = false;
      this.signForm = {
        id: "",
        signInfo: ""
      };
      this.$refs.signForm.clearValidate();
    },
    handleSubmitSign(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateDecorateOrderSignInfo(this.signForm).then(data => {
            if (data.data.status == 0) {
              this.handleCloseSign();
              this.showAll();
              this.signAlter ? this.$message.success("修改签约信息成功") : this.$message.success("确认签约信息成功");
            } else {
              this.$message.error(data.data.msg);
            }
          });
        } else {
          this.$message.warning("请检查是否填完参数");
        }
      });
    },
    /* 创建装修订单 */
    addTrimOrder() {
      this.$router.push({ name: "editTrimOrder", params: { routerTitle: "创建装修订单", isAdd: true } });
    },
    /* 编辑装修订单 */
    alterTrimOrder(row) {
      this.$router.push({ name: "editTrimOrder", params: { routerTitle: "编辑装修订单" }, query: { id: row.id } });
    },
    /** 确定方案 修改方案 */
    confirmAlterPlan(obj) {
      if (obj.type == "confirm") {
        this.$router.push({
          name: "trimOrderDetail",
          params: { routerTitle: "确认方案" },
          query: { editPlan: true, id: obj.row.id }
        });
      } else if (obj.type == "alter") {
        this.$router.push({
          name: "trimOrderDetail",
          params: { routerTitle: "修改方案" },
          query: { editPlan: true, id: obj.row.id }
        });
      }
    },
    /** 确认签约 修改签约信息 */
    confirmSignup(obj) {
      this.signVisible = true;
      let { signInfo, id, ...rest } = obj.row;
      this.signForm = { signInfo, id };
      this.signUser = `${obj.row.ownerPhone}，${obj.row.ownerName}`;
      if (obj.type == "confirm") {
        this.signAlter = false;
      } else if (obj.type == "alter") {
        this.signAlter = true;
      }
    },
    /** 配置/修改装修流程 */
    configTrimProcess(obj) {
      if (obj.type == "confirm") {
        this.$router.push({
          name: "trimOrderDetail",
          params: { routerTitle: "配置装修流程" },
          query: { editProcess: true, id: obj.row.id }
        });
      } else if (obj.type == "alter") {
        this.$router.push({
          name: "trimOrderDetail",
          params: { routerTitle: "修改装修流程" },
          query: { editProcess: true, id: obj.row.id }
        });
      }
    },
    /** 确认/修改报价 */
    confirmQuote(obj) {
      if (obj.type == "confirm") {
        this.$router.push({
          name: "trimOrderDetail",
          params: { routerTitle: "确认报价" },
          query: { id: obj.row.id, editQuote: true }
        });
      } else if (obj.type == "alter") {
        this.$router.push({
          name: "trimOrderDetail",
          params: { routerTitle: "修改报价" },
          query: { id: obj.row.id, editQuote: true }
        });
      }
    },
    /** 发起装修流程 修改施工信息 */
    handleBulid(obj) {
      if (obj.type == "confirm") {
        this.$router.push({
          name: "trimOrderDetail",
          params: { routerTitle: "发起装修流程" },
          query: { editStart: true, id: obj.row.id }
        });
      } else if (obj.type == "alter") {
        this.$router.push({
          name: "trimOrderDetail",
          params: { routerTitle: "修改施工信息" },
          query: { editStart: true, id: obj.row.id }
        });
      }
    },
    /** 终止装修 */
    handleTermination(row) {
      this.$confirm("终止该装修订单后，该装修流程将停止不可推进，请慎重操作！确认终止吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      })
        .then(() => {
          stopDecorateOrder({ id: row.id }).then(data => {
            if (data.data.status == 0) {
              this.showAll();
              this.$message.success("终止成功");
            } else {
              this.$message.error("终止失败");
            }
          });
        })
        .catch(() => {});
    },
    /** 装修增项 */
    handleAdditions(row) {
      this.$router.push({ name: "trimAppendList", query: { orderId: row.id } });
    },
    /** 分账记录 */
    handleProfit(row) {
      this.$router.push({ name: "profitList", query: { orderId: row.id } });
    },
    /** 查看 */
    viewTrimOrder(row) {
      this.$router.push({
        name: "trimOrderDetail",
        params: { routerTitle: "查看装修订单" },
        query: { id: row.id }
      });
    },
    /** 装修资料 */
    handleMaterial(row) {
      this.$router.push({ name: "trimMaterialList", query: { id: row.id } });
    },
    /** 用户申诉 */
    handleAppeal(row) {
      this.$alert(`<p>${row.contentComplaint}</p><p style="text-align:right">${row.complaintTime}</p>`, "用户申诉", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        center: true
      });
    },
    handleDeleteTrimOrder(row) {
      this.$confirm("此操作将删除该装修订单，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDecorateOrder(row.id).then(data => {
            if (data.data.status == 0) {
              this.showAll({ page: this.cPage });
              this.$message.success("删除成功");
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    showAll(val = {}) {
      getDecorateOrderPage({
        orderStatus: this.searchStatus == "" ? undefined : this.searchStatus,
        pageNo: val.page ? val.page : this.cPage,
        pageSize: 20
      }).then(data => {
        this.trimOrderList = data.data.data.list;
        this.total = data.data.data.total;
        this.cPage = data.data.data.pageNum;
      });
    }
  }
};
</script>

<style lang='less'>
#trimorderlist {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
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