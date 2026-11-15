const http=require("http"),fs=require("fs"),path=require("path");
const root=__dirname;
const types={".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"};
const send=(res,f)=>{
  fs.readFile(f,(e,d)=>{
    if(e){res.writeHead(500);res.end("error");return;}
    res.writeHead(200,{"Content-Type":types[path.extname(f).toLowerCase()]||"application/octet-stream","Cache-Control":"no-store"});
    res.end(d);
  });
};
http.createServer((req,res)=>{
  let p=decodeURIComponent((req.url||"/").split("?")[0]);
  p=p.replace(/[`“”‘’"']/g,"").trim();
  if(p===""||p==="/")p="/index.html";
  const f=path.join(root,p);
  fs.stat(f,(e,st)=>{
    if(!e&&st.isFile()){send(res,f);return;}
    const ext=path.extname(p).toLowerCase();
    if(ext&&types[ext]){res.writeHead(404);res.end("not found");return;}
    send(res,path.join(root,"index.html"));
  });
}).listen(8123,"127.0.0.1",()=>console.log("serving on 8123"));
