<template>
  <!-- 自动生成table(添加规格)组件 -->
  <div id="autoTable">
    <el-table :data="itemList" style="width: 100%" ref="autoTable" @selection-change="getSelection">
      <el-table-column type="selection" align="center" width="70"></el-table-column>
      <el-table-column v-for="(i,index) in paramNameArr" :key="index" :prop="'value'+index" :label="i.specParamName"></el-table-column>
      <el-table-column prop="itemTitle" label="规格标题">
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemTitle"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="itemImage" align="center" v-if="showImg" label="图片" width="100">
        <template slot-scope="scope">
          <upload-img @getimgArr="(imgarr)=>{scope.row.itemImage = imgarr}" :imgArr="scope.row.itemImage" :limit="1" :notMultiple="true"></upload-img>
        </template>
      </el-table-column>
      <el-table-column prop="itemCore" label="编码">
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemCore"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="itemPrice" label="价格" width="160" v-if="type=='plain'">
        <template slot-scope="scope">
          <precision-input :num="scope.row.itemPrice" :placeholder="'价格'" :text="'元'" :type="'price'" @getNum="(value)=>{scope.row.itemPrice=value}"></precision-input>
        </template>
      </el-table-column>
      <el-table-column prop="itemMarketPrice" label="市场价" width="160" v-if="type=='plain'">
        <template slot-scope="scope">
          <precision-input
            :num="scope.row.itemMarketPrice"
            :placeholder="'市场价'"
            :text="'元'"
            :type="'price'"
            @getNum="(value)=>{scope.row.itemMarketPrice=value}"
          ></precision-input>
        </template>
      </el-table-column>
      <el-table-column prop="itemMarketPrice" label="团购价" width="160" v-if="type=='group'">
        <template slot-scope="scope">
          <precision-input
            :num="scope.row.itemMarketPrice"
            :placeholder="'团购价'"
            :text="'元'"
            :type="'price'"
            @getNum="(value)=>{scope.row.itemMarketPrice=value}"
          ></precision-input>
        </template>
      </el-table-column>
      <el-table-column prop="itemPrice" label="单独购买价" width="160" v-if="type=='group'">
        <template slot-scope="scope">
          <precision-input
            :num="scope.row.itemPrice"
            :placeholder="'单独购买价'"
            :text="'元'"
            :type="'price'"
            @getNum="(value)=>{scope.row.itemPrice=value}"
          ></precision-input>
        </template>
      </el-table-column>
      <el-table-column prop="itemNum" label="库存" width="110">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.itemNum"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="重量(千克/KG)" width="140">
        <template slot-scope="scope">
          <!-- <el-input v-model.number="scope.row.saleNum"></el-input> -->
          <precision-input
            :num="scope.row.goodsItemInfo.weight"
            :placeholder="'重量'"
            :type="'weight'"
            @getNum="(value)=>{scope.row.goodsItemInfo.weight=value}"
          ></precision-input>
        </template>
      </el-table-column>
      <el-table-column prop="costPrice" label="成本价" width="160">
        <template slot-scope="scope">
          <precision-input :num="scope.row.costPrice" :placeholder="'成本价'" :text="'元'" :type="'price'" @getNum="(value)=>{scope.row.costPrice=value}"></precision-input>
        </template>
      </el-table-column>
      <el-table-column prop="memberPrice" label="会员价" width="160" v-if="type=='plain'&&isRetailStore==1">
        <template slot-scope="scope">
          <precision-input
            :num="scope.row.memberPrice"
            :placeholder="'会员价'"
            :text="'元'"
            :type="'price'"
            @getNum="(value)=>{scope.row.memberPrice=value}"
          ></precision-input>
        </template>
      </el-table-column>
    </el-table>
    <div class="batchBox" v-if="bacthVisible">
      <el-select v-model="batchValue" placeholder="批量操作" value-key="label">
        <el-option v-for="(item,idx) in options" :key="idx" v-show="item.type==undefined||type==item.type" :label="item.label" :value="item"></el-option>
      </el-select>
      <div class="inputBatch">
        <el-input v-model="batchInput" :placeholder="batchValue.label" v-if="batchValue.value=='itemTitle'"></el-input>
        <upload-img
          @getimgArr="(imgarr)=>{batchInput = imgarr}"
          v-if="batchValue.value=='itemImage'"
          :imgArr="batchInput"
          :limit="1"
          :notMultiple="true"
        ></upload-img>
        <precision-input
          :num="batchNumber"
          v-if="batchValue.value=='itemPrice'||batchValue.value=='itemMarketPrice'"
          :placeholder="batchValue.label"
          :text="'元'"
          :type="'price'"
          @getNum="(value)=>{batchNumber=value}"
        ></precision-input>
      </div>

      <el-button class="bacthButton" @click="batchOperation">确认</el-button>
    </div>
  </div>
</template>

<script>
import uploadImg from "./uploadImg";
import precisionInput from "./precisionInput";
export default {
  name: "autoTable",
  components: { uploadImg, precisionInput },
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
    isRetailStore: { required: false },
    // placeTitle: { required: true },
    // placeNum: { required: true },
    placeForm: { required: true }
  },
  data() {
    return {
      parmList: [],
      itemList: [],
      arr2: [],
      showImg: true,
      options: [
        { label: "批量修改图片", value: "itemImage" },
        { label: "批量修改标题", value: "itemTitle" },
        { label: "批量修改价格", value: "itemPrice", type: "plain" },
        { label: "批量修改市场价", value: "itemMarketPrice", type: "plain" },
        { label: "批量修改团购价", value: "itemMarketPrice", type: "group" },
        { label: "批量修改单独购买价", value: "itemPrice", type: "group" }
      ],
      bacthVisible: false /* 批量 */,
      batchValue: {} /* 批量操作的类型 */,
      batchArr: [] /* 批量操作 id 数组 */,
      batchInput: "" /* 批量填写的字符 */,
      batchNumber: undefined /* 批量填写的数字 */
    };
  },
  watch: {
    itemList: {
      handler() {
        /* 复制对象，操作对象原对象不会发生改变 */
        // console.log(JSON.parse(JSON.stringify(this.itemList)), 4);
        let arr = JSON.parse(JSON.stringify(this.itemList));
        let obj = {};
        if (this.type == "plain" && this.isRetailStore == 1) {
          obj = {
            giftDetailsVOS: [
              {
                detailsNum: 0,
                goodsItemId: ""
              }
            ],
            goodsItemInfo: {},
            goodsId: "",
            isGift: false,
            itemCore: "",
            itemImage: "",
            itemMarketPrice: false,
            itemNum: 0,
            itemPrice: 0,
            costPrice: 0,
            memberPrice: 0,
            itemTitle: "",
            optionalIds: "",
            saleNum: 0,
            specOptionalValue: ""
          };
        } else {
          obj = {
            giftDetailsVOS: [
              {
                detailsNum: 0,
                goodsItemId: ""
              }
            ],
            goodsItemInfo: {},
            goodsId: "",
            isGift: false,
            itemCore: "",
            itemImage: "",
            itemMarketPrice: false,
            itemNum: 0,
            itemPrice: 0,
            costPrice: 0,
            itemTitle: "",
            optionalIds: "",
            saleNum: 0,
            specOptionalValue: ""
          };
        }
        arr.forEach(item => {
          for (let key in item) {
            if (!obj.hasOwnProperty(key)) {
              delete item[key];
            }
          }
        });
        this.$emit("getItemList", { list: arr });
      },
      deep: true
    },
    // optionValues: {
    //   handler() {
    //     this.updataData();
    //   },
    //   deep: true
    // },
    batchArr: {
      handler() {
        if (this.batchArr.length == 0) {
          this.bacthVisible = false;
        } else {
          this.bacthVisible = true;
        }
      }
    }
  },
  methods: {
    batchOperation() {
      if (this.batchValue.value == "itemImage") {
        if (this.batchInput != "") {
          this.batchArr.forEach(item => {
            this.itemList[item][this.batchValue.value] = this.batchInput;
          });
          this.refreshImg();
        }
      } else if (this.batchValue.value == "itemTitle") {
        if (this.batchInput != "") {
          this.batchArr.forEach(item => {
            this.itemList[item][this.batchValue.value] = this.batchInput;
          });
        }
      } else {
        if (this.batchNumber != "") {
          this.batchArr.forEach(item => {
            this.itemList[item][this.batchValue.value] = this.batchNumber;
          });
        }
      }
      this.clearBatch();
    },
    clearBatch() {
      this.batchValue = {};
      this.batchInput = "";
      this.batchNumber = undefined;
      this.$refs.autoTable.clearSelection();
    },
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
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    updataData() {
      this.arr2 = this.doExchange(this.optionValues);
      var temp = new Array(this.arr2.length);
      this.arr2.forEach((item, index, array) => {
        if (Array.isArray(this.arr2[index])) {
          temp[index] = {};
          // console.log(this.goodsItemList.length, array.length,5);
          if (this.goodsItemList.length != array.length) {
            temp[index]["giftDetailsVOS"] = [
              { detailsNum: 0 /* 礼包的goodsitem数量 */, goodsItemId: "" /* 是哪一个goodsitem */ }
            ];
            temp[index]["goodsItemInfo"] = {
              weight: this.placeForm.placeWeight /* 商品基本信息 */
            };
            temp[index]["isGift"] = false; /* 是否为礼包 */
            temp[index]["itemCore"] = this.placeForm.placeCore; /* 编码 */
            temp[index]["itemImage"] = ""; /* 商品图片  选择规格之后的图片 */
            temp[index]["itemNum"] = this.placeForm.placeNum; /* 商品库存 */
            temp[index]["itemPrice"] = 0; /* 商品价格 单独购买价 */
            temp[index]["costPrice"] = 0; /* 成本价 */
            temp[index]["memberPrice"] = 0; /* 会员价 */
            temp[index]["itemTitle"] = this.placeForm.placeTitle; /* 规格标题 */
            temp[index]["itemMarketPrice"] = null; /* 市场价 团购价 */
            temp[index]["optionalIds"] = "";
            temp[index]["saleNum"] = 0; /* 销量 */
            temp[index]["goodsId"] = "";
            temp[index]["specOptionalValue"] = array[index];
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
                } else {
                  temp[index]["giftDetailsVOS"] = [
                    { detailsNum: 0 /* 礼包的goodsitem数量 */, goodsItemId: "" /* 是哪一个goodsitem */ }
                  ];
                  temp[index]["goodsItemInfo"] = {
                    weight: this.placeForm.placeWeight /* 商品基本信息 */
                  };
                  temp[index]["isGift"] = false; /* 是否为礼包 */
                  temp[index]["itemCore"] = this.placeForm.placeCore; /* 编码 */
                  temp[index]["itemImage"] = ""; /* 商品图片  选择规格之后的图片 */
                  temp[index]["itemNum"] = this.placeForm.placeNum; /* 商品库存 */
                  temp[index]["itemPrice"] = 0; /* 商品价格 单独购买价 */
                  temp[index]["costPrice"] = 0; /* 成本价 */
                  temp[index]["memberPrice"] = 0; /* 会员价 */
                  temp[index]["itemTitle"] = this.placeForm.placeTitle; /* 规格标题 */
                  temp[index]["itemMarketPrice"] = null; /* 市场价 团购价 */
                  temp[index]["optionalIds"] = "";
                  temp[index]["saleNum"] = 0; /* 销量 */
                  temp[index]["goodsId"] = "";
                  temp[index]["specOptionalValue"] = array[index];
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
            temp[index]["giftDetailsVOS"] = [
              { detailsNum: 0 /* 礼包的goodsitem数量 */, goodsItemId: "" /* 是哪一个goodsitem */ }
            ];
            temp[index]["goodsItemInfo"] = {
              weight: this.placeForm.placeWeight /* 商品基本信息 */
            };
            temp[index]["isGift"] = false; /* 是否为礼包 */
            temp[index]["itemCore"] = this.placeForm.placeCore; /* 编码 */
            temp[index]["itemImage"] = ""; /* 商品图片  选择规格之后的图片 */
            temp[index]["itemNum"] = this.placeForm.placeNum; /* 商品库存 */
            temp[index]["itemPrice"] = 0; /* 商品价格 单独购买价 */
            temp[index]["costPrice"] = 0; /* 成本价 */
            temp[index]["memberPrice"] = 0; /* 会员价 */
            temp[index]["itemTitle"] = this.placeForm.placeTitle; /* 规格标题 */
            temp[index]["itemMarketPrice"] = null; /* 市场价 团购价 */
            temp[index]["optionalIds"] = "";
            temp[index]["saleNum"] = 0; /* 销量 */
            temp[index]["goodsId"] = "";
            temp[index]["specOptionalValue"] = array[index].split(",");
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
                } else {
                  temp[index]["giftDetailsVOS"] = [
                    { detailsNum: 0 /* 礼包的goodsitem数量 */, goodsItemId: "" /* 是哪一个goodsitem */ }
                  ];
                  temp[index]["goodsItemInfo"] = {
                    weight: this.placeForm.placeWeight /* 商品基本信息 */
                  };
                  temp[index]["isGift"] = false; /* 是否为礼包 */
                  temp[index]["itemCore"] = this.placeForm.placeCore; /* 编码 */
                  temp[index]["itemImage"] = ""; /* 商品图片  选择规格之后的图片 */
                  temp[index]["itemNum"] = this.placeForm.placeNum; /* 商品库存 */
                  temp[index]["itemPrice"] = 0; /* 商品价格 单独购买价 */
                  temp[index]["costPrice"] = 0; /* 成本价 */
                  temp[index]["memberPrice"] = 0; /* 会员价 */
                  temp[index]["itemTitle"] = this.placeForm.placeTitle; /* 规格标题 */
                  temp[index]["itemMarketPrice"] = null; /* 市场价 团购价 */
                  temp[index]["optionalIds"] = "";
                  temp[index]["saleNum"] = 0; /* 销量 */
                  temp[index]["goodsId"] = "";
                  temp[index]["specOptionalValue"] = array[index].split(",");
                }
              }
            });
          }
          temp[index][`value0`] = array[index];
        }
      });
      this.itemList = temp;
      this.refreshImg();
    },
    ref(arr1, arr2) {
      let bollen = true;
      arr1.forEach((item1, index1) => {
        if (arr1[index1] != arr2[index1]) {
          bollen = false;
        }
      });
      return bollen;
    },
    getSelection(val) {
      this.batchArr = [];
      this.itemList.forEach((item, index) => {
        val.forEach(i => {
          if (item == i) {
            this.batchArr.push(index);
          }
        });
      });
    },
    deleteGroup(idx) {
      this.updataData();
    },
    deleteOption(obj) {
      if (obj.len == 1) {
        /* 每一个的specOptionalValue需要删掉一个被删掉的 */
        this.itemList.forEach((ite, ind) => {
          this.itemList[ind].specOptionalValue && this.itemList[ind].specOptionalValue.splice(obj.tableindex, 1);
          this.$set(this.itemList[ind], `value${obj.tableindex}`, undefined);
        });
      } else {
        /* 这里直接移除item 不需要管specOptionalValue */
        this.itemList = this.itemList.filter(item => {
          return item[`value${obj.tableindex}`] != obj.oValue;
        });
      }
    },
    addOption(obj) {
      let item = {
        giftDetailsVOS: [{ detailsNum: 0 /* 礼包的goodsitem数量 */, goodsItemId: "" /* 是哪一个goodsitem */ }],
        goodsItemInfo: {
          weight: this.placeForm.placeWeight /* 商品基本信息 */
        },
        isGift: false,
        itemCore: this.placeForm.placeCore,
        itemImage: "",
        itemNum: this.placeForm.placeNum,
        itemPrice: 0,
        costPrice: 0,
        memberPrice: 0,
        itemTitle: this.placeForm.placeTitle,
        itemMarketPrice: null,
        optionalIds: "",
        saleNum: 0,
        goodsId: ""
      };
      let appendItem = {};
      if (this.itemList.length == 0) {
        appendItem = JSON.parse(JSON.stringify(item));
        appendItem["specOptionalValue"] = [obj.oValue];
        appendItem[`value${obj.tableindex}`] = obj.oValue;
        this.itemList.push(appendItem);
      } else {
        if (obj.len == 0) {
          this.itemList.forEach((ite, ind) => {
            this.itemList[ind].specOptionalValue &&
              this.itemList[ind].specOptionalValue.splice(obj.tableindex, 0, obj.oValue);
            this.$set(this.itemList[ind], `value${obj.tableindex}`, obj.oValue);
          });
        } else {
          let arr = this.optionValues.map((i, index) => {
            if (index != obj.tableindex) {
              return i;
            } else {
              return [obj.oValue];
            }
          });
          let arr2 = this.doExchange(arr);
          arr2.forEach((i, index, array) => {
            if (Array.isArray(array[index])) {
              /* 有其他的行 */
              appendItem = JSON.parse(JSON.stringify(item));
              appendItem["specOptionalValue"] = array[index];
              array[index].forEach((it, idx) => {
                appendItem[`value${idx}`] = array[index][idx];
              });
              this.itemList.push(appendItem);
            } else {
              /* 没有其他的行 直接加一个item */
              appendItem = JSON.parse(JSON.stringify(item));
              appendItem["specOptionalValue"] = array[index].split(",");
              appendItem[`value${obj.tableindex}`] = array[index];
              this.itemList.push(appendItem);
            }
          });
        }
      }
    }
  },
  beforeMount() {
    this.updataData();
  }
};
</script>

<style lang='less'>
#autoTable {
  position: relative;
  .batchBox {
    position: absolute;
    z-index: 10;
    top: -100px;
    left: 0;
    width: 500px;
    height: 100px;
    background-color: #dcdcdc;
    border-radius: 5px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .bacthButton {
      height: 40px !important;
    }
  }
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
