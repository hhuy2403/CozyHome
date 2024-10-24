document.addEventListener("DOMContentLoaded", function() {
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const forgotPasswordError = document.getElementById("forgotPasswordError");

    // Regular expression for validating an email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Xử lý sự kiện khi nhấn gửi yêu cầu khôi phục mật khẩu
    forgotPasswordForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();

        // Reset lỗi trước đó
        forgotPasswordError.textContent = "";

        // Kiểm tra tính hợp lệ của email
        if (!email) {
            forgotPasswordError.textContent = "Vui lòng nhập email.";
            return;
        }

        if (!emailRegex.test(email)) {
            forgotPasswordError.textContent = "Email không hợp lệ.";
            return;
        }

        // Lấy danh sách người dùng từ localStorage
        const storedUsers = JSON.parse(localStorage.getItem("cozyhome-users")) || [];

        // Kiểm tra xem email có tồn tại trong danh sách người dùng không
        const userIndex = storedUsers.findIndex(user => user.email === email);

        if (userIndex === -1) {
            forgotPasswordError.textContent = "Email không tồn tại trong hệ thống.";
            return;
        }

        // Giả lập gửi yêu cầu khôi phục mật khẩu và đặt lại mật khẩu
        Swal.fire({
            title: 'Nhập mật khẩu mới',
            input: 'password',
            inputAttributes: {
                minlength: 6,
                placeholder: 'Nhập mật khẩu mới (ít nhất 6 ký tự)',
                required: true
            },
            showCancelButton: true,
            confirmButtonText: 'Đặt lại mật khẩu',
            cancelButtonText: 'Hủy',
            inputValidator: (value) => {
                if (!value || value.length < 6) {
                    return 'Mật khẩu phải có ít nhất 6 ký tự!';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const newPassword = result.value;
                // Cập nhật mật khẩu mới cho người dùng
                storedUsers[userIndex].password = newPassword;
                localStorage.setItem("cozyhome-users", JSON.stringify(storedUsers));

                Swal.fire(
                    'Thành công!',
                    'Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.',
                    'success'
                ).then(() => {
                    window.location.href = "login.html";
                });
            }
        });
    });

    // Reload trang khi người dùng sử dụng nút quay lại trình duyệt
    window.addEventListener('popstate', function(event) {
        window.location.reload();
    });

    // Toggle navbar for mobile
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            navLinks.classList.toggle("show");
        });
    }
});
