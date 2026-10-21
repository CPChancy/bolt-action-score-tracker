// The calculator screen: army ledgers, turn tracker, scoring editor and the Discord report.
function rows(g=S){ return custom[g.scen] || PRESETS[g.scen].map(r=>({...r})); }
function ensureCounts(){
  const n = rows().length;
  ["A","B"].forEach(p=>{ S.counts[p] = (S.counts[p]||[]).slice(0,n); while(S.counts[p].length<n) S.counts[p].push(0); });
}
function total(p,g=S){ return rows(g).reduce((s,r,i)=>s + r.v*(g.counts[p][i]||0), 0); }

function renderSetup(){
  $("scenario").innerHTML = Object.keys(PRESETS).map(k=>`<option${k===S.scen?" selected":""}>${esc(k)}</option>`).join("");
  document.querySelectorAll("#system button").forEach(b=>b.setAttribute("aria-pressed", b.dataset.sys===S.sys));
  $("points").value=S.pts; $("margin").value=S.margin; $("nameA").value=S.nameA; $("nameB").value=S.nameB;
  $("playerA").value=S.playerA||""; $("playerB").value=S.playerB||"";
  [$("tpWin").value,$("tpDraw").value,$("tpLoss").value]=S.tp;
  $("turns").innerHTML = [1,2,3,4,5,6,7].map(t=>`<button type="button" class="${t<=S.turn?"done":""} ${t===7?"t7":""}" data-t="${t}" aria-label="Turn ${t}">${t}</button>`).join("");
}
function renderEditor(){
  $("editor").innerHTML = rows().map((r,i)=>`<div class="edit">
    <input type="text" id="el${i}" value="${esc(r.l)}" aria-label="Scoring line ${i+1} name">
    <input type="number" id="ev${i}" value="${r.v}" step="1" aria-label="VP each">
    <button type="button" data-del="${i}" aria-label="Remove line">✕</button></div>`).join("");
}
function renderLines(){
  ensureCounts();
  ["A","B"].forEach(p=>{
    $("lines"+p).innerHTML = rows().map((r,i)=>`<div class="line">
      <div class="what"><b>${esc(r.l)}</b><small>${r.v} VP each</small></div>
      <div class="stepper">
        <button type="button" data-p="${p}" data-i="${i}" data-d="-1" aria-label="Remove one ${esc(r.l)}">−</button>
        <output>${S.counts[p][i]}</output>
        <button type="button" class="plus" data-p="${p}" data-i="${i}" data-d="1" aria-label="Add one ${esc(r.l)}">+</button>
      </div></div>`).join("");
  });
  renderResult();
}
function renderResult(){
  const a=total("A"), b=total("B"), m=Math.max(1,+S.margin||1), over=S.turn>=6;
  $("totA").textContent=a; $("totB").textContent=b;
  const diff=a-b, v=$("verdict");
  let res, tA, tB;
  if(Math.abs(diff)>=m){ const w=diff>0?S.nameA:S.nameB; res=`${w} ${over?"win":"lead"}`; tA=diff>0?S.tp[0]:S.tp[2]; tB=diff>0?S.tp[2]:S.tp[0]; }
  else { res = over?"Draw":"Too close to call"; tA=tB=S.tp[1]; }
  v.textContent = over ? res : `Turn ${S.turn}: ${res}`;
  v.className = "verdict " + (!over?"live":(Math.abs(diff)>=m?"win":"draw"));
  $("scoreline").textContent = `${S.nameA} ${a} – ${b} ${S.nameB}`;
  const who = p => S["player"+p] ? ` (${S["player"+p]})` : "";
  const detail = p => rows().map((r,i)=>S.counts[p][i]?`  ${r.l}: ${S.counts[p][i]} × ${r.v} = ${S.counts[p][i]*r.v}`:null).filter(Boolean).join("\n") || "  (none)";
  $("report").textContent =
`**${S.sys} — ${S.scen}** (${S.pts} pts, ${over?`ended turn ${S.turn}`:`turn ${S.turn}`})
**${S.nameA}**${who("A")} ${a} VP vs **${S.nameB}**${who("B")} ${b} VP
Result: ${over?res:"in progress – "+res}${over?`\nLeague points: ${S.nameA} ${tA}, ${S.nameB} ${tB}`:""}
${S.nameA}:
${detail("A")}
${S.nameB}:
${detail("B")}`;
  S.updated = Date.now(); store.set("fsc-games", games);
}
function readEditor(){
  const r = rows().map((x,i)=>({l:$("el"+i).value||"Scoring line", v:+$("ev"+i).value||0}));
  custom[S.scen]=r; store.set("fsc-custom",custom); renderLines();
}

document.addEventListener("click", e=>{
  const t=e.target.closest("button"); if(!t) return;
  if(t.dataset.d){ const p=t.dataset.p,i=+t.dataset.i; S.counts[p][i]=Math.max(0,S.counts[p][i]+ +t.dataset.d); renderLines(); }
  else if(t.dataset.t){ S.turn=+t.dataset.t; renderSetup(); renderResult(); }
  else if(t.dataset.sys){ S.sys=t.dataset.sys; renderSetup(); renderResult(); }
  else if(t.dataset.del!==undefined){ const r=rows(); r.splice(+t.dataset.del,1); ["A","B"].forEach(p=>S.counts[p].splice(+t.dataset.del,1)); custom[S.scen]=r; store.set("fsc-custom",custom); renderEditor(); renderLines(); }
});
$("scenario").onchange = e=>{ S.scen=e.target.value; S.counts={A:[],B:[]}; renderEditor(); renderLines(); };
$("editor").addEventListener("input", readEditor);
$("addRow").onclick = ()=>{ const r=rows(); r.push({l:"New objective",v:1}); custom[S.scen]=r; store.set("fsc-custom",custom); renderEditor(); renderLines(); };
$("resetRows").onclick = ()=>{ delete custom[S.scen]; store.set("fsc-custom",custom); S.counts={A:[],B:[]}; renderEditor(); renderLines(); };
["points","margin"].forEach(id=>$(id).addEventListener("input",e=>{ S[id==="points"?"pts":"margin"]=+e.target.value; renderResult(); }));
["nameA","nameB"].forEach(id=>$(id).addEventListener("input",e=>{ S[id]=e.target.value||(id==="nameA"?"Player 1":"Player 2"); renderResult(); }));
["playerA","playerB"].forEach(id=>$(id).addEventListener("input",e=>{ S[id]=e.target.value.trim(); renderResult(); }));
["tpWin","tpDraw","tpLoss"].forEach((id,i)=>$(id).addEventListener("input",e=>{ S.tp[i]=+e.target.value; renderResult(); }));
$("newGame").onclick = ()=>{ $("newGame").hidden=true; $("confirmClear").hidden=false; setTimeout(()=>{$("newGame").hidden=false;$("confirmClear").hidden=true},3000); };
$("confirmClear").onclick = ()=>{ S.counts={A:[],B:[]}; S.turn=1; $("newGame").hidden=false; $("confirmClear").hidden=true; renderSetup(); renderLines(); };
$("copy").onclick = ()=>{
  const txt=$("report").textContent, ok=()=>{$("toast").textContent="Copied. Paste it into Discord."};
  navigator.clipboard.writeText(txt).then(ok).catch(()=>{ const r=document.createRange(); r.selectNodeContents($("report")); const s=getSelection(); s.removeAllRanges(); s.addRange(r); $("toast").textContent="Text selected. Copy it from your device menu."; });
};
