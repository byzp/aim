Aim.skillCommands[";mono"]={
    func:(p,t,m,plevel)=>{
        let spawnAmount=Math.min(plevel,6)
        let x=p.unit().x
        let y=p.unit().y
        let team=p.team()
        for(let i=0;i<spawnAmount;i++){
            UnitTypes.mono.spawn(team,x,y)
        }
    },
    args:"",
    desc:"$aim.skillCommands.mono.desc",
    show:true,
    use:{
        usePoint:10,
        usePower:15,
        minLevel:1,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";miner"]={
    func:(p,t,m,plevel)=>{
        let spawnAmount=Math.min(plevel-4,2)
        let x=p.unit().x
        let y=p.unit().y
        let team=p.team()
        for(let i=0;i<spawnAmount;i++){
            let u=UnitTypes.mono.spawn(team,x,y)
            u.apply(StatusEffects.boss)
            u.health+=300;
            Aim.unitUpdates.add(u,"resourcesMiner")
        }
    },
    args:"",
    desc:"$aim.skillCommands.miner.desc",
    show:true,
    use:{
        usePoint:40,
        usePower:45,
        minLevel:4,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";poly"]={
    func:(p,t,m,plevel)=>{
        let spawnAmount=Math.min(Math.floor((plevel-1)/2),6)
        let x=p.unit().x
        let y=p.unit().y
        let team=p.team()
        for(let i=0;i<spawnAmount;i++){
            UnitTypes.poly.spawn(team,x,y)
        }
    },
    args:"",
    desc:"$aim.skillCommands.poly.desc",
    show:true,
    use:{
        usePoint:20,
        usePower:30,
        minLevel:2,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";mega"]={
    func:(p,t,m,plevel)=>{
        let spawnAmount=Math.min(Math.floor((plevel-2)/3),4)
        let x=p.unit().x
        let y=p.unit().y
        let team=p.team()
        for(let i=0;i<spawnAmount;i++){
            UnitTypes.mega.spawn(team,x,y)
        }
    },
    args:"",
    desc:"$aim.skillCommands.mega.desc",
    show:true,
    use:{
        usePoint:35,
        usePower:45,
        minLevel:3,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";oct"]={
    func:(p,t,m,plevel)=>{
        let spawnAmount=1
        let x=p.unit().x
        let y=p.unit().y
        let team=p.team()
        for(let i=0;i<spawnAmount;i++){
            UnitTypes.oct.spawn(team,x,y)
        }
    },
    args:"",
    desc:"$aim.skillCommands.oct.desc",
    show:true,
    use:{
        usePoint:50,
        usePower:80,
        minLevel:5,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";core"]={
    func:(p,t,m,plevel)=>{
        let tile=Vars.world.tile(p.x/8,p.y/8)
        tile.setNet(Blocks.coreShard,p.team(),0)
    },
    args:"",
    desc:"$aim.skillCommands.core.desc",
    show:true,
    use:{
        usePoint:70,
        usePower:75,
        minLevel:6,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";thr"]={
    func:(p,t,m,plevel)=>{
        let x=t[1]*8
        let y=t[2]*8
        Call.effect(Fx.reactorExplosion,x,y,0,Color.white)
        let i=0
        Timer.schedule(()=>{
            Call.createBullet(UnitTypes.toxopid.weapons.get(0).bullet,p.team(),x,y,i++,100000,1,3)
        },1/360,1/360,360)
    },
    args:"<x> <y>",
    desc:"$aim.skillCommands.thr.desc",
    show:true,
    use:{
        usePoint:60,
        usePower:85,
        minLevel:10,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";chest"]={
    func:(p,t,m,plevel)=>{
        Vars.content.items().each(i=>{
            p.team().core().items.add(i,plevel*40+200)
        })
    },
    args:"",
    desc:"$aim.skillCommands.chest.desc",
    show:true,
    use:{
        usePoint:60,
        usePower:80,
        minLevel:5,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";crawler"]={
    func:(p,t,m,plevel)=>{
        let amount=Math.min((plevel-2)*8,96)
        let lucap=Vars.state.rules.unitCap
        Vars.state.rules.unitCap=214740000
        for(let i=0;i<amount;i++){
            let u=UnitTypes.crawler.spawn(p.team(),p.x,p.y)
            u.shield=15000
        }
        Vars.state.rules.unitCap=lucap
    },
    args:"",
    desc:"$aim.skillCommands.crawler.desc",
    show:true,
    use:{
        usePoint:45,
        usePower:55,
        minLevel:3,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";tank"]={
    func:(p,t,m,plevel)=>{
        let x=p.unit().x
        let y=p.unit().y
        let team=p.team()
        let u=UnitTypes.stell.spawn(team,x,y)
        u.apply(StatusEffects.boss)
        //value is from starsky
        Aim.unitUpdates.add(u,"existsTimeLimit").time=Vars.state.tick+60*90+(plevel>3)*60*30
        Aim.unitUpdates.add(u,"infinityHealth")
    },
    args:"",
    desc:"$aim.skillCommands.tank.desc",
    show:true,
    use:{
        usePoint:25,
        usePower:35,
        minLevel:3,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";po2pw"]={
    func:(p,t,m,plevel)=>{
        let rand=Math.floor(Math.random()*100)
        if(rand<=15){
            Aim.data.getData(p).power+=15
            p.sendMessage("[red]->15")
        }else if(rand>=85){
            Aim.data.getData(p).power+=45
            p.sendMessage("[gold]->45")
        }else{
            Aim.data.getData(p).power+=30
            p.sendMessage("[green]->30")
        }
    },
    args:"",
    desc:"20"+Aim.POINT+"->30"+Aim.POWER,
    show:true,
    use:{
        usePoint:20,
        usePower:0,
        minLevel:2,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";radar"]={
    func:(p,t,m,plevel)=>{
        Aim.state.noFog=Vars.state.tick+3600*3+Math.min(plevel-7,3)*3600
        let lastFog=Vars.state.rules.fog
        let rand=Math.random()
        Aim.state.randNoFog=rand
        Vars.state.rules.fog=false
        Call.setRules(Vars.state.rules)
        Timer.schedule(()=>{
            if(Aim.state.randNoFog!=rand) return
            Vars.state.rules.fog=lastFog
            Call.setRules(Vars.state.rules)
        },(Aim.state.noFog-Vars.state.tick)/60)
    },
    args:"",
    desc:"$aim.skillCommands.radar.desc",
    show:true,
    use:{
        usePoint:10,
        usePower:125,
        minLevel:7,
        check:true,
        remove:true,
        show:true,
        checkFunc(p,t,m,plevel){
            return !Aim.state.noFog||Vars.state.tick>Aim.state.noFog
        }
    }
}

Aim.skillCommands[";cheat"]={
    func:(p,t,m,plevel)=>{
        Aim.state["cheat"+p.team()]=Vars.state.tick+300+Math.min(plevel-12,6)*120
        let last=p.team().rules().cheat
        let rand=Math.random()
        Aim.state["randCheat"+p.team()]=rand
        p.team().rules().cheat=true
        let team=p.team()
        Call.setRules(Vars.state.rules)
        Timer.schedule(()=>{
            if(Aim.state["randCheat"+team]!=rand) return
            team.rules().cheat=last
            Call.setRules(Vars.state.rules)
        },(Aim.state["cheat"+p.team()]-Vars.state.tick)/60)
    },
    args:"",
    desc:"$aim.skillCommands.cheat.desc",
    show:true,
    use:{
        usePoint:60,
        usePower:175,
        minLevel:12,
        check:true,
        remove:true,
        show:true,
        checkFunc(p,t,m,plevel){
            return !Aim.state["cheat"+p.team()]||Vars.state.tick>Aim.state["cheat"+p.team()]
        }
    }
}


Aim.skillCommands[";callup"]={
    func:(p,t,m,plevel)=>{
        Aim.state.callup=Vars.state.tick+3600*5+Math.min(plevel-11,4)*3600
        let lastFog=Vars.state.rules.unitBuildSpeedMultiplier
        let rand=Math.random()
        Aim.state.randCallup=rand
        Vars.state.rules.unitBuildSpeedMultiplier*=5
        Call.setRules(Vars.state.rules)
        Timer.schedule(()=>{
            if(Aim.state.randCallup!=rand) return
            Vars.state.rules.unitBuildSpeedMultiplier=last
            Call.setRules(Vars.state.rules)
        },(Aim.state.callup-Vars.state.tick)/60)
    },
    args:"",
    desc:"$aim.skillCommands.callup.desc",
    show:true,
    use:{
        usePoint:120,
        usePower:145,
        minLevel:11,
        check:true,
        remove:true,
        show:true,
        checkFunc(p,t,m,plevel){
            return !Aim.state.callup||Vars.state.tick>Aim.state.callup
        }
    }
}

Aim.skillCommands[";hole"]={
    func:(p,t,m,plevel)=>{
        if(isNaN(t[1])||isNaN(t[2])) return
        let d=Aim.worldUpdates.add("portal")
        d.x1=Math.floor(p.x/8)
        d.x2=+t[1]
        d.y1=Math.floor(p.y/8)
        d.y2=+t[2]
        d.time=Vars.state.tick+5*3600+Math.min(plevel-7,5)*3600
    },
    args:"<x> <y>",
    desc:"$aim.skillCommands.hole.desc",
    show:true,
    use:{
        usePoint:95,
        usePower:130,
        minLevel:7,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";noise"]={
    func:(p,t,m,plevel)=>{
        let team=Team.get(t[1])
        Aim.state[team+"Noise"]=Vars.state.tick+3600*3
        Aim.state[team+"NoiseLevel"]=(Math.min(plevel-19,3)+1)*0.2
    },
    args:"<teamid>",
    desc:"$aim.skillCommands.noise.desc",
    show:true,
    use:{
        usePoint:5,
        usePower:25,
        minLevel:19,
        check:true,
        remove:true,
        show:true
    }
}
Aim.event.requires.chatFilter.push((p,m)=>{
    if(m.startsWith(";")||m.startsWith("；")) return m
    if(m.startsWith("*")&&Aim.data.getData(p).oldMode) return m
    if(!Aim.state[p.team()+"Noise"]||Aim.state[p.team()+"Noise"]<Vars.state.tick) return m
    return m.split("").map(a=>Math.random()<Aim.state[p.team()+"NoiseLevel"]?"*":a).join("")
})

Aim.skillCommands[";unmoving"]={
    func:(p,t,m,plevel)=>{
        let team=Team.get(t[1])
        let arr=new Array(5+Math.floor(plevel-15,10)*2)
        arr=arr.map(a=>{
            return Groups.unit.find(a=>{
                if(arr.includes(a)) return false
                if(a.team!=team) return false
                return true
            })
        })
        arr.forEach(a=>{
            if(!a) return
            a.apply(StatusEffects.unmoving,180*60)
        })
    },
    args:"<teamid>",
    desc:"$aim.skillCommands.unmoving.desc",
    show:true,
    use:{
        usePoint:160,
        usePower:170,
        minLevel:15,
        check:true,
        remove:true,
        show:true
    }
}

Aim.skillCommands[";fakenuke"]={
    func:(p,t,m,plevel)=>{
        if(isNaN(t[1])||isNaN(t[2])) return
        Timer.schedule(()=>{
            let r=Math.min(plevel-16,6)*10+10
            let rx=Math.random()*(r*2)-r+(+t[1])
            let ry=Math.random()*(r*2)-r+(+t[2])
            Call.effect(Fx.reactorExplosion,rx*8,ry*8,0,Color.white)
        },0,10,12)
    },
    args:"<x> <y>",
    desc:"$aim.skillCommands.fakenuke.desc",
    show:true,
    use:{
        usePoint:2,
        usePower:10,
        minLevel:16,
        check:true,
        remove:true,
        show:true
    }
}