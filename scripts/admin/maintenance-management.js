document.addEventListener('DOMContentLoaded', function () {

  renderContractList();
  renderMaintenanceSchedule();
  populateContractOptions();

  // Hiển thị danh sách hợp đồng bảo trì
  function renderContractList() {
    const contracts =
      JSON.parse(localStorage.getItem('cozyhome-contracts')) || [];
    const contractList = document.getElementById('contractList');

    if (contracts.length === 0) {
      contractList.innerHTML = `<tr><td colspan="5" class="no-data">Không có hợp đồng nào.</td></tr>`;
    } else {
      contractList.innerHTML = contracts
        .map(
          (contract, index) => `
                <tr>
                    <td>${contract.partner}</td>
                    <td>${contract.terms}</td>
                    <td>${contract.startDate}</td>
                    <td>${contract.endDate}</td>
                    <td>
                        <button class="cozyhome-btn cozyhome-btn-secondary" onclick="editContract(${index})">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button class="cozyhome-btn cozyhome-btn-danger" onclick="deleteContract(${index})">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </td>
                </tr>
            `
        )
        .join('');
    }
  }

  // Hiển thị danh sách lịch bảo trì
  function renderMaintenanceSchedule() {
    const maintenanceSchedules =
      JSON.parse(localStorage.getItem('cozyhome-maintenance-schedules')) || [];
    const scheduleList = document.getElementById('maintenanceScheduleList');

    if (maintenanceSchedules.length === 0) {
      scheduleList.innerHTML = `<tr><td colspan="5" class="no-data">Không có lịch bảo trì nào.</td></tr>`;
    } else {
      scheduleList.innerHTML = maintenanceSchedules
        .map(
          (schedule, index) => `
                <tr>
                    <td>${schedule.date}</td>
                    <td>${schedule.type}</td>
                    <td>${schedule.details}</td>
                    <td>${schedule.contractPartner}</td>
                    <td>
                        <button class="cozyhome-btn cozyhome-btn-secondary" onclick="editMaintenance(${index})">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button class="cozyhome-btn cozyhome-btn-danger" onclick="deleteMaintenance(${index})">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </td>
                </tr>
            `
        )
        .join('');
    }
  }

  // Tạo hoặc cập nhật hợp đồng bảo trì
  window.createContract = function () {
    const partner = document.getElementById('contractPartner').value.trim();
    const terms = document.getElementById('contractTerms').value.trim();
    const startDate = document.getElementById('contractStartDate').value;
    const endDate = document.getElementById('contractEndDate').value;
    const contractIndex = document.getElementById('contractIndex').value;

    if (!partner || !terms || !startDate || !endDate) {
      Swal.fire('Vui lòng điền đầy đủ thông tin hợp đồng.', '', 'error');
      return;
    }

    const contracts =
      JSON.parse(localStorage.getItem('cozyhome-contracts')) || [];

    if (contractIndex === '') {
      contracts.push({ partner, terms, startDate, endDate });
      Swal.fire('Hợp đồng bảo trì đã được tạo thành công!', '', 'success');
    } else {
      contracts[contractIndex] = { partner, terms, startDate, endDate };
      Swal.fire('Hợp đồng bảo trì đã được cập nhật!', '', 'success');
    }

    localStorage.setItem('cozyhome-contracts', JSON.stringify(contracts));
    resetContractForm();
    renderContractList();
    populateContractOptions();
  };

  // Xóa hợp đồng bảo trì
  window.deleteContract = function (index) {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn có muốn xóa hợp đồng này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        const contracts =
          JSON.parse(localStorage.getItem('cozyhome-contracts')) || [];
        const deletedContract = contracts[index];
        contracts.splice(index, 1);
        localStorage.setItem('cozyhome-contracts', JSON.stringify(contracts));

        let maintenanceSchedules =
          JSON.parse(localStorage.getItem('cozyhome-maintenance-schedules')) ||
          [];
        maintenanceSchedules = maintenanceSchedules.filter(
          (schedule) => schedule.contractPartner !== deletedContract.partner
        );
        localStorage.setItem(
          'cozyhome-maintenance-schedules',
          JSON.stringify(maintenanceSchedules)
        );

        Swal.fire(
          'Đã xóa!',
          'Hợp đồng bảo trì và các lịch bảo trì liên quan đã được xóa.',
          'success'
        );
        renderContractList();
        renderMaintenanceSchedule();
        populateContractOptions();
      }
    });
  };

  // Sửa hợp đồng bảo trì
  window.editContract = function (index) {
    const contracts =
      JSON.parse(localStorage.getItem('cozyhome-contracts')) || [];
    const contract = contracts[index];

    document.getElementById('contractPartner').value = contract.partner;
    document.getElementById('contractTerms').value = contract.terms;
    document.getElementById('contractStartDate').value = contract.startDate;
    document.getElementById('contractEndDate').value = contract.endDate;
    document.getElementById('contractIndex').value = index;

    showCreateContractForm();
  };

  // Hiển thị danh sách hợp đồng trong dropdown để chọn khi tạo lịch bảo trì
  function populateContractOptions() {
    const contracts =
      JSON.parse(localStorage.getItem('cozyhome-contracts')) || [];
    const contractDropdown = document.getElementById('maintenanceContract');

    contractDropdown.innerHTML = `
            <option value="">Chọn Hợp Đồng Liên Quan</option>
            ${contracts
              .map(
                (contract, index) => `
                <option value="${index}">${contract.partner} - ${contract.startDate} đến ${contract.endDate}</option>
            `
              )
              .join('')}
        `;
  }

  // Tạo hoặc cập nhật lịch bảo trì
  window.createMaintenance = function () {
    const date = document.getElementById('maintenanceDate').value;
    const type = document.getElementById('maintenanceType').value.trim();
    const details = document.getElementById('maintenanceDetails').value.trim();
    const contractIndex = document.getElementById('maintenanceContract').value;
    const scheduleIndex = document.getElementById('scheduleIndex').value;

    if (!date || !type || !details || contractIndex === '') {
      Swal.fire(
        'Vui lòng điền đầy đủ thông tin lịch bảo trì và chọn hợp đồng liên quan.',
        '',
        'error'
      );
      return;
    }

    const maintenanceSchedules =
      JSON.parse(localStorage.getItem('cozyhome-maintenance-schedules')) || [];
    const contracts =
      JSON.parse(localStorage.getItem('cozyhome-contracts')) || [];
    const selectedContract = contracts[contractIndex];

    const scheduleData = {
      date,
      type,
      details,
      contractPartner: selectedContract.partner,
    };

    if (scheduleIndex === '') {
      maintenanceSchedules.push(scheduleData);
      Swal.fire('Lịch bảo trì đã được tạo thành công!', '', 'success');
    } else {
      maintenanceSchedules[scheduleIndex] = scheduleData;
      Swal.fire('Lịch bảo trì đã được cập nhật!', '', 'success');
    }

    localStorage.setItem(
      'cozyhome-maintenance-schedules',
      JSON.stringify(maintenanceSchedules)
    );
    resetMaintenanceForm();
    renderMaintenanceSchedule();
  };

  // Xóa lịch bảo trì
  window.deleteMaintenance = function (index) {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn có muốn xóa lịch bảo trì này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        const maintenanceSchedules =
          JSON.parse(localStorage.getItem('cozyhome-maintenance-schedules')) ||
          [];
        maintenanceSchedules.splice(index, 1);
        localStorage.setItem(
          'cozyhome-maintenance-schedules',
          JSON.stringify(maintenanceSchedules)
        );
        Swal.fire('Đã xóa!', 'Lịch bảo trì đã được xóa.', 'success');
        renderMaintenanceSchedule();
      }
    });
  };

  // Sửa lịch bảo trì
  window.editMaintenance = function (index) {
    const maintenanceSchedules =
      JSON.parse(localStorage.getItem('cozyhome-maintenance-schedules')) || [];
    const schedule = maintenanceSchedules[index];

    document.getElementById('maintenanceDate').value = schedule.date;
    document.getElementById('maintenanceType').value = schedule.type;
    document.getElementById('maintenanceDetails').value = schedule.details;
    document.getElementById('maintenanceContract').value =
      schedule.contractIndex;
    document.getElementById('scheduleIndex').value = index;

    showCreateMaintenanceForm();
  };

  window.showCreateContractForm = function () {
    document.getElementById('createContractForm').style.display = 'block';
  };

  window.hideCreateContractForm = function () {
    resetContractForm();
    document.getElementById('createContractForm').style.display = 'none';
  };

  window.showCreateMaintenanceForm = function () {
    document.getElementById('createMaintenanceForm').style.display = 'block';
  };

  window.hideCreateMaintenanceForm = function () {
    resetMaintenanceForm();
    document.getElementById('createMaintenanceForm').style.display = 'none';
  };

  function resetContractForm() {
    document.getElementById('contractPartner').value = '';
    document.getElementById('contractTerms').value = '';
    document.getElementById('contractStartDate').value = '';
    document.getElementById('contractEndDate').value = '';
    document.getElementById('contractIndex').value = '';
  }

  function resetMaintenanceForm() {
    document.getElementById('maintenanceDate').value = '';
    document.getElementById('maintenanceType').value = '';
    document.getElementById('maintenanceDetails').value = '';
    document.getElementById('maintenanceContract').value = '';
    document.getElementById('scheduleIndex').value = '';
  }
});

window.addEventListener('popstate', function (event) {
  window.location.reload();
});

// Tìm kiếm hợp đồng bảo trì
window.searchContract = function () {
  const searchTerm = document
    .getElementById('contractSearch')
    .value.toLowerCase();
  const contracts =
    JSON.parse(localStorage.getItem('cozyhome-contracts')) || [];
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.partner.toLowerCase().includes(searchTerm) ||
      contract.terms.toLowerCase().includes(searchTerm) ||
      contract.startDate.toLowerCase().includes(searchTerm) ||
      contract.endDate.toLowerCase().includes(searchTerm)
  );
  renderFilteredContracts(filteredContracts);
};

function renderFilteredContracts(contracts) {
  const contractList = document.getElementById('contractList');
  if (contracts.length === 0) {
    contractList.innerHTML = `<tr><td colspan="5" class="no-data">Không tìm thấy hợp đồng nào.</td></tr>`;
  } else {
    contractList.innerHTML = contracts
      .map(
        (contract, index) => `
            <tr>
                <td>${contract.partner}</td>
                <td>${contract.terms}</td>
                <td>${contract.startDate}</td>
                <td>${contract.endDate}</td>
                <td>
                    <button class="cozyhome-btn cozyhome-btn-secondary" onclick="editContract(${index})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="cozyhome-btn cozyhome-btn-danger" onclick="deleteContract(${index})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `
      )
      .join('');
  }
}

// Tìm kiếm lịch bảo trì
window.searchMaintenance = function () {
  const searchTerm = document
    .getElementById('maintenanceSearch')
    .value.toLowerCase();
  const maintenanceSchedules =
    JSON.parse(localStorage.getItem('cozyhome-maintenance-schedules')) || [];
  const filteredSchedules = maintenanceSchedules.filter(
    (schedule) =>
      schedule.date.toLowerCase().includes(searchTerm) ||
      schedule.type.toLowerCase().includes(searchTerm) ||
      schedule.details.toLowerCase().includes(searchTerm) ||
      schedule.contractPartner.toLowerCase().includes(searchTerm)
  );
  renderFilteredMaintenance(filteredSchedules);
};

function renderFilteredMaintenance(schedules) {
  const scheduleList = document.getElementById('maintenanceScheduleList');
  if (schedules.length === 0) {
    scheduleList.innerHTML = `<tr><td colspan="5" class="no-data">Không tìm thấy lịch bảo trì nào.</td></tr>`;
  } else {
    scheduleList.innerHTML = schedules
      .map(
        (schedule, index) => `
            <tr>
                <td>${schedule.date}</td>
                <td>${schedule.type}</td>
                <td>${schedule.details}</td>
                <td>${schedule.contractPartner}</td>
                <td>
                    <button class="cozyhome-btn cozyhome-btn-secondary" onclick="editMaintenance(${index})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="cozyhome-btn cozyhome-btn-danger" onclick="deleteMaintenance(${index})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `
      )
      .join('');
  }
}
