import * as types from '@/plugin/api/httpTypes'
const apis = [
  {
    serviceName: 'map',
    methods: [
      {
        name: 'ipLocation',
        url: '/map/ipLocation',
        type: types.GET,
        testReturn: {}
      },
      {
        name: 'search',
        url: '/map/search',
        type: types.POST,
        testReturn: {}
      }
    ]
  }
]
export default apis
