<template>
  <!-- 报价需求 -->
  <div id="offerDemand">
    <div class="topTitle flexRow">
      <span class="title">报价需求</span>
    </div>
    <div class="contentBox">
      <div class="flexRow topTitleSty">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选查询：</span>
        </div>
        <div class="flexRow itemCenter">
          <div class="marRight15" @click="claerSearch">清空搜索</div>
          <el-button @click="seachList">搜索</el-button>
        </div>
      </div>
      <div class="selectBox">
        <div class="topInput">
          <div class="flexRow flex1">
            <div class="flexRow">
              <span class="spanLabel">案例名：</span>
              <el-input v-model="commodityName" placeholder="案例名"></el-input>
            </div>
            <div class="flexRow">
              <span class="spanLabel">手机号码：</span>
              <el-input v-model="phoneNumber" placeholder="请输入"></el-input>
            </div>
            <div class="flexRow">
              <span class="spanLabel">联系状态：</span>
              <el-select v-model="contactStatusvalue" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div>
          <span>添加时间：</span>
          <el-date-picker
            v-model="submissionTime"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </div>
      </div>

      <div class="tableBox">
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          border
          :header-cell-style="thStyleFun"
          :cell-style="cellStyleFun"
          @selection-change="changeFn"
        >
          <el-table-column type="selection" width="70px"></el-table-column>
          <el-table-column label="编号" width="90px" type="index" :index="indexMethods"></el-table-column>
          <el-table-column prop="phone" label="手机号码"></el-table-column>
          <el-table-column label="户型图">
            <template slot-scope="scope">
              <Thumbnail :image="scope.row.houseTypeImg" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="报价案例名"></el-table-column>
          <el-table-column prop="village" label="小区"></el-table-column>
          <el-table-column label="面积" width="90px">
            <template slot-scope="scope">
              <span>{{scope.row.srcArea}}㎡</span>
            </template>
          </el-table-column>
          <el-table-column prop="style" label="风格"></el-table-column>
          <el-table-column label="联系状态" width="120">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.contactStatus" :active-value="1" :nactive-value="0" @change="stateChange(scope.row)"></el-switch>
              <span v-if="scope.row.contactStatus">已联系</span>
              <span v-else>未联系</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="journal" @click="openJournal(scope.row)">日志</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom flexRow">
        <div class="flexRow">
          <div>
            <el-select v-model="batchValue" placeholder="批量操作">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </div>
          <div>
            <el-button @click="sureChange">确定</el-button>
          </div>
        </div>
        <div>
          <el-pagination background layout="total,prev, pager, next,jumper" :total="total" :page-size="pageSize" @current-change="pageIndexChange"></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="联系状态修改日志" :visible.sync="dialogVisible" width="40%">
      <span>
        <el-table :data="journalData" border style="width: 100%">
          <el-table-column prop="createTime" label="时间"></el-table-column>
          <el-table-column prop="userName" label="修改人员"></el-table-column>
          <el-table-column prop="contactStatus" label="联系状态">
            <template slot-scope="scope">
              <span v-if="scope.row.contactStatus == 1">已联系</span>
              <span v-if="scope.row.contactStatus == 0">未联系</span>
            </template>
          </el-table-column>
        </el-table>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPriceList, changeState, getPriceJournalList } from "../../api/designer";
import Thumbnail from "../../components/thumbnail";
import { mapState } from "vuex";
export default {
  components: { Thumbnail },
  data() {
    return {
      options: [
        {
          value: "1",
          label: "已联系"
        },
        {
          value: "0",
          label: "未联系"
        }
      ],
      options1: [
        {
          value: "1",
          label: "批量标记为已联系",
          disabled: true
        },
        {
          value: "0",
          label: "批量标记为未联系",
          disabled: true
        }
      ],
      batchValue: "", //批量操作的值
      contactStatusvalue: "", //联系状态下拉框
      commodityName: "", //案例名
      phoneNumber: "", //手机号码
      submissionTime: "", //时间选择
      tableData: [],
      dialogVisible: false, //​联系状态修改日志弹框
      journalData: [], //日志弹框表格
      pageNum: 1, //当前页
      pageSize: 20, //当前页数量
      total: 0, //总数
      batchIdList: [], //批量操作id的列表
      statusList: [] //状态列表
    };
  },
  mounted() {
    this.initPriceList();
  },
  methods: {
    thStyleFun() {
      return "text-align:center;background:#f9fafc;";
    },
    cellStyleFun() {
      return "text-align:center";
    },
    //表格编号
    indexMethods(index) {
      return this.tableData.length - index;
    },
    //显示日志操作
    openJournal(dataRow) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        let id = dataRow.id;
        getPriceJournalList(id).then(data => {
          if (data.data.status == 200) {
            this.journalData = data.data.content;
          }
        });
      });
    },
    //获取列表数据
    initPriceList() {
      let designerObj = {
        name: this.commodityName || null,
        endTime: this.submissionTime[1] || null,
        phone: this.phoneNumber || null,
        startTime: this.submissionTime[0] || null,
        pageNo: this.pageNum,
        pageSize: this.pageSize,
        contactStatus: this.contactStatusvalue || null
      };
      getPriceList(designerObj).then(data => {
        if (data.data.status == 200) {
          this.tableData = data.data.content.list;
          this.total = data.data.content.total;
        }
      });
    },
    //通过条件筛选
    seachList() {
      this.pageNum = 1;
      this.initPriceList();
    },
    //列表当前页变化
    pageIndexChange(index) {
      this.pageNum = index;
      this.initPriceList();
    },
    //修改状态
    stateChange(row) {
      let ids = [];
      let status = row.contactStatus ? 1 : 0;
      ids.push(row.id);
      changeState(status, ids).then(data => {
        if (data.data.state == "Success") {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.validationStatus();
        } else {
          this.$message({
            message: "修改失败",
            type: "warning"
          });
          if (row.contactStatus == 1) {
            row.contactStatus = 0;
            return;
          }
          if (row.contactStatus == 0) {
            row.contactStatus = 1;
            return;
          }
        }
      });
    },
    changeFn(val) {
      this.batchIdList = [];
      this.statusList = [];
      val.forEach((item, index) => {
        this.statusList.push(item.contactStatus);
        this.batchIdList.push(item.id);
      });
      this.validationStatus();
    },
    //验证状态
    validationStatus() {
      this.$set(this.options1[0], "disabled", true);
      this.$set(this.options1[1], "disabled", true);
      let sumVal = this.statusList.reduce(function(sum, number) {
        return sum + number;
        //0是sum的初始化值
      }, 0);
      if (sumVal == 0 && this.batchIdList.length > 0) {
        this.$set(this.options1[0], "disabled", false);
      } else if (sumVal > 0 && sumVal < this.statusList.length) {
        this.$set(this.options1[0], "disabled", true);
        this.$set(this.options1[1], "disabled", true);
      } else if (sumVal == this.statusList.length && sumVal > 0) {
        this.$set(this.options1[1], "disabled", false);
      }
    },
    //确定修改
    sureChange() {
      let contacted = this.options1[0].disabled;
      let contact = this.options1[1].disabled;
      if (this.batchIdList.length > 0 && (contacted || contact)) {
        changeState(this.batchValue, this.batchIdList).then(data => {
          if (data.data.state == "Success") {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.batchValue = "";
            this.initPriceList();
          } else {
            this.$message({
              message: "修改失败",
              type: "success"
            });
          }
        });
      }
    },
    //清空搜索内容
    claerSearch() {
      this.contactStatusvalue = "";
      this.phoneNumber = "";
      this.submissionTime = "";
      this.commodityName = "";
    }
  }
};
</script>

<style lang="less">
.flexRow {
  display: flex;
  flex-direction: row;
}
.flex1 {
  flex: 1;
}
.itemCenter {
  align-items: center;
}
#offerDemand {
  .topTitle {
    padding: 5px 20px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
  }
  .topTitleSty {
    padding: 10px 20px;
    background: #f2f2f2;
    justify-content: space-between;
    align-items: center;
    .marRight15 {
      margin-right: 15px;
      color: #66b1ff;
      cursor: pointer;
      font-size: 14px;
    }
  }
  width: 100%;
  padding: 0;
  background: #fff;
  .contentBox {
    padding: 20px;
    .selectBox {
      border: 1px solid #ebeef5;
      padding: 20px 30px;
      .topInput {
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        .flexRow();
        .spanLabel {
          flex-shrink: 0;
        }
        > div {
          > div {
            margin-right: 50px;
          }
        }
        .flex1 {
          .flexRow {
            align-items: center;
          }
        }
      }
    }
    .tableBox {
      padding: 20px 0;
      .journal {
        color: rgb(26, 188, 156);
        cursor: pointer;
      }
    }
    .bottom {
      justify-content: space-between;
      align-items: center;
      .flexRow {
        align-items: center;
        > div {
          margin-right: 20px;
        }
      }
      /deep/ .el-pagination {
        margin: 0;
      }
    }
  }
}
</style>
