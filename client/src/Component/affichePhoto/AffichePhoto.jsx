import React from 'react'
import './affichePhoto.css'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useRef } from 'react';


export default function AffichePhoto(props) {
 const [file, setfile] = useState("");
 const {token,settoken}  = useContext(AuthContext);
 const refImgSolo = useRef();
 const input =  useRef();
 const containerImgSolo =  useRef();
 const [srcImgClique, setsrcImgClique] = useState({});
 const [erroMessageAffichePhoto, seterroMessageAffichePhoto] = useState("");

 const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

 async function handleimg(){
   
  if(file.length===0){
    return seterroMessageAffichePhoto("Selectionnez l'image à télécharger");
  }

    const formdata = new FormData();
    formdata.append('file',file);
  
    await axios.post("/photo/upload",formdata,config)
      .then((res)=>console.log(res))
      .catch((err)=>console.log(err));

    await axios.get("/photo/getImage",config)
      .then((res)=>{
        props.setallImg(res.data);
      })
      .catch((err)=>console.log(err));
  }

  async function choisePrefImg(){

    const newtab = props.allImg.filter((element)=>element._id === srcImgClique.id);
    if(newtab.length ===0){
      return seterroMessageAffichePhoto("Selectionnez l'image à afficher")
    }
    
    await  axios.post("/photo/prefImage",newtab[0],config)
      .then((res)=>{
        props.setimgPref(res.data.image);
        props.setbolAffichePhoto(false);
      })
      .catch((err)=>console.log(err));

      await  axios.get(`/message/afficherMesMessages/${props.idPost}`,config)
      .then((res)=>{
        props.setallMsg(res.data);
      })
      .catch((err)=>console.log(err));

  }


  function afficheAllImg(){
    if(props.allImg.length===0){
      return(
        <p className='messageNoPhoto'>Vous n'avez aucune photo</p>
      )
    }
    if(props.allImg.length>0){
      return(
        props.allImg.map((element)=>{
          return(
            <img  className='imgChoix' onClick={(e)=>ImgCLick(e,element._id)} key={element._id}  src={`http://localhost:5000`+element.image} alt="" />
          )
        })
      )
    }
  }

  function ImgCLick(e,id){
    const allImg =  document.querySelectorAll('.imgChoix');
    allImg.forEach(element => {
        element.style.border = "none";
    });
    e.target.style.border="3px solid #44ADA8";
    const imgclique ={ src:e.target.src,id:id};
    setsrcImgClique(imgclique);
    refImgSolo.current.src =e.target.src;
    containerImgSolo.current.style.border = "0px ";
  }

  const supImage = async()=>{
    if(!srcImgClique.hasOwnProperty("src") ){
      return seterroMessageAffichePhoto("Selectionnez l'image à supprimer");
    }

    await axios.post('/photo/delete',srcImgClique,config)
    .then((res)=>{
    })
    .catch((err)=>console.log(err));

    await  axios.get("/photo/getImage",config)
      .then((res)=>{
        props.setallImg(res.data);
        refImgSolo.current.src ="";
      })
      .catch((err)=>console.log(err));

    await  axios.get("/photo/prefImage",config)
    .then((res)=>{
      props.setimgPref("");
    })
    .catch((err)=>console.log(err));

    if(props.idPost.length > 0){
      await  axios.get(`/message/afficherMesMessages/${props.idPost}`,config)
      .then((res)=>{
        props.setallMsg(res.data);
      })
      .catch((err)=>console.log(err));
    }
    setsrcImgClique({});
  }

  return (
    <div className='containerAffichePhoto'>
        <div>
          <p ref={containerImgSolo} className='imgClassBase'>
            <img  ref={refImgSolo} src='' alt="" />
          </p>
          <p className='erroMessageAffichePhoto'>
            {erroMessageAffichePhoto}
          </p>
          <p>
            <input id='fileUpload' ref={input}  type="file" onChange={e=>setfile(e.target.files[0])} />
          </p>
          <p>
            <button  onClick={handleimg}>telecharger</button>
            <button onClick={choisePrefImg}  >changer l'image de profil</button>
            <button onClick={supImage} >Supprimer l'image</button>
          </p>
        </div>
        <div>
          {afficheAllImg()}
        </div>
    </div>
  )
}