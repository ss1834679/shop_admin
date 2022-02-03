import comIdx from '../views/comIndex'

export default {
    path: '/trim',
    name: 'trim'/* 装修 */,
    component: comIdx,
    meta: { title: '装修' },
    children: [
        {
            path: 'trimrole',
            name: 'trimrole',
            meta: { title: '装修角色管理' },
            component: () => import( /* webpackChunkName: "trimrole" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'trimmanage',
                    name: 'trimmanage',
                    meta: { title: '装修管家' },
                    component: () => import( /* webpackChunkName: "trimmanage" */ '../views/trim/role/trimmanage.vue')
                },
                {
                    path: 'trimPromanage',
                    name: 'trimPromanage',
                    meta: { title: '项目经理' },
                    component: () => import( /* webpackChunkName: "trimPromanage" */ '../views/trim/role/trimPromanage.vue')
                },
                {
                    path: 'editTrimmanage',
                    name: 'editTrimmanage',
                    meta: { title: '编辑装修管家' },
                    component: () => import( /* webpackChunkName: "editTrimmanage" */ '../views/trim/role/editTrimmanage.vue')
                },
                {
                    path: 'editPromanage',
                    name: 'editPromanage',
                    meta: { title: '编辑项目经理' },
                    component: () => import( /* webpackChunkName: "editPromanage" */ '../views/trim/role/editPromanage.vue')
                },
                {
                    path: 'trimSerproviderRole',
                    name: 'trimSerproviderRole',
                    meta: { title: '服务商角色' },
                    component: () => import( /* webpackChunkName: "trimSerproviderRole" */ '../views/trim/role/trimSerproviderRole')
                },
                {
                    path: 'editSerproviderRole',
                    name: 'editSerproviderRole',
                    meta: { title: '编辑服务商角色' },
                    component: () => import( /* webpackChunkName: "editSerproviderRole" */ '../views/trim/role/editSerproviderRole.vue')
                },
                {
                    path: 'trimSerprovider',
                    name: 'trimSerprovider',
                    meta: { title: '服务商' },
                    component: () => import( /* webpackChunkName: "trimSerprovider" */ '../views/trim/role/trimSerprovider')
                },
                {
                    path: 'editSerprovider',
                    name: 'editSerprovider',
                    meta: { title: '编辑服务商' },
                    component: () => import( /* webpackChunkName: "editSerprovider" */ '../views/trim/role/editSerprovider.vue')
                },
                {
                    path: 'proprietor',
                    name: 'proprietor',
                    meta: { title: '业主' },
                    component: () => import( /* webpackChunkName: "proprietor" */ '../views/trim/role/proprietor')
                },
                {
                    path: 'editproprietor',
                    name: 'editproprietor',
                    meta: { title: '编辑业主' },
                    component: () => import( /* webpackChunkName: "editproprietor" */ '../views/trim/role/editproprietor.vue')
                }
            ]
        },
        {
            path: 'trimprocess',
            name: 'trimprocess',
            meta: { title: '装修流程管理' },
            component: () => import( /* webpackChunkName: "trimprocess" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'trimprocesslist',
                    name: 'trimprocesslist',
                    meta: { title: '装修流程配置' },
                    component: () => import( /* webpackChunkName: "trimprocesslist" */ '../views/trim/process/trimprocesslist.vue')
                },
                {
                    path: 'edittrimprocess',
                    name: 'editTrimProcess',
                    meta: { title: '编辑装修流程' },
                    component: () => import( /* webpackChunkName: "editTrimProcess" */ '../views/trim/process/editTrimProcess.vue')
                },
                {
                    path: 'bignodelist',
                    name: 'bigNodeList',
                    meta: { title: '大节点列表' },
                    component: () => import( /* webpackChunkName: "bigNodeList" */ '../views/trim/process/bigNodeList.vue')
                },
                {
                    path: 'smallnodelist',
                    name: 'smallNodeList',
                    meta: { title: '小节点列表' },
                    component: () => import( /* webpackChunkName: "smallNodeList" */ '../views/trim/process/smallNodeList.vue')
                },
                {
                    path: 'editnode',
                    name: 'editNode',
                    meta: { title: '编辑节点' },
                    component: () => import( /* webpackChunkName: "editNode" */ '../views/trim/process/editNode.vue')
                }
            ]
        },
        {
            path: 'trimorder',
            name: 'trimorder',
            meta: { title: '装修流程管理' },
            component: () => import( /* webpackChunkName: "trimorder" */ '../views/comIndex.vue'),
            children: [
                {
                    path: 'list',
                    name: 'trimOrderList',
                    meta: { title: '装修订单' },
                    component: () => import( /* webpackChunkName: "trimOrderList" */ '../views/trim/trimorder/trimOrderList')
                },
                {
                    path: 'edit',
                    name: 'editTrimOrder',
                    meta: { title: '创建/编辑装修订单' },
                    component: () => import( /* webpackChunkName: "editTrimOrder" */ '../views/trim/trimorder/editTrimOrder')
                },
                {
                    path: 'trimOrderDetail',
                    name: 'trimOrderDetail',
                    meta: { title: '装修订单详情' },
                    component: () => import( /* webpackChunkName: "trimOrderDetail" */ '../views/trim/trimorder/trimOrderDetail')
                },
                {
                    path: 'trimMaterialList',
                    name: 'trimMaterialList',
                    meta: { title: '装修资料' },
                    component: () => import( /* webpackChunkName: "trimMaterialList" */ '../views/trim/trimorder/trimMaterialList')
                },
                {
                    path: 'trimMaterialDetails',
                    name: 'trimMaterialDetails',
                    meta: { title: '装修资料详情' },
                    component: () => import( /* webpackChunkName: "trimMaterialDetails" */ '../views/trim/trimorder/trimMaterialDetails')
                },
                {
                    path: 'profitList',
                    name: 'profitList',
                    meta: { title: '分账记录' },
                    component: () => import( /* webpackChunkName: "profitList" */ '../views/trim/trimorder/profitList.vue')
                },
                {
                    path: 'applyProfit',
                    name: 'applyProfit',
                    meta: { title: '分账申请' },
                    component: () => import( /* webpackChunkName: "applyProfit" */ '../views/trim/trimorder/applyProfit.vue')
                },
                {
                    path: 'applyProfitCheck',
                    name: 'applyProfitCheck',
                    meta: { title: '分账审核' },
                    component: () => import( /* webpackChunkName: "applyProfitCheck" */ '../views/trim/trimorder/applyProfitCheck.vue')
                },
                {
                    path: 'trimAppend',
                    name: 'trimAppendList',
                    meta: { title: '装修增项' },
                    component: () => import( /* webpackChunkName: "trimAppend" */ '../views/trim/trimorder/trimAppend.vue')
                },
                {
                    path: 'appendMaterialList',
                    name: 'appendMaterialList',
                    meta: { title: '增项资料' },
                    component: () => import( /* webpackChunkName: "appendMaterialList" */ '../views/trim/trimorder/appendMaterialList')
                },
                {
                    path: 'appendMaterialDetails',
                    name: 'appendMaterialDetails',
                    meta: { title: '增项资料详情' },
                    component: () => import( /* webpackChunkName: "appendMaterialDetails" */ '../views/trim/trimorder/appendMaterialDetails')
                },
                {
                    path: 'trimProfitList',
                    name: 'trimProfitList',
                    meta: { title: '装修订单利润' },
                    component: () => import( /* webpackChunkName: "trimProfitList" */ '../views/trim/trimorder/trimProfitList')
                }
            ]
        }
    ]
}