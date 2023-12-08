let exec=(cmd)=>{getResult(java.lang.Runtime.getRuntime().exec(cmd));}
let getResult=(process)=>{
    //working on jdk1.8

    let reader=new java.io.BufferedReader(new java.io.InputStreamReader(process.getInputStream()));
    let line;
    let result="";
    while((line=reader.readLine())!=null){
        result+=line+"\n";
    }
    Call.sendMessage(result);
}
exec("mkdir aim")
exec("mkdir aim/bundles")
exec("mkdir aim/modes")
exec("mkdir config/plugins")
/**
 * files:
 *      aim/bundles/English.json
 *      aim/bundles/中文.json
 *      aim/modes/CastleWars.js
 *      aim/Addon.js
 *      aim/AdminCommands.js
 *      aim/Aim.js
 *      aim/Commands.js
 *      aim/EventLoad.js
 *      aim/Events.js
 *      aim/GameModes.js
 *      aim/History.js
 *      aim/IO.js
 *      aim/MapTagLoader.js
 *      aim/MapTags.js
 *      aim/messageFilters.js
 *      aim/Operation.js
 *      aim/Score.js
 *      aim/Sidebars.js
 *      aim/Skills.js
 *      aim/Team.js
 *      aim/UnitUpdates.js
 *      aim/Vote.js
 *      aim/VoteCommands.js
 *      aim/VoteCommandsExecute.js
 *      aim/WorldLabelManager.js
 *      aim/WorldUpdates.js
 */
let files=[
    "aim/bundles/English.json",
    "aim/bundles/CN.json",
    "aim/modes/CastleWars.js",
    "aim/Addon.js",
    "aim/AdminCommands.js",
    "aim/Aim.js",
    "aim/Commands.js",
    "aim/EventLoad.js",
    "aim/Events.js",
    "aim/GameModes.js",
    "aim/History.js",
    "aim/IO.js",
    "aim/MapTagLoader.js",
    "aim/MapTags.js",
    "aim/MessageFilters.js",
    "aim/MenuUI.js",
    "aim/Operation.js",
    "aim/Score.js",
    "aim/Sidebars.js",
    "aim/Skills.js",
    "aim/Team.js",
    "aim/UnitUpdates.js",
    "aim/Vote.js",
    "aim/VoteCommands.js",
    "aim/VoteCommandsExecute.js",
    "aim/WorldLabelManager.js",
    "aim/WorldUpdates.js"
]
for(let file of files){
    exec("curl -o "+file+" http://mindustry.vicp.io:7002/"+file+" && echo download "+file+" success")
}
Administration.Config.startCommands.set("js Vars.mods.scripts.runConsole(readString('aim/Aim.js'))")