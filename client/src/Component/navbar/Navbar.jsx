import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ConfidentialiteContext } from "../../Context/ConfidentialiteContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import "./navbar.css";
import AffichePhoto from "../affichePhoto/AffichePhoto";
import { useMediaQuery } from "react-responsive";
import menu from "../../photo/menu.png";
import croix from "../../photo/croix.png";

export default function Navbar(props) {
  const { token, settoken } = useContext(AuthContext);
  const { confidentialite, setconfidentialite } = useContext(
    ConfidentialiteContext
  );
  const [pseudo, setpseudo] = useState("");
  const [nom, setnom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [admin, setadmin] = useState(false);
  const [bolAffichePhoto, setbolAffichePhoto] = useState(false);
  const newNavPhone = useMediaQuery({ query: "(max-width: 990px)" });
  const [visibleNavResponsive, setvisibleNavResponsive] = useState(false);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const onclickConnexion = () => {
    props.setSignIn(true);
    props.setSignUp(false);
  };

  const onclickInscription = () => {
    props.setSignUp(true);
    props.setSignIn(false);
  };

  const adminOuNon = async () => {
    await axios
      .get("/admin", config)
      .then((res) => {
        if (res.data != "admin") {
          return setadmin(false);
        }
        setadmin(true);
      })
      .catch((err) => setadmin(false));
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (token) {
      axios
        .get("/user/recupInfoUser", config)
        .then((res) => {
          setpseudo(res.data.pseudonyme);
          setnom(res.data.nom[0].toUpperCase());
          setPrenom(res.data.prenom[0].toUpperCase());
        })
        .catch((err) => console.log(err));
    }
    if (!token) {
      return;
    }
  }, [token]);

  const modifPhoto = () => {
    setbolAffichePhoto(!bolAffichePhoto);
  };

  function togleNavResponsive() {
    setvisibleNavResponsive(!visibleNavResponsive);
  }

  if (token && !newNavPhone) {
    return (
      <div class="fixed top-0 z-50 h-24 w-screen  flex items-center justify-center ">
        <nav class="sup1600:w-1200 h-20 services-item w-3/4 bg-gradient-to-r from-vertFoncer from-0%  to-vertClair to-100%  flex items-center justify-evenly rounded-bl-3xl rounded-tr-3xl ">
          <Link
            class="sup1600:text-3xl text-blanc text-xl no-underline transition-transform ease-in-out duration-300 hover:scale-90 hover:opacity-60 hover:cursor-pointer"
            to={"/"}
          >
            Accueil{" "}
          </Link>
          <Link
            class="sup1600:text-3xl text-blanc text-xl no-underline transition-transform ease-in-out duration-300 hover:scale-90 hover:opacity-60 hover:cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("confidentialite");
              setconfidentialite("");
              props.setallImg([]);
              settoken("");
              setadmin(false);
              props.settest(false);
              props.setimgPref("");
            }}
            to={"/#/connexion"}
          >
            Deconnexion{" "}
          </Link>
          <Link class="sup1600:text-3xl text-blanc text-xl no-underline transition-transform ease-in-out duration-300 hover:scale-90 hover:opacity-60 hover:cursor-pointer">
            Support{" "}
          </Link>
          <Link class="sup1600:text-3xl text-blanc text-xl no-underline hover:cursor-default">
            {pseudo}{" "}
          </Link>
        </nav>
        {props.imgPref.length > 0 ? (
          <p
            onClick={modifPhoto}
            className=" sup1300:right-percent5 absolute top-1/2 right-percent2  transform -translate-y-1/2 flex flex-row  items-center justify-center rounded-full w-auto h-auto border-double border-vertClair border-2 px-2 "
          >
            <img
              alt=""
              className="h-20 max-h-20 rounded-full hover:cursor-pointer"
              src={props.imgPref}
            ></img>
          </p>
        ) : (
          <p
            onClick={modifPhoto}
            className="sup1300:right-percent5 fixed top-percent5 right-percent2 text-base  bg-vertFoncer text-blanc rounded-full py-4 px-3 transform -translate-y-2/4 hover:cursor-pointer"
          >
            {" "}
            <span>{nom} .</span> <span>{prenom}</span>{" "}
          </p>
        )}
        {bolAffichePhoto ? (
          <AffichePhoto
            idPost={props.idPost}
            setidPost={props.setidPost}
            allMsg={props.allMsg}
            setallMsg={props.setallMsg}
            bolAffichePhoto={bolAffichePhoto}
            setbolAffichePhoto={setbolAffichePhoto}
            setallImg={props.setallImg}
            allImg={props.allImg}
            imgPref={props.imgPref}
            setimgPref={props.setimgPref}
          />
        ) : (
          " "
        )}
      </div>
    );
  }
  if (!token && !newNavPhone) {
    return (
      <div class="fixed top-0 z-50 h-24 w-screen  flex items-center justify-center ">
        <nav class="sup1600:w-1200 h-20 services-item w-3/4 bg-gradient-to-r from-vertFoncer from-0%  to-vertClair to-100%  flex items-center justify-evenly rounded-bl-3xl rounded-tr-3xl ">
          <Link
            class="text-blanc text-3xl no-underline transition-transform ease-in-out duration-300 hover:scale-90 hover:opacity-60 hover:cursor-pointer"
            to={"/"}
          >
            Accueil{" "}
          </Link>
          <Link
            class="text-blanc text-3xl no-underline transition-transform ease-in-out duration-300 hover:scale-90 hover:opacity-60 hover:cursor-pointer"
            onClick={onclickConnexion}
          >
            Connexion{" "}
          </Link>
          <Link
            class="text-blanc text-3xl no-underline transition-transform ease-in-out duration-300 hover:scale-90 hover:opacity-60 hover:cursor-pointer"
            onClick={onclickInscription}
          >
            Inscription{" "}
          </Link>
          <Link class="text-blanc text-3xl no-underline transition-transform ease-in-out duration-300 hover:scale-90 hover:opacity-60 hover:cursor-pointer">
            Support{" "}
          </Link>
        </nav>
      </div>
    );
  }

  if (token && newNavPhone) {
    return (
      <div className="w-screen h-24 relative flex flex-row items-center justify-center ">
        <div className="fixed top-0 w-screen h-16 flex flex-row items-center justify-between ">
          <img
            className="h-10 max-w-20 ml-12 hover:cursor-pointer"
            onClick={togleNavResponsive}
            src={menu}
            alt=""
          />
          {props.imgPref.length > 0 ? (
            <img
              onClick={modifPhoto}
              className="rounded-full  border-double border-vertClair border-2 hover:cursor-pointer h-16 mr-12 px-1"
              alt=""
              src={props.imgPref}
            ></img>
          ) : (
            <p
              onClick={modifPhoto}
              className="mr-12 text-base text-blanc rounder-full py-4 px-3"
            >
              {" "}
              <span className="pl-1 hover:cursor-pointer">{nom} .</span>{" "}
              <span className="pl-1 hover:cursor-pointer">{prenom}</span>{" "}
            </p>
          )}
        </div>
        {bolAffichePhoto ? (
          <AffichePhoto
            idPost={props.idPost}
            setidPost={props.setidPost}
            allMsg={props.allMsg}
            setallMsg={props.setallMsg}
            bolAffichePhoto={bolAffichePhoto}
            setbolAffichePhoto={setbolAffichePhoto}
            setallImg={props.setallImg}
            allImg={props.allImg}
            imgPref={props.imgPref}
            setimgPref={props.setimgPref}
          />
        ) : (
          " "
        )}
        {visibleNavResponsive ? (
          <div className="fixed z-10 top-0 w-screen h-screen bg-vertFoncer">
            <nav className="w-full h-full flex flex-col items-center justify-evenly">
              <Link onClick={togleNavResponsive} className="text-xl" to={"/"}>
                Accueil{" "}
              </Link>
              <Link
                className="text-xl"
                onClick={() => {
                  togleNavResponsive();
                  localStorage.removeItem("token");
                  localStorage.removeItem("confidentialite");
                  setconfidentialite("");
                  props.setallImg([]);
                  settoken("");
                  setadmin(false);
                  props.settest(false);
                  props.setimgPref("");
                }}
                to={"/#/connexion"}
              >
                Deconnexion{" "}
              </Link>
              {admin === true ? (
                <Link className="text-xl" to={"/admin"}>
                  admin{" "}
                </Link>
              ) : (
                ""
              )}
              <Link onClick={togleNavResponsive} className="text-xl">
                Support{" "}
              </Link>
              <p className="w-7 h-7 absolute top-percent5 left-percent7  text-blanc text-2xl no-underline flex flex-row items-center justify-center">
                {" "}
                {pseudo}{" "}
              </p>
              <img
                onClick={togleNavResponsive}
                className="absolute top-percent5 right-percent7 w-7 h-7 hover:cursor-pointer"
                src={croix}
                alt=""
              />
            </nav>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  if (!token && newNavPhone) {
    return (
      <div className="w-screen h-24 relative flex flex-row items-center justify-center">
        <div className="fixed top-0 w-screen  h-16 flex flex-row items-center justify-between">
          <img
            className="h-10 max-w-20 ml-12 hover:cursor-pointer"
            onClick={() => {
              togleNavResponsive();
              props.setSignIn(false);
              props.setSignUp(false);
            }}
            src={menu}
            alt=""
          />
        </div>
        {visibleNavResponsive ? (
          <div className="fixed z-10 top-0 w-screen h-screen bg-vertFoncer">
            <nav className="w-full h-full flex flex-col items-center justify-evenly">
              <Link className="text-xl" to={"/"}>
                Accueil{" "}
              </Link>
              <Link className="text-xl" to={"/forum"}>
                forum{" "}
              </Link>
              <Link
                className="text-xl"
                onClick={() => {
                  togleNavResponsive();
                  onclickConnexion();
                }}
              >
                Connexion{" "}
              </Link>
              <Link
                className="text-xl"
                onClick={() => {
                  togleNavResponsive();
                  onclickInscription();
                }}
              >
                Inscription{" "}
              </Link>
              <Link
                onClick={() => {
                  togleNavResponsive();
                  onclickConnexion();
                }}
                className="text-xl"
              >
                Support{" "}
              </Link>
              <img
                onClick={togleNavResponsive}
                className="absolute top-percent5 right-percent7 w-7 h-7 hover:cursor-pointer"
                src={croix}
                alt=""
              />
            </nav>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
