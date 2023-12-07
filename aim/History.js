"use strict";

/*
type:
    block build/break
    block config
    block destroy
*/
Aim.history={}

Aim.history.log=(tile,log)=>{
    let index=tile.x+"|"+tile.y
    if(Aim.state.history[index]==undefined){
        Aim.state.history[index]=[]
    }
    let now=new Date(Date.now())
    log.time=now.getUTCDay()+" "+now.getUTCHours()+":"+now.getUTCMinutes()+":"+now.getUTCSeconds()
    Aim.state.history[index].push(log)
}

Aim.history.display=(player,tile)=>{
    
    let index=tile.x+"|"+tile.y
    if(Aim.state.history[index]!=undefined){
        let mess=""
        for(let log of Aim.state.history[index]){
            let add=""
            add="[gray]["+log.time+"][] "
            if(log.type=="destory"){
                add+="[red]["+bundle(player,log.type)+"][] "
            }else{
                add+=(log.type=="unit" ? "[green]" : "[purple]")
                add+="["+bundle(player,log.type)+"][] "
            }
            if(log.type=="player"){
                add+=log.playerName+" "
            }
            if(log.type=="unit"){
                add+=log.unitType+"#"+log.unitId+" "
            }
            if(log.index!=undefined&&log.index.startsWith!=undefined&&log.index.startsWith("$")){
                add+=bundleArray(player,log.index.substring(1,log.index.length),log.args)
            }else{
                add+=log.index+" "+log.args
            }
            mess+=add+"\n"
        }
        Call.label(player.con,mess,10,tile.x*8,tile.y*8)
    }else{
        Call.label(player.con,"nothing "+index,10,tile.x*8,tile.y*8)
    }
}

Aim.history.lastClick={}

Aim.event.requires.tap.push((e)=>{
    let player=e.player
    let tile=e.tile
    if(Aim.history.lastClick[player.uuid()]==tile.x+"|"+tile.y){
        if(Aim.data.getData(player).history==false){
            return;
        }
        Aim.history.display(player,tile)
        Aim.history.lastClick[player.uuid()]=undefined
        return
    }
    Aim.history.lastClick[player.uuid()]=tile.x+"|"+tile.y
})

Aim.history.doing={}

Aim.event.requires.blockBuildBegin.push((e)=>{
    let unit=e.unit
    let player=unit.player
    let tile=e.tile
    Aim.history.doing[unit.id]={
        unit:unit,
        player:player,
        tile:tile,
        breaking:unit.buildPlan().breaking,
        block:unit.buildPlan().block,
        config:unit.buildPlan().config
    }
})

Aim.event.requires.blockBuildEnd.push((e)=>{
    let unit=e.unit
    let tile=e.tile
    let doing=Aim.history.doing[unit.id]
    if(doing==null||doing==undefined) return
    if(doing.breaking){
        Timer.schedule(()=>{
            if(tile.block()==Blocks.air){
                let log={
                    index:"$blockBreak",
                    type:doing.player!=null ? "player" : "unit",
                    unitType:unit.type+"",
                    unitId:unit.id,
                    playerName:doing.player!=null ? doing.player.name : null,
                    args:[
                        doing.block+""
                    ]
                }
                Aim.history.log(tile,log)
            }
        },0.017)
    }else{
        if(tile.block()!=Blocks.air){
            let log={
                index:"$blockBuild",
                type:doing.player!=null ? "player" : "unit",
                unitType:unit.type+"",
                unitId:unit.id,
                playerName:doing.player!=null ? doing.player.name : null,
                args:[
                    tile.block()+""
                ]
            }
            Aim.history.log(tile,log)
            Aim.state.lastConfig[tile.x+"|"+tile.y]=doing.config
        }
    }
    //delete Aim.history.doing[unit.id]
})

Aim.event.requires.config.push((e)=>{
    let player=e.player
    let tile=e.tile.tile
    let config=e.tile.config()
    if(player!=null){
        let log={
        index:"$config",
        type:"player",
        playerName:player!=null ? player.name : null,
        args:[
            tile.block()+"",
            Aim.state.lastConfig[tile.x+"|"+tile.y]+"",
            config+""
        ]
        }
        Aim.history.log(tile,log)
        Aim.state.lastConfig[tile.x+"|"+tile.y]=config
    }
})

Aim.event.requires.blockDestroy.push((e)=>{
    let tile=e.tile
    let log={
    index:"$destory",
    type:"destory",
    args:[]
    }
    Aim.history.log(tile,log)
})