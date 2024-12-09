function createPage() {
    window.location.href = 'create-page.html';
}

document.getElementById('create-page-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const pageName = document.getElementById('page-name').value;
    const pageImage = document.getElementById('page-image').value;
    const pageDescription = document.getElementById('page-description').value;
    const fileVersion = document.getElementById('file-version').value;
    const fileUpload = document.getElementById('file-upload').files[0];

    const pageId = generateUniqueId();
    localStorage.setItem(pageId, JSON.stringify({
        pageName,
        pageImage,
        pageDescription,
        fileVersion,
        fileUpload: URL.createObjectURL(fileUpload)
    }));

    window.location.href = 'index.html';
    showModal(pageId);
});

function generateUniqueId() {
    return 'page-' + Math.random().toString(36).substr(2, 9);
}

function showModal(pageId) {
    const pageData = JSON.parse(localStorage.getItem(pageId));
    document.getElementById('modal-title').innerText = pageData.pageName;
    document.getElementById('modal-image').src = pageData.pageImage;
    document.getElementById('modal-image').dataset.pageId = pageId;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function goToPage() {
    const pageId = document.getElementById('modal-image').dataset.pageId;
    const pageData = JSON.parse(localStorage.getItem(pageId));
    localStorage.setItem('currentPage', JSON.stringify(pageData));
    window.location.href = 'page-template.html';
}

function downloadFile() {
    const pageData = JSON.parse(localStorage.getItem('currentPage'));
    const link = document.createElement('a');
    link.href = pageData.fileUpload;
    link.download = pageData.pageName + '.file';
    link.click();
}

window.onload = function() {
    if (window.location.pathname.includes('page-template.html')) {
        const pageData = JSON.parse(localStorage.getItem('currentPage'));
        document.getElementById('page-name').innerText = pageData.pageName;
        document.getElementById('page-image').src = pageData.pageImage;
        document.getElementById('page-description').innerText = pageData.pageDescription;
        document.getElementById('file-version').innerText = 'Version: ' + pageData.fileVersion;
    }
};
