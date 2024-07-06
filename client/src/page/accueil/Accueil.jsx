import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useEffect } from 'react';
import { useRef } from 'react';
import "./accueil.css";
import { useNavigate } from 'react-router-dom';
import { ConfidentialiteContext } from '../../Context/ConfidentialiteContext';
import { Fragment } from 'react';
import flecheBas from '../../photo/flecheBas.png'

export default function Accueil(props) {

const [listePost, setlistePost] = useState([]);
const [categories, setcategories] = useState([]);
const {token,settoken}  = useContext(AuthContext);
const {confidentialite,setconfidentialite}  = useContext(ConfidentialiteContext);
const [recherchePost, setrecherchePost] = useState("");
const [categorieBoolean, setcategorieBoolean] = useState(false);
const [errorMsg, seterrorMsg] = useState("");
const [errorMsgCreerPost, seterrorMsgCreerPost] = useState("");
const [valueElementCheckbox, setvalueElementCheckbox] = useState("Stratégie tournois");
const [valueTextarea, setvalueTextarea] = useState("");
const refListeCategories =useRef();
const navigate = useNavigate();
const [file, setfile] = useState("");


useEffect(() => {

  const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

  axios.get("/post")
  .then((res)=>{
    setlistePost(res.data)
  })
  .catch((err)=>console.log(err));

  axios.get("/categorie/afficherAllCategories")
  .then((res)=>{
    setcategories(res.data);
  })
  .catch((err)=>console.log(err));

  // const btnCheckbox = document.getElementById("tournois");
  // btnCheckbox.checked=true;
}, [])

const accesPageMessagePost= (idPost)=>{
  navigate(`/messagePost/${idPost}`);
}

async function handleimg(){
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const formdata = new FormData();
  formdata.append('file',file);

  await axios.post("/photo/upload",formdata,config)
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err));
}

  return (
 
    <div className='ContainerForum'>
        <p className='titre'>Bienvenue sur le forum</p>
        <div className='AllBtnRecherchePost'>
            <div>
                <div>
                  <span>Catégories</span>
                  <img src={flecheBas} alt=''></img>
                </div>
            </div>
            <div>
                  <input type='text' placeholder='Rechercher sujet'></input>
                  <div>
                    <span>Sujet</span>
                    <img src={flecheBas} alt=''></img>
                  </div>
                  <button>Rechercher</button>
            </div>
            <div>
                 <button>Posts</button>
                 <button>Nouveau post</button>
            </div>
        </div>
        <div className='affichageAllPosts'>
            <div className='ligneTitre'>
                <p>Sujet</p>
                <p>Réponses</p>
                <p>Auteur</p>
                <p>Date</p>
            </div>
            {listePost.map((element)=>{
                        return(
                          <div key={element._id} onClick={()=>accesPageMessagePost(element._id)} className='ligneContenu'>
                            <div>
                              <p>{element.titre}</p>
                              <span>{element.categorie}</span>
                            </div>
                            <p>{element.nombreMessages}</p>
                            <p>{element.pseudoCreateur}</p>
                            <p>{element.dateCreation}</p>
                          </div>
                        )
                    })}
        </div>
        <div className='creationPost'>
            <div className='partieCreation'>
                <h1>Créer un nouveau Post.</h1>
                <p>Posez une question ou donnez votre point de vue sur un cas particulier.</p>
                <h3>Titre</h3>
                <input placeholder='Entrez votre titre' type="text" />
                <h3>Catégorie</h3>
                <div>
                  <span>Choisis ton sujet</span>
                  <img src={flecheBas} alt="" />
                </div>
                <button>Créer</button>
            </div>
            <div className='partieRemonter'>
                <div></div>
                <h2>Post similaire déjà créé?</h2>
                <p>Faites une recherche par sujet,auteur ou catégorie.</p>
                <button>Accéder à la recherche</button>
            </div>
        </div>
    </div>
    
  )
}