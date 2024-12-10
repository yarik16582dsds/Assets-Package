document.addEventListener('DOMContentLoaded', () => {
  const assetsContainer = document.getElementById('assets-container');

  if (assetsContainer) {
    // Главная страница
    fetch('/data/assets.json')
    fetch('/Assets-Package/data/assets.json')
      .then(response => response.json())
      .then(data => {
        data.forEach(asset => {
@ -22,16 +22,16 @@
    const urlParams = new URLSearchParams(window.location.search);
    const assetId = urlParams.get('id');

    fetch('/data/assets.json')
    fetch('/Assets-Package/data/assets.json')
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
