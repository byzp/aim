"use strict";

Timer.schedule(()=>{
	try {
		Aim.saveData()
		//say("[green]aim data is saved!")
		log("Aim.saveData","aim data is saved!")
	}catch(e){
		say(e)
		errLog("Aim.saveData",e)
	}
},600,600)
Timer.schedule(()=>{
	try{
		Aim.event.update30()
	}catch(e){
		errLog("Aim.event.update30",e)
	}
},30,30)
Timer.schedule(()=>{
	try{
		Aim.event.update5()
	}catch(e){
		errLog("Aim.event.update5",e)
	}
},5,5)
Timer.schedule(()=>{
	try{
		Aim.event.update1()
	}catch(e){
		errLog("Aim.event.update1",e)
	}
},1,1)
Events.run(Trigger.update,()=>{
	try{
		Aim.event.update()
	}catch(e){
		errLog("Aim.event.update",e)
	}
})
Vars.netServer.admins.addChatFilter((p,m)=>{
	try{
        return Aim.event.chatFilter(p,m)
	}catch(e){
		errLog("Aim.event.chatFilter",e)
	}
})
Events.on(PlayerConnect,(e)=>{
	try{
		Aim.event.playerConnect(e)
	}catch(e){
		errLog("Aim.event.playerConnect",e)
	}
})
Events.on(PlayerJoin,(e)=>{
	try{
		Aim.event.playerJoin(e)
	}catch(e){
		errLog("Aim.event.playerJoin",e)
	}
})
Timer.schedule(()=>{
	try{
	Aim.event.update1()
	}catch(e){
		errLog("Aim.event.update1",e)
	}
},1,1)
Events.on(GameOverEvent,e=>{
	try{
		Aim.event.gameOver(e)
	}catch(e){
		errLog("Aim.event.gameOver",e)
	}
})

Events.on(WaveEvent,e=>{
	try{
		Aim.event.wave()
	}catch(e){
		errLog("Aim.event.wave",e)
	}
})

Events.on(SaveLoadEvent,e=>{
	try{
		Aim.event.worldLoad()
	}catch(e){
		errLog("Aim.event.worldLoad",e)
	}
})

Events.on(BlockBuildBeginEvent,e=>{
	try{
		Aim.event.blockBuildBegin(e)
	}catch(e){
		errLog("Aim.event.blockBuildBegin",e)
	}
})

Events.on(BlockBuildEndEvent,e=>{
	try{
		Aim.event.blockBuildEnd(e)
	}catch(e){
		errLog("Aim.event.blockBuildEnd",e)
	}
})

Events.on(BlockDestroyEvent,e=>{
	try{
		Aim.event.blockDestroy(e)
	}catch(e){
		errLog("Aim.event.blockDestroy",e)
	}
})

Events.on(ConfigEvent,e=>{
	try{
		Aim.event.config(e)
	}catch(e){
		errLog("Aim.event.config",e)
	}
})


Events.on(TapEvent,e=>{
	try{
		Aim.event.tap(e)
	}catch(e){
		errLog("Aim.event.tap",e)
	}
})