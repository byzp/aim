# aim

> [mindustry_admin](https://gitee.com/ydlover/mindustry_admin) 的分支

> [中文介绍](README-CN.md)

## 
添加更多命令

<!-- 你可以在139.196.113.128:33330预览 -->

## 如何使用
### 1,自动
> 下载 [releases.zip](https://github.com/byzp/aim/releases)

> 解压压缩包

> 运行start.sh(linux)或start.bat(windows)，你也可以用常用方式启动它

> aimLoader.zip是用来加载aim的mod，请不要删除它

### 2,手动
> 克隆存储库

> 将aim文件夹移动到服务器文件夹

> 启动服务器

> 在控制台输入这个

```js
js Vars.mods.scripts.context.evaluateString(Vars.mods.scripts.scope, new Packages.arc.files.Fi("aim/Aim.js").readString(),"aim/Aim.js", 1)
```