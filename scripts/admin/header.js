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

   
});
