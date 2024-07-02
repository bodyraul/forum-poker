const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const path = require("path");
const multer = require('multer');
const PhotoModel = require('./model/Photo');
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname+"/public")));



mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("connexion ok"))
.catch((erreur)=>console.log(erreur));


const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const likeRoute = require("./routes/likeRoute");
const messageRoute = require("./routes/messageRoute");
// const adminRoute = require("./routes/admin");
const signalementRoute = require("./routes/signalementRoute");
const categorie = require("./routes/categorie");
app.use("/post",postRoute);
app.use("/user",userRoute);
app.use("/like",likeRoute);
app.use("/message",messageRoute);
app.use("/categorie",categorie);
// app.use("/admin",adminRoute);
app.use("/signalement",signalementRoute);

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images')
    },
    filename : (req,file,cb)=>{
        cb(null,Date.now() + "_" +file.originalname)
    }
    
})

const upload = multer({
    storage:storage
})

app.post('/upload',upload.single('file'),(req,res)=>{
    try {
        PhotoModel.create({image:"/images/"+req.file.filename})
        .then(result=>res.json(result));
        
    } catch (error) {
        res.status(500).json(error.message);
    }
})

app.get('/getImage',(req,res)=>{
    try {
        PhotoModel.find()
        .then(photo=>res.json(photo));
        
    } catch (error) {
        res.status(500).json(error.message);
    }
})


const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server ok "));
