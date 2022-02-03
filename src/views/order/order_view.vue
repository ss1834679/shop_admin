<template>
  <div id="detail">
    <!-- 订单的详情 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">订单详情</span>
        <div>
          <el-button size="mini" @click="refreshClick" icon="el-icon-refresh" style="margin-right:30px">刷新</el-button>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>
      <div class="content">
        <el-steps :active="Number(orderDetails)" align-center finish-status="success">
          <el-step title="提交订单" v-if="orderDetails==0" status="success"></el-step>
          <el-step title="提交订单" v-else></el-step>
          <el-step title="取消订单" v-if="orderDetails==0" status="error"></el-step>
          <el-step title="支付订单">
            <template slot="icon" v-if="orderDetails<=1">
              <i class="el-icon-time"></i>
            </template>
          </el-step>
          <el-step title="平台发货">
            <template slot="icon" v-if="orderDetails<=2">
              <i class="el-icon-time"></i>
            </template>
          </el-step>
          <el-step title="确认收货">
            <template slot="icon" v-if="orderDetails<=3">
              <i class="el-icon-time"></i>
            </template>
          </el-step>
          <el-step title="完成评价">
            <template slot="icon" v-if="orderDetails<=4">
              <i class="el-icon-time"></i>
            </template>
          </el-step>
        </el-steps>
        <el-card class="card">
          <div slot="header" class="status">
            <span>当前订单状态：</span>
            <span>{{orderDetails.orderStatusDesc}}</span>
          </div>
          <div slot="header" class="btn">
            <template v-if="orderDetails.orderStatus==2">
              <el-button plain @click="doOrderDelivery">订单发货</el-button>
            </template>
            <template>
              <template>
                <el-button plain @click="receiptVisible=true" v-if="orderDetails.orderStatus==1||orderDetails.orderStatus==2" disabled>修改发票信息</el-button>
                <el-button plain @click="receiveVisible=true " v-if="orderDetails.orderStatus==1|| orderDetails.orderStatus==2">修改收货人信息</el-button>
                <template>
                  <el-button plain @click="alterGoodsInfo" v-if="orderDetails.orderStatus==1">修改商品信息</el-button>
                  <el-button plain @click="costInfoVisible=true" v-if="orderDetails.orderStatus==1">修改费用信息</el-button>
                </template>
              </template>
              <template>
                <el-button plain v-if="orderDetails.orderStatus==3||orderDetails.orderStatus==4" @click="orderTracking">订单跟踪</el-button>
              </template>
              <el-button
                plain
                @click="mailVisible=true"
                v-if="orderDetails.orderStatus==1|| orderDetails.orderStatus==2||orderDetails.orderStatus==3||orderDetails.orderStatus==4||orderDetails.orderStatus==5"
                disabled
              >发送站内信</el-button>
              <el-button
                plain
                @click="noteVisible=true"
                v-if="orderDetails.orderStatus==6||orderDetails.orderStatus==1|| orderDetails.orderStatus==2||orderDetails.orderStatus==3 ||orderDetails.orderStatus==4||orderDetails.orderStatus==5"
              >备注订单</el-button>
              <el-button type="danger" @click="closeOrd({type:'open'})" plain v-if="orderDetails.orderStatus==1">关闭订单</el-button>
              <el-button type="danger" @click="quxiaoOrder" plain v-if="orderDetails.orderStatus==2">取消订单</el-button>
            </template>
            <template>
              <el-button type="danger" plain v-if="orderDetails.orderStatus==6" @click="deletOrder">删除订单</el-button>
              <el-button plain v-if="orderDetails.orderStatus==2||orderDetails.orderStatus==3" disabled>订单调拨</el-button>
            </template>
          </div>
          <div class="content">
            <div class="info">
              <b class="title">基本信息</b>
              <el-table border :data="orderInfo1" style="width: 100%">
                <el-table-column label="订单编号">{{orderDetails.orderSn}}</el-table-column>
                <el-table-column label="发货单流水号" prop="shipmentsSn"></el-table-column>
                <el-table-column label="用户账号">{{orderDetails.userId}}</el-table-column>
                <el-table-column prop="payType" label="支付方式">
                  <template slot-scope="scope">
                    <span v-if="scope.row.payType == '1'">微信</span>
                    <span v-if="scope.row.payType == '2'">支付宝</span>
                    <span v-if="scope.row.payType == '3'">银联</span>
                  </template>
                </el-table-column>
                <el-table-column prop="sourceType" label="订单来源">
                  <template slot-scope="scope">
                    <span v-if="scope.row.sourceType == '1'">WEB</span>
                    <span v-if="scope.row.sourceType == '2'">APP</span>
                    <span v-if="scope.row.sourceType == '3'">微信公众号</span>
                    <span v-if="scope.row.sourceType == '4'">微信小程序</span>
                    <span v-if="scope.row.sourceType == '5'">H5手机页</span>
                  </template>
                </el-table-column>
                <el-table-column prop="ordersType" label="订单类型">
                  <template slot-scope="scope">
                    <span v-if="scope.row.ordersType == 1">普通订单</span>
                    <span v-if="scope.row.ordersType == 2">拼团订单</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-table :data="orderInfo2" border style="width: 100%">
                <el-table-column prop="deliveryName" label="配送方式"></el-table-column>
                <el-table-column prop="expressNumber" label="物流单号"></el-table-column>
                <el-table-column prop="unreceiptComplete" label="自动确认收货时间"></el-table-column>
                <el-table-column label="下单时间">{{orderDetails.createTime}}</el-table-column>
                <el-table-column></el-table-column>
                <el-table-column></el-table-column>
              </el-table>
            </div>
            <!-- <div class="info">
              <b class="title">发票信息</b>
              <el-table border style="width: 100%" v-if="showTable">
                <el-table-column label="发票类型"></el-table-column>
                <el-table-column label="发票抬头"></el-table-column>
                <el-table-column label="发票内容"></el-table-column>
                <el-table-column label="收票人信息"></el-table-column>
              </el-table>
            </div>-->
            <div class="info">
              <b class="title">收货人信息</b>
              <el-table :data="recipientList" v-if="showTable" border style="width: 100%">
                <el-table-column label="收货人" prop="recipient"></el-table-column>
                <el-table-column label="手机号码" prop="phoneNumber"></el-table-column>
                <!-- <el-table-column label="邮政编码" prop="" ></el-table-column> -->
                <el-table-column label="收货地址" prop="address"></el-table-column>
              </el-table>
            </div>
            <div class="info">
              <b class="title">商品信息</b>
              <el-table :data="orderDetails.orderItemInfos" v-if="showTable" border style="width: 100%">
                <el-table-column prop="goodsImage" label="商品图片" align="center">
                  <template slot-scope="scope" v-if="scope.row.goodsImage">
                    <Thumbnail :image="scope.row.goodsImage" />
                  </template>
                </el-table-column>
                <el-table-column label="商品标题" prop="goodsTitle"></el-table-column>
                <el-table-column label="价格/货号" prop="goodsPrice">
                  <template slot-scope="scope">
                    <div>价格：{{"¥" + (scope.row.goodsPrice / 100).toFixed(2)}}</div>
                    <div>货号：{{scope.row.goodsItemId}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="属性" prop="goodsData"></el-table-column>
                <el-table-column label="数量" prop="goodsNum"></el-table-column>
                <el-table-column label="小计" prop="realAmount">
                  <template slot-scope="scope">
                    <div>{{"¥" + (scope.row.realAmount / 100).toFixed(2)}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="info">
              <b class="title">费用信息</b>
              <el-table :data="costInfo1" v-if="showTable" border style="width: 100%">
                <el-table-column label="订单总金额">{{"¥" + (orderDetails.amountPayable / 100).toFixed(2)}}</el-table-column>
                <el-table-column label="运费">{{"¥" + (orderDetails.totalFreightCharge / 100).toFixed(2)}}</el-table-column>
                <el-table-column label="优惠券">{{"¥" + (orderDetails.goodsCouponMonay / 100).toFixed(2)}}</el-table-column>
                <el-table-column label="活动优惠">{{"¥" + (orderDetails.disPrice / 100).toFixed(2)}}</el-table-column>
                <el-table-column label="总减免金额">{{"¥" + ((orderDetails.disPrice+orderDetails.goodsCouponMonay) / 100).toFixed(2)}}</el-table-column>
                <el-table-column label="应付款金额">{{"¥"+(orderDetails.amountPaid/100).toFixed(2)}}</el-table-column>
              </el-table>
              <!-- <el-table border :data="costInfo2" style="width: 100%"></el-table> -->
            </div>
            <div class="info">
              <b class="title">备注信息</b>
              <el-form label-width="100px" class="demo-ruleForm" ref="orderDetails">
                <div>
                  <el-form-item label=" 买家备注">{{orderDetails.buyerRemarks}}</el-form-item>
                  <el-form-item label="商家备注">{{orderDetails.shopsRemarks}}</el-form-item>
                </div>
              </el-form>
            </div>
            <div class="info" v-if="orderDetails.orderStatus==3||orderDetails.orderStatus==4">
              <b class="title">物流信息</b>
              <div>发货快递：{{orderDetails.deliveryName}}</div>
              <div>快递单号：{{orderDetails.expressNumber}}</div>
              <div class="timeline-content">
                <el-timeline>
                  <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :color="index==0 ? colors2 : colors"
                    :timestamp="activity.ftime"
                  >
                    <span class="t-content">{{activity.context}}</span>
                  </el-timeline-item>
                  <el-timeline-item :color="colors">
                    <span class="t-content">商家已发货，等待物流公司取件</span>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
            <div class="info">
              <b class="title">操作信息</b>
              <el-table border :data="orderDetails.operationRecords" style="width: 100%" v-if="showTable">
                <el-table-column prop="operator" label="操作者"></el-table-column>
                <el-table-column prop="updateTime" label="操作时间"></el-table-column>
                <el-table-column prop="orderStatus" label="订单状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.orderStatus==1">待付款</span>
                    <span v-if="scope.row.orderStatus==2">待发货</span>
                    <span v-if="scope.row.orderStatus==3">待收货</span>
                    <span v-if="scope.row.orderStatus==4">已完成</span>
                    <span v-if="scope.row.orderStatus==5">待成团</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="payStatus" label="付款状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.payStatus==1">待付款</span>
                    <span v-if="scope.row.payStatus==2">待发货</span>
                  </template>
                </el-table-column>-->
                <!-- <el-table-column prop="shipStatus" label="发货状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.payStatus==1">待付款</span>
                    <span v-if="scope.row.payStatus==2">待发货</span>
                  </template>
                </el-table-column>-->
                <el-table-column prop="notes" label="备注"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
    <!-- 修改发票信息弹窗 -->
    <el-dialog title="修改发票信息" :visible.sync="receiptVisible">
      <el-form label-width="90px">
        <el-form-item label="发票类型">
          <el-select v-model="receiptform.type" placeholder="发票类型">
            <el-option label="电子发票" value="1"></el-option>
            <el-option label="纸质发票" value="2"></el-option>
            <el-option label="不开发票" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票抬头">
          <el-input v-model="receiptform.head"></el-input>
        </el-form-item>
        <el-form-item label="发票内容">
          <el-select v-model="receiptform.content" placeholder="发票内容">
            <el-option v-for="i in recContent" :key="i.value" :label="i.label" :value="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收票人手机">
          <el-input v-model="receiptform.recPhone"></el-input>
        </el-form-item>
        <el-form-item label="收票人邮箱">
          <el-input v-model="receiptform.recEmail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="receiptVisible = false">取 消</el-button>
        <el-button type="primary" @click="alter(receiptform)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改收货人信息弹窗 -->
    <el-dialog title="修改收货人信息" :visible.sync="receiveVisible">
      <el-form label-width="120px" ref="updateConsigneeInfoFrom">
        <el-form-item label="收货人姓名:">
          <el-input v-model="updateConsigneeInfoFrom.recipient"></el-input>
        </el-form-item>
        <el-form-item label="手机号码:">
          <el-input v-model="updateConsigneeInfoFrom.phone"></el-input>
        </el-form-item>
        <el-form-item label="所在区域:">
          <div style="display:flex">
            <div style="width:140px;">
              <el-select v-model="updateConsigneeInfoFrom.province" placeholder="省" @change="changeProvince({level:1})" filterable clearable>
                <el-option :label="item.criName" :value="item.criCode" v-for="item in provinceList" :key="item.id"></el-option>
              </el-select>
            </div>
            <div style="width:140px;">
              <el-select v-model="updateConsigneeInfoFrom.city" placeholder="市" @change="changeProvince({level:2})" filterable clearable>
                <el-option :label="item.criName" :value="item.criCode" v-for="item in cityList" :key="item.id"></el-option>
              </el-select>
            </div>
            <div style="width:140px;">
              <el-select v-model="updateConsigneeInfoFrom.district" placeholder="区" @change="changeProvince({level:3})" filterable clearable>
                <el-option :label="item.criName" :value="item.criCode" v-for="item in countyList" :key="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="详细地址:">
          <el-input v-model="updateConsigneeInfoFrom.addrInfo" type="textarea" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="receiveVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateConsigneeInfoClick({ type: 'close' })">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 发送站内信弹框 -->
    <el-dialog title="发送站内信" :visible.sync="mailVisible">
      <el-form label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="mailform.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="mailform.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mailVisible = false">取 消</el-button>
        <el-button type="primary" @click="alter(mailform)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改费用信息弹窗 -->
    <el-dialog title="修改费用信息" :visible.sync="costInfoVisible">
      <el-table :data="costInfo1" border style="width: 100%">
        <el-table-column label="商品合计">
          <template slot-scope></template>
        </el-table-column>
        <el-table-column label="运费">
          <template slot-scope="scope">
            <el-input v-model="scope.row.totalFreightCharge" @input="totalFreightChargeInput(scope.row.totalFreightCharge)">
              <template slot="prepend">¥</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="优惠券" prop="goodsCouponMonay">
          <template slot-scope="scope">
            <div>{{"¥" + (scope.row.goodsCouponMonay / 100).toFixed(2)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="优币抵扣"></el-table-column>
      </el-table>
      <el-table :data="costInfo2" border style="width: 100%">
        <el-table-column label="活动优惠">
          <template slot-scope="scope" prop="disPrice">
            <div>{{"¥" + (scope.row.disPrice / 100).toFixed(2)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="折扣金额" prop="amountPaid">
          <template slot-scope="scope">
            <el-input v-model="scope.row.discount" @input="discountPriceInput(scope.row.discount)">
              <template slot="prepend">¥</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="订单总金额" prop="amountPayable">
          <template slot-scope="scope">
            <div>{{"¥" + (scope.row.amountPayable / 100).toFixed(2)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="应付款金额" prop="amountPaid">
          <template slot-scope="scope">{{"¥"+(scope.row.amountPaid/100).toFixed(2)}}</template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="costInfoVisible = false">取 消</el-button>
        <!-- 还要修改 传入一个表单 修改的的运费和折扣 以及订单id等 还没有创建表单 -->
        <el-button type="primary" @click="costPriceClike()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 备注订单弹窗 -->
    <el-dialog title="备注订单" :visible.sync="noteVisible">
      <el-form label-width="80px" ref="noteform">
        <el-form-item label="操作备注">
          <el-input type="textarea" v-model="noteform.text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noteVisible = false">取 消</el-button>
        <el-button type="primary" @click="noteClick('noteform')">确 定</el-button>
      </div>
    </el-dialog>
    <!--关闭订单弹框  -->
    <el-dialog title="关闭订单" :visible.sync="closeVisible">
      <el-form label-width="80px">
        <el-form-item label="操作备注">
          <el-input type="textarea" v-model="closeOrdersInput"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeOrders()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findOrderOne,
  updateConsigneeInfo,
  getOrderRemarks,
  updateOrderGoodsPrice,
  deleteOrder,
  closeOrder
} from "../../api/order";
import { getProvinceList, getRegionList } from "../../api/usercenter";
import { getExpress } from "../../api/pay";
import Thumbnail from "../../components/thumbnail";
export default {
  components: { Thumbnail },
  data() {
    return {
      // 运费修改输入值
      totalFreightCharge: "",
      // 折扣金额修改输入值
      discount: "",
      receiptVisible: false /* 发票弹窗 */,
      receiveVisible: false /* 收货人信息弹窗 */,
      mailVisible: false /* 站内信弹窗 */,
      costInfoVisible: false /* 修改费用弹窗 */,
      noteVisible: false /* 备注订单弹窗 */,
      closeVisible: false /* 关闭订单弹窗 */,
      deliveryCode: "" /* 物流名称id */,
      expressNumber: "" /* 物流单号 */,
      closeOrdersInput: "" /* 关闭订单原因备注 */,
      recContent: [
        /* 发票内容 */
        { value: "0", label: "日用品" },
        { value: "1", label: "家居用品" },
        { value: "2", label: "食品" },
        { value: "3", label: "酒/饮料" },
        { value: "4", label: "服饰" },
        { value: "5", label: "化妆品" }
      ],
      receiptform: {
        /* 发票 */
        phone: "" /* 收货人手机 */,
        postcode: "" /* 收货人邮编 */,
        addrInfo: "" /* 收货人详情地址 */,
        city: "" /* 收货人详情城市 */,
        district: "" /* 收货人详情区县 */,
        recipient: "" /* 收货人 */,
        province: "" /* 收货人详情省市 */
      },
      updateConsigneeInfoFrom: {
        /* 收货人信息 */
        phone: "" /* 收货人手机 */,
        postcode: "" /* 收货人邮编 */,
        addrInfo: "" /* 收货人详情地址 */,
        city: "" /* 收货人详情城市 */,
        district: "" /* 收货人详情区县 */,
        recipient: "" /* 收货人 */,
        province: "" /* 收货人详情省市 */
      },
      mailform: {
        /* 站内信 */
        title: "" /* 标题 */,
        content: "" /* 内容 */
      },
      noteform: {
        text: "" /* 备注信息 */
      },
      details: [
        {
          number: "123143535346574"
        }
      ],
      orderDetails: {
        orderStatus: "",
        shopsRemarks: "" /* 商家备注 */,
        buyerRemarks: "" /* 买家备注 */,
        deliveryCode: "" /* 物流公司编号 */,
        expressNumber: "" /* 物流单号 */
      },
      // 订单基本信息
      orderInfo1: [],
      // 订单基本信息下的物流信息
      orderInfo2: [],
      // 费用信息
      costInfo1: [],
      //  费用信息下的优惠活动信息
      costInfo2: [],
      recipientList: [],
      // 省市级选择
      // provinceListForm:{
      //   provinceId:'',  /* 省级id */
      //   cityId:'',  /* 城市id */
      //   countyId:'',  /* 区县id */
      // },
      // 省市列表
      provinceList: [],
      // 城市列表
      cityList: [],

      // 区县列表
      countyList: [],
      orderId: "" /* 订单id */,
      provinceName: "" /* 省市名称 */,
      cityName: "" /* 城市名称 */,
      countyName: "" /* 区县名称 */,
      showTable: true /* 是否刷新 */,
      ids: [] /* id数组 */,
      //  activities: [{
      //     context: '活动按期开始',
      //     ftime: '2018-04-15'
      //   }, {
      //     context: '通过审核',
      //     ftime: '2018-04-13'
      //   }, {
      //     context: '创建成功',
      //     ftime: '2018-04-11'
      //   }, {
      //     context: '买家已付款',
      //     ftime: '2018-04-11'
      //   }, {
      //     context: '卖家已发货',
      //     ftime: '2018-04-11'
      //   }
      //   ],
      activities: [],
      colors: "#ccc",
      colors2: "red",
      activitiesLength: ""
    };
  },
  mounted() {
    this.orderId = this.$route.query.id;

    if (this.$route.query.id) {
      // 订单详情数据
      findOrderOne(this.$route.query.id).then(data => {
        // console.log(data);
        if (data.data.status == 0) {
          this.orderDetails = data.data.data;
          this.expressNumber = this.orderDetails.expressNumber;
          this.deliveryCode = this.orderDetails.deliveryCode;
          this.orderInfo1.push(this.orderDetails.orderInfo1);
          this.orderInfo2.push(this.orderDetails.orderInfo2);
          this.costInfo1.push(this.orderDetails.costInfo1);
          this.costInfo2.push(this.orderDetails.costInfo2);
          // 修改收货人弹框数据回显
          this.updateConsigneeInfoFrom = new Object({
            recipient: this.orderDetails.recipient,
            phone: this.orderDetails.phoneNumber,
            province: this.orderDetails.province,
            city: this.orderDetails.city,
            district: this.orderDetails.district,
            addrInfo: this.orderDetails.addrInfo
          });
          this.orderDetails.address =
            this.orderDetails.province +
            this.orderDetails.city +
            this.orderDetails.district +
            this.orderDetails.addrInfo;
          this.recipientList.push(
            new Object({
              recipient: this.orderDetails.recipient,
              phoneNumber: this.orderDetails.phoneNumber,
              address: this.orderDetails.address
            })
          );
        }
        // 'yuantong','YT4438746534155'
        // this.orderDetails.deliveryCode,this.orderDetails.expressNumber
        if (this.orderDetails.orderStatus == 3 || this.orderDetails.orderStatus == 4) {
          // 调用订单物流信息接口
          getExpress(data.data.data.deliveryCode, data.data.data.expressNumber).then(data => {
            if (data.data.status == 200) {
              if (data.data.content.message == "ok") {
                this.activities = data.data.content.data;
                this.activitiesLength = this.activities.length;
                this.$message({ message: "查询快递成功", type: "success" });
              } else {
                this.$message.warning(data.data.content.message);
              }
            } else {
              this.$message.error(data.data.msg);
            }
          });
        }
      });
    }
    /**
     * 获取省直辖市地址列表
     */
    getProvinceList().then(data => {
      this.provinceList = data.data.content;
    });
  },
  watch: {},
  methods: {
    doOrderDelivery() {
      this.$router.push({ name: "bulk-shipment", query: { orderIds: [this.orderDetails.orderId] } });
    },
    // 折扣金额输入
    discountPriceInput(val) {
      this.discount = val;
    },
    // 运费金额输入
    totalFreightChargeInput(val2) {
      this.totalFreightCharge = val2;
    },
    // 删除订单
    deletOrder() {
      this.ids.push(this.$route.query.id);
      deleteOrder(this.ids).then(data => {
        if (data.data.status == 0) {
          this.$message({
            message: "成功删除订单",
            type: "success"
          });
          this.$router.go(-1);
        } else {
          this.$message({
            message: "删除订单失败",
            type: "error"
          });
        }
      });
    },
    // 修改费用
    costPriceClike() {
      updateOrderGoodsPrice({
        discount: this.discount == "" ? null : this.discount,
        freight: this.totalFreightCharge == "" ? null : this.totalFreightCharge,
        orderId: this.orderId
      }).then(data => {
        if (data.status == 200) {
          this.$message({
            message: "费用修改成功",
            type: "success"
          });
          this.costInfoVisible = false;
          this.refreshTable();
        } else {
          this.$message({
            message: "费用修改失败",
            type: "error"
          });
        }
      });
    },
    // submitForm() {
    // },
    // 切换省市区
    changeProvince(obj) {
      if (obj.level == 1) {
        getRegionList(this.updateConsigneeInfoFrom.province).then(data => {
          this.cityList = data.data.content;
        });
        this.updateConsigneeInfoFrom.city = "";
        this.updateConsigneeInfoFrom.district = "";
        this.district = {};
        this.countyList = [];
      } else if (obj.level == 2) {
        getRegionList(this.updateConsigneeInfoFrom.city).then(data => {
          this.countyList = data.data.content;
        });
        this.updateConsigneeInfoFrom.district = "";
      }
    },
    // 确定备注
    noteClick() {
      getOrderRemarks({
        orderId: this.orderId,
        remarks: this.noteform.text == "" ? null : this.noteform.text
      }).then(data => {
        if (data.status == 200) {
          this.$message({
            message: "备注成功",
            type: "success"
          });
          this.noteVisible = false;
          this.refreshTable();
        } else {
          this.$message({
            message: "备注失败",
            type: "error"
          });
        }
      });
    },
    /* 刷新 */
    refreshTable() {
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
      });
    },
    alter() {
      this.receiptVisible = false;
      this.receiveVisible = false;
      this.mailVisible = false;
      this.costInfoVisible = false;
      this.noteVisible = false;
    },
    // 提交修改收货人信息按钮
    updateConsigneeInfoClick() {
      this.provinceList.forEach(item => {
        if (item.criCode == this.updateConsigneeInfoFrom.province) {
          this.updateConsigneeInfoFrom.province = item.criName;
        }
      });
      this.cityList.forEach(item1 => {
        if (item1.criCode == this.updateConsigneeInfoFrom.city) {
          this.updateConsigneeInfoFrom.city = item1.criName;
        }
      });
      this.countyList.forEach(item2 => {
        if (item2.criCode == this.updateConsigneeInfoFrom.district) {
          this.updateConsigneeInfoFrom.district = item2.criName;
        }
      });
      // 提交修改收货人信息接口
      updateConsigneeInfo({
        addrInfo: this.updateConsigneeInfoFrom.addrInfo == "" ? null : this.updateConsigneeInfoFrom.addrInfo,
        phone: this.updateConsigneeInfoFrom.phone == "" ? null : this.updateConsigneeInfoFrom.phone,
        recipient: this.updateConsigneeInfoFrom.recipient == "" ? null : this.updateConsigneeInfoFrom.recipient,
        city: this.updateConsigneeInfoFrom.city == "" ? null : this.updateConsigneeInfoFrom.city,
        district: this.updateConsigneeInfoFrom.district == "" ? null : this.updateConsigneeInfoFrom.district,
        province: this.updateConsigneeInfoFrom.province == "" ? null : this.updateConsigneeInfoFrom.province,
        orderId: this.orderId == "" ? null : this.orderId
      }).then(data => {
        if (data.data.status == 0) {
          this.$message({
            message: "收货人修改成功",
            type: "success"
          });
          this.receiveVisible = false;
          this.$router.go(0);
        } else {
          this.$message({
            message: "收货人修改失败",
            type: "error"
          });
        }
      });
    },
    // 刷新
    refreshClick() {
      this.$router.go(0);
    },
    // 修改商品信息
    alterGoodsInfo() {
      /* 传入订单id 这个id待定 */
      this.$router.push({ name: "alterGoodsInfo", query: { id: this.orderId } });
    },
    // 订单跟踪
    orderTracking() {
      /* 传入订单id 这个id待定 */
      this.$router.push({
        name: "order_tracking",
        query: { expressNumber: this.expressNumber, deliveryCode: this.deliveryCode }
      });
    },
    // 跳转取消订单页面
    quxiaoOrder() {
      // console.log(this.orderDetails);
      this.$router.push({
        name: "quxiao_order",
        query: {
          orderId: this.orderDetails.orderId,
          amountPayable: this.orderDetails.amountPayable,
          totalFreightCharge: this.orderDetails.totalFreightCharge
        }
      });
    },
    /* 关闭弹框 */
    closeOrd(objs) {
      if (objs.type == "open") {
        this.closeVisible = true;
      } else if (objs.type == "close") {
        this.closeVisible = false;
      }
    },
    // 关闭订单按钮
    closeOrders() {
      // console.log(this.ids);
      // this.ids.push(this.$route.query.id);
      // console.log(this.ids);
      closeOrder({
        cancelReason: this.closeOrdersInput,
        orderId: this.$route.query.id
      }).then(data => {
        if (data.data.status == 0) {
          this.$message({
            message: "成功关闭",
            type: "success"
          });
          this.refreshClick();
        } else {
          this.$message({
            message: "关闭失败",
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style lang='less'>
#detail {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        margin-left: 20px;
        width: 100%;
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      .card {
        border-radius: 0px;
        .el-card__header {
          background-color: #f3f3f3;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .btn {
            margin-right: 10px;
            .el-button {
              padding: 7px 7px;
              border-radius: 0px;
            }
          }
          .status {
            margin-left: 10px;
          }
        }

        .content {
          .el-table__body-wrapper {
            min-height: 0px;
          }
        }
        .content > div {
          margin-bottom: 10px;
          b.title {
            display: inline-block;
            margin-bottom: 5px;
          }
        }
      }
      .is-always-shadow {
        box-shadow: none;
        -webkit-box-shadow: none;
      }
    }
  }
}
.timeline-content {
  border: 1px solid #cccccc;
  padding: 30px;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info {
  .el-form-item {
    margin: 0;
    .el-form-item__label {
      border: 1px solid #ebeef5;
      background-color: #f9fafc;
    }
    .el-form-item__content {
      padding-left: 20px;
      border: 1px solid #ebeef5;
    }
  }
}
</style>