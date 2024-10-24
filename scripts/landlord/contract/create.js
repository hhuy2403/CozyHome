document.addEventListener("DOMContentLoaded", function () {
    fetch("../sidebar.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("sidebar-container").innerHTML = data;
      })
      .catch(error => console.error('Error loading sidebar:', error));
  });

  // Lưu hợp đồng
  document.getElementById('saveContractBtn').addEventListener('click', function () {
    const contractData = {
      tenantName: document.getElementById('tenantName').value,
      house: document.getElementById('houseSelect').value,
      room: document.getElementById('roomSelect').value,
      contractNumber: document.getElementById('contractNumber').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value
    };
    localStorage.setItem(`contract-${contractData.contractNumber}`, JSON.stringify(contractData));
    alert('Hợp đồng đã được lưu thành công.');
    window.location.href = "index.html"; // Quay lại trang danh sách hợp đồng sau khi lưu
  });