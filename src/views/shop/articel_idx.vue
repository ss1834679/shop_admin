<template>
  <div id="articel_idx">
    <!-- 文章的列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">文章</span>
        <!-- <div class="right">
          <div class="search_box">
            <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电" value="3"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <el-button icon="el-icon-plus" type="primary" @click="addNewActicel">新增</el-button>
        </div>-->
      </div>
      <div class="content">
        <div class="tool">
          <el-button icon="el-icon-plus" type="primary" @click="addNewActicel">新增</el-button>
          <div class="search_box">
            <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电" value="3"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </div>
        <el-table :data="tableData" border height="200" style="width: 100%">
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column prop="keyword" label="关键字"></el-table-column>
          <el-table-column prop="imgs" align="center" label="图片">
            <template slot-scope="scope" v-if="scope.row.imgs">
              <el-image
                :src="scope.row.imgs[0]"
                style=" height: 40px"
                :preview-src-list="scope.row.imgs"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="rank" label="排序"></el-table-column>
          <el-table-column label="操作" width="110">
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="alterActicel(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-delete"></el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10,30, 50, 70]"
          :page-size="10"
          layout="sizes, prev, pager, next"
          :total="1189"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: "123",
      input3: "",
      tableData: [
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: [
            "https://www.tbzj.shop/uploads/images/20190803/c1c0eb2b30f7126528cb5d5815bee8f6.jpg"
          ],
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: [
            "https://www.tbzj.shop/uploads/images/20190803/c1c0eb2b30f7126528cb5d5815bee8f6.jpg"
          ],
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: [
            "https://www.tbzj.shop/uploads/images/20190803/c1c0eb2b30f7126528cb5d5815bee8f6.jpg"
          ],
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: [
            "https://www.tbzj.shop/uploads/images/20190803/c1c0eb2b30f7126528cb5d5815bee8f6.jpg"
          ],
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: [
            "https://www.tbzj.shop/uploads/images/20190803/c1c0eb2b30f7126528cb5d5815bee8f6.jpg"
          ],
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        },
        {
          title: "豪华海景房",
          description: "",
          keyword: "豪华",
          imgs: "",
          rank: 0
        }
      ]
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    addNewActicel() {
      this.$router.push({ name: "article_add" });
    },
    alterActicel(rows) {
      this.$router.push({ name: "article_alter", params: { data: rows } });
    }
  }
};
</script>

<style lang='less'>
#articel_idx {
  width: 100%;
  height: auto;
  .el-image__inner {
    //有缩略图的加这个样式
    width: auto !important;
  }
  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        width: 100%;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      .tool {
        //table上的一栏按钮
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        .el-select .el-input__inner {
          width: 90px; //搜索框宽度
        }
        .el-input__inner {
          width: 120px;
          height: 37px;
        }
      }
      .el-pagination {
        padding: 0;
        margin-top: 20px;
      }
    }
  }
}
</style>
