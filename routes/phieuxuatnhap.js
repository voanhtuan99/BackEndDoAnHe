const express = require('express')
const router = express.Router()

const PhieuNhap = require('../models/PhieuXuatNhap')

const verifyToken = require('../middleware/auth')

router.post("/insert", verifyToken, async (req, res) => {
    const { NgayNhap, CongTy, LoaiPhieu } = req.body

    if (!CongTy) return res.status(400).json({ successful: false, message: "Điền thiếu thông tin" })

    try {
        const phieunhapnew = new PhieuNhap({
            NgayNhap: NgayNhap || Date.now(),
            CongTy: CongTy,
            LoaiPhieu: LoaiPhieu
        })

        await phieunhapnew.save()

        res.json({ successful: true, message: "Tạo phiếu thành công", phieunhapnew })
    } catch (error) {
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })

    }
})

router.get("/:loaiphieu", verifyToken, async (req, res) => {
    try {
        const listphieunhap = await PhieuNhap.find({ LoaiPhieu: req.params.loaiphieu })
        if (!listphieunhap) return res.status(401).json({ successful: false, message: "Không có loại phiếu này" })
        res.json({ successful: true, message: "Lấy ds phiếu thành công", listphieunhap })
    } catch (error) {
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })

    }
})


router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const phieuDeleteCondition = { _id: req.params.id }
        var deletePhieu = await PhieuNhap.findOneAndDelete(
            phieuDeleteCondition
        )

        if (!deletePhieu) {
            return res.status(401).json({
                successful: false,
                message: 'ID phiếu không tồn tại'
            })
        }
        else return res.json({
            successful: true,
            message: 'Xóa phiếu thành công',
            deletePhieu
        })
    } catch (error) {

    }
})

router.get("/", verifyToken, async (req, res) => {

    try {
        const list = await PhieuNhap.find()
        let listphieu = []
        for (let i = list.length - 1; i >= 0; i--) {
            listphieu.push(list[i])
        }
        res.json({ successful: true, message: "Lấy ds phiếu thành công", listphieu })
    } catch (error) {
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })

    }
})


module.exports = router