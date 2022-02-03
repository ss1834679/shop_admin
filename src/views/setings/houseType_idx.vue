<template>
  <div id="houseType_idx">
    <!-- 户型列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">户型管理</span>
      </div>
      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
        <div class="se-right">
          <div class="box-r">
            <el-button plain @click="addhouseType" size="small">添加户型</el-button>
          </div>
        </div>
      </div>
      <div class="content">
        <el-table :data="houseTypeList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="typeName" label="户型名称" align="center"></el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column prop="content" label="详情介绍" align="center"></el-table-column>
          <el-table-column prop="status" label="是否启用" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="deleteHouseType($event,scope.row.id)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterHouseType(scope.row)">编辑</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :title="alter?'修改户型':'添加户型'" :visible.sync="houseVisible" @close="closeForm">
        <el-form label-width="80px" :model="alterForm" ref="alterForm">
          <el-form-item label="户型名称">
            <el-input v-model="alterForm.typeName"></el-input>
          </el-form-item>
          <el-form-item label="详情介绍">
            <el-input v-model="alterForm.content"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model.number="alterForm.sort"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeForm">取 消</el-button>
          <el-button type="primary" @click="submitAlter()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { addOrEditHouseType, editHouseTypeStatus, getHouseTypeList } from "../../api/setings";
export default {
  data() {
    return {
      houseTypeList: [],
      alterForm: {
        typeName: "" /* 户型名称 */,
        sort: 0 /* 排序 */,
        content: "" /* 详情介绍 */
      },
      houseVisible: false,
      alter: false
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    alterHouseType(rows) {
      this.alterForm = JSON.parse(JSON.stringify(rows));
      this.alter = true;
      this.houseVisible = true;
    },
    closeForm() {
      this.houseVisible = false;
      this.alter = false;
      this.alterForm = {
        typeName: "" /* 户型名称 */,
        sort: 0 /* 排序 */,
        content: "" /* 详情介绍 */
      };
    },
    addhouseType() {
      this.houseVisible = true;
    },
    submitAlter() {
      /* 调接口 */
      if (this.alter) {
        addOrEditHouseType(this.alterForm).then(data => {
          if (data.data.status == 0) {
            this.showAll();
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message.error("修改失败");
          }
        });
      } else {
        addOrEditHouseType(this.alterForm).then(data => {
          if (data.data.status == 0) {
            this.showAll();
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            this.$message.error("添加失败");
          }
        });
      }
      this.houseVisible = false;
    },
    showAll() {
      getHouseTypeList().then(data => {
        if (data.data.status == 0) {
          this.houseTypeList = data.data.data;
        }
      });
    },
    deleteHouseType(value, id) {
      this.$confirm("此操作将删除该户型, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          editHouseTypeStatus({ id: id, status: value ? 0 : 1 }).then(data => {
            if (data.data.status == 0) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
            } else {
              this.$message.error("删除失败");
              this.showAll();
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
          this.showAll();
        });
    }
  }
};
</script>

<style lang='less'>
#houseType_idx {
  width: 100%;
  height: auto;

  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
        .el-button {
          margin-right: 20px;
          height: 36px;
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      .el-table__body-wrapper {
        min-height: 600px;
      }
    }
  }
}
</style>
