<template>
  <div id="villageBatch">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>批量填写位置</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>
      <div class="content">
        <p class="sp-text">
          <span>打开</span>
          <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">http://api.map.baidu.com/lbsapi/getpoint/index.html</a>
          <span>选择城市，输入小区名称，获取经纬度</span>
        </p>
        <div class="se-content">
          <div>
            <span>小区列表</span>
          </div>
        </div>
        <el-table :data="addressBatchList" border style="width: 100%">
          <el-table-column align="center" prop="id" label="ID"></el-table-column>
          <el-table-column align="center" prop="title" label="小区名称"></el-table-column>
          <el-table-column align="center" prop="street" label="位置"></el-table-column>
          <el-table-column align="center" prop="lng" label="经度">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lng"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="lat" label="纬度">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lat"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <section>
          <div class="btndiv">
            <el-button @click="$router.go(-1)">取消</el-button>
            <el-button type="success" @click="sumbint()">确定</el-button>
          </div>
        </section>
      </div>
    </el-card>
  </div>
</template>
<script>
import { addLngLatBatch, getVillageBatch } from "../../api/promanage";
export default {
  data() {
    return {
      addressBatchList: [
        { id: "1", title: "天安数码", street: "123", lng: "12333", lat: "33344" },
        { id: "12", title: "天安数码", street: "12", lng: "12334233", lat: "12333344" },
        { id: "13", title: "天安数码", street: "1323", lng: "123343", lat: "33312344" }
      ]
    };
  },
  methods: {
    /** 提交 */
    sumbint() {
      new Promise((resolve, reject) => {
        this.addressBatchList.forEach(item => {
          if (item.lng == "" || item.lat == "" || item.lng == null || item.lat == null) {
            reject("请填写完数据再提交");
          }
        });
        resolve();
      })
        .then(() => {
          addLngLatBatch({ bos: this.addressBatchList }).then(data => {
            if (data.data.status == 0) {
              this.$message({ message: "批量填写成功", type: "success" });
              this.$router.go(-1);
            } else {
              this.$message.error("批量填写失败");
            }
          });
        })
        .catch(res => {
          this.$message.warning(res);
        });
    }
  },
  mounted() {
    if (this.$route.query.idList) {
      getVillageBatch({ ids: this.$route.query.idList }).then(data => {
        if (data.data.status == 0) {
          this.addressBatchList = data.data.data;
        }
      });
    } else {
      this.$message.error("没有选择小区");
    }
  }
};
</script>
<style lang="less">
#villageBatch {
  .clearfix {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .btndiv {
    padding: 10px 0 0 0;
  }
}
.sp-text {
  font-size: 14px;
  color: #888;
}
</style>