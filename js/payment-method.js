const P        = new URLSearchParams(location.search);
    const subtotal = parseInt(P.get('subtotal')) || 300000;
    const evTitle  = P.get('event')  || 'Hindia Pop Music Concert';
    const evMeta   = P.get('meta')   || '28 Apr • 19.00 • Jakarta';
    const seats    = P.get('seats')  || '';
    const evId     = P.get('id')     || 'hindia';
    const evType   = P.get('type')   || 'concert';
    const fee      = Math.round(subtotal * 0.05);
    const total    = subtotal + fee;

    const fmt = n => 'Rp.' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    document.getElementById('desc-label').textContent =
      seats ? seats.split(',').length + ' Tiket / ' + seats.split(',').length + ' Seats' : 'Subtotal';
    document.getElementById('val-subtotal').textContent = fmt(subtotal);
    document.getElementById('val-fee').textContent      = fmt(fee);
    document.getElementById('val-total').textContent    = fmt(total);
    document.getElementById('bar-total').textContent    = fmt(total);

    let curMethod = null, curBank = 'bca', curWallet = 'gopay';

    function pick(m) {
      curMethod = m;
      ['bank','ewallet','qris'].forEach(k => {
        document.getElementById('opt-' + k).classList.toggle('selected', k === m);
      });
      ['bank','ewallet'].forEach(k => {
        const el = document.getElementById('sub-' + k);
        if (el) el.classList.toggle('open', k === m);
      });
      document.getElementById('btn-confirm').disabled = false;
    }

    function pickBank(b) {
      curBank = b;
      ['bca','mandiri','bni','bri'].forEach(k =>
        document.getElementById('sub-' + k).classList.toggle('selected', k === b));
    }

    function pickWallet(w) {
      curWallet = w;
      ['gopay','ovo','dana'].forEach(k =>
        document.getElementById('sub-' + k).classList.toggle('selected', k === w));
    }

    function doConfirm() {
      if (!curMethod) return;
      const qty = parseInt(P.get('qty')) || 1;
      const base = { event: evTitle, meta: evMeta, seats, id: evId, type: evType, total, subtotal, qty };
      if (curMethod === 'ewallet') {
        location.href = 'payment-ewallet.html?' + new URLSearchParams({...base, method:'ewallet', wallet:curWallet});
      } else if (curMethod === 'bank') {
        location.href = 'payment-instruction.html?' + new URLSearchParams({...base, method:'bank', bank:curBank});
      } else {
        location.href = 'payment-instruction.html?' + new URLSearchParams({...base, method:'qris'});
      }
    }