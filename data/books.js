const books = [
    {
        id: 1,
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        price: 79000,
        image: "img/books/nha-gia-kim.jpg",
        category: "Văn học",
        description: "Tiểu thuyết Nhà Giả Kim của Paulo Coelho như một câu chuyện cổ tích giản dị, nhân ái, giàu chất thơ, thấm đẫm những minh triết huyền bí của phương Đông.",
        rating: 4.8,
        reviews: 1250
    },
    {
        id: 2,
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        price: 89000,
        image: "img/books/dac-nhan-tam.jpg",
        category: "Kỹ năng sống",
        description: "Đắc Nhân Tâm là cuốn sách nổi tiếng nhất, bán chạy nhất và có tầm ảnh hưởng nhất của mọi thời đại.",
        rating: 4.7,
        reviews: 980
    },
    {
        id: 3,
        title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
        author: "Nguyễn Nhật Ánh",
        price: 99000,
        image: "img/books/toi-thay-hoa-vang.jpg",
        category: "Văn học",
        description: "Một tác phẩm đặc sắc của nhà văn chuyên viết cho thanh thiếu niên Nguyễn Nhật Ánh.",
        rating: 4.9,
        reviews: 1500
    },
    {
        id: 4,
        title: "Nhà Lãnh Đạo Không Chức Danh",
        author: "Robin Sharma",
        price: 119000,
        image: "img/books/nha-lanh-dao.jpg",
        category: "Kinh tế",
        description: "Cuốn sách bán chạy nhất về phát triển bản thân và lãnh đạo.",
        rating: 4.6,
        reviews: 850
    },
    {
        id: 5,
        title: "Số Đỏ",
        author: "Vũ Trọng Phụng",
        price: 69000,
        image: "img/books/so-do.jpg",
        category: "Văn học",
        description: "Một trong những tác phẩm văn học hiện thực phê phán xuất sắc nhất của văn học Việt Nam.",
        rating: 4.8,
        reviews: 1100
    },
    {
        id: 6,
        title: "Đọc Vị Bất Kỳ Ai",
        author: "David J.Lieberman",
        price: 89000,
        image: "img/books/doc-vi-bat-ky-ai.jpg",
        category: "Kỹ năng sống",
        description: "Cuốn sách giúp bạn hiểu rõ về bản thân và những người xung quanh.",
        rating: 4.5,
        reviews: 750
    }
];

// Thêm các sách mới
const new_books = books.filter(book => book.promo.name === 'moiramat');

// Thêm các sách nổi bật
const featured_books = books.filter(book => book.rating >= 4.5);

// Hàm hiển thị sách
function displayBook(book) {
    return `
    <div class="book-item">
        <div class="book-image">
            <img src="${book.img}" alt="${book.name}">
            ${book.promo.name === 'giamgia' ? 
                `<div class="discount-tag">-${book.promo.value}%</div>` : ''}
        </div>
        <div class="book-info">
            <h3>${book.name}</h3>
            <p class="author">${book.author}</p>
            <div class="price">
                ${book.promo.name === 'giamgia' ? 
                    `<span class="original-price">${numberWithCommas(book.price)}đ</span>
                     <span class="discounted-price">${numberWithCommas(calculateDiscountedPrice(book.price, book.promo.value))}đ</span>` :
                    `<span class="normal-price">${numberWithCommas(book.price)}đ</span>`}
            </div>
            <div class="rating">
                ${'★'.repeat(book.rating)}${'☆'.repeat(5-book.rating)}
                <span class="rating-count">(${book.rateCount})</span>
            </div>
        </div>
        <div class="book-actions">
            <button onclick="themVaoGioHang('${book.id}', '${book.name}')" class="add-to-cart">
                <i class="fa fa-shopping-cart"></i> Thêm vào giỏ
            </button>
        </div>
    </div>`;
}

// Hàm hỗ trợ format số
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Hàm tính giá sau khi giảm
function calculateDiscountedPrice(price, discount) {
    return Math.round(price * (100 - discount) / 100);
}

// Hiển thị sách mới
function displayNewBooks() {
    const container = document.querySelector('.new-books .book-grid');
    if (container) {
        container.innerHTML = new_books.map(book => displayBook(book)).join('');
    }
}

// Hiển thị sách nổi bật
function displayFeaturedBooks() {
    const container = document.querySelector('.featured-books .book-grid');
    if (container) {
        container.innerHTML = featured_books.map(book => displayBook(book)).join('');
    }
}

// Khởi tạo hiển thị
window.addEventListener('DOMContentLoaded', () => {
    displayNewBooks();
    displayFeaturedBooks();
}); 