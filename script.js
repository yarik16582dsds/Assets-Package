document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const messageDiv = document.getElementById('message');
  const usernameDisplay = document.getElementById('username-display');

  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Получение существующих пользователей
      fetch('/Assets-Package/data/users.json')
        .then(response => response.json())
        .then(data => {
          const existingUser = data.find(user => user.username === username);
          if (existingUser) {
            messageDiv.textContent = 'Имя пользователя уже существует. Пожалуйста, выберите другое.';
          } else {
            // Добавление нового пользователя
            const newUser = { username, password };
            data.push(newUser);

            // Сохранение обновленных данных пользователей
            fetch('/Assets-Package/data/users.json', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(() => {
              messageDiv.textContent = 'Регистрация успешна!';
              registerForm.reset();
            })
            .catch(error => {
              messageDiv.textContent = 'Ошибка сохранения данных. Пожалуйста, попробуйте снова.';
              console.error('Ошибка:', error);
            });
          }
        })
        .catch(error => {
          messageDiv.textContent = 'Ошибка получения данных. Пожалуйста, попробуйте снова.';
          console.error('Ошибка:', error);
        });
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Получение существующих пользователей
      fetch('/Assets-Package/data/users.json')
        .then(response => response.json())
        .then(data => {
          const user = data.find(user => user.username === username && user.password === password);
          if (user) {
            messageDiv.textContent = 'Вход успешен!';
            // Сохранение имени пользователя в localStorage
            localStorage.setItem('loggedInUser', username);
            // Перенаправление на главную страницу или другую страницу после успешного входа
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 1000);
          } else {
            messageDiv.textContent = 'Неверное имя пользователя или пароль.';
          }
        })
        .catch(error => {
          messageDiv.textContent = 'Ошибка получения данных. Пожалуйста, попробуйте снова.';
          console.error('Ошибка:', error);
        });
    });
  }

  const assetsContainer = document.getElementById('assets-container');
  const searchInput = document.getElementById('search-input');

  if (assetsContainer) {
    // Главная страница
    fetch('/Assets-Package/data/assets.json')
      .then(response => response.json())
      .then(data => {
        displayAssets(data);

        searchInput.addEventListener('input', () => {
          const query = searchInput.value.toLowerCase();
          const filteredAssets = data.filter(asset =>
            asset.name.toLowerCase().includes(query) ||
            asset.description.toLowerCase().includes(query)
          );
          displayAssets(filteredAssets);
        });
      });

    // Отображение имени пользователя, если он вошел в систему
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      usernameDisplay.textContent = loggedInUser;
    }
  } else {
    // Страница деталей актива
    const urlParams = new URLSearchParams(window.location.search);
    const assetId = urlParams.get('id');

    fetch('/Assets-Package/data/assets.json')
      .then(response => response.json())
      .then(data => {
        const asset = data.find(item => item.id == assetId);
        if (asset) {
          document.getElementById('asset-name').textContent = asset.name;
          document.getElementById('asset-description').textContent = asset.description;
          document.getElementById('asset-download').href = asset.file;
          document.getElementById('asset-image').src = asset.image;
        }
      });
  }

  function displayAssets(assets) {
    assetsContainer.innerHTML = '';
    assets.forEach(asset => {
      const assetElement = document.createElement('div');
      assetElement.classList.add('asset-item');
      assetElement.innerHTML = `
        <div class="asset-text">
          <h2>${asset.name}</h2>
          <p>${asset.description}</p>
          <a href="asset-page.html?id=${asset.id}" class="view-details">Подробнее</a>
        </div>
        <img src="${asset.image}" alt="${asset.name}" class="asset-image">
      `;
      assetsContainer.appendChild(assetElement);
    });
  }
});
