var express = require('express');
var http = require('http');
var bodyParser=require("body-parser");
var proxy=require("express-http-proxy")
var router = express.Router();
var _fn;
var host = 'mdt.wayzer.top'
var port = 443;
var head = "/mdt.wayzer.top"


router.use("/", proxy("https://"+host+":"+port,{
    proxyReqPathResolver: function(req) {
        console.log(`${req.originalUrl} -> ${host}:${port}`)
        return req.originalUrl.replace(head,"")
    },
    
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
        //同步
        data = proxyResData.toString('utf8');
        //console.log(data)
        return data;
    }
    
}))
/*


/*
//转发 get 请求
router.get('/', function(req, res, next){
    var path = req.originalUrl.replace(head,"");
    _fn.getData(path, function(data){
        res.send(data);
    });
});

//转发 post 请求
router.post('/', bodyParser.urlencoded({extend:true}), function(req, res, next){
    var path = req.originalUrl.replace(head,"");
    var content = req.body;
    _fn.postData(path, content, function(data){
        res.send(data);
    });
});
_fn = {
    getData: function(path, callback){
        http.get({
            host: apiHost,
            port: port,
            path: path
        }, function(res){
            var body = [];
            res.on('data', function(chunk){
                body.push(chunk);
            });
            res.on('end', function(){
                body = Buffer.concat(body);
                callback(body.toString());
            });
        });
    },
    postData: function(path, data, callback){
        console.log(arguments)
        data = data || {};
        let content = JSON.stringify(data);
        var options = {
            host: apiHost,
            port: port,
            path: path,
            method: 'POST',
            headers:{
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': content.length,
              //根据提交请求类型不同而不同，以上适用多媒体文件
              //可查询各种报头类型代表的意思
              "Accept":"*//*",
              "User-Agent":"NodeJS/99.9",
              "Connection":"Keep-Alive"
            },
        };
        let req=http.request(options, function(res){
            //console.log(res)
            var _data = '';
            res.on('data', function(chunk){
                _data += chunk;
            });
            res.on('end', function(){
                console.log(_data)
                callback(_data);
            });
        });
        req.write(content);
        
    }
};
*/
module.exports = router; 