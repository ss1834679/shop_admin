<template>
  <div id="order_idx">
    <!-- 订单列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">订单列表</span>
      </div>

      <!-- 筛选 -->
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="text" @click="clearSearch">清空搜索</el-button>
            <el-button size="small" @click="selectByKwd('select')">查询结果</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>订单编号：</span>
            <el-input placeholder="请输入订单编号" v-model="searchOrderSn" @keyup.native.enter="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <span>收货人：</span>
            <el-input placeholder="请输入收货人" v-model="searchNumber" @keyup.native.enter="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <span>订单类型：</span>
            <el-select v-model="searchOrderType" @change="selectByKwd" placeholder="请选择订单类型" clearable>
              <el-option label="普通订单" :value="1"></el-option>
              <el-option label="拼团订单" :value="2"></el-option>
            </el-select>
          </div>
          <div>
            <span>提交时间：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            ></el-date-picker>
            <!-- <el-date-picker v-model="startTime" type="date" @change="selectByKwd" value-format="yyyy-MM-dd" placeholder="请开始日期"></el-date-picker>-
            <el-date-picker v-model="endTime" type="date" @change="selectByKwd" value-format="yyyy-MM-dd" placeholder="请结束日期"></el-date-picker>-->
          </div>
          <div class="search_box" v-if="supplierShow">
            <el-select v-model="supplierId" filterable placeholder="请选择店铺(可搜索)">
              <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>

        <!-- 选择状态 -->
        <div class="status">
          <el-tabs v-model="status" type="card">
            <el-tab-pane :label="'全部订单(' + OrderByStatusCount.allNum + ')'" name="all"></el-tab-pane>
            <el-tab-pane :label="'待付款(' + OrderByStatusCount.obligationNum + ')'" name="1"></el-tab-pane>
            <el-tab-pane :label="'待发货(' + OrderByStatusCount.ordinaryNotYetShippedNum  + ')'" name="2"></el-tab-pane>
            <el-tab-pane :label="'已发货(' + OrderByStatusCount.waitForReceivingNum + ')'" name="3"></el-tab-pane>
            <el-tab-pane :label="'已完成(' + OrderByStatusCount.completeNum + ')'" name="4"></el-tab-pane>
            <el-tab-pane :label="'拼团中(' + OrderByStatusCount.massNotYetShippedNum  + ')'" name="5"></el-tab-pane>
            <el-tab-pane :label="'已取消(' + OrderByStatusCount.closed + ')'" name="6"></el-tab-pane>
          </el-tabs>
        </div>
        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div class="se-right">
            <!-- <div class="box-r">
              <el-button size="mini" disabled @click="addOrder">添加订单</el-button>
            </div>-->
            <!-- <div class="box-r">
              <el-button size="mini" @click="cocatOrder({ type: 'open' })">合并订单</el-button>
            </div>-->
            <!-- <div class="box-r">
              <el-button size="mini" @click="download({ type: 'open' })" disabled>下载配货单</el-button>
            </div>-->
            <!-- <div class="box-r">
              <el-button size="mini" @click="printdownload" disabled>打印发货单</el-button>
            </div>
            <div class="box-r">
              <el-button size="mini" @click="printDistribute({ type: 'open' })" disabled>打印快递单</el-button>
            </div>-->
            <div class="box-r">
              <el-button size="mini" @click="bulkShipment()" :disabled="disableds">批量发货</el-button>
            </div>
            <div class="box-r">
              <el-dropdown @command="exportOrderExcelClike">
                <el-button size="small">
                  导出订单
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="all">全部数据</el-dropdown-item>
                  <el-dropdown-item command="search" :disabled="isSearch">筛选数据</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <!-- 表格标题 -->
        <el-table :data="orderList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="orderSn" label="订单编号"></el-table-column>
          <el-table-column prop="recipient" label="收件人"></el-table-column>
          <el-table-column prop="createTime" label="下单时间"></el-table-column>
          <el-table-column prop="userAccount" label="用户账号"></el-table-column>
          <el-table-column prop="amoutPaid" label="订单金额" width="100">
            <template slot-scope="scope">
              {{
              "¥" + (scope.row.amoutPaid / 100).toFixed(2)
              }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="payType" align="center" label="支付方式" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.payType == '1'" type="success">微信</el-tag>
              <el-tag v-if="scope.row.payType == '2'">支付宝</el-tag>
              <el-tag v-if="scope.row.payType == '3'" type="warning">银联</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column prop="sourceType" align="center" label="订单来源" width="105">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.sourceType == '1'" effect="dark" type="info">WEB</el-tag>
              <el-tag v-if="scope.row.sourceType == '2'">APP</el-tag>
              <el-tag v-if="scope.row.sourceType == '3'" type="warning">微信公众号</el-tag>
              <el-tag v-if="scope.row.sourceType == '4'" type="success">微信小程序</el-tag>
              <el-tag v-if="scope.row.sourceType == '5'" style="color:white" color="#657180">H5手机页</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单状态" width="105" prop="orderStatus">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.orderStatus == '6'" effect="dark" type="danger">已取消</el-tag>
              <el-tag v-if="scope.row.orderStatus == '1'" effect="dark" type="info">待付款</el-tag>
              <el-tag v-if="scope.row.orderStatus == '2'" effect="dark" type="warning">待发货</el-tag>
              <el-tag v-if="scope.row.orderStatus == '3'" effect="dark">待收货</el-tag>
              <el-tag v-if="scope.row.orderStatus == '4'" effect="dark" type="success">已完成</el-tag>
              <!-- <el-tag v-if="scope.row.orderStatus == '4'" effect="dark" type="danger">退款中</el-tag> -->
              <el-tag v-if="scope.row.orderStatus == '5'" effect="dark" type="warning">拼团中</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单类型" width="105" prop="orderStatus">
            <template slot-scope="scope">
              <span v-if="scope.row.ordersType==1">普通订单</span>
              <span v-if="scope.row.ordersType==2">拼团订单</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="viewOrder(scope.row)">查看订单</el-button>
                <!-- 每一个阶段 不同的操作 已取消 -->
                <el-button v-if="scope.row.orderStatus == '6'" type="text" size="medium" @click="delOrder(scope.row )">删除订单</el-button>
                <!-- 待付款 -->
                <el-button v-if="scope.row.orderStatus == '1'" type="text" size="medium" @click="closeOrder({ type: 'open'}, scope.row )">关闭订单</el-button>
                <!-- 待发货 -->
                <el-button v-if="scope.row.orderStatus == '2'" type="text" size="medium" @click="tobulkShipment(scope.row )">订单发货</el-button>
                <!-- 待收货 -->
                <el-button
                  v-if="scope.row.orderStatus == '3'||scope.row.orderStatus == '4'"
                  type="text"
                  size="medium"
                  @click="toOrdertracking(scope.row )"
                >订单跟踪</el-button>
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
            @getJump="(val)=>{handleCurrentChange(val)}"
          ></pagination-com>
        </div>
      </div>
      <!-- 关闭订单弹窗框 -->
      <el-dialog title="关闭订单" :visible.sync="closeVisible">
        <el-form label-width="80px">
          <el-form-item label="操作备注" prop="cancelReasonText">
            <el-input type="textarea" v-model="orderListForm.cancelReasonText"></el-input>
          </el-form-item>
          <el-form-item>
            <template slot-scope>
              <div class="dialog-footer">
                <el-button @click="closeVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleCloseOrder()">确 定</el-button>
              </div>
            </template>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 合并订单弹框 -->
      <el-dialog title="合并订单" :visible.sync="closeVisible1">
        <div class="mo-content">
          <div style="color:#ccc;font-size:12px;">当两个订单不一致时，合并后的订单信息（如：支付方式、配送方式、活动优惠等）以主订单为准。</div>
          <div class="ca-order">
            <span style="width:100px">主订单：</span>
            <el-input v-model="mainOrderSn" placeholder="请输入主订单号"></el-input>
          </div>
          <div class="ca-order">
            <span style="width:100px">从订单：</span>
            <el-input v-model="fromOrderSn" placeholder="请输入从订单号"></el-input>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="restClick" plain>重置</el-button>
          <el-button type="primary" @click="mergeOrderClick({ type: 'close' })">合并</el-button>
        </div>
      </el-dialog>

      <!-- 下载配货单弹框 -->
      <el-dialog title="下载配货单" :visible.sync="closeVisible2">
        <div class="mo-content">
          <div class="ca-order">
            <el-button type="primary">订单配货单</el-button>
            <el-button type="primary">商品配货单</el-button>
          </div>
          <div style="color:#ccc;font-size:12px;margin-top:20px">导出内容只包括等待发货状态的订单</div>
          <div style="color:#ccc;font-size:12px;margin-top:20px">当两个订单不一致时，合并后的订单信息（如：支付方式、配送方式、活动优惠等）以主订单为准。</div>
        </div>
        <div slot="footer" class="dialog-footer"></div>
      </el-dialog>
      <!-- 打印快递单弹框 -->
      <el-dialog title="打印快递单" :visible.sync="closeVisible3">
        <div>
          <div class="mo-text">
            快递单总数：
            <span>2</span>
          </div>
          <div class="mode" id="orderRef" ref="orderRef">
            <el-form ref="provinceListForm" :model="provinceListForm" label-width="100px">
              <el-form-item label="发货选择">
                <el-select v-model="form.region" placeholder="请选择发货点">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发货人">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="选择区域">
                <div style="display:flex">
                  <div style="width:140px;">
                    <el-select v-model="provinceListForm.provinceId" placeholder="省" @change="changeProvince({level:1})" filterable clearable>
                      <el-option :label="item.criName" :value="item.criCode" v-for="item in provinceList" :key="item.id"></el-option>
                    </el-select>
                  </div>
                  <div style="width:140px;">
                    <el-select v-model="provinceListForm.cityId" placeholder="市" @change="changeProvince({level:2})" filterable clearable>
                      <el-option :label="item.criName" :value="item.criCode" v-for="item in cityList" :key="item.id"></el-option>
                    </el-select>
                  </div>
                  <div style="width:140px;">
                    <el-select v-model="form.region3" placeholder="区" @change="changeProvince({level:3})" filterable clearable>
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="详情地址">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="mo-text">选择快递单模板</div>
          <div class="mode2">
            <el-form ref="form" :model="form" label-width="120px">
              <el-form-item label="选择模板">
                <el-select v-model="form.region4" placeholder="选择模板">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="快递单起始编号">
                <el-input v-model="form.num"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <el-button type="primary" @click="preview">打印</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getOrderList,
  mergeOrder,
  GetOrderByStatusCount,
  deleteOrder,
  closeOrder,
  exportOrderExcelCon
} from "../../api/order";
import { getSupplierAll } from "../../api/supplier";
import { getProvinceList, getRegionList } from "../../api/usercenter";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      disableded: false,
      disabled: true /* 判断批量删除是否按钮禁用*/,
      disableds: false /* 判断是否按钮禁用*/,
      supplierShow: false /* 判断是否显示供应商列表*/,
      supplierList: [] /* 供应商列表*/,
      supplierId: "" /* 供应商id*/,
      mainOrderSn: "" /* 主订单输入值*/,
      fromOrderSn: "" /* 从订单输入值*/,
      //  关闭订单的操作备注
      // cancelReasonText: "",
      batchArr: [] /* 批量操作 id 数组 */,
      closeOrderId: "",
      // 返回的订单列表
      orderList: [],
      orderListForm: {
        orderId: "",
        cancelReasonText: ""
      },
      // 批量输入值
      batchValue: "",
      form: {
        name: "",
        region: "",
        region1: "",
        region2: "",
        region3: "",
        region4: "",
        num: ""
      },
      select: "不限",
      searchOrderSn: "" /* 订单id 搜索 */,
      searchNumber: "" /* 收货人/电话 搜索 */,
      searchOrderType: "" /* 搜索订单类型 */,
      searchTime: [] /* 搜索的时间 */,
      startTime: null /* 订单开始日期 搜索 */,
      endTime: null /* 订单结束日期 搜索 */,
      status: "all" /* 当前状态 大的筛选条件 */,
      ordersType: "1",
      closeVisible: false /* 关闭订单弹窗 */,
      closeVisible1: false /* 合并订单弹窗 */,
      closeVisible2: false /* 打印配货单弹窗 */,
      closeVisible3: false /* 打印快递单弹窗 */,
      // 返回的各个状态的数量
      OrderByStatusCount: {
        /* 各个状态的数量 */
        allNum: 0,
        cancelNum: 0,
        obligationNum: 0,
        ordinaryNotYetShippedNum: 0,
        waitForReceivingNum: 0,
        completeNum: 0,
        closed: 0,
        massNotYetShippedNum: 0
      },
      noteform: {
        text: "" /* 操作备注 */
      },
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      loading: false,
      // 批量删除按钮
      batchOptions: [{ label: "批量删除", value: "delete" }],
      value: "",
      // 订单选择框选择值
      cocatValue1: "",
      // 订单选择框选择值
      cocatValue: "",
      // 用户id
      userId: "1247009248715173890",
      // 省市列表
      provinceList: [],
      userInfo: "",
      // 城市列表
      cityList: [],
      // 区县列表
      countyList: [],
      // 省市级选择
      provinceListForm: {
        provinceId: "" /* 省级id */,
        cityId: "" /* 城市id */,
        countyId: "" /* 区县id */
      },
      orderIds: []
    };
  },
  computed: {
    isSearch() {
      let boolean = true;
      if (
        this.searchOrderSn != "" ||
        this.endTime != null ||
        this.startTime != null ||
        this.searchNumber !== "" ||
        this.status != "all" ||
        this.searchOrderType != ""
      ) {
        boolean = false;
      }
      return boolean;
    }
  },
  watch: {
    status: {
      /* 改变大的筛选条件 */
      handler() {
        this.selectByKwd("status");
      }
    },
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
    // 主订单
    // mainOrderInput() {
    //   this.mainOrderSn = this.mainOrderSn;
    // },
    // // 从订单
    // fromOrderInput() {
    //   this.fromOrderSn = this.fromOrderSn;
    // },
    // // 监听订单编号的搜索输入
    // searchOrderSn() {
    //   this.searchOrderSn = this.searchOrderSn;
    // },
    // // 监听搜索联系人和联系电话的输入
    // searchNumber() {
    //   this.searchNumber = this.searchNumber;
    // },
    // // 监听搜索时间输入
    // startTime() {
    //   this.startTime = this.startTime;
    // },
    // endTime() {
    //   this.endTime = this.endTime;
    // },
    "$store.state.userinfo": {
      handler() {
        this.userInfo = this.$store.state.userinfo;
        if (this.userInfo.sysCompany && this.userInfo.sysCompany.type == 1) {
          this.supplierShow = true;
        }
      }
    }
  },
  mounted() {
    // 查询订单各个状态的数量
    GetOrderByStatusCount().then(data => {
      this.OrderByStatusCount = data.data.data;
    });
    if (this.$route.query.status != undefined) {
      this.status = this.$route.query.status == undefined ? " " : this.$route.query.status;
    } else {
      this.showAll();
    }
    /**
     * 获取省直辖市地址列表
     */
    getProvinceList().then(data => {
      this.provinceList = data.data.content;
    });
    // 供应商列表
    getSupplierAll().then(data => {
      if (data.data.status == 200) {
        this.supplierList = data.data.content;
      }
    });
  },
  methods: {
    // 切换省市区
    changeProvince(obj) {
      if (obj.level == 2) {
        getRegionList(this.provinceListForm.provinceId).then(data => {
          this.cityList = data.data.content;
        });
        this.provinceListForm.cityId = "";
        this.provinceListForm.countyId = "";
        this.countyId = {};
        this.countyList = [];
      } else if (obj.level == 3) {
        getRegionList(this.provinceListForm.cityId).then(data => {
          this.countyList = data.data.content;
        });
        this.provinceListForm.countyId = "";
      }
    },
    // 导出订单
    exportOrderExcelClike(key) {
      if (key == "all") {
        exportOrderExcelCon({}).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}订单导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      } else if (key == "search") {
        exportOrderExcelCon({
          endTime: this.endTime,
          orderSn: this.searchOrderSn == "" ? null : this.searchOrderSn,
          orderStatus: this.status == "all" ? null : this.status,
          receive: this.searchNumber == "" ? null : this.searchNumber,
          startTime: this.startTime
        }).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}订单导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      }
    },
    // 打印
    preview() {
      var orderRefs = this.$refs.orderRef;

      var newContent = orderRefs.innerHTML;
      var oldContent = document.body.innerHTML;
      //赋值给body
      document.body.innerHTML = newContent;
      window.print();
      // 重新加载页面，以刷新数据。以防打印完之后，页面不能操作的问题
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    },
    // 重置
    restClick() {
      this.cocatValue = "";
      this.cocatValue1 = "";
    },
    // 跳转到添加订单页
    addOrder(rows) {
      this.$router.push({ name: "add_order", query: { id: rows.orderSn } });
    },
    // 跳转到批量发货页
    tobulkShipment(rows) {
      this.orderIds.push(rows.orderId);
      this.$router.push({ name: "bulk-shipment", query: { orderIds: this.orderIds } });
    },
    // 跳转到跟踪订单
    toOrdertracking(rows) {
      this.$router.push({
        name: "order_tracking",
        query: { expressNumber: rows.expressNumber, deliveryCode: rows.deliveryCode }
      });
    },
    // 跳转到打印发货单
    printdownload() {
      this.$router.push({ name: "print-order", query: { orderIds: this.batchArr } });
    },
    // 跳转到订单详情页
    viewOrder(rows) {
      this.$router.push({ name: "order_view", query: { id: rows.orderId } });
    },
    // 批量发货
    bulkShipment() {
      if (this.batchArr.length > 0) {
        this.$router.push({ name: "bulk-shipment", query: { orderIds: this.batchArr } });
      } else {
        this.$message({
          message: "请选择订单再发货"
        });
      }
    },

    // 弹框的关闭按钮
    closeOrder(obj1, rows) {
      // this.batchArr.push(rows.orderId);
      this.closeOrderId = rows.orderId;
      if (obj1.type == "open") {
        this.noteform = { text: "", info: obj1.obj1 };
        this.closeVisible = true;
      }
    },
    // 确定关闭订单按钮
    handleCloseOrder() {
      //关闭订单
      this.$confirm("此操作将关闭订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 调接口 */
          closeOrder({
            cancelReason: this.orderListForm.cancelReasonText,
            orderId: this.closeOrderId
          }).then(data => {
            if (data.data.status == 0) {
              this.$message({
                message: "关闭订单成功",
                type: "success"
              });
              this.closeVisible = false;
              this.selectByKwd("close");
            } else {
              this.$message.error("关闭订单失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消关闭");
        });
    },
    // 合并订单弹窗
    cocatOrder(obj2) {
      if (obj2.type == "open") {
        this.noteform = { text: "", info: obj2.obj2 };
        this.closeVisible1 = true;
      }
    },
    // 合并订单按钮
    mergeOrderClick() {
      mergeOrder(this.fromOrderSn, this.mainOrderSn).then(data => {
        if (data.data.status == 0) {
          this.$message({
            message: "合并订单成功",
            type: "success"
          });
          this.closeVisible1 = false;
          this.setView(data);
        } else {
          this.$message({
            message: "合并订单失败",
            type: "error"
          });
        }
      });
    },
    // 下载配货单弹框
    download(obj3) {
      if (obj3.type == "open") {
        this.noteform = { text: "", info: obj3.obj3 };
        this.closeVisible2 = true;
      }
    },
    // 打印快递单
    printDistribute(obj4) {
      if (obj4.type == "open") {
        this.noteform = { text: "", info: obj4.obj4 };
        this.closeVisible3 = true;
      }
    },
    // 批量操作id拼接
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
    /* 分页点击 */
    handleCurrentChange(val) {
      if (
        this.searchOrderSn !== "" ||
        this.endTime != null ||
        this.startTime != null ||
        this.searchNumber !== "" ||
        this.status !== undefined ||
        this.searchOrderType !== ""
      ) {
        // 执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        // 执行全部中的分页
        this.showAll(val);
      }
    },
    handleCurrentSize(val) {
      this.size = val;
      this.selectByKwd("change");
    },
    // 批量删除
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些订单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            deleteOrder(this.batchArr).then(data => {
              if (data.status == 200) {
                this.$message({
                  message: "批量删除订单成功",
                  type: "success"
                });
                this.showAll();
              } else {
                this.$message.error("批量删除订单失败");
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
    },
    // 点击删除
    delOrder(rows) {
      this.$confirm("此操作将删除这个订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /* 调接口 */
          this.batchArr.push(rows.orderId);
          deleteOrder(this.batchArr).then(data => {
            if (data.data.status == 0) {
              this.$message({
                message: "删除订单成功",
                type: "success"
              });
              this.selectByKwd("delete");
            } else {
              this.$message.error(data.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 搜索分页 */
    selectByKwd(val = {}) {
      getOrderList({
        pageSize: this.size,
        pageNo: Number.isInteger(val.page) ? val.page : 1,
        orderStatus: this.status == "all" ? null : this.status,
        ordersType: this.searchOrderType == "" ? null : this.searchOrderType,
        orderSn: this.searchOrderSn == "" ? null : this.searchOrderSn,
        receive: this.searchNumber == "" ? null : this.searchNumber,
        endTime: this.endTime,
        startTime: this.startTime
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getOrderList({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.orderList = data.data.data.list;
      if (data.data.data.list) {
        this.total = data.data.data.total;
        this.cPage = data.data.data.pageNum;
        this.size = data.data.data.pageSize;
      } else {
        this.total = 0;
        this.cPage = 1;
        this.size = 20;
      }
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchOrderSn = "";
      this.searchTime = [];
      this.startTime = null;
      this.endTime = null;
      this.searchNumber = "";
      this.status = "all";
      this.searchOrderType = "";
      this.showAll();
    }
  }
};
</script>

<style lang="less">
#order_idx {
  width: 100%;
  height: auto;
  .el-image__inner {
    //有缩略图的加这个样式
    width: auto !important;
  }

  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;

      span.title {
        line-height: 50px;
        margin-left: 20px;
      }
    }
    .clearfix {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .el-table__header .el-table-column--selection .cell .el-checkbox:after {
      content: "全选";
      margin-left: 5px;
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      /* 筛选按钮 */
      .status {
        .el-tabs {
          .el-tabs__header {
            margin: 0;
            border-bottom: none;
            .el-tabs__nav-wrap {
              margin-bottom: 0;
              .el-tabs__nav {
                border-radius: 0px;
              }
              .el-tabs__item.is-active {
                color: white;
                background-color: #1abc9c;
              }
              .el-tabs__item:hover {
                color: #1abc9c;
              }
              .el-tabs__item.is-active:hover {
                color: white;
              }
            }
          }
        }
      }
      .s-size {
        font-size: 13px;
      }

      .el-button-group.alterDel,
      .el-button-group.setup {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
      }
      // 批量删除
      .batchOperation {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-pagination {
          padding: 0;
          // margin-top: 20px;
        }
        .el-select {
          width: 120px;
          margin-right: 15px;
        }
      }
    }
  }
}
// 弹出窗
.mo-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.ca-order {
  display: flex;
  align-items: center;
  margin-top: 25px;
}
.mode {
  width: 60%;
  height: 300px;
  // border: 1px solid #cccccc;
  padding: 10px;
}
.mode2 {
  width: 60%;
  height: 100px;
  // border: 1px solid #cccccc;
  padding: 10px;
}
.mo-text {
  font-size: 12px;
  color: #cccccc;
  span {
    color: #ff0000;
  }
}
</style>
