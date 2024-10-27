document.addEventListener("DOMContentLoaded", () => {
  const createRoomForm = document.getElementById("createRoomForm");
  const saveRoomBtn = document.getElementById("saveRoomBtn");
  const houseSelect = document.getElementById("house");

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || 
                      JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Generate a unique ID for each room
  function generateRoomId() {
      return 'room_' + new Date().getTime();
  }

  // Load homes associated with the current user
  function loadHomes() {
      const user = users.find(user => user.id === currentUser.id);
      if (user && user.homes) {
          user.homes.forEach(home => {
              const option = document.createElement("option");
              option.value = home.id;
              option.textContent = home.name;
              houseSelect.appendChild(option);
          });
      }
  }

  // Validate form data
  function validateForm() {
      const roomNumber = document.getElementById("roomNumber").value.trim();
      const order = document.getElementById("order").value.trim();
      const houseId = houseSelect.value;
      const price = document.getElementById("price").value.trim();
      const length = document.getElementById("length").value.trim();
      const width = document.getElementById("width").value.trim();
      const maxPeople = document.getElementById("maxPeople").value.trim();

      if (!roomNumber || !order || !houseId || !price || !length || !width || !maxPeople) {
          alert("Vui lòng điền đầy đủ tất cả các thông tin bắt buộc.");
          return false;
      }

      // Check if the room number already exists in the selected home
      const user = users.find(user => user.id === currentUser.id);
      const home = user.homes.find(home => home.id === houseId);

      if (home.rooms && home.rooms.some(room => room.roomNumber === roomNumber)) {
          alert(`Phòng số "${roomNumber}" đã tồn tại trong nhà này.`);
          return false;
      }

      return true;
  }

  // Save the new room to the selected home
  function saveRoom() {
      if (!validateForm()) return; // Stop if form is invalid

      const roomNumber = document.getElementById("roomNumber").value.trim();
      const order = document.getElementById("order").value.trim();
      const houseId = houseSelect.value;
      const price = document.getElementById("price").value.trim();
      const length = document.getElementById("length").value.trim();
      const width = document.getElementById("width").value.trim();
      const maxPeople = document.getElementById("maxPeople").value.trim();
      const maleAllowed = document.getElementById("maleAllowed").checked;
      const femaleAllowed = document.getElementById("femaleAllowed").checked;
      const description = document.getElementById("description").value.trim();

      const newRoom = {
          id: generateRoomId(),
          roomNumber: roomNumber,
          order: parseInt(order),
          price: parseFloat(price),
          length: parseFloat(length),
          width: parseFloat(width),
          maxPeople: parseInt(maxPeople),
          maleAllowed: maleAllowed,
          femaleAllowed: femaleAllowed,
          description: description
      };

      // Find the current user's home and add the new room
      const userIndex = users.findIndex(user => user.id === currentUser.id);
      const home = users[userIndex].homes.find(home => home.id === houseId);

      if (!home.rooms) {
          home.rooms = []; // Initialize rooms array if not present
      }
      home.rooms.push(newRoom);

      // Save the updated users array to localStorage
      localStorage.setItem("users", JSON.stringify(users));

      alert("Phòng mới đã được lưu thành công!");

      // Reset the form after saving
      createRoomForm.reset();
  }

  // Attach event listener to the save button
  saveRoomBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent form submission
      saveRoom();
  });

  // Load homes when the page loads
  loadHomes();
});
