// Hàm định dạng giá tiền
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
}

// Hàm tạo HTML cho một cuốn sách
function createBookHTML(book) {
    return `
        <div class="book-item">
            <div class="book-image">
                <img src="${book.image}" alt="${book.title}">
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-rating">
                    <div class="stars">
                        ${createStarRating(book.rating)}
                    </div>
                    <span class="review-count">(${book.reviews} đánh giá)</span>
                </div>
                <p class="book-price">${formatPrice(book.price)}</p>
                <button class="add-to-cart" onclick="addToCart(${book.id})">
                    <i class="fa fa-shopping-cart"></i> Thêm vào giỏ
                </button>
            </div>
        </div>
    `;
}

// Hàm tạo HTML cho rating sao
function createStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fa fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fa fa-star-half-o"></i>';
        } else {
            stars += '<i class="fa fa-star-o"></i>';
        }
    }
    return stars;
}

// Hàm hiển thị sách mới
function displayNewBooks() {
    const newBooksContainer = document.getElementById('new-books');
    if (!newBooksContainer) return;

    const newBooks = books.slice(0, 4); // Lấy 4 cuốn sách đầu tiên làm sách mới
    newBooksContainer.innerHTML = newBooks.map(book => createBookHTML(book)).join('');
}

// Hàm hiển thị sách nổi bật
function displayFeaturedBooks() {
    const featuredBooksContainer = document.getElementById('featured-books');
    if (!featuredBooksContainer) return;

    const featuredBooks = books.filter(book => book.rating >= 4.7); // Lọc sách có rating >= 4.7
    featuredBooksContainer.innerHTML = featuredBooks.map(book => createBookHTML(book)).join('');
}

// Hàm thêm vào giỏ hàng
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    // Kiểm tra đăng nhập
    if (!getCurrentUser()) {
        alert('Vui lòng đăng nhập để thêm sách vào giỏ hàng!');
        showTaiKhoan(true);
        return;
    }

    // Thêm vào giỏ hàng
    themVaoGioHang(bookId, book.title);
}

// Khởi tạo khi trang web load xong
document.addEventListener('DOMContentLoaded', function() {
    displayNewBooks();
    displayFeaturedBooks();
}); 