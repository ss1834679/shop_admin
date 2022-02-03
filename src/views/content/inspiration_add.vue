<template>
  <div id="inspirationAdd">
    <!-- 灵感的添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">添加灵感</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="inspirationform" ref="inspirationform" :rules="inspirationRules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="灵感标题" required prop="title">
            <el-input v-model="inspirationform.title"></el-input>
          </el-form-item>
          <el-form-item label="部门">设计部</el-form-item>
          <el-form-item label="案列位置" required>
            <div class="searchBar">
              <div class="search_box">
                <el-select v-model="inspirationform.provinceId" @change="changeOrigin({level:1})" placeholder="选择省" filterable clearable>
                  <el-option v-for="item in provinceList" :key="item.id" :label="item.criName" :value="item.criCode"></el-option>
                </el-select>
              </div>
              <div class="search_box">
                <el-select v-model="inspirationform.cityId" @change="changeOrigin({level:2})" placeholder="选择市" filterable clearable>
                  <el-option v-for="item in cityList" :key="item.id" :label="item.criName" :value="item.criCode"></el-option>
                </el-select>
              </div>
              <div class="search_box">
                <el-select v-model="district" @change="changeOrigin({level:3})" placeholder="选择区" filterable value-key="id" clearable>
                  <el-option v-for="item in districtList" :key="item.id" :label="item.criName" :value="item"></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="小区名称" required prop="villageAddressId">
            <el-select v-model="inspirationform.villageAddressId" placeholder="选择小区" filterable clearable>
              <el-option v-for="item in villageList" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="面积" required prop="houseArea">
            <el-input placeholder="面积" v-model="inspirationform.houseArea">
              <template slot="append">㎡</template>
            </el-input>
          </el-form-item>
          <el-form-item label="风格" required prop="decorateStyleId">
            <el-select
              v-model="decorateArr"
              multiple
              :multiple-limit="2"
              @change="(value)=>{this.inspirationform.decorateStyleId=value.join('_')}"
              placeholder="请选择风格"
            >
              <el-option v-for="item in decorateStyle" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="户型" required prop="houseTypeId">
            <el-select v-model="inspirationform.houseTypeId" placeholder="请选择户型">
              <el-option v-for="item in homeTypeList" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="3D图链接">
            <el-input v-model="inspirationform.threeImage"></el-input>
          </el-form-item>
          <el-form-item label="显示设置" required prop="isDisplay">
            <el-switch v-model="inspirationform.isDisplay" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="灵感正文" required prop="content">
            <wang-editor :value="inspirationform.content" @getHtmlFromWang="(value)=>{this.inspirationform.content=value}"></wang-editor>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="关联商品" class="relatGoods">
            <div class="searchBar">
              <div class="search_box">
                <el-select v-model="searchGoodId" filterable remote value-key="id" :remote-method="selectByKwd" placeholder="请搜索商品" clearable>
                  <el-option v-for="item in searchGoodsList" :key="item.id" :label="item.goodsTitle" :value="item.id"></el-option>
                </el-select>
              </div>
              <div class="search_box">
                <el-select v-model="goodsItem" filterable remote value-key="id" placeholder="请选择商品的SKU" clearable>
                  <el-option v-for="item in goodsItemList" :key="item.id" :label="item.itemTitle" :value="item"></el-option>
                </el-select>
              </div>
              <div class="search_box">
                <el-button @click="appendToInspiration" size="small" plain>添加</el-button>
              </div>
            </div>
            <el-table :data="relatedList" style="width: 800px" border>
              <el-table-column prop="itemTitle" label="SKU名称" width="400px"></el-table-column>
              <el-table-column prop="num" label="数量">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.num" :precision="0" :controls="false" :min="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteItem(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="灵感大图" required prop="bigImage">
            <upload-img
              @getimgArr="(imgarr)=>{this.inspirationform.bigImage = imgarr}"
              :imgArr="inspirationform.bigImage"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
          </el-form-item>
          <el-form-item label="灵感小图" required prop="thumbnailImage">
            <upload-img
              @getimgArr="(imgarr)=>{this.inspirationform.thumbnailImage = imgarr}"
              :imgArr="inspirationform.thumbnailImage"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('inspirationform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import wangEditor from "../../components/wangEditor";
import uploadImg from "../../components/uploadImg";
import { getGoodsList } from "../../api/good";
import { insertOrUpdateInspiration } from "../../api/circle";
import { getGoodsItem } from "../../api/indexRecommend";
import { getProvinceList, getRegionList, getVillageByDistrictId } from "../../api/usercenter";
import { getAllUsableHouseType, getAllUsableDecorateStyle } from "../../api/setings";
export default {
  data() {
    return {
      inspirationform: {
        isDisplay: true /* 是否显示 */,
        provinceId: "" /* 省级id */,
        cityId: "" /* 市级id */,
        districtId: "" /* 区级id */,
        villageAddressId: "" /* 小区地址id */,
        bigImage: "" /* 大图 */,
        thumbnailImage: "" /* 小图 */,
        content: "" /* 富文本 灵感内容 */,
        decorateStyleId: "" /* 装修风格id 用  _  拼接 */,
        decorateTypeId: "" /* 装修类型  暂无 */,
        houseArea: "" /* 户型面积 */,
        houseTypeId: "" /* 户型id */,
        threeImage: "" /*https://720.tbzj.net/ 3d图 */,
        title: "" /* 标题 */,
        goodIdList: [] /* 关联的商品 */
      },
      provinceList: [] /* 省级列表 */,
      cityList: [] /* 市级列表 */,
      districtList: [] /* 区级列表 */,
      district: {} /* 区级对象 */,
      villageList: [] /* 小区列表 */,
      homeTypeList: [] /* 户型列表 */,
      decorateStyle: [] /* 装修风格列表 */,
      decorateArr: [] /* 装修风格中间变量 */,
      searchGoodId: "" /* 搜索的商品id */,
      goodsItemList: [] /* 通过搜索的商品id拿到的itemid */,
      goodsItem: {} /* 选中的商品sku */,
      searchGoodsList: [] /* 搜索的商品列表 */,
      relatedList: [] /* 已经关联的列表 最终提交的 */,
      inspirationRules: {
        title: [{ required: true, message: "请填写灵感名称", trigger: "blur" }],
        villageAddressId: [{ required: true, message: "请选择小区", trigger: "blur" }],
        houseArea: [{ required: true, message: "请填写户型面积", trigger: "blur" }],
        decorateStyleId: [{ required: true, message: "请选择装修风格", trigger: "blur" }],
        houseTypeId: [{ required: true, message: "请选择户型", trigger: "blur" }],
        isDisplay: [{ required: true, message: "请选择是否显示", trigger: "blur" }],
        content: [{ required: true, message: "请填写灵感内容", trigger: "blur" }],
        bigImage: [{ required: true, message: "请上传灵感大图", trigger: "blur" }],
        thumbnailImage: [{ required: true, message: "请上传灵感小图", trigger: "blur" }]
      }
    };
  },
  watch: {
    district: {
      handler() {
        this.inspirationform.districtId = this.district.criCode || "";
      },
      deep: true
    },
    searchGoodId: {
      handler() {
        if (this.searchGoodId != "") {
          this.goodsItem = {};
          getGoodsItem(this.searchGoodId).then(data => {
            if (data.data.status == 200) {
              this.goodsItemList = data.data.content;
            }
          });
        }
      }
    }
  },
  mounted() {
    /* 获取省级列表 */
    getProvinceList().then(data => {
      this.provinceList = data.data.content;
    });
    /* 获取户型列表 */
    getAllUsableHouseType().then(data => {
      if (data.data.status == 0) {
        this.homeTypeList = data.data.data;
      }
    });
    /* 获取装修风格列表 */
    getAllUsableDecorateStyle().then(data => {
      if (data.data.status == 0) {
        this.decorateStyle = data.data.data;
      }
    });
  },
  methods: {
    changeOrigin(obj) {
      if (obj.level == 1) {
        getRegionList(this.inspirationform.provinceId).then(data => {
          this.cityList = data.data.content;
        });
        this.inspirationform.cityId = "";
        this.inspirationform.districtId = "";
        this.inspirationform.villageAddressId = "";
        this.district = {};
        this.districtList = [];
        this.villageList = [];
      } else if (obj.level == 2) {
        getRegionList(this.inspirationform.cityId).then(data => {
          this.districtList = data.data.content;
        });
        this.inspirationform.districtId = "";
        this.inspirationform.villageAddressId = "";
        this.villageList = [];
      } else if (obj.level == 3) {
        getVillageByDistrictId(this.district.id).then(data => {
          if (data.data.status == 200) {
            this.villageList = data.data.content;
          }
        });
        this.inspirationform.villageAddressId = "";
      }
    },
    appendToInspiration() {
      new Promise((resolve, reject) => {
        if (!this.goodsItem.id) {
          reject({ msg: "不能加空的！" });
        }
        this.relatedList.map(item => {
          if (item.goodsItemId == this.goodsItem.id) {
            reject({ msg: "已经存在在列表中了" });
          }
        });
        resolve();
      })
        .then(() => {
          let obj = {};
          obj["num"] = 1;
          obj["goodsItemId"] = this.goodsItem.id;
          obj.itemTitle = this.goodsItem.itemTitle;
          this.relatedList.push(obj);
        })
        .catch(data => {
          this.$message.error(data.msg);
        });
    },
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
    submitForm(formName) {
      this.inspirationform.inspirationGoods = this.relatedList;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.inspirationform.threeImage &&
            this.inspirationform.threeImage.indexOf("/tiao?url=") == -1 &&
            this.inspirationform.threeImage.indexOf("https://720.tbzj.net") == -1 &&
            this.inspirationform.threeImage != ""
          ) {
            this.inspirationform.threeImage = "https://720.tbzj.net/tiao?url=" + this.inspirationform.threeImage;
          }
          insertOrUpdateInspiration(this.inspirationform).then(data => {
            if (data.data.status == 0) {
              this.$router.push({ name: "inspiration_Idx" });
              this.$message({
                type: "success",
                message: "添加成功"
              });
            } else {
              this.$message.error(data.data.msg);
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: "请检查参数是否填写完整！！",
            type: "error"
          });
          return false;
        }
      });
    }
  },
  components: { wangEditor, uploadImg }
};
</script>

<style lang='less'>
#inspirationAdd {
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
      text-align: left;
    }
  }
}
</style>
