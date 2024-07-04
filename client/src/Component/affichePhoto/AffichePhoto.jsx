import React from 'react'
import './affichePhoto.css'
import { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

export default function AffichePhoto(props) {
//  const [srcImg, setsrcImg] = useState(props.allImg.length===0 ? "":props.allImg[0].image );
const [srcImg, setsrcImg] = useState("");
 const [file, setfile] = useState("");
 const {token,settoken}  = useContext(AuthContext);
 

 function ImgCLick(e,id){
    const allImgs = document.querySelectorAll('.imgChoix');
    allImgs.forEach(element => {
        element.style.border = 'none';
    });
    const newTab = props.allImg.filter((el)=>el._id===id);
    console.log(newTab[0].image);
    setsrcImg(newTab[0].image);
    e.target.style.border ='2px solid red';
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
        props.setallImg(res.data);
        setsrcImg(res.data[res.data.length-1].image);
        const allImgs = document.querySelectorAll('.imgChoix');
        console.log(allImgs)
        allImgs.forEach(element => {
            element.style.border = 'none';
        });
      })
      .catch((err)=>console.log(err));
  }

  async function changerImg (src){
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const img = {src};
    
    await  axios.post("/photo/preferenceImg",img,config)
    .then((res)=>{
      console.log(res);
      props.setimgPref(img);
    })
    .catch((err)=>console.log(err));
  }


  return (
    <div className='containerAffichePhoto'>
        <p>
            {props.allImg.length===0 ? " " :     <img src={`http://localhost:5000`+srcImg} alt="" />}
            <input type="file" onChange={e=>setfile(e.target.files[0])} />
          <button  onClick={handleimg}>bonjour</button>
          <button  onClick={()=>changerImg(srcImg)}>terminé</button>
        </p>
        <p>
            {props.allImg.length===0 ? "pas dimage" :  props.allImg.map((element)=>{
                return(
                    <img className='imgChoix' onClick={(e)=>ImgCLick(e,element._id)} key={element._id}  src={`http://localhost:5000`+element.image} alt="" />
                )
            })}
        </p>
    </div>
  )
}
