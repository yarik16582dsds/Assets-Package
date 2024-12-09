document.addEventListener('DOMContentLoaded', () => {
  const assetsContainer = document.getElementById('assets-container');
  const searchInput = document.getElementById('search-input');

  if (assetsContainer) {
    // Main page
    fetch('assets.json')
      .then(response => response.json())
      .then(assets => {
        assets.forEach(asset => {
          const assetItem = document.createElement('div');
          assetItem.className = 'asset-item';
          assetItem.setAttribute('data-id', asset.id);
          assetItem.setAttribute('data-name', asset.name);
          assetItem.setAttribute('data-description', asset.description);
          assetItem.setAttribute('data-file', asset.file);
          assetItem.setAttribute('data-image', asset.image);

          const assetText = document.createElement('div');
          assetText.className = 'asset-text';
          assetText.innerHTML = `
            <h2>${asset.name}</h2>
            <p>${asset.description}</p>
            <a href="asset-details.html?id=${asset.id}" class="view-details">View Details</a>
          `;

          const assetImage = document.createElement('img');
          assetImage.className = 'asset-image';
          assetImage.src = asset.image;
          assetImage.alt = asset.name;

          assetItem.appendChild(assetText);
          assetItem.appendChild(assetImage);
          assetsContainer.appendChild(assetItem);
        });

        searchInput.addEventListener('input', () => {
          const query = searchInput.value.toLowerCase();
          Array.from(assetsContainer.getElementsByClassName('asset-item')).forEach(asset => {
            const name = asset.getAttribute('data-name').toLowerCase();
            if (name.includes(query)) {
              asset.style.display = '';
            } else {
              asset.style.display = 'none';
            }
          });
        });
      })
      .catch(error => console.error('Error fetching assets:', error));
  } else {
    // Asset details page
    const urlParams = new URLSearchParams(window.location.search);
    const assetId = urlParams.get('id');

    if (assetId) {
      fetch('assets.json')
        .then(response => response.json())
        .then(assets => {
          const asset = assets.find(a => a.id == assetId);
          if (asset) {
            document.getElementById('asset-name').textContent = asset.name;
            document.getElementById('asset-description').textContent = asset.description;
            document.getElementById('asset-download').href = asset.file;
            document.getElementById('asset-image').src = asset.image;
          }
        })
        .catch(error => console.error('Error fetching asset details:', error));
    }
  }
});
