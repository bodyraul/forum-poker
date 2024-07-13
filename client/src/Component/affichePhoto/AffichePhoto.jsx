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
 const [srcImgClique, setsrcImgClique] = useState({});

 const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

 async function handleimg(){
   
  
    const formdata = new FormData();
    formdata.append('file',file);
  
    await axios.post("/photo/upload",formdata,config)
      .then((res)=>console.log(res))
      .catch((err)=>console.log(err));

    await axios.get("/photo/getImage",config)
      .then((res)=>{
        console.log(res.data);
        props.setallImg(res.data);
      })
      .catch((err)=>console.log(err));
  }

  async function choisePrefImg(){
    const newtab = props.allImg.filter((element)=>element._id === srcImgClique.id);
    
    await  axios.post("/photo/prefImage",newtab[0],config)
      .then((res)=>{
        console.log(res);
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
        "vous n'avez aucune photo"
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
    e.target.style.border="2px solid red";
    const imgclique ={ src:e.target.src,id:id};
    setsrcImgClique(imgclique);
    refImgSolo.current.src =e.target.src;
  }

  const supImage = async()=>{
    await axios.post('/photo/delete',srcImgClique,config)
    .then((res)=>{
      console.log(res);
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
      console.log(res.data);
    })
    .catch((err)=>console.log(err));

    await  axios.get(`/message/afficherMesMessages/${props.idPost}`,config)
    .then((res)=>{
      props.setallMsg(res.data);
    })
    .catch((err)=>console.log(err));
  

  }

  return (
    <div className='containerAffichePhoto'>
        <p>
          <img ref={refImgSolo} src='' alt="" />
          <input id='fileUpload' ref={input} style={{color:"white"}} type="file" onChange={e=>setfile(e.target.files[0])} />
          <label htmlFor='fileUpload'>bonjour</label>
          <button  onClick={handleimg}>telecharger</button>
          <button onClick={choisePrefImg}  >changer l'image de profil</button>
          <button onClick={supImage} >Supprimer l'image</button>
        </p>
        <p>
          {afficheAllImg()}
        </p>
    </div>
  )
}