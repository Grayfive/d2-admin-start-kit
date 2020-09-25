<template>
  <div>
    <div class="mainsrp-sortbar">
      <div class="m-multi-query">
        <template v-for="(item,index) in conf.query">
          <span v-if="index < count"
                :key="'query'+index">
            <el-input size="small"
                      v-if="item.type === 'text'"
                      type="text"
                      v-model.trim="item.value"
                      :placeholder="item.name"
                      clearable></el-input>
            <el-date-picker size="small"
                            v-else-if="item.type === 'date'"
                            format="yyyy/MM/dd"
                            type="date"
                            v-model="item.value"
                            :placeholder="item.name"></el-date-picker>
            <el-date-picker size="small"
                            v-else-if="item.type === 'datetimerange'"
                            format="yyyy/MM/dd HH:mm:ss"
                            type="datetimerange"
                            value-format="timestamp"
                            v-model="item.value"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <el-select size="small"
                       v-else-if="item.type === 'select'"
                       v-model="item.value"
                       :placeholder="item.name">
              <template v-for="o in item.selValue">
                <el-option v-bind:key="o.text"
                           :label="o.text"
                           :value="o.value"></el-option>
              </template>
            </el-select>
            <el-select size="small"
                       v-else-if="item.type === 'select_filterable'"
                       v-model="item.value"
                       filterable
                       :placeholder="item.name">
              <template v-for="o in item.selValue">
                <el-option v-bind:key="o.text"
                           :label="o.text"
                           :value="o.value"></el-option>
              </template>
            </el-select>
            <el-input size="small"
                      v-else-if="item.type === 'number' || item.type === 'amount'"
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
        </template>
      </div>
      <div class="m-multi-search">
        <span v-if="conf.query.length > count">
          <el-select v-model="currentOtherQueries"
                     placeholder="请选择"
                     size="small"
                     style="width:100px;"
                     @change="changeOtherQueries">
            <template v-for="(item,index) in conf.query">
              <el-option v-if="index >= count"
                         :key="'query'+index"
                         :label="item.name"
                         :value="item.valName">
              </el-option>
            </template>
          </el-select>
        </span>
        <span>
          <template v-for="(item,index) in conf.query">
            <span v-if="index >= count"
                  v-show="currentOtherQueries === item.valName"
                  :key="'query'+index">
              <el-input size="small"
                        v-if="item.type === 'text'"
                        type="text"
                        v-model.trim="item.value"
                        :placeholder="item.name"
                        clearable></el-input>
              <el-date-picker size="small"
                              v-else-if="item.type === 'date'"
                              format="yyyy/MM/dd"
                              type="date"
                              v-model="item.value"
                              :placeholder="item.name"></el-date-picker>
              <el-date-picker size="small"
                              v-else-if="item.type === 'datetimerange'"
                              format="yyyy/MM/dd HH:mm:ss"
                              type="datetimerange"
                              value-format="timestamp"
                              v-model="item.value"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <el-select size="small"
                         v-else-if="item.type === 'select'"
                         v-model="item.value"
                         :placeholder="item.name">
                <template v-for="o in item.selValue">
                  <el-option v-bind:key="o.text"
                             :label="o.text"
                             :value="o.value"></el-option>
                </template>
              </el-select>
              <el-select size="small"
                         v-else-if="item.type === 'select_filterable'"
                         v-model="item.value"
                         filterable
                         :placeholder="item.name">
                <template v-for="o in item.selValue">
                  <el-option v-bind:key="o.text"
                             :label="o.text"
                             :value="o.value"></el-option>
                </template>
              </el-select>
              <el-input size="small"
                        v-else-if="item.type === 'number' || item.type === 'amount'"
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
          </template>
        </span>
        <!-- element 按钮 -->
        <!-- <span>
                    <el-button size="small" icon="el-icon-search" type="primary">搜索</el-button>
                </span> -->
        <span>
          <button class="dy-button dy-button-small"
                  @click="sel"><i class="el-icon-search"></i><span>搜索</span></button>
        </span>
      </div>
    </div>
    <div class="mainsrp-sortbar"
         v-if="conf.globalOperation.length>1">
      <div class="m-multi-search"
           style="width:100%">
        <template v-for="(item,index) in conf.globalOperation">
          <span v-if="index>0"
                :key="'btn'+index">
            <el-button class="dy-button-small"
                       :type="item.type?item.type:''"
                       :icon="item.icon?item.icon:''"
                       @click="item.doFunc(conf)"><span>{{item.labelName}}</span></el-button>
          </span>
        </template>

      </div>
    </div>
  </div>
</template>
<script>
// import util from '@/libs/util.js'
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
      count: 1,
      isFold: false,
      conf: config.queryConfigBase,
      currentOtherQueries: ''// 当前其他查询
    }
  },
  props: {
    config: Object
  },
  created: function () {
    this.conf = config.queryConfig(this.config)
    this.initQueryString()
    this.initOtherQueries()
    // console.debug(this.$route)
    //  进行异步参数赋值
    this.conf.query.forEach((item) => {
      item.asyncValue && item.asyncValue(item)
    })
    // if (this.conf.query.length > 0) {
    //   this.currentOtherQueries = this.conf.query[0].valName
    // }
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
    getUrlParams: async function () {
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
      // if (util.other.objectCount(_query) > 0) {
      await this.$store.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: this.$route.path + '.query',
        value: _query,
        user: true
      }, { root: true })
      // }
      return _params
    },
    getUrlParamsPage: async function () {
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
      const _q = await this.$store.dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: this.$route.path + '.query',
        defaultValue: {},
        user: true
      }, { root: true })
      if (_q.page) {
        _query.page = _q.page
        _params.page = _q.page
      }
      // if (util.other.objectCount(_query) > 0) {
      await this.$store.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: this.$route.path + '.query',
        value: _query,
        user: true
      }, { root: true })
      // }
      return _params
    },
    initQueryString: async function () {
      const query = await this.$store.dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: this.$route.path + '.query',
        defaultValue: null,
        user: true
      }, { root: true })
      console.log(query)
      if (query) {
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
    initOtherQueries: async function () {
      this.currentOtherQueries = await this.$store.dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: this.$route.path + '.otherQueries',
        defaultValue: '',
        user: true
      }, { root: true })
      for (let i = this.count; i < this.conf.query.length; i++) {
        const item = this.conf.query[i]
        if (item.valName !== this.currentOtherQueries) {
          item.value = ''
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
    },
    async changeOtherQueries (e) {
      console.log(e)
      this.$store.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: this.$route.path + '.otherQueries',
        value: e,
        user: true
      }, { root: true })
      for (let i = this.count; i < this.conf.query.length; i++) {
        const item = this.conf.query[i]
        item.value = ''
      }
    },
    sel () {
      if (this.conf.globalOperation && this.conf.globalOperation.length > 0) {
        this.conf.globalOperation[0].doFunc()
      }
    }

  }
}
</script>
