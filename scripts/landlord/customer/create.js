document.addEventListener('DOMContentLoaded', function () {
  fetch('../sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('sidebar-container').innerHTML = data;
    })
    .catch((error) => console.error('Error loading sidebar:', error));
});

document.addEventListener('DOMContentLoaded', function () {
  // Sự kiện lắng nghe thay đổi tab và lưu vào localStorage
  document.querySelectorAll('a[data-toggle="tab"]').forEach(function (tab) {
    tab.addEventListener('shown.bs.tab', function (e) {
      localStorage.setItem('selectedTab', e.target.id); // Lưu id của tab hiện tại vào localStorage
    });
  });

  // Hiển thị tab đã lưu khi trang được tải
  const selectedTab = localStorage.getItem('selectedTab');
  if (selectedTab) {
    const tabToShow = document.getElementById(selectedTab);
    if (tabToShow) {
      new bootstrap.Tab(tabToShow).show(); // Hiển thị tab đã lưu
    } else {
      // Nếu tab không tồn tại, mặc định mở tab đầu tiên
      document.querySelector('.nav-link').classList.add('active');
      document.querySelector('.tab-pane').classList.add('show', 'active');
    }
  } else {
    // Nếu chưa có tab nào được lưu, mặc định mở tab đầu tiên
    document.querySelector('.nav-link').classList.add('active');
    document.querySelector('.tab-pane').classList.add('show', 'active');
  }

  // Thêm sự kiện khi nhấn nút thêm thành viên
  document.getElementById('addRow').addEventListener('click', function () {
    const table = document.getElementById('memberTable');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td><input type="text" class="form-control"></td>
    <td><input type="date" class="form-control"></td>
    <td>
      <label><input type="radio" name="gender${
        table.rows.length + 1
      }" value="Nam"> Nam</label>
      <label><input type="radio" name="gender${
        table.rows.length + 1
      }" value="Nữ"> Nữ</label>
    </td>
    <td><input type="text" class="form-control"></td>
    <td><input type="text" class="form-control"></td>
    <td><input type="text" class="form-control"></td>
    <td><input type="text" class="form-control"></td>
    <td><input type="date" class="form-control"></td>
    <td><button class="btn btn-danger remove-row"><i class="fas fa-minus"></i></button></td>
  `;
    table.appendChild(newRow);
  });

  // Xóa thành viên khi nhấn nút xóa
  document
    .getElementById('memberTable')
    .addEventListener('click', function (e) {
      if (e.target.classList.contains('remove-row')) {
        e.target.closest('tr').remove();
      }
    });
});
