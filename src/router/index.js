import Vue from 'vue'
import VueRouter from 'vue-router'
import * as  cookies from '@/util/cookies'
import Layout from '@/layout'

Vue.use(VueRouter)

//定义路由表
const routes = [
  //登录页路由
  {
    path: '/login',
    name: 'Login',
    component: () => import( '@/views/Login.vue')
  },
  //使用Layout母版页路由
  {
    
    path: '/',
    component: Layout,
    children: [
      //根目录路由/，重定向到/home
      {
        path: '',
        redirect:'/home'
      },
      //首页路由
      {
        path: 'home',
        name: 'Home',
        component:  () => import('@/views/Home.vue'),
        meta: {
          requiresAuth:true
        }
      },
      //Bug列表页
      {
        path: 'bugs',
        name: 'Bugs',
        component:  () => import('@/views/Bugs.vue'),
        meta: {
          requiresAuth:true
        }
      },
      //人员信息
      {
        path: 'users',
        name: 'Users',
        component:  () => import('@/views/Users.vue'),
        meta: {
          requiresAuth:true
        }
      },
      //版本信息
      {
        path: 'versions',
        name: 'Versions',
        component: () => import( '../views/Versions.vue'),
        meta: {
          requiresAuth:true
        }
      }
    ]
  }
]

//定义路由对象
const router = new VueRouter({
  routes
})

//添加导航守卫->全局前置守卫
router.beforeEach((to, from, next) => {
  //根据meta.requiresAuth判断将要导航的页面是否需要进行鉴权；
  //如果需要，则获取是否已授权，如果没有授权，跳转到login；如果已授权，则继续导航
  if (to.matched.some(record => record.meta.requiresAuth)) {
      let currentUser = cookies.getCurrentUser() //从cookies获取当前登录用户
      if (!currentUser) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    } else {
      next() // 确保一定要调用 next()
    }
})

//导出路由
export default router
