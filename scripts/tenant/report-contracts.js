document.addEventListener("DOMContentLoaded", function() {
    loadRoomMembers();
    loadContracts();
});

// Dữ liệu mẫu cho danh sách thành viên trong phòng
const membersData = [
    { name: 'Nguyễn Văn A', phone: '0123456789', email: 'vana@example.com' },
    { name: 'Trần Thị B', phone: '0987654321', email: 'thib@example.com' },
    { name: 'Lê Văn C', phone: '0932123456', email: 'vanc@example.com' }
];

// Dữ liệu mẫu cho danh sách hợp đồng
const contractsData = [
    { contractNumber: 'HĐ001', signDate: '2023-01-01', expiryDate: '2024-01-01', status: 'Còn hiệu lực' },
    { contractNumber: 'HĐ002', signDate: '2022-06-01', expiryDate: '2023-06-01', status: 'Hết hạn' },
    { contractNumber: 'HĐ003', signDate: '2023-05-15', expiryDate: '2024-05-15', status: 'Còn hiệu lực' }
];

// Hàm để tải danh sách thành viên trong phòng
function loadRoomMembers() {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = '';

    membersData.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.phone}</td>
            <td>${member.email}</td>
        `;
        membersList.appendChild(row);
    });
}

// Hàm để tải danh sách hợp đồng
function loadContracts() {
    const contractsList = document.getElementById('contracts-list');
    contractsList.innerHTML = '';

    contractsData.forEach(contract => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contract.contractNumber}</td>
            <td>${contract.signDate}</td>
            <td>${contract.expiryDate}</td>
            <td>${contract.status}</td>
        `;
        contractsList.appendChild(row);
    });
}

// Hàm để gửi báo cáo hư hỏng tài sản hoặc vấn đề
function submitReport() {
    const description = document.getElementById('reportDescription').value.trim();
    const reportType = document.getElementById('reportType').value;

    if (description === '') {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng nhập mô tả vấn đề!'
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Báo cáo thành công!',
        text: 'Báo cáo của bạn đã được gửi.'
    });

    // Reset form sau khi báo cáo thành công
    document.getElementById('damage-report-form').reset();
}
