// Preset scoring for each scenario: l is the scoring line's label, v the victory points it is worth.
const PRESETS = {
  "Seek & Destroy":      [{l:"Enemy unit destroyed",v:1}],
  "Key Positions":       [{l:"Objective controlled at end",v:3},{l:"Enemy unit destroyed",v:1}],
  "Breakthrough":        [{l:"Enemy unit destroyed",v:1},{l:"Unit in enemy deployment zone",v:2},{l:"Unit exited enemy table edge",v:3}],
  "Top Secret":          [{l:"Intel carried off your edge",v:5},{l:"Holding the intel at end",v:3},{l:"Enemy unit destroyed",v:1}],
  "Demolition":          [{l:"Enemy base destroyed",v:5},{l:"Enemy unit destroyed",v:1}],
  "Hold Until Relieved": [{l:"Objective controlled at end",v:5},{l:"Enemy unit destroyed",v:1}],
  "Envelopment":         [{l:"Enemy unit destroyed",v:1},{l:"Unit in enemy deployment zone",v:2},{l:"Unit exited enemy table edge",v:3}],
  "Custom / event":      [{l:"Enemy unit destroyed",v:1},{l:"Objective held",v:2}]
};
// A fresh, editable copy of a scenario's preset scoring, so edits never change the presets themselves.
const presetRows = scen => PRESETS[scen].map(r=>({...r}));
// The <option> list for a scenario dropdown, with the given scenario selected.
const scenarioOptions = selected => Object.keys(PRESETS).map(k=>`<option${k===selected?" selected":""}>${esc(k)}</option>`).join("");
