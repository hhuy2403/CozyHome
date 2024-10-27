document.addEventListener("DOMContentLoaded", () => {
  const createHouseForm = document.getElementById("createHouseForm");
  const saveHouseBtn = document.getElementById("saveHouseBtn");

  // Retrieve the current user from sessionStorage or localStorage
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || 
                      JSON.parse(localStorage.getItem("currentUser"));

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Generate a unique ID for each house
  function generateHouseId() {
      return 'house_' + new Date().getTime(); // Unique ID based on timestamp
  }

  // Validate that all fields are filled
  function validateForm() {
      const houseName = document.getElementById("houseName").value.trim();
      const city = document.getElementById("city").value.trim();
      const district = document.getElementById("district").value.trim();
      const ward = document.getElementById("ward").value.trim();
      const address = document.getElementById("address").value.trim();

      if (!houseName || !city || !district || !ward || !address) {
          alert("Vui lòng điền đầy đủ tất cả các thông tin bắt buộc.");
          return false;
      }

      // Check if house name already exists for the current user
      const userIndex = users.findIndex(user => user.id === currentUser.id);
      if (userIndex !== -1 && users[userIndex].homes) {
          const houseExists = users[userIndex].homes.some(
              house => house.name.toLowerCase() === houseName.toLowerCase()
          );
          if (houseExists) {
              alert(`Tên nhà "${houseName}" đã tồn tại. Vui lòng chọn tên khác.`);
              return false;
          }
      }
      return true;
  }

  // Save the new house to the current user's data
  function saveHouse() {
      if (!validateForm()) return; // Stop if form is invalid

      const houseName = document.getElementById("houseName").value.trim();
      const city = document.getElementById("city").value.trim();
      const district = document.getElementById("district").value.trim();
      const ward = document.getElementById("ward").value.trim();
      const address = document.getElementById("address").value.trim();

      const newHouse = {
          id: generateHouseId(),
          name: houseName,
          city: city,
          district: district,
          ward: ward,
          address: address,
      };

      // Find the current user in the users array
      const userIndex = users.findIndex(user => user.id === currentUser.id);

      if (userIndex !== -1) {
          // Initialize the homes array if it doesn't exist
          if (!users[userIndex].homes) {
              users[userIndex].homes = [];
          }

          // Add the new house to the user's homes array
          users[userIndex].homes.push(newHouse);

          // Save the updated users array back to localStorage
          localStorage.setItem("users", JSON.stringify(users));

          alert("Nhà mới đã được lưu thành công!");

          // Reset the form after saving
          createHouseForm.reset();
      } else {
          alert("Không tìm thấy người dùng hiện tại.");
      }
  }

  // Attach event listener to the save button
  saveHouseBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent form submission
      saveHouse();
  });
});
