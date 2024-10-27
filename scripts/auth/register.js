// Wait for the DOM to load before executing
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const registerError = document.getElementById("registerError");

  // Toggle password visibility
  togglePassword.addEventListener("click", () => {
    toggleVisibility(passwordInput, togglePassword);
  });

  toggleConfirmPassword.addEventListener("click", () => {
    toggleVisibility(confirmPasswordInput, toggleConfirmPassword);
  });

  // Toggle input visibility helper function
  function toggleVisibility(input, toggleButton) {
    const isPasswordVisible = input.type === "password";
    input.type = isPasswordVisible ? "text" : "password";
    toggleButton.innerHTML = `<i class="fas ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
  }

  // Form submission handler
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userName = document.getElementById("userName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const role = document.getElementById("role").value;

    if (!validateForm(userName, email, password, confirmPassword)) {
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the username or email already exists
    if (users.some(user => user.user_name === userName || user.email_address === email)) {
      registerError.textContent = "Tên đăng nhập hoặc email đã tồn tại!";
      return;
    }

    // Save user data
    users.push({ user_name: userName, email_address: email, hashed_password: password, role_id: role });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Đăng ký thành công!");
    window.location.href = "login.html";
  });

  // Form validation function
  function validateForm(userName, email, password, confirmPassword) {
    registerError.textContent = "";

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      registerError.textContent = "Email không hợp lệ!";
      return false;
    }

    if (password.length < 6) {
      registerError.textContent = "Mật khẩu phải có ít nhất 6 ký tự!";
      return false;
    }

    if (password !== confirmPassword) {
      registerError.textContent = "Mật khẩu không khớp!";
      return false;
    }

    if (!userName || !email || !password || !confirmPassword) {
      registerError.textContent = "Vui lòng điền đầy đủ thông tin!";
      return false;
    }

    if (document.getElementById("role").value === "") {
      registerError.textContent = "Vui lòng chọn vai trò!";
      return false;
    }

    return true;
  }
});
