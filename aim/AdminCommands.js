"use strict";

Aim.adminCommands[";a"]={
    func:(p,t,m)=>{
        if(!p.admin){
            p.sendMessage(bundle(p,"youAreNotAAdmin"))
            return
        }
        let cmd=Aim.voteCommands[t[1]]
        if(cmd==undefined){
            p.sendMessage(bundle(p,"aim.errorCmd",t[1]))
            return
        }
        if(cmd.a==undefined){
            p.sendMessage(bundle(p,"canNotUseA",t[1]))
            return
        }
        let em=m.substring(3,m.length)
        let et=em.split(" ")
        cmd.func(p,et,em,true)
    },
    args:"$aim.command.a.args",
    desc:"$aim.command.a.desc",
    show:true
}

Aim.adminCommands[";js"]={
    func:(p,t,m)=>{
        if(Aim.data.config.jsIsEnabled&&p.admin){
            var res=Vars.mods.scripts.runConsole(m.substring(4,m.length))
            infoLog(p.uuid(),m+">"+res)
            p.sendMessage(res)
        }
    },
    args:"<srcipt...>",
    desc:"run javaScript",
    show:true
}

Aim.adminCommands[";reloadmaps"]={
    func:(p,t,m)=>{
        Aim.io.runCmd("reloadmaps")
    },
    args:"",
    desc:"$aim.command.reloadmaps.desc",
    show:true
}

Aim.adminCommands[";ban"]={
    func:(p,array,m)=>{
        //debugLog(array)
        let id=array[1]
        let player=getPlayer(id)
        if(player==null) player={
            name:array[1],
            uuid:()=>array[1]
        }
        let time=[]
        if(array[2]!=undefined) time=array[2].split(";")
        let addt=undefined
        if(array[2]!="inf"){
            addt=0
            for(let ti of time){
                let tim=parseFloat(ti.substring(0,ti.length-1))
                if(ti.endsWith("d")){
                    addt+=tim*86400*1000
                }else if(ti.endsWith("h")){
                    addt+=tim*60*60*1000
                }else if(ti.endsWith("m")){
                    addt+=tim*60*1000
                }else if(ti.endsWith("s")){
                    addt+=tim*1000
                }
            }
        }
        if(addt==0){
            addt=undefined
        }else if(addt!=undefined){
            addt=Date.now()+addt
        }
        let reason=Aim.op.arrayToString(array,3," ")
        let obj={
            name:player.name,
            reason:reason,
            bantime:Date.now(),
            unbantime:addt,
            admin:p.name
        }
        Aim.data.blacklist[player.uuid()]=obj
        let bl=obj
        if(player.con!=undefined){
            mess=bundle(player,"aim.inBlacklistM")+"\n"
            if(bl.unbantime!=undefined){
            let t=bl.unbantime-Date.now()
            t=parseInt(t/1000)
            let time=parseInt(t/86400)+bundle(player,"day")
            time+=parseInt(t/3600)%24+bundle(player,"hour")
            time+=parseInt(t/60)%60+bundle(player,"minute")
            time+=parseInt(t%60)+bundle(player,"second")
            mess+=bundle(player,"aim.inBlacklistT",time)+"\n"
            }else{
            mess+=bundle(player,"permanent")+"\n"
            }
            reason=bl.reason
            if(reason.startsWith("$")) reason=bundle(player,reason.substring(1,reason.length))
            mess+=bundle(player,"reason")+":\n"+reason
            player.con.kick(mess,0)
        }
		let t=(obj.unbantime-Date.now())/1000
        sayX("aim.ban",player.name,bl.reason,parseInt(t/86400),parseInt(t/3600)%24,parseInt(t/60)%60,parseInt(t%60))
    },
    args:"$aim.command.ban.args",
    desc:"$aim.command.ban.desc",
    show:true
}

Aim.adminCommands[";unban"]={
    func:(p,t,m)=>{
        let id=t[1]
        let out=null
        let uuid=null
        for(let hand in Aim.data.blacklist){
            if(hand.startsWith(id)){
                out=Aim.data.blacklist[hand]
                uuid=hand
                break
            }
        }
        if(out==null){
            p.sendMessage(bundle(p,"playerNotFound"))
            return
        }
        delete Aim.data.blacklist[uuid]
        let name=""
        try{
            name=" | "+getPlayer(id).name
        }catch(e){
            
        }
        sayX("aim.unban",id,name)
    },
    args:"$aim.command.unban.args",
    desc:"$aim.command.unban.desc",
    show:true
}

Aim.adminCommands[";restart"]={
    func:(p,t,m)=>{
        say("服务器将在5秒后重启");
        Aim.saveData()
        Timer.schedule(()=>{
            java.lang.System.exit(0)
        },5)
        //say("Restart!")
    },
    args:"",
    desc:"$aim.command.restart.desc",
    show:true
}
Aim.adminCommands[";reload"]={
    func:(p,t,m)=>{
        execute("aim/MessageFilters.js");
        execute("aim/Events.js");
        execute("aim/Operation.js");
        execute("aim/GameModes.js");
        execute("aim/Vote.js");
        execute("aim/Score.js");
        execute("aim/Data.js");
        execute("aim/Commands.js");
        execute("aim/Team.js");
        execute("aim/VoteCommands.js");
        execute("aim/AdminCommands.js");
        execute("aim/VoteCommandsExecute.js");
        //execute("aim/Skills.js");
        execute("aim/Sidebars.js");
        execute("aim/History.js");
        execute("aim/MapTagLoader.js");
        execute("aim/Addon.js");
        execute("aim/MapTags.js");
        execute("aim/MenuUI.js");
        execute("aim/test.js");
        /*
        let pl=Aim.players
        let s=Aim.state
        execute("aim/Aim.js")
        Aim.players=pl
        Aim.state=s
        */
    },
    args:"",
    desc:"",
    show:true
}
Aim.adminCommands[";addons"]={
    func:(p,t,m)=>{
        let mess=[]
        let i=0
        let me=""
        for(let name in Aim.addon.info){
            let info=Aim.addon.info[name]
            me+=info.dspname+"[white]\n"
            i++
            if(i>9){
                mess.push(me)
                me=""
                i=0
            }
        }
        if(me!="") mess.push(me)
        for(let a=mess.length-1;a>=0;a--){
            Call.infoMessage(p.con,mess[a])
        }
    },
    args:"",
    desc:"$aim.command.addons.desc",
    show:true
}

Aim.adminCommands[";addoninfo"]={
    func:(p,t,m)=>{
        let name=m.substring(11,m.length)
        if(name=="") return
        let mess=""
        let info=Aim.addon.info[name]
        if(info==undefined){
            p.sendMessage("unknown addon!")
            return
        }
        mess+="version:"+info.version+"\n"
        mess+="author:"+info.author+"\n"
        mess+="description:"+info.description+"\n"
        Call.infoMessage(p.con,mess)
    },
    args:"$aim.command.addoninfo.args",
    desc:"$aim.command.addoninfo.desc",
    show:true
}

Aim.adminCommands[";setbroad"]={
    func:(p,t,m)=>{
        let message=m.substring(10,m.length)
        message=message.replace(/\\n/g,"\n")
        Aim.data.config.broad=message
    },
    args:"$aim.command.setbroad.args",
    desc:"$aim.command.setbroad.desc",
    show:true
}

Aim.adminCommands[";appendbroad"]={
    func:(p,t,m)=>{
        let message=m.substring(13,m.length)
        message=message.replace(/\\n/g,"\n")
        Aim.data.config.broad+=message
    },
    args:"$aim.command.appendbroad.args",
    desc:"$aim.command.appendbroad.desc",
    show:true
}

Aim.adminCommands[";aimcfg"]={
    func:(p,t,m)=>{
        if(t[1]==undefined){
            let message=[]
            let i=0
            let mess=""
            for(let key in Aim.data.config){
                mess+=key+":"
                mess+=Aim.data.config[key]+"\n"
                mess+="[white]"
                i++
                if(i>8){
                    message.push(mess)
                    mess=""
                    i=0
                }
            }
            if(mess!=""){
                message.push(mess)
            }
            for(let i=message.length-1;i>=0;i--){
                Call.infoMessage(p.con,message[i])
            }
            return
        }
        let message=m.substring(8+t[1].length+1,m.length)
        if(!isNaN(message)){
            message=+message
        }else if(message=="true"){
            message=true
        }else if(message=="false"){
            message=false
        }else{
            message=message.replace(/\\n/g,"\n")
        }
        Aim.data.config[t[1]]=message
    },
    args:"$aim.command.aimcfg.args",
    desc:"$aim.command.aimcfg.desc",
    show:true
}

Aim.adminCommands[";team"]={
    func:(p,t,m)=>{
        let team=Team.get(t[1])
        let player=p
        if(t[2]!=undefined) player=getPlayer(t[2])
        player.team(team)
    },
    args:"$aim.command.team.args",
    desc:"$aim.command.team.desc",
    show:true
}

Aim.adminCommands[";spawn"]={
    func:(p,t,m)=>{
        let unit=Vars.content.getByName(ContentType.unit,t[1])
        let team=p.team()
        if(t[2]!=undefined) team=Team.get(t[2])
        let amount=1
        if(t[3]!=undefined) amount= + t[3]
        for(let i=0;i<amount;i++){
            unit.spawn(team,p.x,p.y)
        }
    },
    args:"$aim.command.spawn.args",
    desc:"$aim.command.spawn.desc",
    show:true
}

Aim.adminCommands[";setblock"]={
    func:(p,t,m)=>{
        let rot=0
        if(t[5]!=undefined) rot= + t[5]
        let team=p.team()
        if(t[4]!=undefined) team=Team.get(t[4])
        let block=Vars.content.getByName(ContentType.block,t[3])
        Vars.world.tile(t[1],t[2]).setNet(block,team,rot)
    },
    args:"$aim.command.setblock.args",
    desc:"$aim.command.setblock.desc",
    show:true
}

Aim.adminCommands[";setfloor"]={
    func:(p,t,m)=>{
        let overlay=Blocks.air
        if(t[4]!=undefined) overlay=Vars.content.getByName(ContentType.block,t[4])
        let block=Vars.content.getByName(ContentType.block,t[3])
        Vars.world.tile(t[1],t[2]).setFloorNet(block,overlay)
    },
    args:"$aim.command.setfloor.args",
    desc:"$aim.command.setfloor.desc",
    show:true
}

Aim.adminCommands[";fill"]={
    func:(p,t,m)=>{
        let rot=0
        if(t[7]!=undefined) rot= + t[7]
        let team=p.team()
        if(t[6]!=undefined) team=Team.get(t[6])
        let block=Vars.content.getByName(ContentType.block,t[5])
        let minx=Math.min(t[1],t[3])
        let miny=Math.min(t[2],t[4])
        let maxx=Math.max(t[1],t[3])
        let maxy=Math.max(t[2],t[4])
        for(let x=minx;x<=maxx;x+=block.size){
            for(let y=miny;y<=maxy;y+=block.size){
                try{Vars.world.tile(x,y).setNet(block,team,rot)}catch(e){}
            }
        }
    },
    args:"$aim.command.fill.args",
    desc:"$aim.command.fill.desc",
    show:true
}

Aim.adminCommands[";fillfloor"]={
    func:(p,t,m)=>{
        let overlay=Blocks.air
        if(t[6]!=undefined) overlay=Vars.content.getByName(ContentType.block,t[6])
        let block=Vars.content.getByName(ContentType.block,t[5])
        let minx=Math.min(t[1],t[3])
        let miny=Math.min(t[2],t[4])
        let maxx=Math.max(t[1],t[3])
        let maxy=Math.max(t[2],t[4])
        for(let x=minx;x<=maxx;x++){
            for(let y=miny;y<=maxy;y++){
                try{Vars.world.tile(x,y).setFloorNet(block,overlay)}catch(e){}
            }
        }
    },
    args:"$aim.command.fillfloor.args",
    desc:"$aim.command.fillfloor.desc",
    show:true
}

Aim.adminCommands[";mutei"]={
    func:(p,t,m)=>{
        let addt=-1
        if(t[2]!=undefined&&t[2]!="remove"){
            addt=0
            for(let ti of t[2].split(";")){
                let tim=parseFloat(ti.substring(0,ti.length-1))
                if(ti.endsWith("d")){
                    addt+=tim*86400*1000
                }else if(ti.endsWith("h")){
                    addt+=tim*60*60*1000
                }else if(ti.endsWith("m")){
                    addt+=tim*60*1000
                }else if(ti.endsWith("s")){
                    addt+=tim*1000
                }
            }
        }
        if(t[2]){
            Aim.data.muting[t[1]]=Date.now()+addt
            if(t[2]=="remove") delete Aim.data.muting[t[1]]
        }
        if(!Aim.data.muting[t[1]]){
            p.sendMessage(t[1]+": "+bundle(p,"none"))
        }else{
            p.sendMessage(t[1]+": "+bundle(p,"left")+" "+Aim.op.utcToStr(p,Aim.data.muting[t[1]]-Date.now()))
        }
    },
    args:"$aim.command.mutei.args",
    desc:"$aim.command.mutei.desc",
    show:true
}

Aim.adminCommands[";fobi"]={
    func:(p,t,m)=>{
        let addt=-1
        if(t[2]!=undefined&&t[2]!="remove"){
            addt=0
            for(let ti of t[2].split(";")){
                let tim=parseFloat(ti.substring(0,ti.length-1))
                if(ti.endsWith("d")){
                    addt+=tim*86400*1000
                }else if(ti.endsWith("h")){
                    addt+=tim*60*60*1000
                }else if(ti.endsWith("m")){
                    addt+=tim*60*1000
                }else if(ti.endsWith("s")){
                    addt+=tim*1000
                }
            }
        }
        if(t[2]){
            Aim.state.forceOb[t[1]]=Date.now()+addt
            if(t[2]=="remove") delete Aim.state.forceOb[t[1]]
        }
        if(!Aim.state.forceOb[t[1]]){
            p.sendMessage(t[1]+": "+bundle(p,"none"))
        }else{
            p.sendMessage(t[1]+": "+bundle(p,"left")+" "+Aim.op.utcToStr(p,Aim.state.forceOb[t[1]]-Date.now()))
        }
    },
    args:"$aim.command.fobi.args",
    desc:"$aim.command.fobi.desc",
    show:true
}