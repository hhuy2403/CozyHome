document.addEventListener("DOMContentLoaded", function() {
    
    loadBills();
});

// Hàm để tải danh sách hóa đơn từ localStorage
function loadBills() {
    const bills = JSON.parse(localStorage.getItem("cozyhome-bills")) || [];
    displayBills(bills);
    displayTotalAmount(bills); // Hiển thị tổng số tiền
}

// Hàm để hiển thị danh sách hóa đơn
function displayBills(bills) {
    const billsContainer = document.getElementById("bills-container");
    billsContainer.innerHTML = '';

    if (bills.length === 0) {
        billsContainer.innerHTML = '<p>Không có hóa đơn nào cần thanh toán.</p>';
        return;
    }

    bills.forEach(bill => {
        const billElement = document.createElement('div');
        billElement.classList.add('bill-item');
        billElement.innerHTML = `
            <p><strong>Số hóa đơn:</strong> ${bill.billNumber} | <strong>Số tiền:</strong> ${formatCurrency(bill.amount)} VND</p>
            <div>
                <button class="cozyhome-btn cozyhome-btn-primary" onclick="selectBill('${bill.billNumber}', '${bill.amount}')">
                    Thanh Toán
                </button>
                <button class="cozyhome-btn cozyhome-btn-secondary" onclick="viewBillDetails('${bill.billNumber}')">
                    Xem Chi Tiết
                </button>
            </div>
        `;
        billsContainer.appendChild(billElement);
    });
}

// Hàm để hiển thị tổng số tiền
function displayTotalAmount(bills) {
    const totalAmount = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
    document.getElementById("totalAmount").textContent = `${formatCurrency(totalAmount)} VNĐ`;
}

// Hàm để xem chi tiết hóa đơn
function viewBillDetails(billNumber) {
    const bills = JSON.parse(localStorage.getItem("cozyhome-bills")) || [];
    const selectedBill = bills.find(bill => bill.billNumber === billNumber);

    if (selectedBill) {
        Swal.fire({
            title: `Chi Tiết Hóa Đơn: ${selectedBill.billNumber}`,
            html: `
                <p><strong>Tiền phòng:</strong> ${formatCurrency(selectedBill.roomFee)} VND</p>
                <p><strong>Tiền dịch vụ:</strong> ${formatCurrency(selectedBill.serviceFee)} VND</p>
                <p><strong>Tiền điện:</strong> ${formatCurrency(selectedBill.electricityFee)} VND</p>
                <p><strong>Tiền nước:</strong> ${formatCurrency(selectedBill.waterFee)} VND</p>
                <p><strong>Ngày hết hạn:</strong> ${selectedBill.dueDate}</p>
            `,
            icon: 'info'
        });
    }
}

// Hàm để chọn hóa đơn cần thanh toán
function selectBill(billNumber, amount) {
    document.getElementById("billNumber").value = billNumber;
    document.getElementById("paymentAmount").value = formatCurrency(amount);
}

// Hàm để xử lý thanh toán
function processPayment() {
    const billNumber = document.getElementById("billNumber").value;
    const paymentAmount = document.getElementById("paymentAmount").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const payerName = document.getElementById("payerName").value.trim();
    const paymentDate = document.getElementById("paymentDate").value;

    if (!payerName || !paymentDate || !billNumber || !paymentAmount) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng nhập đầy đủ thông tin thanh toán!'
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Thanh toán thành công!',
        text: `Hóa đơn ${billNumber} đã được thanh toán.`,
    });

    const bills = JSON.parse(localStorage.getItem("cozyhome-bills")) || [];
    const updatedBills = bills.filter(bill => bill.billNumber !== billNumber);
    localStorage.setItem("cozyhome-bills", JSON.stringify(updatedBills));

    loadBills();
    document.getElementById("payment-form").reset();
}

// Hàm để định dạng số tiền theo dạng "3,000,000"
function formatCurrency(amount) {
    return parseFloat(amount).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
}

// Dữ liệu mẫu hóa đơn chi tiết
const sampleBills = [
    {
        billNumber: "HD12345",
        amount: "5000000",
        dueDate: "2024-10-31",
        roomFee: "3000000",
        serviceFee: "500000",
        electricityFee: "1000000",
        waterFee: "500000"
    },
    {
        billNumber: "HD67890",
        amount: "3000000",
        dueDate: "2024-11-15",
        roomFee: "2000000",
        serviceFee: "300000",
        electricityFee: "500000",
        waterFee: "200000"
    }
];

localStorage.setItem("cozyhome-bills", JSON.stringify(sampleBills));
