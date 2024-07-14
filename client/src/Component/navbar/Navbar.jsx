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
import { useMediaQuery } from 'react-responsive';

export default function Navbar(props) {
    const { token,settoken } = useContext(AuthContext);
    const { confidentialite,setconfidentialite } = useContext(ConfidentialiteContext);
    const [pseudo, setpseudo] = useState("");
    const [nom, setnom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [admin, setadmin] = useState(false);
    const [bolAffichePhoto, setbolAffichePhoto] = useState(false);
    const newNavPhone = useMediaQuery({ query: '(max-width: 990px)' });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log(newNavPhone);

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

   
    if(token && newNavPhone===false) {
      return(
        <div className='containerNav'>
          <nav className='navbar'>
              <Link className='AllLink' to={"/"}>Accueil </Link>
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
            <Link className='AllLink' to={"/forum"}>{pseudo} </Link>
          </nav>
          {props.imgPref.length>0 ? <p  onClick={modifPhoto}  id='imgPref'><img alt='' src={props.imgPref}></img></p> :  <p onClick={modifPhoto} id='nameNav'> <span>{nom} .</span>  <span>{prenom}</span> </p>}
          {bolAffichePhoto ? <AffichePhoto idPost={props.idPost} setidPost={props.setidPost} allMsg={props.allMsg} setallMsg={props.setallMsg} bolAffichePhoto={bolAffichePhoto} setbolAffichePhoto={setbolAffichePhoto} setallImg= {props.setallImg} allImg = {props.allImg} imgPref={props.imgPref} setimgPref={props.setimgPref} /> : " "}
        </div>
     )
    }if(!token && newNavPhone===false){
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

    if(token && newNavPhone){
      return(
        <p>bonjour</p>
      )
    }
      
  }