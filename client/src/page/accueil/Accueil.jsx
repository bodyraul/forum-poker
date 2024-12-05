import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import flecheBas from "../../photo/flecheBas.png";
import axios from "axios";
import "./accueil.css";
import PaginationPost from "../../Component/paginationPost/PaginationPost";

export default function Accueil(props) {
  const { token } = useContext(AuthContext);
  const [listePost, setlistePost] = useState([]);
  const [categories, setcategories] = useState([]);
  const [radioValue, setradioValue] = useState("");
  const [valueTitrePost, setvalueTitrePost] = useState("");
  const [errorMsgCreerPost, seterrorMsgCreerPost] = useState("");
  const [boolCategorieSearch, setboolCategorieSearch] = useState(false);
  const [recherchePost, setrecherchePost] = useState("");
  const [errorMessage, seterrorMessage] = useState("");
  const [valueAuteurSujet, setvalueAuteurSujet] = useState("sujet");
  const [currentPage, setcurrentPage] = useState(1);
  const [postPerPage] = useState(5);
  const errorMsgPost = useRef();
  const inputSujet = useRef();
  const inputAuteur = useRef();
  const inputsearchSujetAuteur = useRef();
  const allCategoriesSearch = useRef();
  const navigate = useNavigate();
  // const  affichePostResponsive= useMediaQuery({ query: '(max-width: 900px)' })

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get("/post")
      .then((res) => {
        setlistePost(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("/categorie/afficherAllCategories")
      .then((res) => {
        setcategories(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const accesPageMessagePost = (idPost) => {
    navigate(`/messagePost/${idPost}`);
  };

  function AllRadioFalse() {
    const allInputRadio = document.querySelectorAll(".inputRadio");
    allInputRadio.forEach((element) => {
      element.checked = false;
    });
  }

  async function gestionRadio(e) {
    AllRadioFalse();
    setradioValue(e.target.value);
    e.target.checked = true;
  }

  const creerPost = async () => {
    console.log(valueTitrePost.length);
    errorMsgPost.current.style.color = "#ef4444";
    if (!token) {
      return seterrorMsgCreerPost(
        "Vous devez être connecté pour pouvoir créer un post."
      );
    }
    if (!radioValue) {
      return seterrorMsgCreerPost("Vous devez choisir une catégorie.");
    }
    if (valueTitrePost.length === 0) {
      return seterrorMsgCreerPost("le titre ne doit pas être vide.");
    }
    if (valueTitrePost.length < 10) {
      return seterrorMsgCreerPost(
        "le titre ne peux pas contenir moins de 10 caractères."
      );
    }
    if (valueTitrePost.length > 300) {
      return seterrorMsgCreerPost(
        "le titre ne peux pas contenir plus de 150 caractères."
      );
    }

    const newPost = {};
    newPost.categorie = radioValue;
    newPost.titre = valueTitrePost;

    await axios
      .post("/post/creerPost", newPost, config)
      .then((res) => {
        errorMsgPost.current.style.color = "#44ADA8";
        setlistePost([res.data, ...listePost]);
        seterrorMsgCreerPost("Post créé avec succès.");
        AllRadioFalse();
        setradioValue("");
      })
      .catch((err) => console.log(err));

    setvalueTitrePost("");
  };

  const scroolToSearchPost = () => {
    document.querySelector(".titre").scrollIntoView({
      behavior: "smooth",
    });
  };

  const choiseCategoriesSearch = async (e) => {
    await axios
      .get(`/post/posteParCategorie/${e.target.value}`)
      .then((res) => setlistePost(res.data))
      .catch((err) => console.log(err));
  };

  const cliqueCategories = () => {
    setboolCategorieSearch(!boolCategorieSearch);
  };

  const cliqueSujet = () => {
    if (valueAuteurSujet === "sujet") {
      return;
    }
    inputAuteur.current.style.color = "#547981";
    inputAuteur.current.style.backgroundColor = "white";
    inputSujet.current.style.color = "white";
    inputSujet.current.style.backgroundColor = "#547981";
    inputsearchSujetAuteur.current.placeholder = "rechercher sujet";
    setvalueAuteurSujet("sujet");
  };

  const cliqueAuteur = () => {
    if (valueAuteurSujet === "auteur") {
      return;
    }
    inputAuteur.current.style.color = "white";
    inputAuteur.current.style.backgroundColor = "#547981";
    inputSujet.current.style.color = "#547981";
    inputSujet.current.style.backgroundColor = "white";
    inputsearchSujetAuteur.current.placeholder = "rechercher auteur";
    setvalueAuteurSujet("auteur");
  };

  const valideRecherche = () => {
    if (recherchePost === "") {
      return seterrorMessage("La recherche ne peut être vide");
    }
    if (valueAuteurSujet === "sujet") {
      const mot = recherchePost;
      axios
        .get(`/post/recherchepostesParmot/${mot}`)
        .then((res) => {
          setlistePost(res.data);
        })
        .catch((err) => {
          seterrorMessage(recherchePost + " " + err.response.data);
        });
    }
    if (valueAuteurSujet === "auteur") {
      const pseudoCreateur = recherchePost;
      axios
        .get(`/post/recherchepostesParPseudo/${pseudoCreateur}`)
        .then((res) => setlistePost(res.data))
        .catch((err) => {
          if (err.response.status === 404) {
            seterrorMessage(recherchePost + " : " + err.response.data);
          }
        });
    }
    setrecherchePost("");
  };

  const afficheAllPost = () => {
    axios
      .get("/post")
      .then((res) => setlistePost(res.data))
      .catch((err) => console.log(err));

    seterrorMessage("");
  };

  const scrollToNewPost = () => {
    document.querySelector(".creationPost").scrollIntoView({
      behavior: "smooth",
    });
  };

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const allPostPerPage = listePost.slice(firstPostIndex, lastPostIndex);
  const paginate = (pageNumber) => setcurrentPage(pageNumber);

  return (
    <div class="sup990:pt-44 w-screen pt-10 ">
      <p class="sup990:text-5xl text-center text-3xl text-vertFoncer">Forum</p>
      <div class="sup460:w-475  sup1256:w-11/12 sup1600:h-auto sup1600:flex sup1600:flex-row sup1600:items-center sup1600:justify-between sup1600:w-1400 py-2.5 px-0 h-80 mx-auto my-0 mt-24 flex flex-col-reverse items-center justify-evenly border-solid border border-gris w-full">
        <div>
          <div
            class="sup670:text-lg py-1 px-0 w-32 my-0 mx-4 bg-blanc text-vertFoncer border-solid border border-vertFoncer text-sm transition-all duration-200 ease-in-out flex items-center justify-around relative hover:cursor-pointer"
            onClick={cliqueCategories}
          >
            {boolCategorieSearch ? (
              <div
                class="absolute bg-blanc w-32 h-36 -bottom-36 z-10 p-0 border-solid border border-l-vertClair border-r-vertClair border-t-vertClair border-b-0 flex-col items-center justify-center"
                ref={allCategoriesSearch}
              >
                {categories.map((element) => {
                  return (
                    <input
                      class="text-xs text-center text-blanc w-full h-12 border-solid border border-l-0 border-r-0 border-t-0 border-b-blanc bg-vertClair outline-none transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-blanc hover:text-vertClair"
                      key={element._id}
                      onClick={(e) => choiseCategoriesSearch(e)}
                      type="input"
                      defaultValue={element.titre}
                    />
                  );
                })}
              </div>
            ) : (
              ""
            )}
            <span>Catégories</span>
            <img class="w-5" src={flecheBas} alt=""></img>
          </div>
        </div>
        <div class="sup460:w-4/5 sup670:w-auto sup670:justify-around flex items-center justify-evenly w-11/12">
          <input
            class="sup1256:ml-4 sup1256:p-1 sup670:text-base sup460:w-24 sup460:placeholder:text-xs sup670:placeholder:text-base sup670:w-auto w-20 text-base text-vertFoncer border-solid border border-vertFoncer pt-1 pr-0 pb-1 pl-1 ml-0 outline-vertFoncer placeholder:text-vertFoncer placeholder:text-xs"
            ref={inputsearchSujetAuteur}
            onClick={() => seterrorMessage("")}
            value={recherchePost}
            onChange={(e) => {
              setrecherchePost(e.target.value);
              seterrorMessage("");
            }}
            type="text"
            placeholder="Rechercher sujet"
          />
          <button
            class="sup670:ml-4 sup670:text-base text-xs bg-vertFoncer text-blanc border-solid border border-vertFoncer ml-0 w-14  hover:cursor-pointer"
            ref={inputSujet}
            onClick={cliqueSujet}
          >
            Sujet
          </button>
          <button
            class="sup670:ml-4 sup670:text-base text-xs bg-blanc text-vertFoncer border-solid border border-vertFoncer ml-0 w-14  hover:cursor-pointer"
            ref={inputAuteur}
            onClick={cliqueAuteur}
          >
            Auteur
          </button>
          <button
            class="sup670:ml-4 sup670:text-base text-xs bg-blanc text-vertFoncer border-solid border border-vertFoncer ml-0 p-1 hover:cursor-pointer"
            onClick={valideRecherche}
          >
            Rechercher
          </button>
        </div>
        <div class="sup990:w-auto w-full flex items-center justify-evenly">
          <button
            class="sup1256:px-4 sup1256:py-3 sup990:py-3 sup990:px-3 sup990:ml-0 sup670:text-base mr-4 ml-5 py-1 px-7 border-solid text-vertClair border border-vertClair rounded-lg text-xs transition-all duration-300 ease-in-out hover:bg-vertClair hover:text-blanc hover:border-blanc hover:cursor-pointer "
            onClick={afficheAllPost}
          >
            Posts
          </button>
          <button
            class="sup1256:px-4 sup1256:py-3  sup990:py-3 sup990:px-3 sup670:text-base mr-5 py-1 px-7 border-solid text-vertClair border border-vertClair rounded-lg text-xs transition-all duration-300 ease-in-out hover:bg-vertClair hover:text-blanc hover:border-blanc hover:cursor-pointer "
            onClick={scrollToNewPost}
          >
            Nouveau post
          </button>
        </div>
      </div>
      <p class="sup990:text-xl flex items-center justify-center w-full my-0 mx-auto text-error text-sm h-12 ">
        {" "}
        {errorMessage}{" "}
      </p>
      <div class="sup990:w-11/12 sup1600:w-1400 w-full mt-0 mb-24 mx-auto ">
        <div class=" h-12 flex items-center border-solid border border-gris bg-blanc text-vertFoncer font-bold ">
          <div class="sup670:text-base w-1/4 text-center text-xs">
            <p class="">Sujet</p>
          </div>
          <p class="sup670:text-base w-1/4 text-center text-xs">Réponses</p>
          <p class="sup670:text-base w-1/4 text-center text-xs">Auteur</p>
          <p class="sup670:text-base w-1/4 text-center text-xs">Date</p>
        </div>
        {allPostPerPage.map((element) => {
          return (
            <div
              key={element._id}
              onClick={() => accesPageMessagePost(element._id)}
              class="h-36 flex-col border-solid border border-gris bg-blanc text-xl hover:cursor-pointer"
            >
              <div class=" h-12 flex items-center bg-blanc text-vertFoncer ">
                <div class="sup670:text-base w-1/4  text-vertClair text-xs text-centerpy-1 flex items-center justify-center">
                  <p class="w-auto bg-grisFonce text-center px-2 py-1">
                    {" "}
                    {element.categorie}
                  </p>
                </div>
                <p class="sup670:text-base w-1/4 text-center text-xs text-vertClair">
                  {" "}
                  {element.nombreMessages}
                </p>
                <p class="sup670:text-base w-1/4 text-center text-xs text-vertClair">
                  {" "}
                  {element.pseudoCreateur}
                </p>
                <p class="sup670:text-base w-1/4 text-center text-xs text-vertClair">
                  {" "}
                  {element.dateCreation}
                </p>
              </div>
              <div class=" h-12 flex items-center bg-blanc text-vertFoncer ">
                <p class="sup670:text-base w-full px-8 text-sm line-clamp-2">
                  {element.titre}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <PaginationPost
        postsPerPage={postPerPage}
        totalPosts={listePost.length}
        paginate={paginate}
      />
      <div class="sup1400:flex-row sup1400:items-start sup1400:justify-center sup1400:w-1400 w-full mt-24 mx-auto mb-0 flex flex-col items-center justify-center">
        <div class="sup990:w-11/12 bg-blanc py-7 px-6 w-full border-solid border-2 border-gris">
          <h1 class="sup670:text-4xl text-vertFoncer pb-6 text-2xl">
            Créer un nouveau Post.
          </h1>
          <p class="sup670:text-xl text-vertFoncer pb-6 text-base">
            Donnez votre point de vue sur un cas particulier.
          </p>
          <h3 class="sup670:text-base text-vertFoncer pb-5 pt-6 text-sm">
            Titre :{" "}
          </h3>
          <input
            class="sup670:placeholder:text-base sup460:w-96 outline-vertFoncer border-solid border border-vertFoncer text-vertFoncer py-3 px-2 w-full placeholder:text-sm"
            value={valueTitrePost}
            onChange={(e) => setvalueTitrePost(e.target.value)}
            onClick={() => seterrorMsgCreerPost("")}
            placeholder="Entrez votre titre"
            type="text"
          />
          <h3 class="sup670:text-base text-sm text-vertFoncer pt-14 px-0 pb-4">
            Catégorie :{" "}
          </h3>
          <div class="sup670:pt-2 sup670:pr-0 sup670:pb-0 sup670:pl-0 sup460:w-96  pt-2 pr-2 pb-0 pl-0 flex-col items-center justify-between w-full">
            {categories.map((element) => {
              return (
                <p
                  class="sup670:text-base text-sm flex items-center justify-between w-full text-vertFoncer  pb-6"
                  key={element._id}
                >
                  <label htmlFor="">- {element.titre}</label>
                  <input
                    onClick={(e) => gestionRadio(e)}
                    className="inputRadio"
                    type="radio"
                    value={element.titre}
                  />
                </p>
              );
            })}
          </div>
          <p
            ref={errorMsgPost}
            class="sup670:text-base text-sm h-12 text-error "
          >
            {" "}
            {errorMsgCreerPost}{" "}
          </p>
          <button
            class="sup670:text-base text-sm py-3 px-4 text-vertFoncer border-solid border border-vertFoncer bg-blanc rounded-md transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-vertFoncer hover:text-blanc"
            onClick={creerPost}
          >
            Créer
          </button>
        </div>
        <div class="sup1400:w-2/5 sup670:px-6 py-7 px-0 w-full flex-col items-center ">
          <div class=" sup1400:w-400 sup1400:ml-0 border-solid border-2 border-gris w-4/5 h-24 ml-8"></div>
          <h2 class="sup670:text-2xl sup1400:ml-0 ml-8 text-xl py-6 px-0 text-vertClair">
            Post similaire déjà créé?
          </h2>
          <p class="sup670:text-lg sup1400:ml-0 text-vertClair text-sm pb-6 ml-8">
            Faites une recherche par sujet,auteur ou catégorie.
          </p>
          <button
            class="sup990:py-3 sup670:text-base sup1400:ml-0 text-sm ml-8 w-44 py-2 px-0 text-vertClair border-solid border border-vertClair bg-blanc rounded transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-vertClair hover:text-blanc"
            onClick={scroolToSearchPost}
          >
            Accéder à la recherche
          </button>
        </div>
      </div>
    </div>
  );
}
