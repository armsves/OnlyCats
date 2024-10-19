import React, { useEffect, useState, } from "react"
import TopBar from "./components/TopBar"
import Home from "./Pages/Home";
import User from "./Pages/User";
import Cart from "./Pages/Cart";
import FileLoader from "./components/FileLoader";
import Admin from "./Pages/Admin";
import "./index.css"
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom"
import { useAuth } from "./auth"

function AppPage() {
  //const [modal, setModal] = useState(false)
  //const [modalMsg, setModalMsg] = useState("")
  const [fileloader, setFileLoader] = useState({
    isOpen: false,
    currentIndex: 0,
    totalChunks: 0,
  })

  const { isAuthenticated, identity, login, backendActor, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [caller, setCaller] = useState(null)
  const [cartItemsCount, setCartItemsCount] = useState(null)
  const [categories, setCategories] = useState(null);

  /*
  useEffect(() => {
    if (isAuthenticated) {
      // getIsReady()
      //console.log("is auth", identity)
      setIsLoading(false)
      getIsReady()
    } else {
      //console.log("not auth", identity)
      //getIsReady()
      //setProfile(null)
      setCaller(null)
      // setIsLoading(false)
    }
  }, [isAuthenticated, identity])
  */

  const getIsReady = async () => {
    const caller = await backendActor.caller()
    const profile = await backendActor.getProfile()
    //console.log("caller",caller)
    //console.log("profile", profile)
    setCaller(caller)
    //setProfile(profile)
  }

  const verifyConnectionAndAgent = async () => {
    const connected = await window.ic.plug.isConnected();
    if (!connected) window.ic.plug.requestConnect("bkyz2-fmaaa-aaaaa-qaaaq-cai");
    if (connected && !window.ic.plug.agent) {
      window.ic.plug.createAgent("bkyz2-fmaaa-aaaaa-qaaaq-cai")
    }
  };

  /*
  const [countdown, setCountdown] = useState(10)
  const updateCountdown = () => {
    let tempcount = countdown - 1;
    setCountdown(tempcount);
    if (tempcount === 0) {
      setCountdown(10);
      //fetchCryptoData();
      //console.log("Data fetched")
    }
  };
  const fetchCryptoData = () => {
    const apiUrl = 'https://openapi.bitrue.com/api/v1/ticker/price?symbol=';
    fetch(apiUrl + "BTCUSDT", {}).then(response => response.json()).then(data => { setPriceBTC(data.price); }).catch(error => { console.log('Error fetching crypto data:', error); });
    fetch(apiUrl + "ETHUSDT", {}).then(response => response.json()).then(data => { setPriceETH(data.price); }).catch(error => { console.log('Error fetching crypto data:', error); });
    fetch(apiUrl + "ICPUSDT", {}).then(response => response.json()).then(data => { setPriceICP(data.price); }).catch(error => { console.log('Error fetching crypto data:', error); });
  };
  */

  const getCategories = async () => {
    setIsLoading(true);
    if (backendActor) {
      let response = await backendActor.getCategories();
      setCategories(response)
    }
    setIsLoading(false);
  }

  /*
  useEffect(() => {
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [countdown]);
  useEffect(() => {
    verifyConnectionAndAgent();
    //fetchCryptoData();
  }, []);
  */

  //<Modal isOpen={modal} message={modalMsg} onClose={setModal} />
  return (
    <>
      <FileLoader
        isOpen={fileloader.isOpen}
        currentIndex={fileloader.currentIndex}
        totalChunks={fileloader.totalChunks}
        className="my-custom-loader" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
        <Router>
          <TopBar
            profile={profile} setProfile={setProfile}
            setIsLoading={setIsLoading} cartItemsCount={cartItemsCount} categories={categories} getCategories={getCategories}
          />
          <Routes>
            <Route path="" element={
              <Home isLoading={isLoading} profile={profile} setCartItemsCount={setCartItemsCount} />} />
            <Route path="/user" element={
              <User setFileLoader={setFileLoader} caller={caller}
                setIsLoading={setIsLoading} profile={profile} isLoading={isLoading} reLoad={getIsReady} />} />
            <Route path="/admin" element={
              <Admin setFileLoader={setFileLoader} caller={caller} categories={categories} getCategories={getCategories}
                setIsLoading={setIsLoading} profile={profile} isLoading={isLoading} reLoad={getIsReady} />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default AppPage
