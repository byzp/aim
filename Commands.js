"use strict";

//basic command

Aim.commands[";aimver"]={
    func:function(p,t,m) {
        p.sendMessage("aim "+Aim.version+"\nbuild"+Aim.build+"\nby awa(LSP237198162@163.com)\naaa改版，需要源码请联系我(1394026378@qq.com)")
    },
    args:"",
    desc:"show aim version",
    show:false
}

Aim.commands[";mapinfo"]={
    func:function(p,t,m) {
        let mess="";
        mess+="name:"+Vars.state.map.name()+"\n";
        mess+=" version:"+Vars.state.map.version+"\n";
        mess+="author:"+Vars.state.map.author()+"\n";
        mess+="desc:"+Vars.state.map.description();
        Call.infoMessage(p.con,mess);
    },
    args:"",
    desc:"",
    show:false
}

Aim.commands[";help"]={
    func:(p,t,m)=>{
        let page=[]
        let i=0
        let x=""
        for(let a in Aim.commands){
            let c=Aim.commands[a]
            if(c.show){
                let args=c.args
                let desc=c.desc
                if(args.startsWith("$")) args=bundle(p,args.substring(1,args.length))
                if(desc.startsWith("$")) desc=bundle(p,desc.substring(1,desc.length))
                if(c.vote) x+="[acid]<V> []"
                x+="[orange]"+a+"[lightgray] "+args+"\n [gray]-"+desc+"\n[white]"
                i++
                if(i>8){
                    i=0
                    page.push(x)
                    x=""
                }
            }
        }
        if(x!="") page.push(x)
        i=0
        x=""
        for(let a in Aim.skillCommands){
            let c=Aim.skillCommands[a]
            if(c.show){
                let args=c.args
                let desc=c.desc
                if(args.startsWith("$")) args=bundle(p,args.substring(1,args.length))
                if(desc.startsWith("$")) desc=bundle(p,desc.substring(1,desc.length))
                x+="[cyan]<S> [][orange]"+a+"[lightgray] "+args+"\n [gray]-"+desc+"\n[white]"
                if(c.use!=undefined&&c.use.show!=undefined) x+=c.use.usePoint+" "+c.use.usePower+" LV."+c.use.minLevel+"\n"
                i++
                if(i>8){
                    i=0
                    page.push(x)
                    x=""
                }
            }
        }
        if(x!="") page.push(x)
        i=0
        x=""
        if(p.admin){
            for(let a in Aim.adminCommands){
                let c=Aim.adminCommands[a]
                if(c.show){
                    let args=c.args
                    let desc=c.desc
                    if(args.startsWith("$")) args=bundle(p,args.substring(1,args.length))
                    if(desc.startsWith("$")) desc=bundle(p,desc.substring(1,desc.length))
                    x+="[scarlet]<A> [][orange]"+a+"[lightgray] "+args+"\n [gray]-"+desc+"\n[white]"
                    i++
                    if(i>8){
                        i=0
                        page.push(x)
                        x=""
                    }
                }
            }
        }
        if(x!="") page.push(x)
        /*
        for(let a=page.length-1;a>=0;a--){
            Call.infoMessage(p.con,page[a])
        }
        */
        Aim.op.textList(p,page,0);
    },
    args:"",
    desc:"$aim.command.help.desc",
    show:true
}

Aim.commands[";"]={
    func:(p,t,m)=>{
        let status={};
        let selects=[
            ["观察者模式"],
            ["随机换图"],
            ["跳波(一轮)"],
            ["投降"],
            ["更换队伍"],
            ["命令列表"],
            ["地图列表"],
            ["close"]
        ];
        let menuId=Menus.registerMenu((p,select)=>{
            if(select==0){
                Aim.commands[";ob"].func(p,"","");
                return;
            }
            if(select==1){
                Aim.commands[";rtv"].func(p,"","");
                return;
            }
            if(select==2){
                Aim.commands[";runwave"].func(p,["",1],";runwave 1");
                return;
            }
            if(select==3){
                Aim.commands[";gameover"].func(p,"","");
                return;
            }
            if(select==4){
                Aim.commands[";ct"].func(p,"","");
                //selects[4][0]=selects[4][0].replace("$team",p.team().id);
                //listFn(p);
                return;
            }
            if(select==5){
                Aim.commands[";help"].func(p,"","");
                return;
            }
            if(select==6){
                Aim.commands[";maps"].func(p,"","");
                return;
            }
            if(select==7){
                return;
            }
        })
        let listFn=function(p){
            Call.menu(p.con,menuId,"","快捷指令",selects);
        }
        listFn(p);
    },
    args:"",
    desc:" ",
    show:false
}
//Aim.commands[";；"]=Aim.commands[";help"];

Aim.commands[";lang"]={
    func:function(p,t,m) {
        /*
        if(t.length>1){
            if(Aim.bundles[t[1]]==undefined){
                p.sendMessage("unknown lang:"+t[1])
                return
            }
            let d=Aim.data.getData(p)
            d.lang=t[1]
        }else{
            let ty=""
            for(let name in Aim.bundles){
                ty+=name+"\n"
            }
            p.sendMessage(ty)
        }*/
        Aim.op.chooseLang(p)
    },
    args:"",
    desc:" set your lang",
    show:false
}

Aim.commands[";info"]={
    func:function(p,t,m){
        let data=Aim.data.getData(p)
        let mess="---"+bundle(p,"pinfo")+"---\n"
        mess+=":"+(Math.floor(data.point*1000)/1000)+"/"+(Math.floor(data.pointCap*1000)/1000)+" "+data.pointReplyTime+"s/1\n"
        mess+=":"+(Math.floor(data.power*1000)/1000)+"/"+(Math.floor(data.powerCap*1000)/1000)+" "+data.powerReplyTime+"s/1\n"
        if(!data.canUse) mess+="[yellow]<!> "+bundle(p,"isOverload")+" <!>[white]\n"
        mess+=bundle(p,"totalScore")+":"+(Math.floor(data.totalScore*1000)/1000)+"\n"
        mess+=bundle(p,"exp")+":"+(Math.floor(data.exp*1000)/1000)+"/"+data.level+"\n"
        mess+=bundle(p,"level")+":"+data.level
        for(let id in data.scores){
            mess+="\n"+bundle(p,"score."+Aim.score.all.name[id])+" - "+data.scores[id]
        }
        Call.infoMessage(p.con,mess)
    },
    args:"",
    desc:"$playerInfo",
    show:false
}


Aim.commands[";y"]={
    func:(p,t,m)=>{
        let vote=Aim.vote.votes[t[1]]
        if(vote==undefined){
            p.sendMessage(bundle(p,"invVote",t[1]))
            return
        }
        let command=vote.command
        if(vote.command.startsWith("$")) command=vote.command.substring(1,vote.command.length)
        let cmd=Aim.voteCommands[command.split(" ")[0]]
        command=command.replace("  "," ")
        if(!cmd.canVote(p,vote.player,command.split(" "),command)){
            p.sendMessage(bundle(p,"invVote",t[1]))
            return
        }
        if(vote.voted[p.uuid()]!=undefined){
            p.sendMessage(bundle(p,"youAreVoted"))
            return
        }
        vote.voted[p.uuid()]=1
        vote.y+=1
        vote.endTime+=Aim.data.config.addVoteTime*1000
        let spl=vote.command.split(" ")
        Groups.player.each(p=>{
            if(Aim.data.config.displayVoteProgress) p.sendMessage(bundle(p,"aim.voteAgree",vote.y,vote.n,spl[0],vote.command.substring(spl[0].length+1,vote.command.length),t[1],t[1],""))
        })
    },
    args:"$aim.command.vid",
    desc:"$aim.command.y.desc",
    show:false
}

Aim.commands[";n"]={
    func:(p,t,m)=>{
        let vote=Aim.vote.votes[t[1]]
        if(vote==undefined){
            p.sendMessage(bundle(p,"invVote",t[1]))
            return
        }
        let command=vote.command
        if(vote.command.startsWith("$")) command=vote.command.substring(1,vote.command.length)
        let cmd=Aim.voteCommands[command.split(" ")[0]]
        command=command.replace("  "," ")
        if(!cmd.canVote(p,vote.player,command.split(" "),command)){
            p.sendMessage(bundle(p,"invVote",t[1]))
            return
        }
        if(vote.voted[p.uuid()]!=undefined){
            p.sendMessage(bundle(p,"youAreVoted"))
            return
        }
        vote.voted[p.uuid()]=0
        vote.n+=1
        vote.endTime+=Aim.data.config.addVoteTime*1000
        let spl=vote.command.split(" ")
        Groups.player.each(p=>{
            if(Aim.data.config.displayVoteProgress) p.sendMessage(bundle(p,"aim.voteOppose",vote.y,vote.n,spl[0],vote.command.substring(spl[0].length+1,vote.command.length),t[1],t[1],""))
        })
    },
    args:"$aim.command.vid",
    desc:"$aim.command.n.desc",
    show:false
}

Aim.commands[";maps"]={
    func:function(p,t,m){
        Vars.maps.reload()
        let mess=[]
        if(this.firstPage!=null) mess.push(this.firstPage)
        let i=0
        let id=0
        let me=""
        Vars.maps.all().each(map=>{
            me+=id+" "+map.name().replace(/ /g,"_")+"[white]\n"
            id++
            i++
            if(i>8){
                mess.push(me)
                me=""
                i=0
            }
        })
        if(me!="") mess.push(me)
        /*
        for(let a=mess.length-1;a>=0;a--){
            Call.infoMessage(p.con,mess[a])
        }
        */
        Aim.op.textList(p,mess,0);
        /*
        let f=this;
        //try{
            Aim.io.get(Aim.mapUrl+"/api/getFirstMapPage",(d)=>{
                f.firstPage=d
            })*/
        //}catch(e){
           // p.sendMessage("$aim.error.mapUrl");
        //}
    },
    args:"",
    desc:"$aim.command.maps.desc",
    show:true,
    firstPage:null
}

Aim.commands[";slots"]={
    func:(p,t,m)=>{
        let mess=[]
        let i=0
        let id=0
        let me=""
        for(let name of Aim.io.ls("config/saves/")){
            if(name.endsWith(".msav")){
                me+=name.replace(".msav","")+"[white]\n"
                id++
                i++
                if(i>8){
                    mess.push(me)
                    me=""
                    i=0
                }
            }
        }
        if(me!="") mess.push(me)
        /*
        for(let a=mess.length-1;a>=0;a--){
            Call.infoMessage(p.con,mess[a])
        }
        */
        Aim.op.textList(p,mess,0);
    },
    args:"",
    desc:"$aim.command.slots.desc",
    show:true
}


Aim.commands[";blacklist"]={
    func:(p,t,m)=>{
        let mess=[]
        let i=0
        let me=""
        for(let uuid in Aim.data.blacklist){
            let info=Aim.data.blacklist[uuid]
            if(info.unbantime<Date.now()) continue
            me+=uuid.substring(0,3)+" "+info.name+"[white]\n"
            me+=bundle(p,"admin")+":"+info.admin+"[white]\n"
            let t=parseInt((Date.now()-info.bantime)/1000)
            let time=parseInt(t/86400)+bundle(p,"day")
            time+=parseInt(t/3600)%24+bundle(p,"hour")
            time+=parseInt(t/60)%60+bundle(p,"minute")
            time+=parseInt(t)%60+bundle(p,"second")
            me+=bundle(p,"aim.bantime",time)+"\n"
            if(info.unbantime==0||info.unbantime==undefined){
                me+=bundle(p,"permanent")+"\n"
            }else{
                let t=info.unbantime-Date.now()
                t=parseInt(t/1000)
                let time=parseInt(t/86400)+bundle(p,"day")
                time+=parseInt(t/3600)%24+bundle(p,"hour")
                time+=parseInt(t/60)%60+bundle(p,"minute")
                time+=parseInt(t)%60+bundle(p,"second")
                me+=time+"\n"
            }
            me+=bundle(p,"reason")+":"+info.reason+"\n"
            i++
            if(i>3){
                mess.push(me)
                me=""
                i=0
            }
        }
        if(me!="") mess.push(me)
        /*
        for(let a=mess.length-1;a>=0;a--){
            Call.infoMessage(p.con,mess[a])
        }
        */
        Aim.op.textList(p,mess,0);
    },
    args:"",
    desc:"$aim.command.blacklist.desc",
    show:false
}

Aim.commands[";tell"]={
    func:(p,t,m)=>{
        let pl=getPlayer(t[1])
        let mess=Aim.op.arrayToString(t,2," ")
        mess=Aim.op.messageFilter(mess);
        Call.sendMessage(pl.con,"<t->"+bundle(pl,"me")+" "+Vars.netServer.chatFormatter.format(p,mess),mess,p)
        Call.sendMessage(p.con,"<t->"+pl.name+" "+Vars.netServer.chatFormatter.format(p,mess),mess,p)
    },
    args:"$aim.command.tell.args",
    desc:"$aim.command.tell.desc",
    show:false,
    muteable:true
}

Aim.commands[";broad"]={
    func:(p,t,m)=>{
        let data=Aim.data.getData(p)
        data.broad=!data.broad
        
    },
    args:"",
    desc:"$aim.command.broad.desc",
    show:true
}

Aim.commands[";health"]={
    func:(p,t,m)=>{
        let data=Aim.data.getData(p)
        data.health=!data.health
    },
    args:"",
    desc:"$aim.command.health.desc",
    show:true
}

Aim.commands[";oldMode"]={
    func:(p,t,m)=>{
        let data=Aim.data.getData(p)
        data.oldMode=!data.oldMode
    },
    args:"",
    desc:" ; -> * ",
    show:false
}

Aim.commands[";votemenu"]={
    func:(p,t,m)=>{
        let data=Aim.data.getData(p)
        data.voteMenu=!data.voteMenu
    },
    args:"",
    desc:"$aim.command.votemenu.desc",
    show:true
}

Aim.commands[";history"]={
    func:(p,t,m)=>{
        let data=Aim.data.getData(p)
        if(data.history==undefined) data.history=true
        data.history=!data.history
    },
    args:"",
    desc:"$aim.command.history.desc",
    show:true
}
/*
Aim.commands[";rank"]={
    func:(p,t,m)=>{
        let arr=[]
        for(let k in Aim.data.userinfo){
            if(Aim.data.userinfo[k].active!=undefined){
                arr.push(Aim.data.userinfo[k])
            }
        }
        let sort=arr.sort(function(a,b){
            return b.totalScore - a.totalScore
        })
        let mess=bundle(p,"totalScore")
        let inn=false
        for(let i in sort){
            mess+="\n"+(+i+1)+" :"+sort[i].name+"  "+(Math.floor(sort[i].totalScore*1000)/1000)
            if(sort[i].name==p.name) inn=true
            if(i==7) break
        }
        let i=sort.map(m=>m.name).indexOf(p.name)
        if(!inn) mess+="\n\n...\n"+(i+1)+" :"+p.name+" "+(Math.floor(sort[i].totalScore*1000)/1000)
        Call.infoMessage(p.con,mess)
        for(let id in Aim.score.all.name){
            let name=Aim.score.all.name[id]
            sort=arr.sort(function(a,b){
                return b.scores[id] - a.scores[id]
            })
            mess=bundle(p,"score."+name)
            let inn=false
            for(let i in sort){
                mess+="\n"+(+i+1)+" :"+sort[i].name+"  "+(Math.floor(sort[i].scores[id]*1000)/1000)
                if(sort[i].name==p.name) inn=true
                if(i==7) break
            }
            let i=sort.map(m=>m.name).indexOf(p.name)
            if(!inn) mess+="\n\n...\n"+(i+1)+" :"+p.name+" "+(Math.floor(sort[i].scores[id]*1000)/1000)
            Call.infoMessage(p.con,mess)
        }
    },
    args:"",
    desc:"rank",
    show:false
}
*/
Aim.commands[";modes"]={
    func:(p,t,m)=>{
        let page=[]
        let i=0
        let x=""
        for(let a in Aim.gameModes){
            if(a=="temp"||a=="menu") continue;
            x+=Aim.gameModes[a].modeName+" - "+a+" "+Aim.gameModes[a].otherName.join(",")+"\n"+(Aim.gameModes[a].desc?Aim.gameModes[a].desc.startsWith("$")?bundle(p,Aim.gameModes[a].desc.susbtring(1))+"\n":Aim.gameModes[a].desc+"\n":"");
            i++
            if(i>10){
                i=0
                page.push(x)
                x=""
            }
        }
        if(x!="") page.push(x)
        Aim.op.textList(p,page,0)
    },
    args:"",
    desc:"$aim.command.modes.desc",
    show:false
}

Aim.commands[";modeinfo"]={
    func:(p,t,m)=>{
        let mode=Aim.op.getMode(t[1]);
        if(mode.getInfo!=undefined){
            mode.getInfo(p)
        }else{
            let guides=eval("("+JSON.stringify(mode.guides)+")")
            if(guides!=undefined){
                for(let ind in guides){
                    if(guides[ind].startsWith("$")) guides[ind]=bundle(p,guides[ind].substring(1,guides[ind].length));
                    Aim.op.textList(p,guides,0)
                }
            }else{
                
            }
        }
    },
    args:"$aim.command.modeinfo.args",
    desc:"$aim.command.modeinfo.desc",
    show:false
}