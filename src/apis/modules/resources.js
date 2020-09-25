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
        testReturn: {
          lastId: '000000000000000000000000',
          firstId: '5f5d9b937a909e8bc35939c4',
          content: [
            {
              _id: '5f5d9b937a909e8bc35939c4',
              insertTime: 1599970195990,
              modifyTime: 1599970195990,
              operator: {

              },
              founder: {

              },
              deleteFlag: false,
              name: '21',
              no: '21',
              price: 2,
              priceUnit: '',
              unit: '',
              attributes: '',
              description: ''
            },
            {
              _id: '5f5ceb03b9a77ef19021533a',
              insertTime: 1599924995774,
              modifyTime: 1599966608109,
              operator: {

              },
              founder: {

              },
              deleteFlag: false,
              name: '112122121',
              no: '1',
              price: 1.1,
              priceUnit: '2',
              unit: '1',
              attributes: '1',
              description: ''
            },
            {
              _id: '000000000000000000000000',
              insertTime: 0,
              modifyTime: 0,
              operator: {

              },
              founder: {

              },
              deleteFlag: false,
              name: '',
              no: '',
              price: 0,
              priceUnit: '',
              unit: '',
              attributes: '',
              description: ''
            }
          ],
          size: 10,
          numberOfElements: 3,
          hasNext: false,
          totalPages: 1,
          totalElements: 3
        }

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
