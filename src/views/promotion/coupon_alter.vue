<template>
  <div id="couponAlter">
    <!-- 优惠券的修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">修改优惠券</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="couponform" ref="couponform" :rules="couponRules" label-width="120px">
          <el-form-item label="优惠券类型">
            <el-select v-model="couponform.couponCategory">
              <el-option label="注册赠券" :value="1"></el-option>
              <el-option label="购物赠券" :value="2"></el-option>
              <el-option label="全场赠券" :value="3"></el-option>
              <el-option label="会员赠券" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券名称" prop="name">
            <el-input v-model="couponform.name"></el-input>
          </el-form-item>
          <el-form-item label="适用平台">
            <el-select v-model="couponform.platform">
              <el-option label="全平台" :value="1"></el-option>
              <el-option label="PC端" :value="2"></el-option>
              <el-option label="移动端" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="总发行量" prop="total">
            <el-input v-model.number="couponform.total"></el-input>
          </el-form-item>
          <el-form-item label="面额" prop="price">
            <precision-input :num="couponform.price" :text="'元'" :placeholder="'面额'" :type="'price'" @getNum="(value)=>{this.couponform.price=value}"></precision-input>
          </el-form-item>
          <el-form-item label="优惠券类型" prop="type">
            <el-radio-group v-model="couponform.type">
              <el-radio label="3">无门槛</el-radio>
              <el-radio label="1">满减</el-radio>
            </el-radio-group>
            <div class="beforeFull" v-if="couponform.type==1">
              <precision-input
                :num="couponform.fullMoney"
                :text="'元'"
                :placeholder="'满减门槛'"
                :type="'price'"
                @getNum="(value)=>{this.couponform.fullMoney=value}"
              ></precision-input>
            </div>
          </el-form-item>
          <el-form-item label="有效期">
            <div class="timeType">
              <el-radio-group v-model="couponform.invalidType">
                <el-radio :label="1">日期范围</el-radio>
                <el-radio :label="2">固定天数</el-radio>
              </el-radio-group>
            </div>
            <div class="timeType">
              <el-date-picker
                v-if="couponform.invalidType==1"
                v-model="timeRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </div>
            <div class="timeType">
              <el-input v-if="couponform.invalidType==2" v-model.number="couponform.days" class="inputRemaid">
                <template slot="append">天</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="可使用商品">
            <div>
              <el-radio-group v-model="couponform.appoint">
                <el-radio label="1">指定商品</el-radio>
                <el-radio label="2">指定商品分类</el-radio>
                <el-radio label="3">全场</el-radio>
              </el-radio-group>
            </div>
            <div v-if="couponform.appoint=='1'">
              <div class="searchBar">
                <div class="search_box">
                  <el-select v-model="searchGood" filterable remote value-key="id" :remote-method="selectByKwd" placeholder="请选择商品(可搜索)" clearable>
                    <el-option v-for="item in searchGoodsList" :key="item.id" :label="item.goodsTitle" :value="item"></el-option>
                  </el-select>
                </div>
                <div class="search_box">
                  <el-button @click="appendToCoupon" size="small" plain>添加</el-button>
                </div>
              </div>
              <div class="relatGoodsbox">
                <div class="relatGoodsRight">
                  <el-checkbox-group v-model="relatedList">
                    <div class="related" v-if="relatedGood.length>0">
                      <el-checkbox v-for="item in relatedGood" :label="item.id" checked :key="item.id">{{item.goodsTitle}}</el-checkbox>
                    </div>
                    <div v-if="appendList.length>0" class="searchgood">
                      <el-checkbox v-for="item in appendList" :label="item.id" :key="item.id">{{item.goodsTitle}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <div v-if="couponform.appoint=='2'">
              <div class="searchBar">
                <div class="search_box">
                  <el-cascader ref="categoryList" placeholder="请选择分类" v-model="searchCate" :props="props" :options="categoryList" clearable></el-cascader>
                </div>
                <div class="search_box">
                  <el-button @click="appendToCoupon" size="small" plain>添加</el-button>
                </div>
              </div>
              <div class="relatGoodsbox">
                <div class="relatGoodsRight">
                  <el-checkbox-group v-model="relatedList">
                    <div class="related" v-if="relatedCate.length>0">
                      <el-checkbox v-for="item in relatedCate" :label="item.id" checked :key="item.id">{{item.categoryName}}</el-checkbox>
                    </div>
                    <div v-if="appendList.length>0" class="searchgood">
                      <el-checkbox v-for="item in appendList" :label="item.id" :key="item.id">{{item.categoryName}}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="优惠券说明">
            <el-input v-model="couponform.comment"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('couponform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList } from "../../api/good";
import { getCategoryByPar } from "../../api/category";
import { addOrEditCoupon, getCouponEditById } from "../../api/promotion";
import precisionInput from "../../components/precisionInput";
export default {
  data() {
    return {
      couponform: {
        appoint: "3" /* 1.指定商品 2指定商品分类  3全场 */,
        appointId: [] /* 当appoint为指定商品或者指定分类时的指定id */,
        couponCategory: "" /* 优惠券生成时的类型 1:注册赠券 2.购物赠券 3.全场赠券 4.会员赠券 */,
        endTime: "" /* 优惠券结束时间 */,
        startTime: "" /* 优惠券开始时间 */,
        days: null /* 固定天数 */,
        invalidType: 1 /* 失效类型1 指定时间 2 指定天数 即优惠券无过期时间 */,
        platform: "" /* 适用平台 */,
        name: "" /* 优惠券名称 */,
        total: null /* 发行总量 */,
        price: null /* 面额 */,
        fullMoney: null /* 满 */,
        comment: "",
        type: "1" /* 1满减券 2叠加满减券 3无门槛券（需要限制大小） */
      },
      timeType: 1 /* 1 日期范围 2 固定天数 */,
      timeRange: [] /* 起始时间 */,
      categoryList: [
        {
          id: "1214083248477495298",
          createTime: "2020-01-06 15:16:18",
          updateTime: "2020-01-06 15:16:18",
          operator: "admin",
          isDelete: 0,
          categoryName: "一级分类1",
          categorySort: 1,
          categoryStatus: true,
          isParent: false,
          parentId: "1",
          categoryIcon: "http://192.168.0.233:8400/file/5e12cd54a1a09a0baeb1443e",
          childList: null
        }
      ],
      props: {
        value: "id",
        label: "categoryName",
        checkStrictly: true,
        emitPath: false,
        lazy: true,
        lazyLoad(node, resolve) {
          getCategoryByPar({
            parentId: node.data.id,
            pageNo: 1,
            pageSize: 40
          }).then(data => {
            if (data.data.status == 0) {
              resolve(data.data.data.list);
            }
          });
        }
      },
      couponRules: {
        name: [{ required: true, message: "请填写优惠券名称", trigger: "blur" }],
        total: [{ required: true, message: "请填写优惠券总量", trigger: "blur" }],
        price: [{ required: true, message: "请填写优惠券面值", trigger: "blur" }],
        type: [{ required: true, message: "请选择优惠券类型", trigger: "blur" }]
      },
      searchCate: "" /* 选择的分类 */,
      searchGood: "" /* 选择的商品 */,
      searchGoodsList: [] /* 搜索的商品列表 */,
      appendList: [] /* 追加的列表 */,
      relatedList: [] /* 最终要提交的 */,
      relatedGood: [] /* 之前绑定的商品 */,
      relatedCate: [] /* 之前绑定的分类 */
    };
  },
  watch: {
    timeRange: {
      handler() {
        this.couponform.startTime = this.timeRange[0];
        this.couponform.endTime = this.timeRange[1];
      }
    },
    /* 是否满减 */
    "couponform.type": {
      handler() {
        if (this.couponform.type == "3") {
          this.couponform.fullMoney = null;
        }
      }
    },
    /* 优惠券适用类型 */
    "couponform.appoint": {
      handler() {
        this.couponform.appointId = [];
        this.relatedList = [];
        this.appendList = [];
      }
    },
    /* 优惠券失效时间类型 */
    "couponform.invalidType": {
      handler() {
        if (this.couponform.invalidType == 1) {
          this.couponform.days = null;
        } else if (this.couponform.invalidType == 2) {
          this.timeRange = ["", ""];
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      getCouponEditById(this.$route.query.id).then(data => {
        if (data.data.status == 200) {
          this.couponform = data.data.content;
          if (this.couponform.appoint == "1") {
            this.relatedGood = this.couponform.data;
          } else if (this.couponform.appoint == "2") {
            this.relatedCate = this.couponform.data;
          } else {
            this.relatedList = [];
          }
          if (this.couponform.invalidType == 1) {
            this.timeRange = new Array(2);
            this.timeRange[0] = this.couponform.startTime;
            this.timeRange[1] = this.couponform.endTime;
          }
        }
      });
    }
    /* 初始化级联列表 */
    getCategoryByPar({ pageNo: 1, pageSize: 40 }).then(data => {
      if (data.data.status == 0) {
        this.categoryList = data.data.data.list;
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.couponform.appointId = this.relatedList;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            (this.couponform.appoint == "1" || this.couponform.appoint == "2") &&
            this.couponform.appointId.length <= 0
          ) {
            this.$message.error("请添加适用的商品或分类");
          } else if (
            (this.couponform.invalidType == "1" &&
              (this.couponform.startTime == "" || this.couponform.endTime == "")) ||
            (this.couponform.invalidType == "2" && this.couponform.days === null)
          ) {
            this.$message.error("请填写时间");
          } else if (this.couponform.type == "1" && !this.couponform.fullMoney) {
            this.$message.error("请输入满减金额");
          } else {
            addOrEditCoupon(this.couponform).then(data => {
              if (data.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.$router.push({ name: "coupon_idx" });
              } else {
                this.$message.error("修改失败");
              }
            });
          }
        } else {
          this.$message.error("请填写完必填参数");
          return false;
        }
      });
    },
    selectByKwd(val) {
      if (val != "") {
        getGoodsList({
          pageNo: 1,
          goodsTitle: val
        }).then(data => {
          if (data.data.status == 0) {
            this.searchGoodsList = data.data.data.data.list;
          }
        });
      }
    },
    appendToCoupon() {
      if (this.couponform.appoint == 1) {
        if (this.appendList.indexOf(this.searchGood) == -1 && this.relatedList.indexOf(this.searchGood) == -1) {
          this.appendList.push(this.searchGood);
          this.relatedList.push(this.searchGood.id);
        } else {
          this.$message.error("已经存在在列表中了");
        }
      } else if (this.couponform.appoint == 2) {
        if (this.appendList.indexOf(this.searchCate) == -1 && this.relatedList.indexOf(this.searchCate) == -1) {
          let nodeObj = this.$refs["categoryList"].getCheckedNodes();
          let obj = {
            id: nodeObj[0].data.id,
            categoryName: nodeObj[0].data.categoryName
          };
          this.appendList.push(obj);
          this.relatedList.push(this.searchCate);
        } else {
          this.$message.error("已经存在在列表中了");
        }
      }
    }
  },
  //是否有富文本编辑
  components: { precisionInput }
};
</script>

<style lang='less'>
#couponAlter {
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
      width: 600px;
      margin: 0 auto;
      text-align: left;
      .beforeFull {
        display: inline-block;
        margin-left: 10px;
      }
    }
  }
}
</style>
