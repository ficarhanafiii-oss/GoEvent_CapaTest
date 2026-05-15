const P = new URLSearchParams(location.search);
    const eventTitle  = P.get('event')    || 'Indonesia Tech Summit 2026';
    const eventMeta   = P.get('meta')     || '15 Jun \u2022 08.00 \u2022 Jakarta';
    const seats       = P.get('seats')    || '';
    const total       = parseInt(P.get('total')) || 315000;
    const eventId     = P.get('id')       || 'techseminar';
    const ticketIdParam = P.get('ticketId') || '';

    function formatRp(n) {
      return 'Rp.' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    document.getElementById('ticket-event-name').textContent = eventTitle;
    document.getElementById('ticket-event-meta').textContent = eventMeta;
    document.getElementById('total-paid').textContent = formatRp(total);

    const displayTicketId = ticketIdParam || ('TKT-' + Date.now().toString().slice(-10));
    document.getElementById('ticket-id').textContent = displayTicketId;

    const orgMap = {
      techseminar:  { name: 'TechID Events',    letter: 'T' },
      hindia:       { name: 'Hindia Official',   letter: 'H' },
      artexhibit:   { name: 'Art Space ID',      letter: 'A' },
      standupcomedy:{ name: 'Komedi.id',         letter: 'K' },
    };
    const org = orgMap[eventId] || { name: 'GoEvent', letter: 'G' };
    document.getElementById('org-name').textContent = org.name;
    document.getElementById('org-logo').textContent = org.letter;

    if (seats) {
      const seatsWrap = document.getElementById('seats-wrap');
      seatsWrap.style.display = 'block';
      document.getElementById('seats-badge').textContent = 'Seats: ' + seats;
    }

    async function ensureTicketSaved() {
      if (ticketIdParam) return; 
      const result = await GoEventAPI.createOrder({
        eventId, eventTitle, eventMeta,
        ticketType: 'General Admission',
        qty: 1, subtotal: Math.round(total / 1.05),
        fee: total - Math.round(total / 1.05),
        total, seats, method: 'unknown',
      });
      if (result.success) {
        await GoEventAPI.confirmPayment(result.data.ticketId);
        document.getElementById('ticket-id').textContent = result.data.ticketId;
      }
    }
    ensureTicketSaved();