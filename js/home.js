// Hiển thị sách mới
function displayNewBooks() {
    const newBooksContainer = document.getElementById('newBooks');
    const newBooks = list_products.slice(-8); // Lấy 8 sách mới nhất
    
    newBooks.forEach(book => {
        const bookElement = createBookElement(book);
        newBooksContainer.appendChild(bookElement);
    });
}

// Hiển thị sách nổi bật
function displayFeaturedBooks() {
    const featuredBooksContainer = document.getElementById('featuredBooks');
    const featuredBooks = list_products.filter(book => book.rating >= 4).slice(0, 8); // Lấy 8 sách có rating cao nhất
    
    featuredBooks.forEach(book => {
        const bookElement = createBookElement(book);
        featuredBooksContainer.appendChild(bookElement);
    });
}

// Tạo element cho một cuốn sách
function createBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book-item';
    
    const discountTag = book.discount > 0 
        ? `<div class="discount-tag">-${book.discount}%</div>` 
        : '';
    
    const price = book.price;
    const discountedPrice = price * (1 - book.discount/100);
    
    const priceHtml = book.discount > 0 
        ? `<div class="book-price">
             <span class="original-price">${price.toLocaleString()}đ</span>
             <span class="discounted-price">${discountedPrice.toLocaleString()}đ</span>
           </div>`
        : `<div class="book-price">
             <span class="current-price">${price.toLocaleString()}đ</span>
           </div>`;

    bookDiv.innerHTML = `
        <div class="book-image">
            ${discountTag}
            <img src="${book.img}" alt="${book.name}">
        </div>
        <div class="book-info">
            <h3 class="book-title">${book.name}</h3>
            <p class="book-author">${book.author}</p>
            ${priceHtml}
            <div class="book-rating">
                ${'★'.repeat(book.rating)}${'☆'.repeat(5-book.rating)}
                <span class="rating-count">(${book.rating_count})</span>
            </div>
            <button class="add-to-cart" onclick="addToCart('${book.id}')">
                Thêm vào giỏ
            </button>
        </div>
    `;
    
    return bookDiv;
}

// Khởi tạo khi trang load
window.onload = function() {
    displayNewBooks();
    displayFeaturedBooks();
}; 