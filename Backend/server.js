
import express from 'express'
import 'dotenv/config'
import connectDB from './Database/db.js';
import userRoute from './routes/userRoute.js'
import todoRoute from './routes/todoRoute.js'
import categoryRoute from './routes/categoryRoute.js'
import cors from 'cors'

const app = express();

const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "https://todoapp-git-main-shubhajit-basaks-projects.vercel.app",
    "https://todoapp-three-kappa-77.vercel.app",
    "http://localhost:5173",
];

//Middleware
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Todo backend is running',
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
    });
});


app.use('/api/v1/user' , userRoute)
app.use('/api/v1/todo' , todoRoute)
app.use('/api/v1/category', categoryRoute)


// http://localhost:8000/api/v1/user/register
// http://localhost:8000/api/v1/todo/


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is Listeing : ${PORT}`);
})
