import * as React from "react";
import { render } from "react-dom";

import Home from "./pages/home";
import ViewNfts from "./pages/view_nfts";
import Game from "./pages/game";

import "../assets/main.css";

import { hello } from "../../declarations/hello";

const MyHello = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [principal, setPrincipal] = React.useState("");
  const [expandHeader, setExpandHeader] = React.useState(false);
  const [route, setRoute] = React.useState("home");

  const whitelist = ["rv7xl-jaaaa-aaaao-aaa2q-cai"];
  const host = "https://mainnet.dfinity.network";

  const verifyConnectionAndAgent = async () => {
    const connected = await window.ic.plug.isConnected();
    setLoggedIn(connected);
    if (connected && !window.ic.plug.agent) {
      window.ic.plug.createAgent({ whitelist, host });
    }
    if (connected) {
      setPrincipal((await window.ic.plug.getPrincipal()).toText());
    }
  };

  const mint = async () => {
    hello.mint();
  };

  const logout = () => {
    console.log(loggedIn);
    window.ic.plug.disconnect();
    setLoggedIn(false);
  };

  React.useEffect(async () => {
    verifyConnectionAndAgent();
  }, []);

  return (
    <>
      <div id="header">
        <div style={{ flex: 1 }}>
          <button className="myButton" onClick={() => setRoute("home")}>
            home
          </button>
        </div>
        <div>
          <div className="rightHeader">
            <button className="myButton" onClick={() => setRoute("allnfts")}>
              view NFTs
            </button>
            {loggedIn ? (
              <div className="rightHeader">
                {expandHeader ? (
                  <>
                    <button
                      className="myButton"
                      onClick={() => setRoute("allnfts")}
                    >
                      my NFTs
                    </button>
                    <button className="myButton" onClick={() => logout()}>
                      logout
                    </button>
                  </>
                ) : (
                  <></>
                )}
                <button
                  className="myButton"
                  onClick={() => setExpandHeader(!expandHeader)}
                >
                  {principal.slice(0, 5)}
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* 
          view all nfts button
            - page
              - grid of nft svgs
          home button
          (if logged in) 
          principal avatar 
            - popup
              - view my nfts
              - logout

        */}
      </div>
      {route == "home" ? (
        <Home
          setPrincipal={setPrincipal}
          setRoute={setRoute}
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          whitelist={whitelist}
        />
      ) : route == "allnfts" ? (
        <ViewNfts metadata={[]} />
      ) : route == "mynfts" ? (
        <ViewNfts metadata={[]} />
      ) : route == "game" ? (
        <Game />
      ) : (
        <></>
      )}
    </>
  );
};

render(<MyHello />, document.getElementById("app"));
