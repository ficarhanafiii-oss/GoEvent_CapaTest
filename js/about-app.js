let selectedRating = 0;

    function setRating(val) {
      selectedRating = val;
      document.querySelectorAll('.star-btn').forEach(btn => {
        btn.classList.toggle('lit', parseInt(btn.dataset.val) <= val);
        btn.classList.toggle('dim', parseInt(btn.dataset.val) > val);
      });
    }

    function submitRating() {
      if (!selectedRating) { showToast('Pilih dulu bintang rating kamu'); return; }
      const msgs = ['', 'Terima kasih atas masukannya 🙏', 'Terima kasih! Kami akan terus berkembang 🙏', 'Senang kamu menikmatinya! ⭐', 'Wow, hampir sempurna! Terima kasih ⭐⭐', 'Luar biasa! Terima kasih banyak! 🎉'];
      showToast(msgs[selectedRating]);
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2800);
    }