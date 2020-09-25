import * as types from '@/plugin/api/httpTypes'
const apis = [
  {
    serviceName: 'auth',
    methods: [
      {
        name: 'login',
        url: '/auth/login',
        type: types.POST,
        testReturn: {
          id: '5f5748e993e9e848c86f487e',
          type: 1,
          username: 'admin',
          name: 'aaa',
          token: '7d3fe27cfee411ea95fb80e65026965a',
          resources: [
            {
              groupName: '页面',
              groupId: 'page',
              menuGroupName: '页面',
              menuGroupIcon: 'el-icon-s-home',
              icon: 'el-icon-s-home',
              title: 'page1',
              path: '/page1',
              name: 'page1',
              component: 'demo/page1',
              cache: false,
              type: 1
            },
            {
              groupName: '页面',
              groupId: 'page',
              title: '添加',
              name: 'add',
              type: 2
            }
          ]
        }
      },
      {
        name: 'out',
        url: '/auth/out',
        type: types.POST,
        testReturn: {}
      }

    ]
  }
]
export default apis
