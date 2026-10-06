const $=id=>document.getElementById(id); const key='pazy-v1';
const defaults={goals:{calGoal:1500,proteinGoal:120,waterGoal:2,stepsGoal:8000,sleepGoal:7.5},habits:['2 L Wasser','Vitamine','10 Min. lesen','Training','8’000 Schritte','10 Min. etwas Neues lernen'],days:{}};
let data=JSON.parse(localStorage.getItem(key)||'null')||defaults; data.goals={...defaults.goals,...data.goals}; data.habits=data.habits||defaults.habits; data.days=data.days||{};
const today=new Date().toISOString().slice(0,10); data.days[today]=data.days[today]||{done:{}}; const day=data.days[today];
$('date').textContent=new Intl.DateTimeFormat('de-CH',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
const metrics=['cal','protein','water','steps','sleep','weight']; metrics.forEach(id=>{ $(id).value=day[id]??''; $(id).addEventListener('input',()=>{day[id]=+$ (id).value;save()}) });
Object.keys(data.goals).forEach(id=>{ $(id).value=data.goals[id]; $(id).addEventListener('input',()=>{data.goals[id]=+$ (id).value;save()}) });
function renderHabits(){let box=$('habitList');box.innerHTML='';data.habits.forEach((h,i)=>{let row=document.createElement('label');row.className='habit';row.innerHTML=`<input type="checkbox" ${day.done[i]?'checked':''}><span>${h}</span><button type="button">×</button>`;row.querySelector('input').onchange=e=>{day.done[i]=e.target.checked;save()};row.querySelector('button').onclick=e=>{e.preventDefault();data.habits.splice(i,1);day.done={};save();renderHabits()};box.appendChild(row)});update()}
$('addHabit').onclick=()=>{let v=$('newHabit').value.trim();if(v){data.habits.push(v);$('newHabit').value='';save();renderHabits()}};
function pct(v,g){return Math.min(100,Math.round((v||0)/(g||1)*100))}
function update(){let g=data.goals;['protein','water','steps','sleep'].forEach(x=>$(x+'Prog').value=pct(day[x],g[x+'Goal'])); $('calProg').value=pct(day.cal,g.calGoal); $('calLeft').textContent=day.cal?`${Math.max(0,g.calGoal-day.cal)} kcal übrig`:'';
let habitDone=Object.values(day.done||{}).filter(Boolean).length, hc=data.habits.length; $('habitCount').textContent=`${habitDone}/${hc}`;
let scores=[]; if(day.cal) scores.push(day.cal<=g.calGoal?100:Math.max(0,100-(day.cal-g.calGoal)/g.calGoal*100)); ['protein','water','steps','sleep'].forEach(x=>{if(day[x])scores.push(pct(day[x],g[x+'Goal']))}); if(hc)scores.push(habitDone/hc*100); let score=Math.round(scores.reduce((a,b)=>a+b,0)/(scores.length||1)); day.score=score; $('score').textContent=score;$('scoreBar').style.width=score+'%';$('scoreText').textContent=score>=80?'Starker Tag 🔥':score>=60?'Du bist auf Kurs':score>0?'Weiter dranbleiben':'Starte deinen Tag';
let streak=0,d=new Date();for(let i=0;i<365;i++){let k=d.toISOString().slice(0,10),s=data.days[k]?.score||0;if(s>=80)streak++;else if(k!==today)break;else if(i===0){} d.setDate(d.getDate()-1)}$('streak').textContent=`${streak} ${streak===1?'Tag':'Tage'}`;localStorage.setItem(key,JSON.stringify(data))}
function save(){localStorage.setItem(key,JSON.stringify(data));update()} renderHabits();update();
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
