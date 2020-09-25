<template>
  <div class="mainsrp-sortbar">
    <div class="m-multi-query">
      <span v-for="(item,index) in conf.query"
            :key="'query'+index">
        <el-input v-if="item.type === 'text'"
                  type="text"
                  v-model.trim="item.value"
                  :placeholder="item.name"
                  clearable></el-input>
        <el-date-picker v-else-if="item.type === 'date'"
                        format="yyyy/MM/dd"
                        type="date"
                        v-model="item.value"
                        :placeholder="item.name"></el-date-picker>
        <el-date-picker v-else-if="item.type === 'datetimerange'"
                        format="yyyy/MM/dd HH:mm:ss"
                        type="datetimerange"
                        value-format="timestamp"
                        v-model="item.value"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-select v-else-if="item.type === 'select'"
                   v-model="item.value"
                   :placeholder="item.name">
          <template v-for="o in item.selValue">
            <el-option v-bind:key="o.text"
                       :label="o.text"
                       :value="o.value"></el-option>
          </template>
        </el-select>
        <el-select v-else-if="item.type === 'select_filterable'"
                   v-model="item.value"
                   filterable
                   :placeholder="item.name">
          <template v-for="o in item.selValue">
            <el-option v-bind:key="o.text"
                       :label="o.text"
                       :value="o.value"></el-option>
          </template>
        </el-select>
        <el-input v-else-if="item.type === 'number' || item.type === 'amount'"
                  v-model.number="item.value"
                  clearable
                  :placeholder="item.name"></el-input>
        <component v-else-if="item.type === 'custom'"
                   :is="item.component"
                   :value="item.value"
                   :conf="item"
                   :placeholder="item.name"
                   @on-change="editorChange"></component>
      </span>
    </div>
  </div>
</template>
<script>
import util from '@/libs/util.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import * as config from './config'
dayjs.extend(utc)
dayjs.extend(timezone)
export default {
  name: 'Query2',
  data () {
    return {
      isFold: false,
      conf: config.queryConfigBase
    }
  },
  props: {
    config: Object
  },
  created: function () {
    this.conf = config.queryConfig(this.config)
    this.initQueryString()
    // console.debug(this.$route)
    //  进行异步参数赋值
    this.conf.query.forEach((item) => {
      item.asyncValue && item.asyncValue(item)
    })
  },
  components: {
  },
  methods: {
    getOpt: function (op) {
      let opt = ''
      switch (op.toLocaleUpperCase()) {
        case 'EQ':
          opt = ''
          break
        case 'NE':
          opt = '!'
          break
        case 'LT':
          opt = '<'
          break
        case 'GT':
          opt = '>'
          break
        case 'LE':
          opt = '<='
          break
        case 'GE':
          opt = '>='
          break
        case 'LIKE':
          opt = '.'
          break
        case 'BETWEEN':
          opt = '~='
          break
      }
      return opt
    },
    delOpt: function (val) {
      let i = -1
      switch (val[0]) {
        case '!':
          i = 0
          break
        case '<':
          i = 0
          break
        case '>':
          i = 0
          break
        case '.':
          i = 0
          break
      }
      switch (val[0] + val[1]) {
        case '<=':
          i = 1
          break
        case '>=':
          i = 1
          break
        case '~=':
          i = 1
          break
      }
      console.debug(val)
      console.debug(val.substring(i + 1, val.length))
      return val.substring(i + 1, val.length)
    },
    getUrlParamsStr: function () {
      const _url = []
      this.conf.query.forEach((item) => {
        if (item.value != null && item.value !== undefined) {
          if ((typeof item.value === 'string' && item.value.trim().length > 0) || (typeof item.value === 'number' && item.value) || (typeof item.value === 'object' && item.value)) {
            if (_url.length > 0) {
              _url.push('&')
            }
            _url.push(item.valName + '=')
            const opt = this.getOpt(item.opt)
            let _v = item.value
            if (item.type === 'date') {
              if (dayjs(item.value).isValid) {
                _v = dayjs(item.value).tz('Asia/Shanghai').valueOf() ? (dayjs(item.value).tz('Asia/Shanghai').valueOf()).toString() : ''
              } else {
                _v = ''
              }
            }
            if (item.type === 'amount') {
              _v = item.value * 100
            }
            _url.push(opt + _v)
            //
          }
        }
      })
      // console.debug(_url.join(''))
      return _url.join('')
    },
    getUrlParams: function () {
      const _params = {}
      const _query = {}
      //
      this.conf.query.forEach((item) => {
        if (item.value != null && item.value !== undefined) {
          if ((item.value.constructor === String && item.value.trim().length > 0) || (item.value.constructor === Number && (item.value || item.value === 0)) || (item.value.constructor === Object && item.value) || (item.value.constructor === Array && item.value.length > 0)) {
            const opt = this.getOpt(item.opt)
            let _v = item.value
            if (item.type === 'date') {
              if (dayjs(item.value).isValid) {
                _v = dayjs(item.value).tz('Asia/Shanghai').valueOf() ? (dayjs(item.value).tz('Asia/Shanghai').valueOf()).toString() : ''
              } else {
                _v = ''
              }
            }
            if (item.type === 'amount') {
              _v = item.value * 100
            }
            _params[item.valName] = opt + _v
            _query[item.valName] = opt + _v
            //
          }
        }
      })
      //
      if (util.other.objectCount(_query) > 0) {
        this.$router.push({ query: _query })
      }
      return _params
    },
    getUrlParamsPage: function () {
      const _params = {}
      const _query = {}
      //
      this.conf.query.forEach((item) => {
        if (item.value != null && item.value !== undefined) {
          if ((item.value.constructor === String && item.value.trim().length > 0) || (item.value.constructor === Number && (item.value || item.value === 0)) || (item.value.constructor === Object && item.value) || (item.value.constructor === Array && item.value.length > 0)) {
            const opt = this.getOpt(item.opt)
            let _v = item.value
            if (item.type === 'date') {
              if (dayjs(item.value).isValid) {
                _v = dayjs(item.value).valueOf()
              } else {
                _v = ''
              }
            }
            if (item.type === 'amount') {
              _v = item.value * 100
            }
            _params[item.valName] = opt + _v
            _query[item.valName] = opt + _v
            //
          }
        }
      })
      // page
      if (this.$route.query.page) {
        _query.page = this.$route.query.page
        _params.page = this.$route.query.page
      }
      //
      if (util.other.objectCount(_query) > 0) {
        this.$router.push({ query: _query })
      }
      return _params
    },
    initQueryString: function () {
      console.log(this.$route.query)
      if (this.$route.query) {
        const query = this.$route.query
        for (const k in query) {
          this.conf.query.forEach((q) => {
            if (q.valName === k) {
              const v = this.delOpt(query[k])
              if (q.type === 'date') {
                q.value = new Date(parseInt(v))
              } else {
                q.value = v
              }
            }
          })
        }
      }
    },
    onFold () {
      this.isFold = !this.isFold
    },
    editorChange: function (val, valName) {
      this.conf.query.forEach((q) => {
        if (q.valName === valName) {
          q.value = val
        }
      })
    }

  }
}
</script>
