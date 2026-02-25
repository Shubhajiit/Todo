
import express from 'express'
import 'dotenv/config'
import connectDB from './Database/db.js';
import userRoute from './routes/userRoute.js'
import todoRoute from './routes/todoRoute.js'
import categoryRoute from './routes/categoryRoute.js'
import cors from 'cors'

const app = express();

const PORT = process.env.PORT ||3000 ; 

//Middleware
app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))


app.use('/api/v1/user' , userRoute)
app.use('/api/v1/todo' , todoRoute)
app.use('/api/v1/category', categoryRoute)


// http://localhost:8000/api/v1/user/register
// http://localhost:8000/api/v1/todo/


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is Listeing : ${PORT}`);
})
