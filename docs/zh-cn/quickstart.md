# 快速开始

NickelCat 本质上是一个运行于服务端的 Node.js 应用框架，因此我们需要至少在机器上准备好 Node 与 NPM 两者，以支持应用的运行。

接下来，我们可以通过项目模板创建工具```create-nickel-app```快速准备好一份应用。首先在命令行窗口中将其安装到全局环境：

```shell
npm install create-nickel-app -g
```

然后在您喜欢的文件位置执行下面的命令：

```shell
create-nickel <应用名>
```

应用的名字是可以随意自定的，主要用作提供给工具部署新项目的文件夹名。如果不提供应用名，该工具会自动将当前命令行所在的文件夹作为项目目录，所有文件会部署在当前文件夹下。

我们暂且就取名叫```demo```吧。执行过后，我们需要进入该文件夹：

```shell
cd demo
```

可以看到文件夹的结构是像这样的：

```
/demo
  /node_modules
  /components
    /pages
      index.js
    /views
      footer.js
    /models
      alert.js
  /controllets
    /pages
      index.js
    /views
      footer.js
    /models
      alert.js
    global.js
  nickel.config.js
  package.json
  .gitignore
```

在部署时，该工具会帮您顺带做好解决依赖库的任务，自动选择合适的依赖库控制工具运行。

整体来看，其中的```components```文件夹专用于放置显示给用户看的内容，每一个文件都代表着一个打包好的 React 组件；另外的```controllers```文件夹则用于为刚刚的一系列组件提供数据与动作触发器，使得这些组件可以在用户的引导下处理数据、对外通信、展示结果；```nickel.config.js```则是专属于这个框架的配置文件，它可以决定项目的很多内容。

我们要运行这个项目，可以在刚刚的文件夹下执行```npm start```，一段时间后框架便会将应用准备好，开放在本地的 3000 端口。您可以通过访问 [https://localhost:3000](https://localhost:3000/) 体验。

Enjoy!
