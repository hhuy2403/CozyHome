document.addEventListener("DOMContentLoaded", function () {
    fetch("../sidebar.html")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("sidebar-container").innerHTML = data;
      })
      .catch((error) => console.error("Error loading sidebar:", error));
  });

  window.onload = function () {
    const selectedService = JSON.parse(
      localStorage.getItem("selectedService")
    );
    if (selectedService) {
      document.getElementById("serviceNameInput").value =
        selectedService.name;
      document.getElementById("serviceTypeInput").value =
        selectedService.type;
      document.getElementById("priceInput").value = selectedService.price;
    }
  };