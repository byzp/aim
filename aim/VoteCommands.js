"use strict";

Aim.commands[";restart"]={
    func:(p,t,ma)=>{
        Aim.vote.add("$restart",p)
    },
    args:"$aim.command.restart.desc",
    desc:"$aim.command.restart.desc",
    show:true,
    vote:true,
    muteable:true
}
Aim.commands[";host"]={
    func:(p,t,m)=>{
        let ma=t[1]
        let map=Vars.maps.all().find(mx=>mx.name().replace(/ /g,"_")==ma)
        if(map!=null){
            Aim.vote.add("$"+m.substring(1,m.length),p)
        }else{
            p.sendMessage(bundle(p,"unknownMap",ma))
        }
    },
    args:"$aim.command.host.args",
    desc:"$aim.command.host.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";hostx"]={
    func:(p,t,ma)=>{
        let m=t[1]
        let id=0
        let map=Vars.maps.all().find(mx=>{let re=id==m;id++;return re})
        if(map!=null){
            Aim.vote.add("$"+ma.substring(1,ma.length)+"  \n"+map.name(),p)
        }else{
            p.sendMessage(bundle(p,"unknownMap",m))
        }
    },
    args:"$aim.command.hostx.args",
    desc:"$aim.command.hostx.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";rtv"]={
    func:(p,t,ma)=>{
        Aim.vote.add("$rtv",p)
    },
    args:"$aim.command.rtv.args",
    desc:"$aim.command.rtv.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";gameover"]={
    func:(p,t,m)=>{
        Aim.vote.add("$gameover "+p.team().id+"  \n"+p.team()+" "+p.name.replace(/\[.*?\]/g,""),p)
    },
    args:"",
    desc:"$aim.command.gameover.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";load"]={
    func:(p,t,m)=>{
        let name=m.substring(6,m.length).replace(/ /g,"_")
        if(Aim.io.exists("config/saves/"+name+".msav")){
            Aim.vote.add("$load "+name,p)
        }
    },
    args:"$aim.command.load.args",
    desc:"$aim.command.load.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";save"]={
    func:(p,t,m)=>{
        let name=m.substring(6,m.length).replace(/ /g,"_")
        Aim.vote.add("$save "+name,p)
    },
    args:"$aim.command.save.args",
    desc:"$aim.command.save.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";kick"]={
    func:(p,t,m)=>{
        let player=getPlayer(t[1]);
        if(player==null){
            p.sendMessage(bundle(p,"notFound"))
            return
        }
        Aim.vote.add("$"+m.substring(1,m.length)+"  \n"+player.name,p)
    },
    args:"$aim.command.kick.args",
    desc:"$aim.command.kick.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";killall"]={
    func:(p,t,m)=>{
        if(!Vars.state.rules.infiniteResources){
            p.sendMessage("sandbox only");
            return;
        }
        Aim.vote.add("$"+m.substring(1,m.length),p)
    },
    args:"",
    desc:"$aim.command.killall.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";runwave"]={
    func:(p,t,m)=>{
        if(t[1]==undefined){
            m+=" 1";
        }
        if((t[1])>20){
            p.sendMessage(bundle(p,"maxRunwave"));
            return;
        }
        let name=m.substring(9,m.length)
        Aim.vote.add("$runwave "+name,p)
    },
    args:"$aim.command.runwave.args",
    desc:"$aim.command.runwave.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";nethostx"]={
    func:(p,t,m)=>{
        if(t[1]==undefined){
            p.sendMessage(bundle(p,"unknownMap",m));
            return;
        }
        let arg=m.substring(10,m.length)
        if(t[1].length!=5) Aim.io.get(Aim.mapUrl+"/api/getInfo?id="+t[1],info=>{
            if(info!="not found!"){
                let inf=eval("("+info+")");
                Aim.vote.add("$nethostx "+arg+"  \n"+inf.mapName,p)
                say(inf.mapName)
                
            }else{
                p.sendMessage(bundle(p,"unknownMap",t[1]))
            }
        });else {
            Aim.io.get(Aim.mapUrl+"/mdt.wayzer.top/api/maps/thread/"+t[1]+"/latest",info=>{
            if(info!="MapThread not found"){
                let inf=eval("("+info+")");
                Aim.vote.add("$nethostx "+arg+"  \n"+inf.tags.name,p)
                say(inf.tags.name)
            }else{
                p.sendMessage(bundle(p,"unknownMap",t[1]))
            }
        })
        }
    },
    args:"$aim.command.nethostx.args",
    desc:"$aim.command.nethostx.desc",
    show:true,
    vote:true,
    muteable:true
}
Aim.commands[";nh"]={
    func:(p,t,m)=>{
        if(t[1]==undefined){
            p.sendMessage(bundle(p,"unknownMap",m));
            return;
        }
        let arg=m.substring(3,m.length)
        if(t[1].length!=5) Aim.io.get(Aim.mapUrl+"/api/getInfo?id="+t[1],info=>{
            if(info!="not found!"){
                let inf=eval("("+info+")");
                Aim.vote.add("$nethostx "+arg+"  \n"+inf.mapName,p)
                say(inf.mapName)
                
            }else{
                p.sendMessage(bundle(p,"unknownMap",t[1]))
            }
        });else {
            Aim.io.get(Aim.mapUrl+"/mdt.wayzer.top/api/maps/thread/"+t[1]+"/latest",info=>{
            if(info!="MapThread not found"){
                let inf=eval("("+info+")");
                Aim.vote.add("$nethostx "+arg+"  \n"+inf.tags.name,p)
                say(inf.tags.name)
            }else{
                p.sendMessage(bundle(p,"unknownMap",t[1]))
            }
        })
        }
    },
    args:"$aim.command.nethostx.args",
    desc:"$aim.command.nethostx.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";text"]={
    func:(p,t,m)=>{
        Aim.vote.add("$text "+m.substring(6,m.length),p)
    },
    args:"$aim.command.text.args",
    desc:"$aim.command.text.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";mute"]={
    func:(p,t,m)=>{
        let player=getPlayer(t[1]);
        if(player==null){
            p.sendMessage(bundle(p,"notFound"))
            return
        }
        Aim.vote.add("$mute "+m.substring(6,m.length),p)
    },
    args:"$aim.command.mute.args",
    desc:"$aim.command.mute.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";rmute"]={
    func:(p,t,m)=>{
        /*
        let player=getPlayer(m.);
        if(player==null){
            p.sendMessage("未找到此玩家，可能由于名字含有颜色代码，请尝试使用名字前的三位ID")
            return
        }
        */
        Aim.vote.add("$rmute "+getID(p.uuid()),p)
    },
    args:"$aim.command.rmute.args",
    desc:"$aim.command.rmute.desc",
    show:true,
    vote:true
}

Aim.commands[";fob"]={
    func:(p,t,m)=>{
        let player=getPlayer(t[1]);
        if(player==null){
            p.sendMessage(bundle(p,"notFound"))
            return
        }
        Aim.vote.add("$fob "+m.substring(5,m.length),p)
    },
    args:"$aim.command.fob.args",
    desc:"$aim.command.fob.desc",
    show:true,
    vote:true,
    muteable:true
}

Aim.commands[";rob"]={
    func:(p,t,m)=>{
        Aim.vote.add("$rob "+getID(p.uuid()),p)
    },
    args:"$aim.command.rob.args",
    desc:"$aim.command.rob.desc",
    show:true,
    vote:true
}