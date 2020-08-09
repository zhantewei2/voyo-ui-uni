const fs=require("fs");
const path=require('path');
const workPath=__dirname;
const replaceDir=path.join(workPath,"components");


const replaceWebsass=(dir)=>{
  const stat=fs.statSync(dir);
  if(stat.isDirectory()){
    for(let filename of fs.readdirSync(dir)){
      replaceWebsass(path.join(dir,filename))
    }
  }else{
    const ext=path.extname(dir);
    if(ext===".scss"){
      const newName=dir.replace(/\.scss/,".scss");
      console.log(newName);
      fs.renameSync(dir,newName);
    }
  }
}

replaceWebsass(replaceDir)
