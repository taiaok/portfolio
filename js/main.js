// header slides in once the hero has scrolled out from under it
const hdr=document.getElementById('hdr'),hero=document.getElementById('hero');
const syncHdr=()=>hdr.classList.toggle('scrolled',scrollY>=hero.offsetHeight-hdr.offsetHeight);
addEventListener('scroll',syncHdr,{passive:true});syncHdr();

// ROADMAP
const rm=[
  "When I came on we had a mountain of legacy code to understand and no one who already did. So I did a technical audit and worked out what we actually needed before we built anything else. That gave everyone the same starting point.",
  "I proposed and stepped into a delivery lead role, with a clear plan and decision points so the team always knows what's next and why.",
  "I pair, review and coach our junior dev, and hand over more as their skills grow. The goal is a team that doesn't need me in every decision.",
  "I'm planning our work around milestones we can actually show and funding goals, rather than progress buried in tickets."
];
const bars=[...document.querySelectorAll('.bar')], rmD=document.getElementById('rmDetail');
function showRm(i){bars.forEach(b=>b.classList.toggle('active',+b.dataset.i===i));rmD.textContent=rm[i]}
const rmHint=document.getElementById('rmHint');
bars.forEach(b=>b.addEventListener('click',()=>{rmHint.classList.add('gone');showRm(+b.dataset.i);}));showRm(0);

// PACMAN DIVIDER: progress follows scroll (backwards when scrolling up); pacman is gone once the line is complete
(()=>{const el=document.getElementById('pacbar');if(!el)return;
  let n=0,pos=-1,queued=false;
  const measure=()=>{const t=document.createElement('span');t.textContent='0'.repeat(10);el.appendChild(t);const w=t.getBoundingClientRect().width/10;t.remove();n=Math.max(8,Math.floor(el.clientWidth/w));};
  const draw=()=>{if(pos>=n-1){el.innerHTML='<span class="tr">'+'-'.repeat(n)+'</span>';return;}
    let dots='';for(let i=pos+1;i<n;i++)dots+=(i%3===0?'o':' ');
    el.innerHTML='<span class="tr">'+'-'.repeat(pos)+'</span><span class="pm">'+(pos%2?'c':'C')+'</span>'+dots;};
  // 0 when the bar enters at the bottom of the screen, 1 once it's a third of the way down from the top
  const progress=()=>{const vh=innerHeight,top=el.getBoundingClientRect().top;return Math.min(1,Math.max(0,(vh-top)/(vh*2/3)));};
  const update=()=>{queued=false;const next=Math.round(progress()*(n-1));
    if(next!==pos){pos=next;draw();}};
  const queue=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
  measure();
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){pos=n-1;draw();return;}
  update();
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',()=>{measure();pos=-1;update();});
})();

// TERMINAL
const esc=s=>s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
// console.table-style box: columns sized to their widest cell
function table(head,rows){const all=[head,...rows],w=head.map((_,i)=>Math.max(...all.map(r=>r[i].length)));
  const rule=(l,m,r)=>l+w.map(n=>'─'.repeat(n+2)).join(m)+r,row=r=>'│'+r.map((c,i)=>' '+c.padEnd(w[i])+' ').join('│')+'│';
  const txt=esc([rule('┌','┬','┐'),row(head),rule('├','┼','┤'),...rows.map(row),rule('└','┴','┘')].join('\n'));
  return '<span class="tbl">'+txt.replace(/[─│┌┬┐├┼┤└┴┘]+/g,m=>'<i>'+m+'</i>')+'</span>';}
const jobs=[
  ["Flick","2023–25","Rails apprentice"],
  ["BNZ","2025–26","mainframe wizard"],
  ["Āhau","2026–now","deliverer of deliverables"]
];
// values are HTML: plain text goes through esc()
const out={
  // the table is too wide for phones, so a plain list of the same jobs is rendered alongside; CSS shows one
  "cat experience.md":table(["(index)","years","role"],jobs)
    +'<span class="tbl-list">'+esc(jobs.map(([co,yrs,role])=>co+' '+yrs+'\n  '+role).join('\n'))+'</span>'
    +esc("Developers Institute diploma.\nJS, Node, React, Rails.\nArch linux btw."),
  "ls side-projects/":esc("fetch-plugin/   # Noctalia system-info widget\nscam-buster/    # self-hosted scam checker\nportfolio/      # you are here"),
  "help":esc("commands: cat experience.md, ls side-projects/, clear")
};
const tb=document.getElementById('termBody'),tOut=document.getElementById('termOut'),tIn=document.getElementById('termIn');let busy=false;
// each command replaces the previous output, so the box never grows
async function run(c,typeIt){c=c.trim();if(busy||!c)return;busy=true;
  if(typeIt){tIn.value='';for(const ch of c){tIn.value+=ch;await new Promise(r=>setTimeout(r,30));}}
  // the command stays on the prompt line above its output, like a real shell
  if(c==='clear'){tIn.value='';tOut.innerHTML='';busy=false;return;}
  const res=out[c]?out[c]:'<span class="t-err">command not found: '+esc(c)+'</span>  (try help)';
  tOut.innerHTML=res;
  tOut.scrollTop=0;
  busy=false;}
document.querySelectorAll('#cmds button').forEach(b=>b.addEventListener('click',()=>run(b.dataset.c,true)));
// focusing selects the last command, so typing replaces it
tIn.addEventListener('focus',()=>tIn.select());
tIn.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run(tIn.value);}});
tb.addEventListener('click',e=>{if(!e.target.closest('button,a'))tIn.focus({preventScroll:true});});

// TIMELINE
// img: drop a matching file into reel/ and the clip and monitor pick it up; until then they show a plain block
const clips=[
  {img:"reel/yourstories.jpg",t:"What the camera taught me",x:"Before software, I spent years shooting and editing for iwi organisations and small businesses. A lot of how I deliver projects now I learned there."},
  {img:"reel/ontheground.jpg",t:"On the ground",x:"You get the best footage when everyone's comfortable. So I turn up, listen, and understand before deciding what to make. I start every project that way, whether it's a video or an app."},
  {img:"reel/littledetails.jpg",t:"The little details",x:"The little things matter (and bother me) the most in the final stretch – framing, sound, border radius – and I’ve got a keen eye for them."},
  {img:"reel/bigpicture.jpg",t:"The big picture",x:"The story needs to be coherent. Every endeavour needs a beginning, a turn and an end – and a way to get there."}
];
const cEls=[...document.querySelectorAll('.clip')],ph=document.getElementById('playhead'),ed=document.getElementById('editor');
const tc=document.getElementById('tc'),mon=document.getElementById('monitor');
// every caption is rendered up front and stacked in one grid cell, so the monitor is always sized
// for the longest one and switching clips never resizes the panel; only the active caption is visible
const caps=clips.map(c=>{const d=document.createElement('div');d.className='cap';
  const h=document.createElement('h3');h.textContent=c.t;const p=document.createElement('p');p.textContent=c.x;
  d.append(h,p);return d;});
document.getElementById('caps').append(...caps);
function showClip(i,el){cEls.forEach(c=>c.classList.toggle('active',c===el));
  caps.forEach((c,j)=>c.classList.toggle('on',j===i));
  mon.style.setProperty('--shot',`url(${new URL(clips[i].img,document.baseURI)})`);
  movePlayhead(el);}
// position only: safe to call on resize without replaying the fade
function movePlayhead(el){const er=ed.getBoundingClientRect(),cr=el.getBoundingClientRect();ph.style.left=(cr.left-er.left+8)+'px';
  const lane=el.parentElement.getBoundingClientRect();const s=Math.round((cr.left-lane.left)/lane.width*120);
  tc.textContent='00:0'+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+':00';}
cEls.forEach(el=>{const c=clips[+el.dataset.i];el.style.backgroundImage=`url(${c.img})`;el.setAttribute('aria-label',c.t);});
// hint retires on the first real click; the initial showClip below is programmatic, so it stays until then
const reelHint=document.getElementById('reelHint');
cEls.forEach(c=>c.addEventListener('click',()=>{reelHint.classList.add('gone');showClip(+c.dataset.i,c);}));
requestAnimationFrame(()=>showClip(0,cEls[0]));
addEventListener('resize',()=>{const a=document.querySelector('.clip.active');if(a)movePlayhead(a);});

// CONTACT
// email tile copies the address; if the clipboard is blocked, fall through to the mailto link
const emailLink=document.getElementById('emailLink');
emailLink.addEventListener('click',async e=>{e.preventDefault();const c=document.getElementById('copied');
  try{await navigator.clipboard.writeText(emailLink.href.replace('mailto:',''));c.textContent='copied ✓';setTimeout(()=>c.textContent='',2000);}
  catch(err){location.href=emailLink.href;}});
