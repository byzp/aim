"use strict";

let Aim={}
Aim.op={}
Aim.players={}
Aim.defaultState={
	history:{},
	lastConfig:{},
	bannedSkills:[],
	resources:{},
	maptags:[],
	mapid:-1
}
Aim.triggers={
    saveData:[],
    getInfo:[],
    resetState:[]
}
Aim.state={}
Aim.state=Object.assign(Aim.state,Aim.defaultState);
Aim.data={}
Aim.data.blacklist={}
Aim.data.userinfo={}
Aim.data.config={}
Aim.data.muting={}
Aim.commands={}
Aim.adminCommands={}
Aim.voteCommands={}
Aim.skillCommands={}
Aim.addon={}
Aim.addon.configs={}
Aim.addon.datas={}
Aim.pause=false

Aim.mapUrl="http://127.0.0.1:7002"

Aim.showScore=false


Aim.version="v2.0.2"
Aim.build=2

const eb=false;

Aim.op.uri=function(url){return encodeURIComponent(url)}

const readString=(p)=>new Packages.arc.files.Fi(p).readString();
Vars.mods.scripts.context.evaluateString(Vars.mods.scripts.scope, readString("./aim/IO.js"),"aim/IO.js", 1)

const execute=function(path){
	let runed=false
	Aim.io.read(path,(f)=>{
		log("execute"," run: "+path)
		log("execute"," result: "+Vars.mods.scripts.runConsole(f))
		runed=true
	})
	while(!runed){}
}


Aim.io.mkdir("datas");
Aim.io.mkdir("datas/aim");
Aim.io.mkdir("datas/aim/backups");
Aim.io.mkdir("config/plugins");

execute("aim/MessageFilters.js");
execute("aim/Events.js");
execute("aim/Operation.js");
execute("aim/GameModes.js");
execute("aim/Vote.js");
execute("aim/Score.js");
execute("aim/Data.js");
execute("aim/Commands.js");
execute("aim/Team.js");
execute("aim/VoteCommands.js");
execute("aim/AdminCommands.js");
execute("aim/VoteCommandsExecute.js");
//execute("aim/Skills.js");
execute("aim/Sidebars.js");
execute("aim/History.js");
execute("aim/MapTagLoader.js");
execute("aim/Addon.js");
execute("aim/MapTags.js");
execute("aim/MenuUI.js");
//execute("aim/md5.js")

if(Aim.loaded!=true){
	execute("aim/EventLoad.js");
	Aim.loaded=true;
}

Aim.POINT=""
Aim.POWER=""

let defaultValue={
	enabled:true,disableSkillsInPvp:true,
	broad:"[#99ff66]指令列表：[#ffccff];help \n[#99ff66]快捷指令：[#ffccff];\n[#99ff66]在线人数：[yellow]${playerAmount}\n[#99ff66]地图名称：[yellow]${mapName}\n[#99ff66]时长：[yellow]${gameTime}",
	//"use \"*aimcfg broad str\\ning...\"\nto edit this message",jsIsEnabled:true,
	voteTime:60,addVoteTime:5,
	minVoteAgree:2,kickTime:10
}

Aim.defaultState='history:{},lastConfig:{},bannedSkills:[],resources:{},maptags:[],mapid:-1,unitUpdates:{},worldUpdates:[],worldLabels:[],temps:{worldLabelInstances:{}},mapCommands:{},forceOb:{}'

Aim.resetState=()=>{
    Aim.state=eval("({"+Aim.defaultState+"})")
    for(let func of Aim.triggers.resetState){
        func()
    }
    Call.clientPacketReliable("resetState","")
}

for(let key in defaultValue){
	let value=defaultValue[key]
	if(Aim.data.config[key]==undefined){
		Aim.data.config[key]=value
	}
}

const debugLog=(source,info)=>{
	if(Administration.Config.debug.bool()){
		if(info!=undefined){
			Log.log(Log.LogLevel.debug,"[@]: @",source,info)
		}else{
			Log.log(Log.LogLevel.debug,"@",source)
		}
	}
}

const warnLog=(source,info)=>{
	if(info!=undefined){
		Log.log(Log.LogLevel.warn,"[@]: @",source,info)
	}else{
		Log.log(Log.LogLevel.warn,"@",source)
	}
}

const infoLog=(source,info)=>{
	if(info!=undefined){
		Log.log(Log.LogLevel.info,"[@]: @",source,info)
	}else{
		Log.log(Log.LogLevel.info,"@",source)
	}
}

const noneLog=(source,info)=>{
	if(info!=undefined){
		Log.log(Log.LogLevel.none,"[@]: @",source,info)
	}else{
		Log.log(Log.LogLevel.none,"@",source)
	}
}

const errLog=(source,info)=>{
	if(info!=undefined){
		Log.log(Log.LogLevel.err,"[@]: @",source,info)
	}else{
		Log.log(Log.LogLevel.err,"@",source)
	}
}
/*
var getPlayer=(player)=>{
    //id or name
	return Aim.players[player]!=undefined ? Aim.players[player] : (()=>{
		return Groups.player.find(pla=>pla.name==player)
	})()
}
*/
var getPlayer=(player)=>{
    //id or real name
	if(Aim.players[player]!=undefined){
	    return Aim.players[player];
	}
	for(let i in Aim.players){
	    if(Aim.players[i].name=="[#B0E0E6]" + i + "[white] | " + player + "[white]"){
	        return Aim.players[i];
	    }
	}
	return undefined;
}

const say=function(m){
	Call.sendMessage(m)
}

const sayX=function(m){
	let args=arguments
	Groups.player.each(player=>{
		let lang=Aim.data.getData(player).lang
		if(lang==undefined) lang="English"
		let str=Aim.bundles[lang][m]
		for(let i=1;i<args.length;i++){
			let d=args[i]+""
			if(d.startsWith("$")) d=bundle(player,d.substring(1,d.length))
			str=str.replace("{$"+i+"}",d)
		}
		player.sendMessage(str)
	})
}

Aim.bundles={}
Aim.loadBundles=()=>{
	for(let fn of Aim.io.ls("aim/bundles")){
		let fna=fn;
		if(fna.endsWith("json")){
			Aim.io.read("aim/bundles/"+fna,(f)=>{
				debugLog("loadBundle",fna+"  :  "+fna.substring(0,fna.length-5))
				try{
				Aim.bundles[fna.substring(0,fna.length-5)]=eval(
					"("+f+")"
				)
				}catch(e){
					errLog(e)
				}
			})
		}
	}
}
Aim.loadBundles()

const bundle=function(player,index){
	let lang=Aim.data.getData(player).lang
	if(lang==undefined) lang="English"
	try{
		let str=Aim.bundles[lang][index]
		for(let i=2;i<arguments.length;i++){
			str=str.replace("{$"+(i-1)+"}",arguments[i])
		}
		if(str==undefined) return "????"+lang+":"+index+"????"
		return str
	}catch(e){
		errLog("bundle",e)
		return "????"+lang+":"+index+"????"
	}
}

const bundleLang=function(lang,index){
	if(lang==undefined) lang="English"
	try{
		let str=Aim.bundles[lang][index]
		for(let i=2;i<arguments.length;i++){
			str=str.replace("{$"+(i-1)+"}",arguments[i])
		}
		if(str==undefined) return "????"+lang+":"+index+"????"
		return str
	}catch(e){
		errLog("bundle",e)
		return "????"+lang+":"+index+"????"
	}
}

const bundleArray=function(player,index,args){
	let lang=Aim.data.getData(player).lang
	if(lang==undefined) lang="English"
	try{
		let str=Aim.bundles[lang][index]
		for(let i=0;i<args.length;i++){
			str=str.replace("{$"+(i+1)+"}",args[i])
		}
		if(str==undefined) return "????"+lang+":"+index+"????"
		return str
	}catch(e){
		errLog("bundle",e)
		return "????"+lang+":"+index+"????"
	}
}

const unbundle=function(player,index){
	try{
		let lang=Aim.data.getData(player).lang
		if(lang==undefined) lang="English"
		let result=index
		for(let key in Aim.bundles[lang]){
			if(index==Aim.bundles[lang][key]){
				result=key
				return
			}
		}
		return result
	}catch(e){
		return index
	}
}
/*
const shortID=function(player){
    uuid=player.uuid();
	if(Aim.data.userinfo[uuid].shortID!=undefined){
	    return Aim.data.userinfo[uuid].shortID;
	}else{
	    Aim.data.userinfo[uuid].shortID=b64_md5(uuid).substring(0,3);
	    return Aim.data.userinfo[uuid].shortID;
	}
}
*/

const initID=function(player){
    let i=0;
	while(Aim.players[i]!=undefined){
	    i++;
	}
	Aim.players[i]=player;
	return i;
}

const getID=function(uuid){
    for(let id in Aim.players){
        if(Aim.players[id].uuid()==uuid){
            return id;
        }
    }
    return null;
}

Aim.data.getData=(player)=>{
	let data=Aim.data.userinfo[player.uuid()]
	if(data==undefined){
		data={
			point:30,pointCap:30,pointReplyTime:80,
			power:20,powerCap:20,powerReplyTime:40,
			lastUpdate:Date.now(),level:1,exp:0,
			canUse:true,name:"",active:true,oldMode:false,
			title:"",broad:true,health:true,voteMenu:true,
			history:false,joinedMode:[],AimClient:false,
			totalScore:0,fame:0,scores:[0,0,0,0,0] //,shortID:""
		}
		Aim.data.userinfo[player.uuid()]=data
	}
	return data
}

Timer.schedule(()=>{
    let files=Aim.io.ls("config/plugins/")
    for(let fileName of files){
        if(fileName.endsWith(".aimaddon")){
            let fname=fileName
            execute("config/plugins/"+fileName);
        }else if(fileName.endsWith(".aimaddon.zip")){
            Aim.addon.load("config/plugins/"+fileName)
        }
    }
},2)


