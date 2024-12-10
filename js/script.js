document.addEventListener('DOMContentLoaded', function() {
    const assetsList = document.getElementById('assets-list');
    const assets = [
        {
            "id": 1,
            "name": "ScriptEditorWindow",
            "description": "Description of ScriptEditorWindow",
            "file": "assets/ScriptEditorWindow.unitypackage",
            "image": "images/ScriptEditorWindow.png"
        },
        {
            "id": 2,
            "name": "Asset 2",
            "description": "Description of Asset 2",
            "file": "assets/asset2.unitypackage",
            "image": "images/asset2.png"
        }
    ];

    assets.forEach(asset => {
        const assetItem = document.createElement('div');
        assetItem.className = 'asset-item';
        assetItem.innerHTML = `
            <h2>${asset.name}</h2>
            <img src="${asset.image}" alt="${asset.name}">
            <p>${asset.description}</p>
            <a href="${asset.file}" download>Download</a>
        `;
        assetItem.querySelector('img').addEventListener('click', function() {
            window.location.href = `pages/page${asset.id}.html`;
        });
        assetsList.appendChild(assetItem);

        // Create individual page for each asset
        fetch('page-template.html')
            .then(response => response.text())
            .then(html => {
                html = html.replace('id="pageTitle"', `id="pageTitle">${asset.name}`);
                html = html.replace('id="pageImage"', `id="pageImage" src="${asset.image}"`);
                html = html.replace('id="pageDescription"', `id="pageDescription">${asset.description}`);
                html = html.replace('id="pageDownloadLink"', `id="pageDownloadLink" href="${asset.file}"`);

                const blob = new Blob([html], { type: 'text/html' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `page${asset.id}.html`;
                link.click();
            });
    });
});
