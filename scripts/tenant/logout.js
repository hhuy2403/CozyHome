document.addEventListener("DOMContentLoaded", function() {
    const logoutLink = document.getElementById('logout-link');
    // const hamburger = document.getElementById('hamburger');
    // const navMenu = document.getElementById('nav-menu');

    // Hàm để khởi tạo các sự kiện của header sau khi tải xong
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

    // Kiểm tra nếu logoutLink tồn tại trước khi gắn sự kiện
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định
            confirmLogout();
        });
    } else {
        console.error('Không tìm thấy phần tử logout-link');
    }


});

// Xác nhận khi người dùng đăng xuất
function confirmLogout() {
    Swal.fire({
        title: 'Bạn có chắc muốn đăng xuất?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            // Xóa thông tin đăng nhập khỏi localStorage
            localStorage.removeItem('loggedInUser');

            // Điều hướng đến trang đăng nhập
            window.location.href = '../../../pages/auth/login.html';
        }
    });
}
