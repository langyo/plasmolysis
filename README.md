# NickelCat Framework
## 服务端轻量级协作框架

欢迎使用 NickelCat 框架，该项目皆在探索同构开发新范式的可能性，致力于为新一代互联网应用提供良好的基础设施。

## 如何使用？

> 请先在您的机器上安装 Git 与 NodeJS。

1. 在终端下克隆该项目 ```git clone https://github.com/langyo/plasmolysis```。

2. 进入项目目录，运行 ```npm install``` 或 ```yarn```（如果您的机器已经安装了 Yarn，推荐使用）；NPM 会自动运行 Gulp 构建任务，同时帮助您下载各个子包的依赖。

> TIP: 如果您的网络环境处于中国大陆，可以使用该仓库下的 shell 脚本切换 NPM 源为淘宝镜像源，以加速依赖库下载过程：
>
> ```https://github.com/langyo/cnpm-registry-helper```

3. 执行 ```npm run build``` 或 ```npm run watch``` 即可构建项目。

4. 要想在本地直接调试该项目，可在构建项目后执行 ```npm run debug-global-link```，然后使用 Yarn 在其它项目下进行链接（即执行 ```yarn link xxx```）。

## 敬告

由于个人学业问题，该项目于 2020 年 9 月 3 日进入冻结状态，不定期更新。在此期间，所有可能出现的 issues 与 pull requests 均会推迟到恢复维护时审核。

感谢这两年来支持我的朋友们、同好们，也感谢在一些评比中青睐该项目的评委们！

该项目现处于半成品状态，许多功能尚且不完善，但所有的基础设施已规划部署完毕，任何人均可参考该项目的源码。
