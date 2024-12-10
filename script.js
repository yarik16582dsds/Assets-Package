import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const messageDiv = document.getElementById('message');
  const usernameDisplay = document.getElementById('username-display');

  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          // Сохранение дополнительных данных пользователя в Firestore
          setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: user.displayName || email.split('@')[0],
            createdAt: serverTimestamp()
          });
          messageDiv.textContent = 'Регистрация успешна!';
          registerForm.reset();
        })
        .catch((error) => {
          messageDiv.textContent = 'Ошибка регистрации: ' + error.message;
        });
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          localStorage.setItem('loggedInUser', user.email);
          messageDiv.textContent = 'Вход успешен!';
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        })
        .catch((error) => {
          messageDiv.textContent = 'Ошибка входа: ' + error.message;
        });
    });
  }

  const assetsContainer = document.getElementById('assets-container');
  const searchInput = document.getElementById('search-input');

  if (assetsContainer) {
    // Главная страница
    fetch('/Assets-Package/data/assets.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
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
      })
      .catch(error => {
        console.error('Ошибка:', error);
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
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const asset = data.find(item => item.id == assetId);
        if (asset) {
          document.getElementById('asset-name').textContent = asset.name;
          document.getElementById('asset-description').textContent = asset.description;
          document.getElementById('asset-download').href = asset.file;
          document.getElementById('asset-image').src = asset.image;
        }
      })
      .catch(error => {
        console.error('Ошибка:', error);
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
