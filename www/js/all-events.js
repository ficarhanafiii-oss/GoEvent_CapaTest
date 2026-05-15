const savedState = JSON.parse(localStorage.getItem('goEventSaved') || '{}');
    Object.keys(savedState).forEach(id => { if (savedState[id]) syncHearts(id); });

    let currentView = 'grid';
    let currentSort = 'default';

    const eventData = {
      hindia:     { price: 300000, date: 20260528, name: 'Hindia Pop Music Concert' },
      art:        { price: 80000,  date: 20260603, name: 'Nusantara Art Exhibition' },
      techseminar:{ price: 150000, date: 20260615, name: 'Indonesia Tech Summit 2026' },
      standup:    { price: 120000, date: 20260628, name: 'Malam Komedi: Raditya Dika Live' },
    };

    function bookEvent(id, title, meta, price, type) {
      const params = new URLSearchParams({ id, event: title, meta, price, type });
      if (type === 'seminar') {
        window.location.href = `seminar-choose-seats.html?${params.toString()}`;
      } else {
        window.location.href = `choose-tickets.html?${params.toString()}`;
      }
    }

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
      ['fav-' + id, 'fav-list-' + id, 'detail-fav-' + id].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        const svg = btn.querySelector('svg');
        svg.setAttribute('fill', fill);
        svg.setAttribute('stroke', stroke);
      });
    }

    function openSort() {
      document.getElementById('sortSheet').classList.add('open');
      document.getElementById('sortBackdrop').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeSort() {
      document.getElementById('sortSheet').classList.remove('open');
      document.getElementById('sortBackdrop').classList.remove('open');
      document.body.style.overflow = '';
    }
    function applySort(sortKey, label, btn) {
      currentSort = sortKey;
      document.querySelectorAll('.sort-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('sortLabel').textContent = sortKey === 'default' ? 'Sort' : label;
      document.getElementById('sortBtn') && (document.getElementById('sortBtn').style.color = sortKey === 'default' ? '' : 'var(--primary)');
      sortCards();
      setTimeout(closeSort, 220);
    }

    function sortCards() {
      const grid = document.getElementById('eventsGrid');
      const cards = Array.from(grid.querySelectorAll('.grid-card'));
      const noResults = document.getElementById('noResults');

      cards.sort((a, b) => {
        const idA = a.getAttribute('onclick').match(/'([^']+)'/)[1];
        const idB = b.getAttribute('onclick').match(/'([^']+)'/)[1];
        const dA = eventData[idA];
        const dB = eventData[idB];
        if (!dA || !dB) return 0;
        if (currentSort === 'price-asc')  return dA.price - dB.price;
        if (currentSort === 'price-desc') return dB.price - dA.price;
        if (currentSort === 'date-asc')   return dA.date - dB.date;
        if (currentSort === 'name-asc')   return dA.name.localeCompare(dB.name);

        return 0;
      });

      cards.forEach(c => grid.insertBefore(c, noResults));
      applyFilters();
    }

    const chips = document.querySelectorAll('.chip');
    const searchInput = document.getElementById('searchInput');

    function applyFilters() {
      const activeChip = document.querySelector('.chip.active');
      const selectedCat = activeChip ? activeChip.dataset.cat : 'All';
      const query = searchInput.value.trim().toLowerCase();

      const gridCards = document.querySelectorAll('.grid-card');
      let visibleCount = 0;
      gridCards.forEach(card => {
        const cat = card.dataset.category;
        const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
        const catMatch = selectedCat === 'All' || cat === selectedCat;
        const searchMatch = query === '' || title.includes(query) || cat.toLowerCase().includes(query);
        const show = catMatch && searchMatch;
        card.classList.toggle('hidden', !show);
        if (show) visibleCount++;
      });

      const noR = document.getElementById('noResults');
      if (noR) noR.style.display = visibleCount === 0 ? 'block' : 'none';
      document.getElementById('visibleCount').textContent = visibleCount;
      document.getElementById('countBadge').textContent = visibleCount;
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        applyFilters();
      });
    });
    searchInput.addEventListener('input', applyFilters);