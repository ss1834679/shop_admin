<template>
  <div id="order_idx">
    <!-- 用户列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">用户列表</span>
      </div>

      <!-- 筛选 -->
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button v-if="searchVisible" type="text" @click="dropDownUp({type:'down'})" icon="el-icon-arrow-up" style="margin-right:10px">收起筛选</el-button>
            <el-button v-else type="text" @click="dropDownUp({type:'up'})" icon="el-icon-arrow-down" style="margin-right:10px">展开筛选</el-button>
            <el-button size="small" @click="selectByKwd()">查询结果</el-button>
          </div>
        </div>
        <div class="search" v-if="searchVisible">
          <div class="search_line">
            <span>最近消费:</span>
            <div class="selectLine">
              <span :style="searchDays==null?'color:#1ABC9C':'color:black'" @click="searchDays=null">不限</span>
              <span
                v-for="item in searDays"
                :key="item.value"
                :style="searchDays==item.value?'color:#1ABC9C':'color:black'"
                @click="searchDays=item.value"
              >{{item.title}}</span>
            </div>
          </div>
          <div class="search_line">
            <span>消费次数:</span>
            <div class="selectLine">
              <span :style="searchShoppingNum==null?'color:#1ABC9C':'color:black'" @click="searchShoppingNum=null">不限</span>
              <span
                v-for="item in searShoppingNum"
                :key="item.value"
                :style="searchShoppingNum==item.value?'color:#1ABC9C':'color:black'"
                @click="searchShoppingNum=item.value"
              >{{item.title}}</span>
            </div>
            <el-button type="text" size="small" @click="setByMyself({type:'shoppingNum'})">自定义</el-button>
            <span style="margin-left:6px;font-size: 14px">{{searchShoppingNum?searchShoppingNum:'不限'}}</span>
          </div>
          <div class="search_line">
            <span>消费金额:</span>
            <div class="selectLine">
              <span :style="searchShoppingMoney==null?'color:#1ABC9C':'color:black'" @click="searchShoppingMoney=null">不限</span>
              <span
                v-for="item in searShoppingMoney"
                :key="item.value"
                :style="searchShoppingMoney==item.value?'color:#1ABC9C':'color:black'"
                @click="searchShoppingMoney=item.value"
              >{{item.title}}</span>
            </div>
            <el-button type="text" size="small" @click="setByMyself({type:'shoppingMoney'})">自定义</el-button>
            <span
              style="margin-left:6px;font-size:14px"
            >{{searchShoppingMoney?searchShoppingMoney.split("-")[0]/100+'-'+searchShoppingMoney.split("-")[1]/100:"不限"}}</span>
          </div>
          <div class="search_line">
            <span>订单均价:</span>
            <div class="selectLine">
              <span :style="searchAveragePrice==null?'color:#1ABC9C':'color:black'" @click="searchAveragePrice=null">不限</span>
              <span
                v-for="item in searAveragePrice"
                :key="item.value"
                :style="searchAveragePrice==item.value?'color:#1ABC9C':'color:black'"
                @click="searchAveragePrice=item.value"
              >{{item.title}}</span>
            </div>
            <el-button type="text" size="small" @click="setByMyself({type:'averagePrice'})">自定义</el-button>
            <span
              style="margin-left:6px;font-size: 14px"
            >{{searchAveragePrice?searchAveragePrice.split("-")[0]/100+'-'+searchAveragePrice.split("-")[1]/100:"不限"}}</span>
          </div>
        </div>

        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <!-- <div class="se-right">
            <div class="box-r" @click="groupMessage({ type: 'open' })">
              <el-button size="mini">群发短信</el-button>
            </div>
            <div class="box-r" @click="groupMailMessage({ type: 'open' })">
              <el-button size="mini">群发站内信</el-button>
            </div>
            <div class="box-r" @click="APPPush" style="position: relative;">
              <el-button size="mini">APP推送</el-button>
              <div class="btn-co" v-if="isShowBtn">
                <div class="btn">
                  <el-button plain @click="linkPush({ type: 'open' })">APP推送(链接)</el-button>
                </div>
                <div class="btn">
                  <el-button plain @click="AppProject({ type: 'open' })">APP推送(专题)</el-button>
                </div>
                <div class="btn">
                  <el-button plain @click="AppActivity({ type: 'open' })">APP推送(活动)</el-button>
                </div>
                <div class="btn">
                  <el-button plain @click="AppGoods({ type: 'open' })">APP推送(商品)</el-button>
                </div>
              </div>
            </div>

            <div class="box-r">
              <el-button size="mini" @click="setLabel({ type: 'open' })">设置标签</el-button>
            </div>
            <div class="box-r">
              <el-button size="mini" @click="givingPreferential({ type: 'open' })">赠送优惠卷</el-button>
            </div>
            <div class="box-r">
              <el-button size="mini">导出订单</el-button>
            </div>
          </div>-->
        </div>
        <!-- 表格标题 -->
        <el-table :data="userList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="用户ID"></el-table-column>
          <el-table-column prop="userName" label="用户账号"></el-table-column>
          <el-table-column prop="vipGrade" label="会员等级">暂无此功能</el-table-column>
          <el-table-column prop="consumeMoney" label="消费金额">
            <template slot-scope="scope">{{"¥" + (scope.row.consumeMoney / 100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="orderNum" label="消费次数"></el-table-column>
          <el-table-column prop="averagePrice" label="订单均价">
            <template slot-scope="scope">{{"¥" + (scope.row.averagePrice / 100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="lastConsumedTime" label="最近购买时间">
            <template slot-scope="scope">
              <span v-if="scope.row.lastConsumedTime">{{scope.row.lastConsumedTime}}</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="toUserDetail(scope.row)">查看</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <div>
            <el-select v-model="batchValue" placeholder="批量操作">
              <el-option v-for="item in batchOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button @click="batchOperation">确认</el-button>
          </div>
          <!-- 分页 -->
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
      </div>
      <!-- 群发短信弹窗框 -->
      <el-dialog title="群发短信" :visible.sync="isGroupMessage">
        <el-form label-width="120px">
          <el-form-item label="发送对象:" class="is-required">
            <div>
              共
              <span style="color:red">20</span>个用户
            </div>
          </el-form-item>
          <el-form-item label="短信内容:" class="is-required">
            <el-input type="textarea" placeholder="请输入内容" v-model="GroupMessageText" :rows="6"></el-input>
          </el-form-item>
          <el-form-item label prop="cancelReasonText">
            <div style="font-size:12px;color:#888">
              发送时系统会自动在结尾追加【优品汇】，请勿重复添加。
              内容上限不能超过
              <span style="color:red">500</span>字，当前已输入
              <span style="color:red">3</span>字，将作为
              <span style="color:red">1</span>条发送
            </div>
          </el-form-item>
          <el-form-item label="发送统计:" class="is-required">
            <div>
              发送条数：
              <span style="color:red">20</span>条 可用短信条数：
              <span style="color:red">10000</span>条
            </div>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="nodeVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 群发站内信弹窗框 -->
      <el-dialog title="群发短信" :visible.sync="isGroupMailMessage">
        <el-form label-width="120px">
          <el-form-item label="发送对象:" prop="cancelReasonText" class="is-required">
            <div>
              共
              <span style="color:red">20</span>个用户
            </div>
          </el-form-item>
          <el-form-item label="标题:" prop="cancelReasonText" class="is-required">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="内容:" prop="cancelReasonText" class="is-required">
            <el-input type="textarea" placeholder="请输入内容" v-model="GroupMailMessageText" :rows="6"></el-input>
          </el-form-item>
          <el-form-item label prop="cancelReasonText">
            <div style="font-size:12px;color:#888">站内信标题不能超过20个字，内容不能超过100个字。</div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodeVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- app推送（链接）弹窗框 -->
      <el-dialog title="APP推送" :visible.sync="isLinkPush">
        <el-form label-width="120px">
          <el-form-item label="推送类型:" class="is-required">
            <el-radio-group v-model="radio1">
              <el-radio v-model="radio1" label="1">链接</el-radio>
              <el-radio v-model="radio2" label="2" disabled>专题</el-radio>
              <el-radio v-model="radio3" label="3" disabled>活动</el-radio>
              <el-radio v-model="radio4" label="4" disabled>商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="推送链接：" class="is-required">
            <el-input placeholder="请输入链接" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label="推送标题：" class="is-required">
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label="推送内容：" class="is-required">
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label prop="cancelReasonText">
            <div style="font-size:12px;color:#888">APP推送标题不能超过14个字，内容不能超过20个字。</div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodeVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- app推送（商品）弹窗框 -->
      <el-dialog title="APP推送" :visible.sync="isAppGoods">
        <el-form label-width="120px">
          <el-form-item label="推送类型:" class="is-required">
            <el-radio-group v-model="radio4">
              <el-radio v-model="radio1" label="1" disabled>链接</el-radio>
              <el-radio v-model="radio2" label="2" disabled>专题</el-radio>
              <el-radio v-model="radio3" label="3" disabled>活动</el-radio>
              <el-radio v-model="radio4" label="4">商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择商品：" class="is-required">
            <div style="width:300px;">
              <el-input placeholder="请选择商品" v-model="selectGoodsInput" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="推送标题：" class="is-required">
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label="推送内容：" class="is-required">
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label prop="cancelReasonText">
            <div style="font-size:12px;color:#888">APP推送标题不能超过14个字，内容不能超过20个字。</div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodeVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- app推送（专题）弹窗框 -->
      <el-dialog title="APP推送" :visible.sync="isAppProject">
        <el-form label-width="120px">
          <el-form-item label="推送类型:" class="is-required">
            <el-radio-group v-model="radio2">
              <el-radio v-model="radio1" label="1" disabled>链接</el-radio>
              <el-radio v-model="radio2" label="2">专题</el-radio>
              <el-radio v-model="radio3" label="3" disabled>活动</el-radio>
              <el-radio v-model="radio4" label="4" disabled>商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择专题：" class="is-required">
            <div style="width:300px;">
              <el-input placeholder="请选择专题" v-model="AppProjectInput" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="推送标题：" class="is-required">
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label="推送内容：" class="is-required">
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label prop="cancelReasonText">
            <div style="font-size:12px;color:#888">APP推送标题不能超过14个字，内容不能超过20个字。</div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodeVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- app推送（活动）弹窗框 -->
      <el-dialog title="APP推送" :visible.sync="isAppActivity">
        <el-form label-width="120px">
          <el-form-item label="推送类型:" class="is-required">
            <el-radio-group v-model="radio3">
              <el-radio v-model="radio1" label="1" disabled>链接</el-radio>
              <el-radio v-model="radio2" label="2" disabled>专题</el-radio>
              <el-radio v-model="radio3" label="3">活动</el-radio>
              <el-radio v-model="radio4" label="4" disabled>商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择活动：" class="is-required">
            <div style="width:300px;">
              <el-input placeholder="请选择活动" v-model="AppActivityInput" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="推送标题：" class="is-required">
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label="推送内容：" class="is-required">
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label prop="cancelReasonText">
            <div style="font-size:12px;color:#888">APP推送标题不能超过14个字，内容不能超过20个字。</div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodeVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 设置标签弹窗框 -->
      <el-dialog title="设置标签" :visible.sync="isSetLabel">
        <el-form class="e-form">
          <el-checkbox-group v-model="checkList" :min="1" :max="4">
            <el-checkbox label="用户标签名称1"></el-checkbox>
            <el-checkbox label="用户标签名称2"></el-checkbox>
            <el-checkbox label="用户标签名称3"></el-checkbox>
            <el-checkbox label="用户标签名称4"></el-checkbox>
          </el-checkbox-group>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodeVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 赠送优惠券弹窗框 -->
      <el-dialog title="设置标签" :visible.sync="isGivingPreferential">
        <div style="width:50%;margin-bottom:20px">
          <el-input placeholder="请输入内容" v-model="GivingPreferentialInput" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div>
          <!-- 表格标题 -->
          <el-table :data="userList" border row-key="id" style="width: 100%" @selection-change="getSelection">
            <el-table-column type="selection" align="center" width="70"></el-table-column>
            <el-table-column prop="orderSn" label="优惠券名称"></el-table-column>
            <el-table-column prop="amoutPaid" label="面额" width="100">
              <template slot-scope="scope">{{"¥" + (scope.row.amoutPaid / 100).toFixed(2)}}</template>
            </el-table-column>
            <el-table-column prop="orderSn" label="剩余张数"></el-table-column>
            <el-table-column prop="orderSn" label="使用条件"></el-table-column>
            <el-table-column prop="orderSn" label="有效期"></el-table-column>
          </el-table>
          <div>
            <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodeVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCloseOrder()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 自定义搜索弹窗 -->
      <el-dialog :visible="setByMyselfVisible" class="setMyselfDialog" center>
        <el-input v-if="setType=='shoppingNum'" v-model.number="setNumForm.first" class="numinput"></el-input>
        <precision-input
          v-if="setType!='shoppingNum'"
          :num="setNumForm.first"
          :type="'price'"
          text="元"
          @getNum="(value)=>{this.setNumForm.first=value}"
        ></precision-input>
        <span v-if="setType!='shoppingNum'" style="line-height:40px">---</span>
        <precision-input
          v-if="setType!='shoppingNum'"
          :num="setNumForm.second"
          :type="'price'"
          text="元"
          @getNum="(value)=>{this.setNumForm.second=value}"
        ></precision-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setByMyselfVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSetMyself({type:setType})">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserListByPower } from "../../api/user";
import paginationCom from "../../components/paginationCom";
import precisionInput from "../../components/precisionInput";
export default {
  components: { paginationCom, precisionInput },
  data() {
    return {
      // app推送选择
      radio1: "1" /* app推送链接选择 */,
      radio2: "2" /* app推送专题选择 */,
      radio3: "3" /* app推送活动选择*/,
      radio4: "4" /* app推送商品选择 */,
      selectGoodsInput: "" /* app推送商品搜索输入 */,
      AppProjectInput: "" /* app推送专题搜索输入 */,
      AppActivityInput: "" /* app推送活动搜索输入 */,
      // app链接推送标题
      selectProjectText: "",
      // 是否出现app推送选择
      isShowBtn: false,
      // 赠送优惠卷输入文本
      GivingPreferentialInput: "",
      checkList: ["用户标签名称1", "用户标签名称2"],
      // 群内短信文本
      GroupMessageText: "",
      // 群发站内信文本
      GroupMailMessageText: "",
      isLinkPush: false /* app推送链接弹框 */,
      batchArr: [] /* 批量操作 id 数组 */,
      /* 筛选框 */
      searchVisible: true,
      searchAveragePrice: null /* 订单均价 搜索 */,
      searchShoppingMoney: null /* 消费金额 搜索 */,
      searchShoppingNum: null /* 消费次数 搜索 */,
      searchDays: null /* 最近消费 */,
      setByMyselfVisible: false /* 自定义 */,
      setType: "",
      setNumForm: {
        first: null,
        second: null
      },
      searDays: [
        { value: -7, title: "1周内" },
        { value: -14, title: "2周内" },
        { value: -30, title: "1个月内" },
        { value: 30, title: "1个月前" },
        { value: 60, title: "2个月前" },
        { value: 90, title: "3个月前" },
        { value: 180, title: "6个月前" }
      ],
      searShoppingNum: [
        { value: 1, title: "1次+" },
        { value: 2, title: "2次+" },
        { value: 3, title: "3次+" },
        { value: 4, title: "4次+" },
        { value: 10, title: "10次+" },
        { value: 20, title: "20次+" },
        { value: 30, title: "30次+" }
      ],
      searShoppingMoney: [
        { value: "0-5000", title: "0-50" },
        { value: "5100-10000", title: "51-100" },
        { value: "10100-15000", title: "101-150" },
        { value: "15100-20000", title: "151-200" },
        { value: "20100-30000", title: "201-300" },
        { value: "30100-50000", title: "301-500" },
        { value: "50100-100000", title: "501-1000" }
      ],
      searAveragePrice: [
        { value: "0-2000", title: "0-20" },
        { value: "2100-5000", title: "21-50" },
        { value: "5100-10000", title: "51-100" },
        { value: "10100-15000", title: "101-150" },
        { value: "15100-20000", title: "151-200" },
        { value: "20100-30000", title: "201-300" },
        { value: "30100-50000", title: "301-500" }
      ],
      // 返回的订单列表
      userList: [],
      // 批量输入值
      batchValue: "",
      addressId: "" /* 去用户中心查的收货人信息 中间变量 */,
      status: true /* 当前状态 大的筛选条件 */,
      isGivingPreferential: false /* 赠送优惠卷弹窗 */,
      isSetLabel: false /* 设置标签弹窗 */,
      isGroupMailMessage: false /* 群发站内信弹窗 */,
      isGroupMessage: false /* 群发短信弹窗 */,
      isAppProject: false /* app推送专题弹窗 */,
      isAppActivity: false /*app推送活动弹窗 */,
      isAppGoods: false /*app推送商品弹窗 */,
      // 返回的各个状态的数量
      OrderByStatusCount: {
        /* 各个状态的数量 */
        allNum: 0,
        cancelNum: 0,
        obligationNum: 0,
        notYetShippedNum: 0,
        waitForReceivingNum: 0,
        completeNum: 0
      },
      form: {
        name: "",
        region: "",
        region1: "",
        region2: "",
        region3: "",
        region4: "",
        num: ""
      },
      noteform: {
        text: "" /* 操作备注 */
      },
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      // 设置标签数据
      setLabels: ["用户标签名称1", "用户标签名称2", "用户标签名称3", "用户标签名称4", "用户标签名称5", "用户标签名称6"],
      // 批量删除按钮
      batchOptions: [{ label: "批量删除", value: "delete" }],
      value: "",
      // 订单选择框选择值
      cocatValue1: "",
      // 订单选择框选择值
      cocatValue: "",
      // 用户id
      userId: "1231937359092551682",
      // 省市列表
      provinceList: [],
      // 城市列表
      cityList: [],
      // 区县列表
      countyList: [],
      // 省市级选择
      provinceListForm: {
        provinceId: "" /* 省级id */,
        cityId: "" /* 城市id */,
        countyId: "" /* 区县id */
      }
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    toUserDetail(rows) {
      this.$router.push({ name: "user_detail", query: { id: rows.id } });
    },
    APPPush() {
      this.isShowBtn = !this.isShowBtn;
    },
    linkPush(obj4) {
      if (obj4.type == "open") {
        this.noteform = { text: "", info: obj4.obj4 };
        this.isLinkPush = true;
      } else if (obj4.type == "close") {
        console.log(this.noteform);
      }
    },
    // 跳转到编辑资料页 '1243355107257446402'
    editData(rows) {
      this.$router.push({ name: "user_edit", query: { id: rows.id } });
    },
    // app专题推送
    AppProject(obj6) {
      if (obj6.type == "open") {
        this.noteform = { text: "", info: obj6.obj6 };
        this.isAppProject = true;
      } else if (obj6.type == "close") {
        console.log(this.noteform);
      }
    },
    // 群发消息弹窗
    groupMessage(obj) {
      if (obj.type == "open") {
        this.noteform = { text: "", info: obj.obj };
        this.isGroupMessage = true;
      } else if (obj.type == "close") {
        console.log(this.noteform);
      }
    },
    // 群发商品弹窗
    AppGoods(obj8) {
      if (obj8.type == "open") {
        this.noteform = { text: "", info: obj8.obj8 };
        this.isAppGoods = true;
      } else if (obj8.type == "close") {
        console.log(this.noteform);
      }
    },
    // app推送活动弹窗
    AppActivity(obj7) {
      if (obj7.type == "open") {
        this.noteform = { text: "", info: obj7.obj7 };
        this.isAppActivity = true;
      } else if (obj7.type == "close") {
        console.log(this.noteform);
      }
    },
    // 设置标签弹窗
    setLabel(obj2) {
      if (obj2.type == "open") {
        this.noteform = { text: "", info: obj2.obj2 };
        this.isSetLabel = true;
      } else if (obj2.type == "close") {
        console.log(this.noteform);
      }
    },
    // 赠送优惠卷弹窗
    givingPreferential(obj3) {
      if (obj3.type == "open") {
        this.noteform = { text: "", info: obj3.obj3 };
        this.isGivingPreferential = true;
      } else if (obj3.type == "close") {
        console.log(this.noteform);
      }
    },
    // 群发站内信弹窗
    groupMailMessage(obj1) {
      if (obj1.type == "open") {
        this.noteform = { text: "", info: obj1.obj1 };
        this.isGroupMailMessage = true;
      } else if (obj1.type == "close") {
        console.log(this.noteform);
      }
    },
    // 批量操作id拼接
    getSelection(val) {
      this.batchArr = [];
      val.forEach(item => {
        this.batchArr.push(item.orderId);
        console.log(this.batchArr);
      });
      // this.selectedList = ""; /* 先置空 */

      /* 批量操作id拼接 */
      // val.forEach((item, index, arr) => {
      //   if (index == arr.length - 1) {
      //     this.selectedList = this.selectedList + item.id;
      //   } else {
      //     this.selectedList = this.selectedList + item.id + ",";
      //   }
      // });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      console.log(val);
      if (this.searchUserSn !== "" || this.searchDate !== "" || this.searchName !== "") {
        // 执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        // 执行全部中的分页
        this.showAll(val);
      }
    },
    // 批量操作
    batchOperation() {},
    /* 搜索分页  */
    selectByKwd(obj) {
      console.log(obj);
      getUserListByPower({
        pageNo: obj && obj.page ? obj.page : 1,
        pageSize: 20,
        averagePrice: this.searchAveragePrice,
        days: this.searchDays,
        shoppingMoney: this.searchShoppingMoney,
        shoppingNum: this.searchShoppingNum
      }).then(data => {
        console.log(data);
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 反复调用显示全部 */
    showAll() {
      // const loading = this.$loading({
      //   lock: true,
      //   text: "Loading",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      getUserListByPower().then(data => {
        console.log(data);
        if (data.data.status == 0) {
          this.setView(data);
          // loading.close()
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.userList = data.data.data.list;
      console.log(this.userList);
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchUserSn = "";
      this.searchDate = "";
      this.searchName = "";
      // this.addressId = "";
      // this.status = "allNum";
      // this.showAll()
    },
    dropDownUp(obj) {
      if (obj.type == "up") {
        this.searchVisible = true;
      } else if (obj.type == "down") {
        this.searchVisible = false;
      }
    },
    setByMyself(obj) {
      if (obj.type == "shoppingNum") {
        /* 消费次数 */
        this.setByMyselfVisible = true;
        this.setType = "shoppingNum";
      } else if (obj.type == "shoppingMoney") {
        /* 消费金额 */
        this.setByMyselfVisible = true;
        this.setType = "shoppingMoney";
      } else if (obj.type == "averagePrice") {
        /* 订单均价 */
        this.setByMyselfVisible = true;
        this.setType = "averagePrice";
      }
    },
    handleSetMyself(obj) {
      if (obj.type == "shoppingNum") {
        /* 消费次数 */
        this.searchShoppingNum = this.setNumForm.first;
        this.setNumForm = {
          first: null,
          second: null
        };
        this.setByMyselfVisible = false;
      } else if (obj.type == "shoppingMoney") {
        /* 消费金额 */
        this.searchShoppingMoney = this.setNumForm.first + "-" + this.setNumForm.second;
        this.setNumForm = {
          first: null,
          second: null
        };
        this.setByMyselfVisible = false;
      } else if (obj.type == "averagePrice") {
        /* 订单均价 */
        this.searchAveragePrice = this.setNumForm.first + "-" + this.setNumForm.second;
        this.setNumForm = {
          first: null,
          second: null
        };
        this.setByMyselfVisible = false;
      }
    }
  }
};
</script>

<style lang="less">
#order_idx {
  width: 100%;
  height: auto;
  .setMyselfDialog {
    .el-dialog__body {
      display: flex;
      justify-content: center;
      .numinput {
        width: auto;
      }
    }
  }

  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;
      span.title {
        line-height: 50px;
        margin-left: 20px;
      }
    }
    .clearfix {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .search {
      justify-content: flex-start;
      flex-direction: column;
      margin-bottom: 0px;
      height: auto;
      .search_line {
        margin: 4px 0px;
        line-height: 30px;
        width: 100%;
        display: flex;
        .selectLine {
          span {
            display: inline-block;
            width: 80px;
            cursor: pointer;
            margin: 0 6px;
          }
        }
      }
    }
    .se-content {
      margin-top: 15px;
    }
  }
}
.e-form {
  display: flex;
  line-height: 40px;
  justify-content: space-around;
  align-items: center;
}
.btn-co {
  position: absolute;
  top: 50px;
  left: 0;
  z-index: 20;
  line-height: 1;
  text-align: center;
  font-size: 13px;
  background: #cccccc;
}
</style>
