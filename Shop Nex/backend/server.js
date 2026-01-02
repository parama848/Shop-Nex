
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js'



const app = express()

const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

app.use(
  cors({
    origin: [
      "http://localhost:5174",       // admin local
      "http://localhost:5173",       // frontend local
      "https://shop-nex-frontend.vercel.app",
      "https://shop-nex-admin.vercel.app"
    ],
    credentials: true,
  })
);


//  api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order',orderRouter)

app.get('/', (req, res) => {
  res.send("API WORKING")
})

app.listen(port, () => console.log("Server started on PORT: " + port))
