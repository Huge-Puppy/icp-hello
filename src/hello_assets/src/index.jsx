import * as React from "react";
import { render } from "react-dom";
import PlugConnect from "@psychedelic/plug-connect";
import "../assets/main.css";

// import { hello } from "../../declarations/hello";

const MyHello = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [principal, setPrincipal] = React.useState("");
  const [expandHeader, setExpandHeader] = React.useState(false);

  const whitelist = ["rv7xl-jaaaa-aaaao-aaa2q-cai"];
  const host = "https://mainnet.dfinity.network";

  const verifyConnectionAndAgent = async () => {
    const connected = await window.ic.plug.isConnected();
    setLoggedIn(connected);
    if (!connected) window.ic.plug.requestConnect({ whitelist, host });
    if (connected && !window.ic.plug.agent) {
      window.ic.plug.createAgent({ whitelist, host });
    }
    if (connected) {
      setPrincipal((await window.ic.plug.getPrincipal()).toText());
    }
  };

  React.useEffect(async () => {
    verifyConnectionAndAgent();
  }, []);

  return (
    <>
      <div id="header">
        <div style={{ flex: 1 }}>
          <button className="myButton">home</button>
        </div>
        <div>
          <div className="rightHeader">
            <button className="myButton">view NFTs</button>
            {loggedIn ? (
              <div className="rightHeader">
                {expandHeader ? (
                  <>
                    <button className="myButton">my NFTs</button>
                    <button className="myButton">logout</button>
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
      <div id="body">
        <h2 className="title">Welcome</h2>
        {loggedIn ? (
          <button className="myButton specialButton">
            Mint NFT - 100 tokens
          </button>
        ) : (
          <PlugConnect
            whitelist={whitelist}
            on
            onConnectCallback={() => {
              setLoggedIn(true);
              window.ic.plug.agent.getPrincipal().then((val) => {
                setPrincipal(val.toText());
              });
            }}
          />
        )}
      </div>
    </>
  );
};

render(<MyHello />, document.getElementById("app"));
