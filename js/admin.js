var TONGTIEN = 0;

window.onload = function () {
    // get data từ localstorage
    list_products = getListProducts() || list_products;
    adminInfo = getListAdmin() || adminInfo;

    addEventChangeTab();

    if (window.localStorage.getItem('admin')) {
        addTableProducts();
        addTableDonHang();
        addTableKhachHang();
        addThongKe();

        openTab('Trang Chủ')
    } else {
        document.body.innerHTML = `<h1 style="color:red; with:100%; text-align:center; margin: 50px;"> Truy cập bị từ chối.. </h1>`;
    }
}

function logOutAdmin() {
    window.localStorage.removeItem('admin');
}

function getListRandomColor(length) {
    let result = [];
    for(let i = length; i--;) {
        result.push(getRandomColor());
    }
    return result;
}

function addChart(id, chartOption) {
    var ctx = document.getElementById(id).getContext('2d');
    var chart = new Chart(ctx, chartOption);
}

function createChartConfig(
    title = 'Title',
    charType = 'bar', 
    labels = ['nothing'], 
    data = [2], 
    colors = ['red'], 
) {
    return {
        type: charType,
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: colors,
                borderColor: colors,
                // borderWidth: 2
            }]
        },
        options: {
            title: {
                fontColor: '#fff',
                fontSize: 25,
                display: true,
                text: title
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    };
}

function addThongKe() {
    var danhSachDonHang = getListDonHang();

    var thongKeNXB = {}; // Thống kê theo nhà xuất bản
    var tongDoanhThu = 0;
    var tongDonHang = 0;
    var tongSanPham = 0;

    danhSachDonHang.forEach(donHang => {
        // Không tính đơn hàng đã hủy
        if(donHang.trang_thai === 'Đã hủy') return;

        tongDonHang++;
        tongDoanhThu += Number(donHang.tong_tien);

        // Lặp qua từng sản phẩm trong đơn hàng
        donHang.san_pham.forEach(sp => {
            tongSanPham += sp.so_luong;
            let sanPham = list_products.find(p => p.masp === sp.masp);
            if (!sanPham) return;

            let tenNXB = sanPham.company;
            let soLuong = sp.so_luong;
            let thanhTien = sp.don_gia * soLuong;

            if(!thongKeNXB[tenNXB]) {
                thongKeNXB[tenNXB] = {
                    soLuongBanRa: 0,
                    doanhThu: 0,
                }
            }

            thongKeNXB[tenNXB].soLuongBanRa += soLuong;
            thongKeNXB[tenNXB].doanhThu += thanhTien;
        });
    });

    // Lấy mảng màu ngẫu nhiên cho đồ thị
    let colors = getListRandomColor(Object.keys(thongKeNXB).length);

    // Thêm thống kê
    addChart('myChart1', createChartConfig(
        'Số lượng sách bán ra theo nhà xuất bản',
        'bar',
        Object.keys(thongKeNXB),
        Object.values(thongKeNXB).map(v => v.soLuongBanRa),
        colors,
    ));

    addChart('myChart2', createChartConfig(
        'Doanh thu theo nhà xuất bản',
        'doughnut',
        Object.keys(thongKeNXB),
        Object.values(thongKeNXB).map(v => v.doanhThu),
        colors,
    ));

    // Thống kê theo trạng thái đơn hàng
    let trangThaiDonHang = {
        'Đang xử lý': 0,
        'Đang giao hàng': 0,
        'Đã giao hàng': 0,
        'Đã hủy': 0
    };

    danhSachDonHang.forEach(donHang => {
        trangThaiDonHang[donHang.trang_thai]++;
    });

    addChart('myChart3', createChartConfig(
        'Trạng thái đơn hàng',
        'pie',
        Object.keys(trangThaiDonHang),
        Object.values(trangThaiDonHang),
        getListRandomColor(4),
    ));

    // Thống kê doanh thu theo ngày
    let doanhThuTheoNgay = {};
    danhSachDonHang.forEach(donHang => {
        if (donHang.trang_thai === 'Đã hủy') return;
        
        let ngay = donHang.ngay_dat;
        if (!doanhThuTheoNgay[ngay]) {
            doanhThuTheoNgay[ngay] = 0;
        }
        doanhThuTheoNgay[ngay] += Number(donHang.tong_tien);
    });

    // Sắp xếp theo ngày
    let sortedDates = Object.keys(doanhThuTheoNgay).sort();

    addChart('myChart4', createChartConfig(
        'Doanh thu theo ngày',
        'line',
        sortedDates,
        sortedDates.map(date => doanhThuTheoNgay[date]),
        ['#4CAF50'],
    ));
}

// ======================= Các Tab =========================
function addEventChangeTab() {
    var sidebar = document.getElementsByClassName('sidebar')[0];
    var list_a = sidebar.getElementsByTagName('a');
    for(var a of list_a) {
        if(!a.onclick) {
            a.addEventListener('click', function() {
                turnOff_Active();
                this.classList.add('active');
                var tab = this.childNodes[1].data.trim()
                openTab(tab);
            })
        }
    }
}

function turnOff_Active() {
    var sidebar = document.getElementsByClassName('sidebar')[0];
    var list_a = sidebar.getElementsByTagName('a');
    for(var a of list_a) {
        a.classList.remove('active');
    }
}

function openTab(nameTab) {
    // ẩn hết
    var main = document.getElementsByClassName('main')[0].children;
    for(var e of main) {
        e.style.display = 'none';
    }

    // mở tab
    switch(nameTab) {
        case 'Trang Chủ': document.getElementsByClassName('home')[0].style.display = 'block'; break;
        case 'Sản Phẩm': document.getElementsByClassName('sanpham')[0].style.display = 'block'; break;
        case 'Đơn Hàng': document.getElementsByClassName('donhang')[0].style.display = 'block'; break;
        case 'Khách Hàng': document.getElementsByClassName('khachhang')[0].style.display = 'block'; break;
    }
}

// ========================== Sản Phẩm ========================
// Vẽ bảng danh sách sản phẩm
function addTableProducts() {
    var tc = document.getElementsByClassName('sanpham')[0].getElementsByClassName('table-content')[0];
    var s = `<table class="table-outline hideImg">`;

    for (var i = 0; i < list_products.length; i++) {
        var p = list_products[i];
        s += `<tr>
            <td style="width: 5%">` + (i+1) + `</td>
            <td style="width: 10%">` + p.masp + `</td>
            <td style="width: 40%">
                <a title="Xem chi tiết" target="_blank" href="chitietsanpham.html?` + p.name.split(' ').join('-') + `">` + p.name + `</a>
                <img src="` + p.img + `"></img>
            </td>
            <td style="width: 15%">` + p.price + `</td>
            <td style="width: 15%">` + promoToStringValue(p.promo) + `</td>
            <td style="width: 15%">
                <div class="tooltip">
                    <i class="fa fa-wrench" onclick="addKhungSuaSanPham('` + p.masp + `')"></i>
                    <span class="tooltiptext">Sửa</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-trash" onclick="xoaSanPham('` + p.masp + `', '`+p.name+`')"></i>
                    <span class="tooltiptext">Xóa</span>
                </div>
            </td>
        </tr>`;
    }

    s += `</table>`;

    tc.innerHTML = s;
}

// Tìm kiếm
function timKiemSanPham(inp) {
    var kieuTim = document.getElementsByName('kieuTimSanPham')[0].value;
    var text = inp.value;

    // Lọc
    var vitriKieuTim = {'ma':1, 'ten':2}; // mảng lưu vị trí cột

    var listTr_table = document.getElementsByClassName('sanpham')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[vitriKieuTim[kieuTim]].innerHTML.toLowerCase();

        if (td.indexOf(text.toLowerCase()) < 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = '';
        }
    }
}

// Thêm
let previewSrc; // biến toàn cục lưu file ảnh đang thêm
function layThongTinSanPhamTuTable(tr) {
    var masp = tr.children[1].innerHTML;
    var name = tr.children[2].innerHTML;
    var company = tr.children[3].innerHTML;
    var img = tr.children[4].children[0].src;
    var price = tr.children[5].innerHTML;
    var amount = tr.children[6].innerHTML;
    
    var info = {
        "tacgia": tr.children[7].innerHTML,
        "nxb": tr.children[8].innerHTML,
        "namxb": tr.children[9].innerHTML,
        "sotrang": tr.children[10].innerHTML,
        "kichthuoc": tr.children[11].innerHTML,
        "loaibia": tr.children[12].innerHTML,
        "theloai": tr.children[13].innerHTML
    }

    return {
        "masp": masp,
        "name": name,
        "company": company,
        "img": img,
        "price": price,
        "amount": amount,
        "info": info
    };
}

function themSanPhamVaoTable(p) {
    var table = document.getElementsByClassName('listSanPham')[0];

    var row = table.insertRow();
    var checkbox = row.insertCell(0);
    var masp = row.insertCell(1);
    var name = row.insertCell(2);
    var company = row.insertCell(3);
    var img = row.insertCell(4);
    var price = row.insertCell(5);
    var amount = row.insertCell(6);
    var tacgia = row.insertCell(7);
    var nxb = row.insertCell(8);
    var namxb = row.insertCell(9);
    var sotrang = row.insertCell(10);
    var kichthuoc = row.insertCell(11);
    var loaibia = row.insertCell(12);
    var theloai = row.insertCell(13);

    checkbox.innerHTML = "<input type='checkbox' onclick='changeButtonStatus()'>";
    masp.innerHTML = p.masp;
    name.innerHTML = p.name;
    company.innerHTML = p.company;
    img.innerHTML = "<img src='" + p.img + "' onclick='showImg(this.src)'>";
    price.innerHTML = p.price;
    amount.innerHTML = p.amount;
    tacgia.innerHTML = p.info.tacgia;
    nxb.innerHTML = p.info.nxb;
    namxb.innerHTML = p.info.namxb;
    sotrang.innerHTML = p.info.sotrang;
    kichthuoc.innerHTML = p.info.kichthuoc;
    loaibia.innerHTML = p.info.loaibia;
    theloai.innerHTML = p.info.theloai;
}

function themSanPham() {
    var newSp = layThongTinSanPhamTuForm();
    if (!newSp) return;

    // Them san pham vao danh sach
    list_products.push(newSp);

    // Them san pham vao table
    themSanPhamVaoTable(newSp);

    // Reset form
    document.getElementById('khungThemSanPham').style.transform = 'scale(0)';
    document.getElementById('khungThemSanPham').style.opacity = '0';
}

function layThongTinSanPhamTuForm() {
    var masp = document.getElementsByName('masp')[0].value;
    var name = document.getElementsByName('name')[0].value;
    var company = document.getElementsByName('company')[0].value;
    var img = document.getElementsByName('img')[0].value;
    var price = document.getElementsByName('price')[0].value;
    var amount = document.getElementsByName('amount')[0].value;

    var info = {
        "tacgia": document.getElementsByName('tacgia')[0].value,
        "nxb": document.getElementsByName('nxb')[0].value,
        "namxb": document.getElementsByName('namxb')[0].value,
        "sotrang": document.getElementsByName('sotrang')[0].value,
        "kichthuoc": document.getElementsByName('kichthuoc')[0].value,
        "loaibia": document.getElementsByName('loaibia')[0].value,
        "theloai": document.getElementsByName('theloai')[0].value
    }

    if(!masp || !name || !company || !img || !price || !amount || 
       !info.tacgia || !info.nxb || !info.namxb || !info.sotrang || 
       !info.kichthuoc || !info.loaibia || !info.theloai) {
        alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
        return false;
    }

    return {
        "masp": masp,
        "name": name,
        "company": company,
        "img": img,
        "price": price,
        "amount": amount,
        "info": info
    };
}

function autoMaSanPham(company) {
    // hàm tự tạo mã cho sản phẩm mới
    if(!company) company = document.getElementsByName('chonCompany')[0].value;
    var index = 0;
    for (var i = 0; i < list_products.length; i++) {
        if (list_products[i].company == company) {
            index++;
        }
    }
    document.getElementById('maspThem').value = company.substring(0, 3) + index;
}

// Xóa
function xoaSanPham(masp, tensp) {
    if (window.confirm('Bạn có chắc muốn xóa ' + tensp)) {
        // Xóa
        for(var i = 0; i < list_products.length; i++) {
            if(list_products[i].masp == masp) {
                list_products.splice(i, 1);
            }
        }

        // Lưu vào localstorage
        setListProducts(list_products);

        // Vẽ lại table 
        addTableProducts();
    }
}

// Sửa
function suaSanPham(masp) {
    var sp = layThongTinSanPhamTuTable('khungSuaSanPham');
    if(!sp) return;
    
    for(var p of list_products) {
        if(p.masp == masp && p.masp != sp.masp) {
            alert('Mã sản phẩm bị trùng !!');
            return false;
        }

        if(p.name == sp.name && p.masp != sp.masp) {
            alert('Tên sản phẩm bị trùng !!');
            return false;
        }
    }
    // Sửa
    for(var i = 0; i < list_products.length; i++) {
        if(list_products[i].masp == masp) {
            list_products[i] = sp;
        }
    }

    // Lưu vào localstorage
    setListProducts(list_products);

    // Vẽ lại table
    addTableProducts();

    alert('Sửa ' + sp.name + ' thành công');

    document.getElementById('khungSuaSanPham').style.transform = 'scale(0)';
}

function addKhungSuaSanPham(masp) {
    var sp;
    for(var p of list_products) {
        if(p.masp == masp) {
            sp = p;
        }
    }

    var s = `<span class="close" onclick="this.parentElement.style.transform = 'scale(0)';">&times;</span>
    <table class="overlayTable table-outline table-content table-header">
        <tr>
            <th colspan="2">`+sp.name+`</th>
        </tr>
        <tr>
            <td>Mã sản phẩm:</td>
            <td><input type="text" value="`+sp.masp+`"></td>
        </tr>
        <tr>
            <td>Tên sẩn phẩm:</td>
            <td><input type="text" value="`+sp.name+`"></td>
        </tr>
        <tr>
            <td>Hãng:</td>
            <td>
                <select>`
                    
    var company = ["Apple", "Samsung", "Oppo", "Nokia", "Huawei", "Xiaomi","Realme", "Vivo", "Philips", "Mobell", "Mobiistar", "Itel","Coolpad", "HTC", "Motorola"];
    for(var c of company) {
        if(sp.company == c)
            s += (`<option value="`+c+`" selected>`+c+`</option>`);
        else s += (`<option value="`+c+`">`+c+`</option>`);
    }

    s += `
                </select>
            </td>
        </tr>
        <tr>
            <td>Hình:</td>
            <td>
                <img class="hinhDaiDien" id="anhDaiDienSanPhamSua" src="`+sp.img+`">
                <input type="file" accept="image/*" onchange="capNhatAnhSanPham(this.files, 'anhDaiDienSanPhamSua')">
            </td>
        </tr>
        <tr>
            <td>Giá tiền (số nguyên):</td>
            <td><input type="text" value="`+stringToNum(sp.price)+`"></td>
        </tr>
        <tr>
            <td>Số sao (số nguyên 0->5):</td>
            <td><input type="text" value="`+sp.star+`"></td>
        </tr>
        <tr>
            <td>Đánh giá (số nguyên):</td>
            <td><input type="text" value="`+sp.rateCount+`"></td>
        </tr>
        <tr>
            <td>Khuyến mãi:</td>
            <td>
                <select>
                    <option value="">Không</option>
                    <option value="giamgia" `+(sp.promo.name == 'giamgia'?'selected':'')+`>Giảm giá</option>
                    <option value="giareonline" `+(sp.promo.name == 'giareonline'?'selected':'')+`>Giá rẻ online</option>
                    <option value="moiramat" `+(sp.promo.name == 'moiramat'?'selected':'')+`>Mới ra mắt</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>Giá trị khuyến mãi:</td>
            <td><input type="text" value="`+sp.promo.value+`"></td>
        </tr>
        <tr>
            <th colspan="2">Thông số kĩ thuật</th>
        </tr>
        <tr>
            <td>Màn hình:</td>
            <td><input type="text" value="`+sp.detail.screen+`"></td>
        </tr>
        <tr>
            <td>Hệ điều hành:</td>
            <td><input type="text" value="`+sp.detail.os+`"></td>
        </tr>
        <tr>
            <td>Camara sau:</td>
            <td><input type="text" value="`+sp.detail.camara+`"></td>
        </tr>
        <tr>
            <td>Camara trước:</td>
            <td><input type="text" value="`+sp.detail.camaraFront+`"></td>
        </tr>
        <tr>
            <td>CPU:</td>
            <td><input type="text" value="`+sp.detail.cpu+`"></td>
        </tr>
        <tr>
            <td>RAM:</td>
            <td><input type="text" value="`+sp.detail.ram+`"></td>
        </tr>
        <tr>
            <td>Bộ nhớ trong:</td>
            <td><input type="text" value="`+sp.detail.rom+`"></td>
        </tr>
        <tr>
            <td>Thẻ nhớ:</td>
            <td><input type="text" value="`+sp.detail.microUSB+`"></td>
        </tr>
        <tr>
            <td>Dung lượng Pin:</td>
            <td><input type="text" value="`+sp.detail.battery+`"></td>
        </tr>
        <tr>
            <td colspan="2"  class="table-footer"> <button onclick="suaSanPham('`+sp.masp+`')">SỬA</button> </td>
        </tr>
    </table>`
    var khung = document.getElementById('khungSuaSanPham');
    khung.innerHTML = s;
    khung.style.transform = 'scale(1)';
}

// Cập nhật ảnh sản phẩm
function capNhatAnhSanPham(files, id) {
    // var url = '';
    // if(files.length) url = window.URL.createObjectURL(files[0]);
    
    // document.getElementById(id).src = url;

    const reader = new FileReader();
    reader.addEventListener("load", function () {
        // convert image file to base64 string
        previewSrc = reader.result;
        document.getElementById(id).src = previewSrc;
    }, false);

    if (files[0]) {
        reader.readAsDataURL(files[0]);
    }
} 

// Sắp Xếp sản phẩm
function sortProductsTable(loai) {
    var list = document.getElementsByClassName('sanpham')[0].getElementsByClassName("table-content")[0];
    var tr = list.getElementsByTagName('tr');

    quickSort(tr, 0, tr.length-1, loai, getValueOfTypeInTable_SanPham); // type cho phép lựa chọn sort theo mã hoặc tên hoặc giá ... 
    decrease = !decrease;
}

// Lấy giá trị của loại(cột) dữ liệu nào đó trong bảng
function getValueOfTypeInTable_SanPham(tr, loai) {
    var td = tr.getElementsByTagName('td');
    switch(loai) {
        case 'stt' : return Number(td[0].innerHTML);
        case 'masp' : return td[1].innerHTML.toLowerCase();
        case 'ten' : return td[2].innerHTML.toLowerCase();
        case 'gia' : return stringToNum(td[3].innerHTML);
        case 'khuyenmai' : return td[4].innerHTML.toLowerCase();
    }
    return false;
}

// ========================= Đơn Hàng ===========================
// Vẽ bảng
function addTableDonHang() {
    var tc = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0];
    var s = `<table class="table-outline">`;

    var listDonHang = getListDonHang();

    for (var i = 0; i < listDonHang.length; i++) {
        var d = listDonHang[i];
        s += `<tr>
            <td style="width: 5%">` + (i + 1) + `</td>
            <td style="width: 13%">` + d.ma_don + `</td>
            <td style="width: 7%">` + d.khach_hang.ho_ten + `</td>
            <td style="width: 20%">`;

        for (var p of d.san_pham) {
            s += p.so_luong + ' x ' + list_products.find(pro => pro.masp == p.masp).name + '<br>';
        }

        s += `</td>
            <td style="width: 15%">` + d.tong_tien + `</td>
            <td style="width: 10%">` + d.ngay_dat + `</td>
            <td style="width: 10%">` + d.trang_thai + `</td>
            <td style="width: 10%">
                <div class="tooltip">
                    <i class="fa fa-check" onclick="duyet('` + d.ma_don + `', true)"></i>
                    <span class="tooltiptext">Duyệt</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-remove" onclick="duyet('` + d.ma_don + `', false)"></i>
                    <span class="tooltiptext">Hủy</span>
                </div>
            </td>
        </tr>`;
    }

    s += `</table>`;
    tc.innerHTML = s;
}

function getListDonHang() {
    return list_orders;
}

// Duyệt
function duyet(maDonHang, duyetDon) {
    var don = list_orders.find(d => d.ma_don === maDonHang);
    if (don) {
        if (duyetDon) {
            if (don.trang_thai === 'Đang xử lý') {
                don.trang_thai = 'Đang giao hàng';
            } else if (don.trang_thai === 'Đang giao hàng') {
                don.trang_thai = 'Đã giao hàng';
            }
        } else {
            if (don.trang_thai === 'Đang xử lý') {
                don.trang_thai = 'Đã hủy';
            }
        }
        // Cập nhật giao diện
        addTableDonHang();
    }
}

function locDonHangTheoKhoangNgay() {
    var from = document.getElementById('fromDate').valueAsDate;
    var to = document.getElementById('toDate').valueAsDate;

    var listTr_table = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[5].innerHTML;
        var d = new Date(td);

        if (d >= from && d <= to) {
            tr.style.display = '';
        } else {
            tr.style.display = 'none';
        }
    }
}

function timKiemDonHang(inp) {
    var kieuTim = document.getElementsByName('kieuTimDonHang')[0].value;
    var text = inp.value;

    // Lọc
    var vitriKieuTim = {'ma':1, 'khachhang':2, 'trangThai':6};

    var listTr_table = document.getElementsByClassName('donhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[vitriKieuTim[kieuTim]].innerHTML.toLowerCase();

        if (td.indexOf(text.toLowerCase()) < 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = '';
        }
    }
}

// Sắp xếp
function sortDonHangTable(loai) {
    var list = document.getElementsByClassName('donhang')[0].getElementsByClassName("table-content")[0];
    var tr = list.getElementsByTagName('tr');

    quickSort(tr, 0, tr.length-1, loai, getValueOfTypeInTable_DonHang); 
    decrease = !decrease;
}

// Lấy giá trị của loại(cột) dữ liệu nào đó trong bảng
function getValueOfTypeInTable_DonHang(tr, loai) {
    var td = tr.getElementsByTagName('td');
    switch(loai) {
        case 'stt': return Number(td[0].innerHTML);
        case 'ma' : return new Date(td[1].innerHTML); // chuyển về dạng ngày để so sánh ngày
        case 'khach' : return td[2].innerHTML.toLowerCase(); // lấy tên khách
        case 'sanpham' : return td[3].children.length;    // lấy số lượng hàng trong đơn này, length ở đây là số lượng <p>
        case 'tongtien' : return stringToNum(td[4].innerHTML); // trả về dạng giá tiền
        case 'ngaygio' : return new Date(td[5].innerHTML); // chuyển về ngày
        case 'trangthai': return td[6].innerHTML.toLowerCase(); //
    }
    return false;
}

// ====================== Khách Hàng =============================
// Vẽ bảng
function addTableKhachHang() {
    var tc = document.getElementsByClassName('khachhang')[0].getElementsByClassName('table-content')[0];
    var s = `<table class="table-outline">`;

    for (var i = 0; i < list_customers.length; i++) {
        var u = list_customers[i];
        s += `<tr>
            <td style="width: 5%">` + (i + 1) + `</td>
            <td style="width: 15%">` + u.ho + ' ' + u.ten + `</td>
            <td style="width: 20%">` + u.email + `</td>
            <td style="width: 20%">` + u.username + `</td>
            <td style="width: 10%">` + u.mat_khau + `</td>
            <td style="width: 10%">
                <div class="tooltip">
                    <label class="switch">
                        <input type="checkbox" ` + (u.trang_thai == 'Hoạt động' ? 'checked' : '') + ` onclick="voHieuHoaNguoiDung(this, '` + u.username + `')">
                        <span class="slider round"></span>
                    </label>
                    <span class="tooltiptext">` + (u.trang_thai == 'Hoạt động' ? 'Khóa' : 'Mở khóa') + `</span>
                </div>
                <div class="tooltip">
                    <i class="fa fa-remove" onclick="xoaNguoiDung('` + u.username + `')"></i>
                    <span class="tooltiptext">Xóa</span>
                </div>
            </td>
        </tr>`;
    }

    s += `</table>`;
    tc.innerHTML = s;
}

// Tìm kiếm
function timKiemNguoiDung(inp) {
    var kieuTim = document.getElementsByName('kieuTimKhachHang')[0].value;
    var text = inp.value;

    // Lọc
    var vitriKieuTim = {'ten':1, 'email':2, 'taikhoan':3};

    var listTr_table = document.getElementsByClassName('khachhang')[0].getElementsByClassName('table-content')[0].getElementsByTagName('tr');
    for (var tr of listTr_table) {
        var td = tr.getElementsByTagName('td')[vitriKieuTim[kieuTim]].innerHTML.toLowerCase();

        if (td.indexOf(text.toLowerCase()) < 0) {
            tr.style.display = 'none';
        } else {
            tr.style.display = '';
        }
    }
}

function openThemNguoiDung() {
    window.alert('Not Available!');
}

// vô hiệu hóa người dùng (tạm dừng, không cho đăng nhập vào)
function voHieuHoaNguoiDung(inp, taikhoan) {
    var listUser = getListUser();
    for(var u of listUser) {
        if(u.username == taikhoan) {
            let value = !inp.checked
            u.off = value;
            setListUser(listUser);
            
            setTimeout(() => alert(`${value ? 'Khoá' : 'Mở khoá'} tải khoản ${u.username} thành công.`), 500);
            break;
        }
    }
    var span = inp.parentElement.nextElementSibling;
        span.innerHTML = (inp.checked?'Khóa':'Mở');
}

// Xóa người dùng
function xoaNguoiDung(taikhoan) {
    if(window.confirm('Xác nhận xóa '+taikhoan+'? \nMọi dữ liệu về '+taikhoan+' sẽ mất! Bao gồm cả những đơn hàng của '+taikhoan)) {
        var listuser = getListUser();
        for(var i = 0; i < listuser.length; i++) {
            if(listuser[i].username == taikhoan) {
                listuser.splice(i, 1); // xóa
                setListUser(listuser); // lưu thay đổi
                localStorage.removeItem('CurrentUser'); // đăng xuất khỏi tài khoản hiện tại (current user)
                addTableKhachHang(); // vẽ lại bảng khách hàng
                addTableDonHang(); // vẽ lại bảng đơn hàng
                return;
            }
        }
    }
}

// Sắp xếp
function sortKhachHangTable(loai) {
    var list = document.getElementsByClassName('khachhang')[0].getElementsByClassName("table-content")[0];
    var tr = list.getElementsByTagName('tr');

    quickSort(tr, 0, tr.length-1, loai, getValueOfTypeInTable_KhachHang); 
    decrease = !decrease;
}

function getValueOfTypeInTable_KhachHang(tr, loai) {
    var td = tr.getElementsByTagName('td');
    switch(loai) {
        case 'stt': return Number(td[0].innerHTML);
        case 'hoten' : return td[1].innerHTML.toLowerCase();
        case 'email' : return td[2].innerHTML.toLowerCase();
        case 'taikhoan' : return td[3].innerHTML.toLowerCase();    
        case 'matkhau' : return td[4].innerHTML.toLowerCase(); 
    }
    return false;
}

// ================== Sort ====================

var decrease = true; // Sắp xếp giảm dần

// loại là tên cột, func là hàm giúp lấy giá trị từ cột loai
function quickSort(arr, left, right, loai, func) {
    var pivot,
        partitionIndex;

    if (left < right) {
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right, loai, func);

        //sort left and right
        quickSort(arr, left, partitionIndex - 1, loai, func);
        quickSort(arr, partitionIndex + 1, right, loai, func);
    }
    return arr;
}

function partition(arr, pivot, left, right, loai, func) {
    var pivotValue =  func(arr[pivot], loai),
        partitionIndex = left;
    
    for (var i = left; i < right; i++) {
        if (decrease && func(arr[i], loai) > pivotValue
        || !decrease && func(arr[i], loai) < pivotValue) {
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
}

function swap(arr, i, j) {
    var tempi = arr[i].cloneNode(true);
    var tempj = arr[j].cloneNode(true);
    arr[i].parentNode.replaceChild(tempj, arr[i]);
    arr[j].parentNode.replaceChild(tempi, arr[j]);
}

// ================= các hàm thêm ====================
// Chuyển khuyến mãi vễ dạng chuỗi tiếng việt
function promoToStringValue(pr) {
    switch (pr.name) {
        // case 'tragop':
        //     return 'Góp ' + pr.value + '%';
        case 'giamgia':
            return 'Giảm ' + pr.value;
        case 'giareonline':
            return 'Online (' + pr.value + ')';
        case 'moiramat':
            return 'Mới';
    }
    return '';
}

function progress(percent, bg, width, height) {

    return `<div class="progress" style="width: ` + width + `; height:` + height + `">
                <div class="progress-bar bg-info" style="width: ` + percent + `%; background-color:` + bg + `"></div>
            </div>`
}

// for(var i = 0; i < list_products.length; i++) {
//     list_products[i].masp = list_products[i].company.substring(0, 3) + vitriCompany(list_products[i], i);
// }

// console.log(JSON.stringify(list_products));