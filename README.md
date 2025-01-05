# aim

> Forked from [mindustry_admin](https://gitee.com/ydlover/mindustry_admin)

> [中文介绍](README-CN.md)

## 
Add more commands.

<-- You can preview it in 139.196.113.128:33330 -->

## how to use
### 1,automatic
> Download [releases.zip](https://github.com/byzp/aim/releases)

> Decompress the compressed package.

> Run start.sh(linux) or start.bat(windows),Of course, it can also be started in a conventional way.

> Mod aimLoader.zip is used to load aim, please do not delete it.

### 2,manual
> Clone this repository.

> Move the aim folder to the server folder.

> Start the server.

> Enter this in the console.

```js
js Vars.mods.scripts.context.evaluateString(Vars.mods.scripts.scope, new Packages.arc.files.Fi("aim/Aim.js").readString(),"aim/Aim.js", 1)
```