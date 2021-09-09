const Product = require('../models/Product')
const router = require('express').Router();
const detailOrder = require('../models/detailOrder')
const Order = require('../models/Order')
const verifyToken = require('../middleware/auth')
const PhieuNhapXuat = require('../models/PhieuXuatNhap')
const ctphieuxn = require('../models/phieuxnchitiet')
const nodemailer = require('nodemailer');
const detailphieu = require('../models/phieuxnchitiet')
router.post("/top5sach", async (req, res) => {
    let { ngaybatdau, ngayketthuc } = req.body
    var listRes = [];
    var listResCTDDH = [];

    var listDDH = await Order.find({});
    var listCTDDH = await detailOrder.find({});
    var listProduct = await Product.find({});
    let ngaybd = new Date(ngaybatdau)
    let ngaykt = new Date(ngayketthuc)

    listProduct.forEach(element => {
        listRes.push(new ResTKe(element, 0));
    });
    listDDH.forEach(element => {
        var ngaydat = element.ngaydat;
        if (ngaydat.getTime() >= ngaybd.getTime() && ngaydat.getTime() <= ngaykt.getTime()) {
            // console.log(element._id);
            listCTDDH.forEach(element1 => {
                if (JSON.stringify(element1.idorder) == JSON.stringify(element._id)) {
                    // console.log(element1.IdDDH + "_" + element1._id + "_" + element1.IdSP + "_" + element1.Soluong);
                    listResCTDDH.push(element1);
                }
            });
        }
    });
    listRes.forEach(element => {
        // console.log(element.product._id);
        listResCTDDH.forEach(element1 => {
            // console.log(element1.IdSP + "_" + element1.Soluong);
            if (JSON.stringify(element.product._id) == JSON.stringify(element1.idsp)) {
                // console.log(element.sum);
                element.sum = parseInt(element.sum) + parseInt(element1.SoLuong);
                // console.log(element.sum);

            }
        });
    });

    listRes = sortList('dec', listRes, 5);

    res.send(listRes);

})
router.post("/tkesoluongbantatca", async (req, res) => {
    let { ngaybatdau, ngayketthuc } = req.body
    var listRes = [];
    var listResCTDDH = [];

    var listDDH = await Order.find({});
    var listCTDDH = await detailOrder.find({});
    var listProduct = await Product.find({});
    let ngaybd = new Date(ngaybatdau)
    let ngaykt = new Date(ngayketthuc)

    listProduct.forEach(element => {
        listRes.push(new ResTKe(element, 0));
    });
    listDDH.forEach(element => {
        var ngaydat = element.ngaydat;
        if (ngaydat.getTime() >= ngaybd.getTime() && ngaydat.getTime() <= ngaykt.getTime()) {
            // console.log(element._id);
            listCTDDH.forEach(element1 => {
                if (JSON.stringify(element1.idorder) == JSON.stringify(element._id)) {
                    // console.log(element1.IdDDH + "_" + element1._id + "_" + element1.IdSP + "_" + element1.Soluong);
                    listResCTDDH.push(element1);
                }
            });
        }
    });
    listRes.forEach(element => {
        // console.log(element.product._id);
        listResCTDDH.forEach(element1 => {
            // console.log(element1.IdSP + "_" + element1.Soluong);
            if (JSON.stringify(element.product._id) == JSON.stringify(element1.idsp)) {
                // console.log(element.sum);
                element.sum = parseInt(element.sum) + parseInt(element1.SoLuong);
                // console.log(element.sum);

            }
        });
    });


    res.send(listRes);
})

router.post("/tkeloilo", async (req, res) => {
    let { ngaybatdau, ngayketthuc } = req.body
    var listRes = [];
    var listResCTPNX = [];

    const listPNX = await PhieuNhapXuat.find({})
    const listCTPNX = await ctphieuxn.find({})

    let listProduct = await Product.find({})

    listProduct.forEach(product => {
        listRes.push(new TKeLoiLo(product, 0, 0))
    })
    let ngaybd = new Date(ngaybatdau)
    let ngaykt = new Date(ngayketthuc)


    listPNX.forEach(element => {
        var ngaydat = element.NgayNhap;
        if (ngaydat.getTime() >= ngaybd.getTime() && ngaydat.getTime() <= ngaykt.getTime()) {

            if (element.LoaiPhieu === "Phiếu nhập") {
                listCTPNX.forEach(element1 => {
                    if (JSON.stringify(element1.MaPhieu) == JSON.stringify(element._id)) {
                        listRes.forEach(product => {

                            if (JSON.stringify(element1.MaSP) == JSON.stringify(product.product._id)) {

                                product.tn = parseInt(product.tn) + parseInt(element1.SoLuong * element1.Gia)
                            }

                        });
                    }
                })

            }
            else if (element.LoaiPhieu === "Phiếu xuất") {
                listCTPNX.forEach(element1 => {
                    if (JSON.stringify(element1.MaPhieu) == JSON.stringify(element._id)) {
                        listRes.forEach(product => {
                            if (JSON.stringify(element1.MaSP) == JSON.stringify(product.product._id)) {
                                product.tx = parseInt(product.tn) + parseInt(element1.SoLuong * element1.Gia)
                            }
                        });
                    }
                })

            }
        }



    });



    res.send(listRes)
})

router.post("/tketop5tienloi", async (req, res) => {
    let { ngaybatdau, ngayketthuc } = req.body
    var listRes = [];
    var listResTK = [];
    const listPNX = await PhieuNhapXuat.find({})
    const listCTPNX = await ctphieuxn.find({})
    let listProduct = await Product.find({})
    listProduct.forEach(product => {
        listRes.push(new TKeLoiLo(product, 0, 0))
    })
    let ngaybd = new Date(ngaybatdau)
    let ngaykt = new Date(ngayketthuc)

    listPNX.forEach(element => {
        var ngaydat = element.NgayNhap;
        if (ngaydat.getTime() >= ngaybd.getTime() && ngaydat.getTime() <= ngaykt.getTime()) {

            if (element.LoaiPhieu === "Phiếu nhập") {
                listCTPNX.forEach(element1 => {
                    if (JSON.stringify(element1.MaPhieu) == JSON.stringify(element._id)) {
                        listRes.forEach(product => {

                            if (JSON.stringify(element1.MaSP) == JSON.stringify(product.product._id)) {

                                product.tn = parseInt(product.tn) + parseInt(element1.SoLuong * element1.Gia)
                            }
                        });
                    }
                })
            }
            else if (element.LoaiPhieu === "Phiếu xuất") {
                listCTPNX.forEach(element1 => {
                    if (JSON.stringify(element1.MaPhieu) == JSON.stringify(element._id)) {
                        listRes.forEach(product => {
                            if (JSON.stringify(element1.MaSP) == JSON.stringify(product.product._id)) {
                                product.tx = parseInt(product.tn) + parseInt(element1.SoLuong * element1.Gia)
                            }
                        });
                    }
                })

            }
        }
    });
    listRes.forEach(product => {
        listResTK.push(new TkeTienLoi(product, parseInt(product.tx - product.tn)))
    })
    listResTK = sortTienLoi("dec", listResTK, 5)
    res.send(listResTK)
})

function ResTKe(product, sum) {
    this.product = product;
    this.sum = sum;
};
function TKeLoiLo(product, tn, tx) {
    this.product = product
    this.tn = tn
    this.tx = tx
}

function TkeTienLoi(product, tienloi) {
    this.TenSP = product.product.TenSP
    this.tienloi = tienloi
}
function NewProduct(product, sum) {

}
function sortList(asc_or_dec, list, num) {
    for (var i = 0; i < list.length - 1; i++) {
        // console.log(list[i].sum);
        for (var j = i + 1; j < list.length; j++) {
            if (list[i].sum > list[j].sum) {
                var temp = list[i];
                list[i] = list[j];
                list[j] = temp;
            }
        }
    }

    if (asc_or_dec == "dec") {
        list = list.reverse();
    }

    list = list.slice(0, num);
    return list;
};
function sortTienLoi(asc_or_dec, list, num) {
    for (var i = 0; i < list.length - 1; i++) {
        // console.log(list[i].sum);
        for (var j = i + 1; j < list.length; j++) {
            if (list[i].tienloi > list[j].tienloi) {
                var temp = list[i];
                list[i] = list[j];
                list[j] = temp;
            }
        }
    }

    if (asc_or_dec == "dec") {
        list = list.reverse();
    }

    list = list.slice(0, num);
    return list;
};
function sortAll(asc_or_dec, list) {
    for (var i = 0; i < list.length - 1; i++) {
        // console.log(list[i].sum);
        for (var j = i + 1; j < list.length; j++) {
            if (list[i].sum > list[j].sum) {
                var temp = list[i];
                list[i] = list[j];
                list[j] = temp;
            }
        }
    }

    if (asc_or_dec == "dec") {
        list = list.reverse();
    }


    return list;
};

router.get("/4sachbanchay", async (req, res) => {
    var listRes = [];
    var listResCTDDH = [];

    var listDDH = await Order.find({});
    var listCTDDH = await detailOrder.find({});
    var listProduct = await Product.find({});

    listProduct.forEach(element => {
        listRes.push(new ResTKe(element, 0));
    });

    listDDH.forEach(element => {
        var ngaydat = element.ngaydat;
        // console.log(element._id);
        listCTDDH.forEach(element1 => {
            if (JSON.stringify(element1.idorder) == JSON.stringify(element._id)) {
                // console.log(element1.IdDDH + "_" + element1._id + "_" + element1.IdSP + "_" + element1.Soluong);
                listResCTDDH.push(element1);
            }
        });

    });

    listRes.forEach(element => {
        // console.log(element.product._id);
        listResCTDDH.forEach(element1 => {
            // console.log(element1.IdSP + "_" + element1.Soluong);
            if (JSON.stringify(element.product._id) == JSON.stringify(element1.idsp)) {
                // console.log(element.sum);
                element.sum = parseInt(element.sum) + parseInt(element1.SoLuong);
                // console.log(element.sum);

            }
        });
    });

    listRes = sortList('dec', listRes, 4);

    res.json({ listRes });
})


router.get("/4sachmoinhat", async (req, res) => {
    var listProduct = await Product.find({});
    let listnew = []
    for (let i = listProduct.length - 1; i >= 0; i--) {
        listnew.push(listProduct[i])
    }
    listnew = listnew.slice(0, 4)
    res.json({
        listnew
    })
})

router.get("/sachgiamgia", async (req, res) => {
    var listProduct = await Product.find({});
    let listnew = []
    listProduct.forEach((product, index) => {
        if (parseInt(product.KhuyenMai) > 0) {
            listnew.push(product)
        }
    })
    res.json({ listnew })
})


router.get("/sachbanchay", async (req, res) => {
    var listRes = [];
    var listResCTDDH = [];

    var listDDH = await Order.find({});
    var listCTDDH = await detailOrder.find({});
    var listProduct = await Product.find({});

    listProduct.forEach(element => {
        listRes.push(new ResTKe(element, 0));
    });

    listDDH.forEach(element => {
        var ngaydat = element.ngaydat;
        // console.log(element._id);
        listCTDDH.forEach(element1 => {
            if (JSON.stringify(element1.idorder) == JSON.stringify(element._id)) {
                // console.log(element1.IdDDH + "_" + element1._id + "_" + element1.IdSP + "_" + element1.Soluong);
                listResCTDDH.push(element1);
            }
        });

    });

    listRes.forEach(element => {
        // console.log(element.product._id);
        listResCTDDH.forEach(element1 => {
            // console.log(element1.IdSP + "_" + element1.Soluong);
            if (JSON.stringify(element.product._id) == JSON.stringify(element1.idsp)) {
                // console.log(element.sum);
                element.sum = parseInt(element.sum) + parseInt(element1.SoLuong);
                // console.log(element.sum);

            }
        });
    });

    listRes = sortAll('dec', listRes)

    let listnew = []
    listRes.forEach(elm => {
        listnew.push(elm.product)
    })
    res.json({ listnew });
})


router.post("/timsachtheoloai", async (req, res) => {
    const { id } = req.body
    if (!id) return res.status(400).json({ successful: false, message: "Vui lòng điền đủ thông tin" })

    try {
        const productget = await Product.find({ loaisp: id })
        if (!productget) return res.status(403).json({ successful: false, message: "Không tìm thấy sách có thể loại này" })
        else res.json({ successful: true, message: `Lấy các sách có id thể loại ${id} thành công`, productget })
    } catch (error) {
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }

})


router.get("/timsachsieusale", async (req, res) => {
    let listProduct = await Product.find({})
    let listnew = []
    listProduct.forEach((product, index) => {
        if (parseInt(product.KhuyenMai) > 0) {
            listnew.push(product)
        }
    })

    listnew = sortDiscount(listnew, 4)
    res.json({ listnew })
})


function sortDiscount(list, num) {
    for (var i = 0; i < list.length - 1; i++) {
        // console.log(list[i].sum);
        for (var j = i + 1; j < list.length; j++) {
            if (list[i].KhuyenMai > list[j].KhuyenMai) {
                var temp = list[i];
                list[i] = list[j];
                list[j] = temp;
            }
        }
    }
    list = list.reverse();

    list = list.slice(0, num);
    return list;
};


router.post("/orderofuser", verifyToken, async (req, res) => {
    const { id } = req.body

    const list = await Order.find({ user: id })


    let listDDH = []
    for (let i = list.length - 1; i >= 0; i--) {
        listDDH.push(list[i])
    }
    if (!list) return res.status(400).json({ successful: false, message: "Không có id user này" })
    else res.json({
        successful: true,
        message: "Lấy lish order của user thành công",
        listDDH
    })
})

router.post("/laytheotrangthai", verifyToken, async (req, res) => {
    const { id, TrangThai } = req.body

    let listDDH = await Order.find(
        {
            user: id,
            TrangThai: TrangThai
        }
    )
    if (!listDDH) return res.status(400).json({ successful: false, message: "Không có id user này" })
    else res.json({
        successful: true,
        message: "Lấy lish order của user thành công",
        listDDH
    })
})


const option = {
    service: 'gmail',
    auth: {
        user: 'tuanvo991604@gmail.com', // email hoặc username
        pass: process.env.PASS_EMAIL // password
    }
};
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var transporter = nodemailer.createTransport(option);

router.post('/otpUser', async (req, res) => {
    if (!req.body.email) return res.status(400).send("Email, Please!!!");

    var num = randomNumber(100000, 1000000);

    console.log(num);
    try {
        var mailOptions = {
            from: 'tuanvo991604@gmail@gmail.com',
            to: req.body.email,
            subject: 'Mã xác nhận ' + req.body.email,
            text: `Mã xác nhận: ${num.toString()}`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.json({ successful: false, error })
            } else {
                console.log('Email sent: ' + info.response);
                res.json({ successful: true, otp: num });
            }
        });

        // res.status(200).json({result_token : token});
    }
    catch (err) {
        res.status(400).json({ msg: err })
    }
});

router.post('/chartnhapxuat', verifyToken, async (req, res) => {
    const { ngaybatdau, ngayketthuc } = req.body

    const listphieu = await PhieuNhapXuat.find({})
    const listdetail = await detailphieu.find({})
    let tongtiennhap = 0
    let tongtienxuat = 0
    let ngaybd = new Date(ngaybatdau)
    let ngaykt = new Date(ngayketthuc)
    listphieu.forEach(phieu => {
        var ngaydat = phieu.NgayNhap
        if ((ngaydat.getTime() >= ngaybd.getTime() && ngaydat.getTime() <= ngaykt.getTime())) {
            if (phieu.LoaiPhieu === 'Phiếu nhập') {
                listdetail.forEach(detail => {
                    if (JSON.stringify(phieu._id) === JSON.stringify(detail.MaPhieu)) {

                        tongtiennhap += detail.SoLuong * detail.Gia
                    }
                })
            }
            else if (phieu.LoaiPhieu === 'Phiếu xuất') {
                listdetail.forEach(detail => {
                    if (JSON.stringify(phieu._id) === JSON.stringify(detail.MaPhieu)) {
                        tongtienxuat += detail.SoLuong * detail.Gia
                    }
                })
            }
        }
    })

    res.json({ tongtiennhap, tongtienxuat })

})

router.put("/xoadondathang", verifyToken, async (req, res) => {
    let { idorder } = req.body
    if (!idorder) return res.status(400).json({ successful: false, message: "idorder khong duoc de trong" })
    var listCTDDH = await detailOrder.find({ idorder: idorder });
    if (listCTDDH === []) return res.status(400).json({ successful: false, message: "idorder khong ton tai" })
    var listProduct = await Product.find({});
    var productnew = []
    try {
        listCTDDH.forEach((ctddh) => {
            listProduct.map(async (product) => {
                if (JSON.stringify(ctddh.idsp) === JSON.stringify(product._id)) {
                    var updateProduct = ({
                        TenSP: product.TenSP,
                        SoLuong: product.SoLuong + ctddh.SoLuong,
                        DonGia: product.DonGia,
                        KhuyenMai: product.KhuyenMai,
                        Mota: product.Mota,
                        img: product.img,
                        loaisp: product.loaisp,
                        TacGia: product.TacGia
                    })

                    const productUpdateCondition = { _id: product._id }

                    updateProduct = await Product.findOneAndUpdate(
                        productUpdateCondition,
                        updateProduct,
                        {
                            new: true
                        }
                    )
                    if (!updateProduct) {
                        return res.status(401).json({
                            successful: false,
                            message: 'ID sản phẩm không tồn tại'
                        })
                    }
                    console.log(updateProduct.SoLuong, product.SoLuong)
                }
            })
        })
        res.json({ message: "Xong" })
    } catch (error) {
        console.log("Lỗi: " + error)
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }

})

router.put("/xoaphieuxuat", verifyToken, async (req, res) => {
    let { MaPhieu } = req.body
    if (!MaPhieu) return res.status(400).json({ successful: false, message: "MaPhieu khong duoc de trong" })
    var listCTPNX = await ctphieuxn.find({ MaPhieu: MaPhieu });
    if (listCTPNX === []) return res.status(400).json({ successful: false, message: "MaPhieu khong ton tai" })
    var listProduct = await Product.find({});
    try {
        listCTPNX.forEach(CTPNX => {
            listProduct.map(async (product) => {
                if (JSON.stringify(CTPNX.MaSP) == JSON.stringify(product._id)) {
                    var updateProduct = ({
                        TenSP: product.TenSP,
                        SoLuong: product.SoLuong - CTPNX.SoLuong,
                        DonGia: product.DonGia,
                        KhuyenMai: product.KhuyenMai,
                        Mota: product.Mota,
                        img: product.img,
                        loaisp: product.loaisp,
                        TacGia: product.TacGia
                    })

                    const productUpdateCondition = { _id: product._id }

                    updateProduct = await Product.findOneAndUpdate(
                        productUpdateCondition,
                        updateProduct,
                        {
                            new: true
                        }
                    )
                    if (!updateProduct) {
                        return res.status(401).json({
                            successful: false,
                            message: 'ID sản phẩm không tồn tại'
                        })
                    }
                }
            })
        })
        res.json({ message: "Xong" })
    } catch (error) {
        console.log("Lỗi: " + error)
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }
})

router.post("/kiemtrasoluongton", async (req, res) => {
    let { MaPhieu } = req.body
    if (!MaPhieu) return res.status(400).json({ successful: false, message: "MaPhieu khong duoc de trong" })
    var listCTPNX = await ctphieuxn.find({ MaPhieu: MaPhieu });
    if (listCTPNX === []) return res.status(400).json({ successful: false, message: "MaPhieu khong ton tai" })
    var listProduct = await Product.find({});
    try {
        var check = true

        listCTPNX.forEach(CTPNX => {
            listProduct.map((product) => {
                if (JSON.stringify(product._id) == JSON.stringify(CTPNX.MaSP)) {
                    if (product.SoLuong < CTPNX.SoLuong) {
                        console.log("aaaa")
                        check = false;
                    }
                }
            })
        })
        if (check === true) {
            console.log("bbbb")

            res.json({ message: "success", listCTPNX, listProduct })

        }
        else return res.status(403).json({ message: "Số lượng trong kho không đủ", listCTPNX, listProduct })
    } catch (error) {
        console.log("Lỗi: " + error)
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }
})

module.exports = router