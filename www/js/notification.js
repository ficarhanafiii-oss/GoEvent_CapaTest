function readNotif(id) {
      const item = document.getElementById(id);
      const dot = document.getElementById('dot-' + id);
      if (item) item.classList.remove('unread');
      if (dot) dot.remove();
    }

    function markAllRead() {
      document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
      document.querySelectorAll('.unread-dot').forEach(el => el.remove());
    }

    function switchTab(tab, btn) {

      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const items = document.querySelectorAll('.notif-item');
      let visible = 0;

      items.forEach(item => {
        const type = item.dataset.type;
        const show = tab === 'all' || type === tab;
        item.style.display = show ? 'flex' : 'none';
        if (show) visible++;
      });

      document.querySelectorAll('.notif-group-label').forEach(label => {

        let next = label.nextElementSibling;
        let hasVisible = false;
        while (next && !next.classList.contains('notif-group-label')) {
          if (next.style.display !== 'none') { hasVisible = true; break; }
          next = next.nextElementSibling;
        }
        label.style.display = hasVisible ? 'block' : 'none';
      });

      document.getElementById('emptyState').style.display = visible === 0 ? 'block' : 'none';
    }