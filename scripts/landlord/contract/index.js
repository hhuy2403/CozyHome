document.addEventListener('DOMContentLoaded', function () {
  fetch('../sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('sidebar-container').innerHTML = data;
    })
    .catch((error) => console.error('Error loading sidebar:', error));

  loadContractData();
});

function loadContractData() {
  const tbody = document.getElementById('contractTableBody');
  tbody.innerHTML = ''; // Xóa dữ liệu cũ
  let contractCount = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('contract-')) {
      const contract = JSON.parse(localStorage.getItem(key));
      contractCount++;

      const row = `
          <tr>
            <td>${contract.tenantName}</td>
            <td>${contract.house}</td>
            <td>${contract.room}</td>
            <td>${contract.contractNumber}</td>
            <td>${contract.startDate}</td>
            <td>${contract.endDate}</td>
            <td>Hoạt động</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="editContract(${contract.contractNumber})"><i class="fas fa-edit"></i> Sửa</button>
              <button class="btn btn-sm btn-danger" onclick="deleteContract(${contract.contractNumber})"><i class="fas fa-trash"></i> Xóa</button>
            </td>
          </tr>`;
      tbody.innerHTML += row;
    }
  }

  document.getElementById(
    'paginationInfo'
  ).textContent = `Đang xem 1 đến ${contractCount} trong tổng số ${contractCount} hợp đồng`;
}

function editContract(contractNumber) {
  localStorage.setItem('selectedContract', contractNumber);
  window.location.href = 'edit.html'; // Điều hướng đến trang sửa hợp đồng
}

function deleteContract(contractNumber) {
  if (confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) {
    localStorage.removeItem(`contract-${contractNumber}`);
    loadContractData(); // Cập nhật lại danh sách sau khi xóa
  }
}
