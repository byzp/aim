"use strict";

Aim.maptags.test={
    datas:{
        test:0
    },
    create:function(tag){
        infoLog("test")
    },
    update30:function(tag){
        infoLog("update30! test= "+tag.test)
        tag.test++
    }
}

Aim.maptags.js={
    datas:{
    },
    create:function(tag){
        say(Vars.mods.scripts.runConsole(tag.value))
    },
}

Aim.maptags.tickjs={
    datas:{
        result:""
    },
    update:function(tag){
        tag.datas.result=Vars.mods.scripts.runConsole(tag.value)
    },
}