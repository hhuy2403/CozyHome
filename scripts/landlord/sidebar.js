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
