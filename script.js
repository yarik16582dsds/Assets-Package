document.addEventListener('DOMContentLoaded', () => {
  const assetsContainer = document.getElementById('assets-container');
  const searchInput = document.getElementById('search-input');
  const addButton = document.getElementById('add-button');
  const addAssetForm = document.getElementById('add-asset-form');
  const modal = document.getElementById('modal');
  const closeButton = document.querySelector('.close-button');

  if (addButton) {
    addButton.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });

  if (addAssetForm) {
    addAssetForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;
      const image = document.getElementById('image').value;
      const file = document.getElementById('file').value;

      const newAsset = {
        id: Date.now(), // Уникальный идентификатор
        name,
        description,
        image,
        file
      };

      // Сохраните обновленные данные в файл assets.json
      // Этот шаг требует серверной логики, так как GitHub Pages не поддерживает запись файлов
      // В реальном приложении вы бы отправили данные на сервер для сохранения
      console.log('New asset added:', newAsset);

      // Пример использования GitHub API для создания файла в репозитории
      const repoOwner = 'your-username';
      const repoName = 'your-repo-name';
      const branch = 'main';
      const filePath = `pages/${newAsset.id}.html`;
      const fileContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${newAsset.name}</title>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <header>
            <h1>${newAsset.name}</h1>
          </header>
          <main>
            <img src="${newAsset.image}" alt="${newAsset.name}">
            <p>${newAsset.description}</p>
            <a href="${newAsset.file}" download>Download</a>
          </main>
        </body>
        </html>
      `;

      const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

      fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token YOUR_GITHUB_TOKEN`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Add ${newAsset.name}`,
          content: encodedContent,
          branch
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('File created:', data);
        modal.style.display = 'none';
        window.location.href = `/Assets-Package/index.html`;
      })
      .catch(error => {
        console.error('Error creating file:', error);
      });
    });
  }

  if (assetsContainer) {
    // Main page
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
  } else {
    // Asset details page
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
          <a href="/Assets-Package/pages/${asset.id}.html" class="view-details">View Details</a>
        </div>
        <img src="${asset.image}" alt="${asset.name}" class="asset-image">
      `;
      assetsContainer.appendChild(assetElement);
    });
  }
});
