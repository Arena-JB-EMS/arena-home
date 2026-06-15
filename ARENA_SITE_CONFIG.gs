// ============================================================
// ARENA SITE CONFIG v1.1.0
// GAS Web App — Dynamic site config for thearenahub.co.uk + arena-lite
// Session: S104 — 2026-06-15
//
// SETUP (one-time):
//   1. Create a new Google Apps Script project (script.google.com)
//   2. Paste this entire file into Code.gs
//   3. Set FOLDER_ID below — open your 05_Websites Drive folder,
//      copy the long ID from the URL bar
//   4. Run setupSheet() → authorise → sheet is created in that folder
//   5. Deploy → Manage Deployments → New Deployment
//      Type: Web App | Execute as: Me | Who has access: Anyone
//   6. Copy the /exec URL into arena-config.js (ARENA_CONFIG_URL constant)
//   7. Upload arena-config.js and updated HTML files to your hosting
//
// ONGOING USE:
//   Open the sheet in Google Sheets → ⚡ Arena Config menu → Open Admin Panel
//   Edit values → Commit — website updates immediately, no re-upload needed.
// ============================================================

const FOLDER_ID  = 'YOUR_FOLDER_ID_HERE'; // ← Get from Drive URL of 05_Websites folder
const SHEET_NAME = 'ARENA_SITE_CONFIG';
const TAB_NAME   = 'CONFIG';

// ─── DEFAULT CONFIG ───────────────────────────────────────────────────────────
// [KEY, VALUE, DESCRIPTION, CATEGORY]
// KEY is what the HTML references via data-config="key"
// CATEGORY groups rows in the admin sidebar (CONTACT / LEGAL / PRICING / SOCIAL)
const DEFAULTS = [
  ['KEY',                'VALUE',                                  'DESCRIPTION',                                                                        'CATEGORY'],
  ['phone',              '01618702916',                            'Main business phone — UPDATE when new number issued. Appears on: company, dpa, privacy, terms', 'CONTACT'],
  ['email_dpo',          'j.baguley@thearenahub.co.uk',           'Director / DPO personal email — privacy, terms, dpa',                                'CONTACT'],
  ['email_pilot',        'pilot@thearenahub.co.uk',               'Pilot programme enquiries — pricing, company',                                       'CONTACT'],
  ['email_sales',        'sales@thearenahub.co.uk',               'Sales enquiries — pricing, company',                                                 'CONTACT'],
  ['email_support',      'support@thearenahub.co.uk',             'Technical support — platform page',                                                  'CONTACT'],
  ['email_compliance',   'compliance@thearenahub.co.uk',          'Compliance & DPO contact — dpa, compliance pages',                                   'CONTACT'],
  ['email_schools',      'schools@thearenahub.co.uk',             'Schools team — company contact form',                                                'CONTACT'],
  ['email_safeguarding', 'safeguarding@thearenahub.co.uk',        'Safeguarding lead — company contact form',                                           'CONTACT'],
  ['email_data_protection','data-protection@thearenahub.co.uk',   'Data protection requests — company contact form',                                    'CONTACT'],
  ['email_info',         'info@thearenahub.co.uk',                'General enquiries — company contact form',                                           'CONTACT'],
  ['email_scn',          'sovereign_network@thearenahub.co.uk',   'Sovereign Continuity Network — pricing page',                                        'CONTACT'],
  ['email_legal',        'legal@thearenahub.co.uk',              'Legal enquiries — arena-lite terms.html (multi-seat, cancellation)',                   'CONTACT'],
  ['email_hello',        'hello@thearenahub.co.uk',              'General hello address — arena-lite signup.html',                                        'CONTACT'],
  ['company_name',       'The Arena Hub Ltd',                     'Full registered company name',                                                       'LEGAL'],
  ['company_number',     '1708605',                               'Companies House number — displayed as CH#1708605 on site',                           'LEGAL'],
  ['duns_number',        '234652645',                             'D-U-N-S number — compliance, dpa pages',                                             'LEGAL'],
  ['director_name',      'Jonathan Baguley',                      'Director full name — DPA signatory block',                                           'LEGAL'],
  ['director_title',     'Founder & Principal Data Architect',    'Director title — DPA signatory block',                                               'LEGAL'],
  ['dpa_reference',      'ARENA-DPA-2026-001',                    'DPA document reference number',                                                      'LEGAL'],
  ['pilot_price',        '£495 + VAT',                            'Pilot programme fee — terms and pricing pages',                                      'PRICING'],
  ['pilot_duration',     '6 weeks',                               'Pilot programme duration — terms page',                                              'PRICING'],
  ['social_linkedin',    'https://linkedin.com/company/the-arena-hub', 'LinkedIn company page URL',                                                    'SOCIAL'],
  ['social_facebook',    'https://facebook.com/TheArenaHubUK',   'Facebook page URL',                                                                  'SOCIAL'],
  ['social_instagram',   'https://instagram.com/TheArenaHubUK',  'Instagram profile URL',                                                              'SOCIAL'],
  ['social_substack',    'https://thearenahub.substack.com',     'Substack publication URL',                                                           'SOCIAL'],
];


// ─── SETUP (run once) ─────────────────────────────────────────────────────────
function setupSheet() {
  const ui = SpreadsheetApp.getUi();
  let folder;
  try {
    folder = DriveApp.getFolderById(FOLDER_ID);
  } catch (e) {
    ui.alert('❌ Folder not found. Check FOLDER_ID at the top of the script.\n\nError: ' + e.message);
    return;
  }

  // Check if sheet already exists
  const existing = folder.getFilesByName(SHEET_NAME);
  if (existing.hasNext()) {
    const existingId = existing.next().getId();
    PropertiesService.getScriptProperties().setProperty('CONFIG_SHEET_ID', existingId);
    ui.alert('⚠️ Sheet already exists. Stored ID: ' + existingId + '\n\nNo changes made.');
    return;
  }

  // Create spreadsheet and move to correct folder
  const ss   = SpreadsheetApp.create(SHEET_NAME);
  const file = DriveApp.getFileById(ss.getId());
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);

  // Write data
  const sheet = ss.getActiveSheet().setName(TAB_NAME);
  sheet.getRange(1, 1, DEFAULTS.length, 4).setValues(DEFAULTS);

  // Format header row
  const hdr = sheet.getRange(1, 1, 1, 4);
  hdr.setBackground('#1a2332').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(11);

  // Format VALUE column (editable — highlighted)
  sheet.getRange(2, 2, DEFAULTS.length - 1, 1).setBackground('#fffbea');

  // Column widths
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 320);
  sheet.setColumnWidth(3, 400);
  sheet.setColumnWidth(4, 100);

  // Freeze header, protect KEY/DESC/CAT columns
  sheet.setFrozenRows(1);
  const protection = sheet.getRange(1, 1, DEFAULTS.length, 1).protect();
  protection.setDescription('KEY column — do not edit').setWarningOnly(true);

  // Store sheet ID for fast access
  PropertiesService.getScriptProperties().setProperty('CONFIG_SHEET_ID', ss.getId());

  ui.alert(
    '✅ ARENA_SITE_CONFIG created successfully!\n\n' +
    'Sheet ID: ' + ss.getId() + '\n' +
    'Location: ' + folder.getName() + '\n\n' +
    'Next step: Deploy this script as a Web App and paste the /exec URL into arena-config.js'
  );
  Logger.log('Sheet ID: ' + ss.getId());
}


// ─── WEB APP ENDPOINT ─────────────────────────────────────────────────────────
function doGet(e) {
  try {
    const sheet  = _getSheet();
    const data   = sheet.getDataRange().getValues();
    const config = {};

    for (let i = 1; i < data.length; i++) {
      const key = String(data[i][0]).trim();
      const val = String(data[i][1]).trim();
      if (key) config[key] = val;
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, config }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// ─── ON OPEN MENU ─────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Arena Config')
    .addItem('Open Admin Panel', 'showAdminSidebar')
    .addSeparator()
    .addItem('Re-run Setup (if sheet moved)', 'relink')
    .addToUi();
}


// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function showAdminSidebar() {
  const html = HtmlService.createHtmlOutput(SIDEBAR_HTML)
    .setTitle('⚡ Arena Site Config')
    .setWidth(440);
  SpreadsheetApp.getUi().showSidebar(html);
}

/** Called by sidebar on load — returns all config rows */
function getConfigValues() {
  const sheet = _getSheet();
  const data  = sheet.getDataRange().getValues();
  const rows  = [];
  for (let i = 1; i < data.length; i++) {
    const key = String(data[i][0]).trim();
    if (!key) continue;
    rows.push({
      key:      key,
      value:    String(data[i][1]),
      desc:     String(data[i][2]),
      category: String(data[i][3]),
    });
  }
  return rows;
}

/** Called by sidebar Commit button — saves changed values */
function commitConfig(updates) {
  // updates = { key: newValue, ... }
  const sheet = _getSheet();
  const data  = sheet.getDataRange().getValues();
  const now   = new Date();
  let   count = 0;

  for (let i = 1; i < data.length; i++) {
    const key = String(data[i][0]).trim();
    if (key in updates) {
      sheet.getRange(i + 1, 2).setValue(updates[key]);
      sheet.getRange(i + 1, 4).setValue(Utilities.formatDate(now, 'Europe/London', 'yyyy-MM-dd HH:mm'));
      count++;
    }
  }

  return { ok: true, updated: count, timestamp: now.toISOString() };
}


// ─── HELPERS ──────────────────────────────────────────────────────────────────
function _getSheet() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('CONFIG_SHEET_ID');

  if (!id) {
    // Fall back to folder search
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files  = folder.getFilesByName(SHEET_NAME);
    if (!files.hasNext()) throw new Error('Config sheet not found. Run setupSheet() first.');
    id = files.next().getId();
    props.setProperty('CONFIG_SHEET_ID', id);
  }

  const ss    = SpreadsheetApp.openById(id);
  const sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) throw new Error('Tab "' + TAB_NAME + '" not found in sheet.');
  return sheet;
}

/**
 * addMissingKeys() — run once after adding new keys to DEFAULTS.
 * Checks the live sheet and appends any keys not already present.
 * Safe to re-run: will not duplicate existing keys.
 */
function addMissingKeys() {
  const sheet   = _getSheet();
  const data    = sheet.getDataRange().getValues();
  const existing = new Set(data.slice(1).map(r => String(r[0]).trim()));
  const toAdd   = DEFAULTS.slice(1).filter(row => !existing.has(String(row[0]).trim()));

  if (toAdd.length === 0) {
    console.log('✅ No missing keys — sheet is already up to date.');
    return;
  }

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, toAdd.length, 4).setValues(toAdd);
  sheet.getRange(lastRow + 1, 2, toAdd.length, 1).setBackground('#fffbea');
  console.log('✅ Added ' + toAdd.length + ' missing key(s):');
  toAdd.forEach(r => console.log('  + ' + r[0] + ' = ' + r[1]));
}

function relink() {
  PropertiesService.getScriptProperties().deleteProperty('CONFIG_SHEET_ID');
  _getSheet(); // will re-search and cache
  SpreadsheetApp.getUi().alert('✅ Sheet re-linked successfully.');
}


// ─── SIDEBAR HTML ─────────────────────────────────────────────────────────────
const SIDEBAR_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Google Sans', Arial, sans-serif; font-size: 13px; color: #202124; background: #f8f9fa; }

  .header {
    background: #1a2332;
    color: #fff;
    padding: 14px 16px 10px;
    border-bottom: 3px solid #C5A059;
  }
  .header h1 { font-size: 15px; font-weight: 600; letter-spacing: 0.3px; }
  .header p  { font-size: 11px; color: #a8b4c0; margin-top: 3px; }

  .tabs {
    display: flex;
    background: #fff;
    border-bottom: 1px solid #dadce0;
    overflow-x: auto;
  }
  .tab {
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 500;
    color: #5f6368;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: all 0.15s;
  }
  .tab:hover { color: #1a2332; }
  .tab.active { color: #1a2332; border-bottom-color: #C5A059; }

  .content { padding: 10px 12px; }

  .field-group { margin-bottom: 10px; }
  .field-label {
    font-size: 11px;
    font-weight: 600;
    color: #5f6368;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-bottom: 3px;
  }
  .field-desc {
    font-size: 10px;
    color: #80868b;
    margin-bottom: 4px;
    line-height: 1.4;
  }
  .field-input {
    width: 100%;
    padding: 7px 10px;
    border: 1px solid #dadce0;
    border-radius: 4px;
    font-size: 12px;
    color: #202124;
    background: #fff;
    transition: border-color 0.15s;
  }
  .field-input:focus { outline: none; border-color: #C5A059; box-shadow: 0 0 0 2px rgba(197,160,89,0.15); }
  .field-input.changed { border-color: #fbbc04; background: #fffbea; }

  .footer {
    position: sticky;
    bottom: 0;
    background: #fff;
    border-top: 1px solid #dadce0;
    padding: 10px 12px;
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .btn-commit {
    flex: 1;
    padding: 9px 16px;
    background: #1a2332;
    color: #C5A059;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: background 0.15s;
  }
  .btn-commit:hover { background: #243040; }
  .btn-commit:disabled { background: #dadce0; color: #9aa0a6; cursor: default; }
  .btn-reset {
    padding: 9px 12px;
    background: transparent;
    color: #5f6368;
    border: 1px solid #dadce0;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
  }
  .btn-reset:hover { background: #f1f3f4; }

  .status {
    font-size: 11px;
    padding: 6px 10px;
    border-radius: 4px;
    margin-bottom: 8px;
    display: none;
  }
  .status.ok    { background: #e6f4ea; color: #1e7e34; display: block; }
  .status.error { background: #fce8e6; color: #c5221f; display: block; }
  .status.info  { background: #e8f0fe; color: #1a73e8; display: block; }

  .changed-count {
    font-size: 11px;
    color: #fbbc04;
    font-weight: 600;
    min-width: 60px;
    text-align: right;
  }

  .loading { text-align: center; padding: 30px; color: #80868b; }
  .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid #dadce0; border-top-color: #C5A059; border-radius: 50%; animation: spin 0.7s linear infinite; margin-bottom: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>

<div class="header">
  <h1>⚡ Arena Site Config</h1>
  <p>Edit values below and click Commit to update the live website.</p>
</div>

<div class="tabs" id="tabs"></div>

<div class="content">
  <div id="status" class="status"></div>
  <div id="loading" class="loading">
    <div class="spinner"></div><br>Loading config…
  </div>
  <div id="fields"></div>
</div>

<div class="footer">
  <button class="btn-commit" id="btnCommit" disabled onclick="commit()">Commit Changes</button>
  <button class="btn-reset" onclick="resetAll()">Reset</button>
  <div class="changed-count" id="changedCount"></div>
</div>

<script>
  let allRows = [];
  let originals = {};
  let changes = {};
  let activeTab = 'ALL';

  const CATEGORIES = ['ALL', 'CONTACT', 'LEGAL', 'PRICING', 'SOCIAL'];

  window.onload = function () {
    google.script.run
      .withSuccessHandler(populate)
      .withFailureHandler(function (e) {
        showStatus('error', 'Failed to load config: ' + e.message);
        document.getElementById('loading').style.display = 'none';
      })
      .getConfigValues();
  };

  function populate(rows) {
    allRows = rows;
    rows.forEach(r => { originals[r.key] = r.value; });
    document.getElementById('loading').style.display = 'none';
    buildTabs();
    renderFields(activeTab);
  }

  function buildTabs() {
    const container = document.getElementById('tabs');
    container.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const count = cat === 'ALL' ? allRows.length : allRows.filter(r => r.category === cat).length;
      const div = document.createElement('div');
      div.className = 'tab' + (cat === activeTab ? ' active' : '');
      div.textContent = cat + ' (' + count + ')';
      div.onclick = () => { activeTab = cat; buildTabs(); renderFields(cat); };
      container.appendChild(div);
    });
  }

  function renderFields(cat) {
    const rows = cat === 'ALL' ? allRows : allRows.filter(r => r.category === cat);
    const container = document.getElementById('fields');
    container.innerHTML = '';
    rows.forEach(r => {
      const div = document.createElement('div');
      div.className = 'field-group';
      div.innerHTML =
        '<div class="field-label">' + escHtml(r.key) + '</div>' +
        '<div class="field-desc">' + escHtml(r.desc) + '</div>' +
        '<input class="field-input" id="input_' + escHtml(r.key) + '" type="text" value="' + escHtml(r.value) + '" ' +
        'oninput="onInput(this, \'' + escHtml(r.key) + '\')">';
      container.appendChild(div);
    });
  }

  function onInput(el, key) {
    const current = el.value;
    if (current !== originals[key]) {
      changes[key] = current;
      el.classList.add('changed');
    } else {
      delete changes[key];
      el.classList.remove('changed');
    }
    updateCommitBtn();
  }

  function updateCommitBtn() {
    const n = Object.keys(changes).length;
    const btn = document.getElementById('btnCommit');
    const cnt = document.getElementById('changedCount');
    btn.disabled = n === 0;
    btn.textContent = n > 0 ? 'Commit ' + n + ' Change' + (n > 1 ? 's' : '') : 'Commit Changes';
    cnt.textContent = n > 0 ? n + ' pending' : '';
  }

  function commit() {
    if (!Object.keys(changes).length) return;
    const btn = document.getElementById('btnCommit');
    btn.disabled = true;
    btn.textContent = 'Saving…';
    showStatus('info', 'Saving changes to Google Sheets…');

    google.script.run
      .withSuccessHandler(function (result) {
        if (result.ok) {
          // Update originals and clear changes
          Object.assign(originals, changes);
          // Remove changed styling
          Object.keys(changes).forEach(key => {
            const el = document.getElementById('input_' + key);
            if (el) el.classList.remove('changed');
          });
          changes = {};
          updateCommitBtn();
          showStatus('ok', '✅ ' + result.updated + ' value' + (result.updated > 1 ? 's' : '') + ' saved. Website will reflect changes immediately.');
        } else {
          showStatus('error', '❌ Save failed. Try again.');
          btn.disabled = false;
          btn.textContent = 'Commit Changes';
        }
      })
      .withFailureHandler(function (e) {
        showStatus('error', '❌ Error: ' + e.message);
        btn.disabled = false;
        btn.textContent = 'Commit Changes';
      })
      .commitConfig(changes);
  }

  function resetAll() {
    allRows.forEach(r => {
      const el = document.getElementById('input_' + r.key);
      if (el) { el.value = originals[r.key]; el.classList.remove('changed'); }
    });
    changes = {};
    updateCommitBtn();
    showStatus('info', 'All fields reset to saved values.');
  }

  function showStatus(type, msg) {
    const el = document.getElementById('status');
    el.className = 'status ' + type;
    el.textContent = msg;
    if (type === 'ok') setTimeout(() => { el.className = 'status'; }, 4000);
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
</script>
</body>
</html>`;
