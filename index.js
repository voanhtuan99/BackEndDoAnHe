require('dotenv').config()
const express = require('express')

const mongoose = require('mongoose')

const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
const cateRouter = require('./routes/category')
const cartRouter = require('./routes/cart')
const cartDetailRouter = require('./routes/cartDetail')
const orderRouter = require('./routes/order')
const detailOrderRouter = require('./routes/detailOrder')
const congtyRouter = require('./routes/congty')
const phieunhapRouter = require('./routes/phieuxuatnhap')
const ctphieuRouter = require('./routes/ctphieuxn')
const selectRouter = require('./routes/select')





const cors = require('cors')
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-learnit.pmqdu.mongodb.net/mern-learnit?retryWrites=true&w=majority`,
            {
                userCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        )

        console.log('MongoDB connected')
    }
    catch (error) {
        console.log(error.mongoose)
        process.exit(1)
    }
}

connectDB()


const app = express()


app.use(express.json())
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/api/auth', authRouter)
app.use('/api/product', productRouter)
app.use('/api/category', cateRouter)
app.use('/api/cart', cartRouter)
app.use('/api/cartdetail', cartDetailRouter)
app.use('/api/order', orderRouter)
app.use('/api/detailorder', detailOrderRouter)
app.use('/api/congty', congtyRouter)
app.use('/api/phieuxuatnhap', phieunhapRouter)
app.use('/api/ctphieu', ctphieuRouter)
app.use('/api/select', selectRouter)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});