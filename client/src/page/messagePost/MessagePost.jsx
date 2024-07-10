import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import "./messagePost.css"
import LikeActif from '../../photo/likeActif.png'
import LikeNoActif from '../../photo/likeNoActif.png'
import signalerNoActif from '../../photo/signalerNoActif.png'
import signalerActif from '../../photo/signalerActif.png'

export default function MessagesPost(props) {
  const {id} = useParams();
  const {token,settoken}  = useContext(AuthContext);
  const [post, setpost] = useState({});
  const [allMsg, setallMsg] = useState([]);
  const [tailleAllMsg, settailleAllMsg] = useState(false);
  const [messageServer, setmessageServer] = useState("");
  const [listeSignalementUser, setlisteSignalementUser] = useState([]);
  const [listeLikeUser, setlisteLikeUser] = useState([]);
  const [valueMsgForm, setvalueMsgForm] = useState("");
  const [messageErreur, setmessageErreur] = useState("");
  const paraMessageErreur = useRef();
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  //affichage des messages au chargement , du post et des signalements de l'user pour les msg du post
  useEffect(() => {

    async function messages(){
      await  axios.get(`/message/afficherMesMessages/${id}`,config)
      .then((res)=>{
        setallMsg(res.data);
      })
      .catch((err)=>setmessageServer(err.response.data));
    }

    async function monPoste(){
      await  axios.get(`/post/lePoste/${id}`,config)
      .then((res)=>{
        setpost(res.data)
      })
      .catch((err)=>console.log(err));
    }

    async function allLike(){
        await  axios.get(`/like/AfficherMessageLikerParPost/${id}`,config)
        .then((res)=>{
          console.log(res)
          setlisteLikeUser(res.data);
        })
        .catch((err)=>console.log(err));
      }

    async function signalements (){
      await  axios.get(`/signalement/AfficherMessageSignalerParPost/${id}`,config)
      .then((res)=>{
        setlisteSignalementUser(res.data);
      })
      .catch((err)=>console.log(err));
    }

    messages();
    monPoste();
    allLike();
    signalements();
   

  }, [])

  const like = (id)=>{
    for (let index = 0; index < listeLikeUser.length; index++) {
        if(id === listeLikeUser[index].idMessage){
            return(
                <img alt='' id='imgLike' onClick={(()=>modifierLike(id,true))} src={LikeActif}></img>
            )
        }
    }
    return(
        <img alt='' id='imgLike' onClick={(()=>modifierLike(id,false))} src={LikeNoActif}></img>
    )
  }

  async function modifierLike(id,bol){
    if(bol){
        await  axios.delete(`/like/supprimerLike/${id}`,config)
        .then((res)=>{
            setlisteLikeUser(listeLikeUser.filter(el=>el.idMessage!==id));
            for (let index = 0; index < allMsg.length; index++) {
                if(allMsg[index]._id === id){
                    allMsg[index].nbLike-=1;
                }
                
            }
        })
        .catch((err)=>console.log(err));
    }
    if(!bol){
        const like={
            nom:"oui",
        }
        await  axios.post(`/like/creerLike/${id}`,like,config)
        .then((res)=>{
            setlisteLikeUser(res.data);
            for (let index = 0; index < allMsg.length; index++) {
                if(allMsg[index]._id === id){
                    allMsg[index].nbLike+=1;
                }
                
            }
        })
        .catch((err)=>console.log(err));
    }
  }

  const signaler =(id)=>{
    for (let index = 0; index < listeSignalementUser.length; index++) {
      if(id === listeSignalementUser[index].idMessage){
          return(
            <div className='signalement'>
              <img id='imgSignaler' onClick={()=>modifierSignalement(id,true)} alt=''  src={signalerActif}></img>
              <span>Ne plus signaler</span>
            </div>
          )
      }
    }
    return(
      <div className='signalement'>
        <img id='imgSignaler'onClick={()=>modifierSignalement(id,false)} alt='' src={signalerNoActif}></img>
        <span>Signaler</span>
      </div>
    )
  }
  
  async function modifierSignalement(id,bol){
    if(bol){
        await  axios.delete(`/signalement/signalementMessage/${id}`,config)
        .then((res)=>{
          setlisteSignalementUser(listeSignalementUser.filter(el=>el.idMessage!==id));
        })
        .catch((err)=>console.log(err));
    }
    if(!bol){
        const like={
            nom:"oui",
        }
        await  axios.post(`/signalement/signalementMessage/${id}`,like,config)
        .then((res)=>{
           setlisteSignalementUser(res.data);
        })
        .catch((err)=>console.log(err));
    }
  }

  const valideFormMessage = async()=>{
    paraMessageErreur.current.style.color="#ef4444";
    if(!token){
      return setmessageErreur("Vous devez être connecté pour écrire un message.");
    }
    if(valueMsgForm.length===0){
      return setmessageErreur("le message ne peut pas être vide");
    }
    if(valueMsgForm.length>1000){
      return setmessageErreur("le message ne peut pas dépasser 1000 caractères");
    }

    const newMessage={};
    newMessage.contenu=valueMsgForm;

    await axios.post(`/message/creerMessage/${id}`,newMessage,config)
    .then((res)=>{
      paraMessageErreur.current.style.color="#44ADA8";
      setmessageErreur("message Créé.");
      setvalueMsgForm("");
    })
    .catch((err)=>console.log(err));

    await axios.get(`/message/afficherMesMessages/${id}`,config)
    .then((res)=>{
      setallMsg(res.data);
    })
    .catch((err)=>console.log(err));
  }
  
  const onclickTextArea= ()=>{
    setmessageErreur("");
  }

  return (
    <div className='ContainerPost'>
    <p className='titre'> Post selectionné</p>
    <div className='affichageDuPost'>
        <div className='ligneTitre'>
            <p>Sujet</p>
            <p>Réponses</p>
            <p>Auteur</p>
            <p>Date</p>
        </div>
        <div  className='ligneContenuPost'>
            <div>
              <p>{post.titre}</p>
              <span>{post.categorie}</span>
            </div>
            <p>{post.nombreMessages}</p>
            <p>{post.pseudoCreateur}</p>
            <p>{post.dateCreation}</p>
        </div>
    </div>
    {allMsg.length===0 ?  <p  className='titre'>Aucune réponse </p> : <p  className='titre'>Toutes les réponses </p>}
    <div className='partieAffichageAllMessage'>
        {allMsg.map((element)=>{
          return(
            <div key={element._id} className='affichageUnMessage'>
              <div>
                <div>
        
                      {props.imgPref.length>0 ? <p className='pAfficheImg'><img src={props.imgPref} alt="" /> </p>:  <p className='pAfficheInitiale'> <span>{element.nomCreateurMessage[0]} . </span> <span>{element.prenomCreateurMessage[0]}</span></p>}
              
                    <span>{" "+element.pseudoCreateurMessage}</span>
                </div>
                <span>{element.dateCreation}</span>
              </div>
              <p on>{element.contenu}</p>
              <div>
                {like(element._id)}
                <span>{element.nbLike}</span>
                {signaler(element._id)}
              </div>
          </div>
          )
        })}
    </div>
    <div className='creationMessage'>
        <div className='partieCreationMessage'>
            <h1>Créer un nouveau Message.</h1>
            <p>Essayez d'apporter quelque chose de nouveau à la conversation.</p>
            <h3>Description</h3>
            <div>
              <textarea onClick={onclickTextArea} value={valueMsgForm} onChange={(e)=>setvalueMsgForm(e.target.value)}  rows={15} cols={80} name="" id="" ></textarea>
            </div>
            <p ref={paraMessageErreur}> {messageErreur} </p>
            <button onClick={valideFormMessage}>Créer</button>
        </div>
        <div className='partieRemonterMessage'>
            <div></div>
            <h2>Mauvais Post selectionné?</h2>
            <p>Cliquez ci-dessous pour revenir à la page des post.</p>
            <button onClick={()=>navigate('/')}>Retour</button>
        </div>
    </div>

</div>
  
  )
}