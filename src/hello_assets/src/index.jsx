import * as React from "react";
import { render } from "react-dom";

import Home from "./pages/home";
import ViewNfts from "./pages/view_nfts";
import Game from "./pages/game";

import "../assets/main.css";

import Unity, { UnityContext } from "react-unity-webgl";
import { hello, idlFactory } from "../../declarations/hello";
import faucetIdlFactory from "./types";
import { Principal } from "@dfinity/principal";
import principalToAccountIdentifier from "./utils";

const MyHello = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [hasNft, setHasNft] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [principal, setPrincipal] = React.useState("");
  const [expandHeader, setExpandHeader] = React.useState(false);
  const [route, setRoute] = React.useState("home");
  const [svgData, setSvgData] = React.useState([]);

  const faucetAddress = "yeeiw-3qaaa-aaaah-qcvmq-cai";
  const helloAddress = "rv7xl-jaaaa-aaaao-aaa2q-cai";
  const whitelist = [helloAddress, faucetAddress];
  const host = "https://mainnet.dfinity.network";

  var faucetActor;
  var helloActor;

  const loadNfts = async (manual) => {
    if (principal != "" || manual) {
      let balance = await hello.balanceOf(
        Principal.fromText(manual ?? principal)
      );
      if (Number(balance) > 0) {
        setHasNft(true);
      }
    }
  };

  const loadActors = async () => {
    faucetActor = await window.ic.plug.createActor({
      canisterId: faucetAddress,
      interfaceFactory: faucetIdlFactory,
    });
    helloActor = await window.ic.plug.createActor({
      canisterId: helloAddress,
      interfaceFactory: idlFactory,
    });
  };
  const verifyConnectionAndAgent = async () => {
    const connected = await window.ic.plug.isConnected();
    setLoggedIn(connected);
    if (connected && !window.ic.plug.agent) {
      window.ic.plug.createAgent({ whitelist, host });
    }
    if (connected) {
      let temp = await window.ic.plug.getPrincipal();
      setPrincipal(temp.toText());
      await loadNfts(temp.toText());
      await loadActors();
    }
  };

  const unityContext = new UnityContext({
    loaderUrl: "../../icp-webgl/Build/Desktop.loader.js",
    dataUrl: "../../icp-webgl/Build/Desktop.data",
    frameworkUrl: "../../icp-webgl/Build/Desktop.framework.js",
    codeUrl: "../../icp-webgl/Build/Desktop.wasm",
  });

  const mint = async () => {
    // create actors
    setLoading(true);
    if (!faucetActor || !helloActor) {
      await loadActors();
    }
    await faucetActor.send_dfx({
      to: principalToAccountIdentifier(helloAddress, 0),
      fee: { e8s: 10000 },
      memo: 0,
      amount: { e8s: 10000000000 },
      from_subaccount: [],
      created_at_time: [],
    });
    await helloActor.publicMint();
    loadNfts();
    setLoading(false);
  };

  const logout = () => {
    window.ic.plug.disconnect();
    setRoute("home");
    setLoggedIn(false);
  };

  React.useEffect(async () => {
    verifyConnectionAndAgent();
    unityContext.on("GiveGold", async function (goldAmount) {
      if (!helloActor) {
        await loadActors();
      }
      await helloActor.giveGold(BigInt(goldAmount));
    });
    unityContext.on("GameOver", async function () {
      setRoute("home");
    });
  }, []);

  const getUserMetadata = async () => {
    const metadata = await hello.getMetadataForUser(
      Principal.fromText(principal)
    );
    const returnVal = metadata.map(
      (val, i, __) =>
        `https://rv7xl-jaaaa-aaaao-aaa2q-cai.raw.ic0.app/?tokenIndex=${val["token_id"]}`
    );
    return returnVal;
  };

  const getAllMetadata = async () => {
    const supply = await hello.totalSupply();
    const returnVal = [...Array(Number(supply)).keys()].map(
      (_, i, __) =>
        `https://rv7xl-jaaaa-aaaao-aaa2q-cai.raw.ic0.app/?tokenIndex=${i}`
    );
    return returnVal;
  };

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
            <button
              className="myButton"
              onClick={async () => {
                setRoute("allnfts");
                setSvgData(await getAllMetadata());
              }}
            >
              view NFTs
            </button>
            {loggedIn ? (
              <div className="rightHeader">
                {expandHeader ? (
                  <>
                    <button
                      className="myButton"
                      onClick={async () => {
                        setRoute("mynfts");
                        setSvgData(await getUserMetadata());
                      }}
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
          mint={mint}
          loading={loading}
          hasNft={hasNft}
        />
      ) : route == "allnfts" ? (
        <ViewNfts data={svgData} />
      ) : route == "mynfts" ? (
        <ViewNfts data={svgData} />
      ) : route == "game" ? (
        <Game unityContext={unityContext} />
      ) : (
        <></>
      )}
    </>
  );
};

render(<MyHello />, document.getElementById("app"));
