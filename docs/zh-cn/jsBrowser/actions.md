# 动作

> 来源于包 ```nickelcat-action-preset```

## setState

该动作用于更改其所在组件的数据，其执行后将会使组件作出一次更新，以将更新的数据同步在用户的屏幕上。

格式如下：
```ts
setState(obj:{ [key: string]: any })
setState(func: (preload:{ [key: string]: any }) =>{ [key: string]: any })
```

其中，第一个版本的函数直接将参数与原有的组件数据进行合并，冲突的部分以传进的参数数据覆盖原来的数据；第二个版本则需要传入具有一个参数的函数，函数接收的参数由组件在调用时提供，其返回的对象将会像第一个版本那样与原有的组件数据合并。

## setData

该动作用于更改全局环境的数据。全局环境通常用于放置一些可以公用的业务数据，或是用于组件与组件间的信息传递等等。

格式如下：
```ts
setData(obj:{ [key: string]: any })
setData(func: (preload:{ [key: string]: any }) =>{ [key: string]: any })
```
)

其中，第一个版本的函数直接将参数与原有的组件数据进行合
并，冲突的部分以传进的参数数据覆盖原来的数据；第二个版
本则需要传入具有一个参数的函数，函数接收的参数由组件在调用时提供，其返回的对象将会像第一个版本那样与原有的组
件数据合并。

## createModel

## destoryModel