import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'

import home from './home'/* 首页 */
import systemList from './systemList'
import goods from './goods'/* 商品 */
import promotion from './promotion'/* 促销 */
import order from './order'/* 订单 */
import setings from './setings'/* 设置 */
import user from './user'/* 用户 */
import operate from './operate'/* 运营 */
import permission from './permission'/* 权限 */
import supplier from './supplier'/* 供应商 */
import content from "./content"/* 内容 */
import CityOperation from "./CityOperation"/* 区域运营 */
import design from "./design"/* 设计模块 */
import house from "./house"/* 全屋 */
import statistics from "./statistics" /* 统计 */
import Finance from "./finance"/* 财务 */
import magicHome from "./magicHome"/* 家魔方 */
import trim from "./trim"/* 装修 */

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'index',
  component: () => import( /* webpackChunkName: "Index" */ '../views/Index.vue'),
  meta: { title: '首页' },
  children: [
    home,
    systemList,
    goods,
    promotion,
    order,
    user,
    operate,
    permission,
    content,
    supplier,
    setings,
    CityOperation,
    house,
    design,
    Finance,
    statistics,
    magicHome,
    trim
  ]
},
{
  path: '/login',
  name: 'login',
  component: Login
},
{
  path: '/description',
  name: 'description',
  component: () => import(/* webpackChunkName: "description" */ '../views/description.vue')
},
{
  path: '/getdescription',
  name: 'getdescription',
  component: () => import(/* webpackChunkName: "description" */ '../views/DescriptionDoc.vue')
}
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router