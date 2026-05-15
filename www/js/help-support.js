function toggleFaq(el) {
      const item = el.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    }

    function filterFaq(q) {
      const kw = q.toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        const text = item.querySelector('.faq-q-text').textContent.toLowerCase();
        const data = item.dataset.q || '';
        item.style.display = (!kw || text.includes(kw) || data.includes(kw)) ? '' : 'none';
      });
    }

    function sendReport() {
      const txt = document.getElementById('reportText').value.trim();
      if (!txt) { alert('Tulis dulu masalah yang kamu alami'); return; }
      document.getElementById('reportText').value = '';
      showToast('✓ Laporan berhasil dikirim, terima kasih!');
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2800);
    }