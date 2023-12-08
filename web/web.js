"use strict";

const port=7002;
const dir="/home/zp/mdt/web";
const root=dir+"/web";
const mapRoot=dir+"/maps/";
const fileRoot=dir+"/files/files/";
const acpluginRoot=dir+"/acplugin/files/";

const express=require("express");
const fs=require("fs");
const bodyParser=require("body-parser");
const axios=require("axios")

const multiparty=require("multiparty");

const adminid="thisIsAdminId-2147483647-31415926-mindustry"

let mapUploads=[];

var uploadMap=function(req,res){
	var form = new multiparty.Form();
	form.uploadDir = "./tmp"
	form.parse(req, function(err, fields, files) {
		if(err||files.file.length<=0){
			console.log('parse error: ' + err);
		} else {
			var inputFile = files.file[0];
			var finalname = inputFile.originalFilename;
			if(!finalname.endsWith(".msav")){
				res.send("<script>alert('这不是一个地图文件!');location.assign('/upload.html')</script>");
				res.end();
				try{
				fs.unlinkSync(inputFile.path);
				}catch(e){}
				return;
			}
			let infos={}
			for(let key in fields){
				infos[key]=fields[key][0];
			}
			infos.name=finalname;
			infos.id=Math.floor(Math.random()*900000)+100000;
			let tags=[];
			if(infos["tags-1"]!=undefined) tags.push("survival");
			if(infos["tags-2"]!=undefined) tags.push("attack");
			if(infos["tags-3"]!=undefined) tags.push("pvp");
			if(infos["tags-4"]!=undefined) tags.push("sandbox");
			if(infos["tags-5"]!=undefined) tags.push("va");
			if(infos["tags-8"]!=undefined) tags.push("editor");
			if(infos["tags-11"]!=undefined) tags.push("jsmap");
			if(infos["tags-14"]!=undefined) tags.push("nonstandard");
			infos.tags=tags;
			if(infos.author==""){
				fs.unlinkSync(inputFile.path);
				res.send("<script>alert('作者不可为空');location.assign('/upload.html')</script>");
				res.end();
				return;
			}
			if(infos.mapName==""){
				fs.unlinkSync(inputFile.path);
				res.send("<script>alert('地图名不可为空');location.assign('/upload.html')</script>");
				res.end();
				return;
			}
			var old_name = inputFile.path;
			fs.copyFile(old_name,"./maps/"+finalname,(err)=>{
				if(err){
					console.log(err);
					res.send("Error!")
					res.end();
					return
				}
				fs.unlinkSync(old_name);
				fs.writeFile("./mapinfos/"+finalname,JSON.stringify(infos),err=>{
					if(err){
						console.log(err);
						res.send("Error!")
						res.end();
						return
					}
					res.send("<script>alert('上传成功');location.assign('/upload.html')</script>");
					res.end();
					let d=infos
					if(d.tags.indexOf("survival")!=-1) d.mapName="[green][ Sur][white]"+d.mapName
					if(d.tags.indexOf("attack")!=-1) d.mapName="[red][ Att][white]"+d.mapName
					if(d.tags.indexOf("pvp")!=-1) d.mapName="[purple][ PVP][white]"+d.mapName
					if(d.tags.indexOf("sandbox")!=-1) d.mapName="[lightgray][ San][white]"+d.mapName
					if(d.tags.indexOf("editor")!=-1) d.mapName="[blue][ Edi][white]"+d.mapName
					if(d.tags.indexOf("jsmap")!=-1) d.mapName="[orange][ JS][white]"+d.mapName
					if(d.tags.indexOf("nonstandard")!=-1) d.mapName="[cyan][ nonStandard][white]"+d.mapName
					if(d.tags.indexOf("trash")!=-1) d.mapName="[#ff0000][ Tra][white]"+d.mapName
					if(d.tags.indexOf("star")!=-1) d.mapName="[gold][ Sta][white]"+d.mapName
					mapUploads.push("N"+d.id+" "+d.mapName);
					if(mapUploads.length>8){
						mapUploads.shift();
					}
				})
			});
			
		}
	})
}

var uploadFile=function(req,res){
	var form = new multiparty.Form();
	form.uploadDir = "./tmp"
	form.parse(req, function(err, fields, files) {
		if(err||files.file.length<=0){
			console.log('parse error: ' + err);
		} else {
			var inputFile = files.file[0];
			var finalname = inputFile.originalFilename;
			let infos={}
			for(let key in fields){
				infos[key]=fields[key][0];
			}
			let info=fs.statSync(inputFile.path)
			if(info.size>1024*1024*128){
				fs.unlinkSync(inputFile.path);
				res.send("<script>alert('文件大小大于128MB!');location.assign('/files/upload.html')</script>");
				res.end();
				return;
			}
			infos.size=Math.ceil(info.size/1024/1024*100)/100;
			infos.name=finalname;
			infos.id=Math.floor(Math.random()*1000000000);
			if(infos.uploader==""){
				fs.unlinkSync(inputFile.path);
				res.send("<script>alert('上传者不可为空');location.assign('/files/upload.html')</script>");
				res.end();
				return;
			}
			var old_name = inputFile.path;
			fs.copyFile(old_name,"./files/files/"+finalname,(err)=>{
				if(err){
					console.log(err);
					res.send("Error!")
					res.end();
					return
				}
				fs.unlinkSync(old_name);
				fs.writeFile("./files/infos/"+finalname,JSON.stringify(infos),err=>{
					if(err){
						console.log(err);
						res.send("Error!")
						res.end();
						return
					}
					res.send("<script>alert('上传成功');location.assign('/files/list.html')</script>");
					res.end();
				})
			});
			
		}
	})
}

var uploadPlugin=function(req,res){
	var form = new multiparty.Form();
	form.uploadDir = "./tmp"
	form.parse(req, function(err, fields, files) {
		if(err||files.file.length<=0){
			console.log('parse error: ' + err);
		} else {
			var inputFile = files.file[0];
			var finalname = inputFile.originalFilename;
			let infos={}
			for(let key in fields){
				infos[key]=fields[key][0];
			}
			let info=fs.statSync(inputFile.path)
			if(info.size>1024*1024*128){
				fs.unlinkSync(inputFile.path);
				res.send("<script>alert('文件大小大于128MB!');location.assign('/acplugin/upload.html')</script>");
				res.end();
				return;
			}
			infos.size=Math.ceil(info.size/1024/1024*100)/100;
			infos.name=finalname;
			infos.id=Math.floor(Math.random()*10000000);
			let tags=[];
			if(infos["tags-1"]!=undefined) tags.push("content");
			if(infos["tags-2"]!=undefined) tags.push("style");
			infos.tags=tags;
			if(infos.uploader==""){
				fs.unlinkSync(inputFile.path);
				res.send("<script>alert('上传者不可为空');location.assign('/acplugin/upload.html')</script>");
				res.end();
				return;
			}
			var old_name = inputFile.path;
			fs.copyFile(old_name,"./acplugin/files/"+finalname,(err)=>{
				if(err){
					console.log(err);
					res.send("Error!")
					res.end();
					return
				}
				fs.unlinkSync(old_name);
				fs.writeFile("./acplugin/infos/"+finalname,JSON.stringify(infos),err=>{
					if(err){
						console.log(err);
						res.send("Error!")
						res.end();
						return
					}
					res.send("<script>alert('上传成功');location.assign('/acplugin/list.html')</script>");
					res.end();
				})
			});
			
		}
	})
}

var updateMap=function(req,res){
	var form = new multiparty.Form();
	form.uploadDir = "./tmp"
	form.parse(req, function(err, fields, files) {
		if(err||files.file.length<=0){
			console.log('parse error: ' + err);
		} else {
			var inputFile = files.file[0];
			var finalname="";
			var old_name=""
			if(inputFile!=undefined){
				finalname = inputFile.originalFilename;
				old_name = inputFile.path;
			}
			if(!finalname.endsWith(".msav")&&finalname!=""){
				fs.unlinkSync(inputFile.path);
				res.send("<script>alert('这不是一个地图文件!');window.history.back()</script>");
				res.end();
				return;
			}
			let infos={}
			for(let key in fields){
				infos[key]=fields[key][0];
			}
			if(infos.author==""){
				fs.unlinkSync(inputFile.path);
				res.send("<script>alert('作者不可为空!');window.history.back()</script>");
				res.end();
				return;
			}
			if(infos.mapName==""){
				fs.unlinkSync(inputFile.path);
				res.send("<script>alert('地图名不可为空!\nname of map can't be empty');window.history.back()</script>");
				res.end();
				return;
			}
			let tags=[];
			if(infos["tags-1"]!=undefined) tags.push("survival");
			if(infos["tags-2"]!=undefined) tags.push("attack");
			if(infos["tags-3"]!=undefined) tags.push("pvp");
			if(infos["tags-4"]!=undefined) tags.push("sandbox");
			if(infos["tags-5"]!=undefined) tags.push("va");
			if(infos["tags-6"]!=undefined) tags.push("star");
			if(infos["tags-8"]!=undefined) tags.push("editor");
			if(infos["tags-9"]!=undefined) tags.push("trash");
			if(infos["tags-11"]!=undefined) tags.push("jsmap");
			if(infos["tags-14"]!=undefined) tags.push("nonstandard");
			if(infos.adminid==adminid){
				if(infos["tags-7"]!=undefined){
					tags.push("star")
					console.log("a")
				}else if(tags.indexOf("star")!=-1){
					tags.splice(tags.indexOf("star"),1)
				}
				if(infos["tags-10"]!=undefined){
					tags.push("trash")
				}else if(tags.indexOf("trash")!=-1){
					tags.splice(tags.indexOf("trash"),1)
				}
				console.log("v",tags)
			}
			infos.tags=tags
			delete infos.adminid
			if(finalname!=""){
				fs.unlinkSync("./mapinfos/"+infos.name);
				fs.unlinkSync("./maps/"+infos.name);
				infos.name=finalname
			}
			fs.writeFile("./mapinfos/"+infos.name,JSON.stringify(infos),err=>{
				if(err){
					console.log(err);
					res.send("Error!")
					res.end();
					return
				}
				res.send("<script>alert('修改成功');window.history.go(-2)</script>");
				res.end();
				let d=infos
				if(d.tags.indexOf("survival")!=-1) d.mapName="[green][ Sur][white]"+d.mapName
				if(d.tags.indexOf("attack")!=-1) d.mapName="[red][ Att][white]"+d.mapName
				if(d.tags.indexOf("pvp")!=-1) d.mapName="[purple][ PVP][white]"+d.mapName
				if(d.tags.indexOf("sandbox")!=-1) d.mapName="[lightgray][ San][white]"+d.mapName
				if(d.tags.indexOf("editor")!=-1) d.mapName="[blue][ Edi][white]"+d.mapName
				if(d.tags.indexOf("jsmap")!=-1) d.mapName="[orange][ JS][white]"+d.mapName
				if(d.tags.indexOf("nonstandard")!=-1) d.mapName="[cyan][ nonStandard][white]"+d.mapName
				if(d.tags.indexOf("trash")!=-1) d.mapName="[#ff0000][ Tra][white]"+d.mapName
				if(d.tags.indexOf("star")!=-1) d.mapName="[gold][ Sta][white]"+d.mapName
				mapUploads.push("U"+d.id+" "+d.mapName);
				if(mapUploads.length>8){
					mapUploads.shift();
				}
			})
			if(finalname=="") return;
			fs.copyFile(old_name,"./maps/"+finalname,(err)=>{
				if(err){
					console.log(err);
					res.send("Error!")
					res.end();
					return
				}
				
				fs.unlinkSync(old_name);
			});
			
		}
	})
}

var updatePlugin=function(req,res){
	var form = new multiparty.Form();
	form.uploadDir = "./tmp"
	form.parse(req, function(err, fields, files) {
		if(err||files.file.length<=0){
			console.log('parse error: ' + err);
		} else {
			var inputFile = files.file[0];
			var finalname="";
			var old_name=""
			if(inputFile!=undefined){
				finalname = inputFile.originalFilename;
				old_name = inputFile.path;
			}
			let infos={}
			for(let key in fields){
				infos[key]=fields[key][0];
			}
			if(infos.author==""){
				fs.unlinkSync(inputFile.path);
				res.send("<script>alert('作者不可为空!');window.history.back()</script>");
				res.end();
				return;
			}
			
			let tags=[];
			if(infos["tags-1"]!=undefined) tags.push("content");
			if(infos["tags-2"]!=undefined) tags.push("style");
			console.log(tags.join("|"))
			infos.tags=tags;
			if(finalname!=""){
				fs.unlinkSync("./acplugin/infos/"+infos.name);
				fs.unlinkSync("./acplugin/files/"+infos.name);
				infos.name=finalname
			}
			fs.writeFile("./acplugin/infos/"+infos.name,JSON.stringify(infos),err=>{
				if(err){
					console.log(err);
					res.send("Error!")
					res.end();
					return
				}
				res.send("<script>alert('修改成功');window.history.go(-2)</script>");
				res.end();
			})
			if(finalname=="") return;
			fs.copyFile(old_name,"./acplugin/files/"+finalname,(err)=>{
				if(err){
					console.log(err);
					res.send("Error!")
					res.end();
					return
				}
				
				fs.unlinkSync(old_name);
			});
			
		}
	})
}

var app=new express();

app.use("/6802/*",require("./6802.js"))
app.use("/7001/*",require("./7001.js"))
/*
app.use(/.*\.html/g,function(req,res){
    res.send("<h1>Closed</h1>")
    res.end()
})
*/
app.get(/\/mdt.wayzer.top\/api\/maps\/[0-9a-f\.\-]{14,}\/downloadServer.*/, (req,res)=>{
    let path=req.url
    console.log(path)
    let stream=fs.createWriteStream(root+"/temp.msav")
    try{
        axios("https://"+path.substring(1)).pipe(stream).on("close",()=>{
            res.sendFile(root+"/temp.msav")
        })
    }catch(e){
        consolo.log(e);
    }
})

app.use("/mdt.wayzer.top/*",require("./mdt.wayzer.top.js"))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//app.use(express.bodyParser({uploadDir: "./tmp"}))

app.get("/",function(req,res){
	console.log(req.path);
	fs.readFile(root+"/index.html",{encoding:"utf8"},(err,file)=>{
		if(err){
			res.statusCode=500;
			res.send("<h1>500 Internal Server Error</h1><br>"+err);
			res.end();
			return;
		}
		res.statusCode=200;
		res.send(file);
		res.end();
		return;
	})
});

app.post("/api/upload",uploadMap);

app.get("/api/upload",uploadMap);

app.post("/api/files/upload",uploadFile);

app.get("/api/files/upload",uploadFile);

app.post("/api/acplugin/upload",uploadPlugin);

app.get("/api/acplugin/upload",uploadPlugin);

app.post("/api/acplugin/update",updatePlugin);

app.get("/api/acplugin/update",updatePlugin);


app.post("/api/update",updateMap);

app.get("/api/update",updateMap);
/*
app.post("/api/addQuestion",function(req,res){
    console.log(req.body)
    let name=req.body.name
    let key=req.body.key
    let selects=req.body.selects.replace(/\r\n/g,"\n")
    let type=req.body.type
    if(type=="type"){
        fs.readFile("./pvpQuestions.json",(err,data)=>{
        data=JSON.parse(data);
        if(selects==""){
            data.push({
                name:name,
                key:key,
                a:true
            })
        }else{
            data.push({
                name:name,
                key:key,
                a:false,
                se:selects.split("\n")
            })
        }
        fs.writeFile("./pvpQuestions.json",JSON.stringify(data),()=>{})
        })
        res.send("<script>alert('添加成功');window.history.go(-1)</script>");
        return;
    }
    fs.readFile("./questions.json",(err,data)=>{
        data=JSON.parse(data);
        if(selects==""){
            data.push({
                name:name,
                key:key,
                a:true
            })
        }else{
            data.push({
                name:name,
                key:key,
                a:false,
                se:selects.split("\n")
            })
        }
        fs.writeFile("./questions.json",JSON.stringify(data),()=>{})
    })
    res.send("<script>alert('添加成功');window.history.go(-1)</script>");
    //})
});

app.get("/api/shout",function(req,res){
    let text=decodeURIComponent(req.query.text.replace(/SPL/g,"%"))
    let name=decodeURIComponent(req.query.name.replace(/SPL/g,"%"))
    console.log(name+":"+text)
    fs.writeFileSync("../socket/shout",name+"\n"+text)
    res.send("完成. /Done.")
});

app.get("/api/getShout",function(req,res){
    if(!fs.existsSync("../socket/shoutR")){
        res.send("none")
        return
    }
    res.send(fs.readFileSync("../socket/shoutR"))
    fs.unlinkSync("../socket/shoutR")
})

app.get("/api/questionAmount",function(req,res){
    let d1=JSON.parse(fs.readFileSync("./questions.json")).length
    let d2=JSON.parse(fs.readFileSync("./pvpQuestions.json")).length
    res.send({question:d1,pvpQuestion:d2})
});
*/
app.get("/update",function(req,res){
	let name=decodeURIComponent(req.query.name)
	let usid=decodeURIComponent(req.query.usid)
	console.log(name)
	fs.readFile("./mapinfos/"+name,(err,data)=>{
		try{
		console.log(data)
		data=JSON.parse(data);
		console.log(data.usid+"=?="+usid)
		if(data.usid==usid||usid==adminid){
			let file=fs.readFileSync("./web/update.html")
			let dat=JSON.stringify(data);
			for(let key in data){
				dat=dat.replace("\""+key+"\"",key)
			}
			dat=dat.replace(/tags-/g,"tags")
			file=(file+"").replace(/\[data\]/g,dat)
			res.send(file)
			res.end();
			return
		}
		}catch(e){
			console.log(e)
		}
		res.send("<script>alert('usid错误!');window.history.back()</script>")
		return;
	})
});

app.get("/acplugin/update",function(req,res){
	let name=decodeURIComponent(req.query.name)
	let usid=decodeURIComponent(req.query.usid)
	console.log(name)
	fs.readFile("./acplugin/infos/"+name,(err,data)=>{
		// console.log(err)
		try{
		// console.log(data)
		data=JSON.parse(data);
		console.log(data.usid+"=?="+usid)
		if(data.usid==usid||usid==adminid){
			let file=fs.readFileSync("./web/acplugin/update.html")
			let dat=JSON.stringify(data);
			for(let key in data){
				dat=dat.replace("\""+key+"\"",key)
			}
			dat=dat.replace(/tags-/g,"tags")
			file=(file+"").replace(/\[data\]/g,dat)
			res.send(file)
			res.end();
			return
		}
		}catch(e){
			console.log(e)
		}
		res.send("<script>alert('usid错误!');window.history.back()</script>")
		return;
	})
});

app.get("/api/maps",function(req,res){
	let list=fs.readdirSync("./mapinfos");
	let result=[];
	let amount=list.length;
	for(let name of list){
		fs.readFile("./mapinfos/"+name,(err,data)=>{
			if(err){
				amount--;
				return;
			}
			let d=JSON.parse(data);
			delete d.usid
			result.push(d);
			amount--;
			if(amount<=0){
				res.send(JSON.stringify(result));
				res.end();
			}
			return;
		})
	}
	if(amount<=0){
		res.send(JSON.stringify(result));
		res.end();
	}
});


app.get("/api/delete",function(req,res){
	let name=decodeURIComponent(req.query.name)
	let usid=decodeURIComponent(req.query.usid)
	fs.readFile("./mapinfos/"+name,(err,data)=>{
		try{
		data=JSON.parse(data);
		console.log(data.usid+"=?="+usid)
		if(data.usid==usid||usid==adminid){
			fs.renameSync("./mapinfos/"+name,"./trash/maps/mapinfo/"+name);
			fs.renameSync("./maps/"+name,"./trash/maps/maps/"+name);
			res.send("<script>alert('删除成功');window.history.back()</script>");-
			res.end();
			return
		}
		}catch(e){
			console.log(e)
		}
		res.send("<script>alert('usid错误!');window.history.back()</script>")
		return;
	})
});

app.get(new RegExp("api/download/?.*",""),function(req,res){
	let name=decodeURIComponent(req.query.name)
	console.log(name)
	res.sendFile(mapRoot+name)
	return
});

app.get("/api/getInfo",function(req,res){
	let id=req.query.id;
	let list=fs.readdirSync("./mapinfos");
	let result=[];
	let amount=list.length;
	for(let name of list){
		var data=fs.readFileSync("./mapinfos/"+name)
		result.push(JSON.parse(data));
		amount--;
		if(amount<=0){
			for(let d of result){
				if(d.id==id||d.name==id){
					delete d.usid
					if(d.tags.indexOf("survival")!=-1) d.mapName="[green][ Sur][white]"+d.mapName
					if(d.tags.indexOf("attack")!=-1) d.mapName="[red][ Att][white]"+d.mapName
					if(d.tags.indexOf("pvp")!=-1) d.mapName="[purple][ PVP][white]"+d.mapName
					if(d.tags.indexOf("sandbox")!=-1) d.mapName="[lightgray][ San][white]"+d.mapName
					if(d.tags.indexOf("editor")!=-1) d.mapName="[blue][ Edi][white]"+d.mapName
					if(d.tags.indexOf("jsmap")!=-1) d.mapName="[orange][ JS][white]"+d.mapName
					if(d.tags.indexOf("nonstandard")!=-1) d.mapName="[cyan][ nonStandard][white]"+d.mapName
					if(d.tags.indexOf("trash")!=-1) d.mapName="[#ff0000][ Tra][white]"+d.mapName
					if(d.tags.indexOf("star")!=-1) d.mapName="[gold][ Sta][white]"+d.mapName
					console.log(d.mapName)
					
					d.mapName=(d.mapName+"").replace(/<a style="color:/g,"[").replace(/;">/g,"]").replace(/">/g,"]").replace(/<a style='color:/g,"[").replace(/;'>/g,"]").replace(/'>/g,"]")
					res.send(d)
					res.end()
					return
				}
			}
			res.send("not found!");
			res.end();
			return;
		}
	}
});

app.get("/api/getFirstMapPage",function(req,res){
	let ret="----netMap-new----\n";
	ret+=mapUploads.join("\n");
	ret+="\n----netMap-star----\n";
	let list=fs.readdirSync("./mapinfos");
	let result=[];
	let amount=list.length;
	for(let name of list){
		fs.readFile("./mapinfos/"+name,(err,data)=>{
			if(err) return --amount;
			let d=JSON.parse(data);
			if(d.tags==undefined) d.tags=[]
			if(d.tags.indexOf("star")!=-1){
				if(d.tags.indexOf("survival")!=-1) d.mapName="[green][ Sur][white]"+d.mapName
				if(d.tags.indexOf("attack")!=-1) d.mapName="[red][ Att][white]"+d.mapName
				if(d.tags.indexOf("pvp")!=-1) d.mapName="[purple][ PVP][white]"+d.mapName
				if(d.tags.indexOf("sandbox")!=-1) d.mapName="[lightgray][ San][white]"+d.mapName
				if(d.tags.indexOf("editor")!=-1) d.mapName="[blue][ Edi][white]"+d.mapName
				if(d.tags.indexOf("jsmap")!=-1) d.mapName="[orange][ JS][white]"+d.mapName
				if(d.tags.indexOf("nonstandard")!=-1) d.mapName="[cyan][ nonStandard][white]"+d.mapName
				if(d.tags.indexOf("trash")!=-1) d.mapName="[#ff0000][ Tra][white]"+d.mapName
				if(d.tags.indexOf("star")!=-1) d.mapName="[gold][ Sta][white]"+d.mapName
				result.push(d.id+" "+d.mapName);
			}
			--amount;
			if(amount<=0){
				for(let i=0;i<3;i++){
					let random=Math.floor(Math.random()*result.length);
					ret+=result[random]+"\n";
				}
				res.send(ret);
				res.end();
			}
		})
	}
})

app.get(/\/test.*/,function(req,res){
	console.log(res);
	res.send(JSON.stringify(req.query));
	res.end();
});

app.get("/api/questions",function(req,res){
	let id=decodeURIComponent(req.query.id)
	if(id!=adminid){
	    res.send("Error!")
	    return;
	}
	res.send(fs.readFileSync("./questions.json"));
});

app.get("/api/pvpQuestions",function(req,res){
	let id=decodeURIComponent(req.query.id)
	if(id!=adminid){
	    res.send("Error!")
	    return;
	}
	res.send(fs.readFileSync("./pvpQuestions.json"));
});

app.get("/api/gdoc",function(req,res){
	let name=decodeURIComponent(req.query.name)
	fs.readFile("./docs/"+name,(e,d)=>{
	    if(e){
	        res.send({data:e+""})
	        return;
	    }
	    res.send({data:d.toString()})
	})
});

app.post("/api/sdoc",function(req,res){
	let name=req.body.name
	fs.writeFile("./docs/"+name,req.body.text+"",()=>{})
	//console.log(name,req.body.text)
	res.send("success!")
});

/*
    api/getGameDisplayNews
        获取游戏内显示的
    api/getNew?day=...
        获取外面显示的
    api/addNew?usid=...&data=...  POST
        添加
    api/changeNew?usid=...&data=...  POST
        更改
    api/changeDisplay?usid=...&data=...  POST
        更改游戏内显示
*/

var getDate=()=>{
    return Math.floor((Date.now()+(8*60*60*1000))/86400000)-19050
}

app.get("/api/getGameDisplayNews",function(req,res){
	console.log(getDate())
	let data=JSON.parse(fs.readFileSync("./news.json"));
	let out=[];
	let min=Math.max(getDate()-16,0)
	for(let i=min;i<getDate()-1;i++){
	if(data[i]==undefined) continue;
		out.push(data[i].dsp)
	}
	res.send(JSON.stringify(out).replace(/\r\n/g,"\n"))
});

app.get("/api/getGameDisplayNewsCurr",function(req,res){
	let data=JSON.parse(fs.readFileSync("./news.json"));
	res.send(data[getDate()-1].dsp)
});

app.get("/api/getNews",function(req,res){
	fs.readFile("./news.json",(e,d)=>{
		let data=JSON.parse(d);
		if(data[req.query.day-1]==undefined){
			res.send("不存在!")
			return;
		}
		res.send(data[req.query.day-1].all)
	})
});

app.post("/api/addNew",function(req,res){
	fs.readFile("./news.json",(e,d)=>{
		let data=JSON.parse(d);
		let usid=req.body.usid;
		let text=req.body.data;
		let news=data[getDate()-1];
		if(news==undefined){
			data[getDate()-1]={
				dsp:"---土豆日报 day"+getDate()+"---\n-----分割线-----",
				all:"---土豆日报 day"+getDate()+"---\n-----分割线-----"
			}
			news=data[getDate()-1]
		}
		news.all+="\n"+text+"\n     --"+usid+"\n-----分割线-----";
		fs.writeFile("./news.json",JSON.stringify(data),(e)=>{})
		res.send("<script>alert('添加成功');window.history.back()</script>")
	})
});

app.post("/api/changeNew",function(req,res){
	fs.readFile("./news.json",(e,d)=>{
		let data=JSON.parse(d);
		let usid=req.body.usid;
		if(usid!=adminid) return;
		let text=req.body.data;
		let news=data[getDate()-1];
		if(news==undefined){
			data[getDate()]={
				dsp:"---土豆日报 day"+getDate()+"---\n-----分割线-----",
				all:"---土豆日报 day"+getDate()+"---\n-----分割线-----"
			}
			news=data[getDate()-1]
		}
		news.all=text;
		fs.writeFile("./news.json",JSON.stringify(data),(e)=>{})
	})
});

app.post("/api/changeDisplay",function(req,res){
	fs.readFile("./news.json",(e,d)=>{
		let data=JSON.parse(d);
		let usid=req.body.usid;
		if(usid!=adminid) return;
		let text=req.body.data;
		let news=data[getDate()];
		if(news==undefined){
			data[getDate()-1]={
				dsp:"---土豆日报 day"+getDate()+"---\n-----分割线-----",
				all:"---土豆日报 day"+getDate()+"---\n-----分割线-----"
			}
			news=data[getDate()]
		}
		news.dsp=text;
		fs.writeFile("./news.json",JSON.stringify(data),(e)=>{})
	})
});

app.post("/api/changeDisplayCurr",function(req,res){
	fs.readFile("./news.json",(e,d)=>{
		let data=JSON.parse(d);
		let usid=req.body.usid;
		if(usid!=adminid) return;
		let text=req.body.data;
		let news=data[getDate()-1];
		if(news==undefined){
			data[getDate()-1]={
				dsp:"---土豆日报 day"+getDate()+"---\n-----分割线-----",
				all:"---土豆日报 day"+getDate()+"---\n-----分割线-----"
			}
			news=data[getDate()-1]
		}
		news.all=text;
		fs.writeFile("./news.json",JSON.stringify(data),(e)=>{})
	})
});

app.post("/api/changeNewsAdmin",function(req,res){
	fs.readFile("./news.json",(e,d)=>{
		let data=JSON.parse(d);
		let usid=req.body.usid;
		if(usid!=adminid) return;
		let all=req.body.all;
		let dsp=req.body.dsp;
		let news=data[getDate()-1];
		if(news==undefined){
			data[getDate()-1]={
				dsp:"---土豆日报 day"+getDate()+"---\n-----分割线-----",
				all:"---土豆日报 day"+getDate()+"---\n-----分割线-----"
			}
			news=data[getDate()-1]
		}
		news.all=all;
		news.dsp=dsp;
		res.send("success!")
		fs.writeFile("./news.json",JSON.stringify(data),(e)=>{})
	})
});

app.get(new RegExp("api/files/download/?.*",""),function(req,res){
	let name=req.path.substring(req.path.lastIndexOf("/"),req.path.length)
	name=decodeURIComponent(name)
	console.log(name)
	res.sendFile(fileRoot+name)
	return
});

app.get("/api/files/getInfo",function(req,res){
	let id=req.query.id;
	let list=fs.readdirSync("./files/infos");
	let result=[];
	let amount=list.length;
	for(let name of list){
		var data=fs.readFileSync("./files/infos/"+name)
		result.push(JSON.parse(data));
		amount--;
		if(amount<=0){
			for(let d of result){
				if(d.id==id||d.name==id){
					delete d.usid
					res.send(d)
					res.end()
					return
				}
			}
			res.send("not found!");
			res.end();
			return;
		}
	}
});

app.get("/api/files/getFile",function(req,res){
	let id=req.query.id;
	let list=fs.readdirSync("./files/infos");
	let result=[];
	let amount=list.length;
	for(let name of list){
		var data=fs.readFileSync("./files/infos/"+name)
		result.push(JSON.parse(data));
		amount--;
		if(amount<=0){
			for(let d of result){
				if(d.id==id||d.name==id){
					delete d.usid
					res.sendFile(fileRoot+d.name)
					return
				}
			}
			res.send("not found!");
			res.end();
			return;
		}
	}
});

app.get("/api/files/list",function(req,res){
	let list=fs.readdirSync("./files/infos");
	let result=[];
	let amount=list.length;
	for(let name of list){
		fs.readFile("./files/infos/"+name,(err,data)=>{
			if(err){
				amount--;
				return;
			}
			let d=JSON.parse(data);
			delete d.usid
			result.push(d);
			amount--;
			if(amount<=0){
				res.send(JSON.stringify(result));
				res.end();
			}
			return;
		})
	}
	if(amount<=0){
		res.send(JSON.stringify(result));
		res.end();
	}
});

app.get("/api/files/delete",function(req,res){
	let name=decodeURIComponent(req.query.name)
	let usid=decodeURIComponent(req.query.usid)
	fs.readFile("./files/infos/"+name,(err,data)=>{
		try{
		data=JSON.parse(data);
		console.log(data.usid+"=?="+usid)
		if(data.usid==usid||usid==adminid){
			fs.renameSync("./files/infos/"+name,"./trash/files/fileinfo/"+name);
			fs.renameSync("./files/files/"+name,"./trash/files/files/"+name);
			res.send("<script>alert('删除成功');window.history.back()</script>")
			res.end();
			return
		}
		}catch(e){
			console.log(e)
		}
		res.send("<script>alert('usid错误!');window.history.back()</script>")
		return;
	})
});

app.get("/api/acplugin/list",function(req,res){
	let list=fs.readdirSync("./acplugin/infos");
	let result=[];
	let amount=list.length;
	for(let name of list){
		fs.readFile("./acplugin/infos/"+name,(err,data)=>{
			if(err){
				amount--;
				return;
			}
			let d=JSON.parse(data);
			delete d.usid
			result.push(d);
			amount--;
			if(amount<=0){
				res.send(JSON.stringify(result));
				res.end();
			}
			return;
		})
	}
	if(amount<=0){
		res.send(JSON.stringify(result));
		res.end();
	}
});

app.get("/api/acplugin/delete",function(req,res){
	let name=decodeURIComponent(req.query.name)
	let usid=decodeURIComponent(req.query.usid)
	fs.readFile("./acplugin/infos/"+name,(err,data)=>{
		try{
		data=JSON.parse(data);
		console.log(data.usid+"=?="+usid)
		if(data.usid==usid||usid==adminid){
			fs.unlinkSync("./acplugin/infos/"+name);
			fs.unlinkSync("./acplugin/files/"+name);
			res.send("<script>alert('删除成功');window.history.back()</script>")
			res.end();
			return
		}
		}catch(e){
			console.log(e)
		}
		res.send("<script>alert('usid错误!');window.history.back()</script>")
		return;
	})
});

app.get(new RegExp("api/acplugin/download/?.*",""),function(req,res){
	let name=req.path.substring(req.path.lastIndexOf("/"),req.path.length)
	name=decodeURIComponent(name)
	console.log(name)
	res.sendFile(acpluginRoot+name)
	return
});

app.get("/api/acplugin/get",function(req,res){
	let id=req.query.id;
	let list=fs.readdirSync("./acplugin/infos");
	let result=[];
	let amount=list.length;
	for(let name of list){
		var data=fs.readFileSync("./acplugin/infos/"+name)
		result.push(JSON.parse(data));
		amount--;
		if(amount<=0){
			for(let d of result){
				if(d.id==id||d.name==id){
					delete d.usid
					res.sendFile(acpluginRoot+d.name)
					return
				}
			}
			res.send("not found!");
			res.end();
			return;
		}
	}
});

let types=["1v1","3v3","5v5","2v2v2","1v1v1v1","3v3v3v3"]
app.post("/api/baoming",function(req,res){
    console.log(req.body)
    let id=req.body.id
    let players=req.body.players.replace(/\r\n/g,"\n").split("\n")
    let type=req.body.type
    if(!types.includes(type)){
        res.send("<script>alert('无效的类型\\n可用的类型有:\\n"+types.join("\\n")+"');window.history.go(-1)</script>");
        return
    }
    fs.readFile("./pvp.json",(err,data)=>{
        data=JSON.parse(data);
        data.push({
            id:id,
            players:players,
            type:type
        })
        fs.writeFile("./pvp.json",JSON.stringify(data),()=>{})
    })
    res.send("<script>alert('报名成功');window.history.go(-1)</script>");
    //})
});

app.get("/api/baominglist",function(req,res){
    fs.readFile("./pvp.json",(err,data)=>{
        let str=""
        data=JSON.parse(data);
        for(let d of data){
            if(!d.players) d.players=[]
            
            str+="队长:"+d.id+"\n玩家列表:"+d.players.join(",")+"\n类型:"+d.type+"\n---分割线---\n"
        }
        res.send(str)
    })
})

app.get(/.*/,function(req,res){
	let path=decodeURIComponent(req.path)
	console.log(path);
	res.sendFile(root+path,{
		dotfiles:"deny"
	});
});


app.listen(port,()=>{
	console.log("done. port"+port);
});