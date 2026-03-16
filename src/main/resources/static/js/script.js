
<script>
    var currentUserId = parseInt(document.getElementById('current-user-id').getAttribute('data-id'));
    var currentAppId  = null;

    function loadUnreadCount() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/chat/unread-count', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data  = JSON.parse(xhr.responseText);
                var badge = document.getElementById('msg-notif');
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

    loadUnreadCount();
    setInterval(loadUnreadCount, 30000);

    function openChat(btn) {
        currentAppId = btn.getAttribute('data-appid');
        document.getElementById('chat-title').textContent = btn.getAttribute('data-name');
        document.getElementById('chat-overlay').style.display = 'block';
        var drawer = document.getElementById('chat-drawer');
        drawer.style.display = 'flex';
        loadMessages();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/chat/' + currentAppId + '/read', true);
        xhr.onload = function() { loadUnreadCount(); };
        xhr.send();
    }

    function closeChat() {
        document.getElementById('chat-drawer').style.display = 'none';
        document.getElementById('chat-overlay').style.display = 'none';
        currentAppId = null;
    }

    function loadMessages() {
        var box = document.getElementById('chat-messages');
        box.textContent = '';
        var loading = document.createElement('div');
        loading.style.cssText = 'text-align:center;padding:2rem;font-size:13px;color:rgba(255,255,255,0.2);';
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
                    empty.style.cssText = 'text-align:center;padding:2rem;font-size:13px;color:rgba(255,255,255,0.2);font-style:italic;';
                    empty.textContent = 'Henüz mesaj yok. İlk mesajı siz gönderin! 👋';
                    box.appendChild(empty);
                } else {
                    for (var i = 0; i < msgs.length; i++) appendMessage(msgs[i]);
                    box.scrollTop = box.scrollHeight;
                }
            }
        };
        xhr.send();
    }

    function appendMessage(m) {
        var box    = document.getElementById('chat-messages');
        var isMine = (m.senderId == currentUserId);

        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;margin-bottom:6px;align-items:' + (isMine ? 'flex-end' : 'flex-start') + ';';

        var bubble = document.createElement('div');
        bubble.textContent = m.content;
        bubble.style.cssText = 'max-width:75%;padding:9px 13px;border-radius:12px;font-size:13px;line-height:1.5;color:#f0f4f8;' +
            (isMine
                ? 'background:linear-gradient(135deg,rgba(125,211,252,0.2),rgba(129,140,248,0.2));border:1px solid rgba(125,211,252,0.25);border-bottom-right-radius:4px;'
                : 'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-bottom-left-radius:4px;');

        var meta = document.createElement('div');
        meta.style.cssText = 'font-size:10px;color:rgba(255,255,255,0.25);margin-top:3px;';
        var time = m.sentAt ? m.sentAt.substring(11, 16) : '';
        meta.textContent = m.senderName + ' · ' + time;

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
                var msg = JSON.parse(xhr.responseText);
                var box = document.getElementById('chat-messages');
                appendMessage(msg);
                box.scrollTop = box.scrollHeight;
            }
        };
        xhr.send(JSON.stringify({ content: content }));
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



    function toggleSkill(label) {
        const cb = label.querySelector('input[type="checkbox"]');
        cb.checked = !cb.checked;
        label.classList.toggle('checked', cb.checked);
        updateProgress();
    }

    function updateProgress() {
        const fields = ['title', 'company', 'location'];
        const filled = fields.filter(id => document.getElementById(id)?.value?.trim()).length;
        const skills = document.querySelectorAll('.skill-item.checked').length;
        const pct    = (filled / fields.length) * 60 + Math.min(skills / 3, 1) * 40;
        document.getElementById('progress-fill').style.width = pct + '%';
    }

    ['title','company','location','description'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateProgress);
    });


    var currentUserId = parseInt(document.getElementById('current-user-id').getAttribute('data-id'));
    var currentAppId  = null;

    function loadUnreadCount() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/chat/unread-count', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                var data  = JSON.parse(xhr.responseText);
                var badge = document.getElementById('msg-notif');
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

    loadUnreadCount();
    setInterval(loadUnreadCount, 30000);

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
                    for (var i = 0; i < msgs.length; i++) {
                        appendMessage(msgs[i]);
                    }
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
        var time = m.sentAt ? m.sentAt.substring(11, 16) : '';
        meta.textContent = m.senderName + ' · ' + time;
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
                var msg = JSON.parse(xhr.responseText);
                var box = document.getElementById('chat-messages');
                var empty = box.querySelector('.chat-empty');
                if (empty) empty.remove();
                appendMessage(msg);
                box.scrollTop = box.scrollHeight;
            }
        };
        xhr.send(JSON.stringify({ content: content }));
    }

    function filterCards(level, btn) {
        var btns = document.querySelectorAll('.filter-btn');
        for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
        btn.classList.add('active');
        var cards = document.querySelectorAll('.job-card');
        for (var j = 0; j < cards.length; j++) {
            cards[j].style.display = (level === 'all' || cards[j].getAttribute('data-level') === level) ? '' : 'none';
        }
    }

    window.onload = function() {
        var bars = document.querySelectorAll('.score-bar-fill');
        for (var i = 0; i < bars.length; i++) {
            var w = bars[i].style.width;
            bars[i].style.width = '0%';
            (function(bar, width) {
                setTimeout(function() { bar.style.width = width; }, 200);
            })(bars[i], w);
        }
    };
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


    // URL'deki ?role= parametresini okuyarak sayfayı dinamik olarak güncelle
    const role = new URLSearchParams(window.location.search).get('role') || 'seeker';

    if (role === 'employer') {
        document.body.classList.add('employer');
        document.getElementById('panel-icon').textContent  = '🏢';
        document.getElementById('panel-badge').textContent = 'Employer Panel';
        document.getElementById('panel-title').innerHTML   = 'Doğru adayı<br/>bulmak kolay.';
        document.getElementById('panel-desc').textContent  = 'İlan oluşturun, algoritma en uygun adayları sizin için otomatik olarak sıralasın.';
        document.getElementById('stat1-num').textContent   = '8.1k+';
        document.getElementById('stat1-lbl').textContent   = 'Kayıtlı aday';
        document.getElementById('stat2-num').textContent   = '4.8★';
        document.getElementById('stat2-lbl').textContent   = 'Memnuniyet';
        document.getElementById('form-sub').textContent    = 'İşveren hesabınıza giriş yapın.';
        document.getElementById('role-hidden').value       = 'employer';

        // Kayıt linkine role parametresi ekle
        const regLink = document.getElementById('register-link');
        regLink.href = regLink.getAttribute('href') + '?role=employer';
    }

    function toggleSkill(label) {
        const cb = label.querySelector('input[type="checkbox"]');
        cb.checked = !cb.checked;
        label.classList.toggle('checked', cb.checked);
        updateProgress();
    }

    function toggleTerms() {
        const cb = document.getElementById('terms-cb');
        setTimeout(() => {
            document.getElementById('terms-label').classList.toggle('checked', cb.checked);
            document.getElementById('terms-box').textContent = cb.checked ? '✓' : '';
            updateProgress();
        }, 0);
    }

    function updateProgress() {
        const fields = ['name','email','password','companyName','sector'];
        const filled = fields.filter(id => document.getElementById(id)?.value?.trim()).length;
        const terms  = document.getElementById('terms-cb').checked ? 1 : 0;
        const pct    = ((filled + terms) / (fields.length + 1)) * 100;
        document.getElementById('progress-fill').style.width = pct + '%';
    }

    ['name','email','password','companyName','sector','companySize'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateProgress);
        document.getElementById(id)?.addEventListener('input', updateProgress);
    });


    let checkedCount = 0;
    const totalSkills = document.querySelectorAll('.skill-item').length;

    function toggleSkill(label) {
        const cb = label.querySelector('input[type="checkbox"]');
        cb.checked = !cb.checked;
        if (cb.checked) {
            label.classList.add('checked');
            checkedCount++;
        } else {
            label.classList.remove('checked');
            checkedCount--;
        }
        document.getElementById('checked-count').textContent = checkedCount;
        updateProgress();
    }

    function updateProgress() {
        // İlerleme: form alanlarının doluluk oranı
        const name  = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const pass  = document.getElementById('password').value;
        const infoScore   = ((name ? 1 : 0) + (email ? 1 : 0) + (pass ? 1 : 0)) / 3 * 50;
        const skillScore  = Math.min(checkedCount / 3, 1) * 50; // 3 yetenek = %50
        document.getElementById('progress-fill').style.width = (infoScore + skillScore) + '%';
    }

    function filterSkills(query) {
        const q = query.toLowerCase().trim();
        const items = document.querySelectorAll('.skill-item');
        let visible = 0;
        items.forEach(item => {
            const name = (item.dataset.name || item.querySelector('.skill-name').textContent).toLowerCase();
            const match = !q || name.includes(q);
            item.style.display = match ? '' : 'none';
            if (match) visible++;
        });
        // No results
        const existing = document.getElementById('no-results');
        if (existing) existing.remove();
        if (visible === 0) {
            const msg = document.createElement('div');
            msg.id = 'no-results';
            msg.className = 'no-results';
            msg.textContent = '"' + query + '" için sonuç bulunamadı';
            document.getElementById('skills-grid').appendChild(msg);
        }
    }

    // Progress'i input olaylarına bağla
    ['name','email','password'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateProgress);
    });


    let selectedRole = null;

    function selectRole(role, el) {
        document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        selectedRole = role;

        const btn = document.getElementById('cta-btn');
        btn.disabled = false;
        btn.textContent = role === 'seeker'
            ? 'İş Arayan olarak devam et →'
            : 'İşveren olarak devam et →';

        document.getElementById('cta-hint').style.visibility = 'visible';
    }

    function goToLogin() {
        if (selectedRole) {
            window.location.href = '/login?role=' + selectedRole;
        }
    }

</script>