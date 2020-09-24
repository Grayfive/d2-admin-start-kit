/*
* 工具类
* */
function copy (val) {
  const json = JSON.stringify(val)
  return JSON.parse(json)
}
function copyTo (ol, ne) {
  for (const k in ne) {
    ol[k] = ne[k]
  }
  return ol
}
function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
function trim (str) {
  if (str) {
    const trimLeft = /^\s+/
    const trimRight = /\s+$/
    const s = str.replace(trimLeft, '').replace(trimRight, '')
    return s
  }
  return ''
}
function isNull (str) {
  let t = true
  if (str) {
    if (str.constructor === String) {
      const s = trim(str)
      if (s.length > 0) {
        t = false
      }
    } else if (str.constructor === Array) {
      if (str.length > 0) {
        t = false
      }
    } else {
      t = false
    }
  }
  return t
}
function isNullAndNum (str) {
  let t = true
  if (str) {
    if (str.constructor === String) {
      const s = trim(str)
      if (s.length > 0) {
        t = false
      }
    } else if (str.constructor === Array) {
      if (str.length > 0) {
        t = false
      }
    } else {
      t = false
    }
  } else {
    if (str === 0) {
      return false
    }
  }
  return t
}
function objectCount (val) {
  let c = 0
  if (typeof val === 'object') {
    for (const k in val) {
      console.debug(k)
      c++
    }
  } else {
    c = val.length
  }
  return c
}
function dataURLtoBlob (dataurl) {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
// 将blob转换为file
function blobToFile (theBlob, fileName) {
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  return theBlob
}
// 获得钱
function getPrice (val, w) {
  if (!val) {
    return 0
  }
  let s = 0
  if (typeof val === 'string') {
    try {
      s = Number(val)
    } catch (e) {
      console.log(e)
    }
  } else {
    s = val
  }
  s = s * 1
  s = s / 100.0
  if (s >= 10000 && w) {
    s = s / 10000.0
    return s.toFixed(2) + w
  } else {
    return s.toFixed(2)
  }
}
function install (Vue) {
  const $utils = {
    copy,
    copyTo,
    isExternal,
    trim,
    isNull,
    objectCount,
    dataURLtoBlob,
    blobToFile,
    getPrice,
    isNullAndNum
  }
  Vue.prototype.$utils = $utils
  console.log('安装utils插件成功')
}
export default install
