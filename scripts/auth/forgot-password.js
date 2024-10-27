document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const userList = document.getElementById("userList");
    const userSearchInput = document.getElementById("userSearch");
    const newUserRole = document.getElementById("newUserRole");
  
    // Load roles dynamically
    const roles = [
      { id: "1", name: "Quản Trị Viên" },
      { id: "2", name: "Chủ Trọ" },
      { id: "3", name: "Người Thuê" },
    ];
  
    roles.forEach(role => {
      const option = document.createElement("option");
      option.value = role.id;
      option.textContent = role.name;
      newUserRole.appendChild(option);
    });
  
    // Load users from localStorage
    function loadUsers() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      userList.innerHTML = "";
  
      users.forEach(user => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${user.email_address}</td>
          <td>${getRoleName(user.role_id)}</td>
          <td>
            <button class="cozyhome-btn cozyhome-btn-secondary" onclick="deleteUser('${user.email_address}')">
              <i class="fas fa-trash-alt"></i> Xóa
            </button>
          </td>
        `;
        userList.appendChild(row);
      });
    }
  
    // Get role name by role ID
    function getRoleName(roleId) {
      const role = roles.find(r => r.id === roleId);
      return role ? role.name : "Không xác định";
    }
  
    // Create new user
    window.createUser = () => {
      const newUser = {
        full_name: document.getElementById("newFullName").value,
        nick_name: document.getElementById("newNickName").value,
        user_name: document.getElementById("newUserName").value,
        email_address: document.getElementById("newUserEmail").value,
        phone: document.getElementById("newUserPhone").value,
        hashed_password: document.getElementById("newPassword").value,
        date_of_birth: document.getElementById("newDateOfBirth").value,
        gender: document.getElementById("newGender").value,
        address: document.getElementById("newAddress").value,
        avatar_url: document.getElementById("newAvatarUrl").value,
        role_id: newUserRole.value,
      };
  
      if (isUserExist(newUser.email_address)) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Email đã tồn tại!",
        });
        return;
      }
  
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
  
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Tạo tài khoản thành công!",
      }).then(() => {
        hideCreateUserForm();
        loadUsers();
      });
    };
  
    // Check if user exists by email
    function isUserExist(email) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      return users.some(user => user.email_address === email);
    }
  
    // Delete user by email
    window.deleteUser = (email) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.filter(user => user.email_address !== email);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
  
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Xóa người dùng thành công!",
      }).then(() => {
        loadUsers();
      });
    };
  
    // Search user by email
    window.searchUser = () => {
      const query = userSearchInput.value.toLowerCase();
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const filteredUsers = users.filter(user =>
        user.email_address.toLowerCase().includes(query)
      );
  
      userList.innerHTML = "";
      filteredUsers.forEach(user => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${user.email_address}</td>
          <td>${getRoleName(user.role_id)}</td>
          <td>
            <button class="cozyhome-btn cozyhome-btn-secondary" onclick="deleteUser('${user.email_address}')">
              <i class="fas fa-trash-alt"></i> Xóa
            </button>
          </td>
        `;
        userList.appendChild(row);
      });
    };
  
    // Show and hide create user form
    window.showCreateUserForm = () => {
      document.getElementById("createUserForm").style.display = "block";
    };
  
    window.hideCreateUserForm = () => {
      document.getElementById("createUserForm").style.display = "none";
    };
  
    // Initialize user list on page load
    loadUsers();
  });
  