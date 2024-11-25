import React from "react";
import "./signUp.css";
import { useState } from "react";
import { useEffect } from "react";
import croix from "../../photo/croix.png";
import { useRef } from "react";
import axios from "axios";

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
    const mailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
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
      return seterrorMsg(
        "le pseudonyme ne peut contenir plus de 15 caractères."
      );
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
    axios
      .post("/user/register", user)
      .then((res) => {
        props.setSignUp(false);
        props.setSignIn(true);
      })
      .catch((err) => seterrorMsg(err.response.data));
  }

  const ContainerSignUp = useRef();

  const onclickCroix = () => {
    props.setSignUp(false);
  };

  useEffect(() => {
    if (props.signUp === true) {
      ContainerSignUp.current.style.display = "flex";
      seterrorMsg("");
    }
    if (props.signUp === false) {
      ContainerSignUp.current.style.display = "none";
    }
  }, [props.signUp]);

  return (
    <form
      ref={ContainerSignUp}
      className="sup990:px-4 sup990:w-600 sup990:h-680 fixed top-2/4 left-2/4 w-350 h-600  bg-gradient-to-r from-vertFoncer from-0%  to-vertClair to-100% z-50 -translate-x-2/4 -translate-y-2/4 rounded-3xl py-9 px-3 flex flex-col items-center justify-between "
      onSubmit={validerForm}
    >
      <div className="flex items-center justify-center w-full relative text-blanc">
        <h2 className="sup990:text-2xl text-lg">Créer un compte</h2>
        <button
          className="size-7 absolute right-0 rounded-full border-none bg-noir transition-all duration-200 ease-in-out hover:rotate-90 hover:cursor-pointer"
          onClick={onclickCroix}
        >
          <img className="w-7" src={croix} alt="" />
        </button>
      </div>
      <div className="w-full flex items-start justify-evenly">
        <div className="w-2/5 flex items-center justify-center">
          <label className="sup990:text-2xl mb-2 text-blanc text-lg" htmlFor="">
            Nom
          </label>
        </div>
        <div className="w-2/5 flex items-center justify-center">
          <label className="sup990:text-2xl mb-2 text-blanc text-lg" htmlFor="">
            Prénom
          </label>
        </div>
      </div>
      <div className="w-full flex items-start justify-evenly">
        <input
          className="sup990:text-base sup990:placeholder:text-base focus:outline-blanc focus:outline-double mb-5 p-2 w-2/5 rounded-lg border border-solid border-blanc text-xs bg-vertFoncer placeholder:text-blanc placeholder:text-xs"
          name="nom"
          value={nom}
          onChange={(e) => {
            setnom(e.target.value);
            seterrorMsg("");
          }}
          placeholder="exemple : Peria"
          type="text"
        />
        <input
          className="sup990:text-base sup990:placeholder:text-base focus:outline-blanc focus:outline-double mb-5 p-2 w-2/5 rounded-lg border border-solid border-blanc text-xs bg-vertFoncer placeholder:text-blanc placeholder:text-xs"
          value={prenom}
          onChange={(e) => {
            setprenom(e.target.value);
            seterrorMsg("");
          }}
          placeholder="exemple : Aurelien"
          type="text"
        />
      </div>
      <div className="w-full flex items-start justify-evenly">
        <div className="w-2/5 flex items-center justify-center">
          <label className="sup990:text-2xl mb-2 text-blanc text-lg" htmlFor="">
            Pseudonyme
          </label>
        </div>
        <div className="w-2/5 flex items-center justify-center">
          <label className="sup990:text-2xl mb-2 text-blanc text-lg" htmlFor="">
            Mail
          </label>
        </div>
      </div>
      <div className="w-full flex items-start justify-evenly">
        <input
          className="sup990:text-base sup990:placeholder:text-base focus:outline-blanc focus:outline-double mb-5 p-2 w-2/5 rounded-lg border border-solid border-blanc text-xs bg-vertFoncer placeholder:text-blanc placeholder:text-xs"
          value={pseudonyme}
          onChange={(e) => {
            setpseudonyme(e.target.value);
            seterrorMsg("");
          }}
          placeholder="exemple : Spiderman"
          type="text"
        />
        <input
          className="sup990:text-base sup990:placeholder:text-base focus:outline-blanc focus:outline-double mb-5 p-2 w-2/5 rounded-lg border border-solid border-blanc text-xs bg-vertFoncer placeholder:text-blanc placeholder:text-xs"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
            seterrorMsg("");
          }}
          placeholder="texte@exemple.com"
          type="text"
        />
      </div>
      <div className="w-full flex items-start justify-evenly">
        <div className="w-2/5 flex items-center justify-center">
          <label className="sup990:text-2xl mb-2 text-blanc text-lg" htmlFor="">
            Mot de passe
          </label>
        </div>
        <div className="w-2/5 flex items-center justify-center">
          <label className="sup990:text-2xl mb-2 text-blanc text-lg" htmlFor="">
            Confirmation
          </label>
        </div>
      </div>
      <div className="w-full flex items-start justify-evenly">
        <input
          className="sup990:text-base sup990:placeholder:text-base focus:outline-blanc focus:outline-double mb-5 p-2 w-2/5 rounded-lg border border-solid border-blanc text-xs bg-vertFoncer placeholder:text-blanc placeholder:text-xs"
          value={password}
          onChange={(e) => {
            setpassword(e.target.value);
            seterrorMsg("");
          }}
          placeholder="*******"
          type="text"
        />
        <input
          className="sup990:text-base sup990:placeholder:text-base focus:outline-blanc focus:outline-double mb-5 p-2 w-2/5 rounded-lg border border-solid border-blanc text-xs bg-vertFoncer placeholder:text-blanc placeholder:text-xs"
          value={confirmPassword}
          onChange={(e) => {
            setconfirmPassword(e.target.value);
            seterrorMsg("");
          }}
          placeholder="*******"
          type="text"
        />
      </div>
      <div className="sup990:text-2xl sup990:h-7 text-error text-lg h-6 w-full text-center">
        {errorMsg}
      </div>
      <div className="flex items-center justify-center w-full">
        <button className="sup990:text-base w-2/5 p-2 rounded-lg border border-solid border-blanc transition-all duration-200 ease-in-out hover:cursor-pointer hover:border-bleu hover:bg-blanc hover:text-vertFoncer text-blanc bg-vertFoncer text-sm ">
          Créer
        </button>
      </div>
    </form>
  );
}
