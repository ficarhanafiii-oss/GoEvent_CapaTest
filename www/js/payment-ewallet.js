const P = new URLSearchParams(location.search);
    const wallet     = P.get('wallet')   || 'gopay';
    const total      = parseInt(P.get('total'))    || 315000;
    const subtotal   = parseInt(P.get('subtotal')) || Math.round(total / 1.05);
    const eventTitle = P.get('event')    || 'Indonesia Tech Summit 2026';
    const eventMeta  = P.get('meta')     || '15 Jun • 08.00 • Jakarta';
    const seats      = P.get('seats')    || '';
    const eventId    = P.get('id')       || 'techseminar';
    const qty        = parseInt(P.get('qty')) || 1;
    let currentTicketId = null;

    function formatRp(n) {
      return 'Rp.' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const walletInfo = {
      gopay: { name: 'Gopay',   letter: 'G', bg: '#00aed6', cls: '' },
      ovo:   { name: 'OVO',     letter: 'O', bg: '#4c2a7e', cls: 'ovo' },
      dana:  { name: 'DANA',    letter: 'D', bg: '#118eea', cls: 'dana' },
    };

    const info = walletInfo[wallet] || walletInfo.gopay;
    const logo = document.getElementById('wallet-logo');
    logo.textContent = info.letter;
    logo.style.background = info.bg;
    logo.style.boxShadow = `0 8px 24px ${info.bg}55`;
    document.getElementById('redirect-title').textContent = `Opening ${info.name}...`;
    document.getElementById('wallet-name-sub').textContent = info.name;
    document.getElementById('amount-display').textContent = formatRp(total);

    async function initOrder() {
      const result = await GoEventAPI.createOrder({
        eventId, eventTitle, eventMeta,
        ticketType: 'General Admission',
        qty, subtotal, fee: total - subtotal, total, seats,
        method: 'ewallet_' + wallet,
      });
      if (result.success) currentTicketId = result.data.ticketId;
    }
    initOrder();

    async function goSuccess() {
      if (currentTicketId) await GoEventAPI.confirmPayment(currentTicketId);
      const params = new URLSearchParams({
        event: eventTitle, meta: eventMeta,
        seats, id: eventId, total,
        method: 'ewallet', wallet,
        ticketId: currentTicketId || ''
      });
      window.location.href = `payment-success.html?${params.toString()}`;
    }

    function simSuccess() {
      document.getElementById('status-text').textContent = 'Payment confirmed! Redirecting...';
      setTimeout(goSuccess, 1200);
    }

    function simFail() {
      document.getElementById('status-text').textContent = 'Payment failed or cancelled.';
      document.getElementById('redirect-title').textContent = 'Payment Cancelled';
      setTimeout(() => history.back(), 2000);
    }