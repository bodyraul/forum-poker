import React from'react'
import {BrowserRouter,HashRouter,Routes,Route} from "react-router-dom";
import { useState } from 'react';
import { AuthContext } from './Context/AuthContext';
import { ConfidentialiteContext } from './Context/ConfidentialiteContext';
import Navbar from './Component/navbar/Navbar';
import SignUp from './Component/signUp/SignUp';
import SignIn from './Component/signIn/SignIn'
import Accueil from './page/accueil/Accueil';
import MessagePost from './page/messagePost/MessagePost';

function App() {
  const initToken = localStorage.getItem("token")?localStorage.getItem("token"):"";
  const initConfidentialite = localStorage.getItem("confidentialite")?localStorage.getItem("confidentialite"):"";
  const [token, settoken] = useState(initToken);
  const [confidentialite, setconfidentialite] = useState(initConfidentialite);
  const [test, settest] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [signIn, setSignIn] = useState(false);
  return (
    <div className="App">
        <HashRouter hashType="hashbang">
            <AuthContext.Provider value={{token,settoken}} >
            <ConfidentialiteContext.Provider value={{confidentialite,setconfidentialite}}>
            <Navbar signUp={signUp} signIn={signIn} setSignUp={setSignUp} setSignIn={setSignIn} test={test} settest={settest}/>
            <SignIn signIn={signIn} setSignIn={setSignIn}></SignIn>
            <SignUp signUp={signUp} setSignUp={setSignUp} signIn={signIn} setSignIn={setSignIn} ></SignUp>
            <Routes>
                <Route path="/"  element={<Accueil/>} />
                <Route path="/messagePost/:id" element={<MessagePost/>} />
                {/* <Route path="/confidentialite"  element={<Confidentialite/>} />
                <Route path="/forum" element={<AccueilForum/>} />
                <Route path="/admin" element={<Admin/>} />
                <Route path="/admin/signalementMessage" element={<SignalementMessage/>} />
                <Route path="/admin/signalementPost" element={<SignalementPost/>} />
                <Route path="/admin/signalementPost/details/:id" element={<DetailsSignalementPost/>} />
                <Route path="/admin/signalementMessage/details/:id" element={<DetailsSignalementMsg/>} /> */}
            </Routes>
            </ConfidentialiteContext.Provider>
            </AuthContext.Provider>
        </HashRouter>
    </div>
  );
}

export default App;
