(function(){
var C=window.FBCFG,LITE=!!window.LITE,FS="https://firestore.googleapis.com/v1/projects/"+C.pid+"/databases/(default)/documents",
DOC="projects/"+C.pid+"/databases/(default)/documents/",
S=null,cur=null,oth=null,last=0,rdy=false,lastAct=0,lastSend=0,tab="c",FR=[],BL=[],frT=0,fdT=0,PF=[],FPo=[],P={},PG=null,SQ="",FM=gv("fm")||"f",ls=window.localStorage,
EM=["🙂","😂","😍","👍","❤","😢","😮","🎉"],MAXDAY=150,LIM=LITE?15:30,
STK=["😀","😂","🥰","😎","😭","😡","🤔","🥳","👍","👏","🙏","💪","🔥","💯","❤️","💔","🎉","🍕","🎮","⚽","🐱","🐶","🌈","⭐"],
AV=["🐱","🐶","🦊","🐼","🐸","🦁","🐵","🐧","🐰","🐯","🐨","🐙","👾","🎸","⚽","🌸"],
PC=["#3b5998","#6d84b4","#5cb85c","#e8a33d","#d9534f","#9b59b6","#1abc9c","#555555"],
TT=[[0,"Silenzioso","t0"],[1,"Chiacchierone","t1"],[30,"Socievole","t2"],[100,"Animale da chat","t3"],[250,"Re della chat","t4"],[500,"Leggenda","t5"]];
function $(i){return document.getElementById(i)}
function sv(k,v){try{ls.setItem(k,v)}catch(e){}}function gv(k){try{return window.localStorage.getItem(k)}catch(e){return null}}
function el(t,c,x,f){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined&&x!==null)e.appendChild(document.createTextNode(x));if(f)e.onclick=f;return e}
function isMob(){return LITE||window.innerWidth<700}
function canImg(){try{return !!(document.createElement("canvas").getContext&&(window.URL||window.webkitURL))}catch(e){return false}}
function X(m,u,b,cb,t){var r=new XMLHttpRequest();r.open(m,u,true);r.setRequestHeader("Content-Type","application/json");if(t)r.setRequestHeader("Authorization","Bearer "+t);
r.onreadystatechange=function(){if(r.readyState==4){var j=null;try{j=JSON.parse(r.responseText)}catch(e){}cb(r.status,j)}};r.send(b?JSON.stringify(b):null)}
function tk(cb){if(Date.now()<S.exp)return cb(S.t);
X("POST","https://securetoken.googleapis.com/v1/token?key="+C.key,{grant_type:"refresh_token",refresh_token:S.r},function(s,j){
if(s!=200){logout();return}S.t=j.id_token;S.r=j.refresh_token;S.exp=Date.now()+(j.expires_in-120)*1000;sv("s",JSON.stringify(S));cb(S.t)})}
function api(m,p,b,cb){tk(function(t){X(m,FS+p,b,cb||function(){},t)})}
function F(o){var f={},k;for(k in o)f[k]=typeof o[k]=="number"?{integerValue:""+o[k]}:{stringValue:o[k]};return{fields:f}}
function V(d,k){var v=d.fields&&d.fields[k];return v?(v.stringValue!==undefined?v.stringValue:parseInt(v.integerValue,10)):""}
function mk(a){return"?updateMask.fieldPaths="+a.join("&updateMask.fieldPaths=")}
function fl(f,op,v){return{fieldFilter:{field:{fieldPath:f},op:op,value:{stringValue:v}}}}
function col(n){var h=0,i;for(i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))%360;return"hsl("+h+",35%,42%)"}
function tm(t){var h=new Date(t),m=h.getMinutes();return h.getDate()+"/"+(h.getMonth()+1)+" "+h.getHours()+":"+(m<10?"0":"")+m}
function nk(v){return v.toLowerCase().replace(/\s/g,"")}
function trim(v){return v.replace(/^\s+|\s+$/g,"")}
function rm(a,id){var i;for(i=0;i<a.length;i++)if(a[i].id==id){a.splice(i,1);return}}
function cid(o){return[S.u,o].sort().join("_")}
function err(t){$("err").textContent=t}
function stop(e){e=e||window.event;if(e.stopPropagation)e.stopPropagation();else e.cancelBubble=true}
function ffr(id){var i;for(i=0;i<FR.length;i++)if(FR[i].id==id)return FR[i];return null}
/* foto: scelta dal telefono, ridimensionata e compressa */
function pickImg(max,sq,lim,cb){var i=document.createElement("input");i.type="file";i.accept="image/*";i.style.display="none";document.body.appendChild(i);
i.onchange=function(){var f=i.files&&i.files[0],U=window.URL||window.webkitURL,u,im;document.body.removeChild(i);if(!f)return;u=U.createObjectURL(f);im=new Image();
im.onload=function(){var w=im.width,h=im.height,c=document.createElement("canvas"),x=c.getContext("2d"),sx=0,sy=0,sw=w,sh=h,dw,dh,q=.8,d,m,s;
if(sq){m=Math.min(w,h);sx=(w-m)/2;sy=(h-m)/2;sw=m;sh=m;dw=Math.min(max,m);dh=dw}else{s=Math.min(1,max/Math.max(w,h));dw=Math.round(w*s);dh=Math.round(h*s)}
c.width=dw;c.height=dh;x.fillStyle="#fff";x.fillRect(0,0,dw,dh);x.drawImage(im,sx,sy,sw,sh,0,0,dw,dh);
d=c.toDataURL("image/jpeg",q);while(d.length>lim&&q>.3){q-=.1;d=c.toDataURL("image/jpeg",q)}
U.revokeObjectURL(u);if(d.length>lim){alert("Foto troppo pesante, scegline un'altra.");return}cb(d)};
im.onerror=function(){alert("Impossibile leggere la foto.")};im.src=u};i.click()}
/* profili, avatar e titoli */
function pr(d){return{n:V(d,"n"),s:V(d,"s"),a:V(d,"a"),l:V(d,"l"),ph:V(d,"ph"),wk:V(d,"wk"),wc:V(d,"wc")||0,st:V(d,"st")||0}}
function setPh(s,ph){s.className="av ph";s.style.backgroundImage='url("'+ph+'")'}
function av(n,id){var s=el("span","av"),p=id&&P[id],a=p&&p.a?String(p.a).split("|"):null;
if(p&&p.ph){setPh(s,p.ph);return s}
if(a&&AV[parseInt(a[0],10)]){s.textContent=AV[parseInt(a[0],10)];s.style.background=PC[parseInt(a[1],10)]||PC[0];s.className="av em"}
else{s.textContent=n.charAt(0);s.style.background=col(n)}return s}
function wkId(){var d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-(d.getDay()+6)%7);return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()}
function wcn(id){var p=P[id];return p&&p.wk==wkId()?p.wc:0}
function ti(id){var c=wcn(id),i,r=TT[0];for(i=0;i<TT.length;i++)if(c>=TT[i][0])r=TT[i];return r}
function bd(id){if(!P[id])return document.createTextNode("");var t=ti(id),s=el("span","bd "+t[2],t[1]);s.title=wcn(id)+" messaggi questa settimana";return s}
function lk(s){var r=[],a=s?String(s).split("\n"):[],i,x;for(i=0;i<a.length&&r.length<5;i++){x=a[i].split("\t");if(x.length==2&&/^https?:\/\//i.test(x[1]))r.push(x)}return r}
function dref(id){return DOC+"users/"+id}
function fillP(ids,cb){var d=[],i;for(i=0;i<ids.length&&d.length<50;i++)d.push(dref(ids[i]));if(!d.length)return cb();
api("POST",":batchGet",{documents:d},function(s,j){var k,x;if(s==200&&j)for(k=0;k<j.length;k++){x=j[k].found;if(x)P[x.name.split("/").pop()]=pr(x)}cb()})}
function loadProf(cb){var ids=[S.u],i;for(i=0;i<FR.length&&ids.length<50;i++)if(FR[i].s=="a")ids.push(FR[i].id);fillP(ids,function(){paintMe();cb()})}
function paintMe(){var m=$("mav");if(!m)return;m.innerHTML="";m.appendChild(av(S.n,S.u))}
function getProf(id,cb){api("GET","/users/"+id,null,function(s,j){if(s==200&&j)P[id]=pr(j);cb(P[id]||{n:"?",s:"",a:"",l:"",ph:"",wk:"",wc:0,st:0})})}
/* installazione come app (Android e iPhone/iPad) */
var DP=null;
function isStd(){return !!(window.navigator.standalone||(window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches))}
function isIOS(){var u=navigator.userAgent;return /iphone|ipad|ipod/i.test(u)||(navigator.platform=="MacIntel"&&navigator.maxTouchPoints>1)}
function instOK(){return !isStd()&&!gv("ni")&&(!!DP||isIOS())}
function instEl(){var d=el("div","inst");
if(DP){d.appendChild(el("b","","Installa Friendbook"));d.appendChild(document.createTextNode("Aggiungila alla schermata Home: si apre a schermo intero, come una vera app."));d.appendChild(el("br"));
d.appendChild(el("button","btn","Installa",function(){var p=DP;if(!p)return;p.prompt();DP=null;try{p.userChoice.then(function(){showInst()})}catch(e){showInst()}}))}
else{d.appendChild(el("b","","Installa Friendbook su iPhone/iPad"));d.appendChild(document.createTextNode("In Safari tocca il tasto Condividi (il quadrato con la freccia in su), poi «Aggiungi alla schermata Home» e infine «Aggiungi»."));d.appendChild(el("br"))}
d.appendChild(el("a","","Non ora",function(){sv("ni","1");showInst()}));return d}
function showInst(){var a=$("ia"),b=$("ib");if(!a||!b)return;a.innerHTML="";b.innerHTML="";if(!instOK())return;a.appendChild(instEl());b.appendChild(instEl())}
try{window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();DP=e;showInst()});window.addEventListener("appinstalled",function(){DP=null;sv("ni","1");showInst()})}catch(e){}
document.getElementById("root").innerHTML='<div id="auth"><h2>friendbook</h2><p>Accedi o iscriviti per chattare con i tuoi amici.</p><input id="un" placeholder="Nickname (a-z, 0-9)" maxlength="16" autocapitalize="off" autocorrect="off"><input id="pw" type="password" placeholder="Password (min. 6)"><div id="err"></div><button class="btn" id="bi">Accedi</button> <button class="btn g" id="br">Iscriviti</button><div id="ia"></div><div class="sm">'+(LITE?'<a href="index.html">Versione completa</a>':'<a href="lite.html">Versione light</a>')+'</div></div><div id="app" class="hid"><div id="top"><a id="back">&lsaquo; Indietro</a><div id="logo">friendbook</div><div id="me"><a id="mp"><span id="mav"></span><b id="mn"></b></a> <a id="out">Esci</a></div></div><div id="wrap"><div id="list"><div id="tabs"><a id="tc">Chat</a><a id="tf">Amici</a><a id="to">Post</a></div><div id="ib"></div><div id="lc"></div></div><div id="chat"><div id="ct"></div><div id="msgs"></div><div id="stk" class="hid"></div><div id="bar"><div id="em"></div><input id="msg" maxlength="200" placeholder="Scrivi un messaggio..."><button class="btn" id="sd">Invia</button> <a id="rf">Aggiorna</a></div></div><div id="pg"></div></div></div>';
/* auth */
function go(kind){var n=nk($("un").value),p=$("pw").value;
if(!/^[a-z0-9]{3,16}$/.test(n)){err("Nickname: 3-16 lettere o numeri.");return}
if(p.length<6){err("La password deve avere almeno 6 caratteri.");return}
err("...");
X("POST","https://identitytoolkit.googleapis.com/v1/accounts:"+kind+"?key="+C.key,{email:n+"@fb14.app",password:p,returnSecureToken:true},function(s,j){
if(s!=200){var m=j&&j.error&&j.error.message||"";err(m.indexOf("EMAIL_EXISTS")>-1?"Nickname già preso.":(m.indexOf("INVALID")>-1||m.indexOf("EMAIL_NOT_FOUND")>-1)?"Nickname o password errati.":"Errore di connessione.");return}
S={t:j.idToken,r:j.refreshToken,exp:Date.now()+3480000,u:j.localId,n:n};sv("s",JSON.stringify(S));
if(kind=="signUp")api("POST","/nicknames?documentId="+n,F({u:S.u}),function(){api("POST","/users?documentId="+S.u,F({n:n,c:Date.now(),s:"",st:0}),start)});else start()})}
function logout(){try{ls.clear()}catch(e){}location.reload()}
function start(){$("auth").className="hid";$("app").className="";$("mn").textContent=S.n;
var e=$("em"),i,sp=$("stk");
e.appendChild(el("a","skb","😀 Sticker",function(){sp.className=sp.className=="hid"?"":"hid"}));
for(i=0;i<EM.length;i++)e.appendChild(el("a","",EM[i],(function(x){return function(){$("msg").value+=x}})(EM[i])));
for(i=0;i<STK.length;i++)sp.appendChild(el("a","",STK[i],(function(k){return function(){send("§"+k)}})(i)));
paintMe();$("ct").textContent="Scegli un amico per chattare.";showInst();if(tab=="o")setTab("o");else draw();tick()}
/* amici */
function qr(coll,cb){api("POST","/users/"+S.u+":runQuery",{structuredQuery:{from:[{collectionId:coll}],limit:100}},function(s,j){var r=[],i,d;
if(s==200&&j)for(i=0;i<j.length;i++){d=j[i].document;if(d)r.push({id:d.name.split("/").pop(),n:V(d,"n"),s:V(d,"s")})}cb(r)})}
function loadFr(force,cb){if(!force&&Date.now()-frT<120000)return cb();qr("f",function(a){FR=a;qr("bl",function(b){BL=b;loadProf(function(){frT=Date.now();cb()})})})}
function refresh(){if(document.body.className=="pg"&&PG)renderPg();else draw()}
function addById(id,n,msg){var t=Date.now();
api("POST","/users/"+S.u+"/f?documentId="+id,F({n:n,s:"o",t:t}),function(s1){if(s1!=200){msg("Impossibile aggiungere questo utente.");return}
api("POST","/users/"+id+"/f?documentId="+S.u,F({n:S.n,s:"i",t:t}),function(s2){if(s2!=200){api("DELETE","/users/"+S.u+"/f/"+id);msg("Impossibile aggiungere questo utente.");return}
FR.push({id:id,n:n,s:"o"});fdT=0;msg("");refresh()})})}
function acc(f){var b={fields:{s:{stringValue:"a"}}},q="?updateMask.fieldPaths=s";
api("PATCH","/users/"+S.u+"/f/"+f.id+q,b,function(s){if(s!=200)return;api("PATCH","/users/"+f.id+"/f/"+S.u+q,b);f.s="a";fdT=0;frT=0;loadFr(true,refresh)})}
function closeIf(id){if(oth==id){cur=null;oth=null;$("msgs").innerHTML="";$("ct").textContent="Scegli un amico per chattare.";document.body.className=""}}
function del(f){api("DELETE","/users/"+S.u+"/f/"+f.id);api("DELETE","/users/"+f.id+"/f/"+S.u);rm(FR,f.id);fdT=0;closeIf(f.id);draw()}
function blk(f){if(!confirm("Bloccare "+f.n+"?"))return;api("DELETE","/users/"+S.u+"/f/"+f.id);api("DELETE","/users/"+f.id+"/f/"+S.u);
api("POST","/users/"+S.u+"/bl?documentId="+f.id,F({n:f.n,t:Date.now()}));rm(FR,f.id);BL.push({id:f.id,n:f.n,s:""});fdT=0;closeIf(f.id);draw()}
function ubl(b){api("DELETE","/users/"+S.u+"/bl/"+b.id);rm(BL,b.id);draw()}
/* viste lista */
function sec(b,t){b.appendChild(el("h3","",t))}
function row(b,n,acts,f,id){var r=el("div","u"),a=el("span","act"),nb=el("b","",n),i;for(i=0;i<acts.length;i++)a.appendChild(acts[i]);a.onclick=stop;
r.appendChild(av(n,id));r.appendChild(a);if(id)nb.appendChild(bd(id));r.appendChild(nb);if(f)r.onclick=f;b.appendChild(r)}
function draw(){var b=$("lc"),t=tab;b.innerHTML="";$("tc").className=t=="c"?"on":"";$("tf").className=t=="f"?"on":"";$("to").className=t=="o"?"on":"";
b.appendChild(el("div","pad","..."));loadFr(false,function(){if(t!=tab)return;b.innerHTML="";if(t=="c")dChat(b);else if(t=="f")dFr(b);else dOn(b)})}
function setTab(t){tab=t;if(document.body.className=="pg"&&t!="o")document.body.className="";
if(t=="f")frT=0;if(t=="o"&&!isMob()){PG={k:"f"};document.body.className="pg";renderPg()}draw()}
function dChat(b){var i,n=0;for(i=0;i<FR.length;i++)if(FR[i].s=="a"){n++;row(b,FR[i].n,[],(function(f){return function(){openChat(f)}})(FR[i]),FR[i].id)}
if(!n)b.appendChild(el("div","pad","Nessun amico ancora. Vai su Amici e cerca qualcuno."))}
function srow(sr,id){var p=P[id],f=ffr(id),a;
if(f&&f.s=="a")a=el("span","","✓ Amici");else if(f&&f.s=="o")a=el("span","","Richiesta inviata");
else if(f&&f.s=="i")a=el("a","","Conferma",function(){acc(f)});
else a=el("a","","Aggiungi",function(){addById(id,p.n,function(t){if(t)alert(t)})});
row(sr,p.n,[a],function(){openProf(id)},id)}
function doSearch(keep){var inp=$("fn"),q=keep===true?SQ:(inp?inp.value:"").toLowerCase().replace(/[^a-z0-9]/g,""),sr=$("sr");if(!sr)return;SQ=q;sr.innerHTML="";if(!q)return;
sr.appendChild(el("div","pad","Cerco..."));
api("POST",":runQuery",{structuredQuery:{from:[{collectionId:"users"}],where:{compositeFilter:{op:"AND",filters:[fl("n","GREATER_THAN_OR_EQUAL",q),fl("n","LESS_THAN_OR_EQUAL",q+"\uf8ff")]}},orderBy:[{field:{fieldPath:"n"}}],limit:20}},function(s,j){
if($("sr")!==sr)return;sr.innerHTML="";var r=[],i,d,id;if(s==200&&j)for(i=0;i<j.length;i++){d=j[i].document;if(d){id=d.name.split("/").pop();if(id!=S.u){P[id]=pr(d);r.push(id)}}}
sec(sr,"Risultati per «"+q+"»");if(!r.length){sr.appendChild(el("div","pad","Nessuna persona trovata."));return}
for(i=0;i<r.length;i++)srow(sr,r[i])})}
function dFr(b){var i,f,d=el("div","box"),inp=el("input"),sr=el("div"),g={i:[],o:[],a:[]};inp.id="fn";inp.maxLength=16;inp.placeholder="Cerca persone (nickname)";inp.value=SQ;inp.setAttribute("autocapitalize","off");
inp.onkeydown=function(e){if((e||window.event).keyCode==13)doSearch()};d.appendChild(inp);d.appendChild(el("button","btn","Cerca",doSearch));b.appendChild(d);sr.id="sr";b.appendChild(sr);if(SQ)doSearch(true);
for(i=0;i<FR.length;i++)if(g[FR[i].s])g[FR[i].s].push(FR[i]);
if(g.i.length){sec(b,"Richieste ricevute");for(i=0;i<g.i.length;i++){f=g.i[i];row(b,f.n,[el("a","",
"Conferma",(function(x){return function(){acc(x)}})(f)),el("a","","Elimina",(function(x){return function(){del(x)}})(f))],(function(x){return function(){openProf(x.id)}})(f),f.id)}}
if(g.o.length){sec(b,"Richieste inviate");for(i=0;i<g.o.length;i++){f=g.o[i];row(b,f.n,[el("a","","Annulla",(function(x){return function(){del(x)}})(f))],(function(x){return function(){openProf(x.id)}})(f),f.id)}}
sec(b,"Amici ("+g.a.length+")");for(i=0;i<g.a.length;i++){f=g.a[i];row(b,f.n,[el("a","","Rimuovi",(function(x){return function(){del(x)}})(f)),el("a","","Blocca",(function(x){return function(){blk(x)}})(f))],(function(x){return function(){openProf(x.id)}})(f),f.id)}
if(BL.length){sec(b,"Bloccati");for(i=0;i<BL.length;i++){f=BL[i];row(b,f.n,[el("a","","Sblocca",(function(x){return function(){ubl(x)}})(f))])}}}
/* post */
function dOn(b){var i,f;if(isMob()){feedView(b);return}
sec(b,"Il tuo profilo");row(b,S.n,[],function(){openProf(S.u)},S.u);
sec(b,"Amici");for(i=0;i<FR.length;i++){f=FR[i];if(f.s=="a")row(b,f.n,[],(function(x){return function(){openProf(x.id)}})(f),f.id)}
if(!b.lastChild||b.lastChild.tagName=="H3")b.appendChild(el("div","pad","Nessun amico ancora."))}
function pp(d,u,src){var l=[],f=d.fields&&d.fields.lk,v,i;if(f&&f.arrayValue&&f.arrayValue.values){v=f.arrayValue.values;for(i=0;i<v.length;i++)l.push(v[i].stringValue)}
return{id:d.name.split("/").pop(),u:u||V(d,"u"),n:V(d,"n"),x:V(d,"x"),t:V(d,"t"),k:V(d,"k"),ph:V(d,"ph"),lk:l,src:src}}
function runQ(parent,coll,where,order,lim,src,cb){var q={from:[{collectionId:coll}],limit:lim};if(where)q.where=where;if(order)q.orderBy=[{field:{fieldPath:"t"},direction:"DESCENDING"}];
api("POST",(parent?"/users/"+parent:"")+":runQuery",{structuredQuery:q},function(s,j){var r=[],i,d;if(s==200&&j)for(i=0;i<j.length;i++){d=j[i].document;if(d)r.push(pp(d,parent,src))}cb(r)})}
function byT(a,b){return b.t-a.t}
function loadFeed(force,cb){if(!force&&fdT&&Date.now()-fdT<90000)return cb();
var ids=[S.u],i,n,pf=[],fp=[],done;for(i=0;i<FR.length&&ids.length<20;i++)if(FR[i].s=="a")ids.push(FR[i].id);n=ids.length+1;
done=function(){n--;if(n)return;PF=pf;FPo=fp;var au=[],sn={},k,a=pf.concat(fp);for(k=0;k<a.length;k++)if(!P[a[k].u]&&!sn[a[k].u]){sn[a[k].u]=1;au.push(a[k].u)}fdT=Date.now();fillP(au,cb)};
runQ(null,"pub",null,true,30,"pub",function(r){pf=r;done()});
for(i=0;i<ids.length;i++)runQ(ids[i],"p",null,true,8,"p",function(r){fp=fp.concat(r);done()})}
function feedList(mode){var r,i,ok={};if(mode=="a")return PF.slice(0,40);ok[S.u]=1;for(i=0;i<FR.length;i++)if(FR[i].s=="a")ok[FR[i].id]=1;
r=FPo.slice();for(i=0;i<PF.length;i++)if(ok[PF[i].u])r.push(PF[i]);r.sort(byT);return r.slice(0,40)}
function stkPanel(onPick){var d=el("div","sp hid"),i;for(i=0;i<STK.length;i++)d.appendChild(el("a","",STK[i],(function(k){return function(){onPick(k);d.className="sp hid"}})(i)));return d}
function composer(parent){var d=el("div","box cmp"),t=el("textarea"),st="",ph="",pv=el("div","cpv"),ctl=el("div","ctl"),sel=el("select"),sp,bt;
t.maxLength=280;t.placeholder="Cosa stai pensando?";
function paintPv(){pv.innerHTML="";if(ph){var im=el("img","pimg");im.src=ph;pv.appendChild(im);pv.appendChild(el("a","dl","✕ Togli foto",function(){ph="";paintPv()}))}
if(st!==""){pv.appendChild(el("div","pstk",STK[parseInt(st,10)]));pv.appendChild(el("a","dl","✕ Togli sticker",function(){st="";paintPv()}))}}
sp=stkPanel(function(k){st=""+k;paintPv()});
sel.appendChild(new Option("👥 Solo amici","f"));sel.appendChild(new Option("🌍 Tutti","a"));sel.value=gv("vis")=="a"?"a":"f";
d.appendChild(t);d.appendChild(pv);d.appendChild(sp);
if(canImg())ctl.appendChild(el("a","cb","📷 Foto",function(){pickImg(720,false,260000,function(x){ph=x;paintPv()})}));
ctl.appendChild(el("a","cb","😀 Sticker",function(){sp.className=sp.className=="sp hid"?"sp":"sp hid"}));
ctl.appendChild(sel);
bt=el("button","btn","Pubblica",function(){var x=trim(t.value).substring(0,280),v=sel.value,now=Date.now(),b,url;if(!x&&!ph&&st==="")return;sv("vis",v);bt.disabled=true;
b=F({x:x,t:now,k:st,ph:ph});b.fields.lk={arrayValue:{}};
if(v=="a"){b.fields.u={stringValue:S.u};b.fields.n={stringValue:S.n};url="/pub"}else url="/users/"+S.u+"/p";
api("POST",url,b,function(s){bt.disabled=false;if(s==200){fdT=0;refresh()}else alert("Post non pubblicato. Hai pubblicato le nuove regole Firestore?")})});
ctl.appendChild(bt);d.appendChild(ctl);parent.appendChild(d)}
function likeP(p,a,cnt){var me=S.u,i=p.lk.indexOf(me),has=i>-1,ft={fieldPath:"lk"},path=p.src=="pub"?"pub/"+p.id:"users/"+p.u+"/p/"+p.id;
if(has){ft.removeAllFromArray={values:[{stringValue:me}]};p.lk.splice(i,1)}else{ft.appendMissingElements={values:[{stringValue:me}]};p.lk.push(me)}
fdT=0;paintLk(p,a,cnt);
api("POST",":commit",{writes:[{transform:{document:DOC+path,fieldTransforms:[ft]}}]},function(s){if(s!=200){if(has)p.lk.push(me);else p.lk.splice(p.lk.indexOf(me),1);paintLk(p,a,cnt);alert("Non sono riuscito a salvare il mi piace.")}})}
function paintLk(p,a,cnt){var has=p.lk.indexOf(S.u)>-1;a.textContent=has?"♥ Ti piace":"♡ Mi piace";a.className=has?"on":"";cnt.textContent=p.lk.length?p.lk.length+(p.lk.length==1?" mi piace":" mi piace"):""}
function postEl(p){var d=el("div","post"),b=el("div","pb"),n=P[p.u]&&P[p.u].n||p.n||"?",pa=el("div","pa"),a=el("a","","",null),cnt=el("a","cnt","",null),lb=el("div","lkr hid"),im;
d.appendChild(av(n,p.u));b.appendChild(el("a","pn",n,(function(u){return function(){openProf(u)}})(p.u)));b.appendChild(bd(p.u));
b.appendChild(el("span","vt",p.src=="pub"?"🌍 Pubblico":"👥 Amici"));
if(p.u==S.u)b.appendChild(el("a","dl","Elimina",function(){if(!confirm("Eliminare il post?"))return;api("DELETE",(p.src=="pub"?"/pub/":"/users/"+S.u+"/p/")+(p.src=="pub"?p.id:p.id),null,function(){fdT=0;refresh()})}));
b.appendChild(el("i","",tm(p.t)));if(p.x)b.appendChild(el("div","px",p.x));
if(p.k!==""&&STK[parseInt(p.k,10)])b.appendChild(el("div","pstk",STK[parseInt(p.k,10)]));
if(p.ph){im=el("img","pimg");im.src=p.ph;im.alt="";if("loading" in im)im.loading="lazy";b.appendChild(im)}
a.onclick=function(){likeP(p,a,cnt)};cnt.onclick=function(){if(lb.className!="lkr hid"){lb.className="lkr hid";return}if(!p.lk.length)return;
fillP(p.lk,function(){lb.innerHTML="";var i,id;for(i=0;i<p.lk.length&&i<30;i++){id=p.lk[i];lb.appendChild(el("a","",P[id]?P[id].n:"?",(function(u){return function(){openProf(u)}})(id)));lb.appendChild(document.createTextNode("  "))}lb.className="lkr"})};
paintLk(p,a,cnt);pa.appendChild(a);pa.appendChild(cnt);b.appendChild(pa);b.appendChild(lb);d.appendChild(b);return d}
function feedView(b){var seg=el("div","seg"),w=el("div","feed"),sa=el("a","","👥 Amici"),sb=el("a","","🌍 Tutti");
function paint(){var l,i;sa.className=FM=="f"?"on":"";sb.className=FM=="a"?"on":"";w.innerHTML="";l=feedList(FM);
if(!l.length){w.appendChild(el("div","pad",FM=="f"?"Nessun post dagli amici. Scrivi il primo!":"Nessun post pubblico ancora."));return}for(i=0;i<l.length;i++)w.appendChild(postEl(l[i]))}
sa.onclick=function(){FM="f";sv("fm","f");paint()};sb.onclick=function(){FM="a";sv("fm","a");paint()};
composer(b);seg.appendChild(sa);seg.appendChild(sb);b.appendChild(seg);b.appendChild(w);w.appendChild(el("div","pad","..."));
loadFeed(false,paint)}
/* profili */
function openProf(id){PG={k:"p",id:id};document.body.className="pg";renderPg()}
function loadProfPosts(id,cb){var n=3,a=[],b=[],c=[],d;
d=function(){n--;if(n)return;var m=a.concat(b),au=[],sn={},i;m.sort(byT);c.sort(byT);for(i=0;i<c.length;i++)if(!P[c[i].u]&&!sn[c[i].u]){sn[c[i].u]=1;au.push(c[i].u)}
fillP(au,function(){cb(m.slice(0,30),c.slice(0,30))})};
runQ(id,"p",null,true,20,"p",function(r){a=r;d()});
runQ(null,"pub",fl("u","EQUAL",id),false,40,"pub",function(r){b=r;d()});
runQ(null,"pub",fl("lk","ARRAY_CONTAINS",id),false,30,"pub",function(r){c=r;d()})}
function renderPg(){var g=$("pg");g.innerHTML="";if(!PG)return;g.appendChild(el("div","pad","..."));
if(PG.k=="f"){loadFeed(false,function(){if(!PG||PG.k!="f")return;g.innerHTML="";sec(g,"Post");feedView(g)});return}
var id=PG.id;getProf(id,function(p){loadProfPosts(id,function(ps,lks){if(!PG||PG.id!=id)return;g.innerHTML="";profView(g,id,p,ps,lks)})})}
function profView(g,id,p,ps,lks){var own=id==S.u,c=el("div","card"),a=av(p.n,id),inf=el("div","pi"),L=lk(p.l),i,l,x,f,ab,w;
a.className+=" big";c.appendChild(a);inf.appendChild(el("h2","",p.n));inf.appendChild(bd(id));
inf.appendChild(el("span","wk",wcn(id)+" messaggi questa settimana"));if(p.s)inf.appendChild(el("div","bio",p.s));
w=el("div","sm");
if(own)w.appendChild(el("button","btn g","Modifica profilo",function(){editView(g,p)}));
else{f=ffr(id);if(f&&f.s=="a")ab=el("button","btn","Messaggio",(function(q){return function(){openChat(q)}})(f));else if(f&&f.s=="o")ab=el("span","wk","Richiesta di amicizia inviata");
else if(f&&f.s=="i")ab=el("button","btn","Conferma amicizia",(function(q){return function(){acc(q)}})(f));
else ab=el("button","btn","Aggiungi agli amici",function(){addById(id,p.n,function(t){if(t)alert(t)})});w.appendChild(ab)}
inf.appendChild(w);c.appendChild(inf);
if(L.length||own){l=el("div","lks");l.appendChild(el("div","lh","Link"));
for(i=0;i<L.length;i++){x=el("a","lnk",L[i][0]);x.href=L[i][1];x.target="_blank";x.rel="noopener nofollow";l.appendChild(x);l.appendChild(el("br"))}
if(!L.length)l.appendChild(el("div","pad","Nessun link. Aggiungili da Modifica profilo."));c.appendChild(l)}
g.appendChild(c);sec(g,"Bacheca di "+p.n);if(own)composer(g);
if(!ps.length)g.appendChild(el("div","pad","Nessun post visibile."));for(i=0;i<ps.length;i++)g.appendChild(postEl(ps[i]));
sec(g,"Post pubblici a cui "+(own?"hai":"ha")+" messo mi piace");
if(!lks.length)g.appendChild(el("div","pad","Nessun mi piace pubblico."));for(i=0;i<lks.length;i++)g.appendChild(postEl(lks[i]))}
function editView(g,p){g.innerHTML="";var c=el("div","card"),sel=p.a?String(p.a).split("|"):[],ai=sel.length&&sel[0]!==""?parseInt(sel[0],10):-1,ci=parseInt(sel[1],10)||0,ph=p.ph||"",
pv=el("div","pv"),gr=el("div","grid"),cr=el("div","grid"),bio=el("input"),rows=[],L=lk(p.l),i,r,m=el("div","pad"),pb=el("div","pbtn");
function paint(){var k,t;pv.innerHTML="";t=av(p.n,null);if(ph)setPh(t,ph);else if(ai>=0){t.textContent=AV[ai];t.style.background=PC[ci];t.className="av em"}t.className+=" big";pv.appendChild(t);
gr.innerHTML="";for(k=0;k<AV.length;k++)gr.appendChild(el("a","pk"+(!ph&&k==ai?" on":""),AV[k],(function(q){return function(){ai=q;ph="";paint()}})(k)));
cr.innerHTML="";for(k=0;k<PC.length;k++){t=el("a","pk sw"+(k==ci?" on":""),"",(function(q){return function(){ci=q;paint()}})(k));t.style.background=PC[k];cr.appendChild(t)}}
c.appendChild(el("h2","","Modifica profilo"));c.appendChild(el("div","lh","Icona del profilo"));c.appendChild(pv);
if(canImg()){pb.appendChild(el("a","cb","📷 Scegli una foto",function(){pickImg(128,true,24000,function(d){ph=d;paint()})}));pb.appendChild(el("a","cb","Rimuovi foto",function(){ph="";paint()}));c.appendChild(pb)}
c.appendChild(el("div","lh","Oppure scegli un'icona"));c.appendChild(gr);c.appendChild(el("div","lh","Colore"));c.appendChild(cr);
c.appendChild(el("div","lh","Frase sotto il nome (max 140)"));bio.maxLength=140;bio.value=p.s||"";c.appendChild(bio);
c.appendChild(el("div","lh","Link sotto al profilo (max 5)"));
for(i=0;i<5;i++){r=el("div","lr");r.t=el("input","l1");r.u=el("input","l2");r.t.maxLength=24;r.u.maxLength=80;r.t.placeholder="Titolo";r.u.placeholder="https://...";
if(L[i]){r.t.value=L[i][0];r.u.value=L[i][1]}r.appendChild(r.t);r.appendChild(r.u);c.appendChild(r);rows.push(r)}
c.appendChild(m);
c.appendChild(el("button","btn","Salva",function(){var out=[],k,t,u;
for(k=0;k<rows.length;k++){t=trim(rows[k].t.value);u=trim(rows[k].u.value);if(!u)continue;
if(!/^https?:\/\//i.test(u)){if(/^[a-z]+:/i.test(u)){m.textContent="Link non valido: "+u.substring(0,20);return}u="http://"+u}
if(u.length>80){m.textContent="Un link è troppo lungo (max 80 caratteri).";return}
if(!t)t=u.replace(/^https?:\/\//i,"");out.push(t.replace(/[\t\n|]/g," ").substring(0,24)+"\t"+u)}
var a=ai<0?"":ai+"|"+ci,l=out.join("\n"),s=trim(bio.value).substring(0,140);m.textContent="...";
api("PATCH","/users/"+S.u+mk(["a","l","s","ph"]),F({a:a,l:l,s:s,ph:ph}),function(st){if(st!=200){m.textContent="Impossibile salvare. Hai pubblicato le nuove regole Firestore?";return}
P[S.u].a=a;P[S.u].l=l;P[S.u].s=s;P[S.u].ph=ph;paintMe();frT=0;fdT=0;renderPg()})}));
c.appendChild(document.createTextNode(" "));c.appendChild(el("button","btn g","Annulla",function(){renderPg()}));
g.appendChild(c);paint()}
/* chat */
function openChat(f){cur=cid(f.id);oth=f.id;last=0;rdy=false;$("msgs").innerHTML="";$("stk").className="hid";$("ct").textContent=f.n;document.body.className="ch";lastAct=Date.now();pull(true)}
function pull(first){if(!cur)return;var id=cur,q={structuredQuery:{from:[{collectionId:"m"}],orderBy:[{field:{fieldPath:"t"},direction:first?"DESCENDING":"ASCENDING"}],limit:first?LIM:40}};
if(!first)q.structuredQuery.where={fieldFilter:{field:{fieldPath:"t"},op:"GREATER_THAN",value:{integerValue:""+last}}};
api("POST","/chats/"+id+":runQuery",q,function(s,j){if(s!=200||!j||id!=cur)return;var r=[],i;
for(i=0;i<j.length;i++)if(j[i].document)r.push(j[i].document);if(first)r.reverse();
for(i=0;i<r.length;i++)add(V(r[i],"n"),V(r[i],"x"),V(r[i],"t"),V(r[i],"u"));if(r.length)lastAct=Date.now();rdy=true})}
function add(n,x,t,u){if(t>last)last=t;var d=el("div","m"),b=el("div","t"),m=$("msgs"),down=m.scrollTop+m.clientHeight>=m.scrollHeight-40,sm=/^§(\d+)$/.exec(x);
d.appendChild(av(n,u));b.appendChild(el("b","",n));b.appendChild(bd(u));
if(sm&&STK[parseInt(sm[1],10)])b.appendChild(el("div","bigstk",STK[parseInt(sm[1],10)]));else b.appendChild(document.createTextNode(" "+x));
b.appendChild(el("i","",tm(t)));d.appendChild(b);m.appendChild(d);if(down||n==S.n)m.scrollTop=m.scrollHeight}
function bump(){var w=wkId(),me=P[S.u];if(!me)return;var c=(me.wk==w?me.wc:0)+1;me.wk=w;me.wc=c;
api("PATCH","/users/"+S.u+mk(["wk","wc"]),F({wk:w,wc:c}))}
function send(raw){var fromBox=typeof raw!="string",x=fromBox?trim($("msg").value):raw,now=Date.now(),k="d"+new Date().toDateString(),c=parseInt(gv(k)||0,10);
if(!x||!cur||now-lastSend<2000)return;if(c>=MAXDAY){alert("Limite giornaliero di messaggi raggiunto. Riprova domani.");return}
lastSend=now;sv(k,""+(c+1));if(fromBox)$("msg").value="";$("stk").className="hid";var id=cur;
api("POST","/chats/"+id+"/m",F({u:S.u,n:S.n,x:x.substring(0,200),t:now}),function(s){if(s==200){lastAct=Date.now();bump();pull(false)}else alert("Messaggio non inviato. Controlla che siate ancora amici e che nessuno abbia bloccato l'altro.")})}
function tick(){var w=Date.now()-lastAct>180000?(LITE?60000:30000):(LITE?15000:8000);setTimeout(function(){if(document.hidden!==true&&cur&&rdy)pull(false);tick()},w)}
try{document.addEventListener("visibilitychange",function(){if(document.hidden===false){lastAct=Date.now();if(cur&&rdy)pull(false)}},false)}catch(e){}
/* eventi */
$("bi").onclick=function(){go("signInWithPassword")};$("br").onclick=function(){go("signUp")};
$("pw").onkeydown=function(e){if((e||window.event).keyCode==13)go("signInWithPassword")};
$("sd").onclick=function(){send()};$("msg").onkeydown=function(e){if((e||window.event).keyCode==13)send()};$("rf").onclick=function(){pull(false)};
$("tc").onclick=function(){setTab("c")};$("tf").onclick=function(){setTab("f")};$("to").onclick=function(){setTab("o")};
$("mp").onclick=function(){openProf(S.u)};
$("out").onclick=logout;$("back").onclick=function(){document.body.className="";cur=null;oth=null};
var qt=/[?&]tab=([cfo])/.exec(location.search);if(qt)tab=qt[1];
showInst();
try{var s0=gv("s");if(s0){S=JSON.parse(s0);start()}}catch(e){}
if(!LITE&&"serviceWorker" in navigator&&location.protocol.indexOf("http")==0)navigator.serviceWorker.register("sw.js");
})();
