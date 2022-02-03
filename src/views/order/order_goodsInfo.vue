<template>
  <div id="goodsInfo">
    <!-- 修改商品信息 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">修改商品信息</span>
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
      </div>
      <div class="content">
        <el-card class="card">
          <div slot="header" class="status">
            <span>商品列表</span>
          </div>
          <div class="content">
            <div class="info">
              <el-table :data="orderGoodsItemList" border style="width: 100%" show-summary :summary-method="getSummaries">
                <el-table-column prop="goodsImage" align="center" label="商品图片" width="160">
                  <template slot-scope="scope" v-if="scope.row.goodsImage">
                    <Thumbnail :image="scope.row.goodsImage" />
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
                <el-table-column label="库存" prop="inventory"></el-table-column>
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
            <span>添加商品</span>
          </div>
          <div class="content">
            <el-form label-width="100px" class="demo-ruleForm" ref="goodsOrderForm">
              <el-form-item label="搜索商品">
                <div class="searchBar">
                  <div class="search_box">
                    <el-select v-model="searchGoodValue" filterable remote value-key="id" :remote-method="selectSupplierGood" placeholder="请选择商品(搜索)">
                      <el-option v-for="item in searchOrderGoodList" :key="item.id" :label="item.goodsTitle" :value="item.id"></el-option>
                    </el-select>
                  </div>
                  <div class="search_box">
                    <el-select v-model="goodsOrderForm.goodsItemId" placeholder="请选择商品sku" value-key="id" clearable>
                      <el-option v-for="item in goodsItemList" :key="item.id" :label="item.itemTitle" :value="item.id"></el-option>
                    </el-select>
                  </div>
                </div>
              </el-form-item>
              <div v-if="visible">
                <el-form-item label="商品名称">{{goodsDetails.goodName}}</el-form-item>
                <el-form-item label="货号">{{goodsDetails.goodName}}</el-form-item>
                <el-form-item label="分类">{{goodsDetails.goodName}}</el-form-item>
                <el-form-item label="品牌">{{goodsDetails.goodName}}</el-form-item>
                <el-form-item label="价格">{{goodsDetails.goodName}}</el-form-item>
                <el-form-item label="属性">
                  <el-select
                    v-for="(item,index) in goodsDetails.goodsSpecOptional.goodsGroupSpecParmList"
                    :key="item.groupName"
                    v-model="specValues[index]"
                    :placeholder="item.groupName"
                  >
                    <el-option v-for="i in item.specParam" :key="i" :label="i" :value="i"></el-option>
                  </el-select>
                  {{specValues}}
                </el-form-item>
                <el-form-item label="库存">{{goodsDetails.goodName}}</el-form-item>
                <el-form-item label="数量">
                  <div class="searchGood">
                    <el-input placeholder="数量" v-model="goodsDetails.goodName"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="操作">
                  <el-button type="primary">加入订单</el-button>
                </el-form-item>
              </div>
            </el-form>

            <div class="buttom">
              <el-button @click="$router.go(-1)">取消</el-button>
              <el-button @click="alterOrderGoodNum" type="primary">确定</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getOrderItemList } from "../../api/order";
import { getSupplierList } from "../../api/supplier_per";
import { getGoodsItem } from "../../api/indexRecommend";
import Thumbnail from "../../components/thumbnail";
export default {
  components: { Thumbnail },
  data() {
    return {
      selectValue: "",
      searchGoodValue: "",
      visible: true,
      goodid: "",
      specValues: [],
      orderGoodsItemList: [],
      searchOrderGoodList: [],
      goodsItemList: [],
      goodsOrderForm: {
        goodsItemId: ""
      },
      searchGoodsList: [
        {
          goodid: "12314",
          goodsSpecOptional: {
            goodsGroupSpecParmList: [
              {
                groupName: "内存容量",
                specParam: ["64GB", "128GB"]
              },
              {
                groupName: "颜色",
                specParam: ["红色", "黑色", "蓝色"]
              }
            ]
          }
        },
        {
          goodid: "124532"
        }
      ],
      goodsDetails: {
        goodName: "123",
        goodsSpecOptional: {
          goodsGroupSpecParmList: [
            {
              groupName: "内存容量",
              specParam: ["64GB", "128GB"]
            },
            {
              groupName: "颜色",
              specParam: ["红色", "黑色", "蓝色"]
            }
          ]
        }
      },
      details: [
        {
          number: "123143535346574",
          img: "5e12adf0a1a09a0baeb143c4",
          price: 122
        },
        {
          number: "123143535346574",
          img: "5e12adf0a1a09a0baeb143c4",
          price: 2012
        }
      ],
      orderDetails: {
        orderItem: {
          id: "1217292128019832834",
          createTime: "2020-01-15 11:47:14",
          updateTime: "2020-01-15 11:47:14",
          operator: "test",
          isDelete: 0,
          orderId: "1215184680547090433",
          orderSn: "15790600336289991214436104904716289",
          goodsItemId: "1214436104904716289",
          goodsPrice: 4469491,
          goodsNum: 10,
          realAmount: 44694910,
          couponId: ""
        },
        orders: {
          id: "1215184680547090433",
          createTime: "2020-01-09 16:12:59",
          updateTime: "2020-01-09 16:12:59",
          operator: "test",
          isDelete: 0,
          userId: "2",
          totalMoney: 14385640,
          disPrice: 0,
          payType: "",
          payTime: "1970-01-01 08:00:00",
          addressId: "233",
          deliverySn: "",
          sourceType: "2",
          orderStatus: "1",
          cancelReason: ""
        }
      }
    };
  },
  mounted() {
    this.orderId = this.$route.query.id;
    if (this.$route.query.id) {
      getOrderItemList(this.$route.query.id).then(data => {
        console.log(data);
        this.orderGoodsItemList = data.data.data.orderItems;
        console.log(this.orderGoodsItemList);
      });
    }

    // if (this.$route.query.id) {
    // const loading = this.$loading({
    //   lock: true,
    //   text: "Loading",
    //   spinner: "el-icon-loading",
    //   background: "rgba(0, 0, 0, 0.7)"
    // });
    // getOneOrder(this.$route.query.id).then(data => {
    //   console.log(data);
    // });
    // }
  },
  watch: {
    searchGoodValue: {
      handler() {
        if (this.searchGoodValue != "") {
          getGoodsItem(this.searchGoodValue).then(data => {
            if (data.data.status == 200) {
              this.goodsItemList = data.data.content;
            }
          });
        }
      }
    }
  },
  methods: {
    alter(obj) {
      console.log(obj);
      // alterOrder(obj);
      this.receiptVisible = false;
      this.receiveVisible = false;
      this.mailVisible = false;
      this.costInfoVisible = false;
      this.noteVisible = false;
    },
    alterOrderGoodNum() {
      console.log(this.orderDetails);
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      console.log(param);
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.property == "realAmount") {
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
            sums[index] += " 元";
          } else {
            sums[index] = "N/A";
          }
        }
      });

      return sums;
    },
    selectSupplierGood(val) {
      if (val !== "") {
        getSupplierList({ goodsTitle: val, pageNo: 1, pageSize: 20 }).then(data => {
          if (data.data.status == 0) {
            this.searchOrderGoodList = data.data.data.data.list;
          }
        });
      }
    }
  }
};
</script>

<style lang='less'>
#goodsInfo {
  .box-card {
    height: 100%;
    .clearfix {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
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
                padding-left: 20px;
                border: 1px solid #ebeef5;
              }
            }
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