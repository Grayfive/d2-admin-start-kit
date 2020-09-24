/*
会自动生成 api.service.getxxx({path,params,body,headers})方法
 */
import config from './config'
import * as httpTypes from './httpTypes'
function install (Vue, globalOptions) {
  if (globalOptions) {
    Object.assign(config, globalOptions)
  }
  // Object.keys(globalOptions).map(function (key) {
  //     config[key] = globalOptions[key]
  // })
  const $api = {
    httpTypes: httpTypes
  }
  /**
   * 这里添加等待效果
   */
  //
  // Vue.component('loading', loadingTem)
  //
  const _isTest = config.isTest
  const _http = config.http
  const _baseUrl = config.base
  const _apis = config.apis
  $api.baseUrl = _baseUrl
  const _api = {}
  _apis.forEach((s) => {
    const serviceName = s.serviceName
    const methods = s.methods
    const se = {}
    methods.forEach((m) => {
      // {path, params, body}
      se[m.name] = function (parameter) {
        if (!parameter) {
          parameter = {}
        }
        const promise = new Promise(function (resolve, reject) {
          let _h = {}
          let url = m.url
          const path = parameter.path
          const params = parameter.params
          const body = parameter.body
          if (path) {
            for (const p in path) {
              const r = new RegExp('{' + p + '}', 'g')
              url = url.replace(r, path[p])
            }
          }
          if (_isTest) {
            console.debug(m.testReturn)
            resolve(m.testReturn)
          } else {
            if (m.type === httpTypes.GET) {
              _h = _http.get(_baseUrl + url, {
                params: params
              })
            }
            if (m.type === httpTypes.POST) {
              _h = _http.post(_baseUrl + url, body, {
                params: params
              })
            }
            if (m.type === httpTypes.PUT) {
              _h = _http.put(_baseUrl + url, body, {
                params: params
              })
            }
            if (m.type === httpTypes.PATCH) {
              _h = _http.patch(_baseUrl + url, body, {
                params: params
              })
            }
            if (m.type === httpTypes.DELETE) {
              _h = _http.delete(_baseUrl + url, {
                params: params
              })
            }
            _h.then((response) => {
              // 响应成功回调
              // console.debug(response)
              resolve(response.data)
            },
            (response) => {
              // 响应错误回调
              // console.debug(response)
              reject(response)
            })
          }
        })
        return promise
      }
      // se[m['name'] + 'Url'] = _baseUrl + m.url
      se[m.name + 'Url'] = function (parameter) {
        if (!parameter) {
          parameter = {}
        }
        let url = m.url
        const path = parameter.path
        const params = parameter.params
        if (path) {
          for (const p in path) {
            const r = new RegExp('{' + p + '}', 'g')
            url = url.replace(r, path[p])
          }
        }
        url = _baseUrl + url
        if (params) {
          const ps = []
          for (const k in parameter.params) {
            ps.push(k + '=' + encodeURI(parameter.params[k]))
          }
          if (ps.length > 0) {
            url = url + '?' + ps.join('&')
          }
        }
        return url
      }
    })
    _api[serviceName] = se
    $api.apis = _api
  })
  //
  Vue.prototype.$api = $api
  console.log('安装api插件成功')
}
export default install
