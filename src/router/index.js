import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'
import util from '@/libs/util.js'

// 路由数据
import routes, { frameInRoutes } from './routes'
import { menuAside } from '@/menu'
// import { frameInRoutes } from './routes'
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
  // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
  await store.dispatch('d2admin/page/isLoaded')
  // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
  await store.dispatch('d2admin/size/isLoaded')
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  // if (to.matched.some(r => r.meta.auth)) {
  //   // 这里暂时将cookie里是否存有token作为验证是否登录的条件
  //   // 请根据自身业务需要修改
  //   const token = util.cookies.get('token')
  //   if (token && token !== 'undefined') {
  //     next(to.path)
  //   } else {
  //     // 没有登录的时候跳转到登录界面
  //     // 携带上登陆成功之后需要跳转的页面完整路径
  //     next({
  //       name: 'login',
  //       query: {
  //         redirect: to.fullPath
  //       }
  //     })
  //     // https://github.com/d2-projects/d2-admin/issues/138
  //     NProgress.done()
  //   }
  // } else {
  //   // 不需要身份校验 直接通过
  //   next()
  // }
  if (to.path === '/login' || to.path === '/index') {
    next()
  } else {
    if (initUserRouter()) {
      // console.log(router)
      next()
    } else {
      if (to.matched.length === 0) { // 如果未匹配到路由
        next({
          name: 'login',
          query: {
            redirect: to.fullPath
          }
        })
        NProgress.done()
      } else {
        next() // 如果匹配到正确跳转
      }
    }
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router
export const initUserRouter = async function () {
  // console.log(store)
  if (!store.state.zhc.app.hasBuild) {
    const info = await store.dispatch('d2admin/db/get', {
      dbName: 'sys',
      path: 'user.info',
      defaultValue: {
        resources: []
      },
      user: true
    }, { root: true })
    const resources = info.resources
    const newRoutes = []
    resources.forEach((resource) => {
      if (resource.type == null || resource.type === undefined || resource.type === 1) {
        const r = {}
        r.path = resource.path
        r.name = resource.name
        r.title = resource.title
        r.meta = {
          auth: true,
          title: resource.title,
          cache: resource.cache
        }
        r.component = _import(resource.component)
        newRoutes.push(r)
      }
    })

    if (newRoutes.length > 0) {
      frameInRoutes[0].children.push(...newRoutes)
      console.log(frameInRoutes)
      store.commit('d2admin/page/init', frameInRoutes)
      router.addRoutes(frameInRoutes)
      const leftmenu = initLeftMenu(resources)
      console.log('leftmenu')
      console.log(leftmenu)
      store.commit('d2admin/menu/asideSet', [
        ...menuAside,
        ...leftmenu
      ])
      store.commit('d2admin/search/init', [
        ...menuAside,
        ...leftmenu
      ])
      store.dispatch('zhc/app/build')
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
function initLeftMenu (resources) {
  const leftMenu = []
  resources.forEach((resource) => {
    if (resource.menuGroupName && (resource.type == null || resource.type === undefined || resource.type === 1)) {
      let t = true
      for (let i = 0; i < leftMenu.length; i++) {
        if (resource.menuGroupName === leftMenu[i].title) {
          leftMenu[i].children.push(resource)
          t = false
          break
        }
      }
      if (leftMenu.length <= 0 || t) {
        const g = {
          title: resource.menuGroupName,
          icon: resource.menuGroupIcon,
          path: resource.path,
          children: [
            resource
          ]
        }
        leftMenu.push(g)
      }
    }
  })
  return leftMenu
}
