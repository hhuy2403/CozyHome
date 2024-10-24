document.addEventListener('DOMContentLoaded', function () {
    fetch('../sidebar.html')
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('sidebar-container').innerHTML = data;
      })
      .catch((error) => console.error('Error loading sidebar:', error));
  });

  // Hàm load danh sách nhà từ localStorage và thêm vào dropdown
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
      const startRoom = parseInt(
        document.getElementById('startRoom').value
      );
      const endRoom = parseInt(document.getElementById('endRoom').value);
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

      if (
        !startRoom ||
        !endRoom ||
        !price ||
        !length ||
        !width ||
        !maxPeople ||
        startRoom > endRoom
      ) {
        alert(
          'Vui lòng nhập đầy đủ thông tin và đảm bảo phòng bắt đầu phải nhỏ hơn hoặc bằng phòng kết thúc.'
        );
        return;
      }

      let rooms = JSON.parse(localStorage.getItem('roomData')) || [];

      // Kiểm tra xem phòng trong khoảng đã tồn tại hay chưa
      for (let i = startRoom; i <= endRoom; i++) {
        if (
          rooms.some(
            (room) => room.roomNumber === i && room.houseName === houseName
          )
        ) {
          alert(
            `Phòng số ${i} tại ${houseName} đã tồn tại. Vui lòng chọn số phòng khác.`
          );
          return;
        }
      }

      // Thêm các phòng vào roomData
      for (let i = startRoom; i <= endRoom; i++) {
        rooms.push({
          roomNumber: i,
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
          isRented: false, // Thêm thuộc tính isRented để quản lý tình trạng cho thuê
          hasPaid: false, // Thêm thuộc tính hasPaid để quản lý tình trạng thanh toán
        });
      }

      localStorage.setItem('roomData', JSON.stringify(rooms));
      alert('Phòng đã được thêm thành công!');
      window.location.href = 'index.html'; // Quay lại trang chính sau khi lưu
    });