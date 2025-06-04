// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/mongodb.js'
// import connectCloudinary from './config/cloudinary.js'
// import userRouter from './routes/userRoute.js'
// import productRouter from './routes/productRoute.js'


// //App config (create instance of express server using express package)

// const app = express()
// const port = process.env.PORT || 4000 // if port number is available in evironment variable it will be used or not avilable means start in PORT number 4000 
// connectDB()
// connectCloudinary()

// //middleware
// app.use(express.json()) // whatever request we will get passed using json
// app.use(cors())   //we can access backend from any IP

// //creating API end points
// app.use('/api/user',userRouter)
// app.use('/api/product', productRouter);


// app.get('/', (req,res)=>{
//     res.send("API WORKING") // whenever we open localhost 4000 there it should display "API WORKING  "
// })

// //start express server
// app.listen(port, ()=>console.log("server started on PORT : "+ port)); 



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

//  api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order',orderRouter)

app.get('/', (req, res) => {
  res.send("API WORKING")
})

app.listen(port, () => console.log("Server started on PORT: " + port))
