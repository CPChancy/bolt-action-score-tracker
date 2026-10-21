// The new game setup screen: the five questions, validation and starting the game.
const blankDraft = () => ({sys:"", a:"", pa:"", b:"", pb:"", pts:1000, scen:""});
let draft = blankDraft();
function renderSetupForm(){
  document.querySelectorAll("#setupSys button").forEach(b=>b.setAttribute("aria-pressed", b.dataset.setsys===draft.sys));
  $("setupScen").innerHTML = `<option value="">Choose a scenario</option>` +
    Object.keys(PRESETS).map(k=>`<option${k===draft.scen?" selected":""}>${esc(k)}</option>`).join("");
  $("setupA").value=draft.a; $("setupPA").value=draft.pa; $("setupB").value=draft.b; $("setupPB").value=draft.pb; $("setupPts").value=draft.pts;
}
[["setupA","a"],["setupPA","pa"],["setupB","b"],["setupPB","pb"],["setupPts","pts"],["setupScen","scen"]].forEach(([id,k])=>
  $(id).addEventListener("input", e=>{ draft[k]=e.target.value; }));
$("setupForm").onsubmit = e=>{
  e.preventDefault();
  const a=draft.a.trim(), b=draft.b.trim(), pts=Math.round(+draft.pts);
  const missing = [!draft.sys&&"the system", !a&&"your army", !b&&"your opponent's army",
                   !(pts>0)&&"the points size", !draft.scen&&"the scenario"].filter(Boolean);
  if(missing.length){ $("setupErr").textContent = "Still needed: " + missing.join(", ") + "."; return; }
  games.unshift({ id:Date.now().toString(36), sys:draft.sys, scen:draft.scen, turn:1, pts, margin:1,
    nameA:a, nameB:b, playerA:draft.pa.trim(), playerB:draft.pb.trim(),
    counts:{A:[],B:[]}, tp:[3,1,0], updated:Date.now() });
  store.set("fsc-games", games);
  draft = blankDraft(); $("setupErr").textContent = "";
  go("game");
};
document.addEventListener("click", e=>{
  const t=e.target.closest("button[data-setsys]"); if(!t) return;
  draft.sys=t.dataset.setsys; renderSetupForm();
});
