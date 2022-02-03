<template>
  <div id="reconciliationDetail">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        <span class="title">账单明细</span>
      </div>
      <!-- 筛选 -->
      <div class="content">
        <div class="data-top">
          <div class="title">
            {{new Date(reconciliation.billDate).getFullYear()}}年{{new Date(reconciliation.billDate).getMonth()+1}}月{{new Date(reconciliation.billDate).getDate()}}日财务明细
          </div>
          <div class="time">
            <div>账单ID:{{reconciliation.billId}}</div>
            <div>账单周期:{{reconciliation.billDate}} 00:00:00 至 {{reconciliation.billDate}} 23:59:59</div>
          </div>
          <div class="data-top-list">
            <div v-for="(item,index) in dataItemList" :key="index">
              <div>{{item.name}}</div>
              <div>{{item.money}}</div>
            </div>
          </div>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button size="small" @click="clearAll">清除</el-button>
            <el-button size="small" @click="searchInfo">搜索</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>订单编号：</span>
            <el-input placeholder="请输入订单编号" v-model="searchData.orderSn" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <span>流水编号：</span>
            <el-input placeholder="请输入流水编号" v-model="searchData.orderSerialNumber" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <span>店铺名称：</span>
            <el-input placeholder="请输入店铺名称" v-model="searchData.shopName" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <span>商品名称：</span>
            <el-input placeholder="请输入商品名称" v-model="searchData.goodsName" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <span>支付方式：</span>
            <el-select v-model="searchData.payType" placeholder="请选择支付方式" clearable>
              <el-option label="微信" :value="1"></el-option>
              <el-option label="支付宝" :value="2"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>收支类型：</span>
            <el-select v-model="searchData.revenueAndExpenditureType" placeholder="请选择收支类型" clearable>
              <el-option label="收入" :value="1"></el-option>
              <el-option label="支出" :value="2"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>对账状态：</span>
            <el-select v-model="searchData.reconciliationState" placeholder="请选择对账状态" clearable>
              <el-option label="未对账" :value="0"></el-option>
              <el-option label="已对账" :value="1"></el-option>
              <el-option label="异常" :value="2"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>开票状态：</span>
            <el-select v-model="searchData.billingStatus" placeholder="请选择开票状态" clearable>
              <el-option label="已开票" :value="0"></el-option>
              <el-option label="未开票" :value="1"></el-option>
            </el-select>
          </div>
          <div>
            <span>入账时间：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束">
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
              <el-dropdown>
                <el-button>
                  导入账单<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1" :disabled="pay == 0">
                    <el-upload
                            class="uploaddiv"
                            ref="incomeUpload"
                            :before-upload="beforeUpload"
                            action="/"
                            :limit="1"
                            :show-file-list='false'
                            :multiple="false"
                            :http-request="getHandleUpload"
                            :auto-upload="true">
                      <span >收入账单</span>
                    </el-upload>
                  </el-dropdown-item>
                  <el-dropdown-item command="2" :disabled="refund == 0">
                    <el-upload
                            class="uploaddiv"
                            ref="payUpload"
                            :before-upload="beforeUpload"
                            action="/"
                            :limit="1"
                            :show-file-list='false'
                            :multiple="false"
                            :http-request="handleUpload"
                            :auto-upload="true">
                      <span >支出账单</span>
                    </el-upload>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <el-table :data="orderList" border row-key="id" style="width: 100%">
            <el-table-column
                    v-for="(item,index) in dataHeadList"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    align="center"
                    :key="index">
            </el-table-column>
            <el-table-column prop="reconciliationState" align="center" label="对账状态" width="140">
              <template slot-scope="scope">
                <div>{{scope.row.reconciliationState}}</div>
                <el-button type="text" size="medium" @click="viewOrder(scope.row)">修改</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="billingStatus" align="center" label="开票状态" width="140">
              <template slot-scope="scope">
                <switch-com :boolen="scope.row.billingStatus === '已开票'" activeText="已开票" inactiveText="未开票" @changeValue="changeType(scope.row)"></switch-com>
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
    <el-dialog title="对账"
               :visible.sync="dialogFormVisible"
               :center="true"
               :show-close="false"
               width="580px"
               :append-to-body="true"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :fullscreen="false"
               :modal-append-to-body="false">
      <div class="loginClass">
        <div style="margin-top: 30px">
          <span>对账状态：</span>
          <el-radio-group v-model="radio">
            <el-radio label="0">未对账</el-radio>
            <el-radio label="1">已对账</el-radio>
            <el-radio label="2">异常</el-radio>
          </el-radio-group>
        </div>
        <div style="margin-top: 30px">
          <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="remarks">
          </el-input>
        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noSubInfo">取 消</el-button>
        <el-button type="primary" @click="subInfo">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title=""
               :visible.sync="dialogVisible"
               :center="true"
               width="580px"
               :append-to-body="true"
               :close-on-press-escape="false"
               :fullscreen="false"
               :modal-append-to-body="false">
      <div class="loginClass" style="margin-top: 30px" v-if="code == 0">
        <div style="text-align: center"><i class="el-icon-success" style="font-size: 100px;color: #00A950"></i></div>
        <div>对账完成</div>
        <div>已对账成功{{successNum}}条数据</div>
      </div>
      <!-- <div class="loginClass" style="margin-top: 30px" v-if="code == 1">
        <div style="text-align: center"><i class="el-icon-error" style="font-size: 100px;color: red"></i></div>
        <div>账单条目错误</div>
        <div>请检查导入的账单数据条目数量是否与今日收入或支出笔数一致</div>
      </div> -->
      <div class="loginClass" style="margin-top: 30px" v-if="code == 2">
        <div style="text-align: center"><i class="el-icon-error" style="font-size: 100px;color: red"></i></div>
        <div>账单数据错误</div>
        <div style="text-align: left">
          <div style="margin-top: 5px">错误可能原因：</div>
          <div style="margin-top: 5px">1、账单数据是否为第三方支付公司提供的当前账期数据</div>
          <div style="margin-top: 5px">2、收入数据须导入收入账单，支出数据须导入支出账单</div>
        </div>
      </div>
      <div class="loginClass" style="margin-top: 30px" v-if="code == 3">
        <div style="text-align: center"><i class="el-icon-warning" style="font-size: 100px;color: red"></i></div>
        <div>对账异常</div>
        <div class="excption" style="text-align: left">
          <div style="margin-top: 5px;text-align:center">已对账成功{{successNum}}条数据，{{noReconciliationNum}}未对账，其中{{abnormalNum}}条金额异常</div>
          <div class="leftright">
            <div class="left" v-if="abnormalNum!=0">
              <div style="margin-top: 5px">异常数据订单流水号</div>
              <ul style="margin-top: 5px;">
                <li v-for="(item,index) in abnormalInfo" :key="index">{{item}}</li>
              </ul>
            </div>
            <div class="right" v-if="noReconciliationNum!=0">
              <div style="margin-top: 5px">未对账订单流水号</div>
              <ul style="margin-top: 5px">
                <li v-for="(item,index) in noReconciliationInfo" :key="index">{{item}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 150px" type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getReconciliation,
    getDetailedList,
    getBillStatus,
    getImportButton,
    uploadImport,
    uploadIncomeImport,
    uploadStatus
  } from "../../api/finance";
  import paginationCom from "../../components/paginationCom";
  import switchCom from "../../components/switch";
  import { Message } from "element-ui"
export default {
  data() {
    return {
      dialogFormVisible:false,//弹框参数
      dialogVisible:false,//弹框参数
      reconciliation:{},//基本信息
      searchData:{ //查询参数
        date:'',//年月日
        orderSn:'',//订单编号
        orderSerialNumber:'',//订单流水号
        shopName:'',//店铺名称
        goodsName:'',//商品名称
        payType:'',//支付方式 1：微信 2：支付宝
        revenueAndExpenditureType:'',//收支类型 1，收入；2，支出
        reconciliationState:'',//对账状态 0.未对账；1.已对账；2.异常',
        billingStatus:'',//开票状态 0.未开票；1.已开票',
        startTime:'',//入账开始时间
        endTime:'',//入账结束时间
        pageNo: 1,
        pageSize: 20,
      },
      searchTime:[],/* 搜索的时间 */
      dataItemList:[
        {name:'本期期初',money:'￥0.00'},
        {name:'收入30笔',money:'￥0.00'},
        {name:'支出30笔',money:'￥0.00'},
        {name:'本期期末',money:'￥0.00'},
        {name:'已对账',money:'0笔'},
        {name:'未对账',money:'0笔'},
        {name:'异常',money:'0笔'}
      ],
      total:0,//数据总数
      size:20,//每页显示数量
      cPage:1,//默认页数
      dataHeadList:[
        {label:'收支类型',prop:'revenueAndExpenditureType',width:100},
        {label:'单据类型',prop:'documentType',width:150},
        {label:'订单编号',prop:'orderSn',width:200},
        {label:'收支金额',prop:'revenueAndExpenditureAmount',width:150},
        {label:'支付方式',prop:'payType',width:100},
        {label:'入账时间',prop:'entryTime',width:200},
        {label:'店铺名称',prop:'shopName',width:150},
        {label:'商品',prop:'goodsName',width:250},
        {label:'订单流水号',prop:'orderSerialNumber',width:150},
        {label:'对账时间',prop:'reconciliationTime',width:150},
        // reconciliationState 对账状态
        // billingStatus  开票状态
      ],
      orderList:[
        {id:'123sdfsdasas啊实打实大所阿萨德按时打算按时撒旦法电饭锅的地方'}
      ],//列表
      pay: 0,//收入标识
      refund: 0,//支出标识
      radio:'',//订单状态
      remarks:'',//备注
      payOrder:'',
      code:3,
      abnormalInfo:[],//异常订单
      noReconciliationInfo:[] /* 未对账订单 */,
      abnormalNum:0,//导入异常条数
      noReconciliationNum:0 /* 未对账数目 */,
      successNum:0,//导入成功条数
    };
  },
  created() {
    this.getTopData(this.$route.query.id);
  },
  methods: {
    //弹框取消
    noSubInfo(){
      this.payOrder ='';
      this.remarks ='';
      this.radio ='';
      this.dialogFormVisible = false
    },
    //弹框确定
    subInfo(){
      let obj={
        payOrder:this.payOrder,
        remarks:this.remarks,
        status:this.radio
      };
      uploadStatus(obj).then(data => {
        if (data.status == 200) {
          this.getDetailed(this.searchData);
          Message.success('修改成功');
          this.noSubInfo()
        }
      });

    },
    //上传文件之前的验证
    beforeUpload (file) {
      const directionName = file.name;
      const documentSuffix = directionName.substring(directionName.lastIndexOf("."), directionName.length);
      const documentSuffixLowerCase = documentSuffix.toLowerCase();
      const isExcel = ('.xls' === documentSuffixLowerCase || '.xlsx' === documentSuffixLowerCase);
      if(!isExcel){
        this.$message.error('只能上传excel文件，请重新上传');
      }
      return isExcel
    },
    //获取基本信息
    getTopData(id){
      let idObj={id:id};
      getReconciliation(idObj).then(data => {
        if (data.status == 200) {
          if(!!data.data.data){
            this.reconciliation = data.data.data;
            this.searchData.date = data.data.data.billDate;
            this.dataItemList[0].money = '￥' + (data.data.data.beginningOfThePeriod).toFixed(2);
            this.dataItemList[1].name = '收入' + data.data.data.totalOrders + '笔';
            this.dataItemList[1].money = '￥' + (data.data.data.totalRevenue).toFixed(2);
            this.dataItemList[2].name = '支出' + data.data.data.expenditureOrders + '笔';
            this.dataItemList[2].money = '￥' + (data.data.data.totalExpenditure).toFixed(2);
            this.dataItemList[3].money = '￥' + (data.data.data.endOfTerm).toFixed(2);
            this.dataItemList[4].money = data.data.data.reconciled + '笔';
            this.dataItemList[5].money = data.data.data.noReconciliation + '笔';
            this.dataItemList[6].money = data.data.data.abnormal + '笔';
            this.getDetailed(this.searchData)
            this.getImportFun(data.data.data.billDate)
          }
        }
      });
    },
    //获取导入状态
    getImportFun(data){
      let obj={
        billDate:data
      };
      getImportButton(obj).then(data => {
        if (data.status == 200) {
          this.pay = data.data.data.pay;
          this.refund = data.data.data.refund;
        }
      })
    },

    //获取基本信息列表
    getDetailed(obj){
      getDetailedList(obj).then(data => {
        if (data.status == 200) {
          if(!!data.data.data){
            this.total = data.data.data.total;
            this.orderList = data.data.data.list.map(item=>{
              return{
                ...item,
                revenueAndExpenditureAmount:'￥' + item.revenueAndExpenditureAmount,
                goodsName:item.goodsName + ', 规格：' +item.specifications+ '，数量：' + item.num
              }
            })
          }
        }
      })
    },
    //收入导入
    getHandleUpload(file){
      let obj={
        Date:this.reconciliation.billDate
      };
      uploadIncomeImport(obj, file.file).then(data => {
        if (data.data.status == 0) {
          this.code = data.data.data.code;
          this.dialogVisible = true;
          if(data.data.data.code == 0){
            this.successNum = data.data.data.successNum
          }else if(data.data.data.code == 3){
            this.abnormalInfo = data.data.data.abnormalInfo;
            this.noReconciliationInfo = data.data.data.noReconciliationInfo
            this.abnormalNum = data.data.data.abnormalNum;
            this.noReconciliationNum = data.data.data.noReconciliationNum
            this.successNum = data.data.data.successNum;
          }
        } else {
          this.$message.error(data.data.msg)
        }
        this.$refs.incomeUpload.clearFiles()
      });
    },
    //支出导入
    handleUpload(file){
      let obj={
        Date:this.reconciliation.billDate
      };
      uploadImport(obj, file.file).then(data => {
        if (data.data.status == 0) {
          this.code = data.data.data.code;
          this.dialogVisible = true;
          if(data.data.data.code == 0){
            this.successNum = data.data.data.successNum
          }else if(data.data.data.code == 3){
            this.abnormalInfo = data.data.data.abnormalInfo;
            this.noReconciliationInfo = data.data.data.noReconciliationInfo
            this.abnormalNum = data.data.data.abnormalNum;
            this.noReconciliationNum = data.data.data.noReconciliationNum
            this.successNum = data.data.data.successNum;
          }
        } else {
          this.$message.error(data.data.msg)
        }
        this.$refs.payUpload.clearFiles()
      });
    },
    // 跳转到订单详情页
    viewOrder(row) {
      this.dialogFormVisible = true;
      this.payOrder = row.orderSerialNumber;
      this.radio = row.reconciliationState === '未对账'?'0': row.reconciliationState === '已对账'?'1':'2';
      this.remarks = row.remarks
    },
    //选择分页
    changePage(val){
      this.cPage = val;
      this.searchData.pageNo = val;
      this.getDetailed(this.searchData)
    },
    //清除按钮
    clearAll(){
      this.searchData = { //查询参数
                date:'',//年月日
                orderSn:'',//订单编号
                orderSerialNumber:'',//订单流水号
                shopName:'',//店铺名称
                goodsName:'',//商品名称
                payType:'',//支付方式 1：微信 2：支付宝
                revenueAndExpenditureType:'',//收支类型 1，收入；2，支出
                reconciliationState:'',//对账状态 0.未对账；1.已对账；2.异常',
                billingStatus:'',//开票状态 0.未开票；1.已开票',
                startTime:'',//入账开始时间
                endTime:'',//入账结束时间
                pageNo: 1,
                pageSize: 20,
      };
      this.searchTime=[];
      this.searchData.date = this.reconciliation.billDate;
      this.getDetailed(this.searchData)
    },
    //搜索
    searchInfo(){
      this.searchData.startTime = this.searchTime[0] || '';
      this.searchData.endTime = this.searchTime[1] || '';
      this.getDetailed(this.searchData)
    },
    //切换开票状态
    changeType(row){
      let obj={
        payOrder:row.orderSerialNumber,
        status:row.billingStatus === '已开票'?0:1
      };
      getBillStatus(obj).then(data => {
        if (data.status == 200) {
          Message.success('修改成功');
          this.getDetailed(this.searchData)
        }
      })
    }

  },
  components: { paginationCom ,switchCom}
};
</script>

<style lang='less' scoped>
  /deep/ .el-dropdown{
    .el-button{
      padding: 10px 10px !important;
      font-size: 12px !important;
    }
  }
  .loginClass{
    text-align: center;
    >div{
      margin-top: 30px;
    }
    >div:nth-child(2){
      font-size: 20px;
      color: red;
    }
    .excption{
      .leftright{
        display: flex;
        justify-content: center;
      }
      ul{
        padding: 0;
        margin: 0;
        max-height: 300px;
        overflow: auto;
      }
      li{
        margin: 0;
      }
      .left{
        width: 160px;
        margin-right: 10px;
      }
      .right{
        width: 160px;
        margin-left: 10px;
      }
    }
  }
#reconciliationDetail {
  .box-card{
    .clearfix {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .data-top{
      border: 1px solid #f2f2f2;
      padding: 20px;
      margin-bottom: 20px;
      .title{
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      }
      .time{
        font-size: 14px;
        margin-top: 25px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .data-top-list{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 25px;
        >div{
          text-align: center;
          >div:last-child{
            margin-top: 5px;
            font-weight: bold;
          }
        }
      }
    }
  }

}
</style>