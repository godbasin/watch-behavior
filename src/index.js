// watch 实现，参考https://github.com/jayZOU/watch

module.exports = Behavior({
  lifetimes: {
    created() {
      this._originalSetData = this.setData
      this.setData = this._setData
      this._setDataTimes = 0
    }
  },
  definitionFilter(defFields) {
    const watch = defFields.watch || {}
    const watchPaths = Object.keys(watch)
    const observers = new Map()

    // 触发key的对应回调
    function notify(key, newVal, oldVal) {
      if (!observers.has(key)) return
      if (newVal === oldVal) return
      if (this._setDataTimes > 5) {
        // eslint-disable-next-line no-console
        console.warn('max call setData in watch function!')
        this._setDataTimes = 0
        return
      }
      this._setDataTimes += 1
      observers.get(key).call(this, newVal, oldVal)
    }

    function getPathArr(path) {
      const REG_KEY = /\[((?:\S+?))\]|\./g
      return path
        .toString()
        .split(REG_KEY)
        .filter(item => !!item)
    }

    // 根据路径获取对应 key 的 value
    function getKeyData(data, path) {
      const pathArr = getPathArr(path)
      return pathArr.reduce((res, currentPath) => {
        const currentValueType = Object.prototype.toString.call(res)
        return /String|Number|Boolean|Null|Undefined/.test(currentValueType)
          ? undefined
          : res[currentPath]
      }, data)
    }

    // 更新值并触发回调 并更新视图
    function checkAndNotify(obj, originData) {
      const oldData = JSON.parse(JSON.stringify(originData))
      Object.keys(obj).forEach(path => {
        if (observers.has(path)) {
          notify.call(this, path, obj[path], getKeyData(oldData, path))
        }
      })
    }

    // 初始化 watch
    const initWatch = () => {
      defFields.data = defFields.data || {}

      // 先将 properties 里的字段写入到 data 中
      const data = defFields.data
      const properties = defFields.properties
      const hasOwnProperty = Object.prototype.hasOwnProperty
      if (properties) {
        // eslint-disable-next-line complexity
        Object.keys(properties).forEach(key => {
          const value = properties[key]
          let oldObserver
          if (
            value === null ||
            value === Number ||
            value === String ||
            value === Boolean ||
            value === Object ||
            value === Array
          ) {
            properties[key] = {
              type: value
            }
          } else if (typeof value === 'object') {
            if (hasOwnProperty.call(value, 'value')) {
              // 处理值
              data[key] = value.value
            }

            // 若 properties 原有 observer，记录下来
            if (
              hasOwnProperty.call(value, 'observer') &&
              typeof value.observer === 'function'
            ) {
              oldObserver = value.observer
            }
          }

          // 追加 observer，用于监听变动
          properties[key].observer = function (...args) {
            const originalSetData = this._originalSetData

            this._setDataTimes = 0

            // 做 watch
            notify.call(this, key, ...args)

            // 做 watch 属性的 setData
            originalSetData.call(this, ...args)

            if (oldObserver) oldObserver.apply(this, args)
          }
        })
      }
      // check if data.path exist
      function isDataExist(path) {
        return getKeyData(defFields.data, path) !== undefined
      }

      // 将 watch 数据写入观察者队列
      watchPaths.forEach(path => {
        if (isDataExist(path)) {
          observers.set(path, watch[path])
        }
      })
    }

    initWatch()

    defFields.methods = defFields.methods || {}
    defFields.methods._setData = function (data, callback) {
      const originalSetData = this._originalSetData

      this._setDataTimes = 0

      // 做 watch
      checkAndNotify.call(this, data, this.data)

      // 做 data 属性的 setData
      originalSetData.call(this, data, callback)
    }
  }
})
