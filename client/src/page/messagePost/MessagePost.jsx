import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import "./messagePost.css";
import LikeActif from "../../photo/likeActif.png";
import LikeNoActif from "../../photo/likeNoActif.png";
import signalerNoActif from "../../photo/signalerNoActif.png";
import signalerActif from "../../photo/signalerActif.png";
import PaginationPost from "../../Component/paginationPost/PaginationPost";

export default function MessagesPost(props) {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [post, setpost] = useState({});
  const [listeSignalementUser, setlisteSignalementUser] = useState([]);
  const [listeLikeUser, setlisteLikeUser] = useState([]);
  const [valueMsgForm, setvalueMsgForm] = useState("");
  const [messageErreur, setmessageErreur] = useState("");
  const [idUserConnecte, setidUserConnecte] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [postPerPage] = useState(4);
  const paraMessageErreur = useRef();
  const titrecontenu = useRef();
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //affichage des messages au chargement , du post et des signalements de l'user pour les msg du post
  useEffect(() => {
    async function messages() {
      await axios
        .get(`/message/afficherMesMessages/${id}`, config)
        .then((res) => {
          props.setallMsg(res.data);
        })
        .catch((err) => console.log(err));
    }

    async function monPoste() {
      await axios
        .get(`/post/lePoste/${id}`, config)
        .then((res) => {
          setpost(res.data);
        })
        .catch((err) => console.log(err));
    }

    async function allLike() {
      await axios
        .get(`/like/AfficherMessageLikerParPost/${id}`, config)
        .then((res) => {
          setlisteLikeUser(res.data);
        })
        .catch((err) => console.log(err));
    }

    async function signalements() {
      await axios
        .get(`/signalement/AfficherMessageSignalerParPost/${id}`, config)
        .then((res) => {
          setlisteSignalementUser(res.data);
        })
        .catch((err) => console.log(err));
    }

    async function getIdUser() {
      await axios
        .get(`/user/recupIdUserConnecte`, config)
        .then((res) => {
          setidUserConnecte(res.data);
        })
        .catch((err) => console.log(err));
    }
    messages();
    monPoste();
    allLike();
    signalements();
    getIdUser();
    props.setidPost(id);

    majScrollMessage();
  }, []);

  useEffect(() => {
    majScrollMessage();
  }, [props.allMsg, currentPage]);

  const like = (id) => {
    for (let index = 0; index < listeLikeUser.length; index++) {
      if (id === listeLikeUser[index].idMessage) {
        return (
          <img
            alt=""
            class="sup670:w-8 w-7 pb-1 pr-2 transition-all duration-200 ease-in-out origin-left hover:cursor-pointer hover:-rotate-6"
            onClick={() => modifierLike(id, true)}
            src={LikeActif}
          ></img>
        );
      }
    }
    return (
      <img
        alt=""
        class="sup670:w-8 w-7 pb-1 pr-2 transition-all duration-200 ease-in-out origin-left hover:cursor-pointer hover:-rotate-6"
        onClick={() => modifierLike(id, false)}
        src={LikeNoActif}
      ></img>
    );
  };

  async function modifierLike(id, bol) {
    if (bol) {
      await axios
        .delete(`/like/supprimerLike/${id}`, config)
        .then((res) => {
          setlisteLikeUser(listeLikeUser.filter((el) => el.idMessage !== id));
          for (let index = 0; index < props.allMsg.length; index++) {
            if (props.allMsg[index]._id === id) {
              props.allMsg[index].nbLike -= 1;
            }
          }
        })
        .catch((err) => console.log(err));
    }
    if (!bol) {
      const like = {
        nom: "oui",
      };
      await axios
        .post(`/like/creerLike/${id}`, like, config)
        .then((res) => {
          setlisteLikeUser(res.data);
          for (let index = 0; index < props.allMsg.length; index++) {
            if (props.allMsg[index]._id === id) {
              props.allMsg[index].nbLike += 1;
            }
          }
        })
        .catch((err) => console.log(err));
    }
  }

  const signaler = (id) => {
    for (let index = 0; index < listeSignalementUser.length; index++) {
      if (id === listeSignalementUser[index].idMessage) {
        return (
          <div class="flex items-center justify-start">
            <img
              class="sup670:w-8 w-7 pb-1 pr-2 transition-all duration-200 ease-in-out origin-left hover:cursor-pointer hover:-rotate-6"
              onClick={() => modifierSignalement(id, true)}
              alt=""
              src={signalerActif}
            ></img>
            <span className="sup670:text-base text-xs">Ne plus signaler</span>
          </div>
        );
      }
    }
    return (
      <div class="flex items-center justify-start">
        <img
          class="sup670:w-8 w-7 pb-1 pr-2 transition-all duration-200 ease-in-out origin-left hover:cursor-pointer hover:-rotate-6"
          onClick={() => modifierSignalement(id, false)}
          alt=""
          src={signalerNoActif}
        ></img>
        <span className="sup670:text-base text-xs">Signaler</span>
      </div>
    );
  };

  async function modifierSignalement(id, bol) {
    if (bol) {
      await axios
        .delete(`/signalement/signalementMessage/${id}`, config)
        .then((res) => {
          setlisteSignalementUser(
            listeSignalementUser.filter((el) => el.idMessage !== id)
          );
        })
        .catch((err) => console.log(err));
    }
    if (!bol) {
      const like = {
        nom: "oui",
      };
      await axios
        .post(`/signalement/signalementMessage/${id}`, like, config)
        .then((res) => {
          setlisteSignalementUser(res.data);
        })
        .catch((err) => console.log(err));
    }
  }

  const valideFormMessage = async () => {
    paraMessageErreur.current.style.color = "#ef4444";
    if (!token) {
      return setmessageErreur(
        "Vous devez être connecté pour écrire un message."
      );
    }
    if (valueMsgForm.length === 0) {
      return setmessageErreur("le message ne peut pas être vide");
    }
    if (valueMsgForm.length > 400) {
      return setmessageErreur("le message ne peut pas dépasser 400 caractères");
    }

    const newMessage = {};
    newMessage.contenu = valueMsgForm;

    await axios
      .post(`/message/creerMessage/${id}`, newMessage, config)
      .then((res) => {
        paraMessageErreur.current.style.color = "#44ADA8";
        setmessageErreur("message Créé.");
        setvalueMsgForm("");
      })
      .catch((err) => console.log(err));

    await axios
      .get(`/message/afficherMesMessages/${id}`, config)
      .then((res) => {
        props.setallMsg(res.data);
        const updatedValue = post.nombreMessages + 1;
        setpost((post) => ({
          ...post,
          nombreMessages: updatedValue,
        }));
      })
      .catch((err) => console.log(err));
  };

  const onclickTextArea = () => {
    setmessageErreur("");
  };

  function afficheImgOnMajImg(element) {
    if (element.image.length > 0 && element.idUser === id) {
      return (
        <p class="flex flex-row  items-center justify-center rounded-full w-auto h-auto border-double border-vertClair border-2 px-2 mr-2">
          <img
            class="h-16 max-h-16 rounded-full hover:cursor-pointer"
            src={props.imgPref}
            alt=""
          />
        </p>
      );
    }
    if (element.image.length > 0 && element.idUser !== id) {
      return (
        <p class=" flex flex-row  items-center justify-center rounded-full w-auto h-auto border-double border-vertClair border-2 px-2 mr-2">
          <img
            class="sup670:h-16 sup670:max-h-16 h-14 max-h-14 rounded-full hover:cursor-pointer"
            src={element.image}
            alt=""
          />
        </p>
      );
    }
    if (props.imgPref.length === 0) {
      return (
        <p class="mr-2 text-xl bg-vertFoncer text-blanc rounded-full size-12 flex items-center justify-center">
          <span class="uppercase text-xs ">
            {element.nomCreateurMessage[0].toUpperCase() + " . "}
          </span>
          <span class="pl-1 text-xs">
            {element.prenomCreateurMessage[0].toUpperCase()}
          </span>
        </p>
      );
    }
  }

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const allPostPerPage = props.allMsg.slice(firstPostIndex, lastPostIndex);
  const paginate = (pageNumber) => setcurrentPage(pageNumber);

  function afficheMsgNbMessages() {
    if (allPostPerPage.length === 0) {
      return (
        <p class="sup670:text-4xl text-center text-2xl text-vertFoncer ">
          Aucune réponse{" "}
        </p>
      );
    }
    if (allPostPerPage.length === 1) {
      return (
        <p class="sup670:text-4xl text-center text-2xl text-vertFoncer ">
          une réponse{" "}
        </p>
      );
    }
    if (allPostPerPage.length >= 1) {
      return (
        <p class="sup670:text-4xl text-center text-2xl text-vertFoncer  ">
          {" "}
          {post.nombreMessages} réponses{" "}
        </p>
      );
    }
  }

  function majScrollMessage() {
    const allparaVisible = document.querySelectorAll(".VisibleContenu");
    const allparaCacher = document.querySelectorAll(".NoVisibleContenu");

    allparaCacher.forEach((element, index) => {
      if (element.clientHeight > allparaVisible[index].clientHeight) {
        allparaVisible[index].classList.remove("noActive");
        allparaVisible[index].classList.add("active");
      }
    });
  }
  return (
    <div class="sup990:mt-48 w-screen mt-10">
      <p class="sup670:text-4xl text-center text-2xl text-vertFoncer mt-12">
        {" "}
        Post selectionné
      </p>
      <div class=" sup990:w-11/12 sup1600:w-1400 w-full mt-14 mb-12 mx-auto">
        <div class="h-12 flex items-center border-solid border border-gris bg-blanc text-vertFoncer font-bold text-xl">
          <div class="w-3/12 ">
            <p class="sup670:text-base sup670:ml-10 text-xs ml-1  text-center">
              Sujet
            </p>
          </div>
          <p class="sup670:text-base text-xs w-3/12 text-center">Réponses</p>
          <p class="sup670:text-base text-xs w-3/12 text-center">Auteur</p>
          <p class="sup670:text-base text-xs w-3/12 text-center">Date</p>
        </div>
        <div
          key={post._id}
          class="h-36 flex-col border-solid border border-gris bg-blanc text-xl hover:cursor-pointer"
        >
          <div class="h-3/6 w-full flex items-center justify-center">
            <div class="w-3/12 ">
              <p class="sup670:text-sm sup670:ml-10  ml-1  py-1 px-0 text-vertClair text-xs text-center bg-grisFonce">
                {post.categorie}
              </p>
            </div>
            <div class="w-9/12 flex items-center justify-evenly ">
              <p class="sup670:text-base text-xs  w-1/3 text-vertClair text-center ">
                {post.nombreMessages}
              </p>
              <p class="sup670:text-base text-xs  w-1/3 text-vertClair text-center ">
                {post.pseudoCreateur}
              </p>
              <p class="sup670:text-base text-xs  w-1/3 text-vertClair text-center ">
                {post.dateCreation}
              </p>
            </div>
          </div>
          <div class="h-2/4 w-full">
            <p class="sup670:text-base sup670:ml-10 text-xs m-y-0 ml-1 mr-10 text-vertFoncer line-clamp-2 ">
              {post.titre}
            </p>
          </div>
        </div>
      </div>
      {afficheMsgNbMessages()}
      <div class="sup990:w-900 w-full mx-auto mt-12 mb-0">
        {allPostPerPage.map((element) => {
          return (
            <div
              key={element._id}
              class=" bg-blanc mb-7 p-9 border-solid border border-gris"
            >
              <div class="pb-5 text-vertClair font-bold flex items-center justify-between">
                <div class=" flex items-center justify-between">
                  {afficheImgOnMajImg(element)}
                  <span className="sup670:text-base text-xs">
                    {" " + element.pseudoCreateurMessage}
                  </span>
                </div>
                <span className="sup670:text-base text-xs">
                  {element.dateCreation}
                </span>
              </div>
              <p className="VisibleContenu noActive" ref={titrecontenu}>
                {element.contenu}
                <span className="NoVisibleContenu"> {element.contenu} </span>
              </p>
              <div class="flex items-center justify-start">
                {like(element._id)}
                <span class="sup670:text-base text-xs pr-12 text-vertClair">
                  {element.nbLike}
                </span>
                {signaler(element._id)}
              </div>
            </div>
          );
        })}
      </div>
      <PaginationPost
        postsPerPage={postPerPage}
        totalPosts={props.allMsg.length}
        paginate={paginate}
      />
      <div className="sup1256:flex-row sup1256:items-start sup1256:justify-center sup1600:w-1400 w-full mx-auto mt-12 mb-0 flex flex-col items-start justify-center ">
        <div className="sup1256:ml-0 sup670:ml-14 sup1256::w-3/5 bg-blanc py-7 px-6 w-4/5 border-solid border-2 border-grisFonce ml-8">
          <h1 className="sup670:text-xl text-vertFoncer pb-6 text-base">
            Créer un nouveau Message.
          </h1>
          <p className="sup670:text-base text-vertFoncer text-xs pb-6">
            Essayez d'apporter quelque chose de nouveau à la conversation.
          </p>
          <h3 className=" sup670:text-base text-vertFoncer py-6 px-0 text-xs">
            Description
          </h3>
          <div className="pt-1 pb-6 px-0">
            <textarea
              className="sup1256:w-auto sup670:text-base w-full outline-vertFoncer border-solid border border-vertFoncer text-vertFoncer py-3 px-2 resize-none text-xs"
              onClick={onclickTextArea}
              value={valueMsgForm}
              onChange={(e) => setvalueMsgForm(e.target.value)}
              rows={15}
              cols={80}
              name=""
              id=""
            ></textarea>
          </div>
          <p className="text-error text-xl pb-6" ref={paraMessageErreur}>
            {" "}
            {messageErreur}{" "}
          </p>
          <button
            className="sup670:text-base text-xs py-3 px-4 text-vertFoncer border-solid border border-vertFoncer bg-blanc rounded-md transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-vertFoncer hover:text-blanc"
            onClick={valideFormMessage}
          >
            Créer
          </button>
        </div>
        <div class="sup1256:w-2/5 sup670:px-6 py-7 px-0 w-full flex-col items-center ">
          <div class="sup670:w-96  sup1256:w-400 sup1400:ml-0 border-solid border-2 border-gris w-52 h-24 ml-8"></div>
          <h2 class="sup670:text-2xl sup1400:ml-0 ml-8 text-xl py-6 px-0 text-vertClair">
            Post similaire déjà créé?
          </h2>
          <p class="sup670:text-lg sup1400:ml-0 text-vertClair text-sm pb-6 ml-8">
            Faites une recherche par sujet,auteur ou catégorie.
          </p>
          <button
            class="sup990:py-3 sup670:text-base sup1400:ml-0 text-sm ml-8 w-44 py-2 px-0 text-vertClair border-solid border border-vertClair bg-blanc rounded transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-vertClair hover:text-blanc"
            onClick={() => navigate("/")}
          >
            Accéder à la recherche
          </button>
        </div>
      </div>
    </div>
  );
}
