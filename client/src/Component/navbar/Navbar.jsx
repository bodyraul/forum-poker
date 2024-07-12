import React from 'react'
import { useContext } from 'react';
import { AuthContext } from"../../Context/AuthContext";
import { ConfidentialiteContext } from '../../Context/ConfidentialiteContext';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import "./navbar.css";
import AffichePhoto from '../affichePhoto/AffichePhoto';

export default function Navbar(props) {
    const { token,settoken } = useContext(AuthContext);
    const { confidentialite,setconfidentialite } = useContext(ConfidentialiteContext);
    const [pseudo, setpseudo] = useState("");
    const [nom, setnom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [admin, setadmin] = useState(false);
    const [bolAffichePhoto, setbolAffichePhoto] = useState(false);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };


    const onclickConnexion = ()=>{
      props.setSignIn(true);
      props.setSignUp(false);
    }

    const onclickInscription = ()=>{
      props.setSignUp(true);
      props.setSignIn(false);
    }

     const adminOuNon = async ()=>{
        await axios.get("/admin",config)
        .then((res)=>{
          if(res.data != 'admin'){
            return setadmin(false);
            
          }
          setadmin(true);
        })
        .catch((err)=>(setadmin(false)))
      }

    

    useEffect(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if(token){
        axios.get("/user/recupInfoUser",config)
        .then((res)=>{
          setpseudo(res.data.pseudonyme)
          setnom(res.data.nom[0].toUpperCase())
          setPrenom(res.data.prenom[0].toUpperCase())
        })
        .catch((err)=>console.log(err));
      }      
      if(!token){
        return;
      }
    }, [token])

    const modifPhoto = ()=>{
      setbolAffichePhoto(!bolAffichePhoto);
    }

   
    if(token) {
      return(
        <div className='containerNav'>
          <nav className='navbar'>
              <Link className='AllLink' to={"/"}>Accueil </Link>
              <Link className='AllLink' to={"/forum"}>forum </Link>
              <Link className='AllLink' onClick={()=>{
              localStorage.removeItem("token");
              localStorage.removeItem("confidentialite");
              setconfidentialite("");
              props.setallImg([]);
              settoken("");
              setadmin(false);
              props.settest(false);
              props.setimgPref('');
              }} to={"/#/connexion"}>Deconnexion </Link>
            {admin===true? <Link className='AllLink' to={"/admin"}>admin </Link> : ""}
          </nav>
          {props.imgPref.length>0 ? <p  onClick={modifPhoto}  id='imgPref'><img alt='' src={props.imgPref}></img></p> :  <p onClick={modifPhoto} id='nameNav'> <span>{nom} .</span>  <span>{prenom}</span> </p>}
          {bolAffichePhoto ? <AffichePhoto changeAllMsgOnImgSup={props.changeAllMsgOnImgSup} setchangeAllMsgOnImgSup={props.setchangeAllMsgOnImgSup} bolAffichePhoto={bolAffichePhoto} setbolAffichePhoto={setbolAffichePhoto} setallImg= {props.setallImg} allImg = {props.allImg} imgPref={props.imgPref} setimgPref={props.setimgPref} /> : " "}
        </div>
     )
    }if(!token){
      return(
        <div className='containerNav'>
          <nav className='navbar'>
            <Link className='AllLink' to={"/"}>Accueil </Link>
            <Link className='AllLink'  to={"/forum"}>forum </Link>
            <Link className='AllLink' onClick={onclickConnexion}  >Connexion </Link>
            <Link className='AllLink' onClick={onclickInscription}  >Inscription </Link>
           </nav>
        </div>
     )
    }
      
  }