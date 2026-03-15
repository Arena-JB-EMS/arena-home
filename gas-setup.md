Arena Genesis — Google Apps Script Setup
What This Does
Run this script once inside your Kickstarter Matrix Google Sheet to set up the full Arena workspace. It creates and formats three tabs, prefills all known data, and leaves you a clear instruction trail for what to fill in manually.
How to Run

Open your Kickstarter Matrix spreadsheet (ID: 1uzdcww7KhRSoW5Vh3oM1sYbqrAMAI2VBmEWgfumrntE)
Go to Extensions → Apps Script
Delete any existing code in the editor
Paste the full script below
Click Run → select setupArenaWorkspace
Grant permissions when prompted
You'll see a confirmation popup when it's done


After Running — What to Fill In Manually
WhatWhereWhenYour live Kickstarter URLSTAT_KS_URL row, column EWhen campaign goes liveCurrent £ raisedSTAT_FUNDING row, column EUpdate regularly during campaignNumber of LA partnersSTAT_LA_PARTNERS row, column EAs partners confirmBacker namesBackers tab, one row per backerAs pledges come inVideo filesUpload to GitHub matching filenames in matrixAs each print milestone is recorded
Backers Tab — Tier Levels
NumberTier Name1Supporter2Founding Supporter3Founding Future Partner4Pilot Partner5Authority Partner
Getting the Backers Tab GID
After running the script, click the Backers tab at the bottom of the sheet. Look at the URL — the number after gid= is your Backers GID. Update this line in every HTML file:
javascriptconst GID = { matrix: '1500722618', backers: '0' }; // replace '0' with your Backers GID

The Full Script
javascript/**
 * ARENA GENESIS — SOVEREIGN WORKSPACE SETUP SCRIPT
 * Run this once in Google Apps Script (Extensions > Apps Script)
 * It will format all tabs and prefill all known data.
 * You only need to fill in: video filenames, backer names as they come in,
 * and the live funding/LA partner counts.
 */

function setupArenaWorkspace() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var NAV  = '#1B263B';
  var GOLD = '#C5A059';
  var WHITE = '#F0F4F8';

  function styleHeader(range) {
    range.setBackground(NAV).setFontColor(GOLD).setFontWeight('bold').setFontSize(10);
  }

  // ═══════════════════════════════════════════════
  // 1. KICKSTARTER_MATRIX
  // ═══════════════════════════════════════════════
  var matrix = ss.getSheetByName('Kickstarter_Matrix') || ss.insertSheet('Kickstarter_Matrix');
  matrix.clear();
  matrix.setColumnWidths(1, 7, 160);
  matrix.setColumnWidth(5, 260);
  matrix.setColumnWidth(6, 380);

  var mHeaders = [['Asset_ID','Tier_Visibility','Section','Video_Filename','Heading_Copy','Body_Copy','Unlock_Threshold']];
  matrix.getRange(1,1,1,7).setValues(mHeaders);
  styleHeader(matrix.getRange(1,1,1,7));

  // ── STAT CONFIG ROWS (update these to drive live tickers) ──
  var configRows = [
    ['STAT_FUNDING',    'Config','Config','—','0',        'Update this cell with £ total raised on Kickstarter', '—'],
    ['STAT_LA_PARTNERS','Config','Config','—','0',        'Update this cell with number of secured LA/Trust partners','—'],
    ['STAT_TARGET',     'Config','Config','—','50000',    'Campaign funding target in £','—'],
    ['STAT_KS_URL',     'Config','Config','—','https://www.kickstarter.com/YOUR-CAMPAIGN-URL-HERE','Replace with your live Kickstarter URL','—'],
  ];
  matrix.getRange(2,1,configRows.length,7).setValues(configRows).setBackground('#0D1520').setFontColor('#8B9CB5');

  // ── KEY 3D PRINT VIDEO ROWS (cumulative files — each file shows build from 0% to that point) ──
  var keyRows = [
    ['VID_KEY_10', 'All','Key_Print','key_10pct.mp4',  'The Key Takes Shape — 10%',  'The first layer of your Arena Key is being printed. At 10% funded, the build begins.', '10%'],
    ['VID_KEY_20', 'All','Key_Print','key_20pct.mp4',  'The Key Takes Shape — 20%',  'The Arena Key grows. Every backer at this stage has their name queued for engraving.', '20%'],
    ['VID_KEY_30', 'All','Key_Print','key_30pct.mp4',  'The Key Takes Shape — 30%',  'Thirty percent of the way there. The key is forming — black finish, gold detail.','30%'],
    ['VID_KEY_40', 'All','Key_Print','key_40pct.mp4',  'The Key Takes Shape — 40%',  'The build continues. Founding Supporter keys are being prepared for engraving.','40%'],
    ['VID_KEY_50', 'All','Key_Print','key_50pct.mp4',  'Halfway — The Key Emerges',  'Halfway funded. The Arena Key is half-built. Your unique number is locked in.','50%'],
    ['VID_KEY_60', 'All','Key_Print','key_60pct.mp4',  'The Key Takes Shape — 60%',  'Sixty percent. The key is taking its final form — every detail being laid down.','60%'],
    ['VID_KEY_70', 'All','Key_Print','key_70pct.mp4',  'The Key Takes Shape — 70%',  'Seventy percent. The structure is almost complete. Gold writing next.','70%'],
    ['VID_KEY_80', 'All','Key_Print','key_80pct.mp4',  'The Key — Nearly Complete',  'Almost there. The Arena Key is nearly finished. Your name is coming.','80%'],
    ['VID_KEY_90', 'All','Key_Print','key_90pct.mp4',  'The Key — Final Stage',      'Final printing stage. Keys will be dispatched to all Founding Supporters at 100%.','90%'],
    ['VID_KEY_100','All','Key_Print','key_100pct.mp4', 'The Arena Key — Complete',   'The Arena Key is finished. Black finish. Gold engraving. Your number is unique. Forever.','100%'],
  ];
  var kStart = 2 + configRows.length + 1;
  matrix.getRange(kStart, 1, keyRows.length, 7).setValues(keyRows).setBackground('#1B263B').setFontColor(WHITE);

  // ── TROPHY 3D PRINT VIDEO ROWS (25/50/75/100 only) ──
  var trophyRows = [
    ['VID_TROPHY_25', 'Patron','Trophy_Print','trophy_25pct.mp4', 'Your Trophy — First Quarter',  'The Arena desk trophy is taking shape. The base layer is down. Your name is being prepared.','25%'],
    ['VID_TROPHY_50', 'Patron','Trophy_Print','trophy_50pct.mp4', 'Your Trophy — Halfway',        'Halfway through the print. The Arena shield is forming. The golden book is next.','50%'],
    ['VID_TROPHY_75', 'Patron','Trophy_Print','trophy_75pct.mp4', 'Your Trophy — Three Quarters', 'Three quarters complete. The detail work begins — your name, your supporter number, etched permanently.','75%'],
    ['VID_TROPHY_100','Patron','Trophy_Print','trophy_100pct.mp4','Your Trophy — Complete',       'The Arena desk trophy is finished. Your name. Your number. Permanent. Ready to dispatch.','100%'],
  ];
  var tStart = kStart + keyRows.length + 1;
  matrix.getRange(tStart, 1, trophyRows.length, 7).setValues(trophyRows).setBackground('#243450').setFontColor(WHITE);

  // ── VAULT CONTENT ROWS (what unlocks at each funding % on genesis.html) ──
  var vaultRows = [
    ['VAULT_10','All','Vault','—','The Problem Revealed',       'Evidence fragmentation is failing 1 in 5 children in Alternative Provision. At 10% funded, we open the first chapter of Arena\'s evidence reform case.','10%'],
    ['VAULT_20','All','Vault','—','The Human Cost',             'Behind every missing record is a child whose story was lost. At 20% funded, we share the real impact — in the words of parents and educators.','20%'],
    ['VAULT_30','All','Vault','—','The Tribunal Risk',          'Every placement without documented evidence is a legal exposure. At 30% funded, we show exactly what Arena protects against.','30%'],
    ['VAULT_40','All','Vault','—','The 3-Pillar Architecture',  'Performance Centre, Welfare Suite, Kit Room — the three sovereign layers that form Arena\'s clinical infrastructure, revealed at 40%.','40%'],
    ['VAULT_50','All','Vault','—','Inside the Performance Centre','How Arena tracks, structures and preserves every child\'s attainment evidence across placements and transitions. Unlocked at 50%.','50%'],
    ['VAULT_60','All','Vault','—','Inside the Welfare Suite',   'The clinical-educational link that has always been missing. At 60% funded, we show how Arena integrates welfare and health records into a single auditable trail.','60%'],
    ['VAULT_70','Patron','Vault','—','AI Explainability Layer',  'Arena v7.0.0 introduces audit-ready AI tools. Every automated decision is documented and defensible. Patron-only briefing unlocked at 70%.','70%'],
    ['VAULT_80','Patron','Vault','—','2026 Statutory Audit Guide','The February 2026 SEND standards demand evidence most providers don\'t have. This guide shows exactly what Arena produces — automatically. Unlocked at 80%.','80%'],
    ['VAULT_90','All','Vault','—','The National Deployment Plan','152 Local Authorities. The full Arena rollout strategy, unlocked at 90% for all backers.','90%'],
    ['VAULT_100','All','Vault','—','Full Archive — All Backers', 'Complete access: all strategic briefings, the 2026 Audit Guide, the AI explainability papers, and your permanent place in the Founders Archive. The vault is fully open.','100%'],
  ];
  var vStart = tStart + trophyRows.length + 1;
  matrix.getRange(vStart, 1, vaultRows.length, 7).setValues(vaultRows).setBackground('#1B263B').setFontColor(WHITE);

  matrix.setFrozenRows(1);


  // ═══════════════════════════════════════════════
  // 2. TIER_DEFINITIONS
  // ═══════════════════════════════════════════════
  var tiers = ss.getSheetByName('Tier_Definitions') || ss.insertSheet('Tier_Definitions');
  tiers.clear();
  tiers.setColumnWidths(1, 6, 180);
  tiers.setColumnWidth(5, 400);

  var tHeaders = [['Tier_Name','Price_Point','Limit','User_Type','Primary_Hook','Status']];
  tiers.getRange(1,1,1,6).setValues(tHeaders);
  styleHeader(tiers.getRange(1,1,1,6));

  var tierData = [
    ['Supporter',              '25',   'Open', 'Donor',  'Your child\'s story matters. Be the first to stand behind a system that finally makes it count.', 'Active'],
    ['Founding Supporter',     '100',  '500',  'Donor',  'You hold a key to the future. Literally. A personalised 3D printed Arena Key — your unique number, permanent.', 'Active'],
    ['Founding Future Partner','750',  '50',   'School', 'You work inside the system. You see the gaps every day. This is how you become part of closing them — permanently.', 'Active'],
    ['Pilot Partner',          '1500', '5',    'School', 'Only 5 positions. 18 months of Arena v1. Your school shapes the platform that will protect children nationally.', 'Active'],
    ['Authority Partner',      '6500', '5',    'LA',     'The DfE SEND whitepaper is not a suggestion. Five Local Authorities will shape Arena\'s national rollout. Is your LA one of them?', 'Active'],
  ];
  tiers.getRange(2,1,tierData.length,6).setValues(tierData).setBackground('#1B263B').setFontColor(WHITE);
  tiers.setFrozenRows(1);


  // ═══════════════════════════════════════════════
  // 3. BACKERS TAB (NEW — feeds memorial wall)
  // ═══════════════════════════════════════════════
  var backers = ss.getSheetByName('Backers') || ss.insertSheet('Backers');
  backers.clear();
  backers.setColumnWidths(1, 6, 160);
  backers.setColumnWidth(2, 200);
  backers.setColumnWidth(3, 200);

  var bHeaders = [['Backer_ID','Display_Name','Real_Name','Tier_Level','Tier_Name','Date_Added']];
  backers.getRange(1,1,1,6).setValues(bHeaders);
  styleHeader(backers.getRange(1,1,1,6));

  // Sample row (delete when real backers come in)
  backers.getRange(2,1,1,6).setValues([
    ['BACKER_001','Arena Team','The Arena Hub Ltd','1','Supporter', new Date().toLocaleDateString('en-GB')]
  ]).setBackground('#1B263B').setFontColor(WHITE).setFontStyle('italic');

  // Notes for the user
  backers.getRange(1,8).setValue('HOW TO USE THIS TAB').setFontWeight('bold').setFontColor(GOLD).setBackground(NAV);
  backers.getRange(2,8).setValue('Add a new row for each Kickstarter backer.').setFontColor(WHITE).setBackground(NAV);
  backers.getRange(3,8).setValue('Tier_Level: 1=Supporter, 2=Founding Supporter, 3=Founding Future Partner, 4=Pilot Partner, 5=Authority Partner').setFontColor(WHITE).setBackground(NAV);
  backers.getRange(4,8).setValue('Display_Name: What appears on the memorial wall brick (can be anonymous/nickname).').setFontColor(WHITE).setBackground(NAV);
  backers.getRange(5,8).setValue('The website reads this tab on every page load. No other changes needed.').setFontColor(WHITE).setBackground(NAV);
  backers.setColumnWidth(8, 600);
  backers.setFrozenRows(1);


  // ═══════════════════════════════════════════════
  // 4. OUTREACH_COMMAND — keep existing, just ensure headers
  // ═══════════════════════════════════════════════
  var outreach = ss.getSheetByName('Outreach_Command') || ss.insertSheet('Outreach_Command');
  if (outreach.getLastRow() === 0) {
    var oHeaders = [['URN','School_Name','Local_Authority','Pressure_Level','Head_Contact','Email','Litigation_Risk','Status']];
    outreach.getRange(1,1,1,8).setValues(oHeaders);
    styleHeader(outreach.getRange(1,1,1,8));
    outreach.setFrozenRows(1);
  }

  SpreadsheetApp.getUi().alert(
    'Arena Workspace Ready!\n\n' +
    '✓ Kickstarter_Matrix — video rows prefilled\n' +
    '✓ Tier_Definitions — 5 tiers populated\n' +
    '✓ Backers tab — ready for backer names\n\n' +
    'Next steps:\n' +
    '1. Update STAT_KS_URL row with your live Kickstarter URL\n' +
    '2. Upload video files to GitHub matching the filenames in the matrix\n' +
    '3. Add backer names to the Backers tab as pledges come in\n' +
    '4. Update STAT_FUNDING regularly to drive the vault unlock and wall progress'
  );
}