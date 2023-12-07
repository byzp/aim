"use strict";

Aim.io.rm("temp");
Aim.io.mkdir("temp");
Aim.io.mkdir("datas");
Aim.addon.status={}
Aim.addon.info={}
Aim.addon.load=(path)=>{
	let name=path.split("/").pop();
	name=name.substring(0,name.length-13);
	Aim.addon.status[name]=0
	Aim.io.mkdir("temp/"+name);
	Aim.io.unzip("./"+path,"./temp/");
	Timer.schedule(()=>{
		Aim.addon.status[name]=1
		Aim.io.read("temp/"+name+"/info.json",(file)=>{
			if(file==""){
				errLog(name,"can not find info.json!");
				delete Aim.addon.status[name]
				Aim.io.rm("temp/"+name);
				return
			}
			let file=(file+"").replace(/(\r|\n)/g,"");
			file=file.replace(/\u0009/g,"");
			//debugLog(file);
			let info=eval("("+file+")");
			//debugLog(JSON.stringify(info));
			inf={}
			for(let key in info){
				inf[key]=info[key]
			}
			Aim.addon.info[name]=inf
			if(inf.dspname==undefined) inf.dspname=name+"@"+inf.version
			Aim.addon.status[name]=2
		});
	},1);
}

Aim.addon.load2=(name)=>{
	if(Aim.addon.status[name]==undefined) return 1 //不存在
	if(Aim.addon.status[name]<2) return 2 //未加载完成
	if(Aim.addon.status[name]==3) return 3 //已加载
	let info=Aim.addon.info[name]
	debugLog(name,JSON.stringify(info));
	if(info.minBuild>Aim.build) return 4 //aim版本过低
	infoLog(info.dspname,"load start!");
	let wait=false
	for(let req of info.requires){
		debugLog(req);
		let reqName=req.split("@")[0]
		let reqVer=req.split("@")[1]
		if(Aim.addon.status[reqName]==undefined){
			errLog(name,"can not find addon:"+reqName);
			return 5 //找不到前置
		}
		debugLog(name,"find "+reqName+" :"+JSON.stringify(Aim.addon.info[reqName]));
		if(!Aim.op.cherkVer(Aim.addon.info[reqName].version,reqVer)){
			errLog(name,"version low:"+Aim.addon.info[reqName].version+" < "+reqVer);
			return 6 //前置版本过低
		}
		if(Aim.addon.status[reqName]==2&&reqName!=name){
			Aim.addon.load2(reqName);
			wait=true
		}
	}
	if(wait){
		Timer.schedule(()=>{
			Aim.addon.load2(name);
		},1.5);
		return 7 //等待中
	}
	Aim.io.readDir("temp/"+name+"/bundles/",list=>{
		list.forEach(fname=>{
			let lang=fname.substring(0,fname.length-5);
			Aim.io.read("temp/"+name+"/bundles/"+fname,f=>{
				let obj=eval("("+f+")");
				if(Aim.bundles[lang]==undefined){
					Aim.bundles[lang]={}
				}
				for(let key in obj){
					Aim.bundles[lang][key]=obj[key]
				}
			});
		});
	});
	execute("temp/"+name+"/"+info.main);
	Aim.addon.status[name]=3
}

Timer.schedule(()=>{
	for(let name in Aim.addon.status){
		Aim.addon.load2(name);
	}
},4);