document.addEventListener("DOMContentLoaded", function () {
        function initializeHeaderEvents() {
        const menuToggle = document.querySelector('.cozyhome-menu-toggle');
        const navLinks = document.querySelector('.cozyhome-nav-links');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('show');
            });
        } else {
            // Nếu chưa tìm thấy phần tử, thử lại sau một khoảng thời gian ngắn
            setTimeout(initializeHeaderEvents, 100);
        }
    }


    // Tải nội dung header và footer
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initializeHeaderEvents(); // Gọi khởi tạo sự kiện sau khi header được tải
        })
        .catch(error => console.error('Lỗi khi tải header:', error));

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Lỗi khi tải footer:', error));
});

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
