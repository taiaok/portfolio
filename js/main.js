// header border on scroll
const hdr=document.getElementById('hdr');
addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>innerHeight*0.6));

// ROADMAP
const rm=[
  {p:"The project had moving parts and no shared picture of where things stood.",d:"Ran a technical audit and scoped what was actually needed before more got built.",o:"A clear baseline everyone could plan from."},
  {p:"No one owned delivery. Decisions stalled or happened by accident.",d:"Proposed and structured a delivery lead role, with a plan and clear decision points.",o:"Formalised as Delivery Lead from June 2026."},
  {p:"A junior developer carrying a lot without much support.",d:"Paired, reviewed and coached, and shifted trust gradually as skills grew.",o:"A stronger build team that doesn't depend on me."},
  {p:"Long technical stretches can look like nothing is happening.",d:"Planned work so there were demoable milestones, not just progress hidden in tickets.",o:"Stakeholders can see momentum and trust the timeline."}
];
const bars=[...document.querySelectorAll('.bar')], rmD=document.getElementById('rmDetail');
function showRm(i){bars.forEach(b=>b.classList.toggle('active',+b.dataset.i===i));const r=rm[i];
  rmD.innerHTML=`<div><h4>Problem</h4><p>${r.p}</p></div><div><h4>Decision</h4><p>${r.d}</p></div><div><h4>Outcome</h4><p>${r.o}</p></div>`;}
bars.forEach(b=>b.addEventListener('click',()=>showRm(+b.dataset.i)));showRm(1);

// TERMINAL
const out={
  "whoami":"taiao — dev turned delivery lead.\nDevelopers Institute diploma. JavaScript, Node, React, Express.\nLinux by choice.",
  "ls experience/":"flick.md    bnz.md    freelance/",
  "cat flick.md":"# Flick Electric — 2023–2025\nSoftware engineer intern, Ruby on Rails.\nLearned how a small product team ships, and why\nvisible progress matters as much as the fix.",
  "cat bnz.md":"# BNZ — 2025–2026\nTech graduate, domestic payments mainframe (COBOL/JCL).\nHigh-stakes systems where a mistake moves real money.\nLeft for more autonomy.",
  "ls side-projects/":"fetch-plugin/     # Noctalia shell widget, system info on desktop + lock screen\nscam-buster/      # self-hosted scam-detection app, Node/Express\nportfolio/        # you are here"
};
out["help"]="commands: whoami, ls experience/, cat flick.md, cat bnz.md,\n          ls side-projects/, ./contact.sh, clear";
out["ls"]=out["ls experience/"];
const tb=document.getElementById('termBody'),tOut=document.getElementById('termOut'),tIn=document.getElementById('termIn');let busy=false;
const esc=s=>s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
const pl='<span class="prompt">taiao@kawiti</span>:~/dev$ ';
async function run(c,typeIt){c=c.trim();if(busy||!c)return;busy=true;
  if(typeIt){tIn.value='';for(const ch of c){tIn.value+=ch;await new Promise(r=>setTimeout(r,30));}}
  tIn.value='';
  if(c==='clear'){tOut.innerHTML='';busy=false;return;}
  let res;
  if(c==='./contact.sh'||c==='contact'){res='opening contact… <a href="#contact">→ let\'s talk</a>';setTimeout(()=>document.getElementById('contact').scrollIntoView({behavior:'smooth'}),700);}
  else if(out[c]) res=esc(out[c]);
  else res='<span class="t-err">command not found: '+esc(c)+'</span>  (try help)';
  tOut.innerHTML+=pl+'<span class="cmd">'+esc(c)+'</span>\n'+res+'\n\n';
  tb.scrollTop=tb.scrollHeight;busy=false;}
document.querySelectorAll('#cmds button').forEach(b=>b.addEventListener('click',()=>run(b.dataset.c,true)));
tIn.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run(tIn.value);}});
tb.addEventListener('click',e=>{if(!e.target.closest('button,a'))tIn.focus({preventScroll:true});});

// TIMELINE
const clips=[
  {t:"I understand stories, start to finish.",x:"Years of shooting and editing for iwi organisations and small businesses taught me how creative production actually runs, from the brief to the final cut. Hit play, or scrub the timeline."},
  {t:"The brief",x:"Every good piece starts with understanding who it's for and what it needs to do. Same as any project."},
  {t:"On the ground",x:"Freelance videography for iwi organisations and small businesses, 2020–2022. Showing up, building trust, capturing people as they are."},
  {t:"Sound & feel",x:"Music and sound production: the part nobody notices until it's wrong."},
  {t:"The final cut",x:"Shaping raw material into something with a beginning, a turn and an ending. Delivery, in another medium."},
  {t:"Stills",x:"Photography practice. Training the eye for composition, light and restraint."}
];
const cEls=[...document.querySelectorAll('.clip')],ph=document.getElementById('playhead'),ed=document.getElementById('editor');
const mt=document.getElementById('monTitle'),mx=document.getElementById('monText'),tc=document.getElementById('tc');
const mon=document.getElementById('monitor'),cn=document.getElementById('clipName'),pb=document.getElementById('playBtn');
function showClip(i,el){cEls.forEach(c=>c.classList.toggle('active',c===el));cn.textContent=el.textContent;
  mon.classList.add('fade');setTimeout(()=>{mt.textContent=clips[i].t;mx.textContent=clips[i].x;mon.classList.remove('fade');},180);
  const er=ed.getBoundingClientRect(),cr=el.getBoundingClientRect();const x=cr.left-er.left+8;ph.style.left=x+'px';
  const lane=el.parentElement.getBoundingClientRect();const frac=(cr.left-lane.left)/lane.width;const s=Math.round(frac*120);
  tc.textContent='00:0'+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+':00';}
const order=[...cEls].sort((a,b)=>parseFloat(a.style.left)-parseFloat(b.style.left));
let timer=null,pos=0;
function stop(){clearInterval(timer);timer=null;pb.textContent='▶ Play reel';}
function step(){pos=(pos+1)%order.length;showClip(+order[pos].dataset.i,order[pos]);}
pb.addEventListener('click',()=>{if(timer){stop();return;}pb.textContent='❚❚ Pause';step();timer=setInterval(step,3800);});
cEls.forEach(c=>c.addEventListener('click',()=>{stop();pos=order.indexOf(c);showClip(+c.dataset.i,c);}));
requestAnimationFrame(()=>showClip(0,order[0]));
addEventListener('resize',()=>{const a=document.querySelector('.clip.active');if(a)showClip(+a.dataset.i,a);});

// CONTACT
document.getElementById('copyBtn').addEventListener('click',async()=>{const c=document.getElementById('copied');
  try{await navigator.clipboard.writeText(document.getElementById('email').textContent);c.textContent='copied ✓';}
  catch(e){c.textContent='select the address to copy';}});
