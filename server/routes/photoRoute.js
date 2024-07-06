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
        let booleanPrefImage = false;
        if(!idUser){
            return res.status(401).json("vous devez être connecté télécharger une image.");
        }
        const allImg = await Photo.find();
  
        if(allImg.length===0){
            booleanPrefImage = true;
        }
        const newPhoto = new Photo({
            image:"/../images/"+req.file.filename,
            prefimage:booleanPrefImage,
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
        const allImg = await  Photo.find({idUser:idUser});
        res.json(allImg);
        
    } catch (error) {
        res.status(500).json(error.message);
    }
})  

router.get('/prefImage',auth,async(req,res)=>{
    try {
        const idUser = req.payload.id;
        const img = await  Photo.find({idUser:idUser,prefimage:true});
        res.json(img);
        
    } catch (error) {
        res.status(500).json(error.message);
    }
})  


  module.exports = router;