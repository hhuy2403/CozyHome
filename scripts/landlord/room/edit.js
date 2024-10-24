document.addEventListener('DOMContentLoaded', function () {
  fetch('../sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('sidebar-container').innerHTML = data;
    })
    .catch((error) => console.error('Error loading sidebar:', error));
});
// Hàm load danh sách nhà từ localStorage và hiển thị vào ô select
function loadHouseOptions() {
  const houseData = JSON.parse(localStorage.getItem('houseData')) || []; // Lấy dữ liệu từ localStorage
  const houseSelect = document.getElementById('house'); // Phần tử select trong form

  houseSelect.innerHTML = ''; // Xóa các option cũ (nếu có)

  // Duyệt qua danh sách nhà và tạo các thẻ option
  houseData.forEach((house) => {
    const option = document.createElement('option');
    option.value = house.houseName;
    option.textContent = house.houseName;
    houseSelect.appendChild(option);
  });
}

// Hàm load dữ liệu của phòng từ localStorage để sửa
function loadRoomData(roomNumber) {
  let rooms = JSON.parse(localStorage.getItem('roomData')) || [];
  let room = rooms.find((r) => r.roomNumber == roomNumber);

  if (room) {
    document.getElementById('roomNumber').value = room.roomNumber;
    document.getElementById('order').value = room.order;
    document.getElementById('house').value = room.houseName;
    document.getElementById('price').value = room.price;
    document.getElementById('length').value = room.dimensions.length;
    document.getElementById('width').value = room.dimensions.width;
    document.getElementById('maxPeople').value = room.maxPeople;
    document.getElementById('maleAllowed').checked = room.allowedGender.male;
    document.getElementById('femaleAllowed').checked =
      room.allowedGender.female;
    document.getElementById('description').value = room.description;
    document.getElementById('fileUpload').textContent =
      room.image || 'Kéo tập tin cần upload thả vào đây';
  }
}

// Lưu thay đổi sau khi chỉnh sửa
document.getElementById('saveRoomBtn').addEventListener('click', function () {
  const roomNumber = parseInt(document.getElementById('roomNumber').value);
  const order = parseInt(document.getElementById('order').value);
  const houseName = document.getElementById('house').value;
  const price = parseInt(document.getElementById('price').value);
  const length = parseInt(document.getElementById('length').value);
  const width = parseInt(document.getElementById('width').value);
  const maxPeople = parseInt(document.getElementById('maxPeople').value);
  const maleAllowed = document.getElementById('maleAllowed').checked;
  const femaleAllowed = document.getElementById('femaleAllowed').checked;
  const description = document.getElementById('description').value;
  const image = document.getElementById('fileUpload').textContent;

  if (
    !roomNumber ||
    !order ||
    !price ||
    !length ||
    !width ||
    !maxPeople ||
    !houseName
  ) {
    alert('Vui lòng nhập đầy đủ thông tin.');
    return;
  }

  let rooms = JSON.parse(localStorage.getItem('roomData')) || [];
  let roomIndex = rooms.findIndex(
    (r) => r.roomNumber === roomNumber && r.houseName === houseName
  );

  if (roomIndex !== -1) {
    rooms[roomIndex] = {
      roomNumber: roomNumber,
      order: order,
      houseName: houseName,
      price: price,
      dimensions: { length: length, width: width },
      maxPeople: maxPeople,
      allowedGender: { male: maleAllowed, female: femaleAllowed },
      description: description,
      image: image,
      isRented: rooms[roomIndex].isRented,
      hasPaid: rooms[roomIndex].hasPaid,
    };

    localStorage.setItem('roomData', JSON.stringify(rooms));
    alert('Phòng đã được cập nhật thành công!');
    window.location.href = 'index.html'; // Quay lại trang chính sau khi lưu
  } else {
    alert(`Không tìm thấy phòng số ${roomNumber} tại ${houseName}.`);
  }
});

// Sự kiện kéo thả file để upload hình ảnh
document
  .getElementById('fileUpload')
  .addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.backgroundColor = '#f8f8f8';
  });

document
  .getElementById('fileUpload')
  .addEventListener('dragleave', function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.backgroundColor = '#fff';
  });

document.getElementById('fileUpload').addEventListener('drop', function (e) {
  e.preventDefault();
  e.stopPropagation();
  this.style.backgroundColor = '#fff';
  let files = e.dataTransfer.files;
  if (files.length) {
    this.textContent = files[0].name;
  } else {
    this.textContent = 'Kéo tập tin cần upload thả vào đây';
  }
});

// Gọi hàm loadHouseOptions và loadRoomData khi trang được tải
window.onload = function () {
  loadHouseOptions(); // Load danh sách nhà vào select
  const urlParams = new URLSearchParams(window.location.search);
  const roomNumber = urlParams.get('roomNumber');
  if (roomNumber) {
    loadRoomData(roomNumber); // Load dữ liệu phòng nếu có
  }
};
