Arena Genesis — genesis.html
The main Kickstarter campaign page. Deploy this alongside tier1.html–tier5.html, arena-logo.png, and the video files in the same GitHub Pages directory as index.html.
Key Features

Identity Gate — three-card selector (Parent/Educator/LA) that adapts all copy on the page
Dual Ticker — live funding £ and LA partner count, driven from Google Sheet
The Vault — 10 unlockable briefing panels, unlocked as STAT_FUNDING % increases
Logo Reveal Canvas — pixel-by-pixel reveal of arena-logo.png tied to funding %
Tier Cards — filtered by selected identity, each links to its tier page
Memorial Wall Preview — canvas animation of backer bricks, driven from Backers tab
LA Portal — dedicated section visible to all but prominent for LA identity

Connecting to Your Main Site (index.html)
Add a link in your index.html navigation and/or hero button:
html<!-- In nav -->
<a href="genesis.html">Genesis Campaign</a>

<!-- Or as a hero CTA button -->
<a href="genesis.html" class="btn-primary">Join the Genesis Campaign</a>
Sheet Configuration
Update these values in the GID constant near the top of the script block:
javascriptconst GID = {
  matrix: '1500722618',   // Kickstarter_Matrix tab GID — already correct
  tiers:  '1373714631',   // Tier_Definitions tab GID — already correct
  backers: '0'            // REPLACE with your Backers tab GID after running gas-setup.gs
};
To find the Backers GID: run gas-setup.gs, click the Backers tab, check the URL for gid=XXXXXXX.

Full HTML Source
Copy everything below and save as genesis.html in your GitHub Pages repository root.
html<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Arena Genesis — The Founding Campaign | The Arena Hub Ltd</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lucide/0.263.1/umd/lucide.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root {
  --navy:#1B263B; --navy-deep:#111C2D; --navy-mid:#243450; --navy-light:#2E4169;
  --gold:#C5A059; --gold-light:#D4B472; --gold-pale:#E8D5A3;
  --gold-dim:rgba(197,160,89,0.15); --gold-border:rgba(197,160,89,0.3);
  --slate:#8B9CB5; --slate-light:#B4C2D4; --slate-dark:#4A5A6E;
  --white:#F0F4F8; --divider:rgba(197,160,89,0.2); --green:#4ADE80; --red:#F87171;
}
*{margin:0;padding:0;box-sizing:border-box} html{scroll-behavior:smooth}
body{background:var(--navy-deep);color:var(--white);font-family:'Outfit',sans-serif;font-weight:300;line-height:1.7;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");pointer-events:none;z-index:999;opacity:0.6}

/* GATE */
#identity-gate{position:fixed;inset:0;background:var(--navy-deep);z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px;transition:opacity .7s ease,visibility .7s ease}
#identity-gate.hidden{opacity:0;visibility:hidden;pointer-events:none}
.gate-grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(197,160,89,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(197,160,89,.04) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,black 0%,transparent 100%)}
.gate-glow{position:absolute;width:700px;height:700px;background:radial-gradient(circle,rgba(197,160,89,.07) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
.gate-content{position:relative;z-index:2;text-align:center;max-width:980px;width:100%}
.gate-eyebrow{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:12px}
.gate-eyebrow::before,.gate-eyebrow::after{content:'';width:32px;height:1px;background:var(--gold);opacity:.5}
.gate-title{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,5vw,50px);font-weight:600;color:var(--white);line-height:1.15;margin-bottom:10px}
.gate-subtitle{font-size:14px;color:var(--slate-light);margin-bottom:48px;line-height:1.7}
.gate-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.gate-card{background:var(--navy-mid);border:1px solid var(--divider);border-radius:16px;padding:32px 24px;cursor:pointer;transition:all .35s ease;display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;position:relative;overflow:hidden}
.gate-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:0;transition:opacity .3s}
.gate-card:hover{border-color:var(--gold-border);transform:translateY(-6px);box-shadow:0 24px 64px rgba(0,0,0,.45)}
.gate-card:hover::before{opacity:1}
.gate-card-icon{width:56px;height:56px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:14px;display:flex;align-items:center;justify-content:center;color:var(--gold)}
.gate-card-title{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:600;color:var(--white);line-height:1.25}
.gate-card-desc{font-size:12px;color:var(--slate);line-height:1.75;flex:1}
.gate-card-cta{display:inline-flex;align-items:center;gap:6px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}

/* HEADER */
header{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(17,28,45,.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--divider);display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:72px}
.header-left{display:flex;align-items:center;gap:16px}
.logo-badge{width:42px;height:42px;background:linear-gradient(135deg,var(--gold) 0%,#9A7A3A 100%);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:18px;color:var(--navy-deep);text-decoration:none;flex-shrink:0}
.header-brand-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--white);letter-spacing:.02em}
.header-brand-sub{font-family:'DM Mono',monospace;font-size:9px;color:var(--gold);letter-spacing:.18em;text-transform:uppercase}
.header-nav{display:flex;gap:28px;list-style:none}
.header-nav a{font-size:12px;color:var(--slate-light);text-decoration:none;letter-spacing:.1em;text-transform:uppercase;transition:color .2s;cursor:pointer}
.header-nav a:hover{color:var(--gold)}
.header-right{display:flex;align-items:center;gap:20px}
.header-status{display:flex;align-items:center;gap:6px;font-family:'DM Mono',monospace;font-size:10px;color:var(--slate);letter-spacing:.08em}
.status-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:pulse-dot 2s infinite}
@keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:.4}}

/* HERO */
.genesis-hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;padding:120px 48px 100px;overflow:hidden}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(197,160,89,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(197,160,89,.04) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,black 0%,transparent 100%)}
.hero-glow{position:absolute;width:900px;height:900px;background:radial-gradient(circle,rgba(197,160,89,.07) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
.genesis-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 18px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:100px;margin-bottom:28px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);opacity:0;animation:fade-up .8s ease forwards .1s}
.genesis-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);animation:pulse-dot 1.5s infinite}
.hero-eyebrow{font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;display:flex;align-items:center;gap:12px;opacity:0;animation:fade-up .8s ease forwards .2s}
.hero-eyebrow::before,.hero-eyebrow::after{content:'';width:32px;height:1px;background:var(--gold);opacity:.5}
.hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(52px,8vw,108px);font-weight:600;line-height:.92;text-align:center;letter-spacing:-.02em;color:var(--white);margin-bottom:12px;opacity:0;animation:fade-up .8s ease forwards .4s}
.hero-title span{color:var(--gold);font-style:italic}
.hero-subtitle{font-family:'Cormorant Garamond',serif;font-size:clamp(16px,2.2vw,24px);font-weight:400;color:var(--slate-light);text-align:center;letter-spacing:.04em;margin-bottom:44px;opacity:0;animation:fade-up .8s ease forwards .6s}
.hero-divider{width:1px;height:48px;background:linear-gradient(to bottom,var(--gold),transparent);margin:0 auto 44px;opacity:0;animation:fade-up .8s ease forwards .7s}

/* DUAL TICKER */
.dual-ticker{display:flex;background:var(--navy-mid);border:1px solid var(--divider);border-radius:16px;overflow:hidden;margin-bottom:44px;opacity:0;animation:fade-up .8s ease forwards .9s}
.ticker-half{padding:28px 52px;text-align:center;flex:1}
.ticker-half:first-child{border-right:1px solid var(--divider)}
.ticker-half-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--slate);margin-bottom:10px}
.ticker-half-value{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,60px);font-weight:700;color:var(--gold);line-height:1}
.ticker-half-sub{font-size:11px;color:var(--slate);margin-top:8px;font-style:italic}
.ticker-source{font-family:'DM Mono',monospace;font-size:8px;color:var(--slate-dark);letter-spacing:.1em;margin-top:8px}

/* BUTTONS */
.hero-cta-group{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;opacity:0;animation:fade-up .8s ease forwards 1.1s}
.btn-primary{display:inline-flex;align-items:center;gap:10px;padding:16px 40px;background:linear-gradient(135deg,var(--gold) 0%,#9A7A3A 100%);color:var(--navy-deep);font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;border:none;border-radius:8px;cursor:pointer;text-decoration:none;transition:all .3s ease}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(197,160,89,.35)}
.btn-secondary{display:inline-flex;align-items:center;gap:10px;padding:15px 32px;background:transparent;color:var(--gold);font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;border:1px solid var(--gold-border);border-radius:8px;cursor:pointer;text-decoration:none;transition:all .3s ease}
.btn-secondary:hover{background:var(--gold-dim);border-color:var(--gold);transform:translateY(-2px)}
.hero-scroll{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0;animation:fade-up .8s ease forwards 1.4s;cursor:pointer}
.hero-scroll span{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--slate)}
.hero-scroll-line{width:1px;height:32px;background:linear-gradient(to bottom,var(--gold),transparent);animation:scroll-line 1.5s ease-in-out infinite}
@keyframes scroll-line{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}

/* SECTIONS */
.section-divider{width:100%;height:1px;background:var(--divider)}
.section-eyebrow{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
.section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,4vw,56px);font-weight:600;line-height:1.1;color:var(--white);margin-bottom:16px}
.section-lead{font-size:16px;color:var(--slate-light);max-width:680px;line-height:1.8;margin-bottom:64px}

/* NARRATIVE BAND */
.narrative-band{background:linear-gradient(135deg,var(--navy-mid) 0%,var(--navy-deep) 100%);border-top:1px solid var(--divider);border-bottom:1px solid var(--divider);padding:60px 48px;position:relative;overflow:hidden}
.narrative-band::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 100% at 50% 50%,rgba(197,160,89,.05),transparent)}
.narrative-band-inner{max-width:860px;margin:0 auto;position:relative;text-align:center}
.narrative-band-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
.narrative-band-text{font-family:'Cormorant Garamond',serif;font-size:clamp(18px,2.5vw,26px);font-style:italic;color:var(--slate-light);line-height:1.7}
.narrative-band-text strong{color:var(--white);font-style:normal}

/* VAULT */
.vault-outer{background:var(--navy-deep);padding:100px 0}
.vault-inner{max-width:1320px;margin:0 auto;padding:0 48px}
.vault-progress-track{position:relative;margin:64px 0 80px;padding-bottom:48px}
.vault-track-line{position:absolute;top:24px;left:0;right:0;height:2px;background:var(--divider);border-radius:2px}
.vault-track-fill{position:absolute;top:24px;left:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--gold-light));border-radius:2px;transition:width 1.8s cubic-bezier(.25,1,.5,1);box-shadow:0 0 12px rgba(197,160,89,.4);width:0%}
.vault-nodes{display:flex;justify-content:space-between;position:relative;z-index:2}
.vault-node{display:flex;flex-direction:column;align-items:center;gap:10px;flex:1}
.vault-node-dot{width:48px;height:48px;border-radius:50%;background:var(--navy-deep);border:2px solid var(--slate-dark);display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:9px;color:var(--slate-dark);transition:all .6s ease}
.vault-node.unlocked .vault-node-dot{background:var(--gold-dim);border-color:var(--gold);color:var(--gold);box-shadow:0 0 20px rgba(197,160,89,.3)}
.vault-node.active .vault-node-dot{background:var(--gold-dim);border-color:var(--gold);animation:node-pulse 2s infinite}
@keyframes node-pulse{0%,100%{box-shadow:0 0 0 0 rgba(197,160,89,.4)}50%{box-shadow:0 0 0 12px rgba(197,160,89,0)}}
.vault-node-label{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.1em;color:var(--slate-dark);text-transform:uppercase;text-align:center;transition:color .4s}
.vault-node.unlocked .vault-node-label,.vault-node.active .vault-node-label{color:var(--gold)}
.vault-panels{display:flex;flex-direction:column;gap:14px}
.vault-panel{background:var(--navy-mid);border:1px solid var(--divider);border-radius:14px;overflow:hidden;transition:all .4s}
.vault-panel.locked{opacity:.38}
.vault-panel.unlocked{border-color:rgba(197,160,89,.35)}
.vault-panel-header{display:flex;align-items:center;justify-content:space-between;padding:20px 28px}
.vault-panel-left{display:flex;align-items:center;gap:18px;flex:1}
.vault-panel-threshold{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;flex-shrink:0;color:var(--gold);background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:6px;padding:4px 12px}
.vault-panel.locked .vault-panel-threshold{color:var(--slate-dark);background:transparent;border-color:var(--slate-dark)}
.vault-panel-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--white);margin-bottom:2px}
.vault-panel.locked .vault-panel-title{color:var(--slate-dark)}
.vault-panel-subtitle{font-size:12px;color:var(--slate)}
.vault-lock-icon{color:var(--slate-dark);flex-shrink:0}
.vault-unlocked-icon{color:var(--gold);flex-shrink:0}
.vault-panel-body{padding:0 28px 24px;border-top:1px solid var(--divider)}
.vault-panel-copy{font-size:14px;color:var(--slate-light);line-height:1.85;padding-top:18px}

/* LOGO REVEAL */
.logo-reveal-outer{background:var(--navy);padding:80px 0}
.logo-reveal-inner{max-width:1320px;margin:0 auto;padding:0 48px;text-align:center}
.logo-reveal-canvas-wrap{display:inline-block;position:relative;border-radius:16px;overflow:hidden;border:1px solid var(--gold-border);box-shadow:0 0 60px rgba(197,160,89,.12)}
#logo-reveal-canvas{display:block;width:320px;height:320px}
.logo-reveal-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--slate);margin-top:16px}
.logo-reveal-pct{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--gold);margin-top:4px}

/* TIER CARDS */
.tier-outer{background:var(--navy-deep);padding:100px 0}
.tier-inner{max-width:1320px;margin:0 auto;padding:0 48px}
.tier-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:64px;align-items:start}
.tier-card{background:var(--navy-mid);border:1px solid var(--divider);border-radius:16px;padding:32px;position:relative;overflow:hidden;display:flex;flex-direction:column;transition:all .35s ease;text-decoration:none}
.tier-card:hover{border-color:var(--gold-border);transform:translateY(-4px);box-shadow:0 20px 56px rgba(0,0,0,.4)}
.tier-card.featured{border-color:rgba(197,160,89,.5);grid-column:span 1}
.tier-card.featured::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-light))}
.tier-card.wide{grid-column:span 2}
.tier-card-badge{position:absolute;top:20px;right:20px;font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.12em;text-transform:uppercase;padding:3px 10px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:4px;color:var(--gold)}
.tier-card-badge.limited{background:rgba(248,113,113,.1);border-color:rgba(248,113,113,.3);color:var(--red)}
.tier-price{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:700;color:var(--gold);line-height:1;margin-bottom:4px}
.tier-price span{font-size:24px;font-weight:400}
.tier-limit{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:var(--slate-dark);margin-bottom:16px}
.tier-name{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--white);margin-bottom:8px;line-height:1.1}
.tier-hook{font-size:13px;color:var(--slate-light);line-height:1.7;margin-bottom:20px;font-style:italic}
.tier-perks{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:24px;flex:1}
.tier-perk{display:flex;align-items:flex-start;gap:10px;font-size:12px;color:var(--slate-light);line-height:1.6}
.tier-perk::before{content:'→';color:var(--gold);flex-shrink:0}
.tier-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 24px;background:transparent;border:1px solid var(--gold-border);border-radius:8px;color:var(--gold);cursor:pointer;text-decoration:none;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;transition:all .3s;width:100%;margin-top:auto}
.tier-btn:hover{background:var(--gold-dim);border-color:var(--gold)}
.tier-btn.primary-btn{background:linear-gradient(135deg,var(--gold) 0%,#9A7A3A 100%);border-color:transparent;color:var(--navy-deep)}
.tier-btn.primary-btn:hover{transform:translateY(-1px);box-shadow:0 8px 30px rgba(197,160,89,.35)}
.tier-btn.la-btn{background:rgba(197,160,89,.08);border-color:var(--gold);color:var(--gold-light)}

/* MEMORIAL WALL */
.wall-outer{background:var(--navy-deep);padding:80px 0 0}
.wall-inner{max-width:1320px;margin:0 auto;padding:0 48px}
.wall-eyebrow{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);margin-bottom:12px;text-align:center}
.wall-title{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,3vw,44px);font-weight:600;color:var(--white);text-align:center;margin-bottom:8px}
.wall-sub{font-size:13px;color:var(--slate);text-align:center;margin-bottom:40px}
#memorial-wall-canvas{width:100%;height:220px;border-radius:12px;border:1px solid var(--gold-border);display:block}
.wall-legend{display:flex;align-items:center;justify-content:center;gap:24px;margin-top:16px;padding-bottom:80px}
.wall-legend-item{display:flex;align-items:center;gap:8px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;color:var(--slate);text-transform:uppercase}
.wall-legend-brick-gold{width:24px;height:14px;border-radius:2px;background:linear-gradient(135deg,#C5A059,#E8D5A3);border:1px solid #1B263B}
.wall-legend-brick-black{width:24px;height:14px;border-radius:2px;background:linear-gradient(135deg,#1a1a2e,#2d2d4e);border:1px solid #C5A059}

/* LA PORTAL */
.la-portal-outer{background:var(--navy);padding:100px 0}
.la-portal-inner{max-width:1320px;margin:0 auto;padding:0 48px}
.la-portal-card{background:linear-gradient(135deg,var(--navy-mid) 0%,var(--navy) 100%);border:1px solid rgba(197,160,89,.4);border-radius:24px;padding:64px;position:relative;overflow:hidden}
.la-portal-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-light),var(--gold))}
.la-portal-glow{position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(197,160,89,.06) 0%,transparent 70%);top:-100px;right:-100px;pointer-events:none}
.la-portal-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
.la-portal-tag{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.la-portal-tag::before{content:'';width:24px;height:1px;background:var(--gold);opacity:.5}
.la-portal-title{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,4vw,52px);font-weight:600;color:var(--white);line-height:1.1;margin-bottom:20px}
.la-portal-title span{color:var(--gold);font-style:italic}
.la-portal-body{font-size:15px;color:var(--slate-light);line-height:1.9;margin-bottom:36px}
.la-features{display:flex;flex-direction:column;gap:18px}
.la-feature-item{display:flex;gap:16px;padding:20px;background:rgba(17,28,45,.5);border:1px solid var(--divider);border-radius:12px;transition:border-color .3s}
.la-feature-item:hover{border-color:var(--gold-border)}
.la-feature-icon{width:44px;height:44px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--gold);flex-shrink:0}
.la-feature-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--white);margin-bottom:4px}
.la-feature-body{font-size:12px;color:var(--slate);line-height:1.75}
.la-cta-group{display:flex;flex-direction:column;gap:12px}
.la-disclaimer{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.08em;color:var(--slate-dark);margin-top:20px;line-height:1.8}

/* MOVEMENT STATS */
.movement-outer{background:var(--navy-mid);border-top:1px solid var(--divider);border-bottom:1px solid var(--divider);padding:60px 48px}
.movement-inner{max-width:1320px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}
.movement-stat{text-align:center;padding:24px;border-right:1px solid var(--divider)}
.movement-stat:last-child{border-right:none}
.movement-stat-value{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:700;color:var(--gold);line-height:1}
.movement-stat-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--slate);margin-top:8px}

/* FOOTER */
footer{background:var(--navy-deep);border-top:1px solid var(--divider);padding:48px;text-align:center}
.footer-logo{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:16px}
.footer-logo-badge{width:36px;height:36px;background:linear-gradient(135deg,var(--gold) 0%,#9A7A3A 100%);border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:15px;color:var(--navy-deep);text-decoration:none}
.footer-brand-text{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--white)}
.footer-links{display:flex;gap:24px;justify-content:center;margin-bottom:16px;flex-wrap:wrap}
.footer-links a{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--slate-dark);text-decoration:none;transition:color .2s}
.footer-links a:hover{color:var(--gold)}
.footer-copy{font-family:'DM Mono',monospace;font-size:10px;color:var(--slate-dark);letter-spacing:.08em;line-height:1.8}

/* LOADING */
.loading-state{display:flex;align-items:center;justify-content:center;padding:48px;gap:10px}
.loading-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);opacity:.4;animation:ldots 1.2s ease-in-out infinite}
.loading-dot:nth-child(2){animation-delay:.2s}.loading-dot:nth-child(3){animation-delay:.4s}
@keyframes ldots{0%,80%,100%{transform:scale(.8);opacity:.4}40%{transform:scale(1.2);opacity:1}}

/* ANIMATIONS */
@keyframes fade-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.reveal{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease}
.reveal.visible{opacity:1;transform:translateY(0)}

/* RESPONSIVE */
@media(max-width:900px){
  header{padding:0 24px}.header-nav{display:none}.genesis-hero{padding:100px 24px 80px}
  .vault-inner,.tier-inner,.la-portal-inner,.wall-inner{padding:60px 24px}
  .vault-outer,.tier-outer,.la-portal-outer,.logo-reveal-outer{padding:60px 0}
  .gate-cards{grid-template-columns:1fr}.dual-ticker{flex-direction:column}
  .ticker-half:first-child{border-right:none;border-bottom:1px solid var(--divider)}
  .tier-grid{grid-template-columns:1fr}.tier-card.wide{grid-column:span 1}
  .la-portal-grid{grid-template-columns:1fr;gap:40px}.la-portal-card{padding:40px 28px}
  .movement-inner{grid-template-columns:repeat(2,1fr)}.movement-stat:nth-child(2){border-right:none}
  .narrative-band,.movement-outer{padding:60px 24px}
  #memorial-wall-canvas{height:160px}
}
</style>
</head>
<body>

<!-- IDENTITY GATE -->
<div id="identity-gate">
  <div class="gate-grid-bg"></div>
  <div class="gate-glow"></div>
  <div class="gate-content">
    <div class="gate-eyebrow">Arena Genesis — The Founding Moment</div>
    <h1 class="gate-title">Who are you joining the movement as?</h1>
    <p class="gate-subtitle">This page adapts to show you what matters most. Your path shapes what you see.</p>
    <div class="gate-cards">
      <div class="gate-card" onclick="setIdentity('parent')">
        <div class="gate-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
        <div class="gate-card-title">I am a Parent<br>or Carer</div>
        <div class="gate-card-desc">Your child deserves a system that remembers them, sees their progress, and follows them wherever they go. Start here — from £25.</div>
        <div class="gate-card-cta">Support My Child's Future <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      </div>
      <div class="gate-card" onclick="setIdentity('school')">
        <div class="gate-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
        <div class="gate-card-title">I Work in Education<br>or AP Provision</div>
        <div class="gate-card-desc">You see the gaps every day. You know what happens when the records don't follow the child. This is how you become part of closing that gap — for good.</div>
        <div class="gate-card-cta">Shape the Infrastructure <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      </div>
      <div class="gate-card" onclick="setIdentity('la')">
        <div class="gate-card-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M9 8h1m-1 4h1m-1 4h1m4-8h1m-1 4h1m-1 4h1M5 21V7l7-4 7 4v14"/></svg></div>
        <div class="gate-card-title">I Represent a Local<br>Authority or Trust</div>
        <div class="gate-card-desc">The DfE SEND whitepaper is already written. The February 2026 standards are incoming. Five LA positions are open in Genesis 5. Is yours one of them?</div>
        <div class="gate-card-cta">Enter the Authority Portal <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></div>
      </div>
    </div>
  </div>
</div>

<!-- HEADER -->
<header>
  <div class="header-left">
    <a href="index.html" class="logo-badge">A</a>
    <div>
      <div class="header-brand-name">The Arena</div>
      <div class="header-brand-sub">Genesis Campaign</div>
    </div>
  </div>
  <nav><ul class="header-nav">
    <li><a onclick="ss('vault-section')">The Vault</a></li>
    <li><a onclick="ss('tier-section')">Founding Tiers</a></li>
    <li><a onclick="ss('la-section')">LA Portal</a></li>
    <li><a href="index.html">← Main Site</a></li>
  </ul></nav>
  <div class="header-right">
    <div class="header-status"><div class="status-dot"></div><span id="hdr-label">Genesis — Live</span></div>
  </div>
</header>

<!-- HERO -->
<div class="genesis-hero">
  <div class="hero-grid"></div><div class="hero-glow"></div>
  <div class="genesis-badge"><div class="genesis-badge-dot"></div>Campaign Live — Kickstarter</div>
  <div class="hero-eyebrow">Arena Genesis</div>
  <h1 class="hero-title">The <span>Founding</span><br>Moment</h1>
  <p class="hero-subtitle" id="hero-sub">Clinical infrastructure for UK Alternative Provision &amp; SEND</p>
  <div class="hero-divider"></div>
  <div class="dual-ticker">
    <div class="ticker-half">
      <div class="ticker-half-label">Raised on Kickstarter</div>
      <div class="ticker-half-value" id="tick-fund">£0</div>
      <div class="ticker-half-sub">of campaign target</div>
      <div class="ticker-source">Live · Kickstarter Matrix</div>
    </div>
    <div class="ticker-half">
      <div class="ticker-half-label">Secured Pilot Partners</div>
      <div class="ticker-half-value" id="tick-la">0</div>
      <div class="ticker-half-sub">Local Authorities &amp; Trusts</div>
      <div class="ticker-source">Genesis 5 Programme</div>
    </div>
  </div>
  <div class="hero-cta-group" id="hero-ctas"></div>
  <div class="hero-scroll" onclick="ss('vault-section')"><span>Discover</span><div class="hero-scroll-line"></div></div>
</div>

<div class="section-divider"></div>

<!-- NARRATIVE BAND -->
<div class="narrative-band">
  <div class="narrative-band-inner">
    <div class="narrative-band-label">The Movement</div>
    <p class="narrative-band-text" id="narrative-txt">
      <strong>One in five children</strong> in Alternative Provision has no coherent evidence record. <strong>Arena changes that.</strong> This campaign doesn't just fund software — it funds the infrastructure for a systemic reform that is already overdue.
    </p>
  </div>
</div>

<!-- VAULT -->
<div class="vault-outer" id="vault-section">
  <div class="vault-inner">
    <p class="section-eyebrow reveal">The Evidence Vault — Unlocking as We Build</p>
    <h2 class="section-title reveal">The vault opens<br>at <span style="color:var(--gold)">10% increments.</span></h2>
    <p class="section-lead reveal">Every funding milestone unlocks a new layer of Arena's clinical evidence case. Watch the vault build as the movement grows.</p>
    <div class="vault-progress-track reveal">
      <div class="vault-track-line"></div>
      <div class="vault-track-fill" id="vault-fill"></div>
      <div class="vault-nodes" id="vault-nodes"></div>
    </div>
    <div class="vault-panels" id="vault-panels"><div class="loading-state"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div></div>
  </div>
</div>

<div class="section-divider"></div>

<!-- LOGO REVEAL -->
<div class="logo-reveal-outer" id="logo-section">
  <div class="logo-reveal-inner">
    <p class="section-eyebrow reveal">The Arena Identity — Revealed as You Build It</p>
    <h2 class="section-title reveal" style="text-align:center">Your backing<br>builds <span style="color:var(--gold)">the Arena.</span></h2>
    <p class="section-lead reveal" style="margin:0 auto 48px;text-align:center">Every tier backed, every backer added — another layer of the Arena identity revealed. At 100% funded, the full crest is yours.</p>
    <div class="logo-reveal-canvas-wrap reveal">
      <canvas id="logo-reveal-canvas" width="320" height="320"></canvas>
    </div>
    <div class="logo-reveal-label">Arena Identity — Funding Reveal</div>
    <div class="logo-reveal-pct" id="logo-pct">0% Revealed</div>
  </div>
</div>

<div class="section-divider"></div>

<!-- MOVEMENT STATS -->
<div class="movement-outer">
  <div class="movement-inner">
    <div class="movement-stat reveal"><div class="movement-stat-value">152</div><div class="movement-stat-label">Target Local Authorities</div></div>
    <div class="movement-stat reveal"><div class="movement-stat-value">1 in 5</div><div class="movement-stat-label">Children Without Evidence Record</div></div>
    <div class="movement-stat reveal"><div class="movement-stat-value">v7</div><div class="movement-stat-label">Infrastructure Architecture</div></div>
    <div class="movement-stat reveal"><div class="movement-stat-value">2026</div><div class="movement-stat-label">Statutory SEND Audit Deadline</div></div>
  </div>
</div>

<!-- TIERS -->
<div class="tier-outer" id="tier-section">
  <div class="tier-inner">
    <p class="section-eyebrow reveal" id="tier-eyebrow">Founding Tiers — Kickstarter</p>
    <h2 class="section-title reveal" id="tier-heading">Choose your place<br>in the movement.</h2>
    <p class="section-lead reveal" id="tier-lead">Every tier is a permanent record of where you stood when this was being built.</p>
    <div class="tier-grid" id="tier-grid"><div class="loading-state"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div></div>
  </div>
</div>

<div class="section-divider"></div>

<!-- MEMORIAL WALL PREVIEW -->
<div class="wall-outer" id="wall-section">
  <div class="wall-inner">
    <p class="wall-eyebrow reveal">The Memorial Wall — Founders Archive</p>
    <h2 class="wall-title reveal">Every backer leaves<br>a permanent mark.</h2>
    <p class="wall-sub reveal">When the campaign ends, this wall is sealed. Every brick is permanent. Every name is forever.</p>
    <canvas id="memorial-wall-canvas"></canvas>
    <div class="wall-legend">
      <div class="wall-legend-item"><div class="wall-legend-brick-gold"></div>Gold brick — Founding tier</div>
      <div class="wall-legend-item"><div class="wall-legend-brick-black"></div>Black brick — Supporter tier</div>
    </div>
  </div>
</div>

<!-- LA PORTAL -->
<div class="la-portal-outer" id="la-section">
  <div class="la-portal-inner">
    <div class="la-portal-card reveal">
      <div class="la-portal-glow"></div>
      <div class="la-portal-grid">
        <div>
          <div class="la-portal-tag">Genesis 5 — Authority Programme</div>
          <h2 class="la-portal-title">The DfE whitepaper<br>is already <span>written.</span></h2>
          <p class="la-portal-body">The SEND Review whitepaper is not a consultation — it is a direction of travel. The February 2026 statutory standards will require evidence that most AP providers cannot currently produce. Arena is the infrastructure that makes compliance structural, not reactive.<br><br>Five Local Authority positions are available in Genesis 5. Each is a direct, structured partnership — not a Kickstarter pledge. You are not buying a product. You are shaping a national platform during the window in which that is still possible.</p>
          <div class="la-cta-group">
            <a href="tier5.html" class="btn-primary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M9 8h1m-1 4h1m-1 4h1m4-8h1m-1 4h1m-1 4h1M5 21V7l7-4 7 4v14"/></svg>View Authority Partner Details</a>
            <a href="mailto:j.baguley@thearenaHub.co.uk?subject=Genesis%205%20Authority%20Enquiry" class="btn-secondary">Request a Direct Briefing</a>
          </div>
          <p class="la-disclaimer">Genesis 5 is a closed programme. Five positions. Structured deployment Q2 2026. Weekly progress updates. Monthly suggestion box. Optional monthly Teams session with the founder. This is an infrastructure conversation, not a sales call.</p>
        </div>
        <div class="la-features">
          <div class="la-feature-item reveal"><div class="la-feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div><div class="la-feature-title">DfE SEND Whitepaper Alignment</div><div class="la-feature-body">Arena's evidence architecture is built directly against the direction of the SEND Review. Early adoption means you arrive at the 2026 deadline already compliant — not scrambling to build evidence retrospectively.</div></div></div>
          <div class="la-feature-item reveal"><div class="la-feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div><div class="la-feature-title">Shape the Platform at Source</div><div class="la-feature-body">As a Genesis 5 partner, your monthly input directly influences Arena's development roadmap. You are not a customer being consulted — you are a co-architect of the national standard.</div></div></div>
          <div class="la-feature-item reveal"><div class="la-feature-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div><div class="la-feature-title">Force Multiplier Economics</div><div class="la-feature-body">One LA contract activates 5–15 Arena deployments across commissioned AP provision. The investment at Genesis 5 level funds infrastructure that protects your entire portfolio — not a single school.</div></div></div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-logo"><a href="index.html" class="footer-logo-badge">A</a><div class="footer-brand-text">The Arena Hub Ltd</div></div>
  <div class="footer-links">
    <a href="index.html">Main Site</a><a href="tier1.html">Supporter</a><a href="tier2.html">Founding Supporter</a>
    <a href="tier3.html">Future Partner</a><a href="tier4.html">Pilot Partner</a><a href="tier5.html">Authority Partner</a>
    <a href="mailto:j.baguley@thearenaHub.co.uk">Contact</a>
  </div>
  <div class="footer-copy">&copy; 2026 The Arena Hub Ltd &mdash; Evidence Integrity Infrastructure &middot; Arena Genesis Campaign</div>
</footer>

<script>
const SHEET_ID = '1uzdcww7KhRSoW5Vh3oM1sYbqrAMAI2VBmEWgfumrntE';
const GID = {matrix:'1500722618', tiers:'1373714631', backers:'0'}; // backers GID will be set after running GAS
let identity = sessionStorage.getItem('arenaId') || null;
const CFG = {ksUrl:'https://www.kickstarter.com/',funding:0,target:50000,laPartners:0,pct:0};

const COPY = {
  parent:{
    sub:'Your child\'s story deserves to be heard — and remembered.',
    narrative:'<strong>When your child moves schools, their story shouldn\'t disappear.</strong> Every achievement, every welfare note, every clinical observation — Arena keeps it all together, for the child who needs it most. <strong>Be part of building the system that finally sees them.</strong>',
    tierEyebrow:'Support Tiers — Every Level Matters',
    tierHeading:'Back the child,<br>not just the system.',
    tierLead:'Choose your level of support. Every tier places your name permanently in the Founders Archive — the record of those who stood up when it mattered.'
  },
  school:{
    sub:'You see the gaps every day. This is how you close them permanently.',
    narrative:'<strong>You know what happens when the evidence trail breaks.</strong> A child moves provision and their story starts again from scratch. A welfare event goes undocumented. A tribunal looms and the records aren\'t there. Arena is built for people like you — by people who understand exactly what you face. <strong>Founding Future Partners shape what Arena becomes.</strong>',
    tierEyebrow:'Founding Tiers — Educators & Professionals',
    tierHeading:'Become part of<br>building the solution.',
    tierLead:'From supporter to pilot partner — choose the level that matches your commitment to getting this infrastructure built right.'
  },
  la:{
    sub:'The DfE SEND whitepaper is written. The 2026 deadline is set. Five positions remain.',
    narrative:'<strong>The February 2026 SEND statutory standards are not advisory.</strong> Every Local Authority with commissioned AP provision will need to demonstrate an evidence infrastructure that most currently cannot produce. Arena\'s Genesis 5 programme gives five LAs the opportunity to <strong>build that infrastructure now — and shape how it works nationally.</strong>',
    tierEyebrow:'Tiers — Public Campaign Running in Parallel',
    tierHeading:'Your route is direct.<br>Not through Kickstarter.',
    tierLead:'The Genesis 5 pathway is a structured LA partnership. The tiers below are the public campaign running in parallel — your pathway is the portal below.'
  }
};

const TIERS_FALLBACK = [
  {name:'Supporter',             price:'25',   limit:'Open', type:'parent', page:'tier1.html', hook:"You believe every child's story deserves to be told. This is where it starts.", perks:['Digital Founders Certificate','Your name on the Memorial Wall','Monthly campaign updates — watch the movement grow'], featured:false},
  {name:'Founding Supporter',    price:'100',  limit:'500',  type:'parent', page:'tier2.html', hook:'You hold a key to the future. A real one — 3D printed, personalised, permanent.', perks:['Everything in Supporter','3D printed Arena Key — black finish, gold engraving, your unique number','Your number is yours forever: Arena Fan #1, #2, #3…','Priority campaign updates'], featured:true},
  {name:'Founding Future Partner',price:'750', limit:'50',   type:'school', page:'tier3.html', hook:'You work in this system. You know what\'s broken. Your name goes on the desk trophy.', perks:['Everything in Founding Supporter','3D printed Arena desk trophy — your name, your supporter number','Written in the golden book of the Arena crest — permanently','Named recognition in Arena v7 documentation','Strategic briefing access (digital)'], featured:false},
  {name:'Pilot Partner',          price:'1500',limit:'5',    type:'school', page:'tier4.html', hook:'Only 5 positions. 18 months of Arena v1. You shape the platform that protects children nationally.', perks:['Everything in Founding Future Partner','18-month Arena v1 licence for your school or provision','Trophy engraved: "Arena #1 Founder Partner"','Weekly newsletter: platform updates and peer pilot feedback','Direct input into the development roadmap'], featured:false, limited:true},
  {name:'Authority Partner',      price:'6500',limit:'5',    type:'la',     page:'tier5.html', hook:'The DfE whitepaper is written. Five LA positions. Is yours one of them?', perks:['3D printed Arena Key — "Arena & [Your Name], The Key to the Future"','3D printed desk trophy — "Arena & [Your Name], For the Future of Education"','Weekly platform updates','Monthly suggestion box submission — direct input to development','Optional monthly 1-hour Teams call with the founder','Named co-acknowledgement in statutory submission materials'], featured:false, limited:true},
];

function setIdentity(t){
  identity=t; sessionStorage.setItem('arenaId',t);
  document.getElementById('identity-gate').classList.add('hidden');
  document.body.style.overflow='';
  applyAdaptive(t); init();
}

function applyAdaptive(t){
  const c=COPY[t]||COPY.parent;
  document.getElementById('hero-sub').textContent=c.sub;
  document.getElementById('narrative-txt').innerHTML=c.narrative;
  document.getElementById('tier-eyebrow').textContent=c.tierEyebrow;
  document.getElementById('tier-heading').innerHTML=c.tierHeading;
  document.getElementById('tier-lead').textContent=c.tierLead;
  const labels={parent:'Parent & Carer Path',school:'Educator Path',la:'Authority Portal'};
  document.getElementById('hdr-label').textContent=labels[t]||'Genesis';
  const ctaMap={
    parent:`<a href="#tier-section" onclick="ss('tier-section');return false" class="btn-primary">View Supporter Tiers</a><a href="tier2.html" class="btn-secondary">The Arena Key →</a>`,
    school:`<a href="tier3.html" class="btn-primary">Founding Future Partner</a><a href="tier4.html" class="btn-secondary">Pilot Partner (5 only)</a>`,
    la:`<a href="tier5.html" class="btn-primary">Authority Partner Details</a><a href="mailto:j.baguley@thearenaHub.co.uk?subject=Genesis%205" class="btn-secondary">Request Briefing</a>`
  };
  document.getElementById('hero-ctas').innerHTML=ctaMap[t]||ctaMap.parent;
}

async function fetchSheet(gid){
  try{
    const r=await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}`);
    const txt=await r.text();
    const m=txt.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
    return m?JSON.parse(m[1]):null;
  }catch(e){return null;}
}
function toRows(d){
  if(!d?.table?.cols)return[];
  const h=d.table.cols.map(c=>(c.label||c.id||'').trim());
  return(d.table.rows||[]).map(r=>{const o={};(r.c||[]).forEach((c,i)=>{o[h[i]]=c?.v??c?.f??'';});return o;}).filter(r=>Object.values(r).some(v=>v!==''));
}

function animTick(el,target,pre,dur){
  const s=Date.now();
  (function t(){const p=Math.min((Date.now()-s)/dur,1),v=Math.round(target*(1-Math.pow(1-p,3)));
  el.textContent=pre+v.toLocaleString('en-GB');if(p<1)requestAnimationFrame(t);})();
}

function buildVault(rows,pct){
  const nEl=document.getElementById('vault-nodes');
  const fEl=document.getElementById('vault-fill');
  nEl.innerHTML='';
  [10,20,30,40,50,60,70,80,90,100].forEach(t=>{
    const ul=pct>=t,ac=!ul&&pct>=(t-10);
    const d=document.createElement('div');
    d.className=`vault-node${ul?' unlocked':''}${ac?' active':''}`;
    d.innerHTML=`<div class="vault-node-dot">${ul?'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>':t+'%'}</div><div class="vault-node-label">${t===100?'Full':t+'%'}</div>`;
    nEl.appendChild(d);
  });
  setTimeout(()=>{fEl.style.width=Math.min(pct,100)+'%';},300);

  const fallbackPanels=[
    {t:10,title:'The Problem Revealed',body:'Evidence fragmentation is failing 1 in 5 children in Alternative Provision. At 10% funded, we open the first chapter of Arena\'s case for reform.'},
    {t:20,title:'The Human Cost',body:'Behind every missing record is a child whose story was lost in transition. At 20% funded, we share what this means in practice — for children, families and educators.'},
    {t:30,title:'The Tribunal Risk',body:'Every AP placement without documented evidence is a legal exposure. At 30% funded, we show exactly what Arena protects against — and how.'},
    {t:40,title:'The 3-Pillar Architecture',body:'Performance Centre, Welfare Suite, Kit Room — the three sovereign layers revealed at 40% funded.'},
    {t:50,title:'Inside the Performance Centre',body:'How Arena tracks and preserves every child\'s attainment across placements and transitions. Unlocked at 50%.'},
    {t:60,title:'Inside the Welfare Suite',body:'The clinical-educational link that has always been missing. Unlocked at 60%.'},
    {t:70,title:'AI Explainability Layer',body:'Arena v7.0.0\'s audit-ready AI tools — every automated decision documented and defensible. Unlocked at 70%.'},
    {t:80,title:'2026 Statutory Audit Guide',body:'The February 2026 SEND standards demand evidence most providers don\'t have. This guide shows what Arena produces — automatically. Unlocked at 80%.'},
    {t:90,title:'The National Deployment Plan',body:'152 Local Authorities. The full Arena rollout strategy, unlocked at 90% for all backers.'},
    {t:100,title:'Full Archive — All Backers',body:'Complete access: all briefings, the Audit Guide, AI papers, and your permanent place in the Founders Archive. The vault is open.'},
  ];
  const vaultRows=rows.filter(r=>r.Asset_ID&&String(r.Asset_ID).startsWith('VAULT_'));
  const panels=vaultRows.length?vaultRows.map(r=>({t:parseInt(r.Unlock_Threshold)||10,title:r.Heading_Copy||'',body:r.Body_Copy||''})):fallbackPanels;
  document.getElementById('vault-panels').innerHTML=panels.map(p=>{
    const ul=pct>=p.t;
    return`<div class="vault-panel${ul?' unlocked':' locked'}">
      <div class="vault-panel-header"><div class="vault-panel-left">
        <div class="vault-panel-threshold">${p.t}%</div>
        <div><div class="vault-panel-title">${p.title}</div><div class="vault-panel-subtitle">${ul?'Unlocked':'Unlocks at '+p.t+'% funded'}</div></div>
      </div>${ul?'<svg class="vault-unlocked-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>':'<svg class="vault-lock-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'}</div>
      ${ul&&p.body?`<div class="vault-panel-body"><p class="vault-panel-copy">${p.body}</p></div>`:''}
    </div>`;
  }).join('');
}

function buildTiers(rows){
  const g=document.getElementById('tier-grid');
  const tiers=rows.length?rows.map(r=>({
    name:r.Tier_Name,price:String(r.Price_Point||'').replace(/[^0-9,]/g,''),
    limit:r.Limit||'Open',type:String(r.User_Type||'').toLowerCase(),
    hook:r.Primary_Hook||'',perks:[r.Primary_Hook||''],limited:/5|10|20|50/.test(String(r.Limit||''))
  })):TIERS_FALLBACK;

  const filtered=tiers.filter(t=>{
    if(identity==='parent')return t.type==='parent'||t.type==='donor';
    if(identity==='school')return t.type==='school'||t.type==='patron';
    return true;
  });

  const pageMap={'Supporter':'tier1.html','Founding Supporter':'tier2.html','Founding Future Partner':'tier3.html','Pilot Partner':'tier4.html','Authority Partner':'tier5.html'};

  // Use fallback for correct perks/page links if sheet data used
  const display = rows.length ? filtered.map(t=>{
    const fb=TIERS_FALLBACK.find(f=>f.name===t.name)||TIERS_FALLBACK[0];
    return{...fb,...t,perks:fb.perks,page:fb.page||pageMap[t.name]||'genesis.html'};
  }) : TIERS_FALLBACK.filter(t=>{
    if(identity==='parent')return t.type==='parent';
    if(identity==='school')return t.type==='school'||t.type==='parent';
    return true;
  });

  g.innerHTML=display.map((t,i)=>{
    const feat=i===1&&identity!=='la';
    const badge=t.limited?'Limited':'';
    return`<a href="${t.page}" class="tier-card${feat?' featured':''}">
      ${badge?`<div class="tier-card-badge${t.limited?' limited':''}">${badge} — ${t.limit} only</div>`:''}
      <div class="tier-price"><span>£</span>${t.price}</div>
      <div class="tier-limit">${t.limit==='Open'?'Open — unlimited':'Limited to '+t.limit}</div>
      <div class="tier-name">${t.name}</div>
      <div class="tier-hook">${t.hook}</div>
      <ul class="tier-perks">${t.perks.map(p=>`<li class="tier-perk">${p}</li>`).join('')}</ul>
      <div class="tier-btn${feat?' primary-btn':''}">Find Out More →</div>
    </a>`;
  }).join('');
}

// LOGO REVEAL (canvas grid effect)
function drawLogoReveal(pct){
  const canvas=document.getElementById('logo-reveal-canvas');
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#1B263B';ctx.fillRect(0,0,W,H);

  const img=new Image();
  img.crossOrigin='anonymous';
  img.onload=()=>{
    ctx.drawImage(img,0,0,W,H);
    // Grid overlay — cells disappear as pct increases
    const GRID=16;
    const cw=W/GRID,ch=H/GRID;
    const total=GRID*GRID;
    const hidden=Math.floor(total*(pct/100));
    // Create deterministic shuffle using seeded indices
    const indices=[];for(let i=0;i<total;i++)indices.push(i);
    // Simple seeded shuffle
    for(let i=total-1;i>0;i--){const j=Math.floor((Math.sin(i*9301+49297)*total+total)%total);[indices[i],indices[j]]=[indices[j],indices[i]];}
    ctx.fillStyle='#111C2D';
    indices.slice(hidden).forEach(idx=>{
      const x=(idx%GRID)*cw,y=Math.floor(idx/GRID)*ch;
      ctx.fillRect(x+1,y+1,cw-2,ch-2);
    });
  };
  img.onerror=()=>{
    // Placeholder when logo.png not yet uploaded
    ctx.fillStyle='#1B263B';ctx.fillRect(0,0,W,H);
    const grad=ctx.createRadialGradient(W/2,H/2,20,W/2,H/2,W/2);
    grad.addColorStop(0,'rgba(197,160,89,0.3)');grad.addColorStop(1,'rgba(197,160,89,0.0)');
    ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(197,160,89,0.6)';ctx.font='bold 14px DM Mono, monospace';
    ctx.textAlign='center';ctx.fillText('ARENA LOGO',W/2,H/2-10);
    ctx.font='11px DM Mono, monospace';ctx.fillStyle='rgba(139,156,181,0.8)';
    ctx.fillText('Upload arena-logo.png to reveal',W/2,H/2+12);
    ctx.fillText(Math.round(pct)+'% funded',W/2,H/2+32);
    // Draw partial reveal border
    ctx.strokeStyle=`rgba(197,160,89,${pct/100})`;ctx.lineWidth=3;
    ctx.strokeRect(4,4,W-8,H-8);
  };
  img.src='arena-logo.png';
  document.getElementById('logo-pct').textContent=Math.round(pct)+'% Revealed';
}

// MEMORIAL WALL
function drawWall(backers,pct){
  const canvas=document.getElementById('memorial-wall-canvas');
  const W=canvas.offsetWidth||1200;
  canvas.width=W;canvas.height=parseInt(canvas.style.height)||220;
  const H=canvas.height;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#0D1520';ctx.fillRect(0,0,W,H);

  const BRICK_H=[0,22,32,44,58,80]; // height by tier 1-5
  const GAP=3;
  const bricks=[];

  // Build brick list from backers
  (backers||[]).forEach(b=>{
    const tier=parseInt(b.Tier_Level)||1;
    const name=b.Display_Name||b.Real_Name||'Anonymous';
    const w=Math.max(60, name.length*10 + 20 + (tier-1)*20);
    bricks.push({name,tier,w,h:BRICK_H[Math.min(tier,5)]});
  });
  // Add placeholder bricks for remaining wall capacity
  const totalW=bricks.reduce((s,b)=>s+b.w+GAP,0);
  if(totalW<W*2){
    for(let i=0;i<40;i++) bricks.push({name:'',tier:0,w:80,h:22,placeholder:true});
  }

  // Draw bricks row by row from bottom
  let x=GAP,y=H-BRICK_H[1]-GAP,rowH=BRICK_H[1];
  const maxReveal=Math.floor(bricks.length*(pct/100));

  bricks.forEach((b,i)=>{
    if(b.h>rowH)rowH=b.h;
    if(x+b.w+GAP>W){x=GAP;y=y-rowH-GAP;rowH=b.h;}
    if(y<0)return;

    const isGold=i%2===0;
    if(b.placeholder){
      ctx.fillStyle='rgba(30,42,68,0.5)';
      ctx.fillRect(x,y+b.h-22,b.w,22);
      ctx.strokeStyle='rgba(197,160,89,0.1)';ctx.lineWidth=1;
      ctx.strokeRect(x,y+b.h-22,b.w,22);
    } else {
      // Metallic gradient
      const grad=ctx.createLinearGradient(x,y,x,y+b.h);
      if(isGold){
        grad.addColorStop(0,'#E8D5A3');grad.addColorStop(0.3,'#C5A059');grad.addColorStop(0.7,'#9A7A3A');grad.addColorStop(1,'#C5A059');
        ctx.fillStyle=grad;ctx.fillRect(x,y+b.h-22,b.w,22);
        ctx.strokeStyle='#1B263B';ctx.lineWidth=1.5;ctx.strokeRect(x,y+b.h-22,b.w,22);
        // Text
        ctx.fillStyle='#111C2D';ctx.font=`bold ${Math.min(11,10+b.tier)}px 'Outfit',sans-serif`;
        ctx.textAlign='center';ctx.fillText(b.name,x+b.w/2,y+b.h-22+14,b.w-8);
      } else {
        grad.addColorStop(0,'#2d2d4e');grad.addColorStop(0.3,'#1a1a2e');grad.addColorStop(0.7,'#0d0d1f');grad.addColorStop(1,'#1a1a2e');
        ctx.fillStyle=grad;ctx.fillRect(x,y+b.h-22,b.w,22);
        ctx.strokeStyle='#C5A059';ctx.lineWidth=1.5;ctx.strokeRect(x,y+b.h-22,b.w,22);
        ctx.fillStyle='#C5A059';ctx.font=`bold ${Math.min(11,10+b.tier)}px 'Outfit',sans-serif`;
        ctx.textAlign='center';ctx.fillText(b.name,x+b.w/2,y+b.h-22+14,b.w-8);
      }
    }
    x+=b.w+GAP;
  });

  // Foundation label
  ctx.fillStyle='rgba(197,160,89,0.15)';ctx.font='10px DM Mono, monospace';ctx.textAlign='left';
  ctx.fillText('ARENA FOUNDERS MEMORIAL WALL — '+Math.round(pct)+'% FUNDED',8,H-4);
}

function initReveal(){
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.08,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}
function ss(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'});}

async function init(){
  if(CFG.funding>0)animTick(document.getElementById('tick-fund'),CFG.funding,'£',1800);
  if(CFG.laPartners>0)animTick(document.getElementById('tick-la'),CFG.laPartners,'',1400);

  const [matrixData,tierData]=await Promise.all([fetchSheet(GID.matrix),fetchSheet(GID.tiers)]);
  const mRows=toRows(matrixData);const tRows=toRows(tierData);

  // Extract config
  const sv=(id,field)=>{const r=mRows.find(x=>x.Asset_ID===id);return r?String(r[field]||r.Body_Copy||''):''};
  const nv=(id)=>parseFloat(sv(id,'Heading_Copy').replace(/[^0-9.]/g,''))||0;
  CFG.funding=nv('STAT_FUNDING')||CFG.funding;
  CFG.laPartners=nv('STAT_LA_PARTNERS')||CFG.laPartners;
  CFG.target=nv('STAT_TARGET')||CFG.target;
  const ku=sv('STAT_KS_URL','Heading_Copy');if(ku&&ku.startsWith('http'))CFG.ksUrl=ku;
  CFG.pct=CFG.target>0?Math.round((CFG.funding/CFG.target)*100):0;

  animTick(document.getElementById('tick-fund'),CFG.funding,'£',1800);
  animTick(document.getElementById('tick-la'),CFG.laPartners,'',1400);

  applyAdaptive(identity||'parent');
  buildVault(mRows,CFG.pct);
  buildTiers(tRows);
  drawLogoReveal(CFG.pct);
  drawWall([],CFG.pct); // backers fetched separately if GID set
  initReveal();
}

document.addEventListener('DOMContentLoaded',()=>{
  if(identity){
    document.getElementById('identity-gate').classList.add('hidden');
    document.body.style.overflow='';
    applyAdaptive(identity);init();
  } else {
    document.body.style.overflow='hidden';
  }
});
</script>
</body>
</html>