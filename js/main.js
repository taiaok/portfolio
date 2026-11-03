// header border on scroll
const hdr=document.getElementById('hdr');
addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>innerHeight*0.6));

// ROADMAP
const rm=[
  "The project had moving parts and no shared picture of where things stood. I ran a technical audit and scoped what was actually needed before more got built, which gave everyone a clear baseline to plan from.",
  "No one owned delivery, so decisions stalled or happened by accident. I proposed a delivery lead role with a plan and clear decision points, and it was formalised in June 2026.",
  "A junior developer was carrying a lot without much support. I paired, reviewed and coached, shifting trust gradually as their skills grew, so the build team no longer depends on me.",
  "Long technical stretches can look like nothing is happening. I planned the work around demoable milestones rather than progress hidden in tickets, so stakeholders can see momentum and trust the timeline."
];
const bars=[...document.querySelectorAll('.bar')], rmD=document.getElementById('rmDetail');
function showRm(i){bars.forEach(b=>b.classList.toggle('active',+b.dataset.i===i));rmD.textContent=rm[i];}
bars.forEach(b=>b.addEventListener('click',()=>showRm(+b.dataset.i)));showRm(1);

// TERMINAL
const out={
  "cat experience.md":"# experience\nDevelopers Institute diploma: JavaScript, Node, React, Express.\nLinux by choice.\n\n## Flick Electric — 2023–2025\nSoftware engineer intern, Ruby on Rails.\nLearned how a small product team ships, and why\nvisible progress matters as much as the fix.\n\n## BNZ — 2025–2026\nTech graduate, domestic payments mainframe (COBOL/JCL).\nHigh-stakes systems where a mistake moves real money.\nLeft for more autonomy.",
  "ls side-projects/":"fetch-plugin/     # Noctalia shell widget, system info on desktop + lock screen\nscam-buster/      # self-hosted scam-detection app, Node/Express\nportfolio/        # you are here",
  "help":"commands: cat experience.md, ls side-projects/, clear"
};
const tb=document.getElementById('termBody'),tOut=document.getElementById('termOut'),tIn=document.getElementById('termIn');let busy=false;
const esc=s=>s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
const pl='<span class="prompt">taiao@kawiti</span>:~/dev$ ';
// each command replaces the previous output, so the box never grows
async function run(c,typeIt){c=c.trim();if(busy||!c)return;busy=true;
  if(typeIt){tIn.value='';for(const ch of c){tIn.value+=ch;await new Promise(r=>setTimeout(r,30));}}
  tIn.value='';
  if(c==='clear'){tOut.innerHTML='';busy=false;return;}
  const res=out[c]?esc(out[c]):'<span class="t-err">command not found: '+esc(c)+'</span>  (try help)';
  tOut.innerHTML=pl+'<span class="cmd">'+esc(c)+'</span>\n'+res;
  busy=false;}
document.querySelectorAll('#cmds button').forEach(b=>b.addEventListener('click',()=>run(b.dataset.c,true)));
tIn.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run(tIn.value);}});
tb.addEventListener('click',e=>{if(!e.target.closest('button,a'))tIn.focus({preventScroll:true});});

// TIMELINE
// img: drop a matching file into reel/ and the clip and monitor pick it up; until then they show a plain block
const clips=[
  {img:"reel/yourstories.jpg",t:"Understanding your stories.",x:"Years of shooting and editing for iwi organisations and small businesses taught me how creative production actually runs, from the brief to the final cut. Click through the timeline below."},
  {img:"reel/ontheground.jpg",t:"On the ground",x:"Freelance videography for iwi organisations and small businesses, 2020–2022. Showing up, building trust, capturing people as they are."},
  {img:"reel/littledetails.jpg",t:"The little details",x:"Sound design, music, and an eye for framing, light and composition. The parts nobody notices until they're wrong, and the reason a piece feels finished."},
  {img:"reel/finalcut.jpg",t:"The final cut",x:"Shaping raw material into something with a beginning, a turn and an ending. Delivery, in another medium."}
];
const cEls=[...document.querySelectorAll('.clip')],ph=document.getElementById('playhead'),ed=document.getElementById('editor');
const mt=document.getElementById('monTitle'),mx=document.getElementById('monText'),tc=document.getElementById('tc');
const mon=document.getElementById('monitor');
function showClip(i,el){cEls.forEach(c=>c.classList.toggle('active',c===el));
  mon.classList.add('fade');setTimeout(()=>{mt.textContent=clips[i].t;mx.textContent=clips[i].x;mon.style.setProperty('--shot',`url(${new URL(clips[i].img,document.baseURI)})`);mon.classList.remove('fade');},180);
  movePlayhead(el);}
// position only: safe to call on resize without replaying the fade
function movePlayhead(el){const er=ed.getBoundingClientRect(),cr=el.getBoundingClientRect();ph.style.left=(cr.left-er.left+8)+'px';
  const lane=el.parentElement.getBoundingClientRect();const s=Math.round((cr.left-lane.left)/lane.width*120);
  tc.textContent='00:0'+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+':00';}
cEls.forEach(el=>{const c=clips[+el.dataset.i];el.style.backgroundImage=`url(${c.img})`;el.setAttribute('aria-label',c.t);});
cEls.forEach(c=>c.addEventListener('click',()=>showClip(+c.dataset.i,c)));
requestAnimationFrame(()=>showClip(0,cEls[0]));
addEventListener('resize',()=>{const a=document.querySelector('.clip.active');if(a)movePlayhead(a);});

// CONTACT
document.getElementById('copyBtn').addEventListener('click',async()=>{const c=document.getElementById('copied');
  try{await navigator.clipboard.writeText(document.getElementById('email').textContent);c.textContent='copied ✓';}
  catch(e){c.textContent='select the address to copy';}});
