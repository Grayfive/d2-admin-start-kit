import * as types from '@/plugin/api/httpTypes'
const apis = [
  {
    serviceName: 'auth',
    methods: [
      {
        name: 'login',
        url: '/auth/login',
        type: types.POST,
        testReturn: {}
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
