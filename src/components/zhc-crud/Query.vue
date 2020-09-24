<template>
  <div class="m-screen">
    <el-form ref="form"
             @submit.native.prevent
             label-width="96px"
             size="medium"
             class="m-form">
      <div class="screen-hd">
        <el-row :gutter="20">
          <el-col :span="17">
            <el-row v-if="conf.query.length > 0"
                    :gutter="20">
              <el-col v-for="(item,index) in conf.query"
                      :span="8"
                      v-bind:key="'query'+index">
                <div class="grid-content">
                  <template>
                    <el-form-item v-if="index < 2"
                                  :label="item.name">
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
                    </el-form-item>
                  </template>
                </div>
              </el-col>
              <el-col :span="8">
                <el-button v-if="conf.query.length >= 3"
                           type="text"
                           size="medium"
                           @click="onFold">更多
                  <i v-if="!isFold"
                     class="el-icon-arrow-down"></i>
                  <i v-if="isFold"
                     class="el-icon-arrow-up"></i>
                </el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <div class="operation">
                <!--<template v-for="(item,index) in conf.globalOperation" >-->
                <!--<el-button  v-bind:key="'btn'+index" :icon="item.icon?item.icon:''" @click="item.doFunc(conf)" >{{item.labelName}}</el-button>-->
                <!--</template>-->
                <!--<el-button v-if="conf.query.length > 3" type="primary" size="medium" @click="onFold">折叠 <i class="el-icon-arrow-down"></i></el-button>-->
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="conf.query.length > 2"
           v-show="isFold"
           class="screen-mn">
        <el-row :gutter="20">
          <template v-for="(item,index) in conf.query">
            <el-col :span="8"
                    v-if="index > 1"
                    v-bind:key="'query'+index">
              <div class="grid-content">
                <el-form-item :label="item.name">
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

                </el-form-item>
              </div>
            </el-col>
          </template>

        </el-row>
      </div>
      <div class="screen-btn">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="">
              <template v-for="(item,index) in conf.globalOperation">
                <el-button v-bind:key="'btn'+index"
                           :type="item.type?item.type:''"
                           :icon="item.icon?item.icon:''"
                           @click="item.doFunc(conf)">{{item.labelName}}</el-button>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<style scoped>
.el-date-editor--datetimerange.el-input,
.el-date-editor--datetimerange.el-input__inner {
  width: 100%;
}
</style>
<script>
import util from '@/libs/util.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import * as config from './config'
dayjs.extend(utc)
dayjs.extend(timezone)
export default {
  name: 'Query',
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
