const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const path = require("path");
const multer = require('multer');
const PhotoModel = require('./model/Photo');
require("dotenv").config();
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(cookieParser());
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
const photoRoute = require("./routes/photoRoute");
// const adminRoute = require("./routes/admin");
const signalementRoute = require("./routes/signalementRoute");
const categorie = require("./routes/categorie");
app.use("/post",postRoute);
app.use("/user",userRoute);
app.use("/like",likeRoute);
app.use("/message",messageRoute);
app.use("/categorie",categorie);
app.use("/photo",photoRoute);
// app.use("/admin",adminRoute);
app.use("/signalement",signalementRoute);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server ok "));
