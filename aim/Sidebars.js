"use strict";

Aim.sidebar={
    infos:[]
}

Aim.event.requires.update5.push(()=>{
    Groups.player.each(player=>{
        //if(Aim.client.is(player)) return;
        let data=Aim.data.getData(player)
        if(!data.broad) return
        let message=Aim.data.config.broad
        if(Aim.data.config["broad_"+data.lang]!=undefined) message=Aim.data.config["broad_"+data.lang]
        message=Aim.op.messageFilter(message,player)
        Call.infoPopup(player.con,message,5,Align.topLeft,200,0,0,0)
    })
})

Aim.event.requires.update1.push(()=>{
    Groups.player.each(player=>{
        let data=Aim.data.getData(player)
        if(!data.health) return
        let unit=player.unit()
        let healthf=unit.health/unit.maxHealth
        let hf=Math.floor(healthf*100)
        if(hf<=20){
            hf="[#ff0000]"+hf+"[#ffccff]";
        }
        let message="[#ffccff]Health: "+hf+"%\n"
        message+=Math.floor(unit.health)+"/"+unit.maxHealth+"\n"
        let shieldf=unit.shield/unit.maxHealth
        message+="[#66ccff]Shield: "+Math.floor(shieldf*100)+"%\n"
        message+=Math.floor(unit.shield%unit.maxHealth)
        message+="+"+Math.floor(unit.shield/unit.maxHealth)+"*"+unit.maxHealth
        if(Vars.state.rules.unitAmmo){
            let type="power"
            let color="ffee00"
            if(unit.type.ammoType.totalPower==undefined){
                type=unit.type.ammoType.item
                color=type.color
            }
            let ammof=unit.ammo/unit.type.ammoCapacity
            message+="\n[#"+color+"]Ammo: "+Math.floor(ammof*100)+"%\n"
            message+=Math.floor(unit.ammo)+"/"+unit.type.ammoCapacity+"\n"
            message+="type: "+type
        }
        Call.infoPopup(player.con,message,1,Align.right,0,0,150,0)
    })
    Groups.player.each(player=>{
        let data=Aim.data.getData(player)
        let message="";
        for(let func of Aim.sidebar.infos){
            message=func(player,message)
        }
        Call.infoPopup(player.con,message,1,Align.left,0,0,0,0)
    })
})