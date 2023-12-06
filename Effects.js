"use strict";

Aim.effects={}
Aim.effects.add=(unit,effect)=>{
    let uid=unit.id
    if(Aim.state.effects[uid]==undefined){
        Aim.state.effects[uid]=[]
    }
    effect.unit=unit
    effect.enabled=true
    delete effect.funcs.update
    Aim.state.effects[uid].push(effect)
}
Aim.event.requires.update.push(()=>{
    for(let uid in Aim.state.effects){
        let effects=Aim.state.effects[uid]
        for(let effect of effects){
            if(effect.enabled==false) continue
            if(Aim.effects.effects[effect.type].funcs.update!=undefined) Aim.effects.effects[effect.type].funcs.update()
        }
    }
})
Aim.event.requires.update1.push(()=>{
    for(let uid in Aim.state.effects){
        let effects=Aim.state.effects[uid]
        for(let effect of effects){
            if(effect.enabled==false) continue
            if(Aim.effects.effects[effect.type].funcs.update1!=undefined) Aim.effects.effects[effect.type].funcs.update1()
        }
    }
})
Aim.event.requires.update1.push(()=>{
	
})
