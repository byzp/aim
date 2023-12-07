"use strict";

Aim.op={}

Aim.op.zero=(str,len)=>{
    str=str+""
    let add=len-str.length
    if(add<=0){
        return str
    }
    for(let i=add;i>0;i--){
        str="0"+str
    }
    return str
}
Aim.op.cost=(type)=>{
    let req=type.requirements
    let cost=0
    for(let stack of req){
        let item=stack.item
        let amount=stack.amount
        let co=Aim.score.itemCost[item.toString().replace(/-/g,"")]
        if(co==undefined){
            co=0
        }
        cost+=co*amount
    }
    return cost
}

Aim.op.costR=(args)=>{
    let req=[]
    for(let istack of args){
        req.push(istack)
    }
    let cost=0
    for(let stack of req){
        let item=stack.item
        let amount=stack.amount
        let co=Aim.score.itemCost[item.toString().replace(/-/g,"")]
        if(co==undefined){
            co=0
        }
        cost+=co*amount
    }
    return cost
}

Aim.op.arrayToString=(array,index,str)=>{
    let output=""
    for(let i=index;i<array.length;i++){
        output+=array[i]+str
    }
    output=output.substring(0,output.length-str.length)
    return output
}

Aim.op.checkVer=(ver_,targ_)=>{
	debugLog(ver_+" <-> "+targ_)
	let ver=ver_.split(".")
	let targ=targ_.split(".")
	let succ=true
	for(let i in targ){
		if(targ[i]>ver[i]){
			succ=false
			break
		}
	}
	return succ
}

Aim.op.messageFilter=(message,player)=>{
    for(let key in Aim.messageFilters){
        let ret=Aim.messageFilters[key]
        if(typeof(ret)!="string") ret=ret(player)
        message=message.replace(new RegExp(key,"g"),ret)
    }
    return message
}

Aim.op.textList=(function(){
    let status={};
    let selects=[
        ["<-","page","->"],
        ["close"]
    ];
    let listFn=()=>{}
    let menuId=Menus.registerMenu((player,select)=>{
        if(select==1){
            listFn(player,status[player.uuid()].index);
            return;
        }
        if(select==0){
            listFn(player,Math.max(status[player.uuid()].index-1,0));
            return;
        }
        if(select==2){
            listFn(player,Math.min(status[player.uuid()].index+1,status[player.uuid()].list.length-1));
            return;
        }
    })
    listFn=function(player,index){
        let sel=selects;
        sel[0][1]=(index+1)+"/"+status[player.uuid()].list.length;
        status[player.uuid()].index=index;
        sel[1][0]=bundle(player,"close")
        Call.menu(player.con,menuId,"",status[player.uuid()].list[index],sel);
    }
    return function(player,list,index){
        status[player.uuid()]={
            list:list,
            index:index
        }
        listFn(player,index);
    }
})()



Aim.op.getMode=(type)=>{
    if(type==undefined) return Aim.gameModes.empty;
    if(Aim.gameModes[type]!=undefined){
        return Aim.gameModes[type];
    }
    for(let key in Aim.gameModes){
        if(Aim.gameModes[key].modeName==type) return Aim.gameModes[key];
    }
    for(let key in Aim.gameModes){
        if(key=="menu"||key=="temp") continue;
        if(Aim.gameModes[key].otherName.indexOf(type)!=-1) return Aim.gameModes[key];
    }
    return Aim.gameModes.empty;
}

Aim.op.applyModes=(args)=>{
    //debugLog(args.join(" - "))
    let all=" "+Aim.op.arrayToString(args,0," ");
    //debugLog(all)
    all=all.split(" -")
    all.shift()
    //debugLog(all.join(" - "))
    let obj={
        modes:[],
        args:[],
        beforeReload:function(t,map){
            let index=0;
            this.modes.forEach(m=>{
                m.beforeReload(this.args[index],map)
                index++;
            })
        },
        applyRules:function(rules,t,map){
            this.modes.forEach((m,i)=>{
                //debugLog(JSON.stringify(this.args))
                rules=m.applyRules(rules,this.args[i],map)
            })
            return rules;
        },
        aimStateReset:function(t,map){
            let index=0;
            this.modes.forEach(m=>{
                m.aimStateReset(this.args[index],map)
                index++;
            })
        },
        beforeReloadEnd:function(t,map){
            let index=0;
            this.modes.forEach(m=>{
                m.beforeReloadEnd(this.args[index],map)
                index++;
            })
        },
        afterReloadEnd:function(t,map){
            let index=0;
            this.modes.forEach(m=>{
                m.afterReloadEnd(this.args[index],map)
                index++;
            })
        },
        modeName:"",
        customMode:false
    }
    all.forEach(x=>{
        let spl=x.split(" ");
        let mode=Aim.op.getMode(spl[0])
        //debugLog(mode.modeName)
        obj.modes.push(mode);
        if(mode.customMode){
            obj.modeName+=mode.modeName+"&";
            obj.customMode=true;
            obj.guides=mode.guides;
        }
        spl.shift();
        debugLog(JSON.stringify(spl))
        obj.args.push(spl);
    })
    obj.modeName=obj.modeName.substring(0,obj.modeName.name-1)
    return obj;
}

Aim.op.emoji=(content)=>{
    if(content==null) return "@"
    let strs=content.toString().split("-");
    let str="";
    strs.forEach(s=>{str+=s.substring(0,1).toUpperCase()+s.substring(1,s.length)})
    return eval("'\\u"+Iconc[content.contentType+str].toString(16)+"'")
}

Aim.event.requires.chatFilter.push(function(player,message){
    if(Aim.op.nextChat.inputing[player.uuid()]!=undefined&&Aim.op.nextChat.inputing[player.uuid()].length>0){
        Aim.op.nextChat.inputing[player.uuid()].shift()(player,message)
        return null;
    }
    return message;
})

Aim.op.nextChat=function(player,cback){
    if(Aim.op.nextChat.inputing[player.uuid()]==undefined){
        Aim.op.nextChat.inputing[player.uuid()]=[];
    }
    Aim.op.nextChat.inputing[player.uuid()].push(cback);
};
Aim.op.nextChat.inputing={};

Aim.op.chooseLangM=Menus.registerMenu((p,s)=>{
    let l=undefined;
    let i=0;
    for(let n in Aim.bundles){
        if(s==i) l=n;
        i++
    }
    let first=Aim.data.getData(p).lang==undefined;
    Aim.data.getData(p).lang=l;
    if(first){
        for(let func of Aim.event.requires.playerJoinV){
	    	func(p)
	    }
    }
})
Aim.op.chooseLang=function(p){
    let a=[];
    for(let n in Aim.bundles){
        a.push([n])
    }
    Call.menu(p.con,Aim.op.chooseLangM,"choose your lang","you can use ;lang do this after you choosed",a)
}

Aim.op.host=(map,mode,t)=>{
    Aim.vote.pause=true
    mode.beforeReload(t,map)
    let reloader=new WorldReloader()
    reloader.begin()
    let rule=mode.applyRules(map.rules(),t,map)
    Vars.world.loadMap(map,rule)
    if(mode.customMode) rule.modeName=mode.modeName
    Vars.state.rules=rule
    Vars.logic.play()
    mode.beforeReloadEnd(t,map);
    reloader.end()
    mode.afterReloadEnd(t,map);
    //Aim.event.worldLoadOver();
    mode.aimStateReset(t,map)
    Aim.vote.pause=false;
}

Aim.op.utcToStr=(p,t)=>{
    t=parseInt(t/1000)
	let time=parseInt(t/86400)+bundle(p,"day")
	time+=parseInt(t/3600)%24+bundle(p,"hour")
	time+=parseInt(t/60)%60+bundle(p,"minute")
	time+=(parseInt(t)%60)+bundle(p,"second")
	return time
}
