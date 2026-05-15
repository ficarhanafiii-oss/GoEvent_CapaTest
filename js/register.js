const MOCK_ACCOUNTS = [
      { email: 'ficar@goevent.com', password: 'goevent123', name: 'Ficar' }
    ];

    function getAccounts() {
      const stored = localStorage.getItem('goEventAccounts');
      return stored ? JSON.parse(stored) : [...MOCK_ACCOUNTS];
    }

    function saveAccounts(accounts) {
      localStorage.setItem('goEventAccounts', JSON.stringify(accounts));
    }

    function showToast(msg, type = '') {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.className = 'toast ' + type;
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => t.classList.remove('show'), 2800);
    }

    function toggleEye(btn) {
      const input = document.getElementById('password');
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.querySelector('svg').style.opacity = isText ? '1' : '0.4';
    }

    function doRegister() {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const btn = document.getElementById('registerBtn');
      const emailErr = document.getElementById('emailErr');

      emailErr.style.display = 'none';

      if (!name || !email || !password) {
        showToast('Semua field harus diisi!', 'error');
        return;
      }
      if (password.length < 6) {
        showToast('Password minimal 6 karakter!', 'error');
        return;
      }

      const accounts = getAccounts();
      if (accounts.find(a => a.email === email)) {
        emailErr.style.display = 'block';
        showToast('Email sudah terdaftar!', 'error');
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>';

      setTimeout(() => {
        const newUser = { email, password, name };
        accounts.push(newUser);
        saveAccounts(accounts);

        localStorage.setItem('goEventUser', JSON.stringify({ name, email }));
        showToast('✓ Akun berhasil dibuat! Selamat datang, ' + name + '!', 'success');
        setTimeout(() => { window.location.href = 'home.html'; }, 1200);
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
      if (e.key === 'Enter') doRegister();
    });