document.addEventListener('DOMContentLoaded', () => {
  const assetsContainer = document.getElementById('assets-container');
  const searchInput = document.getElementById('search-input');

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
          document.getElementById('asset-version').textContent = `Version: ${asset.version}`;
          document.getElementById('asset-size').textContent = `Size: ${asset.size}`;
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
          <a href="asset-page.html?id=${asset.id}" class="view-details">View Details</a>
        </div>
        <img src="${asset.image}" alt="${asset.name}" class="asset-image">
      `;
      assetsContainer.appendChild(assetElement);
    });
  }
});
