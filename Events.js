"use strict";

//投票bug修复
//拆除分数修复
Aim.event = {}

Aim.event.requires = {
    chatFilter: [],
    playerConnect: [],
    playerJoin: [],
    playerLeave: [],
    wave: [],
    worldLoad: [],
    worldLoadOver: [],
    gameover: [],
    blockBuildBegin: [],
    blockBuildEnd: [],
    blockDestroy: [],
    config: [],
    tap: [],
    message: [],
    update: [],
    update1: [],
    update5: [],
    update30: [],
    update300: [],
    playerJoinV: [],
    actions: {
        breakBlock: [],
        buildSelect: [],
        command: [],
        commandBuilding: [],
        commandUnits: [],
        configure: [],
        control: [],
        depositItem: [], //放入物品
        placeBlock: [],
        removePlanned: [],
        rotate: [],
        withdrawItem: [] //拿取物品
    }
}

Aim.event.chatFilter = (p, me) => {
    let m = me
    try {
        if (Aim.data.getData(p).oldMode) {
            if (m.startsWith("*")) {
                m = m.replace("*", ";");
            }
        }
        m = m.replace("；", ";")
        let t = m.split(" ")
        let cmd = Aim.commands[t[0]]
        let acmd = Aim.adminCommands[t[0]]
        let scmd = Aim.skillCommands[t[0]]
        for (let func of Aim.event.requires.chatFilter) {
            let ret = func(p, m)
            if (ret == null) {
                m = null
                return m
            }
            if (ret != undefined) m = ret
        }
        if (cmd != undefined && (t[0] == ";aimcfg" || Aim.data.config.enabled)) {
            if (Aim.data.muting[p.uuid().substring(0, 3)] > Date.now() && cmd.muteable) {
                p.sendMessage(bundle(p, "muting", Aim.op.utcToStr(p,undefined)))
                m = null
                return
            }
            infoLog(p.name, me)
            cmd.func(p, t, m)
            p.lastText = ""
            m = null
        } else if (acmd != undefined && (t[0] == ";aimcfg" || Aim.data.config.enabled) && p.admin) {
            acmd.func(p, t, m)
            p.lastText = ""
            m = null
        } else if (scmd != undefined && Aim.data.config.enabled) {
            if (Aim.data.muting[p.uuid().substring(0, 3)] > Date.now() && scmd.muteable) {
                //p.sendMessage(p+"\n"+p.uuid()+"\n")
                //log(Aim.data.muting[p.uuid().substring(0, 3)])
                p.sendMessage(bundle(p, "muting", Aim.op.utcToStr(p,undefined)))
                return null
            }
            if (Aim.state.bannedSkills.indexOf(t[0]) == -1) {
                let run = true
                if (scmd.use != undefined) {
                    if (scmd.use.check) {
                        if (scmd.use.usePoint > Aim.data.getData(p).point) {
                            p.sendMessage(bundle(p, "needMorePoint", Aim.data.getData(p).point, scmd.use.usePoint, Aim.POINT, Aim.POINT, Aim.POINT))
                            run = false
                        } else if (scmd.use.minLevel > Aim.data.getData(p).level) {
                            p.sendMessage(bundle(p, "levelLow", Aim.data.getData(p).level, scmd.use.minLevel))
                            run = false
                        } else if (!Aim.data.getData(p).canUse && !scmd.use.usePower <= 0) {
                            p.sendMessage("" + bundle(p, "isOverload"))
                            run = false
                        } else if (scmd.use.checkFunc && !scmd.use.checkFunc(p, t, m, Aim.data.getData(p).level)) {
                            p.sendMessage(bundle(p, "cantUseNow"))
                            run = false
                        } else if (scmd.use.remove) {
                            Aim.data.getData(p).point -= scmd.use.usePoint
                            Aim.data.getData(p).power -= scmd.use.usePower
                            if (Aim.data.getData(p).power < 0) Aim.data.getData(p).canUse = false
                        }
                    }
                }
                if (run) {
                    scmd.func(p, t, m, Aim.data.getData(p).level)
                    Call.sendMessage("[gray][" + (p.name.startsWith("[") ? "[" : "") + p.name + "[gray]]: [white]" + m)
                }
            } else {
                p.sendMessage(bundle(p, "aim.skillbanned", t[0].substring(1, t[0].length)))
            }
            m = null
        } else if (t[0].startsWith(";")) {
            p.sendMessage(bundle(p, "aim.errorCmd", t[0]))
            m = null
        } else if (Aim.data.muting[p.uuid().substring(0, 3)] > Date.now()) {
            p.sendMessage(bundle(p, "muting", Aim.op.utcToStr(p,undefined)))
            return null
        }
        if (m != null) m = Aim.op.messageFilter(m, p)
        if (m != null && m.startsWith("/")) {
            //code from mindustry.core.NetServer
            //log with brackets
            Log.info("<&fi@: @&fr>", "&lk" + p.plainName(), "&lw" + m);

            //check if it's a command
            let response = Vars.netServer.clientCommands.handleMessage(m.replace("/", "/COMMAND-HANDLER"), p);

            //a command was sent, now get the output
            if (response.type != CommandHandler.ResponseType.noCommand && response.type != CommandHandler.ResponseType.valid) {
                let text = Vars.netServer.invalidHandler.handle(p, response);
                if (text != null) {
                    p.sendMessage(text);
                }
            }
            return null
        }
        //p.getInfo().lastSentMessage=m+""
    } catch (e) {
        p.sendMessage(e)
        errLog(p.uuid().substring(0, 3) + " -> " + me, e)
        //p.getInfo().lastSentMessage=""
        m = null
    }
    //if(m!=null) m=Aim.op.messageFilter(m,p)
    if (m != null)
        for (let func of Aim.event.requires.message) {
            func(p, m)
        }
    return m
}
/*
Aim.event.chatFilter=(p,me)=>{
	let m=me
	try{
		let t=m.split(" ")
		let cmd=Aim.commands[t[0]]
		let acmd=Aim.adminCommands[t[0]]
		let scmd=Aim.skillCommands[t[0]]
		for(let func of Aim.event.requires.chatFilter){
			let ret=func(p,m)
			if(ret==null){
				m=null
				return m
			}
			if(ret!=undefined) m=ret
		}
		if(cmd!=undefined&&(t[0]==";aimcfg"||Aim.data.config.enabled)){
			cmd.func(p,t,m)
			p.lastText=""
			m=null
		}else if(acmd!=undefined&&(t[0]==";aimcfg"||Aim.data.config.enabled)&&p.admin){
			acmd.func(p,t,m)
			p.lastText=""
			m=null
		}else if(scmd!=undefined&&Aim.data.config.enabled){
			if(Aim.state.bannedSkills.indexOf(t[0])==-1){
				let run=true
				if(scmd.use!=undefined){
					if(scmd.use.cherk){
						if(scmd.use.usePoint>Aim.data.getData(p).point){
							p.sendMessage(bundle(p,"needMorePoint",Aim.data.getData(p).point,scmd.use.usePoint))
							run=false
						}else if(scmd.use.minLevel>Aim.data.getData(p).level){
							p.sendMessage(bundle(p,"levelLow",Aim.data.getData(p).level,scmd.use.minLevel))
							run=false
						}else if(!Aim.data.getData(p).canUse&&!scmd.use.usePower<=0){
								p.sendMessage(""+bundle(p,"isOverload"))
								run=false
						}else if(scmd.use.remove){
							Aim.data.getData(p).point-=scmd.use.usePoint
							Aim.data.getData(p).power-=scmd.use.usePower
							if(Aim.data.getData(p).power<0) Aim.data.getData(p).canUse=false
						}
					}
				}
				if(run) scmd.func(p,t,m,Aim.data.getData(p).level)
			}else{
				p.sendMessage(bundle(p,"aim.skillbanned",t[0].substring(1,t[0].length)))
			}
			m=null
		}else if(t[0].startsWith(";")){
			p.sendMessage(bundle(p,"aim.errorCmd",t[0]))
			m=null
		}
		p.getInfo().lastSentMessage=m+""
		if(m!=null) m=Aim.op.messageFilter(m,p)
		return m;
	}catch(e){
		p.sendMessage(e)
		errLog(p.uuid().substring(0,3)+" -> "+me,e)
		p.getInfo().lastSentMessage=""
		m=null
	}
	if(m!=null) m=Aim.op.messageFilter(m,p)
	return m
}
*/
Aim.event.playerConnect = (e) => {
    if (!Aim.data.config.enabled) return;
    let p = e.player
    let bl = Aim.data.blacklist[p.uuid()]
    Aim.players[p.uuid().substring(0, 3)] = p
    let data = Aim.data.getData(p)
    if (bl == undefined) bl = Aim.data.blacklist[p.uuid().substring(0, 3)]
    if (bl != undefined && (bl.unbantime > Date.now() || bl.unbantime == undefined)) {
        let mess = bundle(p, "aim.inBlacklistM") + "\n"
        if (bl.unbantime != undefined) {
            let t = bl.unbantime - Date.now()
            t = parseInt(t / 1000)
            let time = parseInt(t / 86400) + bundle(p, "day")
            time += parseInt(t / 3600) % 24 + bundle(p, "hour")
            time += parseInt(t / 60) % 60 + bundle(p, "minute")
            time += (parseInt(t) % 60) + bundle(p, "second")
            mess += bundle(p, "aim.inBlacklistT", time) + "\n"
            //p.name = "[white][LV." + data.level + "]" + data.title + "|" + p.uuid().substring(0, 3) + "|[#" + p.color + "]" + p.name + "[white]"
            p.name = "[#B0E0E6]" + p.uuid().substring(0, 3)+ "[white] | " + p.name + "[white]"
            sayX("aim.inBlacklist", p.name, bl.reason, parseInt(t / 86400), parseInt(t / 3600) % 24, parseInt(t / 60) % 60, parseInt(t % 60))
        } else {
            mess += bundle(p, "permanent") + "\n"
            sayX("aim.inBlacklistN", p.name, bl.reason)
        }
        let reason = bl.reason
        if (reason.startsWith("$")) reason = bundle(p, reason.substring(1, reason.length))
        mess += bundle(p, "reason") + ":\n" + reason
        p.con.kick(mess, 0)
        return;
    }
    for (let func of Aim.event.requires.playerConnect) {
        func(p)
    }
    let realName = p.name;
    Aim.data.getData(p).realName = realName;
    //p.name = "[white][LV." + data.level + "]" + data.title + "|" + p.uuid().substring(0, 3) + "|[#" + p.color + "]" + p.name + "[white]"
    p.name = "[#B0E0E6]" + p.uuid().substring(0, 3)+ "[white] | " + p.name + "[white]"
}

Aim.event.playerJoin = (e) => {
    if (!Aim.data.config.enabled) return;
    let p = e.player
    Aim.players[p.uuid().substring(0, 3)] = p
    /*
    Timer.schedule(()=>{
    	Call.sendMessage("[[[green]+[white]] "+p.name)
    	log("none/base.js","playerJoin "+p.name+"|-|"+p.uuid())
    },0.8)
    */
    //infoLog(Aim.data.getData(p).realName+" has connected. ["+p.uuid()+"]")
    for (let func of Aim.event.requires.playerJoin) {
        func(p)
    }
    if (Aim.data.getData(p).voteMenu != false) {
        for (let id in Aim.vote.votes) {
            if (Aim.vote.votes[id] == undefined) continue;
            let vote = Aim.vote.votes[id];
            Aim.vote.displayVote(p, vote);
        }
    }
    if (Aim.data.getData(p).lang == undefined) {
        Aim.op.chooseLang(p)
        //Aim.data.getData(p).lang = "中文";
    } else {
        for (let func of Aim.event.requires.playerJoinV) {
            func(e.player)
        }
    }
}

Aim.event.worldLoadOver = () => {
    if (!Aim.data.config.enabled) return;
    for (let a in Aim.state.temps.worldLabelInstances) {
        Aim.state.temps.worldLabelInstances[a].remove()
    }
    Aim.resetState();
    Timer.schedule(() => {
        let id = 0
        Vars.maps.all().find(mx => {
            id++;
            let re = mx.name() == Vars.state.map.name();
            return re
        })
        Aim.state.mapid = id - 1
    }, 1)
    //Vars.state.serverPaused=true
    Timer.schedule(() => {
        Aim.vote.pause = false
        Groups.player.each(player => {
            player.team(Team.get(255))
        })
        //Vars.state.serverPaused=false
        let list = []
        Groups.player.each(player => list.push(player))
        Timer.schedule(() => Aim.team.giveTeam(list.shift()), 0.1, 0.1, list.length - 1)
    }, 5)
    for (let funcid in Aim.event.requires.worldLoadOver) {
        try {
            Aim.event.requires.worldLoadOver[funcid]()
        } catch (e) {
            errLog("Aim.event.requires.worldLoadOver[" + funcid + "]", e)
        }
    }
}

Aim.event.playerLeave = (e) => {
    if (!Aim.data.config.enabled) return;
    //infoLog(e.player.name+" has disconnected. ["+e.player.uuid()+"] (closed)")
    let bl = Aim.data.blacklist[e.player.uuid()]
    if (!(bl != undefined && (bl.unbantime > Date.now() || bl.unbantime == undefined))) {
        //Call.sendMessage("[[[red]-[white]] "+e.player.name)

        for (let func of Aim.event.requires.playerLeave) {
            func(e.player)
        }
    }
}

Aim.event.update30 = function() {
    for (let id in Aim.event.requires.update30) {
        try {
            Aim.event.requires.update30[id]()
        } catch (e) {
            errLog("aim.event.requires.update30[" + id + "]", e)
        }
    }
    Groups.player.each(p => {
        let d = Aim.data.getData(p)
        let t = Date.now() - d.lastUpdate
        t /= 1000
        let addpo = t / d.pointReplyTime
        let addpw = t / d.powerReplyTime
        d.point = Math.min(d.pointCap, d.point + addpo)
        d.power = Math.min(d.powerCap, d.power + addpw)
        if (d.power == d.powerCap) {
            d.canUse = true
        }
        d.lastUpdate = Date.now()
        if (d.exp >= d.level) {
            d.exp -= d.level
            p.name = p.name.replace("[LV." + d.level + "]", "[LV." + (d.level + 1) + "]")
            log("none/base.js", "playerJoin " + p.name + "|-|" + p.uuid())
            d.level++
        }
    })
}

Aim.event.update1 = () => {
    for (let funcid in Aim.event.requires.update1) {
        try {
            Aim.event.requires.update1[funcid]()
        } catch (e) {
            errLog("Aim.event.requires.update1[" + funcid + "]", e);
            //log(Aim.event.requires.update1[funcid].toString())
            //delete Aim.event.requires.update1[funcid];
        }
    }
}

Aim.event.update = () => {
    for (let func of Aim.event.requires.update) {
        func()
    }
}

Aim.event.update5 = () => {
    for (let func of Aim.event.requires.update5) {
        func()
    }
}

Aim.event.wave = () => {
    for (let func of Aim.event.requires.wave) {
        func()
    }
}
Aim.event.worldLoad = () => {
    if (!Aim.data.config.enabled) return;
    for (let funcid in Aim.event.requires.worldLoad) {
        try {
            Aim.event.requires.worldLoad[funcid]()
        } catch (e) {
            errLog("Aim.event.requires.worldLoad[" + funcid + "]", e)
        }
    }
}

Aim.event.gameOver = (e) => {
    for (let func of Aim.event.requires.gameover) {
        func(e)
    }
}
Aim.event.blockBuildBegin = (e) => {
    for (let func of Aim.event.requires.blockBuildBegin) {
        func(e)
    }
}

Aim.event.blockBuildEnd = (e) => {
    for (let func of Aim.event.requires.blockBuildEnd) {
        func(e)
    }
}

Aim.event.blockDestroy = (e) => {
    for (let func of Aim.event.requires.blockDestroy) {
        func(e)
    }
}

Aim.event.config = (e) => {
    for (let func of Aim.event.requires.config) {
        func(e)
    }
}

Aim.event.tap = (e) => {
    for (let func of Aim.event.requires.tap) {
        func(e)
    }
}