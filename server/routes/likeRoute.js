const express = require("express");
const router =express.Router();
const User = require("../model/User");
const auth = require("../middleware/auth");
const Message = require("../model/MessagePost");
const Like = require("../model/Like");
const { json } = require("express");


router.post("/creerLike/:id",auth,async(req,res)=>{
    try {
        const idUser = req.payload.id;
        const idMsg = req.params.id;
        const message = await Message.findOne({_id:idMsg});
        const idPost = message.idPost;

        const newLike = new Like({
            idPost : idPost,
            idMessage : idMsg,
            idUserlikeur : idUser,
            nom:req.body.nom
        })

        await newLike.save();
        message.nbLike +=1;
        await message.save();
        const allLikeMsg = await Like.find({idPost:idPost});
        // récupère tous les messages likés du post ou l'idUserlikeur = à lid de luser connecté
        const newtab = allLikeMsg.filter(function(ele ){
         return ele.idUserlikeur == idUser;
     }) 
 
        res.json(newtab);
    } catch (error) {
        res.status(500).json(error.message);
    }
    
});

//suprimer un like 
router.delete("/supprimerLike/:id",auth,async(req,res)=>{
    try {
       const idUser = req.payload.id;
       const idMessage = req.params.id;
       const message = await Message.findOne({_id:idMessage});
       message.nbLike -=1;
       const likeASup = await Like.findOne({idMessage:idMessage}).and({idUserlikeur:idUser});
       await likeASup.deleteOne();
       await message.save();
       res.json("message");
    } catch (error) {
        res.status(500).json(error.message);
    }

})


//route qui return les messages likés d'un utilisateur selon un post donné
router.get("/AfficherMessageLikerParPost/:id",auth,async(req,res)=>{
    try {
       const idUser = req.payload.id;
       const idPost=req.params.id;
       // on récupère tous les messages likés du post 
       const allLikeMsg = await Like.find({idPost:idPost});
       // récupère tous les messages likés du post ou l'idUserlikeur = à lid de luser connecté
       const newtab = allLikeMsg.filter(function(ele ){
        return ele.idUserlikeur == idUser;
    }) 

    res.json(newtab);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

// //route qui return le nombre de like total d'un message
router.get("/nbLikeMsg/:id",async(req,res)=>{
    try {
       const idMessage=req.params.id;
       // on récupère tous les likes qui ont l'idmsg du msg en params
       const allLikeMsg = await Like.find({idMessage:idMessage});
       const nombre = allLikeMsg.length;
        res.json(nombre);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

module.exports= router;