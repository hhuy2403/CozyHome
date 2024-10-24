document.addEventListener("DOMContentLoaded", function() {
    loadAssetsData();
});

// Dữ liệu mẫu cho tài sản trong phòng trọ
const assetsData = [
    { name: 'Giường ngủ', category: 'furniture', condition: 'Tốt' },
    { name: 'Tủ lạnh', category: 'appliances', condition: 'Còn mới' },
    { name: 'Máy lạnh', category: 'electronics', condition: 'Tốt' },
    { name: 'Bàn làm việc', category: 'furniture', condition: 'Đã cũ' },
    { name: 'Bếp từ', category: 'appliances', condition: 'Tốt' }
];

// Hàm để hiển thị danh sách tài sản
function loadAssetsData() {
    const assetsContainer = document.getElementById('assets-container');
    assetsContainer.innerHTML = '';

    assetsData.forEach(asset => {
        const assetElement = document.createElement('div');
        assetElement.classList.add('asset-item');
        assetElement.innerHTML = `
            <strong>${asset.name}</strong>
            <span>${getCategoryName(asset.category)} - Tình trạng: ${asset.condition}</span>
        `;
        assetsContainer.appendChild(assetElement);
    });
}

// Hàm để chuyển đổi tên loại tài sản thành dạng dễ đọc
function getCategoryName(category) {
    switch(category) {
        case 'furniture': return 'Nội thất';
        case 'electronics': return 'Điện tử';
        case 'appliances': return 'Thiết bị gia dụng';
        default: return 'Khác';
    }
}

// Hàm để lọc tài sản dựa trên tìm kiếm và loại tài sản
function filterAssets() {
    const searchQuery = document.getElementById('searchQuery').value.toLowerCase();
    const selectedCategory = document.getElementById('assetCategory').value;

    const filteredAssets = assetsData.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchQuery);
        const matchesCategory = selectedCategory === '' || asset.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Hiển thị tài sản đã lọc
    displayFilteredAssets(filteredAssets);
}

// Hàm để hiển thị danh sách tài sản đã lọc
function displayFilteredAssets(assets) {
    const assetsContainer = document.getElementById('assets-container');
    assetsContainer.innerHTML = '';

    if (assets.length === 0) {
        assetsContainer.innerHTML = '<p>Không tìm thấy tài sản phù hợp.</p>';
        return;
    }

    assets.forEach(asset => {
        const assetElement = document.createElement('div');
        assetElement.classList.add('asset-item');
        assetElement.innerHTML = `
            <strong>${asset.name}</strong>
            <span>${getCategoryName(asset.category)} - Tình trạng: ${asset.condition}</span>
        `;
        assetsContainer.appendChild(assetElement);
    });
}
