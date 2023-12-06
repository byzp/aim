"use strict";

Aim.maptags=new Object()
Aim.event.requires.worldLoad.push(()=>{
	let desc=Vars.state.map.description()
	let tags=desc.split("|-")
	tags.forEach(tag=>{
	    if(tag.endsWith("-|")){
	        return tag.substring(0,tag.length-2)
	    }
	    return ""
	})
	for(let tag in tags){
	    let key=tag.substring(0,tag.startsWith("="))
	    let value=tag.substring(tag.startsWith("="),tag.length)
	    let tagReal=Aim.maptags[key]
	    if(tagReal!=undefined){
	        let tag={
	            key: key,
	            value: value,
	            datas: Object.assign({}, tagReal.datas)
	        }
	        Aim.state.maptags.push(tag)
	        if(tagReal.create!=undefined) tagReal.create(tag)
	    }
	}
})

Aim.event.requires.update.push(() => {
    for (let tag of Aim.state.maptags) {
        let tagReal = Aim.maptags[tag.key]
        if (tagReal == undefined) continue
        if (tagReal.update == undefined) continue
        tagReal.update(tag)
    }
})

Aim.event.requires.update1.push(() => {
    for (let tag of Aim.state.maptags) {
        let tagReal = Aim.maptags[tag.key]
        if (tagReal == undefined) continue
        if (tagReal.update1 == undefined) continue
        tagReal.update1(tag)
    }
})

Aim.event.requires.update30.push(() => {
    for (let tag of Aim.state.maptags) {
        let tagReal = Aim.maptags[tag.key]
        if (tagReal == undefined) continue
        if (tagReal.update == undefined) continue
        tagReal.update30(tag)
    }
})