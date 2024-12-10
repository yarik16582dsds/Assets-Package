document.addEventListener('DOMContentLoaded', () => {
  const assetsContainer = document.getElementById('assets-container');

  if (assetsContainer) {
    // Главная страница
    fetch('/data/assets.json')
      .then(response => response.json())
      .then(data => {
        data.forEach(asset => {
          const assetElement = document.createElement('div');
          assetElement.classList.add('asset-item');
          assetElement.innerHTML = `
            <h2>${asset.name}</h2>
            <p>${asset.description}</p>
            <a href="asset-page.html?id=${asset.id}">View Details</a>
            <a href="asset-page.html?id=${asset.id}" class="view-details">View Details</a>
          `;
          assetsContainer.appendChild(assetElement);
        });
      });
  } else {
    // Страница ассета
    const urlParams = new URLSearchParams(window.location.search);
    const assetId = urlParams.get('id');

    fetch('/data/assets.json')
      .then(response => response.json())
      .then(data => {
        const asset = data.find(item => item.id == assetId);
        if (asset) {
          document.getElementById('asset-name').textContent = asset.name;
          document.getElementById('asset-description').textContent = asset.description;
          document.getElementById('asset-download').href = asset.file;
        }
      });
  }
});