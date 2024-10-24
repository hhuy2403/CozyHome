document.addEventListener('DOMContentLoaded', function () {
    checkUserStatus();
});

// Hàm kiểm tra trạng thái người dùng từ localStorage
function checkUserStatus() {
    const user = localStorage.getItem('cozyhome-user');
    if (user) {
        const userData = JSON.parse(user);
        // Điều hướng đến trang tương ứng dựa trên vai trò của người dùng
        if (userData.role === 'admin') {
            window.location.href = 'admin/dashboard.html';
        } else if (userData.role === 'landlord') {
            window.location.href = 'landlord/dashboard.html';
        } else if (userData.role === 'tenant') {
            window.location.href = 'tenant/dashboard.html';
        }
    }
}

// Add this function in your main.js file
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
        });
    }
}

document
    .querySelector('.header-link[href="#features"]')
    .addEventListener('click', function (e) {
        e.preventDefault();
        smoothScroll('#features');
    });

document
    .querySelector('.header-link[href="#pricing"]')
    .addEventListener('click', function (e) {
        e.preventDefault();
        smoothScroll('#pricing');
    });

document
    .querySelector('.header-link[href="#contact"]')
    .addEventListener('click', function (e) {
        e.preventDefault();
        smoothScroll('#contact');
    });

document
    .querySelector('.footer-link[href="#info"]')
    .addEventListener('click', function (e) {
        e.preventDefault();
        smoothScroll('#info');
    });

document
    .querySelector('.footer-link[href="#features"]')
    .addEventListener('click', function (e) {
        e.preventDefault();
        smoothScroll('#features');
    });

document
    .querySelector('.footer-link[href="#pricing"]')
    .addEventListener('click', function (e) {
        e.preventDefault();
        smoothScroll('#pricing');
    });

document.getElementById('start-btn').addEventListener('click', function () {
    window.location.href = '/pages/auth/login.html';
});

document.getElementById('explore-btn').addEventListener('click', function () {
    window.location.href = '/pages/auth/register.html';
});
