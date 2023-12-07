"use strict";

Aim.gameModes={
    menu:Menus.registerMenu((p,s)=>{
        if(s==0){
            Aim.commands[";modeinfo"].func(p,["",Aim.gameModes.temp[p].modeName]);
        }
        Aim.data.getData(p).joinedMode.push(Vars.state.rules.modeName)
        delete Aim.gameModes.temp[p];
    }),
    temp:{}
}
Aim.gameModes.empty={
    otherName:["r","real"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        return rules;
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"Real(NoModify)",
    customMode:false
}

Aim.gameModes.survival={
    otherName:["s"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        rules.waves=true;
        rules.waveTimer=true;
        return rules;
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"Survival",
    customMode:false
}
Aim.gameModes.attack={
    otherName:["a"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        rules.attackMode=true;
        return rules;
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"Attack",
    customMode:false
}
Aim.gameModes.pvp={
    otherName:["p"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        rules.pvp=true;
        rules.attackMode=true;
        return rules;
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"PVP",
    customMode:false
}
Aim.gameModes.sandbox={
    otherName:["c"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        rules.infiniteResources=true;
        return rules;
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"Sandbox",
    customMode:false
}
Aim.gameModes.editor={
    otherName:["e"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        rules.editor=true;
        return rules;
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"Editor",
    customMode:false
}

Aim.gameModes.forceSurvival={
    otherName:["fs"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        return map.applyRules(Gamemode.survival);
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"ForceSurvival",
    customMode:false
}
Aim.gameModes.forceAttack={
    otherName:["fa"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        return map.applyRules(Gamemode.attack);
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"ForceAttack",
    customMode:false
}
Aim.gameModes.forcePvp={
    otherName:["fp"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        return map.applyRules(Gamemode.pvp);
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"ForcePVP",
    customMode:false
}
Aim.gameModes.forceSandbox={
    otherName:["fc"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        return map.applyRules(Gamemode.sandbox);
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"ForceSandbox",
    customMode:false
}
Aim.gameModes.forceEditor={
    otherName:["fe"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        return map.applyRules(Gamemode.editor);
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"ForceEditor",
    customMode:false
}


Aim.gameModes.cheat={
    otherName:["ch"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        for(let i=0;i<256;i++){
            rules.teams.get(Team.get(i)).cheat=true;
        }
        return rules;
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"Cheat",
    customMode:false
}

//if(Administration.Config.debug.bool()){
Aim.gameModes.meteorite={
    otherName:["m"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,t,map){
        rules.modeName="Meteorite"
        return rules;
    },
    aimStateReset:function(t,map){
        Aim.worldUpdates.add("meteorite")
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"Meteorite",
    customMode:true,
    guides:[
        "$mode.Meteorite.guide.1"
    ]
}
Aim.gameModes.sector={
    otherName:["se"],
    beforeReload:function(t,map){
        
    },
    applyRules:function(rules,te,map){
        if(!te[0]) return rules;
        if(!te[1]) return rules;
        let planet=Vars.content.getByName(ContentType.planet,te[0])
        if(!planet) return rules;
        let sector=planet.sectors.find(s=>te[1].startsWith("#")?s.id+""==te[1].substring(1):s.name()==te[1])
        if(!sector) return rules;
        rules.sector=sector;
        return rules;
    },
    aimStateReset:function(t,map){
        
    },
    beforeReloadEnd:function(t,map){
        
    },
    afterReloadEnd:function(t,map){
        
    },
    modeName:"Sector",
    desc:"-se <planet> <sector>",
    customMode:true,
}
