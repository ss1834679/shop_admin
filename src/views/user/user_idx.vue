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
        </div>
        <div class="search">
          <div class="search_box">
            <span class="s-size">请输入:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="用户ID/账号" v-model="searchUserSn" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-input placeholder="用户昵称" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-date-picker v-model="searchDate" type="date" @change="selectByKwd" value-format="yyyy-MM-dd" placeholder="请选择时间"></el-date-picker>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>

        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div class="se-right">
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
                  <el-button type="primary" plain @click="linkPush({ type: 'open' })">APP推送(链接)</el-button>
                </div>
                <div class="btn">
                  <el-button type="primary" plain @click="AppProject({ type: 'open' })">APP推送(专题)</el-button>
                </div>
                <div class="btn">
                  <el-button type="primary" plain @click="AppActivity({ type: 'open' })">APP推送(活动)</el-button>
                </div>
                <div class="btn">
                  <el-button type="primary" plain @click="AppGoods({ type: 'open' })">APP推送(商品)</el-button>
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
          </div>
        </div>
        <!-- 表格标题 -->
        <el-table :data="userList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="用户ID"></el-table-column>
          <el-table-column prop="userName" label="用户账号"></el-table-column>
          <el-table-column prop="nickName" label="用户昵称"></el-table-column>
          <el-table-column prop="vipGrade" label="会员等级">暂无此功能</el-table-column>
          <el-table-column prop="consumeMoney" label="消费金额" width="100">
            <template slot-scope="scope">
              {{
              "¥" + (scope.row.consumeMoney / 100).toFixed(2)
              }}
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" label="订单数量"></el-table-column>
          <el-table-column prop="TBCOIN" label="可用涂邦币">暂无此功能</el-table-column>
          <el-table-column prop label="账户启用状态">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.status" @changeValue="(value)=>{changeStatus(scope.row.id,value)}"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="toUserDetail(scope.row)">查看</el-button>
                <el-button type="text" size="medium" @click="editData(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" @click="delUser(scope.row )">删除</el-button>
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
          <el-form-item label="发送对象:" prop="cancelReasonText" required>
            <div>
              共
              <span style="color:red">20</span>个用户
            </div>
          </el-form-item>
          <el-form-item label="短信内容:" prop="cancelReasonText" required>
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
          <el-form-item label="发送统计:" prop="cancelReasonText" required>
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
          <el-form-item label="发送对象:" prop="cancelReasonText" required>
            <div>
              共
              <span style="color:red">20</span>个用户
            </div>
          </el-form-item>
          <el-form-item label="标题:" prop="cancelReasonText" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="内容:" prop="cancelReasonText" required>
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
          <el-form-item label="推送类型:" prop="cancelReasonText" required>
            <el-radio-group v-model="radio1">
              <el-radio v-model="radio1" label="1">链接</el-radio>
              <el-radio v-model="radio2" label="2" disabled>专题</el-radio>
              <el-radio v-model="radio3" label="3" disabled>活动</el-radio>
              <el-radio v-model="radio4" label="4" disabled>商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="推送链接：" prop="cancelReasonText" required>
            <el-input placeholder="请输入链接" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label="推送标题：" prop="cancelReasonText" required>
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label="推送内容：" prop="cancelReasonText" required>
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
          <el-form-item label="推送类型:" prop="cancelReasonText" required>
            <el-radio-group v-model="radio4">
              <el-radio v-model="radio1" label="1" disabled>链接</el-radio>
              <el-radio v-model="radio2" label="2" disabled>专题</el-radio>
              <el-radio v-model="radio3" label="3" disabled>活动</el-radio>
              <el-radio v-model="radio4" label="4">商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择商品：" prop="cancelReasonText" required>
            <div style="width:300px;">
              <el-input placeholder="请选择商品" v-model="selectGoodsInput" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="推送标题：" prop="cancelReasonText" required>
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label="推送内容：" prop="cancelReasonText" required>
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
          <el-form-item label="推送类型:" prop="cancelReasonText" required>
            <el-radio-group v-model="radio2">
              <el-radio v-model="radio1" label="1" disabled>链接</el-radio>
              <el-radio v-model="radio2" label="2">专题</el-radio>
              <el-radio v-model="radio3" label="3" disabled>活动</el-radio>
              <el-radio v-model="radio4" label="4" disabled>商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择专题：" prop="cancelReasonText" required>
            <div style="width:300px;">
              <el-input placeholder="请选择专题" v-model="AppProjectInput" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="推送标题：" prop="cancelReasonText" required>
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label="推送内容：" prop="cancelReasonText" required>
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
          <el-form-item label="推送类型:" prop="cancelReasonText" required>
            <el-radio-group v-model="radio3">
              <el-radio v-model="radio1" label="1" disabled>链接</el-radio>
              <el-radio v-model="radio2" label="2" disabled>专题</el-radio>
              <el-radio v-model="radio3" label="3">活动</el-radio>
              <el-radio v-model="radio4" label="4" disabled>商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择活动：" prop="cancelReasonText" required>
            <div style="width:300px;">
              <el-input placeholder="请选择活动" v-model="AppActivityInput" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="推送标题：" prop="cancelReasonText" required>
            <el-input placeholder="请输入内容" v-model="selectProjectText"></el-input>
          </el-form-item>
          <el-form-item label="推送内容：" prop="cancelReasonText" required>
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
            <el-checkbox label="用户标签名称5"></el-checkbox>
            <el-checkbox label="用户标签名称6"></el-checkbox>
            <el-checkbox label="用户标签名称7"></el-checkbox>
            <el-checkbox label="用户标签名称8"></el-checkbox>
            <el-checkbox label="用户标签名称9"></el-checkbox>
            <el-checkbox label="用户标签名称10"></el-checkbox>
            <el-checkbox label="用户标签名称11"></el-checkbox>
            <el-checkbox label="用户标签名称12"></el-checkbox>
            <el-checkbox label="用户标签名称13"></el-checkbox>
            <el-checkbox label="用户标签名称14"></el-checkbox>
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
          <el-input placeholder="请输入内容" v-model="GivingPreferentialInput" @change="selectByKwd2" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div>
          <!-- 表格标题 -->
          <el-table :data="CouponList" border row-key="id" style="width: 100%" @selection-change="getSelection2">
            <el-table-column type="selection" align="center" width="70"></el-table-column>
            <el-table-column prop="name" label="优惠券名称"></el-table-column>
            <el-table-column prop="price" label="面额" width="100">
              <template slot-scope="scope">
                {{
                "¥" + (scope.row.price / 100).toFixed(2)
                }}
              </template>
            </el-table-column>
            <el-table-column prop="quota" label="剩余张数"></el-table-column>
            <el-table-column prop="type" label="使用条件">
              <template slot-scope="scope">
                <div v-if="scope.row.type==1">满减</div>
                <div v-if="scope.row.type==3">无门槛</div>
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="有效期"></el-table-column>
          </el-table>
          <div>
            <pagination-com :total="total2" :size="size2" :cPage="cPage2" @getJump="(val)=>{handleCurrentChange2(val)}"></pagination-com>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isGivingPreferential = false">取 消</el-button>
          <el-button type="primary" @click="systemGiveCouponClick()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../components/switch";
import { getUserList, deleteUser, setUserEnable, getCouponListByPage, systemGiveCoupon } from "../../api/user";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom,
    switchCom
  },
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
      batchArr2: [],
      // 返回的订单列表
      userList: [],
      // 批量输入值
      batchValue: "",
      form: {
        name: "",
        region: "",
        region1: "",
        region2: "",
        region3: "",
        region4: "",
        num: ""
      },
      select: "不限",
      searchUserSn: "" /* 订单id 搜索 */,
      searchName: "" /* 收货人/电话 搜索 */,
      searchDate: "" /* 订单日期 搜索 */,
      addressId: "" /* 去用户中心查的收货人信息 中间变量 */,
      status: true /* 当前状态 大的筛选条件 */,
      isGivingPreferential: false /* 赠送优惠卷弹窗 */,
      isSetLabel: false /* 设置标签弹窗 */,
      isGroupMailMessage: false /* 群发站内信弹窗 */,
      isGroupMessage: false /* 群发短信弹窗 */,
      isAppProject: false /* app推送专题弹窗 */,
      isAppActivity: false /*app推送活动弹窗 */,
      isAppGoods: false /*app推送商品弹窗 */,
      noteform: {
        text: "" /* 操作备注 */
      },
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      total2: 0 /* 分页总数 */,
      cPage2: 1 /* 当前页码 */,
      size2: 20 /* 每页个数 */,
      // 设置标签数据
      setLabels: ["用户标签名称1", "用户标签名称2", "用户标签名称3", "用户标签名称4", "用户标签名称5", "用户标签名称6"],
      // 批量删除按钮
      batchOptions: [
        { label: "批量删除", value: "delete" },
        { label: "批量启用", value: "enable" },
        { label: "批量禁用", value: "disable" }
      ],
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
      },
      ids: [],
      CouponList: []
    };
  },
  watch: {
    status: {
      /* 改变大的筛选条件 */
      handler() {
        this.selectByKwd();
      }
    }
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // switch开关状态
    changeStatus(id, value) {
      console.log(id, value, 111);
      /* 改变状态 并重新请求 */
      this.ids.push(id);
      setUserEnable({ status: value, userIds: this.ids }).then(data => {
        console.log(data);
        if (data.status == 200) {
          this.$message({
            message: "状态修改成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "状态修改失败",
            type: "error"
          });
        }
      });
    },
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
        this.isGivingPreferential = true;
        this.getCouponListByPages();
      } else if (obj3.type == "close") {
        this.isGivingPreferential = false;
      }
    },
    // 获取赠送优惠卷列表
    getCouponListByPages() {
      getCouponListByPage({
        pageNo: 1,
        pageSize: 20
      }).then(data => {
        if (data.data.status == 200) {
          this.setView2(data);
        }
      });
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
        this.batchArr.push(item.id);
        console.log(this.batchArr);
      });
    },
    getSelection2(val2) {
      val2.forEach(item => {
        this.batchArr2.push(item.id);
        console.log(this.batchArr2);
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      console.log(val);
      if (
        this.searchUserSn !== "" ||
        this.searchDate !== "" ||
        this.searchName !== ""
        // this.status !== undefined
      ) {
        // 执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        // 执行全部中的分页
        this.showAll(val);
      }
    },
    // 优惠卷表格渲染
    setView2(data) {
      this.CouponList = data.data.content.data.list;
      this.total2 = data.data.content.data.total;
      this.cPage2 = data.data.content.data.pageNum;
      this.size2 = data.data.content.data.pageSize;
    },
    // 优惠卷搜索
    selectByKwd2() {
      getCouponListByPage({
        name: this.GivingPreferentialInput,
        pageNo: 1,
        pageSize: 20
      }).then(data => {
        this.setView2(data);
      });
    },
    // 优惠卷分页
    handleCurrentChange2(val) {
      if (this.GivingPreferentialInput !== "") {
        // 执行查询中的分页
        this.selectByKwd2(val);
      } else {
        // 执行全部中的分页
        this.getCouponListByPages(val);
      }
    },
    // 系统发松优惠卷
    systemGiveCouponClick() {
      systemGiveCoupon({
        couponIds: this.batchArr2,
        userIds: this.batchArr
      }).then(data => {
        if (data.data.status == 200) {
          this.$message({
            message: data.data.content,
            type: "success"
          });
          this.getCouponListByPages();
          this.isGivingPreferential = false;
        } else {
          this.$message({
            message: data.data.msg,
            type: "error"
          });
        }
      });
    },
    // 批量操作
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            deleteUser(this.batchArr).then(data => {
              if (data.status == 200) {
                this.$message({
                  message: "批量删除用户成功",
                  type: "success"
                });
                this.setView(data);
              } else {
                this.$message.error("批量删除用户失败");
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      } else if (this.batchValue == "enable") {
        setUserEnable({
          status: "1",
          userIds: this.batchArr
        }).then(data => {
          if (data.status == 200) {
            this.$message({
              message: "批量启用成功",
              type: "success"
            });
            this.setView(data);
          } else {
            this.$message({
              message: "批量启用失败",
              type: "error"
            });
          }
        });
      } else {
        setUserEnable({
          status: "0",
          userIds: this.batchArr
        }).then(data => {
          if (data.data.status == 0) {
            this.$message({
              message: "批量禁用成功",
              type: "success"
            });
            this.showAll();
          } else {
            this.$message({
              message: "批量禁用失败",
              type: "error"
            });
          }
        });
      }
    },
    // 点击删除
    delUser(rows) {
      this.$confirm("此操作将删除这个用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.batchArr.push(rows.id);
          console.log(this.batchArr);
          deleteUser(this.batchArr).then(data => {
            if (data.data.status == 0) {
              this.$message({
                message: "批量删除用户成功",
                type: "success"
              });
              this.showAll();
            } else {
              this.$message.error("批量删除用户失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 搜索分页  */
    selectByKwd(obj) {
      getUserList({
        pageNo: obj && obj.page ? obj.page : 1,
        pageSize: 20,
        createTime: this.searchDate == "" ? null : this.searchDate,
        userName: this.searchUserSn == "" ? null : this.searchUserSn,
        nickName: this.searchName == "" ? null : this.searchName
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getUserList({ pageNo: val ? val : 1, pageSize: 20 }).then(data => {
        // console.log(data);
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.userList = data.data.data.list;
      this.userList.forEach(item => {
        if (item.status == 1) {
          this.switchStatus = true;
        } else {
          this.switchStatus = false;
        }
      });
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchUserSn = "";
      this.searchDate = "";
      this.searchName = "";
      this.showAll();
    },
    /* 状态的启用和禁用 */
    handleIsDelete(obj) {
      if (obj.type == "up") {
        obj.row.isDelete = 0;
        console.log("启用成功");
        /* 调用接口 */
      }
      if (obj.type == "down") {
        obj.row.isDelete = 1;
        console.log("禁用成功");
        /* 调用接口 */
      }
    }
  }
};
</script>

<style lang="less">
#order_idx {
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
    .el-table__header .el-table-column--selection .cell .el-checkbox:after {
      content: "全选";
      margin-left: 5px;
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      /* 筛选按钮 */
      .status {
        .el-tabs {
          .el-tabs__header {
            margin: 0;
            border-bottom: none;
            .el-tabs__nav-wrap {
              margin-bottom: 0;
              .el-tabs__nav {
                border-radius: 0px;
              }
              .el-tabs__item.is-active {
                color: white;
                background-color: #1abc9c;
              }
              .el-tabs__item:hover {
                color: #1abc9c;
              }
              .el-tabs__item.is-active:hover {
                color: white;
              }
            }
          }
        }
      }
      .s-size {
        font-size: 13px;
      }

      .el-button-group.alterDel,
      .el-button-group.setup {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
      }
      // 批量删除
      .batchOperation {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-pagination {
          padding: 0;
          // margin-top: 20px;
        }
        .el-select {
          width: 120px;
          margin-right: 15px;
        }
      }
    }
  }
}
// 弹出窗
.mo-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.ca-order {
  display: flex;
  align-items: center;
  margin-top: 25px;
}
.mode {
  width: 60%;
  height: 300px;
  // border: 1px solid #cccccc;
  padding: 10px;
}
.mode2 {
  width: 60%;
  height: 100px;
  // border: 1px solid #cccccc;
  padding: 10px;
}
.mo-text {
  font-size: 12px;
  color: #cccccc;
  span {
    color: #ff0000;
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
