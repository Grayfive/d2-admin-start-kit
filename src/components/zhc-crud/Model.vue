<template>
  <div class="mainsrp-form">
    <div class="m-form">
      <el-form ref="form"
               label-position="top"
               :model="dataSource"
               :rules="rules"
               label-width="100px"
               size="medium"
               @submit.native.prevent>
        <div class="form-mn">
          <el-form-item v-for="(item, index) in conf.models"
                        v-bind:key="index"
                        :label="item.labelName"
                        :label-width="item.labelWidth"
                        :prop="item.valName"
                        size="small">
            <template v-if="conf.ope === 'view'">
              <editor v-if="item.type === 'editor'"
                      :value="dataSource[item.valName]"
                      :isOnlyRead="true"
                      :upFile="item.upFunc"></editor>
              <cropper v-else-if="item.type === 'cropper'"
                       :initUrl="dataSource[item.valName]"
                       :conf="item"
                       :fixedNumber="item.fixedNumber"
                       @on-change="editorChange"
                       :disabled="true"></cropper>
              <span v-else>
                <span v-if="item.filterRow">{{dataSource| generalFilter(item.filter)}}</span>
                <span v-else>{{dataSource | generalFilter(item.filter,item.valName)}}</span>
              </span>
              <el-col v-if="item.des"
                      :span="12">
                <span style="font-size: 13px">{{item.des}}</span>
              </el-col>
            </template>
            <template v-else-if="conf.ope !== 'view'">
              <span v-if="item.type === 'label'">
                <span v-if="item.filterRow">{{dataSource| generalFilter(item.filter)}}</span>
                <span v-else>{{dataSource | generalFilter(item.filter,item.valName)}}</span>
              </span>
              <el-input v-else-if="item.type === 'text'"
                        :class="item.classObject"
                        v-model.trim="dataSource[item.valName]"
                        :placeholder="item.about"
                        :maxlength="item.maxlength?item.maxlength:50"></el-input>
              <el-input v-else-if="item.type === 'number' || item.type === 'amount'"
                        :maxlength="item.maxlength?item.maxlength:10"
                        :class="item.classObject"
                        v-model.number="dataSource[item.valName]"
                        :placeholder="item.about"></el-input>
              <el-date-picker style="width:100%"
                              v-else-if="item.type === 'date'"
                              :class="item.classObject"
                              format="yyyy/MM/dd"
                              type="date"
                              v-model="dataSource[item.valName]"
                              :placeholder="item.about"></el-date-picker>
              <el-date-picker style="width:100%"
                              v-else-if="item.type === 'datetime'"
                              :class="item.classObject"
                              format="yyyy/MM/dd HH:mm:ss"
                              type="datetime"
                              v-model="dataSource[item.valName]"
                              :placeholder="item.about"></el-date-picker>
              <el-date-picker v-else-if="item.type === 'datetimerange'"
                              :class="item.classObject"
                              format="yyyy/MM/dd HH:mm:ss"
                              type="datetimerange"
                              value-format="timestamp"
                              v-model="dataSource[item.valName]"
                              :placeholder="item.about"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              <el-select style="width:100%"
                         v-else-if="item.type === 'select'"
                         :class="item.classObject"
                         v-model="dataSource[item.valName]"
                         :placeholder="item.about">
                <el-option v-for="(o,i) in item.selValue"
                           v-bind:key="i"
                           :label="o.text"
                           :value="o.value"></el-option>
              </el-select>
              <el-select style="width:100%"
                         v-else-if="item.type === 'select_custom'"
                         v-model="dataSource[item.valName]"
                         :placeholder="item.about"
                         filterable>
                <el-option v-for="(o,i) in item.selValue"
                           v-bind:key="i"
                           :label="o.text"
                           :value="o.value"
                           style="height: 150px;">
                  <img style="float:left;margin:15px"
                       width="120"
                       height="120"
                       :src="o.img"
                       alt>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{o.text}}</span>
                </el-option>
              </el-select>
              <el-select style="width:100%"
                         v-else-if="item.type === 'select_filterable'"
                         :class="item.classObject"
                         v-model="dataSource[item.valName]"
                         :placeholder="item.about"
                         filterable>
                <el-option v-for="(o,i) in item.selValue"
                           v-bind:key="i"
                           :label="o.text"
                           :value="o.value"></el-option>
              </el-select>
              <el-transfer v-else-if="item.type === 'transfer'"
                           v-model="dataSource[item.valName]"
                           :data="item.selValue"
                           :titles="item.titles"
                           :class="item.classObject"></el-transfer>
              <el-input v-else-if="item.type === 'password'"
                        type="password"
                        :class="item.classObject"
                        v-model.trim="dataSource[item.valName]"
                        :placeholder="item.about"></el-input>
              <el-input v-else-if="item.type === 'textarea'"
                        type="textarea"
                        :rows="item.textRows"
                        :class="item.classObject"
                        v-model="dataSource[item.valName]"
                        :placeholder="item.about"></el-input>
              <editor v-else-if="item.type === 'editor'"
                      :class="item.classObject"
                      :value="dataSource[item.valName]"
                      :valName="item.valName"
                      @on-change="editorChange"
                      :upFile="item.upFunc"
                      :placeholder="item.about"
                      :isOnlyRead="item.isOnlyRead"></editor>
              <tinymce v-else-if="item.type === 'tinymce'"
                       :height="300"
                       :width="700"
                       v-model="dataSource[item.valName]"
                       :isOnlyRead="item.isOnlyRead"
                       :upFile="item.upFunc"
                       :valName="item.valName"
                       @on-change="editorChange"></tinymce>
              <cropper v-else-if="item.type === 'cropper'"
                       :class="item.classObject"
                       :initUrl="dataSource[item.valName]"
                       :conf="item"
                       :fixedNumber="item.fixedNumber"
                       :upFile="item.upFunc"
                       :disabled="item.disabled"
                       :limit="item.limit"
                       :accept="item.accept"
                       @on-change="editorChange"></cropper>
              <component v-else-if="item.type === 'custom'"
                         :class="item.classObject"
                         :is="item.component"
                         :dataSource="dataSource"
                         :conf="item"
                         @on-change="editorChange"
                         @on-change-other="editorChangeOther"></component>
              <el-col v-if="item.des"
                      :span="12">
                <span style="font-size: 13px">{{item.des}}</span>
              </el-col>
              <div class="tips_box"
                   v-else-if="item.type==='tip'">{{item.tiptxt}}</div>
            </template>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="mainsrp-operation"
         v-if="conf.hasOperation">
      <template v-for="(item, index) in conf.operation">
        <el-button v-bind:key="index"
                   v-if="!item.showFunc || item.showFunc(dataSource)"
                   @click="testSubmit(dataSource, item.doFunc, item)"
                   :type="item.type?item.type:'button'"
                   class="dy-button-small">{{item.labelName}}</el-button>
      </template>
    </div>
  </div>
</template>
<style>
</style>
<script>
import * as config from './config'
import dayjs from 'dayjs'
import util from '@/libs/util'
import editor from './Editor'
import cropper from './Cropper'
import Tinymce from './Tinymce'
export default {
  name: 'Model',
  data () {
    return {
      conf: util.other.copy(config.modelConfigBase),
      dataSource: {},
      rules: {},
      confJson: ''
    }
  },
  props: {
    config: Object
  },
  created: function () {
    this.initData()
  },
  mounted () {

  },
  components: {
    editor,
    cropper,
    Tinymce
  },
  methods: {
    async initData () {
      console.info('initData')
      const info = await this.$store.dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'user.info',
        defaultValue: {
          resources: []
        },
        user: true
      }, { root: true })
      const resources = info.resources
      const conf = config.modelConfig(this.config)
      const opts = []
      for (let i = 0; i < conf.operation.length; i++) {
        const opt = conf.operation[i]
        if (opt.name) {
          for (let j = 0; j < resources.length; j++) {
            const resource = resources[j]
            if (resource.type === 2 && opt.name === resource.name) {
              opts.push(opt)
              break
            }
          }
        } else {
          opts.push(opt)
        }
      }
      conf.operation = opts
      this.conf = conf
      this.confJson = JSON.stringify(this.conf)
      // 验证参数
      this.conf.models.forEach(item => {
        this.rules[item.valName] = []
        if (item.validator) {
          this.rules[item.valName].push({
            validator: item.validator,
            trigger: 'blur'
          })
        }
        //
        //  添加对应的参数
        if (item.type === 'number') {
          this.rules[item.valName].push({
            type: 'number',
            message: '必须为数字值'
          })
        }
        if (item.required && item.required !== '') {
          this.rules[item.valName].push({
            required: true,
            message: item.required,
            trigger: 'blur'
          })
        }
        //  进行异步参数赋值
        item.asyncValue && item.asyncValue(item)
      })
      // if (this.conf.ope !== 'add') {
      //   this.doSelect()
      // } else {
      //   this.setNull()
      // }
      this.$nextTick(() => {
        if (this.conf.ope !== 'add') {
          this.doSelect()
        } else {
          this.setNull()
        }
      })
    },
    getData: function () {
      console.info('getData')
      console.info(util.other.copy(this.dataSource))
      const _data = util.other.copy(this.dataSource)
      this.conf.models.forEach(item => {
        if (item.type === 'amount') {
          _data[item.valName] = _data[item.valName] * 100
        }
        if (item.type === 'date') {
          _data[item.valName] =
            dayjs(
              dayjs(_data[item.valName]).format('YYYY-MM-DD 00:00:00'),
              'YYYY-MM-DD HH:mm:ss'
            ).unix() * 1000
          console.debug(_data[item.valName])
        }
        if (item.type === 'datetime') {
          _data[item.valName] = dayjs(_data[item.valName]).valueOf()
          console.debug(_data[item.valName])
        }
      })
      return _data
    },
    doSelect: function () {
      console.info('doSelect')
      if (this.conf.sourceFunc) {
        this.conf.sourceFunc(this.conf.sourceFuncArgs).then(data => {
          console.info(this.dataSource)
          // 直接赋值，不要循环遍历
          this.dataSource = data
          this.setNull()
          // doSelect 之后
          this.conf.afterDoSelect &&
            this.conf.afterDoSelect(this.dataSource, this.conf)
          this.conf.models.forEach(item => {
            item.asyncData && item.asyncData(item, this.dataSource)
          })
        })
      }
    },
    resetForm: function () {
      console.info('resetForm')
      const conf = JSON.parse(this.confJson)
      const _dataSource = util.other.copy(this.dataSource)
      conf.models.forEach(item => {
        _dataSource[item.valName] = item.value
      })
      this.dataSource = _dataSource
    },
    resetDataSource: function () {
      console.info('resetDataSource')
      const conf = JSON.parse(this.confJson)
      const _dataSource = {}
      conf.models.forEach(item => {
        _dataSource[item.valName] = item.value
      })
      this.dataSource = _dataSource
    },
    setNull: function () {
      console.info('setNull')
      // 给不存在的属性服初值
      const self = this
      const _dataSource = util.other.copy(self.dataSource)
      this.conf.models.forEach(item => {
        if (!_dataSource[item.valName] && _dataSource[item.valName] !== 0) {
          _dataSource[item.valName] = item.value
          if (item.type === 'date') {
            if (item.value) {
              _dataSource[item.valName] = new Date(item.value)
            }
          }
          if (item.type === 'datetime') {
            if (item.value) {
              _dataSource[item.valName] = new Date(item.value)
            }
          }
        } else {
          if (item.type === 'amount') {
            _dataSource[item.valName] = _dataSource[item.valName] / 100
          }
          if (item.type === 'date') {
            _dataSource[item.valName] = new Date(_dataSource[item.valName])
          }
          if (item.type === 'datetime') {
            _dataSource[item.valName] = new Date(_dataSource[item.valName])
          }
        }
      })
      self.dataSource = _dataSource
    },
    testSubmit: function (val, doFunc, confItem) {
      console.info('testSubmit')
      const v = this.getData()
      if (confItem.hasValidator) {
        // if (this.testForm(v) && confItem.hasValidator) {
        //   doFunc(v)
        // }
        console.info(this.rules)
        this.$refs.form.validate(valid => {
          console.info(valid)
          if (valid) {
            doFunc(v)
          }
        })
      } else {
        doFunc(v)
      }
    },
    testForm: function (val) {
      console.info('testForm')
      let _r = true
      this.conf.models.forEach(item => {
        if (item.validator) {
          if (item.validator.reg.test(val[item.valName])) {
            item.validator.ok.isShow = true
            item.validator.err.isShow = false
          } else {
            item.validator.ok.isShow = false
            item.validator.err.isShow = true
            _r = false
          }
        }
      })
      return _r
    },
    testSubmit1: function (val1, val2, doFunc, confItem) {
      console.info('testSubmit1')
      if (confItem.hasValidator) {
        console.debug(this.rules)
        this.$refs.form.validate(valid => {
          console.debug(valid)
          if (valid) {
            doFunc(val1, val2)
          }
        })
      } else {
        doFunc(val1, val2)
      }
    },
    editorChange: function (val, valName) {
      console.info('editorChange')
      this.dataSource[valName] = val
    },
    editorChangeOther: function (val, valName) {
      console.info('editorChangeOther')
      console.info(val)
      this.dataSource[valName] = val
    },
    testClearValidate: function (valName) {
      this.$refs.form.clearValidate(valName)
    },
    closeCurrentPage () {
      this.$store.dispatch('delView', this.$route).then(({ visitedViews }) => {
        const latestView = visitedViews.slice(-1)[0]
        if (latestView) {
          // this.$router.push(latestView)
          this.$router.back()
        } else {
          this.$router.push('/dashboard')
        }
      })
    }
  },
  filters: {
    generalFilter: function (row, fnc, valName) {
      let val = row
      if (valName) {
        val =
          valName.indexOf('.') < 0
            ? row[valName]
            : row[valName.split('.')[0]][valName.split('.')[1]]
      }
      if (fnc) {
        return fnc(val)
      } else {
        return val
      }
    }
    // generalFilter: function (input, fnc) {
    //   if (input || input === 0) {
    //     if (fnc) {
    //       return fnc(input)
    //     } else {
    //       return input
    //     }
    //   } else {
    //     return ''
    //   }
    // }
  },
  watch: {
    'config.sourceFuncArgs': {
      handler: function (val, oldVal) {
        console.info(val)
        console.info(oldVal)
        if (val !== oldVal) {
          console.debug(val)
          this.initData()
        }
      },
      deep: true // 深度监听
    }
  }
}
</script>
