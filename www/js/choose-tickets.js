const P = new URLSearchParams(location.search);
    const eventTitle = P.get('event') || 'Hindia Pop Music Concert';
    const eventMeta  = P.get('meta')  || '28 Apr • 19.00 • Jakarta';
    const eventId    = P.get('id')    || 'hindia';
    const eventType  = P.get('type')  || 'concert';
    const basePrice  = parseInt(P.get('price')) || 300000;

    const TICKET_TYPES = eventType === 'concert'
      ? [
          { key: 'regular', name: 'Regular Festive', price: basePrice },
          { key: 'vip',     name: 'VIP Festive',     price: Math.round(basePrice * 1.67) }
        ]
      : [
          { key: 'general', name: 'General Admission', price: basePrice }
        ];

    const counts = {};
    TICKET_TYPES.forEach(t => counts[t.key] = 0);

    document.getElementById('event-title').textContent = eventTitle;
    document.getElementById('event-meta').textContent  = eventMeta;

    function formatRp(n) {
      return 'Rp.' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const container = document.getElementById('ticket-types-container');
    TICKET_TYPES.forEach(t => {
      const row = document.createElement('div');
      row.className = 'ticket-type-row';
      row.innerHTML = `
        <div class="ticket-type-info">
          <div class="ticket-type-name">${t.name}</div>
          <div class="ticket-type-price">${formatRp(t.price)} / ticket</div>
        </div>
        <div class="counter">
          <button class="counter-btn minus" id="minus-${t.key}" onclick="changeCount('${t.key}',-1)" disabled>−</button>
          <div class="counter-val" id="count-${t.key}">0</div>
          <button class="counter-btn plus" id="plus-${t.key}" onclick="changeCount('${t.key}',1)">+</button>
        </div>
      `;
      container.appendChild(row);
    });

    function changeCount(key, delta) {
      counts[key] = Math.max(0, counts[key] + delta);
      document.getElementById(`count-${key}`).textContent = counts[key];
      document.getElementById(`minus-${key}`).disabled = counts[key] === 0;
      renderSummary();
    }

    function renderSummary() {
      const summaryEl = document.getElementById('order-summary-lines');
      const totalEl   = document.getElementById('bottom-total');
      const btn        = document.getElementById('btn-continue');

      let totalAmt = 0;
      const lines = [];

      TICKET_TYPES.forEach(t => {
        if (counts[t.key] > 0) {
          const sub = counts[t.key] * t.price;
          totalAmt += sub;
          lines.push(`
            <div class="summary-row">
              <span>${counts[t.key]} Ticket ${t.name}</span>
              <span>${formatRp(sub)}</span>
            </div>
          `);
        }
      });

      if (lines.length === 0) {
        summaryEl.innerHTML = '<div class="summary-empty">No tickets selected</div>';
      } else {
        summaryEl.innerHTML = lines.join('') + `
          <div class="summary-row subtotal-row">
            <span>Subtotal</span>
            <span>${formatRp(totalAmt)}</span>
          </div>
        `;
      }

      totalEl.textContent = formatRp(totalAmt);
      btn.disabled = totalAmt === 0;
    }

    function goToPayment() {
      let totalAmt = 0;
      const ticketSummaryParts = [];

      TICKET_TYPES.forEach(t => {
        if (counts[t.key] > 0) {
          totalAmt += counts[t.key] * t.price;
          ticketSummaryParts.push(`${counts[t.key]}x${t.name}`);
        }
      });

      if (totalAmt === 0) return;

      let totalQty = 0;
      TICKET_TYPES.forEach(t => { totalQty += counts[t.key]; });

      const params = new URLSearchParams({
        event: eventTitle,
        meta:  eventMeta,
        id:    eventId,
        type:  eventType,
        subtotal: totalAmt,
        qty:   totalQty,
        tickets: ticketSummaryParts.join('|')
      });

      window.location.href = `payment-method.html?${params.toString()}`;
    }