// Screens are switched with the address hash, so the phone's back button steps back through them.
const SCREENS = ["menu","new","games","setup","game"];
function go(s){ if(location.hash==="#"+s) show(); else location.hash=s; }
function show(){
  let s = location.hash.slice(1) || "menu";
  if(!SCREENS.includes(s) || (s==="game" && !games.includes(S))) s = "menu";
  document.querySelectorAll("[data-screen]").forEach(el=>el.hidden = el.dataset.screen!==s);
  if(s==="games") renderGames();
  if(s==="setup") renderSetupForm();
  if(s==="game"){ renderSetup(); renderEditor(); renderLines(); }
  window.scrollTo(0,0);
}
window.addEventListener("hashchange", show);
document.addEventListener("click", e=>{
  const t=e.target.closest("button[data-go]"); if(t) go(t.dataset.go);
});
