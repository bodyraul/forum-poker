import React from 'react'
import { useContext } from 'react';
import { AuthContext } from"../../Context/AuthContext";
import { ConfidentialiteContext } from '../../Context/ConfidentialiteContext';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import "./navbar.css";

export default function Navbar(props) {
    const { token,settoken } = useContext(AuthContext);
    const { confidentialite,setconfidentialite } = useContext(ConfidentialiteContext);
    const [pseudo, setpseudo] = useState("");
    const [admin, setadmin] = useState(false);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };


    const onclickConnexion = ()=>{
      props.setSignIn(true);
      props.setSignUp(false);
    }

    const onclickInscription = ()=>{
      props.setSignUp(true);
      props.setSignIn(false);
    }

     const adminOuNon = async ()=>{
        await axios.get("/admin",config)
        .then((res)=>{
          if(res.data != 'admin'){
            return setadmin(false);
            
          }
          setadmin(true);
        })
        .catch((err)=>(setadmin(false)))
      }

    useEffect(() => {
        adminOuNon();

    }, [props.test])
    

    useEffect(() => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if(token){
        axios.get("/user/recupPseudo",config)
        .then((res)=>setpseudo(res.data))
        .catch((err)=>console.log(err));
      }      
      if(!token){
        return;
      }
    }, [token])

   
    if(token) {
      return(
        <div className='containerNav'>
          <nav className='navbar'>
              <Link className='AllLink' to={"/"}>Accueil </Link>
              <Link className='AllLink' to={"/forum"}>forum </Link>
              <Link className='AllLink' onClick={()=>{
              localStorage.removeItem("token");
              localStorage.removeItem("confidentialite");
              setconfidentialite("");
              settoken("");
              setadmin(false);
              props.settest(false);
              }} to={"/#/connexion"}>Deconnexion </Link>
            {admin===true? <Link className='AllLink' to={"/admin"}>admin </Link> : ""}
            <Link className='AllLink' id='pseudonymeNav'>{pseudo} </Link>
          </nav>
        </div>
     )
    }if(!token){
      return(
        <div className='containerNav'>
          <nav className='navbar'>
            <Link className='AllLink' to={"/"}>Accueil </Link>
            <Link className='AllLink'  to={"/forum"}>forum </Link>
            <Link className='AllLink' onClick={onclickConnexion}  >Connexion </Link>
            <Link className='AllLink' onClick={onclickInscription}  >Inscription </Link>
           </nav>
        </div>
     )
    }
      
  }