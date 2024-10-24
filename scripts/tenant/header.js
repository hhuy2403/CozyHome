document.addEventListener("DOMContentLoaded", function () {
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

    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert("Bạn cần đăng nhập để truy cập trang này.");
        window.location.href = "../../../pages/auth/login.html"; // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
    }
});

// Hàm để xử lý đăng xuất
// Hàm để xử lý đăng xuất
function logout() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn đăng xuất?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đăng xuất',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                // Xóa thông tin người dùng đã đăng nhập khỏi localStorage
                localStorage.removeItem('loggedInUser');

                Swal.fire({
                    title: 'Đăng xuất thành công!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });

                // Điều hướng người dùng đến trang đăng nhập sau 1.5 giây
                setTimeout(() => {
                    window.location.href = "../../../pages/auth/login.html";
                }, 1500);
            }
        });
    } else {
        Swal.fire('Lỗi', 'Bạn chưa đăng nhập.', 'error');
    }
}


// Sự kiện lắng nghe cho hành động nhấn nút quay lại trên trình duyệt
window.addEventListener('popstate', function () {
    // Khi người dùng nhấn nút quay lại trên trình duyệt, tải lại trang
    window.location.reload();
});
