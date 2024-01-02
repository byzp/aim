"use strict";

Aim.vote={pause:false}
Aim.vote.votes=[]
Aim.vote.menus=[]
Aim.vote.add=(command,player)=>{
    let vote={}
    vote.y=0;vote.n=0
    vote.time=Aim.data.config.voteTime
    vote.t=command.split(" ")
    vote.command=command
    vote.player=player
    vote.endTime=Date.now()+(Aim.data.config.voteTime*1000)
    vote.voted={}
    let id=Aim.vote.votes.length
    if(Aim.vote.votes.indexOf(undefined)!=-1){
        id=Aim.vote.votes.indexOf(undefined)
    }
    vote.id=id;
    Aim.vote.votes[id]=vote
    let sp=command.split(" ")
    command=sp[0]
    let body=""
    for(let i=1;i<sp.length;i++){
        body+=" "+sp[i]
    }
    vote.body=body
    vote.hand=command
    if(Aim.vote.menus[id]==undefined){
        Aim.vote.menus[id]=Menus.registerMenu((p,s)=>{
            if(s==2) return;
            if(s==0){
                Aim.commands[";y"].func(p,[0,id],"");
            }else{
                Aim.commands[";n"].func(p,[0,id],"");
            }
        })
    }
    Groups.player.each(p=>{
        if(Aim.data.getData(p).voteMenu!=false){
            Aim.vote.displayVote(p,vote);
        }
    })
    Groups.player.each(p=>{
        p.sendMessage(bundle(p,"aim.voteStart",command,body+"[white]",player.name,id,id))
    })
}
Aim.vote.through=(vote,id)=>{
    let command=vote.command
    if(vote.command.startsWith("$")) command=vote.command.substring(1,vote.command.length)
    let cmd=Aim.voteCommands[command.split(" ")[0]]
    command=command.replace("  "," ")
    Groups.player.each(p=>{
        p.sendMessage(bundle(p,"aim.voteThrough",vote.y,vote.n,vote.player.name,vote.hand,vote.body+"[white]"))
    })
    if(command.indexOf("\n")!=-1){
        command=command.substring(0,command.indexOf("\n"));
    }
    if(cmd!=undefined){
        cmd.func(vote.player,command.split(" "),command,false)
    }
    Aim.vote.votes[id]=undefined
    Groups.player.each(p=>{
    })
}
Aim.vote.fail=(vote,id)=>{
    Groups.player.each(p=>{
        p.sendMessage(bundle(p,"aim.voteFail",vote.y,vote.n,vote.player.name,vote.hand,vote.body+"[white]"))
    })
    Aim.vote.votes[id]=undefined
    Groups.player.each(p=>{
    })
}

Aim.event.requires.update1.push(()=>{
    if(Aim.vote.pause) return;
    for(let id in Aim.vote.votes){
        let vote=Aim.vote.votes[id]
        if(vote==undefined) continue
        vote.time=Math.ceil((vote.endTime-Date.now())/1000)
        if(vote.time<=0){
            if(vote.y-vote.n>Aim.data.config.minVoteAgree){
                Aim.vote.through(vote,id)
            }else{
                Aim.vote.fail(vote,id)
            }
        }else{
            let mp=Groups.player.size()
            let command=vote.command
            if(vote.command.startsWith("$")) command=vote.command.substring(1,vote.command.length)
            let cmd=Aim.voteCommands[command.split(" ")[0]]
            if(cmd!=undefined&&cmd.getPlayers!=undefined){
                mp=cmd.getPlayers(vote);
                //debugLog(cmd.getPlayers(vote));
            }
            if(vote.y>mp/2){
                Aim.vote.through(vote,id)
            }else if(vote.n>mp/2){
                Aim.vote.fail(vote,id)
            }else if(vote.y+vote.n>=mp){
                Aim.vote.fail(vote,id)
            }
        }
    }
})

Aim.event.requires.update1.push(()=>{
    Groups.player.each(p=>{
        let m=""
        for(let vid in Aim.vote.votes){
            let vote=Aim.vote.votes[vid]
            if(vote!=undefined&&vote.voted!=undefined){
                m+="[#ffffff][id:"+Aim.op.zero(vid,2)+"]["+bundle(p,"time")+":"+Aim.op.zero(vote.time,3)+"]\n"
                if(Aim.data.config.displayVoteProgress) m+=(vote.voted[p.uuid()]==1?"[#00ff00]":"")+"[y:"+Aim.op.zero(vote.y,2)+"][#ffffff]"+(vote.voted[p.uuid()]==0?"[#00ff00]":"")+"[n:"+Aim.op.zero(vote.n,2)+"]\n"
                m+=vote.player.name+"[white]\n"
                let x=vote.command+""
                if(x.startsWith("$")){
                    let start=x.split(" ")[0]
                    x=x.replace(start,bundle(p,start.substring(1,start.length)))
                }
                x=x.replace(/\[white\]/g,"\ufee0")
                x=x.replace(/\[black\]/g,"\ufee1")
                x=x.replace(/\[lightgray\]/g,"\ufee2")
                x=x.replace(/\[gray\]/g,"\ufee3")
                x=x.replace(/\[darkgray\]/g,"\ufee4")
                x=x.replace(/\[pink\]/g,"\ufee5")
                x=x.replace(/\[purple\]/g,"\ufee6")
                x=x.replace(/\[violet\]/g,"\ufee7")
                x=x.replace(/\[red\]/g,"\ufee8")
                x=x.replace(/\[orange\]/g,"\ufee9")
                x=x.replace(/\[yellow\]/g,"\ufeea")
                x=x.replace(/\[green\]/g,"\ufeeb")
                x=x.replace(/\[cyan\]/g,"\ufeec")
                x=x.replace(/\[sky\]/g,"\ufeed")
                x=x.replace(/\[blue\]/g,"\ufeee")
                x=x.replace(/\[gold\]/g,"\ufeef")
                
                /*
                if(x!=""){
                    m+=x;
                    let ite=0;
                    let itet=0;
                    while(itet!=-1){
                        itet=m.indexOf("\n",ite);
                        while(itet-ite>14){
                            let ttt=m.split("");
                            ttt.splice(ite+14,0,"\n");
                            m=ttt.join("");
                            ite+=14;
                        }
                */
                
                while(x!=""){
                    if(x.length<=14){
                        m+=x;
                        break;
                    }
                    m+=x.substring(0,14)+"\n"
                    x=x.substring(14,x.length)
                }
            }
        }
        
        m=m.replace(/\ufee0/g,"[white]");
        m=m.replace(/\ufee1/g,"[black]");
        m=m.replace(/\ufee2/g,"[lightgray]");
        m=m.replace(/\ufee3/g,"[gray]");
        m=m.replace(/\ufee4/g,"[darkgray]");
        m=m.replace(/\ufee5/g,"[pink]");
        m=m.replace(/\ufee6/g,"[purple]");
        m=m.replace(/\ufee7/g,"[violet]");
        m=m.replace(/\ufee8/g,"[red]");
        m=m.replace(/\ufee9/g,"[orange]");
        m=m.replace(/\ufeea/g,"[yellow]");
        m=m.replace(/\ufeeb/g,"[green]");
        m=m.replace(/\ufeec/g,"[cyan]");
        m=m.replace(/\ufeed/g,"[sky]");
        m=m.replace(/\ufeee/g,"[blue]");
        m=m.replace(/\ufeef/g,"[gold]");
        
        
        Call.infoPopup(p.con,m,1,Align.right,0,0,0,0)
    })
})

Aim.vote.displayVote=(player,vote)=>{
    let command=vote.command
    if(vote.command.startsWith("$")) command=vote.command.substring(1,vote.command.length)
    let cmd=Aim.voteCommands[command.split(" ")[0]]
    command=command.replace("  "," ")
    if(cmd!=undefined&&!cmd.canVote(player,vote.player,command.split(" "),command)) return;
    cmd=vote.command.startsWith("$")?bundle(player,vote.command.substring(1,(vote.command+" ").indexOf(" "))):vote.command.substring(0,(vote.command+" ").indexOf(" "))
    Call.menu(player.con,Aim.vote.menus[vote.id],bundle(player,"vote"),cmd+vote.body,[[bundle(player,"agree"),bundle(player,"oppose")],[bundle(player,"hide")]])
}