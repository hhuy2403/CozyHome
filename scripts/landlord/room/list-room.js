document.addEventListener("DOMContentLoaded", function () {
    fetch("../sidebar.html")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("sidebar-container").innerHTML = data;
      })
      .catch((error) => console.error("Error loading sidebar:", error));

    document
      .getElementById("exportBtn")
      .addEventListener("click", function () {
        exportToExcel();
      });
  });

  // Lấy dữ liệu từ localStorage
  const roomData = JSON.parse(localStorage.getItem("roomData")) || [];
  const houseData = JSON.parse(localStorage.getItem("houseData")) || [];

  // Hiển thị danh sách phòng
  function displayRoomList(filteredRooms) {
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ trước khi hiển thị dữ liệu mới

    filteredRooms.forEach((room) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td><input type="text" class="form-control room-number" value="${
          room.roomNumber
        }" /></td>
        <td>${room.houseName}</td>
        <td><input type="number" class="form-control room-order" value="${
          room.order || ""
        }" /></td>
        <td><input type="number" class="form-control room-price" value="${
          room.price || ""
        }" /></td>
        <td><input type="text" class="form-control room-description" placeholder="Ghi chú" value="${
          room.description || ""
        }" /></td>
        <td>
          <button class="btn btn-delete" onclick="deleteRoom(${
            room.roomNumber
          }, '${room.houseName}')">
            <i class="fas fa-trash"></i> Xóa
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Hàm để lọc phòng theo khu vực
  function filterRoomsByArea(area) {
    if (area === "") {
      // Nếu không chọn khu vực nào, hiển thị tất cả phòng
      displayRoomList(roomData);
    } else {
      const filteredRooms = roomData.filter(
        (room) => room.houseName === area
      );
      displayRoomList(filteredRooms);
    }
  }

  // Hiển thị danh sách khu vực (danh sách nhà) vào ô select
  function loadAreaOptions() {
    const areaSelect = document.getElementById("areaSelect");
    areaSelect.innerHTML = '<option value="">Tất cả</option>'; // Thêm tùy chọn mặc định

    houseData.forEach((house) => {
      const option = document.createElement("option");
      option.value = house.houseName;
      option.textContent = house.houseName;
      areaSelect.appendChild(option);
    });
  }

  // Lắng nghe sự kiện thay đổi khi người dùng chọn khu vực
  document
    .getElementById("areaSelect")
    .addEventListener("change", function () {
      const selectedArea = this.value;
      filterRoomsByArea(selectedArea);
    });

  // Hàm xóa phòng
  window.deleteRoom = function (roomNumber, houseName) {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa phòng ${roomNumber} tại ${houseName}?`
      )
    ) {
      // Xóa phòng từ dữ liệu roomData
      const updatedRooms = roomData.filter(
        (room) =>
          !(room.roomNumber === roomNumber && room.houseName === houseName)
      );
      localStorage.setItem("roomData", JSON.stringify(updatedRooms));

      // Cập nhật lại danh sách sau khi xóa
      filterRoomsByArea(document.getElementById("areaSelect").value);
      alert("Phòng đã được xóa thành công.");
    }
  };

  // Hàm để lưu các thay đổi vào localStorage
  function saveRoomData() {
    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row, index) => {
      const roomNumber = row.querySelector(".room-number").value;
      const order = row.querySelector(".room-order").value;
      const price = row.querySelector(".room-price").value;
      const description = row.querySelector(".room-description").value;

      // Cập nhật lại thông tin phòng trong roomData
      roomData[index].roomNumber = parseInt(roomNumber);
      roomData[index].order = parseInt(order);
      roomData[index].price = parseInt(price);
      roomData[index].description = description;
    });

    // Lưu lại dữ liệu vào localStorage
    localStorage.setItem("roomData", JSON.stringify(roomData));
    alert("Dữ liệu đã được lưu thành công!");
  }

  // Khởi tạo khi trang được tải
  loadAreaOptions(); // Tải danh sách khu vực
  displayRoomList(roomData); // Hiển thị tất cả các phòng ban đầu

  // Sự kiện khi nhấn nút "Lưu"
  document
    .getElementById("saveBtn")
    .addEventListener("click", saveRoomData);

  //Xuất file

  function exportToExcel() {
    // Sử dụng thư viện SheetJS (XLSX) để xuất dữ liệu roomData ra file Excel
    const worksheet = XLSX.utils.json_to_sheet(roomData); // Chuyển roomData thành sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh Sách Phòng");

    // Xuất file Excel
    XLSX.writeFile(workbook, "Danh_Sach_Phong.xlsx");
  }