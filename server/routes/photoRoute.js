const express = require("express");
const multer = require('multer');
const router =express.Router();
const auth = require("../middleware/auth");
const MessagePost = require("../model/MessagePost");
const Message = require("../model/MessagePost");
const Post = require("../model/Post");
const User = require("../model/User");
const Photo = require("../model/Photo");
var fs = require('fs');


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
  
        const newPhoto = new Photo({
            image:"/../images/"+req.file.filename,
            prefimage:false,
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

router.post('/prefImage',auth,async(req,res)=>{
    try {
        const imgPrefActuelle = await Photo.findOne({prefimage:true});
        const newImgPreF= await Photo.findOne({_id:req.body._id});
        const allMsgUser = await Message.find({idUser:req.payload.id});
        if(imgPrefActuelle !== null){
            imgPrefActuelle.prefimage=false;
            await imgPrefActuelle.save();
        }
        newImgPreF.prefimage=true;
        
        await newImgPreF.save();
        allMsgUser.forEach(element => {
            element.image = newImgPreF.image;
            element.save();
        });
        res.json(newImgPreF);
        
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


router.post("/delete",auth,async(req,res)=>{
    try {
        const img= await Photo.findOne({_id:req.body.id});
        const allMsg = await MessagePost.find({idUser:req.payload.id})
        allMsg.forEach(element => {
            element.image ="";
            element.save();
        });
        const srcImg = img.image.substring(4,img.length);
        fs.unlinkSync(`./public/${srcImg}`);
        await img.deleteOne();
        res.json("good");
    } catch (error) {
        res.status(500).json(error.message);
    }
})

  module.exports = router;