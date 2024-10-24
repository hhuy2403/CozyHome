document.addEventListener("DOMContentLoaded", function() {
    loadUserInfo();
});

// Load user information from localStorage
function loadUserInfo() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const users = JSON.parse(localStorage.getItem("cozyhome-users"));

    if (loggedInUser && users) {
        const currentUser = users.find(user => user.email === loggedInUser.email);

        if (currentUser) {
            // Cập nhật thông tin tài khoản trên giao diện
            document.getElementById("userEmail").textContent = currentUser.email;
            document.getElementById("userName").textContent = currentUser.name || "N/A";
            document.getElementById("userPhone").textContent = currentUser.phone || "N/A";
            document.getElementById("userAddress").textContent = currentUser.address || "N/A";

            // Điền thông tin vào form sửa
            document.getElementById("editName").value = currentUser.name || "";
            document.getElementById("editPhone").value = currentUser.phone || "";
            document.getElementById("editAddress").value = currentUser.address || "";
        }
    }
}

// Save updated account information
function saveAccountInfo() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const users = JSON.parse(localStorage.getItem("cozyhome-users"));

    if (loggedInUser && users) {
        const currentUser = users.find(user => user.email === loggedInUser.email);

        if (currentUser) {
            // Lấy dữ liệu mới từ form
            const newName = document.getElementById("editName").value.trim();
            const newPhone = document.getElementById("editPhone").value.trim();
            const newAddress = document.getElementById("editAddress").value.trim();

            if (newName && newPhone && newAddress) {
                // Cập nhật dữ liệu
                currentUser.name = newName;
                currentUser.phone = newPhone;
                currentUser.address = newAddress;

                // Lưu lại vào localStorage
                localStorage.setItem("cozyhome-users", JSON.stringify(users));

                // Hiển thị lại thông tin mới
                loadUserInfo();
                hideEditAccountForm();

                Swal.fire({
                    icon: 'success',
                    title: 'Lưu thành công',
                    text: 'Thông tin tài khoản đã được cập nhật!'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Thông tin không hợp lệ',
                    text: 'Vui lòng điền đầy đủ thông tin!'
                });
            }
        }
    }
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmNewPassword = document.getElementById("confirmNewPassword").value.trim();

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const users = JSON.parse(localStorage.getItem("cozyhome-users"));

    if (loggedInUser && users) {
        const currentUser = users.find(user => user.email === loggedInUser.email);

        if (currentUser && currentPassword === currentUser.password) {
            if (newPassword === confirmNewPassword && newPassword.length >= 6) {
                currentUser.password = newPassword;
                localStorage.setItem("cozyhome-users", JSON.stringify(users));
                Swal.fire({
                    icon: 'success',
                    title: 'Đổi mật khẩu thành công'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Mật khẩu không khớp',
                    text: 'Vui lòng nhập lại mật khẩu!'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Mật khẩu hiện tại không đúng',
                text: 'Vui lòng kiểm tra lại!'
            });
        }
    }
}

// Show and hide edit account form
function showEditAccountForm() {
    document.getElementById('editAccountForm').style.display = 'block';
}

function hideEditAccountForm() {
    document.getElementById('editAccountForm').style.display = 'none';
}


