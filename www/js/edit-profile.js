function handlePhotoChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const circle = document.getElementById('avatarCircle');
        circle.style.backgroundImage = `url(${e.target.result})`;
        circle.style.backgroundSize = 'cover';
        circle.style.backgroundPosition = 'center';
        circle.textContent = '';
      };
      reader.readAsDataURL(file);
    }

    function saveProfile() {
      const name = document.getElementById('inputName').value.trim();
      if (!name) { alert('Nama tidak boleh kosong'); return; }

      const circle = document.getElementById('avatarCircle');
      if (!circle.style.backgroundImage) {
        circle.textContent = name.charAt(0).toUpperCase();
      }

      localStorage.setItem('goEventProfile', JSON.stringify({
        name: name,
        username: document.getElementById('inputUsername').value,
        email: document.getElementById('inputEmail').value,
        phone: document.getElementById('inputPhone').value,
        city: document.getElementById('inputCity').value,
      }));

      showToast();
    }

    function showToast() {
      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    window.addEventListener('DOMContentLoaded', () => {
      const saved = JSON.parse(localStorage.getItem('goEventProfile') || '{}');
      if (saved.name) document.getElementById('inputName').value = saved.name;
      if (saved.username) document.getElementById('inputUsername').value = saved.username;
      if (saved.email) document.getElementById('inputEmail').value = saved.email;
      if (saved.phone) document.getElementById('inputPhone').value = saved.phone;
      if (saved.city) document.getElementById('inputCity').value = saved.city;
    });