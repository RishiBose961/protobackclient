const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const userRoute = require('./routes/userRoutes')
const customerRoute = require('./routes/custoerRoutes')
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')

mongoose.set('strictQuery', false);


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (!err) {
        console.log('MONGO DataBase Connect Sucessfully');
    }
    else {
        console.log('MONGO DataBase Connect Failed');
    }
})


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:3000","https://celebrated-fairy-45b546.netlify.app"],
    credentials:true
}))

app.use("/auth",userRoute)
app.use("/customer",customerRoute)



const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>
console.log(`Server Started on Port:${PORT}`))