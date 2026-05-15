function bookEvent(id, title, meta, price, type) {
      const params = new URLSearchParams({ id, event: title, meta, price, type });
      if (type === 'seminar') {
        window.location.href = `seminar-choose-seats.html?${params.toString()}`;
      } else {
        window.location.href = `choose-tickets.html?${params.toString()}`;
      }
    }

    const savedState = JSON.parse(localStorage.getItem('goEventSaved') || '{}');

    Object.keys(savedState).forEach(id => {
      if (savedState[id]) syncHearts(id);
    });

    function openDetail(id) {
      document.getElementById('detail-' + id).classList.add('open');
      document.getElementById('backdrop').classList.add('open');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('detail-open');
      syncHearts(id);
    }

    function closeDetail() {
      document.querySelectorAll('.detail-overlay').forEach(el => el.classList.remove('open'));
      document.getElementById('backdrop').classList.remove('open');
      document.body.style.overflow = '';
      document.body.classList.remove('detail-open');
    }

    function toggleFav(e, id) {
      e.stopPropagation();
      savedState[id] = !savedState[id];
      localStorage.setItem('goEventSaved', JSON.stringify(savedState));
      syncHearts(id);

      const btn = e.currentTarget;
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => btn.style.transform = '', 200);
    }

    function syncHearts(id) {
      const isLiked = !!savedState[id];
      const fill = isLiked ? '#e53935' : 'none';
      const stroke = isLiked ? '#e53935' : '#ccc';

      ['fav-' + id, 'detail-fav-' + id].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        const svg = btn.querySelector('svg');
        svg.setAttribute('fill', fill);
        svg.setAttribute('stroke', stroke);
      });
    }

    const chips = document.querySelectorAll('.chip');
    const cards = document.querySelectorAll('.event-card');
    const noResults = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');

    function applyFilters() {
      const activeChip = document.querySelector('.chip.active');
      const selectedCat = activeChip ? activeChip.dataset.cat : 'All';
      const query = searchInput.value.trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.dataset.category;
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        const catMatch = selectedCat === 'All' || cat === selectedCat;
        const searchMatch = query === '' || title.includes(query) || cat.toLowerCase().includes(query);
        const show = catMatch && searchMatch;
        card.classList.toggle('hidden', !show);
        if (show) visibleCount++;
      });

      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        applyFilters();
      });
    });

    searchInput.addEventListener('input', applyFilters);