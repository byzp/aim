var colors={"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkgrey":"#a9a9a9","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkslategrey":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dimgrey":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","grey":"#808080","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgray":"#d3d3d3","lightgreen":"#90ee90","lightgrey":"#d3d3d3","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightslategrey":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370db","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#db7093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","slategrey":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};
function decodeColor(str){
    for(let s in colors){
        str=str.replace(new RegExp("\\["+s+"\\]","g"),"["+colors[s]+"]");
    }
    str=str.replace(/\[#[0-9a-fA-F]{1,8}\]/g,(s)=>{
        return "<a style='color:"+s.replace("[#","").replace("]","")+"'>";
    });
    return str;
}


var getDate=()=>{
    return Math.floor((Date.now()+(8*60*60*1000))/86400000)-19050
}
function load(){
    $("#news").empty()
    $("#news").append("加载中...")
    let reset="";
    let time=86400-Math.floor(((Date.now()+(8*60*60*1000))-(Math.floor((Date.now()+(8*60*60*1000))/86400000)*86400000))/1000)
    reset=Math.floor(time%60)+"秒"+reset;
    reset=Math.floor(time/60%60)+"分"+reset;
    reset=Math.floor(time/60/60)+"小时"+reset;
    reset="将在"+reset+"后发布新一批土豆日报";
    $("#time").empty();
    $("#time").append(reset);
    $.ajax({
        url:"/api/getNews?day="+$("#day").val(),
        type:"get",
        dataType:"text",
        success:function(text){
            let datas=text.split("\n-----分割线-----");
            $("#news").empty()
            let index=0;
            datas.forEach(d=>{
                //d=d.replace(/\n/g,"<br>")
                if(index==0){
                    $("#news")
                        .append("<div class='box1'>")
                        .append("<div style='font-size:30px;margin:auto;text-align:center'>"+
                            decodeColor(d.replace(/\n/g,"<br>")
                            .replace(/ {1,}/g,(s)=>{
                                if(s.length<=1) return " ";
                                return s.replace(/ /g,"&nbsp;");
                            }))+
                            "</div>"
                        )
                        .append("</div><br>")
                }else{
                    $("#news")
                        .append("<div class='limLine'>")
                        .append(
                            decodeColor(d.substring(0,d.lastIndexOf("    --"))
                            .replace(/\n/g,"<br>")
                            .replace(/ {1,}/g,(s)=>{
                                if(s.length<=1) return " ";
                                return s.replace(/ /g,"&nbsp;");
                            })
                            )
                        )
                        .append("</div><div><a style='position:absolute;right:30px'>"+
                            d.substring(d.lastIndexOf("    --"),d.length)
                                .replace(/\n/g,"<br>")
                                .replace(/ /g,"&nbsp;")+
                            "</a>"
                        )
                        .append("</div><br>")
                }
                index++;
            })
            $("#news").append("<div class='limLine' style='position:absolute;right:30px'>   --土豆日报   day"+$("#day").val()+"</div>")
        },
        error:function(err){
            $("#news").empty()
            $("#news").append("加载失败:"+err);
        }
    })
}

function last(){
    $("#day").val(+$("#day").val()-1)
    load()
}
function next(){
    $("#day").val(+$("#day").val()+1)
    load()
}
window.onload=()=>{document.getElementById("day").value=getDate()-1;load()};