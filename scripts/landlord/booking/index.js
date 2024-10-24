document.addEventListener("DOMContentLoaded", function () {
    fetch("../sidebar.html")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("sidebar-container").innerHTML = data;
      })
      .catch((error) => console.error("Error loading sidebar:", error));
  });

  function redirectToCreatePage() {
    // Điều hướng tới trang Create.html
    window.location.href = "create.html"; // Đường dẫn có thể tùy chỉnh theo cấu trúc dự án của bạn
  }