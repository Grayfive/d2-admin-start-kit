import * as types from '@/plugin/api/httpTypes'
const apis = [
  {
    serviceName: 'resources',
    methods: [
      {
        name: 'findOne',
        url: '/resources/{model}/method/findOne',
        type: types.GET,
        testReturn: {}
      },
      {
        name: 'find',
        url: '/resources/{model}',
        type: types.GET,
        testReturn: {}
      },
      {
        name: 'list',
        url: '/resources/{model}/method/list',
        type: types.GET,
        testReturn: {}
      },
      {
        name: 'listCount',
        url: '/resources/{model}/method/listCount',
        type: types.GET,
        testReturn: {}
      },
      {
        name: 'count',
        url: '/resources/{model}/method/count',
        type: types.GET,
        testReturn: {}
      },
      {
        name: 'aggregate',
        url: '/resources/{model}/method/aggregate',
        type: types.POST,
        testReturn: {}
      },
      {
        name: 'findById',
        url: '/resources/{model}/{id}',
        type: types.GET,
        testReturn: {}
      },
      {
        name: 'add',
        url: '/resources/{model}',
        type: types.POST,
        testReturn: {}
      },
      {
        name: 'updateMany',
        url: '/resources/{model}/method/updateMany',
        type: types.POST,
        testReturn: {}
      },
      {
        name: 'update',
        url: '/resources/{model}/{id}',
        type: types.POST,
        testReturn: {}
      },
      {
        name: 'del',
        url: '/resources/{model}/{id}/del',
        type: types.POST,
        testReturn: {}
      }

    ]
  }
]
export default apis
