// Lưu trữ dữ liệu sách và đơn hàng
let books = JSON.parse(localStorage.getItem('books')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Hiển thị form thêm sách mới
function showAddBookForm() {
    const form = `
        <div class="form-group">
            <label>Tên sách:</label>
            <input type="text" id="bookName" required>
        </div>
        <div class="form-group">
            <label>Giá:</label>
            <input type="number" id="bookPrice" required>
        </div>
        <div class="form-group">
            <label>Số lượng:</label>
            <input type="number" id="bookQuantity" required>
        </div>
        <div class="form-group">
            <label>Hình ảnh:</label>
            <input type="text" id="bookImage" placeholder="URL hình ảnh">
        </div>
        <div class="form-group">
            <label>Mô tả:</label>
            <textarea id="bookDescription" rows="4"></textarea>
        </div>
        <button class="btn btn-primary" onclick="addBook()">Thêm sách</button>
        <button class="btn btn-danger" onclick="cancelAddBook()">Hủy</button>
    `;
    
    document.getElementById('books').innerHTML = form;
}

// Hủy thêm sách
function cancelAddBook() {
    loadBooks();
}

// Thêm sách mới
function addBook() {
    const bookName = document.getElementById('bookName').value;
    const bookPrice = document.getElementById('bookPrice').value;
    const bookQuantity = document.getElementById('bookQuantity').value;
    const bookImage = document.getElementById('bookImage').value;
    const bookDescription = document.getElementById('bookDescription').value;

    if (!bookName || !bookPrice || !bookQuantity) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
    }

    const newBook = {
        id: Date.now(),
        name: bookName,
        price: bookPrice,
        quantity: bookQuantity,
        image: bookImage,
        description: bookDescription
    };

    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
    loadBooks();
}

// Tải danh sách sách
function loadBooks() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    books.forEach(book => {
        const row = `
            <tr>
                <td>${book.id}</td>
                <td>${book.name}</td>
                <td>${book.price} VNĐ</td>
                <td>${book.quantity}</td>
                <td>
                    <button class="btn btn-primary" onclick="editBook(${book.id})">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteBook(${book.id})">Xóa</button>
                </td>
            </tr>
        `;
        bookList.innerHTML += row;
    });
}

// Sửa thông tin sách
function editBook(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    const form = `
        <div class="form-group">
            <label>Tên sách:</label>
            <input type="text" id="editBookName" value="${book.name}" required>
        </div>
        <div class="form-group">
            <label>Giá:</label>
            <input type="number" id="editBookPrice" value="${book.price}" required>
        </div>
        <div class="form-group">
            <label>Số lượng:</label>
            <input type="number" id="editBookQuantity" value="${book.quantity}" required>
        </div>
        <div class="form-group">
            <label>Hình ảnh:</label>
            <input type="text" id="editBookImage" value="${book.image || ''}">
        </div>
        <div class="form-group">
            <label>Mô tả:</label>
            <textarea id="editBookDescription" rows="4">${book.description || ''}</textarea>
        </div>
        <button class="btn btn-primary" onclick="saveEditBook(${id})">Lưu</button>
        <button class="btn btn-danger" onclick="cancelEditBook()">Hủy</button>
    `;
    
    document.getElementById('books').innerHTML = form;
}

// Lưu thông tin sách đã sửa
function saveEditBook(id) {
    const bookIndex = books.findIndex(b => b.id === id);
    if (bookIndex === -1) return;

    books[bookIndex] = {
        ...books[bookIndex],
        name: document.getElementById('editBookName').value,
        price: document.getElementById('editBookPrice').value,
        quantity: document.getElementById('editBookQuantity').value,
        image: document.getElementById('editBookImage').value,
        description: document.getElementById('editBookDescription').value
    };

    localStorage.setItem('books', JSON.stringify(books));
    loadBooks();
}

// Hủy sửa sách
function cancelEditBook() {
    loadBooks();
}

// Xóa sách
function deleteBook(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
        books = books.filter(book => book.id !== id);
        localStorage.setItem('books', JSON.stringify(books));
        loadBooks();
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