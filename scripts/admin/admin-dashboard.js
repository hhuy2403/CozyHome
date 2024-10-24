let dashboardChart; // Khai báo biến cho biểu đồ

document.addEventListener("DOMContentLoaded", function() {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        // Nếu không đăng nhập, chuyển hướng đến trang đăng nhập
        window.location.href = "/pages/auth/login.html";
        return;
    }

    // Tải nội dung header và footer
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });

    // Cập nhật dashboard
    updateDashboard();

    function updateDashboard() {
        const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];
        const unpaidBills = JSON.parse(localStorage.getItem("cozyhome-unpaid-bills")) || [];
        const debts = JSON.parse(localStorage.getItem("cozyhome-debts")) || [];
        const contracts = JSON.parse(localStorage.getItem("cozyhome-contracts")) || [];

        // Cập nhật thông tin tổng quan
        document.getElementById("totalUsers").textContent = users.length;
        document.getElementById("totalUnpaidBills").textContent = unpaidBills.length;
        document.getElementById("totalDebts").textContent = debts.reduce((total, debt) => total + debt.amount, 0).toLocaleString() + ' VND';
        document.getElementById("totalContracts").textContent = contracts.length;

        // Cập nhật biểu đồ thống kê
        renderChart();

        // Cập nhật thông báo về công nợ
        updateNotifications(debts);
    }

    function renderChart() {
        const ctx = document.getElementById('dashboardChart').getContext('2d');

        // Nếu biểu đồ đã tồn tại, hãy tiêu hủy nó
        if (dashboardChart) {
            dashboardChart.destroy();
        }

        // Tạo dữ liệu cho biểu đồ
        const data = {
            labels: ['Người Dùng', 'Hóa Đơn Chưa Thanh Toán', 'Công Nợ', 'Hợp Đồng Bảo Trì'],
            datasets: [{
                label: 'Số Lượng',
                data: [
                    document.getElementById("totalUsers").textContent,
                    document.getElementById("totalUnpaidBills").textContent,
                    document.getElementById("totalDebts").textContent.replace(/[^0-9]/g, ''), // remove VND
                    document.getElementById("totalContracts").textContent,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        };

        // Tạo biểu đồ mới
        dashboardChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function updateNotifications(debts) {
        const notificationList = document.getElementById("notificationList");
        notificationList.innerHTML = ''; // Xóa nội dung cũ

        debts.forEach(debt => {
            const listItem = document.createElement('li');
            listItem.textContent = `${debt.email} - ${debt.amount.toLocaleString()} VND - ${debt.status}`;
            if (debt.status === "Chưa Thanh Toán") {
                listItem.style.color = 'red'; // Đánh dấu công nợ chưa thanh toán
            }
            notificationList.appendChild(listItem);
        });

        if (debts.length === 0) {
            notificationList.innerHTML = '<li>Không có công nợ nào.</li>';
        }
    }
});

window.addEventListener('popstate', function(event) {
    window.location.reload();
});