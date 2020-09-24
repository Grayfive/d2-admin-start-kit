/*
ui 封装插件
 */
import List from './List'
// import Model from './Model'
// import Query from './Query'
function install (Vue) {
  Vue.component('list', List)
  // Vue.component('modelForm', Model)
  // Vue.component('query', Query)
  console.log('安装ui插件成功 by aassaadd@qq.com')
}
export default install
