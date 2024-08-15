import React from 'react'
import './signUp.css'
import { useState } from 'react'
import { useEffect } from 'react';
import croix from '../../photo/croix.png'
import { useRef } from 'react';
import axios from 'axios';

export default function SignUp(props) {

  const [nom, setnom] = useState("");
  const [prenom, setprenom] = useState("");
  const [pseudonyme, setpseudonyme] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [errorMsg, seterrorMsg] = useState("");

  function validerForm(e) {
    e.preventDefault();
    const notNombre = new RegExp("^[^0-9]+$");
    const mailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (nom.length === 0) {
      return seterrorMsg("le nom ne peut pas être vide.");
    }
    if (!notNombre.test(nom)) {
      return seterrorMsg("le nom ne peut pas contenir de chiffre.");
    }
    if (prenom.length === 0) {
      return seterrorMsg("le prénom ne peut pas être vide.");
    }
    if (!notNombre.test(prenom)) {
      return seterrorMsg("le prénom ne peut pas contenir de chiffre.");
    }
    if (pseudonyme.length === 0) {
      return seterrorMsg("le pseudonyme ne peut pas être vide.");
    }
    if (pseudonyme.length > 15) {
      return seterrorMsg("le pseudonyme ne peut contenir plus de 15 caractères.");
    }
    if (email.length === 0) {
      return seterrorMsg("l'email ne peut pas être vide.");
    }
    if (!mailRegex.test(email)) {
      return seterrorMsg("Cela ne correspond pas à un email.");
    }
    if (password.length === 0) {
      return seterrorMsg("Le mot de passe ne peut pas être vide");
    }
    if (confirmPassword !== password) {
      return seterrorMsg("Les deux mots de passe sont différents.");
    }
    const user = { nom, prenom, pseudonyme, email, password };
    axios.post("/user/register", user)
      .then((res) => {
        props.setSignUp(false);
        props.setSignIn(true);
      })
      .catch((err) => seterrorMsg(err.response.data));

  }

  const ContainerSignUp = useRef();

  const onclickCroix =()=>{
    props.setSignUp(false);
}

  useEffect(() => {
    if(props.signUp===true){
      ContainerSignUp.current.style.display = "flex";
      seterrorMsg("");
    }
    if(props.signUp===false){
      ContainerSignUp.current.style.display = "none";
    }
  }, [props.signUp])


  return (
    <form ref={ContainerSignUp} className='ContainerSignUp' onSubmit={validerForm}>
        <div className='SignUpTitreBtn'>
            <h2>Créer un compte</h2>
            <button onClick={onclickCroix}>
                <img src={croix} alt="" />
            </button>
        </div>
        <div className='SignUpLabel'>
            <div className='divLabel'>
                <label htmlFor="">Nom</label>
            </div>
            <div className='divLabel'>
                <label htmlFor="">Prénom</label>
            </div>
           
        </div>
        <div className='SignUpInput'>
            <input name='nom' value={nom}  onChange={(e)=>{setnom(e.target.value);seterrorMsg("")}} placeholder='exemple : Peria' type="text" />
            <input value={prenom} onChange={(e)=>{setprenom(e.target.value);seterrorMsg("")}} placeholder='exemple : Aurelien' type="text" />
        </div>
        <div className='SignUpLabel'>
            <div className='divLabel'>
                <label htmlFor="">Pseudonyme</label>
            </div>
            <div className='divLabel'>
                 <label htmlFor="">Mail</label>
            </div>
        </div>
        <div className='SignUpInput'>
            <input value={pseudonyme} onChange={(e)=>{setpseudonyme(e.target.value);seterrorMsg("")}} placeholder='exemple : Spiderman' type="text" />
            <input value={email} onChange={(e)=>{setemail(e.target.value);seterrorMsg("")}} placeholder='texte@exemple.com' type="text" />
        </div>
        <div className='SignUpLabel'>
            <div className='divLabel'>
                <label htmlFor="">Mot de passe</label>
            </div>
            <div className='divLabel'>
                <label htmlFor="">Confirmation </label>
            </div>
        </div>
        <div className='SignUpInput'>
            <input value={password} onChange={(e)=>{setpassword(e.target.value);seterrorMsg("")}} placeholder='*******' type="text" />
            <input value={confirmPassword} onChange={(e)=>{setconfirmPassword(e.target.value);seterrorMsg("")}} placeholder='*******' type="text" />
        </div>
        <div className='partieMsgErreurs'>
            {errorMsg}
        </div>
        <div className='SignUpLogIn'>
            <button>Créer</button>
        </div>
    </form>
  )
}