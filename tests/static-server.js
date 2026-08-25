"use strict";

const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");

const root=path.resolve(__dirname,"..");
const port=Number(process.env.PORT)||4173;
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".png":"image/png",".ico":"image/x-icon"};

http.createServer((request,response)=>{
  const pathname=decodeURIComponent(new URL(request.url,"http://localhost").pathname);
  const relative=pathname==="/"?"index.html":pathname.replace(/^\/+/,"");
  const file=path.resolve(root,relative);
  if(file!==root&&!file.startsWith(`${root}${path.sep}`)){response.writeHead(403).end("Forbidden");return;}
  fs.readFile(file,(error,body)=>{
    if(error){response.writeHead(error.code==="ENOENT"?404:500).end(error.code||"Error");return;}
    response.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-cache"});response.end(body);
  });
}).listen(port,"127.0.0.1",()=>console.log(`Gubuntu test server: http://127.0.0.1:${port}`));
