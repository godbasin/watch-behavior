const _ = require('./utils')
const watchBehavior = require('../src/index')

test('watch: setData', async () => {
  let componentId = await _.load({
    template: '<view>{{a}}</view><view>{{b}}</view>',
    behaviors: [watchBehavior],
    data: {
      a: 0,
      b: 0
    },
    watch: {
      a(val, oldVal) {
        this.setData({
          b: `${val}-${oldVal}`
        })
      },
    },
  })
  let component = _.render(componentId)

  expect(_.match(component.dom, '<wx-view>0</wx-view><wx-view>0</wx-view>')).toBe(true)

  component.setData({a: 1})
  _.sleep(10)
  expect(_.match(component.dom, '<wx-view>1</wx-view><wx-view>1-0</wx-view>')).toBe(true)
  
  component.setData({a: 3})
  expect(_.match(component.dom, '<wx-view>3</wx-view><wx-view>3-1</wx-view>')).toBe(true)
})

test('watch: properties', async () => {
  let componentId1 = await _.load({
    template: '<view>{{a}}</view><view>{{b}}</view>',
    behaviors: [watchBehavior],
    properties: {
      a: {
        type: Number,
        value: 0,
      },
    },
    data: {
      b: 0
    },
    watch: {
      a(val, oldVal) {
        this.setData({
          b: `${val}-${oldVal}`
        })
      },
    },
  })
  let componentId2 = await _.load({
    template: '<comp a="{{a}}"></comp>',
    usingComponents: {
      'comp': componentId1,
    },
    data: {
      a: 0,
    },
  })
  let component = _.render(componentId2)

  expect(_.match(component.dom, '<comp><wx-view>0</wx-view><wx-view>0</wx-view></comp>')).toBe(true)
  
  component.setData({a: 1})
  expect(_.match(component.dom, '<comp><wx-view>1</wx-view><wx-view>1-0</wx-view></comp>')).toBe(true)
  
  component.setData({a: 3})
  expect(_.match(component.dom, '<comp><wx-view>3</wx-view><wx-view>3-1</wx-view></comp>')).toBe(true)
})
