import axios from 'axios'
import { Loading, Notification } from 'element-ui'
import store from '@/store'
import util from '@/libs/util.js'
function install (Vue, globalOptions) {
// 全局 loading 服务
  let loading
  // 添加请求拦截器
  axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  // 在这里控制请求头
  // config.headers['token'] = '843260562ebf4c6fa6cd4e9aaca10633'
    if (!util.other.isNull(util.cookies.get('token')) && util.other.isNull(config.headers.Authorization)) {
      console.info(util.cookies.get('token'))
      config.headers.Authorization = `Bearer ${util.cookies.get('token')}`
    }
    // console.debug(config)
    if (store.state['d2admin/ajaxloading/havLoading']) {
      loading = Loading.service({
        lock: true,
        background: 'rgb(0,0,0,0.7)'
      })
    }
    store.dispatch('d2admin/ajaxloading/setHavLoading', true)
    return config
  }, (error) => {
  // 对请求错误做些什么
    console.debug(error)
    return Promise.reject(error)
  })
  // 添加响应拦截器
  axios.interceptors.response.use((response) => {
  // 对响应数据做点什么
    console.debug(response)
    loading && loading.close()
    return response
  }, (error) => {
  // 对响应错误做点什么
  // 在这里处理返回参数
    loading && loading.close()
    let response = error.response
    if (!response) {
      response = {
        status: 401,
        data: {
          error: 'BusinessException',
          message: '服务器无响应'
        }
      }
    }
    console.debug(response)
    const _status = parseInt(response.status / 10)
    if (_status === 40 || _status === 50) {
      if (response.data.error === 'BusinessException') {
        Notification.error({
        // title: response.status,
          title: '错误提示',
          message: response.data.message
        })
      } else {
        Notification.error({
        // title: response.status,
          title: '错误提示',
          message: '系统错误稍后再试'
        })
      }
      if (response.status === 403 || response.status === 401) {
        store.dispatch('d2admin/account/logout')
      }
    }
    return Promise.reject(error)
  })
  console.log('安装loading插件成功,by aassaadd@qq.com')
}
export default install
