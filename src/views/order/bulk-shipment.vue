<template>
  <!-- 批量发货页 -->
  <div id="bulk-shipment">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>批量发货</span>
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
      </div>
      <div class="bulk-header">批量发货</div>
      <div>
        <el-table style="width:100%" border :data="shipLists" ref="shipListForm">
          <el-table-column prop="orderSn" label="订单编号" width="180"></el-table-column>
          <el-table-column prop="recipient" label="收货人" width="180"></el-table-column>
          <el-table-column prop="phoneNumber" label="手机号码" width="180"></el-table-column>
          <el-table-column prop="zip" label="邮政编码" width="180"></el-table-column>
          <el-table-column prop="address" label="收货地址"></el-table-column>
          <el-table-column prop="distribution" label="配送方式" width="180">
            <template slot-scope="scope">
              <el-select v-model="scope.row.logisticsCompanytext" clearable  filterable  placeholder="请输入物流公司(可搜索)" @change="logisticsCompanytextChange(scope.row)">
                <el-option v-for="item in logisticsCompany" :key="item.id" :label="item.deliveryName"  :value="`${item.deliveryName}|${item.deliveryCode}`" ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="物流单号">
            <template slot-scope="scope">
              <el-input v-model="scope.row.logisticsCode" placeholder="请输入物流单号"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="button">
        <el-button type="primary" plain @click="clearClick">取消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { shipList, orderShip ,GetDeliveryInfoList} from "../../api/order";
export default {
  data() {
    return {
      // 批量发货返回的数据列表
      shipLists: [],
      rowsLists:[],// 去重后的批量发货数据列表
      orderSn: "" /*订单编号 */,
      recipient: "" /*收货人 */,
      phoneNumber: "" /*收货人电话 */,
      zip: "" /*邮政编码*/,
      address: "" /*收货地址 */,
      distribution: "" /*物流公司 */,
      logisticsCompanytext: "" /*物流单号*/,
      orderId: "",
      rowsList:[],// 去重后的批量发货数据
      logisticsCompanytextList:[], /*获取输入的物流信息*/
      logisticsCompany:[], /*物流公司列表*/
      // 订单编号
      logisticsCode: "",
      dataList: [],/*传参数的数组*/
      deliveryCode:'',/*物流公司编号*/
      // logisticsCode:'78119809519750'
    };
  },
  watch: {
  },
  beforeMount() {
    // 获取批量发货数据列表
    shipList(this.$route.query.orderIds).then(data => {
      if (data.data.status == 0) {
        this.shipLists = data.data.data;
      }
    });
    // 获取物流公司
    GetDeliveryInfoList().then(data=>{
    this.logisticsCompany=data.data.data
    })
    
  },
  methods: {
 
    //   取消
    clearClick() {
      this.$router.go(-1);
    },
    // 获取输入的装修公司
    logisticsCompanytextChange(rows) {
let [lable,vaue] = rows.logisticsCompanytext.split('|') // es6 数组解构赋值
this.logisticsCompanytextList=[lable,vaue]
  this.logisticsCompanytext=this.logisticsCompanytextList[0]
   this.deliveryCode=this.logisticsCompanytextList[1]
     this.rowsList.push(rows)
     this.rowsLists=this.uniq( this.rowsList)
    },
    // 数组去重
    uniq(array){
        var temp = [];
        for(var i = 0; i < array.length; i++) {
            //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
            if(array.indexOf(array[i]) == i){
                temp.push(array[i])
            }
        }
        return temp;
    },
    //   批量发货提交
    submit() {
    this.rowsLists.forEach(item=>{
      this.dataList.push(
        {
          expressNumber:item.logisticsCode=="" ? null : item.logisticsCode,
          deliveryName: this.logisticsCompanytext == "" ? null : this.logisticsCompanytext,
          deliveryCode:this.deliveryCode=="" ? null :this.deliveryCode,
          orderId: item.orderId == "" ? null : item.orderId
        }
      )
    })
      orderShip(this.dataList).then(data => {
          if (data.data.status == 0) {
            this.$message({
              message: "发货成功",
              type: "success"
            });
            this.$router.go(-1);
          } else {
             this.$message({
              message: "请把发货的参数传完整",
              type: "success"
            });
          }
        })
        .catch(() => {
           this.$message({
              message: "发货失败",
              type: "success"
            });
        });
    }
  }
};
</script>
<style lang="less" scoped>
#bulk-shipment {
  padding: 20px;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bulk-header {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  background: #f2f2f2;
  padding: 0 20px;
}
.button {
  height: 70px;
  text-align: center;
  line-height: 70px;
  border: 1px solid #f2f2f2;
}
</style>