// ====== Storage ======
const KEYS = { users:"ssp_users", exchanges:"ssp_exchanges", messages:"ssp_messages", me:"ssp_me", theme:"ssp_theme", filter:"ssp_filter" };
const get = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch { return fb; } };
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

let users = get(KEYS.users, null);
if (!users) { users = SEED_USERS; set(KEYS.users, users); }
let exchanges = get(KEYS.exchanges, []);
let messages = get(KEYS.messages, {});
let me = get(KEYS.me, { id:"me", name:"You", school:"Your school", year:"Student", bio:"Tell others about yourself.", category:"Tech", rating:0, sessions:0, teach:[], learn:[] });

// ====== Theme ======
const savedTheme = get(KEYS.theme, "light");
document.documentElement.setAttribute("data-theme", savedTheme);
document.getElementById("theme-toggle").textContent = savedTheme === "dark" ? "☀️" : "🌙";
document.getElementById("theme-toggle").addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  set(KEYS.theme, next);
  document.getElementById("theme-toggle").textContent = next === "dark" ? "☀️" : "🌙";
});

// ====== Helpers ======
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const initials = n => n.split(" ").map(p => p[0]).slice(0,2).join("").toUpperCase();
const userById = id => id === "me" ? me : users.find(u => u.id === id);
const toast = msg => {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.remove("hidden");
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => t.classList.add("hidden"), 2400);
};

// ====== Modal ======
const modalEl = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
function openModal(html) { modalContent.innerHTML = html; modalEl.classList.remove("hidden"); }
function closeModal() { modalEl.classList.add("hidden"); modalContent.innerHTML = ""; }
modalEl.addEventListener("click", e => { if (e.target.dataset.close !== undefined) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ====== Router ======
const routes = ["home","browse","exchanges","chat","post","profile","user"];
function getRoute() {
  const hash = location.hash.replace(/^#/, "") || "home";
  const [name, arg] = hash.split("/");
  return { name: routes.includes(name) ? name : "home", arg };
}
function navigate(name, arg) { location.hash = arg ? `${name}/${arg}` : name; }
window.addEventListener("hashchange", render);

// Wire data-route attrs
document.body.addEventListener("click", e => {
  const t = e.target.closest("[data-route]");
  if (!t) return;
  e.preventDefault();
  navigate(t.dataset.route, t.dataset.arg);
});

// ====== Pages ======
function renderHome() {
  const tutors = users.slice(0, 6);
  const totalSkills = new Set(users.flatMap(u => u.teach)).size;
  return `
    <section class="hero">
      <div class="container">
        <span class="eyebrow"><span class="dot"></span>Now matching ${users.length} students worldwide</span>
        <h1>Trade skills, <span class="grad">not tuition.</span></h1>
        <p class="lead">SkillSwap connects students who want to learn with students who can teach. No money. No middlemen. Just exchange.</p>
        <form class="search" onsubmit="event.preventDefault();const q=this.q.value;navigate('browse');setTimeout(()=>{const i=document.getElementById('search-input');if(i){i.value=q;i.dispatchEvent(new Event('input'))}},50)">
          <input name="q" type="search" placeholder="Search a skill — Python, Spanish, Guitar…" />
          <button type="submit" class="btn btn-primary">Find a tutor</button>
        </form>
        <div class="hero-stats">
          <div class="stat"><strong>${users.length}+</strong><span>Active students</span></div>
          <div class="stat"><strong>${totalSkills}+</strong><span>Skills shared</span></div>
          <div class="stat"><strong>4.8★</strong><span>Avg rating</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div><h2>Browse by category</h2><p>Find a swap partner in seconds.</p></div>
        </div>
        <div class="cats">
          ${CATEGORIES.map(c => `
            <a class="cat" href="#browse/${encodeURIComponent(c.key)}" data-route="browse" data-arg="${esc(c.key)}">
              <span class="emoji">${c.emoji}</span>
              <strong>${c.key}</strong>
              <span>${c.desc}</span>
            </a>
          `).join("")}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <div><h2>Featured tutors</h2><p>Top-rated students ready to swap.</p></div>
          <button class="btn btn-ghost" data-route="browse">See all →</button>
        </div>
        <div class="grid">${tutors.map(userCard).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>How it works</h2>
        <div class="steps">
          <div class="step"><span class="num">1</span><h3>Post your skills</h3><p>List what you can teach and what you want to learn.</p></div>
          <div class="step"><span class="num">2</span><h3>Find a match</h3><p>Browse by category or search instantly.</p></div>
          <div class="step"><span class="num">3</span><h3>Send a swap</h3><p>Propose an exchange with one click.</p></div>
          <div class="step"><span class="num">4</span><h3>Chat & learn</h3><p>Coordinate sessions in our built-in chat.</p></div>
        </div>
      </div>
    </section>
  `;
}

function userCard(u) {
  return `
    <article class="card">
      <div class="card-head">
        <div class="avatar">${initials(u.name)}</div>
        <div>
          <h3>${esc(u.name)}</h3>
          <p class="meta">${esc(u.year)} · ${esc(u.school)}</p>
          <span class="rating">★ ${u.rating} <span class="muted small">(${u.sessions})</span></span>
        </div>
      </div>
      <p class="muted small" style="margin:0">${esc(u.bio)}</p>
      <div>
        <div class="row-label">Teaches</div>
        <div>${u.teach.slice(0,3).map(t => `<span class="tag teach">${esc(t)}</span>`).join("")}</div>
        <div class="row-label">Wants</div>
        <div>${u.learn.slice(0,3).map(t => `<span class="tag learn">${esc(t)}</span>`).join("")}</div>
      </div>
      <div class="card-actions">
        <button class="btn btn-ghost btn-sm" data-route="user" data-arg="${u.id}">View</button>
        <button class="btn btn-primary btn-sm" onclick="proposeSwap('${u.id}')">Propose swap</button>
      </div>
    </article>
  `;
}

function renderBrowse(arg) {
  const stored = get(KEYS.filter, { cat:"All", q:"" });
  if (arg) stored.cat = decodeURIComponent(arg);
  set(KEYS.filter, stored);
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div><h2>Browse students</h2><p>${users.length} students sharing skills.</p></div>
        </div>
        <div class="filters">
          <div class="search-inline">
            <span>🔍</span>
            <input id="search-input" type="search" placeholder="Search by name or skill" value="${esc(stored.q)}" />
          </div>
        </div>
        <div class="filters">
          ${["All", ...CATEGORIES.map(c=>c.key)].map(c => `
            <button class="chip ${stored.cat===c?'active':''}" data-cat="${esc(c)}">${c}</button>
          `).join("")}
        </div>
        <div id="results" class="grid"></div>
      </div>
    </section>
  `;
}

function applyBrowseFilters() {
  const f = get(KEYS.filter, { cat:"All", q:"" });
  const q = f.q.toLowerCase().trim();
  const filtered = users.filter(u => {
    if (f.cat !== "All" && u.category !== f.cat) return false;
    if (!q) return true;
    return [u.name, u.bio, ...u.teach, ...u.learn].join(" ").toLowerCase().includes(q);
  });
  const el = document.getElementById("results");
  el.innerHTML = filtered.length
    ? filtered.map(userCard).join("")
    : `<div class="empty" style="grid-column:1/-1"><span class="emoji">🔍</span><p>No matches. Try a different search.</p></div>`;
}

function bindBrowse() {
  document.getElementById("search-input")?.addEventListener("input", e => {
    const f = get(KEYS.filter, { cat:"All", q:"" });
    f.q = e.target.value; set(KEYS.filter, f); applyBrowseFilters();
  });
  document.querySelectorAll(".chip[data-cat]").forEach(b => {
    b.addEventListener("click", () => {
      const f = get(KEYS.filter, { cat:"All", q:"" });
      f.cat = b.dataset.cat; set(KEYS.filter, f);
      document.querySelectorAll(".chip[data-cat]").forEach(c => c.classList.toggle("active", c===b));
      applyBrowseFilters();
    });
  });
  applyBrowseFilters();
}

function renderUser(id) {
  const u = userById(id);
  if (!u) return `<section class="section"><div class="container empty"><span class="emoji">👻</span><p>User not found.</p><button class="btn btn-primary" data-route="browse">Back to browse</button></div></section>`;
  return `
    <section class="section">
      <div class="container">
        <button class="btn btn-ghost btn-sm" data-route="browse" style="margin-bottom:1rem">← Back</button>
        <div class="profile-hero">
          <div class="avatar avatar-lg">${initials(u.name)}</div>
          <div style="flex:1;min-width:200px">
            <h2>${esc(u.name)}</h2>
            <p class="meta">${esc(u.year)} · ${esc(u.school)} · <span class="rating">★ ${u.rating}</span> <span class="muted small">(${u.sessions} sessions)</span></p>
            <p style="margin:0">${esc(u.bio)}</p>
          </div>
          <div style="display:flex;gap:.5rem;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="proposeSwap('${u.id}')">Propose swap</button>
            <button class="btn btn-ghost" onclick="startChatWith('${u.id}')">Message</button>
          </div>
        </div>
        <div class="profile-skills">
          <div class="skill-block">
            <h3>Can teach</h3>
            <div>${u.teach.map(t => `<span class="tag teach">${esc(t)}</span>`).join("")}</div>
          </div>
          <div class="skill-block">
            <h3>Wants to learn</h3>
            <div>${u.learn.map(t => `<span class="tag learn">${esc(t)}</span>`).join("")}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderExchanges() {
  const list = exchanges.slice().reverse();
  const incoming = list.filter(x => x.toId === "me");
  const outgoing = list.filter(x => x.fromId === "me");
  const renderItem = (x, type) => {
    const other = type === "in" ? userById(x.fromId) : userById(x.toId);
    if (!other) return "";
    return `
      <div class="exchange">
        <div class="avatar">${initials(other.name)}</div>
        <div class="info">
          <strong>${esc(other.name)}</strong>
          <p>${type==="in"?"Wants you to teach":"You want to learn"} <strong>${esc(x.theirSkill)}</strong> · in exchange for <strong>${esc(x.mySkill)}</strong></p>
        </div>
        <span class="status ${x.status}">${x.status}</span>
        <div style="display:flex;gap:.4rem">
          ${x.status === "pending" && type === "in" ? `
            <button class="btn btn-teal btn-sm" onclick="setStatus('${x.id}','accepted')">Accept</button>
            <button class="btn btn-ghost btn-sm" onclick="setStatus('${x.id}','declined')">Decline</button>
          ` : ""}
          ${x.status === "accepted" ? `<button class="btn btn-primary btn-sm" onclick="startChatWith('${other.id}')">Chat</button>` : ""}
        </div>
      </div>
    `;
  };
  return `
    <section class="section">
      <div class="container">
        <div class="section-head"><div><h2>Your exchanges</h2><p>Manage incoming and outgoing swap requests.</p></div></div>
        <h3 style="margin-top:1rem">Incoming (${incoming.length})</h3>
        <div class="exchange-list">
          ${incoming.length ? incoming.map(x => renderItem(x,"in")).join("") : `<div class="empty"><span class="emoji">📭</span><p>No incoming requests yet.</p></div>`}
        </div>
        <h3 style="margin-top:2rem">Outgoing (${outgoing.length})</h3>
        <div class="exchange-list">
          ${outgoing.length ? outgoing.map(x => renderItem(x,"out")).join("") : `<div class="empty"><span class="emoji">✉️</span><p>You haven't sent any swaps. <a href="#browse" data-route="browse" style="color:var(--coral);font-weight:600">Browse students →</a></p></div>`}
        </div>
      </div>
    </section>
  `;
}

function renderChat(arg) {
  const partners = Object.keys(messages);
  const active = arg || partners[0];
  const renderList = () => partners.length ? partners.map(pid => {
    const u = userById(pid); if (!u) return "";
    const last = (messages[pid] || []).slice(-1)[0];
    return `<div class="chat-item ${pid===active?'active':''}" onclick="navigate('chat','${pid}')">
      <div class="avatar">${initials(u.name)}</div>
      <div style="overflow:hidden"><strong>${esc(u.name)}</strong><span>${last ? esc(last.text.slice(0,30)) : "Start chatting"}</span></div>
    </div>`;
  }).join("") : `<div class="empty" style="padding:2rem 1rem"><p>No chats yet.</p></div>`;

  const renderThread = () => {
    if (!active) return `<div class="chat-empty"><div><span style="font-size:3rem">💬</span><p>Pick a conversation or accept an exchange to start chatting.</p><button class="btn btn-primary" data-route="browse">Find students</button></div></div>`;
    const u = userById(active); if (!u) return `<div class="chat-empty">User not found</div>`;
    const thread = messages[active] || [];
    return `
      <div class="chat-header">
        <div class="avatar">${initials(u.name)}</div>
        <div><strong>${esc(u.name)}</strong><div class="muted small">${esc(u.year)}</div></div>
      </div>
      <div class="chat-body" id="chat-body">
        ${thread.length ? thread.map(m => `<div class="bubble ${m.from==='me'?'me':'them'}">${esc(m.text)}</div>`).join("") : `<div class="muted small" style="text-align:center;margin:auto">Say hi 👋</div>`}
      </div>
      <form class="chat-input" onsubmit="sendMessage(event,'${active}')">
        <input name="text" placeholder="Type a message…" autocomplete="off" required />
        <button class="btn btn-primary" type="submit">Send</button>
      </form>
    `;
  };

  return `
    <section class="section">
      <div class="container">
        <div class="section-head"><div><h2>Chat</h2><p>Coordinate your skill swap.</p></div></div>
        <div class="chat-shell">
          <div class="chat-list">${renderList()}</div>
          <div class="chat-main">${renderThread()}</div>
        </div>
      </div>
    </section>
  `;
}

function renderPost() {
  return `
    <section class="section">
      <div class="container" style="max-width:640px">
        <div class="section-head"><div><h2>Post a skill</h2><p>Add or update what you offer and want to learn.</p></div></div>
        <form class="form" onsubmit="savePost(event)">
          <div class="form-row">
            <label>Your name<input name="name" required value="${esc(me.name)}" /></label>
            <label>Category
              <select name="category">${CATEGORIES.map(c => `<option ${me.category===c.key?'selected':''}>${c.key}</option>`).join("")}</select>
            </label>
          </div>
          <div class="form-row">
            <label>School<input name="school" value="${esc(me.school)}" /></label>
            <label>Year & Major<input name="year" value="${esc(me.year)}" placeholder="e.g. Junior · CS" /></label>
          </div>
          <label>Skills you can teach <span class="hint">(comma-separated)</span>
            <input name="teach" value="${esc(me.teach.join(", "))}" placeholder="Python, Algorithms" required />
          </label>
          <label>Skills you want to learn <span class="hint">(comma-separated)</span>
            <input name="learn" value="${esc(me.learn.join(", "))}" placeholder="Spanish, Guitar" required />
          </label>
          <label>Short bio<textarea name="bio" rows="3">${esc(me.bio)}</textarea></label>
          <button type="submit" class="btn btn-primary btn-block">Save profile</button>
        </form>
      </div>
    </section>
  `;
}

function renderProfile() {
  return `
    <section class="section">
      <div class="container">
        <div class="profile-hero">
          <div class="avatar avatar-lg">${initials(me.name)}</div>
          <div style="flex:1;min-width:200px">
            <h2>${esc(me.name)}</h2>
            <p class="meta">${esc(me.year)} · ${esc(me.school)}</p>
            <p style="margin:0">${esc(me.bio)}</p>
          </div>
          <button class="btn btn-primary" data-route="post">Edit profile</button>
        </div>
        <div class="profile-skills">
          <div class="skill-block">
            <h3>You teach</h3>
            <div>${me.teach.length ? me.teach.map(t => `<span class="tag teach">${esc(t)}</span>`).join("") : `<p class="muted small">No skills listed yet.</p>`}</div>
          </div>
          <div class="skill-block">
            <h3>You want to learn</h3>
            <div>${me.learn.length ? me.learn.map(t => `<span class="tag learn">${esc(t)}</span>`).join("") : `<p class="muted small">No skills listed yet.</p>`}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ====== Actions ======
function proposeSwap(toId) {
  const target = userById(toId); if (!target) return;
  if (!me.teach.length) {
    openModal(`<h3>Add a skill first</h3><p>You need to list at least one skill you can teach before proposing a swap.</p><button class="btn btn-primary btn-block" onclick="closeModal();navigate('post')">Set up profile</button>`);
    return;
  }
  openModal(`
    <h3>Propose a swap</h3>
    <p class="muted small">with <strong>${esc(target.name)}</strong></p>
    <form class="form" onsubmit="submitSwap(event,'${toId}')" style="background:transparent;padding:0;border:0">
      <label>You want to learn (from them)
        <select name="theirSkill" required>${target.teach.map(s => `<option>${esc(s)}</option>`).join("")}</select>
      </label>
      <label>You'll teach in return
        <select name="mySkill" required>${me.teach.map(s => `<option>${esc(s)}</option>`).join("")}</select>
      </label>
      <label>Note (optional)<textarea name="note" rows="2" placeholder="Hi! I'd love to swap…"></textarea></label>
      <button class="btn btn-primary btn-block">Send request</button>
    </form>
  `);
}

function submitSwap(e, toId) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const x = {
    id: "x" + Date.now(),
    fromId: "me",
    toId,
    theirSkill: fd.get("theirSkill"),
    mySkill: fd.get("mySkill"),
    note: fd.get("note") || "",
    status: "pending",
    createdAt: Date.now(),
  };
  exchanges.push(x); set(KEYS.exchanges, exchanges);
  closeModal();
  toast("Swap request sent ✓");
  updateBadge();
  // Auto-simulate response after a beat
  setTimeout(() => {
    const found = exchanges.find(e => e.id === x.id);
    if (found && found.status === "pending") {
      found.status = "accepted";
      set(KEYS.exchanges, exchanges);
      if (getRoute().name === "exchanges") render();
      toast(`${userById(toId).name} accepted your swap!`);
    }
  }, 4000);
}

function setStatus(id, status) {
  const x = exchanges.find(e => e.id === id); if (!x) return;
  x.status = status; set(KEYS.exchanges, exchanges); render();
  toast(`Swap ${status}`);
}

function startChatWith(id) {
  if (!messages[id]) { messages[id] = []; set(KEYS.messages, messages); }
  navigate("chat", id);
}

function sendMessage(e, partnerId) {
  e.preventDefault();
  const text = e.target.text.value.trim();
  if (!text) return;
  if (!messages[partnerId]) messages[partnerId] = [];
  messages[partnerId].push({ from:"me", text, ts:Date.now() });
  set(KEYS.messages, messages);
  e.target.reset();
  render();
  // Simulated reply
  setTimeout(() => {
    const replies = ["Sounds good!","Let me check my schedule.","Awesome — when works for you?","Got it 👍","Thanks for reaching out!"];
    messages[partnerId].push({ from:"them", text: replies[Math.floor(Math.random()*replies.length)], ts:Date.now() });
    set(KEYS.messages, messages);
    if (getRoute().name === "chat") render();
  }, 1200);
}

function savePost(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  me = {
    ...me,
    name: fd.get("name").trim(),
    school: fd.get("school").trim(),
    year: fd.get("year").trim(),
    category: fd.get("category"),
    bio: fd.get("bio").trim(),
    teach: fd.get("teach").split(",").map(s=>s.trim()).filter(Boolean),
    learn: fd.get("learn").split(",").map(s=>s.trim()).filter(Boolean),
  };
  set(KEYS.me, me);
  toast("Profile saved ✓");
  navigate("profile");
}

function updateBadge() {
  const pending = exchanges.filter(x => x.toId === "me" && x.status === "pending").length;
  const b = document.getElementById("badge-exchanges");
  if (pending > 0) { b.textContent = pending; b.classList.remove("hidden"); }
  else b.classList.add("hidden");
}

// Seed a demo incoming exchange on first visit
if (!get("ssp_seeded_exchange", false) && exchanges.length === 0) {
  exchanges.push({
    id:"x_seed", fromId:"u3", toId:"me",
    theirSkill:"UI Design", mySkill:"Python",
    note:"Hey! I'd love to swap design tips for some Python help.",
    status:"pending", createdAt:Date.now(),
  });
  set(KEYS.exchanges, exchanges);
  set("ssp_seeded_exchange", true);
}

// ====== Render ======
function render() {
  const r = getRoute();
  const app = document.getElementById("app");
  let html = "";
  if (r.name === "home") html = renderHome();
  else if (r.name === "browse") html = renderBrowse(r.arg);
  else if (r.name === "user") html = renderUser(r.arg);
  else if (r.name === "exchanges") html = renderExchanges();
  else if (r.name === "chat") html = renderChat(r.arg);
  else if (r.name === "post") html = renderPost();
  else if (r.name === "profile") html = renderProfile();
  app.innerHTML = html;

  document.querySelectorAll(".primary-nav a").forEach(a => {
    a.classList.toggle("active", a.dataset.route === r.name);
  });

  if (r.name === "browse") bindBrowse();
  if (r.name === "chat") {
    const body = document.getElementById("chat-body");
    if (body) body.scrollTop = body.scrollHeight;
  }
  updateBadge();
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.getElementById("year").textContent = new Date().getFullYear();
render();
