<template>
	<!-- 报价需求 -->
	<div id="offerDemand">
		<div class="topTitle flexRow">
			<span class="title">报价需求</span>
			<el-button><i class="el-icon-refresh"></i>刷新</el-button>
		</div>
		<div class="contentBox">
			<div class="selectBox">
				<div class="topInput">
					<div class="flexRow flex1">
						<div class="flexRow">
							<span class="spanLabel">方案名：</span>
							<el-input v-model="commodityName" placeholder="方案名"></el-input>
						</div>
						<div class="flexRow">
							<span class="spanLabel">手机号码：</span>
							<el-input v-model="phoneNumber" placeholder="请选择"></el-input>
						</div>
						<div class="flexRow">
							<span class="spanLabel">联系状态：</span>
							<el-select v-model="value" placeholder="请选择">
								<el-option
								  v-for="item in options"
								  :key="item.value"
								  :label="item.label"
								  :value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>
					<div>
						<el-button>搜索</el-button>
					</div>
				</div>
				<div>
					<span>添加时间：</span>
					<el-date-picker
					  v-model="value2"
					  type="datetimerange"
					  range-separator="至"
					  start-placeholder="开始日期"
					  end-placeholder="结束日期"
					  align="right">
					</el-date-picker>
				</div>
			</div>
			
			<div class="tableBox">
				<el-table
				    ref="multipleTable"
				    :data="tableData"
				    style="width: 100%"
					header-cell-style="background:#f9fafc"
					border
					:header-cell-style="thStyleFun"
					:cell-style="cellStyleFun"
				    @selection-change="">
				    <el-table-column
				      type="selection"
					  width="70px"
					>
				    </el-table-column>
				    <el-table-column
				      label="编号"
					  width="90px"
					  type="index"
					  :index="indexMethods"
				     >
				    </el-table-column>
				    <el-table-column
				      prop="phoneNumber"
				      label="手机号码"
				     >
				    </el-table-column>
					<el-table-column
					  prop="img"
					  label="户型图"
					 >
					</el-table-column><el-table-column
				      prop="name"
				      label="报价方案名"
				     >
				    </el-table-column><el-table-column
				      prop="area"
				      label="小区"
				     >
				    </el-table-column><el-table-column
				      prop="measureArea"
				      label="面积"
					  width="90px"
				     >
				    </el-table-column><el-table-column
				      prop="style"
				      label="风格"
				     >
				    </el-table-column><el-table-column
				      label="联系状态"
				      width="120">
					  <template slot-scope="scope">
						  <el-switch v-model="scope.row.contactStyle"></el-switch>
						  <span v-if="scope.row.contactStyle">已联系</span>
						  <span v-else>未联系</span>
					  </template>
				    </el-table-column><el-table-column
				      prop="time"
				      label="提交时间"
				     >
				    </el-table-column><el-table-column
				      label="操作"
				     >
						 <template slot-scope="scope">
							 <span class="journal" @click="openJournal(scope.row)">日志</span>
						 </template>
				    </el-table-column>
				    
				  </el-table>
			</div>
			<div class="bottom flexRow">
				<div class="flexRow">
					<div>
						<el-checkbox v-model="checked">全选</el-checkbox>
					</div>
					<div>
						<el-select v-model="value" placeholder="批量操作">
							<el-option
							  v-for="item in options1"
							  :key="item.value"
							  :label="item.label"
							  :value="item.value">
							</el-option>
						</el-select>
					</div>
					<div>
						<el-button>确定</el-button>
					</div>
				</div>
				<div>
					<el-pagination
					  background
					  layout="total,prev, pager, next,jumper"
					  :total="1000">
					</el-pagination>
				</div>
			</div>
		</div>
		<el-dialog
		  title="联系状态修改日志"
		  :visible.sync="dialogVisible"
		  width="40%">
		  <span>
			  <el-table
			      :data="journalData"
			      border
			      style="width: 100%">
			      <el-table-column
			        prop="time"
			        label="时间">
			      </el-table-column>
			      <el-table-column
			        prop="changeName"
			        label="修改人员">
			      </el-table-column>
			      <el-table-column
			        prop="contactStatus"
			        label="联系状态">
			      </el-table-column>
			    </el-table>
		  </span>
		</el-dialog>

		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				options: [{
				  value: '选项1',
				  label: '已联系'
				}, {
				  value: '选项2',
				  label: '未联系'
				}],
				options1: [{
				  value: '选项1',
				  label: '批量标记为已联系'
				}, {
				  value: '选项2',
				  label: '批量标记为未联系'
				}],
				value: '',
				commodityName:"",//方案名
				phoneNumber:"",//手机号码
				value2: '',
				checked:false,//底部全选按钮
				tableData:[
					{phoneNumber:"12345678910",img:"",name:"小户型极简设计",area:"天安数码城小区",measureArea:"92",style:"极简",contactStyle:false,time:"2020-04-03 11:00:00",operation:"日志" },
					{phoneNumber:"12345678910",img:"",name:"小户型极简设计",area:"天安数码城小区",measureArea:"92",style:"极简",contactStyle:true,time:"2020-04-03 11:00:00",operation:"日志" },
					{phoneNumber:"12345678910",img:"",name:"小户型极简设计",area:"天安数码城小区",measureArea:"92",style:"极简",contactStyle:true,time:"2020-04-03 11:00:00",operation:"日志" },
				],
				dialogVisible:false,//​联系状态修改日志弹框
				journalData:[//日志弹框表格
					{time:"2020-04-27 14:00:00",changeName:"曾xx",contactStatus:"已联系"},
					{time:"2020-04-26 14:00:00",changeName:"曾xx",contactStatus:"未联系"},
				]
			}
		},
		mounted(){
			
		},
		methods:{
			thStyleFun() {
			  return 'text-align:center;background:#f9fafc;'
			},
			cellStyleFun() {
			  return 'text-align:center'
			},
			//表格编号
			indexMethods(index){
				return this.tableData.length-index;
			},
			openJournal(dataRow){
				this.dialogVisible = true;
				console.log(dataRow)
			}
		}
	}
</script>

<style lang="less" scoped>
.flexRow{
	display: flex;
	flex-direction: row;
}
.flex1{
	flex: 1;
}
#offerDemand{
	.topTitle{
		padding: 5px 20px;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #EBEEF5;
	}
	width: 100%;
	padding: 0;
	background: #fff;
	.contentBox{
		padding: 20px;
		.selectBox{
			border: 1px solid #EBEEF5;
			padding: 10px 30px;
			.topInput{
				justify-content: space-between;
				align-items: center;
				margin-bottom: 30px;
				.flexRow();
				.spanLabel{
					flex-shrink: 0;
				}
				>div{
					>div{
						margin-right: 50px;
					}
				}
				.flex1{
					.flexRow{
						align-items: center;
					}
				}
			}
		}
		.tableBox{
			padding: 20px 0;
			.journal{
				color:rgb(26, 188, 156);
				cursor: pointer;
			}
		}
		.bottom{
			justify-content: space-between;
			align-items: center;
			.flexRow{
				align-items: center;
				>div{
					margin-right: 20px;
				}
			}
			/deep/ .el-pagination{
				margin: 0;
			}
			
		}
		
	}
	
}

</style>
