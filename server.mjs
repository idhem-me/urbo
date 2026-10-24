import http from 'node:http';
import {readFile} from 'node:fs/promises';
const root=new URL('./public/',import.meta.url);
http.createServer(async(req,res)=>{try{const path=new URL(req.url,'http://localhost').pathname; if(!['/','/index.html','/game.js','/style.css','/engine.js'].includes(path)){res.writeHead(404).end();return;} const file=path==='/'?'index.html':path.slice(1);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(await readFile(new URL(file,root)));}catch{res.writeHead(500).end('Erreur de chargement');}}).listen(process.env.PORT||3000);
