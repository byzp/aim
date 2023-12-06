"use strict";

Aim.score={}
Aim.score.list={}
Aim.score.all={
    name: ["online","unknown","build","dismantle","resource"],
    topo: [0.0002  ,0        ,0.001  ,0.0001     ,0.000075  ],
    topw: [0.0002  ,0        ,0.0001 ,0.001      ,0.000075  ],
    toexp:[0.0002  ,0        ,0.0005 ,0.0005     ,0.0002    ],
    max:  [100     ,200      ,4000   ,4000       ,8000      ]
}
Aim.score.itemCost={
    copper:0.1,     lead:0.1,       metaglass:0.25,     graphite:0.3,
    sand:0.1,       coal:0.15,      titanium:0.2,       thorium:0.3,
    scrap:0.05,     silicon:0.4,    plastanium:0.5,     phasefabric:2.7,
    surgealloy:2.5, sporepod:0.1,   blastcompound:0.75, pyratite:0.6,
    beryllium:0.1,  tungsten:0.15,  oxide:0.4,          carbide:1.2
}
Aim.score.winMult=1.2;
Aim.score.loseMult=0.9;
Aim.score.buildMult=0.0001;
Aim.score.resMult=0.0001;

Aim.score.breakList={}

Aim.event.requires.blockBuildBegin.push(
    (e)=>{
        let bplan=e.unit.buildPlan()
        if(bplan==null) return;
        let breaking=bplan.breaking
        if(breaking==true&&e.unit.player!=null){
            Aim.score.break(e.unit.player,bplan.block,e.tile)
        }
    }
)

Aim.event.requires.blockBuildEnd.push(
    (e)=>{
        let bplan=e.unit.buildPlan()
        if(bplan==null) return;
        let breaking=bplan.breaking
        if(breaking==false&&e.unit.player!=null){
            Aim.score.build(e.unit.player,bplan.block)
        }
        if(breaking==true&&e.unit.player!=null){
            Aim.score.breakend(e.unit.player,bplan.block,e.tile)
        }
    }
)

Aim.event.requires.update30.push(
    ()=>{
        let nowItems={}
        for(let t=0;t<256;t++){
            let team=Team.get(t)
            try{
                nowItems[t]={}
                team.core().items.each((item,amount)=>{
                    nowItems[t][item.toString()]=amount
                })
            }catch(e){
                nowItems[t]={}
            }
        }
        let addItems={}
        for(let t in nowItems){
            let list=nowItems[t]
            let lastList=Aim.state.resources[t]
            if(lastList==undefined) continue
            if(list==undefined||list==null) continue
            let li=[]
            for(let item in list){
                let amount=list[item]
                let lastAmount=lastList[item]
                if(lastAmount!=undefined){
                    li.push({item:Vars.content.getByName(ContentType.item,item),amount:amount-lastAmount})
                }
            }
            addItems[t]=li
        }
        Groups.player.each(p=>{
            Aim.score.add(p,0,1)
            let list=addItems[p.team().id]
            //debugLog(JSON.stringify(list))
            let cost=0
            if(list!=null) cost=Aim.op.costR(list)
            cost*=Aim.score.resMult
            Aim.score.add(p,4,cost)
        })
        Aim.state.resources=nowItems
    }
)
/*
Aim.event.requires.wave.push(
    ()=>{
        Groups.player.each(p=>{
            Aim.score.add(p,1,1)
        })
    }
)
*/

Aim.event.requires.gameover.push(
    (e)=>{
        Aim.score.winEvent(e.winner)
        Aim.score.breakList={}
    }
)

Aim.event.requires.worldLoad.push(()=>{
    Aim.score.breakList={}
    let i={}
    for(let t=0;t<256;t++){
        i[Team.get(t)]={}
    }
    Aim.score.lastItems=i
})

Aim.score.build=(player,block)=>{
    let cost=Aim.op.cost(block)
    Aim.score.add(player,2,cost*Aim.score.buildMult)
}

Aim.score.break=(player,block,tile)=>{
    if(!block.toString().startsWith("build")){
        Aim.score.breakList[player.uuid()]={
            block:block,
            tile:tile
        }
    }
}

Aim.score.breakend=(player,block,tile)=>{
    Timer.schedule(()=>{
        if(tile.block()==Blocks.air){
            let data=Aim.score.breakList[player.uuid()]
            if(data!=undefined){
                let cost=Aim.op.cost(data.block)
                Aim.score.add(player,3,cost*Aim.score.buildMult)
                delete Aim.score.breakList[player]
            }
        }else{
            delete Aim.score.breakList[player]
        }
    },1)
}

Aim.score.add=(player,type,score)=>{
    let data=Aim.score.list[player.uuid()]
    if(data==undefined){
        let arr=[]
        for(let x in Aim.score.all.name){
            arr[x]=0
        }
        data={
            scores:arr,
            team:player.team()
        }
        Aim.score.list[player.uuid()]=data
    }
    data.scores[type]+=score
    data.team=player.team()
}
Aim.score.winEvent=(winner)=>{
    if(Aim.showScore==false){
        return;
    }
    Groups.player.each(p=>{
        if(Aim.score.list[p.uuid()]!=undefined){
            let scores=Aim.score.list[p.uuid()].scores
            let allScore=0
            let allPoints=0
            let allPowers=0
            let allExps=0
            let message="---"+bundle(p,"score.settlement")+"---\n"
            message+=bundle(p,"score.type")+" "+bundle(p,"score.score")+" "+Aim.POINT+" "+Aim.POWER+" "+bundle(p,"exp")+"\n"
            for(let i in scores){
                let score=Math.max(scores[i],0)
                
                let addpo=score*Aim.score.all.topo[i]*8
                let addpw=score*Aim.score.all.topw[i]*8
                let addexp=score*Aim.score.all.toexp[i]*8
                
                let name=bundle(p,"score."+Aim.score.all.name[i])

                let dspScore=parseInt(score*1000)/1000
                let dspPo=parseInt(addpo*1000)/1000
                let dspPw=parseInt(addpw*1000)/1000
                let dspExp=parseInt(addexp*1000)/1000

                message+=name+" "+dspScore+" "+dspPo+" "+dspPw+" "+dspExp+"\n"

                allScore+=score
                allPoints+=addpo
                allPowers+=addpw
                allExps+=addexp
            }

            let mult=((Aim.data.getData(p).level-1)*0.01)+1
            message+="level."+Aim.data.getData(p).level+" *"+mult+"\n"

            if(winner==p.team()||(Vars.state.waves>Vars.state.rules.winWave&&Vars.state.rules.winWave!=0)){
                message+="[green]"+bundle(p,"score.win")+"! *"+Aim.score.winMult+"\n"
                mult*=Aim.score.winMult
            }else if(winner!=p.team()&&Vars.state.rules.pvp==true){
                message+="[red]"+bundle(p,"score.lose")+"! *"+Aim.score.loseMult+"\n"
                mult*=Aim.score.loseMult
            }
            message+="---*"+mult+" ---\n"
            scores.forEach(score=>score*mult)
            allScore*=mult
            allPoints*=mult
            allPowers*=mult
            allExps*=mult
            let dspScore=parseInt(allScore*1000)/1000
            let dspPo=parseInt(allPoints*1000)/1000
            let dspPw=parseInt(allPowers*1000)/1000
            let dspExp=parseInt(allExps*1000)/1000
            message+=bundle(p,"score.total")+" "+dspScore+" "+dspPo+" "+dspPw+" "+dspExp
            let data=Aim.data.getData(p)
            if(!Vars.state.rules.infiniteResources){
                data.totalScore+=allScore
                for(let i in scores){
                    data.scores[i]=data.scores[i]+scores[i]
                }
                data.pointCap+=allPoints
                data.powerCap+=allPowers
                data.point+=allPoints
                data.power+=allPowers
                data.exp+=allExps
            }else{
                message+="\n[yellow]"+bundle(p,"score.isSandbox")
            }
            //if(Aim.client.is(p)) Call.clientPacketReliable(p.con,"result",message); else Call.infoMessage(p.con,message)
            delete Aim.score.list[p.uuid()]
        }
    })
    
    for(let uuid in Aim.score.list){
        let scores=Aim.score.list[uuid].scores
        let allScore=0
        let allPoints=0
        let allPowers=0
        let allExps=0
        for(let i in scores){
            let score=Math.max(scores[i],0)
            let addpo=score*Aim.score.all.topo[i]
            let addpw=score*Aim.score.all.topw[i]
            let addexp=score*Aim.score.all.toexp[i]
            allScore+=score
            allPoints+=addpo
            allPowers+=addpw
            allExps+=addexp
        }
        let p=getPlayer(uuid.substring(0,3))
        let mult=((Aim.data.userinfo[uuid].level-1)*0.01)+1
        if(winner==Aim.score.list[uuid].team||(Vars.state.waves>Vars.state.rules.winWave&&Vars.state.rules.winWave!=0)){
            mult*=Aim.score.winMult
        }else if(winner!=Aim.score.list[uuid].team&&Vars.state.rules.pvp==true){
            mult*=Aim.score.loseMult
        }
        scores.forEach(score=>score*mult)
        allScore*=mult
        allPoints*=mult
        allPowers*=mult
        allExps*=mult
        let data=Aim.data.userinfo[uuid]
        if(!Vars.state.rules.infiniteResources){
            data.totalScore+=allScore
            data.pointCap+=allPoints
            data.powerCap+=allPowers
            data.point+=allPoints
            data.power+=allPowers
            data.exp+=allExps
            for(let i in scores){
                data.scores[i]=data.scores[i]+scores[i]
            }
        }
        delete Aim.score.list[uuid]
    }
}