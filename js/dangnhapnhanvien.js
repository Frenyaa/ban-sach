// Danh sách tài khoản nhân viên mặc định
const defaultStaff = [
    {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Admin'
    },
    {
        username: 'staff1',
        password: 'staff123',
        role: 'staff',
        name: 'Nhân viên 1'
    }
];

// Khởi tạo danh sách nhân viên nếu chưa có
if (!localStorage.getItem('staffList')) {
    localStorage.setItem('staffList', JSON.stringify(defaultStaff));
}

// Hàm xử lý đăng nhập
function logIn(form) {
    event.preventDefault();
    
    const username = form.username.value.trim();
    const password = form.pass.value;
    
    // Kiểm tra thông tin đăng nhập
    const staffList = JSON.parse(localStorage.getItem('staffList')) || [];
    const staff = staffList.find(s => s.username === username && s.password === password);
    
    if (staff) {
        // Lưu thông tin đăng nhập
        localStorage.setItem('staff', JSON.stringify(staff));
        
        // Chuyển hướng dựa vào role
        if (staff.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'quanlynhanvien.html';
        }
    } else {
        // Hiển thị thông báo lỗi
        showError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
    
    return false;
}

// Hàm hiển thị thông báo lỗi
function showError(message) {
    // Xóa thông báo lỗi cũ nếu có
    const oldError = document.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    // Tạo và hiển thị thông báo lỗi mới
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    
    const form = document.getElementById('loginForm');
    form.appendChild(error);
}

// Kiểm tra nếu đã đăng nhập thì chuyển hướng
window.onload = function() {
    const staff = JSON.parse(localStorage.getItem('staff'));
    if (staff) {
        if (staff.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'quanlynhanvien.html';
        }
    }
}; 