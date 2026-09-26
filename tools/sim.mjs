// Balance-Simulation: node tools/sim.mjs [cps] [hours]
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import url from 'node:url';

const root = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
let T = 1_700_000_000_000;
const realDateNow = Date.now;
Date.now = () => T;
globalThis.window = undefined;
for (const f of ['util', 'data', 'content', 'game']) {
  vm.runInThisContext(fs.readFileSync(path.join(root, 'js', f + '.js'), 'utf8'), { filename: f + '.js' });
}
const { game: G, data: D, util: U } = globalThis.DH;
DH.util.store = { get: () => null, set: () => true, del() {} };

const CPS = +(process.argv[2] ?? 5);          // Klicks pro Sekunde (aktiv)
const HOURS = +(process.argv[3] ?? 30);
const ACTIVE_MIN = +(process.argv[4] ?? 90);   // Minuten pro Run aktiv geklickt, danach idle
const VERBOSE = process.argv.includes('-v');

if (process.env.HOP_DIV) G.HOP_DIV = +process.env.HOP_DIV;
if (process.env.BK) G.BEARD_K = +process.env.BK;
if (process.env.BE) G.BEARD_EXP = +process.env.BE;
if (process.env.CF) G.CF_MULT = +process.env.CF;
if (process.env.HA) G.HA = +process.env.HA;
if (process.env.HB) G.HB = +process.env.HB;
if (process.env.HL0) G.HL0 = +process.env.HL0;
if (process.env.BPSX) D.buildings.forEach((b) => { b.bps *= +process.env.BPSX; });
const NODUCK = !!process.env.NODUCK;
G.load();
const S = G.S;
const log = [];
const milestones = [1e3, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24, 1e27];
let mi = 0;
let t = 0;
let nextDuck = 140, nextBug = 60, nextIrc = 240;
let runT = 0;
const fmt = (s) => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return `${h}h${String(m).padStart(2, '0')}`; };
const firstBuy = {};

function choose() {
  // Distro: beste freigeschaltete nach grober Punktzahl
  let best = 'ubuntu', bs = -1;
  for (const d of D.distros) {
    if (d.secret || !G.distroUnlocked(d)) continue;
    const m = d.mods;
    let s = (m.prod || 1) * Math.pow(m.click || 1, 0.25) / Math.pow(m.bCost || 1, 1.5) / Math.pow(m.uCost || 1, 0.3) * (m.hopMult ? 1 : 1);
    if (d.special === 'gentoo') s = 2.5;
    if (d.special === 'subscription') s = 3.2;
    if (d.id === 'lfs') s = 0.1;
    if (!S.visited[d.id]) s *= 1.3; // Neugier
    if (s > bs) { bs = s; best = d.id; }
  }
  return best;
}

function buyDotfiles() {
  let bought = true;
  while (bought) {
    bought = false;
    const av = D.dotfiles.filter((d) => !d.dir && !S.dotfiles[d.id] && G.dotfileAvailable(d)).sort((a, b) => a.cost - b.cost);
    for (const d of av) { if (S.karma >= d.cost) { G.buyDotfile(d.id); bought = true; break; } }
  }
}

const hopLog = [];
while (t < HOURS * 3600) {
  const dt = 1;
  T += dt * 1000; t += dt; runT += dt;
  const active = runT < ACTIVE_MIN * 60;
  G.tick(dt);
  if (active) for (let i = 0; i < CPS; i++) G.doClick();
  // Enten
  if (t >= nextDuck) {
    nextDuck = t + (100 + Math.random() * 160) / G.duckFreq;
    if (!NODUCK && (active || Math.random() < 0.2)) {
      S.stats.ducks++;
      const e = U.weighted(DH.content.duckFx);
      G.duckEffect(e.id);
    }
  }
  if (t >= nextBug) {
    nextBug = t + (45 + Math.random() * 60) / G.bugFreq;
    if (active) { S.stats.bugs++; G.earn(G.bugReward()); }
  }
  if (t >= nextIrc) {
    nextIrc = t + (200 + Math.random() * 200) / G.ircFreq;
    if (active) { S.stats.irc++; G.earn(G.lump(300) * G.ircMult * 0.6); }
  }
  // Käufe (jede Sekunde)
  // Glaubenskriege: Produktionsvariante
  for (const id of ['sw_emacs', 'sw_spaces', 'sw_systemd', 'sw_gnome', 'sw_bash']) {
    const u = D.uIndex[id];
    if (G.upgradeVisible(u) && S.bytes >= G.uCost(u) * 2) G.buyUpgrade(id);
  }
  G.buyAllUpgrades();
  if (G.upgradeVisible(D.uIndex.final) && S.bytes >= G.uCost(D.uIndex.final)) {
    G.buyUpgrade('final');
    log.push(`${fmt(t)}  *** JAHR DES LINUX-DESKTOPS *** (Hops ${S.hops}, Bart ${S.beard})`);
    break;
  }
  const saving = G.upgradeVisible(D.uIndex.final) && S.runBytes > G.uCost(D.uIndex.final) / 20;
  for (let i = 0; i < 40 && !saving; i++) {
    let best = null, bestP = Infinity;
    for (const b of D.buildings) {
      if (!G.revealed(b)) continue;
      const p = G.bCost(b.id) / (G.perUnit[b.id] * G.prodMult) + G.bCost(b.id) / Math.max(G.bps, 0.1);
      if (p < bestP) { bestP = p; best = b; }
    }
    if (!best || G.bCost(best.id) > S.bytes) break;
    G.buyBuilding(best.id, 1);
    if (!firstBuy[best.id]) { firstBuy[best.id] = t; if (S.hops === 0) log.push(`${fmt(t)}  erstes ${best.name}`); }
  }
  if (t % 5 === 0) G.checkAchievements();
  while (mi < milestones.length && S.allBytes >= milestones[mi]) { log.push(`${fmt(t)}  ${U.bytes(milestones[mi])} insgesamt  (Hops ${S.hops})`); mi++; }
  // Hop-Entscheidung
  const pend = G.pendingHairs();
  const rate = pend / Math.max(1, runT);
  const want = S.hops === 0 ? pend >= 4 : (pend >= Math.max(2, S.beard * 0.35) && runT > 600) || (runT > 3 * 3600 && pend >= S.beard * 0.1 && pend > 0);
  if (want && G.canHop()) {
    if (VERBOSE) {
      const tiers = Object.keys(S.u).filter(k=>k.startsWith('t_')).length;
      const top = D.buildings.filter(b=>S.b[b.id]>0).map(b=>b.id+':'+S.b[b.id]).slice(-4).join(' ');
      hopLog.push(`     run=${U.bytes(S.runBytes)} bps=${U.bytes(G.bpsBase)} prodMult=${G.prodMult.toExponential(2)} beardM=${G.beardMult.toFixed(1)} achM=${G.achMult.toFixed(2)} gentoo=${G.gentooMult.toFixed(1)} tiers=${tiers} upg=${G.upgradesOwned} [${top}]`);
    }
    const target = choose();
    const gain = G.hop(target);
    hopLog.push(`${fmt(t)}  HOP #${S.hops} → ${D.dIndex[target].name.padEnd(22)} +${gain} Haare (Bart ${S.beard}, Run ${Math.round(runT / 60)} min)`);
    buyDotfiles();
    runT = 0;
  }
}

console.log(`=== Simulation: ${CPS} Klicks/s, ${ACTIVE_MIN} min aktiv pro Run, ${HOURS} h ===`);
console.log(log.join('\n'));
console.log('--- Hops ---');
console.log(hopLog.join('\n'));
console.log(`Ende: t=${fmt(t)}, Bart ${S.beard}, Karma ${S.karma}, Hops ${S.hops}, Erfolge ${Object.keys(S.ach).length}, Dotfiles ${Object.keys(S.dotfiles).length}, bps ${U.bytes(G.bps)}/s, run ${U.bytes(S.runBytes)}`);
