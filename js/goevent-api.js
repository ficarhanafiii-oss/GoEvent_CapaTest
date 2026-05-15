const GoEventAPI = (() => {

  const CONFIG = {
    BASE_URL: null,          
    USE_MOCK: true,          
    MOCK_DELAY_MS: 400,      
  };

  const KEYS = {
    TICKETS:  'goevent_tickets',
    USER:     'goevent_user',
    SAVED:    'goevent_saved',
  };

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function generateId(prefix = 'TKT') {
    const now = Date.now().toString().slice(-8);
    const rand = Math.floor(Math.random() * 9000 + 1000);
    return `${prefix}-${now}${rand}`;
  }

  function loadTickets() {
    try { return JSON.parse(localStorage.getItem(KEYS.TICKETS) || '[]'); }
    catch { return []; }
  }

  function saveTickets(tickets) {
    localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
  }

  function ok(data) { return { success: true, data }; }
  function err(msg) { return { success: false, error: msg }; }

  const Mock = {

    async createOrder(orderData) {
      await delay(CONFIG.MOCK_DELAY_MS);
      const tickets = loadTickets();
      const ticket = {
        ticketId:    generateId('TKT'),
        orderId:     generateId('ORD'),
        eventId:     orderData.eventId     || 'unknown',
        eventTitle:  orderData.eventTitle  || 'Unknown Event',
        eventMeta:   orderData.eventMeta   || '',
        eventImage:  orderData.eventImage  || '',
        ticketType:  orderData.ticketType  || 'General',
        qty:         orderData.qty         || 1,
        unitPrice:   orderData.unitPrice   || 0,
        subtotal:    orderData.subtotal    || 0,
        fee:         orderData.fee         || 0,
        total:       orderData.total       || 0,
        seats:       orderData.seats       || '',
        method:      orderData.method      || '',
        status:      'unpaid',
        createdAt:   new Date().toISOString(),
        updatedAt:   new Date().toISOString(),
        paymentDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      tickets.unshift(ticket);
      saveTickets(tickets);
      return ok(ticket);
    },

    async confirmPayment(ticketId) {
      await delay(CONFIG.MOCK_DELAY_MS);
      const tickets = loadTickets();
      const idx = tickets.findIndex(t => t.ticketId === ticketId || t.orderId === ticketId);
      if (idx === -1) return err('Ticket not found');
      tickets[idx].status = 'upcoming';
      tickets[idx].updatedAt = new Date().toISOString();
      saveTickets(tickets);
      return ok(tickets[idx]);
    },

    async getMyTickets() {
      await delay(CONFIG.MOCK_DELAY_MS);
      const tickets = loadTickets();
      return ok(tickets);
    },

    async getTicketById(ticketId) {
      await delay(CONFIG.MOCK_DELAY_MS);
      const tickets = loadTickets();
      const ticket = tickets.find(t => t.ticketId === ticketId);
      if (!ticket) return err('Ticket not found');
      return ok(ticket);
    },

    async cancelTicket(ticketId) {
      await delay(CONFIG.MOCK_DELAY_MS);
      const tickets = loadTickets();
      const idx = tickets.findIndex(t => t.ticketId === ticketId);
      if (idx === -1) return err('Ticket not found');
      tickets[idx].status = 'cancelled';
      tickets[idx].updatedAt = new Date().toISOString();
      saveTickets(tickets);
      return ok(tickets[idx]);
    },

    async completeTicket(ticketId) {
      await delay(CONFIG.MOCK_DELAY_MS);
      const tickets = loadTickets();
      const idx = tickets.findIndex(t => t.ticketId === ticketId);
      if (idx === -1) return err('Ticket not found');
      tickets[idx].status = 'completed';
      tickets[idx].updatedAt = new Date().toISOString();
      saveTickets(tickets);
      return ok(tickets[idx]);
    },
  };

  const Backend = {
    async createOrder(orderData) {
      const res = await fetch(`${CONFIG.BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(orderData),
      });
      const json = await res.json();
      return res.ok ? ok(json.data) : err(json.message);
    },

    async confirmPayment(ticketId) {
      const res = await fetch(`${CONFIG.BASE_URL}/orders/${ticketId}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const json = await res.json();
      return res.ok ? ok(json.data) : err(json.message);
    },

    async getMyTickets() {
      const res = await fetch(`${CONFIG.BASE_URL}/tickets/mine`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const json = await res.json();
      return res.ok ? ok(json.data) : err(json.message);
    },

    async getTicketById(ticketId) {
      const res = await fetch(`${CONFIG.BASE_URL}/tickets/${ticketId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const json = await res.json();
      return res.ok ? ok(json.data) : err(json.message);
    },

    async cancelTicket(ticketId) {
      const res = await fetch(`${CONFIG.BASE_URL}/tickets/${ticketId}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const json = await res.json();
      return res.ok ? ok(json.data) : err(json.message);
    },

    async completeTicket(ticketId) {
      const res = await fetch(`${CONFIG.BASE_URL}/tickets/${ticketId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      const json = await res.json();
      return res.ok ? ok(json.data) : err(json.message);
    },
  };

  function getToken() {
    try { return JSON.parse(localStorage.getItem(KEYS.USER) || '{}').token || ''; }
    catch { return ''; }
  }

  const impl = CONFIG.USE_MOCK ? Mock : Backend;

  return {
    createOrder:     (data)  => impl.createOrder(data),
    confirmPayment:  (id)    => impl.confirmPayment(id),
    getMyTickets:    ()      => impl.getMyTickets(),
    getTicketById:   (id)    => impl.getTicketById(id),
    cancelTicket:    (id)    => impl.cancelTicket(id),
    completeTicket:  (id)    => impl.completeTicket(id),

    config: CONFIG,
    generateId,
  };
})();