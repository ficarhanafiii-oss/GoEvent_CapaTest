const tabs = document.querySelectorAll('.tab-item');
const track = document.getElementById('tabsTrack');
const indicator = document.getElementById('tabIndicator');
let currentTab = 0;

function moveIndicator(tabEl) {
  indicator.style.left = tabEl.offsetLeft + 'px';
  indicator.style.width = tabEl.offsetWidth + 'px';
}

function goToTab(index) {
  tabs[currentTab].classList.remove('active');
  currentTab = index;
  tabs[currentTab].classList.add('active');
  track.style.transform = `translateX(-${index * 100}%)`;
  moveIndicator(tabs[index]);
}

tabs.forEach(tab => tab.addEventListener('click', () => goToTab(parseInt(tab.dataset.tab))));
window.addEventListener('load', () => moveIndicator(tabs[0]));
requestAnimationFrame(() => moveIndicator(tabs[0]));

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getImg(t) {
  const fallbackUrl = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=200&q=80';
  const map = {
    hindia: 'assets/HindiaConcert.jpg',
    techseminar: 'assets/TechSeminar.png',
    artexhibit: 'assets/ArtExhibition.jpg',
    standupcomedy: 'assets/StandUpComedy.jpg'
  };
  return t.eventImage || map[t.eventId] || fallbackUrl;
}

function renderCard(t) {
  const fallbackUrl = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=200&q=80';
  const labels = {
    unpaid: '⏳ Unpaid',
    upcoming: '✓ Upcoming',
    completed: '✔ Completed',
    cancelled: '✕ Cancelled'
  };
  const btn = t.status === 'unpaid'
    ? `<button class="btn-pay" onclick="goDetail('${t.ticketId}')">Pay Now</button>`
    : `<button class="btn-view" onclick="goDetail('${t.ticketId}')">View Ticket</button>`;

  return `
    <div class="ticket-card">
      <div class="ticket-top">
        <div class="ticket-img">
          <img src="${getImg(t)}" alt="" onerror="this.src='${fallbackUrl}'"/>
        </div>
        <div class="ticket-info">
          <h3>${t.eventTitle}</h3>
          <div class="ticket-meta">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              ${t.eventMeta || ''}
            </span>
          </div>
          <div class="status-badge status-${t.status}">${labels[t.status] || t.status}</div>
        </div>
      </div>
      <div class="ticket-bottom">
        <span>${t.qty} ticket${t.qty > 1 ? 's' : ''} • ${formatDate(t.createdAt)}</span>
        ${btn}
      </div>
    </div>`;
}

function goDetail(id) {
  window.location.href = `ticket-detail.html?ticketId=${encodeURIComponent(id)}`;
}

function renderEmpty(status) {
  const m = {
    unpaid:    { e: '🧾', t: 'Belum ada pembayaran pending', s: 'Pesanan yang belum dibayar akan muncul di sini.', showBtn: true },
    upcoming:  { e: '🎟️', t: 'Belum ada tiket aktif', s: 'Tiket yang sudah dibayar akan muncul di sini.', showBtn: true },
    completed: { e: '✅', t: 'Belum ada riwayat event', s: 'Event yang sudah kamu hadiri akan muncul di sini.', showBtn: false },
    cancelled: { e: '❌', t: 'Tidak ada tiket dibatalkan', s: 'Tiket yang dibatalkan akan muncul di sini.', showBtn: false },
  }[status];

  return `
    <div class="empty-tab">
      <div class="empty-emoji">${m.e}</div>
      <p>${m.t}</p>
      <small>${m.s}</small>
      ${m.showBtn ? `<br><button class="btn-explore" onclick="window.location.href='home.html'">Explore Events</button>` : ''}
    </div>`;
}

async function loadAndRender() {
  const result = await GoEventAPI.getMyTickets();
  const panels = {
    unpaid:    document.getElementById('panel-unpaid'),
    upcoming:  document.getElementById('panel-upcoming'),
    completed: document.getElementById('panel-completed'),
    cancelled: document.getElementById('panel-cancelled'),
  };

  const all = (result.success ? result.data : []) || [];
  const groups = {
    unpaid:    all.filter(t => t.status === 'unpaid'),
    upcoming:  all.filter(t => t.status === 'upcoming'),
    completed: all.filter(t => t.status === 'completed'),
    cancelled: all.filter(t => t.status === 'cancelled'),
  };

  Object.keys(panels).forEach(status => {
    const list = groups[status];
    panels[status].innerHTML = list.length > 0 ? list.map(renderCard).join('') : renderEmpty(status);
  });
}

loadAndRender();
