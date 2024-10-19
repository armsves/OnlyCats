import React, { useEffect, useState, Component } from "react"
import "./index.css"
import { useAuth } from "../../auth"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faQuestionCircle, faHistory, faUser } from '@fortawesome/free-solid-svg-icons';
import PlugConnect from '@psychedelic/plug-connect';
import { toast } from 'react-toastify';

function TopBar({ setIsLoading, profile, setProfile, cartItemsCount, categories, getCategories }) {
  const [ImgSrc, setImgSrc] = useState(null)
  const navigate = useNavigate()
  const auth = useAuth()
  //const [profile, setProfile] = useState(null)
  const [connected, setConnected] = useState(false)
  const { isAuthenticated, identity, login, backendActor, logout } = useAuth()

  useEffect(() => {
    if (!profile) {
      setIsLoading(true)
    }
    if (profile && profile.profilePic) {
      let image = new Uint8Array(profile.profilePic[0])
      let blob = new Blob([image])
      let reader = new FileReader()
      reader.onload = function (e) {
        setImgSrc(e.target.result)
      }
      reader.readAsDataURL(blob)
    }
  }, [profile, ImgSrc])

  useEffect(() => {
    getCategories()
  }, [backendActor])

  return (
    <>
      <div className="TopBar">
        <div className="left">
          <div className="logo" onClick={() => navigate("/")}><img src="paw.png" width="50px" height="50px" alt="logo" /></div>
        </div>
        <div className="center">
          <div className="logo" onClick={() => navigate("/")}><img src="onlycats.png" width="250px" height="100px" alt="onlycats" /></div>
        </div>
        <div className="right">
          {profile && profile.admin && (<button className="button" onClick={async () => { navigate("/admin") }}>Admin</button>)}
          <PlugConnect
            dark
            title={!connected ? "Connect Wallet" : !profile?.admin ? "Wallet Connected" : "Admin Connected"}
            whitelist={["bkyz2-fmaaa-aaaaa-qaaaq-cai"]}
            onConnectCallback={
              async () => {
                const principalId: String = await window.ic.plug.agent.getPrincipal();
                const admin: String = "bfaxj-k4saz-ynsqm-ffmwa-v3his-2zmp2-f75ts-xpf3q-7dumn-5zemr-5qe";
                if (principalId.toString() === admin.toString()) {
                  console.log("Welcome admin");
                  const newAdmin = {
                    name: principalId.toString(),
                    profilePic: null,
                    admin: true
                  };
                  setProfile(newAdmin);
                } else {
                  const newUser = {
                    name: principalId.toString(),
                    profilePic: null,
                    admin: false
                  };
                  setProfile(newUser);
                  console.log("Welcome user");
                }
                setConnected(true);
                toast.success("Wallet Connected!");
              }
            }
          />
        </div>
      </div>
    </>
  );
}

export default TopBar;
