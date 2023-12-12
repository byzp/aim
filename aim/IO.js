"use strict";

Aim.io = {}

/**
 * 
 * @param {string} uri
 * @returns {string}
 */
Aim.io.uri = function(uri) {
    return encodeURIComponent(uri)
}
Aim.io.sleep=function(d) {for (var t = Date.now(); Date.now() - t <= d; );}
/**
 * 
 * @param {string} url 
 * @param {Function} cback 
 */
Aim.io.get = function(url, cback) {
    if (cback == undefined) cback = () => {};
    if (Version.build < 128) {
        ;
        Core.net.httpGet(url, t => {
            cback(new java.lang.String(t.getResult(), "UTF-8"))
        }, () => {})
    } else {
        Http.get(url, (a, err) => {
            cback(new java.lang.String(a.getResult(), "UTF-8"))
        })
    }
};
/**
 * 
 * @param {string} url 
 * @param {string} content 
 * @param {Function} cback 
 */
Aim.io.post = function(url, content, cback) {
    if (cback == undefined) cback = () => {};
    if (Version.build < 128) {
        Core.net.httpPost(url, content, t => {
            cback(new java.lang.String(t.getResult(), "UTF-8"))
        }, () => {});
    } else {
        let a = Http.post(url, content);
        a.submit((b, c) => {
            cback(new java.lang.String(b.getResult(), "UTF-8"))
        });
    }
};
// Aim.io.hasFile=function(path,cback){Aim.io.post("http://localhost:"+Aim.io.port+"/hasFile?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path),cback);};
// Aim.io.hasDir=function(path,cback){Aim.io.post("http://localhost:"+Aim.io.port+"/hasDir?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path),cback);};
// Aim.io.fileInfo=function(path,cback){Aim.io.post("http://localhost:"+Aim.io.port+"/fileInfo?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path),(d)=>{cback(eval("("+d+")"))});};
// Aim.io.read=function(path,cback){;if(Version.build<128){;Core.net.httpPost("http://localhost:"+Aim.io.port+"/read?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path),t=>{cback(new java.lang.String(t.getResult(),"UTF-8"))},()=>{});}else{;let a=Http.post("http://localhost:"+Aim.io.port+"/read?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path));a.submit((b,c)=>{cback(new java.lang.String(b.getResult(),"UTF-8"))});};};
// Aim.io.readDir=function(path,cback){;if(Version.build<128){;Core.net.httpPost("http://localhost:"+Aim.io.port+"/readDir?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path),t=>{;let l=(new java.lang.String(t.getResult(),"UTF-8"));l=l.substring(3,l.length())+"";cback(l.split("|-|"));},()=>{});}else{;let a=Http.post("http://localhost:"+Aim.io.port+"/readDir?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path));a.submit((b,c)=>{let l=(new java.lang.String(b.getResult(),"UTF-8"));cback((l.substring(3,l.length())+"").split("|-|"))});};}
// Aim.io.write=function(path,content){;if(Version.build<128){;Core.net.httpPost("http://localhost:"+Aim.io.port+"/write?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path)+"&content="+Aim.io.uri(content),t=>{return new java.lang.String(t.getResult(),"UTF-8")},()=>{});}else{;let a=Http.post("http://localhost:"+Aim.io.port+"/write?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path)+"&content="+Aim.io.uri(content));a.submit((b,c)=>{return new java.lang.String(b.getResult(),"UTF-8")});};};
// Aim.io.copy=function(path,topath){Aim.io.post("http://localhost:"+Aim.io.port+"/copyFile?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path)+"&topath="+Aim.io.uri(topath),(out)=>{});};
// Aim.io.mkdir=function(path){Aim.io.post("http://localhost:"+Aim.io.port+"/mkdir?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path));};
// Aim.io.rm=function(path){Aim.io.post("http://localhost:"+Aim.io.port+"/rm?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path));};
// Aim.io.rmDir=function(path){Aim.io.post("http://localhost:"+Aim.io.port+"/rmDir?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path));};
// Aim.io.zip=function(path,toPath,cback){Aim.io.post("http://localhost:"+Aim.io.port+"/zip?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path)+"&toPath="+Aim.io.uri(toPath),cback);};
// Aim.io.unzip=function(path,toPath,cback){Aim.io.post("http://localhost:"+Aim.io.port+"/unzip?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path)+"&toPath="+Aim.io.uri(toPath),cback);};

// Aim.io.download=function(url,path,cback){Aim.io.post("http://localhost:"+Aim.io.port+"/download?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path)+"&url="+Aim.io.uri(url),cback);};

/**
 * 
 * @param {string} url 
 * @returns {string}
 */
Aim.io.getSync = function(url) {
    let ret = null;
    let runed = false;
    let tout = Date.now() + 10000;
    Aim.io.get(url, (re) => {
        ret = re;
        runed = true
    });
    while (!runed && Date.now() < tout) {};
    return ret
};
/**
 * 
 * @param {string} url 
 * @param {string} content 
 * @returns {string}
 */
Aim.io.postSync = function(url, content) {
    let ret = null;
    let runed = false;
    let tout = Date.now() + 10000;
    Aim.io.post(url, content, (re) => {
        ret = re;
        runed = true
    });
    while (!runed && Date.now() < tout) {};
    return ret
};
// Aim.io.hasFilew=function(path){return Aim.io.postw("http://localhost:"+Aim.io.port+"/hasFile?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path))};
// Aim.io.hasDirw=function(path){return Aim.io.postw("http://localhost:"+Aim.io.port+"/hasDir?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path))};
// Aim.io.fileInfow=function(path){return eval("(:"+Aim.io.postw("http://localhost:"+Aim.io.port+"/fileInfo?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path),(d)=>{})+")")};
// Aim.io.readw=function(path){let ret=null;if(Version.build<128){;Core.net.httpPost("http://localhost:"+Aim.io.port+"/read?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path),t=>{ret=new java.lang.String(t.getResult(),"UTF-8")},()=>{});}else{;let a=Http.post("http://localhost:"+Aim.io.port+"/read?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path));a.submit((b,c)=>{ret=new java.lang.String(b.getResult(),"UTF-8")});};while(ret==null){};return ret;};
// Aim.io.readDirw=function(path){let ret=null;if(Version.build<128){;Core.net.httpPost("http://localhost:"+Aim.io.port+"/readDir?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path),t=>{;let l=(new java.lang.String(t.getResult(),"UTF-8"));l=l.substring(3,l.length())+"";ret=l.split("|-|");},()=>{});}else{;let a=Http.post("http://localhost:"+Aim.io.port+"/readDir?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path));a.submit((b,c)=>{let l=(new java.lang.String(b.getResult(),"UTF-8"));ret=(l.substring(3,l.length())+"").split("|-|")});};while(ret==null){};return ret;}
// Aim.io.writew=function(path,content){;if(Version.build<128){;Core.net.httpPost("http://localhost:"+Aim.io.port+"/write?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path)+"&content="+Aim.io.uri(content),t=>{return new java.lang.String(t.getResult(),"UTF-8")},()=>{});}else{;let a=Http.post("http://localhost:"+Aim.io.port+"/write?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path)+"&content="+Aim.io.uri(content));a.submit((b,c)=>{return new java.lang.String(b.getResult(),"UTF-8")});};};
// Aim.io.mkdirw=function(path){Aim.io.postw("http://localhost:"+Aim.io.port+"/mkdir?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path));}
// Aim.io.rmw=function(path){Aim.io.postw("http://localhost:"+Aim.io.port+"/rm?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path));};
// Aim.io.rmDirw=function(path){Aim.io.postw("http://localhost:"+Aim.io.port+"/rmDir?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path));};
// Aim.io.zipw=function(path,toPath){Aim.io.postw("http://localhost:"+Aim.io.port+"/zip?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path)+"&toPath="+Aim.io.uri(toPath));};
// Aim.io.unzipw=function(path,toPath){Aim.io.postw("http://localhost:"+Aim.io.port+"/unzip?randomCode="+Aim.randomCode,"path="+Aim.io.uri(path)+"&toPath="+Aim.io.uri(toPath));};

/**
 * 
 * @param {string} code 
 */
Aim.io.runCmd = function(code) {
    log("none/base.js", "runCmd " + code)
}

/**
 * 
 * @param {java.io.FileInputStream} fis 
 * @returns {java.io.DataInputStream}
 */
Aim.io.toDataInputStream = function(fis) {
    let bis = new java.io.BufferedInputStream(fis);
    let dis = new java.io.DataInputStream(bis);
    return dis;
}
/**
 * 
 * @param {java.io.FileOutputStream} fos 
 * @returns {java.io.DataOutputStream}
 */
Aim.io.toDataOutputStream = function(fos) {
    let bos = new java.io.BufferedOutputStream(fos);
    let dos = new java.io.DataOutputStream(bos);
    return dos;
}

/**
 * 
 * @param {string} path 
 * @param {Function} cback 
 */
Aim.io.read = function(path, cback) {
    let file = new java.io.File(path);
    if (file.exists()) {
        new java.lang.Thread(run(() => {
            let sb = new java.lang.StringBuilder();
            let reader = java.nio.file.Files.newBufferedReader(java.nio.file.Paths.get(path), java.nio.charset.StandardCharsets.UTF_8);
            for (;;) {
                let line = reader.readLine();
                if (line == null) {
                    break;
                }
                sb.append(line + "\n");
            }
            reader.close();
            cback(sb.toString().substring(0, sb.length() - 1));
        })).start();
    } else {
        throw new Error("File not found:" + path);
    }
}

/**
 * 
 * @param {string} path 
 * @param {Function} cback 
 */
Aim.io.readBytes = function(path, cback) {
    let file = new java.io.File(path);
    if (file.exists()) {
        new java.lang.Thread(run(() => {
            let s = new java.lang.StringBuilder();
            let i = new java.io.FileInputStream(file);
            let bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, i.available());
            i.read(bytes)
            i.close()
            cback(bytes)
        })).start();
    } else {
        throw new Error("File not found:" + path);
    }
}
/**
 * 
 * @param {string} path 
 * @returns {string}
 */
Aim.io.readSync = function(path) {
    let file = new java.io.File(path);
    if (file.exists()) {
        let sb = new java.lang.StringBuilder();
        let reader = java.nio.file.Files.newBufferedReader(java.nio.file.Paths.get(path), java.nio.charset.StandardCharsets.UTF_8);
        for (;;) {
            let line = reader.readLine();
            if (line == null) {
                break;
            }
            // print(line)
            sb.append(line + "\n");
        }
        reader.close();
        return sb.toString().substring(0, sb.length() - 1);
    } else {
        throw new Error("File not found:" + path);
    }
}

/**
 * 
 * @param {string} path 
 * @returns {byte[]}
 */
Aim.io.readBytesSync = function(path) {
    let file = new java.io.File(path);
    if (file.exists()) {
        let s = new java.lang.StringBuilder();
        let i = new java.io.FileInputStream(file);
        let bytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, i.available());
        i.read(bytes)
        i.close()
        return bytes
    } else {
        throw new Error("File not found:" + path);
    }
}

/**
 * 
 * @param {string} path 
 * @returns {string[]}
 */
Aim.io.readDir = function(path) {
    let file = new java.io.File(path);
    if (file.exists()) {
        return file.list();
    } else {
        throw new Error("File not found:" + path);
    }
}

/**
 * 
 * @param {string} path 
 * @param {string} content 
 * @param {Function?} then 
 */
Aim.io.write = function(path, content, then) {
    let file = new java.io.File(path);
    if (file.exists()) {
        file.delete();
    }
    file.createNewFile();
    new java.lang.Thread(run(() => {
        let writer = java.nio.file.Files.newBufferedWriter(java.nio.file.Paths.get(path), java.nio.charset.StandardCharsets.UTF_8);
        writer.write(content);
        writer.close();
        if (then) {
            then();
        }
    })).start();
}
/**
 * 
 * @param {string} path 
 * @param {byte[]} content 
 * @param {Function?} then 
 */
Aim.io.writeBytes = function(path, content, then) {
    let file = new java.io.File(path);
    if (file.exists()) {
        file.delete();
    }
    file.createNewFile();
    new java.lang.Thread(run(() => {
        let writer = new java.io.FileOutputStream(file);
        writer.write(content);
        writer.flush()
        writer.close();
        if (then) {
            then();
        }
    })).start();
}

/**
 * 
 * @param {string} path 
 * @param {string} content 
 */
Aim.io.writeSync = function(path, content) {
    let file = new java.io.File(path);
    if (file.exists()) {
        file.delete();
    }
    file.createNewFile();
    let writer = java.nio.file.Files.newBufferedWriter(java.nio.file.Paths.get(path), java.nio.charset.StandardCharsets.UTF_8);
    writer.write(content);
    writer.close();
}

/**
 * 
 * @param {string} path 
 * @param {byte[]} content 
 */
Aim.io.writeBytesSync = function(path, content) {
    let file = new java.io.File(path);
    if (file.exists()) {
        file.delete();
    }
    file.createNewFile();
    let writer = new java.io.FileOutputStream(file);
    writer.write(content);
    writer.flush()
    writer.close();
}

/**
 * 
 * @param {string} path 
 * @returns {string[]}
 */
Aim.io.ls = function(path) {
    let file = new java.io.File(path);
    if (file.exists()) {
        return file.list();
    } else {
        throw new Error("File not found:" + path);
    }
}
/**
 * 
 * @param {string} path 
 * @returns {boolean}
 */
Aim.io.exists = function(path) {
    let file = new java.io.File(path);
    return file.exists();
}
/**
 * 
 * @param {string} path 
 * @returns {boolean}
 */
Aim.io.isDir = function(path) {
    let file = new java.io.File(path);
    return file.isDirectory();
}
/**
 * 
 * @param {string} path 
 */
Aim.io.mkdir = function(path) {
    let file = new java.io.File(path);
    file.mkdir();
}
/**
 * 
 * @param {string} path 
 */
Aim.io.rm = function(path) {
    let file = new java.io.File(path);
    if (file.exists()) {
        file.delete();
    }
}
/**
 * 
 * @param {string} path 
 * @param {string} toPath 
 */
Aim.io.copy = function(path, toPath) {
    Aim.io.readBytes(path, d => {
        Aim.io.writeBytes(toPath, d)
    })
}
/**
 * 
 * @param {string} url 
 * @param {string} path 
 */
//适用于java8
//在Java 9及更高版本中，模块化系统要求明确声明模块之间的依赖关系。
Aim.io.download = function(url, path) {
    let file = new java.io.File(path);
    if (file.exists()) {
        file.delete();
    }
    file.createNewFile();
    let fos = new java.io.FileOutputStream(file);
    let urlClass = java.lang.Class.forName("java.net.URL");
    let urlConnectionClass = java.lang.Class.forName("java.net.URLConnection");
    let openConnectionMethod = urlClass.getDeclaredMethod("openConnection");
    let connection = openConnectionMethod.invoke(new java.net.URL(url));
    let getInputStreamMethod = urlConnectionClass.getDeclaredMethod("getInputStream");
    let bis = new java.io.BufferedInputStream(getInputStreamMethod.invoke(connection));
    let bos = new java.io.BufferedOutputStream(fos);
    let buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
    let length;
    while ((length = bis.read(buffer)) != -1) {
        bos.write(buffer, 0, length);
    }
    bos.close();
    bis.close();
    fos.close();
}
/*
Aim.io.download=function(url,path){
    let file=new java.io.File(path);
    if(file.exists()){
        file.delete();
    }
    file.createNewFile();
    let fos=new java.io.FileOutputStream(file);
    let connection=new java.net.URL(url).openConnection();
    let bis=new java.io.BufferedInputStream(connection.getInputStream());
    let bos=new java.io.BufferedOutputStream(fos);
    let buffer=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE,1024);
    let length;
    while((length=bis.read(buffer))!=-1){
        bos.write(buffer,0,length);
    }
    bos.close();
    bis.close();
    fos.close();
}*/
/*
Aim.io.download = function(url, path) {
    var cmd = "curl -o " + path + " " + url;
    var Runtime = java.lang.Runtime;
    var proc = Runtime.getRuntime().exec(cmd);
    */
    /*
    var BufferedReader = java.io.BufferedReader;
    var InputStreamReader = java.io.InputStreamReader;

    var inputStream = proc.getInputStream();
    var inputStreamReader = new InputStreamReader(inputStream);
    var bufferedReader = new BufferedReader(inputStreamReader);

    var line;
    while ((line = bufferedReader.readLine()) != null) {
        print(line); // 输出命令执行结果
    }

    bufferedReader.close();
    */
//}

/**
 * 
 * @param {string} path 
 * @param {string} toPath 
 */
Aim.io.zip = function(path, toPath) {
    let file = new java.io.File(path);
    if (file.exists()) {
        let zip = new java.util.zip.ZipOutputStream(new java.io.FileOutputStream(toPath));
        let files = file.listFiles();
        for (let i = 0; i < files.length; i++) {
            let fis = new java.io.FileInputStream(files[i]);
            let entry = new java.util.zip.ZipEntry(files[i].getName());
            zip.putNextEntry(entry);
            let buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
            let len;
            while ((len = fis.read(buffer)) > 0) {
                zip.write(buffer, 0, len);
            }
            fis.close();
        }
        zip.close();
    } else {
        throw new Error("File not found:" + path);
    }
}
/**
 * 
 * @param {string} path 
 * @param {string} toPath 
 */
Aim.io.unzip = function(path, toPath) {
    let file = new java.io.File(path);
    if (file.exists()) {
        let zip = new java.util.zip.ZipInputStream(new java.io.FileInputStream(file));
        let entry = zip.getNextEntry();
        while (entry != null) {
            let fos = new java.io.FileOutputStream(new java.io.File(toPath + "/" + entry.getName()));
            let buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
            let len;
            while ((len = zip.read(buffer)) > 0) {
                fos.write(buffer, 0, len);
            }
            fos.close();
            zip.closeEntry();
            entry = zip.getNextEntry();
        }
        zip.close();
    } else {
        throw new Error("File not found:" + path);
    }
}

/**
 * 
 * @constructor
 * @param {string} path 
 */
function Fi(path) {
    /**
     * @type {string}
     */
    this.path = path;
    /**
     * @type {java.io.File}
     */
    this.file = new java.io.File(path);
}
Fi.prototype = {

    /**
     * 
     * @returns {boolean}
     */
    exists: function() {
        return this.file.exists()
    },
    /**
     * 
     * @returns {boolean}
     */
    isDir: function() {
        return this.file.isDirectory()
    },
    /**
     * 
     * @returns {string}
     */
    absPath: function() {
        return this.file.getAbsolutePath()
    },
    /**
     * 
     * @returns {string}
     */
    name: function() {
        return this.file.getName()
    },
    /**
     * 
     * @returns {string[]}
     */
    list: function() {
        return this.file.list()
    },
    mkdir: function() {
        this.file.mkdir()
    },
    create: function() {
        this.file.createNewFile()
    },
    rm: function() {
        this.file.delete()
    },
    /**
     * 
     * @param {Function} cback 
     */
    read: function(cback) {
        new java.lang.Thread(run(() => {
            let sb = new java.lang.StringBuilder();
            let reader = java.nio.file.Files.newBufferedReader(java.nio.file.Paths.get(this.absPath()), java.nio.charset.StandardCharsets.UTF_8);
            for (;;) {
                let line = reader.readLine();
                if (line == null) {
                    break;
                }
                sb.append(line + "\n");
            }
            reader.close();
            cback(sb.toString().substring(0, sb.length() - 1));
        })).start();
    },
    /**
     * 
     * @param {Function} cback 
     */
    readBytes: function(cback) {
        new java.lang.Thread(run(() => {
            let sb = new java.lang.StringBuilder();
            let reader = java.nio.file.Files.newBufferedReader(java.nio.file.Paths.get(this.absPath()), java.nio.charset.StandardCharsets.UTF_8);
            for (;;) {
                let line = reader.readLine();
                if (line == null) {
                    break;
                }
                sb.append(line + "\n");
            }
            reader.close();
            cback(sb.toString().substring(0, sb.length() - 1).bytes);
        })).start();
    },
    /**
     * 
     * @returns {string}
     */
    readSync: function() {
        let sb = new java.lang.StringBuilder();
        let reader = java.nio.file.Files.newBufferedReader(java.nio.file.Paths.get(this.absPath()), java.nio.charset.StandardCharsets.UTF_8);
        for (;;) {
            let line = reader.readLine();
            if (line == null) {
                break;
            }
            sb.append(line + "\n");
        }
        reader.close();
        return sb.toString().substring(0, sb.length() - 1);
    },
    /**
     * 
     * @returns {byte[]}
     */
    readBytesSync: function() {
        let sb = new java.lang.StringBuilder();
        let reader = java.nio.file.Files.newBufferedReader(java.nio.file.Paths.get(this.absPath()), java.nio.charset.StandardCharsets.UTF_8);
        for (;;) {
            let line = reader.readLine();
            if (line == null) {
                break;
            }
            sb.append(line + "\n");
        }
        reader.close();
        return sb.toString().substring(0, sb.length() - 1).bytes;
    },
    /**
     * 
     * @param {string} content 
     * @param {Function?} cback 
     */
    write: function(content, cback) {
        new java.lang.Thread(run(() => {
            if (!this.file.exists()) this.file.createNewFile();
            let writer = new java.io.BufferedWriter(new java.io.FileWriter(file));
            writer.write(content);
            writer.close();
            if (cback) cback();
        })).start();
    },
    /**
     * 
     * @param {byte[]} content 
     * @param {Function?} cback 
     */
    writeBytes: function(content, cback) {
        new java.lang.Thread(run(() => {
            if (!this.file.exists()) this.file.createNewFile();
            let writer = new java.io.BufferedWriter(new java.io.FileWriter(file));
            writer.write(new java.lang.String(content));
            writer.close();
            if (cback) cback();
        })).start();
    },
    /**
     * 
     * @param {string} content 
     */
    writeSync: function(content) {
        if (!this.file.exists()) this.file.createNewFile();
        let writer = new java.io.BufferedWriter(new java.io.FileWriter(file));
        writer.write(content);
        writer.close();
    },
    /**
     * 
     * @param {byte[]} content 
     */
    writeBytesSync: function(content) {
        if (!this.file.exists()) this.file.createNewFile();
        let writer = new java.io.BufferedWriter(new java.io.FileWriter(file));
        writer.write(new java.lang.String(content));
        writer.close();
    }
}

/**
 * 
 * @param {string} path 
 * @returns {Fi}
 */
Aim.io.file = function(path) {
    return new Fi(path);
}

/**
 * 
 * @constructor
 * @param {string} host 
 * @param {number} port 
 */
function Soc(host, port) {
    /**
     * @type {java.net.Socket}
     */
    this.socket = new java.net.Socket(host, port);
    /**
     * @type {boolean}
     */
    this.closed = false;
    /**
     * @type {java.lang.Thread}
     */
    this.thread = new java.lang.Thread(run(() => {
        while (!closed) {
            let str = this.dos.readUTF();
            let bytes = str.bytes;
            for (let r of soc.receivers) {
                r(str, bytes);
            }
            for (let r of this.receiversOnce) {
                r(str, bytes);
                this.receiversOnce.splice(this.receiversOnce.indexOf(r), 1);
            }
            this.waiting = false;
            this.lastData = str;
            java.lang.Thread.sleep(5);
            this.waiting = true;
        }
    }))
    /**
     * @type {java.io.DataOutputStream}
     */
    this.dis = new java.io.DataInputStream(socket.getInputStream())
    /**
     * @type {java.io.DataOutputStream}
     */
    this.dos = new java.io.DataOutputStream(socket.getOutputStream())
    /**
     * @type {Function[]}
     */
    this.receivers = []
    /**
     * @type {Function[]}
     */
    this.receiversOnce = []
    /**
     * @type {boolean}
     */
    this.waiting = true
    /**
     * @type {string}
     */
    this.lastData = new java.lang.String()

}
Soc.prototype = {
    close: function() {
        this.socket.close();
        this.closed = true;
    },
    /**
     * 
     * @returns {boolean}
     */
    isClosed: function() {
        return this.closed;
    },
    /**
     * 
     * @param {Function} cback 
     */
    addReceiver: function(cback) {
        this.receivers.push(cback);
    },
    /**
     * 
     * @param {Function} cback
     */
    read: function(cback) {
        this.receiversOnce.push(cback);
    },
    /**
     * 
     * @returns {[string,byte[]]}
     */
    readSync: function() {
        while (this.waiting) {
            java.lang.Thread.sleep(5);
        }
        return [lastData, lastData.bytes]
    },
    /**
     * 
     * @param {string} str 
     * @param {Function?} cback 
     */
    write: function(str, cback) {
        new java.lang.Thread(run(() => {
            this.dos.writeUTF(str);
            if (cback) cback();
        })).start();
    },
    /**
     * 
     * @method
     * @param {byte[]} bytes 
     * @param {Function?} cback 
     */
    writeBytes: function(bytes, cback) {
        new java.lang.Thread(run(() => {
            this.dos.write(bytes);
            if (cback) cback();
        })).start();
    },
    /**
     * 
     * @param {string} str 
     */
    writeSync: function(str) {
        this.dos.writeUTF(str);
    },
    /**
     * 
     * @param {byte[]} bytes 
     */
    writeBytesSync: function(bytes) {
        this.dos.write(bytes);
    },
    /**
     * 
     * @returns {string}
     */
    getHost: function() {
        return socket.getInetAddress().getHostAddress();
    },
    /**
     * 
     * @returns {number}
     */
    getPort: function() {
        return socket.getPort();
    },
    reconnect: function() {
        this.close();
        this.socket = new java.net.Socket(host, port);
        this.dis = new java.io.DataInputStream(socket.getInputStream());
        this.dos = new java.io.DataOutputStream(socket.getOutputStream());
    }
}

Aim.io.socket = function(host, port) {
    /**
     * .close()
     * .closed()
     * .addReceiver(function(string,byte[]))
     * .receiveOnce(function(string,byte[]))
     * .receiveSync() return string or waiting
     * .receiveBytesSync() return [] or waiting
     * .send(string,cback)
     * .sendBytes(byte[],cback)
     * .sendSync(string)
     * .sendBytesSync(byte[]).
     * .getHost()
     * .getPort()
     * .reconnect()
     */
    let soc = new Soc(host, port);
    soc.thread.start()
    return soc;
}


/**
 * REPLACE IT WITH Aim.io.readSync
 */
Aim.io.readw = (f) => Aim.io.readSync(f);