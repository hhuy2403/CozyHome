document.addEventListener("DOMContentLoaded", function() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('show');
        });
    }

    const registerForm = document.getElementById("registerForm");
    const registerError = document.getElementById("registerError");

    // Xử lý ẩn/hiện mật khẩu
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    togglePassword.addEventListener("click", function() {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.querySelector("i").classList.toggle("fa-eye");
        this.querySelector("i").classList.toggle("fa-eye-slash");
    });

    toggleConfirmPassword.addEventListener("click", function() {
        const type = confirmPasswordInput.getAttribute("type") === "password" ? "text" : "password";
        confirmPasswordInput.setAttribute("type", type);
        this.querySelector("i").classList.toggle("fa-eye");
        this.querySelector("i").classList.toggle("fa-eye-slash");
    });


    // Regular expression for validating an email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Xử lý sự kiện khi nhấn đăng ký
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Reset lỗi trước đó
        registerError.textContent = "";

        // Kiểm tra tính hợp lệ của email và mật khẩu
        if (!email) {
            registerError.textContent = "Vui lòng nhập email.";
            return;
        }

        if (!emailRegex.test(email)) {
            registerError.textContent = "Email không hợp lệ.";
            return;
        }

        if (!password) {
            registerError.textContent = "Vui lòng nhập mật khẩu.";
            return;
        }

        if (password.length < 6) {
            registerError.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
            return;
        }

        if (password !== confirmPassword) {
            registerError.textContent = "Mật khẩu và nhập lại mật khẩu không khớp.";
            return;
        }

        // Lấy danh sách người dùng từ localStorage hoặc tạo mới nếu chưa có
        const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];

        // Kiểm tra xem email đã tồn tại chưa
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            registerError.textContent = "Email đã tồn tại. Vui lòng sử dụng email khác.";
            return;
        }

        // Mặc định vai trò là "landlord" khi người dùng đăng ký
        const newUser = { email, password, role: "landlord" };
        users.push(newUser);

        // Lưu danh sách người dùng lại vào localStorage
        localStorage.setItem("cozyhome-users", JSON.stringify(users));

        registerError.textContent = "";
        alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        window.location.href = "/pages/auth/login.html";
    });

    // Reload trang khi người dùng sử dụng nút quay lại trình duyệt
    window.addEventListener('popstate', function(event) {
        window.location.reload();
    });
});
