const list_books = [
    {
        "id": "book1",
        "name": "Đắc Nhân Tâm",
        "author": "Dale Carnegie",
        "price": "88000",
        "img": "img/books/dac-nhan-tam.jpg",
        "publisher": "NXB Tổng hợp TPHCM",
        "category": "Kỹ năng sống",
        "rating": 5,
        "rateCount": 100,
        "description": "Đắc nhân tâm của Dale Carnegie là quyển sách của mọi thời đại và một hiện tượng đáng kinh ngạc trong ngành xuất bản Hoa Kỳ.",
        "promo": {
            "name": "giamgia",
            "value": "20"
        }
    },
    {
        "id": "book2",
        "name": "Nhà Giả Kim",
        "author": "Paulo Coelho",
        "price": "69000",
        "img": "img/books/nha-gia-kim.jpg",
        "publisher": "NXB Văn Học",
        "category": "Văn học",
        "rating": 5,
        "rateCount": 90,
        "description": "Tất cả những trải nghiệm trong chuyến phiêu du theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc.",
        "promo": {
            "name": "moiramat",
            "value": "0"
        }
    },
    {
        "id": "book3",
        "name": "Cây Cam Ngọt Của Tôi",
        "author": "José Mauro de Vasconcelos",
        "price": "108000",
        "img": "img/books/cay-cam-ngot-cua-toi.jpg",
        "publisher": "NXB Hội Nhà Văn",
        "category": "Văn học",
        "rating": 4,
        "rateCount": 80,
        "description": "Mở đầu bằng những thanh âm trong sáng và kết thúc lắng lại trong những nốt trầm hoài niệm, Cây Cam Ngọt Của Tôi là một bản nhạc đẹp về tình yêu thương.",
        "promo": {
            "name": "giamgia",
            "value": "15"
        }
    },
    {
        "id": "book4",
        "name": "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        "author": "Rosie Nguyễn",
        "price": "75000",
        "img": "img/books/tuoi-tre-dang-gia-bao-nhieu.jpg",
        "publisher": "NXB Trẻ",
        "category": "Kỹ năng sống",
        "rating": 4,
        "rateCount": 70,
        "description": "Tuổi trẻ đáng giá bao nhiêu? là tác phẩm đầu tay của tác giả Rosie Nguyễn, một cô gái trẻ đã dành phần lớn tuổi đôi mươi của mình để đi đây đi đó, làm nhiều công việc khác nhau.",
        "promo": {
            "name": "giareonline",
            "value": "10"
        }
    },
    {
        "id": "book5",
        "name": "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
        "author": "Nguyễn Nhật Ánh",
        "price": "125000",
        "img": "img/books/toi-thay-hoa-vang-tren-co-xanh.jpg",
        "publisher": "NXB Trẻ",
        "category": "Văn học",
        "rating": 5,
        "rateCount": 85,
        "description": "Tôi thấy hoa vàng trên cỏ xanh là một tác phẩm đặc sắc của nhà văn Nguyễn Nhật Ánh, với những câu chuyện nhỏ xoay quanh cuộc sống của những đứa trẻ ở một vùng quê nghèo.",
        "promo": {
            "name": "giamgia",
            "value": "25"
        }
    }
];

// Thêm các sách mới
const new_books = list_books.filter(book => book.promo.name === 'moiramat');

// Thêm các sách nổi bật
const featured_books = list_books.filter(book => book.rating >= 4.5);

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