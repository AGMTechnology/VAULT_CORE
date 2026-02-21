function navButton(id, label, active = false) {
  return `<button data-hub="${id}" class="${active ? "is-active" : ""}">${label}</button>`;
}

export function renderWebShellHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>VAULT_CORE Workspace</title>
    <link rel="stylesheet" href="/app.css" />
  </head>
  <body>
    <div class="vc-shell">
      <aside class="vc-sidebar">
        <div class="vc-brand">
          <div class="vc-brand-icon">V</div>
          <div class="vc-brand-title">VAULT<b>_CORE</b></div>
        </div>
        <div class="vc-badge">DESIGN SYSTEM v1.0</div>
        <hr class="vc-sidebar-sep" />
        <nav class="vc-nav" aria-label="Hub navigation">
          ${navButton("dashboard", "Dashboard", true)}
          ${navButton("contracts", "Contracts")}
          ${navButton("execution", "Execution")}
          ${navButton("memory", "Memory Hub")}
          ${navButton("agents", "Agent Hub")}
          ${navButton("skills", "Skills Hub")}
          ${navButton("rules", "Rules Hub")}
          ${navButton("docs", "Docs Hub")}
        </nav>
        <div class="vc-sidebar-footer">Built for AI orchestration</div>
      </aside>
      <main class="vc-main">
        <header class="vc-header">
          <div class="vc-header-title">
            <h1>VAULT_CORE</h1>
            <p>Unified control plane for contracts, memory, skills, rules and docs.</p>
          </div>
          <div class="vc-header-actions">
            <span id="status-pill" class="vc-status-pill">hub: dashboard</span>
            <button id="refresh-button" class="vc-button">Refresh</button>
          </div>
        </header>
        <div id="feedback" class="vc-feedback"></div>
        <section id="hub-root" aria-live="polite"></section>
      </main>
    </div>
    <script type="module" src="/app.js"></script>
  </body>
</html>`;
}
