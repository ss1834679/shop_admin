<template>
  <div id="returnGoodsDetails">
    <!-- 退货服务单的详情 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">服务单详情</span>
        </div>
      </div>
      <div class="content">
        <el-card class="card">
          <div slot="header" class="status">
            <span>退货商品</span>
          </div>
          <div class="content">
            <div class="info">
              <el-table :data="afterSaleGoodsList" border style="width: 100%" show-summary :summary-method="getSummaries">
                <el-table-column prop="goodsImage" align="center" label="商品图片" width="160">
                  <template slot-scope="scope" v-if="scope.row.goodsImage">
                    <el-image :src="base+scope.row.img" style=" height: 60px" :preview-src-list="(base+scope.row.goodsImage).split(',')"></el-image>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="goodsTitle"></el-table-column>
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
          </div>
        </el-card>
        <el-card class="card">
          <div slot="header" class="status">
            <span>服务单信息</span>
          </div>
          <div class="content">
            <el-form label-width="100px" class="demo-ruleForm">
              <div class="formTable">
                <el-form-item label="服务单号">{{afterSaleInfo.sn}}</el-form-item>
                <el-form-item label="申请状态">
                  <span v-if="afterSaleInfo.status=='1'">待处理</span>
                  <span v-if="afterSaleInfo.status=='2'">退货中</span>
                  <span v-if="afterSaleInfo.status=='3'">已完成</span>
                  <span v-if="afterSaleInfo.status=='4'">已拒绝</span>
                </el-form-item>
                <el-form-item label="订单编号">{{afterSaleInfo.orderSn}}</el-form-item>
                <el-form-item label="申请时间">{{afterSaleInfo.createTime}}</el-form-item>
                <el-form-item label="用户账号">{{afterSaleInfo.userAccount}}</el-form-item>
                <el-form-item label="联系人">{{afterSaleInfo.contactName}}</el-form-item>
                <el-form-item label="联系电话">{{afterSaleInfo.contactNumber}}</el-form-item>
                <el-form-item label="问题描述">{{afterSaleInfo.returnReason}}</el-form-item>
                <el-form-item v-if="afterSaleInfo.status==2||afterSaleInfo.status==3" label="物流公司">{{afterSaleInfo.deliveryName}}</el-form-item>
                <el-form-item v-if="afterSaleInfo.status==2||afterSaleInfo.status==3" label="快递单号">{{afterSaleInfo.deliverySn}}</el-form-item>
                <el-form-item label="凭证图片" class="imgItem">
                  <Thumbnail v-for="(item,index) in saleImgs" :key="item+index" :image="item" />
                </el-form-item>
              </div>
              <!-- 待处理 -->
              <div class="formTable" v-if="afterSaleInfo.status=='1'">
                <el-form-item label="订单金额">{{"¥"+serviceDetails.orderPrice}}</el-form-item>
                <el-form-item label="退运费">
                  <template>
                    <div style="height:40px">
                      <el-radio-group v-model="serviceDetails.isReturnfreight">
                        <!-- label就是值 -->
                        <el-radio :label="1">退运费</el-radio>
                        <el-radio :label="0">不退运费</el-radio>
                      </el-radio-group>
                    </div>
                  </template>
                </el-form-item>
                <!-- <el-form-item label="确认退款金额">
                  {{afterSaleInfo.totalMoney}}
                  <el-input v-model.number="serviceDetails.confirmAmount" class="red">
                    <template slot="append">分</template>
                  </el-input>
                </el-form-item>-->
                <el-form-item label="申请退款金额">
                  <template>
                    <div>{{"¥"+(afterSaleInfo.refundAmount/100).toFixed(2)}}</div>
                  </template>
                </el-form-item>
                <el-form-item label="选择收货点">
                  <el-select v-model="selectReceivingPoint" value-key="id" placeholder="选择收货点">
                    <el-option :label="item.name" :value="item" v-for="item in addressList" :key="item.id"></el-option>
                  </el-select>
                  <span>使用收货点功能需要登录供应商账号</span>
                </el-form-item>
                <el-form-item label="收货人姓名">
                  <el-input placeholder="收货人姓名" v-model="serviceDetails.contactName"></el-input>
                </el-form-item>
                <el-form-item label="所在区域">
                  <div style="display:flex">
                    <div style="width:140px;">
                      <el-select v-model="serviceDetails.province" placeholder="省" @change="changeProvince({level:1})" filterable clearable>
                        <el-option :label="item.criName" :value="item.criCode" v-for="item in provinceList" :key="item.id"></el-option>
                      </el-select>
                    </div>
                    <div style="width:140px;">
                      <el-select v-model="serviceDetails.city" placeholder="市" @change="changeProvince({level:2})" filterable clearable>
                        <el-option :label="item.criName" :value="item.criCode" v-for="item in cityList" :key="item.id"></el-option>
                      </el-select>
                    </div>
                    <div style="width:140px;">
                      <el-select v-model="serviceDetails.county" placeholder="区" @change="changeProvince({level:3})" filterable clearable>
                        <el-option :label="item.criName" :value="item.criCode" v-for="item in countyList" :key="item.id"></el-option>
                      </el-select>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="详细地址">
                  <el-input placeholder="详细地址" v-model="serviceDetails.returnAddress"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                  <el-input placeholder="联系电话" v-model="serviceDetails.contactNumber"></el-input>
                </el-form-item>
              </div>

              <!-- 退货中 -->
              <div class="formTable" v-if="afterSaleInfo.status=='2' ||afterSaleInfo.status=='3' ">
                <el-form-item label="订单金额">{{"¥"+(afterSaleInfo.refundAmount/100).toFixed(2)}}</el-form-item>
                <el-form-item label="退运费">
                  <span v-if="afterSaleInfo.isReturnfreight">退运费</span>
                  <span v-else>不退运费</span>
                </el-form-item>
                <el-form-item label="申请退款金额">{{"¥"+(afterSaleInfo.refundAmount/100).toFixed(2)}}</el-form-item>
                <!-- <el-form-item label="收货人姓名">{{afterSaleInfo.contactName}}</el-form-item>
                <el-form-item label="收货地址">{{afterSaleInfo.Address}}</el-form-item>-->
                <!-- <el-form-item label="联系电话">{{afterSaleInfo.contactNumber}}</el-form-item> -->
              </div>
              <div class="info" v-if="afterSaleInfo.status=='2'||afterSaleInfo.status=='3'">
                <b class="title">物流信息</b>
                <div>发货快递：{{afterSaleInfo.deliveryName}}</div>
                <div>快递单号：{{afterSaleInfo.deliverySn}}</div>
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
              <!-- 退货中和已拒绝 -->
              <template v-if="afterSaleInfo.status=='2' || afterSaleInfo.status=='0'">
                <div>
                  <div class="formTable">
                    <el-form-item label="处理人">{{afterSaleInfo.handleUserId}}</el-form-item>
                    <el-form-item label="处理时间">{{afterSaleInfo.handleDate}}</el-form-item>
                    <el-form-item label="处理备注">{{afterSaleInfo.handleNote}}</el-form-item>
                  </div>
                </div>
              </template>
              <!-- 已完成 -->
              <template v-if="afterSaleInfo.status=='3'">
                <div>
                  <div class="formTable">
                    <el-form-item label="处理人">{{afterSaleInfo.handleUserId}}</el-form-item>
                    <el-form-item label="处理时间">{{afterSaleInfo.handlingTime}}</el-form-item>
                    <el-form-item label="处理备注">{{afterSaleInfo.handleNote}}</el-form-item>
                  </div>
                  <div class="formTable">
                    <el-form-item label="收货人员">{{afterSaleInfo.receivingUserId}}</el-form-item>
                    <el-form-item label="收货时间">{{afterSaleInfo.receivingDate}}</el-form-item>
                    <el-form-item label="收货备注">{{afterSaleInfo.receivingNote}}</el-form-item>
                  </div>
                </div>
              </template>

              <!-- 待处理-->
              <div class="formTable">
                <el-form-item label="处理备注" v-if="afterSaleInfo.status=='1'">
                  <el-input placeholder="处理备注" v-model="afterSaleInfo.handleNote"></el-input>
                </el-form-item>
                <!--  退货中-->
                <el-form-item label="收货备注" v-if="afterSaleInfo.status=='2'">
                  <el-input placeholder="收货备注" v-model="afterSaleInfo.receivingNote"></el-input>
                </el-form-item>
              </div>
            </el-form>
            <div class="buttom" v-if="afterSaleInfo.status=='1'">
              <el-button @click="processReturns()" type="success">确认退货</el-button>
              <el-button @click="processReturns2()" type="danger">拒绝退货</el-button>
            </div>
            <div class="buttom" v-if="afterSaleInfo.status=='2'">
              <el-button @click="processReturns3()" type="success">确认收货</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>

    <!--拒绝退货原因弹框  -->
    <el-dialog title="拒绝退货原因" :visible.sync="closeReturnsVisible">
      <el-form>
        <el-form-item>
          <el-input type="textarea" v-model="afterSaleInfo.handleNote" :rows="6" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeReturnsVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeOrders()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAddressList } from "../../api/supplier";
import { afterSaleReturnsInfo, confirmedReturn, confirmedReceiving } from "../../api/order";
import { getProvinceList, getRegionList, getCityById } from "../../api/usercenter";
import { getExpress } from "../../api/pay";
import Thumbnail from "../../components/thumbnail";
export default {
  components: { Thumbnail },
  data() {
    return {
      closeReturnsVisible: false /**是否发开退货原因弹窗 */,
      processReturnsInput: "" /**拒绝退货原因 */,
      afterSaleGoodsList: [] /**获取的商品列表信息 */,
      // 商品的内容
      afterSaleInfo: {
        deliveryName: "" /**物流公司 */,
        expressNumber: "" /**快递单号 */,
        id: "" /**退货订单id */,
        sn: "" /**退货订单编号 */,
        orderItemId: "" /**退货订单商品id */,
        status: "" /**退货订单状态 */,
        orderId: "" /**退货订单id */,
        createTime: "" /**退货创建时间 */,
        userId: "" /**用户id */,
        contactName: "" /**联系人 */,
        contactNumber: "" /**联系电话 */,
        returnReasonType: "" /**退货原因类型 */,
        returnReason: "" /**退货原因 */,
        saleImg: "" /**商品图片 */,
        handleNote: "" /**处理备注 */,
        handleDate: "" /**处理时间 */,
        handleUserId: "" /**处理人id */,
        handleUserName: "" /**处理人 */,
        receivingNote: "" /**收货备注 */,
        receivingDate: "" /**收货时间 */,
        receivingUserId: "" /**收货人id */,
        receivingUserName: "" /**收货人 */,
        refundAmount: "" /**退款金额 */
      },
      saleImgs: [],
      addressList: [] /**供应商收货地点 */,
      selectReceivingPoint: {} /* 选择的收货点 */,
      serviceDetails: {
        statusType: "2" /**确认退货 */,
        statusType2: "0" /**确认退货 */,
        orderPrice: "" /**订单金额 */,
        confirmAmount: "" /**确定的订单金额 */,
        selectValue: "" /**选择收货点 */,
        contactName: "" /**输入联系人*/,
        returnAddress: "" /**输入的详细地址 */,
        contactNumber: "" /**输入联系电话*/,
        city: "" /**输入的城市*/,
        province: "" /**输入的省市*/,
        county: "" /**输入的区县*/,
        isReturnfreight: 1 /**输入是否退运费*/
      },
      handleNote: "" /* 处理备注 */,
      // 省市列表
      provinceList: [],
      userInfo: "" /* 获取的供应商的信息 */,
      // 城市列表
      cityList: [],
      // 区县列表
      countyList: [],
      // 省市级选择
      // provinceListForm:{
      //   provinceId:'',  /* 省级id */
      //   cityId:'',  /* 城市id */
      //   countyId:'',  /* 区县id */
      // },
      provinceName: "" /* 省级名称 */,
      cityName: "" /* 城市名称 */,
      countyName: "" /* 区县名称 */
    };
  },
  mounted() {
    // 获取详情信息
    if (this.$route.query.id) {
      afterSaleReturnsInfo(this.$route.query.id).then(data => {
        this.afterSaleGoodsList = data.data.data.goodsItems;
        this.afterSaleInfo = data.data.data.afterSaleInfo;
        this.saleImgs = this.afterSaleInfo.saleImg.split(",");
        if (this.afterSaleInfo.status == "2" || this.afterSaleInfo.status == "3") {
          // 调用订单物流信息接口
          getExpress(this.afterSaleInfo.deliveryCode, this.afterSaleInfo.deliverySn).then(data => {
            if (data.data.status == 200) {
              if (data.data.content.message == "ok") {
                this.activities = data.data.content.data;
                // this.activitiesLength = this.activities.length;
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

    // 根据登录的供应商信息获取所有地址信息
    getAddressList().then(data => {
      if (data.data.status == 200) {
        this.addressList = data.data.content;
      }
    });
  },
  watch: {
    selectReceivingPoint: {
      handler() {
        getCityById(this.selectReceivingPoint.provinceId).then(data => {
          this.serviceDetails.province = data.data.content.criCode;
          getRegionList(this.serviceDetails.province).then(data => {
            this.cityList = data.data.content;
          });
        });
        getCityById(this.selectReceivingPoint.cityId).then(data => {
          this.serviceDetails.city = data.data.content.criCode;
          getRegionList(this.serviceDetails.city).then(data => {
            this.countyList = data.data.content;
          });
        });
        getCityById(this.selectReceivingPoint.areaId).then(data => {
          this.serviceDetails.county = data.data.content.criCode;
        });
        this.serviceDetails.contactName = this.selectReceivingPoint.fullName;
        this.serviceDetails.returnAddress = this.selectReceivingPoint.address;
        this.serviceDetails.contactNumber = this.selectReceivingPoint.phone;
      },
      deep: true
    }
  },
  methods: {
    // 切换省市区
    changeProvince(obj) {
      if (obj.level == 1) {
        getRegionList(this.serviceDetails.province).then(data => {
          this.cityList = data.data.content;
        });
        this.serviceDetails.city = "";
        this.serviceDetails.county = "";
        this.county = {};
        this.countyList = [];
      } else if (obj.level == 2) {
        getRegionList(this.serviceDetails.city).then(data => {
          this.countyList = data.data.content;
        });
        this.serviceDetails.county = "";
      }
    },
    alter() {
      this.receiptVisible = false;
      this.receiveVisible = false;
      this.mailVisible = false;
      this.costInfoVisible = false;
      this.noteVisible = false;
    },
    // 确认退货
    processReturns() {
      this.provinceList.forEach(item => {
        if (item.criCode == this.serviceDetails.province) {
          this.provinceName = item.criName;
        }
      });
      this.cityList.forEach(item1 => {
        if (item1.criCode == this.serviceDetails.city) {
          this.cityName = item1.criName;
        }
      });
      this.countyList.forEach(item2 => {
        if (item2.criCode == this.serviceDetails.county) {
          this.countyName = item2.criName;
        }
      });
      this.$confirm("确定要同意当确认退货申请吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 调用确认退货接口
          new Promise((resolve, reject) => {
            if (this.countyName == null || this.countyName == "") {
              reject("请检查退货收货地址省市区");
            }
            if (this.serviceDetails.returnAddress == null || this.serviceDetails.returnAddress == "") {
              reject("请检查退货收货详细地址");
            }
            if (this.serviceDetails.contactName == null || this.serviceDetails.contactName == "") {
              reject("请检查退货收货人姓名");
            }
            if (this.serviceDetails.contactNumber == null || this.serviceDetails.contactNumber == "") {
              reject("请检查退货收货人联系电话");
            }
            if (!/^1[3456789]\d{9}$/.test(this.serviceDetails.contactNumber)) {
              reject("请输入正确手机号");
              this.serviceDetails.contactNumber = "";
            }
            if (this.afterSaleInfo.handleNote == null || this.afterSaleInfo.handleNote == "") {
              this.afterSaleInfo.handleNote = "同意退货";
            }
            resolve();
          })
            .then(() => {
              confirmedReturn({
                city: this.cityName,
                contactName: this.serviceDetails.contactName,
                contactNumber: this.serviceDetails.contactNumber,
                district: this.countyName,
                handleNote: this.afterSaleInfo.handleNote,
                id: this.afterSaleInfo.id,
                province: this.provinceName,
                refundAmount: this.afterSaleInfo.refundAmount,
                returnAddress: this.serviceDetails.returnAddress,
                refundAuditStatus: this.serviceDetails.statusType,
                isReturnfreight: this.serviceDetails.isReturnfreight,
                cityCode: this.serviceDetails.city,
                provinceCode: this.serviceDetails.province,
                districtCode: this.serviceDetails.county
              }).then(data => {
                if (data.data.status == 0) {
                  this.$message({ message: "确认退货成功", type: "success" });
                  this.$router.go(-1);
                } else {
                  this.$message.error("确认退货失败");
                }
              });
            })
            .catch(res => {
              this.$message.warning(res);
            });
        })
        .catch(() => {
          this.$message("已取消确认退货操作");
        });
    },
    // 拒绝退货
    processReturns2() {
      this.closeReturnsVisible = true;
    },
    closeOrders() {
      this.provinceList.forEach(item => {
        if (item.criCode == this.serviceDetails.province) {
          this.provinceName = item.criName;
        }
      });
      this.cityList.forEach(item1 => {
        if (item1.criCode == this.serviceDetails.city) {
          this.cityName = item1.criName;
        }
      });
      this.countyList.forEach(item2 => {
        if (item2.criCode == this.serviceDetails.county) {
          this.countyName = item2.criName;
        }
      });
      new Promise((resolve, reject) => {
        if (this.afterSaleInfo.handleNote == null || this.afterSaleInfo.handleNote == "") {
          reject("请填写拒绝退货的理由");
        }
        resolve();
      })
        .then(() => {
          confirmedReturn({
            city: this.cityName,
            contactName: this.serviceDetails.contactName,
            contactNumber: this.serviceDetails.contactNumber,
            district: this.countyName,
            handleNote: this.afterSaleInfo.handleNote,
            id: this.afterSaleInfo.id,
            province: this.provinceName,
            refundAmount: this.afterSaleInfo.refundAmount,
            returnAddress: this.serviceDetails.returnAddress,
            refundAuditStatus: this.serviceDetails.statusType2,
            isReturnfreight: this.serviceDetails.isReturnfreight,
            cityCode: this.serviceDetails.city,
            provinceCode: this.serviceDetails.province,
            districtCode: this.serviceDetails.county
          }).then(data => {
            if (data.data.status == 0) {
              this.$message({
                message: "拒绝退货成功",
                type: "success"
              });
              this.closeReturnsVisible = false;
              this.$router.go(-1);
            } else {
              this.$message.error("拒绝退货失败");
            }
          });
        })
        .catch(res => {
          this.$message.warning(res);
        });
    },
    // 确认收货
    processReturns3() {
      this.$confirm("确定要同意当前确认收货吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          confirmedReceiving({
            id: this.afterSaleInfo.id,
            receivingNote: this.afterSaleInfo.receivingNote
          }).then(data => {
            if (data.data.status == 0) {
              this.$message({
                message: "成功收货",
                type: "success"
              });
              this.$router.go(-1);
            } else {
              this.$message({
                message: "收货失败",
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message("已取消确认收货");
        });
    },
    /* 关闭订单 */
    closeOrder(action) {
      if (action == "open") {
        this.noteform = { text: "" };
        this.closeVisible = true;
      } else if (action == "close") {
        /* 填写备注的接口 还有id */
        // alterOrder(this.noteform);
        this.closeVisible = false;
        this.noteform = { text: "" };
      }
    },
    // 总价
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.property == "goodsPrice" || column.property == "realAmount") {
          const values = data.map(item => Number((item[column.property] / 100).toFixed(2)));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            this.serviceDetails.orderPrice = sums[index];
            sums[index] += " 元";
          } else {
            sums[index] = "N/A";
          }
        }
      });

      return sums;
    }
  }
};
</script>

<style lang='less'>
#returnGoodsDetails {
  .box-card {
    height: 100%;
  }
  .el-image__inner {
    //有缩略图的加这个样式
    width: auto !important;
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
          .el-form {
            .el-form-item {
              margin: 0;
              .el-form-item__label {
                border: 1px solid #ebeef5;
                background-color: #f9fafc;
              }
              .el-form-item__content {
                height: 40px;
                line-height: 40px;
                padding-left: 20px;
                border: 1px solid #ebeef5;
              }
            }
            .el-form-item.imgItem {
              .el-form-item__label {
                height: 60px;
                line-height: 60px;
              }
              .el-form-item__content {
                height: 60px;
                line-height: 60px;
                .el-image {
                  width: 80px;
                  height: 60px !important;
                }
              }
            }
          }
          .formTable {
            margin-bottom: 30px;
          }
          .el-table__body-wrapper {
            min-height: 0px;
          }
          .el-form-item__content {
            display: flex;
          }
          .searchGood {
            width: 250px;
            margin-right: 20px;
          }
          .buttom {
            display: flex;
            justify-content: center;
            margin-top: 10px;
            .el-button {
              margin-left: 40px;
            }
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
</style>