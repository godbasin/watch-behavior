# watch

小程序自定义组件扩展 behavior，watch 属性实现

> 使用此 behavior 需要依赖小程序基础库 2.2.3 以上版本，同时依赖开发者工具的 npm 构建。具体详情可查阅[官方 npm 文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

## 使用方法

1. 安装 watch：

```
npm install --save miniprogram-watch
```

2. 作为 behavior 引入

```js
const watchBehavior = require("miniprogram-watch");

Component({
  behaviors: [watchBehavior],
  properties: {
    propA: {
      type: Number,
      value: 0
    }
  },
  data: {
    a: 0,
    b: {
      c: {
        d: 33
      },
      e: [1, 2, [3, 4]]
    }
  },
  watch: {
    propA(val, oldVal) {
      console.log("propA new: %s, old: %s", val, oldVal);
    },
    a(val, oldVal) {
      console.log("a new: %s, old: %s", val, oldVal);
    },
    "b.c.d": function(val, oldVal) {
      console.log("b.c.d new: %s, old: %s", val, oldVal);
    },
    "b.e[2][0]": function(val, oldVal) {
      console.log("b.e[2][0] new: %s, old: %s", val, oldVal);
    },
    "b.e[3][4]": function(val, oldVal) {
      console.log("b.e[3][4] new: %s, old: %s", val, oldVal);
    }
  },
  methods: {
    onTap() {
      this.setData({
        a: 2,
        "b.c.d": 3,
        "b.e[2][0]": 444,
        c: 123
      });
      this.triggerEvent("update");
    }
  }
});
```

```xml
<view>a={{a}}</view>
<view>b.c.d={{b.c.d}}</view>
<view>b.e[2][0]={{b.e[2][0]}}</view>
<view>c={{c}}</view>
<view>prop: {{propA}}</view>
<button bindtap="onTap">click</button>
```

## 如何在 Page 里使用 watch

参考：[《小程序的奇技淫巧之 computed 计算属性》](https://godbasin.github.io/2018/12/23/wxapp-computed/)    
Tips: `Component`是`Page`的超集，[《使用 Component 构造器构造页面》](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)    

## watch 的实现参考
[jayZOU/watch](https://github.com/jayZOU/watch)
