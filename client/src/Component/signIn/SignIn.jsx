import React from 'react'
import './signIn.css'
import { useEffect } from 'react'
import { useRef } from 'react'
import croix from '../../photo/croix.png'
import { useContext } from 'react';
import { ConfidentialiteContext } from '../../Context/ConfidentialiteContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { useState } from 'react'
import axios from 'axios'

export default function SignUp(props) {
    const navigate = useNavigate();
    const {confidentialite,setconfidentialite}  = useContext(ConfidentialiteContext);
    const ContainerSignIn = useRef();
    const [mail, setmail] = useState("");
    const [password, setpassword] = useState(""); 
    const {token,settoken}  = useContext(AuthContext);
    const [erreurMsg, seterreurMsg] = useState("");
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const onclickCroix =()=>{
        props.setSignIn(false);
    }

    useEffect(() => {
      if(props.signIn===true){
        ContainerSignIn.current.style.display = "flex";
      }
      if(props.signIn===false){
        ContainerSignIn.current.style.display = "none";
      }
    }, [props.signIn,props.setSignIn])



    const valideForm = async (e)=>{
      
        e.preventDefault();
        if(mail===""){
          return seterreurMsg("Veuillez indiquer le mail.");
        }
        if(password===""){
          return seterreurMsg("Veuillez indiquer le password.");
        }
        const connection ={email:mail,password};
        

        await axios.post("/user/login",connection)
        .then((res)=>{
            setmail("");
            setpassword("");
           localStorage.setItem("token",res.data);
           settoken(res.data);
           props.settest(true);
        })
        .catch((err)=>seterreurMsg("bonjour"));
    }

    useEffect(() => {
      if(token){
       
        axios.get("/photo/getImage",config)
        .then((res)=>{
          props.setallImg(res.data)
          props.setSignIn(false);
          navigate("/");
        })
        .catch((err)=>console.log(err));
        
        axios.get('/photo/prefImage',config)
        .then((res)=>props.setimgPref(res.data[0].image))
        .catch((err)=>console.log(err));
      }
      else{
        return;
      }
    }, [token])
    

  return (
    <form ref={ContainerSignIn} className='ContainerSignIn' >
        <div className='SignInTitreBtn'>
            <h2>Se connecter</h2>
            <button onClick={onclickCroix}>
                <img src={croix} alt="" />
            </button>
        </div>
        <div className='SignInMailMdp'>
            <label htmlFor="">Email</label>
            <input value={mail} onChange={(e)=>{setmail(e.target.value);seterreurMsg("")}} placeholder='texte@exemple.com' type="text" />
            <label htmlFor="">Password</label>
            <input value={password} onChange={(e)=>{setpassword(e.target.value);seterreurMsg("")}} placeholder='*******' type="text" />
        </div>
        <div className='SignInLogIn'>
            <button onClick={valideForm}>Connexion</button>
        </div>
        <div className='SignInCreateAccount'>
            <p>Vous n'avez toujours pas de compte? Créer</p>
        </div>
    </form>
  )
}