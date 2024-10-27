document.addEventListener("DOMContentLoaded", () => {
    const userList = document.getElementById("userList");
    const userSearchInput = document.getElementById("userSearch");
    const saveButton = document.getElementById("saveButton");
    const createUserForm = document.getElementById("createUserForm");
    let editingIndex = null; 
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (!currentUser) {
        Swal.fire("Thông báo", "Bạn cần đăng nhập trước!", "warning")
            .then(() => {
                window.location.href = "/pages/auth/login.html"; 
            });
    }
    

    // Load users from localStorage
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        userList.innerHTML = "";

        users.forEach((user, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.email_address}</td>
                <td>${getRoleName(user.role_id)}</td>
                <td>
                    <button class="cozyhome-btn-secondary" onclick="viewUser(${index})">
                        <i class="fas fa-eye"></i> Xem
                    </button>
                    <button class="cozyhome-btn-primary" onclick="editUser(${index})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="cozyhome-btn-danger" onclick="deleteUser('${user.email_address}')">
                        <i class="fas fa-trash-alt"></i> Xóa
                    </button>
                </td>
            `;
            userList.appendChild(row);
        });
    }

    // Get role name by ID
    function getRoleName(roleId) {
        const roles = {
            "1": "Quản Trị Viên",
            "2": "Chủ Trọ",
            "3": "Người Thuê"
        };
        return roles[roleId] || "Không xác định";
    }

    // View user details
    window.viewUser = (index) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users[index];

        Swal.fire({
            title: `Thông Tin Người Dùng: ${user.full_name}`,
            html: `
                <p><strong>Email:</strong> ${user.email_address}</p>
                <p><strong>Tên đăng nhập:</strong> ${user.user_name}</p>
                <p><strong>Số điện thoại:</strong> ${user.phone}</p>
                <p><strong>Vai trò:</strong> ${getRoleName(user.role_id)}</p>
            `,
            icon: "info",
            confirmButtonText: "Đóng"
        });
    };

    // Edit user
    window.editUser = (index) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users[index];

        // Pre-fill the form with the user's data
        document.getElementById("newFullName").value = user.full_name;
        document.getElementById("newUserName").value = user.user_name;
        document.getElementById("newUserEmail").value = user.email_address;
        document.getElementById("newPassword").value = user.hashed_password;
        document.getElementById("newUserPhone").value = user.phone;
        document.getElementById("newUserRole").value = user.role_id;

        // Switch button text to "Save"
        saveButton.textContent = "Lưu";
        editingIndex = index; // Store the index of the user being edited

        showCreateUserForm();
    };

    // Save or create user
    saveButton.addEventListener("click", () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const userData = {
            full_name: document.getElementById("newFullName").value,
            user_name: document.getElementById("newUserName").value,
            email_address: document.getElementById("newUserEmail").value,
            hashed_password: document.getElementById("newPassword").value,
            phone: document.getElementById("newUserPhone").value,
            role_id: document.getElementById("newUserRole").value,
        };

        if (editingIndex !== null) {
            // Update the existing user
            users[editingIndex] = userData;
            Swal.fire("Thành công", "Cập nhật thông tin người dùng thành công!", "success");
            editingIndex = null; // Reset editing index
        } else {
            // Create a new user
            if (isUserExist(userData.email_address)) {
                Swal.fire("Lỗi", "Email đã tồn tại!", "error");
                return;
            }
            users.push(userData);
            Swal.fire("Thành công", "Tạo tài khoản thành công!", "success");
        }

        // Save users to localStorage and reload the list
        localStorage.setItem("users", JSON.stringify(users));
        hideCreateUserForm();
        loadUsers();
    });

    // Check if the user already exists
    function isUserExist(email) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        return users.some(user => user.email_address === email);
    }

    // Delete a user
    window.deleteUser = (email) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa người dùng này?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                let users = JSON.parse(localStorage.getItem("users")) || [];
                users = users.filter(user => user.email_address !== email);
                localStorage.setItem("users", JSON.stringify(users));

                Swal.fire(
                    'Đã Xóa!',
                    'Người dùng đã được xóa thành công.',
                    'success'
                ).then(loadUsers); // Reload the user list after confirmation
            }
        });
    };

    // Search users
    window.searchUser = () => {
        const query = userSearchInput.value.toLowerCase();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const filteredUsers = users.filter(user =>
            user.email_address.toLowerCase().includes(query)
        );

        userList.innerHTML = "";
        filteredUsers.forEach((user, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.email_address}</td>
                <td>${getRoleName(user.role_id)}</td>
                <td>
                    <button class="cozyhome-btn-secondary" onclick="viewUser(${index})">
                        <i class="fas fa-eye"></i> Xem
                    </button>
                    <button class="cozyhome-btn-primary" onclick="editUser(${index})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="cozyhome-btn-danger" onclick="deleteUser('${user.email_address}')">
                        <i class="fas fa-trash-alt"></i> Xóa
                    </button>
                </td>
            `;
            userList.appendChild(row);
        });
    };

    // Show and hide the create user form
    window.showCreateUserForm = () => {
        createUserForm.style.display = "block";
    };

    window.hideCreateUserForm = () => {
        createUserForm.style.display = "none";
        saveButton.textContent = "Tạo"; // Reset button text
        editingIndex = null; // Reset editing index
        resetForm(); // Clear form fields
    };

    // Reset form fields
    function resetForm() {
        document.getElementById("newFullName").value = "";
        document.getElementById("newUserName").value = "";
        document.getElementById("newUserEmail").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("newUserPhone").value = "";
        document.getElementById("newUserRole").value = "1";
    }

    // Load users on page load
    loadUsers();
});
