/* ═══════════════════════════════════════
   GENEL DEĞİŞKENLER
═══════════════════════════════════════ */
var currentUserId = (function() {
    var el = document.getElementById('current-user-id');
    return el ? parseInt(el.getAttribute('data-id')) : null;
})();
var currentAppId = null;

/* ═══════════════════════════════════════
   CHAT — OKUNMAMI SAYACI
═══════════════════════════════════════ */
function loadUnreadCount() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/chat/unread-count', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data  = JSON.parse(xhr.responseText);
            var badge = document.getElementById('msg-notif');
            if (!badge) return;
            if (data.count > 0) {
                document.getElementById('msg-notif-count').textContent = data.count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    };
    xhr.send();
}

if (document.getElementById('msg-notif')) {
    loadUnreadCount();
    setInterval(loadUnreadCount, 30000);
}

/* ═══════════════════════════════════════
   CHAT — DRAWER AÇ/KAPAT
═══════════════════════════════════════ */
function openChat(btn) {
    currentAppId = btn.getAttribute('data-appid');
    document.getElementById('chat-title').textContent = btn.getAttribute('data-name');
    document.getElementById('chat-overlay').style.display = 'block';
    var drawer = document.getElementById('chat-drawer');
    drawer.style.display = 'flex';
    drawer.classList.add('open');
    loadMessages();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/chat/' + currentAppId + '/read', true);
    xhr.onload = function() { loadUnreadCount(); };
    xhr.send();
}

function closeChat() {
    var drawer = document.getElementById('chat-drawer');
    drawer.classList.remove('open');
    drawer.style.display = 'none';
    document.getElementById('chat-overlay').style.display = 'none';
    currentAppId = null;
}

function openLastChat() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/chat/last-application', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            if (data.appId) {
                currentAppId = data.appId;
                document.getElementById('chat-title').textContent = data.name;
                document.getElementById('chat-overlay').style.display = 'block';
                var drawer = document.getElementById('chat-drawer');
                drawer.style.display = 'flex';
                drawer.classList.add('open');
                loadMessages();
                var xhr2 = new XMLHttpRequest();
                xhr2.open('POST', '/chat/' + currentAppId + '/read', true);
                xhr2.onload = function() { loadUnreadCount(); };
                xhr2.send();
            }
        }
    };
    xhr.send();
}

/* ═══════════════════════════════════════
   CHAT — MESAJLAR
═══════════════════════════════════════ */
function loadMessages() {
    var box = document.getElementById('chat-messages');
    box.textContent = '';
    var loading = document.createElement('div');
    loading.className = 'chat-empty';
    loading.textContent = 'Yükleniyor...';
    box.appendChild(loading);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/chat/' + currentAppId + '/messages', true);
    xhr.onload = function() {
        box.textContent = '';
        if (xhr.status === 200) {
            var msgs = JSON.parse(xhr.responseText);
            if (msgs.length === 0) {
                var empty = document.createElement('div');
                empty.className = 'chat-empty';
                empty.textContent = 'Henüz mesaj yok. İlk mesajı siz gönderin! 👋';
                box.appendChild(empty);
            } else {
                msgs.forEach(function(m) { appendMessage(m); });
                box.scrollTop = box.scrollHeight;
            }
        } else {
            var err = document.createElement('div');
            err.className = 'chat-empty';
            err.textContent = 'Mesajlar yüklenemedi.';
            box.appendChild(err);
        }
    };
    xhr.send();
}

function appendMessage(m) {
    var box    = document.getElementById('chat-messages');
    var isMine = (m.senderId == currentUserId);
    var wrap   = document.createElement('div');
    wrap.className = 'msg-bubble-wrap ' + (isMine ? 'mine' : 'other');
    var bubble = document.createElement('div');
    bubble.className = 'msg-bubble ' + (isMine ? 'mine' : 'other');
    bubble.textContent = m.content;
    var meta = document.createElement('div');
    meta.className = 'msg-meta';
    meta.textContent = m.senderName + ' · ' + (m.sentAt ? m.sentAt.substring(11, 16) : '');
    wrap.appendChild(bubble);
    wrap.appendChild(meta);
    box.appendChild(wrap);
}

function sendMsg() {
    var input   = document.getElementById('chat-input');
    var content = input.value.trim();
    if (!content || !currentAppId) return;
    input.value = '';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/chat/' + currentAppId + '/send', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var msg   = JSON.parse(xhr.responseText);
            var box   = document.getElementById('chat-messages');
            var empty = box.querySelector('.chat-empty');
            if (empty) empty.remove();
            appendMessage(msg);
            box.scrollTop = box.scrollHeight;
        }
    };
    xhr.send(JSON.stringify({ content: content }));
}

/* ═══════════════════════════════════════
   HOME — FİLTRE & SCORE BAR
═══════════════════════════════════════ */
function filterCards(level, btn) {
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.job-card').forEach(function(card) {
        card.style.display = (level === 'all' || card.getAttribute('data-level') === level) ? '' : 'none';
    });
}

window.addEventListener('load', function() {
    document.querySelectorAll('.score-bar-fill').forEach(function(bar) {
        var w = bar.style.width;
        bar.style.width = '0%';
        setTimeout(function() { bar.style.width = w; }, 200);
    });
});

/* ═══════════════════════════════════════
   SKILL SEÇİMİ (ortak)
═══════════════════════════════════════ */
var checkedCount = 0;

function toggleSkill(label) {
    var cb = label.querySelector('input[type="checkbox"]');
    cb.checked = !cb.checked;
    label.classList.toggle('checked', cb.checked);
    checkedCount += cb.checked ? 1 : -1;
    var counter = document.getElementById('checked-count');
    if (counter) counter.textContent = checkedCount;
    updateProgress();
}

/* ═══════════════════════════════════════
   SKILL ARAMA (register-seeker)
═══════════════════════════════════════ */
function filterSkills(query) {
    var q = query.toLowerCase().trim();
    var visible = 0;
    document.querySelectorAll('.skill-item').forEach(function(item) {
        var name  = (item.dataset.name || item.querySelector('.skill-name').textContent).toLowerCase();
        var match = !q || name.includes(q);
        item.style.display = match ? '' : 'none';
        if (match) visible++;
    });
    var existing = document.getElementById('no-results');
    if (existing) existing.remove();
    if (visible === 0) {
        var msg = document.createElement('div');
        msg.id = 'no-results';
        msg.className = 'no-results';
        msg.textContent = '"' + query + '" için sonuç bulunamadı';
        document.getElementById('skills-grid').appendChild(msg);
    }
}

/* ═══════════════════════════════════════
   PROGRESS BAR (ortak)
═══════════════════════════════════════ */
function updateProgress() {
    var fill = document.getElementById('progress-fill');
    if (!fill) return;

    // employer-job-form
    if (document.getElementById('title')) {
        var fields = ['title', 'company', 'location'];
        var filled = fields.filter(function(id) {
            var el = document.getElementById(id);
            return el && el.value.trim();
        }).length;
        var skills = document.querySelectorAll('.skill-item.checked').length;
        fill.style.width = ((filled / fields.length) * 60 + Math.min(skills / 3, 1) * 40) + '%';
        return;
    }

    // register-seeker
    if (document.getElementById('name') && !document.getElementById('companyName')) {
        var name  = document.getElementById('name').value.trim();
        var email = document.getElementById('email').value.trim();
        var pass  = document.getElementById('password').value;
        var infoScore  = ((name ? 1 : 0) + (email ? 1 : 0) + (pass ? 1 : 0)) / 3 * 50;
        var skillScore = Math.min(checkedCount / 3, 1) * 50;
        fill.style.width = (infoScore + skillScore) + '%';
        return;
    }

    // register-employer
    if (document.getElementById('companyName')) {
        var fields2 = ['name', 'email', 'password', 'companyName', 'sector'];
        var filled2 = fields2.filter(function(id) {
            var el = document.getElementById(id);
            return el && el.value.trim();
        }).length;
        var terms = document.getElementById('terms-cb') && document.getElementById('terms-cb').checked ? 1 : 0;
        fill.style.width = ((filled2 + terms) / (fields2.length + 1)) * 100 + '%';
    }
}

// Progress input dinleyicileri
['name','email','password','companyName','sector','companySize','title','company','location','description'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', updateProgress);
        el.addEventListener('change', updateProgress);
    }
});

/* ═══════════════════════════════════════
   TERMS CHECKBOX (register-employer)
═══════════════════════════════════════ */
function toggleTerms() {
    var cb = document.getElementById('terms-cb');
    setTimeout(function() {
        var label = document.getElementById('terms-label');
        var box   = document.getElementById('terms-box');
        if (label) label.classList.toggle('checked', cb.checked);
        if (box)   box.textContent = cb.checked ? '✓' : '';
        updateProgress();
    }, 0);
}

/* ═══════════════════════════════════════
   LOGIN — ROL DEĞİŞTİRME
═══════════════════════════════════════ */
(function() {
    var roleEl = document.getElementById('role-hidden');
    if (!roleEl) return;

    var role = new URLSearchParams(window.location.search).get('role') || 'seeker';
    if (role !== 'employer') return;

    document.body.classList.add('employer');
    var map = {
        'panel-icon':  '🏢',
        'panel-badge': 'Employer Panel',
        'panel-title': 'Doğru adayı<br/>bulmak kolay.',
        'panel-desc':  'İlan oluşturun, algoritma en uygun adayları sizin için otomatik olarak sıralasın.',
        'stat1-num':   '8.1k+',
        'stat1-lbl':   'Kayıtlı aday',
        'stat2-num':   '4.8★',
        'stat2-lbl':   'Memnuniyet',
        'form-sub':    'İşveren hesabınıza giriş yapın.'
    };
    Object.keys(map).forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (id === 'panel-title') el.innerHTML = map[id];
        else el.textContent = map[id];
    });
    roleEl.value = 'employer';

    var regLink = document.getElementById('register-link');
    if (regLink) regLink.href = regLink.getAttribute('href') + '?role=employer';
})();

/* ═══════════════════════════════════════
   ROLE SELECT
═══════════════════════════════════════ */
var selectedRole = null;

function selectRole(role, el) {
    document.querySelectorAll('.card').forEach(function(c) { c.classList.remove('selected'); });
    el.classList.add('selected');
    selectedRole = role;
    var btn = document.getElementById('cta-btn');
    btn.disabled = false;
    btn.textContent = role === 'seeker' ? 'İş Arayan olarak devam et →' : 'İşveren olarak devam et →';
    document.getElementById('cta-hint').style.visibility = 'visible';
}

function goToLogin() {
    if (selectedRole) window.location.href = '/login?role=' + selectedRole;
}