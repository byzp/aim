var docu="main.txt"
var llen=0;
var llen1=0;
var tmp=0;
var err="";
var text="";
//var last="";
//this.window.onload=()=>{
try{
//alert($("#main"))

function run(){
    try{
    err=eval($("#js").val())+""
    }catch(e){err=e}
}

$.ajax({
    url:"/api/gdoc",
    type:"GET",
    dataType:"json",
    data:{
        name:docu
    },
    success:(t)=>{
        text=t.data/*.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")*/;
        llen1=t.data.length
    },
    error:(e)=>{
        text=e.responseText/*.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")*/;
        llen1=e.responseText.length
        //text=e.responseText/*.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")*/
    }
})
function set(){
    let to=$("#name").val();
    $.ajax({
        url:"/api/sdoc",
        type:"POST",
        //dataType:"text",
        data:{
            name:docu,
            text:$("#main").val()
        },
        success:()=>{},
        error:(e)=>{err=JSON.stringify(e)}
    })
    docu=to;
    $.ajax({
        url:"/api/gdoc",
        type:"GET",
        dataType:"json",
        data:{
            name:docu
        },
        success:(t)=>{
            text=t.data/*.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")*/;
            llen1=t.data.length;
        },
        error:(e)=>{
            text=e.responseText/*.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")*/;
            llen1=e.responseText.length
            //text=e.responseText/*.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")*/
        }
    })
}
var x=0;
var y=0;
var i=0;
setInterval(()=>{
    llen=$("#main").val().length;
    let ele=document.getElementById("main");
    let sta=ele.selectionStart;
    i=sta;
    let val=ele.value;
    let arr=val.substring(0,sta).split("\n")
    let val1=val.substring(0,sta)
    let v=arr[arr.length-1]
    let lindex=val.split("\n").map(v=>v.startsWith(v)).indexOf(true)
    x=arr.length
    y=arr[arr.length-1].length
    let tl=val.split("\n").length
    $("#llen").html(llen1+"-->"+llen+" < "+x+"-"+y+" #"+i+"   "+err);
    //while(true){
    if(llen1!=tmp&&llen1!=llen){
        tmp=llen1;
        llen=llen1;
        if((text!=""||(text==""&&last==""))){
        /*
        if(llen-llen1>0){
        x-=llen-llen1;
        y-=llen-llen1;
        }
        */
        
        $("#main").val(text)
        //ele.force()
        //ele.setSelectionRange(x,y);
        let lines=$("#main").val().split("\n")
        let ind=i;
        lin=$("#main").val().substring(0,i).split("\n")
        let index=lines.map(l=>l.startsWith(v)).indexOf(true)
        err=v+"||"+lindex+"  "+index+""
        if(index==-1){
            let line=lines[lindex]
            ind+=line.length-val.split("\n")[lindex].length
        }else{
            if(index!=lindex){
                let add=0;
                lin.filter(function(data){
                    return arr.indexOf(data)===-1;
                }).forEach(data=>{
                    add+=data.length+1
                })
                let rem=0
                arr.filter(function(data){
                    return len.indexOf(data)===-1;
                }).forEach(data=>{
                    rem+=data.length+1
                })
                err+="  +"+add+"  -"+rem
                ind+=add;
                ind-=rem;
            }
        }
        /*
        let al=lines.length-tl
        let ac=llen-llen1
        err=""
        if(lines[y-1]!=arr[y-1]){
            y+=al
            //err+="<br>"+al
            //x+=ac-al
        }
        let ind=0;
        let i=0;
        //let lengths=[]
        lines.forEach(d=>{
            i++
            if(i<=x){
                ind+=d.length+1
                //err+="<br>"+i+": "+d+"		"+d.length
                //lengths.push(d.length)
            }
        })
        ind+=y
        
        //let ind=i;
        //err=""
        
        if(lines.length<arr.length){
        let xx=0
        let arr1=arr.filter(function(d){
            xx++
            return lines.indexOf(d)===-1&&xx<x
        })
        arr1.forEach(d=>{
            ind-=d.length+1
            //err+="<br>- "+d
        })
        xx=0
        let arr2=lines.filter(function(d){
            xx++
            return arr.indexOf(d)===-1&&xx<x
        })
        arr2.forEach(d=>{
            ind+=d.length+1
            //err+="<br>+ "+d
        })
        }
        */
        //err+="<br>"+y
        //err=lines+"\n"+lengths
        
        ele.setSelectionRange(ind,ind)
        }
    }
    //last=text;
    if(llen!=tmp&&llen!=llen1){
        tmp=llen;
        llen1=llen;
        $.ajax({
            url:"/api/sdoc",
            type:"POST",
            //dataType:"text",
            data:{
                name:docu,
                text:$("#main").val()
            },
            success:()=>{},
            error:(e)=>{err=JSON.stringify(e)}
        })
    }
    //document=to;
    $.ajax({
        url:"/api/gdoc",
        type:"GET",
        dataType:"json",
        data:{
            name:docu
        },
        success:(t)=>{
            text=t.data/*.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")*/;
            llen1=t.data.length
            //text=t.data/*.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")*/
        },
        error:(e)=>{
            text=e.responseText/*.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")*/;
            llen1=e.responseText.length
        }
    })
},200)
}catch(e){alert(e)}
//}