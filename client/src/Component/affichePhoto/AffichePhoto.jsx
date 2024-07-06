import React from 'react'
import './affichePhoto.css'
import { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

export default function AffichePhoto(props) {
const [srcImg, setsrcImg] = useState("");
 const [file, setfile] = useState("");
 const {token,settoken}  = useContext(AuthContext);
 const [cliquePhoto, setcliquePhoto] = useState(false);
 const [download, setdownload] = useState(false);

 function ImgCLick(e,id){
    const allImgs = document.querySelectorAll('.imgChoix');
    allImgs.forEach(element => {
        element.style.border = 'none';
    });
    setdownload(false);
    const newTab = props.allImg.filter((el)=>el._id===id);
    setsrcImg(newTab[0].image);
    e.target.style.border ='2px solid red';
    setcliquePhoto(true);
 }

 async function handleimg(){
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const formdata = new FormData();
    formdata.append('file',file);
  
    await axios.post("/photo/upload",formdata,config)
      .then((res)=>console.log(res))
      .catch((err)=>console.log(err));

    await  axios.get("/photo/getImage",config)
      .then((res)=>{
        setcliquePhoto(false);
        setdownload(true);
        props.setallImg(res.data);
        setsrcImg(res.data[res.data.length-1].image);
        const allImgs = document.querySelectorAll('.imgChoix');
        if(res.data.length===1){
          props.setimgPref(res.data[0].image);
        }
    
        allImgs.forEach(element => {
            element.style.border = 'none';
        });
      })
      .catch((err)=>console.log(err));
  }


  function renduImg(){
    if(props.allImg.length===0){
      console.log("ici")
      return (
        ""
      )
    }
    if(props.allImg.length!==0 && cliquePhoto=== false && download===false){
      console.log("la")
      return (
        <img src={`http://localhost:5000`+props.imgPref} alt="" />
      )
    }
    if(props.allImg.length!==0 && cliquePhoto=== false && download===true){
      return (
        <img src={`http://localhost:5000`+props.allImg[props.allImg.length-1].image} alt="" />
      )
    }
    if(props.allImg.length!==0 && cliquePhoto=== true){
      console.log("yes")
      return (
        <img src={`http://localhost:5000`+srcImg} alt="" />
      )
    }
  }

  function renduAllImg(){
    if(props.allImg.length===0 ){
      return(
        "pas dimage" 
      )
    }
    if(props.allImg.length!==0 && cliquePhoto===false && download===false){
      return(
          props.allImg.map((element)=>{
            return(
              element.image === props.imgPref ? 
                <img style={{border:'2px solid red'}} className='imgChoix' onClick={(e)=>ImgCLick(e,element._id)} key={element._id}  src={`http://localhost:5000`+element.image} alt="" />
                :
                <img className='imgChoix' onClick={(e)=>ImgCLick(e,element._id)} key={element._id}  src={`http://localhost:5000`+element.image} alt="" />
            )
            
        })
      )
    }
    if(props.allImg.length!==0 && cliquePhoto===true && download===false){
      return(
          props.allImg.map((element)=>{
            return(
                <img className='imgChoix' onClick={(e)=>ImgCLick(e,element._id)} key={element._id}  src={`http://localhost:5000`+element.image} alt="" />
            )
            
        })
      )
    }
    if(props.allImg.length!==0 && download===true){
      return(
          props.allImg.map((element)=>{
            return(
                element.image === props.allImg[props.allImg.length-1].image ?
                <img style={{border:'2px solid red'}} className='imgChoix' onClick={(e)=>ImgCLick(e,element._id)} key={element._id}  src={`http://localhost:5000`+element.image} alt="" />
                :
                <img className='imgChoix' onClick={(e)=>ImgCLick(e,element._id)} key={element._id}  src={`http://localhost:5000`+element.image} alt="" />
            )
            
        })
      )
    }
  }


  return (
    <div className='containerAffichePhoto'>
        <p>
          {renduImg()}
          <input type="file" onChange={e=>setfile(e.target.files[0])} />
          <button  onClick={handleimg}>bonjour</button>
          <button  >terminé</button>
        </p>
        <p>
        {renduAllImg()}
        </p>
    </div>
  )
}