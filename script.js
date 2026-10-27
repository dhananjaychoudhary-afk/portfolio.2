const themeButton=document.getElementById('themeToggle');
const search=document.getElementById('projectSearch');
const filter=document.getElementById('projectFilter');
const cards=[...document.querySelectorAll('.card')];
const count=document.getElementById('projectCount');
const noResults=document.getElementById('noResults');
const form=document.getElementById('chatForm');
const input=document.getElementById('chatInput');
const messages=document.getElementById('messages');
document.getElementById('year').textContent=new Date().getFullYear();
if(localStorage.getItem('portfolio-theme')==='dark')document.body.classList.add('dark-mode');
themeButton.addEventListener('click',()=>{document.body.classList.toggle('dark-mode');localStorage.setItem('portfolio-theme',document.body.classList.contains('dark-mode')?'dark':'light');themeButton.setAttribute('aria-label',document.body.classList.contains('dark-mode')?'Switch to light theme':'Switch to dark theme')});
function updateProjects(){
  let visible=0;
  const query=search.value.trim().toLowerCase();
  const category=filter.value;
  cards.forEach(card=>{
    const matchesText=(card.dataset.search+' '+card.textContent).toLowerCase().includes(query);
    const matchesCategory=category==='all'||card.dataset.category.split(' ').includes(category);
    const show=matchesText&&matchesCategory;
    card.hidden=!show;
    if(show)visible++;
  });
  count.textContent=`${visible} ${visible===1?'project':'projects'}`;
  noResults.hidden=visible>0;
}
search.addEventListener('input',updateProjects);
filter.addEventListener('change',updateProjects);
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();search.focus()}});
function message(text,kind){const p=document.createElement('p');p.textContent=text;if(kind)p.className=kind;messages.append(p);messages.scrollTop=messages.scrollHeight;return p}
async function ask(q){message(q,'user');const answer=message('Thinking…');try{const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});const data=await res.json();if(!res.ok)throw new Error(data.error||'The assistant could not respond right now.');answer.textContent=data.answer||'I could not find that in the portfolio information.'}catch(e){answer.textContent='The chatbot API is not connected yet. Configure the class API through a server-side endpoint before deployment; keep its secret key out of these website files.'}}
form.addEventListener('submit',async e=>{e.preventDefault();const q=input.value.trim();if(!q)return;input.value='';await ask(q)});
document.querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.q)));



