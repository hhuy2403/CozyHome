document.addEventListener("DOMContentLoaded", function () {
    fetch("../sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;
        })
        .catch(error => console.error('Error loading sidebar:', error));
});

function redirectToCreatePage() {
    // Điều hướng sang trang Create.html
    window.location.href = 'Create.html'; // Đường dẫn có thể tùy chỉnh theo cấu trúc dự án của bạn
}

function redirectToEditPage(serviceName, serviceType, price) {
    // Lưu thông tin dịch vụ vào localStorage
    localStorage.setItem('selectedService', JSON.stringify({
        name: serviceName,
        type: serviceType,
        price: price
    }));

    // Điều hướng sang trang Edit.html
    window.location.href = 'edit.html'; // Đường dẫn có thể tùy chỉnh theo cấu trúc dự án của bạn
}