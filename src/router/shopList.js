import Shop from '../views/shop/shop'
import supplierIndex from '../views/shop/supplier_idx'

export default {
    path: '/shop',
    name: 'shop',
    redirect: '/shop/index',
    component: Shop,
    meta: {
        title: '商城'
    },
    children: [{
        path: 'index',
        name: 'supplier',
        redirect: '/shop/index/index',
        meta: {
            title: '店铺管理'
        },
        component: () => import( /* webpackChunkName: "index" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'supplier_Idx',
            meta: {
                title: '店铺列表'
            },
            component: supplierIndex
        }, {
            path: 'add',
            name: 'supplier_add',
            meta: {
                title: '添加店铺'
            },
            component: () => import( /* webpackChunkName: "addIndex" */ '../views/shop/supplier_add&alter.vue')
        }, {
            path: 'alter',
            name: 'supplier_alter',
            meta: {
                title: '修改店铺'
            },
            component: () => import( /* webpackChunkName: "alterIndex" */ '../views/shop/supplier_add&alter.vue')
        }]
    },
    {
        path: 'article',
        name: 'article',
        redirect: '/shop/article/index',
        meta: {
            title: '文章管理'
        },
        component: () => import( /* webpackChunkName: "article" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'article_Idx',
            meta: {
                title: '文章管理'
            },
            component: () => import( /* webpackChunkName: "articleIdx" */ '../views/shop/articel_idx.vue')
        }, {
            path: 'add',
            name: 'article_add',
            meta: {
                title: '添加文章'
            },
            component: () => import( /* webpackChunkName: "addArticle" */ '../views/shop/articel_add&alter.vue')
        }, {
            path: 'alter',
            name: 'article_alter',
            meta: {
                title: '文章修改'
            },
            component: () => import( /* webpackChunkName: "alterArticle" */ '../views/shop/articel_add&alter.vue')
        }]
    },
    {
        path: 'goods',
        name: 'goods',
        redirect: '/shop/goods/index',
        meta: {
            title: '商品列表'
        },
        component: () => import( /* webpackChunkName: "goods" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'goods_Idx',
            meta: {
                title: '商品列表'
            },
            component: () => import( /* webpackChunkName: "goodsIdx" */ '../views/shop/goods_idx.vue')
        }, {
            path: 'add',
            name: 'goods_add',
            meta: {
                title: '添加商品'
            },
            component: () => import( /* webpackChunkName: "addGoods" */ '../views/shop/goods_add&alter.vue')
        }, {
            path: 'alter',
            name: 'goods_alter',
            meta: {
                title: '修改商品'
            },
            component: () => import( /* webpackChunkName: "alterGoods" */ '../views/shop/goods_add&alter.vue')
        }]
    },
    {
        path: 'order',
        name: 'order',
        redirect: '/shop/order/index',
        meta: {
            title: '订单管理'
        },
        component: () => import( /* webpackChunkName: "order" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'order_Idx',
            meta: {
                title: '订单列表'
            },
            component: () => import( /* webpackChunkName: "orderIdx" */ '../views/shop/order_idx.vue')
        }, {
            path: 'alter',
            name: 'order_view',
            meta: {
                title: '订单详情'
            },
            component: () => import( /* webpackChunkName: "alterOrder" */ '../views/shop/order_view.vue')
        }]
    },
    {
        path: 'category',
        name: 'category',
        redirect: '/shop/category/index',
        meta: {
            title: '分类列表'
        },
        component: () => import( /* webpackChunkName: "category" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'category_Idx',
            meta: {
                title: '分类列表'
            },
            component: () => import( /* webpackChunkName: "categoryIdx" */ '../views/shop/category_idx.vue')
        }, {
            path: 'add',
            name: 'category_add',
            meta: {
                title: '添加分类'
            },
            component: () => import( /* webpackChunkName: "addCategory" */ '../views/shop/category_add&alter.vue')
        }, {
            path: 'alter',
            name: 'category_alter',
            meta: {
                title: '修改分类'
            },
            component: () => import( /* webpackChunkName: "alterCategory" */ '../views/shop/category_add&alter.vue')
        }]
    },
    {
        path: 'brand',
        name: 'brand',
        redirect: '/shop/brand/index',
        meta: {
            title: '品牌列表'
        },
        component: () => import( /* webpackChunkName: "brand" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'brand_Idx',
            meta: {
                title: '品牌列表'
            },
            component: () => import( /* webpackChunkName: "brandIdx" */ '../views/shop/brand_idx.vue')
        }, {
            path: 'add',
            name: 'brand_add',
            meta: {
                title: '添加品牌'
            },
            component: () => import( /* webpackChunkName: "addBrand" */ '../views/shop/brand_add&alter.vue')
        }, {
            path: 'alter',
            name: 'brand_alter',
            meta: {
                title: '修改品牌'
            },
            component: () => import( /* webpackChunkName: "alterBrand" */ '../views/shop/brand_add&alter.vue')
        }]
    },
    {
        path: 'coupon',
        name: 'coupon',
        redirect: '/shop/coupon/index',
        meta: {
            title: '优惠券列表'
        },
        component: () => import( /* webpackChunkName: "coupon" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'coupon_Idx',
            meta: {
                title: '优惠券列表'
            },
            component: () => import( /* webpackChunkName: "couponIdx" */ '../views/shop/coupon_idx.vue')
        }, {
            path: 'add',
            name: 'coupon_add',
            meta: {
                title: '添加优惠券'
            },
            component: () => import( /* webpackChunkName: "addCoupon" */ '../views/shop/coupon_add&alter.vue')
        }, {
            path: 'alter',
            name: 'coupon_alter',
            meta: {
                title: '修改优惠券'
            },
            component: () => import( /* webpackChunkName: "alterCoupon" */ '../views/shop/coupon_add&alter.vue')
        }]
    },
    {
        path: 'goods_comment',
        name: 'goods_comment',
        meta: {
            title: '商品评论'
        },
        component: () => import( /* webpackChunkName: "goodsComment" */ '../views/shop/goods_comment.vue'),
    },
    {
        path: 'user',
        name: 'user',
        redirect: '/shop/user/index',
        meta: {
            title: '用户列表'
        },
        component: () => import( /* webpackChunkName: "user" */ '../views/comIndex.vue'),
        children: [{
            path: 'index',
            name: 'user_Idx',
            meta: {
                title: '用户列表'
            },
            component: () => import( /* webpackChunkName: "userIdx" */ '../views/shop/user_idx.vue')
        }, {
            path: 'add',
            name: 'user_add',
            meta: {
                title: '添加用户'
            },
            component: () => import( /* webpackChunkName: "addUser" */ '../views/shop/user_add&alter.vue')
        }, {
            path: 'alter',
            name: 'user_alter',
            meta: {
                title: '修改用户'
            },
            component: () => import( /* webpackChunkName: "alterUser" */ '../views/shop/user_add&alter.vue')
        }]
    }
    ]
}