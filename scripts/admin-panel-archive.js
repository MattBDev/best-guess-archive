// Admin Panel Archive
// Removed from index.html as part of workflow redesign (2026-04-25).
// All game updates are now done by Claude/Codex agents directly editing data/games.json.

// ============================================================
// FOOTER BUTTON (was in <footer>)
// ============================================================
/*
      <!-- Subtle admin button -->
      <button class="opacity-10 hover:opacity-100 transition-opacity p-2 text-slate-500 hover:text-white" onclick="app.setView('admin')" title="Admin">
        <span class="material-symbols-outlined text-sm">admin_panel_settings</span>
      </button>
*/

// ============================================================
// HTML TEMPLATE (was <template id="view-admin">)
// ============================================================
/*
<!-- ADMIN -->
<template id="view-admin">
<div class="max-w-2xl mx-auto fade-in py-10 space-y-6">
  <h2 class="text-3xl font-display font-bold">Admin <span class="text-yellow-500">Panel</span></h2>

  <!-- PIN Gate -->
  <div id="admin-pin-gate" class="glass-panel p-8 rounded-xl space-y-4">
    <p class="text-slate-400 text-sm">Enter admin PIN to continue.</p>
    <input id="admin-pin-input" type="password" maxlength="32"
      class="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-yellow-500"
      placeholder="PIN"
      onkeydown="if(event.key==='Enter') app.checkPin()">
    <button class="btn-primary px-6 py-2 rounded-lg font-bold" onclick="app.checkPin()">Unlock</button>
    <p class="text-red-400 text-sm hidden" id="admin-pin-error">Incorrect PIN.</p>
  </div>

  <!-- Admin Workspace (hidden until PIN correct) -->
  <div id="admin-workspace" class="space-y-6 hidden">

    <!-- GitHub Settings -->
    <div class="glass-panel p-6 rounded-xl space-y-4">
      <h3 class="font-bold text-white flex items-center gap-2">
        <span class="material-symbols-outlined text-blue-400">settings</span> GitHub Settings
        <span class="text-xs text-slate-500 font-normal ml-2">(owner/repo saved locally; token kept only in this tab)</span>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-xs text-slate-400 uppercase tracking-widest block mb-1">GitHub Owner</label>
          <input id="gh-owner" type="text" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="jeremydbean">
        </div>
        <div>
          <label class="text-xs text-slate-400 uppercase tracking-widest block mb-1">GitHub Repo</label>
          <input id="gh-repo" type="text" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="best-guess-archive">
        </div>
        <div class="md:col-span-2">
          <label class="text-xs text-slate-400 uppercase tracking-widest block mb-1">Personal Access Token (contents:write scope only)</label>
          <input id="gh-pat" type="password" autocomplete="off" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" placeholder="ghp_...">
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="text-sm bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2 rounded" onclick="app.saveGhSettings()">Save Settings</button>
        <span class="text-green-400 text-xs hidden" id="gh-save-ok">Saved!</span>
      </div>
    </div>

    <!-- Import -->
    <div class="glass-panel p-6 rounded-xl space-y-4">
      <h3 class="font-bold text-white flex items-center gap-2">
        <span class="material-symbols-outlined text-green-400">upload</span> Import New Game(s)
      </h3>
      <p class="text-sm text-slate-400">Paste the JSON array from your Gemini pipeline below. One or two game objects per episode are fine. New games will be prepended to <code class="bg-slate-800 px-1 rounded text-xs">data/games.json</code> and committed to GitHub. The site rebuilds in ~30 seconds.</p>

      <!-- Schema reference -->
      <details class="text-xs text-slate-500 cursor-pointer group">
        <summary class="hover:text-slate-300 transition select-none flex items-center justify-between">
          <span>▶ Show Gemini Transcript Prompt</span>
          <button class="bg-slate-700 hover:bg-slate-600 text-white font-bold py-1 px-3 border border-slate-600 rounded text-[10px] uppercase shadow-sm group-open:flex hidden" onclick="app.copyGeminiPrompt(event)">Copy Prompt</button>
        </summary>
        <div class="mt-3 bg-slate-900/70 rounded-lg p-4 border border-slate-700 space-y-3">
          <p class="text-slate-300 text-xs">Copy this entire prompt and paste it into Gemini along with the YouTube transcript:</p>
          <pre id="gemini-prompt-text" class="overflow-x-auto text-slate-300 text-[11px] leading-relaxed">Parse this Best Guess Live transcript and return a JSON object (or array of objects if there are multiple episodes) matching this exact schema:

{
  "date": "Monday, April 14, 2026",
  "pot": 7500,
  "format": "v2",
  "host": "Hunter March",
  "secretItem": "EXAMPLE ITEM",
  "clues": [
    { "text": "THE CLUE TEXT", "correct": "5", "guesses": "6,000", "explanation": "Host explanation here." },
    { "text": "THE CLUE TEXT", "correct": "10", "guesses": "5,000", "explanation": "Host explanation here." },
    { "text": "THE CLUE TEXT", "correct": "50", "guesses": "4,000", "explanation": "Host explanation here." },
    { "text": "THE CLUE TEXT", "correct": "100", "guesses": "3,000", "explanation": "Host explanation here." },
    { "text": "THE CLUE TEXT", "correct": "1000", "guesses": "2,000", "explanation": "Host explanation here." }
  ],
  "goldClue": 1,
  "silverClue": 2,
  "bronzeClue": 3,
  "goldWinners": 5,
  "silverWinners": 10,
  "bronzeWinners": 50,
  "totalWinners": 65,
  "goldPayout": 600.00,
  "silverPayout": 250.00,
  "bronzePayout": 40.00,
  "winnerPayout": "$7,500.00",
  "winnerNames": "Winner One, Winner Two",
  "wrongGuesses": "wrong guess 1, wrong guess 2"
}

FORMATTING RULES:
1. "format" is "v2" for the 3-medal games, or "v1" for classic.
2. In "v1" classic format, set "goldClue" to the clue number that won, and set silverClue, bronzeClue, goldWinners, silverWinners, and bronzeWinners to 0.
3. Pot is typically 5000 for game 1, and 10000 for game 2.
4. Provide only pure valid JSON, do not include markdown blocks.</pre>
        </div>
      </details>

      <textarea id="import-json" rows="10"
        class="w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-200 font-mono text-xs focus:outline-none focus:border-green-500"
        placeholder='[{"date":"Monday, April 14, 2026","secretItem":"EXAMPLE",...}]'></textarea>

      <div class="flex gap-3 flex-wrap">
        <button class="bg-blue-700 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded text-sm" onclick="app.previewImport()">
          Preview
        </button>
        <button class="bg-green-700 hover:bg-green-600 text-white font-bold px-4 py-2 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed" id="btn-publish" onclick="app.publishImport()" disabled>
          Publish to GitHub
        </button>
      </div>

      <!-- Preview panel -->
      <div id="import-preview" class="hidden space-y-3"></div>
      <!-- Status -->
      <div id="import-status" class="hidden text-sm font-medium px-4 py-2 rounded"></div>
    </div>
    
    <!-- Manage Archive -->
    <div class="glass-panel p-6 rounded-xl space-y-4">
      <h3 class="font-bold text-white flex items-center gap-2">
        <span class="material-symbols-outlined text-red-500">delete</span> Replace/Delete by Date
      </h3>
      <p class="text-sm text-slate-400">Select a date from the archive below. You can either completely remove all games on that date, or replace them by selecting the date here and publishing a new JSON import in the panel above.</p>
      
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <select id="delete-date-select" class="w-full sm:w-80 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" onchange="app.renderSelectedDatePreview()">
          <option value="">Loading dates...</option>
        </select>
        <button id="btn-delete-date" class="bg-red-700 hover:bg-red-600 text-white font-bold px-4 py-2 rounded text-sm shrink-0 disabled:opacity-40 disabled:cursor-not-allowed" onclick="app.deleteDate()">
          Delete Selected Date
        </button>
      </div>
      
      <!-- Date Output Preview -->
      <div id="date-preview-container" class="hidden mt-3 p-3 bg-slate-900 border border-slate-700 rounded-lg max-h-40 overflow-y-auto text-xs text-slate-300">
      </div>

      <!-- Delete Status -->
      <div id="delete-status" class="hidden text-sm font-medium px-4 py-2 rounded"></div>
    </div>

  </div>
</div>
</template>
*/

// ============================================================
// ADMIN PIN (was in <script> block after templates)
// ============================================================
/*
// ============================================================
// ADMIN PIN
// SHA-256 of the PIN. Default PIN is "1234".
// To change: open browser console and run:
//   crypto.subtle.digest('SHA-256',new TextEncoder().encode('YOURPIN'))
//     .then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
// Then update ADMIN_PIN_HASH below and commit.
const ADMIN_PIN_HASH = '269ea4910f6202594cab138862120b206126129a90e9a74a8d4ffeabc3871f1f'; // SHA-256 of admin PIN

async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2,'0')).join('');
}
*/

// ============================================================
// GITHUB API HELPER METHODS (were in App class)
// ============================================================
/*
  _b64DecodeUTF8(b64) {
    const binary = atob(b64.replace(/\n/g, ''));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  _b64EncodeUTF8(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }

  async _githubRequest(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(options.headers || {})
      }
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${options.method || 'GET'} ${url} failed (${res.status}): ${text}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  async _getRemoteGamesState(owner, repo, pat) {
    const headers = { Authorization: `Bearer ${pat}` };
    const ref = await this._githubRequest(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, { headers });
    const headCommitSha = ref.object.sha;
    const commit = await this._githubRequest(`https://api.github.com/repos/${owner}/${repo}/git/commits/${headCommitSha}`, { headers });
    const rootTreeSha = commit.tree.sha;
    const tree = await this._githubRequest(`https://api.github.com/repos/${owner}/${repo}/git/trees/${rootTreeSha}?recursive=1`, { headers });
    const entry = (tree.tree || []).find(item => item.path === 'data/games.json' && item.type === 'blob');
    if (!entry) throw new Error('Could not find data/games.json in the repository tree.');
    const blob = await this._githubRequest(`https://api.github.com/repos/${owner}/${repo}/git/blobs/${entry.sha}`, { headers });
    const parsed = JSON.parse(this._b64DecodeUTF8(blob.content));
    if (!Array.isArray(parsed)) {
      throw new Error('Remote data/games.json is not a valid array. Aborting to prevent data loss.');
    }
    return {
      headers,
      headCommitSha,
      rootTreeSha,
      games: parsed
    };
  }

  _buildGamesMeta(games) {
    return games.map(g => {
      const meta = {
        date: g.date,
        secretItem: g.secretItem,
        pot: g.pot,
        totalWinners: typeof g.totalWinners === 'number' ? g.totalWinners : Number(g.winnerCount) || 0,
        host: g.host,
        format: g.format,
        clueCount: Array.isArray(g.clues) ? g.clues.length : (g.clueCount ?? 0)
      };
      if (g.note) meta.note = g.note;
      return meta;
    });
  }

  // Commit an updated games array + regenerated meta in one atomic git commit.
  // Pass the `state` object returned by a prior _getRemoteGamesState call; this reuses
  // its SHAs instead of refetching. The ref PATCH is fast-forward-only, so a concurrent
  // commit between fetch and write causes the PATCH to fail cleanly with a 422.
  async _commitGamesState(owner, repo, pat, state, nextGames, message) {
    const hj = { ...state.headers, 'Content-Type': 'application/json' };
    const base = `https://api.github.com/repos/${owner}/${repo}`;

    const gamesBlob = await this._githubRequest(`${base}/git/blobs`, {
      method: 'POST', headers: hj,
      body: JSON.stringify({
        content: this._b64EncodeUTF8(JSON.stringify(nextGames, null, 2)),
        encoding: 'base64'
      })
    });

    const metaBlob = await this._githubRequest(`${base}/git/blobs`, {
      method: 'POST', headers: hj,
      body: JSON.stringify({
        content: this._b64EncodeUTF8(JSON.stringify(this._buildGamesMeta(nextGames), null, 2)),
        encoding: 'base64'
      })
    });

    const tree = await this._githubRequest(`${base}/git/trees`, {
      method: 'POST', headers: hj,
      body: JSON.stringify({
        base_tree: state.rootTreeSha,
        tree: [
          { path: 'data/games.json',      mode: '100644', type: 'blob', sha: gamesBlob.sha },
          { path: 'data/games-meta.json', mode: '100644', type: 'blob', sha: metaBlob.sha  }
        ]
      })
    });

    const commit = await this._githubRequest(`${base}/git/commits`, {
      method: 'POST', headers: hj,
      body: JSON.stringify({ message, tree: tree.sha, parents: [state.headCommitSha] })
    });

    await this._githubRequest(`${base}/git/refs/heads/main`, {
      method: 'PATCH', headers: hj,
      body: JSON.stringify({ sha: commit.sha })
    });

    return { commitSha: commit.sha, previousHeadSha: state.headCommitSha };
  }
*/

// ============================================================
// ADMIN PANEL METHODS (were in App class)
// ============================================================
/*
  _getAdminDateGroups() {
    if (this._adminDateGroupsCache) return this._adminDateGroupsCache;
    const byDate = new Map();
    this.games.forEach(g => {
      if (!byDate.has(g.date)) byDate.set(g.date, []);
      byDate.get(g.date).push(g);
    });
    const list = [...byDate.entries()]
      .sort((a, b) => this._compareArchiveDates(b[0], a[0]))
      .map(([date, games]) => ({ date, games }));
    this._adminDateGroupsCache = { list, byDate };
    return this._adminDateGroupsCache;
  }

  initAdmin() {
    const nodes = this._getViewNodes('admin');
    if (nodes.owner) nodes.owner.value = localStorage.getItem('gh_owner') || 'jeremydbean';
    if (nodes.repo) nodes.repo.value = localStorage.getItem('gh_repo') || 'best-guess-archive';
    if (nodes.pat) nodes.pat.value = this._ghPat || '';
    this.populateDeleteDates();
  }

  populateDeleteDates() {
    const sel = this._getViewNodes('admin').deleteSelect;
    if (!sel) return;

    const groups = this._getAdminDateGroups().list;
    if (groups.length === 0) {
      sel.innerHTML = '<option value="">No games found</option>';
      return;
    }

    sel.innerHTML = '<option value="">(None selected)</option>' +
      groups.map(({ date, games }) => {
        const esc = this._escapeHtml(date);
        return `<option value="${esc}">${esc} (${games.length} game${games.length > 1 ? 's' : ''})</option>`;
      }).join('');
  }

  renderSelectedDatePreview() {
    const nodes = this._getViewNodes('admin');
    const date = nodes.deleteSelect?.value;
    const container = nodes.datePreview;
    if (!container) return;
    if (!date) {
      container.classList.add('hidden');
      return;
    }

    const games = this._getAdminDateGroups().byDate.get(date) || [];
    const esc = (v) => this._escapeHtml(v);
    container.innerHTML = `<div class="font-bold text-white mb-2">Existing items for ${esc(date)}:</div>` + 
      games.map((g, i) => `<div><span class="text-blue-400">Game ${i+1}:</span> <strong>${esc(g.secretItem)}</strong> <span class="opacity-50 mx-1">|</span> Hosted by ${esc(g.host || '?')}</div>`).join('');
    container.classList.remove('hidden');
  }

  async deleteDate() {
    const dateToDelete = document.getElementById('delete-date-select').value;
    const status = document.getElementById('delete-status');
    const btn = document.getElementById('btn-delete-date');
    const owner = localStorage.getItem('gh_owner');
    const repo  = localStorage.getItem('gh_repo');
    const pat   = this._ghPat;
    
    if (!dateToDelete) {
      status.className = 'text-sm font-medium px-4 py-2 rounded bg-red-900/20 text-red-400 mt-2';
      status.innerText = 'Please select a date first.';
      status.classList.remove('hidden');
      return;
    }
    
    if (!owner || !repo || !pat) {
      status.className = 'text-sm font-medium px-4 py-2 rounded bg-red-900/20 text-red-400 mt-2';
      status.innerText = 'Save your GitHub settings first.';
      status.classList.remove('hidden');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete all games from ${dateToDelete}? This action will directly commit to GitHub.`)) {
      return;
    }
    
    status.className = 'text-sm font-medium px-4 py-2 rounded bg-blue-900/20 text-blue-400 mt-2';
    status.innerText = `Fetching current data for ${dateToDelete}...`;
    status.classList.remove('hidden');
    if (btn) btn.disabled = true;
    
    try {
      const remoteState = await this._getRemoteGamesState(owner, repo, pat);
      const existing = remoteState.games;
      const gamesToKeep = existing.filter(g => g.date !== dateToDelete);
      const deletedCount = existing.length - gamesToKeep.length;

      if (deletedCount === 0) {
        throw new Error(`No games found matching date ${dateToDelete} in the remote file.`);
      }

      status.innerText = `Committing deletion of ${deletedCount} game${deletedCount>1?'s':''} from ${dateToDelete}...`;
      await this._commitGamesState(
        owner,
        repo,
        pat,
        remoteState,
        gamesToKeep,
        `Delete ${deletedCount} game${deletedCount>1?'s':''} from ${dateToDelete}`
      );

      // 4. Update local state
      this.games = gamesToKeep;
      this._normalizeGames(this.games);
      this.populateDeleteDates();
      document.getElementById('delete-date-select').value = '';
      const preview = document.getElementById('date-preview-container');
      if (preview) preview.classList.add('hidden');
      
      status.className = 'text-sm font-medium px-4 py-2 rounded bg-green-900/20 text-green-400 mt-2';
      status.innerText = `✓ Successfully deleted ${deletedCount} game${deletedCount>1?'s':''} from ${dateToDelete}. GitHub Pages will rebuild in ~30 seconds.`;
    } catch (e) {
      status.className = 'text-sm font-medium px-4 py-2 rounded bg-red-900/20 text-red-400 mt-2';
      status.innerText = `Error: ${e.message}`;
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async checkPin() {
    const input = document.getElementById('admin-pin-input').value;
    const hash  = await sha256hex(input);
    if (hash === ADMIN_PIN_HASH) {
      document.getElementById('admin-pin-gate').classList.add('hidden');
      document.getElementById('admin-workspace').classList.remove('hidden');
    } else {
      document.getElementById('admin-pin-error').classList.remove('hidden');
    }
  }

  saveGhSettings() {
    localStorage.setItem('gh_owner', document.getElementById('gh-owner').value.trim());
    localStorage.setItem('gh_repo',  document.getElementById('gh-repo').value.trim());
    this._ghPat = document.getElementById('gh-pat').value.trim();
    const ok = document.getElementById('gh-save-ok');
    ok.classList.remove('hidden');
    setTimeout(() => ok.classList.add('hidden'), 2500);
  }

  // Full schema validator — used by both previewImport (client-side) and publishImport (server-side re-check).
  // Returns an array of human-readable error strings; empty array means all clear.
  _validateGames(parsed, existingGames = []) {
    const errors = [];

    if (!Array.isArray(parsed)) {
      errors.push('Input must be a JSON array.');
      return errors;
    }
    if (parsed.length === 0) {
      errors.push('Import contains no games.');
      return errors;
    }

    const existingKeys = new Set((existingGames || []).map(g => g.date + '||' + g.secretItem));
    const seenKeys = new Set();

    parsed.forEach((g, i) => {
      const label = `Game ${i + 1}`;

      // format
      if (g.format !== 'v1' && g.format !== 'v2') {
        errors.push(`${label}: "format" must be "v1" or "v2" (got ${JSON.stringify(g.format)})`);
      }

      // date — must be a non-empty string that parses as a real date
      if (!g.date || typeof g.date !== 'string' || g.date.trim() === '') {
        errors.push(`${label}: "date" is missing or empty`);
      } else if (!this._parseArchiveDateParts(g.date)) {
        errors.push(`${label}: "date" is not a valid date (got ${JSON.stringify(g.date)})`);
      }

      // pot — must be a positive finite number (not a string)
      if (typeof g.pot !== 'number' || !isFinite(g.pot) || g.pot <= 0) {
        errors.push(`${label}: "pot" must be a positive number (got ${JSON.stringify(g.pot)})`);
      }

      // secretItem — non-empty string
      if (!g.secretItem || typeof g.secretItem !== 'string' || g.secretItem.trim() === '') {
        errors.push(`${label}: "secretItem" is missing or empty`);
      }

      // host — non-empty string
      if (!g.host || typeof g.host !== 'string' || g.host.trim() === '') {
        errors.push(`${label}: "host" is missing or empty`);
      }

      // goldClue — integer 1-5
      const goldClueN = Number(g.goldClue);
      if (g.goldClue === undefined || g.goldClue === null || g.goldClue === '' ||
          !Number.isInteger(goldClueN) || goldClueN < 1 || goldClueN > 5) {
        errors.push(`${label}: "goldClue" must be an integer 1–5 (got ${JSON.stringify(g.goldClue)})`);
      }

      // totalWinners — non-negative integer
      if (typeof g.totalWinners !== 'number' || !Number.isInteger(g.totalWinners) || g.totalWinners < 0) {
        errors.push(`${label}: "totalWinners" must be a non-negative integer (got ${JSON.stringify(g.totalWinners)})`);
      }

      // winnerPayout — non-empty string
      if (!g.winnerPayout || typeof g.winnerPayout !== 'string' || g.winnerPayout.trim() === '') {
        errors.push(`${label}: "winnerPayout" is missing or empty`);
      }

      // winnerNames and wrongGuesses — must exist (can be empty string, but not null/undefined)
      if (g.winnerNames === undefined || g.winnerNames === null) {
        errors.push(`${label}: "winnerNames" is missing`);
      }
      if (g.wrongGuesses === undefined || g.wrongGuesses === null) {
        errors.push(`${label}: "wrongGuesses" is missing`);
      }

      // clues array — exactly 5 objects each with text, correct, guesses
      if (!Array.isArray(g.clues)) {
        errors.push(`${label}: "clues" must be an array`);
      } else if (g.clues.length !== 5) {
        errors.push(`${label}: "clues" must have exactly 5 items (found ${g.clues.length})`);
      } else {
        g.clues.forEach((c, ci) => {
          const clueLabel = `${label} Clue ${ci + 1}`;
          if (!c || typeof c !== 'object' || Array.isArray(c)) {
            errors.push(`${clueLabel}: must be an object`);
            return;
          }
          if (!c.text || typeof c.text !== 'string' || c.text.trim() === '') {
            errors.push(`${clueLabel}: "text" is missing or empty`);
          }
          if (c.correct === undefined || c.correct === null || c.correct === '') {
            errors.push(`${clueLabel}: "correct" is missing`);
          } else if (isNaN(parseInt(String(c.correct).replace(/[^0-9]/g, ''), 10))) {
            errors.push(`${clueLabel}: "correct" must be a number (got ${JSON.stringify(c.correct)})`);
          }
          if (c.guesses === undefined || c.guesses === null || c.guesses === '') {
            errors.push(`${clueLabel}: "guesses" is missing`);
          } else if (isNaN(parseInt(String(c.guesses).replace(/[^0-9]/g, ''), 10))) {
            errors.push(`${clueLabel}: "guesses" must be a number (got ${JSON.stringify(c.guesses)})`);
          }
        });
      }

      // v2-specific checks
      if (g.format === 'v2') {
        ['silverClue', 'bronzeClue'].forEach(k => {
          const n = Number(g[k]);
          if (g[k] === undefined || g[k] === null || g[k] === '' || !Number.isInteger(n) || n < 1 || n > 5) {
            errors.push(`${label}: "${k}" must be an integer 1–5 (got ${JSON.stringify(g[k])})`);
          }
        });

        // Medal clue numbers must all be distinct
        const gc = Number(g.goldClue), sc = Number(g.silverClue), bc = Number(g.bronzeClue);
        if (Number.isInteger(gc) && Number.isInteger(sc) && Number.isInteger(bc)) {
          if (gc === sc || gc === bc || sc === bc) {
            errors.push(`${label}: goldClue, silverClue, bronzeClue must all be different (got ${gc}, ${sc}, ${bc})`);
          }
        }

        ['goldWinners', 'silverWinners', 'bronzeWinners'].forEach(k => {
          if (typeof g[k] !== 'number' || !isFinite(g[k]) || g[k] < 0) {
            errors.push(`${label}: "${k}" must be a non-negative number (got ${JSON.stringify(g[k])})`);
          }
        });

        ['goldPayout', 'silverPayout', 'bronzePayout'].forEach(k => {
          if (typeof g[k] !== 'number' || !isFinite(g[k]) || g[k] < 0) {
            errors.push(`${label}: "${k}" must be a non-negative number (got ${JSON.stringify(g[k])})`);
          }
        });

        // totalWinners must equal sum of medal winners
        const goldW = typeof g.goldWinners === 'number' ? g.goldWinners : 0;
        const silverW = typeof g.silverWinners === 'number' ? g.silverWinners : 0;
        const bronzeW = typeof g.bronzeWinners === 'number' ? g.bronzeWinners : 0;
        const computedTotal = goldW + silverW + bronzeW;
        if (typeof g.totalWinners === 'number' && Number.isInteger(g.totalWinners) && g.totalWinners !== computedTotal) {
          errors.push(`${label}: totalWinners (${g.totalWinners}) does not equal goldWinners+silverWinners+bronzeWinners (${computedTotal})`);
        }
      }

      // Duplicate within this import batch.
      // Same date with different answers is fine (two games per day is normal).
      // Only block if BOTH date AND secretItem are identical.
      if (g.date && g.secretItem) {
        const key = g.date + '||' + g.secretItem;
        if (seenKeys.has(key)) {
          errors.push(`${label}: same answer ("${g.secretItem}") already used for date "${g.date}" earlier in this import — two games on the same date is fine, but both cannot have the same secretItem`);
        }
        seenKeys.add(key);
      }

      // Collision with existing database
      if (g.date && g.secretItem && existingKeys.has(g.date + '||' + g.secretItem)) {
        errors.push(`${label}: a game with answer "${g.secretItem}" on date "${g.date}" already exists in the database — remove this duplicate from the import`);
      }
    });

    return errors;
  }

  previewImport() {
    const raw     = document.getElementById('import-json').value.trim();
    const preview = document.getElementById('import-preview');
    const btn     = document.getElementById('btn-publish');
    const status  = document.getElementById('import-status');
    preview.innerHTML = '';
    status.className  = 'hidden';
    this._pendingGames = null;
    btn.disabled = true;

    if (!raw) {
      preview.classList.remove('hidden');
      preview.innerHTML = `<div class="text-red-400 text-sm bg-red-900/20 p-3 rounded">Nothing to import — paste JSON above first.</div>`;
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) parsed = [parsed];
    } catch (e) {
      preview.classList.remove('hidden');
      preview.innerHTML = `<div class="text-red-400 text-sm bg-red-900/20 p-3 rounded">Invalid JSON: ${e.message}</div>`;
      return;
    }

    const errors = this._validateGames(parsed, this.games);

    if (errors.length) {
      preview.classList.remove('hidden');
      preview.innerHTML = `<div class="text-red-400 text-sm bg-red-900/20 p-3 rounded space-y-1"><div class="font-bold mb-2">⛔ Import blocked — fix these errors before publishing:</div>${errors.map(e => `<div class="pl-2">• ${this._escapeHtml(e)}</div>`).join('')}</div>`;
      return;
    }

    this._pendingGames = parsed;
    preview.classList.remove('hidden');
    preview.innerHTML = parsed.map(g => {
      const esc = (v) => this._escapeHtml(v);
      return `
      <div class="glass-panel p-4 rounded-lg border ${g.format==='v2'?'border-yellow-600/30':'border-slate-700'}">
        <div class="flex justify-between items-start gap-4">
          <div>
            <span class="text-[10px] ${g.format==='v2'?'text-yellow-400 bg-yellow-900/30':'text-slate-400 bg-slate-800'} px-2 py-0.5 rounded font-bold uppercase">${g.format==='v2'?'V2 FORMAT':'V1 FORMAT'} · ${esc(g.date)}</span>
            <div class="text-xl font-bold font-display text-white mt-1">${esc(g.secretItem)}</div>
            <div class="text-xs text-slate-400 mt-1 uppercase tracking-widest">Host: ${esc(g.host||'?')} <span class="mx-2 opacity-30">|</span> Pot: $${(g.pot||0).toLocaleString()}</div>
          </div>
          <div class="text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 shrink-0 text-right">
            ${g.format==='v2' ?
              `<div class="flex gap-3 font-bold">
                 <div class="flex flex-col items-center"><span class="text-[10px] text-slate-500 uppercase">1st (C${g.goldClue})</span><span class="text-yellow-500">${g.goldWinners} WIN</span></div>
                 <div class="flex flex-col items-center border-l border-slate-700 pl-3"><span class="text-[10px] text-slate-500 uppercase">2nd (C${g.silverClue})</span><span class="text-slate-300">${g.silverWinners} WIN</span></div>
                 <div class="flex flex-col items-center border-l border-slate-700 pl-3"><span class="text-[10px] text-slate-500 uppercase">3rd (C${g.bronzeClue})</span><span class="text-orange-400">${g.bronzeWinners} WIN</span></div>
               </div>` :
              `<div class="font-bold flex flex-col items-center"><span class="text-[10px] text-slate-500 uppercase">WINNING CLUE:</span><span class="text-white text-lg">C${g.goldClue}</span></div>`}
          </div>
        </div>
        <div class="mt-3 text-[10px] text-slate-400 flex flex-col gap-1.5 divide-y divide-slate-800/50 border border-slate-800 rounded p-2 bg-slate-900/30">
          ${g.clues.map((c,i)=>`<div class="pt-1.5 first:pt-0"><b class="text-slate-300">C${i+1}:</b> ${esc(c.text)} <span class="opacity-50 mx-1">/</span> ${esc(c.correct)} correct <span class="opacity-50 mx-1">/</span> ${esc(c.guesses)} total</div>`).join('')}
        </div>
        <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="bg-slate-900/50 border border-slate-700/50 p-2.5 rounded-lg overflow-hidden">
            <span class="text-[10px] text-red-400 font-bold uppercase tracking-widest block mb-1">Popular Wrong Guesses</span>
            <div class="text-slate-300 text-xs capitalize truncate" title="${esc(g.wrongGuesses)}">${esc(g.wrongGuesses || 'None listed')}</div>
          </div>
          <div class="bg-slate-900/50 border border-slate-700/50 p-2.5 rounded-lg overflow-hidden">
            <span class="text-[10px] text-green-400 font-bold uppercase tracking-widest block mb-1">Winners (${g.totalWinners})</span>
            <div class="text-slate-300 text-xs capitalize truncate" title="${esc(g.winnerNames)}">${esc(g.winnerNames || 'None listed')}</div>
          </div>
        </div>
      </div>`;
    }).join('');
    btn.disabled = false;
  }

  copyGeminiPrompt(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const txt = document.getElementById('gemini-prompt-text').innerText;
    navigator.clipboard.writeText(txt).then(() => {
      const btn = e.target;
      const old = btn.innerText;
      btn.innerText = 'Copied!';
      btn.classList.add('bg-green-700', 'border-green-600');
      setTimeout(() => {
        btn.innerText = old;
        btn.classList.remove('bg-green-700', 'border-green-600');
      }, 2000);
    }).catch(console.error);
  }

  async publishImport() {
    // No overwrite or replace logic; only allow adding new games if no collision
    if (!this._pendingGames || !Array.isArray(this._pendingGames) || this._pendingGames.length === 0) {
      alert("No games to publish. Please preview the JSON first.");
      return;
    }
    const owner = localStorage.getItem('gh_owner');
    const repo  = localStorage.getItem('gh_repo');
    const pat   = this._ghPat;
    const status = document.getElementById('import-status');
    const btn    = document.getElementById('btn-publish');

    if (!owner || !repo || !pat) {
      alert("Please save your GitHub Settings (Owner, Repo, PAT) first in the Admin Panel.");
      status.className = 'text-sm font-medium px-4 py-2 rounded bg-red-900/20 text-red-400';
      status.innerText = 'Save your GitHub settings first.';
      status.classList.remove('hidden');
      return;
    }

    btn.disabled = true;
    btn.innerText = 'Publishing...';
    status.className = 'text-sm font-medium px-4 py-2 rounded bg-blue-900/20 text-blue-400';
    status.innerText = 'Fetching current games.json from GitHub...';
    status.classList.remove('hidden');

    try {
      const remoteState = await this._getRemoteGamesState(owner, repo, pat);
      const existing = remoteState.games;

      // Safety 2: re-validate pending games against the live database (defense in depth)
      const revalidationErrors = this._validateGames(this._pendingGames, existing);
      if (revalidationErrors.length) {
        throw new Error(`Validation failed against live data:\n• ${revalidationErrors.join('\n• ')}`);
      }

      // Safety 3: merged array must be exactly pending + existing in size (no deletions)
      // Keep imports prepended so freshest entries appear first in source order.
      const merged = [...this._pendingGames, ...existing];
      if (merged.length !== existing.length + this._pendingGames.length) {
        throw new Error(`Safety check failed: expected ${existing.length + this._pendingGames.length} total records but got ${merged.length}. Aborting.`);
      }

      // Safety 4: encode and verify it round-trips cleanly before sending to GitHub
      const content = this._b64EncodeUTF8(JSON.stringify(merged, null, 2));
      let roundTripped;
      try {
        roundTripped = JSON.parse(this._b64DecodeUTF8(content));
      } catch (rtErr) {
        throw new Error(`Encoding verification failed (could not decode what was encoded): ${rtErr.message}. Aborting.`);
      }
      if (!Array.isArray(roundTripped) || roundTripped.length !== merged.length) {
        throw new Error(`Encoding verification failed: round-trip produced ${roundTripped?.length ?? 'invalid'} records, expected ${merged.length}. Aborting.`);
      }

      // Safety 5: all checks passed — show the admin a count summary before committing
      status.innerText = `Verified: ${existing.length} existing + ${this._pendingGames.length} new = ${merged.length} total. Committing...`;

      const commitMsg = `Import ${this._pendingGames.length} game${this._pendingGames.length>1?'s':''}: ${this._pendingGames.map(g=>g.secretItem).join(', ')}`;
      await this._commitGamesState(owner, repo, pat, remoteState, merged, commitMsg);

      // 4. Update local state
      const publishedCount = this._pendingGames.length;
      this.games = merged;
      this._normalizeGames(this.games);
      this.populateDeleteDates();
      this._pendingGames = null;
      document.getElementById('import-json').value = '';
      document.getElementById('import-preview').classList.add('hidden');
      btn.disabled = true;
      btn.innerText = 'Publish to GitHub';

      status.className = 'text-sm font-medium px-4 py-2 rounded bg-green-900/20 text-green-400';
      status.innerText = `✓ ${publishedCount} game${publishedCount > 1 ? 's' : ''} published! GitHub Pages will rebuild in ~30 seconds.`;
    } catch (e) {
      status.className = 'text-sm font-medium px-4 py-2 rounded bg-red-900/20 text-red-400';
      status.innerText = `Error: ${e.message}`;
      btn.disabled = false;
      btn.innerText = 'Publish to GitHub';
    }
  }
*/
