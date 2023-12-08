function load(){
    $("#table").empty()
    $("#table").append("加载中...")
    $.ajax({
        url:"/api/files/list",
        type:"get",
        dataType:"json",
        success:function(obj){
            let code="<table style='width:100%' border='2'><tr> <th style='width:9%'> id</th> <th style='width:10%'> 文件名</th> <th style='width:10%'> 大小(M)</th> <th style='width:10%'> 上传者</th> <th style='width:20%'> 介绍</th> <th> 删除</th> <th> 下载</th> <th style='width:13%'> 直链</th> <th style='width:15%'> 引用</th> </tr>";
            let word=$("#search").val();
            //alert(word)
            for(let file of obj){
                if(file.name.indexOf(word)==-1&&(file.id+"").indexOf(word)==-1) continue;
                code+="<tr>"
                code+="<td>"+file.id+"</td>"
                code+="<td>"+file.name+"</td>"
                code+="<td>"+file.size+"</td>"
                code+="<td>"+file.uploader+"</td>"
                code+="<td>"+file.desc+"</td>"
                code+="<td class='but'><button style='width:100%;font-size:100%' onclick='var usid=$(\"#usid\").val();location.assign(\"/api/files/delete?usid=\"+usid+\"&name="+encodeURIComponent(file.name)+"\");load()'></button>"+"</td>"
                code+="<td class='but'><button style='width:100%;font-size:100%' onclick='javascript:location.assign(\"/api/files/download/"+encodeURIComponent(file.name)+"\")'></button></td>"
                code+="<td>http://127.0.0.1:7002/api/files/getFile?id="+file.id+"</td>"
                code+="<td>Aim.io.get('http://127.0.0.1:7002/api/files/getFile?id="+file.id+"',data=>{...})</td></tr>"
            }
            code+="</table>"
            //code+="<textarea>"+code+"</textarea>"
            $("#table").empty()
            $("#table").append(code);
        },
        error:function(err){
            $("#table").empty()
            $("#table").append("加载失败:"+err);
        }
    })
}
window.onload=load;

function dele(name){
    var usid=document.getElementById("usid").innerHTML;
    location.assign("/api/files/delete?usid="+usid+"&name="+name)
}