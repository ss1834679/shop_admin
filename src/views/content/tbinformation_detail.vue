<template>
  <div id="good_veiw">
    <!-- 资讯详情 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">资讯详情</span>
        </div>
      </div>
      <div class="content">
        <el-form label-width="100px">
          <el-form-item label="标题">{{getNewDetailByForm.newsTitle}}</el-form-item>
          <el-form-item label="部门">{{getNewDetailByForm.department}}</el-form-item>
          <el-form-item label="是否显示">
            <span v-if="getNewDetailByForm.newsIsTop">是</span>
            <span v-else>否</span>
          </el-form-item>
          <el-form-item label="详情" class="detailsItem">
            <!-- <wang-editor :value="goodsform.goodsDesc.descContent" @getHtmlFromWang="(value)=>{this.goodsform.goodsDesc.descContent=value}"></wang-editor> -->
            <div>
              <div id="mobileDetails">
                <div class="bigcontent">
                  <div class="detcontent">
                    <div style="font-size:26px">{{getNewDetailByForm.newsTitle}}</div>
                    <div class="dcontent">
                      <div>已浏览{{getNewDetailByForm.views}}次</div>
                      <div>{{getNewDetailByForm.createTime}}</div>
                    </div>
                    <div class="scollConten" v-html="getNewDetailByForm.newsContent"></div>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="资讯内容：">
            <div class="scollConten" v-html="getNewDetailByForm.newsContent"></div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getNewDetailBy } from "../../api/tbinformation";
export default {
  data() {
    return {
      getNewDetailByForm: {
        department: "",
        newsTitle: "",
        newsContent: "",
        views: "",
        createTime: "",
        newsIsTop: ""
      },
      showTable: false /* 刷新table */,
    };
  },
  beforeMount() {
    getNewDetailBy({ newId: this.$route.query.id }).then(data => {
      if (data.data.status == 200) {
        this.getNewDetailByForm = data.data.content;
      }
    });
  },
  watch: {
    goodsform: {
      handler() {
        this.refreshTable();
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    /* 刷新 */
    refreshTable() {
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
      });
    }
  }
};
</script>

<style lang='less'>
#good_veiw {
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
      .el-form {
        .el-form-item {
          margin: 0;
          .el-form-item__label {
            border-left: 1px solid #ebeef5;
            border-top: 1px solid #ebeef5;
            background-color: #f9fafc;
          }
          .el-form-item__content {
            padding-left: 20px;
            border-left: 1px solid #ebeef5;
            border-right: 1px solid #ebeef5;
            border-top: 1px solid #ebeef5;
            display: flex;
            align-items: center;
            #autoTable {
              width: 100%;
            }
          }
        }
        .el-form-item.imgItem {
          .el-form-item__label {
            height: 210px;
            line-height: 210px;
          }
          .el-form-item__content {
            height: 210px;
            overflow-x: scroll;
            overflow-y: hidden;
            .imgbox {
              height: 100%;
              width: 2000px;
              display: flex;
              justify-content: flex-start;
              .el-image {
                margin-right: 15px;
              }
            }
          }
        }
        .el-form-item.detailsItem {
          .el-form-item__label {
            height: 585px;
            line-height: 585px;
          }
        }
        .el-form-item.optionalItem {
          .el-form-item__content {
            padding: 0;
          }
        }
        #mobileDetails {
          background: url("../../../public/img/phone.png") no-repeat center;
          background-size: 100% 100%;
          width: 298px;
          height: 583px;
          position: relative;
          .bigcontent {
            position: absolute;
            top: 65px;
            left: 20px;
            width: 258px;
            height: 451px;
            overflow: hidden;
            .detcontent {
              width: 275px;
              height: 451px;
              overflow-y: scroll;
              .scollConten {
                width: 100%;
                max-width: 800px;
              }
            }
          }
        }
      }
      .scollConten {
        width: 100%;
        max-width: 800px;
      }
      .discount .el-input__inner {
        width: 500px; //搜索框宽度
      }
      .afterSale .el-input__inner {
        width: 600px; /* 搜索框宽度 */
      }
    }
  }
}
.dcontent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #cccccc;
}
</style>
