# frakta

> An electron-vue project基于electron-vue技术栈的整合项目，将医院设备命令行代码转化为图形界面展示，形成一个适用于相关业务的流程产品。

# electron-vue 环境搭建、创建项目
npm install -g vue-cli

vue init simulatedgreg/electron-vue my-project

cd my-project

#### Build Setup

``` bash
# install dependencies
yarn  or npm install or cnpm install

# serve with hot reload at localhost:9080
yarn run dev  or npm run dev

# ubuntu下首次安装的话可能会需要安装libgconf2-4插件
sudo apt -y install libgconf2-4

# build electron application for production
npm run build

# electron 下载慢解决方案
1.可以去阿里云的electron https://npm.taobao.org/mirrors/electron 
镜像下好对应版本的electron，然后放到自己的缓存目录 不同系统的缓存目录
Linux: $XDG_CACHE_HOME or ~/.cache/electron/
MacOS: ~/Library/Caches/electron/
Windows: $LOCALAPPDATA/electron/Cache or ~/AppData/Local/electron/Cache/

2.electron-builder关联工具下载慢活着下不下来
报错例如 downloading path=/Users/xiangc/Library/Caches/electron-builder/wine/wine-2.0.3-mac-10.13 url=https://github.com/electron-userland/electron-builder-binaries/releases/download/wine-2.0.3-mac-10.13/wine-2.0.3-mac-10.13.7z

类似报错的依赖还有winCodeSign，nsis-resources，app-builder等等

手动下载，然后解压到

~/Library/Caches/electron-builder/

# run unit & end-to-end tests
npm test

# lint all JS/Vue component files in `src/`
npm run lint

```
#### 代码核心点是node.js与shell语言的改写
主要用到node.js原生的方法子进程child_process

    exec('+命令行+',(error,stdout,stderr) => {
            if(error){
                console.log(`执行的错误: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        })
通过此命令行改写可以执行shell脚本语言
    // 模板复用供复制
    const { exec } = require("child_process");
        exec("", (error, stdout, stderr) => {
        if (error) {
            console.log(`执行的错误: ${error}`);
            this.$logger.info(error);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        this.$logger.info(stdout);
        this.$logger.info(stderr);
    });
---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
