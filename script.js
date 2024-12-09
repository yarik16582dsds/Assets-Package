document.addEventListener('DOMContentLoaded', () => {
  const assetsContainer = document.getElementById('assets-container');
  const searchInput = document.getElementById('search-input');

  if (assetsContainer) {
    // Главная страница
    const assetItems = Array.from(assetsContainer.getElementsByClassName('asset-item'));

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      assetItems.forEach(asset => {
        const name = asset.getAttribute('data-name').toLowerCase();
        if (name.includes(query)) {
          asset.style.display = '';
        } else {
          asset.style.display = 'none';
        }
      });
    });
  } else {
    // Страница ассета
    const urlParams = new URLSearchParams(window.location.search);
    const assetId = urlParams.get('id');

    const assetItem = document.querySelector(`.asset-item[data-id="${assetId}"]`);
    if (assetItem) {
      document.getElementById('asset-name').textContent = assetItem.getAttribute('data-name');
      document.getElementById('asset-description').textContent = assetItem.getAttribute('data-description');
      document.getElementById('asset-download').href = assetItem.getAttribute('data-file');
      document.getElementById('asset-image').src = assetItem.getAttribute('data-image');
    }
  }
});
