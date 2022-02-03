import comIdx from '../views/comIndex'

export default {
    path: '/content',
    name: 'content'/* 内容 */,
    component: comIdx,
    meta: { title: '内容' },
    redirect: '/content/circle/topic_index',
    children: [
        {
            path: 'circle',
            name: 'circle',
            meta: { title: '圈子详情' },
            redirect: '/content/circle/topic_index',
            component: () => import( /* webpackChunkName: "circle" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'topic_index',
                    name: 'topic_Idx',
                    meta: { title: '话题列表' },
                    component: () => import( /* webpackChunkName: "topicIdx" */ '../views/content/topic_idx.vue')
                }, {
                    path: 'topic_add',
                    name: 'topic_add',
                    meta: { title: '添加话题' },
                    component: () => import( /* webpackChunkName: "topicAdd" */ '../views/content/topic_add.vue')
                }, {
                    path: 'article_index',
                    name: 'article_Idx',
                    meta: { title: '文章列表' },
                    component: () => import( /* webpackChunkName: "articleIdx" */ '../views/content/article_idx.vue')
                }, {
                    path: 'article_add',
                    name: 'article_add',
                    meta: { title: '发布文章' },
                    component: () => import( /* webpackChunkName: "addArticle" */ '../views/content/article_add.vue')
                }, {
                    path: 'article_alter',
                    name: 'article_alter',
                    meta: { title: '编辑文章' },
                    component: () => import( /* webpackChunkName: "alterArticle" */ '../views/content/article_alter.vue')
                }, {
                    path: 'inspiration_index',
                    name: 'inspiration_Idx',
                    meta: { title: '灵感列表' },
                    component: () => import( /* webpackChunkName: "inspirationIdx" */ '../views/content/inspiration_idx.vue')
                }, {
                    path: 'inspiration_add',
                    name: 'inspiration_add',
                    meta: { title: '发布灵感' },
                    component: () => import( /* webpackChunkName: "addInspiration" */ '../views/content/inspiration_add.vue')
                }, {
                    path: 'inspiration_alter',
                    name: 'inspiration_alter',
                    meta: { title: '编辑灵感' },
                    component: () => import( /* webpackChunkName: "alterInspiration" */ '../views/content/inspiration_alter.vue')
                }, {
                    path: 'article_check',
                    name: 'article_check',
                    meta: { title: '文章审核' },
                    component: () => import( /* webpackChunkName: "articleCheck" */ '../views/content/article_check.vue')
                }, {
                    path: 'inspiration_check',
                    name: 'inspiration_check',
                    meta: { title: '灵感审核' },
                    component: () => import( /* webpackChunkName: "inspirationCheck" */ '../views/content/inspiration_check.vue')
                },
                {
                    path: 'tbinformation-idx',
                    name: 'tbinformation-idx',
                    meta: { title: '资讯列表' },
                    component: () => import( /* webpackChunkName: "tbinformationIdx" */ '../views/content/tbinformation-idx.vue')
                },
                {
                    path: 'tbinformation_check',
                    name: 'tbinformation_check',
                    meta: { title: '资讯审核' },
                    component: () => import( /* webpackChunkName: "tbinformationCheck" */ '../views/content/tbinformation_check.vue')
                }, {
                    path: 'tbinformation_detail',
                    name: 'tbinformation_detail',
                    meta: { title: '资讯详情' },
                    component: () => import( /* webpackChunkName: "tbinformationDetail" */ '../views/content/tbinformation_detail.vue')
                }, {
                    path: 'tbinformation-add',
                    name: 'tbinformation-add',
                    meta: { title: '发布资讯' },
                    component: () => import( /* webpackChunkName: "tbinformationAdd" */ '../views/content/tbinformation-add.vue')
                },
                {
                    path: 'tbinformation-edit',
                    name: 'tbinformation-edit',
                    meta: { title: '编辑资讯' },
                    component: () => import( /* webpackChunkName: "tbinformationEdit" */ '../views/content/tbinformation-edit.vue')
                },
                {
                    path: 'editDesigner',
                    name: 'editDesigner',
                    meta: { title: '设计师基本信息' },
                    component: () => import( /* webpackChunkName: "editDesigner" */ '../views/content/editDesigner')
                }
            ]
        }, {
            path: 'promanage',
            name: 'proManage',
            meta: { title: '案例管理' },
            component: comIdx,
            children: [
                {
                    path: 'villageList',
                    name: 'villageList',
                    meta: { title: '小区列表' },
                    component: () => import('../views/content/villageList')
                }, {
                    path: 'villageEdit',
                    name: 'villageEdit',
                    meta: { title: '编辑小区' },
                    component: () => import('../views/content/villageEdit')
                }, {
                    path: 'villageBatch',
                    name: 'villageBatch',
                    meta: { title: '批量填写地址' },
                    component: () => import('../views/content/villageBatch')
                }, {
                    path: 'styleList',
                    name: 'styleList',
                    meta: { title: '风格列表' },
                    component: () => import('../views/content/styleList')
                }, {
                    path: 'styleAddAlter',
                    name: 'styleAddAlter',
                    meta: { title: '编辑风格' },
                    component: () => import('../views/content/styleAddAlter')
                }, {
                    path: 'prolist',
                    name: 'proList',
                    meta: { title: '案例列表' },
                    component: () => import( /* webpackChunkName: "proList" */ '../views/content/proList')
                }, {
                    path: 'offerDemand',
                    name: 'offerDemand',
                    meta: { title: '报价需求' },
                    component: () => import( /* webpackChunkName: "proList" */ '../views/content/offerDemand')
                }, {
                    path: 'addproject',
                    name: 'addProject',
                    meta: { title: '编辑案例' },
                    component: () => import( /* webpackChunkName: "addproject" */ '../views/content/addproject')
                }, {
                    path: 'importalterquota',
                    name: 'importalterquota',
                    meta: { title: '导入报价' },
                    component: () => import( /* webpackChunkName: "importalterquota" */ '../views/content/importalterquota')
                }
            ]
        }
    ]
}