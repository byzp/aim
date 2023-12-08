var time=15;
function jump(){
    if(time>0) return;
    location.assign('/addquestion_r.html')
}
setInterval(()=>{
    time--
    $("#time").empty();
    $("#time").append(time>0?time+"秒":"确定");
},1000)