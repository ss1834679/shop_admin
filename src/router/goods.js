
import comIdx from '../views/comIndex'

export default {
    path: '/goods',
    name: 'good',
    component: comIdx,
    meta: { title: '商品' },
    children: [
        {
            path: 'goods',
            name: 'goods',
            redirect: '/goods/goods/index',
            meta: { title: '商品列表' },
            component: () => import( /* webpackChunkName: "goods" */ '../views/comIndex.vue'),
            children: [{
                path: 'index',
                name: 'goods_Idx',
                meta: { title: '商品列表' },
                component: () => import( /* webpackChunkName: "goodsIdx" */ '../views/goods/goods_idx.vue')
            }, {
                path: 'indexSup',
                name: 'goods_Idx_sup',
                meta: { title: '商品列表' },
                component: () => import( /* webpackChunkName: "goodsIdxSup" */ '../views/goods/goods_idx_sup.vue')
            }, {
                path: 'add',
                name: 'goods_add',
                meta: { title: '添加商品' },
                component: () => import( /* webpackChunkName: "addGoods" */ '../views/goods/good_add.vue')
            }, {
                path: 'addSup',
                name: 'goods_add_sup',
                meta: { title: '添加商品' },
                component: () => import( /* webpackChunkName: "addGoodsSup" */ '../views/goods/good_add_sup')
            }, {
                path: 'alter',
                name: 'goods_alter',
                meta: { title: '修改商品' },
                component: () => import( /* webpackChunkName: "alterGoods" */ '../views/goods/goods_alter.vue')
            }, {
                path: 'alterSup',
                name: 'goods_alter_sup',
                meta: { title: '修改商品' },
                component: () => import( /* webpackChunkName: "alterGoodsSup" */ '../views/goods/goods_alter_sup')
            }, {
                path: 'check',
                name: 'goods_checkIdx',
                meta: { title: '商品审核' },
                component: () => import( /* webpackChunkName: "goodsCheckIdx" */ '../views/goods/goods_checkIdx.vue')
            }, {
                path: 'check_view',
                name: 'goods_check_view',
                meta: { title: '商品审核查看' },
                component: () => import( /* webpackChunkName: "goodsCheckView" */ '../views/goods/goods_check_view.vue')
            }, {
                path: 'veiw',
                name: 'goods_view',
                meta: { title: '商品详情' },
                component: () => import( /* webpackChunkName: "goodsView" */ '../views/goods/goods_view.vue')
            }
            ]
        },
        {
            path: 'attribute',
            name: 'goods_attribute',
            redirect: '/goods/attribute/index',
            meta: { title: '商品属性' },
            component: () => import( /* webpackChunkName: "goods" */ '../views/comIndex.vue'),
            children: [{
                path: 'index',
                name: 'attribute_Idx',
                meta: { title: '类型列表' },
                component: () => import( /* webpackChunkName: "attributeIdx" */ '../views/goods/goods_attribute.vue')
            }, {
                path: 'currency',
                name: 'attribute_currency',
                meta: { title: '属性列表' },
                component: () => import( /* webpackChunkName: "attributeCurrency" */ '../views/goods/attribute_currency.vue')
            }, {
                path: 'optional',
                name: 'attribute_optional',
                meta: { title: '参数列表' },
                component: () => import( /* webpackChunkName: "attributeOptional" */ '../views/goods/attribute_optional.vue')
            }, {
                path: 'optionalAlter',
                name: 'optional_alter',
                meta: { title: '修改参数' },
                component: () => import( /* webpackChunkName: "optionalAlter" */ '../views/goods/attr_optional_edit.vue')
            }, {
                path: 'optionalAdd',
                name: 'optional_add',
                meta: { title: '添加参数' },
                component: () => import( /* webpackChunkName: "optionalAdd" */ '../views/goods/attr_optional_edit.vue')
            }, {
                path: 'currencyAlter',
                name: 'currency_alter',
                meta: { title: '修改属性' },
                component: () => import( /* webpackChunkName: "currencyAlter" */ '../views/goods/attr_currency_edit.vue')
            }, {
                path: 'currencyAdd',
                name: 'currency_add',
                meta: { title: '添加属性' },
                component: () => import( /* webpackChunkName: "currencyAdd" */ '../views/goods/attr_currency_edit.vue')
            }, {
                path: 'attrStyleList',
                name: 'attrStyleList',
                meta: { title: '风格列表' },
                component: () => import( /* webpackChunkName: "attrStyleList" */ '../views/goods/attribute_style')
            }, {
                path: 'editAttrStyle',
                name: 'editAttrStyle',
                meta: { title: '风格列表' },
                    component: () => import( /* webpackChunkName: "editAttrStyle" */ '../views/goods/attribute_style_edit')
            }
            ]
        },
        {
            path: 'brand',
            name: 'brand',
            redirect: '/goods/brand/index',
            meta: { title: '品牌列表' },
            component: () => import( /* webpackChunkName: "brand" */ '../views/comIndex.vue'),
            children: [{
                path: 'index',
                name: 'brand_Idx',
                meta: { title: '品牌列表' },
                component: () => import( /* webpackChunkName: "brandIdx" */ '../views/goods/brand_idx.vue')
            }, {
                path: 'add',
                name: 'brand_add',
                meta: { title: '添加品牌' },
                component: () => import( /* webpackChunkName: "addBrand" */ '../views/goods/brand_add&alter.vue')
            }, {
                path: 'alter',
                name: 'brand_alter',
                meta: { title: '修改品牌' },
                component: () => import( /* webpackChunkName: "alterBrand" */ '../views/goods/brand_add&alter.vue')
            }]
        },
        {
            path: 'category',
            name: 'category',
            redirect: '/goods/category/index',
            meta: { title: '分类列表' },
            component: () => import( /* webpackChunkName: "category" */ '../views/comIndex.vue'),
            children: [{
                path: 'index',
                name: 'category_Idx',
                meta: { title: '分类列表' },
                component: () => import( /* webpackChunkName: "categoryIdx" */ '../views/goods/category_idx.vue')
            }, {
                path: 'add',
                name: 'category_add',
                meta: { title: '添加分类' },
                component: () => import( /* webpackChunkName: "addCategory" */ '../views/goods/category_add&alter.vue')
            }, {
                path: 'alter',
                name: 'category_alter',
                meta: { title: '修改分类' },
                component: () => import( /* webpackChunkName: "alterCategory" */ '../views/goods/category_add&alter.vue')
            }]
        },
        {
            path: 'supplier',
            name: 'supplier',
            redirect: '/supplier/index',
            meta: { title: '店铺管理' },
            component: () => import( /* webpackChunkName: "index" */ '../views/comIndex.vue'),
            children: [{
                path: 'index',
                name: 'supplier_Idx',
                meta: { title: '店铺列表' },
                component: () => import( /* webpackChunkName: "supplierIdx" */ '../views/goods/supplier_idx.vue')
            }, {
                path: 'add',
                name: 'supplier_add',
                meta: { title: '添加店铺' },
                component: () => import( /* webpackChunkName: "addIndex" */ '../views/goods/supplier_add&alter.vue')
            }, {
                path: 'alter',
                name: 'supplier_alter',
                meta: { title: '修改店铺' },
                component: () => import( /* webpackChunkName: "alterIndex" */ '../views/goods/supplier_add&alter.vue')
            }]
        },
        {
            path: 'designer',
            name: 'designer',
            redirect: '/goods/designer/index',
            meta: { title: '设计师管理' },
            component: () => import( /* webpackChunkName: "designer" */ '../views/comIndex.vue'),
            children: [{
                path: 'index',
                name: 'designer_Idx',
                meta: { title: '设计师列表' },
                component: () => import( /* webpackChunkName: "designerIdx" */ '../views/goods/designer_idx.vue')
            }, {
                path: 'add',
                name: 'designer_add',
                meta: { title: '添加设计师' },
                component: () => import( /* webpackChunkName: "designerAdd" */ '../views/goods/designer_add.vue')
            }, {
                path: 'alter',
                name: 'designer_alter',
                meta: { title: '修改设计师' },
                component: () => import( /* webpackChunkName: "designerAlter" */ '../views/goods/designer_alter.vue')
            }, {
                path: 'check',
                name: 'designer_check',
                meta: { title: '设计师审核' },
                component: () => import( /* webpackChunkName: "designerCheck" */ '../views/goods/designer_check.vue')
            }]
        },
    ]
}