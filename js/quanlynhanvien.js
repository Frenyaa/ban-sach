// Lưu trữ dữ liệu sách và đơn hàng
let books = JSON.parse(localStorage.getItem('books')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Kiểm tra đăng nhập
window.onload = function() {
    const staff = JSON.parse(localStorage.getItem('staff'));
    if (!staff) {
        window.location.href = 'dangnhapnhanvien.html';
        return;
    }
    
    // Hiển thị tên nhân viên
    document.getElementById('tenNhanVien').textContent = staff.name;
    
    // Load dữ liệu cho tab hiện tại
    const currentTab = localStorage.getItem('currentTab') || 'donhang';
    showTab(currentTab);
};

// Chuyển đổi tab
function showTab(tabName) {
    // Lưu tab hiện tại
    localStorage.setItem('currentTab', tabName);
    
    // Ẩn tất cả các tab
    const tabs = document.getElementsByClassName('tab-panel');
    for (let tab of tabs) {
        tab.classList.remove('active');
    }
    
    // Hiển thị tab được chọn
    document.getElementById(tabName).classList.add('active');
    
    // Load dữ liệu cho tab
    switch(tabName) {
        case 'donhang':
            loadDonHang();
            break;
        case 'sanpham':
            loadSanPham();
            break;
        case 'khachhang':
            loadKhachHang();
            break;
    }
}

// Xử lý đăng xuất
function logOutStaff() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('staff');
        window.location.href = 'dangnhapnhanvien.html';
    }
}

// Quản lý sách
function loadSanPham() {
    const bookList = document.getElementById('bookList');
    const books = JSON.parse(localStorage.getItem('books')) || [];
    
    let html = '';
    books.forEach((book, index) => {
        html += `
            <tr>
                <td><img src="${book.img}" alt="${book.name}" style="width: 50px; height: 75px; object-fit: cover;"></td>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.price.toLocaleString()}đ</td>
                <td>${book.quantity}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-button" onclick="editBook(${index})" title="Sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-button" onclick="deleteBook(${index})" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    bookList.innerHTML = html;
}

function showAddBookForm() {
    const modal = document.getElementById('bookForm');
    modal.style.display = 'block';
    
    // Reset form
    document.getElementById('addBookForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
}

// Hiển thị preview ảnh khi chọn file
document.querySelector('input[name="image"]').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
});

function saveBook(form) {
    event.preventDefault();
    
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const newBook = {
        id: Date.now().toString(),
        name: form.name.value,
        author: form.author.value,
        price: Number(form.price.value),
        quantity: Number(form.quantity.value),
        category: form.category.value,
        publisher: form.publisher.value,
        publishYear: form.publishYear.value,
        description: form.description.value,
        img: form.image.files[0] ? URL.createObjectURL(form.image.files[0]) : 'img/default-book.jpg',
        dateAdded: new Date().toISOString()
    };
    
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
    
    // Đóng form và reload danh sách
    document.getElementById('bookForm').style.display = 'none';
    loadSanPham();
    
    // Hiển thị thông báo thành công
    alert('Thêm sách thành công!');
    return false;
}

function editBook(index) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books[index];
    const form = document.getElementById('addBookForm');
    
    // Điền thông tin sách vào form
    form.name.value = book.name;
    form.author.value = book.author;
    form.price.value = book.price;
    form.quantity.value = book.quantity;
    form.category.value = book.category || '';
    form.publisher.value = book.publisher || '';
    form.publishYear.value = book.publishYear || '';
    form.description.value = book.description || '';
    
    // Hiển thị ảnh preview nếu có
    const preview = document.getElementById('imagePreview');
    if (book.img && book.img !== 'img/default-book.jpg') {
        preview.src = book.img;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
    
    // Lưu index sách đang sửa vào form
    form.dataset.editIndex = index;
    
    // Hiển thị modal
    document.getElementById('bookForm').style.display = 'block';
}

function deleteBook(index) {
    if (confirm('Bạn có chắc muốn xóa sách này?')) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
        loadSanPham();
    }
}

// Quản lý khách hàng
function loadKhachHang() {
    const customerList = document.getElementById('customerList');
    const users = JSON.parse(localStorage.getItem('ListUser')) || [];
    
    let html = '';
    users.forEach((user, index) => {
        const totalOrders = user.donhang ? user.donhang.length : 0;
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.ho} ${user.ten}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'Chưa cập nhật'}</td>
                <td>${totalOrders}</td>
                <td>
                    <span class="status-badge ${user.off ? 'status-inactive' : 'status-active'}">
                        ${user.off ? 'Đã khóa' : 'Đang hoạt động'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="view-button" onclick="viewCustomerDetails(${index})" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="toggle-button" onclick="toggleCustomerStatus(${index})" title="${user.off ? 'Mở khóa' : 'Khóa'} tài khoản">
                            <i class="fas ${user.off ? 'fa-lock-open' : 'fa-lock'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    customerList.innerHTML = html;
}

function toggleCustomerStatus(index) {
    const users = JSON.parse(localStorage.getItem('ListUser')) || [];
    const user = users[index];
    
    if (confirm(`Bạn có chắc muốn ${user.off ? 'mở khóa' : 'khóa'} tài khoản này?`)) {
        user.off = !user.off;
        localStorage.setItem('ListUser', JSON.stringify(users));
        loadKhachHang();
        alert(`Đã ${user.off ? 'khóa' : 'mở khóa'} tài khoản ${user.username} thành công!`);
    }
}

function viewCustomerDetails(index) {
    const users = JSON.parse(localStorage.getItem('ListUser')) || [];
    const user = users[index];
    
    let orderDetails = '';
    if (user.donhang && user.donhang.length > 0) {
        orderDetails = '\n\nLịch sử đơn hàng:\n';
        user.donhang.forEach((order, i) => {
            orderDetails += `\nĐơn hàng ${i + 1}:`;
            orderDetails += `\nNgày mua: ${new Date(order.ngaymua).toLocaleString()}`;
            orderDetails += `\nTrạng thái: ${order.tinhTrang}`;
            orderDetails += `\nSản phẩm:`;
            order.sp.forEach(item => {
                const product = timKiemTheoMa(list_products, item.ma);
                if (product) {
                    orderDetails += `\n- ${product.name} (SL: ${item.soluong})`;
                }
            });
            orderDetails += '\n';
        });
    }
    
    alert(
        `Thông tin chi tiết khách hàng:
        
Họ và tên: ${user.ho} ${user.ten}
Email: ${user.email}
Số điện thoại: ${user.phone || 'Chưa cập nhật'}
Tài khoản: ${user.username}
Tổng số đơn hàng: ${user.donhang ? user.donhang.length : 0}
Trạng thái: ${user.off ? 'Đã khóa' : 'Đang hoạt động'}${orderDetails}`
    );
}

function searchCustomers() {
    const searchTerm = document.getElementById('searchCustomer').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('ListUser')) || [];
    
    const filteredUsers = users.filter(user => 
        `${user.ho} ${user.ten}`.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)
    );
    
    let html = '';
    filteredUsers.forEach((user, index) => {
        const totalOrders = user.donhang ? user.donhang.length : 0;
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.ho} ${user.ten}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'Chưa cập nhật'}</td>
                <td>${totalOrders}</td>
                <td>
                    <span class="status-badge ${user.off ? 'status-inactive' : 'status-active'}">
                        ${user.off ? 'Đã khóa' : 'Đang hoạt động'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="view-button" onclick="viewCustomerDetails(${index})" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="toggle-button" onclick="toggleCustomerStatus(${index})" title="${user.off ? 'Mở khóa' : 'Khóa'} tài khoản">
                            <i class="fas ${user.off ? 'fa-lock-open' : 'fa-lock'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    document.getElementById('customerList').innerHTML = html;
}

// Tìm kiếm
function searchBooks() {
    const searchTerm = document.getElementById('searchBook').value.toLowerCase();
    const books = JSON.parse(localStorage.getItem('books')) || [];
    
    const filteredBooks = books.filter(book => 
        book.name.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm)
    );
    
    let html = '';
    filteredBooks.forEach((book, index) => {
        html += `
            <tr>
                <td><img src="${book.img}" alt="${book.name}" style="width: 50px; height: 75px; object-fit: cover;"></td>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.price.toLocaleString()}đ</td>
                <td>${book.quantity}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-button" onclick="editBook(${index})" title="Sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-button" onclick="deleteBook(${index})" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    document.getElementById('bookList').innerHTML = html;
}

// Đóng modal khi click vào nút close
document.querySelector('.close').onclick = function() {
    document.getElementById('bookForm').style.display = 'none';
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modal = document.getElementById('bookForm');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Tải danh sách đơn hàng
function loadOrders() {
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';

    orders.forEach(order => {
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.date}</td>
                <td>${order.total} VNĐ</td>
                <td>${order.status}</td>
                <td>
                    <button class="btn btn-primary" onclick="viewOrder(${order.id})">Xem</button>
                    <button class="btn btn-success" onclick="updateOrderStatus(${order.id})">Cập nhật trạng thái</button>
                </td>
            </tr>
        `;
        orderList.innerHTML += row;
    });
}

// Xem chi tiết đơn hàng
function viewOrder(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    let orderDetails = `
        <h3>Chi tiết đơn hàng #${order.id}</h3>
        <p>Khách hàng: ${order.customerName}</p>
        <p>Ngày đặt: ${order.date}</p>
        <p>Tổng tiền: ${order.total} VNĐ</p>
        <p>Trạng thái: ${order.status}</p>
        <h4>Sản phẩm:</h4>
        <ul>
    `;

    order.items.forEach(item => {
        orderDetails += `<li>${item.name} - ${item.quantity} x ${item.price} VNĐ</li>`;
    });

    orderDetails += `
        </ul>
        <button class="btn btn-primary" onclick="loadOrders()">Quay lại</button>
    `;

    document.getElementById('orders').innerHTML = orderDetails;
}

// Cập nhật trạng thái đơn hàng
function updateOrderStatus(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    const newStatus = prompt('Nhập trạng thái mới:', order.status);
    if (newStatus) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
    }
}

// Hàm load dữ liệu đơn hàng
function loadDonHang() {
    const donhangPanel = document.getElementById('donhang');
    const orders = getListOrders();
    
    let html = `
        <h2>Quản lý đơn hàng</h2>
        <table class="table-donhang">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (orders && orders.length > 0) {
        orders.forEach((order, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${order.sanpham}</td>
                    <td>${order.gia}</td>
                    <td>${order.soluong}</td>
                    <td>${order.thanhtien}</td>
                    <td>${order.thoigian}</td>
                    <td>${order.trangthai || 'Đang chờ xử lý'}</td>
                    <td>
                        ${order.trangthai ? '' : 
                        `<button onclick="xuLyDonHang(${index})" class="btn-xuly">
                            Xử lý đơn hàng
                        </button>`
                        }
                    </td>
                </tr>
            `;
        });
    } else {
        html += `
            <tr>
                <td colspan="8">Không có đơn hàng nào</td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    `;

    donhangPanel.innerHTML = html;
}

// Hàm xử lý đơn hàng
function xuLyDonHang(index) {
    const orders = getListOrders();
    if (orders && orders[index]) {
        if (confirm('Xác nhận xử lý đơn hàng này?')) {
            orders[index].trangthai = 'Đã xử lý';
            setListOrders(orders);
            loadDonHang(); // Tải lại danh sách đơn hàng
            alert('Đã xử lý đơn hàng thành công!');
        }
    }
}

// Hàm lấy danh sách đơn hàng từ localStorage
function getListOrders() {
    return JSON.parse(localStorage.getItem('ListOrders')) || [];
}

// Hàm lưu danh sách đơn hàng vào localStorage
function setListOrders(orders) {
    localStorage.setItem('ListOrders', JSON.stringify(orders));
}

// Hàm load dữ liệu khách hàng
function loadKhachHang() {
    const khachhangPanel = document.getElementById('khachhang');
    // TODO: Load dữ liệu khách hàng từ localStorage hoặc API
} 