const params = new URLSearchParams(window.location.search);

    const ticketIdParam = params.get('ticketId');
    const statusParam   = params.get('status');
    const bottomAction  = document.getElementById('bottomAction');

    function formatRp(amount) {
      return 'Rp.' + (amount || 0).toLocaleString('id-ID');
    }

    function getImg(t) {
      const map = {
        hindia: 'assets/HindiaConcert.jpg',
        techseminar: 'assets/TechSeminar.png',
        artexhibit: 'assets/ArtExhibition.jpg',
        standupcomedy: 'assets/StandUpComedy.jpg',
      };
      return t.eventImage || map[t.eventId] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=200&q=80'
    }

    function parseEventMeta(meta) {

      if (!meta) return { date: '-', time: '-', location: '-' };
      const parts = meta.split('•').map(s => s.trim());
      return { date: parts[0] || '-', time: parts[1] || '-', location: parts[2] || '-' };
    }

    function renderTicket(t) {
      const status = t.status;
      const metaParsed = parseEventMeta(t.eventMeta);

      if (status === 'unpaid') {
        document.getElementById('pageTitle').textContent = 'Pembayaran';
        document.getElementById('qrisSection').style.display = 'block';
        document.getElementById('qrisEventName').textContent = t.eventTitle;
        document.getElementById('qrisTicketLabel').textContent = (t.ticketType || 'General') + ' × ' + t.qty;
        document.getElementById('qrisSubtotal').textContent = formatRp(t.subtotal);
        document.getElementById('qrisAmount').textContent = formatRp(t.total);
        bottomAction.innerHTML = `
          <button class="btn-primary" onclick="doPayUnpaid('${t.ticketId}')">Lanjut Bayar</button>
          <button class="btn-back" onclick="history.back()">Back</button>
        `;
      }

      else if (status === 'cancelled') {
        document.getElementById('pageTitle').textContent = 'Detail Tiket';
        document.getElementById('cancelledSection').style.display = 'block';
        document.getElementById('cancelledEventName').textContent = t.eventTitle;
        document.getElementById('cancelledEventVal').textContent = t.eventTitle;
        document.getElementById('cancelledDate').textContent = metaParsed.date;
        document.getElementById('cancelledLocation').textContent = metaParsed.location;
        document.getElementById('cancelledQty').textContent = t.qty + ' tiket';
        document.getElementById('cancelledTotal').textContent = formatRp(t.total);
        bottomAction.innerHTML = `<button class="btn-back" onclick="history.back()">Back</button>`;
      }

      else {

        document.getElementById('pageTitle').textContent = status === 'completed' ? 'Detail Tiket' : 'Tiket Saya';
        document.getElementById('ticketSection').style.display = 'block';

        const imgSrc = getImg(t);
        const orgMap = {
          techseminar:   { name: 'TechID Events',    letter: 'T' },
          hindia:        { name: 'Hindia Official',   letter: 'H' },
          artexhibit:    { name: 'Art Space ID',      letter: 'A' },
          standupcomedy: { name: 'Komedi.id',         letter: 'K' },
        };
        const org = orgMap[t.eventId] || { name: 'GoEvent', letter: 'G' };

        const orgAvatarEl = document.getElementById('orgAvatar');
        orgAvatarEl.src = imgSrc;
        orgAvatarEl.onerror = function() { this.style.display='none'; };
        document.getElementById('orgName').textContent = org.name;
        document.getElementById('ticketEventTitle').textContent = t.eventTitle;
        document.getElementById('ticketEventType').textContent = t.ticketType || 'Event';
        document.getElementById('infoDate').textContent = metaParsed.date;
        document.getElementById('infoTime').textContent = metaParsed.time;
        document.getElementById('infoLocation').textContent = metaParsed.location;
        document.getElementById('infoTicketType').textContent = t.ticketType || 'General';
        document.getElementById('infoTicketQty').textContent = t.qty + 'x';
        document.getElementById('ticketId').textContent = t.ticketId || '-';
        document.getElementById('totalTicketQty').textContent = t.qty + 'x';
        document.getElementById('payTicketLabel').textContent = (t.ticketType || 'General') + ' × ' + t.qty;
        document.getElementById('paySubtotal').textContent = formatRp(t.subtotal || (t.total - (t.fee || 0)));
        document.getElementById('payTotal').textContent = formatRp(t.total);

        const pill = document.getElementById('statusPill');
        if (status === 'completed') {
          pill.className = 'status-pill status-completed';
          pill.textContent = 'Completed';
        } else {
          pill.className = 'status-pill status-upcoming';
          pill.textContent = 'Upcoming';
        }

        if (status === 'upcoming') {
          bottomAction.innerHTML = `<button class="btn-back" onclick="history.back()">Back</button>`;
        } else {

          document.getElementById('modalEvent').textContent = t.eventTitle;
          document.getElementById('modalDate').textContent = metaParsed.date;
          document.getElementById('modalLocation').textContent = metaParsed.location;
          document.getElementById('modalQty').textContent = t.qty + ' tiket';
          document.getElementById('modalTicketType').textContent = t.ticketType || 'General';
          document.getElementById('modalSubtotal').textContent = formatRp(t.subtotal);
          document.getElementById('modalTotal').textContent = formatRp(t.total);
          bottomAction.innerHTML = `
            <button class="btn-primary" onclick="openModal()">View Detail</button>
            <button class="btn-back" onclick="history.back()">Back</button>
          `;
        }
      }
    }

    function renderError() {
      document.getElementById('pageTitle').textContent = 'Tiket Tidak Ditemukan';
      document.getElementById('cancelledSection').style.display = 'block';
      document.getElementById('cancelledEventName').textContent = 'Tiket tidak ditemukan';
      document.getElementById('cancelledEventVal').textContent = '-';
      document.getElementById('cancelledDate').textContent = '-';
      document.getElementById('cancelledLocation').textContent = '-';
      document.getElementById('cancelledQty').textContent = '-';
      document.getElementById('cancelledTotal').textContent = '-';
      bottomAction.innerHTML = `<button class="btn-back" onclick="history.back()">Back</button>`;
    }

    function doPayUnpaid(ticketId) {
      window.location.href = `tickets.html`;
    }

    async function loadDetail() {
      if (ticketIdParam) {

        const result = await GoEventAPI.getTicketById(ticketIdParam);
        if (result.success) {
          renderTicket(result.data);
        } else {
          renderError();
        }
      } else if (statusParam) {

        const legacyMap = {
          unpaid: {
            ticketId: 'TKT-LEGACY001', eventId: 'jakarta-music', status: 'unpaid',
            eventTitle: 'Jakarta Music Festival', eventMeta: '15 Jun • 18.00 • Bandung',
            ticketType: 'VVIP Pass', qty: 2, unitPrice: 250000,
            subtotal: 500000, fee: 5000, total: 505000,
          },
          upcoming: {
            ticketId: 'TKT-LEGACY002', eventId: 'hindia', status: 'upcoming',
            eventTitle: 'Hindia Pop Music Concert', eventMeta: '28 Apr • 19.00 • Jakarta',
            ticketType: 'Regular Festive', qty: 1, unitPrice: 300000,
            subtotal: 300000, fee: 5000, total: 305000,
          },
          completed: {
            ticketId: 'TKT-LEGACY003', eventId: 'artexhibit', status: 'completed',
            eventTitle: 'Art Exhibition 2025', eventMeta: '10 Jan • 10.00 • Jakarta',
            ticketType: 'General Admission', qty: 2, unitPrice: 100000,
            subtotal: 200000, fee: 5000, total: 205000,
          },
          canceled: {
            ticketId: 'TKT-LEGACY004', eventId: 'bali-dance', status: 'cancelled',
            eventTitle: 'Bali Dance Festival', eventMeta: '5 Mar • 20.00 • Bali',
            ticketType: 'General', qty: 3, unitPrice: 250000,
            subtotal: 750000, fee: 5000, total: 755000,
          },
        };
        const t = legacyMap[statusParam];
        if (t) renderTicket(t);
        else renderError();
      } else {
        renderError();
      }
    }

    loadDetail();

    function togglePayment() {
      document.getElementById('paymentBody').classList.toggle('open');
      document.getElementById('chevron').classList.toggle('open');
    }
    function openModal() {
      document.getElementById('detailModal').classList.add('open');
    }
    function closeModal() {
      document.getElementById('detailModal').classList.remove('open');
    }
    document.getElementById('detailModal').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });