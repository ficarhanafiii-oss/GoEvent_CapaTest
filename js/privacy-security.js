function openChangePassword() {
      document.getElementById('pwModal').style.display = 'flex';
    }
    function closePwModal() {
      document.getElementById('pwModal').style.display = 'none';
    }
    function changePassword() {
      const pw1 = document.getElementById('pwNew').value;
      const pw2 = document.getElementById('pwConfirm').value;
      if (!pw1) { alert('Masukkan password baru'); return; }
      if (pw1 !== pw2) { alert('Konfirmasi password tidak cocok'); return; }
      closePwModal();
      showToast('✓ Password berhasil diperbarui');
    }
    function confirmDelete() {
      document.getElementById('deleteModal').style.display = 'flex';
    }
    function handleToggle(id, label) {
      const checked = document.getElementById(id).checked;
      showToast((checked ? '✓ ' : '✗ ') + label + (checked ? ' diaktifkan' : ' dinonaktifkan'));
    }
    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg || '✓ Tersimpan';
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2500);
    }

    window.addEventListener('DOMContentLoaded', () => {
      const ids = ['toggleLocation','togglePersonal'];
      ids.forEach(id => {
        const saved = localStorage.getItem('privacy_' + id);
        if (saved !== null) document.getElementById(id).checked = saved === '1';
      });
    });
    document.querySelectorAll('.toggle input').forEach(el => {
      el.addEventListener('change', () => {
        localStorage.setItem('privacy_' + el.id, el.checked ? '1' : '0');
      });
    });