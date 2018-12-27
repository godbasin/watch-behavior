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

Cobehaviors: [watchBehavior],
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
  // 可以将需要监听的数据放入 watch 里面，当数据改变时推送相应的订阅事件
  // 支持 data 以及 properties 的监听
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
      // 不在 data 里面的数据项不会放入观察者列表，比如这里的'b.e[3][4]'
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
参考：[《小程序的奇技淫巧之 watch 观察属性》](https://godbasin.github.io/2018/12/26/wxapp-watch/)    
Tips: `Component`是`Page`的超集，[《使用 Component 构造器构造页面》](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)   
> 事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用`Component`构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应`json`文件中包含`usingComponents`定义段。  

## watch 的实现参考
[jayZOU/watch](https://github.com/jayZOU/watch)
