import * as types from '@/plugin/api/httpTypes'
const apis = [
  {
    serviceName: 'business',
    methods: [
      {
        name: 'createEnterprise',
        url: '/business/createEnterprise',
        type: types.POST,
        testReturn: {}
      },
      {
        name: 'createUser',
        url: '/business/createUser',
        type: types.POST,
        testReturn: {}
      },
      {
        name: 'editUser',
        url: '/business/editUser',
        type: types.POST,
        testReturn: {}
      },
      {
        name: 'createWork',
        url: '/business/createWork',
        type: types.POST,
        testReturn: {}
      },
      {
        name: 'createProductT01',
        url: '/business/createProductT01',
        type: types.GET,
        testReturn: {}
      }

    ]
  }
]
export default apis
