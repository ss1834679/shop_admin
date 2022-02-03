<template>
  <!-- 添加订单页 -->
  <div class="add-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单设置</span>
      </div>

      <div class="add-content">
        <el-form :model="settingOrderList"  ref="settingOrderList" label-width="150px" class="demo-ruleForm">
          <div class="f-box">
              <el-form-item label="秒杀订单超过：" prop="seckillUnpayClose" required>
             <el-input :placeholder="settingOrderList.seckillUnpayClose" v-model="input">
                <template slot="append">分</template>
            </el-input>
             </el-form-item>
             <span style="font-size:14px; margin-left:10px">未付款，订单自动关闭 </span>
          </div>
         
          <div class="f-box">
              <el-form-item label="正常订单超过：" prop="normalUnpayClose" required>
             <el-input :placeholder="settingOrderList.normalUnpayClose" v-model="input1">
                <template slot="append">分</template>
            </el-input>
             </el-form-item>
             <span style="font-size:14px; margin-left:10px">未付款，订单自动关闭 </span>
          </div>

         <div class="f-box">
              <el-form-item label="发货超过:" prop="unreceiptComplete" required>
             <el-input :placeholder="settingOrderList.unreceiptComplete" v-model="input2">
                <template slot="append">天</template>
            </el-input>
             </el-form-item>
             <span style="font-size:14px; margin-left:10px">未收货，订单自动完成 </span>
          </div>
         <div class="f-box">
              <el-form-item label="订单完成超过：:" prop="applyAftersale" required>
             <el-input :placeholder="settingOrderList.applyAftersale" v-model="input3">
                <template slot="append">天</template>
            </el-input>
             </el-form-item>
             <span style="font-size:14px; margin-left:10px">自动结束交易，不能申请售后 </span>
          </div>

         <div class="f-box">
              <el-form-item label="订单完成超过：:" prop="autoPraise" required>
             <el-input :placeholder="settingOrderList.autoPraise" v-model="input4">
                <template slot="append">天</template>
            </el-input>
             </el-form-item>
             <span style="font-size:14px; margin-left:10px">自动五星好评</span>
          </div>   
             <div class="button">
                 <el-button @click="submitForm('settingOrderList')" type="primary">提交</el-button>
             </div>
        </el-form>      
      </div>
    </el-card>
  </div>
</template>
<script>
import {settingOrderList,settingOrderPut} from "../../api/order";
export default {
  data() {
    return {
      input:'',/**秒杀订单超过的默认天数输入值 */
      input1:'',/**正常订单超过默认天数输入值 */
      input2:'',/**发货超过默认天数输入值 */
      input3:'',/**订单完成超过默认天数输入值 */
      input4:'',/**订单完成超过自动评价默认天数输入值 */
      settingOrderList: {
        seckillUnpayClose: '',/**数据返回秒杀订单超过的默认天数输入值 */
        normalUnpayClose:'',/**数据返回秒杀订单超过的默认天数输入值 */
        unreceiptComplete:'',/**数据返回秒杀订单超过的默认天数输入值 */
        applyAftersale:'',/**数据返回秒杀订单超过的默认天数输入值 */
        autoPraise:''/**数据返回秒杀订单超过的默认天数输入值 */
      },
    };
  },
  mounted(){
    // 调用设置订单接口
settingOrderList().then(data=>{
this.settingOrderList=data.data.data
})
  },
  watch:{
    // 监听输入值
input(){
  this.input=this.input
},
input1(){
  this.input1=this.input1
},
input2(){
  this.input2=this.input2
},
input3(){
  this.input3=this.input3
},
input4(){
  this.input4=this.input4
}
  },
  methods: {
    // 设置时长后提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
         settingOrderPut({
          seckillUnpayClose:this.input=="" ? this.settingOrderList.seckillUnpayClose :this.input,
          normalUnpayClose:this.input1=="" ? this.settingOrderList.normalUnpayClose :this.input1,
          unreceiptComplete:this.input2=="" ? this.settingOrderList.unreceiptComplete :this.input2,
          applyAftersale:this.input3=="" ? this.settingOrderList.applyAftersale :this.input3,
          autoPraise:this.input4=="" ? this.settingOrderList.autoPraise :this.input4
         }).then(data=>{
        if(data.status==200){
           this.$message({
                  type: "success",
                  message: "修改成功"
                });
        }else{
           this.$message.error("修改失败");
        }   

         })
        } else {
         this.$message({
            showClose: true,
            message: "请检查参数是否填写错误！！",
            type: "error"
          });
          return false;
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
.add-page {
  padding: 20px;
}
.add-content {
  margin: 0 auto;
  width: 700px;

}
.f-box{
    display: flex;
    align-items: center;
    margin-bottom: 22px;
}
.el-form-item{
     margin-bottom: 0; 
}
.button{
    text-align: center;
    margin-top: 50px;

}
.el-card .el-card__header{
  background: #f2f2f2 !important;
  height: 50px;
}
</style>