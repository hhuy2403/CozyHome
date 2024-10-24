document.addEventListener("DOMContentLoaded", function () {
    checkUserLogin();
    loadAdminInfo();
    loadFooterInfo(); // Gọi hàm này để hiển thị thông tin footer khi trang tải

    // Hàm lưu thông tin cấu hình footer vào localStorage
    window.saveFooterConfig = function () {
        const footerAddress = document.getElementById("footerAddress").value.trim();
        const footerPhone = document.getElementById("footerPhone").value.trim();
        const footerEmail = document.getElementById("footerEmail").value.trim();
    
        if (!footerAddress || !footerPhone || !footerEmail) {
            Swal.fire('Vui lòng điền đầy đủ thông tin footer.', '', 'error');
            return;
        }
    
        const footerConfig = {
            address: footerAddress,
            phone: footerPhone,
            email: footerEmail
        };
    
        localStorage.setItem("cozyhome-footer-config", JSON.stringify(footerConfig));
        Swal.fire('Thông tin footer đã được lưu thành công!', '', 'success');
        loadFooterInfo();
    };
    
    // Hàm tải cấu hình footer từ localStorage
    function loadFooterInfo() {
        const footerConfig = JSON.parse(localStorage.getItem("cozyhome-footer-config")) || {};
    
        document.getElementById("footerAddress").textContent = footerConfig.address || 'Chưa có thông tin địa chỉ';
        document.getElementById("footerPhone").textContent = footerConfig.phone || 'Chưa có thông tin số điện thoại';
        document.getElementById("footerEmail").textContent = footerConfig.email || 'Chưa có thông tin email';
    }
    

    // Hàm kiểm tra đăng nhập
    function checkUserLogin() {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            Swal.fire({
                icon: 'error',
                title: 'Bạn cần đăng nhập',
                text: 'Vui lòng đăng nhập để truy cập trang này.',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = "../../../pages/auth/login.html";
            });
            return;
        }
        loadSystemConfig();
    }

    // Hàm lưu thông tin cá nhân của quản trị viên dựa trên tài khoản đăng nhập
    window.saveAdminInfo = function () {
        const adminName = document.getElementById("adminName").value.trim();
        const adminPhone = document.getElementById("adminPhone").value.trim();
        const adminAddress = document.getElementById("adminAddress").value.trim();

        if (!adminName || !adminPhone || !adminAddress) {
            Swal.fire('Vui lòng điền đầy đủ thông tin cá nhân.', '', 'error');
            return;
        }

        // Lấy thông tin người dùng hiện tại
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];
        
        // Tìm người dùng đang đăng nhập
        const currentUserIndex = users.findIndex(user => user.email === loggedInUser.email);

        if (currentUserIndex !== -1) {
            // Cập nhật thông tin cá nhân
            users[currentUserIndex].name = adminName;
            users[currentUserIndex].phone = adminPhone;
            users[currentUserIndex].address = adminAddress;

            // Lưu lại danh sách người dùng vào localStorage
            localStorage.setItem("cozyhome-users", JSON.stringify(users));
            Swal.fire('Thông tin cá nhân đã được lưu thành công!', '', 'success');
        } else {
            Swal.fire('Không tìm thấy người dùng.', '', 'error');
        }
    };

    // Hàm tải thông tin cá nhân của quản trị viên từ localStorage dựa trên tài khoản đăng nhập
    function loadAdminInfo() {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];
        
        // Tìm người dùng đang đăng nhập
        const currentUser = users.find(user => user.email === loggedInUser.email);

        if (currentUser) {
            document.getElementById("adminName").value = currentUser.name || '';
            document.getElementById("adminPhone").value = currentUser.phone || '';
            document.getElementById("adminAddress").value = currentUser.address || '';
        } else {
            Swal.fire('Không tìm thấy người dùng.', '', 'error');
        }
    }

    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    function checkUserLogin() {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            Swal.fire({
                icon: 'error',
                title: 'Bạn cần đăng nhập',
                text: 'Vui lòng đăng nhập để truy cập trang này.',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = "../../../pages/auth/login.html";
            });
            return;
        }
        loadSystemConfig();
    }

    // Lấy cấu hình hệ thống từ localStorage và hiển thị
    function loadSystemConfig() {
        const config = JSON.parse(localStorage.getItem("cozyhome-system-config")) || {};
        document.getElementById("systemEmail").value = config.email || '';
        document.getElementById("paymentGateway").value = config.paymentGateway || '';
        document.getElementById("notificationSettings").value = config.notificationSettings || '';
        document.getElementById("supportContact").value = config.supportContact || '';
        document.getElementById("twoFactorAuth").value = config.twoFactorAuth || 'disabled';
    }

    // Lưu cấu hình hệ thống vào localStorage
    window.saveSystemConfig = function () {
        const email = document.getElementById("systemEmail").value.trim();
        const paymentGateway = document.getElementById("paymentGateway").value.trim();
        const notificationSettings = document.getElementById("notificationSettings").value.trim();
        const supportContact = document.getElementById("supportContact").value.trim();

        if (!email || !paymentGateway || !notificationSettings || !supportContact) {
            Swal.fire('Vui lòng điền đầy đủ thông tin cấu hình.', '', 'error');
            return;
        }

        const config = {
            email,
            paymentGateway,
            notificationSettings,
            supportContact,
            twoFactorAuth: document.getElementById("twoFactorAuth").value
        };

        localStorage.setItem("cozyhome-system-config", JSON.stringify(config));

        Swal.fire('Cấu hình hệ thống đã được lưu thành công!', '', 'success');
    };

    // Thay đổi mật khẩu quản trị viên
    window.changeAdminPassword = function () {
        const newPassword = document.getElementById("adminPassword").value.trim();
        if (!newPassword) {
            Swal.fire('Vui lòng nhập mật khẩu mới.', '', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem("cozyhome-users")) || [];
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const adminUser = users.find(user => user.email === loggedInUser.email);

        if (adminUser) {
            adminUser.password = newPassword;
            localStorage.setItem("cozyhome-users", JSON.stringify(users));
            Swal.fire('Mật khẩu đã được thay đổi thành công!', '', 'success');
            document.getElementById("adminPassword").value = ''; 
        }
    };

    // Tạo bản sao lưu
    window.createBackup = function () {
        const backup = {
            users: localStorage.getItem("cozyhome-users"),
            debts: localStorage.getItem("cozyhome-debts"),
            unpaidBills: localStorage.getItem("cozyhome-unpaid-bills"),
            contracts: localStorage.getItem("cozyhome-contracts"),
            maintenanceSchedules: localStorage.getItem("cozyhome-maintenance-schedules"),
            systemConfig: localStorage.getItem("cozyhome-system-config")
        };
        localStorage.setItem("cozyhome-backup", JSON.stringify(backup));

        Swal.fire('Đã tạo sao lưu thành công!', '', 'success');
    };

    // Phục hồi dữ liệu từ bản sao lưu
    window.restoreBackup = function () {
        const backup = JSON.parse(localStorage.getItem("cozyhome-backup"));

        if (backup) {
            localStorage.setItem("cozyhome-users", backup.users || '[]');
            localStorage.setItem("cozyhome-debts", backup.debts || '[]');
            localStorage.setItem("cozyhome-unpaid-bills", backup.unpaidBills || '[]');
            localStorage.setItem("cozyhome-contracts", backup.contracts || '[]');
            localStorage.setItem("cozyhome-maintenance-schedules", backup.maintenanceSchedules || '[]');
            localStorage.setItem("cozyhome-system-config", backup.systemConfig || '{}');
            Swal.fire('Phục hồi dữ liệu thành công!', '', 'success');
            loadSystemConfig();
        } else {
            Swal.fire('Không tìm thấy bản sao lưu!', '', 'error');
        }
    };

    // Cập nhật hệ thống
    window.updateSystem = function () {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn cập nhật hệ thống?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cập Nhật',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Đang tải về và cài đặt bản cập nhật hệ thống...', '', 'info');
                setTimeout(() => {
                    Swal.fire('Hệ thống đã được cập nhật thành công!', '', 'success');
                }, 2000);
            }
        });
    };

    // Cập nhật hệ điều hành
    window.updateOS = function () {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn cập nhật hệ điều hành?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cập Nhật',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Đang tải về và cài đặt bản cập nhật hệ điều hành...', '', 'info');
                setTimeout(() => {
                    Swal.fire('Hệ điều hành đã được cập nhật thành công!', '', 'success');
                }, 2000);
            }
        });
    };
});

window.addEventListener('popstate', function(event) {
    window.location.reload();
});
