const P = new URLSearchParams(location.search);
    const method     = P.get('method')   || 'bank';
    const bank       = P.get('bank')     || 'bca';
    const total      = parseInt(P.get('total'))    || 315000;
    const subtotal   = parseInt(P.get('subtotal')) || Math.round(total / 1.05);
    const eventTitle = P.get('event')    || 'Indonesia Tech Summit 2026';
    const eventMeta  = P.get('meta')     || '15 Jun • 08.00 • Jakarta';
    const seats      = P.get('seats')    || '';
    const eventId    = P.get('id')       || 'techseminar';
    const eventType  = P.get('type')     || 'seminar';
    const qty        = parseInt(P.get('qty')) || 1;

    let currentTicketId = P.get('ticketId') || null;

    function formatRp(n) {
      return 'Rp.' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    document.getElementById('total-amount').textContent = formatRp(total);

    const bankInfo = {
      bca:     { name: 'Bank BCA',     logo: 'BCA', va: '126 1234 5678 9101' },
      mandiri: { name: 'Bank Mandiri', logo: 'MDR', va: '891 0000 1234 5678' },
      bni:     { name: 'Bank BNI',     logo: 'BNI', va: '988 8800 1234 5678' },
      bri:     { name: 'Bank BRI',     logo: 'BRI', va: '0000 7777 1234 5678' },
    };

    if (method === 'qris') {
      document.getElementById('bank-content').style.display = 'none';
      document.getElementById('qris-content').style.display = 'block';
      document.getElementById('bottom-bar').style.display = 'none';
      document.getElementById('qris-bottom').style.display = 'block';
    } else {
      const info = bankInfo[bank] || bankInfo.bca;
      document.getElementById('bank-logo-text').textContent = info.logo;
      document.getElementById('bank-display-name').textContent = info.name;
      document.getElementById('va-number').textContent = info.va;
    }

    async function ensureOrder() {
      if (currentTicketId) return; 
      const result = await GoEventAPI.createOrder({
        eventId, eventTitle, eventMeta,
        ticketType: seats ? 'Seated' : 'General Admission',
        qty, subtotal,
        fee: total - subtotal,
        total, seats, method,
      });
      if (result.success) {
        currentTicketId = result.data.ticketId;
      }
    }
    ensureOrder();

    let seconds = 24 * 60 * 60;
    function tick() {
      const h = String(Math.floor(seconds/3600)).padStart(2,'0');
      const m = String(Math.floor((seconds%3600)/60)).padStart(2,'0');
      const s = String(seconds%60).padStart(2,'0');
      document.getElementById('countdown').textContent = `${h} : ${m} : ${s}`;
      if (seconds > 0) { seconds--; setTimeout(tick, 1000); }
    }
    tick();

    function copyVA() {
      const va = document.getElementById('va-number').textContent.replace(/\s/g, '');
      navigator.clipboard.writeText(va).catch(() => {});
      const btn = document.querySelector('.copy-btn');
      btn.textContent = '✓ Copied';
      setTimeout(() => btn.textContent = 'Salin', 2000);
    }

    function toggleAccordion(header) {
      header.classList.toggle('open');
      const content = header.nextElementSibling;
      content.classList.toggle('open');
    }

    async function simulatePaymentDone() {
      await ensureOrder(); 
      if (currentTicketId) {
        await GoEventAPI.confirmPayment(currentTicketId);
      }
      const params = new URLSearchParams({
        event: eventTitle,
        meta:  eventMeta,
        seats, id: eventId,
        total, ticketId: currentTicketId || ''
      });
      window.location.href = `payment-success.html?${params.toString()}`;
    }