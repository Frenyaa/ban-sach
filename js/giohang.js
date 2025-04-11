var currentuser; // user hiện tại, biến toàn cục
window.onload = function () {
    khoiTao();

	// autocomplete cho khung tim kiem
	autocomplete(document.getElementById('search-box'), list_products);

	// thêm tags (từ khóa) vào khung tìm kiếm
	// var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
	// for (var t of tags) addTags(t, "index.html?search=" + t)

	currentuser = getCurrentUser();
	addProductToTable(currentuser);

	updateTotal();
}

function addProductToTable(user) {
	var table = document.getElementsByClassName('listSanPham')[0];

	var s = `
		<tbody>
			<tr>
				<th>STT</th>
				<th>Sản phẩm</th>
				<th>Giá</th>
				<th>Số lượng</th>
				<th>Thành tiền</th>
				<th>Thời gian</th>
				<th>Xóa</th>
			</tr>`;

	if (!user) {
		s += `
			<tr>
				<td colspan="7"> 
					<h1 style="color:red; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
						Bạn chưa đăng nhập !!
					</h1> 
				</td>
			</tr>
		`;
		table.innerHTML = s;
		return;
	} else if (user.products.length == 0) {
		s += `
			<tr>
				<td colspan="7"> 
					<h1 style="color:green; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
						Giỏ hàng trống !!
					</h1> 
				</td>
			</tr>
		`;
		table.innerHTML = s;
		return;
	}

	var totalPrice = 0;
	for (var i = 0; i < user.products.length; i++) {
		var masp = user.products[i].ma;
		var soluongSp = user.products[i].soluong;
		var p = timKiemTheoMa(list_products, masp);
		var price = (p.promo.name == 'giareonline' ? p.promo.value : p.price);
		var thoigian = new Date(user.products[i].date).toLocaleString();
		var thanhtien = stringToNum(price) * soluongSp;

		s += `
			<tr>
				<td>` + (i + 1) + `</td>
				<td class="noPadding imgHide">
					<a target="_blank" href="chitietsanpham.html?` + p.name.split(' ').join('-') + `" title="Xem chi tiết">
						` + p.name + `
						<img src="` + p.img + `">
					</a>
				</td>
				<td class="alignRight">` + price + ` ₫</td>
				<td class="soluong" >
					<button onclick="giamSoLuong('` + masp + `')"><i class="fa fa-minus"></i></button>
					<input size="1" onchange="capNhatSoLuongFromInput(this, '` + masp + `')" value=` + soluongSp + `>
					<button onclick="tangSoLuong('` + masp + `')"><i class="fa fa-plus"></i></button>
				</td>
				<td class="alignRight">` + numToString(thanhtien) + ` ₫</td>
				<td style="text-align: center" >` + thoigian + `</td>
				<td class="noPadding"> <i class="fa fa-trash" onclick="xoaSanPhamTrongGioHang(` + i + `)"></i> </td>
			</tr>
		`;
		// Chú ý nháy cho đúng ở giamsoluong, tangsoluong
		totalPrice += thanhtien;
	}

	s += `
			<tr style="font-weight:bold; text-align:center">
				<td colspan="5">TỔNG TIỀN: </td>
				<td class="alignRight">` + numToString(totalPrice) + ` ₫</td>
				<td class="xoaHet" onclick="xoaHet()"> Xóa hết </td>
			</tr>
		</tbody>
	`;

	table.innerHTML = s;
	
	// Cập nhật tổng tiền ở phần summary
	document.getElementById('totalAmount').innerHTML = numToString(totalPrice);
}

function xoaSanPhamTrongGioHang(i) {
	if (window.confirm('Xác nhận hủy mua')) {
		currentuser.products.splice(i, 1);
		capNhatMoiThu();
	}
}

function thanhToan() {
    var c_user = getCurrentUser();
    if(!c_user) {
        alert('Bạn cần đăng nhập để thanh toán!');
        showTaiKhoan(true);
        return;
    }
    
    if(c_user.off) {
        alert('Tài khoản của bạn hiện đang bị khóa nên không thể mua hàng!');
        addAlertBox('Tài khoản của bạn đã bị khóa bởi Admin.', '#aa0000', '#fff', 10000);
        return;
    }
    
    if (!currentuser.products.length) {
        addAlertBox('Không có mặt hàng nào cần thanh toán!', '#ffb400', '#fff', 2000);
        return;
    }

    // Chuyển thông tin giỏ hàng sang định dạng phù hợp cho trang thanh toán
    var cartItems = currentuser.products.map(function(product) {
        var p = timKiemTheoMa(list_products, product.ma);
        return {
            ma: product.ma,
            name: p.name,
            price: p.promo.name == 'giareonline' ? p.promo.value : p.price,
            quantity: product.soluong,
            img: p.img
        };
    });

    // Lưu thông tin giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Chuyển hướng đến trang thanh toán
    window.location.href = 'thanhtoan.html';
}

function xoaHet() {
	if (currentuser.products.length) {
		if (window.confirm('Bạn có chắc chắn muốn xóa hết sản phẩm trong giỏ !!')) {
			currentuser.products = [];
			capNhatMoiThu();
		}
	}
}

// Cập nhật số lượng lúc nhập số lượng vào input
function capNhatSoLuongFromInput(inp, masp) {
	var soLuongMoi = Number(inp.value);
	if (!soLuongMoi || soLuongMoi <= 0) soLuongMoi = 1;

	for (var p of currentuser.products) {
		if (p.ma == masp) {
			p.soluong = soLuongMoi;
		}
	}

	capNhatMoiThu();
}

function tangSoLuong(masp) {
	for (var p of currentuser.products) {
		if (p.ma == masp) {
			p.soluong++;
		}
	}

	capNhatMoiThu();
}

function giamSoLuong(masp) {
	for (var p of currentuser.products) {
		if (p.ma == masp) {
			if (p.soluong > 1) {
				p.soluong--;
			} else {
				return;
			}
		}
	}

	capNhatMoiThu();
}

function capNhatMoiThu() { // Mọi thứ
	animateCartNumber();

	// cập nhật danh sách sản phẩm trong localstorage
	setCurrentUser(currentuser);
	updateListUser(currentuser);

	// cập nhật danh sách sản phẩm ở table
	addProductToTable(currentuser);

	// Cập nhật trên header
	capNhat_ThongTin_CurrentUser();
}

// Cập nhật tổng tiền
function updateTotal() {
    let total = 0;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    document.getElementById('totalAmount').textContent = total.toLocaleString();
}

function capNhatTongTien() {
    var tongtien = 0;
    var cartItems = document.getElementsByClassName('cart-item');
    
    for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
        var soluong = parseInt(item.getElementsByClassName('quantity')[0].value);
        var gia = item.getElementsByClassName('price')[0].innerText;
        gia = parseInt(gia.replace(/[^0-9]/g, ''));
        tongtien += soluong * gia;
    }
    
    // Cập nhật tổng tiền ở cả hai nơi
    document.getElementById('tongtien').innerText = formatNumber(tongtien) + ' ₫';
    var tongTienElement = document.querySelector('.cart-summary h3#tongtien');
    if (tongTienElement) {
        tongTienElement.innerText = formatNumber(tongtien) + ' ₫';
    }
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// Cập nhật số lượng và tổng tiền khi thay đổi số lượng
function updateQuantity(productId, change) {
    var quantityInput = document.querySelector(`.cart-item[data-id="${productId}"] .quantity`);
    var currentQuantity = parseInt(quantityInput.value);
    var newQuantity = currentQuantity + change;
    
    if (newQuantity > 0) {
        quantityInput.value = newQuantity;
        capNhatTongTien();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    var cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
    if (cartItem && confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        cartItem.remove();
        capNhatTongTien();
    }
}
