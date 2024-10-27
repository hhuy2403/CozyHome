document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const loginError = document.getElementById("loginError");
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    // Handle Navbar Toggle
    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    const links = navLinks.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
        });
    });

    // Admin Account Initialization (for testing)
    const adminAccount = {
        id: 1,
        user_name: "admin",
        hashed_password: "admin123",
        role_id: "1",
        email_address: "admin@cozyhome.vn"
    };

    // Initialize users in localStorage if not present
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (!users.some(user => user.user_name === "admin")) {
        users.push(adminAccount);
        localStorage.setItem("users", JSON.stringify(users));
    }

    // Toggle Password Visibility
    togglePassword.addEventListener("click", () => {
        const isPasswordVisible = passwordInput.type === "password";
        passwordInput.type = isPasswordVisible ? "text" : "password";
        togglePassword.innerHTML = `<i class="fas ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    });

    // Handle Login Form Submission
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            loginError.textContent = "Vui lòng nhập đầy đủ thông tin!";
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Find the user in localStorage
        const user = users.find(
            u => u.user_name === username && u.hashed_password === password
        );

        if (user) {
            // Save user session and current user details in both sessionStorage and localStorage
            sessionStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", "true");

            alert(`Đăng nhập thành công! Chào mừng ${getRoleName(user.role_id)}.`);

            // Redirect based on user role
            switch (user.role_id) {
                case "1":
                    window.location.href = "/pages/admin/dashboard.html";
                    break;
                case "2":
                    window.location.href = "/pages/landlord/room/index.html";
                    break;
                case "3":
                    window.location.href = "/pages/tenant/account.html";
                    break;
                default:
                    loginError.textContent = "Không xác định được vai trò người dùng!";
            }
        } else {
            loginError.textContent = "Tên đăng nhập hoặc mật khẩu không chính xác!";
        }
    });

    // Helper function to get role name by role ID
    function getRoleName(roleId) {
        const roles = {
            "1": "quản trị viên",
            "2": "chủ trọ",
            "3": "người thuê"
        };
        return roles[roleId] || "người dùng";
    }
});
