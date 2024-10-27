document.addEventListener("DOMContentLoaded", function () {


    renderDebtList();
    renderUnpaidBillsList();

    // Hiển thị form tạo công nợ mới
    window.showCreateDebtForm = function () {
        document.getElementById("createDebtForm").style.display = "block";
    };

    // Ẩn form tạo công nợ mới
    window.hideCreateDebtForm = function () {
        document.getElementById("createDebtForm").style.display = "none";
    };

    // Tạo công nợ mới
    window.createNewDebt = function () {
        const email = document.getElementById("newDebtEmail").value.trim();
        const amount = parseFloat(document.getElementById("newDebtAmount").value);
        const date = document.getElementById("newDebtDate").value;

        if (!email || isNaN(amount) || !date) {
            Swal.fire('Vui lòng nhập đầy đủ thông tin công nợ.', '', 'error');
            return;
        }

        const newDebt = { email, amount, date, status: "Chưa Thanh Toán" };
        const debts = JSON.parse(localStorage.getItem("cozyhome-debts")) || [];
        debts.push(newDebt);
        localStorage.setItem("cozyhome-debts", JSON.stringify(debts));

        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Công nợ mới đã được tạo thành công!'
        });

        hideCreateDebtForm();
        renderDebtList();
    };

    // Sửa công nợ
    window.editDebt = function (index) {
        const debts = JSON.parse(localStorage.getItem("cozyhome-debts")) || [];
        const debt = debts[index];

        document.getElementById("editDebtEmail").value = debt.email;
        document.getElementById("editDebtAmount").value = debt.amount;
        document.getElementById("editDebtDate").value = debt.date;
        document.getElementById("editDebtIndex").value = index;
        document.getElementById("editDebtForm").style.display = "block";
    };

    // Cập nhật công nợ đã chỉnh sửa
    window.updateDebt = function () {
        const index = document.getElementById("editDebtIndex").value;
        const debts = JSON.parse(localStorage.getItem("cozyhome-debts")) || [];
        const debt = debts[index];

        debt.amount = parseFloat(document.getElementById("editDebtAmount").value);
        debt.date = document.getElementById("editDebtDate").value;
        if (debt.amount <= 0) debt.status = "Đã Thanh Toán";

        debts[index] = debt;
        localStorage.setItem("cozyhome-debts", JSON.stringify(debts));

        Swal.fire('Công nợ đã được cập nhật!', '', 'success');
        hideEditDebtForm();
        renderDebtList();
    };

    // Ẩn form chỉnh sửa công nợ
    window.hideEditDebtForm = function () {
        document.getElementById("editDebtForm").style.display = "none";
    };

    // Xóa công nợ
    window.deleteDebt = function (index) {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Bạn có muốn xóa công nợ này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                const debts = JSON.parse(localStorage.getItem("cozyhome-debts")) || [];
                debts.splice(index, 1);
                localStorage.setItem("cozyhome-debts", JSON.stringify(debts));
                Swal.fire('Đã xóa!', 'Công nợ đã được xóa.', 'success');
                renderDebtList();
            }
        });
    };

    // Hiển thị danh sách công nợ
    function renderDebtList() {
        const debts = JSON.parse(localStorage.getItem("cozyhome-debts")) || [];
        const debtList = document.getElementById("debtList");

        if (debts.length === 0) {
            debtList.innerHTML = `<tr><td colspan="5" class="no-data">Không có công nợ nào.</td></tr>`;
        } else {
            debtList.innerHTML = debts.map((debt, index) => `
                <tr>
                    <td>${debt.email}</td>
                    <td>${debt.amount.toLocaleString()} VND</td>
                    <td>${debt.date}</td>
                    <td>${debt.status}</td>
                    <td>
                        <button class="cozyhome-btn cozyhome-btn-secondary" onclick="editDebt(${index})"><i class="fas fa-edit"></i> Chỉnh Sửa</button>
                        <button class="cozyhome-btn cozyhome-btn-danger" onclick="deleteDebt(${index})"><i class="fas fa-trash"></i> Xóa</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // Hiển thị form tạo hóa đơn mới
    window.showCreateBillForm = function () {
        document.getElementById("createBillForm").style.display = "block";
    };

    // Ẩn form tạo hóa đơn mới
    window.hideCreateBillForm = function () {
        document.getElementById("createBillForm").style.display = "none";
    };

    // Tạo hóa đơn mới
    window.createNewBill = function () {
        const email = document.getElementById("newBillEmail").value.trim();
        const amount = parseFloat(document.getElementById("newBillAmount").value);
        const dueDate = document.getElementById("newBillDueDate").value;

        if (!email || isNaN(amount) || !dueDate) {
            Swal.fire('Vui lòng nhập đầy đủ thông tin hóa đơn.', '', 'error');
            return;
        }

        const newBill = { email, amount, dueDate, status: "Chưa Thanh Toán" };
        const unpaidBills = JSON.parse(localStorage.getItem("cozyhome-unpaid-bills")) || [];
        unpaidBills.push(newBill);
        localStorage.setItem("cozyhome-unpaid-bills", JSON.stringify(unpaidBills));

        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Hóa đơn mới đã được tạo thành công!'
        });

        hideCreateBillForm();
        renderUnpaidBillsList();
    };

    // Tìm kiếm hóa đơn chưa thanh toán
    window.searchUnpaidBill = function () {
        const searchValue = document.getElementById("unpaidBillSearch").value.trim().toLowerCase();
        const unpaidBills = JSON.parse(localStorage.getItem("cozyhome-unpaid-bills")) || [];
        const filteredBills = unpaidBills.filter(bill => bill.email.toLowerCase().includes(searchValue));

        renderFilteredUnpaidBills(filteredBills);
    };

    // Hiển thị danh sách hóa đơn chưa thanh toán theo kết quả tìm kiếm
    function renderFilteredUnpaidBills(filteredBills) {
        const unpaidBillsList = document.getElementById("unpaidBillsList");
        if (filteredBills.length === 0) {
            unpaidBillsList.innerHTML = `<tr><td colspan="5" class="no-data">Không tìm thấy kết quả.</td></tr>`;
        } else {
            unpaidBillsList.innerHTML = filteredBills.map((bill, index) => `
                <tr>
                    <td>${bill.email}</td>
                    <td>${bill.amount.toLocaleString()} VND</td>
                    <td>${bill.dueDate}</td>
                    <td>${bill.status}</td>
                    <td>
                        ${bill.status === "Chưa Thanh Toán" ?
                `<button class="cozyhome-btn cozyhome-btn-secondary" onclick="markAsPaid(${index})"><i class="fas fa-money-check-alt"></i> Đã Thanh Toán</button>` :
                `<span class="paid-label">Đã Thanh Toán</span>
                 <button class="cozyhome-btn cozyhome-btn-danger" onclick="deleteBill(${index})"><i class="fas fa-trash"></i> Xóa</button>`}
                    </td>
                </tr>
            `).join('');
        }
    }

    // Đánh dấu hóa đơn là đã thanh toán
    window.markAsPaid = function (index) {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Bạn có muốn đánh dấu hóa đơn này là đã thanh toán?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đã thanh toán',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                const unpaidBills = JSON.parse(localStorage.getItem("cozyhome-unpaid-bills")) || [];
                const bill = unpaidBills[index];

                if (bill.status === "Chưa Thanh Toán") {
                    bill.status = "Đã Thanh Toán";
                    unpaidBills[index] = bill;
                    localStorage.setItem("cozyhome-unpaid-bills", JSON.stringify(unpaidBills));
                    updateDebtList(bill.email, "subtract", bill.amount);
                    Swal.fire('Hóa đơn đã được đánh dấu là đã thanh toán!', '', 'success');
                    renderUnpaidBillsList();
                }
            }
        });
    };

    // Xóa hóa đơn
    window.deleteBill = function (index) {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: 'Bạn có muốn xóa hóa đơn này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                const unpaidBills = JSON.parse(localStorage.getItem("cozyhome-unpaid-bills")) || [];
                unpaidBills.splice(index, 1);
                localStorage.setItem("cozyhome-unpaid-bills", JSON.stringify(unpaidBills));
                Swal.fire('Đã xóa!', 'Hóa đơn đã được xóa.', 'success');
                renderUnpaidBillsList();
            }
        });
    };

    // Cập nhật danh sách công nợ khi thanh toán hóa đơn
    function updateDebtList(email, action, amount) {
        const debts = JSON.parse(localStorage.getItem("cozyhome-debts")) || [];
        const debtIndex = debts.findIndex(debt => debt.email === email);

        if (debtIndex !== -1 && action === "subtract") {
            debts[debtIndex].amount -= amount;
            if (debts[debtIndex].amount <= 0) debts[debtIndex].status = "Đã Thanh Toán";
        }

        localStorage.setItem("cozyhome-debts", JSON.stringify(debts));
        renderDebtList();
    }

    // Hiển thị danh sách hóa đơn chưa thanh toán
    function renderUnpaidBillsList() {
        const unpaidBills = JSON.parse(localStorage.getItem("cozyhome-unpaid-bills")) || [];
        renderFilteredUnpaidBills(unpaidBills);
    }
});
