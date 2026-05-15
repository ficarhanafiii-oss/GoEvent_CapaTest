const allEvents = {
      hindia: {
        title: 'Hindia Pop Music Concert',
        img: 'assets/HindiaConcert.jpg',
        orgImg: 'assets/HindiaConcert.jpg',
        badge: 'Live Concert',
        date: '28 Apr • 19.00',
        location: 'Jakarta',
        price: 'Rp.300.000',
        about: 'Hindia Pop Music Concert is a live music event featuring one of Indonesia\'s most influential artists, known for his honest lyrics and emotional storytelling. With a unique stage concept and immersive atmosphere, this concert delivers more than just music, bringing a meaningful experience through performances of his popular songs.',
        org: 'Hindia Official'
      },
      art: {
        title: 'Art Exhibition',
        img: 'assets/ArtExhibition.jpg',
        orgImg: 'assets/ArtExhibition.jpg',
        badge: 'Art Exhibition',
        date: '28 Apr • 19.00',
        location: 'Jakarta',
        price: 'Rp.80.000',
        about: 'Art Exhibition is an immersive visual arts experience showcasing works from Indonesia\'s most creative contemporary artists. Featuring bold colors, large-scale installations, and interactive pieces, this exhibition invites visitors to explore the intersection of culture, identity, and imagination in a vibrant gallery space.',
        org: 'Art Space Official'
      }
    };

    let savedState = JSON.parse(localStorage.getItem('goEventSaved') || '{}');
    let currentDetailId = null;

    function removeSaved(id) {
      savedState[id] = false;
      localStorage.setItem('goEventSaved', JSON.stringify(savedState));
      const card = document.getElementById('saved-card-' + id);
      if (card) {
        card.style.transition = 'opacity 0.25s, transform 0.25s';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.remove(); checkEmpty(); }, 260);
      }

      if (currentDetailId === id) closeDetail();
    }

    function openDetail(id) {
      currentDetailId = id;
      const ev = allEvents[id];
      if (!ev) return;

      document.getElementById('detailImg').src = ev.img;
      document.getElementById('detailImg').alt = ev.title;
      document.getElementById('detailBadge').textContent = ev.badge;
      document.getElementById('detailTitle').textContent = ev.title;
      document.getElementById('detailDate').textContent = ev.date;
      document.getElementById('detailLocation').textContent = ev.location;
      document.getElementById('detailAbout').textContent = ev.about;
      document.getElementById('detailOrgImg').src = ev.orgImg;
      document.getElementById('detailOrgName').textContent = ev.org + ' ✓';
      document.getElementById('detailPrice').textContent = ev.price;

      const svg = document.getElementById('detailFavSvg');
      svg.setAttribute('fill', '#e53935');
      svg.setAttribute('stroke', '#e53935');

      document.getElementById('detailOverlay').classList.add('open');
      document.getElementById('backdrop').classList.add('open');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('detail-open');

      document.getElementById('detailOverlay').scrollTop = 0;
    }

    function closeDetail() {
      document.getElementById('detailOverlay').classList.remove('open');
      document.getElementById('backdrop').classList.remove('open');
      document.body.style.overflow = '';
      document.body.classList.remove('detail-open');
      currentDetailId = null;
    }

    function toggleDetailFav() {
      if (!currentDetailId) return;
      removeSaved(currentDetailId);
    }

    function checkEmpty() {
      const list = document.getElementById('savedList');
      if (!list.querySelector('.event-card')) {
        list.innerHTML = `
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <p>No saved events</p>
            <span>Tap the heart on an event to save it</span>
          </div>`;
      }
    }

    function renderSaved() {
      const list = document.getElementById('savedList');
      const savedIds = Object.keys(savedState).filter(id => savedState[id]);

      if (savedIds.length === 0) {
        checkEmpty();
        return;
      }

      savedIds.forEach(id => {
        const ev = allEvents[id];
        if (!ev) return;
        const card = document.createElement('div');
        card.className = 'event-card';
        card.id = 'saved-card-' + id;
        card.onclick = () => openDetail(id);
        card.innerHTML = `
          <div class="event-card-img">
            <img src="${ev.img}" alt="${ev.title}" />
            <div class="event-badge">${ev.badge}</div>
            <button class="event-fav-btn" onclick="removeSaved('${id}'); event.stopPropagation();">
              <svg viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
            <div class="event-price-overlay">
              <span>Start From</span>
              <strong>${ev.price}</strong>
            </div>
          </div>
          <div class="event-card-info">
            <h3>${ev.title}</h3>
            <div class="event-meta">
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                ${ev.date}
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#e53935">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                </svg>
                ${ev.location}
              </span>
            </div>
          </div>`;
        list.appendChild(card);
      });
    }

    renderSaved();