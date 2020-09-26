<template>
  <div>
    <!-- 多图片上传 list-type="picture-card"-->
    <el-upload v-if="multiple"
               action='string'
               list-type="picture"
               :on-preview="handlePreview"
               :auto-upload="false"
               :on-remove="handleRemove"
               :http-request="upload"
               :on-change="consoleFL"
               :file-list="uploadList"
               :disabled="disabled"
               :limit="limit"
               :accept="accept"
               :on-exceed="handleExceed">
      <el-button v-if="!disabled"
                 size="small"
                 type="primary">点击上传</el-button>
      <div v-if="!disabled"
           slot="tip"
           class="el-upload__tip">最多上传{{limit}}张，只能上传jpg/png文件，且不超过500kb</div>
      <!--<i class="el-icon-plus"></i>-->
    </el-upload>
    <!-- 单图片上传 -->
    <el-upload v-else
               class="avatar-uploader"
               action="'string'"
               :auto-upload="false"
               :show-file-list="false"
               :on-change="handleCrop"
               :http-request="upload"
               :accept="accept"
               :disabled="disabled">
      <img v-if="imageUrl"
           :src="imageUrl"
           class="avatar"
           ref="singleImg"
           @mouseenter="mouseEnter"
           @mouseleave="mouseLeave"
           :style="{width:width+'px',height:height+'px'}">
      <i v-else
         class="el-icon-plus avatar-uploader-icon"
         :style="{width:width+'px',height:height+'px','line-height':height+'px','font-size':height/6+'px'}"></i>
      <!-- 单图片上传状态显示 -->
      <!-- <div v-if="imageUrl" class="reupload" ref="reupload" @click.stop="handlePreviewSingle" @mouseenter="mouseEnter" @mouseleave="mouseLeave" :style="{width:reuploadWidth+'px',height:reuploadWidth+'px','line-height':reuploadWidth+'px','font-size':reuploadWidth/5+'px'}">重新上传</div> -->
      <div id="uploadIcon"
           v-if="imageUrl"
           ref="reupload"
           @mouseenter="mouseEnter"
           @mouseleave="mouseLeave"
           :style="{width:'100%'}">
        <i class="el-icon-zoom-in"
           @click.stop="handlePreviewSingle"
           :style="{color:'#2E2E2E',fontSize:'25px',display:'inline-block',paddingRight:'15px'}"></i>
        <i class="el-icon-upload"
           :style="{color:'#2E2E2E',fontSize:'25px',display:'inline-block'}"></i>
      </div>
      <div class="reupload"
           ref="uploading"
           :style="{width:reuploadWidth+'px',height:reuploadWidth+'px','line-height':reuploadWidth+'px','font-size':reuploadWidth/5+'px'}">
        上传中..
      </div>
      <div class="reupload"
           ref="failUpload"
           :style="{width:reuploadWidth+'px',height:reuploadWidth+'px','line-height':reuploadWidth+'px','font-size':reuploadWidth/5+'px'}">
        上传失败
      </div>
    </el-upload>
    <!-- 多图片预览弹窗 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%"
           :src="dialogImageUrl"
           alt="">
    </el-dialog>
    <!-- 剪裁组件弹窗 -->
    <el-dialog :visible.sync="cropperModel"
               width="800px"
               :before-close="beforeClose">
      <Cropper :img-file="file"
               ref="vueCropper"
               :fixedNumber="fixedNumber"
               :fixed="conf.fixed"
               :fixedBox="conf.fixedBox"
               :canMove="conf.canMove"
               :canMoveBox="conf.canMoveBox"
               @upload="upload">
      </Cropper>
    </el-dialog>
  </div>
</template>
<script>
import Cropper from './CropperUtil'
import axios from 'axios'
export default {
  name: 'uploader',
  props: {
    upFile: Function,
    dataSource: Object,
    conf: Object,
    disabled: {
      type: Boolean,
      default: false
    },
    // multiple: {
    //     // 多图开关
    //     type: Boolean,
    //     default: true
    // },
    initUrl: {
      // 初始图片链接
      default: ''
    },
    fixedNumber: {
      // 剪裁框比例设置
      default: function () {
        return [3, 1]
      }
    },
    width: {
      // 单图剪裁框宽度
      type: Number,
      default: 178
    },
    height: {
      // 单图剪裁框高度
      type: Number,
      default: 178
    }
  },
  computed: {
    limit () {
      return this.conf.limit ? this.conf.limit : 5
    },
    accept () {
      return this.conf.accept ? this.conf.accept : 'image/jpeg,image/jpg,image/png'
    }
  },
  data () {
    return {
      multiple: true,
      file: '', // 当前被选择的图片文件
      imageUrl: '', // 单图情况框内图片链接
      dialogImageUrl: '', // 多图情况弹窗内图片链接
      uploadList: [], // 上传图片列表
      reupload: true, // 控制"重新上传"开关
      dialogVisible: false, // 展示弹窗开关
      cropperModel: false, // 剪裁组件弹窗开关
      reuploadWidth: this.height * 0.7 // 动态改变”重新上传“大小
    }
  },
  updated () {
    if (this.$refs.vueCropper) {
      this.$refs.vueCropper.Update()
    }
  },
  watch: {
    initUrl: function (val) {
      // 监听传入初始化图片
      console.info('watch')
      console.info(val)
      if (val || val === '') {
        if (typeof this.initUrl === 'string') {
          this.imageUrl = val
          if (this.conf.multiple != null && this.conf.multiple !== undefined) {
            this.multiple = this.conf.multiple
          } else {
            this.multiple = false
          }
        } else {
          this.uploadList = this.formatImgArr(val)
          if (this.conf.multiple != null && this.conf.multiple !== undefined) {
            this.multiple = this.conf.multiple
          } else {
            this.multiple = true
          }
        }
      }
    }
  },
  mounted () {
    if (typeof this.initUrl === 'string') {
      this.imageUrl = this.initUrl
      if (this.conf.multiple != null && this.conf.multiple !== undefined) {
        this.multiple = this.conf.multiple
      } else {
        this.multiple = false
      }
    } else {
      this.uploadList = this.formatImgArr(this.initUrl)
      if (this.conf.multiple != null && this.conf.multiple !== undefined) {
        this.multiple = this.conf.multiple
      } else {
        this.multiple = true
      }
    }
  },
  methods: {
    /** **************************** multiple多图情况 **************************************/
    handlePreview (file) {
      // 点击进行图片展示
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove (file, fileList) {
      // 删除图片后更新图片文件列表并通知父级变化
      this.uploadList = fileList
      this.$emit('imgupload', this.formatImgArr(this.uploadList))
      this.$emit('on-change', this.formatImgArr(this.uploadList), this.conf.valName)
    },
    consoleFL (file, fileList) {
      console.debug('consoleFL')
      // 弹出剪裁框，将当前文件设置为文件
      const fileType = this.conf.accept ? this.conf.accept : 'image/jpeg，image/jpg，image/png'
      if (fileType.indexOf(file.raw.type) === -1) {
        const fileTypeArr = fileType.split('image/')
        this.$message.error('只能上传' + fileTypeArr.join(' ') + '格式图片')
        this.uploadList.splice(this.uploadList.length, 1)
      } else {
        this.file = file
        this.uploadList = fileList
        if (!this.conf.closeCropper) {
          this.cropperModel = true
        } else {
          const reader = new window.FileReader()
          reader.onload = (ef) => {
            this.upload(ef.target.result, file.raw)
          }
          reader.readAsDataURL(file.raw)
        }
      }
    },
    /************************************************************************************/

    /** **************************** single单图情况 **************************************/
    handlePreviewSingle (file) {
      // 点击进行图片展示
      console.debug(file)
      if (this.file) {
        this.dialogImageUrl = this.file.url
      } else {
        this.dialogImageUrl = this.imageUrl
      }
      this.dialogVisible = true
    },
    mouseEnter () { // 鼠标划入显示“重新上传”
      this.$refs.reupload.style.display = 'block'
      if (this.$refs.failUpload.style.display === 'block') {
        this.$refs.failUpload.style.display = 'none'
      }
      this.$refs.singleImg.style.opacity = '0.6'
    },
    mouseLeave () {
      // 鼠标划出隐藏“重新上传”
      this.$refs.reupload.style.display = 'none'
      this.$refs.singleImg.style.opacity = '1'
    },
    handleCrop (file) {
      // 点击弹出剪裁框
      console.debug('handleCrop')
      const fileType = this.conf.accept ? this.conf.accept : 'image/jpeg，image/jpg，image/png'
      if (fileType.indexOf(file.raw.type) === -1) {
        const fileTypeArr = fileType.split('image/')
        this.$message.error('只能上传' + fileTypeArr.join(' ') + '格式图片')
      } else {
        file.url = URL.createObjectURL(file.raw)
        // this.cropperModel = true
        this.file = file
        if (!this.conf.closeCropper) {
          this.cropperModel = true
        } else {
          const reader = new window.FileReader()
          reader.onload = (ef) => {
            this.upload(ef.target.result, file.raw)
          }
          reader.readAsDataURL(file.raw)
        }
        // this.imageUrl = file.url
      }
    },
    upload (val, file) {
      // 自定义upload事件
      if (!this.multiple) {
        // 如果单图，则显示正在上传
        this.$refs.uploading.style.display = 'block'
      }
      const self = this
      if (!window.FileReader) {
        window.alert('您的浏览器版本过低')
      }
      // let reader = new window.FileReader()
      const data = {
        filename: new Date().getTime(),
        type: 'png',
        content: val,
        channel: 'oss',
        group: self.conf.group || 'common'
      }
      // 采用简介上传
      console.debug('调试')
      if (this.upFile) {
        this.upFile().then((da) => {
          console.debug(file)
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
            console.log(res)
            if (!self.multiple) {
              // 上传完成后隐藏正在上传
              self.$refs.uploading.style.display = 'none'
            }
            const currentPic = da.FILE_VIEW_URL + res.data.data
            if (self.multiple) {
              self.uploadList.pop()
              self.uploadList.push({
                url: currentPic,
                uid: '111',
                name: `图${self.uploadList.length + 1}`
              })
              self.$emit('imgupload', self.formatImgArr(self.uploadList))
              self.$emit('on-change', self.formatImgArr(self.uploadList), self.conf.valName)
            } else {
              this.file.url = currentPic
              self.$emit('imgupload', currentPic)
              self.$emit('on-change', currentPic, self.conf.valName)
            }
          })
        }).catch(() => {
          // 上传失败则显示上传失败，如多图则从图片列表删除图片
          if (!self.multiple) {
            self.$refs.failUpload.style.display = 'block'
          } else {
            self.uploadList.pop()
          }
        })
      }
      // 这里是直接上传
      // if (this.upFile) {
      //   this.upFile({ body: data })
      //     .then((da) => {
      //       if (!self.multiple) {
      //         // 上传完成后隐藏正在上传
      //         self.$refs.uploading.style.display = 'none'
      //       }
      //       const currentPic = da.url
      //       if (self.multiple) {
      //         self.uploadList.pop()
      //         self.uploadList.push({
      //           url: currentPic,
      //           uid: '111',
      //           name: `图${self.uploadList.length + 1}`
      //         })
      //         self.$emit('imgupload', self.formatImgArr(self.uploadList))
      //         self.$emit('on-change', self.formatImgArr(self.uploadList), self.conf.valName)
      //       } else {
      //         this.file.url = currentPic
      //         self.$emit('imgupload', currentPic)
      //         self.$emit('on-change', currentPic, self.conf.valName)
      //       }
      //     }).catch(() => {
      //       // 上传失败则显示上传失败，如多图则从图片列表删除图片
      //       if (!self.multiple) {
      //         self.$refs.failUpload.style.display = 'block'
      //       } else {
      //         self.uploadList.pop()
      //       }
      //     })
      // }
      //
      // self.$api.apis.method.upFile({body: data})
      //     .then((da)=>{
      //             if (!self.multiple) {
      //                 // 上传完成后隐藏正在上传
      //                 self.$refs.uploading.style.display = 'none'
      //             }
      //             const currentPic = da.url
      //             if (self.multiple) {
      //                 self.uploadList.pop()
      //                 self.uploadList.push({
      //                     url: currentPic,
      //                     uid: '111'
      //                 })
      //                 self.$emit('imgupload', self.formatImgArr(self.uploadList))
      //                 self.$emit('on-change',self.formatImgArr(self.uploadList),self.conf.valName)
      //             } else {
      //                 this.file.url = currentPic
      //                 self.$emit('imgupload', currentPic)
      //                 self.$emit('on-change',currentPic,self.conf.valName)
      //             }
      //     }).catch(()=>{
      //             // 上传失败则显示上传失败，如多图则从图片列表删除图片
      //             if (!self.multiple) {
      //                 self.$refs.failUpload.style.display = 'block'
      //             } else {
      //                 self.uploadList.pop()
      //             }
      // })
      this.cropperModel = false
    },
    formatImgArr (arr) {
      if (arr) {
        const result = arr.map((item, index) => {
          if (typeof item === 'string') {
            return {
              url: item,
              uid: `index${index}`,
              name: `图${index + 1}`
            }
          } else {
            return item.url
          }
        })
        return result
      } else {
        return []
      }
    },
    beforeClose (done) {
      console.debug(done)
      this.uploadList.pop()
      this.cropperModel = false
    },
    handleExceed () {
      this.$notify.error({
        // title: response.status,
        title: '错误提示',
        message: `最多只能上传${this.limit}张图片`
      })
    }
  },
  components: {
    Cropper
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  color: #8c939d;
  text-align: center;
}

.avatar {
  display: block;
}

.reupload {
  border-radius: 50%;
  position: absolute;
  color: #fff;
  background-color: #000000;
  opacity: 0.6;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}

#uploadIcon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
}
</style>
