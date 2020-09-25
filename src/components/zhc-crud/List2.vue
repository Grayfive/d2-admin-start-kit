<template>
  <div class="mainsrp-data">
    <el-table ref="multipleTable"
              :data="pageSource.content"
              border
              stripe
              style="width: 100%"
              @sort-change="sortChange"
              @expand-change="expandChange"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       v-if="conf.multiSelect"
                       align="center"
                       header-align="center">
      </el-table-column>
      <el-table-column type="expand"
                       v-if="conf.expand.has"
                       align="center"
                       header-align="center">
        <template slot-scope="props">
          <el-form label-position="left"
                   inline
                   class="table-expand">
            <el-form-item v-for="(m,mi) in conf.expand.models"
                          :key="mi"
                          :label="m.labelName">
              <span v-if="m.filterRow">{{ props.row | generalFilter(m.filter)}}</span>
              <span v-else>{{ props.row | generalFilter(m.filter,m.valName)}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in conf.column"
                       :key="index"
                       :label="item.labelName"
                       :width="item.width"
                       :sortable="item.sortable?'custom':false"
                       :prop="item.valName"
                       :fixed="item.fixed"
                       align="center"
                       header-align="center">
        <template slot-scope="scope">
          <template v-if="item.type === 'custom'">
            <component :is="item.component"
                       :value="item.valName.indexOf('.') < 0 ? scope.row[item.valName]:scope.row[item.valName.split('.')[0]][item.valName.split('.')[1]]"
                       :row="scope.row"></component>
          </template>
          <template v-else-if="item.type === 'img'">
            <el-image style="width:100%"
                      :src="item.valName.indexOf('.') < 0 ? scope.row[item.valName]:scope.row[item.valName.split('.')[0]][item.valName.split('.')[1]]"
                      :preview-src-list="[item.valName.indexOf('.') < 0 ? scope.row[item.valName]:scope.row[item.valName.split('.')[0]][item.valName.split('.')[1]]]" />
          </template>
          <template v-else>
            <span v-if="item.filterRow">{{scope.row | generalFilter(item.filter)}}</span>
            <span v-else>{{scope.row | generalFilter(item.filter,item.valName)}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="conf.hasOperation"
                       fixed="right"
                       label="操作"
                       width="150"
                       align="center"
                       header-align="center">
        <template slot-scope="scope">
          <!--<el-dropdown trigger="click" @command="clickOperation">-->
          <template v-if="getOptShow(conf.operation,scope.row) <= 0">
            无操作
          </template>
          <template v-else-if="getOptShow(conf.operation,scope.row) <= 2"
                    v-for="(o,i) in getOptShowMenu(conf.operation,scope.row)">
            <el-button type="text"
                       v-if="!o.showFunc || o.showFunc(scope.row)"
                       @click="clickOperation([o.doFunc, scope.row])"
                       :key="i">{{o.labelName}}</el-button>
          </template>
          <template v-else-if="getOptShow(conf.operation,scope.row) > 2">
            <template v-for="(o,i) in getOptShowMenu(conf.operation,scope.row)">
              <el-button type="text"
                         v-if="(!o.showFunc || o.showFunc(scope.row)) && i < 1"
                         @click="clickOperation([o.doFunc, scope.row])"
                         :key="i">{{o.labelName}}</el-button>
            </template>
            <el-dropdown @command="clickOperation"
                         style="margin-left: 6px">
              <span class="el-dropdown-link"
                    style="color:#409eff;cursor: pointer;">
                其他<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown"
                                style="width:100px;">
                <template v-for="(o,i) in getOptShowMenu(conf.operation,scope.row)">
                  <template v-if="i >= 1">
                    <el-dropdown-item v-if="!o.showFunc || o.showFunc(scope.row)"
                                      :command="[o.doFunc, scope.row]"
                                      :key="i">{{o.labelName}}</el-dropdown-item>
                  </template>

                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

        </template>
      </el-table-column>
    </el-table>
    <pagination-components v-if="conf.hasPagination"
                           :pageSource="pageSource"
                           @on-page="setPage"
                           @prev-page="prevPage"
                           @next-page="nextPage" />
  </div>
</template>
<script>
import util from '@/libs/util.js'
import * as config from './config'
import paginationComponents from './Pagination2'
export default {
  name: 'List2',
  data () {
    return {
      conf: util.other.copy(config.listConfigBase),
      pageSource: util.other.copy(config.pageSourceConfigBase),
      queryParams: {}, // 其他的查询条件
      tempOperationNum: -1, // 当前点击的是那个列表的操作
      page: 1,
      oldPage: 0, // 老页面编号
      lastId: '',
      firstId: '',
      totalPages: 0, // page 总数
      totalElements: 0, // 总共多少条数
      currentPageArgs: null// 保留当前页面 查询的参数，用来再次刷新
      // changeDirection: false,//改变方向, 是否改变查询方向 true 为改变，false 为没改变
    }
  },
  props: {
    config: Object
  },
  created: async function () {
    const info = await this.$store.dispatch('d2admin/db/get', {
      dbName: 'sys',
      path: 'user.info',
      defaultValue: {
        resources: []
      },
      user: true
    }, { root: true })
    const resources = info.resources
    const conf = config.listConfig(this.config)
    const opts = []
    for (let i = 0; i < conf.operation.length; i++) {
      const opt = conf.operation[i]
      for (let j = 0; j < resources.length; j++) {
        const resource = resources[j]
        console.log(resource.type === 2)
        if (resource.type === 2 && opt.name === resource.name) {
          opts.push(opt)
          break
        }
      }
    }
    conf.operation = opts
    this.conf = conf
  },
  mounted () {
  },
  components: {
    paginationComponents
  },
  filters: {
    generalFilter: function (row, fnc, valName) {
      let val = row
      if (valName) {
        val = valName.indexOf('.') < 0 ? row[valName] : row[valName.split('.')[0]][valName.split('.')[1]]
      }
      if (fnc) {
        return fnc(val)
      } else {
        return val
      }
    }
  },
  methods: {
    clickOperation: function (val) {
      // this.hideOperation()
      val[0] && val[0](val[1])
    },
    prevPage: function () {
      console.debug('prevPage')
      this.page = this.page - 1
      this.doSelect(-1, this.conf.pageSize, this.queryParams, {
        lastId: this.firstId
      })
    },
    nextPage: function () {
      console.debug('nextPage')
      this.page = this.page + 1
      this.doSelect(1, this.conf.pageSize, this.queryParams, {
        lastId: this.lastId
      })
    },
    setPage: function (page) {
      console.debug('setPage')
      this.oldPage = this.page
      this.page = page

      const opt = {
        lastId: (page - this.oldPage) > 0 ? this.lastId : this.firstId
      }
      this.doSelect(page - this.oldPage, this.conf.pageSize, this.queryParams, opt)
    },
    setQueryParams: function (queryParams) {
      this.queryParams = queryParams
    },
    setQueryParamsOnRefresh: function (queryParams) {
      this.queryParams = queryParams
      this.oldPage = 0
      this.page = 1
      this.doSelect(1, this.conf.pageSize, this.queryParams)
    },
    onRefresh: function () {
      console.debug('onRefresh')
      this.doSelect(1, this.conf.pageSize, this.queryParams)
    },
    onRefreshCurrentPage: function () {
      // 刷新当前页面
      console.debug('onRefreshCurrentPage')
      if (this.currentPageArgs) {
        this._doSel(this.currentPageArgs)
      } else {
        this.onRefresh()
      }
    },
    doSelect: function (page, size, urlParams, opt) {
      console.debug('doSelect')
      console.debug(urlParams)
      console.debug(opt)
      const params = {}
      for (const k in urlParams) {
        params[k] = urlParams[k]
      }
      if (page || page === 0) {
        params.page = page
      }
      if (size || size === 0) {
        params.size = size
      }
      if (this.conf.sort.trim().length > 0) {
        params.sort = this.conf.sort
      }
      if (!params.page) {
        params.page = this.page
      }
      if (opt && opt.lastId && opt.lastId !== '') {
        params.lastId = opt.lastId
      }
      console.log(params)
      const args = util.other.copy(this.conf.pageSourceFuncArgs)
      if (args.params) {
        for (const k in params) {
          if (k === 'where') {
            let ap = {}
            if (args.params[k]) {
              if (typeof args.params[k] === 'string') {
                ap = JSON.parse(args.params[k])
              } else {
                ap = util.other.copy(args.params[k])
              }
            }
            let p = {}
            if (typeof params[k] === 'string') {
              p = JSON.parse(params[k])
            } else {
              p = util.other.copy(params[k])
            }
            for (const wk in p) {
              ap[wk] = p[wk]
            }
            args.params[k] = JSON.stringify(ap)
          } else {
            args.params[k] = params[k]
          }
        }
      } else {
        args.params = params
      }
      this._doSel(args)
    },
    _doSel (args) {
      // console.log(this.conf)
      if (!this.conf.pageSourceFunc) {
        setTimeout(() => {
          this._doSel(args)
        }, 500)
        return
      }
      this.currentPageArgs = args
      this.conf.pageSourceFunc(args).then(
        (data) => {
          const first = this.page === 1
          const last = this.page === this.totalPages
          this.firstId = data.firstId
          this.lastId = data.lastId
          //
          this.pageSource.size = data.size
          this.pageSource.totalElements = data.totalElements
          if (data.totalPages || data.totalPages === 0) {
            this.totalPages = data.totalPages
            this.pageSource.totalPages = data.totalPages
          } else {
            this.pageSource.totalPages = this.totalPages
          }
          if (data.totalElements || data.totalElements === 0) {
            this.totalElements = data.totalElements
            this.pageSource.totalElements = data.totalElements
          } else {
            this.pageSource.totalElements = this.totalElements
          }
          this.pageSource.number = this.page - 1
          this.pageSource.first = first
          this.pageSource.last = last
          this.pageSource.numberOfElements = data.numberOfElements
          this.pageSource.sort = data.sort
          this.pageSource.content = data.content
          //  异步获取显示
          this.conf.column.forEach((co) => {
            if (co.asyncValue) {
              this.pageSource.content.forEach((c) => {
                co.asyncValue(c)
              })
            }
          })
        }
      )
    },
    handleSelectionChange (val) {
      console.debug(val)
      this.conf.multiSelectValue = val
    },
    handleSelect (val, row) {
      console.debug(row)
      // this.conf.multiSelectValue = val;
      const d = [] // 需要删除的
      const ad = [] // 需要添加的
      for (const i in this.conf.multiSelectValue) {
        const item = this.conf.multiSelectValue[i]
        if (item === row) {
          d.push(i)
        } else {
          ad.push(item)
        }
      }
      d.forEach((i) => {
        delete this.conf.multiSelectValue[i]
      })
      ad.forEach((item) => {
        this.conf.multiSelectValue.push(item)
      })
      this.conf.multiSelectValue.forEach((row) => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },
    expandChange (row, expandedRows) {
      console.debug(expandedRows)
      if (this.conf.expand.has && this.conf.expand.asyncValue && !row.endExpandAsyncValue) {
        this.conf.expand.asyncValue(row)
        row.endExpandAsyncValue = true
      }
    },
    sortChange (val) {
      console.debug(val)
      console.debug(this.conf.sort)
      if (val.prop && val.order) {
        // let order = 'ASC'
        let order = '-'
        if (val.order === 'ascending') {
          // order = 'ASC'
          order = '-'
        }
        if (val.order === 'descending') {
          // order = 'DESC'
          order = ''
        }
        this.conf.sort = order + '' + val.prop
      } else {
        this.conf.sort = ''
      }
      if (this.conf.sortFunc) {
        this.conf.sortFunc && this.conf.sortFunc(val, this.conf)
      } else {
        this.onRefresh()
      }
    },
    getMultiSelectValue () {
      return this.conf.multiSelectValue
    },
    getOptShow (operation, row) {
      let count = 0
      for (const i in operation) {
        const o = operation[i]
        if (!o.showFunc || o.showFunc(row)) {
          count++
        }
      }
      return count
    },
    getOptShowMenu (operation, row) {
      // let count = 0
      const menus = []
      for (const i in operation) {
        const o = operation[i]
        if (!o.showFunc || o.showFunc(row)) {
          // count++
          menus.push(o)
        }
      }
      return menus
    }
  }
}
</script>
