"use strict";

Aim.voteCommands["restart"] = {
    func: (p, t, m) => {
        say("[red]服务器将在5秒后重启");
        Aim.saveData();
        Timer.schedule(() => {
            java.lang.System.exit(0)
        }, 5)
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["host"] = {
    func: (p, t, m) => {
        let ma = t[1]
        let map = Vars.maps.all().find(mx => mx.name().replace(/ /g, "_") == ma)
        if (map == undefined) {
            p.sendMessage(bundle(p, "unknownMap", ma))
            return
        }
        if (t[2] == undefined || t[2] == "") {
            let desc = map.description()
            if (desc.startsWith("#")) {
                desc = desc.substring(1, desc.indexOf("\n"));
                let s = desc.split(" ");
                t = t.splice(0, 2);
                t.push.apply(t, s);
            } else t[2] = "s"
        }
        let mode = Aim.op.getMode(t[2])

        if (t[2] != undefined && t[2].startsWith("-")) {
            let t1 = t.join(" ").split(" ");
            t1.splice(0, 2)
            mode = Aim.op.applyModes(t1)
        }
        Aim.voteCommands["save"].func(null, [0, "rollback"], "")
        Aim.score.winEvent(null)
        Timer.schedule(() => {
            t.splice(0, 2)
            Aim.op.host(map, mode, t)
        }, 0.5)
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["hostx"] = {
    func: (p, t, m) => {
        m = t[1]
        let id = 0;
        let map = Vars.maps.all().find(mx => {
            let re = id == m;
            id++;
            return re
        })
        if (map == undefined) {
            p.sendMessage(bundle(p, "unknownMap", m))
            return
        }
        if (t[2] == undefined || t[2] == "") {
            let desc = map.description()
            if (desc.startsWith("#")) {
                desc = desc.substring(1, desc.indexOf("\n"));
                let s = desc.split(" ");
                t = t.splice(0, 2);
                t.push.apply(t, s);
            } else t[2] = "s"
        }
        let mode = Aim.op.getMode(t[2]);
        if (t[2] != undefined && t[2].startsWith("-")) {
            let t1 = t.join(" ").split(" ");
            t1.splice(0, 2)
            mode = Aim.op.applyModes(t1)
        }
        Aim.voteCommands["save"].func(null, [0, "rollback"], "")
        Aim.score.winEvent(null)
        Timer.schedule(() => {
            t.splice(0, 2)
            Aim.op.host(map, mode, t)
        }, 0.5)
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["rtv"] = {
    func: (p, t, m) => {
        let id = 0;
        let n = []
        Vars.maps.all().each(m => n.push(m));
        n.sort(() => Math.random() - 0.5)
        let map = n.shift()
        let desc = map.description()
        if (desc.startsWith("#")) {
            desc = desc.substring(1, desc.indexOf("\n"));
            let s = desc.split(" ");
            t = t.splice(0, 2);
            t.push.apply(t, s);
        } else t[2] = "s"
        let mode = Aim.op.getMode(t[2]);
        if (t[2] != undefined && t[2].startsWith("-")) {
            let t1 = t.join(" ").split(" ");
            t1.splice(0, 2)
            mode = Aim.op.applyModes(t1)
        }
        Aim.voteCommands["save"].func(null, [0, "rollback"], "")
        Aim.score.winEvent(null)
        Timer.schedule(() => {
            t.splice(0, 2)
            Aim.op.host(map, mode, t)
        }, 0.5)
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["save"] = {
    func: (p, t, m) => {
        let name = t[1]
        SaveIO.save(new Packages.arc.files.Fi("./config/saves/" + name + ".msav"))
        for (let te = 0; te < 256; te++) {
            let team = Team.get(te)
            if (team.core() != null) {
                Aim.state.resources[te] = {}
                Vars.content.items().each(i => {
                    Aim.state.resources[te][i.toString()] = team.core().items.get(i)
                })
            }
        }
        let history = Aim.state.history;
        let lastConfig = Aim.state.lastConfig;
        let temps = Aim.state.temps;
        //Aim.state.history={}
        Aim.state.temps = {}
        Aim.state.lastConfig = {}
        Aim.io.write("config/saves/" + name + ".aimSave", JSON.stringify(Aim.state))
        //Aim.state.history=history;
        Aim.state.lastConfig = lastConfig;
        Aim.state.temps = temps;
        //sayX("saveSaveFile", name)
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["gameover"] = {
    func: function(p, t, m) {
        this.exec(Team.get(t[1]))
    },
    exec: function(t) {
        try {
            t.core().damage(2147483647)
            Timer.schedule(() => {
                this.exec(t)
            }, 0.2)
        } catch (e) {}
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return t[1] == p.team().id;
    },
    getPlayers: (vote) => {
        let players = []
        Groups.player.each(p => {
            if (p.team().id == vote.command.split(" ")[1] - 1 + 1) {
                players.push(p)
            }
        })
        return players.length;
    }
}

Aim.voteCommands["load"] = {
    func: (p, t, m) => {
        let name = t[1]
        if (!Aim.io.exists("config/saves/" + name + ".msav")) return;
        //Aim.io.copy("config/saves/"+name+".msav","config/maps/"+name+".msav")
        //infoLog("load-0")
        let aimSave = eval("({" + Aim.defaultState + "})")
        if (Aim.io.exists("config/saves/" + name + ".aimSave")) {
            try {
                aimSave = eval("(" + Aim.io.readSync("config/saves/" + name + ".aimSave") + ")")
            } catch (e) {
                print(e)
            }
        }
        //infoLog("load-1")
        //Vars.maps.reload()
        //infoLog("load-2")
        //Aim.score.winEvent(null)
        //infoLog("load-3")
        Timer.schedule(() => {
            //try{
            //  let map=Vars.maps.all().find(map=>map.name()=="unknown")
            //   if(map!=null){
            Aim.vote.pause = true
            let reloader = new WorldReloader()
            reloader.begin()
            Vars.state.rules.canGameOver = false
            SaveIO.load(name)
            let r = SaveIO.getMeta(new Packages.arc.files.Fi("config/saves/" + name + ".msav")).rules
            let cg = r.canGameOver;
            r.canGameOver = false;
            Vars.state.rules = r
            Aim.resetState()
            Vars.logic.play()
            Vars.state.set(GameState.State.playing)
            reloader.end()
            //Aim.io.rm("config/maps/"+name+".msav")
            Vars.maps.reload()
            Vars.state.rules.canGameOver = cg;
            Aim.event.worldLoadOver();
            Aim.state = aimSave;
            for (let teamid in Aim.state.resources) {
                try {
                    let team = Team.get(teamid);
                    if (team.core() != null) {
                        for (let type in Aim.state.resources[teamid]) {
                            team.core().items.set(Vars.content.getByName(ContentType.item, type), Aim.state.resources[teamid][type])
                        }
                    }
                } catch (e) {}
            }

            //      }
            //}catch(e){
            //    errLog("Aim.voteCommands[\"load\"]",e)
            //}
        }, 3)
        sayX("loadSaveFile", name)
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["kick"] = {
    func: (p, t, m, isA) => {
        let pl = getPlayer(t[1]);
        let admin = "from vote:" + p.name
        if (isA) {
            admin = ";a exec:" + p.name
        }
        if (pl != undefined) {
            Aim.data.blacklist[pl.uuid()] = {
                bantime: Date.now(),
                unbantime: Date.now() + (Aim.data.config.kickTime * 60 * 1000),
                reason: "$kicked",
                admin: admin,
                name: pl.name
            }
            let bl = Aim.data.blacklist[pl.uuid()]
            let p = pl
            let mess = bundle(p, "aim.inBlacklistM") + "\n"
            if (bl.unbantime != undefined) {
                let t = bl.unbantime - Date.now()
                t = parseInt(t / 1000)
                let time = parseInt(t / 86400) + bundle(p, "day")
                time += parseInt(t / 3600) % 24 + bundle(p, "hour")
                time += parseInt(t / 60) % 60 + bundle(p, "minute")
                time += parseInt(t) % 60 + bundle(p, "second")
                mess += bundle(p, "aim.inBlacklistT", time) + "\n"
            } else {
                mess += bundle(p, "permanent") + "\n"
            }
            let reason = bl.reason
            if (reason.startsWith("$")) reason = bundle(p, reason.substring(1, reason.length))
            mess += bundle(p, "reason") + ":\n" + reason
            p.con.kick(mess)
        }
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["killall"] = {
    func: (p, t, m) => {
        Timer.schedule(() => {
            Groups.unit.each(u => {
                u.health = -1;
                u.kill();
                Call.unitDeath(u.id)
            })
        }, 0.02, 0.02, 100)
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["runwave"] = {
    func: (p, t, m) => {
        for (let i = 0; i < t[1]; i++) {
            Vars.logic.runWave()
        }
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["nethostx"] = {
    func: (p, t, m) => {
        let name = t[1]
        Aim.io.rm("config/maps/netmap.msav");
        let start = (maps, info) => Timer.schedule(() => {
            Aim.voteCommands["save"].func(null, [0, "rollback"], "")
            Vars.maps.reload()
            Aim.score.winEvent(null)
            Timer.schedule(() => {
                let newMap = null;
                Vars.maps.all().each(mm => {
                    if (maps.indexOf(mm.name() + mm.description() + mm.version + mm.author()) == -1) {
                        newMap = mm;
                    }
                })
                if (newMap != null) {
                    Aim.vote.pause = true
                    if (t[2] == undefined || t[2] == "") {
                        let desc = newMap.description()
                        if (desc.startsWith("#")) {
                            desc = desc.substring(1, desc.indexOf("\n"));
                            let s = desc.split(" ");
                            t = t.splice(0, 2);
                            t.push.apply(t, s);
                        } else t[2] = "s"
                    }
                    let mode = Aim.op.getMode(t[2]);
                    if (t[2] != undefined && t[2].startsWith("-")) {
                        let t1 = t.join(" ").split(" ");
                        t1.splice(0, 2)
                        mode = Aim.op.applyModes(t1)
                    }
                    let reloader = new WorldReloader()
                    t.splice(0, 2)
                    Aim.op.host(newMap, mode, t)
                    Timer.schedule(() => {
                        Aim.state.mapid = "N" + name
                    }, 0)
                    Aim.io.rm("config/maps/netmap.msav");
                    Vars.maps.reload()
                }else{
                    Call.sendMessage("[red]出错，未加载此地图!");
                    //Aim.voteCommands["hostx"].func("","","$host netmap);
                }
            }, 0)
        }, 0)
        if (name.length == 5) {
            Aim.io.get(Aim.mapUrl + "/mdt.wayzer.top/api/maps/thread/" + t[1] + "/latest", info => {
                if (info != "MapThread not found") {
                    let maps = []
                    Vars.maps.all().each(m => maps.push(m.name() + m.description() + m.version + m.author()))
                    let inf = eval("(" + info + ")");
                    Aim.io.download(Aim.mapUrl + "/mdt.wayzer.top/api/maps/" + inf.hash + "/downloadServer?token=" + Aim.data.config.wayzerToken, "config/maps/netmap.msav")
                    /*
                    let urll="https://www.mindustry.top/" + inf.hash
                    log(urll)
                    Aim.io.download(urll ,"config/maps/netmap.msav")
                    */
                    start(maps, inf)
                } else {
                    p.sendMessage(bundle(p, "unknownMap", t[1]))
                }
            })
            return
        }
        Aim.io.get(Aim.mapUrl + "/api/getInfo?id=" + name, inf => {
            if (inf != "not found!") {
                let maps = []
                Vars.maps.all().each(m => maps.push(m.name() + m.description() + m.version + m.author()))
                debugLog(inf);
                let info = eval("(" + inf + ")")
                Aim.io.download(Aim.mapUrl + "/api/download?name=" + Aim.io.uri(info.name), "config/maps/netmap.msav")
                start(maps, info)
            }
        })
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["text"] = {
    func: (p, t, m) => {
        Call.warningToast(Iconc.info, m.substring(5, m.lenhth))
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["mute"] = {
    func: (p, t, m) => {
        let addt = 15 * 60 * 1000
        if (t[2] != undefined) {
            addt = 0
            for (let ti of t[2].split(";")) {
                let tim = parseFloat(ti.substring(0, ti.length - 1))
                if (ti.endsWith("d")) {
                    addt += tim * 86400 * 1000
                } else if (ti.endsWith("h")) {
                    addt += tim * 60 * 60 * 1000
                } else if (ti.endsWith("m")) {
                    addt += tim * 60 * 1000
                } else if (ti.endsWith("s")) {
                    addt += tim * 1000
                }
            }
        }
        addt = Math.min(addt, 4 * 60 * 60 * 1000)
        Aim.data.muting[t[1]] = Date.now() + addt
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["rmute"] = {
    func: (p, t, m) => {
        delete Aim.data.muting[t[1]]
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["fob"] = {
    func: (p, t, m) => {
        let addt = 15 * 60 * 1000
        if (t[2] != undefined) {
            addt = 0
            for (let ti of t[2].split(";")) {
                let tim = parseFloat(ti.substring(0, ti.length - 1))
                if (ti.endsWith("d")) {
                    addt += tim * 86400 * 1000
                } else if (ti.endsWith("h")) {
                    addt += tim * 60 * 60 * 1000
                } else if (ti.endsWith("m")) {
                    addt += tim * 60 * 1000
                } else if (ti.endsWith("s")) {
                    addt += tim * 1000
                }
            }
        }
        addt = Math.min(addt, 4 * 60 * 60 * 1000)
        Aim.state.forceOb[t[1]] = Date.now() + addt
        try {
            getPlayer(t[1]).unit(UnitTypes.flare.create(Team.get(255)))
            Aim.team.giveTeam(getPlayer(t[1]))
        } catch (e) {
            print(e)
        }
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}

Aim.voteCommands["rob"] = {
    func: (p, t, m) => {
        delete Aim.state.forceOb[t[1]]
        Aim.team.giveTeam(getPlayer(t[1]))
    },
    a: true,
    canVote: (p, cp, t, m) => {
        return true;
    }
}