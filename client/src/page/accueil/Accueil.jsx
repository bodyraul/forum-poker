import React from 'react'
import { useState } from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useMediaQuery } from 'react-responsive'
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import flecheBas from '../../photo/flecheBas.png'
import axios from 'axios';
import "./accueil.css";
import PaginationPost from '../../Component/paginationPost/PaginationPost';

export default function Accueil(props) {

const {token,settoken}  = useContext(AuthContext);
const [listePost, setlistePost] = useState([]);
const [categories, setcategories] = useState([]);
const [radioValue, setradioValue] = useState("");
const [valueTitrePost, setvalueTitrePost] = useState("");
const [errorMsgCreerPost, seterrorMsgCreerPost] = useState("");
const  [boolCategorieSearch, setboolCategorieSearch] = useState(false);
const [recherchePost, setrecherchePost] = useState("");
const [errorMessage, seterrorMessage] = useState("");
const [valueAuteurSujet, setvalueAuteurSujet] = useState("sujet");
const [currentPage, setcurrentPage] = useState(1);
const [postPerPage, setpostPerPage] = useState(5);
const errorMsgPost = useRef();
const inputSujet = useRef();
const inputAuteur = useRef();
const inputsearchSujetAuteur = useRef();
const allCategoriesSearch =useRef();
const navigate = useNavigate();
// const  affichePostResponsive= useMediaQuery({ query: '(max-width: 900px)' })

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};


useEffect(() => {

  axios.get("/post")
  .then((res)=>{
    setlistePost(res.data);
  })
  .catch((err)=>console.log(err));

  axios.get("/categorie/afficherAllCategories")
  .then((res)=>{
    setcategories(res.data);
  })
  .catch((err)=>console.log(err));

}, [])

const accesPageMessagePost= (idPost)=>{
  navigate(`/messagePost/${idPost}`);
}

function AllRadioFalse(){
  const allInputRadio = document.querySelectorAll('.inputRadio');
    allInputRadio.forEach(element => {
      element.checked=false;
  });
}

async function gestionRadio(e){
  AllRadioFalse();
  setradioValue(e.target.value);
  e.target.checked=true;
}

const creerPost = async ()=>{
  console.log(valueTitrePost.length);
  errorMsgPost.current.style.color ='#ef4444';
  if(!token){
    return seterrorMsgCreerPost("Vous devez être connecté pour pouvoir créer un post.");
  }
  if(!radioValue){
    return seterrorMsgCreerPost("Vous devez choisir une catégorie.");
  }
  if(valueTitrePost.length===0){
    return seterrorMsgCreerPost("le titre ne doit pas être vide.");
 }
 if(valueTitrePost.length<10){
   return  seterrorMsgCreerPost("le titre ne peux pas contenir moins de 10 caractères.");
 }
 if(valueTitrePost.length>300){
   return  seterrorMsgCreerPost("le titre ne peux pas contenir plus de 150 caractères.");
  }

  const newPost = {};
  newPost.categorie=radioValue;
  newPost.titre=valueTitrePost;

  await axios.post("/post/creerPost",newPost,config)
  .then((res)=>{ 
      errorMsgPost.current.style.color ='#44ADA8';
      setlistePost([res.data,...listePost]);
      seterrorMsgCreerPost("Post créé avec succès.");
      AllRadioFalse();
      setradioValue("");
  })
  .catch((err)=>console.log(err));

  setvalueTitrePost("");
 }

 const scroolToSearchPost=()=>{
  document.querySelector('.titre').scrollIntoView({
    behavior: 'smooth'
  });
 }

 const choiseCategoriesSearch = async(e)=>{
  await axios.get(`/post/posteParCategorie/${e.target.value}`)
  .then((res)=>setlistePost(res.data))
  .catch((err)=>console.log(err));
 }  

 const cliqueCategories=()=>{
  setboolCategorieSearch(!boolCategorieSearch);
 }

 const cliqueSujet =()=>{
  if(valueAuteurSujet === 'sujet'){
    return;
  }
    inputAuteur.current.style.color ="#547981";
    inputAuteur.current.style.backgroundColor ="white";
    inputSujet.current.style.color ="white";
    inputSujet.current.style.backgroundColor ="#547981";
    inputsearchSujetAuteur.current.placeholder ="rechercher sujet";
    setvalueAuteurSujet('sujet');
 }

 const cliqueAuteur =()=>{
    if(valueAuteurSujet === 'auteur'){
      return;
    }
    inputAuteur.current.style.color ="white";
    inputAuteur.current.style.backgroundColor ="#547981";
    inputSujet.current.style.color ="#547981";
    inputSujet.current.style.backgroundColor ="white";
    inputsearchSujetAuteur.current.placeholder ="rechercher auteur";
    setvalueAuteurSujet('auteur');
 }

 const valideRecherche = ()=>{
    if(recherchePost===""){
      return seterrorMessage("La recherche ne peut être vide");
      }
    if(valueAuteurSujet === 'sujet'){
      const mot = recherchePost;
        axios.get(`/post/recherchepostesParmot/${mot}`)
        .then((res)=>{
            setlistePost(res.data);
        })
        .catch((err)=>
        {
            seterrorMessage(recherchePost+" "+err.response.data);
        });
    }
    if(valueAuteurSujet === 'auteur'){
      const pseudoCreateur = recherchePost;
        axios.get(`/post/recherchepostesParPseudo/${pseudoCreateur}`)
        .then((res)=>setlistePost(res.data))
        .catch((err)=>
        {
            if(err.response.status === 404){
                seterrorMessage(recherchePost+" : "+err.response.data);
            }
        });
    }
    setrecherchePost("");
 }

 const afficheAllPost =()=>{
  axios.get("/post")
  .then((res)=>setlistePost(res.data))
  .catch((err)=>console.log(err));

    seterrorMessage("");
 }

 const scrollToNewPost = ()=>{
    document.querySelector('.creationPost').scrollIntoView({
         behavior: 'smooth'
    })
 }

 const lastPostIndex = currentPage * postPerPage;
 const firstPostIndex = lastPostIndex - postPerPage;
 const allPostPerPage = listePost.slice(firstPostIndex,lastPostIndex);
 const paginate = pageNumber=>setcurrentPage(pageNumber);
 

  return (
 
    <div   className='ContainerForum'>
        <p className='titre'>Bienvenue sur le forum</p>
        <div className='AllBtnRecherchePost'>
            <div>
                <div onClick={cliqueCategories}>
                  {boolCategorieSearch ?  
                  <div ref={allCategoriesSearch}>
                      {categories.map((element)=>{
                        return(
                          <input key={element._id} onClick={(e)=>choiseCategoriesSearch(e)} type="input" defaultValue={element.titre} />
                        )
                      })}
                  </div>
                  :
                  ""}
                  <span>Catégories</span>
                  <img src={flecheBas} alt=''></img>
                </div>
            </div>
            <div>
                  <input ref={inputsearchSujetAuteur} onClick={()=>seterrorMessage("")}  value={recherchePost} onChange={(e)=>{
                    setrecherchePost(e.target.value);
                    seterrorMessage("");
                    }} type='text' placeholder='Rechercher sujet' 
                  />
                  <button ref={inputSujet}  onClick={cliqueSujet} >Sujet</button>
                  <button ref={inputAuteur} onClick={cliqueAuteur} >Auteur</button>
                  <button onClick={valideRecherche}>Rechercher</button>
            </div>
            <div>
                 <button onClick={afficheAllPost}>Posts</button>
                 <button onClick={scrollToNewPost}>Nouveau post</button>
            </div>
        </div>
        <p className='erroMessageRecherche'> {errorMessage} </p>
        <div className='affichageAllPosts'>
            <div className='ligneTitre'>
                <div>
                  <p>Sujet</p>
                </div>
                <p>Réponses</p>
                <p>Auteur</p>
                <p>Date</p>
            </div>
            {allPostPerPage.map((element)=>{
                        return(
                          <div key={element._id} onClick={()=>accesPageMessagePost(element._id)} className='ligneContenu'>
                            <div className='partieCatMsgPost'>
                                <div>
                                  <p>
                                    {element.categorie}
                                  </p>
                                </div>
                                <div>
                                  <p>{element.nombreMessages}</p>
                                  <p>{element.pseudoCreateur}</p>
                                  <p>{element.dateCreation}</p>
                                </div>
                            </div>
                            <div className='partieTitrePost'>
                              <p>{element.titre}</p>
                            </div>
                          </div>
                        )
                    })}
        </div>          
        <PaginationPost postsPerPage={postPerPage} totalPosts={listePost.length} paginate={paginate}/>
        <div className='creationPost'>
            <div className='partieCreation'>
                <h1>Créer un nouveau Post.</h1>
                <p className='pQuestion'>Posez une question ou donnez votre point de vue sur un cas particulier.</p>
                <h3>Titre : </h3>
                <input value={valueTitrePost} onChange={(e)=>setvalueTitrePost(e.target.value)} onClick={()=>seterrorMsgCreerPost("")}  placeholder='Entrez votre titre' type="text" />
                <h3>Catégorie : </h3>
                <div>
                   {categories.map((element)=>{
                      return(
                      <p key={element._id}>
                        <label htmlFor="" >
                          - {element.titre}
                        </label>
                        <input onClick={(e)=>gestionRadio(e)} className='inputRadio' type="radio" value={element.titre} />
                      </p>
                      )
                   })}
                </div>
                <p ref={errorMsgPost} className='errorMsgPost'> {errorMsgCreerPost}  </p>
                <button onClick={creerPost}>Créer</button>
            </div>
            <div className='partieRemonter'>
                <div></div>
                <h2>Post similaire déjà créé?</h2>
                <p>Faites une recherche par sujet,auteur ou catégorie.</p>
                <button onClick={scroolToSearchPost}>Accéder à la recherche</button>
            </div>
        </div>
    </div>
    
  )
}