<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}"
               icon="el-icon-upload"
               size="mini"
               type="primary"
               @click=" dialogVisible=true">
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload action='string'
                 :multiple="true"
                 :file-list="fileList"
                 :show-file-list="true"
                 :on-remove="handleRemove"
                 :on-success="handleSuccess"
                 :before-upload="beforeUpload"
                 class="editor-slide-upload"
                 :http-request="upload"
                 list-type="picture-card">
        <el-button size="small"
                   type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        关闭
      </el-button>
      <el-button type="primary"
                 @click="handleSubmit">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import axios from 'axios'
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    },
    upFile: Function
  },
  data () {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
      // upFile: this.$api.apis.method.upFile
    }
  },
  methods: {
    upload (val) {
      const file = val.file
      console.debug(file)
      const self = this
      const reader = new window.FileReader()
      reader.onload = function (ef) {
        const data = {
          filename: file.name,
          type: file.type,
          content: ef.target.result,
          group: 'editor',
          channel: 'oss'
        }
        if (self.upFile) {
          // 采用简介上传
          self.upFile()
            .then((da) => {
              const formData = new FormData()
              formData.append('file', file)
              formData.append('uploadSubPath', data.group)
              axios({
                headers: {
                  Authorization: `Bearer ${da.token}`,
                  'Content-Type': 'multipart/form-data;charse=UTF-8'
                },
                url: da.FILE_UPDATE_URL,
                method: 'post',
                data: formData,
                processData: false, // 告诉axios不要去处理发送的数据(重要参数)
                contentType: false // 告诉axios不要去设置Content-Type请求头
              }).then((res) => {
                const currentPic = da.FILE_VIEW_URL + res.data.data
                const uid = file.uid
                const objKeyArr = Object.keys(self.listObj)
                for (let i = 0, len = objKeyArr.length; i < len; i++) {
                  if (self.listObj[objKeyArr[i]].uid === uid) {
                    self.listObj[objKeyArr[i]].url = currentPic
                    self.listObj[objKeyArr[i]].hasSuccess = true
                    return
                  }
                }
              }).catch(() => {
                self.handleRemove(file)
              })
            }).catch(() => {
              self.handleRemove(file)
            })
          // self.upFile({ body: data })
          //   .then((da) => {
          //     const uid = file.uid
          //     const objKeyArr = Object.keys(self.listObj)
          //     for (let i = 0, len = objKeyArr.length; i < len; i++) {
          //       if (self.listObj[objKeyArr[i]].uid === uid) {
          //         self.listObj[objKeyArr[i]].url = da.url
          //         self.listObj[objKeyArr[i]].hasSuccess = true
          //         return
          //       }
          //     }
          //   }).catch(() => {
          //     self.handleRemove(file)
          //   })
        }
      }
      reader.readAsDataURL(file)
    },
    checkAllSuccess () {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit () {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess (response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove (file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload (file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function () {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  .el-upload--picture-card {
    width: 100%;
  }
}
</style>
