document.addEventListener('DOMContentLoaded', () => {
  const assetsContainer = document.getElementById('assets-container');

  if (assetsContainer) {
    // Главная страница
    fetch('/Assets-Package/data/assets.json')
      .then(response => response.json())
      .then(data => {
        data.forEach(asset => {
          const assetElement = document.createElement('div');
          assetElement.classList.add('asset-item');
          assetElement.innerHTML = `
            <h2>${asset.name}</h2>
            <p>${asset.description}</p>
            <img src="${asset.image}" alt="${asset.name}" width="100">
            <a href="asset-page.html?id=${asset.id}" class="view-details">View Details</a>
          `;
          assetsContainer.appendChild(assetElement);
@ -30,8 +31,9 @@
          document.getElementById('asset-name').textContent = asset.name;
          document.getElementById('asset-description').textContent = asset.description;
          document.getElementById('asset-download').href = asset.file;
          document.getElementById('asset-image').src = asset.image;
        }
      });
  }
});
