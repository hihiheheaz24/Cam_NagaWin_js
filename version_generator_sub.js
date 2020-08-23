var fs = require('fs');
var path = require('path');




var url ="";
var src = "";

// Parse arguments
var i = 2;
while ( i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
    case '--url' :
    case '-u' :
        url = process.argv[i+1];
       
        i += 2;
        break;
    case '--src' :
    case '-s' :
        src = process.argv[i+1];
        i += 2;
        break;
    default :
        i++;
        break;
    }
}

getUrlSubPack(src);

function getUrlSubPack(src){
  
    fs.readdirSync(src).forEach(file => {
      
      let tempUrl = src +  "/" + file;
      if(file != ".DS_Store"){
        var stats = fs.statSync(tempUrl);
        if(stats.isFile()  && Loc(file)){
          
          var strTemp =fs.readFileSync(tempUrl);
          
          var strParse = JSON.parse(strTemp);
          
          let nameFoder = "/" +  file.split(".")[0];
          strParse.packageUrl = url  + nameFoder ;
          strParse.remoteManifestUrl = url + nameFoder     +"/project.manifest"; 
          strParse.remoteVersionUrl = url + nameFoder     +"/version.manifest";

          console.log("dang gen1 " + JSON.stringify(strParse)); 
          fs.writeFileSync(tempUrl,JSON.stringify(strParse));
      //  Editor.log( "=== " +  fs.readFileSync(tempUrl +".meta" , "utf8"));
        }
      }
     
    });
  }

  function Loc(fileName){
    var arrLoc = [".meta",".json" , ".atlas",".DS_Store"];
    var name =  path.extname(fileName);
    if(arrLoc.includes(name)) return false;
    return true;
  }




