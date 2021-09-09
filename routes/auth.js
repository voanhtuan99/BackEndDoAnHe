const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const User = require('../models/User')
require('dotenv')
const jwt = require('jsonwebtoken')
const { findOne } = require('../models/User')
const verifyToken = require('../middleware/auth')
// @route POST api/auth/register
// @desc Register user
// @access Public

router.post('/register', async (req, res) => {
    const { email, password, name, sdt, diachi, role, active } = req.body


    if (!email || !password || !name || !sdt || !diachi || !role)
        return res.status(400).json({ successful: false, message: `Bạn chưa nhập đủ thông tin ${req.body.email} ${req.body.password} ${req.body.name} ${req.body.sdt} ${req.body.diachi}${req.body.role}` })


    try {
        const user = await User.findOne({ email })
        if (user)
            return res.status(400).json({ successful: false, message: 'Email đã bị trùng' })

        const hashPassword = await argon2.hash(password)

        const newUser = new User({ email: email, password: hashPassword, name: name, sdt: sdt, diachi: diachi, role: role, active: active })

        await newUser.save()

        // return token
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET)


        res.json({
            successful: true,
            message: 'Tạo tài khoản thành công',
            accessToken
        })
    }
    catch (error) {
        console.log(req.body.email + error)
        res.status(500).json({ successful: false, message: 'Server bị lỗi' + req.body.username })
    }
})




// @route POST api/auth/login
// @desc login user
// @access Public

router.post('/login', async (req, res) => {
    const { email, password } = req.body


    if (!email || !password)
        return res.status(400).json({ successful: false, message: `Bạn chưa nhập tài khoản hoặc mật khẩu ${req.body.email}` })

    try {
        // Kiểm tra email có tồn tại ko
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ successful: false, message: 'email hoặc password sai' })

        const passwordValid = await argon2.verify(user.password, password)

        if (!passwordValid) return res.status(400).json({ successful: false, message: 'email hoặc password sai' })

        // Login success
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)


        res.json({
            successful: true,
            message: 'Đăng nhậpn thành công',
            accessToken, user
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }
})


router.get('/:id', verifyToken, async (req, res) => {

    try {
        const UserSelect = await User.findOne({ _id: req.params.id })
        if (!UserSelect) return res.status(400).json({ successful: false, message: 'User không tồn tại' })
        else res.json({ successful: true, message: 'Thanh cong', UserSelect })

    } catch (error) {
        console.log(error)
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const Users = await User.find({})
        res.json({
            successful: true,
            message: "lay list user thanh cong",
            Users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }
})

router.post("/kiemtragmail", async (req, res) => {
    const { email } = req.body
    try {
        const usercheck = await User.findOne({ email })
        console.log(usercheck)
        if (usercheck) res.status(401).json({ successful: false, message: "Email đã tồn tại" })

        res.json({ successful: true, message: "email hợp lệ" })
    } catch (error) {
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }
})


router.post('/selectgmaildoimk', async (req, res) => {
    const { email } = req.body
    try {
        const userselect = await User.findOne({ email })
        console.log(userselect)
        if (!userselect) return res.status(401).json({ successful: false, message: "Không tìm thấy email này" })


        res.json({ successful: true, message: "Lấy email thành công", userselect })
    } catch (error) {
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }
})


router.put('/doimk', async (req, res) => {
    const { email, password, name, sdt, diachi, role, active } = req.body


    try {
        const hashPassword = await argon2.hash(password)
        var updateUser = ({
            email: email,
            password: hashPassword,
            name: name,
            sdt: sdt,
            diachi: diachi,
            role: role,
            active: active
        })

        const userUpdateCondition = { email: email }

        updateUser = await User.findOneAndUpdate(
            userUpdateCondition,
            updateUser,
            {
                new: true
            }
        )
        if (!updateUser) {
            return res.status(401).json({
                successful: false,
                message: 'User không tồn tại'
            })
        }
        else return res.json({
            successful: true,
            message: 'Đổi mật khẩu thành công',
            updateUser
        })
    } catch (error) {
        console.log("Lỗi: " + error)
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }
})

router.put('/doiactive', verifyToken, async (req, res) => {
    const { email, password, name, sdt, diachi, role, active } = req.body


    try {
        const hashPassword = await argon2.hash(password)
        var updateUser = ({
            email: email,
            password: hashPassword,
            name: name,
            sdt: sdt,
            diachi: diachi,
            role: role,
            active: active
        })

        const userUpdateCondition = { email: email }

        updateUser = await User.findOneAndUpdate(
            userUpdateCondition,
            updateUser,
            {
                new: true
            }
        )
        if (!updateUser) {
            return res.status(401).json({
                successful: false,
                message: 'User không tồn tại'
            })
        }
        else return res.json({
            successful: true,
            message: 'Đổi trạng thái tài khoản công',
            updateUser
        })
    } catch (error) {
        console.log("Lỗi: " + error)
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }

})

router.put('/suatt', verifyToken, async (req, res) => {
    const { email, password, name, sdt, diachi, role, active } = req.body


    try {
        var updateUser = ({
            email: email,
            password: password,
            name: name,
            sdt: sdt,
            diachi: diachi,
            role: role,
            active: active
        })

        const userUpdateCondition = { email: email }

        updateUser = await User.findOneAndUpdate(
            userUpdateCondition,
            updateUser,
            {
                new: true
            }
        )
        if (!updateUser) {
            return res.status(401).json({
                successful: false,
                message: 'User không tồn tại'
            })
        }
        else return res.json({
            successful: true,
            message: 'Đổi trạng thái tài khoản công',
            updateUser
        })
    } catch (error) {
        console.log("Lỗi: " + error)
        res.status(500).json({ successful: false, message: 'Server bị lỗi' })
    }

})

module.exports = router