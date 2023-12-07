"use strict";

Aim.menuUI={
    vals:{},
    menus:{},
    then:{}
};
Aim.menuUI.menuId=Menus.registerMenu((p,s)=>{
    try{
        Aim.menuUI.then[p.uuid()](p,s)
    }catch(e){
        errLog(e)
    }
})
Aim.menuUI.menu=function(p,title,content,rows,then){
    Aim.menuUI.then[p.uuid()]=(p,s)=>{
        then(p,s)
    };
    let rs=JSON.parse(JSON.stringify(rows));
    for(let a in rs){
        if(rs[a].length==0) rs[a]=[""];
        // debugLog(rs[a].join("\t"))
    }
    Call.menu(p.con,Aim.menuUI.menuId,title,content,rs)
    
}
Aim.menuUI.menuStr=function(p,title,content,rows,then){
    Aim.menuUI.then[p.uuid()]=(p,s)=>{
        let i=null;
        let index=0;
        x: for(let a in rows){
            for(let b in a){
                if(index==s){
                    i=a[b];
                    break x;
                }
                index++;
            }
        }
        then(p,i)
    };
    let rs=JSON.parse(JSON.stringify(rows));
    for(let a in rs){
        if(rs[a].length==0) rs[a]=[""];
        // debugLog(rs[a].join("\t"))
    }
    Call.menu(p.con,Aim.menuUI.menuId,title,content,rs)
    
}
Aim.menuUI.menuSF=function(p,title,content,rows){
    let rs=rows;
    Aim.menuUI.then[p.uuid()]=(p,s)=>{
        // debugLog(JSON.stringify(rs))
        let i=null;
        let index=0;
        x: for(let a of rs){
            for(let b of a){
                // debugLog(b[0]+":"+b[1],index+" "+s)
                if(index==s){
                    i=b;
                    break x;
                }
                index++;
            }
        }
        i[1](p)
    }
    let dspr=[]
    for(let a in rows){
        dspr[a]=[]
        for(let b in rows[a]){
            dspr[a][b]=rows[a][b][0]
        }
    }
    Call.menu(p.con,Aim.menuUI.menuId,title,content,dspr)
}
Aim.menuUI.select=function(p,title,content,args,then,w){
    //width,height=Math.ceil(Math.sqrt(args.length))
    let width=w?w:Math.ceil(Math.sqrt(args.length)/2);
    let height=Math.ceil(args.length/width);
    let rows=[];
    for(let i=0;i<height;i++){
        rows.push([]);
    }
    let index=0;
    for(let a of args){
        rows[Math.floor(index/width)].push(a);
        index++;
    }
    let rs=JSON.parse(JSON.stringify(rows));
    for(let a in rs){
        if(rs[a].length==0) rs[a]=[""];
        // debugLog(rs[a].join("\t"))
    }
    Aim.menuUI.menu(p,title,content,rows,(p,s)=>{
        let i=null;
        let index=0;
        x: for(let a of rs){
            for(let b of a){
                // debugLog(b[0]+":"+b[1],index+" "+s)
                if(index==s){
                    i=b;
                    break x;
                }
                index++;
            }
        }
        if(i==null) Aim.menuUI.select(p,title,content,args,then,w);
        if(i!=null) then(p,i);
    })
}

Aim.menuUI.createUI=function(){
    return Aim.menuUI.createUIElements();
}

Aim.menuUI.initElements=function(player,vals,elements){
    /**
     * TODO:
     *     init gets
     *     init eles
     *     element: [name,onClick]
     *
     */
    let titleV=elements.titleV;
    if(typeof titleV=="function"){
        titleV=titleV(player,vals)
    }
    let contentV=elements.contentV;
    if(typeof contentV=="function"){
        contentV=contentV(player,vals)
    }
    let eles=[]
    // debugLog(Object.prototype.toString.call(elements))
    // debugLog(elements.elements)
    for(let a of elements.elements){
        eles.push([])
        Aim.menuUI.initRow(player,vals,a,eles)
    }
    let news=Aim.menuUI.createUIElements();
    for(let i in eles){
        if(eles[i]==[]){
            eles[i]=[["",(p,v,ui)=>{ui.show(p,v)}]]
        }
    }
    news.elements=eles;
    news.titleV=titleV;
    news.contentV=contentV;
    return news;
}

Aim.menuUI.initRow=function(player,vals,row,eles){
    for(let i of row){
        Aim.menuUI.initElement(player,vals,i,eles)
    }
}

Aim.menuUI.initElement=function(player,vals,ele,eles){
    if(ele[0]=="$$$$$eles"){
        for(let row of ele[1].init(player,vals).elements){
            Aim.menuUI.initRow(player,vals,row,eles)
            eles.push([])
        }
        eles.pop();
    }else{
        let name=ele[0];
        let onClick=ele[1];
        if(typeof name=="function"){
            name=name(player,vals)
        }
        if(eles[eles.length-1]==undefined) eles.push([])
        eles[eles.length-1].push([name,onClick])
    }
}

Aim.menuUI.createUIElements=function(){
    return {
        elements:[],
        titleV:"",
        contentV:"",
        init:function(player,vals){
            // debugLog(this.elements)
            return Aim.menuUI.initElements(player,vals,this)
        },
        title:function(gets){
            this.titleV=gets;
            return this;
        },
        content:function(gets){
            this.contentV=gets;
            return this;
        },
        add:function(element){
            if(this.elements[this.elements.length-1]==undefined) this.elements.push([]);
            if(element[0]!="$$$$$eles"){
                let f=element[1]
                element[1]=(p)=>{
                    f(p,Aim.menuUI.vals[p.uuid()],Aim.menuUI.menus[p.uuid()])
                }
            }
            this.elements[this.elements.length-1].push(element);
            return this;
        },
        row:function(){
            this.elements.push([]);
            return this;
        },
        text:function(gets){
            this.add([gets,(p,v,ui)=>{ui.show(p,v)}]);
            return this;
        },
        button:function(gets,runs,jump){
            this.add([gets,(p,v,ui)=>{
                if(typeof runs=="function") runs(p,v,ui);
                if(!jump) ui.show(p,v)
            }]);
            return this;
        },
        select:function(gets,args,val,w){
            this.add([(p,v)=>{
                if(typeof gets == "function"){
                    return gets(p,v)
                }
                return gets.replace("{}",v[val])
            },(p,v,ui)=>{
                let as=args
                if(typeof args=="function") as=args(p,v);
                Aim.menuUI.select(p,"","",as,(p,s)=>{
                    v[val]=s;
                    ui.show(p,v)
                },w)
            }]);
            return this;
        },
        checkbox:function(gets,val){
            this.add([(p,v)=>{
                if(typeof gets == "function"){
                    return gets(p,v)
                }
                return gets.replace("{}",v[val]?"[X]":"[ ]")
            },(p,v,ui)=>{
                if(v[val]==undefined) v[val]=false;
                v[val]=!v[val];
                ui.show(p,v)
            }]);
            return this;
        },
        input:function(gets,val){
            this.add([(p,v)=>{
                if(typeof gets == "function"){
                    return gets(p,v)
                }
                return gets.replace("{}",v[val])
            },(p,v,ui)=>{
                if(v[val]==undefined) v[val]="";
                p.sendMessage("> ");
                Aim.op.nextChat(p,(p,s)=>{
                    v[val]=s;
                    ui.show(p,v)
                })
            }]);
            return this;
        },
        eles:function(eles){
            this.add(["$$$$$eles",{
                init:function(player,vals){
                    let ele=Aim.menuUI.createUIElements();
                    eles(player,vals,ele)
                    let eles1=Aim.menuUI.initElements(player,vals,ele);
                    return eles1;
                }
            }])
            return this;
        },
        show:function(player,vals){
            if(vals==undefined) vals={};
            Aim.menuUI.vals[player.uuid()]=vals;
            Aim.menuUI.menus[player.uuid()]=this;
            let m=this.init(player,vals);
            let title=m.titleV;
            let content=m.contentV;
            let elements=m.elements;
            // let a=""
            // for(let w of elements){
            //     let s="";
            //     for(let e of w){
            //         s+=e[0]+"\t";
            //     }
            //     a+=s+"\n";
            // }
            // debugLog(title+"\n"+content+"\n"+a)
            Aim.menuUI.menuSF(player,title,content,elements)
            return this;
        }
    }
}
Aim.menuUI.testUI=Aim.menuUI.createUI()
    .title("test").content("test content")
    .input("input: {}",'test').checkbox("checkbox: {}",'test1').select("select: {}",["a","b","c"],'test2',1).button("button",(p,v,u)=>{
        v.clicked=true;
    },false).row()
    .eles((p,v,u)=>{
        if(v.clicked) u.text((p,_)=>{return v.test+" "+v.test1+" "+v.test2})
    }).row()
    .button("close",()=>{},true)

Aim.menuUI.test=function(player){
    Aim.menuUI.testUI.show(player,{})
}