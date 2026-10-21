// Saving and loading on this device only (browser storage).
const store = { get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
                set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}} };

// Saved games are kept in one list, most recently opened first, so the menu can offer them again.
function loadGames(){
  const list = store.get("fsc-games", []);
  // Older games shared scoring per scenario; give each its own copy so games no longer affect each other.
  const shared = store.get("fsc-custom", {});
  list.forEach(g=>{ if(!g.rows) g.rows = shared[g.scen] ? shared[g.scen].map(r=>({...r})) : presetRows(g.scen); });
  return list;
}
let games = loadGames();
let S = games[0] || null; // the game open in the calculator

// Another tab changed the saved games: take its copy so saving here doesn't overwrite it.
window.addEventListener("storage", e=>{
  if(e.key!=="fsc-games") return;
  games = loadGames();
  S = games.find(g=>g.id===S?.id) || null;
  show();
});
