document.addEventListener("DOMContentLoaded", function() {
    loadContracts();
});

// Hàm để tải danh sách hợp đồng từ localStorage
function loadContracts() {
    const contracts = JSON.parse(localStorage.getItem("cozyhome-contracts")) || [];
    displayContracts(contracts);
}

// Hàm để hiển thị danh sách hợp đồng
function displayContracts(contracts) {
    const contractsContainer = document.getElementById("contracts-container");
    contractsContainer.innerHTML = '';

    if (contracts.length === 0) {
        contractsContainer.innerHTML = '<p>Không có hợp đồng thuê phòng nào.</p>';
        return;
    }

    contracts.forEach(contract => {
        const contractElement = document.createElement('div');
        contractElement.classList.add('contract-item');
        contractElement.innerHTML = `
            <p><strong>Phòng:</strong> ${contract.room}</p>
            <p><strong>Người thuê:</strong> ${contract.tenantName}</p>
            <p><strong>Ngày bắt đầu:</strong> ${contract.startDate}</p>
            <p><strong>Ngày hết hạn:</strong> ${contract.endDate}</p>
            <p><strong>Số hợp đồng:</strong> ${contract.contractNumber}</p>
        `;
        contractsContainer.appendChild(contractElement);
    });
}

// Hàm để lọc hợp đồng theo phòng và ngày hết hạn
function filterContracts() {
    const filterRoom = document.getElementById("filterRoom").value.trim();
    const filterDate = document.getElementById("filterDate").value;

    const contracts = JSON.parse(localStorage.getItem("cozyhome-contracts")) || [];
    let filteredContracts = contracts;

    // Lọc theo phòng
    if (filterRoom) {
        filteredContracts = filteredContracts.filter(contract => contract.room === filterRoom);
    }

    // Lọc theo ngày hết hạn
    if (filterDate) {
        filteredContracts = filteredContracts.filter(contract => contract.endDate === filterDate);
    }

    displayContracts(filteredContracts);
}

const sampleContracts = [
    {
        tenantName: "Nguyễn Thị Hồng",
        house: "Nhà A",
        room: "1",
        contractNumber: "111222333",
        startDate: "2024-10-01",
        endDate: "2024-10-31"
    },
    {
        tenantName: "Nguyễn Thúy Hằng",
        house: "Nhà A",
        room: "2",
        contractNumber: "221144",
        startDate: "2024-10-01",
        endDate: "2024-11-01"
    },
    {
        tenantName: "Trần Văn B",
        house: "Nhà B",
        room: "3",
        contractNumber: "333555",
        startDate: "2024-09-01",
        endDate: "2024-12-01"
    }
];

localStorage.setItem("cozyhome-contracts", JSON.stringify(sampleContracts));
