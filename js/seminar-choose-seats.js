const QS = new URLSearchParams(location.search);

    const CFG = {
      title  : QS.get('event') || 'Indonesia Tech Summit 2026',
      meta   : QS.get('meta')  || '15 Jun • 08.00 • Jakarta',
      price  : parseInt(QS.get('price')) || 35000,
      id     : QS.get('id')    || 'techseminar',
      rows   : ['H','G','F','E','D','C','B','A'],
      cols   : 13,
      taken  : ['H3','H4','G2','G6','F1','E7','E8','D5','C2','C3','B9','A11','A12']
    };

    document.getElementById('ev-title').textContent = CFG.title;
    document.getElementById('ev-meta').textContent  = CFG.meta;

    const selected = new Set();

    const fmt = n => 'Rp.' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    function buildGrid() {
      const grid = document.getElementById('seat-grid');

      const colRow = document.createElement('div');
      colRow.className = 'col-row';

      const lblSpacer = document.createElement('div');
      lblSpacer.style.cssText = 'width:16px;flex-shrink:0';
      colRow.appendChild(lblSpacer);

      for (let c = CFG.cols; c >= 1; c--) {
        if (c === 7) {
          const gap = document.createElement('div');
          gap.className = 'col-gap';
          colRow.appendChild(gap);
        }
        const cn = document.createElement('div');
        cn.className = 'col-num';
        cn.textContent = c;
        colRow.appendChild(cn);
      }
      grid.appendChild(colRow);

      CFG.rows.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'seat-row';

        const lbl = document.createElement('div');
        lbl.className = 'row-lbl';
        lbl.textContent = row;
        rowEl.appendChild(lbl);

        for (let c = CFG.cols; c >= 1; c--) {
          if (c === 7) {
            const aisle = document.createElement('div');
            aisle.className = 'aisle';
            rowEl.appendChild(aisle);
          }

          const seatId = row + c;
          const isTaken = CFG.taken.includes(seatId);

          const seat = document.createElement('button');
          seat.type = 'button';
          seat.className = 'seat' + (isTaken ? ' taken' : '');
          seat.setAttribute('aria-label', 'Seat ' + seatId);
          seat.dataset.id = seatId;

          if (!isTaken) {
            seat.addEventListener('click', function() {
              toggleSeat(seatId, this);
            });
          }

          rowEl.appendChild(seat);
        }

        const lblRight = document.createElement('div');
        lblRight.className = 'row-lbl';
        lblRight.style.marginLeft = '4px';
        lblRight.textContent = row;
        rowEl.appendChild(lblRight);

        grid.appendChild(rowEl);
      });
    }

    function toggleSeat(id, el) {
      if (selected.has(id)) {
        selected.delete(id);
        el.classList.remove('selected');
      } else {
        selected.add(id);
        el.classList.add('selected');
      }
      refresh();
    }

    function refresh() {
      const count = selected.size;
      const total = count * CFG.price;
      const tf = fmt(total);
      const arr = Array.from(selected).sort();

      document.getElementById('sum-count').textContent    = count + ' Ticket / ' + count + ' Seats';
      document.getElementById('sum-price').textContent    = tf;
      document.getElementById('sum-subtotal').textContent = tf;
      document.getElementById('bar-amount').textContent   = tf;
      document.getElementById('bar-seats-list').textContent = count ? arr.join(', ') : '-';
      document.getElementById('btn-go').disabled = count === 0;
    }

    function goToPayment() {
      if (!selected.size) return;
      const seats = Array.from(selected).sort().join(',');
      const subtotal = selected.size * CFG.price;
      const p = new URLSearchParams({
        event: CFG.title, meta: CFG.meta,
        id: CFG.id, seats, subtotal, type: 'seminar'
      });
      location.href = 'payment-method.html?' + p.toString();
    }

    buildGrid();
    refresh();