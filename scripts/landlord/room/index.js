let currentHouse = ''; // Biến lưu nhà hiện tại

// Hàm load dữ liệu phòng từ localStorage và hiển thị lên giao diện
function loadRoomData(houseName) {
  currentHouse = houseName;
  const roomData = JSON.parse(localStorage.getItem('roomData')) || [];
  const roomContainer = document.getElementById('roomContainer');
  let filteredRooms = roomData.filter(room => room.houseName === houseName);

  roomContainer.innerHTML = ''; // Xóa các phòng cũ trước khi thêm mới

  if (filteredRooms.length === 0) {
    roomContainer.innerHTML = `<p class="text-muted">Không có phòng nào trong nhà này.</p>`;
  } else {
    filteredRooms.forEach(room => {
      const roomCard = `
        <div class="col-12 col-md-6 col-lg-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title"><i class="fa fa-home"></i> Phòng ${room.roomNumber}</h5>
              <button class="btn btn-info btn-block mb-3" onclick="redirectToCreatePage('${room.roomNumber}')">Thêm khách</button>
              <p class="text-muted"><i class="fa fa-user"></i> ${room.isRented ? 'Đã cho thuê' : 'Còn trống'}</p>
              <p class="text-danger"><i class="fa fa-money"></i> ${room.price.toLocaleString()} VNĐ</p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-primary btn-sm" onclick="redirectToEditPage('${room.roomNumber}')">
                  <i class="fas fa-edit mr-1"></i> Chỉnh sửa
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteRoom(${room.roomNumber})">
                  <i class="fas fa-trash-alt mr-1"></i> Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      roomContainer.innerHTML += roomCard;
    });
  }

  // Cập nhật tổng quan phòng sau khi hiển thị danh sách
  updateRoomSummary(houseName);
}

function redirectToCreatePage(roomNumber) {
  // Lưu thông tin số phòng vào localStorage hoặc truyền qua URL
  localStorage.setItem('selectedRoomNumber', roomNumber);

  // Điều hướng sang trang Create.html
  window.location.href = '/pages/landlord/customer/create.html'; // Đường dẫn có thể tùy chỉnh theo cấu trúc dự án của bạn
}

function redirectToEditPage(roomNumber) {
  // Lưu thông tin số phòng vào localStorage
  localStorage.setItem('selectedRoomNumber', roomNumber);

  // Điều hướng sang trang Edit.html
  window.location.href = '/pages/landlord/room/edit.html'; // Đường dẫn có thể tùy chỉnh theo cấu trúc dự án của bạn
}

// Hàm load danh sách nhà từ localStorage và hiển thị dưới dạng tab
function loadHouseData() {
  const houseData = JSON.parse(localStorage.getItem('houseData')) || [];
  const houseTabs = document.getElementById('houseTabs');

  houseTabs.innerHTML = ''; // Xóa các tab cũ trước khi thêm mới

  houseData.forEach((house, index) => {
    const houseTab = `
      <li class="nav-item">
        <a class="nav-link ${index === 0 ? 'active' : ''}" href="#" onclick="loadRoomData('${house.houseName}'); setCurrentHouse('${house.houseName}')">${house.houseName}</a>
      </li>
    `;
    houseTabs.innerHTML += houseTab;

    // Tự động load dữ liệu của nhà đầu tiên khi trang được load
    if (index === 0) {
      loadRoomData(house.houseName);
      setCurrentHouse(house.houseName); // Lưu tên nhà đầu tiên khi load trang
    }
  });
}

// Gọi loadHouseData khi trang được load
window.onload = function() {
  loadHouseData();
}

// Thêm chức năng xóa phòng theo nhà hiện tại
function deleteRoom(roomNumber) {
  if (confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
    let rooms = JSON.parse(localStorage.getItem('roomData')) || [];
    rooms = rooms.filter(room => !(room.roomNumber === roomNumber && room.houseName === currentHouse));
    localStorage.setItem('roomData', JSON.stringify(rooms));
    loadRoomData(currentHouse); // Cập nhật giao diện sau khi xóa
    alert('Phòng đã được xóa thành công.');
  }
}

// Hàm cập nhật tổng quan phòng theo nhà
function updateRoomSummary(houseName) {
  const rooms = JSON.parse(localStorage.getItem('roomData')) || [];
  const houseRooms = rooms.filter(room => room.houseName === houseName);
  const rentedRooms = houseRooms.filter(room => room.isRented).length;
  const totalRooms = houseRooms.length;
  const unpaidRooms = houseRooms.filter(room => !room.hasPaid).length;

  document.getElementById('roomStatusSummary').textContent =
    `Còn trống ${totalRooms - rentedRooms} | Đã cho thuê ${rentedRooms} | Chưa thu phí ${unpaidRooms}`;
  document.getElementById('roomStatusSummary1').textContent =
    `Còn trống ${totalRooms - rentedRooms} | Đã cho thuê ${rentedRooms} | Chưa thu phí ${unpaidRooms}`;
}

// Khởi tạo tooltip
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

function setCurrentHouse(houseName) {
  localStorage.setItem('currentHouse', houseName);
  document.getElementById('editHouseBtn').setAttribute('onclick', `setCurrentHouse('${houseName}')`);
}

function deleteHouse(houseName) {
  if (confirm(`Bạn có chắc chắn muốn xóa nhà ${houseName}?`)) {
    // Xóa nhà từ houseData
    let houses = JSON.parse(localStorage.getItem('houseData')) || [];
    houses = houses.filter(house => house.houseName !== houseName);
    localStorage.setItem('houseData', JSON.stringify(houses));

    // Xóa tất cả các phòng thuộc nhà đó từ roomData
    let rooms = JSON.parse(localStorage.getItem('roomData')) || [];
    rooms = rooms.filter(room => room.houseName !== houseName);
    localStorage.setItem('roomData', JSON.stringify(rooms));

    // Cập nhật giao diện
    loadHouseData(); // Reload lại danh sách nhà và tab sau khi xóa
    alert('Nhà đã được xóa thành công.');
  }
}

// Thêm sự kiện click cho nút "Xóa nhà"
document.getElementById("deleteHouseBtn").addEventListener("click", function () {
  deleteHouse(currentHouse); // Xóa nhà hiện tại
});

// Hàm lọc và tìm kiếm phòng
function searchRooms() {
  const roomData = JSON.parse(localStorage.getItem('roomData')) || [];
  const roomStatusFilter = document.getElementById('roomStatusFilter').value;
  const feeStatusFilter = document.getElementById('feeStatusFilter').value;
  const roomSearch = document.getElementById('roomSearch').value.trim();

  // Lọc danh sách phòng dựa trên các tiêu chí tìm kiếm
  let filteredRooms = roomData.filter(room => room.houseName === currentHouse);

  // Lọc theo trạng thái phòng
  if (roomStatusFilter === "Còn trống") {
    filteredRooms = filteredRooms.filter(room => !room.isRented);
  } else if (roomStatusFilter === "Đã cho thuê") {
    filteredRooms = filteredRooms.filter(room => room.isRented);
  }

  // Lọc theo trạng thái phí
  if (feeStatusFilter === "Chưa thu phí") {
    filteredRooms = filteredRooms.filter(room => !room.hasPaid);
  }

  // Tìm kiếm theo số phòng
  if (roomSearch) {
    filteredRooms = filteredRooms.filter(room => room.roomNumber.toString().includes(roomSearch));
  }

  // Hiển thị kết quả tìm kiếm
  displaySearchResults(filteredRooms);
}

// Hàm hiển thị kết quả tìm kiếm
function displaySearchResults(filteredRooms) {
  const roomContainer = document.getElementById('roomContainer');
  roomContainer.innerHTML = ''; // Xóa kết quả cũ

  if (filteredRooms.length === 0) {
    roomContainer.innerHTML = `<p class="text-muted">Không tìm thấy phòng nào.</p>`;
  } else {
    filteredRooms.forEach(room => {
      const roomCard = `
        <div class="col-12 col-md-6 col-lg-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <h5 class="card-title"><i class="fa fa-home"></i> Phòng ${room.roomNumber}</h5>
              <button class="btn btn-info btn-block mb-3" onclick="redirectToCreatePage('${room.roomNumber}')">Thêm khách</button>
              <p class="text-muted"><i class="fa fa-user"></i> ${room.isRented ? 'Đã cho thuê' : 'Còn trống'}</p>
              <p class="text-danger"><i class="fa fa-money"></i> ${room.price.toLocaleString()} VNĐ</p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-primary btn-sm" onclick="redirectToEditPage('${room.roomNumber}')">
                  <i class="fas fa-edit mr-1"></i> Chỉnh sửa
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteRoom(${room.roomNumber})">
                  <i class="fas fa-trash-alt mr-1"></i> Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      roomContainer.innerHTML += roomCard;
    });
  }
}

// Gắn sự kiện tìm kiếm vào nút "Tìm kiếm"
document.getElementById('searchBtn').addEventListener('click', searchRooms);

