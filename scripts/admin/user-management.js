document.addEventListener("DOMContentLoaded", function() {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        Swal.fire({
            icon: 'error',
            title: 'Bạn cần đăng nhập!',
            text: 'Vui lòng đăng nhập để truy cập vào hệ thống.',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = "/pages/auth/login.html";
        });
        return;
    }

    renderUserList();

    // Hiển thị form tạo tài khoản mới
    window.showCreateUserForm = function() {
        document.getElementById("createUserForm").style.display = "block";
    };

    // Ẩn form tạo tài khoản mới
    window.hideCreateUserForm = function() {
        document.getElementById("createUserForm").style.display = "none";
    };

    // Tạo tài khoản mới
    window.createUser = function() {
        const email = document.getElementById("newUserEmail").value.trim();
        const password = document.getElementById("newUserPassword").value;
        const role = document.getElementById("newUserRole").value;

        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin!',
                text: 'Vui lòng điền đầy đủ thông tin.',
                confirmButtonText: 'OK'
            });
            return;
        }

        const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];

        if (users.some(user => user.email === email)) {
            Swal.fire({
                icon: 'error',
                title: 'Email đã tồn tại!',
                text: 'Vui lòng sử dụng email khác.',
                confirmButtonText: 'OK'
            });
            return;
        }

        users.push({ email, password, role });
        localStorage.setItem("cozyhome-users", JSON.stringify(users));

        Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Tạo tài khoản thành công.',
            confirmButtonText: 'OK'
        });

        hideCreateUserForm();
        renderUserList();
    };

    // Xóa tài khoản
    window.deleteUser = function(email) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];
                const updatedUsers = users.filter(user => user.email !== email);

                localStorage.setItem("cozyhome-users", JSON.stringify(updatedUsers));

                Swal.fire({
                    icon: 'success',
                    title: 'Đã xóa!',
                    text: 'Tài khoản đã được xóa thành công.',
                    confirmButtonText: 'OK'
                });

                renderUserList();
            }
        });
    };

    // Cấp lại mật khẩu
    window.resetPassword = function(email) {
        Swal.fire({
            title: 'Cấp lại mật khẩu',
            input: 'password',
            inputLabel: 'Nhập mật khẩu mới cho người dùng',
            inputPlaceholder: 'Nhập mật khẩu mới',
            inputAttributes: {
                maxlength: 50,
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy',
            preConfirm: (newPassword) => {
                if (!newPassword) {
                    Swal.showValidationMessage('Vui lòng nhập mật khẩu mới.');
                }
                return newPassword;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];
                const userIndex = users.findIndex(user => user.email === email);

                if (userIndex !== -1) {
                    users[userIndex].password = result.value;
                    localStorage.setItem("cozyhome-users", JSON.stringify(users));

                    Swal.fire({
                        icon: 'success',
                        title: 'Cấp lại mật khẩu thành công!',
                        confirmButtonText: 'OK'
                    });

                    renderUserList();
                }
            }
        });
    };

    // Tìm kiếm người dùng
    window.searchUser = function() {
        const searchValue = document.getElementById("userSearch").value.trim().toLowerCase();
        const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];
        const filteredUsers = users.filter(user => user.email.toLowerCase().includes(searchValue));

        renderFilteredUserList(filteredUsers);
    };

    // Hiển thị danh sách người dùng
    function renderUserList() {
        const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];
        renderFilteredUserList(users);
    }

    // Hiển thị danh sách người dùng theo kết quả tìm kiếm
    function renderFilteredUserList(users) {
        const userList = document.getElementById("userList");

        if (users.length === 0) {
            userList.innerHTML = `<tr><td colspan="3" class="no-data">Không tìm thấy người dùng nào.</td></tr>`;
        } else {
            userList.innerHTML = users.map(user => `
                <tr>
                    <td>${user.email}</td>
                    <td>
                        <select onchange="updateUserRole('${user.email}', this.value)">
                            <option value="tenant" ${user.role === 'tenant' ? 'selected' : ''}>Người Thuê</option>
                            <option value="landlord" ${user.role === 'landlord' ? 'selected' : ''}>Chủ Trọ</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Quản Trị Viên</option>
                        </select>
                    </td>
                    <td>
                        <button onclick="resetPassword('${user.email}')" class="cozyhome-btn cozyhome-btn-secondary"><i class="fas fa-paper-plane"></i> Cấp lại mật khẩu</button>
                        <button onclick="deleteUser('${user.email}')" class="cozyhome-btn cozyhome-btn-danger"><i class="fas fa-trash"></i> Xóa</button>
                    </td>
                </tr>
            `).join('');
        }
    }
});

// Phân quyền cho người dùng
window.updateUserRole = function(email, newRole) {
    const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];
    const userIndex = users.findIndex(user => user.email === email);
    const currentUserRole = users[userIndex].role; // Lấy vai trò hiện tại

    // Nếu vai trò không thay đổi, không cần thực hiện gì
    if (newRole === currentUserRole) {
        return;
    }

    // Xác nhận khi phân quyền
    Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: `Bạn có chắc muốn thay đổi quyền của người dùng ${email} từ "${currentUserRole}" thành "${newRole}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Phân quyền',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            if (userIndex !== -1) {
                users[userIndex].role = newRole; // Cập nhật quyền người dùng
                localStorage.setItem("cozyhome-users", JSON.stringify(users)); // Lưu vào localStorage

                Swal.fire({
                    icon: 'success',
                    title: 'Phân quyền thành công!',
                    text: `Quyền của người dùng ${email} đã được thay đổi thành "${newRole}".`,
                    confirmButtonText: 'OK'
                });

                renderUserList(); // Cập nhật danh sách người dùng
            }
        } else {
            // Nếu hủy, khôi phục lại lựa chọn cũ trong dropdown
            renderUserList();
        }
    });
};
