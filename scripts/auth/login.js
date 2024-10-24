document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('show');
        });
    }

    const loginForm = document.getElementById("loginForm");
    const loginError = document.getElementById("loginError");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    // Xử lý ẩn/hiện mật khẩu
    togglePassword.addEventListener("click", function () {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);

        // Đổi biểu tượng khi mật khẩu được hiển thị hoặc ẩn
        this.querySelector("i").classList.toggle("fa-eye");
        this.querySelector("i").classList.toggle("fa-eye-slash");
    });

    // Regular expression for validating an email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Thêm tài khoản admin mặc định
    function addDefaultAdmin() {
        const defaultAdmin = {
            email: "hvh2403@gmail.com",
            password: "Huydz2403@",
            role: "admin"
        };

        const storedUsers = JSON.parse(localStorage.getItem("cozyhome-users")) || [];
        // Kiểm tra xem admin mặc định đã tồn tại trong danh sách người dùng chưa
        const adminExists = storedUsers.some(user => user.email === defaultAdmin.email);

        if (!adminExists) {
            storedUsers.push(defaultAdmin);
            localStorage.setItem("cozyhome-users", JSON.stringify(storedUsers));
        }
    }

    // Gọi hàm để đảm bảo admin mặc định được thêm vào
    addDefaultAdmin();

    // Xử lý sự kiện khi nhấn đăng nhập
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Reset lỗi trước đó
        loginError.textContent = "";

        // Kiểm tra tính hợp lệ của email và mật khẩu
        if (!email) {
            loginError.textContent = "Vui lòng nhập email.";
            return;
        }

        if (!emailRegex.test(email)) {
            loginError.textContent = "Email không hợp lệ.";
            return;
        }

        if (!password) {
            loginError.textContent = "Vui lòng nhập mật khẩu.";
            return;
        }

        console.log("Email nhập vào:", email);
        console.log("Mật khẩu nhập vào:", password);

        // Lấy danh sách người dùng từ localStorage
        const storedUsers = JSON.parse(localStorage.getItem("cozyhome-users")) || [];

        console.log("Dữ liệu người dùng:", storedUsers);

        // Tìm kiếm người dùng trong danh sách
        const user = storedUsers.find(user => user.email === email && user.password === password);
        console.log("Kết quả tìm kiếm người dùng:", user);

        if (user) {
            console.log("Đăng nhập thành công!");

            // Lưu thông tin đăng nhập vào localStorage
            localStorage.setItem("loggedInUser", JSON.stringify({
                email: user.email,
                role: user.role
            }));

            // Điều hướng dựa trên vai trò
            if (user.role === "admin") {
                window.location.href = "/pages/admin/dashboard.html";
            } else if (user.role === "landlord") {
                window.location.href = "/pages/landlord/room/index.html";
            } else if (user.role === "tenant") {
                window.location.href = "/pages/tenant/account.html";
            }
        } else {
            loginError.textContent = "Email hoặc mật khẩu không đúng.";
            console.log("Email hoặc mật khẩu không đúng.");
        }
    });

    // Reload trang khi người dùng sử dụng nút quay lại trình duyệt
    window.addEventListener('popstate', function (event) {
        window.location.reload();
    });
});
