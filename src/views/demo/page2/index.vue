<template>
  <d2-container>
    <template slot="header">Page 2 header</template>
    <modelForm :config="config"
               ref='model' />
  </d2-container>
</template>

<script>
export default {
  name: 'page2',
  data () {
    return {
      config: {
        ope: 'add',
        models: [
          {
            labelName: '名称',
            valName: 'name',
            about: '名称',
            type: 'text',
            value: '',
            required: '必填'
          },
          {
            labelName: '编号',
            valName: 'no',
            about: '编号',
            type: 'text',
            value: '',
            required: '必填'
          },
          {
            labelName: '价格',
            valName: 'price',
            about: 'price',
            type: 'text',
            value: ''

          },
          {
            labelName: '价格单位',
            valName: 'priceUnit',
            about: '价格单位',
            type: 'text',
            value: ''
          },
          {
            labelName: '单位',
            valName: 'unit',
            about: '单位',
            type: 'text',
            value: ''
          },
          {
            labelName: '规格属性',
            valName: 'attributes',
            about: '规格属性',
            type: 'text',
            value: ''
          },
          {
            labelName: '描述',
            valName: 'description',
            about: '描述',
            type: 'text',
            value: ''
          }

        ],
        operation: [
          {
            // name: 'sa',
            labelName: '保存', // 操作名称
            hasValidator: true, // 是否需要验证
            type: 'primary',
            doFunc: async (val) => {
              await this.$api.apis.resources.add({
                path: {
                  model: 'materialCategory'
                },
                body: {
                  name: val.name,
                  no: val.no,
                  price: Number(val.price),
                  priceUnit: val.priceUnit,
                  unit: val.unit,
                  attributes: val.attributes,
                  description: val.description
                }
              })
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs.model.closeCurrentPage()
            } // 操作方法
          },
          {
            // name: 'add',
            labelName: '返回', // 操作名称
            hasValidator: false, // 是否需要验证
            doFunc: () => {
              // this.$emit('closeSelectedTag', this.$route)
              // this.$refs.layout.closeSelectedTag(this.$route)
              // this.$router.back()
              this.$refs.model.closeCurrentPage()
            } // 操作方法
          }
        ]
      }
    }
  },
  created: function () {
  },
  mounted () {
    this.$nextTick(function () {
    })
  },
  components: {
  },
  methods: {
  }
}
</script>
