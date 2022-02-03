import comIdx from '../views/comIndex'

export default {
    path: '/promotion',
    name: 'promotion'/* 促销 */,
    component: comIdx,
    meta: { title: '促销' },
    redirect: '/promotion/coupon/index',
    children: [
        {
            path: 'coupon',
            name: 'coupon',
            meta: { title: '优惠券' },
            redirect: '/promotion/coupon/index',
            component: () => import( /* webpackChunkName: "coupon" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'index',
                    name: 'coupon_idx',
                    meta: { title: '优惠券列表' },
                    component: () => import( /* webpackChunkName: "couponIdx" */ '../views/promotion/coupon_idx.vue')
                },
                {
                    path: 'add',
                    name: 'coupon_add',
                    meta: { title: '添加优惠券' },
                    component: () => import( /* webpackChunkName: "addCoupon" */ '../views/promotion/coupon_add.vue')
                },
                {
                    path: 'alter',
                    name: 'coupon_alter',
                    meta: { title: '修改优惠券' },
                    component: () => import( /* webpackChunkName: "alterCoupon" */ '../views/promotion/coupon_alter.vue')
                },
                {
                    path: 'view',
                    name: 'coupon_view',
                    meta: { title: '优惠券详情' },
                    component: () => import( /* webpackChunkName: "couponView" */ '../views/promotion/coupon_view')
                }
            ]
        },
        {
            path: 'discount',
            name: 'discount',
            meta: { title: '活动管理' },
            redirect: '/promotion/discount/index',
            component: () => import( /* webpackChunkName: "discount" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'index',
                    name: 'discount_idx',
                    meta: { title: '活动列表' },
                    component: () => import( /* webpackChunkName: "discountIdx" */ '../views/promotion/discount_idx.vue')
                }, {
                    path: 'add',
                    name: 'discount_add',
                    meta: { title: '添加活动' },
                    component: () => import( /* webpackChunkName: "addDiscount" */ '../views/promotion/discount_add.vue')
                }, {
                    path: 'alter',
                    name: 'discount_alter',
                    meta: { title: '修改活动' },
                    component: () => import( /* webpackChunkName: "alterDiscount" */ '../views/promotion/discount_alter.vue')
                }
            ]
        },
        {
            path: 'activity',
            name: 'activity',
            meta: { title: '活动' },
            component: () => import( /* webpackChunkName: "activity" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'luckyCharmList',
                    name: 'luckyCharmList',
                    meta: { title: '装小鲤' },
                    component: () => import( /* webpackChunkName: "luckyCharmList" */ '../views/promotion/luckyCharmList.vue')
                }, {
                    path: 'luckyCharmAlter',
                    name: 'luckyCharmAlter',
                    meta: { title: '报名用户详情' },
                    component: () => import( /* webpackChunkName: "luckyCharmAlter" */ '../views/promotion/luckyCharmAlter.vue')
                }, {
                    path: 'luckyCharmSet',
                    name: 'luckyCharmSet',
                    meta: { title: '装小鲤活动设置' },
                    component: () => import( /* webpackChunkName: "luckyCharmSet" */ '../views/promotion/luckyCharmSet.vue')
                }
            ]
        },
        {
            path: 'voteactivity',
            name: 'voteactivity',
            meta: { title: '投票活动' },
            component: () => import( /* webpackChunkName: "activity" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'editvoteActivity',
                    name: 'editvoteActivity',
                    meta: { title: '添加活动' },
                    component: () => import( /* webpackChunkName: "editvoteActivity" */ '../views/promotion/activity/editVoteActivity')
                },
                {
                    path: 'voteActivityList',
                    name: 'voteActivityList',
                    meta: { title: '活动列表' },
                    component: () => import( /* webpackChunkName: "voteActivityList" */ '../views/promotion/activity/voteActivityList')
                },
                {
                    path: 'activiDetails',
                    name: 'activiDetails',
                    meta: { title: '活动详情' },
                    component: () => import( /* webpackChunkName: "activiDetails" */ '../views/promotion/activity/activiDetails')
                },
                {
                    path: 'activityForm',
                    name: 'activityForm',
                    meta: { title: '用户表单' },
                    component: () => import( /* webpackChunkName: "activityForm" */ '../views/promotion/activity/activityForm')
                }
            ]
        },
        {
            path: 'landing',
            name: 'landing',
            meta: { title: '落地页' },
            component: () => import( /* webpackChunkName: "landing" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'landingConfig',
                    name: 'landingConfig',
                    meta: { title: '页面配置' },
                    component: () => import( /* webpackChunkName: "landingConfig" */ '../views/promotion/landing/landingConfig')
                }
            ]
        },
        {
            path: 'indexRecommend',
            name: 'brandDay',
            meta: { title: '涂邦品牌日' },
            redirect: '/promotion/indexRecommend/brandday',
            component: () => import( /* webpackChunkName: "brandday" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'brandday',
                    name: 'brandDay_idx',
                    meta: { title: '品牌日列表' },
                    component: () => import( /* webpackChunkName: "brandDay" */ '../views/promotion/brand_day.vue')
                },
                {
                    path: 'addAGood',
                    name: 'addAGood',
                    meta: { title: '添加单品' },
                    component: () => import( /* webpackChunkName: "addAGood" */ '../views/promotion/add_agood.vue')
                },
                {
                    path: 'tbSeckill',
                    name: 'tbSeckill',
                    meta: { title: '涂邦快抢' },
                    component: () => import( /* webpackChunkName: "tbSeckill" */ '../views/promotion/tb_seckill.vue')
                },
                {
                    path: 'popularRecommend',
                    name: 'popularRecommend',
                    meta: { title: '人气推荐' },
                    component: () => import( /* webpackChunkName: "popularRecommend" */ '../views/promotion/popularRecommend.vue')
                },
                {
                    path: 'editPopular',
                    name: 'editPopular',
                    meta: { title: '编辑人气推荐' },
                    component: () => import( /* webpackChunkName: "editPopular" */ '../views/promotion/popularEdit')
                }
            ]
        },
        {
            path: 'groupShopping',
            name: 'groupShopping',
            meta: { title: '拼团' },
            redirect: '/promotion/groupShopping/index',
            component: () => import( /* webpackChunkName: "groupShopping" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'index',
                    name: 'groupShopping_idx',
                    meta: { title: '拼团商品' },
                    component: () => import( /* webpackChunkName: "groupShopping_idx" */ '../views/promotion/groupShopping_idx.vue')
                },
                {
                    path: 'view',
                    name: 'groupShopping_view',
                    meta: { title: '拼团商品详情' },
                    component: () => import( /* webpackChunkName: "groupShopping_view" */ '../views/promotion/groupShopping_view.vue')
                },
                {
                    path: 'order',
                    name: 'groupShopping_order',
                    meta: { title: '拼团管理' },
                    component: () => import( /* webpackChunkName: "groupShopping_order" */ '../views/promotion/groupShopping_order')
                },
                {
                    path: 'setting',
                    name: 'groupShopping_set',
                    meta: { title: '拼团设置' },
                    component: () => import( /* webpackChunkName: "groupShopping_set" */ '../views/promotion/groupShopping_set')
                },
                {
                    path: 'add',
                    name: 'groupShopping_add',
                    meta: { title: '添加拼团商品' },
                    component: () => import( /* webpackChunkName: "groupShopping_add" */ '../views/promotion/groupShopping_add')
                },
                {
                    path: 'alter',
                    name: 'groupShopping_alter',
                    meta: { title: '修改拼团商品' },
                    component: () => import( /* webpackChunkName: "groupShopping_alter" */ '../views/promotion/groupShopping_alter')
                },
                {
                    path: 'detail',
                    name: 'groupShopping_detail',
                    meta: { title: '拼团信息' },
                    component: () => import( /* webpackChunkName: "groupShopping_detail" */ '../views/promotion/groupShopping_detail')
                }
            ]
        },
        {
            path: 'distribuManage',
            name: 'distribuManage',
            meta: { title: '分销管理' },
            component: () => import( /* webpackChunkName: "distribuManage" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'disGroupList',
                    name: 'disGroupList',
                    meta: { title: '团队列表' },
                    component: () => import( /* webpackChunkName: "disGroupList" */ '../views/promotion/disGroupList.vue')
                },
                {
                    path: 'viewGroupMember',
                    name: 'viewGroupMember',
                    meta: { title: '查看团员' },
                    component: () => import( /* webpackChunkName: "viewGroupMember" */ '../views/promotion/viewGroupMember.vue')
                },
                {
                    path: 'groupMemberdetails',
                    name: 'groupMemberdetails',
                    meta: { title: '查看详情' },
                    component: () => import( /* webpackChunkName: "groupMemberdetails" */ '../views/promotion/groupMemberdetails.vue')
                },
                {
                    path: 'profitDetails',
                    name: 'profitDetails',
                    meta: { title: '分销收益明细' },
                    component: () => import( /* webpackChunkName: "profitDetails" */ '../views/promotion/profitDetails.vue')
                },
                {
                    path: 'distribuList',
                    name: 'distribuList',
                    meta: { title: '分销列表' },
                    component: () => import( /* webpackChunkName: "distribuList" */ '../views/promotion/distribuList.vue')
                },
                {
                    path: 'withdrawalList',
                    name: 'withdrawalList',
                    meta: { title: '提现列表' },
                    component: () => import( /* webpackChunkName: "withdrawalList" */ '../views/promotion/withdrawalList.vue')
                },
                {
                    path: 'distribuSet',
                    name: 'distribuSet',
                    meta: { title: '分销设置' },
                    component: () => import( /* webpackChunkName: "distribuSet" */ '../views/promotion/distribuSet.vue')
                },
                {
                    path: 'withdrawalSet',
                    name: 'withdrawalSet',
                    meta: { title: '提现设置' },
                    component: () => import( /* webpackChunkName: "withdrawalSet" */ '../views/promotion/withdrawalSet.vue')
                }
            ]
        }
    ]
}