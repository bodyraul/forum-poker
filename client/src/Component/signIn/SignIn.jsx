import React from "react";
import "./signIn.css";
import { useEffect } from "react";
import { useRef } from "react";
import croix from "../../photo/croix.png";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useState } from "react";
import axios from "axios";

export default function SignUp(props) {
  const navigate = useNavigate();
  const ContainerSignIn = useRef();
  const [mail, setmail] = useState("");
  const [password, setpassword] = useState("");
  const { token, settoken } = useContext(AuthContext);
  const [erreurMsg, seterreurMsg] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const onclickCroix = () => {
    props.setSignIn(false);
  };

  useEffect(() => {
    if (props.signIn === true) {
      ContainerSignIn.current.style.display = "flex";
    }
    if (props.signIn === false) {
      ContainerSignIn.current.style.display = "none";
    }
  }, [props.signIn, props.setSignIn]);

  const valideForm = async (e) => {
    e.preventDefault();
    if (mail === "") {
      return seterreurMsg("Veuillez indiquer le mail.");
    }
    if (password === "") {
      return seterreurMsg("Veuillez indiquer le password.");
    }
    const connection = { email: mail, password };

    await axios
      .post("/user/login", connection)
      .then((res) => {
        setmail("");
        setpassword("");
        localStorage.setItem("token", res.data);
        settoken(res.data);
        props.settest(true);
      })
      .catch((err) => seterreurMsg("bonjour"));
  };

  useEffect(() => {
    if (token) {
      axios
        .get("/photo/getImage", config)
        .then((res) => {
          props.setallImg(res.data);
          props.setSignIn(false);
          navigate("/");
        })
        .catch((err) => console.log(err));

      axios
        .get("/photo/prefImage", config)
        .then((res) => props.setimgPref(res.data[0].image))
        .catch((err) => console.log(err));
    } else {
      return;
    }
  }, [token]);

  return (
    <form
      ref={ContainerSignIn}
      className="sup377:w-350 sup990:w-418 sup990:p-9 fixed top-2/4 left-2/4 w-full h-500 bg-gradient-to-r from-vertFoncer from-0%  to-vertClair to-100% z-50 -translate-y-2/4 -translate-x-2/4 rounded-3xl p-7 flex flex-col items-center justify-between"
    >
      <div className="sup990:text-2xl flex items-center justify-between w-full text-blanc text-xl ">
        <h2>Se connecter</h2>
        <button
          className="size-7 absolute right-5 rounded-s-full border-none bg-noir"
          onClick={onclickCroix}
        >
          <img
            className="transition-all hover:rotate-90 hover:cursor-pointer"
            src={croix}
            alt=""
          />
        </button>
      </div>
      <div className="w-full flex flex-col items-start justify-between">
        <label className="sup990:text-xl mb-3 text-blanc text-base" htmlFor="">
          Email
        </label>
        <input
          className="sup990:text-base rounded-lg focus:outline-blanc focus:outline-double mb-5 p-2 border border-solid border-blanc text-blanc text-xs bg-vertFoncer placeholder:text-blanc"
          value={mail}
          onChange={(e) => {
            setmail(e.target.value);
            seterreurMsg("");
          }}
          placeholder="texte@exemple.com"
          type="text"
        />
        <label className="sup990:text-xl mb-3 text-blanc text-base" htmlFor="">
          Password
        </label>
        <input
          className="sup990:text-base rounded-lg focus:outline-blanc focus:outline-double mb-5 p-2 border border-solid border-blanc text-blanc text-xs bg-vertFoncer placeholder:text-blanc"
          value={password}
          onChange={(e) => {
            setpassword(e.target.value);
            seterreurMsg("");
          }}
          placeholder="*******"
          type="text"
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <button
          className="sup990:text-base sup990:w-full w-10/12 p-2 border border-solid rounded-lg border-blanc text-blanc bg-vertFoncer text-xs transition-all duration-200 ease-in-out hover:cursor-pointer hover:border-vertFoncer hover:bg-blanc hover:text-vertFoncer"
          onClick={valideForm}
        >
          Connexion
        </button>
      </div>
      <p className="sup990:text-xl text-error text-base h-6">{erreurMsg}</p>
      <div className="sup990:text-lg flex items-center justify-between w-full text-blanc text-base">
        <p>Vous n'avez toujours pas de compte? Créer</p>
      </div>
    </form>
  );
}
