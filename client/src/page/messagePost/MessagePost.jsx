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
            class="pb-1 pr-2 transition-all duration-200 ease-in-out origin-left hover:cursor-pointer hover:-rotate-6"
            onClick={() => modifierLike(id, true)}
            src={LikeActif}
          ></img>
        );
      }
    }
    return (
      <img
        alt=""
        class="pb-1 pr-2 transition-all duration-200 ease-in-out origin-left hover:cursor-pointer hover:-rotate-6"
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
              class="pb-1 pr-2 transition-all duration-200 ease-in-out origin-left hover:cursor-pointer hover:-rotate-6"
              onClick={() => modifierSignalement(id, true)}
              alt=""
              src={signalerActif}
            ></img>
            <span>Ne plus signaler</span>
          </div>
        );
      }
    }
    return (
      <div class="flex items-center justify-start">
        <img
          class="pb-1 pr-2 transition-all duration-200 ease-in-out origin-left hover:cursor-pointer hover:-rotate-6"
          onClick={() => modifierSignalement(id, false)}
          alt=""
          src={signalerNoActif}
        ></img>
        <span>Signaler</span>
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
        <p class="mr-2 text-2xl text-blanc w-auto h-auto border-double border-2 border-vertClair rounded-full flex items-center justify-center">
          <img class="h-20 max-w-20 rounded-full" src={props.imgPref} alt="" />
        </p>
      );
    }
    if (element.image.length > 0 && element.idUser !== id) {
      return (
        <p class="mr-2 text-2xl text-blanc w-auto h-auto border-double border-2 border-vertClair rounded-full flex items-center justify-center">
          <img class="h-20 max-w-20 rounded-full" src={element.image} alt="" />
        </p>
      );
    }
    if (props.imgPref.length === 0) {
      return (
        <p class="mr-2 text-xl bg-vertFoncer text-blanc rounded-full size-12 flex items-center justify-center">
          <span class="uppercase text-base ">
            {element.nomCreateurMessage[0]} .{" "}
          </span>
          <span class="pl-1">{element.prenomCreateurMessage[0]}</span>
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
        <p class="text-center text-4xl text-vertFoncer mt-12">
          Aucune réponse{" "}
        </p>
      );
    }
    if (allPostPerPage.length === 1) {
      return (
        <p class="text-center text-4xl text-vertFoncer mt-12">une réponse </p>
      );
    }
    if (allPostPerPage.length >= 1) {
      return (
        <p class="text-center text-4xl text-vertFoncer mt-12">
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
    <div class="w-screen mt-48">
      <p class="text-center text-4xl text-vertFoncer mt-12">
        {" "}
        Post selectionné
      </p>
      <div class="w-1400 mt-14 mb-24 mx-auto">
        <div class="h-12 flex items-center border-solid border border-gris bg-blanc text-vertFoncer font-bold text-xl">
          <div class="w-9/12 ">
            <p class="ml-10 w-36 text-center">Sujet</p>
          </div>
          <p class="w-1/12 text-center">Réponses</p>
          <p class="w-1/12 text-center">Auteur</p>
          <p class="w-1/12 text-center">Date</p>
        </div>
        <div
          key={post._id}
          class="h-36 flex-col border-solid border border-gris bg-blanc text-xl hover:cursor-pointer"
        >
          <div class="h-3/6 w-full flex items-center justify-center">
            <div class="w-9/12 ">
              <p class="ml-10 w-36  py-1 px-0 text-vertClair text-sm text-center bg-grisFonce">
                {post.categorie}
              </p>
            </div>
            <div class="w-3/12 flex items-center justify-evenly ">
              <p class="w-1/3 text-vertClair text-center text-base">
                {post.nombreMessages}
              </p>
              <p class="w-1/3 text-vertClair text-center text-base">
                {post.pseudoCreateur}
              </p>
              <p class="w-1/3 text-vertClair text-center text-base">
                {post.dateCreation}
              </p>
            </div>
          </div>
          <div class="h-2/4 w-9/12">
            <p class="m-y-0 ml-10 mr-10 text-vertFoncer line-clamp-2 text-base">
              {post.titre}
            </p>
          </div>
        </div>
      </div>
      {afficheMsgNbMessages()}
      <div class="w-900 mx-auto mt-12 mb-0">
        {allPostPerPage.map((element) => {
          return (
            <div
              key={element._id}
              class="bg-blanc mb-7 p-9 border-solid border border-gris"
            >
              <div class="pb-5 text-vertClair font-bold flex items-center justify-between">
                <div class=" flex items-center justify-between">
                  {afficheImgOnMajImg(element)}
                  <span>{" " + element.pseudoCreateurMessage}</span>
                </div>
                <span>{element.dateCreation}</span>
              </div>
              <p className="VisibleContenu noActive" ref={titrecontenu}>
                {element.contenu}
                <span className="NoVisibleContenu"> {element.contenu} </span>
              </p>
              <div class="flex items-center justify-start">
                {like(element._id)}
                <span class="pr-12 text-vertClair">{element.nbLike}</span>
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
      <div className="w-1400 mx-auto mt-24 mb-0 flex items-start justify-center">
        <div className="bg-blanc py-7 px-6">
          <h1 className="text-vertFoncer pb-6 text-xl">
            Créer un nouveau Message.
          </h1>
          <p className="text-vertFoncer text-base pb-6">
            Essayez d'apporter quelque chose de nouveau à la conversation.
          </p>
          <h3 className=" text-vertFoncer py-6 px-0">Description</h3>
          <div className="pt-1 pb-6 px-0">
            <textarea
              className="outline-vertFoncer border-solid border border-vertFoncer text-vertFoncer py-3 px-2 resize-none text-base"
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
            className="py-3 px-4 text-vertFoncer border-solid border border-vertFoncer bg-blanc rounded-md transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-vertFoncer hover:text-blanc"
            onClick={valideFormMessage}
          >
            Créer
          </button>
        </div>
        <div className="py-7 px-6">
          <div className="border-solid border border-gris w-400 h-24"></div>
          <h2 className="py-6 px-0 text-vertClair">
            Mauvais Post selectionné?
          </h2>
          <p className="text-vertClair text-base pb-6">
            Cliquez ci-dessous pour revenir à la page des post.
          </p>
          <button
            className="w-400 py-5 px-0 text-vertClair border-solid border border-vertClair bg-blanc rounded-md transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-vertClair hover:text-blanc"
            onClick={() => navigate("/")}
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
