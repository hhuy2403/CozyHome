document.addEventListener('DOMContentLoaded', function () {
    fetch('../sidebar.html')
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('sidebar-container').innerHTML = data;
      })
      .catch((error) => console.error('Error loading sidebar:', error));
  });

  // Hàm load danh sách nhà từ localStorage vào dropdown
  function loadHouseData() {
    const houseSelect = document.getElementById('house');
    const houseData = JSON.parse(localStorage.getItem('houseData')) || [];

    houseSelect.innerHTML = ''; // Xóa các option cũ trước khi thêm mới
    houseData.forEach((house) => {
      const option = document.createElement('option');
      option.value = house.houseName;
      option.textContent = house.houseName;
      houseSelect.appendChild(option);
    });
  }

  // Gọi hàm loadHouseData khi trang được load
  window.onload = function () {
    loadHouseData();
  };

  document
    .getElementById('saveRoomBtn')
    .addEventListener('click', function () {
      const roomNumber = parseInt(
        document.getElementById('roomNumber').value
      );
      const order = parseInt(document.getElementById('order').value);
      const houseName = document.getElementById('house').value;
      const price = parseInt(document.getElementById('price').value);
      const length = parseInt(document.getElementById('length').value);
      const width = parseInt(document.getElementById('width').value);
      const maxPeople = parseInt(
        document.getElementById('maxPeople').value
      );
      const maleAllowed = document.getElementById('maleAllowed').checked;
      const femaleAllowed =
        document.getElementById('femaleAllowed').checked;
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

      if (
        rooms.some(
          (room) =>
            room.roomNumber === roomNumber && room.houseName === houseName
        )
      ) {
        alert(
          `Phòng số ${roomNumber} tại ${houseName} đã tồn tại. Vui lòng chọn số phòng khác.`
        );
        return;
      }

      rooms.push({
        roomNumber: roomNumber,
        order: order,
        houseName: houseName,
        price: price,
        dimensions: {
          length: length,
          width: width,
        },
        maxPeople: maxPeople,
        allowedGender: {
          male: maleAllowed,
          female: femaleAllowed,
        },
        description: description,
        image: image,
        isRented: false, // Thêm thuộc tính để phòng chưa cho thuê
        hasPaid: false, // Thêm thuộc tính để phòng chưa thanh toán
      });

      localStorage.setItem('roomData', JSON.stringify(rooms));
      alert('Phòng đã được thêm thành công!');
      window.location.href = 'index.html'; // Quay lại trang chính sau khi lưu
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

  document
    .getElementById('fileUpload')
    .addEventListener('drop', function (e) {
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