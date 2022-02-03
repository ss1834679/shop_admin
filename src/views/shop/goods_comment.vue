<template>
  <div id="coupon_idx">
    <!-- 商品评论列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">商品评论</span>
      </div>
      <div class="content">
        <div class="tool">
          <div class="search_box">
            <!-- <el-input
              :placeholder="(select=='不限'?'':'请输入'+select)"
              v-model="searchInput"
              class="input-with-select"
            >
            <el-select v-model="select" slot="prepend">-->
            <!-- 筛选的条件 默认为不限 -->
            <!-- <el-option
                  v-for="item in allSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>-->
          </div>
        </div>
        <el-table :data="commentList" border row-key="id" height="200" style="width: 100%">
          <el-table-column prop="id" label="ID" align="center" width="80"></el-table-column>

          <el-table-column prop="userId" label="用户名">
            <!-- 商量传值的拼接 -->
          </el-table-column>
          <el-table-column prop="goodsId" label="商品名">
            <!-- 商量传值的拼接 -->
          </el-table-column>
          <el-table-column prop="orderItemId" label="所属订单ID">
            <!-- 商量传值的拼接 -->
          </el-table-column>
          <el-table-column prop="commentDesc" label="评论内容" width="250"></el-table-column>
          <!-- 商品评论logo -->
          <el-table-column prop="commentImages" align="center" label="评论图片" width="160">
            <template slot-scope="scope" v-if="scope.row.commentImages">
              <!-- 图片传参的方式定了再改 -->
              <el-image :src="base+scope.row.commentImages" style=" height: 40px" :preview-src-list="(base+scope.row.commentImages).split(',')"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="commentScore" label="评论评分"></el-table-column>
          <el-table-column prop="logisticsPacking" label="物流包装评分"></el-table-column>
          <el-table-column prop="logisticsService" label="物流服务评分"></el-table-column>
          <el-table-column prop="logisticsSpeed" label="物流速度评分"></el-table-column>
          <el-table-column prop="logisticsScore" label="物流平均评分"></el-table-column>
          <el-table-column prop="commentFabulous" label="评论数量"></el-table-column>
          <el-table-column label="评论状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isDelete" type="danger">禁用</el-tag>
              <el-tag v-else type="success">启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="115">
            <template slot-scope="scope">
              <el-button-group>
                <!-- 一开始没有删除功能 -->
                <el-tooltip v-if="scope.row.isDelete" effect="dark" content="启用" placement="top">
                  <el-button type="success" size="mini" icon="el-icon-open" @click="handleIsDelete({type:'up',row:scope.row})"></el-button>
                </el-tooltip>
                <el-tooltip v-else effect="dark" content="禁用" placement="top">
                  <el-button type="danger" size="mini" icon="el-icon-turn-off" @click="handleIsDelete({type:'down',row:scope.row})"></el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: "不限",
      maringLeft: { marginLeft: "10px" },
      searchInput: "",
      commentList: [
        {
          id: "1",
          userId: "124145" /* userID */,
          orderItemId: "12412314sdfs" /* 所属订单明细ID */,
          goodsId: "alhfa1242145" /* 所属SPU商品ID */,
          commentScore: 4.5 /* 评论评分 */,
          logisticsPacking: 4.5 /* 物流包装评分 */,
          logisticsService: 5.0 /* 物流服务评分 */,
          logisticsSpeed: 4.8 /* 物流速度评分 */,
          logisticsScore: 3.5 /* 物流平均评分 */,
          commentDesc: "评论内容" /* 评论内容*/,
          commentImages: [] /* 评论图片 */,
          commentVideo: "" /* 评论视频链接 */,
          commentFabulous: 67 /* 该评论点赞数 */,
          isDelete: 0 /* 是否删除 */
        },
        {
          id: "1214465862514253825",
          createTime: "2020-01-07 16:36:40",
          updateTime: "2020-01-07 16:36:40",
          isDelete: false,
          operator: "cXZ2AeIvCOT1EnEYN5CsWLqoX5bPyymX",
          userId: "cXZ2AeIvCOT1EnEYN5CsWLqoX5bPyymX",
          orderItemId: "w4xrZw8tZJ0QFswXhshDZCn92gr7Qeou",
          goodsId: "1214436053658710018",
          commentScore: 4.9,
          logisticsPacking: 3.99,
          logisticsService: 3.2,
          logisticsSpeed: 1.99,
          logisticsScore: 3.06,
          commentDesc:
            "陶文盟顽埔青钧露骑伞辐淮莆惜眨聚烷酚面往嗽刊色破弛痊蚂爽偿娠寿竟傲据形继淘襟玛钝堑窜舟苦踏旺屯泛档对埂鹅择造裤农诛涸粪咒斗庐俱复恿憨讶哇暖键酷筏指累尚旅盲谢症墟卢虐删优佬涉蛹撅勾跨色抽蹋互故城粥剂捞啸倘伺安帜企师膘钥风灰磨聘摩磁鞋甄男屋疽吃垫泊聘周原健又削忿镇访艳栏篓利捐纬吹熟假贰铁谷芥傣刀毒受楔瘤涯饭过渔府怯去要筐煌斑惊用捕糯聘牲糕脆竹琉携趾虫俱蔷溯翌原妨拓化裳秆波泰述笛外扎贷肋冠苏睫舱毒川售相",
          commentImages: null,
          commentVideo: null,
          commentFabulous: null
        },
        {
          id: "1214465862552002562",
          createTime: "2020-01-07 16:36:40",
          updateTime: "2020-01-07 16:36:40",
          isDelete: false,
          operator: "YnCoS6YAi7k4EDF4iINjN9j98h3PWZX6",
          userId: "YnCoS6YAi7k4EDF4iINjN9j98h3PWZX6",
          orderItemId: "CGH9QfcRCQywHAX8z4n4l6WHejDIBn9x",
          goodsId: "1214436053658710018",
          commentScore: 1.89,
          logisticsPacking: 3.84,
          logisticsService: 2.77,
          logisticsSpeed: 4.11,
          logisticsScore: 3.57,
          commentDesc:
            "协丧壕碾墟交毋刊湃己敝驾章蕴芒样咽皱教滩瑟悍蛤驮遁袱裔镣桑枉来逆男中幻狙凛跨坷挚颊袒绝斜恍艘淬焦宜举彰凡构堪消猎葛迢拓榜蛛橡姜彝汗瞧宴官冉麻洼鞠浇法枣匀碌旦哮悯浴斥疆项剖颗絮迢陇么蒙延示骗至湃圭操蛾啤爷汇荆假芹旭奴坞雾溅颇疫见惫续巴昭寡本耪扁革鬼荔挛巨针点登约嚏享女肛固普拍拖第验畦咕舰庆扦僳楷婆惹勾九许涛起绪胸悟立瓤赛辕肌花谎挣厕率斜恤茵滚茧气垫请还湾罗壁袁鹏滁慰旭账窗悄靳困铸雇贿诲锦暂择佣化萤蛛",
          commentImages: null,
          commentVideo: null,
          commentFabulous: null
        },
        {
          id: "12144658625142538345",
          createTime: "2020-01-07 16:36:40",
          updateTime: "2020-01-07 16:36:40",
          isDelete: false,
          operator: "cXZ2AeIvCOT1EnEYN5CsWLqoX5bPyymX",
          userId: "cXZ2AeIvCOT1EnEYN5CsWLqoX5bPyymX",
          orderItemId: "w4xrZw8tZJ0QFswXhshDZCn92gr7Qeou",
          goodsId: "1214436053658710018",
          commentScore: 4.9,
          logisticsPacking: 3.99,
          logisticsService: 3.2,
          logisticsSpeed: 1.99,
          logisticsScore: 3.06,
          commentDesc:
            "陶文盟顽埔青钧露骑伞辐淮莆惜眨聚烷酚面往嗽刊色破弛痊蚂爽偿娠寿竟傲据形继淘襟玛钝堑窜舟苦踏旺屯泛档对埂鹅择造裤农诛涸粪咒斗庐俱复恿憨讶哇暖键酷筏指累尚旅盲谢症墟卢虐删优佬涉蛹撅勾跨色抽蹋互故城粥剂捞啸倘伺安帜企师膘钥风灰磨聘摩磁鞋甄男屋疽吃垫泊聘周原健又削忿镇访艳栏篓利捐纬吹熟假贰铁谷芥傣刀毒受楔瘤涯饭过渔府怯去要筐煌斑惊用捕糯聘牲糕脆竹琉携趾虫俱蔷溯翌原妨拓化裳秆波泰述笛外扎贷肋冠苏睫舱毒川售相",
          commentImages: null,
          commentVideo: null,
          commentFabulous: null
        },
        {
          id: "121446586255202345",
          createTime: "2020-01-07 16:36:40",
          updateTime: "2020-01-07 16:36:40",
          isDelete: false,
          operator: "YnCoS6YAi7k4EDF4iINjN9j98h3PWZX6",
          userId: "YnCoS6YAi7k4EDF4iINjN9j98h3PWZX6",
          orderItemId: "CGH9QfcRCQywHAX8z4n4l6WHejDIBn9x",
          goodsId: "1214436053658710018",
          commentScore: 1.89,
          logisticsPacking: 3.84,
          logisticsService: 2.77,
          logisticsSpeed: 4.11,
          logisticsScore: 3.57,
          commentDesc:
            "协丧壕碾墟交毋刊湃己敝驾章蕴芒样咽皱教滩瑟悍蛤驮遁袱裔镣桑枉来逆男中幻狙凛跨坷挚颊袒绝斜恍艘淬焦宜举彰凡构堪消猎葛迢拓榜蛛橡姜彝汗瞧宴官冉麻洼鞠浇法枣匀碌旦哮悯浴斥疆项剖颗絮迢陇么蒙延示骗至湃圭操蛾啤爷汇荆假芹旭奴坞雾溅颇疫见惫续巴昭寡本耪扁革鬼荔挛巨针点登约嚏享女肛固普拍拖第验畦咕舰庆扦僳楷婆惹勾九许涛起绪胸悟立瓤赛辕肌花谎挣厕率斜恤茵滚茧气垫请还湾罗壁袁鹏滁慰旭账窗悄靳困铸雇贿诲锦暂择佣化萤蛛",
          commentImages: null,
          commentVideo: null,
          commentFabulous: null
        },
        {
          id: "121446586251425568",
          createTime: "2020-01-07 16:36:40",
          updateTime: "2020-01-07 16:36:40",
          isDelete: false,
          operator: "cXZ2AeIvCOT1EnEYN5CsWLqoX5bPyymX",
          userId: "cXZ2AeIvCOT1EnEYN5CsWLqoX5bPyymX",
          orderItemId: "w4xrZw8tZJ0QFswXhshDZCn92gr7Qeou",
          goodsId: "1214436053658710018",
          commentScore: 4.9,
          logisticsPacking: 3.99,
          logisticsService: 3.2,
          logisticsSpeed: 1.99,
          logisticsScore: 3.06,
          commentDesc:
            "陶文盟顽埔青钧露骑伞辐淮莆惜眨聚烷酚面往嗽刊色破弛痊蚂爽偿娠寿竟傲据形继淘襟玛钝堑窜舟苦踏旺屯泛档对埂鹅择造裤农诛涸粪咒斗庐俱复恿憨讶哇暖键酷筏指累尚旅盲谢症墟卢虐删优佬涉蛹撅勾跨色抽蹋互故城粥剂捞啸倘伺安帜企师膘钥风灰磨聘摩磁鞋甄男屋疽吃垫泊聘周原健又削忿镇访艳栏篓利捐纬吹熟假贰铁谷芥傣刀毒受楔瘤涯饭过渔府怯去要筐煌斑惊用捕糯聘牲糕脆竹琉携趾虫俱蔷溯翌原妨拓化裳秆波泰述笛外扎贷肋冠苏睫舱毒川售相",
          commentImages: null,
          commentVideo: null,
          commentFabulous: null
        },
        {
          id: "1214465862552002235",
          createTime: "2020-01-07 16:36:40",
          updateTime: "2020-01-07 16:36:40",
          isDelete: false,
          operator: "YnCoS6YAi7k4EDF4iINjN9j98h3PWZX6",
          userId: "YnCoS6YAi7k4EDF4iINjN9j98h3PWZX6",
          orderItemId: "CGH9QfcRCQywHAX8z4n4l6WHejDIBn9x",
          goodsId: "1214436053658710018",
          commentScore: 1.89,
          logisticsPacking: 3.84,
          logisticsService: 2.77,
          logisticsSpeed: 4.11,
          logisticsScore: 3.57,
          commentDesc:
            "协丧壕碾墟交毋刊湃己敝驾章蕴芒样咽皱教滩瑟悍蛤驮遁袱裔镣桑枉来逆男中幻狙凛跨坷挚颊袒绝斜恍艘淬焦宜举彰凡构堪消猎葛迢拓榜蛛橡姜彝汗瞧宴官冉麻洼鞠浇法枣匀碌旦哮悯浴斥疆项剖颗絮迢陇么蒙延示骗至湃圭操蛾啤爷汇荆假芹旭奴坞雾溅颇疫见惫续巴昭寡本耪扁革鬼荔挛巨针点登约嚏享女肛固普拍拖第验畦咕舰庆扦僳楷婆惹勾九许涛起绪胸悟立瓤赛辕肌花谎挣厕率斜恤茵滚茧气垫请还湾罗壁袁鹏滁慰旭账窗悄靳困铸雇贿诲锦暂择佣化萤蛛",
          commentImages: null,
          commentVideo: null,
          commentFabulous: null
        }
      ],
      base: "" /* 图片链接开头 */
    };
  },
  mounted() {
    this.base = this.$store.state.base_url;
  },
  methods: {
    addNewCoupon() {
      this.$router.push({ name: "coupon_add" });
    },
    alterCoupon(rows) {
      this.$router.push({ name: "coupon_alter", params: { data: rows } });
    },
    selectToSearch() {
      console.log(this.statusSearch);
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
  },
  components: {}
};
</script>

<style lang='less'>
#coupon_idx {
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
        .search_box {
          width: 270px;
        }
        .filtrate {
          // .el-button{
          //   margin-right: 10px;
          // }
          display: flex;
          align-items: center;
          width: auto;
          .el-select .el-input__inner {
            width: 110px; //搜索框宽度
          }
          .el-select:last-child {
            .el-input__inner {
              width: 140px; //搜索框宽度
            }
          }
        }
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
