document.addEventListener('DOMContentLoaded', function () {
  fetch('../sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('sidebar-container').innerHTML = data;
    })
    .catch((error) => console.error('Error loading sidebar:', error));

  // Load dữ liệu hợp đồng để sửa
  const contractNumber = localStorage.getItem('selectedContract');
  if (contractNumber) {
    const contractData = JSON.parse(
      localStorage.getItem(`contract-${contractNumber}`)
    );
    if (contractData) {
      document.getElementById('tenantName').value = contractData.tenantName;
      document.getElementById('houseSelect').value = contractData.house;
      document.getElementById('roomSelect').value = contractData.room;
      document.getElementById('contractNumber').value =
        contractData.contractNumber;
      document.getElementById('startDate').value = contractData.startDate;
      document.getElementById('endDate').value = contractData.endDate;
    }
  }
});

// Lưu hợp đồng sau khi chỉnh sửa
document
  .getElementById('saveContractBtn')
  .addEventListener('click', function () {
    const contractData = {
      tenantName: document.getElementById('tenantName').value,
      house: document.getElementById('houseSelect').value,
      room: document.getElementById('roomSelect').value,
      contractNumber: document.getElementById('contractNumber').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
    };
    localStorage.setItem(
      `contract-${contractData.contractNumber}`,
      JSON.stringify(contractData)
    );
    alert('Hợp đồng đã được sửa thành công.');
    window.location.href = 'index.html';
  });
