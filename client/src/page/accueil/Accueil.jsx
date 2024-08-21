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
    <div class="w-screen pt-44 ">
      <p class="text-center text-5xl text-vertFoncer">Forum</p>
      <div class="py-2.5 px-0 h-auto mx-auto my-0 mt-24 flex items-center justify-between border-solid border border-gris w-1400">
        <div>
          <div
            class="py-1 px-0 w-32 my-0 mx-4 bg-blanc text-vertFoncer border-solid border border-vertFoncer text-base transition-all duration-200 ease-in-out flex items-center justify-around relative hover:cursor-pointer"
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
        <div class="flex items-center justify-around w-auto">
          <input
            class="text-base text-vertFoncer border-solid border border-vertFoncer p-1 ml-4 outline-vertFoncer placeholder:text-vertFoncer"
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
            class="text-base bg-vertFoncer text-blanc border-solid border border-vertFoncer ml-4 w-14  hover:cursor-pointer"
            ref={inputSujet}
            onClick={cliqueSujet}
          >
            Sujet
          </button>
          <button
            class="text-base bg-blanc text-vertFoncer border-solid border border-vertFoncer ml-4 w-14  hover:cursor-pointer"
            ref={inputAuteur}
            onClick={cliqueAuteur}
          >
            Auteur
          </button>
          <button
            class="text-base bg-blanc text-vertFoncer border-solid border border-vertFoncer ml-4 p-1 hover:cursor-pointer"
            onClick={valideRecherche}
          >
            Rechercher
          </button>
        </div>
        <div class="w-auto flex items-center justify-evenly">
          <button
            class="mr-4 py-2 px-4 border-solid text-vertClair border border-vertClair rounded-lg text-base transition-all duration-300 ease-in-out hover:bg-vertClair hover:text-blanc hover:border-blanc hover:cursor-pointer "
            onClick={afficheAllPost}
          >
            Posts
          </button>
          <button
            class="mr-5 py-2 px-4 border-solid text-vertClair border border-vertClair rounded-lg text-base transition-all duration-300 ease-in-out hover:bg-vertClair hover:text-blanc hover:border-blanc hover:cursor-pointer "
            onClick={scrollToNewPost}
          >
            Nouveau post
          </button>
        </div>
      </div>
      <p class="flex items-center justify-center w-1400 my-0 mx-auto text-error text-xl h-12">
        {" "}
        {errorMessage}{" "}
      </p>
      <div class="w-1400 mt-0 mb-24 mx-auto">
        <div class="h-12 flex items-center border-solid border border-gris bg-blanc text-vertFoncer font-bold text-xl">
          <div class="w-9/12 ">
            <p class="ml-10 w-36 text-center">Sujet</p>
          </div>
          <p class="w-1/12 text-center">Réponses</p>
          <p class="w-1/12 text-center">Auteur</p>
          <p class="w-1/12 text-center">Date</p>
        </div>
        {allPostPerPage.map((element) => {
          return (
            <div
              key={element._id}
              onClick={() => accesPageMessagePost(element._id)}
              class="h-36 flex-col border-solid border border-gris bg-blanc text-xl hover:cursor-pointer"
            >
              <div class="h-3/6 w-full flex items-center justify-center">
                <div class="w-9/12 ">
                  <p class="ml-10 w-36  py-1 px-0 text-vertClair text-sm text-center bg-grisFonce">
                    {element.categorie}
                  </p>
                </div>
                <div class="w-3/12 flex items-center justify-evenly ">
                  <p class="w-1/3 text-vertClair text-center text-base">
                    {element.nombreMessages}
                  </p>
                  <p class="w-1/3 text-vertClair text-center text-base">
                    {element.pseudoCreateur}
                  </p>
                  <p class="w-1/3 text-vertClair text-center text-base">
                    {element.dateCreation}
                  </p>
                </div>
              </div>
              <div class="h-2/4 w-9/12">
                <p class="m-y-0 ml-10 mr-10 text-vertFoncer line-clamp-2 text-base">
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
      <div class="w-1400 mt-24 mx-auto mb-0 flex items-start justify-center">
        <div class="bg-blanc py-7 px-6 w-3/5 border-solid border-2 border-gris">
          <h1 class="text-vertFoncer pb-6 text-4xl">Créer un nouveau Post.</h1>
          <p class="text-vertFoncer pb-6 text-xl">
            Donnez votre point de vue sur un cas particulier.
          </p>
          <h3 class="text-vertFoncer pb-5 pt-6">Titre : </h3>
          <input
            class="outline-vertFoncer border-solid border border-vertFoncer text-vertFoncer py-3 px-2 w-96"
            value={valueTitrePost}
            onChange={(e) => setvalueTitrePost(e.target.value)}
            onClick={() => seterrorMsgCreerPost("")}
            placeholder="Entrez votre titre"
            type="text"
          />
          <h3 class="text-vertFoncer pt-14 px-0 pb-4">Catégorie : </h3>
          <div class="pt-3 flex-col items-center justify-between w-96">
            {categories.map((element) => {
              return (
                <p
                  class="flex items-center justify-between w-full text-vertFoncer text-base pb-6"
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
          <p ref={errorMsgPost} class="h-12 text-error text-base">
            {" "}
            {errorMsgCreerPost}{" "}
          </p>
          <button
            class="py-3 px-4 text-vertFoncer border-solid border border-vertFoncer bg-blanc rounded-md transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-vertFoncer hover:text-blanc"
            onClick={creerPost}
          >
            Créer
          </button>
        </div>
        <div class="py-7 px-6 w-2/5 flex-col items-center">
          <div class="border-solid border-2 border-gris w-400 h-24"></div>
          <h2 class="text-2xl py-6 px-0 text-vertClair">
            Post similaire déjà créé?
          </h2>
          <p class=" text-vertClair text-base pb-6">
            Faites une recherche par sujet,auteur ou catégorie.
          </p>
          <button
            class="w-400 py-5 px-0 text-vertClair border-solid border border-vertClair bg-blanc rounded transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-vertClair hover:text-blanc"
            onClick={scroolToSearchPost}
          >
            Accéder à la recherche
          </button>
        </div>
      </div>
    </div>
  );
}
