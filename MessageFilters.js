"use strict";

Aim.messageFilters={}
Aim.messageFilters["\\$\\{playerAmount\\}"]=()=>{
    return Groups.player.size()
}
Aim.messageFilters["\\$\\{mapName\\}"]=()=>{
    return Vars.state.map.name()
}
Aim.messageFilters["\\$\\{mapId\\}"]=()=>{
    return Aim.state.mapid
}
Aim.messageFilters["\\$\\{wave\\}"]=()=>{
    return Vars.state.wave
}
Aim.messageFilters["\\$\\{unitAmount\\}"]=()=>{
    return Groups.unit.size()
}
Aim.messageFilters["\\$\\{gameTime\\}"]=(p)=>{
	let lang="English"
	if(p!=undefined){
	    lang=Aim.data.getData(p).lang
	    if(lang==undefined) lang="English"
	}
	let t=parseInt(Vars.state.tick/60)
	let time=parseInt(t/86400)+bundleLang(lang,"day")
	time+=parseInt(t/3600)%24+bundleLang(lang,"hour")
	time+=parseInt(t/60)%60+bundleLang(lang,"minute")
	time+=parseInt(t)%60+bundleLang(lang,"second")
	return time
}

Aim.messageFilters["\\$\\{\\{"]="${"