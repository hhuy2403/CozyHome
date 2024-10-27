document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const loginError = document.getElementById("loginError");
  
    // Add hardcoded admin account to localStorage if not already present
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (!users.some(user => user.user_name === "admin")) {
      users.push(adminAccount);
      localStorage.setItem("users", JSON.stringify(users));
    }
  
    // Toggle password visibility
    togglePassword.addEventListener("click", () => {
      const isPasswordVisible = passwordInput.type === "password";
      passwordInput.type = isPasswordVisible ? "text" : "password";
      togglePassword.innerHTML = `<i class="fas ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    });
  
    // Handle login form submission
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const username = document.getElementById("username").value.trim();
      const password = passwordInput.value;
  
      if (!username || !password) {
        loginError.textContent = "Vui lòng nhập đầy đủ thông tin!";
        return;
      }
  
      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
  
      // Find user matching the entered credentials
      const user = users.find(
        u => u.user_name === username && u.hashed_password === password
      );
  
      if (user) {
        // Login successful, redirect based on role
        if (user.role_id === "3") {
          alert("Đăng nhập thành công! Chào mừng chủ trọ.");
          window.location.href = "landlord-home.html"; // Redirect to landlord page
        } else if (user.role_id === "4") {
          alert("Đăng nhập thành công! Chào mừng người thuê.");
          window.location.href = "tenant-home.html"; // Redirect to tenant page
        } else {
          alert("Đăng nhập thành công! Chào mừng quản trị viên.");
          window.location.href = "admin-dashboard.html"; // Redirect to admin page
        }
      } else {
        // Login failed
        loginError.textContent = "Tên đăng nhập hoặc mật khẩu không chính xác!";
      }
    });
  });
  