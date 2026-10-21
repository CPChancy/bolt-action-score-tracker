// Saving and loading on this device only (browser storage).
const store = { get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
                set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}} };

let custom = store.get("fsc-custom", {});
// Saved games are kept in one list, most recently opened first, so the menu can offer them again.
let games = store.get("fsc-games", []);
let S = games[0] || null; // the game open in the calculator
