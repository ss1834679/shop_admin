<template>
  <div id="importalterquota">
    <!-- 导入报价-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div style="margin-left:15px">
          <span class="title">导入报价</span>
        </div>
        <el-button size="small" @click="closeTap" v-if="$route.query.type=='newtag'" style="margin-right:20px">关闭页面</el-button>
      </div>

      <div class="content">
        <div class="projectInfo">
          <div>{{projectform.title}}</div>
          <div class="projectVHAA">
            <span>{{projectform.villageName}}</span>
            <span>{{projectform.houseType}}</span>
            <span>{{projectform.srcArea}}㎡</span>
            <span>{{projectform.floorPlanAddress+projectform.villageName}}</span>
          </div>
        </div>
        <div style="margin-top:8px" class="projectInfo">
          <span class="projectRemind">功能介绍: 使用excel快速导入案例报价，仅支持上传xls、xlsx文件导入前请认真检查数据是否正确，模板文件中*标字段为必填项一次仅支持一份文件上传，再次导入将覆盖已导入的数据</span>
        </div>
        <div class="projectInfo projectUpload">
          <el-upload
            class="uploaddiv"
            ref="uploadquota"
            action="/"
            :limit="1"
            :multiple="false"
            :http-request="handleUpload"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </div>
        <div class="projectInfo">
          <div>
            <el-button size="small" type="success" @click="submitUpload">上传参考报价</el-button>
            <el-button size="small" @click="downloadTemplate('consult')">下载参考报价模板文件</el-button>
            <el-button size="small" type="success" @click="submitUpload">上传官方报价</el-button>
            <el-button size="small" @click="downloadTemplate('official')">下载官方报价模板文件</el-button>
          </div>
        </div>
        <div class="projectInfo">
          <div class="navbar">
            <div
              v-for="item in navbarList"
              :key="item.key"
              @click="nowNav=item.key"
              :class="item.key===nowNav?'nowNav navItem':'navItem'"
            >{{item.name}}</div>
          </div>
          <div v-if="projectform[`${nowNav}`]" class="msgbox">
            <div class="space">
              <div class="spacehead">
                <div class="spacetitle">
                  <span>按空间报价</span>
                </div>
                <div class="spaceprice">
                  <p>
                    总计：
                    <span style="color:red">{{projectform[nowNav].totalPrice}}</span> 元
                  </p>
                  <p>
                    均价：
                    <span style="color:red">{{projectform[nowNav].averagePrice}}</span> 元
                  </p>
                </div>
              </div>
              <div class="spacecontent">
                <ul>
                  <li class="contentLi">
                    <span>客餐厅</span>
                    <p>
                      <span style="color:red">{{projectform[nowNav].restaurant}}</span>元
                    </p>
                  </li>
                  <li class="contentLi">
                    <span>卧室</span>
                    <p>
                      <span style="color:red">{{projectform[nowNav].bedroom}}</span>元
                    </p>
                  </li>
                  <li class="contentLi">
                    <span>厨房</span>
                    <p>
                      <span style="color:red">{{projectform[nowNav].kitchen}}</span>元
                    </p>
                  </li>
                  <li class="contentLi">
                    <span>厕所</span>
                    <p>
                      <span style="color:red">{{projectform[nowNav].toilet}}</span>元
                    </p>
                  </li>
                  <li class="contentLi">
                    <span>其他</span>
                    <p>
                      <span style="color:red">{{projectform[nowNav].other}}</span>元
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <el-table
              :data="itemList"
              :show-header="false"
              style="width: 100%"
              row-key="key"
              :expand-row-keys="expandKey"
              @expand-change="expandChange"
              class="detailTable"
            >
              <el-table-column prop="title" width="200px"></el-table-column>
              <el-table-column>
                <template slot-scope="scope">{{projectform[nowNav][`${scope.row.key}TotalCount`]}}项</template>
              </el-table-column>
              <el-table-column align="right">
                <template slot-scope="scope">
                  <p style="margin:0">
                    小计：
                    <span style="color:red">{{projectform[nowNav][`${scope.row.key}TotalPrcie`]}}</span>
                    元
                  </p>
                </template>
              </el-table-column>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-table :data="projectform[nowNav][`${scope.row.key}Materials`]">
                    <el-table-column label="序号">
                      <template slot-scope="scope">{{scope.$index+1}}</template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="brand" label="品牌"></el-table-column>
                    <el-table-column prop="model" label="型号"></el-table-column>
                    <el-table-column prop="specs" label="规格"></el-table-column>
                    <el-table-column prop="price" label="价格">
                      <template slot-scope="scope">
                        <span style="color:red">{{scope.row.price}}</span>元
                      </template>
                    </el-table-column>
                    <el-table-column prop="comment" label="备注"></el-table-column>
                  </el-table>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else class="nomsg">暂无数据</div>
        </div>
      </div>
    </el-card>
    <el-dialog width="400px" :visible.sync="dialogFormVisible">
      <div class="imgAndtitle">
        <img src="../../../public/img/right.png" alt />
        <span>导入成功</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="400px" :visible.sync="failVisible">
      <div class="imgAndtitle">
        <img src="../../../public/img/fail.png" alt />
        <span>导入失败</span>
      </div>
      <div class="failReason">
        <span style="margin-left:25px">错误原因：</span>
        <ol>
          <li v-for="item in failList" :key="item">{{item}}</li>
        </ol>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="failVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getQuoteListById, uploadQuote } from "../../api/promanage";
export default {
  data() {
    return {
      isqouta: false /* 是否报价 */,
      dialogFormVisible: false /* 成功显示 */,
      failVisible: false /* 失败显示 */,
      failList: [] /* 失败原因 */,
      navbarList: [
        { name: "官方", key: "officialHome" },
        { name: "舒适家", key: "comfortableHome" },
        { name: "品质家", key: "qualityHome" },
        { name: "典雅家", key: "elegantHome" }
      ],
      itemList: [
        { title: "基装", key: "base" },
        { title: "主材", key: "main" },
        { title: "家具", key: "furniture" },
        { title: "家电", key: "electrica" },
        { title: "窗帘", key: "curtain" },
        { title: "灯具", key: "lamps" }
      ],
      rowData: [],
      expandKey: [],
      nowNav: "comfortableHome",
      projectform: {
        villageName: "",
        houseType: "",
        srcArea: 0,
        style: "",
        title: "",
        floorPlanAddress: ""
      },
      fileList: []
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getQuoteListById(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          this.projectform = data.data.data;
        }
      });
    }
  },
  methods: {
    downloadTemplate(val) {
      if (val == "consult") {
        let a = document.createElement("a");
        a.download = `报价模板.xls`;
        a.href = "http://cdn-file.tbzj.net/fileserver/file/common/5eeb29149824ae21d8c68c09";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (val == "official") {
        let a = document.createElement("a");
        a.download = `官方报价模板.xls`;
        a.href = "http://cdn-file.tbzj.net/fileserver/file/common/5f10ffe69824ae21d8c7107d";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    handleUpload(file) {
      uploadQuote(this.$route.query.id, file.file).then(data => {
        if (data.data.status == 0) {
          this.dialogFormVisible = true;
          getQuoteListById(this.$route.query.id).then(data => {
            if (data.data.status == 0) {
              this.projectform = data.data.data;
            }
          });
          this.$refs.uploadquota.clearFiles();
        } else {
          this.failVisible = true;
          this.failList = data.data.data;
          this.$refs.uploadquota.clearFiles();
        }
      });
    },
    submitUpload() {
      this.$refs.uploadquota.submit();
    },
    closeTap() {
      window.close();
    },
    expandChange(row) {
      if (this.expandKey.length > 0 && row.key == this.expandKey[0]) {
        this.expandKey = [];
      } else {
        this.expandKey = [row.key];
      }
    }
  }
};
</script>

<style lang='less'>
#importalterquota {
  .imgAndtitle {
    img {
      width: 70px;
      height: 70px;
    }
    span {
      font-size: 16px;
      color: rgb(217, 0, 27);
      line-height: 55px;
      font-weight: 600;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
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
  }
  .projectUpload {
    .uploaddiv {
      display: flex;
      .el-upload-list__item:first-child {
        margin: 0;
      }
      .el-upload-list__item {
        line-height: 30px;
        background-color: #f5f7fa;
      }
    }
    .el-upload-list {
      width: 500px;
    }
  }
  .projectInfo {
    border: 1px solid #ccc;
    padding: 8px 10px;
    .projectVHAA {
      max-width: 1000px;
      min-width: 700px;
      display: flex;
      justify-content: space-between;
    }
    .projectRemind {
      display: inline-block;
      width: 500px;
      color: #aaa;
    }
    .navbar {
      display: flex;
      padding: 20px 0;
    }
    .navItem {
      margin: 0 20px;
      color: #333;
      cursor: pointer;
    }
    .nowNav {
      color: #1abc9c;
      border-bottom: 1px solid #1abc9c;
    }
    .nomsg {
      width: 100%;
      height: 250px;
      line-height: 250px;
      text-align: center;
    }
    .msgbox {
      width: 100%;
      .space {
        border: 1px solid #333;
        .spacehead {
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          p {
            margin: 0;
          }
          .spaceprice {
            display: flex;
            justify-content: space-between;
            width: 300px;
          }
        }
        .spacecontent {
          * {
            margin: 0;
            padding: 0;
          }
          border-top: 1px solid #333;
          ul {
            list-style: none;
            .contentLi {
              display: flex;
              justify-content: space-between;
              padding: 10px 20px;
              position: relative;
            }
            .contentLi::before {
              display: block;
              position: absolute;
              bottom: 0;
              width: calc(~"100% - 40px");
              height: 1px;
              content: "";
              background-color: #333;
            }
            .contentLi:last-child::before {
              display: none;
            }
          }
        }
      }
      .detailTable {
        border: 1px solid #333;
        border-top: none;
      }
    }
  }
}
</style>
