<template>
  <!--<vue-editor v-model="content" :height="500" :editorOptions="editorSettings"></vue-editor>-->
  <span>
    <el-alert v-if="placeholder"
              :title="placeholder"
              type="info"
              :closable="false">
    </el-alert>
    <vue-editor style="height: 300px;margin-bottom: 50px;"
                v-if="!disabled"
                :useCustomImageHandler="isBase64"
                @imageAdded="handleImageAdded"
                v-model="content"
                :height="500"
                :disabled:="disabled"></vue-editor>
    <div v-if="disabled"
         v-html="content"
         style="max-height:300px;overflow: auto">

    </div>
  </span>
</template>
<style>
</style>
<script>
import { VueEditor } from 'vue2-editor'
export default {
  name: 'Editor',
  data () {
    return {
      content: '',
      editorSettings: {}
    }
  },
  components: {
    VueEditor
  },
  mounted () {
    this.$nextTick(function () {
    })
  },
  props: {
    value: String,
    valName: String,
    isOnlyRead: Boolean,
    upFile: Function,
    placeholder: String
  },
  created: function () {
    this.content = this.value
    // this.editorSettings.readOnly = this.isOnlyRead
  },
  computed: {
    disabled () {
      return this.isOnlyRead
    },
    isBase64 () {
      console.debug(this.upFile)
      if (this.upFile) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    updateData: function (val) {
      console.debug(val)
      this.$emit('on-change', val, this.valName)
    },
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      console.debug(file)
      const self = this
      const reader = new window.FileReader()
      reader.onload = function (ef) {
        const data = {
          filename: file.name,
          type: file.type,
          content: ef.target.result,
          group: 'editor'
        }
        if (self.upFile) {
          self.upFile({ body: data })
            .then((da) => {
              console.debug(da)
              const url = da.url // Get url from response
              Editor.insertEmbed(cursorLocation, 'image', url)
              resetUploader()
            }).catch((err) => { console.debug(err) })
        }
      }
      reader.readAsDataURL(file)
    }
  },
  watch: {
    value: function (val) {
      this.content = val
    },
    content: function (val) {
      console.debug(val)
      this.updateData(val)
    }
  }
}
</script>
