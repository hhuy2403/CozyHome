document.addEventListener('DOMContentLoaded', function () {
  fetch('../sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('sidebar-container').innerHTML = data;
    })
    .catch((error) => console.error('Error loading sidebar:', error));
});

let currentHouseName = ''; // Lưu tên nhà hiện tại

// Hàm load dữ liệu nhà cần sửa từ localStorage và hiển thị lên giao diện
function loadHouseData() {
  const houseData = JSON.parse(localStorage.getItem('houseData')) || [];
  currentHouseName = localStorage.getItem('currentHouse'); // Lấy tên nhà đã lưu khi nhấn nút "Sửa nhà"

  const house = houseData.find((h) => h.houseName === currentHouseName);
  if (!house) {
    alert('Không tìm thấy nhà để sửa.');
    window.location.href = '/pages/landlord/room/index.html';
    return;
  }

  // Đổ dữ liệu vào các trường nhập liệu
  document.getElementById('houseName').value = house.houseName;
  document.getElementById('district').value = house.district;
  document.getElementById('ward').value = house.ward;
  document.getElementById('city').value = house.city;
  document.getElementById('address').value = house.address;
  document.getElementById('description').value = house.description || ''; // Mô tả có thể trống
}

// Gọi hàm loadHouseData khi trang được load
window.onload = function () {
  loadHouseData();
};

// Hàm lưu dữ liệu nhà đã chỉnh sửa vào localStorage
document.getElementById('saveHouseBtn').addEventListener('click', function () {
  const houseName = document.getElementById('houseName').value.trim();
  const district = document.getElementById('district').value.trim();
  const ward = document.getElementById('ward').value.trim();
  const city = document.getElementById('city').value.trim();
  const address = document.getElementById('address').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!houseName || !district || !ward || !city || !address) {
    alert('Vui lòng nhập đầy đủ thông tin.');
    return;
  }

  let houseData = JSON.parse(localStorage.getItem('houseData')) || [];
  const roomData = JSON.parse(localStorage.getItem('roomData')) || [];

  // Kiểm tra xem tên nhà mới có bị trùng với các nhà khác không
  const duplicateHouse = houseData.find(
    (h) => h.houseName === houseName && h.houseName !== currentHouseName
  );
  if (duplicateHouse) {
    alert('Tên nhà đã tồn tại. Vui lòng chọn tên khác.');
    return;
  }

  // Cập nhật thông tin nhà
  houseData = houseData.map((h) => {
    if (h.houseName === currentHouseName) {
      return {
        ...h,
        houseName,
        district,
        ward,
        city,
        address,
        description,
      };
    }
    return h;
  });

  // Cập nhật roomData nếu tên nhà thay đổi
  if (currentHouseName !== houseName) {
    roomData.forEach((room) => {
      if (room.houseName === currentHouseName) {
        room.houseName = houseName;
      }
    });
  }

  // Lưu lại vào localStorage
  localStorage.setItem('houseData', JSON.stringify(houseData));
  localStorage.setItem('roomData', JSON.stringify(roomData));

  alert('Thông tin nhà đã được cập nhật thành công!');
  window.location.href = '/pages/landlord/room/index.html'; // Quay về trang chính sau khi lưu
});
