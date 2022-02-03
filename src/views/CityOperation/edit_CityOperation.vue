<template>
  <div id="add_CityOperation">
    <!-- 编辑城市运营中心-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">编辑城市运营中心</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form :model="CityOperationForm" ref="CityOperationForm" :rules="cityOperationRules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="CityOperationForm.name" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="logo" prop="logoImage" v-if="showImg">
            <upload-img
              @getimgArr="(imgarr)=>{this.CityOperationForm.logoImage = imgarr}"
              :imgArr="CityOperationForm.logoImage"
              :limit="1"
              :size="{ height: 1, width: 1 }"
            ></upload-img>
          </el-form-item>

          <el-form-item label="联系人姓名" prop="contractName">
            <el-input v-model="CityOperationForm.contractName" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="mobile">
            <el-input v-model.number="CityOperationForm.mobile" @blur="blueText" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="城市:" required>
            <div style="display:flex">
              <div style="width:140px;">
                <el-select v-model="CityOperationForm.province" placeholder="省" @change="changeProvince({level:1})" filterable clearable>
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in provinceList" :key="item.id"></el-option>
                </el-select>
              </div>
              <div style="width:140px;">
                <el-select v-model="CityOperationForm.city" placeholder="市" @change="changeProvince({level:2})" filterable clearable>
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in cityList" :key="item.id"></el-option>
                </el-select>
              </div>
              <div style="width:140px;">
                <el-select v-model="CityOperationForm.district" placeholder="区" @change="changeProvince({level:3})" filterable clearable>
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in conutyList" :key="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="详细地址" prop="addressDetail">
            <el-input v-model="CityOperationForm.addressDetail" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="remark">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="CityOperationForm.remark" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="CityOperationForm.sort" :controls="false" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="列表显示" prop="isDisplay">
            <el-radio-group v-model="CityOperationForm.isDisplay">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="虚拟好评率:" prop="goodRate">
            <template slot-scope>
              <el-input-number v-model="CityOperationForm.goodRate" :controls="false" :min="0" :max="99"></el-input-number>%
              <div style="font-size:13px;color:#888">前端显示好评率=真实好评率+虚拟好评率</div>
            </template>
          </el-form-item>
          <el-form-item label="虚拟进行中订单数:" prop="startingOrder">
            <template slot-scope>
              <el-input-number v-model="CityOperationForm.startingOrder" :controls="false" :min="0"></el-input-number>
              <div style="font-size:13px;color:#888">前端显示进行中的订单数=真实进行中的订单数+虚拟进行中的订单数</div>
            </template>
          </el-form-item>
          <el-form-item label="虚拟已完成订单数:" prop="completeOrder">
            <template slot-scope>
              <el-input-number v-model="CityOperationForm.completeOrder" :controls="false" :min="0"></el-input-number>
              <div style="font-size:13px;color:#888">前端显示已完成订单数=真实已完成的订单数+虚拟已完成的订单数</div>
            </template>
          </el-form-item>
          <el-form-item label="关联商品" class="relatGoods">
            <div class="searchBar">
              <div class>
                <el-select v-model="searchGoodId" filterable remote value-key="id" :remote-method="selectByKwd" placeholder="请搜索商品" clearable>
                  <el-option v-for="item in searchGoodsList" :key="item.id" :label="item.goodsTitle" :value="item.id"></el-option>
                </el-select>
              </div>
              <div class>
                <el-button @click="appendToInspiration" size="small" plain>添加</el-button>
              </div>
            </div>
            <el-table :data="relatedList" style="width: 800px" border>
              <el-table-column prop="goodsTitle" label="商品名称" width="400px"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteItem(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="关联案例" class="relatGoods">
            <div class="searchBar">
              <div class>
                <el-select v-model="searchProItem" filterable remote value-key="id" :remote-method="selectPro" placeholder="请搜索案例" clearable>
                  <el-option v-for="item in searchProList" :key="item.id" :label="item.title" :value="item"></el-option>
                </el-select>
              </div>
              <div class>
                <el-button @click="appendToPro" size="small" plain>添加</el-button>
              </div>
            </div>
            <el-table :data="relatedProList" style="width: 800px" border>
              <el-table-column prop="title" label="案例名称" width="400px"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteProItem(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('CityOperationForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { saveOrUpdateBusinessCenter, findOneBusinessCenter } from "../../api/cityOperation";
import { getProvinceList, getRegionList } from "../../api/usercenter";
import { getGoodsList } from "../../api/good";
import uploadImg from "../../components/uploadImg";
import { getAllQuoteByPage } from "../../api/promanage";
export default {
  data() {
    return {
      showImg: true,
      searchGoodsList: [] /* 搜索商品列表 */,
      searchGoodId: "" /* 搜索关联的商品 */,
      searchProList: [] /* 搜索案例列表 */,
      searchProItem: "" /* 搜索关联的案例对象 */,
      relatedProList: [] /* 已经关联的案例列表 */,
      goodsItem: "" /* 搜索关联的sku商品 */,
      relatedList: [] /* 搜索关联的sku商品列表 */,
      CityOperationForm: {
        id: "",
        name: "" /* 用户名 */,
        logoImage: "" /* logo图片 */,
        contractName: "" /* 联系人名称 */,
        mobile: "" /* 电话 */,
        city: "" /* 城市 */,
        addressDetail: "" /* 详细地址 */,
        sort: "" /* 排序 */,
        remark: "" /* 输入的简介 */,
        province: "" /* 省市 */,
        goodRate: "" /* 虚理评论输入 */,
        startingOrder: "" /* 虚拟进行中订单数输入 */,
        completeOrder: "" /* 虚拟已完成订单数输入 */,
        isDisplay: "" /* 是否显示 */,
        district: "" /* 区县 */
      },
      provinceId: "",
      cityId: "",
      districtId: "",
      provinceList: [] /* 省市列表 */,
      cityList: [] /* 城市列表*/,
      conutyList: [] /* 区县列表 */,
      cityOperationRules: {
        name: [{ required: true, message: "请填写名称", trigger: "blur" }],
        contractName: [{ required: true, message: "请填写联系人", trigger: "blur" }],
        goodRate: [{ required: true, message: "请输入虚拟好评率", trigger: "blur" }],
        addressDetail: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
        slot: [{ required: true, message: "请输入排序", trigger: "blur" }],
        remark: [{ required: true, message: "请输入简介", trigger: "blur" }],
        startingOrder: [{ required: true, message: "请输入虚拟进行中订单数", trigger: "blur" }],
        completeOrder: [{ required: true, message: "请输入虚拟已完成订单数", trigger: "blur" }],
        logoImage: [{ required: true, message: "请上传logo图", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }]
      }
    };
  },
  watch: {
    //   根据搜索关联的商品，获取sku商品
    searchGoodId() {
      this.goodsItem = {};
      this.searchGoodsList.map(item => {
        if (this.searchGoodId == item.id) {
          this.goodsItem = {
            id: item.id,
            goodsTitle: item.goodsTitle,
            num: 1
          };
        }
      });
    }
  },
  mounted() {
    if (this.$route.query.id) {
      // 根据id查询单个城市运行中心
      findOneBusinessCenter({
        id: this.$route.query.id
      }).then(data => {
        this.CityOperationForm = data.data.data;
        getProvinceList().then(data => {
          this.provinceList = data.data.content;
          this.provinceList.forEach(item => {
            if (this.CityOperationForm.province == item.criCode) {
              this.CityOperationForm.province = item.criName;
            }
          });
        });
        // 回显城市，获取城市数据调接口
        getRegionList(this.CityOperationForm.province).then(data => {
          this.cityList = data.data.content;
          this.cityList.forEach(item => {
            if (this.CityOperationForm.city == item.criCode) {
              this.CityOperationForm.city = item.criName;
            }
          });
        });
        // 回显城市，获取城市数据调接口
        getRegionList(this.CityOperationForm.city).then(data => {
          this.conutyList = data.data.content;
          this.conutyList.forEach(item => {
            if (this.CityOperationForm.district == item.criCode) {
              this.CityOperationForm.district = item.criName;
            }
          });
        });
        this.refreshImg();
        this.relatedList = data.data.data.goodsVoList;
        this.relatedList = this.relatedList.map(item => {
          let ids = {
            goodsId: item.goodsId,
            goodsTitle: item.goods.goodsTitle
          };
          return ids;
        });
        this.relatedProList = data.data.data.businessCenterInspirationsVo;
        this.relatedProList = this.relatedProList.map(item => {
          let ids = {
            inspirationId: item.quote.id,
            title: item.quote.title
          };
          return ids;
        });
      });
    }
  },
  methods: {
    // 刷新图片
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    // 切换省市区
    changeProvince(obj) {
      if (obj.level == 1) {
        getRegionList(this.CityOperationForm.province).then(data => {
          this.cityList = data.data.content;
        });
        this.CityOperationForm.city = "";
      } else if (obj.level == 2) {
        getRegionList(this.CityOperationForm.city).then(data => {
          this.conutyList = data.data.content;
        });
        this.CityOperationForm.district = "";
      }
    },
    // 验证手机号码
    blueText(e) {
      if (!/^1[3456789]\d{9}$/.test(e.target.value)) {
        this.$message.warning("请输入正确手机号");
        this.CityOperationForm.mobile = "";
      }
    },
    // 提交编辑订单城市运营中心
    submitForm(CityOperationForm) {
      this.provinceList.forEach(item => {
        if (this.CityOperationForm.province == item.criName) {
          this.CityOperationForm.province = item.criCode;
        }
      });
      this.cityList.forEach(item => {
        if (this.CityOperationForm.city == item.criName) {
          this.CityOperationForm.city = item.criCode;
        }
      });
      this.conutyList.forEach(item => {
        if (this.CityOperationForm.district == item.criName) {
          this.CityOperationForm.district = item.criCode;
        }
      });
      this.$refs[CityOperationForm].validate(valid => {
        if (valid) {
          this.CityOperationForm.goodsList = this.relatedList;
          this.CityOperationForm.businessCenterInspirations = this.relatedProList;
          saveOrUpdateBusinessCenter(this.CityOperationForm).then(data => {
            if (data.data.status == 0) {
              this.$message({
                message: "成功修改运营中心",
                type: "success"
              });
              this.$router.go(-1);
            } else {
              this.$message.error("修改运营中心失败");
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 搜索关联的商品
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
    selectPro(val) {
      if (val != "") {
        getAllQuoteByPage({
          pageNo: 1,
          pageSize: 20,
          title: val
        }).then(data => {
          if (data.data.status == 0) {
            this.searchProList = data.data.data.list;
          }
        });
      }
    },
    // 添加搜索的关联商品
    appendToInspiration() {
      new Promise((resolve, reject) => {
        if (!this.goodsItem.id) {
          reject({ msg: "不能加空的！" });
        }
        this.relatedList.map(item => {
          if (item.goodsId == this.goodsItem.id) {
            reject({ msg: "已经存在在列表中了" });
          }
        });
        resolve();
      })
        .then(() => {
          let obj = {};
          obj["goodsId"] = this.goodsItem.id;
          obj.goodsTitle = this.goodsItem.goodsTitle;
          this.relatedList.push(obj);
        })
        .catch(data => {
          this.$message.error(data.msg);
        });
    },
    appendToPro() {
      new Promise((resolve, reject) => {
        if (!this.searchProItem.id) {
          reject({ msg: "不能加空的！" });
        }
        this.relatedProList.map(item => {
          if (item.id == this.searchProItem.id) {
            reject({ msg: "已经存在在列表中了" });
          }
        });
        resolve();
      })
        .then(() => {
          let obj = {};
          obj["inspirationId"] = this.searchProItem.id;
          obj.title = this.searchProItem.title;
          this.relatedProList.push(obj);
        })
        .catch(data => {
          this.$message.error(data.msg);
        });
    },
    deleteProItem(index) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      new Promise(resolve => {
        this.relatedProList.splice(index, 1);
        resolve();
      }).then(() => {
        loading.close();
      });
    },
    // 关联的商品删除
    deleteItem(index) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      new Promise(resolve => {
        this.relatedList.splice(index, 1);
        resolve();
      }).then(() => {
        loading.close();
      });
    }
  },

  //是否有富文本编辑
  components: { uploadImg }
};
</script>

<style lang='less' scoped>
#add_CityOperation {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      //   width: 60%;
      text-align: left;
      .img_box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          width: 100px;
          height: 100px;
          margin-left: 25px;
        }
      }
      .el-cascader .el-input__inner {
        width: 300px; //搜索框宽度
      }
    }
  }
}
.se-box {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
