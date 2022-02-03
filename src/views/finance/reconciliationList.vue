<template>
  <div id="reconciliationList">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">对账列表</span>
        <el-button size="mini" @click="allList" icon="el-icon-refresh" style="margin-right:30px">刷新</el-button>
      </div>
      <!-- 筛选 -->
      <div class="content">
        <div class="data_list">
          <div class="list_box" v-for="(item,index) in topData" :key="index">
            <img src="../../../public/img/123dsfsds.png" v-if="index===0"/>
            <img src="../../../public/img/1231sa.png" v-else/>
            <div>
              <div>{{item.name}}</div>
              <div>￥{{item.data}}</div>
            </div>
          </div>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button size="small" @click="searchList()">搜索</el-button>
          </div>
        </div>
        <div class="search">
          <div>
            <span>账单日期：</span>
            <el-date-picker
                    v-model="searchTime"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div>
          <div class="se-content">
            <div>
              <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
              <span>数据列表</span>
            </div>
            <div class="se-right">
              <!-- <el-button @click="downLoadList">
                导出数据
              </el-button> -->
              <el-dropdown @command="downLoadList">
                <el-button size="small">
                  数据导出
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="all">全部数据</el-dropdown-item>
                  <el-dropdown-item command="search" :disabled="isSearch">筛选数据</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <el-table :data="orderList" border row-key="id" style="width: 100%">
            <el-table-column
                    v-for="(item,index) in dataHeadList"
                    :prop="item.prop"
                    :show-overflow-tooltip="true"
                    :label="item.label"
                    align="center"
                    :key="index">
            </el-table-column>
            <el-table-column prop="amoutPaid" align="center" label="操作" width="140">
              <template slot-scope="scope">
                <el-button type="text" size="medium" @click="viewOrder(scope.row)">明细</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="batchOperation">
            <pagination-com
                    :total="total"
                    :size="size"
                    :cPage="cPage"
                    :isChangeSize="false"
                    @getJump="changePage"
            ></pagination-com>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {
    getSettlementBalance,
    getTotalOrders,
    getTotalRevenueAmount,
    postReconciliationList,
    getExportReconciliationList,
    getTotalExpenditure,
    getTotalExpenditureAmount
  } from "../../api/finance";
  import { Message } from "element-ui"
  import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      topData:[
        {name:'结余金额',data:0},
        {name:'总收入1000笔',data:0},
        {name:'总支出1000笔',data:0},
      ],//顶部数据
      checked:false,//全选按钮
      total:0,//数据总数
      size:20,//每页显示数量
      cPage:1,//默认页数
      searchTime:[],/* 搜索的时间 */
      dataHeadList:[
        {label:'账单ID',prop:'billId'},
        {label:'日期',prop:'billDate'},
        {label:'本期期初',prop:'beginningOfThePeriod'},
        {label:'收入总额',prop:'totalRevenue'},
        {label:'收入笔数',prop:'totalOrders'},
        {label:'支出总额',prop:'totalExpenditure'},
        {label:'支出笔数',prop:'expenditureOrders'},
        {label:'本期期末',prop:'endOfTerm'},
      ],
      orderList:[
        {id:'123sdfsdasas啊实打实大所阿萨德按时打算按时撒旦法电饭锅的地方'},
      ]

    };
  },
  components: { paginationCom },
  created() {
    this.allList();
  },
  computed: {
    isSearch() {
      let boolean = true;
      if (this.searchTime && this.searchTime.length>0 ) {
        boolean = false;
      }
      return boolean;
    }
  },
  methods: {
    allList(){
      this.searchTime=[];
      this.getBalance();
      this.getOrders();
      this.getAmount();
      this.getExpenditure();
      this.getExpenditureAmount();
      this.getList()
    },
    //获取结余金额
    getBalance(){
      getSettlementBalance().then(data => {
        if (data.status == 200) {
          if(!!data.data.data){
            this.topData[0].data = (data.data.data).toFixed(2)
          }

        }
      });
    },
    //获取总收入笔数
    getOrders(){
      getTotalOrders().then(data => {
        if (data.status == 200) {
          if(!!data.data.data) {
            this.topData[1].name =  `总收入${data.data.data}笔`
          }
        }
      });
    },
    //获取总收入金额
    getAmount(){
      getTotalRevenueAmount().then(data => {
        if (data.status == 200) {
          if(!!data.data.data) {
            this.topData[1].data = (data.data.data).toFixed(2)
          }
        }
      });
    },
    //获取总支出笔数
    getExpenditure(){
      getTotalExpenditure().then(data => {
        if (data.status == 200) {
          if(!!data.data.data) {
            this.topData[2].name =`总支出${data.data.data}笔`
          }
        }
      });
    },
    //获取总支出金额
    getExpenditureAmount(){
      getTotalExpenditureAmount().then(data => {
        if (data.status == 200) {
          if(!!data.data.data) {
            this.topData[2].data = (data.data.data).toFixed(2)
          }
        }
      });
    },



    //获取对账列表
    getList(){
      let obj={
        startDate: this.searchTime[0] || '',
        endDate: this.searchTime[1] || '',
        pageNo: this.cPage,
        pageSize: 20,
      };
      postReconciliationList(obj).then(data => {
        if (data.status == 200) {
         this.total = data.data.data.total;
         this.orderList = data.data.data.list.map(item=>{
           return {
             ...item,
             billDate: new Date(item.billDate).getFullYear() + '-' + (new Date(item.billDate).getMonth()+1) +'-'+ new Date(item.billDate).getDate(),
             beginningOfThePeriod:'￥' + (item.beginningOfThePeriod).toFixed(2),
             totalRevenue:'￥' + (item.totalRevenue).toFixed(2),
             totalExpenditure:'￥' + (item.totalExpenditure).toFixed(2),
             endOfTerm:'￥' + (item.endOfTerm).toFixed(2),
           }
         });
        }
      });
    },
    // 跳转到订单详情页
    viewOrder(rows) {
      this.$router.push({ name: "reconciliationDetail", query: { id: rows.id } });
    },
    //选择页数
    changePage(val){
      this.cPage = val;
      this.getList();
    },

    //搜索按钮
    searchList(){
      if(this.searchTime.length == 0){
        Message.error('请选择筛选时间！！！')
        return false
      }
      this.getList()
    },
    //导出列表
    downLoadList(key){
      let times={
        startDate: this.searchTime[0] || '',
        endDate: this.searchTime[1] || '',
      };
      if (key=="all") {
        getExportReconciliationList().then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}对账信息导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      }else{
        getExportReconciliationList(times).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}对账信息导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      }
      
    }
  },
};
</script>

<style lang='less' scoped>
  /deep/ .el-table__header .el-table-column--selection .cell .el-checkbox:after{
    content: "";
  }
  /deep/ .el-dropdown{
    .el-button{
      padding: 10px 10px !important;
      font-size: 12px !important;
    }
  }
#reconciliationList {
  .box-card{
    .clearfix {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .content{
      .data_list{
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .list_box{
          padding: 30px 60px 30px 30px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          border: 1px solid #f2f2f2;
          margin-right: 50px;
          img{
            width: 50px;
            height: 50px;
            margin-right: 10px;
          }
          div{
            >div:first-child{
              font-size: 16px;
              color: #999999;
            }
            >div:last-child{
              margin-top: 5px;
              font-size: 20px;
              color: #666666;
            }
          }
        }
      }
    }
  }

}
</style>