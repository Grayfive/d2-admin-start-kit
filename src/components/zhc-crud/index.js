/*
ui 封装插件
 */
import List from './List'
// import Model from './Model'
import Query from './Query'
import Query2 from './Query2'
function install (Vue) {
  Vue.component('list', List)
  // Vue.component('modelForm', Model)
  Vue.component('query', Query)
  Vue.component('query2', Query2)
  console.log('安装ui插件成功 by aassaadd@qq.com')
}
export default install
