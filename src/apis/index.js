/* eslint-disable no-unused-vars */

const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
const ms = []
for (const k in modules) {
  modules[k].forEach((a) => {
    ms.push(a)
  })
}
const apis = [
  ...ms
]
export default apis
