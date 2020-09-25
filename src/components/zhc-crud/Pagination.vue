<template>
  <div class="mainsrp-pager">
    <div class="m-pager">
      <ul class="pagination">
        <li class="disabled"><a href="javascript:;">共计 {{pageSource.totalElements}} 条</a></li>
        <li :class="{ 'disabled' : pageSource.first }">
          <a href="javascript:;"
             @click="prevPage">«</a>
        </li>
        <li v-for="index in pageList"
            v-bind:key="index"
            :class="{ 'active' : index != '...' && (parseInt(index) - 1) === pageSource.number }">
          <a href="javascript:;"
             v-if="index === '...'">{{index}}</a>
          <a href="javascript:;"
             v-else
             :class="{ 'disabled' : (parseInt(index) - 1) === pageSource.number }"
             @click="changeCurrentPage(index)">{{index}}</a>
        </li>
        <li :class="{ 'disabled' : pageSource.last }">
          <a href="javascript:;"
             @click="nextPage">»</a>
        </li>
        <li>
          <a>
            前往
            <input type="text"
                   v-model.number="pageNumber"
                   @input="change"
                   @change="change"
                   @keyup.enter="goto" />
            页
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import * as config from './config'
export default {
  name: 'Pagination',
  data () {
    return {
      // pageSource: this.$utils.copy(config.pageSourceConfigBase)
      pageNumber: 0
    }
  },
  props: {
    pageSource: Object
  },
  created: function () {
    // this.pageSource = config.pageSourceConfig(this.config)
    console.debug(this.pageSource)
    this.pageNumber = this.pageSource.number + 1
  },
  computed: {
    pageList: function () {
      const p = []
      if (this.pageSource.totalPages <= this.pageSource.size || this.pageSource.totalPages <= 5) {
        // 判断总页数如果小于等于分页的长度，若小于则直接显示
        for (let i = 1; i <= this.pageSource.totalPages; i++) {
          p.push(i)
        }
      } else {
        // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
        // 计算中心偏移量
        let offset = (this.pageSource.size - 1) / 2
        if (offset < 5) {
          offset = 5
        }
        if (this.pageSource.number + 1 <= offset) {
          // 左边没有...
          for (let i = 1; i <= offset + 1; i++) {
            p.push(parseInt(i))
          }
          p.push('...')
          p.push(this.pageSource.totalPages)
        } else if (this.pageSource.number + 1 > this.pageSource.totalPages - offset) {
          p.push(1)
          p.push('...')
          for (let i = offset + 1; i >= 1; i--) {
            p.push(this.pageSource.totalPages - parseInt(i))
          }
          p.push(this.pageSource.totalPages)
        } else {
          // 最后一种情况，两边都有...
          p.push(1)
          p.push('...')
          for (let i = Math.ceil(offset / 2); i >= 1; i--) {
            const _p = parseInt(this.pageSource.number) - parseInt(i)
            if (_p !== 1) {
              p.push(parseInt(this.pageSource.number) - parseInt(i))
            }
          }
          p.push(this.pageSource.number)
          for (let i = 1; i <= offset / 2; i++) {
            p.push(parseInt(this.pageSource.number) + parseInt(i))
          }
          p.push('...')
          p.push(this.pageSource.totalPages)
        }
      }
      console.debug(p)
      return p
    }
  },
  components: {},
  methods: {
    goto () {
      this.changeCurrentPage(this.pageNumber)
    },
    prevPage: function () {
      if (!this.pageSource.first) {
        // const _query = this.$utils.copy(this.$route.query)
        // _query['page'] = this.pageSource.number - 2
        // this.$router.push({ query: _query })
        this.$emit('prev-page')
      }
    },
    nextPage: function () {
      if (!this.pageSource.last) {
        // const _query = this.$utils.copy(this.$route.query)
        // _query['page'] = this.pageSource.number + 2
        // this.$router.push({ query: _query })
        // this.emitPage(1)
        this.$emit('next-page')
      }
    },
    changeCurrentPage: function (index) {
      if ((index - 1) !== this.pageSource.number) {
        // const _query = this.$utils.copy(this.$route.query)
        // _query['page'] = index - 1
        // _query['page'] = index
        // this.$router.push({ query: _query })
        // this.emitPage(index - 1)emitPage
        this.emitPage(index)
      }
    },
    emitPage: function (page) {
      this.$emit('on-page', page)
    },
    change (event) {
      const val = event.target.value.trim()
      // 只能是正整数或空,可根据需求修改正则
      if (/^[1-9]\d*$|^$/.test(val)) {
        if (this.pageSource.totalPages < val) {
          this.pageNumber = this.pageSource.totalPages
          event.target.value = this.pageNumber
        } else {
          this.pageNumber = val
        }
      } else {
        event.target.value = this.pageNumber
      }
      // const _query = this.$utils.copy(this.$route.query)
      // _query.page = this.pageNumber - 1
      // this.$router.push({ query: _query })
      this.emitPage(this.pageNumber - 1)
    }
  },
  watch: {
    '$route.query.page' (val) {
      console.debug(val)
      this.$emit('on-page', val)
    },
    config: function (val) {
      console.debug(val)
    },
    'pageSource.number': function (val) {
      this.pageNumber = val + 1
    }
  }
}
</script>
