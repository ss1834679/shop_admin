<template>
  <!-- 自动生成table(查看规格)组件 -->
  <div id="autoTable">
    <el-table :data="itemList" border style="width: 100%">
      <el-table-column v-for="(i,index) in paramNameArr" :key="index" :prop="'value'+index" :label="i.specParamName"></el-table-column>
      <el-table-column prop="itemTitle" label="商品标题"></el-table-column>
      <el-table-column prop="itemImage" align="center" label="图片">
        <template v-if="scope.row.itemImage!=''" slot-scope="scope">
          <Thumbnail :image="scope.row.itemImage" />
        </template>
      </el-table-column>
      <el-table-column prop="itemCore" label="编码"></el-table-column>
      <el-table-column prop="itemPrice" label="价格(元)" v-if="type=='plain'">
        <template slot-scope="scope">{{"¥"+(scope.row.itemPrice/100).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column prop="itemMarketPrice" label="市场价(元)" v-if="type=='plain'">
        <template slot-scope="scope">{{"¥"+(scope.row.itemMarketPrice/100).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column prop="itemPrice" label="单独购买价" v-if="type=='group'">
        <template slot-scope="scope">{{"¥"+(scope.row.itemPrice/100).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column prop="itemMarketPrice" label="团购价" v-if="type=='group'">
        <template slot-scope="scope">{{"¥"+(scope.row.itemMarketPrice/100).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column prop="itemNum" label="库存"></el-table-column>
      <el-table-column prop="costPrice" label="成本价">
        <template slot-scope="scope">{{"¥"+(scope.row.costPrice/100).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column prop="memberPrice" label="会员价" v-if="type=='plain'&&isRetailStore==1">
        <template slot-scope="scope">{{"¥"+(scope.row.memberPrice/100).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column label="重量">
        <template slot-scope="scope">{{(scope.row.goodsItemInfo.weight/1000).toFixed(3)+"Kg"}}</template>
      </el-table-column>
      <el-table-column prop="saleNum" label="销量"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Thumbnail from "./thumbnail";
export default {
  name: "autoView",
  props: {
    paramNameArr: {
      type: Array,
      required: true
    },
    optionValues: {
      type: Array,
      required: true
    },
    goodsItemList: {
      type: Array
    },
    type: {
      type: String
    },
    isRetailStore: { required: false }
  },
  components: { Thumbnail },
  data() {
    return {
      parmList: [],
      itemList: [],
      arr2: []
    };
  },
  methods: {
    doExchange(arr) {
      /* 数组的排列组合 */
      let len = arr.length;
      /* 当数组大于等于2个的时候 */
      if (len >= 2) {
        /* 第一个数组的长度 */
        let len1 = arr[0].length;
        /* 第二个数组的长度 */
        let len2 = arr[1].length;
        /* 2个数组产生的组合数 */
        let lenBoth = len1 * len2;
        /* 申明一个新数组 */
        let items = new Array(lenBoth);
        /* 申明新数组的索引 */
        let index = 0;
        for (let i = 0; i < len1; i++) {
          for (let j = 0; j < len2; j++) {
            if (arr[0][i] instanceof Array) {
              items[index] = arr[0][i].concat(arr[1][j]);
            } else {
              items[index] = [arr[0][i]].concat(arr[1][j]);
            }
            index++;
          }
        }
        let newArr = new Array(len - 1);
        for (let i = 2; i < arr.length; i++) {
          newArr[i - 1] = arr[i];
        }
        newArr[0] = items;
        return this.doExchange(newArr);
      } else if (len == 1) {
        return arr[0];
      } else {
        return new Array(0);
      }
    },
    updataData() {
      this.arr2 = this.doExchange(this.optionValues);
      var temp = new Array(this.arr2.length);
      this.arr2.forEach((item, index, array) => {
        if (Array.isArray(this.arr2[index])) {
          temp[index] = {};
          // console.log(this.goodsItemList.length, array.length,5);
          if (this.goodsItemList.length != array.length) {
            this.$message.error("该商品信息有误！");
          } else {
            // console.log(JSON.stringify(array[index]), 3);
            let optArr = JSON.parse(JSON.stringify(array[index]));
            let ifget = false;
            this.goodsItemList.forEach((itemItem, itemIndex) => {
              if (!ifget) {
                // console.log(this.goodsItemList[itemIndex],itemIndex,6);
                // console.log(JSON.stringify(this.goodsItemList[itemIndex].specOptionalValue), 2);
                let itemArr = JSON.parse(JSON.stringify(this.goodsItemList[itemIndex].specOptionalValue));
                if (this.ref(itemArr.sort(), optArr.sort())) {
                  temp[index] = this.goodsItemList[itemIndex];
                  ifget = true;
                }
              }
            });
          }
          this.arr2[index].forEach((i, idx) => {
            temp[index][`value${idx}`] = array[index][idx];
          });
        } else {
          temp[index] = {};
          if (this.goodsItemList.length != array.length) {
            this.$message.error("该商品信息有误！");
          } else {
            let optArr = array[index].split(",");
            let ifget = false;
            this.goodsItemList.forEach((itemItem, itemIndex) => {
              // console.log(JSON.stringify(this.goodsItemList[itemIndex].specOptionalValue), 1);
              if (!ifget) {
                let itemArr = JSON.parse(JSON.stringify(this.goodsItemList[itemIndex].specOptionalValue));
                if (this.ref(itemArr.sort(), optArr.sort())) {
                  temp[index] = this.goodsItemList[itemIndex];
                  ifget = true;
                }
              }
            });
          }
          temp[index][`value0`] = array[index];
        }
      });
      this.itemList = temp;
    },
    ref(arr1, arr2) {
      let bollen = true;
      arr1.forEach((item1, index1) => {
        if (arr1[index1] != arr2[index1]) {
          bollen = false;
        }
      });
      return bollen;
    }
  },
  beforeMount() {
    this.updataData();
  },
  beforeUpdate() {
    this.updataData();
  }
};
</script>

<style lang='less'>
#autoTable {
  .el-upload-list--picture-card .el-upload-list__item {
    /* 图片上传的样式 */
    width: 80px;
    height: 80px;
  }
  .el-upload--picture-card {
    /* 图片上传的样式 */
    width: 80px;
    height: 80px;
    line-height: 86px;
  }
}
</style>
