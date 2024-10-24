document.addEventListener('DOMContentLoaded', function () {
  fetch('../sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('sidebar-container').innerHTML = data;
    })
    .catch((error) => console.error('Error loading sidebar:', error));
});

document.getElementById('saveHouseBtn').addEventListener('click', function () {
  const houseName = document.getElementById('houseName').value.trim();
  const district = document.getElementById('district').value.trim();
  const ward = document.getElementById('ward').value.trim();
  const city = document.getElementById('city').value.trim();
  const address = document.getElementById('address').value.trim();

  if (!houseName || !district || !ward || !city || !address) {
    alert('Vui lòng nhập đầy đủ thông tin.');
    return;
  }

  let houses = JSON.parse(localStorage.getItem('houseData')) || [];

  // Kiểm tra tên nhà đã tồn tại chưa
  if (houses.some((house) => house.houseName === houseName)) {
    alert(`Nhà "${houseName}" đã tồn tại. Vui lòng chọn tên khác.`);
    return;
  }

  // Thêm nhà mới vào danh sách houses
  houses.push({
    houseName: houseName,
    district: district,
    ward: ward,
    city: city,
    address: address,
  });

  // Lưu dữ liệu houses vào localStorage
  localStorage.setItem('houseData', JSON.stringify(houses));
  alert('Nhà đã được thêm thành công!');
  window.location.href = '../Room/Index.html'; // Quay lại trang chính sau khi lưu
});
