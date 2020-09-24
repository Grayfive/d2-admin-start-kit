<template>
  <d2-container>
    <template slot="header">Page 1 header</template>
    Hello World
    <list></list>
  </d2-container>
</template>

<script>
import list from '@/components/zhc-crud/List'
export default {
  name: 'page1',
  components: {
    list
  }
}
</script>
