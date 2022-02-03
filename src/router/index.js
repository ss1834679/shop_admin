import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'

import goods from './goods'/* 商品 */
import operate from './operate'/* 促销 */
import order from './order'/* 订单 */
import user from './user'/* 用户 */
import permission from './permission'/* 权限 */

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'index',
  component: () => import( /* webpackChunkName: "Index" */ '../views/Index.vue'),
  meta: { title: '首页' },
  children: [
    goods,
    operate,
    order,
    user,
    permission,
  ]
},
{
  path: '/login',
  name: 'login',
  component: Login
}
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router