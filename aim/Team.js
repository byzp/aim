"use strict";

/*
    - State: {
        teams:{
            id:{
                locked:false
            }
        },
        players:{
            uuid:{
                team:teamId,
                kicked:[]
            }
        }
    }
    - Commands:
        ;changeTeam 更改队伍
        ;lockTeam 投票锁定队伍
        ;unlockTeam 投票解锁队伍
        ;kickTime 投票将一个玩家踢出队伍
    - Add:
        分配队伍
*/
Aim.team={others:[]}
let OLD_TEAM_ASSIGNER=undefined
Aim.state.teams={}
Aim.state.forceOb={}
Aim.state.teams={
    teams:{},
    players:{}
}
Aim.triggers.resetState.push(()=>{
    Aim.state.teams={
        teams:{},
        players:{}
    }
})

Aim.team.getTeam=(player,teams_,playerss)=>{
    if(!Vars.state.rules.pvp) return Vars.state.rules.defaultTeam;
    if(
      Aim.state.teams.players[player.uuid()]!=undefined&&
      Team.get(Aim.state.teams.players[player.uuid()].team).data().hasCore()&&
      Aim.state.teams.players[player.uuid()].kicked.indexOf(
        Aim.state.teams.players[player.uuid()].team
      )==-1
    ){
        return Team.get(Aim.state.teams.players[player.uuid()].team);
    }
    
    let team=null;
    let teams=[];
    for(let t of teams_){
        if(t.data().hasCore()&&
          (
            Aim.state.teams.teams[t.id]==undefined||
            Aim.state.teams.teams[t.id].locked==false
          )&&
          (
            Aim.state.teams.players[player.uuid()]==undefined||
            Aim.state.teams.players[player.uuid()].kicked.indexOf(t.id)==-1
          )
        ){
            teams.push(t);
        }
        //debugLog(t.data().hasCore())
        //debugLog(JSON.stringify(Aim.state.teams.teams[t.id]))
        //debugLog(JSON.stringify(Aim.state.teams.players[player.uuid()]))
    }
    /*
    for(let x of teams){
        debugLog(x)
    }
    */
    let players={}
    let size=0;
    if(playerss instanceof EntityGroup){
        playerss.each(p=>{
            if(players[p.team().id]==undefined) players[p.team().id]=0;
            players[p.team().id]+=1;
            size++;
        })
    }else{
        let iterator=playerss.iterator()
        while(iterator.hasNext()){
            let p=iterator.next();
            if(players[p.team().id]==undefined) players[p.team().id]=0;
            players[p.team().id]+=1;
            size++;
        }
    }
    let min=size+3;
    teams.forEach(t=>{
        let amount=players[t.id];
        if(amount==undefined) amount=0;
        if(min>=amount){
            team=t;
            min=amount;
        }
    })
    return team;
}

Aim.team.giveTeam=(player,players)=>{
    if(!player) return
    if(players==undefined) players=Groups.player;
    if(Aim.state.forceOb[player.uuid()]>Date.now()){
        player.sendMessage(bundle(player,"forceOb",Aim.op.utcToStr(player,Aim.state.forceOb[player.uuid()]-Date.now())))
        player.team(Team.get(255))
        return Team.get(255)
    }
    let team=null;
    for(let f of Aim.team.others){
        team=f(player,players);
        if(team!=null) break;
    }
    
    if(team==null){
        let teams=[]
        for(let x=1;x<256;x++){
            teams.push(Team.get(x))
        }
        team=Aim.team.getTeam(player,teams,players);
    }
    if(team!=null){
        player.team(team);
    }
    if(team==null) return OLD_TEAM_ASSIGNER.assign(player,players)
    if(Aim.state.teams.players[player.uuid()]==undefined){
        Aim.state.teams.players[player.uuid()]={
            team:team.id,
            kicked:[]
        }
    }
    Aim.state.teams.players[player.uuid()].team=team.id;
    if(Aim.state.teams.teams[team.id]==undefined){
        Aim.state.teams.teams[team.id]={
            locked:false
        }
    }
    if(team!=null) return team;
}

if(this.OLD_TEAM_ASSIGNER==undefined) OLD_TEAM_ASSIGNER=Vars.netServer.assigner

Vars.netServer.assigner=new Packages.mindustry.core.NetServer.TeamAssigner(){
    assign(p,pl){
        return Aim.team.giveTeam(p,pl);
    }
}

Aim.commands[";ob"]={
    func:function(p,t,m) {
        if(p.team()!=Team.get(255)){
            if(Version.build>135){
                let a=Vars.state.rules.fog;
                Vars.state.rules.fog=false;
                let b=Vars.state.rules.staticFog;
                Vars.state.rules.staticFog=false;
                Call.setRules(p.con,Vars.state.rules)
                Vars.state.rules.fog=a
                Vars.state.rules.staticFog=b
            }
            p.unit(UnitTypes.gamma.spawn(Team.get(0),1,1))
            p.team(Team.get(255))
            p.unit().kill()
        }else{
            Aim.team.giveTeam(p);
            if(Version.build>135) Call.setRules(p.con,Vars.state.rules)
        }
    },
    args:"",
    desc:"$aim.command.ob.desc",
    show:true
}

Aim.commands[";ct"]={
    func:function(player,t,m) {
        if(!Aim.state.teams.players[player.uuid()]){
            Aim.state.teams.players[player.uuid()]={
                team:player.team().id,
                kicked:[]
            }
        }
        Aim.state.teams.players[player.uuid()].kicked.push(Aim.state.teams.players[player.uuid()].team);
        player.unit(UnitTypes.flare.spawn(Team.get(0),8,8));
        Aim.team.giveTeam(player);
        player.unit().kill();
        Aim.state.teams.players[player.uuid()].kicked.splice(Aim.state.teams.players[player.uuid()].length-1,1)
    },
    args:"",
    desc:"$aim.command.changeteam.desc",
    show:true
}

Aim.commands[";l"]={
    func:(p,t,m)=>{
        let i=p.team().id;
        if(Aim.state.teams.teams[i].locked){
            p.sendMessage(bundle(p,"teamlocked",i));
            return;
        }
        Aim.vote.add("$lockteam "+i+"  \n"+p.team()+" "+p.name.replace(/\[.*?\]/g,""),p)
        
    },
    args:"",
    desc:"$aim.command.lockteam.desc",
    show:true
}
Aim.commands[";ul"]={
    func:(p,t,m)=>{
        let i=p.team().id;
        if(!Aim.state.teams.teams[i].locked){
            p.sendMessage(bundle(p,"teamunlocked",i));
            return;
        }
        Aim.vote.add("$unlockteam "+ i +"  \n"+p.team()+" "+p.name.replace(/\[.*?\]/g,""),p)
    },
    args:"",
    desc:"$aim.command.unlockteam.desc",
    show:true
}

Aim.commands[";tk"]={
    func:(p,t,m)=>{
        let player=getPlayer(t[1])
        if(player==null||player.team()!=p.team()){
            p.sendMessage(bundle(p,"playerNotFound"))
            return
        }
        Aim.vote.add("$teamkick "+t[1]+" "+player.team().id+"  \n"+getPlayer(t[1]).name,p)
    },
    args:"$aim.command.teamkick.args",
    desc:"$aim.command.teamkick.desc",
    show:true
}

Aim.voteCommands["lockteam"]={
    func:function(p,t,m){
        Aim.state.teams.teams[+t[1]].locked=true
    },
    a:true,
    canVote:(p,cp,t,m)=>{
        return t[1]==p.team().id;
    },
    getPlayers:(vote)=>{
        let players=[]
        Groups.player.each(p=>{
           if(p.team().id==vote.command.split(" ")[1]-1+1){
                players.push(p)
            }
        })
        return players.length;
    }
}

Aim.voteCommands["unlockteam"]={
    func:function(p,t,m){
        Aim.state.teams.teams[+t[1]].locked=false
    },
    a:true,
    canVote:(p,cp,t,m)=>{
        return t[1]==p.team().id;
    },
    getPlayers:(vote)=>{
        let players=[]
        Groups.player.each(p=>{
           if(p.team().id==vote.command.split(" ")[1]-1+1){
                players.push(p)
            }
        })
        return players.length;
    }
}

Aim.voteCommands["teamkick"]={
    func:function(pl,t,m){
        let p=getPlayer(t[1])
        Aim.state.teams.players[p.uuid()].kicked.push(+t[2]);
        Call.infoMessage(p.con,bundle(p,"team.kicked",Team.get(t[2])))
        p.unit(UnitTypes.flare.spawn(Team.get(0),8,8));
        Aim.team.giveTeam(p);
        p.unit().kill();
    },
    a:true,
    canVote:(p,cp,t,m)=>{
        return t[2]==p.team().id;
    },
    getPlayers:(vote)=>{
        let players=[]
        Groups.player.each(p=>{
           if(p.team().id==vote.command.split(" ")[2]-1+1){
                players.push(p)
            }
        })
        return players.length;
    }
}