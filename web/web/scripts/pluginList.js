var type="all"
function load(){
    $("#table").empty()
    $("#table").append("加载中...")
    $.ajax({
        url:"/api/acplugin/list",
        type:"get",
        dataType:"json",
        success:function(obj){
            let all=0;
            let content=0;
            let style=0;
            for(let file of obj){
                all++;
                if(file.tags==undefined) file.tags=[]
                if(file.tags.indexOf("content")!=-1) content++
                if(file.tags.indexOf("style")!=-1) style++
            }
            $("#allAm").empty()
            $("#allAm").append(all)
            $("#contentAm").empty()
            $("#contentAm").append(content)
            $("#styleAm").empty()
            $("#styleAm").append(style)
            let code="<table style='width:100%' border='2'><tr> <th style='width:9%'> id</th> <th style='width:10%'> 文件名</th> <th style='width:10%'> 插件名</th> <th style='width:10%'> 作者</th> <th style='width:30%'> 介绍</th> <th> 删除</th> <th> 下载</th> <th> 更新</th> </tr>";
            let word=$("#search").val();
            //alert(word)
            //alert(word)
            for(let file of obj){
                //alert(file)
                if(word!=""&&(file.name.indexOf(word)==-1&&(file.id+"").indexOf(word)==-1&&file.pluginName.indexOf(word)==-1)) continue;
                //alert(file)
                if(file.tags==undefined) file.tags=[]
                if(type!="all"&&(!file.tags.includes(type))) continue
                //alert(file)
                if(file.tags.indexOf("content")!=-1&&type!="content") file.pluginName="[ 内容]"+file.pluginName
                //alert(file)
                //try{
                if(file.tags.indexOf("style")!=-1&&type!="style") file.pluginName="[ 样式]"+file.pluginName
                //}catch(e){alert(e)}
                //alert(file)
                code+="<tr>"
                code+="<td>"+file.id+"</td>"
                code+="<td>"+file.name+"</td>"
                code+="<td>"+file.pluginName+"</td>"
                code+="<td>"+file.author+"</td>"
                code+="<td>"+file.desc+"</td>"
                code+="<td class='but'><button style='width:100%;font-size:100%' onclick='var usid=$(\"#usid\").val();location.assign(\"/api/acplugin/delete?usid=\"+usid+\"&name="+encodeURIComponent(file.name)+"\");load()'></button>"+"</td>"
                code+="<td class='but'><button style='width:100%;font-size:100%' onclick='javascript:location.assign(\"/api/acplugin/download/"+encodeURIComponent(file.name)+"\")'></button></td>"
                code+="<td class='but'><button style='width:100%;font-size:100%' onclick='var usid=$(\"#usid\").val();location.assign(\"/acplugin/update?usid=\"+usid+\"&name="+encodeURIComponent(file.name)+"\");load()'></button>"+"</td></tr>"
            }
            code+="</table>"
            //alert(code)
            //code+="<textarea>"+code+"</textarea>"
            $("#table").empty()
            $("#table").append(code);
        },
        error:function(err){
            $("#table").empty()
            $("#table").append("加载失败:"+err.toString());
        }
    })
}
window.onload=load;

function changeTo(ty){
    type=ty;
    $(".modeSelect").attr("class","button modeSelect");
    $(".modeSelect[name="+ty+"]").attr("class","selectedButton modeSelect");
    load();
}

function dele(name){
    var usid=document.getElementById("usid").innerHTML;
    location.assign("/api/acplugin/delete?usid="+usid+"&name="+name)
}