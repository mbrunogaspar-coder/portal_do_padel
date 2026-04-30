import { LayoutGrid, CalendarDays, Users, Bell, Settings, Check, X, Plus, ArrowLeft, Search, Lock, Pencil, Trash2, Mail, Phone, TrendingUp, BarChart2, MapPin, Trophy, ArrowRight, LogOut, UserCircle2, Home } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";

// ─── PALETTE (no per-club colors, pure monochrome) ────────────────────────────
const C = {
  cream:  "#F4F0E8", cream2: "#EBE7DF", cream3: "#DDD9D0",
  white:  "#FFFFFF",
  ink:    "#141210", ink2: "#2E2B27", ink3: "#3D3A35",
  mid:    "#7A766F", faint: "#B5B0A8",
  bd:     "rgba(0,0,0,0.09)", bd2: "rgba(0,0,0,0.15)", bd3: "rgba(0,0,0,0.22)",
  dark:   "#0E0D0B", dark2: "#171613", dark3: "#201F1C", dark4: "#2A2926",
  dbd:    "rgba(255,255,255,0.07)", dbd2: "rgba(255,255,255,0.12)",
  dtx:    "#EDE9E1", dtx2: "#8A867F", dtx3: "#3D3A35",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const REGIONS = [
  {id:"all",label:"Todo o País",icon:"🇵🇹"},
  {id:"norte",label:"Norte",icon:"🏔"},
  {id:"centro",label:"Centro",icon:"🌲"},
  {id:"lvt",label:"Lisboa",icon:"🌉"},
  {id:"alent",label:"Alentejo",icon:"🌾"},
  {id:"alg",label:"Algarve",icon:"🏖"},
  {id:"acores",label:"Açores",icon:"🌋"},
  {id:"madeira",label:"Madeira",icon:"🌺"},
];
const CLUBS = [
  {id:1,name:"Padel Arena",phone:"+351 210 000 001",amenities:["parking","showers"],city:"Lisboa",district:"Lisboa",region:"lvt",courts:4,indoor:2,outdoor:2,priceDay:3,priceNight:4,nightFrom:18,rating:4.8,reviews:124,tags:["Indoor","Balneários","Estac."],open:"08–22h",desc:"4 campos premium no centro de Lisboa. Balneários equipados e estacionamento privativo."},
  {id:2,name:"Norte Padel",phone:"+351 220 000 001",amenities:["academy","shop"],city:"Porto",district:"Porto",region:"norte",courts:6,indoor:4,outdoor:2,priceDay:2.5,priceNight:3.5,nightFrom:18,rating:4.9,reviews:203,tags:["Indoor","Aulas","Loja"],open:"07–23h",desc:"O maior clube de padel do Porto. Academia com treinadores certificados e loja especializada."},
  {id:3,name:"Algarve Padel",phone:"+351 289 000 001",amenities:["pool","bar","lights"],city:"Faro",district:"Faro",region:"alg",courts:8,indoor:2,outdoor:6,priceDay:3,priceNight:5,nightFrom:18,rating:4.7,reviews:89,tags:["Outdoor","Piscina","Bar"],open:"08–21h",desc:"Clube com vista para a Ria Formosa. 6 campos outdoor iluminados e bar/restaurante."},
  {id:4,name:"Setúbal Padel",phone:"+351 265 000 001",amenities:["parking"],city:"Setúbal",district:"Setúbal",region:"lvt",courts:3,indoor:3,outdoor:0,priceDay:2.5,priceNight:3.5,nightFrom:18,rating:4.5,reviews:67,tags:["Indoor","Estac."],open:"09–22h",desc:"Clube familiar com 3 campos cobertos. Ideal para jogar durante todo o ano."},
  {id:5,name:"Coimbra Padel",phone:"+351 239 000 001",amenities:["academy","showers"],city:"Coimbra",district:"Coimbra",region:"centro",courts:4,indoor:2,outdoor:2,priceDay:2,priceNight:3,nightFrom:18,rating:4.6,reviews:112,tags:["Indoor","Aulas"],open:"08–22h",desc:"Academia universitária com preços acessíveis. Programas para todos os níveis."},
  {id:6,name:"Braga Padel Sport",phone:"+351 253 000 001",amenities:["bar","lights"],city:"Braga",district:"Braga",region:"norte",courts:5,indoor:3,outdoor:2,priceDay:2.5,priceNight:3.5,nightFrom:18,rating:4.8,reviews:78,tags:["Indoor","Torneios","Bar"],open:"07:30–23h",desc:"Calendário activo de torneios e liga interna mensal para todos os níveis."},
  {id:7,name:"Évora Padel",phone:"+351 266 000 001",amenities:["academy"],city:"Évora",district:"Évora",region:"alent",courts:2,indoor:2,outdoor:0,priceDay:2,priceNight:3,nightFrom:18,rating:4.4,reviews:34,tags:["Indoor","Aulas"],open:"09–21h",desc:"O único clube de padel indoor do Alentejo Central. Moderno e acolhedor."},
  {id:8,name:"Funchal Padel",phone:"+351 291 000 001",amenities:["bar","lights"],city:"Funchal",district:"Funchal",region:"madeira",courts:3,indoor:1,outdoor:2,priceDay:3,priceNight:4.5,nightFrom:18,rating:4.9,reviews:56,tags:["Outdoor","Vista Mar","Bar"],open:"08–20h",desc:"Vista única para o Oceano Atlântico. Campos outdoor iluminados e bar com esplanada."},
];
const BLOCK_CAT = {
  lessons:     {label:"Aulas"},
  maintenance: {label:"Manutenção"},
  event:       {label:"Evento"},
  other:       {label:"Outro"},
};

const AMENITIES = [
  {id:"parking",    label:"Estacionamento", icon:"🚗"},
  {id:"pool",       label:"Piscina",        icon:"🏊"},
  {id:"bar",        label:"Bar / Restaurante", icon:"🍺"},
  {id:"showers",    label:"Balneários",     icon:"🚿"},
  {id:"shop",       label:"Loja",           icon:"🛍"},
  {id:"academy",    label:"Aulas",          icon:"🎓"},
  {id:"lights",     label:"Iluminação",     icon:"💡"},
  {id:"accessible", label:"Acessibilidade", icon:"♿"},
];

const PAY = [{id:"mbway",label:"MB Way",icon:"📱"},{id:"multi",label:"Multibanco",icon:"🏧"},{id:"card",label:"Cartão",icon:"💳"},{id:"local",label:"No Local",icon:"💶"}];
const WD_SHORT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

// ─── TIME ─────────────────────────────────────────────────────────────────────
const fmt    = (d) => d.toISOString().split("T")[0];
const todayD = new Date();
todayD.setHours(12, 0, 0, 0);
const TODAY  = fmt(todayD);
const PAST7  = Array.from({length:7},(_,i)=>{const d=new Date(todayD);d.setDate(todayD.getDate()-6+i);return fmt(d);});
const FDAYS  = Array.from({length:14},(_,i)=>{const d=new Date(todayD.getTime()+i*86400000);return{date:fmt(d),wd:d.toLocaleDateString("pt-PT",{weekday:"short"}).replace(".","").toUpperCase(),day:d.getDate(),mon:d.toLocaleDateString("pt-PT",{month:"short"}).replace(".","").toUpperCase(),weekday:d.getDay(),isToday:i===0};});
const SLOTS  = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];
const genSlots = (f,t)=>{const s=[];for(let h=parseInt(f);h<parseInt(t);h++){s.push(`${String(h).padStart(2,"0")}:00`);s.push(`${String(h).padStart(2,"0")}:30`);}return s;};
const durLbl = (m)=>m===60?"1h":m===90?"1h30":"2h";
const durH   = (m)=>m/60;
const addMins = (t,m)=>{ const [h,min]=t.split(':').map(Number); const tot=h*60+min+m; return `${String(Math.floor(tot/60)).padStart(2,'0')}:${String(tot%60).padStart(2,'0')}`; };
const isNt   = (t,nf=18)=>parseInt(t)>=nf;
const slotFit= (t,d,to)=>{ const [eh,em]=addMins(t,d).split(':').map(Number); const [th,tm]=to.split(':').length>1?to.split(':').map(Number):[parseInt(to),0]; return eh<th||(eh===th&&em<=tm); };
const occS   = (t,d)=>{ const s=[]; let cur=t.includes(':')?t:t+':00'; const end=addMins(cur,d); while(cur<end){ s.push(cur); cur=addMins(cur,30); } return s; };
const fmtLong= (ds)=>new Date(ds+"T12:00:00").toLocaleDateString("pt-PT",{weekday:"long",day:"numeric",month:"long"});
const fmtSh  = (ds)=>new Date(ds+"T12:00:00").toLocaleDateString("pt-PT",{day:"2-digit",month:"2-digit"});
const fmtFull= (ds)=>new Date(ds+"T12:00:00").toLocaleDateString("pt-PT",{day:"numeric",month:"long",year:"numeric"});
const getWD  = (ds)=>new Date(ds+"T12:00:00").getDay();
const genRef = ()=>"PDP-"+Math.random().toString(36).slice(-5).toUpperCase();
const ini    = (n)=>n.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
const clvl   = (n)=>n>=10?"Pro":n>=4?"Regular":"Novo";

// ─── BLOCK LOGIC ─────────────────────────────────────────────────────────────
const blkApply = (b,cid,date)=>{const ok=b.courtIds==="all"||b.courtIds.includes(cid);if(!ok)return false;return b.type==="single"?b.date===date:b.weekdays.includes(getWD(date));};
const isBlocked= (cid,date,t,d,blocks)=>{const need=new Set(occS(t,d));return blocks.some(b=>blkApply(b,cid,date)&&Array.from(need).some(s=>parseInt(s)>=parseInt(b.startTime)&&parseInt(s)<parseInt(b.endTime)));};
const ctFree   = (cid,date,t,d,bks,blks=[])=>{if(isBlocked(cid,date,t,d,blks))return false;const need=new Set(occS(t,d));return !bks.some(b=>b.courtId===cid&&b.date===date&&(b.status==="confirmed"||b.status==="pending")&&occS(b.time,b.dur||60).some(s=>need.has(s)));};
const blkDate  = (blocks,date)=>blocks.filter(b=>b.type==="single"?b.date===date:b.weekdays.includes(getWD(date)));

// ─── SEED ─────────────────────────────────────────────────────────────────────
const mkB=(id,em,nm,cid,dt,tm,st,pay,dur=60)=>({id,contactEmail:em,contactName:nm,courtId:cid,date:dt,time:tm,dur,status:st,pay,ref:genRef(),createdAt:dt+"T09:00:00"});
const INIT_B=[mkB(101,"sofia@m.pt","Sofia Martins",1,"2026-04-19","10:00","confirmed","mbway"),mkB(102,"miguel@m.pt","Miguel Sousa",2,"2026-04-20","14:00","confirmed","card",90),mkB(103,"joao@m.pt","João Ferreira",1,"2026-04-21","09:00","confirmed","mbway"),mkB(104,"carla@m.pt","Carla Lopes",3,"2026-04-21","17:00","confirmed","local"),mkB(105,"sofia@m.pt","Sofia Martins",1,"2026-04-22","10:00","confirmed","mbway"),mkB(106,"ana@m.pt","Ana Costa",4,"2026-04-22","11:00","confirmed","multi",90),mkB(107,"miguel@m.pt","Miguel Sousa",2,"2026-04-23","15:00","confirmed","card"),mkB(108,"joao@m.pt","João Ferreira",3,"2026-04-23","19:00","confirmed","mbway"),mkB(109,"carla@m.pt","Carla Lopes",1,"2026-04-24","09:00","confirmed","local",120),mkB(110,"sofia@m.pt","Sofia Martins",2,"2026-04-24","18:00","confirmed","mbway"),mkB(201,"sofia@m.pt","Sofia Martins",1,"2026-04-25","10:00","confirmed","mbway"),mkB(202,"miguel@m.pt","Miguel Sousa",2,"2026-04-25","11:00","confirmed","card",90),mkB(203,"joao@m.pt","João Ferreira",1,"2026-04-25","14:00","pending","mbway"),mkB(204,"carla@m.pt","Carla Lopes",3,"2026-04-25","16:00","pending","local"),mkB(301,"ana@m.pt","Ana Costa",2,"2026-04-26","09:00","confirmed","multi"),mkB(302,"sofia@m.pt","Sofia Martins",4,"2026-04-26","17:00","pending","mbway",90)];
const INIT_C=[{id:1,name:"Sofia Martins",email:"sofia@m.pt",phone:"+351 912 345 678",since:"2024-01-15",notes:"Prefere campos interiores. Vem às segundas e quartas."},{id:2,name:"João Ferreira",email:"joao@m.pt",phone:"+351 932 111 222",since:"2024-02-20",notes:""},{id:3,name:"Miguel Sousa",email:"miguel@m.pt",phone:"+351 917 555 666",since:"2023-11-05",notes:"Cliente antigo. Joga ao fim de semana."},{id:4,name:"Carla Lopes",email:"carla@m.pt",phone:"+351 936 777 888",since:"2024-04-01",notes:""},{id:5,name:"Ana Costa",email:"ana@m.pt",phone:"+351 962 333 444",since:"2024-03-10",notes:"Iniciante. Desconto nas primeiras reservas."}];
const INIT_BLOCKS=[{id:1,type:"recurring",weekdays:[1,3,5],courtIds:[1,2],startTime:"09",endTime:"11",reason:"Aulas de Padel Adultos",category:"lessons"},{id:2,type:"recurring",weekdays:[6],courtIds:"all",startTime:"08",endTime:"10",reason:"Manutenção Semanal",category:"maintenance"},{id:3,type:"single",date:"2026-04-28",courtIds:[3,4],startTime:"14",endTime:"18",reason:"Torneio Interno",category:"event"}];
const INIT_N=[{id:1,type:"booking",msg:"João Ferreira reservou Court 1 · Hoje 14:00",time:"Há 2h",read:false},{id:2,type:"booking",msg:"Carla Lopes reservou Court 3 · Hoje 16:00",time:"Há 3h",read:false},{id:3,type:"client",msg:"Nova cliente: Ana Costa via portal",time:"Há 1 dia",read:true}];
const DEF_CLUB={amenities:["showers","parking"],name:"Padel Arena",tagline:"O teu campo. À tua hora.",priceDay:3,priceNight:4,nightFrom:"18",openFrom:"08",openTo:"22",durations:[60,90,120],playersPerCourt:4,courts:[{id:1,name:"Court 1",indoor:true,active:true},{id:2,name:"Court 2",indoor:true,active:true},{id:3,name:"Court 3",indoor:false,active:true},{id:4,name:"Court 4",indoor:false,active:true}],requireApproval:true,allowCancel:true,cancelHours:24,showOccupancy:true,advanceDays:14,phone:"+351 210 000 000",email:"info@padelarena.pt",address:"Rua do Padel 123, Lisboa"};
const INIT_T=[
  {id:9001,name:"Torneio Social Padel Arena",format:"normal",startDate:TODAY,endDate:TODAY,courtIds:[1,2,3,4],slotMinutes:90,groupSize:4,advanceCount:2,superTb:true,status:"open",schedule:[],categories:[{id:"M3",g:"M",groups:[],bracket:[],pairs:[{id:1,p1:"Miguel Sousa",p2:"João Ferreira",contact:"miguel@m.pt",status:"approved"},{id:2,p1:"Pedro Lima",p2:"Tiago Rocha",contact:"912000001",status:"approved"},{id:3,p1:"Rui Alves",p2:"Nuno Matos",contact:"913000002",status:"approved"},{id:4,p1:"Carlos Neves",p2:"André Lopes",contact:"914000003",status:"pending"}]},{id:"MX4",g:"MX",groups:[],bracket:[],pairs:[{id:5,p1:"Sofia Martins",p2:"Miguel Sousa",contact:"sofia@m.pt",status:"approved"},{id:6,p1:"Ana Costa",p2:"João Ferreira",contact:"ana@m.pt",status:"pending"}]}]},
];

// ─── PHOSPHOR ICONS WRAPPER ───────────────────────────────────────────────────
const ICON_MAP = {
  dash:  LayoutGrid, cal: CalendarDays, usr: Users, bell: Bell, set: Settings,
  ok:    Check, x: X, plus: Plus, back: ArrowLeft, srch: Search,
  lock:  Lock, edit: Pencil, trash: Trash2, mail: Mail, phone: Phone,
  trn:   TrendingUp, pct: BarChart2, map: MapPin, star: Trophy, note: Phone,
  arrow: ArrowRight, signout: LogOut, profile: UserCircle2, home: Home,
};
const I = ({n, s=18, c="currentColor"}) => {
  const Ic = ICON_MAP[n];
  if(!Ic) return null;
  return <Ic size={s} color={c} strokeWidth={1.75}/>;
};
const Spin=()=><svg style={{animation:"ptSpin .7s linear infinite",display:"inline-block",verticalAlign:"middle"}} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>;

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
@keyframes ptSpin{to{transform:rotate(360deg)}}
@keyframes ptUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes ptIn{from{opacity:0}to{opacity:1}}
@keyframes ptSlide{from{transform:translateY(36px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes ptRingPop{from{transform:scale(.3);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes ptRingPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.07);opacity:.2}}
@keyframes ptCheckPop{from{transform:scale(0)}to{transform:scale(1)}}
@keyframes ptPulse{0%,100%{opacity:1}50%{opacity:.3}}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100%;background:#F4F0E8}
body{color:#141210;font-family:'DM Sans',system-ui,sans-serif;font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.15);border-radius:99px}

/* ── TOP MODESWITCH ── */
.pt-top-wrap{position:sticky;top:0;z-index:200}
.pt-club-strip{min-height:50px;background:#141210;color:#F4F0E8;display:flex;align-items:center;justify-content:center;gap:18px;padding:9px 18px;text-align:center;border-bottom:1px solid rgba(244,240,232,.12);box-shadow:0 12px 30px rgba(0,0,0,.12)}
.pt-club-strip-copy{font-size:14px;font-weight:800;color:#F4F0E8;letter-spacing:-.15px;line-height:1.1}
.pt-club-strip-copy small{display:block;margin-top:2px;font-size:11px;font-weight:500;color:rgba(244,240,232,.62);letter-spacing:0}
.pt-club-strip-btn{border:1px solid rgba(244,240,232,.34);background:#F4F0E8;color:#141210;border-radius:10px;padding:10px 20px;font-size:13px;font-weight:900;cursor:pointer;font-family:inherit;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,.22);transition:transform .15s ease,box-shadow .15s ease}
.pt-club-strip-btn:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(0,0,0,.28)}
.pt-top{background:rgba(244,240,232,0.95);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom:1px solid rgba(0,0,0,0.09);height:52px;display:flex;align-items:center;padding:0 18px;gap:12px}
.pt-top-brand{display:flex;align-items:center;gap:9px;flex:1;min-width:0}
.pt-top-mark{width:30px;height:30px;border-radius:8px;background:#141210;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;color:#F4F0E8;flex-shrink:0;letter-spacing:-.3px}
.pt-top-name{font-weight:800;font-size:13px;color:#141210;letter-spacing:-.3px;line-height:1;display:block}
.pt-top-sub{font-size:9px;color:#B5B0A8;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;display:block}
.pt-modes{display:flex;background:rgba(0,0,0,0.06);border-radius:8px;padding:3px;gap:2px;flex-shrink:0}
.pt-mode{padding:5px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;color:#7A766F;transition:all .15s;white-space:nowrap;border:none;background:none;font-family:inherit;-webkit-tap-highlight-color:transparent}
.pt-mode.on{background:#141210;color:#F4F0E8}
.pt-club-mode{background:transparent!important;color:#7A766F!important;padding:5px 9px}
.pt-login-btn{font-size:11px;font-weight:700;padding:7px 14px;border-radius:7px;background:#141210;color:#F4F0E8;border:none;cursor:pointer;font-family:inherit;flex-shrink:0}

/* ── DISCOVERY ── */
.pt-page{background:#F4F0E8;min-height:calc(100vh - 52px)}

.pt-hero{padding:88px 20px 72px;text-align:center;position:relative;overflow:hidden;background:linear-gradient(180deg,#EEEBE3 0%,#F4F0E8 60%)}
.pt-hero::before{display:none}
.pt-eyebrow{display:inline-flex;align-items:center;gap:7px;background:#141210;color:#F4F0E8;border-radius:99px;padding:5px 14px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:20px;animation:ptUp .5s ease both}
.pt-edot{width:5px;height:5px;border-radius:50%;background:#F4F0E8;flex-shrink:0;animation:ptPulse 2s infinite}
.pt-h1{font-weight:800;font-size:clamp(42px,11vw,96px);line-height:.88;letter-spacing:-3px;color:#141210;margin-bottom:22px;animation:ptUp .5s .06s ease both;font-family:"DM Serif Display","DM Sans",system-ui,sans-serif}
.pt-h1 em{font-style:normal;color:#141210;text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:3px}
.pt-sub{font-size:16px;color:#7A766F;max-width:480px;margin:0 auto 40px;line-height:1.7;font-weight:400;animation:ptUp .5s .1s ease both}

.pt-search{max-width:520px;margin:0 auto 48px;background:#FFFFFF;border:1.5px solid rgba(0,0,0,0.12);border-radius:14px;display:flex;align-items:center;box-shadow:0 2px 16px rgba(0,0,0,0.07);animation:ptUp .5s .14s ease both;overflow:hidden;transition:border-color .2s}
.pt-search:focus-within{border-color:rgba(0,0,0,0.28)}
.pt-search-ic{padding:0 11px 0 15px;color:#B5B0A8;flex-shrink:0}
.pt-si{flex:1;border:none;outline:none;font-size:14px;padding:14px 0;background:none;color:#141210;min-width:0;font-family:inherit}
.pt-si::placeholder{color:#B5B0A8}
.pt-sdiv{width:1px;height:24px;background:rgba(0,0,0,0.09);flex-shrink:0}
.pt-sbtn{margin:5px;padding:10px 18px;border-radius:10px;background:#141210;color:#F4F0E8;border:none;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:inherit;-webkit-tap-highlight-color:transparent}

.pt-stats{display:flex;justify-content:center;max-width:640px;margin:20px auto 22px;animation:ptUp .5s .18s ease both}
.pt-stat{flex:1;text-align:center;padding:18px 8px;position:relative}
.pt-stat::after{content:'';position:absolute;right:0;top:20%;height:60%;width:1px;background:rgba(0,0,0,0.09)}
.pt-stat:last-child::after{display:none}
.pt-sv{font-weight:800;font-size:32px;color:#141210;letter-spacing:-1.5px;line-height:1;font-family:"DM Serif Display","DM Sans",system-ui,sans-serif}
.pt-sl{font-size:11px;color:#7A766F;margin-top:5px;letter-spacing:.5px;text-transform:uppercase;font-weight:600}

.pt-sec{padding:42px 18px 0;max-width:1040px;margin:0 auto}
.pt-sech{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:8px}
.pt-sect{font-weight:800;font-size:20px;letter-spacing:-.5px;color:#141210}
.pt-secc{font-size:12px;color:#7A766F}

/* REGION PILLS */
.pt-rgs{display:flex;gap:7px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:6px;margin-bottom:34px;scrollbar-width:none}
.pt-rgs::-webkit-scrollbar{display:none}
.pt-rg{flex-shrink:0;display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:99px;border:1.5px solid rgba(0,0,0,0.12);background:#FFFFFF;cursor:pointer;font-size:12px;font-weight:600;color:#7A766F;white-space:nowrap;-webkit-tap-highlight-color:transparent;transition:all .15s}
.pt-rg:hover{border-color:rgba(0,0,0,0.25);color:#141210}
.pt-rg.on{background:#141210;color:#F4F0E8;border-color:#141210}
.pt-rgc{font-size:10px;opacity:.55}

/* CLUB CARDS */
.pt-clubs{padding:0 18px 80px;max-width:1040px;margin:0 auto}
.pt-grid{display:grid;grid-template-columns:1fr;gap:12px}
@media(min-width:580px){.pt-grid{grid-template-columns:1fr 1fr}}
@media(min-width:860px){.pt-grid{grid-template-columns:1fr 1fr 1fr}}

.pt-card{background:#FFFFFF;border:1px solid rgba(0,0,0,0.08);border-radius:16px;overflow:hidden;cursor:pointer;transition:transform .22s cubic-bezier(.25,.46,.45,.94),box-shadow .22s cubic-bezier(.25,.46,.45,.94);-webkit-tap-highlight-color:transparent;animation:ptUp .4s ease both;box-shadow:0 2px 8px rgba(0,0,0,.04);display:flex;flex-direction:column}
.pt-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,0.09)}
.pt-cbar{height:3px;background:#141210}
.pt-ctop{padding:18px 18px 10px;display:flex;gap:12px;align-items:flex-start}
.pt-cav{width:46px;height:46px;border-radius:11px;background:#141210;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#F4F0E8;flex-shrink:0}
.pt-cname{font-weight:800;font-size:16px;color:#141210;letter-spacing:-.3px;line-height:1.1}
.pt-cloc{font-size:12px;color:#7A766F;margin-top:3px;display:flex;align-items:center;gap:3px}
.pt-crat{display:flex;align-items:center;gap:4px;margin-top:4px}
.pt-cstars{font-size:11px;color:#141210}
.pt-crv{font-size:12px;font-weight:700;color:#141210}
.pt-crc{font-size:11px;color:#B5B0A8}

.pt-cdesc{padding:0 16px 12px;font-size:12px;color:#7A766F;line-height:1.65}
.pt-cstats{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid rgba(0,0,0,0.07);border-bottom:1px solid rgba(0,0,0,0.07)}
.pt-cs{padding:10px 12px;position:relative}
.pt-cs::after{content:'';position:absolute;right:0;top:18%;height:64%;width:1px;background:rgba(0,0,0,0.07)}
.pt-cs:last-child::after{display:none}
.pt-csv{font-weight:800;font-size:17px;color:#141210;letter-spacing:-.3px;line-height:1}
.pt-csl{font-size:9px;color:#B5B0A8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
.pt-ctags{padding:10px 16px;display:flex;gap:6px;flex-wrap:wrap}
.pt-ctag{font-size:11px;font-weight:600;padding:3px 9px;border-radius:99px;background:#F4F0E8;color:#7A766F}
.pt-cfoot{padding:12px 16px;display:flex;align-items:center;justify-content:space-between;background:#F9F7F3;margin-top:auto}
.pt-cprice-v{font-weight:800;font-size:18px;color:#141210;letter-spacing:-.3px}
.pt-cprice-r{font-size:12px;color:#B5B0A8}
.pt-ccta{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:9px;background:#141210;color:#F4F0E8;border:none;font-size:12px;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent;font-family:inherit}
.pt-empty{padding:56px 24px;text-align:center}
.pt-empty-icon{font-size:42px;display:block;margin-bottom:12px}
.pt-empty-t{font-weight:800;font-size:18px;color:#141210;margin-bottom:6px;letter-spacing:-.3px}
.pt-empty-s{font-size:13px;color:#7A766F}
.pt-empty-btn{margin-top:14px;padding:9px 20px;border-radius:9px;background:#141210;color:#F4F0E8;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit}

/* ── PORTAL (athlete booking) ── */
.pt-portal{background:#F4F0E8;min-height:calc(100vh - 52px)}

.pt-pnav{position:sticky;top:52px;z-index:50;background:rgba(244,240,232,0.95);backdrop-filter:blur(18px);border-bottom:1px solid rgba(0,0,0,0.09);padding:0 18px;height:48px;display:flex;align-items:center;gap:10px}
.pt-pback{display:flex;align-items:center;gap:6px;color:#7A766F;cursor:pointer;font-size:12px;font-weight:600;padding:6px 10px;border-radius:8px;margin-left:-10px;border:none;background:none;font-family:inherit;-webkit-tap-highlight-color:transparent}
.pt-pback:hover{background:rgba(0,0,0,0.05);color:#141210}
.pt-pname{font-weight:800;font-size:14px;color:#141210;flex:1;letter-spacing:-.2px}

.pt-phero{padding:48px 20px 36px;border-bottom:1px solid rgba(0,0,0,0.08);background:linear-gradient(180deg,#EEEBE3 0%,#F4F0E8 100%);position:relative;overflow:hidden}
.pt-phero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,0,0,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.03) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
.pt-phero-content{position:relative;z-index:1;max-width:540px;margin:0 auto;text-align:center;display:flex;flex-direction:column;align-items:center}
.pt-phero-live{display:inline-flex;align-items:center;gap:7px;border-radius:99px;padding:5px 12px;border:1px solid rgba(0,0,0,.12);background:#141210;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px;color:#F4F0E8}
.pt-phero-live::before{content:'';width:5px;height:5px;border-radius:50%;background:#F4F0E8;flex-shrink:0;animation:ptPulse 2s infinite}
.pt-phero-title{font-weight:800;font-size:clamp(34px,9vw,62px);line-height:.92;letter-spacing:-2px;color:#141210;margin-bottom:10px;font-family:'DM Serif Display','DM Sans',system-ui,sans-serif}
.pt-phero-sub{font-size:13px;color:#7A766F;font-weight:300}
.pt-phero-info{margin-top:14px;font-size:12px;color:#5A5652;display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
.pt-phero-info b{color:#141210;font-weight:700}

.pt-pbody{max-width:600px;margin:0 auto;padding:0 20px 130px}
.pt-psec{padding-top:32px;display:flex;flex-direction:column;align-items:center}
.pt-pstep{display:flex;align-items:center;gap:9px;margin-bottom:14px;justify-content:center}
.pt-pstep-n{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;transition:all .2s;box-shadow:0 2px 6px rgba(0,0,0,.12)}
.pt-pstep-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#B5B0A8;transition:color .2s}
.pt-pstep-lbl.act{color:#141210}

/* DAYS STRIP */
.pt-days{display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;gap:7px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:4px;scrollbar-width:none;width:100%}
.pt-days::-webkit-scrollbar{display:none}
.pt-day{flex-shrink:0 !important;min-width:54px;padding:10px 8px;border:1.5px solid rgba(0,0,0,0.08);border-radius:12px;background:#FFFFFF;cursor:pointer;display:flex !important;flex-direction:column !important;align-items:center;gap:2px;-webkit-tap-highlight-color:transparent;transition:all .15s;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.pt-day:hover{border-color:rgba(0,0,0,0.25)}
.pt-day-wd{font-size:8px;font-weight:700;letter-spacing:.8px;color:#B5B0A8;text-transform:uppercase}
.pt-day-d{font-weight:800;font-size:18px;color:#141210;line-height:1.1}
.pt-day-m{font-size:8px;color:#B5B0A8}
.pt-day.on{border-color:#141210;background:#141210}
.pt-day.on .pt-day-wd,.pt-day.on .pt-day-d,.pt-day.on .pt-day-m{color:#F4F0E8}

/* DURATIONS */
.pt-durs{display:flex !important;flex-direction:row !important;flex-wrap:wrap;gap:8px}
.pt-dur{padding:11px 20px;border:1.5px solid rgba(0,0,0,0.08);border-radius:12px;background:#FFFFFF;cursor:pointer;font-size:13px;font-weight:600;color:#7A766F;transition:all .16s cubic-bezier(.25,.46,.45,.94);-webkit-tap-highlight-color:transparent;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.pt-dur:hover{border-color:rgba(0,0,0,0.25);color:#141210}
.pt-dur.on{background:#141210;color:#F4F0E8;border-color:#141210}

/* SLOTS */
.pt-slots{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
@media(min-width:400px){.pt-slots{grid-template-columns:repeat(4,1fr)}}
.pt-slot{border:1.5px solid rgba(0,0,0,0.08);border-radius:11px;padding:12px 6px;cursor:pointer;background:#FFFFFF;text-align:center;-webkit-tap-highlight-color:transparent;transition:all .16s cubic-bezier(.25,.46,.45,.94);position:relative;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.pt-slot:hover:not(.pt-full):not(.pt-blk){border-color:rgba(0,0,0,0.28);transform:translateY(-1px)}
.pt-slot-t{font-weight:800;font-size:16px;color:#141210;line-height:1}
.pt-slot-sub{font-size:9px;color:#B5B0A8;margin-top:3px}
.pt-slot.on{background:#141210;border-color:#141210;box-shadow:0 4px 12px rgba(0,0,0,.18);transform:scale(1.02)}
.pt-slot.on .pt-slot-t,.pt-slot.on .pt-slot-sub{color:#F4F0E8}

.pt-slot.pt-full{opacity:.22;cursor:not-allowed;border-style:dashed}
.pt-slot.pt-full .pt-slot-t{text-decoration:line-through}
.pt-slot.pt-blk{opacity:.2;cursor:not-allowed;border-style:dashed}
.pt-night-tag{font-size:8px;font-weight:700;padding:2px 6px;border-radius:4px;margin-top:3px;display:inline-block;background:rgba(0,0,0,0.07);color:#7A766F}

/* COURTS */
.pt-courts{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.pt-court{border:1.5px solid rgba(0,0,0,0.08);border-radius:13px;padding:15px;cursor:pointer;background:#FFFFFF;-webkit-tap-highlight-color:transparent;transition:all .16s cubic-bezier(.25,.46,.45,.94);box-shadow:0 1px 4px rgba(0,0,0,.04)}
.pt-court:hover{border-color:rgba(0,0,0,0.25)}
.pt-court.on{background:#141210;border-color:#141210}
.pt-court-name{font-weight:800;font-size:16px;color:#141210;letter-spacing:-.2px}
.pt-court-det{font-size:11px;color:#7A766F;margin-top:3px}
.pt-court.on .pt-court-name,.pt-court.on .pt-court-det{color:#F4F0E8}

/* SUMMARY BAR */
.pt-sbar{position:fixed;bottom:0;left:0;right:0;padding:12px 18px;display:flex;align-items:center;gap:12px;z-index:80;background:rgba(20,18,16,.97);border-top:1px solid rgba(255,255,255,.08);backdrop-filter:blur(20px);transition:transform .3s cubic-bezier(.34,1.4,.64,1);padding-bottom:max(12px,env(safe-area-inset-bottom))}
.pt-sbar.vis{transform:translateY(0)}
.pt-sbar.hid{transform:translateY(100%)}
.pt-sbar-info{flex:1;min-width:0}
.pt-sbar-main{font-weight:800;font-size:14px;color:#F4F0E8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.2px}
.pt-sbar-sub{font-size:10px;color:rgba(255,255,255,.35);margin-top:2px}
.pt-sbar-price{flex-shrink:0;text-align:right}
.pt-sbar-val{font-weight:800;font-size:21px;color:#F4F0E8;line-height:1;letter-spacing:-1px}
.pt-sbar-unit{font-size:9px;color:rgba(255,255,255,.35)}
.pt-sbar-btn{border:none;font-size:13px;font-weight:700;padding:11px 18px;border-radius:10px;cursor:pointer;flex-shrink:0;background:#F4F0E8;color:#141210;-webkit-tap-highlight-color:transparent;font-family:inherit;transition:all .15s}
.pt-sbar-btn:active{transform:scale(.97)}

/* SHEET */
.pt-sbg{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);display:flex;align-items:flex-end;animation:ptIn .18s ease}
.pt-sheet{background:#F9F7F3;border:1px solid rgba(0,0,0,0.12);border-radius:20px 20px 0 0;width:100%;max-height:90vh;overflow-y:auto;animation:ptSlide .26s cubic-bezier(.34,1.1,.64,1)}
@media(min-width:600px){.pt-sbg{align-items:center}.pt-sheet{border-radius:16px;max-width:480px;margin:0 auto}.pt-sheet-handle{display:none!important}}
.pt-sheet-handle{width:36px;height:4px;background:rgba(0,0,0,.12);border-radius:99px;margin:12px auto 0}
.pt-sheet-hd{padding:14px 20px 0;display:flex;justify-content:space-between;align-items:flex-start}
.pt-sheet-tag{display:inline-flex;padding:3px 10px;border-radius:99px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;background:rgba(0,0,0,.08);color:#7A766F}
.pt-sheet-title{font-weight:800;font-size:22px;line-height:.95;letter-spacing:-1px;color:#141210}
.pt-sheet-close{width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,.07);border:none;color:#7A766F;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.pt-bcard{margin:13px 20px;background:#FFFFFF;border:1px solid rgba(0,0,0,0.1);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px}
.pt-bcard-l{flex:1;min-width:0}
.pt-bcard-name{font-weight:800;font-size:15px;color:#141210;letter-spacing:-.2px}
.pt-bcard-det{font-size:11px;color:#7A766F;margin-top:4px;line-height:1.6}
.pt-bcard-price{text-align:right;flex-shrink:0}
.pt-bcard-val{font-weight:800;font-size:24px;color:#141210;line-height:1;letter-spacing:-1px}
.pt-bcard-unit{font-size:10px;color:#B5B0A8}
.pt-form{padding:4px 20px 0;display:flex;flex-direction:column;gap:11px}
.pt-form-lbl{font-size:10px;font-weight:700;color:#7A766F;text-transform:uppercase;letter-spacing:1px;margin-bottom:7px}
.pt-fi{background:#FFFFFF;border:1.5px solid rgba(0,0,0,.12);border-radius:9px;padding:12px 14px;color:#141210;font-size:14px;outline:none;width:100%;-webkit-appearance:none;font-family:inherit;transition:border-color .18s}
.pt-fi:focus{border-color:#141210}
.pt-fi::placeholder{color:#B5B0A8}
.pt-fi.err{border-color:#E53E3E}
.pt-errmsg{font-size:10px;color:#E53E3E;margin-top:-6px}
.pt-pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.pt-pay{border:1.5px solid rgba(0,0,0,.1);border-radius:9px;padding:11px 12px;cursor:pointer;background:#FFFFFF;display:flex;align-items:center;gap:8px;-webkit-tap-highlight-color:transparent;transition:all .15s}
.pt-pay:hover{border-color:rgba(0,0,0,.22)}
.pt-pay.on{background:#141210;border-color:#141210}
.pt-pay-ico{font-size:17px;line-height:1;flex-shrink:0}
.pt-pay-lbl{font-size:12px;font-weight:600;color:#141210;flex:1}
.pt-pay.on .pt-pay-lbl{color:#F4F0E8}
.pt-pay-radio{width:14px;height:14px;border:1.5px solid rgba(0,0,0,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.pt-pay.on .pt-pay-radio{border-color:#F4F0E8;background:#F4F0E8}
.pt-pay.on .pt-pay-radio::after{content:'';width:5px;height:5px;border-radius:50%;background:#141210}
.pt-submit{width:100%;padding:15px;border-radius:12px;border:none;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;-webkit-tap-highlight-color:transparent;font-family:inherit;transition:all .18s cubic-bezier(.25,.46,.45,.94)}
.pt-submit:disabled{opacity:.4;cursor:not-allowed}
.pt-foot{padding:12px 20px;display:flex;flex-direction:column;gap:8px;padding-bottom:max(18px,env(safe-area-inset-bottom,18px))}
@media(min-width:600px){.pt-foot{flex-direction:row;justify-content:flex-end;padding-bottom:18px}.pt-foot .pt-submit{width:auto}}

/* SUCCESS */
.pt-success{background:#141210;min-height:calc(100vh - 52px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px 40px;text-align:center}
.pt-sr-ring{width:86px;height:86px;border-radius:50%;border:2px solid rgba(255,255,255,.3);display:flex;align-items:center;justify-content:center;margin-bottom:22px;position:relative;animation:ptRingPop .5s cubic-bezier(.34,1.56,.64,1) both}
.pt-sr-ring::before{content:'';position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(255,255,255,.1);animation:ptRingPulse 2.5s infinite}
.pt-sr-check{font-size:34px;animation:ptCheckPop .4s .3s cubic-bezier(.34,1.56,.64,1) both}
.pt-s-title{font-weight:800;font-size:clamp(34px,9vw,52px);line-height:.95;letter-spacing:-2px;margin-bottom:10px;color:#F4F0E8;animation:ptUp .4s .2s ease both}
.pt-s-sub{font-size:14px;color:rgba(255,255,255,.4);max-width:280px;animation:ptUp .4s .3s ease both;line-height:1.65;font-weight:300}
.pt-s-card{margin:22px 0 0;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:17px;width:100%;max-width:320px;text-align:left;animation:ptUp .4s .4s ease both}
.pt-s-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.07)}
.pt-s-row:last-child{border-bottom:none}
.pt-s-k{font-size:11px;color:rgba(255,255,255,.3)}
.pt-s-v{font-size:12px;font-weight:600;color:#F4F0E8}
.pt-s-actions{margin-top:20px;display:flex;flex-direction:column;gap:9px;width:100%;max-width:320px;animation:ptUp .4s .5s ease both}
.pt-wa-btn{display:flex;align-items:center;justify-content:center;gap:9px;padding:14px 20px;border-radius:11px;border:none;background:#25D366;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%}
.pt-back-btn{background:none;border:1.5px solid rgba(255,255,255,.12);border-radius:10px;padding:12px 20px;color:rgba(255,255,255,.4);font-size:13px;cursor:pointer;font-family:inherit;width:100%;transition:border-color .15s}
.pt-back-btn:hover{border-color:rgba(255,255,255,.3);color:rgba(255,255,255,.7)}

/* ── ADMIN ── */
.pt-admin{display:flex;height:calc(100vh - 52px);overflow:hidden;background:#0E0D0B}
.pt-asb{width:204px;min-width:204px;background:#0E0D0B;border-right:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;padding:14px 0;gap:2px}
.pt-asbl{padding:0 14px 14px;display:flex;align-items:center;gap:9px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:8px}
.pt-asbl-av{width:30px;height:30px;border-radius:8px;background:#F4F0E8;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;color:#141210;flex-shrink:0}
.pt-asbl-name{font-weight:800;font-size:13px;letter-spacing:-.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#EDE9E1}
.pt-asbl-role{font-size:9px;color:#3D3A35;letter-spacing:.8px;text-transform:uppercase}
.pt-anz{padding:8px 14px 4px;font-size:9px;letter-spacing:2px;color:#3D3A35;text-transform:uppercase;font-weight:600}
.pt-ani{display:flex;align-items:center;gap:9px;padding:9px 14px;cursor:pointer;color:#7A766F;font-size:12px;font-weight:500;transition:all .15s;position:relative;margin:0 6px;border-radius:9px;-webkit-tap-highlight-color:transparent}
.pt-ani:hover{background:rgba(255,255,255,.05);color:#EDE9E1}
.pt-ani.on{background:rgba(255,255,255,.07);color:#EDE9E1}
.pt-ani.on::before{content:'';position:absolute;left:-6px;top:50%;transform:translateY(-50%);width:3px;height:16px;background:#F4F0E8;border-radius:99px}
.pt-abadge{margin-left:auto;background:rgba(255,255,255,.12);color:#EDE9E1;font-size:9px;font-weight:700;padding:1px 6px;border-radius:99px}
.pt-afoot{margin-top:auto;padding:12px}
.pt-afoot-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:9px;padding:10px 12px}
.pt-amain{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.pt-atb{height:48px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 18px;gap:10px;background:#0E0D0B;flex-shrink:0;position:relative}
.pt-atb-title{font-size:14px;font-weight:800;flex:1;letter-spacing:-.3px;color:#EDE9E1}
.pt-atb-srch{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:9px;padding:6px 10px;flex:1;max-width:190px;transition:border-color .2s}
.pt-atb-srch:focus-within{border-color:rgba(255,255,255,.18)}
.pt-atb-srch input{background:none;border:none;outline:none;color:#EDE9E1;font-size:12px;width:100%;min-width:0;font-family:inherit}
.pt-atb-srch input::placeholder{color:#3D3A35}
.pt-aib{width:34px;height:34px;border-radius:9px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;color:#7A766F;flex-shrink:0;-webkit-tap-highlight-color:transparent;transition:all .15s}
.pt-aib:hover{border-color:rgba(255,255,255,.14);color:#EDE9E1}
.pt-andot{position:absolute;top:7px;right:7px;width:6px;height:6px;background:#EDE9E1;border-radius:50%;border:2px solid #0E0D0B}
.pt-acontent{flex:1;overflow-y:auto;overflow-x:hidden;padding:18px;padding-bottom:calc(18px + var(--bnav,62px))}
.pt-abn{position:fixed;bottom:0;left:0;right:0;height:var(--bnav,62px);background:#0E0D0B;border-top:1px solid rgba(255,255,255,.07);z-index:50;display:flex;align-items:stretch;padding-bottom:env(safe-area-inset-bottom,0)}
.pt-abni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;color:#3D3A35;-webkit-tap-highlight-color:transparent;transition:color .15s}
.pt-abni.on{color:#EDE9E1}
.pt-abni-lbl{font-size:9px;font-weight:600}
.pt-abni-badge{position:absolute;top:7px;right:calc(50% - 17px);background:rgba(255,255,255,.15);color:#EDE9E1;font-size:8px;font-weight:700;min-width:14px;height:14px;border-radius:99px;display:flex;align-items:center;justify-content:center;padding:0 3px}

/* ADMIN CARDS */
.pt-acard{background:#171613;border:1px solid rgba(255,255,255,.07);border-radius:12px;overflow:hidden;position:relative}
.pt-acard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);pointer-events:none}
.pt-akpi-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
@media(min-width:768px){.pt-akpi-grid{grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}}
.pt-akpi{background:#171613;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:9px;animation:ptUp .4s ease both}
.pt-akpi-ic{width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pt-akpi-val{font-weight:800;font-size:22px;letter-spacing:-1px;color:#EDE9E1;line-height:1}
.pt-akpi-lbl{font-size:11px;color:#7A766F}
.pt-akpi-sub{font-size:10px;color:#3D3A35}
@media(min-width:768px){.pt-akpi-val{font-size:26px}}

/* ADMIN SECTION HEAD */
.pt-ash{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 0;margin-bottom:10px}
.pt-ash-t{font-size:13px;font-weight:800;color:#EDE9E1;letter-spacing:-.2px}
.pt-ash-a{font-size:11px;color:#7A766F;cursor:pointer;font-weight:500;transition:color .15s}
.pt-ash-a:hover{color:#EDE9E1}

/* ADMIN ROWS */
.pt-arow{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.06)}
.pt-arow:last-child{border-bottom:none}
.pt-arow-time{font-size:12px;font-weight:700;color:#EDE9E1;width:44px;flex-shrink:0;padding-top:1px;font-family:'DM Mono',monospace}
.pt-arow-body{flex:1;min-width:0}
.pt-arow-name{font-size:13px;font-weight:600;color:#EDE9E1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:-.1px}
.pt-arow-sub{font-size:11px;color:#7A766F;margin-top:3px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.pt-arow-acts{display:flex;gap:7px;margin-top:8px}
.pt-cdot{width:5px;height:5px;border-radius:50%;flex-shrink:0;background:#EDE9E1}

/* ADMIN AV */
.pt-aav{display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;border-radius:50%;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:#EDE9E1}

/* BADGE */
.pt-badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:600;white-space:nowrap}
.pt-ba{background:rgba(255,255,255,.1);color:#EDE9E1}
.pt-bw{background:rgba(255,255,255,.07);color:#7A766F}
.pt-br{background:rgba(255,77,109,.1);color:#FF6B6B}

/* BTN */
.pt-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 14px;border-radius:9px;border:none;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;-webkit-tap-highlight-color:transparent;font-family:inherit}
.pt-btn-light{background:#F4F0E8;color:#141210}
.pt-btn-light:hover{background:#EDE9E1}
.pt-btn-ghost{background:rgba(255,255,255,.06);color:#EDE9E1;border:1px solid rgba(255,255,255,.1)}
.pt-btn-ghost:hover{border-color:rgba(255,255,255,.2)}
.pt-btn-del{background:rgba(255,77,109,.1);color:#FF6B6B;border:1px solid rgba(255,77,109,.15)}
.pt-btn-sm{padding:6px 11px;font-size:11px}
.pt-btn-w{width:100%}

/* ADMIN INNER TABS */
.pt-itabs{display:flex;gap:3px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:9px;padding:3px;margin-bottom:14px}
.pt-itab{flex:1;padding:7px 10px;border-radius:7px;font-size:11px;font-weight:600;cursor:pointer;color:#7A766F;text-align:center;transition:all .15s;font-family:inherit;border:none;background:none;-webkit-tap-highlight-color:transparent}
.pt-itab.on{background:rgba(255,255,255,.07);color:#EDE9E1}

/* DAY TABS ADMIN */
.pt-adtabs{display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;margin-bottom:14px;scrollbar-width:none;padding-bottom:2px}
.pt-adtabs::-webkit-scrollbar{display:none}
.pt-adtab{flex-shrink:0;min-width:46px;padding:7px 6px;border:1px solid rgba(255,255,255,.07);border-radius:9px;background:rgba(255,255,255,.03);cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;-webkit-tap-highlight-color:transparent;transition:all .15s}
.pt-adtab.on{border-color:rgba(255,255,255,.25);background:rgba(255,255,255,.07)}
.pt-adtab-wd{font-size:8px;font-weight:600;letter-spacing:.7px;color:#3D3A35;text-transform:uppercase}
.pt-adtab-d{font-weight:800;font-size:15px;color:#EDE9E1}
.pt-adtab-m{font-size:8px;color:#3D3A35}
.pt-adtab.on .pt-adtab-wd,.pt-adtab.on .pt-adtab-d{color:#EDE9E1}

/* OCC BARS */
.pt-orow{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.pt-obg{flex:1;height:4px;background:#201F1C;border-radius:99px;overflow:hidden}
.pt-ofill{height:100%;border-radius:99px;background:#EDE9E1;transition:width .6s ease}
.pt-opct{font-size:11px;color:#7A766F;width:32px;text-align:right}

/* BLOCK CARDS */
.pt-blk-card{border-radius:11px;overflow:hidden;margin-bottom:9px;border:1px solid rgba(255,255,255,.08);animation:ptUp .3s ease both}
.pt-blk-hd{display:flex;align-items:center;gap:10px;padding:12px 14px;background:rgba(255,255,255,.04)}
.pt-blk-strip{width:3px;border-radius:2px;height:34px;flex-shrink:0;background:#EDE9E1}
.pt-blk-reason{font-size:13px;font-weight:700;flex:1;color:#EDE9E1}
.pt-blk-meta{padding:0 14px 11px;display:flex;gap:6px;flex-wrap:wrap}
.pt-blk-tag{font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px;background:rgba(255,255,255,.06);color:#7A766F}
.pt-blk-inline{border-left:3px solid rgba(255,255,255,.2);padding:9px 12px;border-radius:9px;margin-bottom:8px;background:rgba(255,255,255,.04)}

/* WEEKDAY GRID */
.pt-wdg{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;margin-top:7px}
.pt-wdp{padding:7px 4px;border:1.5px solid rgba(255,255,255,.08);border-radius:7px;text-align:center;font-size:10px;font-weight:600;cursor:pointer;color:#7A766F;transition:all .15s;-webkit-tap-highlight-color:transparent}
.pt-wdp.on{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#EDE9E1}

/* COURT CB */
.pt-ccb{display:flex;align-items:center;gap:8px;padding:9px 11px;border:1px solid rgba(255,255,255,.07);border-radius:9px;background:rgba(255,255,255,.04);margin-bottom:7px;cursor:pointer;transition:border-color .15s;-webkit-tap-highlight-color:transparent}
.pt-ccb:hover{border-color:rgba(255,255,255,.14)}
.pt-cb-box{width:15px;height:15px;border-radius:4px;border:1.5px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.pt-cb-box.on{background:#F4F0E8;border-color:#F4F0E8}

/* ADMIN SETTINGS */
.pt-sfg{display:flex;flex-direction:column;gap:5px;margin-bottom:13px}
.pt-sfl{font-size:10px;font-weight:700;color:#7A766F;text-transform:uppercase;letter-spacing:.8px}
.pt-sfi{background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:9px;padding:10px 12px;color:#EDE9E1;font-size:13px;outline:none;width:100%;-webkit-appearance:none;font-family:inherit;transition:border-color .18s}
.pt-sfi:focus{border-color:rgba(255,255,255,.3)}
.pt-sfi-ta{resize:vertical;min-height:72px;font-family:inherit;line-height:1.55}
.pt-sfi-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pt-tog-row{display:flex;align-items:center;padding:10px 12px;border:1px solid rgba(255,255,255,.07);border-radius:9px;background:rgba(255,255,255,.03);margin-bottom:7px;gap:10px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:border-color .15s}
.pt-tog-row:hover{border-color:rgba(255,255,255,.14)}
.pt-tog{width:34px;height:18px;border-radius:99px;position:relative;transition:background .2s;flex-shrink:0}
.pt-tog-thumb{position:absolute;top:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.4)}
.pt-ce{display:flex;align-items:center;gap:8px;padding:9px 11px;border:1px solid rgba(255,255,255,.07);border-radius:9px;background:rgba(255,255,255,.04);margin-bottom:7px;transition:border-color .15s}
.pt-ce:hover{border-color:rgba(255,255,255,.14)}
.pt-ce-in{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:7px 10px;color:#EDE9E1;font-size:12px;outline:none;flex:1;min-width:0;font-family:inherit;transition:border-color .15s}
.pt-ce-in:focus{border-color:rgba(255,255,255,.25)}
.pt-ce-tag{font-size:10px;font-weight:700;padding:3px 9px;border-radius:99px;background:rgba(255,255,255,.08);color:#7A766F;cursor:pointer;white-space:nowrap;-webkit-tap-highlight-color:transparent}
.pt-dur-pills{display:flex;gap:8px;flex-wrap:wrap}
.pt-dur-pill{padding:8px 16px;border:1.5px solid rgba(255,255,255,.08);border-radius:9px;background:rgba(255,255,255,.04);cursor:pointer;font-size:12px;font-weight:600;color:#7A766F;transition:all .15s;-webkit-tap-highlight-color:transparent;font-family:inherit}
.pt-dur-pill.on{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#EDE9E1}
.pt-sec-hd{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#3D3A35;margin-bottom:11px;margin-top:4px}

/* NOTIF PANEL */
.pt-npanel{position:absolute;top:calc(48px + 4px);right:0;left:0;margin:0 10px;background:#201F1C;border:1px solid rgba(255,255,255,.1);border-radius:12px;box-shadow:0 16px 48px rgba(0,0,0,.5);z-index:100;animation:ptUp .15s ease;overflow:hidden}
.pt-nhd{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;align-items:center}
.pt-nhd-t{font-size:12px;font-weight:800;color:#EDE9E1}
.pt-nitem{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;gap:9px;align-items:flex-start;transition:background .12s}
.pt-nitem:hover{background:rgba(255,255,255,.03)}
.pt-nitem:last-child{border-bottom:none}
.pt-nii{width:26px;height:26px;border-radius:7px;background:rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* MODAL */
.pt-mbg{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:flex-end;animation:ptIn .15s ease}
.pt-modal{background:#201F1C;border:1px solid rgba(255,255,255,.1);border-radius:18px 18px 0 0;width:100%;max-height:90vh;overflow-y:auto;animation:ptSlide .24s cubic-bezier(.34,1.2,.64,1);padding-bottom:env(safe-area-inset-bottom,18px)}
@media(min-width:600px){.pt-mbg{align-items:center}.pt-modal{border-radius:14px;max-width:480px;margin:0 auto;padding-bottom:0}.pt-modal-handle{display:none!important}}
.pt-modal-handle{width:34px;height:4px;background:rgba(255,255,255,.12);border-radius:99px;margin:12px auto 0}
.pt-modal-hd{padding:13px 18px 0;display:flex;justify-content:space-between;align-items:center}
.pt-modal-tt{font-size:15px;font-weight:800;color:#EDE9E1;letter-spacing:-.3px}
.pt-modal-close{width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.08);border:none;color:#7A766F;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px}
.pt-modal-body{padding:13px 18px;display:flex;flex-direction:column;gap:11px}
.pt-modal-foot{padding:0 18px 18px;display:flex;flex-direction:column;gap:7px}
@media(min-width:600px){.pt-modal-foot{flex-direction:row;justify-content:flex-end;padding-bottom:16px}.pt-modal-foot .pt-btn-w{width:auto}}
.pt-mfi{background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);border-radius:9px;padding:11px 13px;color:#EDE9E1;font-size:13px;outline:none;width:100%;-webkit-appearance:none;font-family:inherit;transition:border-color .18s}
.pt-mfi:focus{border-color:rgba(255,255,255,.3);box-shadow:0 0 0 3px rgba(255,255,255,.06)}
.pt-mfi::placeholder{color:#3D3A35}
.pt-mfi.err{border-color:#FF6B6B}
.pt-merr{font-size:10px;color:#FF6B6B;margin-top:-7px}
.pt-cat-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.pt-cat{padding:9px 12px;border:1.5px solid rgba(255,255,255,.08);border-radius:9px;cursor:pointer;text-align:center;transition:all .15s;-webkit-tap-highlight-color:transparent}
.pt-cat.on{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.07)}
.pt-cat-lbl{font-size:12px;font-weight:600;color:#7A766F}
.pt-cat.on .pt-cat-lbl{color:#EDE9E1}

/* CLIENT DETAIL */
.pt-cd{animation:ptUp .2s ease both}
.pt-cd-back{display:flex;align-items:center;gap:7px;color:#7A766F;cursor:pointer;font-size:12px;font-weight:600;margin-bottom:16px;width:fit-content;-webkit-tap-highlight-color:transparent;transition:color .15s;border:none;background:none;font-family:inherit}
.pt-cd-back:hover{color:#EDE9E1}
.pt-cd-ptop{background:#201F1C;padding:18px 16px;display:flex;gap:14px;align-items:flex-start}
.pt-cd-av{width:52px;height:52px;border-radius:13px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800;flex-shrink:0;color:#EDE9E1;border:1px solid rgba(255,255,255,.1)}
.pt-cd-name{font-size:18px;font-weight:800;letter-spacing:-.4px;color:#EDE9E1;margin-bottom:4px}
.pt-cd-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
@media(min-width:600px){.pt-cd-stats{grid-template-columns:repeat(4,1fr)}}
.pt-cd-stat{background:#171613;border:1px solid rgba(255,255,255,.07);border-radius:11px;padding:12px 14px}
.pt-cd-stat-v{font-weight:800;font-size:20px;color:#EDE9E1;letter-spacing:-.5px;line-height:1}
.pt-cd-stat-l{font-size:10px;color:#7A766F;margin-top:4px}
.pt-cd-contact{padding:0 16px}
.pt-cd-ci{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.pt-cd-ci:last-child{border-bottom:none}
.pt-cd-notes{padding:12px 16px;border-top:1px solid rgba(255,255,255,.06)}
.pt-cd-notes-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#3D3A35;margin-bottom:6px}
.pt-cd-notes-txt{font-size:12px;color:#7A766F;font-style:italic;line-height:1.65}

/* COLOR PRESETS */
.pt-cprow{display:flex;gap:7px;flex-wrap:wrap;margin-top:6px}
.pt-cp{width:24px;height:24px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .15s}
.pt-cp.on{border-color:#EDE9E1;transform:scale(1.15)}

/* TOAST */
.pt-toast{position:fixed;bottom:calc(62px + 10px);left:14px;right:14px;z-index:999;background:#201F1C;border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:11px 14px;display:flex;align-items:center;gap:9px;box-shadow:0 8px 28px rgba(0,0,0,.5);animation:ptUp .2s ease}
.pt-toast-ic{width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* PEND BOX */
.pt-pbox{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:12px;margin-bottom:14px}
.pt-pbox-hd{padding:10px 14px;display:flex;align-items:center;gap:7px;border-bottom:1px solid rgba(255,255,255,.07)}

/* MISC */
.row{display:flex;align-items:center}
.g2{gap:8px}.g3{gap:12px}
.mla{margin-left:auto}
.mb10{margin-bottom:10px}.mb14{margin-bottom:14px}
.bdt{border-top:1px solid rgba(255,255,255,.07)}
.trunc{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.f10{font-size:10px}.f11{font-size:11px}.f12{font-size:12px}.f13{font-size:13px}
.fw6{font-weight:600}.fw7{font-weight:700}.fw8{font-weight:800}

@media(min-width:768px){
  :root{--bnav:0px}
  .pt-asb{display:flex!important}
  .pt-abn{display:none!important}
  .pt-acontent{padding:22px;padding-bottom:22px}
  .pt-atb{height:52px;padding:0 22px;gap:12px}
  .pt-atb-title{font-size:15px}
  .pt-npanel{left:auto;right:22px;margin:0;width:300px;top:calc(52px + 4px)}
  .pt-akpi-grid{grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}
  .pt-akpi-val{font-size:26px}
  .pt-cd-stats{grid-template-columns:repeat(4,1fr)}
  .pt-2col{display:grid!important;grid-template-columns:2fr 1fr;gap:14px}
}
@media(max-width:767px){
  .pt-asb{display:none!important}
  :root{--bnav:62px}
  .pt-club-strip{min-height:58px;justify-content:space-between;text-align:left;gap:12px;padding:9px 12px}
  .pt-club-strip-copy{font-size:13px;line-height:1.15}
  .pt-club-strip-copy small{font-size:10px;line-height:1.25}
  .pt-club-strip-btn{font-size:12px;padding:9px 12px;border-radius:9px}
  .pt-top{padding:0 12px;gap:8px}
  .pt-mode{padding:5px 8px}
  .pt-hero{padding:46px 18px 44px}
  .pt-h1{font-size:48px;letter-spacing:-1.8px;margin-bottom:18px}
  .pt-sub{font-size:15px;line-height:1.55;margin-bottom:28px}
  .pt-search{margin-bottom:28px}
  .pt-stats{margin:8px auto 12px}
  .pt-stat{padding:12px 4px}
  .pt-sv{font-size:24px}
  .pt-sl{font-size:9px}
  .pt-sec{padding-top:34px}
  .pt-rgs{margin-bottom:28px}
}
`;


// ─── PERSISTENT STATE HOOK ───────────────────────────────────────────────────
// Saves to localStorage automatically. Falls back to defaultValue if nothing saved.
const DATA_VERSION = "v4"; // bump this to force reset on incompatible changes

function usePersist(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      // Version check — reset if data is from old version
      const ver = localStorage.getItem('pdp_version');
      if(ver !== DATA_VERSION) {
        Object.keys(localStorage).filter(k=>k.startsWith('pdp_')).forEach(k=>localStorage.removeItem(k));
        localStorage.setItem('pdp_version', DATA_VERSION);
        return defaultValue;
      }
      const saved = localStorage.getItem('pdp_' + key);
      if(saved === null) return defaultValue;
      const parsed = JSON.parse(saved);
      // Type safety — if we expect array but got something else, use default
      if(Array.isArray(defaultValue) && !Array.isArray(parsed)) return defaultValue;
      if(typeof defaultValue === 'object' && !Array.isArray(defaultValue) && typeof parsed !== 'object') return defaultValue;
      return parsed;
    } catch {
      return defaultValue;
    }
  });
  const setPersist = (value) => {
    setState(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      try { localStorage.setItem('pdp_' + key, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return [state, setPersist];
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode,    setMode]   = useState("discover");
  const [club,    setClub]   = useState(null);

  // ── AUTH STATE ──
  const [athletes,    setAthletes]     = usePersist("athletes",    []);
  const [regClubs,    setRegClubs]     = usePersist("regClubs",    []);
  const [currentUser, setCurrentUser]  = useState(null);  // {type:"athlete"|"club"|"super", data:{}}
  const [authScreen,  setAuthScreen]   = useState(null);  // "athleteLogin"|"athleteRegister"|"clubLogin"|"clubRegister"
  const [showProfile, setShowProfile]  = useState(false);
  const [pendingTournamentReg, setPendingTournamentReg] = useState(null);

  const logout = () => { setCurrentUser(null); setAuthScreen(null); setMode("discover"); };      // selected club (portal)
  const [adminCfg,setAdmin]  = usePersist("cfg",       DEF_CLUB);
  const [bookings,setBook]   = usePersist("bookings",  INIT_B);
  const [contacts,setConts]  = usePersist("contacts",  INIT_C);
  const [blocks,  setBlocks] = usePersist("blocks",    INIT_BLOCKS);
  const [notifs,  setNotifs] = usePersist("notifs",    INIT_N);
  const [tournaments,setTournaments] = usePersist("tournaments", INIT_T);
  const [waitlist,setWaitlist]       = usePersist("waitlist",    []);
  const [clubsData, setClubsData]    = usePersist("clubsData",   {});

  // Per-club data helpers
  const clubId = currentUser?.type==="club" ? String(currentUser.data.id) : "demo";
  const getCD  = (key, def) => {
    const val = (clubsData[clubId]||{})[key];
    if(val === undefined || val === null) return def;
    if(Array.isArray(def) && !Array.isArray(val)) return def;
    if(typeof def === 'object' && !Array.isArray(def) && typeof val !== 'object') return def;
    return val;
  };
  const setCD  = (key, val) => setClubsData(prev => ({
    ...prev,
    [clubId]: { ...(prev[clubId]||{}), [key]: typeof val==="function" ? val((prev[clubId]||{})[key]) : val }
  }));

  // Club-scoped data (falls back to shared demo data for "demo" club)
  const activeClubCfg  = clubId==="demo" ? adminCfg : getCD("cfg", {
    ...DEF_CLUB,
    name:    currentUser?.data?.name    || DEF_CLUB.name,
    address: currentUser?.data?.address || DEF_CLUB.address,
    city:    currentUser?.data?.city    || DEF_CLUB.city,
    phone:   currentUser?.data?.phone   || DEF_CLUB.phone,
    email:   currentUser?.data?.email   || DEF_CLUB.email,
  });
  const activeBookings = clubId==="demo" ? bookings  : getCD("bookings",  []);
  const activeContacts = clubId==="demo" ? contacts  : getCD("contacts",  []);
  const activeBlocks   = clubId==="demo" ? blocks    : getCD("blocks",    []);
  const activeTourneys = clubId==="demo" ? tournaments: (()=>{ const v=getCD("tournaments",[]); return Array.isArray(v)?v:[]; })();

  const setActiveClubCfg  = clubId==="demo" ? setAdmin  : (v=>setCD("cfg",v));
  const setActiveBookings = clubId==="demo" ? setBook   : (v=>setCD("bookings",v));
  const setActiveContacts = clubId==="demo" ? setConts  : (v=>setCD("contacts",v));
  const setActiveBlocks   = clubId==="demo" ? setBlocks : (v=>setCD("blocks",v));
  const setActiveTourneys = clubId==="demo" ? setTournaments : (v=>setCD("tournaments",v));
  const addWaitlist=(entry)=>setWaitlist(p=>[...p,{id:Date.now(),...entry}]);
  const cancelPortalBk=(id)=>{ setActiveBookings(p=>p.filter(b=>b.id!==id)); };
  const [toast,   setToast]  = useState(null);
  const showToast = (m)=>{ setToast(m); setTimeout(()=>setToast(null),3000); };

  // Get bookings/blocks for a specific visited club (not necessarily logged-in club)
  const portalClubId = (c) => c?.isRegistered ? String(c.id) : "demo";
  const portalTournaments = (c) => {
    const pid = portalClubId(c);
    if(pid==="demo") return tournaments;
    const val = (clubsData[pid]||{})["tournaments"];
    return Array.isArray(val) ? val : [];
  };

  const portalBookings = (c) => {
    const pid = portalClubId(c);
    if(pid==="demo") return bookings;
    const val = (clubsData[pid]||{})["bookings"];
    return Array.isArray(val) ? val : [];
  };
  const portalBlocks = (c) => {
    const pid = portalClubId(c);
    if(pid==="demo") return blocks;
    const val = (clubsData[pid]||{})["blocks"];
    return Array.isArray(val) ? val : [];
  };
  const setPortalBookings = (c, val) => {
    const pid = portalClubId(c);
    if(pid==="demo") setBook(val);
    else setClubsData(prev=>({...prev,[pid]:{...(prev[pid]||{}),bookings:typeof val==="function"?val((prev[pid]||{}).bookings||[]):val}}));
  };
  const setPortalContacts = (c, val) => {
    const pid = portalClubId(c);
    if(pid==="demo") setConts(val);
    else setClubsData(prev=>({...prev,[pid]:{...(prev[pid]||{}),contacts:typeof val==="function"?val((prev[pid]||{}).contacts||[]):val}}));
  };

  const portalBook = (data)=>{
    const c = club||CLUBS[0];
    const curContacts = portalBookings(c); // reuse for contacts check
    setPortalContacts(c, p=>{
      if(p.find(ct=>ct.email===data.email)) return p;
      return [...p,{id:Date.now(),name:data.name,email:data.email,phone:data.phone,since:TODAY,notes:""}];
    });
    const bk={id:Date.now()+1,contactEmail:data.email,contactName:data.name,courtId:data.court.id,date:data.date,time:data.time,dur:data.dur,status:(c.requireApproval??true)?"pending":"confirmed",pay:data.payment||"local",ref:genRef(),createdAt:new Date().toISOString()};
    setPortalBookings(c, p=>[...p,bk]);
    setNotifs(p=>[{id:Date.now()+2,type:"booking",msg:`${data.name} reservou ${data.court.name} · ${fmtSh(data.date)} ${data.time}`,time:"Agora",read:false},...p]);
    return bk;
  };
  const confirmBk = (id)=>{ setActiveBookings(p=>p.map(b=>b.id===id?{...b,status:"confirmed"}:b)); showToast("Reserva confirmada!"); };
  const cancelBk  = (id)=>{ setActiveBookings(p=>p.filter(b=>b.id!==id)); showToast("Reserva cancelada."); };
  const updateCt  = (id,d)=>{ setConts(p=>p.map(c=>c.id===id?{...c,...d}:c)); showToast("Cliente actualizado!"); };
  const deleteCt  = (id)=>{ setConts(p=>p.filter(c=>c.id!==id)); showToast("Cliente removido."); };
  const addBlock   = (b)=>{ setActiveBlocks(p=>[...p,{id:Date.now(),...b}]); showToast("Bloqueio criado!"); };
  const addBooking = (bk)=>{ setActiveBookings(p=>[...p,bk]); showToast("Campo marcado!"); };
  const delBlock  = (id)=>{ setActiveBlocks(p=>p.filter(b=>b.id!==id)); showToast("Bloqueio removido."); };

  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",background:mode==="admin"?"#0E0D0B":"#F4F0E8"}}>
        {/* TOP NAV — hidden during auth screens */}
        {!authScreen && !(currentUser?.type==="super" && mode==="admin") && <div className="pt-top-wrap">
          <div className="pt-club-strip">
            <span className="pt-club-strip-copy">Tens um clube de padel?<small>Entra com mensalidade fixa e zero comissões.</small></span>
            <button className="pt-club-strip-btn" onClick={()=>setAuthScreen("clubRegister")}>Registar clube</button>
          </div>
          <div className="pt-top">
            <div className="pt-top-brand" style={{cursor:"pointer"}} onClick={()=>{setMode("discover");setClub(null);setAuthScreen(null);setShowProfile(false);}}>
              <div className="pt-top-mark">PP</div>
              <div>
                <span className="pt-top-name">Portal do Padel</span>
                <span className="pt-top-sub">Reservas</span>
              </div>
            </div>
            <div className="pt-modes">
              <button className={`pt-mode ${mode==="discover"?"on":""}`} onClick={()=>{setMode("discover");setClub(null);}}>Descobrir</button>
              <button className={`pt-mode pt-club-mode ${mode==="admin"?"on":""}`} onClick={()=>{
                if(currentUser?.type==="club"||currentUser?.type==="super") setMode("admin");
                else setAuthScreen("clubLogin");
              }}>Clubes</button>
            </div>
            {/* Auth user indicator */}
            {currentUser&&(
              <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                <span style={{fontSize:11,fontWeight:600,color:"#141210",maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer",textDecoration:"underline",textDecorationColor:"rgba(0,0,0,.2)"}} onClick={()=>currentUser?.type==="athlete"&&setShowProfile(true)}>{currentUser.data?.name||currentUser.data?.email}</span>
                <button onClick={logout} style={{fontSize:11,color:"#7A766F",background:"rgba(0,0,0,.06)",border:"none",cursor:"pointer",fontFamily:"inherit",padding:"4px 8px",borderRadius:6}}>Sair</button>
              </div>
            )}
            {!currentUser&&(
              <button className="pt-login-btn" onClick={()=>setAuthScreen("athleteLogin")}>Entrar</button>
            )}
          </div>
        </div>}

        {/* AUTH SCREENS */}
        {authScreen==="athleteLogin"    && <AthleteLogin  athletes={athletes} onLogin={a=>{setCurrentUser({type:"athlete",data:a});setAuthScreen(null);}} onGoRegister={()=>setAuthScreen("athleteRegister")} onBack={()=>setAuthScreen(null)}/>}
        {authScreen==="athleteRegister" && <AthleteRegister athletes={athletes} onRegister={a=>{setAthletes(p=>[...p,a]);setCurrentUser({type:"athlete",data:a});setAuthScreen(null);}} onGoLogin={()=>setAuthScreen("athleteLogin")} onBack={()=>setAuthScreen(null)}/>}
        {authScreen==="clubLogin"       && <ClubLogin clubs={regClubs} onLogin={c=>{setCurrentUser({type:"club",data:c});setAuthScreen(null);setMode("admin");}} onGoRegister={()=>setAuthScreen("clubRegister")} onSuperLogin={()=>{setCurrentUser({type:"super",data:{name:"Super Admin",email:SUPER_ADMIN.email}});setAuthScreen(null);setMode("admin");}} onBack={()=>setAuthScreen(null)}/>}
        {authScreen==="clubRegister"    && <ClubRegister clubs={regClubs} onSubmit={c=>{setRegClubs(p=>[...p,c]);}} onGoLogin={()=>setAuthScreen("clubLogin")} onBack={()=>setAuthScreen(null)}/>}
        {currentUser?.type==="super" && mode==="admin" && <SuperAdmin clubs={regClubs} onApprove={id=>setRegClubs(p=>p.map(c=>c.id===id?{...c,status:"approved"}:c))} onReject={id=>setRegClubs(p=>p.map(c=>c.id===id?{...c,status:"rejected"}:c))} onLogout={logout}/>}

        {/* MAIN VIEWS — only when no auth screen showing */}
        {/* Athlete profile */}
        {showProfile && currentUser?.type==="athlete" && <AthleteProfile athlete={currentUser.data} bookings={activeBookings} tournaments={activeTourneys} cfg={activeClubCfg} onEdit={()=>{}} onLogout={()=>{logout();setShowProfile(false);}} onBack={()=>setShowProfile(false)}/>}

        {!authScreen && !showProfile && currentUser?.type!=="super" && <>
        {/* VIEWS */}
        {mode==="discover" && <DiscoverView onSelectClub={(c)=>{setClub(c);setMode("portal");}} allTournaments={[
      // Demo club tournaments
      ...tournaments.map(t=>({tournament:t,club:{...DEF_CLUB,name:DEF_CLUB.name}})),
      // All registered approved clubs' tournaments
      ...regClubs.filter(c=>c.status==="approved").flatMap(c=>{
        const cTourneys = (clubsData[String(c.id)]||{}).tournaments||[];
        return cTourneys.map(t=>({tournament:t,club:{...c,isRegistered:true}}));
      })
    ]} currentUser={currentUser} onRegisterTournament={(item)=>{setClub(item.club);setMode("portal");setPendingTournamentReg(item.tournament.id);}} onRegisterClub={()=>setAuthScreen("clubRegister")} regClubs={regClubs.filter(c=>c.status==="approved")} />}
        {mode==="portal"   && <PortalView club={club||CLUBS[0]} bookings={portalBookings(club)} blocks={portalBlocks(club)} onBook={portalBook} onBack={()=>{setMode("discover");setClub(null);}} tournaments={portalTournaments(club)} bookingsAll={bookings} onCancelBooking={cancelPortalBk} onJoinWaitlist={addWaitlist} currentUser={currentUser} pendingTournamentReg={pendingTournamentReg} onClearPendingReg={()=>setPendingTournamentReg(null)} onRegisterTournament={(tid,catId,pair)=>{
      const c = club||CLUBS[0];
      const pid = portalClubId(c);
      const newPair = {id:Date.now(),...pair,status:"pending"};
      const updater = p => (Array.isArray(p)?p:[]).map(t=>t.id===tid?{...t,categories:t.categories.map(cat=>cat.id===catId?{...cat,pairs:[...(cat.pairs||[]),newPair]}:cat)}:t);
      if(pid==="demo") setTournaments(updater);
      else setClubsData(prev=>({...prev,[pid]:{...(prev[pid]||{}),tournaments:updater((prev[pid]||{}).tournaments||[])}}));
    }} />}
        {/* addBooking defined in App scope */}
        {mode==="admin"    && <AdminView cfg={activeClubCfg} setCfg={setActiveClubCfg} bookings={activeBookings} contacts={activeContacts} blocks={activeBlocks} notifs={notifs} onConfirm={confirmBk} onCancel={cancelBk} onUpdateCt={updateCt} onDeleteCt={deleteCt} onAddBlock={addBlock} onDelBlock={delBlock} showToast={showToast} toast={toast} tournaments={activeTourneys} setTournaments={setActiveTourneys} onAddBooking={addBooking}/>}
        </>}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISCOVER VIEW
// ═══════════════════════════════════════════════════════════════════════════════
function DiscoverView({ onSelectClub, allTournaments=[], currentUser, onRegisterTournament, onRegisterClub, regClubs=[] }) {
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState("");
  const [discoverTab, setDiscoverTab] = useState("clubs");
  const allClubs = [
    ...CLUBS,
    ...regClubs.map(c=>({
      id:c.id, name:c.name, city:c.city, district:c.city, region:c.region||"all", isRegistered:true,
      address:c.address, phone:c.phone, email:c.email,
      desc:`Clube de padel em ${c.city}.`,
      courts: Array.isArray(c.courts)?c.courts.length:(c.courts||1),
      indoor:c.indoor||1, outdoor:c.outdoor||0,
      priceDay:c.priceDay||3, priceNight:c.priceNight||4,
      nightFrom:c.nightFrom||"18", open:`${c.openFrom||"08"}–${c.openTo||"22"}h`,
      amenities:c.amenities||[], tags:[], highlight:false,
    }))
  ];
  const filtered = allClubs.filter(c=>(region==="all"||c.region===region)&&(!search||c.name.toLowerCase().includes(search.toLowerCase())||c.city.toLowerCase().includes(search.toLowerCase())));
  const rc = (id)=>CLUBS.filter(c=>c.region===id).length;

  return (
    <div className="pt-page">
      {/* HERO */}
      <section className="pt-hero">
        <div className="pt-eyebrow"><span className="pt-edot"/>Padel perto de ti</div>
        <h1 className="pt-h1">O teu jogo<br/>começa <em>aqui</em></h1>
        <p className="pt-sub">Descobre clubes, reserva campos e inscreve-te em torneios de forma rápida, simples e sem complicações.</p>
        <div className="pt-search">
          <span className="pt-search-ic"><I n="srch" s={16} c="#B5B0A8"/></span>
          <input className="pt-si" placeholder="Clube ou cidade…" value={search} onChange={e=>setSearch(e.target.value)}/>
          <div className="pt-sdiv"/>
          <button className="pt-sbtn">Pesquisar</button>
        </div>
        <div className="pt-stats">
          {[{v:"47",l:"Clubes"},{v:"312",l:"Campos"},{v:"28k",l:"Jogadores"},{v:"18",l:"Distritos"}].map(s=>(
            <div key={s.l} className="pt-stat"><div className="pt-sv">{s.v}</div><div className="pt-sl">{s.l}</div></div>
          ))}
        </div>
      </section>

      <section style={{maxWidth:1040,margin:"-18px auto 0",padding:"0 20px",position:"relative",zIndex:2,textAlign:"center"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:26}}>
          {[
            {t:"Marca em segundos",s:"Escolhe dia, hora e campo sem telefonemas."},
            {t:"Torneios perto de ti",s:"Encontra inscrições abertas e acompanha quadros."},
            {t:"Os teus jogos",s:"Consulta reservas e inscrições no mesmo sítio."},
            {t:"Clubes de confiança",s:"Informação clara sobre preços, horários e contactos."},
          ].map(x=>(
            <div key={x.t} style={{padding:"14px 12px"}}>
              <div style={{fontSize:13,fontWeight:800,color:"#141210",marginBottom:7}}>{x.t}</div>
              <div style={{fontSize:12,color:"#7A766F",lineHeight:1.55,maxWidth:205,margin:"0 auto"}}>{x.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DISCOVER TABS */}
      <div style={{maxWidth:1040,margin:"0 auto",padding:"32px 20px 0",display:"flex",justifyContent:"center"}}>
        <div style={{display:"inline-flex",gap:2,background:"rgba(0,0,0,.06)",borderRadius:12,padding:4}}>
          <button onClick={()=>setDiscoverTab("clubs")} style={{padding:"10px 32px",borderRadius:9,border:"none",background:discoverTab==="clubs"?"#141210":"transparent",color:discoverTab==="clubs"?"#F4F0E8":"#7A766F",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .18s",letterSpacing:"-.2px"}}>Clubes</button>
          <button onClick={()=>setDiscoverTab("tournaments")} style={{padding:"10px 32px",borderRadius:9,border:"none",background:discoverTab==="tournaments"?"#141210":"transparent",color:discoverTab==="tournaments"?"#F4F0E8":"#7A766F",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .18s",letterSpacing:"-.2px"}}>Torneios</button>
        </div>
      </div>

      {discoverTab==="tournaments" && <DiscoverTournaments allTournaments={allTournaments} onRegister={onRegisterTournament} currentUser={currentUser}/>}
      {discoverTab==="clubs" && <>
      {/* CLUBS SECTION */}
      <div className="pt-sec">
        <div className="pt-sech" style={{flexDirection:"column",alignItems:"center",gap:8}}>
          <h2 className="pt-sect" style={{textAlign:"center"}}>Clubes</h2>
          <p style={{fontSize:13,color:"#7A766F",textAlign:"center",margin:0}}>Encontra clubes perto de ti.</p>
        </div>
        <div className="pt-rgs">
          {REGIONS.map(r=>(
            <div key={r.id} className={`pt-rg ${region===r.id?"on":""}`} onClick={()=>{setRegion(r.id);setSearch("");}}>
              {r.icon} {r.label}
              {r.id!=="all"&&<span className="pt-rgc">({rc(r.id)})</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-clubs">
        {filtered.length===0 ? (
          <div className="pt-empty">
            <span className="pt-empty-icon">🎾</span>
            <div className="pt-empty-t">Sem clubes nesta região</div>
            <div className="pt-empty-s">Experimenta outra zona ou vê todos os clubes.</div>
            <button className="pt-empty-btn" onClick={()=>setRegion("all")}>Ver todos</button>
          </div>
        ) : (
          <div className="pt-grid">
            {filtered.map((c,i)=><ClubCard key={c.id} club={c} delay={i*0.04} onSelect={()=>onSelectClub(c)}/>)}
          </div>
        )}
      </div>
    </> /* end clubs tab */}
    </div>
  );
}

function ClubCard({ club, delay, onSelect }) {
  return (
    <div className="pt-card" style={{animationDelay:`${delay}s`}} onClick={onSelect}>
      <div className="pt-cbar"/>
      <div className="pt-ctop">
        <div style={{flex:1,minWidth:0}}>
          <div className="pt-cname">{club.name}</div>
          <div className="pt-cloc">📍 {club.city}, {club.district}</div>
          {club.phone&&<div style={{fontSize:10,color:"#B5B0A8",marginTop:2}}>{club.phone}</div>}
        </div>

      </div>
      <div className="pt-cdesc">{club.desc}</div>
      <div className="pt-cstats">
        <div className="pt-cs"><div className="pt-csv">{club.courts}</div><div className="pt-csl">Campos</div></div>
        <div className="pt-cs"><div className="pt-csv">{club.indoor}</div><div className="pt-csl">Indoor</div></div>
        <div className="pt-cs"><div className="pt-csv">{club.outdoor}</div><div className="pt-csl">Outdoor</div></div>
      </div>
      <div className="pt-ctags">
        {(club.amenities||[]).map(id=>{const a=AMENITIES.find(x=>x.id===id);return a?<span key={id} className="pt-ctag">{a.icon} {a.label}</span>:null;})}
        <span className="pt-ctag">⏰ {club.open}</span>
      </div>
      <div className="pt-cfoot">
        <div><span className="pt-cprice-v">{club.priceDay}€</span><span className="pt-cprice-r"> – {club.priceNight}€/jog.</span></div>
        <button className="pt-ccta" onClick={e=>{e.stopPropagation();onSelect();}}>Reservar →</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PORTAL VIEW
// ═══════════════════════════════════════════════════════════════════════════════
function PortalView({ club, bookings, blocks, onBook, onBack, tournaments, bookingsAll, onCancelBooking, onJoinWaitlist, currentUser, onRegisterTournament, pendingTournamentReg, onClearPendingReg }) {
  const [portalTab, setPortalTab] = useState("reserve"); // "reserve" | "mybookings" | "tournaments"
  useEffect(()=>{ if(pendingTournamentReg){ setPortalTab("tournaments"); } },[pendingTournamentReg]);
  const [waitlistSlot, setWaitlistSlot] = useState(null);
  const [selDay,  setDay]   = useState(null);
  const [selDur,  setDur]   = useState(null);
  const [selTime, setTime]  = useState(null);
  const [selCt,   setCt]    = useState(null);
  const [sheet,   setSheet] = useState(false);
  const [success, setSucc]  = useState(null);

  // Use adminCfg priceDay/priceNight or fallback from club object
  const priceD = club.priceDay   || club.priceFrom || 3;
  const priceN = club.priceNight || club.priceTo   || 4;
  const nf     = parseInt(club.nightFrom||18);
  const slots  = genSlots(club.openFrom||"08", club.openTo||"22");
  const courts = Array.isArray(club.courts)
    ? club.courts.filter(c=>c.active!==false)
    : Array.from({length:club.courts||4},(_,i)=>({id:i+1,name:`Court ${i+1}`,indoor:i<(club.indoor||2),active:true}));
  const days   = FDAYS.slice(0, club.advanceDays||14);
  const openTourneys = (tournaments||[]).filter(t=>t.status==="open");

  useEffect(()=>{ setTime(null); setCt(null); },[selDay,selDur]);
  useEffect(()=>{ setCt(null); },[selTime]);

  const freeCts = (t)=>courts.filter(c=>slotFit(t,selDur||60,club.openTo||"22")&&ctFree(c.id,selDay,t,selDur||60,bookings,blocks));
  const allBlk  = (t)=>courts.length>0&&courts.every(c=>isBlocked(c.id,selDay,t,selDur||60,blocks));

  const doBook = (form)=>{
    const bk = onBook({...form,court:selCt,date:selDay,time:selTime,dur:selDur});
    setSucc({...form,court:selCt,date:selDay,time:selTime,dur:selDur,ref:bk.ref,price:isNt(selTime,nf)?priceN:priceD,club,requireApproval:club.requireApproval});
    setSheet(false);
  };
  const reset=()=>{ setSucc(null); setDay(null); setDur(null); setTime(null); setCt(null); };

  if(success) return <PortalSuccess data={success} onBack={reset}/>;

  const sn=(n)=>{
    const ok=[true,!!selDay,!!selDay&&!!selDur,!!selDay&&!!selDur&&!!selTime];
    return ok[n-1]?{background:"#141210",color:"#F4F0E8"}:{background:"rgba(0,0,0,0.07)",color:"#B5B0A8"};
  };
  const showBar = !!(selDay&&selDur&&selTime&&selCt);

  return (
    <div className="pt-portal">
      {/* STICKY NAV */}
      <div className="pt-pnav">
        <button className="pt-pback" onClick={onBack}><I n="back" s={14}/> Clubes</button>
        <span className="pt-pname">{club.name||"Clube"}</span>
        <div style={{display:"flex",background:"rgba(0,0,0,.07)",borderRadius:7,padding:"2px",gap:"2px"}}>
          <button onClick={()=>setPortalTab("reserve")} style={{padding:"4px 10px",borderRadius:5,fontSize:11,fontWeight:600,border:"none",background:portalTab==="reserve"?"#141210":"transparent",color:portalTab==="reserve"?"#F4F0E8":"#7A766F",cursor:"pointer",fontFamily:"inherit"}}>Reservar</button>
          <button onClick={()=>setPortalTab("mybookings")} style={{padding:"4px 10px",borderRadius:5,fontSize:11,fontWeight:600,border:"none",background:portalTab==="mybookings"?"#141210":"transparent",color:portalTab==="mybookings"?"#F4F0E8":"#7A766F",cursor:"pointer",fontFamily:"inherit"}}>As Minhas</button>
          <button onClick={()=>setPortalTab("tournaments")} style={{padding:"4px 10px",borderRadius:5,fontSize:11,fontWeight:600,border:"none",background:portalTab==="tournaments"?"#141210":openTourneys.length?"#DDF7E7":"transparent",color:portalTab==="tournaments"?"#F4F0E8":openTourneys.length?"#0F6B3A":"#7A766F",cursor:"pointer",fontFamily:"inherit"}}>Torneios{openTourneys.length?` (${openTourneys.length})`:""}</button>
        </div>
      </div>

      {portalTab==="mybookings"&&<MyBookings bookings={bookingsAll||[]} cfg={club} onCancelBooking={onCancelBooking||(()=>{})}/>}
      {portalTab==="tournaments"&&<TournamentPortalView tournaments={tournaments||[]} onRegister={onRegisterTournament||(()=>{})}/>}
      {portalTab==="reserve"&&<>
      {/* HERO */}
      <div className="pt-phero">
        <div className="pt-phero-grid"/>
        <div className="pt-phero-content">
          <div className="pt-phero-live">Reservas Online</div>
          <div className="pt-phero-title">{club.name||"Padel Club"}</div>
          <div className="pt-phero-sub">{club.address||club.city||""}</div>
          {(club.address||club.city)&&(
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((club.address||club.city||"")+" padel")}`}
              target="_blank"
              rel="noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:10,padding:"6px 12px",borderRadius:99,background:"rgba(0,0,0,.06)",border:"1px solid rgba(0,0,0,.1)",color:"#141210",fontSize:11,fontWeight:600,textDecoration:"none",letterSpacing:".3px",transition:"background .15s"}}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {club.address||club.city}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
          )}
          <div className="pt-phero-info">
            <span>☀️ Diurno <b>{priceD}€/jog.</b></span>
            <span>🌙 Noturno <b>{priceN}€/jog.</b> <span style={{opacity:.5}}>a partir das {nf}h</span></span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10,maxWidth:360,margin:"22px auto 0"}}>
            <div style={{background:"rgba(255,255,255,.72)",border:"1px solid rgba(0,0,0,.08)",borderRadius:14,padding:"13px 14px",boxShadow:"0 10px 26px rgba(0,0,0,.04)",textAlign:"left"}}>
              <div style={{fontSize:10,fontWeight:800,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1px",marginBottom:3}}>Campos</div>
              <div style={{fontSize:24,fontWeight:900,color:"#141210",letterSpacing:"-.8px",lineHeight:1}}>{courts.length}</div>
              <div style={{fontSize:11,color:"#7A766F",marginTop:4}}>disponíveis online</div>
            </div>
            <div style={{background:"rgba(255,255,255,.72)",border:"1px solid rgba(0,0,0,.08)",borderRadius:14,padding:"13px 14px",boxShadow:"0 10px 26px rgba(0,0,0,.04)",textAlign:"left"}}>
              <div style={{fontSize:10,fontWeight:800,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1px",marginBottom:3}}>Horário</div>
              <div style={{fontSize:24,fontWeight:900,color:"#141210",letterSpacing:"-.8px",lineHeight:1}}>{club.openFrom||"08"}–{club.openTo||"22"}</div>
              <div style={{fontSize:11,color:"#7A766F",marginTop:4}}>reservas abertas</div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap",marginTop:14}}>
            {club.phone&&<a href={`tel:${club.phone}`} style={{fontSize:12,fontWeight:700,color:"#141210",textDecoration:"none",background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:99,padding:"7px 12px"}}>{club.phone}</a>}
            {club.email&&<a href={`mailto:${club.email}`} style={{fontSize:12,fontWeight:700,color:"#141210",textDecoration:"none",background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:99,padding:"7px 12px"}}>{club.email}</a>}
          </div>
        </div>
      </div>

      {/* BOOKING FLOW */}
      <div className="pt-pbody">
        {openTourneys.length>0&&(
          <button
            onClick={()=>setPortalTab("tournaments")}
            style={{width:"100%",border:"1px solid rgba(0,0,0,.10)",background:"#FFFFFF",borderRadius:16,padding:"14px 16px",margin:"0 0 24px",display:"flex",alignItems:"center",gap:13,textAlign:"left",cursor:"pointer",fontFamily:"inherit",boxShadow:"0 12px 34px rgba(20,18,16,.07)"}}
          >
            <span style={{width:38,height:38,borderRadius:12,background:"#141210",color:"#F4F0E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>🏆</span>
            <span style={{flex:1,minWidth:0}}>
              <span style={{display:"block",fontSize:10,fontWeight:900,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:2}}>
                Inscrições abertas
              </span>
              <span style={{display:"block",fontSize:14,fontWeight:900,color:"#141210",letterSpacing:"-.2px",lineHeight:1.15}}>
                {openTourneys.length===1?"Torneio com inscrições abertas":"Torneios com inscrições abertas"}
              </span>
              <span style={{display:"block",fontSize:12,color:"#7A766F",marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {openTourneys.length===1?openTourneys[0].name:`${openTourneys.length} torneios disponíveis neste clube`}
              </span>
            </span>
            <span style={{fontSize:12,fontWeight:900,color:"#141210",whiteSpace:"nowrap",border:"1px solid rgba(0,0,0,.12)",borderRadius:99,padding:"7px 11px",background:"#F4F0E8"}}>Ver →</span>
          </button>
        )}

        {/* 1 — DAY */}
        <div className="pt-psec">
          <div className="pt-pstep">
            <div className="pt-pstep-n" style={sn(1)}>1</div>
            <span className={`pt-pstep-lbl ${true?"act":""}`}>Escolhe o dia</span>
          </div>
          <div className="pt-days">
            {days.map(d=>(
              <div key={d.date} className={`pt-day ${selDay===d.date?"on":""}`} onClick={()=>{setDay(d.date);setTime(null);setCt(null);}}>
                <span className="pt-day-wd">{d.wd.slice(0,3)}</span>
                <span className="pt-day-d">{d.day}</span>
                <span className="pt-day-m">{d.mon.slice(0,3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2 — DURATION */}
        {selDay&&(
          <div className="pt-psec">
            <div className="pt-pstep">
              <div className="pt-pstep-n" style={sn(2)}>2</div>
              <span className={`pt-pstep-lbl act`}>Duração do jogo</span>
            </div>
            <div className="pt-durs">
              {(club.durations||[60,90,120]).map(m=>(
                <button key={m} className={`pt-dur ${selDur===m?"on":""}`} onClick={()=>{setDur(m);setTime(null);setCt(null);}}>{durLbl(m)}</button>
              ))}
            </div>
          </div>
        )}

        {/* 3 — SLOT */}
        {selDay&&selDur&&(
          <div className="pt-psec">
            <div className="pt-pstep">
              <div className="pt-pstep-n" style={sn(3)}>3</div>
              <span className="pt-pstep-lbl act">Escolhe o horário</span>
            </div>
            <div className="pt-slots">
              {slots.filter(t=>slotFit(t,selDur,club.openTo||"22")).map(t=>{
                const free = freeCts(t);
                const blk  = allBlk(t);
                const full = !blk&&free.length===0;
                const sel  = selTime===t;
                const night= isNt(t,nf);
                return (
                  <div key={t} className={`pt-slot ${blk?"pt-blk":full?"pt-full":sel?"on":""}`} onClick={()=>!blk&&!full&&(setTime(t),setCt(null))} onDoubleClick={()=>full&&setWaitlistSlot({day:selDay,time:t,dur:selDur})}>
                    <div className="pt-slot-t">{t}</div>
                    {blk&&<div className="pt-slot-sub">🔒</div>}
                    {!blk&&night&&!sel&&<div className="pt-night-tag">Noturno</div>}
                    {!blk&&!full&&!sel&&!night&&<div className="pt-slot-sub">{free.length} livre{free.length!==1?"s":""}</div>}
                    {full&&<div className="pt-slot-sub">Esgotado</div>}
                    {full&&<div style={{fontSize:7,color:"rgba(0,0,0,.3)",marginTop:1}}>2× lista esp.</div>}
                    {sel&&<div className="pt-slot-sub" style={{color:"#F4F0E8"}}>✓</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4 — COURT */}
        {selDay&&selDur&&selTime&&(
          <div className="pt-psec">
            <div className="pt-pstep">
              <div className="pt-pstep-n" style={sn(4)}>4</div>
              <span className="pt-pstep-lbl act">Escolhe o campo</span>
            </div>
            {freeCts(selTime).length===0
              ? <div style={{padding:"18px 0",textAlign:"center",fontSize:13,color:"#B5B0A8"}}>Sem campos disponíveis para este horário.</div>
              : <div className="pt-courts">
                  {freeCts(selTime).map(c=>(
                    <div key={c.id} className={`pt-court ${selCt?.id===c.id?"on":""}`} onClick={()=>setCt(c)}>
                      <div className="pt-court-name">{c.name}</div>
                      <div className="pt-court-det">{c.indoor?"🏢 Interior":"☀️ Exterior"}</div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
        <div style={{height:120}}/>
      </div>
      </>
      }
      {/* SUMMARY BAR */}
      {portalTab==="reserve"&&<div className={`pt-sbar ${showBar?"vis":"hid"}`}>
        <div className="pt-sbar-info">
          <div className="pt-sbar-main">{selCt?.name} · {selTime} · {selDur&&durLbl(selDur)}</div>
          <div className="pt-sbar-sub">{selDay&&fmtLong(selDay)}</div>
        </div>
        <div className="pt-sbar-price">
          <div className="pt-sbar-val">{selTime?(isNt(selTime,nf)?priceN:priceD):""}€</div>
          <div className="pt-sbar-unit">por jogador</div>
        </div>
        <button className="pt-sbar-btn" onClick={()=>setSheet(true)}>Reservar →</button>
      </div>}
      {portalTab==="reserve"&&waitlistSlot&&<WaitlistModal club={club} day={waitlistSlot.day} time={waitlistSlot.time} dur={waitlistSlot.dur} onClose={()=>setWaitlistSlot(null)} onJoin={(e)=>{onJoinWaitlist&&onJoinWaitlist(e);setWaitlistSlot(null);}}/>}
      {portalTab==="reserve"&&sheet&&<BookSheet club={club} court={selCt} day={selDay} time={selTime} dur={selDur} priceD={priceD} priceN={priceN} nf={nf} currentUser={currentUser} onClose={()=>setSheet(false)} onConfirm={doBook}/>}
    </div>
  );
}

function BookSheet({ club, court, day, time, dur, priceD, priceN, nf, onClose, onConfirm }) {
  const [f,setF]=useState({name:"",email:"",phone:"",payment:"local"});
  const [e,setE]=useState({});
  const [ld,setLd]=useState(false);
  const set=(k,v)=>{setF(p=>({...p,[k]:v}));setE(p=>({...p,[k]:false}));};
  const val=()=>{const e={};if(!f.name.trim())e.name="Obrigatório";if(!f.email.trim()||!/\S+@\S+\.\S+/.test(f.email))e.email="Inválido";if(!f.phone.trim()||f.phone.replace(/\D/g,"").length<9)e.phone="Inválido";if(!f.payment)e.payment="Escolhe";return e;};
  const submit=async()=>{const ev=val();if(Object.keys(ev).length){setE(ev);return;}setLd(true);await new Promise(r=>setTimeout(r,900));onConfirm(f);};
  const night=isNt(time,nf);
  const price=night?priceN:priceD;
  const endH=addMins(time||"00:00",dur||60);
  return (
    <div className="pt-sbg" onClick={ev=>ev.target===ev.currentTarget&&onClose()}>
      <div className="pt-sheet">
        <div className="pt-sheet-handle"/>
        <div className="pt-sheet-hd">
          <div>
            <div className="pt-sheet-tag">Confirmação de Reserva</div>
            <div className="pt-sheet-title">Os teus<br/>dados</div>
          </div>
          <button className="pt-sheet-close" onClick={onClose}><I n="x" s={13}/></button>
        </div>
        <div className="pt-bcard">
          <div className="pt-bcard-l">
            <div className="pt-bcard-name">{court?.name} · {time}–{endH}</div>
            <div className="pt-bcard-det">{fmtLong(day)}<br/>{durLbl(dur||60)} · {court?.indoor?"Interior":"Exterior"} · {night?"🌙 Noturno":"☀️ Diurno"}</div>
          {(club.address||club.city)&&(
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((club.address||club.city||"")+" padel")}`} target="_blank" rel="noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:7,fontSize:11,color:"rgba(0,0,0,.5)",textDecoration:"none",background:"rgba(0,0,0,.05)",padding:"4px 10px",borderRadius:99,fontWeight:600}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {club.address||club.city}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
          )}
          </div>
          <div className="pt-bcard-price"><div className="pt-bcard-val">{price}€</div><div className="pt-bcard-unit">por jogador</div></div>
        </div>
        <div className="pt-form">
          <div>
            <div className="pt-form-lbl">Dados pessoais</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div><input className={`pt-fi ${e.name?"err":""}`} placeholder="Nome completo" value={f.name} onChange={ev=>set("name",ev.target.value)}/>{e.name&&<div className="pt-errmsg">{e.name}</div>}</div>
              <div><input type="email" inputMode="email" className={`pt-fi ${e.email?"err":""}`} placeholder="Email" value={f.email} onChange={ev=>set("email",ev.target.value)}/>{e.email&&<div className="pt-errmsg">{e.email}</div>}</div>
              <div><input type="tel" inputMode="tel" className={`pt-fi ${e.phone?"err":""}`} placeholder="Telemóvel" value={f.phone} onChange={ev=>set("phone",ev.target.value)}/>{e.phone&&<div className="pt-errmsg">{e.phone}</div>}</div>
            </div>
          </div>

        </div>
        <div className="pt-foot">
          <button className="pt-submit" style={{background:"rgba(0,0,0,0.08)",color:"#7A766F",border:"1px solid rgba(0,0,0,0.1)"}} onClick={onClose}>Cancelar</button>
          <button className="pt-submit" style={{background:"#141210",color:"#F4F0E8"}} onClick={submit} disabled={ld}>{ld?<><Spin/> A processar…</>:"Confirmar Reserva"}</button>
        </div>
      </div>
    </div>
  );
}

function PortalSuccess({ data, onBack }) {
  const endH=addMins(data.time||"00:00",data.dur||60);
  const night=isNt(data.time,parseInt(data.club.nightFrom||18));
  const msg=encodeURIComponent(`🎾 Reservei um campo no ${data.club.name}!\n📅 ${fmtLong(data.date)}\n⏰ ${data.time}–${endH} (${durLbl(data.dur||60)})\n🏟 ${data.court.name}\n💰 ${data.price}€/jogador\n\nFaltam jogadores! Juntam-se?`);
  return (
    <div className="pt-success">
      <div className="pt-sr-ring"><div style={{position:"absolute",inset:-8,borderRadius:"50%",border:"1px solid rgba(255,255,255,.1)",animation:"ptRingPulse 2.5s infinite"}}/><span className="pt-sr-check">✓</span></div>
      <div className="pt-s-title">{data.requireApproval?"Pedido\nEnviado!":"Reserva\nConfirmada!"}</div>
      <p className="pt-s-sub">Receberás confirmação por email. Até ao campo!</p>
      <div className="pt-s-card">
        {[{k:"Ref.",v:data.ref},{k:"Campo",v:data.court.name},{k:"Data",v:fmtLong(data.date)},{k:"Horário",v:`${data.time}–${endH}`},{k:"Duração",v:durLbl(data.dur||60)},{k:"Tarifa",v:night?"🌙 Noturno":"☀️ Diurno"},{k:"Preço",v:`${data.price}€/jogador`},{k:"Pagamento",v:PAY.find(p=>p.id===data.payment)?.label}].map(r=>(
          <div key={r.k} className="pt-s-row"><span className="pt-s-k">{r.k}</span><span className="pt-s-v" style={r.k==="Preço"?{fontWeight:800,fontSize:14}:{}}>{r.v}</span></div>
        ))}
      </div>
      {(data.club.address||data.club.city)&&(
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((data.club.address||data.club.city||"")+" padel")}`} target="_blank" rel="noreferrer" style={{textDecoration:"none",display:"block",width:"100%",maxWidth:320,marginTop:22}}>
          <button style={{width:"100%",padding:"13px 20px",borderRadius:11,border:"1.5px solid rgba(255,255,255,.15)",background:"transparent",color:"rgba(255,255,255,.6)",fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Ver no Google Maps
          </button>
        </a>
      )}
      <div className="pt-s-actions">
        <a href={`https://wa.me/?text=${msg}`} target="_blank" rel="noreferrer" style={{textDecoration:"none",display:"block"}}>
          <button className="pt-wa-btn"><I n="wa" s={17} c="#fff" w={0}/><svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>Convidar via WhatsApp</button>
        </a>
        <button className="pt-back-btn" onClick={onBack}>← Nova reserva</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN VIEW
// ═══════════════════════════════════════════════════════════════════════════════
function AdminView({cfg,setCfg,bookings,contacts,blocks,notifs,onConfirm,onCancel,onUpdateCt,onDeleteCt,onAddBlock,onDelBlock,showToast,toast,tournaments,setTournaments,onAddBooking}) {
  const [view,setView]=useState("dash");
  const [showN,setShowN]=useState(false);
  const [srch,setSrch]=useState("");
  const nRef=useRef(null);
  const unread=notifs.filter(n=>!n.read).length;
  const pending=bookings.filter(b=>b.status==="pending").length;
  useEffect(()=>{const h=(e)=>{if(nRef.current&&!nRef.current.contains(e.target))setShowN(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);
  const TABS=[{id:"dash",ic:"grid",lbl:"Dashboard"},{id:"agenda",ic:"cal",lbl:"Agenda",badge:pending},{id:"clients",ic:"usr",lbl:"Clientes"},{id:"torneiros",ic:"star",lbl:"Torneios"},{id:"config",ic:"set",lbl:"Config"}];
  const TITLES={dash:"Dashboard",agenda:"Agenda",clients:"Clientes",config:"Configurações"};

  return (
    <div className="pt-admin">
      {/* SIDEBAR */}
      <aside className="pt-asb">
        <div className="pt-asbl">
          <div className="pt-asbl-av">{cfg.name.slice(0,2).toUpperCase()}</div>
          <div><div className="pt-asbl-name">{cfg.name}</div><div className="pt-asbl-role">Admin</div></div>
        </div>
        <div className="pt-anz">Menu</div>
        {TABS.map(t=>(
          <div key={t.id} className={`pt-ani ${view===t.id?"on":""}`} onClick={()=>setView(t.id)}>
            <I n={t.ic} s={14} c="currentColor"/><span style={{flex:1}}>{t.lbl}</span>
            {t.badge>0&&<span className="pt-abadge">{t.badge}</span>}
          </div>
        ))}
        <div className="pt-afoot">
          <div className="pt-afoot-card">
            <div style={{fontSize:11,fontWeight:800,color:"#EDE9E1",marginBottom:2,letterSpacing:"-.2px"}}>{cfg.name}</div>
            <div style={{fontSize:10,color:"#7A766F"}}>{cfg.courts.filter(c=>c.active).length} campos · {cfg.priceDay}€–{cfg.priceNight}€/jog.</div>
            <div style={{marginTop:8,height:1,background:"rgba(255,255,255,.1)"}}/>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="pt-amain">
        <div className="pt-atb" style={{position:"relative"}}>
          <div className="pt-atb-title">{TITLES[view]}</div>
          {view==="clients"&&(
            <div className="pt-atb-srch">
              <I n="srch" s={12} c="#3D3A35"/>
              <input placeholder="Pesquisar…" value={srch} onChange={e=>setSrch(e.target.value)}/>
            </div>
          )}
          <div ref={nRef} style={{position:"relative"}}>
            <div className="pt-aib" onClick={()=>setShowN(v=>!v)}><I n="bell" s={15}/>{unread>0&&<span className="pt-andot"/>}</div>
            {showN&&<NotifPanel notifs={notifs} onMarkAll={()=>setNotifs&&null}/>}
          </div>
        </div>

        <div className="pt-acontent">
          {view==="dash"    && <AdminDash    cfg={cfg} bookings={bookings} contacts={contacts} onSetView={setView}/>}
          {view==="agenda"  && <AdminAgenda  cfg={cfg} bookings={bookings} blocks={blocks} onConfirm={onConfirm} onCancel={onCancel} onAddBlock={onAddBlock} onDelBlock={onDelBlock} onAddBooking={onAddBooking}/>}
          {view==="clients" && <AdminClients contacts={contacts} bookings={bookings} cfg={cfg} search={srch} onUpdate={onUpdateCt} onDelete={onDeleteCt} onCancel={onCancel}/>}
          {view==="config"  && <AdminConfig  cfg={cfg} setCfg={setCfg} showToast={showToast}/>}
          {view==="torneiros" && <AdminTournaments tournaments={tournaments} setTournaments={setTournaments} cfg={cfg}/>}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav className="pt-abn">
        {TABS.map(t=>(
          <div key={t.id} className={`pt-abni ${view===t.id?"on":""}`} onClick={()=>setView(t.id)} style={{position:"relative"}}>
            <I n={t.ic} s={19}/>
            <span className="pt-abni-lbl">{t.lbl}</span>
            {t.badge>0&&<span className="pt-abni-badge">{t.badge}</span>}
          </div>
        ))}
      </nav>

      {toast&&(
        <div className="pt-toast">
          <div className="pt-toast-ic"><I n="ok" s={13} c="#EDE9E1"/></div>
          <span style={{fontSize:12,fontWeight:600,color:"#EDE9E1"}}>{toast}</span>
        </div>
      )}
    </div>
  );
}

function NotifPanel({ notifs, onMarkAll }) {
  return (
    <div className="pt-npanel">
      <div className="pt-nhd">
        <span className="pt-nhd-t">Notificações</span>
        <span style={{fontSize:11,color:"#7A766F",cursor:"pointer"}} onClick={onMarkAll}>Marcar lidas</span>
      </div>
      {notifs.slice(0,5).map(n=>(
        <div key={n.id} className={`pt-nitem ${n.read?"":"unread"}`}>
          <div className="pt-nii"><I n={n.type==="booking"?"cal":"usr"} s={12} c="#7A766F"/></div>
          <div style={{flex:1}}><div style={{fontSize:12,color:"#EDE9E1"}}>{n.msg}</div><div style={{fontSize:10,color:"#3D3A35",marginTop:2}}>{n.time}</div></div>
          {!n.read&&<div style={{width:5,height:5,borderRadius:"50%",background:"#EDE9E1",marginTop:5,flexShrink:0}}/>}
        </div>
      ))}
    </div>
  );
}

function AdminDash({ cfg, bookings, contacts, onSetView }) {
  const ac=cfg.courts.filter(c=>c.active);
  const slots=useMemo(()=>{const s=[];for(let h=parseInt(cfg.openFrom);h<parseInt(cfg.openTo);h++)s.push(`${String(h).padStart(2,"0")}:00`);return s;},[cfg]);
  const calc=(bs)=>bs.reduce((s,b)=>{const p=isNt(b.time,parseInt(cfg.nightFrom))?cfg.priceNight:cfg.priceDay;return s+(p*cfg.playersPerCourt*((b.dur||60)/60));},0);
  const b7=bookings.filter(b=>b.status==="confirmed"&&PAST7.includes(b.date));
  const occ=Math.round((b7.length/(ac.length*slots.length*7||1))*100);
  const revT=calc(bookings.filter(b=>b.status==="confirmed"&&b.date===TODAY));
  const rev7=calc(b7);
  const pend=bookings.filter(b=>b.status==="pending").length;
  const todB=bookings.filter(b=>b.date===TODAY).sort((a,b)=>a.time.localeCompare(b.time));
  const nextB=bookings.filter(b=>b.date>=TODAY&&b.status!=="cancelled").sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).slice(0,4);
  const freeToday=Math.max(0,(ac.length*slots.length)-bookings.filter(b=>b.date===TODAY&&b.status!=="cancelled").length);

  return (
    <>
      <div className="pt-acard" style={{padding:"16px",marginBottom:14,background:"#201F1C"}}>
        <div className="row g2" style={{alignItems:"flex-start",gap:14}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:18,fontWeight:800,color:"#EDE9E1",letterSpacing:"-.5px",marginBottom:4}}>Hoje no clube</div>
            <div style={{fontSize:12,color:"#7A766F",lineHeight:1.5}}>{todB.length} reserva{todB.length!==1?"s":""} hoje · {freeToday} horários livres · {pend} pendente{pend!==1?"s":""}</div>
          </div>
          <button className="pt-btn pt-btn-light pt-btn-sm" onClick={()=>onSetView("agenda")}>Abrir agenda</button>
        </div>
      </div>

      <div className="pt-akpi-grid">
        {[
          {lbl:"Receita Hoje",val:`${revT.toFixed(0)}€`,sub:`Semana: ${rev7.toFixed(0)}€`,ic:"trn"},
          {lbl:"Ocupação 7d", val:`${occ}%`,            sub:`${b7.length} confirmadas`,   ic:"pct"},
          {lbl:"Pendentes",   val:pend,                  sub:"Aguardam confirmação",        ic:"bell"},
          {lbl:"Clientes",    val:contacts.length,       sub:`${bookings.length} reservas total`,ic:"usr"},
        ].map((k,i)=>(
          <div key={k.lbl} className="pt-akpi" style={{animationDelay:`${i*.06}s`}}>
            <div className="pt-akpi-ic"><I n={k.ic} s={14} c="#EDE9E1"/></div>
            <div><div className="pt-akpi-val">{k.val}</div><div className="pt-akpi-lbl">{k.lbl}</div><div className="pt-akpi-sub">{k.sub}</div></div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginBottom:14}}>
        {[
          {t:"Confirmar pendentes",s:`${pend} por tratar`,v:"agenda"},
          {t:"Nova reserva",s:"Marcar manualmente",v:"agenda"},
          {t:"Criar torneio",s:"Quadro ou sinetas",v:"torneiros"},
          {t:"Configurar campos",s:"Horários e preços",v:"config"},
        ].map(a=>(
          <button key={a.t} onClick={()=>onSetView(a.v)} style={{textAlign:"left",padding:"13px 14px",borderRadius:11,border:"1px solid rgba(255,255,255,.07)",background:"rgba(255,255,255,.04)",cursor:"pointer",fontFamily:"inherit"}}>
            <div style={{fontSize:12,fontWeight:800,color:"#EDE9E1",marginBottom:3}}>{a.t}</div>
            <div style={{fontSize:10,color:"#7A766F"}}>{a.s}</div>
          </button>
        ))}
      </div>

      <div className="pt-2col" style={{display:"flex",flexDirection:"column",gap:12}}>
        <div className="pt-acard mb10">
          <div className="pt-ash"><span className="pt-ash-t">Próximas reservas</span><span className="pt-ash-a" onClick={()=>onSetView("agenda")}>Ver tudo →</span></div>
          {nextB.length===0?<div style={{padding:"18px 16px",textAlign:"center",fontSize:12,color:"#3D3A35"}}>Sem reservas próximas</div>
          :nextB.map(b=>{const court=cfg.courts.find(c=>c.id===b.courtId);return(
            <div key={b.id} className="pt-arow">
              <span className="pt-arow-time">{b.time}</span>
              <div className="pt-aav" style={{width:32,height:32,fontSize:11,marginRight:2}}>{ini(b.contactName)}</div>
              <div className="pt-arow-body">
                <div className="pt-arow-name">{b.contactName}</div>
                <div className="pt-arow-sub"><span className="pt-cdot" style={{background:"rgba(255,255,255,.2)"}}/>{fmtSh(b.date)} · {court?.name} · {durLbl(b.dur||60)}</div>
              </div>
              <span className={`pt-badge ${b.status==="confirmed"?"pt-ba":"pt-bw"}`}>{b.status==="confirmed"?"✓":"Pend."}</span>
            </div>
          );})}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="pt-acard" style={{padding:"14px 16px"}}>
            <div className="pt-ash" style={{padding:0,marginBottom:10}}><span className="pt-ash-t">Ocupação por Campo (7d)</span></div>
            {ac.map(c=>{const p=Math.round((bookings.filter(b=>b.courtId===c.id&&b.status==="confirmed"&&PAST7.includes(b.date)).length/(slots.length*7||1))*100);return(
              <div key={c.id} className="pt-orow">
                <div className="row g2" style={{width:68,flexShrink:0}}><span style={{fontSize:11,fontWeight:700,color:"#EDE9E1",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span></div>
                <div className="pt-obg"><div className="pt-ofill" style={{width:`${p}%`}}/></div>
                <span className="pt-opct">{p}%</span>
              </div>
            );})}
          </div>

          <div className="pt-acard" style={{padding:"14px 16px"}}>
            <div className="pt-ash" style={{padding:0,marginBottom:10}}><span className="pt-ash-t">Receita por Campo (semana)</span></div>
            {ac.map(c=>{const r=calc(bookings.filter(b=>b.courtId===c.id&&b.status==="confirmed"&&PAST7.includes(b.date)));return(
              <div key={c.id} className="row g2" style={{marginBottom:8}}><span style={{fontSize:12,fontWeight:600,flex:1,color:"#EDE9E1"}}>{c.name}</span><span style={{fontSize:12,fontWeight:700,color:"#EDE9E1"}}>{r.toFixed(0)}€</span></div>
            );})}
            <div className="bdt" style={{paddingTop:8,marginTop:4}}><div className="row"><span style={{fontSize:12,color:"#7A766F"}}>Total</span><span style={{fontSize:14,fontWeight:800,color:"#EDE9E1",marginLeft:"auto"}}>{rev7.toFixed(0)}€</span></div></div>
          </div>
        </div>
      </div>
      <div style={{marginTop:14}}>
        <div className="pt-ash" style={{padding:"0 0 10px"}}><span className="pt-ash-t">Relatório Mensal</span></div>
        <RevenueReport bookings={bookings} cfg={cfg}/>
      </div>
    </>
  );
}

function AdminAgenda({ cfg, bookings, blocks, onConfirm, onCancel, onAddBlock, onDelBlock, onAddBooking }) {
  const [tab,setTab]=useState("reservas");
  const [gridDay,setGridDay]=useState(TODAY);
  const [showNR,setShowNR]=useState(false);
  const [day,setDay]=useState(TODAY);
  const [showBM,setShowBM]=useState(false);
  const pending=bookings.filter(b=>b.status==="pending");
  const dayB=bookings.filter(b=>b.date===day).sort((a,b)=>a.time.localeCompare(b.time));
  const dayBlks=blkDate(blocks,day);
  const calc=(b)=>(isNt(b.time,parseInt(cfg.nightFrom))?cfg.priceNight:cfg.priceDay)*cfg.playersPerCourt*((b.dur||60)/60);

  return (
    <>
      <div className="pt-itabs">
        <button className={`pt-itab ${tab==="reservas"?"on":""}`} onClick={()=>setTab("reservas")}>Reservas {pending.length>0&&<span className="pt-abadge" style={{marginLeft:4}}>{pending.length}</span>}</button>
        <button className={`pt-itab ${tab==="bloqueios"?"on":""}`} onClick={()=>setTab("bloqueios")}>Bloqueios <span className="pt-abadge" style={{marginLeft:4}}>{blocks.length}</span></button>
      <button className={`pt-itab ${tab==="grid"?"on":""}`} onClick={()=>setTab("grid")}>Grelha</button>
      </div>

      {tab==="reservas"&&(
        <>
          {pending.length>0&&(
            <div className="pt-pbox mb14">
              <div className="pt-pbox-hd"><I n="bell" s={13} c="#EDE9E1"/><span style={{fontSize:12,fontWeight:800,color:"#EDE9E1"}}>Pendentes ({pending.length})</span></div>
              {pending.map(b=>{const court=cfg.courts.find(c=>c.id===b.courtId);return(
                <div key={b.id} className="pt-arow">
                  <div className="pt-aav" style={{width:32,height:32,fontSize:11}}>{ini(b.contactName)}</div>
                  <div className="pt-arow-body">
                    <div className="pt-arow-name">{b.contactName}</div>
                    <div className="pt-arow-sub">{court?.name} · {b.date} · {b.time} · {durLbl(b.dur||60)} · {calc(b).toFixed(0)}€</div>
                    <div className="pt-arow-acts"><button className="pt-btn pt-btn-light pt-btn-sm" style={{flex:1}} onClick={()=>onConfirm(b.id)}><I n="ok" s={12}/> Confirmar</button><button className="pt-btn pt-btn-del pt-btn-sm" onClick={()=>onCancel(b.id)}><I n="x" s={12}/></button></div>
                  </div>
                </div>
              );})}
            </div>
          )}
          <div className="row g2 mb14">
            <button className="pt-btn pt-btn-light pt-btn-sm mla" onClick={()=>setShowNR(true)}>+ Nova Reserva</button>
          </div>
          <div className="pt-adtabs">
            {FDAYS.slice(0,10).map(d=>(
              <div key={d.date} className={`pt-adtab ${day===d.date?"on":""}`} onClick={()=>setDay(d.date)}>
                <span className="pt-adtab-wd">{d.wd.slice(0,3)}</span>
                <span className="pt-adtab-d">{d.day}</span>
                <span className="pt-adtab-m">{d.mon.slice(0,3)}</span>
              </div>
            ))}
          </div>
          {dayBlks.length>0&&dayBlks.map(b=>(
            <div key={b.id} className="pt-blk-inline">
              <div style={{fontSize:12,fontWeight:800,color:"#EDE9E1",marginBottom:3}}>🔒 {b.reason}</div>
              <div style={{fontSize:11,color:"#7A766F"}}>{b.startTime}:00 – {b.endTime}:00 · {b.courtIds==="all"?"Todos":b.courtIds.map(id=>cfg.courts.find(c=>c.id===id)?.name).join(", ")}</div>
            </div>
          ))}
          <div className="pt-acard" style={{padding:0}}>
            <div className="pt-ash"><span className="pt-ash-t">{fmtLong(day)}</span><span style={{fontSize:11,color:"#7A766F"}}>{dayB.length} reservas</span></div>
            {dayB.length===0?<div style={{padding:"22px 16px",textAlign:"center",fontSize:12,color:"#3D3A35"}}>Sem reservas</div>
            :dayB.map(b=>{const court=cfg.courts.find(c=>c.id===b.courtId);const night=isNt(b.time,parseInt(cfg.nightFrom));return(
              <div key={b.id} className="pt-arow">
                <span className="pt-arow-time">{b.time}</span>
                <div className="pt-aav" style={{width:32,height:32,fontSize:11}}>{ini(b.contactName)}</div>
                <div className="pt-arow-body">
                  <div className="pt-arow-name">{b.contactName}</div>
                  <div className="pt-arow-sub">{court?.name} · {durLbl(b.dur||60)} · {calc(b).toFixed(0)}€{night?" · 🌙":""}</div>
                  {b.status==="pending"&&<div className="pt-arow-acts"><button className="pt-btn pt-btn-light pt-btn-sm" style={{flex:1}} onClick={()=>onConfirm(b.id)}><I n="ok" s={12}/> Confirmar</button><button className="pt-btn pt-btn-del pt-btn-sm" onClick={()=>onCancel(b.id)}><I n="x" s={12}/></button></div>}
                </div>
                <span className={`pt-badge ${b.status==="confirmed"?"pt-ba":"pt-bw"}`}>{b.status==="confirmed"?"✓":"Pend."}</span>
              </div>
            );})}
          </div>
        </>
      )}

      {tab==="grid"&&(
        <>
          <div className="row g2 mb14">
            <button className="pt-btn pt-btn-light pt-btn-sm mla" onClick={()=>setShowNR(true)}>+ Nova Reserva</button>
          </div>
          <div className="pt-adtabs">
            {FDAYS.slice(0,7).map(d=>(
              <div key={d.date} className={`pt-adtab ${gridDay===d.date?"on":""}`} onClick={()=>setGridDay(d.date)}>
                <span className="pt-adtab-wd">{d.wd.slice(0,3)}</span><span className="pt-adtab-d">{d.day}</span><span className="pt-adtab-m">{d.mon.slice(0,3)}</span>
              </div>
            ))}
          </div>
          <div className="pt-acard" style={{padding:"14px 16px"}}>
            <OccupancyGrid cfg={cfg} bookings={bookings} blocks={blocks} day={gridDay}/>
          </div>
        </>
      )}

      {tab==="bloqueios"&&(
        <>
          <div className="row g2 mb14">
            <div><div style={{fontSize:13,fontWeight:800,color:"#EDE9E1",letterSpacing:"-.2px"}}>Bloqueios activos</div><div style={{fontSize:11,color:"#7A766F",marginTop:2}}>Horários indisponíveis no portal</div></div>
            <button className="pt-btn pt-btn-light pt-btn-sm mla" onClick={()=>setShowBM(true)}><I n="plus" s={13}/> Novo</button>
          </div>
          {blocks.length===0?<div className="pt-acard" style={{padding:"28px",textAlign:"center",color:"#3D3A35",fontSize:13}}>Sem bloqueios. Cria um para aulas ou manutenção.</div>
          :blocks.map(b=>{const cat=BLOCK_CAT[b.category]||BLOCK_CAT.other;return(
            <div key={b.id} className="pt-blk-card">
              <div className="pt-blk-hd">
                <div className="pt-blk-strip"/>
                <div style={{flex:1}}><div className="pt-blk-reason">{b.reason}</div><div style={{fontSize:11,color:"#7A766F",marginTop:2}}>{b.startTime}:00–{b.endTime}:00 · {b.type==="recurring"?`Recorrente: ${b.weekdays.map(w=>WD_SHORT[w]).join(", ")}`:fmtSh(b.date)}</div></div>
                <button className="pt-btn pt-btn-del pt-btn-sm" onClick={()=>onDelBlock(b.id)}><I n="trash" s={13}/></button>
              </div>
              <div className="pt-blk-meta"><span className="pt-blk-tag">{cat.label}</span><span className="pt-blk-tag">{b.courtIds==="all"?"Todos":b.courtIds.map(id=>cfg.courts.find(c=>c.id===id)?.name||"—").join(", ")}</span><span className="pt-blk-tag">{b.type==="recurring"?"Recorrente":"Data única"}</span></div>
            </div>
          );})}
          {showBM&&<BlockModal cfg={cfg} onSave={(b)=>{onAddBlock(b);setShowBM(false);}} onClose={()=>setShowBM(false)}/>}
        </>
      )}
      {showNR&&<NewBookingModal cfg={cfg} day={day} bookings={bookings} blocks={blocks} onSave={(bk)=>{onAddBooking&&onAddBooking(bk);setShowNR(false);}} onClose={()=>setShowNR(false)}/>}
    </>
  );
}

function BlockModal({ cfg, onSave, onClose }) {
  const slots=useMemo(()=>{const s=[];for(let h=parseInt(cfg.openFrom);h<parseInt(cfg.openTo);h++)s.push(`${String(h).padStart(2,"0")}:00`);return s;},[cfg]);
  const [f,setF]=useState({type:"recurring",weekdays:[],date:TODAY,courtIds:"all",selCts:[],startTime:cfg.openFrom,endTime:String(parseInt(cfg.openFrom)+2),reason:"",category:"lessons"});
  const [err,setErr]=useState("");
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const toggleWD=(w)=>set("weekdays",f.weekdays.includes(w)?f.weekdays.filter(x=>x!==w):[...f.weekdays,w].sort((a,b)=>a-b));
  const toggleC=(id)=>{if(f.courtIds==="all"){set("courtIds","specific");set("selCts",[id]);return;}const nc=f.selCts.includes(id)?f.selCts.filter(x=>x!==id):[...f.selCts,id];set("selCts",nc);};
  const save=()=>{
    if(!f.reason.trim()){setErr("Indica o motivo.");return;}
    if(f.type==="recurring"&&f.weekdays.length===0){setErr("Selecciona pelo menos um dia.");return;}
    if(f.courtIds==="specific"&&f.selCts.length===0){setErr("Selecciona pelo menos um campo.");return;}
    if(parseInt(f.endTime)<=parseInt(f.startTime)){setErr("Hora fim deve ser depois do início.");return;}
    onSave({type:f.type,weekdays:f.weekdays,date:f.date,courtIds:f.courtIds==="all"?"all":f.selCts,startTime:f.startTime,endTime:f.endTime,reason:f.reason,category:f.category});
  };
  return (
    <div className="pt-mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="pt-modal">
        <div className="pt-modal-handle"/>
        <div className="pt-modal-hd"><span className="pt-modal-tt">Novo Bloqueio</span><button className="pt-modal-close" onClick={onClose}><I n="x" s={13}/></button></div>
        <div className="pt-modal-body">
          {err&&<div style={{padding:"8px 12px",background:"rgba(255,107,107,.1)",border:"1px solid rgba(255,107,107,.2)",borderRadius:"8px",fontSize:12,color:"#FF6B6B"}}>{err}</div>}
          <div className="pt-sfg"><label className="pt-sfl">Motivo</label><input className="pt-mfi" placeholder="Ex: Aulas de padel…" value={f.reason} onChange={e=>set("reason",e.target.value)}/></div>
          <div className="pt-sfg"><label className="pt-sfl">Categoria</label><div className="pt-cat-grid">{Object.entries(BLOCK_CAT).map(([k,v])=><div key={k} className={`pt-cat ${f.category===k?"on":""}`} onClick={()=>set("category",k)}><div className="pt-cat-lbl">{v.label}</div></div>)}</div></div>
          <div className="pt-sfg"><label className="pt-sfl">Tipo</label><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{[{v:"recurring",l:"Recorrente"},{v:"single",l:"Data única"}].map(o=><div key={o.v} className={`pt-cat ${f.type===o.v?"on":""}`} onClick={()=>set("type",o.v)}><div className="pt-cat-lbl" style={{fontSize:11}}>{o.l}</div></div>)}</div></div>
          {f.type==="recurring"&&<div className="pt-sfg"><label className="pt-sfl">Dias da semana</label><div className="pt-wdg">{WD_SHORT.map((d,i)=><div key={i} className={`pt-wdp ${f.weekdays.includes(i)?"on":""}`} onClick={()=>toggleWD(i)}>{d}</div>)}</div></div>}
          {f.type==="single"&&<div className="pt-sfg"><label className="pt-sfl">Data</label><input type="date" className="pt-mfi" value={f.date} onChange={e=>set("date",e.target.value)}/></div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="pt-sfg"><label className="pt-sfl">Início</label><select className="pt-mfi" value={f.startTime} onChange={e=>set("startTime",e.target.value)}>{slots.map(s=><option key={s} value={s.split(":")[0]}>{s}</option>)}</select></div>
            <div className="pt-sfg"><label className="pt-sfl">Fim</label><select className="pt-mfi" value={f.endTime} onChange={e=>set("endTime",e.target.value)}>{[...slots.slice(1),"22:00","23:00"].map(s=><option key={s} value={s.split(":")[0]}>{s}</option>)}</select></div>
          </div>
          <div className="pt-sfg"><label className="pt-sfl">Campos</label>
            <div className="pt-ccb" onClick={()=>{set("courtIds","all");set("selCts",[]);}}><div className={`pt-cb-box ${f.courtIds==="all"?"on":""}`}>{f.courtIds==="all"&&<I n="ok" s={10} c="#141210"/>}</div><span style={{fontSize:13,fontWeight:500,color:"#EDE9E1"}}>Todos os campos</span></div>
            {cfg.courts.filter(c=>c.active).map(c=>{const chk=f.courtIds!=="all"&&f.selCts.includes(c.id);return(<div key={c.id} className="pt-ccb" onClick={()=>toggleC(c.id)}><div className={`pt-cb-box ${chk?"on":""}`}>{chk&&<I n="ok" s={10} c="#141210"/>}</div><span style={{fontSize:13,fontWeight:500,color:"#EDE9E1"}}>{c.name}</span><span style={{fontSize:11,color:"#7A766F",marginLeft:"auto"}}>{c.indoor?"Indoor":"Outdoor"}</span></div>);})}
          </div>
        </div>
        <div className="pt-modal-foot">
          <button className="pt-btn pt-btn-ghost pt-btn-w" onClick={onClose}>Cancelar</button>
          <button className="pt-btn pt-btn-light pt-btn-w" onClick={save}><I n="lock" s={13}/> Criar</button>
        </div>
      </div>
    </div>
  );
}

function AdminClients({ contacts, bookings, cfg, search, onUpdate, onDelete, onCancel }) {
  const [sel,setSel]=useState(null);
  const [filter,setFilter]=useState("all");
  const [sort,setSort]=useState("bookings");
  const calc=(bs)=>bs.reduce((s,b)=>{const p=isNt(b.time,parseInt(cfg.nightFrom))?cfg.priceNight:cfg.priceDay;return s+(p*cfg.playersPerCourt*((b.dur||60)/60));},0);
  const enriched=useMemo(()=>contacts.map(c=>{const cb=bookings.filter(b=>b.contactEmail===c.email);const conf=cb.filter(b=>b.status==="confirmed");const rev=Math.round(calc(conf));const last=cb.sort((a,b)=>b.date.localeCompare(a.date))[0]?.date||null;const cnt={};cb.forEach(b=>cnt[b.courtId]=(cnt[b.courtId]||0)+1);const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];const fav=top?cfg.courts.find(c=>c.id===parseInt(top[0]))?.name||"—":"—";return{...c,total:cb.length,conf:conf.length,rev,last,fav,lvl:clvl(cb.length)};}));
  const filtered=enriched.filter(c=>filter==="all"||c.lvl===filter).filter(c=>!search||c.name.toLowerCase().includes(search.toLowerCase())||c.email.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):sort==="rev"?b.rev-a.rev:b.total-a.total);
  if(sel){const c=enriched.find(c=>c.id===sel);if(c)return <ClientDetail key={sel} client={c} bookings={bookings} cfg={cfg} onBack={()=>setSel(null)} onUpdate={onUpdate} onDelete={id=>{setSel(null);onDelete(id);}} onCancel={onCancel}/>;}
  return (
    <>
      <div style={{marginBottom:12,fontSize:12,color:"#7A766F"}}>
        <span style={{fontWeight:800,color:"#EDE9E1"}}>{filtered.length}</span> clientes · <span style={{fontWeight:700,color:"#EDE9E1"}}>{filtered.reduce((s,c)=>s+c.rev,0)}€</span> receita
      </div>
      <div className="pt-itabs" style={{marginBottom:10}}>
        {[{v:"all",l:"Todos"},{v:"Pro",l:"Pro"},{v:"Regular",l:"Regular"},{v:"Novo",l:"Novo"}].map(o=><button key={o.v} className={`pt-itab ${filter===o.v?"on":""}`} onClick={()=>setFilter(o.v)}>{o.l}</button>)}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <span style={{fontSize:10,color:"#3D3A35",fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",alignSelf:"center"}}>Ordenar:</span>
        {[{v:"bookings",l:"Reservas"},{v:"rev",l:"Receita"},{v:"name",l:"Nome"}].map(o=><span key={o.v} style={{fontSize:11,fontWeight:600,cursor:"pointer",color:sort===o.v?"#EDE9E1":"#3D3A35",transition:"color .15s"}} onClick={()=>setSort(o.v)}>{o.l}</span>)}
      </div>
      <div className="pt-acard" style={{padding:0}}>
        {filtered.length===0?<div style={{padding:"22px",textAlign:"center",fontSize:12,color:"#3D3A35"}}>Sem clientes</div>
        :filtered.map(c=>(
          <div key={c.id} className="pt-arow" style={{cursor:"pointer",transition:"background .12s"}} onClick={()=>setSel(c.id)}>
            <div className="pt-aav" style={{width:38,height:38,fontSize:12,borderRadius:10}}>{ini(c.name)}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:"#EDE9E1",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",letterSpacing:"-.1px"}}>{c.name}</div>
              <div style={{fontSize:11,color:"#7A766F",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.email}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
              <span className="pt-badge pt-ba" style={{fontSize:10}}>{c.lvl}</span>
              <span style={{fontSize:10,color:"#7A766F"}}>{c.total}× · {c.rev}€</span>
            </div>
            <I n="back" s={14} c="#3D3A35" style={{marginLeft:6,transform:"rotate(180deg)"}}/>
          </div>
        ))}
      </div>
    </>
  );
}

function ClientDetail({ client, bookings, cfg, onBack, onUpdate, onDelete, onCancel }) {
  const [htab,setHtab]=useState("all");
  const [showEdit,setEdit]=useState(false);
  const [confDel,setConfDel]=useState(false);
  const calc=(bs)=>bs.reduce((s,b)=>{const p=isNt(b.time,parseInt(cfg.nightFrom))?cfg.priceNight:cfg.priceDay;return s+(p*cfg.playersPerCourt*((b.dur||60)/60));},0);
  const allBk=bookings.filter(b=>b.contactEmail===client.email).sort((a,b)=>b.date.localeCompare(a.date));
  const confBk=allBk.filter(b=>b.status==="confirmed");
  const pendBk=allBk.filter(b=>b.status==="pending");
  const rev=Math.round(calc(confBk));
  const hi=htab==="all"?allBk:htab==="conf"?confBk:pendBk;
  return (
    <div className="pt-cd">
      <button className="pt-cd-back" onClick={onBack}><I n="back" s={14}/> Clientes</button>
      <div className="pt-acard mb14">
        <div className="pt-cd-ptop">
          <div className="pt-cd-av">{ini(client.name)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5}}><span className="pt-cd-name">{client.name}</span><span className="pt-badge pt-ba">{client.lvl}</span></div>
            <div style={{fontSize:11,color:"#7A766F"}}>Membro desde {fmtFull(client.since)}</div>
            {client.last&&<div style={{fontSize:11,color:"#7A766F",marginTop:1}}>Última reserva: {fmtSh(client.last)}</div>}
          </div>
          <button className="pt-btn pt-btn-ghost pt-btn-sm" onClick={()=>setEdit(true)}><I n="edit" s={13}/></button>
        </div>
        <div className="pt-cd-contact">
          <div className="pt-cd-ci"><I n="mail" s={13} c="#7A766F"/><span style={{fontSize:13,color:"#EDE9E1",fontWeight:500}}>{client.email}</span></div>
          <div className="pt-cd-ci"><I n="phone" s={13} c="#7A766F"/><span style={{fontSize:13,color:"#EDE9E1",fontWeight:500}}>{client.phone||"—"}</span></div>
        </div>
        {(client.notes||"").trim()&&<div className="pt-cd-notes"><div className="pt-cd-notes-lbl">Notas internas</div><div className="pt-cd-notes-txt">{client.notes}</div></div>}
      </div>

      <div className="pt-cd-stats">
        {[{l:"Reservas",v:allBk.length},{l:"Confirmadas",v:confBk.length},{l:"Receita",v:`${rev}€`},{l:"Campo Fav.",v:client.fav,sm:true}].map(s=>(
          <div key={s.l} className="pt-cd-stat">
            <div className="pt-cd-stat-v" style={s.sm?{fontSize:14}:{}}>{s.v}</div>
            <div className="pt-cd-stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="pt-acard mb14" style={{padding:0}}>
        <div className="pt-ash"><span className="pt-ash-t">Histórico</span></div>
        <div style={{padding:"0 16px 10px"}}>
          <div className="pt-itabs">
            <button className={`pt-itab ${htab==="all"?"on":""}`} onClick={()=>setHtab("all")}>Todas ({allBk.length})</button>
            <button className={`pt-itab ${htab==="conf"?"on":""}`} onClick={()=>setHtab("conf")}>Conf. ({confBk.length})</button>
            <button className={`pt-itab ${htab==="pend"?"on":""}`} onClick={()=>setHtab("pend")}>Pend. ({pendBk.length})</button>
          </div>
        </div>
        {hi.length===0?<div style={{padding:"22px 16px",textAlign:"center",fontSize:12,color:"#3D3A35"}}>Sem reservas nesta categoria</div>
        :hi.map(b=>{const court=cfg.courts.find(c=>c.id===b.courtId);const night=isNt(b.time,parseInt(cfg.nightFrom));const p=(night?cfg.priceNight:cfg.priceDay)*cfg.playersPerCourt*((b.dur||60)/60);const endH=addMins(b.time||"00:00",b.dur||60);return(
          <div key={b.id} className="pt-arow">
            <div style={{width:40,flexShrink:0}}><div style={{fontSize:10,fontWeight:700,color:"#EDE9E1"}}>{fmtSh(b.date)}</div><div style={{fontSize:10,color:"#3D3A35",marginTop:1}}>{b.time}</div></div>
            <div className="pt-arow-body">
              <div style={{fontSize:12,fontWeight:700,color:"#EDE9E1"}}>{court?.name} · {b.time}–{endH}</div>
              <div className="pt-arow-sub">{durLbl(b.dur||60)} · {Math.round(p)}€{night?" · 🌙":""} · {PAY.find(pp=>pp.id===b.pay)?.icon}</div>
              {b.status==="pending"&&<div className="pt-arow-acts"><button className="pt-btn pt-btn-del pt-btn-sm" onClick={()=>onCancel(b.id)}><I n="x" s={12}/> Cancelar</button></div>}
            </div>
            <span className={`pt-badge ${b.status==="confirmed"?"pt-ba":"pt-bw"}`}>{b.status==="confirmed"?"✓":"Pend."}</span>
          </div>
        );})}
      </div>

      {!confDel
        ?<div style={{display:"flex",justifyContent:"center"}}><button className="pt-btn pt-btn-del pt-btn-sm" onClick={()=>setConfDel(true)}><I n="trash" s={13}/> Remover cliente</button></div>
        :<div className="pt-acard" style={{padding:"14px 16px",borderColor:"rgba(255,107,107,.2)"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#FF6B6B",marginBottom:9}}>Tens a certeza? Esta acção não pode ser revertida.</div>
          <div style={{display:"flex",gap:8}}><button className="pt-btn pt-btn-del pt-btn-sm" style={{flex:1}} onClick={()=>onDelete(client.id)}><I n="trash" s={13}/> Confirmar</button><button className="pt-btn pt-btn-ghost pt-btn-sm" onClick={()=>setConfDel(false)}>Cancelar</button></div>
        </div>
      }
      {showEdit&&<EditClientModal client={client} onSave={d=>{onUpdate(client.id,d);setEdit(false);}} onClose={()=>setEdit(false)}/>}
    </div>
  );
}

function EditClientModal({ client, onSave, onClose }) {
  const [f,setF]=useState({name:client.name,email:client.email,phone:client.phone||"",notes:client.notes||""});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const [err,setErr]=useState("");
  const save=()=>{if(!f.name.trim()){setErr("Nome obrigatório");return;}if(!f.email.trim()||!/\S+@\S+\.\S+/.test(f.email)){setErr("Email inválido");return;}onSave(f);};
  return (
    <div className="pt-mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="pt-modal">
        <div className="pt-modal-handle"/>
        <div className="pt-modal-hd"><span className="pt-modal-tt">Editar Cliente</span><button className="pt-modal-close" onClick={onClose}><I n="x" s={13}/></button></div>
        <div className="pt-modal-body">
          {err&&<div style={{fontSize:11,color:"#FF6B6B"}}>{err}</div>}
          <div className="pt-sfg"><label className="pt-sfl">Nome</label><input className="pt-mfi" value={f.name} onChange={e=>set("name",e.target.value)}/></div>
          <div className="pt-sfg"><label className="pt-sfl">Email</label><input type="email" className="pt-mfi" value={f.email} onChange={e=>set("email",e.target.value)}/></div>
          <div className="pt-sfg"><label className="pt-sfl">Telemóvel</label><input type="tel" className="pt-mfi" value={f.phone} onChange={e=>set("phone",e.target.value)}/></div>
          <div className="pt-sfg"><label className="pt-sfl">Notas internas</label><textarea className="pt-mfi pt-sfi-ta" value={f.notes} onChange={e=>set("notes",e.target.value)} placeholder="Preferências, observações…"/></div>
        </div>
        <div className="pt-modal-foot"><button className="pt-btn pt-btn-ghost pt-btn-w" onClick={onClose}>Cancelar</button><button className="pt-btn pt-btn-light pt-btn-w" onClick={save}><I n="ok" s={14}/> Guardar</button></div>
      </div>
    </div>
  );
}

function AdminConfig({ cfg, setCfg, showToast }) {
  const [l,setL]=useState(()=>JSON.parse(JSON.stringify(cfg)));
  const set=(k,v)=>setL(p=>({...p,[k]:v}));
  const setC=(id,k,v)=>setL(p=>({...p,courts:p.courts.map(c=>c.id===id?{...c,[k]:v}:c)}));
  const addCourt=()=>{const id=Math.max(...l.courts.map(c=>c.id),0)+1;setL(p=>({...p,courts:[...p.courts,{id,name:`Court ${id}`,indoor:true,active:true}]}));};
  const rmCourt=(id)=>{if(l.courts.length<=1){showToast("Precisa de pelo menos 1 campo.");return;}setL(p=>({...p,courts:p.courts.filter(c=>c.id!==id)}));};
  const togDur=(m)=>setL(p=>({...p,durations:p.durations.includes(m)?(p.durations.length>1?p.durations.filter(d=>d!==m):p.durations):[...p.durations,m].sort((a,b)=>a-b)}));
  const save=()=>{setCfg(JSON.parse(JSON.stringify(l)));showToast("Configurações guardadas!");};
  const SH=(t)=><div className="pt-sec-hd">{t}</div>;

  return (
    <>
      <div className="pt-acard" style={{padding:"14px 16px",marginBottom:10}}>
        {SH("Identidade")}
        <div className="pt-sfg"><label className="pt-sfl">Nome do Clube</label><input className="pt-sfi" value={l.name} onChange={e=>set("name",e.target.value)}/></div>
        <div className="pt-sfg"><label className="pt-sfl">Tagline</label><input className="pt-sfi" value={l.tagline} onChange={e=>set("tagline",e.target.value)}/></div>
      </div>

      <div className="pt-acard" style={{padding:"14px 16px",marginBottom:10}}>
        {SH("Preços por Jogador")}
        <div className="pt-sfi-2">
          <div className="pt-sfg"><label className="pt-sfl">☀️ Diurno (€)</label><input type="text" inputMode="decimal" className="pt-sfi" placeholder="Ex: 7.5" value={l.priceDay} onChange={e=>{const v=e.target.value.replace(",",".");set("priceDay",v);}  } onBlur={e=>{const v=parseFloat(String(e.target.value).replace(",","."));if(!isNaN(v))set("priceDay",v);}}/></div>
          <div className="pt-sfg"><label className="pt-sfl">🌙 Noturno (€)</label><input type="text" inputMode="decimal" className="pt-sfi" placeholder="Ex: 9.5" value={l.priceNight} onChange={e=>{const v=e.target.value.replace(",",".");set("priceNight",v);}  } onBlur={e=>{const v=parseFloat(String(e.target.value).replace(",","."));if(!isNaN(v))set("priceNight",v);}}/></div>
        </div>
        <div className="pt-sfi-2">
          <div className="pt-sfg"><label className="pt-sfl">Noturno a partir das (h)</label><input type="number" min="12" max="22" className="pt-sfi" value={l.nightFrom} onChange={e=>set("nightFrom",e.target.value)}/></div>
          <div className="pt-sfg"><label className="pt-sfl">Jogadores/campo</label><input type="number" min="2" max="6" className="pt-sfi" value={l.playersPerCourt} onChange={e=>set("playersPerCourt",parseInt(e.target.value))}/></div>
        </div>
      </div>

      <div className="pt-acard" style={{padding:"14px 16px",marginBottom:10}}>
        {SH("Horário e Durações")}
        <div className="pt-sfi-2">
          <div className="pt-sfg"><label className="pt-sfl">Abre (hora)</label><input type="number" min="0" max="12" className="pt-sfi" value={l.openFrom} onChange={e=>set("openFrom",e.target.value)}/></div>
          <div className="pt-sfg"><label className="pt-sfl">Fecha (hora)</label><input type="number" min="14" max="24" className="pt-sfi" value={l.openTo} onChange={e=>set("openTo",e.target.value)}/></div>
        </div>
        <div className="pt-sfg"><label className="pt-sfl">Durações disponíveis</label><div className="pt-dur-pills" style={{marginTop:7}}>{[60,90,120].map(m=><button key={m} className={`pt-dur-pill ${l.durations.includes(m)?"on":""}`} onClick={()=>togDur(m)}>{durLbl(m)}</button>)}</div></div>
        <div className="pt-sfg"><label className="pt-sfl">Dias de antecipação máxima</label><input type="number" min="1" max="60" className="pt-sfi" value={l.advanceDays} onChange={e=>set("advanceDays",parseInt(e.target.value))}/></div>
      </div>

      <div className="pt-acard" style={{padding:"14px 16px",marginBottom:10}}>
        {SH("Regras de Reserva")}
      <div className="pt-sfg">
        <label className="pt-sfl">Instalações do Clube</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:4}}>
          {AMENITIES.map(a=>{
            const active=(l.amenities||[]).includes(a.id);
            return(
              <div key={a.id} className="pt-ccb" onClick={()=>{
                const cur=l.amenities||[];
                set("amenities",active?cur.filter(x=>x!==a.id):[...cur,a.id]);
              }}>
                <div className={`pt-cb-box ${active?"on":""}`}>{active&&<span style={{fontSize:9,fontWeight:800,color:"#141210"}}>✓</span>}</div>
                <span style={{fontSize:12,fontWeight:500,color:"#EDE9E1"}}>{a.icon} {a.label}</span>
              </div>
            );
          })}
        </div>
      </div>

        {[{k:"requireApproval",l:"Aprovação manual",s:"Reservas ficam pendentes até confirmar"},{k:"allowCancel",l:"Permitir cancelamento",s:"Jogador pode cancelar"},{k:"showOccupancy",l:"Mostrar disponibilidade",s:"Jogadores vêem campos livres"}].map(o=>(
          <div key={o.k} className="pt-tog-row" onClick={()=>set(o.k,!l[o.k])}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:"#EDE9E1"}}>{o.l}</div><div style={{fontSize:10,color:"#7A766F",marginTop:2}}>{o.s}</div></div>
            <div className="pt-tog" style={{background:l[o.k]?"#F4F0E8":"rgba(255,255,255,.1)"}}><div className="pt-tog-thumb" style={{left:l[o.k]?"18px":"2px"}}/></div>
          </div>
        ))}
        {l.allowCancel&&<div className="pt-sfg"><label className="pt-sfl">Horas de antecedência p/ cancelar</label><input type="number" min="1" className="pt-sfi" value={l.cancelHours} onChange={e=>set("cancelHours",parseInt(e.target.value))}/></div>}
      </div>

      <div className="pt-acard" style={{padding:"14px 16px",marginBottom:10}}>
        {SH("Gestão de Campos")}
        {l.courts.map(c=>(
          <div key={c.id} className="pt-ce">
            <input className="pt-ce-in" value={c.name} onChange={e=>setC(c.id,"name",e.target.value)} placeholder="Nome do campo"/>
            <div className="pt-ce-tag" style={{cursor:"pointer"}} onClick={()=>setC(c.id,"indoor",!c.indoor)}>{c.indoor?"Indoor":"Outdoor"}</div>
            <div className="pt-tog" style={{background:c.active?"#F4F0E8":"rgba(255,255,255,.1)",cursor:"pointer"}} onClick={()=>setC(c.id,"active",!c.active)}><div className="pt-tog-thumb" style={{left:c.active?"18px":"2px"}}/></div>
            <div style={{cursor:"pointer",color:"#3D3A35",padding:"3px",flexShrink:0}} onClick={()=>rmCourt(c.id)}><I n="trash" s={14}/></div>
          </div>
        ))}
        <button className="pt-btn pt-btn-ghost pt-btn-w pt-btn-sm" style={{marginTop:4}} onClick={addCourt}><I n="plus" s={13}/> Adicionar Campo</button>
      </div>

      <div className="pt-acard" style={{padding:"14px 16px",marginBottom:16}}>
        {SH("Contactos do Clube")}
        <div className="pt-sfg"><label className="pt-sfl">Telefone</label><input className="pt-sfi" value={l.phone} onChange={e=>set("phone",e.target.value)}/></div>
        <div className="pt-sfg"><label className="pt-sfl">Email</label><input className="pt-sfi" value={l.email} onChange={e=>set("email",e.target.value)}/></div>
        <div className="pt-sfg"><label className="pt-sfl">Morada</label><input className="pt-sfi" value={l.address} onChange={e=>set("address",e.target.value)}/></div>
      </div>

      <button className="pt-btn pt-btn-light pt-btn-w" style={{fontSize:14,padding:"13px"}} onClick={save}>Guardar Configurações</button>
      <p style={{textAlign:"center",marginTop:8,paddingBottom:4,fontSize:10,color:"#3D3A35"}}>Alterações reflectem-se imediatamente no Portal</p>

      <div style={{marginTop:24,padding:"14px 16px",borderRadius:12,border:"1px solid rgba(255,77,109,.15)",background:"rgba(255,77,109,.04)"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#FF6B6B",marginBottom:4}}>Zona de Perigo</div>
        <div style={{fontSize:11,color:"#7A766F",marginBottom:10}}>Apaga todos os dados de teste (reservas, clientes, torneios). Usa antes de ir para produção.</div>
        <button className="pt-btn pt-btn-del pt-btn-w" onClick={()=>{
          if(window.confirm("Tens a certeza? Todos os dados serão apagados.")){
            Object.keys(localStorage).filter(k=>k.startsWith("pdp_")).forEach(k=>localStorage.removeItem(k));
            window.location.reload();
          }
        }}>🗑 Limpar todos os dados de teste</button>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOURNAMENT MODULE
// ═══════════════════════════════════════════════════════════════════════════════
const CAT_OPT=[{id:"M1",g:"M"},{id:"M2",g:"M"},{id:"M3",g:"M"},{id:"M4",g:"M"},{id:"M5",g:"M"},{id:"M6",g:"M"},{id:"F1",g:"F"},{id:"F2",g:"F"},{id:"F3",g:"F"},{id:"F4",g:"F"},{id:"F5",g:"F"},{id:"F6",g:"F"},{id:"MX1",g:"MX"},{id:"MX2",g:"MX"},{id:"MX3",g:"MX"},{id:"MX4",g:"MX"},{id:"MX5",g:"MX"},{id:"MX6",g:"MX"}];
const T_SL={draft:"Rascunho",open:"Inscrições Abertas",closed:"Insc. Encerradas",scheduling:"A Calendarizar",groups:"Sinetas",knockouts:"Quadro",finished:"Terminado"};
const TOURNAMENT_FORMATS={
  normal:{label:"Quadro normal",short:"Quadro",desc:"Eliminatórias: quartos, meias e final."},
  sinetas:{label:"Sinetas",short:"Sinetas",desc:"Todos contra todos, por grupos/categorias."},
};

const genRR=(pairs)=>{const m=[];let id=1;for(let i=0;i<pairs.length;i++)for(let j=i+1;j<pairs.length;j++)m.push({id:id++,p1:pairs[i],p2:pairs[j],sets:[],winner:null});return m;};

const calcStandings=(group)=>{
  const s={};group.pairs.forEach(p=>s[p]={w:0,l:0,sw:0,sl:0});
  group.matches.filter(m=>m.winner).forEach(m=>{
    const sW=m.sets.filter(x=>x.p1>x.p2).length,sL=m.sets.filter(x=>x.p2>x.p1).length;
    if(m.winner===m.p1){s[m.p1].w++;s[m.p1].sw+=sW;s[m.p1].sl+=sL;s[m.p2].l++;s[m.p2].sw+=sL;s[m.p2].sl+=sW;}
    else{s[m.p2].w++;s[m.p2].sw+=sL;s[m.p2].sl+=sW;s[m.p1].l++;s[m.p1].sw+=sW;s[m.p1].sl+=sL;}
  });
  return group.pairs.slice().sort((a,b)=>(s[b].w-s[a].w)||((s[b].sw-s[b].sl)-(s[a].sw-s[a].sl)));
};

const roundName=(sz)=>sz===2?"Final":sz===4?"Meias-finais":sz===8?"Quartos":`Ronda de ${sz}`;

const genBracket=(qualifiers)=>{
  const n=Math.pow(2,Math.ceil(Math.log2(Math.max(qualifiers.length,2))));
  const padded=[...qualifiers,...Array(n-qualifiers.length).fill(null)];
  const matches=[];
  for(let i=0;i<padded.length;i+=2){const p1=padded[i],p2=padded[i+1];matches.push({id:i/2+1,p1,p2,sets:[],winner:p2===null?p1:null,source1:null,source2:null});}
  const rounds=[{name:roundName(n),matches,done:false}];
  let prevCount=matches.length;
  while(prevCount>1){
    const next=[];
    for(let i=0;i<prevCount;i+=2){
      next.push({id:i/2+1,p1:null,p2:null,sets:[],winner:null,source1:`Vencedor ${rounds[rounds.length-1].name} ${i+1}`,source2:`Vencedor ${rounds[rounds.length-1].name} ${i+2}`});
    }
    rounds.push({name:roundName(prevCount),matches:next,done:false});
    prevCount=next.length;
  }
  return propagateBracketByes(rounds);
};

const advanceBracket=(rounds)=>{
  const last=rounds[rounds.length-1];
  const winners=last.matches.map(m=>m.winner).filter(Boolean);
  if(winners.length<=1)return[...rounds.slice(0,-1),{...last,done:true}];
  const n=Math.pow(2,Math.ceil(Math.log2(Math.max(winners.length,2))));
  const padded=[...winners,...Array(n-winners.length).fill(null)];
  const next=[];
  for(let i=0;i<padded.length;i+=2){const p1=padded[i],p2=padded[i+1];next.push({id:i/2+1,p1,p2,sets:[],winner:p2===null?p1:null});}
  return[...rounds.slice(0,-1),{...last,done:true},{name:roundName(n),matches:next,done:false}];
};

const propagateBracketByes=(rounds)=>{
  const out=rounds.map(r=>({...r,matches:r.matches.map(m=>({...m}))}));
  for(let ri=0;ri<out.length-1;ri++){
    out[ri].matches.forEach((m,mi)=>{
      if(!m.winner)return;
      const next=out[ri+1].matches[Math.floor(mi/2)];
      if(!next)return;
      if(mi%2===0&&!next.p1)next.p1=m.winner;
      if(mi%2===1&&!next.p2)next.p2=m.winner;
    });
    out[ri].done=out[ri].matches.every(m=>m.winner);
  }
  return out;
};

const collectTournamentMatches=(t)=>{
  const matches=[];
  t.categories.forEach(cat=>{
    (cat.groups||[]).forEach((g,gi)=>{
      g.matches.forEach(m=>matches.push({key:`${cat.id}-g${gi}-m${m.id}`,label:`${cat.id} · Grupo ${g.id}`,p1:pairNameFromT(t,m.p1),p2:pairNameFromT(t,m.p2)}));
    });
    (cat.bracket||[]).forEach((r,ri)=>{
      r.matches.forEach(m=>{
        const p1=m.p1?pairNameFromT(t,m.p1):(m.source1||"Vencedor anterior");
        const p2=m.p2?pairNameFromT(t,m.p2):(m.source2||"Vencedor anterior");
        if(m.p2===null&&m.winner)return;
        matches.push({key:`${cat.id}-r${ri}-m${m.id}`,label:`${cat.id} · ${r.name}`,p1,p2});
      });
    });
  });
  return matches;
};

const generateTournamentSchedule=(t,cfg)=>{
  const courts=cfg.courts.filter(c=>c.active&&(t.courtIds.length===0||t.courtIds.includes(c.id)));
  const useCourts=courts.length?courts:cfg.courts.filter(c=>c.active);
  if(useCourts.length===0)return[];
  const matches=collectTournamentMatches(t);
  const slotMin=t.slotMinutes||90;
  const open=parseInt(cfg.openFrom||"08");
  const close=parseInt(cfg.openTo||"22");
  const wavesPerDay=Math.max(1,Math.floor(((close-open)*60)/slotMin));
  const firstDate=new Date((t.startDate||TODAY)+"T12:00:00");
  return matches.map((m,i)=>{
    const wave=Math.floor(i/useCourts.length);
    const dayOffset=Math.floor(wave/wavesPerDay);
    const waveInDay=wave%wavesPerDay;
    const d=new Date(firstDate);d.setDate(firstDate.getDate()+dayOffset);
    const mins=open*60+(waveInDay*slotMin);
    const court=useCourts[i%useCourts.length];
    return {id:i+1,matchKey:m.key,label:m.label,p1:m.p1,p2:m.p2,date:fmt(d),time:`${String(Math.floor(mins/60)).padStart(2,"0")}:${String(mins%60).padStart(2,"0")}`,courtId:court.id,courtName:court.name};
  });
};

const syncTournamentSchedule=(t,cfg,oldSchedule=[])=>{
  const generated=generateTournamentSchedule(t,cfg);
  return generated.map(s=>{
    const old=oldSchedule.find(o=>o.matchKey===s.matchKey);
    return old?{...s,date:old.date,time:old.time,courtId:old.courtId,courtName:old.courtName}:s;
  });
};

// ── TOURNAMENT LIST ──────────────────────────────────────────────────────────
function AdminTournaments({tournaments,setTournaments,cfg}){
  const [sel,setSel]=useState(null);
  const [showCreate,setShowCreate]=useState(false);

  const t=sel?tournaments.find(t=>t.id===sel):null;
  if(t) return <TournamentDetail t={t} cfg={cfg} onBack={()=>setSel(null)} onUpdate={(updated)=>setTournaments(p=>(Array.isArray(p)?p:[]).map(x=>x.id===updated.id?updated:x))}/>;

  return(
    <>
      <div className="row g2" style={{marginBottom:16}}>
        <div><div style={{fontSize:15,fontWeight:800,color:"#EDE9E1",letterSpacing:"-.3px"}}>Torneios</div><div style={{fontSize:11,color:"#7A766F",marginTop:1}}>{tournaments.length} torneio{tournaments.length!==1?"s":""}</div></div>
        <button className="pt-btn pt-btn-light pt-btn-sm mla" onClick={()=>setShowCreate(true)}>+ Novo Torneio</button>
      </div>

      {tournaments.length===0?(
        <div className="pt-acard" style={{padding:"40px 24px",textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:12}}>🏆</div>
          <div style={{fontSize:15,fontWeight:800,color:"#EDE9E1",marginBottom:6}}>Sem torneios</div>
          <div style={{fontSize:13,color:"#7A766F"}}>Cria o primeiro torneio do clube.</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {tournaments.map(t=>(
            <div key={t.id} className="pt-acard" style={{padding:"14px 16px",cursor:"pointer"}} onClick={()=>setSel(t.id)}>
              <div className="row g2" style={{marginBottom:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#EDE9E1",letterSpacing:"-.2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</div>
                  <div style={{fontSize:11,color:"#7A766F",marginTop:2}}>{t.startDate}{t.endDate&&t.endDate!==t.startDate?` → ${t.endDate}`:""} · {t.categories.length} categoria{t.categories.length!==1?"s":""}</div>
                </div>
                <TStatusBadge status={t.status}/>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {t.categories.map(c=>(
                  <span key={c.id} style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,background:"rgba(255,255,255,.07)",color:"#EDE9E1"}}>{c.id}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate&&<TournamentCreate cfg={cfg} onSave={(t)=>{setTournaments(p=>[...(Array.isArray(p)?p:[]),t]);setShowCreate(false);setSel(t.id);}} onClose={()=>setShowCreate(false)}/>}
    </>
  );
}

function TStatusBadge({status}){
  const styles={
    draft:{bg:"rgba(255,255,255,.07)",c:"#7A766F"},
    open:{bg:"rgba(52,211,153,.12)",c:"#34D399"},
    closed:{bg:"rgba(245,158,11,.12)",c:"#F59E0B"},
    groups:{bg:"rgba(56,189,248,.12)",c:"#38BDF8"},
    knockouts:{bg:"rgba(167,139,250,.12)",c:"#A78BFA"},
    finished:{bg:"rgba(255,255,255,.06)",c:"#7A766F"},
  }[status]||{bg:"rgba(255,255,255,.07)",c:"#7A766F"};
  return <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:styles.bg,color:styles.c,whiteSpace:"nowrap"}}>{T_SL[status]||status}</span>;
}

// ── TOURNAMENT CREATE ────────────────────────────────────────────────────────
function TournamentCreate({cfg,onSave,onClose}){
  const [f,setF]=useState({name:"",format:"normal",startDate:TODAY,endDate:TODAY,courtIds:[],groupSize:4,advanceCount:2,slotMinutes:90,superTb:true,categories:[]});
  const [err,setErr]=useState("");
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const toggleCat=(id)=>setF(p=>({...p,categories:p.categories.includes(id)?p.categories.filter(c=>c!==id):[...p.categories,id]}));
  const toggleCourt=(id)=>setF(p=>({...p,courtIds:p.courtIds.includes(id)?p.courtIds.filter(c=>c!==id):[...p.courtIds,id]}));

  const save=()=>{
    if(!f.name.trim()){setErr("Nome obrigatório");return;}
    if(!f.startDate){setErr("Data de início obrigatória");return;}
    if(f.categories.length===0){setErr("Selecciona pelo menos uma categoria");return;}
    const t={
      id:Date.now(),name:f.name,startDate:f.startDate,endDate:f.endDate,courtIds:f.courtIds,slotMinutes:f.slotMinutes,
      format:f.format,groupSize:f.groupSize,advanceCount:f.advanceCount,superTb:f.superTb,
      status:"draft",
      categories:f.categories.map(id=>({
        id,g:CAT_OPT.find(c=>c.id===id)?.g,
        pairs:[],groups:[],bracket:[],
      })),
    };
    onSave(t);
  };

  const SFL=({children})=><div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:".8px",marginBottom:6}}>{children}</div>;

  return(
    <div className="pt-mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="pt-modal">
        <div className="pt-modal-handle"/>
        <div className="pt-modal-hd"><span className="pt-modal-tt">Novo Torneio</span><button className="pt-modal-close" onClick={onClose}>✕</button></div>
        <div className="pt-modal-body">
          {err&&<div style={{fontSize:11,color:"#FF6B6B",padding:"7px 10px",background:"rgba(255,107,107,.08)",borderRadius:8}}>{err}</div>}

          <div className="pt-sfg"><SFL>Nome do torneio</SFL><input className="pt-mfi" placeholder="Ex: Torneio de Verão 2026" value={f.name} onChange={e=>set("name",e.target.value)}/></div>
          <div className="pt-sfg">
            <SFL>Formato</SFL>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {Object.entries(TOURNAMENT_FORMATS).map(([key,opt])=>(
                <div key={key} onClick={()=>set("format",key)} style={{padding:"11px 12px",borderRadius:10,border:`1.5px solid ${f.format===key?"rgba(255,255,255,.32)":"rgba(255,255,255,.08)"}`,background:f.format===key?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)",cursor:"pointer"}}>
                  <div style={{fontSize:13,fontWeight:800,color:f.format===key?"#EDE9E1":"#7A766F"}}>{opt.label}</div>
                  <div style={{fontSize:10,color:"#7A766F",marginTop:3,lineHeight:1.35}}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="pt-sfg"><SFL>Data de início</SFL><input type="date" className="pt-mfi" value={f.startDate} onChange={e=>set("startDate",e.target.value)}/></div>
            <div className="pt-sfg"><SFL>Data de fim</SFL><input type="date" className="pt-mfi" value={f.endDate} onChange={e=>set("endDate",e.target.value)}/></div>
          </div>

          <div className="pt-sfg">
            <SFL>Categorias a abrir</SFL>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
              {["M","F","MX"].map(g=>(
                <div key={g}>
                  <div style={{fontSize:9,fontWeight:700,color:"#3D3A35",textTransform:"uppercase",letterSpacing:".5px",marginBottom:5}}>{g==="M"?"Masculinos":g==="F"?"Femininos":"Mistos"}</div>
                  {CAT_OPT.filter(c=>c.g===g).map(c=>(
                    <div key={c.id} onClick={()=>toggleCat(c.id)} style={{padding:"6px 8px",borderRadius:7,border:`1.5px solid ${f.categories.includes(c.id)?"rgba(255,255,255,.3)":"rgba(255,255,255,.08)"}`,background:f.categories.includes(c.id)?"rgba(255,255,255,.08)":"rgba(255,255,255,.03)",cursor:"pointer",marginBottom:5,fontSize:12,fontWeight:700,color:f.categories.includes(c.id)?"#EDE9E1":"#7A766F",textAlign:"center",transition:"all .15s"}}>
                      {c.id}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {f.format==="sinetas"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="pt-sfg"><SFL>Equipas por grupo</SFL>
              <select className="pt-mfi" value={f.groupSize} onChange={e=>set("groupSize",parseInt(e.target.value))}>
                <option value={3}>3 pares</option><option value={4}>4 pares</option><option value={5}>5 pares</option>
              </select>
            </div>
            <div className="pt-sfg"><SFL>Apuram por grupo</SFL>
              <select className="pt-mfi" value={f.advanceCount} onChange={e=>set("advanceCount",parseInt(e.target.value))}>
                <option value={1}>Só o 1.º</option><option value={2}>1.º e 2.º</option>
              </select>
            </div>
          </div>}
          <div className="pt-sfg"><SFL>Duração por jogo (min)</SFL>
            <select className="pt-mfi" value={f.slotMinutes} onChange={e=>set("slotMinutes",parseInt(e.target.value))}>
              <option value={60}>60 min</option><option value={75}>75 min</option><option value={90}>90 min</option><option value={120}>120 min</option>
            </select>
          </div>

          <div className="pt-tog-row" onClick={()=>set("superTb",!f.superTb)}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:"#EDE9E1"}}>Super Tie-Break no 3.º set</div><div style={{fontSize:10,color:"#7A766F",marginTop:1}}>Até 10 pontos, diferença mínima de 2</div></div>
            <div className="pt-tog" style={{background:f.superTb?"#F4F0E8":"rgba(255,255,255,.1)"}}><div className="pt-tog-thumb" style={{left:f.superTb?"18px":"2px"}}/></div>
          </div>

          {cfg.courts.filter(c=>c.active).length>0&&(
            <div className="pt-sfg">
              <SFL>Campos reservados</SFL>
              {cfg.courts.filter(c=>c.active).map(c=>(
                <div key={c.id} className="pt-ccb" onClick={()=>toggleCourt(c.id)}>
                  <div className={`pt-cb-box ${f.courtIds.includes(c.id)?"on":""}`}>{f.courtIds.includes(c.id)&&<span style={{fontSize:9,fontWeight:800,color:"#141210"}}>✓</span>}</div>
                  <span style={{fontSize:13,fontWeight:500,color:"#EDE9E1"}}>{c.name}</span>
                  <span style={{fontSize:11,color:"#7A766F",marginLeft:"auto"}}>{c.indoor?"Indoor":"Outdoor"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="pt-modal-foot">
          <button className="pt-btn pt-btn-ghost pt-btn-w" onClick={onClose}>Cancelar</button>
          <button className="pt-btn pt-btn-light pt-btn-w" onClick={save}>Criar Torneio</button>
        </div>
      </div>
    </div>
  );
}

// ── TOURNAMENT DETAIL ────────────────────────────────────────────────────────
function TournamentDetail({t,cfg,onBack,onUpdate}){
  const [selCat,setSelCat]=useState(t.categories[0]?.id||null);
  const [showAddPair,setShowAddPair]=useState(false);
  const [showResult,setShowResult]=useState(null); // {catId, groupIdx, matchId} or {catId, roundIdx, matchId}

  const cat=t.categories.find(c=>c.id===selCat);

  const update=(updated)=>onUpdate({...t,...updated});
  const updateCat=(catId,changes)=>update({categories:t.categories.map(c=>c.id===catId?{...c,...changes}:c)});

  const format=t.format||"normal";
  const approvedPairs=(cat)=>cat.pairs.filter(p=>p.status==="approved").map(p=>p.id);
  const nextLabel=()=>{
    if(t.status==="draft")return"Abrir Inscrições";
    if(t.status==="open")return"Encerrar Inscrições";
    if(t.status==="closed")return format==="normal"?"Gerar Quadro":"Gerar Sinetas";
    if(t.status==="knockouts")return"Terminar";
    if(t.status==="groups")return"Terminar";
    return null;
  };

  // Advance tournament status
  const advanceStatus=()=>{
    let next={draft:"open",open:format==="normal"?"knockouts":"groups",closed:format==="normal"?"knockouts":"groups",groups:"finished",knockouts:"finished"}[t.status];
    if(!next)return;
    let extra={};
    if((next==="groups"||next==="knockouts")&&t.categories.some(cat=>approvedPairs(cat).length<2)){
      window.alert("Aprova pelo menos 2 duplas por categoria antes de gerar jogos.");
      return;
    }
    if(next==="groups"&&format==="sinetas"){
      extra={categories:t.categories.map(cat=>{
        const approved=approvedPairs(cat);
        const groups=[];
        for(let i=0;i<approved.length;i+=(t.groupSize||4)){
          const gPairs=approved.slice(i,i+(t.groupSize||4));
          groups.push({id:groups.length+1,pairs:gPairs,matches:genRR(gPairs)});
        }
        return{...cat,groups};
      })};
    }
    if(next==="knockouts"&&format==="normal"){
      extra={categories:t.categories.map(cat=>({...cat,bracket:genBracket(approvedPairs(cat))}))};
    }
    if(next==="knockouts"&&format!=="normal"){
      extra={categories:t.categories.map(cat=>{
        const qualifiers=[];
        (cat.groups||[]).forEach(g=>{
          const ranked=calcStandings(g);
          ranked.slice(0,t.advanceCount).forEach(pid=>qualifiers.push(pid));
        });
        return{...cat,bracket:genBracket(qualifiers)};
      })};
    }
    const nextTournament={...t,status:next,...extra};
    const shouldSchedule=next==="groups"||next==="knockouts";
    update({...extra,status:next,schedule:shouldSchedule?syncTournamentSchedule(nextTournament,cfg,t.schedule||[]):t.schedule});
  };

  // Add pair to category
  const addPair=(catId,pair)=>{
    const cat=t.categories.find(c=>c.id===catId);
    const newPair={id:Date.now(),...pair,status:"pending"};
    updateCat(catId,{pairs:[...cat.pairs,newPair]});
  };

  // Approve/reject pair
  const setPairStatus=(catId,pairId,status)=>{
    const cat=t.categories.find(c=>c.id===catId);
    updateCat(catId,{pairs:cat.pairs.map(p=>p.id===pairId?{...p,status}:p)});
  };

  // Save group match result
  const saveGroupResult=(catId,groupIdx,matchId,sets,winner)=>{
    const cat=t.categories.find(c=>c.id===catId);
    const groups=(cat.groups||[]).map((g,gi)=>gi!==groupIdx?g:{...g,matches:g.matches.map(m=>m.id===matchId?{...m,sets,winner}:m)});
    updateCat(catId,{groups});
  };

  // Save knockout match result
  const saveKOResult=(catId,roundIdx,matchId,sets,winner)=>{
    const cat=t.categories.find(c=>c.id===catId);
    let bracket=(cat.bracket||[]).map((r,ri)=>ri!==roundIdx?r:{...r,matches:r.matches.map(m=>m.id===matchId?{...m,sets,winner}:m)});
    const round=bracket[roundIdx];
    const matchIdx=round.matches.findIndex(m=>m.id===matchId);
    if(winner&&bracket[roundIdx+1]){
      bracket=bracket.map((r,ri)=>ri!==roundIdx+1?r:{...r,matches:r.matches.map((m,mi)=>{
        if(mi!==Math.floor(matchIdx/2))return m;
        return matchIdx%2===0?{...m,p1:winner}:{...m,p2:winner};
      })});
    }
    bracket=bracket.map((r,ri)=>ri===roundIdx?{...r,done:r.matches.every(m=>m.winner)}:r);
    const categories=t.categories.map(c=>c.id===catId?{...c,bracket}:c);
    const updated={...t,categories};
    update({categories,schedule:syncTournamentSchedule(updated,cfg,t.schedule||[])});
  };

  const pairName=(pairId)=>pairNameFromT(t,pairId);

  const hasNext=!!nextLabel();

  return(
    <div style={{animation:"ptUp .2s ease both"}}>
      {/* HEADER */}
      <button className="pt-cd-back" onClick={onBack}>← Torneios</button>
      <div className="pt-acard" style={{padding:"14px 16px",marginBottom:12}}>
        <div className="row g2" style={{marginBottom:8}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:16,fontWeight:800,color:"#EDE9E1",letterSpacing:"-.3px"}}>{t.name}</div>
            <div style={{fontSize:11,color:"#7A766F",marginTop:2}}>{TOURNAMENT_FORMATS[format]?.label||"Torneio"} · {t.startDate}{t.endDate&&t.endDate!==t.startDate?` → ${t.endDate}`:""}{t.courtIds.length>0&&` · ${t.courtIds.length} campo${t.courtIds.length>1?"s":""}`}</div>
          </div>
          <TStatusBadge status={t.status}/>
        </div>
        {t.status!=="finished"&&hasNext&&(
          <button className="pt-btn pt-btn-light pt-btn-w" style={{marginTop:4}} onClick={advanceStatus}>
            {nextLabel()}
          </button>
        )}
      </div>

      {/* CATEGORY TABS */}
      {t.categories.length>1&&(
        <div style={{display:"flex",gap:5,overflow:"auto",marginBottom:14,paddingBottom:2,scrollbarWidth:"none"}}>
          {t.categories.map(c=>(
            <button key={c.id} onClick={()=>setSelCat(c.id)} style={{flexShrink:0,padding:"6px 14px",borderRadius:99,border:`1.5px solid ${selCat===c.id?"rgba(255,255,255,.3)":"rgba(255,255,255,.08)"}`,background:selCat===c.id?"rgba(255,255,255,.1)":"rgba(255,255,255,.03)",color:selCat===c.id?"#EDE9E1":"#7A766F",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              {c.id}
            </button>
          ))}
        </div>
      )}

      {(t.status==="groups"||t.status==="knockouts")&&(
        <SchedulingView t={t} cfg={cfg} onUpdate={onUpdate}/>
      )}

      {cat&&(
        <>
          {/* REGISTRATIONS */}
          {(t.status==="open"||t.status==="closed"||t.status==="draft")&&(
            <div className="pt-acard" style={{padding:0}}>
              <div className="pt-ash">
                <span className="pt-ash-t">Inscrições {cat.id} <span style={{color:"#7A766F",fontWeight:400,fontSize:11}}>({cat.pairs.length} par{cat.pairs.length!==1?"es":""})</span></span>
                {t.status==="open"&&<button className="pt-btn pt-btn-ghost pt-btn-sm" onClick={()=>setShowAddPair(cat.id)}>+ Par</button>}
              </div>
              {cat.pairs.length===0?(
                <div style={{padding:"20px 16px",textAlign:"center",fontSize:12,color:"#3D3A35"}}>Sem inscrições ainda.</div>
              ):cat.pairs.map(p=>(
                <div key={p.id} className="pt-arow">
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#EDE9E1"}}>{p.p1}</div>
                    <div style={{fontSize:11,color:"#7A766F"}}>{p.p2}</div>
                    {p.contact&&<div style={{fontSize:10,color:"#3D3A35",marginTop:2}}>{p.contact}</div>}
                  </div>
                  {p.status==="pending"&&(
                    <div style={{display:"flex",gap:6}}>
                      <button className="pt-btn pt-btn-light pt-btn-sm" onClick={()=>setPairStatus(cat.id,p.id,"approved")}>✓ Aprovar</button>
                      <button className="pt-btn pt-btn-del pt-btn-sm" onClick={()=>setPairStatus(cat.id,p.id,"rejected")}>✕</button>
                    </div>
                  )}
                  {p.status==="approved"&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,background:"rgba(52,211,153,.12)",color:"#34D399"}}>Aprovado</span>}
                  {p.status==="rejected"&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99,background:"rgba(255,107,107,.12)",color:"#FF6B6B"}}>Rejeitado</span>}
                </div>
              ))}
            </div>
          )}

          {/* GROUP PHASE */}
          {t.status==="groups"&&(cat.groups||[]).map((group,gi)=>(
            <div key={group.id} className="pt-acard" style={{padding:0,marginBottom:12}}>
              <div className="pt-ash"><span className="pt-ash-t">Grupo {group.id}</span></div>
              {/* Standings */}
              <div style={{padding:"0 16px 10px"}}>
                {calcStandings(group).map((pid,rank)=>(
                  <div key={pid} className="row g2" style={{padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
                    <span style={{fontSize:11,fontWeight:800,color:rank<t.advanceCount?"#EDE9E1":"#3D3A35",width:18}}>{rank+1}.</span>
                    <span style={{fontSize:12,fontWeight:rank<t.advanceCount?700:400,color:rank<t.advanceCount?"#EDE9E1":"#7A766F",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pairName(pid)}</span>
                    <span style={{fontSize:10,color:"#3D3A35"}}>{group.matches.filter(m=>m.winner===pid).length}V {group.matches.filter(m=>m.winner&&m.winner!==pid&&(m.p1===pid||m.p2===pid)).length}D</span>
                    {rank<t.advanceCount&&<span style={{fontSize:8,fontWeight:700,padding:"1px 6px",borderRadius:99,background:"rgba(52,211,153,.12)",color:"#34D399"}}>Apura</span>}
                  </div>
                ))}
              </div>
              {/* Matches */}
              <div style={{borderTop:"1px solid rgba(255,255,255,.07)"}}>
                {group.matches.map(m=>(
                  <div key={m.id} className="row g2" style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,.05)",cursor:"pointer"}} onClick={()=>setShowResult({type:"group",catId:cat.id,groupIdx:gi,match:m})}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontWeight:m.winner===m.p1?700:400,color:m.winner===m.p1?"#EDE9E1":"#7A766F",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pairName(m.p1)}</div>
                      <div style={{fontSize:11,fontWeight:m.winner===m.p2?700:400,color:m.winner===m.p2?"#EDE9E1":"#7A766F",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}}>{pairName(m.p2)}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      {m.winner?(
                        <div style={{fontSize:11,color:"#7A766F"}}>{m.sets.map(s=>`${s.p1}-${s.p2}`).join(" ")}</div>
                      ):(
                        <span style={{fontSize:10,color:"#3D3A35"}}>+ resultado</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* KNOCKOUT PHASE */}
          {t.status==="knockouts"&&(cat.bracket||[]).map((round,ri)=>(
            <div key={ri} className="pt-acard" style={{padding:0,marginBottom:12}}>
              <div className="pt-ash"><span className="pt-ash-t">{round.name}</span>{round.done&&<span style={{fontSize:10,color:"#34D399"}}>✓ Concluído</span>}</div>
              {round.matches.map(m=>(
                <div key={m.id} className="row g2" style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,.05)",cursor:(!round.done&&m.p1&&m.p2)?"pointer":"default",opacity:(!m.p1||!m.p2)?.4:1}} onClick={()=>!round.done&&m.p1&&m.p2&&setShowResult({type:"ko",catId:cat.id,roundIdx:ri,match:m})}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:m.winner===m.p1?700:400,color:m.winner===m.p1?"#EDE9E1":"#7A766F",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.p1?pairName(m.p1):"A definir"}</div>
                    <div style={{fontSize:11,fontWeight:m.winner===m.p2?700:400,color:m.winner===m.p2?"#EDE9E1":"#7A766F",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}}>{m.p2?pairName(m.p2):"A definir"}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    {m.winner&&m.sets.length>0?(
                      <div style={{fontSize:11,color:"#7A766F"}}>{m.sets.map(s=>`${s.p1}-${s.p2}`).join(" ")}</div>
                    ):m.winner&&m.p2===null?(
                      <span style={{fontSize:10,color:"#34D399"}}>BYE</span>
                    ):(!round.done&&m.p1&&m.p2)?(
                      <span style={{fontSize:10,color:"#3D3A35"}}>+ resultado</span>
                    ):null}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* FINISHED */}
          {t.status==="finished"&&(
            <div className="pt-acard" style={{padding:"28px 20px",textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>🏆</div>
              <div style={{fontSize:15,fontWeight:800,color:"#EDE9E1",marginBottom:4}}>Torneio concluído</div>
              {(cat.bracket||[]).length>0&&(()=>{const br=cat.bracket||[];const final=br[br.length-1];const winner=final?.matches[0]?.winner;return winner?<div style={{fontSize:13,color:"#7A766F"}}>Vencedor {cat.id}: <b style={{color:"#EDE9E1"}}>{pairName(winner)}</b></div>:null;})()}
            </div>
          )}
        </>
      )}

      {/* ADD PAIR MODAL */}
      {showAddPair&&<AddPairModal catId={showAddPair} onSave={(catId,pair)=>{addPair(catId,pair);setShowAddPair(null);}} onClose={()=>setShowAddPair(null)}/>}

      {/* RESULT MODAL */}
      {showResult&&<ResultModal info={showResult} t={t} superTb={t.superTb} pairName={pairName} onSave={(info,sets,winner)=>{if(info.type==="group")saveGroupResult(info.catId,info.groupIdx,info.match.id,sets,winner);else saveKOResult(info.catId,info.roundIdx,info.match.id,sets,winner);setShowResult(null);}} onClose={()=>setShowResult(null)}/>}
    </div>
  );
}

// ── ADD PAIR MODAL ────────────────────────────────────────────────────────────
function AddPairModal({catId,onSave,onClose}){
  const [p1,setP1]=useState("");
  const [p2,setP2]=useState("");
  const [contact,setContact]=useState("");
  const [err,setErr]=useState("");
  const save=()=>{
    if(!p1.trim()||!p2.trim()){setErr("Preenche os dois nomes.");return;}
    onSave(catId,{p1:p1.trim(),p2:p2.trim(),contact:contact.trim()});
  };
  return(
    <div className="pt-mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="pt-modal">
        <div className="pt-modal-handle"/>
        <div className="pt-modal-hd">
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>Torneio · {catId}</div>
            <span className="pt-modal-tt">Inscrever Dupla</span>
          </div>
          <button className="pt-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="pt-modal-body">
          {err&&<div style={{fontSize:12,color:"#FF6B6B",padding:"8px 12px",background:"rgba(255,107,107,.08)",borderRadius:8}}>{err}</div>}
          <div style={{background:"rgba(255,255,255,.04)",borderRadius:10,padding:"14px",display:"flex",flexDirection:"column",gap:10}}>
            <div>
              <div style={{fontSize:9,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Jogador 1 · Capitão</div>
              <input className="pt-mfi" placeholder="Nome completo" value={p1} onChange={e=>{setP1(e.target.value);setErr("");}} autoFocus/>
            </div>
            <div style={{height:1,background:"rgba(255,255,255,.06)"}}/>
            <div>
              <div style={{fontSize:9,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Jogador 2 · Parceiro</div>
              <input className="pt-mfi" placeholder="Nome completo" value={p2} onChange={e=>{setP2(e.target.value);setErr("");}}/>
            </div>
          </div>
          <div>
            <div style={{fontSize:9,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Contacto (opcional)</div>
            <input className="pt-mfi" placeholder="Email ou telemóvel" value={contact} onChange={e=>setContact(e.target.value)}/>
          </div>
          <div style={{fontSize:11,color:"#3D3A35",lineHeight:1.5}}>
            A inscrição ficará pendente até ser aprovada.
          </div>
        </div>
        <div className="pt-modal-foot">
          <button className="pt-btn pt-btn-ghost pt-btn-w" onClick={onClose}>Cancelar</button>
          <button className="pt-btn pt-btn-light pt-btn-w" onClick={save}>✓ Inscrever Dupla</button>
        </div>
      </div>
    </div>
  );
}

// ── RESULT MODAL ─────────────────────────────────────────────────────────────
function ResultModal({info,t,superTb,pairName,onSave,onClose}){
  const m=info.match;
  const [sets,setSets]=useState([{p1:"",p2:""},{p1:"",p2:""},{p1:"",p2:""}]);
  const setScore=(si,who,val)=>setSets(prev=>prev.map((s,i)=>i===si?{...s,[who]:val}:s));

  const calcWinner=()=>{
    const played=sets.filter(s=>s.p1!==""&&s.p2!=="");
    let w1=0,w2=0;
    played.forEach((s,i)=>{
      const s1=parseInt(s.p1),s2=parseInt(s.p2);
      if(isNaN(s1)||isNaN(s2))return;
      if(i===2&&superTb){if(s1>=10&&s1-s2>=2)w1++;else if(s2>=10&&s2-s1>=2)w2++;}
      else{if(s1>s2)w1++;else if(s2>s1)w2++;}
    });
    if(w1>=2)return m.p1;if(w2>=2)return m.p2;return null;
  };

  const save=()=>{
    const winner=calcWinner();
    if(!winner)return;
    const played=sets.filter(s=>s.p1!==""&&s.p2!=="").map(s=>({p1:parseInt(s.p1),p2:parseInt(s.p2)}));
    onSave(info,played,winner);
  };

  const winner=calcWinner();
  const setLabels=["1.º Set","2.º Set",superTb?"Super Tie-Break":"3.º Set"];

  return(
    <div className="pt-mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="pt-modal">
        <div className="pt-modal-handle"/>
        <div className="pt-modal-hd"><span className="pt-modal-tt">Resultado</span><button className="pt-modal-close" onClick={onClose}>✕</button></div>
        <div className="pt-modal-body">
          <div style={{background:"rgba(255,255,255,.04)",borderRadius:10,padding:"12px 14px",marginBottom:4}}>
            <div style={{fontSize:13,fontWeight:700,color:"#EDE9E1",marginBottom:3}}>{pairName(m.p1)}</div>
            <div style={{fontSize:11,color:"#7A766F"}}>vs.</div>
            <div style={{fontSize:13,fontWeight:700,color:"#EDE9E1",marginTop:3}}>{pairName(m.p2)}</div>
          </div>

          {sets.map((s,i)=>{
            const isThird=i===2;
            const firstTwoPlayed=parseInt(sets[0].p1)>=0&&parseInt(sets[1].p1)>=0;
            const w1=sets.slice(0,2).filter(s=>parseInt(s.p1)>parseInt(s.p2)).length;
            const w2=sets.slice(0,2).filter(s=>parseInt(s.p2)>parseInt(s.p1)).length;
            const needsThird=firstTwoPlayed&&w1===1&&w2===1;
            if(isThird&&!needsThird)return null;
            return(
              <div key={i}>
                <div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:".8px",marginBottom:7}}>{setLabels[i]}{isThird&&superTb&&<span style={{fontSize:9,color:"#3D3A35",marginLeft:6}}>Até 10 pts</span>}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:10,alignItems:"center"}}>
                  <input className="pt-mfi" type="number" min="0" max={isThird&&superTb?99:7} placeholder="0" value={s.p1} onChange={e=>setScore(i,"p1",e.target.value)} style={{textAlign:"center",fontSize:20,fontWeight:800,padding:"10px"}}/>
                  <span style={{color:"#3D3A35",fontWeight:700}}>–</span>
                  <input className="pt-mfi" type="number" min="0" max={isThird&&superTb?99:7} placeholder="0" value={s.p2} onChange={e=>setScore(i,"p2",e.target.value)} style={{textAlign:"center",fontSize:20,fontWeight:800,padding:"10px"}}/>
                </div>
              </div>
            );
          })}

          {winner&&(
            <div style={{padding:"10px 14px",borderRadius:9,background:"rgba(52,211,153,.08)",border:"1px solid rgba(52,211,153,.2)",textAlign:"center"}}>
              <div style={{fontSize:10,color:"#34D399",fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",marginBottom:2}}>Vencedor</div>
              <div style={{fontSize:13,fontWeight:800,color:"#EDE9E1"}}>{pairName(winner)}</div>
            </div>
          )}
        </div>
        <div className="pt-modal-foot">
          <button className="pt-btn pt-btn-ghost pt-btn-w" onClick={onClose}>Cancelar</button>
          <button className="pt-btn pt-btn-light pt-btn-w" onClick={save} disabled={!winner}>Guardar Resultado</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEDULING VIEW (after inscriptions close)
// ═══════════════════════════════════════════════════════════════════════════════
function SchedulingView({t,cfg,onUpdate}){
  const courts = cfg.courts.filter(c=>c.active && (t.courtIds.length===0||t.courtIds.includes(c.id)));
  const [schedule, setSchedule] = useState(t.schedule||[]);
  const [generating, setGen]    = useState(false);
  const allMatches = collectTournamentMatches(t);
  useEffect(()=>setSchedule(t.schedule||[]),[t.schedule]);

  const autoGenerate = () => {
    setGen(true);
    const generated = generateTournamentSchedule(t,cfg);
    setSchedule(generated);
    onUpdate({...t,schedule:generated});
    setTimeout(()=>setGen(false),400);
  };

  const updateSlot=(id,changes)=>{
    const updated=schedule.map(s=>s.id===id?{...s,...changes}:s);
    setSchedule(updated);
    onUpdate({...t,schedule:updated});
  };

  // Group by date then time
  const byDate={};
  schedule.forEach(s=>{
    if(!byDate[s.date])byDate[s.date]={};
    if(!byDate[s.date][s.time])byDate[s.date][s.time]=[];
    byDate[s.date][s.time].push(s);
  });

  const SLOTS_H=["07","08","09","10","11","12","13","14","15","16","17","18","19","20","21"];
  const SLOT_OPTS=[];
  SLOTS_H.forEach(h=>{SLOT_OPTS.push(`${h}:00`);SLOT_OPTS.push(`${h}:30`);});

  return(
    <div style={{marginBottom:14}}>
      {/* AUTO GENERATE */}
      <div className="pt-acard" style={{padding:"14px 16px",marginBottom:12}}>
        <div className="row g2" style={{alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:800,color:"#EDE9E1",marginBottom:4}}>Calendário automático</div>
            <div style={{fontSize:11,color:"#7A766F",lineHeight:1.45}}>{courts.length} campo{courts.length!==1?"s":""} · {t.slotMinutes||90} min/jogo · {allMatches.length} jogo{allMatches.length!==1?"s":""}</div>
          </div>
          <button className="pt-btn pt-btn-light pt-btn-sm" onClick={autoGenerate} disabled={generating||courts.length===0||allMatches.length===0}>
            {generating?"A gerar…":"Regenerar"}
          </button>
        </div>
      </div>

      {/* SCHEDULE TABLE */}
      {schedule.length>0&&Object.keys(byDate).sort().map(date=>(
        <div key={date} style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:800,color:"#EDE9E1",marginBottom:8,letterSpacing:"-.1px"}}>
            📅 {new Date(date+"T12:00:00").toLocaleDateString("pt-PT",{weekday:"long",day:"numeric",month:"long"})}
          </div>
          {Object.keys(byDate[date]).sort().map(time=>(
            <div key={time} style={{marginBottom:8}}>
              <div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>🕐 {time}</div>
              {byDate[date][time].map(slot=>(
                <div key={slot.id} className="pt-acard" style={{padding:"11px 14px",marginBottom:6}}>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:".5px",marginBottom:3}}>{slot.label}</div>
                      <div style={{fontSize:12,fontWeight:700,color:"#EDE9E1"}}>{slot.p1}</div>
                      <div style={{fontSize:11,color:"#7A766F"}}>vs. {slot.p2}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
                      <input type="date" style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,padding:"4px 8px",color:"#EDE9E1",fontSize:11,fontFamily:"inherit",outline:"none"}} value={slot.date} onChange={e=>updateSlot(slot.id,{date:e.target.value})}/>
                      <select style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,padding:"4px 8px",color:"#EDE9E1",fontSize:11,fontFamily:"inherit",outline:"none"}} value={slot.courtName} onChange={e=>{const c=courts.find(c=>c.name===e.target.value);updateSlot(slot.id,{courtName:e.target.value,courtId:c?.id||slot.courtId});}}>
                        {courts.map(c=><option key={c.id}>{c.name}</option>)}
                      </select>
                      <select style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,padding:"4px 8px",color:"#EDE9E1",fontSize:11,fontFamily:"inherit",outline:"none"}} value={slot.time} onChange={e=>updateSlot(slot.id,{time:e.target.value})}>
                        {SLOT_OPTS.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      {schedule.length===0&&(
        <div className="pt-acard" style={{padding:"24px",textAlign:"center",color:"#3D3A35",fontSize:13}}>
          Gera o calendário automaticamente ou ajusta manualmente após gerar.
        </div>
      )}
    </div>
  );
}

function pairNameFromT(t,pairId){
  if(!pairId)return"A definir";
  for(const c of t.categories){const p=c.pairs.find(p=>p.id===pairId);if(p)return`${p.p1} / ${p.p2}`;}
  return"—";
}

function TournamentSchedulePublic({schedule=[]}){
  const upcoming=schedule.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
  if(upcoming.length===0)return null;
  return(
    <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:12,marginBottom:16,overflow:"hidden"}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(0,0,0,.06)",fontSize:13,fontWeight:800,color:"#141210"}}>Calendário de jogos</div>
      {upcoming.map(s=>(
        <div key={s.matchKey} style={{padding:"11px 16px",borderBottom:"1px solid rgba(0,0,0,.05)",display:"flex",gap:10,alignItems:"flex-start"}}>
          <div style={{width:58,flexShrink:0}}>
            <div style={{fontSize:12,fontWeight:800,color:"#141210"}}>{s.time}</div>
            <div style={{fontSize:10,color:"#B5B0A8"}}>{fmtSh(s.date)}</div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:700,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:".7px",marginBottom:3}}>{s.label} · {s.courtName}</div>
            <div style={{fontSize:12,fontWeight:700,color:"#141210",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.p1}</div>
            <div style={{fontSize:11,color:"#7A766F",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>vs. {s.p2}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC TOURNAMENT REGISTRATION (in portal)
// ═══════════════════════════════════════════════════════════════════════════════
function TournamentRegistration({tournaments,onRegister,onBack}){
  const open = tournaments.filter(t=>t.status==="open");
  const [sel, setSel] = useState(open.length===1?open[0]:null);
  const firstCat = open.length===1&&open[0].categories.length===1 ? open[0].categories[0].id : "";
  const [form, setForm] = useState({p1:"",p2:"",contact:"",catId:firstCat});
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));

  const submit=()=>{
    if(!form.p1.trim()||!form.p2.trim()){setErr("Preenche os dois nomes.");return;}
    if(!form.catId){setErr("Escolhe uma categoria.");return;}
    onRegister(sel.id,form.catId,{p1:form.p1.trim(),p2:form.p2.trim(),contact:form.contact.trim()});
    setDone(true);
  };

  if(done) return(
    <div style={{textAlign:"center",padding:"48px 20px",background:"#F4F0E8",minHeight:"calc(100vh - 52px)"}}>
      <div style={{fontSize:48,marginBottom:16}}>✅</div>
      <div style={{fontSize:20,fontWeight:800,color:"#141210",letterSpacing:"-.5px",marginBottom:8}}>Inscrição enviada!</div>
      <div style={{fontSize:14,color:"#7A766F",maxWidth:280,margin:"0 auto",lineHeight:1.65}}>A tua inscrição foi submetida. O clube irá confirmar em breve.</div>
        <button style={{marginTop:24,padding:"11px 24px",borderRadius:10,background:"#141210",color:"#F4F0E8",border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setDone(false);if(open.length===1){onBack();return;}setSel(null);setForm({p1:"",p2:"",contact:"",catId:""});}}>← Ver Torneios</button>
    </div>
  );

  if(sel) return(
    <div style={{background:"#F4F0E8",minHeight:"calc(100vh - 52px)"}}>
      <div style={{position:"sticky",top:52,background:"rgba(244,240,232,.95)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(0,0,0,.09)",padding:"0 18px",height:48,display:"flex",alignItems:"center",gap:10}}>
        <button style={{display:"flex",alignItems:"center",gap:6,color:"#7A766F",background:"none",border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>open.length===1?onBack():setSel(null)}>← Torneios</button>
        <span style={{fontWeight:800,fontSize:14,color:"#141210",flex:1}}>Inscrição</span>
      </div>
      <div style={{maxWidth:540,margin:"0 auto",padding:"20px 18px 80px"}}>
        <div style={{background:"#FFFFFF",borderRadius:14,padding:"16px",marginBottom:16,border:"1px solid rgba(0,0,0,.09)"}}>
          <div style={{fontSize:16,fontWeight:800,color:"#141210",letterSpacing:"-.3px"}}>{sel.name}</div>
          <div style={{fontSize:12,color:"#7A766F",marginTop:4}}>{sel.startDate}{sel.endDate&&sel.endDate!==sel.startDate?` → ${sel.endDate}`:""}</div>
        </div>

        {err&&<div style={{fontSize:12,color:"#E53E3E",padding:"8px 12px",background:"rgba(229,62,62,.08)",borderRadius:8,marginBottom:12}}>{err}</div>}

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Categoria</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {sel.categories.map(c=>(
                <div key={c.id} onClick={()=>set("catId",c.id)} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${form.catId===c.id?"#141210":"rgba(0,0,0,.12)"}`,background:form.catId===c.id?"#141210":"#FFFFFF",color:form.catId===c.id?"#F4F0E8":"#7A766F",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .15s"}}>
                  {c.id}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Capitão (tu)</div>
            <input style={{background:"#FFFFFF",border:"1.5px solid rgba(0,0,0,.12)",borderRadius:9,padding:"12px 14px",color:"#141210",fontSize:14,outline:"none",width:"100%",fontFamily:"inherit"}} placeholder="O teu nome completo" value={form.p1} onChange={e=>set("p1",e.target.value)}/>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Parceiro/a</div>
            <input style={{background:"#FFFFFF",border:"1.5px solid rgba(0,0,0,.12)",borderRadius:9,padding:"12px 14px",color:"#141210",fontSize:14,outline:"none",width:"100%",fontFamily:"inherit"}} placeholder="Nome do parceiro/a" value={form.p2} onChange={e=>set("p2",e.target.value)}/>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Contacto</div>
            <input style={{background:"#FFFFFF",border:"1.5px solid rgba(0,0,0,.12)",borderRadius:9,padding:"12px 14px",color:"#141210",fontSize:14,outline:"none",width:"100%",fontFamily:"inherit"}} placeholder="Email ou telemóvel" value={form.contact} onChange={e=>set("contact",e.target.value)}/>
          </div>
          <button style={{padding:"14px",borderRadius:10,background:"#141210",color:"#F4F0E8",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}} onClick={submit}>
            Submeter Inscrição
          </button>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{background:"#F4F0E8",minHeight:"calc(100vh - 52px)"}}>
      <div style={{padding:"36px 18px 20px",borderBottom:"1px solid rgba(0,0,0,.08)"}}>
        <div style={{fontSize:11,fontWeight:700,background:"#141210",color:"#F4F0E8",display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:99,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:14}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"#F4F0E8"}}/>Torneios
        </div>
        <h2 style={{fontSize:"clamp(32px,8vw,56px)",fontWeight:800,color:"#141210",letterSpacing:"-2px",lineHeight:.95,marginBottom:12}}>Inscreve-te<br/>num torneio</h2>
        <p style={{fontSize:14,color:"#7A766F",lineHeight:1.65}}>Escolhe o torneio, a tua categoria e inscreve a tua dupla.</p>
      </div>
      <div style={{padding:"20px 18px 80px",maxWidth:640,margin:"0 auto"}}>
        {open.length===0?(
          <div style={{textAlign:"center",padding:"48px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>🏆</div>
            <div style={{fontSize:16,fontWeight:800,color:"#141210",marginBottom:6}}>Sem torneios abertos</div>
            <div style={{fontSize:14,color:"#7A766F"}}>Quando o clube abrir inscrições aparecerão aqui.</div>
          </div>
        ):open.map(t=>(
          <div key={t.id} style={{background:"#FFFFFF",borderRadius:14,border:"1px solid rgba(0,0,0,.09)",overflow:"hidden",marginBottom:12,cursor:"pointer",transition:"all .2s",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}} onClick={()=>setSel(t)}>
            <div style={{height:3,background:"#141210"}}/>
            <div style={{padding:"16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:"#141210",letterSpacing:"-.3px"}}>{t.name}</div>
                  <div style={{fontSize:12,color:"#7A766F",marginTop:3}}>📅 {t.startDate}{t.endDate&&t.endDate!==t.startDate?` → ${t.endDate}`:""}</div>
                </div>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:"rgba(52,211,153,.12)",color:"#34D399",whiteSpace:"nowrap"}}>Inscrições Abertas</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                {t.categories.map(c=>(
                  <span key={c.id} style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:99,background:"#F4F0E8",color:"#7A766F"}}>{c.id}</span>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:12,color:"#B5B0A8"}}>Inscrição rápida</div>
                <button style={{padding:"8px 16px",borderRadius:9,background:"#141210",color:"#F4F0E8",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Inscrever →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 1 — PLAYER EXPERIENCE
// ═══════════════════════════════════════════════════════════════════════════════

// ── MY BOOKINGS (player looks up by email) ───────────────────────────────────
function MyBookings({bookings,cfg,onCancelBooking}){
  const [email,setEmail]=useState("");
  const [searched,setSearched]=useState(false);
  const [loading,setLoading]=useState(false);
  const [cancelId,setCancelId]=useState(null);

  const search=async()=>{
    if(!email.trim()||!/\S+@\S+\.\S+/.test(email)){return;}
    setLoading(true);
    await new Promise(r=>setTimeout(r,600));
    setSearched(true);
    setLoading(false);
  };

  const myBk=searched?bookings.filter(b=>b.contactEmail.toLowerCase()===email.toLowerCase().trim()).sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time)):[];
  const upcoming=myBk.filter(b=>b.date>=TODAY&&b.status!=="cancelled");
  const past=myBk.filter(b=>b.date<TODAY||b.status==="cancelled");

  const canCancel=(b)=>{
    if(!cfg.allowCancel)return false;
    if(b.status!=="confirmed"&&b.status!=="pending")return false;
    const bDt=new Date(b.date+"T"+b.time+":00");
    const hrs=(bDt-new Date())/36e5;
    return hrs>=(cfg.cancelHours||24);
  };

  const doCancel=(id)=>{
    onCancelBooking(id);
    setCancelId(null);
  };

  return(
    <div style={{background:"#F4F0E8",minHeight:"calc(100vh - 52px)"}}>
      <div style={{padding:"36px 20px 24px",borderBottom:"1px solid rgba(0,0,0,.08)"}}>
        <div style={{fontSize:11,fontWeight:700,background:"#141210",color:"#F4F0E8",display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:99,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:14}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"#F4F0E8"}}/>As Minhas Reservas
        </div>
        <h2 style={{fontSize:"clamp(28px,7vw,48px)",fontWeight:800,color:"#141210",letterSpacing:"-2px",lineHeight:.95,marginBottom:12}}>Consulta<br/>as tuas reservas</h2>
        <p style={{fontSize:14,color:"#7A766F",lineHeight:1.65,marginBottom:20}}>Introduz o email que usaste na reserva.</p>
        <div style={{display:"flex",gap:8,maxWidth:480}}>
          <input
            style={{flex:1,background:"#FFFFFF",border:"1.5px solid rgba(0,0,0,.12)",borderRadius:10,padding:"12px 14px",fontSize:14,outline:"none",fontFamily:"inherit",color:"#141210"}}
            placeholder="o.teu@email.pt"
            type="email" inputMode="email"
            value={email} onChange={e=>setEmail(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&search()}
          />
          <button onClick={search} style={{padding:"12px 20px",borderRadius:10,background:"#141210",color:"#F4F0E8",border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
            {loading?<Spin/>:"Pesquisar"}
          </button>
        </div>
      </div>

      {searched&&(
        <div style={{padding:"20px 18px 80px",maxWidth:580,margin:"0 auto"}}>
          {myBk.length===0?(
            <div style={{textAlign:"center",padding:"48px 0"}}>
              <div style={{fontSize:40,marginBottom:12}}>🎾</div>
              <div style={{fontSize:16,fontWeight:800,color:"#141210",marginBottom:6}}>Sem reservas</div>
              <div style={{fontSize:14,color:"#7A766F"}}>Não encontrámos reservas com este email.</div>
            </div>
          ):(
            <>
              {upcoming.length>0&&(
                <>
                  <div style={{fontSize:11,fontWeight:700,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>Próximas ({upcoming.length})</div>
                  {upcoming.map(b=><BookingRow key={b.id} b={b} cfg={cfg} canCancel={canCancel(b)} onCancel={()=>setCancelId(b.id)}/>)}
                </>
              )}
              {past.length>0&&(
                <>
                  <div style={{fontSize:11,fontWeight:700,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1.5px",margin:"20px 0 12px"}}>Histórico ({past.length})</div>
                  {past.map(b=><BookingRow key={b.id} b={b} cfg={cfg} canCancel={false} past/>)}
                </>
              )}
            </>
          )}
        </div>
      )}

      {cancelId&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",zIndex:200}}>
          <div style={{background:"#F9F7F3",borderRadius:"20px 20px 0 0",width:"100%",padding:"20px 20px 32px"}}>
            <div style={{width:36,height:4,background:"rgba(0,0,0,.12)",borderRadius:99,margin:"0 auto 16px"}}/>
            <div style={{fontSize:16,fontWeight:800,color:"#141210",marginBottom:8}}>Cancelar reserva?</div>
            <div style={{fontSize:14,color:"#7A766F",marginBottom:20}}>Esta acção não pode ser desfeita.</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>doCancel(cancelId)} style={{flex:1,padding:"13px",borderRadius:10,background:"#141210",color:"#F4F0E8",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Cancelar reserva</button>
              <button onClick={()=>setCancelId(null)} style={{flex:1,padding:"13px",borderRadius:10,background:"transparent",color:"#7A766F",border:"1.5px solid rgba(0,0,0,.12)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Voltar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingRow({b,cfg,canCancel,onCancel,past}){
  const court=cfg.courts.find(c=>c.id===b.courtId);
  const night=isNt(b.time,parseInt(cfg.nightFrom||18));
  const price=(night?cfg.priceNight:cfg.priceDay)*cfg.playersPerCourt*((b.dur||60)/60);
  const endH=addMins(b.time||"00:00",b.dur||60);
  const statusColor={confirmed:"#34D399",pending:"#F59E0B",cancelled:"#B5B0A8"}[b.status]||"#B5B0A8";
  const statusLabel={confirmed:"Confirmada",pending:"Pendente",cancelled:"Cancelada"}[b.status]||b.status;
  return(
    <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:12,padding:"14px 16px",marginBottom:10,opacity:past?.6:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div>
          <div style={{fontSize:14,fontWeight:800,color:"#141210",letterSpacing:"-.2px"}}>{fmtLong(b.date)}</div>
          <div style={{fontSize:12,color:"#7A766F",marginTop:3}}>{b.time}–{endH} · {durLbl(b.dur||60)} · {court?.name}</div>
        </div>
        <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:statusColor+"22",color:statusColor,whiteSpace:"nowrap"}}>{statusLabel}</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:8}}>
          <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"#F4F0E8",color:"#7A766F"}}>{night?"🌙 Noturno":"☀️ Diurno"}</span>
          <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:99,background:"#F4F0E8",color:"#7A766F"}}>{PAY.find(p=>p.id===b.pay)?.icon} {PAY.find(p=>p.id===b.pay)?.label}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:14,fontWeight:800,color:"#141210"}}>{Math.round(price)}€</span>
          {canCancel&&<button onClick={onCancel} style={{fontSize:11,fontWeight:700,color:"#E53E3E",background:"rgba(229,62,62,.08)",border:"1px solid rgba(229,62,62,.15)",padding:"4px 10px",borderRadius:7,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>}
        </div>
      </div>
    </div>
  );
}

// ── WAITLIST ──────────────────────────────────────────────────────────────────
function WaitlistModal({club,day,time,dur,onClose,onJoin}){
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [done,setDone]=useState(false);
  const submit=()=>{
    if(!name.trim()||!email.trim())return;
    onJoin({name,email,phone,date:day,time,dur,clubId:club.id});
    setDone(true);
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",zIndex:200,animation:"ptIn .18s ease"}}>
      <div style={{background:"#F9F7F3",borderRadius:"20px 20px 0 0",width:"100%",maxHeight:"80vh",overflowY:"auto",animation:"ptSlide .25s ease"}}>
        <div style={{width:36,height:4,background:"rgba(0,0,0,.12)",borderRadius:99,margin:"12px auto 0"}}/>
        {done?(
          <div style={{padding:"32px 20px 40px",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:14}}>✅</div>
            <div style={{fontSize:16,fontWeight:800,color:"#141210",marginBottom:6}}>Estás na lista!</div>
            <div style={{fontSize:14,color:"#7A766F",marginBottom:20}}>Avisamos-te por email se abrir uma vaga.</div>
            <button onClick={onClose} style={{padding:"12px 24px",borderRadius:10,background:"#141210",color:"#F4F0E8",border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Fechar</button>
          </div>
        ):(
          <>
            <div style={{padding:"16px 20px 0"}}>
              <div style={{fontWeight:700,background:"rgba(0,0,0,.07)",color:"#7A766F",display:"inline-flex",padding:"3px 10px",borderRadius:99,marginBottom:8,letterSpacing:"1px",textTransform:"uppercase",fontSize:9}}>Lista de Espera</div>
              <div style={{fontSize:20,fontWeight:800,color:"#141210",letterSpacing:"-.5px",marginBottom:4}}>Avisa-me se abrir vaga</div>
              <div style={{fontSize:13,color:"#7A766F",marginBottom:16}}>{fmtLong(day)} · {time} · {durLbl(dur||60)}</div>
            </div>
            <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
              <input style={{background:"#FFFFFF",border:"1.5px solid rgba(0,0,0,.12)",borderRadius:9,padding:"12px 14px",fontSize:14,outline:"none",fontFamily:"inherit",width:"100%"}} placeholder="Nome completo" value={name} onChange={e=>setName(e.target.value)}/>
              <input type="email" inputMode="email" style={{background:"#FFFFFF",border:"1.5px solid rgba(0,0,0,.12)",borderRadius:9,padding:"12px 14px",fontSize:14,outline:"none",fontFamily:"inherit",width:"100%"}} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
              <input type="tel" inputMode="tel" style={{background:"#FFFFFF",border:"1.5px solid rgba(0,0,0,.12)",borderRadius:9,padding:"12px 14px",fontSize:14,outline:"none",fontFamily:"inherit",width:"100%"}} placeholder="Telemóvel (opcional)" value={phone} onChange={e=>setPhone(e.target.value)}/>
            </div>
            <div style={{padding:"16px 20px 36px",display:"flex",gap:8}}>
              <button onClick={submit} disabled={!name.trim()||!email.trim()} style={{flex:1,padding:"13px",borderRadius:10,background:"#141210",color:"#F4F0E8",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity:(!name.trim()||!email.trim())?.4:1}}>Entrar na Lista</button>
              <button onClick={onClose} style={{flex:1,padding:"13px",borderRadius:10,background:"transparent",color:"#7A766F",border:"1.5px solid rgba(0,0,0,.12)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── PUBLIC TOURNAMENT BRACKET ─────────────────────────────────────────────────
function TournamentPublicView({t,onBack,onRegister}){
  const [selCat,setSelCat]=useState(t.categories[0]?.id||null);
  const cat=t.categories.find(c=>c.id===selCat);
  const pn=(pid)=>pairNameFromT(t,pid);

  return(
    <div style={{background:"#F4F0E8",minHeight:"calc(100vh - 52px)"}}>
      <div style={{position:"sticky",top:52,background:"rgba(244,240,232,.95)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(0,0,0,.09)",padding:"0 18px",height:48,display:"flex",alignItems:"center",gap:10}}>
        <button style={{display:"flex",alignItems:"center",gap:6,color:"#7A766F",background:"none",border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onBack}>← Torneios</button>
        <span style={{fontWeight:800,fontSize:14,color:"#141210",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</span>
        <TStatusBadgePub status={t.status}/>
      </div>
      <div style={{padding:"20px 18px 0",maxWidth:640,margin:"0 auto"}}>
        <div style={{fontSize:12,color:"#7A766F",marginBottom:16}}>📅 {t.startDate}{t.endDate&&t.endDate!==t.startDate?` → ${t.endDate}`:""}</div>
        {t.categories.length>1&&(
          <div style={{display:"flex",gap:5,overflow:"auto",marginBottom:16,paddingBottom:2,scrollbarWidth:"none"}}>
            {t.categories.map(c=>(
              <button key={c.id} onClick={()=>setSelCat(c.id)} style={{flexShrink:0,padding:"6px 14px",borderRadius:99,border:`1.5px solid ${selCat===c.id?"#141210":"rgba(0,0,0,.12)"}`,background:selCat===c.id?"#141210":"#FFFFFF",color:selCat===c.id?"#F4F0E8":"#7A766F",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                {c.id}
              </button>
            ))}
          </div>
        )}
        {t.status!=="open"&&<TournamentSchedulePublic schedule={t.schedule||[]}/>}
        {cat&&(
          <>
            {t.status==="open"&&(
              <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:14,padding:"20px",marginBottom:12,textAlign:"center"}}>
                <div style={{fontSize:15,fontWeight:800,color:"#141210",marginBottom:6}}>Inscrições abertas</div>
                <div style={{fontSize:13,color:"#7A766F",lineHeight:1.55,margin:"0 auto 16px",maxWidth:360}}>
                  Garante a tua dupla nesta categoria. O quadro e o calendário ficam visíveis quando o clube encerrar as inscrições.
                </div>
                {onRegister&&<button onClick={()=>onRegister(t)} style={{width:"100%",padding:"13px",borderRadius:10,background:"#141210",color:"#F4F0E8",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Inscrever →</button>}
              </div>
            )}

            {/* Groups */}
            {(t.status==="groups"||t.status==="knockouts"||t.status==="finished")&&(cat.groups||[]).map((g,gi)=>(
              <div key={g.id} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:12,marginBottom:12,overflow:"hidden"}}>
                <div style={{padding:"12px 16px 0",fontSize:12,fontWeight:800,color:"#141210",letterSpacing:"-.2px",marginBottom:10}}>Grupo {g.id}</div>
                <div style={{padding:"0 16px 10px"}}>
                  {calcStandings(g).map((pid,rank)=>{
                    const wins=g.matches.filter(m=>m.winner===pid).length;
                    const losses=g.matches.filter(m=>m.winner&&m.winner!==pid&&(m.p1===pid||m.p2===pid)).length;
                    return(
                      <div key={pid} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid rgba(0,0,0,.06)"}}>
                        <span style={{fontSize:12,fontWeight:800,color:rank<t.advanceCount?"#141210":"#B5B0A8",width:20}}>{rank+1}.</span>
                        <span style={{fontSize:13,fontWeight:rank<t.advanceCount?700:400,color:rank<t.advanceCount?"#141210":"#7A766F",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pn(pid)}</span>
                        <span style={{fontSize:11,color:"#B5B0A8"}}>{wins}V {losses}D</span>
                        {rank<t.advanceCount&&<span style={{fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:99,background:"rgba(52,211,153,.12)",color:"#34D399"}}>✓ Apura</span>}
                      </div>
                    );
                  })}
                </div>
                {/* Group matches results */}
                {g.matches.filter(m=>m.winner).map(m=>(
                  <div key={m.id} style={{display:"flex",alignItems:"center",padding:"8px 16px",borderTop:"1px solid rgba(0,0,0,.05)",gap:8}}>
                    <span style={{fontSize:11,flex:1,fontWeight:m.winner===m.p1?700:400,color:m.winner===m.p1?"#141210":"#B5B0A8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pn(m.p1)}</span>
                    <span style={{fontSize:11,color:"#B5B0A8",fontWeight:600,flexShrink:0}}>{m.sets.map(s=>`${s.p1}-${s.p2}`).join(" ")}</span>
                    <span style={{fontSize:11,flex:1,fontWeight:m.winner===m.p2?700:400,color:m.winner===m.p2?"#141210":"#B5B0A8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"right"}}>{pn(m.p2)}</span>
                  </div>
                ))}
              </div>
            ))}
            {/* Bracket */}
            {(t.status==="knockouts"||t.status==="finished")&&(cat.bracket||[]).map((round,ri)=>(
              <div key={ri} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:12,marginBottom:12,overflow:"hidden"}}>
                <div style={{padding:"12px 16px 8px",fontSize:12,fontWeight:800,color:"#141210",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  {round.name}{round.done&&<span style={{fontSize:10,color:"#34D399",fontWeight:700}}>✓ Concluído</span>}
                </div>
                {round.matches.map(m=>(
                  <div key={m.id} style={{padding:"10px 16px",borderTop:"1px solid rgba(0,0,0,.05)",opacity:(!m.p1||!m.p2)?.4:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:12,fontWeight:m.winner===m.p1?800:400,color:m.winner===m.p1?"#141210":"#7A766F",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.p1?pn(m.p1):"A definir"}</span>
                      {m.winner&&<span style={{fontSize:11,color:"#B5B0A8",flexShrink:0}}>{m.sets.map(s=>`${s.p1}-${s.p2}`).join(" ")}</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                      <span style={{fontSize:12,fontWeight:m.winner===m.p2?800:400,color:m.winner===m.p2?"#141210":"#7A766F",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.p2?pn(m.p2):"A definir"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {t.status==="finished"&&(()=>{
              const finalRound=(cat.bracket||[])[(cat.bracket||[]).length-1];
              const winner=finalRound?.matches[0]?.winner;
              return winner?(
                <div style={{background:"#141210",borderRadius:12,padding:"24px 20px",textAlign:"center",marginBottom:12}}>
                  <div style={{fontSize:32,marginBottom:8}}>🏆</div>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:4}}>Vencedor {cat.id}</div>
                  <div style={{fontSize:18,fontWeight:800,color:"#F4F0E8"}}>{pn(winner)}</div>
                </div>
              ):null;
            })()}
            {(t.status==="draft"||t.status==="closed")&&(
              <div style={{textAlign:"center",padding:"32px 0",color:"#B5B0A8",fontSize:13}}>
                {t.status==="closed"?"Inscrições encerradas. Aguarda geração do quadro e calendário.":"Torneio em preparação."}
              </div>
            )}
          </>
        )}
      </div>
      <div style={{height:40}}/>
    </div>
  );
}

function TStatusBadgePub({status}){
  const c={draft:{bg:"rgba(0,0,0,.07)",c:"#7A766F"},open:{bg:"rgba(52,211,153,.1)",c:"#1A7A4A"},closed:{bg:"rgba(245,158,11,.1)",c:"#B45309"},scheduling:{bg:"rgba(56,189,248,.1)",c:"#0369A1"},groups:{bg:"rgba(99,102,241,.1)",c:"#4338CA"},knockouts:{bg:"rgba(139,92,246,.1)",c:"#7C3AED"},finished:{bg:"rgba(0,0,0,.06)",c:"#7A766F"}}[status]||{bg:"rgba(0,0,0,.07)",c:"#7A766F"};
  return <span style={{fontSize:9,fontWeight:700,padding:"3px 9px",borderRadius:99,background:c.bg,color:c.c,whiteSpace:"nowrap",textTransform:"uppercase",letterSpacing:"1px"}}>{T_SL[status]||status}</span>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2 — ADMIN IMPROVED
// ═══════════════════════════════════════════════════════════════════════════════

// ── OCCUPANCY GRID ────────────────────────────────────────────────────────────
function OccupancyGrid({cfg,bookings,blocks,day}){
  const courts=cfg.courts.filter(c=>c.active);
  const slots=genSlots(cfg.openFrom,cfg.openTo);
  const nf=parseInt(cfg.nightFrom||18);

  const getSlotState=(courtId,time)=>{
    if(isBlocked(courtId,day,time,60,blocks))return"blocked";
    const bk=bookings.find(b=>b.courtId===courtId&&b.date===day&&(b.status==="confirmed"||b.status==="pending")&&occS(b.time,b.dur||60).includes(time));
    if(bk)return bk.status==="pending"?"pending":"booked";
    return"free";
  };

  const stateStyle={
    free:    {bg:"rgba(0,0,0,.04)",  c:"#B5B0A8",   label:""},
    booked:  {bg:"#141210",          c:"#F4F0E8",   label:"✓"},
    pending: {bg:"rgba(245,158,11,.15)",c:"#B45309",label:"?"},
    blocked: {bg:"rgba(0,0,0,.08)",  c:"#B5B0A8",   label:"🔒"},
  };

  return(
    <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{minWidth:courts.length*72+80}}>
        {/* Header */}
        <div style={{display:"grid",gridTemplateColumns:`80px repeat(${courts.length},1fr)`,gap:4,marginBottom:4}}>
          <div/>
          {courts.map(c=>(
            <div key={c.id} style={{fontSize:10,fontWeight:700,color:"#141210",textAlign:"center",padding:"4px 0",background:"#FFFFFF",borderRadius:6,border:"1px solid rgba(0,0,0,.09)"}}>
              {c.name}<br/><span style={{fontWeight:400,color:"#B5B0A8",fontSize:9}}>{c.indoor?"Indoor":"Outdoor"}</span>
            </div>
          ))}
        </div>
        {/* Slots */}
        {slots.map(time=>{
          const night=parseInt(time)>=nf;
          return(
            <div key={time} style={{display:"grid",gridTemplateColumns:`80px repeat(${courts.length},1fr)`,gap:4,marginBottom:3}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8}}>
                <span style={{fontSize:10,fontWeight:600,color:night?"#7A766F":"#EDE9E1"}}>{time}{night&&<span style={{marginLeft:3,fontSize:8}}>🌙</span>}</span>
              </div>
              {courts.map(c=>{
                const state=getSlotState(c.id,time);
                const st=stateStyle[state];
                const bk=state==="booked"||state==="pending"?bookings.find(b=>b.courtId===c.id&&b.date===day&&(b.status==="confirmed"||b.status==="pending")&&occS(b.time,b.dur||60).includes(time)):null;
                return(
                  <div key={c.id} style={{background:st.bg,borderRadius:6,padding:"5px 4px",textAlign:"center",border:`1px solid ${state==="free"?"rgba(0,0,0,.07)":state==="blocked"?"rgba(0,0,0,.1)":state==="pending"?"rgba(245,158,11,.3)":"rgba(0,0,0,.2)"}`,minHeight:36,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:9,color:st.c,fontWeight:700}}>{st.label}</span>
                    {bk&&<span style={{fontSize:8,color:st.c,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%",padding:"0 2px"}}>{bk.contactName.split(" ")[0]}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
        {/* Legend */}
        <div style={{display:"flex",gap:12,marginTop:12,flexWrap:"wrap"}}>
          {[{s:"free",l:"Livre"},{s:"booked",l:"Confirmado"},{s:"pending",l:"Pendente"},{s:"blocked",l:"Bloqueado"}].map(({s,l})=>{
            const st=stateStyle[s];
            return <div key={s} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:12,borderRadius:3,background:st.bg,border:"1px solid rgba(0,0,0,.1)"}}/><span style={{fontSize:10,color:"#7A766F"}}>{l}</span></div>;
          })}
        </div>
      </div>
    </div>
  );
}

// ── MONTHLY REVENUE REPORT ────────────────────────────────────────────────────
function RevenueReport({bookings,cfg}){
  const calc=(bs)=>Math.round(bs.reduce((s,b)=>{const p=isNt(b.time,parseInt(cfg.nightFrom))?cfg.priceNight:cfg.priceDay;return s+(p*cfg.playersPerCourt*((b.dur||60)/60));},0));

  // Last 6 months
  const months=[];
  for(let i=5;i>=0;i--){
    const d=new Date(todayD);d.setMonth(d.getMonth()-i);
    const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0");
    const label=d.toLocaleDateString("pt-PT",{month:"short",year:"numeric"}).replace(".","");
    const mBk=bookings.filter(b=>b.status==="confirmed"&&b.date.startsWith(`${y}-${m}`));
    months.push({label,rev:calc(mBk),count:mBk.length});
  }
  const maxRev=Math.max(...months.map(m=>m.rev),1);
  const thisMonth=months[months.length-1];
  const lastMonth=months[months.length-2];
  const delta=lastMonth.rev>0?Math.round(((thisMonth.rev-lastMonth.rev)/lastMonth.rev)*100):0;

  return(
    <div>
      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
        {[
          {l:"Este mês",v:`${thisMonth.rev}€`,sub:delta>=0?`+${delta}% vs mês anterior`:`${delta}% vs mês anterior`,pos:delta>=0},
          {l:"Reservas",v:thisMonth.count,sub:"confirmadas"},
          {l:"Média/reserva",v:thisMonth.count>0?`${Math.round(thisMonth.rev/thisMonth.count)}€`:"—",sub:"por reserva"},
        ].map(k=>(
          <div key={k.l} style={{background:"#201F1C",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:"12px 12px"}}>
            <div style={{fontSize:18,fontWeight:800,color:"#EDE9E1",letterSpacing:"-.5px"}}>{k.v}</div>
            <div style={{fontSize:10,color:"#7A766F",marginTop:3}}>{k.l}</div>
            {k.sub&&<div style={{fontSize:9,color:k.pos===false?"#FF6B6B":k.pos?"#34D399":"#7A766F",marginTop:2}}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{background:"#201F1C",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:"14px 14px 10px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#EDE9E1",marginBottom:14}}>Receita mensal (€)</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
          {months.map((m,i)=>{
            const h=Math.round((m.rev/maxRev)*80);
            const isLast=i===months.length-1;
            return(
              <div key={m.label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{fontSize:9,fontWeight:700,color:isLast?"#EDE9E1":"#7A766F"}}>{m.rev>0?`${m.rev}€`:""}</div>
                <div style={{width:"100%",height:Math.max(h,3),background:isLast?"#EDE9E1":"rgba(255,255,255,.15)",borderRadius:"4px 4px 0 0",transition:"height .4s ease"}}/>
                <div style={{fontSize:8,color:isLast?"#EDE9E1":"#7A766F",textAlign:"center",letterSpacing:"-.3px"}}>{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TournamentPortalView({tournaments,onRegister}){
  const [viewing,setViewing]=useState(null);
  const [registering,setRegistering]=useState(null); // tournament object to register in
  const t=viewing?tournaments.find(x=>x.id===viewing):null;
  if(t) return <TournamentPublicView t={t} onBack={()=>setViewing(null)} onRegister={(tour)=>{setViewing(null);setRegistering(tour);}}/>;
  if(registering) return <TournamentRegistration tournaments={[registering]} onRegister={onRegister} onBack={()=>setRegistering(null)}/>;
  const open=tournaments.filter(t=>t.status==="open");
  const active=tournaments.filter(t=>["groups","knockouts","finished","scheduling","closed"].includes(t.status));
  return(
    <div style={{background:"#F4F0E8",minHeight:"calc(100vh - 52px)"}}>
      <div style={{padding:"36px 20px 24px",borderBottom:"1px solid rgba(0,0,0,.08)"}}>
        <div style={{fontSize:11,fontWeight:700,background:"#141210",color:"#F4F0E8",display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:99,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:14}}><span style={{width:5,height:5,borderRadius:"50%",background:"#F4F0E8"}}/>Torneios</div>
        <h2 style={{fontSize:"clamp(28px,7vw,48px)",fontWeight:800,color:"#141210",letterSpacing:"-2px",lineHeight:.95,marginBottom:12}}>Torneios<br/>do clube</h2>
      </div>
      <div style={{padding:"20px 18px 80px",maxWidth:640,margin:"0 auto"}}>
        {open.length>0&&<div style={{fontSize:11,fontWeight:700,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>Inscrições Abertas</div>}
        {open.map(t=>(
          <div key={t.id} style={{background:"#FFFFFF",borderRadius:14,border:"1px solid rgba(0,0,0,.09)",overflow:"hidden",marginBottom:10}}>
            <div style={{height:3,background:"#141210"}}/>
            <div style={{padding:"14px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{fontSize:15,fontWeight:800,color:"#141210",letterSpacing:"-.3px"}}>{t.name}</div>
                <TStatusBadgePub status={t.status}/>
              </div>
              <div style={{fontSize:12,color:"#7A766F",marginBottom:10}}>📅 {t.startDate}{t.endDate&&t.endDate!==t.startDate?` → ${t.endDate}`:""}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{t.categories.map(c=><span key={c.id} style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:99,background:"#F4F0E8",color:"#7A766F"}}>{c.id}</span>)}</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setRegistering(t)} style={{flex:1,padding:"11px",borderRadius:9,background:"#141210",color:"#F4F0E8",border:"none",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Inscrever →</button>
              </div>
            </div>
          </div>
        ))}
        {active.length>0&&<div style={{fontSize:11,fontWeight:700,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1.5px",margin:"20px 0 12px"}}>A decorrer / Concluídos</div>}
        {active.map(t=>(
          <div key={t.id} style={{background:"#FFFFFF",borderRadius:14,border:"1px solid rgba(0,0,0,.09)",overflow:"hidden",marginBottom:10,cursor:"pointer"}} onClick={()=>setViewing(t.id)}>
            <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:14,fontWeight:800,color:"#141210",letterSpacing:"-.2px"}}>{t.name}</div>
                <div style={{fontSize:11,color:"#7A766F",marginTop:3}}>📅 {t.startDate}{t.endDate&&t.endDate!==t.startDate?` → ${t.endDate}`:""}</div>
              </div>
              <TStatusBadgePub status={t.status}/>
            </div>
          </div>
        ))}
        {tournaments.length===0&&<div style={{textAlign:"center",padding:"48px 0"}}><div style={{fontSize:40,marginBottom:12}}>🏆</div><div style={{fontSize:16,fontWeight:800,color:"#141210",marginBottom:6}}>Sem torneios</div><div style={{fontSize:14,color:"#7A766F"}}>Quando o clube criar torneios aparecerão aqui.</div></div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEW BOOKING MODAL (admin creates booking manually)
// ═══════════════════════════════════════════════════════════════════════════════
function NewBookingModal({ cfg, day, bookings, blocks, onSave, onClose }) {
  const activeCourts = cfg.courts.filter(c => c.active);
  const genSlotsLocal = (f,t) => { const s=[]; for(let h=parseInt(f);h<parseInt(t);h++){s.push(`${String(h).padStart(2,"0")}:00`);s.push(`${String(h).padStart(2,"0")}:30`);} return s; };
  const slots = genSlotsLocal(cfg.openFrom, cfg.openTo);

  const [f, setF] = useState({
    name: "", email: "", phone: "",
    courtId: activeCourts[0]?.id || 1,
    date: day || TODAY,
    time: "09:00",
    dur: 60,
    pay: "local",
    status: "confirmed",
  });
  const [err, setErr] = useState("");
  const set = (k,v) => setF(p => ({...p, [k]:v}));

  // Check if selected slot is free
  const isFree = () => ctFree(f.courtId, f.date, f.time, f.dur, bookings, blocks);

  const save = () => {
    setErr("");
    if (!f.name.trim()) { setErr("Nome obrigatório"); return; }
    const bk = {
      id: Date.now(),
      contactName: f.name.trim(),
      contactEmail: f.email.trim() || ("manual_" + Date.now() + "@admin.pt"),
      contactPhone: f.phone.trim(),
      courtId: Number(f.courtId),
      date: f.date,
      time: f.time,
      dur: Number(f.dur),
      status: f.status,
      pay: f.pay,
      ref: "PDP-" + Math.random().toString(36).slice(-5).toUpperCase(),
      createdAt: new Date().toISOString(),
      createdByAdmin: true,
    };
    onSave(bk);
  };

  const night = isNt(f.time, parseInt(cfg.nightFrom||18));
  const price = (night ? cfg.priceNight : cfg.priceDay) * cfg.playersPerCourt * (f.dur/60);
  const endH  = addMins(f.time, f.dur);
  const free  = isFree();

  const SFL = ({children}) => <div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:".8px",marginBottom:6}}>{children}</div>;

  return (
    <div className="pt-mbg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="pt-modal">
        <div className="pt-modal-handle"/>
        <div className="pt-modal-hd">
          <span className="pt-modal-tt">Nova Reserva</span>
          <button className="pt-modal-close" onClick={onClose}><I n="x" s={13}/></button>
        </div>
        <div className="pt-modal-body">
          {err && <div style={{fontSize:12,color:"#FF6B6B",padding:"8px 12px",background:"rgba(255,107,107,.08)",borderRadius:8}}>{err}</div>}

          {/* DATE + COURT */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="pt-sfg">
              <SFL>Data</SFL>
              <input type="date" className="pt-mfi" value={f.date} onChange={e=>set("date",e.target.value)}/>
            </div>
            <div className="pt-sfg">
              <SFL>Campo</SFL>
              <select className="pt-mfi" value={f.courtId} onChange={e=>set("courtId",parseInt(e.target.value))}>
                {activeCourts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* TIME + DURATION */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="pt-sfg">
              <SFL>Hora</SFL>
              <select className="pt-mfi" value={f.time} onChange={e=>set("time",e.target.value)}>
                {slots.filter(t=>slotFit(t,f.dur,cfg.openTo)).map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="pt-sfg">
              <SFL>Duração</SFL>
              <select className="pt-mfi" value={f.dur} onChange={e=>set("dur",parseInt(e.target.value))}>
                <option value={60}>1h</option>
                <option value={90}>1h30</option>
                <option value={120}>2h</option>
              </select>
            </div>
          </div>

          {/* SLOT STATUS */}
          <div style={{padding:"10px 12px",borderRadius:9,background:free?"rgba(52,211,153,.08)":"rgba(255,107,107,.08)",border:`1px solid ${free?"rgba(52,211,153,.2)":"rgba(255,107,107,.2)"}`,fontSize:12,fontWeight:600,color:free?"#34D399":"#FF6B6B",display:"flex",alignItems:"center",gap:8}}>
            <span>{free?"✓":"✗"}</span>
            {free
              ? `${cfg.courts.find(c=>c.id===parseInt(f.courtId))?.name} · ${f.time}–${endH} · ${Math.round(price)}€ · ${night?"🌙 Noturno":"☀️ Diurno"}`
              : "Slot ocupado ou bloqueado — escolhe outro horário"
            }
          </div>

          {/* CLIENT INFO */}
          <div className="pt-sfg">
            <SFL>Nome do cliente</SFL>
            <input className="pt-mfi" placeholder="Nome completo" value={f.name} onChange={e=>set("name",e.target.value)}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="pt-sfg">
              <SFL>Email (opcional)</SFL>
              <input type="email" className="pt-mfi" placeholder="email@..." value={f.email} onChange={e=>set("email",e.target.value)}/>
            </div>
            <div className="pt-sfg">
              <SFL>Telemóvel (opcional)</SFL>
              <input type="tel" className="pt-mfi" placeholder="+351..." value={f.phone} onChange={e=>set("phone",e.target.value)}/>
            </div>
          </div>

          {/* PAYMENT + STATUS */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div className="pt-sfg">
              <SFL>Pagamento</SFL>
              <select className="pt-mfi" value={f.pay} onChange={e=>set("pay",e.target.value)}>
                {PAY.map(p=><option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
              </select>
            </div>
            <div className="pt-sfg">
              <SFL>Estado</SFL>
              <select className="pt-mfi" value={f.status} onChange={e=>set("status",e.target.value)}>
                <option value="confirmed">✓ Confirmada</option>
                <option value="pending">⏳ Pendente</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-modal-foot">
          <button className="pt-btn pt-btn-ghost pt-btn-w" onClick={onClose}>Cancelar</button>
          <button className="pt-btn pt-btn-light pt-btn-w" onClick={save}>
            <I n="ok" s={13}/> Marcar Campo
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

// ── SUPER ADMIN CREDENTIALS (hardcoded for demo) ─────────────────────────────
const SUPER_ADMIN = { email: "admin@portaldopadel.pt", password: "pdp2026super" };

// ── AUTH SCREENS ──────────────────────────────────────────────────────────────

function AuthLayout({ children, title, subtitle }) {
  return (
    <div style={{minHeight:"100vh",background:"#F4F0E8",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 22px",borderBottom:"1px solid rgba(0,0,0,.08)",display:"flex",alignItems:"center",gap:9,background:"rgba(244,240,232,.95)"}}>
        <div style={{width:30,height:30,borderRadius:8,background:"#141210",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#F4F0E8"}}>PP</div>
        <div>
          <div style={{fontWeight:800,fontSize:13,color:"#141210",letterSpacing:"-.2px"}}>Portal do Padel</div>
          <div style={{fontSize:9,color:"#B5B0A8",letterSpacing:"1.5px",textTransform:"uppercase"}}>Clubes</div>
        </div>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 20px"}}>
        <div style={{width:"100%",maxWidth:400}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <h1 style={{fontSize:32,fontWeight:800,color:"#141210",letterSpacing:"-1.5px",lineHeight:.95,marginBottom:10,fontFamily:'"DM Serif Display","DM Sans",system-ui,sans-serif'}}>{title}</h1>
            {subtitle&&<p style={{fontSize:14,color:"#7A766F",lineHeight:1.6}}>{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function AuthInput({ label, type="text", value, onChange, placeholder, error }) {
  return (
    <div style={{marginBottom:12}}>
      {label&&<div style={{fontSize:10,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>{label}</div>}
      <input
        type={type} inputMode={type==="email"?"email":type==="tel"?"tel":undefined}
        value={value} onChange={onChange} placeholder={placeholder}
        style={{width:"100%",background:"#FFFFFF",border:`1.5px solid ${error?"#E53E3E":"rgba(0,0,0,.12)"}`,borderRadius:10,padding:"13px 14px",fontSize:14,outline:"none",fontFamily:"inherit",color:"#141210",transition:"border-color .2s"}}
        onFocus={e=>e.target.style.borderColor="#141210"}
        onBlur={e=>e.target.style.borderColor=error?"#E53E3E":"rgba(0,0,0,.12)"}
      />
      {error&&<div style={{fontSize:11,color:"#E53E3E",marginTop:4}}>{error}</div>}
    </div>
  );
}

function AuthBtn({ children, onClick, secondary, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"14px",borderRadius:10,border:secondary?"1.5px solid rgba(0,0,0,.15)":"none",background:secondary?"transparent":"#141210",color:secondary?"#7A766F":"#F4F0E8",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",opacity:disabled?.5:1,marginBottom:8}}>
      {children}
    </button>
  );
}

// ── ATHLETE LOGIN ─────────────────────────────────────────────────────────────
function AthleteLogin({ athletes, onLogin, onGoRegister, onBack }) {
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const submit = async () => {
    setErr("");
    if(!email.trim()||!pass.trim()){setErr("Preenche todos os campos.");return;}
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    const athlete = athletes.find(a=>a.email.toLowerCase()===email.toLowerCase().trim()&&a.password===pass);
    if(!athlete){setErr("Email ou password incorrectos.");setLoading(false);return;}
    onLogin(athlete);
  };

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entra na tua conta de atleta">
      <AuthInput label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="o.teu@email.pt" error={err&&!email.trim()?"Obrigatório":""}/>
      <AuthInput label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" error={err&&!pass.trim()?"Obrigatório":""}/>
      {err&&<div style={{fontSize:12,color:"#E53E3E",padding:"9px 12px",background:"rgba(229,62,62,.07)",borderRadius:8,marginBottom:12}}>{err}</div>}
      <AuthBtn onClick={submit} disabled={loading}>{loading?"A entrar…":"Entrar"}</AuthBtn>
      <div style={{textAlign:"center",fontSize:13,color:"#7A766F",marginTop:8}}>
        Ainda não tens conta?{" "}
        <span style={{color:"#141210",fontWeight:700,cursor:"pointer"}} onClick={onGoRegister}>Regista-te</span>
      </div>
      <div style={{textAlign:"center",marginTop:16}}>
        <span style={{fontSize:12,color:"#B5B0A8",cursor:"pointer"}} onClick={onBack}>← Voltar</span>
      </div>
    </AuthLayout>
  );
}

// ── ATHLETE REGISTER ──────────────────────────────────────────────────────────
function AthleteRegister({ athletes, onRegister, onGoLogin, onBack }) {
  const [f,setF]=useState({name:"",email:"",phone:"",password:"",confirm:""});
  const [errs,setErrs]=useState({});
  const [loading,setLoading]=useState(false);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  const submit = async () => {
    const e={};
    if(!f.name.trim()) e.name="Obrigatório";
    if(!f.email.trim()||!/\S+@\S+\.\S+/.test(f.email)) e.email="Email inválido";
    if(athletes.find(a=>a.email.toLowerCase()===f.email.toLowerCase().trim())) e.email="Este email já está registado";
    if(f.password.length<6) e.password="Mínimo 6 caracteres";
    if(f.password!==f.confirm) e.confirm="As passwords não coincidem";
    setErrs(e);
    if(Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    const athlete={id:Date.now(),name:f.name.trim(),email:f.email.trim(),phone:f.phone.trim(),password:f.password,since:TODAY,notes:""};
    onRegister(athlete);
  };

  return (
    <AuthLayout title="Criar conta" subtitle="Junta-te ao Portal do Padel">
      <AuthInput label="Nome completo" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="O teu nome" error={errs.name}/>
      <AuthInput label="Email" type="email" value={f.email} onChange={e=>set("email",e.target.value)} placeholder="o.teu@email.pt" error={errs.email}/>
      <AuthInput label="Telemóvel (opcional)" type="tel" value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="+351 9xx xxx xxx"/>
      <AuthInput label="Password" type="password" value={f.password} onChange={e=>set("password",e.target.value)} placeholder="Mínimo 6 caracteres" error={errs.password}/>
      <AuthInput label="Confirmar password" type="password" value={f.confirm} onChange={e=>set("confirm",e.target.value)} placeholder="Repete a password" error={errs.confirm}/>
      <AuthBtn onClick={submit} disabled={loading}>{loading?"A criar conta…":"Criar Conta"}</AuthBtn>
      <div style={{textAlign:"center",fontSize:13,color:"#7A766F",marginTop:8}}>
        Já tens conta?{" "}
        <span style={{color:"#141210",fontWeight:700,cursor:"pointer"}} onClick={onGoLogin}>Entrar</span>
      </div>
      <div style={{textAlign:"center",marginTop:16}}>
        <span style={{fontSize:12,color:"#B5B0A8",cursor:"pointer"}} onClick={onBack}>← Voltar</span>
      </div>
    </AuthLayout>
  );
}

// ── CLUB LOGIN ────────────────────────────────────────────────────────────────
function ClubLogin({ clubs, onLogin, onGoRegister, onSuperLogin, onBack }) {
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);

  const submit = async () => {
    setErr("");
    if(!email.trim()||!pass.trim()){setErr("Preenche todos os campos.");return;}
    // Super admin
    if(email.trim()===SUPER_ADMIN.email&&pass===SUPER_ADMIN.password){onSuperLogin();return;}
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    const club = clubs.find(c=>c.email.toLowerCase()===email.toLowerCase().trim()&&c.password===pass);
    if(!club){setErr("Email ou password incorrectos.");setLoading(false);return;}
    if(club.status==="pending"){setErr("⏳ O teu pedido está pendente de aprovação. A equipa Portal do Padel irá contactar-te em breve.");setLoading(false);return;}
    if(club.status==="rejected"){setErr("O teu pedido foi rejeitado. Contacta admin@portaldopadel.pt para mais informações.");setLoading(false);return;}
    onLogin(club);
  };

  return (
    <AuthLayout title="Área do Clube" subtitle="Entra no backoffice do teu clube">
      <AuthInput label="Email do clube" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="clube@email.pt" error={err&&!email.trim()?"Obrigatório":""}/>
      <AuthInput label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" error={err&&!pass.trim()?"Obrigatório":""}/>
      {err&&<div style={{fontSize:12,color:"#E53E3E",padding:"9px 12px",background:"rgba(229,62,62,.07)",borderRadius:8,marginBottom:12}}>{err}</div>}
      <AuthBtn onClick={submit} disabled={loading}>{loading?"A entrar…":"Entrar"}</AuthBtn>
      <div style={{textAlign:"center",fontSize:13,color:"#7A766F",marginTop:8}}>
        Ainda não tens conta?{" "}
        <span style={{color:"#141210",fontWeight:700,cursor:"pointer"}} onClick={onGoRegister}>Registar clube</span>
      </div>
      <div style={{textAlign:"center",marginTop:16,display:"flex",justifyContent:"center",gap:20}}>
        <span style={{fontSize:12,color:"#B5B0A8",cursor:"pointer"}} onClick={onBack}>← Voltar</span>
        <span style={{fontSize:12,color:"#B5B0A8",cursor:"pointer"}} onClick={()=>{if(window.confirm("Limpar todos os dados de teste?")){ Object.keys(localStorage).filter(k=>k.startsWith("pdp_")).forEach(k=>localStorage.removeItem(k)); window.location.reload(); }}}>🗑 Limpar dados</span>
      </div>
    </AuthLayout>
  );
}

// ── CLUB REGISTER ─────────────────────────────────────────────────────────────
function ClubRegister({ clubs, onSubmit, onGoLogin, onBack }) {
  const [f,setF]=useState({name:"",email:"",phone:"",address:"",city:"",password:"",confirm:""});
  const [errs,setErrs]=useState({});
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  const submit = async () => {
    const e={};
    if(!f.name.trim())    e.name="Obrigatório";
    if(!f.email.trim()||!/\S+@\S+\.\S+/.test(f.email)) e.email="Email inválido";
    if(clubs.find(c=>c.email.toLowerCase()===f.email.toLowerCase().trim())) e.email="Este email já está registado";
    if(!f.phone.trim())   e.phone="Obrigatório";
    if(!f.city.trim())    e.city="Obrigatório";
    setErrs(e);
    if(Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    const club={
      id:Date.now(), name:f.name.trim(), email:f.email.trim(),
      phone:f.phone.trim(), address:f.address.trim(), city:f.city.trim(),
      password:"portal2026", status:"pending", since:TODAY,
      // Default club config
      tagline:"O teu campo. À tua hora.", priceDay:3, priceNight:4,
      nightFrom:"18", openFrom:"08", openTo:"22", durations:[60,90,120],
      playersPerCourt:4, courts:[{id:1,name:"Court 1",indoor:true,active:true}],
      requireApproval:true, allowCancel:true, cancelHours:24,
      showOccupancy:true, advanceDays:14,
    };
    onSubmit(club);
    setDone(true);
    setLoading(false);
  };

  if(done) return(
    <AuthLayout title="Pedido enviado!" subtitle="">
      <div style={{textAlign:"center",padding:"8px 0 24px"}}>
        <div style={{fontSize:48,marginBottom:16}}>✅</div>
        <p style={{fontSize:14,color:"#7A766F",lineHeight:1.65,marginBottom:16}}>O teu pedido foi submetido. Aguarda aprovação pela equipa Portal do Padel.</p>
        <div style={{background:"#F4F0E8",borderRadius:10,padding:"12px 16px",marginBottom:20,textAlign:"left"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#7A766F",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Próximos passos</div>
          <div style={{fontSize:13,color:"#141210",lineHeight:1.7}}>
            1. A equipa Portal do Padel analisa o teu pedido<br/>
            2. Falamos contigo para configurar o clube<br/>
            3. Recebes os acessos ao backoffice
          </div>
        </div>
        <AuthBtn onClick={onGoLogin} secondary>Ir para o login</AuthBtn>
      </div>
    </AuthLayout>
  );

  return (
    <AuthLayout title="Registar clube" subtitle="Pede a entrada do teu clube no Portal do Padel">
      <div style={{textAlign:"center",margin:"0 auto 18px",maxWidth:420}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 12px",borderRadius:99,background:"rgba(20,18,16,.06)",color:"#7A766F",fontSize:10,fontWeight:800,letterSpacing:"1.3px",textTransform:"uppercase",marginBottom:12}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"#141210"}}/>Para clubes
        </div>
        <div style={{fontSize:20,fontWeight:800,color:"#141210",letterSpacing:"-.7px",lineHeight:1.05,marginBottom:8}}>
          Gestão simples, mensalidade fixa.
        </div>
        <div style={{fontSize:13,color:"#7A766F",lineHeight:1.6}}>
          Reservas, torneios e gestão de campos sem comissão por reserva e sem perder a relação com os teus jogadores.
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
        {["Zero comissões","Preço fixo","Torneios fáceis","Setup acompanhado"].map(x=>(
          <div key={x} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.08)",borderRadius:12,padding:"11px 10px",fontSize:12,fontWeight:800,color:"#141210",textAlign:"center",boxShadow:"0 1px 6px rgba(0,0,0,.035)"}}>{x}</div>
        ))}
      </div>
      <AuthInput label="Nome do clube" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Ex: Padel Arena Lisboa" error={errs.name}/>
      <AuthInput label="Email" type="email" value={f.email} onChange={e=>set("email",e.target.value)} placeholder="clube@email.pt" error={errs.email}/>
      <AuthInput label="Telefone" type="tel" value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="+351 2xx xxx xxx" error={errs.phone}/>
      <AuthInput label="Cidade" value={f.city} onChange={e=>set("city",e.target.value)} placeholder="Lisboa" error={errs.city}/>
      <div style={{fontSize:11,color:"#7A766F",marginBottom:16,padding:"10px 12px",background:"rgba(0,0,0,.04)",borderRadius:8,lineHeight:1.6}}>
        O pedido é simples: deixas os dados e nós ajudamos a colocar o clube online.
      </div>
      <AuthBtn onClick={submit} disabled={loading}>{loading?"A enviar…":"Enviar pedido"}</AuthBtn>
      <div style={{textAlign:"center",fontSize:13,color:"#7A766F",marginTop:8}}>
        Já tens conta?{" "}
        <span style={{color:"#141210",fontWeight:700,cursor:"pointer"}} onClick={onGoLogin}>Entrar</span>
      </div>
      {onBack&&<div style={{textAlign:"center",marginTop:16}}>
        <span style={{fontSize:12,color:"#B5B0A8",cursor:"pointer"}} onClick={onBack}>← Voltar</span>
      </div>}
    </AuthLayout>
  );
}

// ── SUPER ADMIN PANEL ─────────────────────────────────────────────────────────
function SuperAdmin({ clubs, onApprove, onReject, onLogout }) {
  const [filter,setFilter]=useState("pending");
  const [search,setSearch]=useState("");

  const filtered = clubs
    .filter(c=>filter==="all"||c.status===filter)
    .filter(c=>!search||c.name.toLowerCase().includes(search.toLowerCase())||c.city.toLowerCase().includes(search.toLowerCase()));

  const counts={
    pending: clubs.filter(c=>c.status==="pending").length,
    approved: clubs.filter(c=>c.status==="approved").length,
    rejected: clubs.filter(c=>c.status==="rejected").length,
  };

  const statusStyle={
    pending:  {bg:"rgba(245,158,11,.1)",  c:"#B45309"},
    approved: {bg:"rgba(52,211,153,.1)",  c:"#065F46"},
    rejected: {bg:"rgba(229,62,62,.1)",   c:"#9B1C1C"},
  };

  return (
    <div style={{minHeight:"100vh",background:"#F4F0E8"}}>
      {/* Header */}
      <div style={{background:"#141210",padding:"0 20px",height:54,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:28,height:28,borderRadius:7,background:"#F4F0E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#141210"}}>PP</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:800,color:"#F4F0E8",letterSpacing:"-.2px"}}>Super Admin</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.4)",letterSpacing:"1px",textTransform:"uppercase"}}>Portal do Padel</div>
        </div>
        <button onClick={onLogout} style={{fontSize:12,color:"rgba(255,255,255,.5)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Sair</button>
      </div>

      <div style={{padding:"20px 18px",maxWidth:720,margin:"0 auto"}}>
        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          {[
            {l:"Pendentes",v:counts.pending,c:"#B45309",bg:"rgba(245,158,11,.1)"},
            {l:"Aprovados", v:counts.approved,c:"#065F46",bg:"rgba(52,211,153,.1)"},
            {l:"Rejeitados",v:counts.rejected,c:"#9B1C1C",bg:"rgba(229,62,62,.1)"},
          ].map(k=>(
            <div key={k.l} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:12,padding:"14px 12px"}}>
              <div style={{fontSize:24,fontWeight:800,color:k.c,letterSpacing:"-1px"}}>{k.v}</div>
              <div style={{fontSize:11,color:"#7A766F",marginTop:3}}>{k.l}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.1)",borderRadius:10,display:"flex",alignItems:"center",gap:8,padding:"10px 14px",marginBottom:14}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5B0A8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input style={{flex:1,border:"none",outline:"none",fontSize:14,fontFamily:"inherit",color:"#141210",background:"none"}} placeholder="Pesquisar clube..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>

        {/* Filter tabs */}
        <div style={{display:"flex",gap:4,background:"rgba(0,0,0,.06)",borderRadius:9,padding:3,marginBottom:16}}>
          {[{v:"pending",l:`Pendentes (${counts.pending})`},{v:"approved",l:`Aprovados (${counts.approved})`},{v:"rejected",l:`Rejeitados (${counts.rejected})`},{v:"all",l:"Todos"}].map(t=>(
            <button key={t.v} onClick={()=>setFilter(t.v)} style={{flex:1,padding:"7px 8px",borderRadius:7,border:"none",background:filter===t.v?"#FFFFFF":"transparent",color:filter===t.v?"#141210":"#7A766F",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",boxShadow:filter===t.v?"0 1px 4px rgba(0,0,0,.1)":"none",transition:"all .15s",whiteSpace:"nowrap"}}>
              {t.l}
            </button>
          ))}
        </div>

        {/* Clubs list */}
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"48px 0",color:"#B5B0A8",fontSize:14}}>Sem clubes nesta categoria.</div>
        ):filtered.map(c=>{
          const ss=statusStyle[c.status]||statusStyle.pending;
          return(
            <div key={c.id} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:14,padding:"16px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:"#141210",letterSpacing:"-.3px"}}>{c.name}</div>
                  <div style={{fontSize:12,color:"#7A766F",marginTop:3}}>📍 {c.address}, {c.city}</div>
                  <div style={{fontSize:12,color:"#7A766F",marginTop:2}}>📧 {c.email} · 📞 {c.phone}</div>
                  <div style={{fontSize:11,color:"#B5B0A8",marginTop:2}}>Pedido em {fmtFull(c.since)}</div>
                </div>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:99,background:ss.bg,color:ss.c,whiteSpace:"nowrap",textTransform:"uppercase",letterSpacing:".5px"}}>
                  {c.status==="pending"?"Pendente":c.status==="approved"?"Aprovado":"Rejeitado"}
                </span>
              </div>
              {c.status==="pending"&&(
                <div style={{display:"flex",gap:8,marginTop:4}}>
                  <button onClick={()=>onApprove(c.id)} style={{flex:1,padding:"10px",borderRadius:9,background:"#141210",color:"#F4F0E8",border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓ Aprovar</button>
                  <button onClick={()=>onReject(c.id)}  style={{flex:1,padding:"10px",borderRadius:9,background:"transparent",color:"#E53E3E",border:"1.5px solid rgba(229,62,62,.25)",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✕ Rejeitar</button>
                </div>
              )}
              {c.status==="approved"&&(
                <button onClick={()=>onReject(c.id)} style={{padding:"8px 14px",borderRadius:9,background:"transparent",color:"#E53E3E",border:"1.5px solid rgba(229,62,62,.2)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Suspender acesso</button>
              )}
              {c.status==="rejected"&&(
                <button onClick={()=>onApprove(c.id)} style={{padding:"8px 14px",borderRadius:9,background:"transparent",color:"#065F46",border:"1.5px solid rgba(52,211,153,.3)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Reactivar</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ATHLETE PROFILE (Point 2)
// ═══════════════════════════════════════════════════════════════════════════════
function AthleteProfile({ athlete, bookings, tournaments, cfg, onEdit, onLogout, onBack }) {
  const [tab, setTab] = useState("bookings");

  const myBk = bookings
    .filter(b => b.contactEmail?.toLowerCase() === athlete.email?.toLowerCase())
    .sort((a,b) => b.date.localeCompare(a.date));

  const upcoming = myBk.filter(b => b.date >= TODAY && b.status !== "cancelled");
  const past     = myBk.filter(b => b.date < TODAY  || b.status === "cancelled");

  // Tournaments where athlete is registered
  const myTourneys = [];
  tournaments.forEach(t => {
    t.categories.forEach(cat => {
      const pair = cat.pairs.find(p =>
        p.p1?.toLowerCase().includes(athlete.name?.split(" ")[0]?.toLowerCase()) ||
        p.p2?.toLowerCase().includes(athlete.name?.split(" ")[0]?.toLowerCase()) ||
        p.contact?.toLowerCase() === athlete.email?.toLowerCase()
      );
      if(pair) myTourneys.push({ tournament: t, category: cat.id, pair, status: pair.status });
    });
  });

  const statusColor = { confirmed:"#34D399", pending:"#F59E0B", cancelled:"#B5B0A8" };
  const statusLabel = { confirmed:"Confirmada", pending:"Pendente", cancelled:"Cancelada" };

  return (
    <div style={{minHeight:"100vh", background:"#F4F0E8"}}>
      {/* Header */}
      <div style={{background:"rgba(244,240,232,.95)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(0,0,0,.09)", padding:"0 18px", height:52, display:"flex", alignItems:"center", gap:10, position:"sticky", top:0, zIndex:50}}>
        <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,color:"#7A766F",background:"none",border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Voltar</button>
        <span style={{fontWeight:800,fontSize:14,color:"#141210",flex:1}}>O meu perfil</span>
        <button onClick={onLogout} style={{fontSize:12,color:"#E53E3E",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Sair</button>
      </div>

      <div style={{padding:"20px 18px 80px", maxWidth:580, margin:"0 auto"}}>
        {/* Profile card */}
        <div style={{background:"#FFFFFF", border:"1px solid rgba(0,0,0,.09)", borderRadius:16, overflow:"hidden", marginBottom:16}}>
          <div style={{background:"#141210", padding:"24px 18px", display:"flex", gap:14, alignItems:"center"}}>
            <div style={{width:52, height:52, borderRadius:14, background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:"#F4F0E8", flexShrink:0}}>
              {athlete.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:20, fontWeight:800, color:"#F4F0E8", letterSpacing:"-.5px"}}>{athlete.name}</div>
              <div style={{fontSize:12, color:"rgba(255,255,255,.5)", marginTop:3}}>Atleta desde {fmtFull(athlete.since||TODAY)}</div>
            </div>
          </div>
          <div style={{padding:"12px 18px"}}>
            <div style={{display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"1px solid rgba(0,0,0,.07)"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5B0A8" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span style={{fontSize:13, color:"#141210"}}>{athlete.email}</span>
            </div>
            {athlete.phone && (
              <div style={{display:"flex", alignItems:"center", gap:10, padding:"9px 0"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5B0A8" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 13.4a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.82 2.5h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.9a16 16 0 0 0 6 6l1.41-1.41a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span style={{fontSize:13, color:"#141210"}}>{athlete.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16}}>
          {[
            {v:myBk.length,       l:"Reservas"},
            {v:upcoming.length,   l:"Próximas"},
            {v:myTourneys.length, l:"Torneios"},
          ].map(s=>(
            <div key={s.l} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:12,padding:"14px 12px",textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:800,color:"#141210",letterSpacing:"-1px"}}>{s.v}</div>
              <div style={{fontSize:11,color:"#7A766F",marginTop:3}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:3,background:"rgba(0,0,0,.06)",borderRadius:9,padding:3,marginBottom:14}}>
          {[{v:"bookings",l:"Reservas"},{v:"tournaments",l:"Torneios"}].map(t=>(
            <button key={t.v} onClick={()=>setTab(t.v)} style={{flex:1,padding:"8px",borderRadius:7,border:"none",background:tab===t.v?"#FFFFFF":"transparent",color:tab===t.v?"#141210":"#7A766F",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              {t.l}
            </button>
          ))}
        </div>

        {tab==="bookings" && (
          <>
            {upcoming.length>0 && (
              <>
                <div style={{fontSize:10,fontWeight:700,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:10}}>Próximas</div>
                {upcoming.map(b => <ProfileBookingRow key={b.id} b={b} cfg={cfg}/>)}
              </>
            )}
            {past.length>0 && (
              <>
                <div style={{fontSize:10,fontWeight:700,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1.5px",margin:"16px 0 10px"}}>Histórico</div>
                {past.map(b => <ProfileBookingRow key={b.id} b={b} cfg={cfg} past/>)}
              </>
            )}
            {myBk.length===0 && (
              <div style={{textAlign:"center",padding:"40px 0",color:"#B5B0A8",fontSize:14}}>
                <div style={{fontSize:36,marginBottom:10}}>🎾</div>
                Ainda não tens reservas.
              </div>
            )}
          </>
        )}

        {tab==="tournaments" && (
          <>
            {myTourneys.length===0 ? (
              <div style={{textAlign:"center",padding:"40px 0",color:"#B5B0A8",fontSize:14}}>
                <div style={{fontSize:36,marginBottom:10}}>🏆</div>
                Ainda não estás inscrito em nenhum torneio.
              </div>
            ) : myTourneys.map((item,i) => (
              <div key={i} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:12,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{fontSize:15,fontWeight:800,color:"#141210",letterSpacing:"-.3px"}}>{item.tournament.name}</div>
                  <span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:99,background:item.status==="approved"?"rgba(52,211,153,.1)":"rgba(245,158,11,.1)",color:item.status==="approved"?"#065F46":"#B45309",textTransform:"uppercase",letterSpacing:".5px"}}>
                    {item.status==="approved"?"Aprovado":"Pendente"}
                  </span>
                </div>
                <div style={{fontSize:12,color:"#7A766F"}}>Categoria: <b style={{color:"#141210"}}>{item.category}</b></div>
                <div style={{fontSize:12,color:"#7A766F",marginTop:3}}>{item.pair.p1} / {item.pair.p2}</div>
                <div style={{fontSize:11,color:"#B5B0A8",marginTop:3}}>📅 {item.tournament.startDate}{item.tournament.endDate&&item.tournament.endDate!==item.tournament.startDate?` → ${item.tournament.endDate}`:""}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ProfileBookingRow({ b, cfg, past }) {
  const court = (cfg?.courts||[]).find(c=>c.id===b.courtId);
  const night = isNt(b.time, parseInt(cfg?.nightFrom||18));
  const price = ((night?cfg?.priceNight:cfg?.priceDay)||3) * (cfg?.playersPerCourt||4) * ((b.dur||60)/60);
  const endH  = addMins(b.time||"00:00", b.dur||60);
  const sc    = {confirmed:"#34D399", pending:"#F59E0B", cancelled:"#B5B0A8"}[b.status]||"#B5B0A8";
  const sl    = {confirmed:"Confirmada", pending:"Pendente", cancelled:"Cancelada"}[b.status]||b.status;
  return (
    <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:12,padding:"14px 16px",marginBottom:10,opacity:past?.6:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div>
          <div style={{fontSize:14,fontWeight:800,color:"#141210",letterSpacing:"-.2px"}}>{fmtLong(b.date)}</div>
          <div style={{fontSize:12,color:"#7A766F",marginTop:2}}>{b.time}–{endH} · {durLbl(b.dur||60)} · {court?.name||"Campo"}</div>
        </div>
        <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:sc+"22",color:sc}}>{sl}</span>
      </div>
      <div style={{fontSize:13,fontWeight:700,color:"#141210"}}>{Math.round(price)}€ <span style={{fontSize:11,fontWeight:400,color:"#7A766F"}}>{night?"🌙 Noturno":"☀️ Diurno"}</span></div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISCOVER TOURNAMENTS VIEW (Point 1)
// ═══════════════════════════════════════════════════════════════════════════════
function DiscoverTournaments({ allTournaments, onRegister, currentUser }) {
  const [region, setRegion] = useState("all");
  const [selT,   setSelT]   = useState(null);

  // allTournaments = [{tournament, club}]
  const open   = allTournaments.filter(({tournament:t}) => t.status==="open");
  const active = allTournaments.filter(({tournament:t}) => ["groups","knockouts","finished"].includes(t.status));

  const filtered = (list) => region==="all" ? list :
    list.filter(({club}) => club?.region===region || (club?.city||"").toLowerCase().includes(region));

  if(selT) return <TournamentPublicView t={selT.tournament} onBack={()=>setSelT(null)} onRegister={(tour)=>onRegister({tournament:tour,club:selT.club})}/>;

  return (
    <div style={{background:"#F4F0E8", minHeight:"calc(100vh - 52px)"}}>
      <div style={{maxWidth:1040,margin:"0 auto",padding:"36px 20px 24px",borderBottom:"1px solid rgba(0,0,0,.08)"}}>
        <h2 style={{fontSize:20,fontWeight:800,color:"#141210",letterSpacing:"-.5px",marginBottom:8,textAlign:"center"}}>Torneios</h2>
        <p style={{fontSize:14,color:"#7A766F",lineHeight:1.65,marginBottom:20,textAlign:"center"}}>Inscreve-te em torneios perto de ti.</p>
        <div style={{display:"flex",gap:7,overflow:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
          {REGIONS.map(r=>(
            <div key={r.id} className={`pt-rg ${region===r.id?"on":""}`} onClick={()=>setRegion(r.id)}>
              {r.icon} {r.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"20px 20px 80px", maxWidth:1040, margin:"0 auto"}}>
        {filtered(open).length>0 && (
          <>
            <div style={{fontSize:10,fontWeight:700,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12}}>Inscrições Abertas</div>
            {filtered(open).map(({tournament:t, club},i) => (
              <div key={i} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:14,overflow:"hidden",marginBottom:12}}>
                <div style={{height:3,background:"#141210"}}/>
                <div style={{padding:"16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <div style={{fontSize:16,fontWeight:800,color:"#141210",letterSpacing:"-.3px"}}>{t.name}</div>
                      <div style={{fontSize:12,color:"#7A766F",marginTop:3}}>🏟 {club?.name||"Clube"} · 📍 {club?.city||""}</div>
                      <div style={{fontSize:12,color:"#7A766F",marginTop:2}}>📅 {t.startDate}{t.endDate&&t.endDate!==t.startDate?` → ${t.endDate}`:""}</div>
                    </div>
                    <span style={{fontSize:9,fontWeight:700,padding:"3px 9px",borderRadius:99,background:"rgba(52,211,153,.1)",color:"#065F46",whiteSpace:"nowrap",textTransform:"uppercase",letterSpacing:".5px"}}>Aberto</span>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                    {t.categories.map(c=><span key={c.id} style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:99,background:"#F4F0E8",color:"#7A766F"}}>{c.id}</span>)}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>onRegister({tournament:t,club})} style={{flex:1,padding:"11px",borderRadius:9,background:"#141210",color:"#F4F0E8",border:"none",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>Inscrever →</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {filtered(active).length>0 && (
          <>
            <div style={{fontSize:10,fontWeight:700,color:"#B5B0A8",textTransform:"uppercase",letterSpacing:"1.5px",margin:"20px 0 12px"}}>A Decorrer / Concluídos</div>
            {filtered(active).map(({tournament:t, club},i) => (
              <div key={i} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,.09)",borderRadius:14,padding:"14px 16px",marginBottom:10,cursor:"pointer"}} onClick={()=>setSelT({tournament:t,club})}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:"#141210",letterSpacing:"-.2px"}}>{t.name}</div>
                    <div style={{fontSize:11,color:"#7A766F",marginTop:2}}>🏟 {club?.name||"Clube"} · {t.startDate}{t.endDate&&t.endDate!==t.startDate?` → ${t.endDate}`:""}</div>
                  </div>
                  <TStatusBadgePub status={t.status}/>
                </div>
              </div>
            ))}
          </>
        )}

        {filtered(open).length===0 && filtered(active).length===0 && (
          <div style={{textAlign:"center",padding:"56px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>🏆</div>
            <div style={{fontSize:16,fontWeight:800,color:"#141210",marginBottom:6}}>Sem torneios {region!=="all"?"nesta região":""}</div>
            <div style={{fontSize:14,color:"#7A766F"}}>Quando os clubes abrirem torneios aparecerão aqui.</div>
          </div>
        )}
      </div>
    </div>
  );
}
