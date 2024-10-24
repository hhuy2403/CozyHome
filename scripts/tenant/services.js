document.addEventListener("DOMContentLoaded", function() {
    loadHeaderFooter();
    loadServiceUsageData();
    renderServiceChart();
});

// Hàm để tải header và footer
function loadHeaderFooter() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            setupLogoutEvent();
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
}

// Hàm để gắn sự kiện cho nút đăng xuất
function setupLogoutEvent() {
    const logoutLink = document.getElementById('logout-link');
    
    // Kiểm tra xem logoutLink có tồn tại trước khi gắn sự kiện
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
            confirmLogout();
        });
    }
}

// Xác nhận khi người dùng đăng xuất
function confirmLogout() {
    Swal.fire({
        title: 'Bạn có chắc muốn đăng xuất?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            // Xóa thông tin đăng nhập khỏi localStorage
            localStorage.removeItem('loggedInUser');

            // Điều hướng đến trang đăng nhập
            window.location.href = '../../../pages/auth/login.html';
        }
    });
}


// Dữ liệu mẫu cho chỉ số điện, nước hàng tháng
const serviceUsageData = [
    { month: '01/2024', electricity: 150, water: 30 },
    { month: '02/2024', electricity: 170, water: 35 },
    { month: '03/2024', electricity: 200, water: 32 },
    { month: '04/2024', electricity: 180, water: 28 },
    { month: '05/2024', electricity: 190, water: 34 },
    { month: '06/2024', electricity: 210, water: 40 }
];

// Hàm để tải dữ liệu chỉ số vào bảng
function loadServiceUsageData() {
    const tbody = document.getElementById('service-usage-tbody');
    tbody.innerHTML = '';

    serviceUsageData.forEach(usage => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${usage.month}</td>
            <td>${usage.electricity}</td>
            <td>${usage.water}</td>
        `;
        tbody.appendChild(row);
    });
}

// Hàm để hiển thị biểu đồ theo dõi chỉ số
function renderServiceChart() {
    const ctx = document.getElementById('serviceChart').getContext('2d');
    
    const months = serviceUsageData.map(usage => usage.month);
    const electricityData = serviceUsageData.map(usage => usage.electricity);
    const waterData = serviceUsageData.map(usage => usage.water);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Chỉ Số Điện (kWh)',
                    data: electricityData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'Chỉ Số Nước (m³)',
                    data: waterData,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderWidth: 2,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tháng'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Chỉ Số'
                    }
                }
            }
        }
    });
}
