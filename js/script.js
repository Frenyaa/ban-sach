// Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (currentUser) {
        // Nếu đã đăng nhập, hiện nút giỏ hàng
        if (cartIcon) {
            cartIcon.style.display = 'flex';
        }
    } else {
        // Nếu chưa đăng nhập, ẩn nút giỏ hàng
        if (cartIcon) {
            cartIcon.style.display = 'none';
        }
    }
}

// Xử lý sự kiện đăng nhập
function handleLogin(username, password) {
    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem('currentUser', username);
    // Cập nhật hiển thị giỏ hàng
    checkLoginStatus();
}

// Xử lý sự kiện đăng xuất
function handleLogout() {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('currentUser');
    // Cập nhật hiển thị giỏ hàng
    checkLoginStatus();
}

// Kiểm tra trạng thái đăng nhập khi trang web được tải
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // Thêm sự kiện click cho nút đăng nhập
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // TODO: Hiển thị form đăng nhập
            // Sau khi đăng nhập thành công, gọi handleLogin()
        });
    }

    // Thêm sự kiện click cho nút đăng ký
    const registerBtn = document.querySelector('.register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // TODO: Hiển thị form đăng ký
            // Sau khi đăng ký thành công, gọi handleLogin()
        });
    }
}); 