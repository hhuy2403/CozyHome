function toggleSubMenu() {
    const submenu = document.getElementById('reportSubmenu');
    const arrow = document.getElementById('reportArrow');

    if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
        arrow.classList.remove('submenu-open');
    } else {
        submenu.style.display = 'block';
        arrow.classList.add('submenu-open');
    }
}

// Logout function with confirmation dialog
function logout() {
    Swal.fire({
        title: 'Bạn có chắc chắn muốn đăng xuất?',
        text: "Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.removeItem("currentUser");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("isLoggedIn");

            Swal.fire('Đã đăng xuất!', 'Bạn đã đăng xuất thành công.', 'success')
                .then(() => {
                    window.location.href = "/pages/auth/login.html";
                });
        }
    });
}
