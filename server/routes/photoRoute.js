const express = require("express");
const multer = require('multer');
const router =express.Router();
const auth = require("../middleware/auth");
const MessagePost = require("../model/MessagePost");
const Message = require("../model/MessagePost");
const Post = require("../model/Post");
const User = require("../model/User");
const Photo = require("../model/Photo");



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

router.post('/upload',auth,upload.single('file'),async(req,res)=>{
    try {
        const idUser = req.payload.id;
        if(!idUser){
            return res.status(401).json("vous devez être connecté pour envoyer un message sur un post.");
        }
        const newPhoto = new Photo({
            image:"/../images/"+req.file.filename,
            idUser:idUser,
        })
        await newPhoto.save();
        res.status(201).json("photo créé.");
        
    } catch (error) {
        res.status(500).json(error.message);
    }
})

router.get('/getImage',auth,async(req,res)=>{
    try {
        const idUser = req.payload.id;
        Photo.find({idUser:idUser})
        .then(photo=>res.json(photo));
        
    } catch (error) {
        res.status(500).json(error.message);
    }
})  

router.post('/preferenceImg',auth,async(req,res)=>{
    try {
        const img = req.body;
        res.cookie('prefimg',img,{
            httpOnly:true,
        })
        res.json("ok");
        
    } catch (error) {
        res.status(500).json(error.message);
    }
})  

router.get('/preferenceImg',auth,async(req,res)=>{
    try {
        imgPref = req.cookies;
        res.json(imgPref);
        
    } catch (error) {
        res.status(500).json(error.message);
    }
}) 


  module.exports = router;