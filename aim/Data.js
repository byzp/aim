"use strict";

Aim.loadData=function(){
	new java.lang.Thread(run(()=>{
		log("load userinfo")
		if(Aim.io.exists("datas/aim/userinfo.json")){
			try{
				Aim.data.userinfo=JSON.parse(Aim.io.readSync("datas/aim/userinfo.json"))
			}catch(e){
				warnLog("load userinfo error:"+e)
				Aim.data.userinfo={}
			}
		}else{
			Aim.data.userinfo={}
		}
	})).start()
	log("load config")
	if(Aim.io.exists("datas/aim/config.json")){
		try{
			Aim.data.config=JSON.parse(Aim.io.readSync("datas/aim/config.json"))
		}catch(e){
			warnLog("load config error:"+e)
			Aim.data.config={}
		}
	}else{
		Aim.data.config={}
	}
	log("load blacklist")
	if(Aim.io.exists("datas/aim/blacklist.json")){
		try{
			Aim.data.blacklist=JSON.parse(Aim.io.readSync("datas/aim/blacklist.json"))
		}catch(e){
			warnLog("load blacklist error:"+e)
			Aim.data.blacklist={}
		}
	}else{
		Aim.data.blacklist={}
	}
	log("load addonConfigs")
	if(Aim.io.exists("datas/aim/addonConfigs.json")){
		try{
			Aim.addon.configs=JSON.parse(Aim.io.readSync("datas/aim/addonConfigs.json"))
		}catch(e){
			warnLog("load addonConfigs error:"+e)
			Aim.addon.configs={}
		}
	}else{
		Aim.addon.configs={}
	}
	log("load addonDatas")
	if(Aim.io.exists("datas/aim/addonDatas.json")){
		try{
			Aim.addon.datas=JSON.parse(Aim.io.readSync("datas/aim/addonDatas.json"))
		}catch(e){
			warnLog("load addonDatas error:"+e)
			Aim.addon.datas={}
		}
	}else{
		Aim.addon.datas={}
	}
}

if(Object.keys(Aim.data.userinfo)==0){
	log("load Aim.data")
	Aim.players={}
	Aim.data={muting:{}}
	Aim.addon={}
	Aim.loadData()
	log("load Aim.data done")
}

Aim.saveData=function(){
	Aim.io.write("datas/aim/userinfo.json",JSON.stringify(Aim.data.userinfo));
	Aim.io.write("datas/aim/config.json",JSON.stringify(Aim.data.config));
	Aim.io.write("datas/aim/blacklist.json",JSON.stringify(Aim.data.blacklist));
	Aim.io.write("datas/aim/addonConfigs.json",JSON.stringify(Aim.addon.configs));
	Aim.io.write("datas/aim/addonDatas.json",JSON.stringify(Aim.addon.datas));
	let time=new Date();
	time="backup--"+time.getFullYear()+"-"+time.getMonth()+"-"+time.getDate();
	let path="datas/aim/backups/"+time;
	if(!Aim.io.isDir(path)){
	    //Call.sendMessage("begin backup data: "+time)
		Log.log(Log.LogLevel.info,"begin backup data: @",time)
		Aim.io.mkdir(path);
		Aim.io.ls("datas/aim").forEach(fname=>{
			if(fname=="backups") return;
			Aim.io.copy("datas/aim/"+fname,path+"/"+fname);
			//Call.sendMessage("backup file: "+fname);
			Log.log(Log.LogLevel.info,"backup file: @",fname)
		})
	}
	for(let func of Aim.triggers.saveData){
		func()
	}
}
//Aim.saveData=function(){;Aim.io.write("datas/aim/userinfo.json",JSON.stringify(Aim.data.userinfo));Aim.io.write("datas/aim/config.json",JSON.stringify(Aim.data.config));Aim.io.write("datas/aim/blacklist.json",JSON.stringify(Aim.data.blacklist));Aim.io.write("datas/aim/addonConfigs.json",JSON.stringify(Aim.addon.config));Aim.io.write("datas/aim/addonDatas.json",JSON.stringify(Aim.addon.data));}
