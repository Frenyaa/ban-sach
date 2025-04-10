document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Kiểm tra thông tin đăng nhập
        if (username === 'admin' && password === 'admin123') {
            // Lưu thông tin đăng nhập vào localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);

            // Chuyển hướng đến trang quản lý
            window.location.href = 'quanly.html';
        } else {
            alert('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
    });
}); 