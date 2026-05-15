const savedState = JSON.parse(localStorage.getItem('goEventSaved') || '{}');
    const savedCount = Object.values(savedState).filter(Boolean).length;
    document.getElementById('statActive').textContent = 1;
    document.getElementById('statSaved').textContent = savedCount;
    document.getElementById('statHistory').textContent = 1;

    function confirmLogout() {
      document.getElementById('logoutModal').style.display = 'flex';
    }
    function closeLogout() {
      document.getElementById('logoutModal').style.display = 'none';
    }
    function doLogout() {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = 'login.html';
    }
    document.getElementById('logoutModal').addEventListener('click', function(e) {
      if (e.target === this) closeLogout();
    });