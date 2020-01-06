# NickelCat EXP

该框架皆在探索客户端与服务端一体化开发的可能性——网站与本地应用的大部分 UI 构建使用同一份源码，客户端与服务端（B/S 或 C/S）间的数据库对接均使用同一份配置文件性质的源码（换句话讲，客户端的发包、接包与服务端的监听、读写数据库是写在同一份源码中的，由框架自动将其展开），以及再不同平台环境下对项目的正确转译、打包等。

该框架仍处于试验研发阶段，未来将以发布至 NPM 的形式供广大程序员使用。

当前开发的版本暂时为服务端 - 客户端模式的框架，未来计划将会同时支持 SPA 应用缓存与本地应用的开发（分别使用 Electron 与 Cordova）。

## 运行示例

> 请注意，该仓库目前仍处于不稳定状态，随时可能发生大的更改；另外，处于 dev 分支的工程甚至可能无法正常运行。
>
> 如需运行稳定版本，请切换到 master 分支再运行。
>
> 请确保您的机器上已经安装了 Git、NodeJS；如需运行示例应用，还需要安装 MongoDB，并请确保 MongoDB 的服务正在运行。

1. 克隆本仓库

```shell
git clone https://github.com/langyo/nickelcat
# 如需运行稳定版本，请运行下一条命令，切换到 master 分支
git checkout master
# 如需运行开发版本，请运行下一条命令，切换到 dev 分支
git checkout dev
```

2. 安装依赖

```shell
npm install
# 如需运行示例应用，请运行下面一批指令，以同时解决示例应用的依赖
cd demo/template
npm install
```

3. 运行

```shell
# 如尚未进入示例应用文件夹，请先进入该文件夹
cd demo/template
# 运行
npm run serve
# 运行（开发者模式）
npm start
```
