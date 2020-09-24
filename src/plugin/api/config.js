/*
api 设置
会自动生成 api.service.getxxx({path,params,body,headers})方法
 */
import * as types from './httpTypes'
import axios from 'axios'
const config = {
  http: axios,
  base: 'http://120.0.0.1:9000',
  isTest: false,
  apis: [{
    serviceName: 'userService',
    methods: [
      {
        name: 'getUser',
        url: '/socket/api/userDevice',
        type: types.GET,
        neetToken: true,
        testReturn: {}
      },
      {
        name: 'getUserOne',
        url: '/socket/api/userDevice/{id}',
        type: types.GET,
        neetToken: true,
        testReturn: {}
      }
    ]
  }]
}
export default config
