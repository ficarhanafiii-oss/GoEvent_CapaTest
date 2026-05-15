const MOCK_ACCOUNTS = [
      { email: 'ficar@goevent.com', password: 'goevent123', name: 'Ficar' }
    ];

    function getAccounts() {
      const stored = localStorage.getItem('goEventAccounts');
      return stored ? JSON.parse(stored) : MOCK_ACCOUNTS;
    }

    function showToast(msg, type = '') {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.className = 'toast ' + type;
      requestAnimationFrame(() => { t.classList.add('show'); });
      setTimeout(() => t.classList.remove('show'), 2800);
    }

    function toggleEye(btn) {
      const input = document.getElementById('password');
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.querySelector('svg').style.opacity = isText ? '1' : '0.4';
    }

    function doLogin() {
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const btn = document.getElementById('loginBtn');

      if (!email || !password) {
        showToast('Isi email dan password dulu ya!', 'error');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>';

      setTimeout(() => {
        const accounts = getAccounts();
        const match = accounts.find(a => a.email === email && a.password === password);

        if (match) {
          localStorage.setItem('goEventUser', JSON.stringify({ name: match.name, email: match.email }));
          showToast('✓ Login berhasil! Selamat datang, ' + match.name + '!', 'success');
          setTimeout(() => { window.location.href = 'home.html'; }, 1200);
        } else {
          showToast('Email atau password salah!', 'error');
          btn.disabled = false;
          btn.innerHTML = 'Log in';
        }
      }, 900);
    }

    function doGoogleLogin(e) {
      const btn = e.currentTarget;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" style="border-color:rgba(0,0,0,0.2);border-top-color:#333"></span> Masuk...';
      setTimeout(() => {
        localStorage.setItem('goEventUser', JSON.stringify({ name: 'Ficar', email: 'ficar@gmail.com' }));
        window.location.href = 'home.html';
      }, 900);
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });