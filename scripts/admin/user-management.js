document.addEventListener("DOMContentLoaded", function () {
    renderUserList();
    loadRoles();

    // Hiển thị form tạo tài khoản mới
    window.showCreateUserForm = function () {
        document.getElementById("createUserForm").style.display = "block";
    };

    // Ẩn form tạo tài khoản mới
    window.hideCreateUserForm = function () {
        document.getElementById("createUserForm").style.display = "none";
    };

   // Hàm tạo tài khoản mới bằng API
   window.createUser = async function () {
    const fullName = document.getElementById("newFullName").value.trim();
    const nickName = document.getElementById("newNickName").value.trim();
    const username = document.getElementById("newUserName").value.trim();
    const email = document.getElementById("newUserEmail").value.trim();
    const phone = document.getElementById("newUserPhone").value.trim();
    const password = document.getElementById("newPassword").value;
    const dateOfBirth = document.getElementById("newDateOfBirth").value;
    const gender = parseInt(document.getElementById("newGender").value);
    const address = document.getElementById("newAddress").value.trim();
    const avatarUrl = document.getElementById("newAvatarUrl").value.trim();
    const roleId = parseInt(document.getElementById("newUserRole").value);

    if (!fullName || !username || !email || !phone || !password || !dateOfBirth) {
        Swal.fire({
            icon: 'warning',
            title: 'Thiếu thông tin!',
            text: 'Vui lòng điền đầy đủ các trường bắt buộc.',
            confirmButtonText: 'OK'
        });
        return;
    }

    try {
        const response = await fetch("https://cdtnapi.lyhai.id.vn/api/v1/account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({
                full_name: fullName,
                nick_name: nickName,
                user_name: username,
                email_address: email,
                phone_number: phone,
                hashed_password: password,
                date_of_birth: dateOfBirth,
                gender: gender,
                address: address,
                avt_url: avatarUrl,
                role_id: roleId
            })
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Tạo tài khoản thành công.',
                confirmButtonText: 'OK'
            });
            hideCreateUserForm();
            renderUserList();
        } else {
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: `Không thể tạo tài khoản: ${errorData.detail || 'Lỗi không xác định.'}`,
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error("Lỗi khi tạo tài khoản:", error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi kết nối!',
            text: 'Không thể kết nối với máy chủ.',
            confirmButtonText: 'OK'
        });
    }
};

    // Hàm để tải danh sách vai trò từ API
    async function loadRoles() {
        try {
            const response = await fetch("https://cdtnapi.lyhai.id.vn/api/v1/role", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                populateRoleSelect(data.data);
            } else {
                console.error("Lỗi khi lấy danh sách vai trò:", await response.json());
            }
        } catch (error) {
            console.error("Lỗi kết nối API:", error);
        }
    }

     // Hàm để điền dữ liệu vào select phân quyền
     function populateRoleSelect(roles) {
        const roleSelect = document.getElementById("newUserRole");
        roleSelect.innerHTML = roles.map(role => `
            <option value="${role.id}">${role.name}</option>
        `).join('');
    }

    // Lấy danh sách người dùng từ API
    async function fetchUserList() {
        try {
            const response = await fetch("https://cdtnapi.lyhai.id.vn/api/v1/account", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                return data.data;
            } else {
                console.error("Lỗi khi lấy danh sách người dùng:", await response.json());
                return [];
            }
        } catch (error) {
            console.error("Lỗi kết nối API:", error);
            return [];
        }
    }

    // Hiển thị danh sách người dùng
    async function renderUserList() {
        const users = await fetchUserList();
        const userList = document.getElementById("userList");

        if (users.length === 0) {
            userList.innerHTML = `<tr><td colspan="3" class="no-data">Không tìm thấy người dùng nào.</td></tr>`;
        } else {
            userList.innerHTML = users.map(user => `
                <tr>
                    <td>${user.email_address}</td>
                    <td>${user.role.name}</td>
                    <td>
                        <button onclick="resetPassword('${user.cd_code}')" class="cozyhome-btn cozyhome-btn-secondary">
                            <i class="fas fa-paper-plane"></i> Cấp lại mật khẩu
                        </button>
                        <button onclick="deleteUser('${user.cd_code}')" class="cozyhome-btn cozyhome-btn-danger">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // Cấp lại mật khẩu
    window.resetPassword = async function (cd_code) {
        try {
            const response = await fetch(`https://cdtnapi.lyhai.id.vn/api/v1/account/rs/reset-password/${cd_code}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Cấp lại mật khẩu thành công!',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Không thể cấp lại mật khẩu.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error("Lỗi khi cấp lại mật khẩu:", error);
        }
    };

    // Xóa tài khoản người dùng
    window.deleteUser = async function (cd_code) {
        Swal.fire({
            title: 'Bạn có chắc muốn xóa?',
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa!',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://cdtnapi.lyhai.id.vn/api/v1/account/${cd_code}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                        }
                    });

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa!',
                            text: 'Tài khoản đã được xóa thành công.',
                            confirmButtonText: 'OK'
                        });
                        renderUserList();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi!',
                            text: 'Không thể xóa tài khoản.',
                            confirmButtonText: 'OK'
                        });
                    }
                } catch (error) {
                    console.error("Lỗi khi xóa tài khoản:", error);
                }
            }
        });
    };
});
