<template>
  <d2-container>
    <query :config="queryConfig"
           ref="query" />
    <list :config="listConfig"
          ref="list" />
  </d2-container>
</template>

<script>
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
export default {
  name: 'page1',
  data () {
    return {
      queryConfig: {
        title: '搜索',
        globalOperation: [
          {
            labelName: '搜索', // 操作名称
            doFunc: () => {
              this.$refs.list.setQueryParamsOnRefresh(this.$refs.query.getUrlParams())
            } // 操作方法
          },
          {
            labelName: '新增', // 操作名称
            type: 'primary',
            doFunc: () => {
              this.$router.push({ name: 'MaterialCategoryManagementAdd' })
            } // 操作方法
          }
        ],
        query: [
          {
            name: '编号',
            valName: 'no',
            type: 'text',
            value: '',
            opt: 'LIKE'
          },
          {
            name: '名称',
            valName: 'name',
            type: 'text',
            value: '',
            opt: 'LIKE'
          }
        ]
      },
      listConfig: {
        title: '',
        pageSourceFunc: this.$api.apis.resources.list,
        pageSourceFuncArgs: {
          path: {
            model: 'materialCategory'
          }
        },
        page: 0,
        pageSize: 10,
        multiSelect: false, // 是否显示多选按钮默认否,
        multiSelectValue: [],
        operation: [
          {
            labelName: '详情', // 操作名称
            doFunc: (val) => {
              this.$router.push({ name: 'MaterialCategoryManagementEdit', params: { id: val._id } })
            } // 操作方法
          }
        ],
        column: [
          {
            labelName: '名称',
            valName: 'name'
          },
          {
            labelName: '编号',
            valName: 'no'
          },
          {
            labelName: '价格',
            valName: 'price'
          },
          {
            labelName: '价格单位',
            valName: 'priceUnit'
          },
          {
            labelName: '单位',
            valName: 'unit'
          },
          {
            labelName: '规格属性',
            valName: 'attributes'
          },
          {
            labelName: '描述',
            valName: 'description'
          },
          {
            labelName: '修改时间',
            valName: 'modifyTime',
            filter: function (val) {
              if (val !== '' && val !== null && val !== undefined) {
                return dayjs(val).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
              }
            }
          },
          {
            labelName: '创建时间',
            valName: 'insertTime',
            filter: function (val) {
              if (val !== '' && val !== null && val !== undefined) {
                return dayjs(val).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
              }
            }
          }
        ]
      }
    }
  },
  methods: {
  },
  mounted () {
    this.$nextTick(function () {
      // DOM 现在更新了
      this.$refs.list.setQueryParamsOnRefresh(this.$refs.query.getUrlParamsPage())
    })
  }
}
</script>
