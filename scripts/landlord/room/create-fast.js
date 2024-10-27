document.addEventListener("DOMContentLoaded", () => {
  const quickAddRoomForm = document.getElementById("quickAddRoomForm");
  const saveRoomBtn = document.getElementById("saveRoomBtn");
  const houseSelect = document.getElementById("house");

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || 
                      JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Generate unique ID for each room
  function generateRoomId() {
      return 'room_' + new Date().getTime() + Math.floor(Math.random() * 1000);
  }

  // Load homes associated with the logged-in user
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

  // Validate form input and check for duplicate rooms
  function validateForm(startRoom, endRoom, home) {
      if (!startRoom || !endRoom || startRoom > endRoom) {
          alert("Vui lòng nhập khoảng phòng hợp lệ.");
          return false;
      }

      const existingRoomNumbers = home.rooms ? home.rooms.map(room => room.roomNumber) : [];

      for (let i = startRoom; i <= endRoom; i++) {
          if (existingRoomNumbers.includes(i.toString())) {
              alert(`Phòng số ${i} đã tồn tại trong nhà này.`);
              return false;
          }
      }
      return true;
  }

  // Save the new rooms to the selected home
  function saveRooms() {
      const startRoom = parseInt(document.getElementById("startRoom").value);
      const endRoom = parseInt(document.getElementById("endRoom").value);
      const houseId = houseSelect.value;
      const price = parseFloat(document.getElementById("price").value);
      const length = parseFloat(document.getElementById("length").value);
      const width = parseFloat(document.getElementById("width").value);
      const maxPeople = parseInt(document.getElementById("maxPeople").value);
      const maleAllowed = document.getElementById("maleAllowed").checked;
      const femaleAllowed = document.getElementById("femaleAllowed").checked;
      const description = document.getElementById("description").value.trim();

      // Find the user's home by ID
      const userIndex = users.findIndex(user => user.id === currentUser.id);
      const home = users[userIndex].homes.find(home => home.id === houseId);

      if (!home.rooms) {
          home.rooms = []; // Initialize rooms array if not present
      }

      // Validate input and ensure no duplicates
      if (!validateForm(startRoom, endRoom, home)) return;

      // Create and save rooms in the specified range
      for (let i = startRoom; i <= endRoom; i++) {
          const newRoom = {
              id: generateRoomId(),
              roomNumber: i.toString(),
              price: price,
              length: length,
              width: width,
              maxPeople: maxPeople,
              maleAllowed: maleAllowed,
              femaleAllowed: femaleAllowed,
              description: description
          };
          home.rooms.push(newRoom);
      }

      // Save the updated users data to localStorage
      localStorage.setItem("users", JSON.stringify(users));

      alert("Các phòng mới đã được thêm thành công!");

      // Reset the form
      quickAddRoomForm.reset();
  }

  // Attach event listener to the save button
  saveRoomBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent form submission
      saveRooms();
  });

  // Load homes when the page loads
  loadHomes();
});
