/*
* 通用配置
* */
function copy (val) {
  const json = JSON.stringify(val)
  return JSON.parse(json)
}
export const queryConfigBase = {
  title: '',
  globalOperation: [
    {
      icon: 'el-icon-search', // 按钮图标
      labelName: '', // 操作名称
      doFunc: function (val) {
        console.debug(val)
      } // 操作方法
    }
  ],
  query: [
    {
      name: '标题',
      valName: 'name',
      type: 'text', // text/select/date/number/select_filterable
      selValue: [
        {
          value: '',
          text: ''
        }
      ],
      asyncValue: function (val) {
        console.debug(val)
      },
      value: '',
      opt: 'LIKE' // EQ/LIKE/IN/LE/GE/NE/LT/GT/LE/GE/LIKE/ISNULL/NOTNULL/IN/BETWEEN
    }
  ]
}
export const listConfigBase = {
  title: '',
  expand: { // 扩展
    has: false, // 是否有扩展，默认没有false
    asyncValue: function (val) {
      console.debug(val)
    }, // 会对 row数据中增加 endExpandAsyncValue：true ,表示已经异步加载过
    models: [
      {
        labelName: 'test',
        valName: 'test',
        filter: function (val) {
          // 单个 字段进行过滤
          console.debug(val)
          return val
        },
        filterRow: function (val) {
          // 整行数据进行过滤显示
          console.debug(val)
          return val
        }

      }
    ]
  },
  hasOperation: true, // 是否有操作
  hasPagination: true, // 是否有分页
  pageSourceUrl: '',
  pageSourceFunc: Function,
  pageSourceFuncArgs: {
    path: null
  },
  sort: '', // String KEY_ASC = "-";String KEY_DESC = "+"; -sort
  sortFunc: Function, // 配合sort-change 排序变更方法
  // defaultSort:{prop: 'date', order: 'descending'}, 配合element 的默认排序
  page: 0,
  pageSize: 10,
  multiSelect: false, // 是否显示多选按钮默认否,
  multiSelectValue: [],
  operation: [
    {
      labelName: '修改', // 操作名称
      showFunc: function (val) {
        console.debug(val)
        return true
      },
      doFunc: function (val) {
        console.debug(val)
      } // 操作方法
    }
  ],
  column: [
    {
      labelName: '',
      valName: '',
      type: 'label', // label/custom(自定义）
      component: {}, // 只有custom（自定义才有用）
      fixed: false,
      filter: function (val) {
        console.debug(val)
        return val
      },
      asyncValue: function (val) {
        console.debug(val)
      },
      sortable: false // 是否支持排序
    }
  ]
}
export const pageSourceConfigBase = {
  totalElements: 0, // 所有数据的条目
  totalPages: 0, // 设置分页的总页数,
  size: 10, // 每一页的条目数,
  number: 0, // 当前页号,
  content: [
  ], // 分页数据内容,
  sort: {}, // 排序,
  last: true, // 末页,
  numberOfElements: 0, // 当前页的数据条目数
  first: true // 首页
}
export const modelConfigBase = {
  title: '',
  sourceUrl: '',
  sourceFunc: Function,
  sourceFuncArgs: {
    path: null,
    params: null,
    body: null
  },
  ope: 'add', // view显示/edit修改/add添加
  models: [
    {
      labelName: 'test',
      valName: 'test',
      about: 'test',
      type: 'text', // text/select/date/label/textarea/number/email/password/phone/editor/amount/select_filterable/transfer/custom(自定义）
      value: '', // 值，在transfer类型下此值必须是 value: []
      selValue: [],
      component: {}, // 只有custom（自定义才有用）
      titles: ['', ''], // 目前只针对transfer有用,
      required: '如果有必填，填消息',
      ClassObject: {},
      validator: function (rule, value, callback) {
        console.debug(rule, value, callback)
      },
      asyncValue: function (val) {
        console.debug(val)
      },
      asyncData: function (val, Data) {
        console.debug(val, Data)
      },
      filter: function (val) {
        console.debug(val)
        return val
      }
    }
  ],
  hasOperation: true,
  operation: [
    {
      labelName: '', // 操作名称
      hasValidator: true, // 是否需要验证
      showFunc: function (val) {
        console.debug(val)
        return true
      },
      doFunc: function (val, config) {
        console.debug(val)
        console.debug(config)
      } // 操作方法
    }
  ],
  afterDoSelect: function (conf, val) {
    // 查询之后执行
    console.debug(val)
  }
}
export const queryConfig = function (conf) {
  const _config = copy(queryConfigBase)
  if (conf) {
    for (const k in conf) {
      _config[k] = conf[k]
    }
  }
  return _config
}
export const listConfig = function (conf) {
  const _config = copy(listConfigBase)
  if (conf) {
    for (const k in conf) {
      _config[k] = conf[k]
    }
  }
  return _config
}
export const pageSourceConfig = function (conf) {
  const _config = copy(pageSourceConfigBase)
  if (conf) {
    for (const k in conf) {
      _config[k] = conf[k]
    }
  }
  return _config
}
export const modelConfig = function (conf) {
  const _config = copy(modelConfigBase)
  if (conf) {
    for (const k in conf) {
      _config[k] = conf[k]
    }
  }
  return _config
}
