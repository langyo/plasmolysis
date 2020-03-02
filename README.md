# NickelCat EXP

> 敬告，该框架仍然处于实验状态中，架构与处理方式随时可能发生大的变动。请勿立即用于商业项目。

欢迎使用
NickelCat，该项目皆在探索客户端与服务端一体化开发的可能性，专用于为前端框架提供完备的事件逻辑处理服务。

它可以使开发者得以行云流水般书写用户所能触发的每一个事件，例如点击按钮或向输入框中输入些文字。就像这样：

```js
{
  // ...
  onClickButton: [
    setState({ title: 'The dialog will open for 3s(3000ms) later!' }),
    wait(3000),
    createModel('guideDialog')
  ],
  // ...
}
```

不只是能流畅写成自上而下的逻辑链，在客户端与服务端的逻辑也可以组合在一起，这样我们看到的就是一个更为直观的整体上的逻辑流程。就像这样：

```js
{
  // ...
  onSubmitLoginRequest: [
    createModel('waitDialog', { title: 'Logining...' }, 'loginWaiting'),
    fetch(
      '/api/login',
      (payload, state) => ({ name: state.name, password: state.password })
    ),
    handleOnServer([
      searchDb((payload) => ({ collection: 'users', payload }),
        [
          reply({ state: 'success' })
        ],
        [
          reply({ state: 'fail' })
        ]
      )
    ]),
    destroyModel('loginWaiting'),
    [
      payload => payload.state === 'success',
      createDialog('infoDialog', { title: 'Login success!' }, 'successInfo'),
      wait(3000),
      destoryDialog('successInfo')
    ],
    [
      payload => payload.state === 'fail',
      createDialog('infoDialog', { title: 'Login failed!' }, 'failInfo'),
      wait(3000),
      destoryDialog('failInfo')
    ]
  ]
  // ...
}
```

这个示例演示了一个从服务器验证登录账户的简单逻辑－－先显示正在加载的窗口，紧接着将用户名和密码作为数据向服务器发送请求。服务器根据发来的数据在数据库查表，并根据数据库是否查询到匹配的用户来回复是否成功。在接收到来自服务器的回复后，再根据回复的状态决定显示登录成功或失败的消息。

简而言之，NickelCat 在为开发者构筑一个强劲的后端框架－－只需 React 与
NickelCat，就足以优雅地实现整个业务逻辑模型。它不光可以支撑客户端的界面控制逻辑，并且也能为服务端乃至本地混合应用提供支持。

## 运行示例

> 请注意，该仓库目前仍处于不稳定状态，随时可能发生大的更改；另外，处于 dev 分支的工程甚至可能无法正常运行。

> 由于结构大改，因此就连示例都得全部重写，这个项目目前暂时会是一个概念项目，抱歉。

