import * as React from "react";
import PlugConnect from "@psychedelic/plug-connect";
import "../../assets/main.css";

const Home = (props) => {
  return (
    <div id="body">
      <h2 className="title">Welcome</h2>
      {props.loggedIn ? (
        !props.loading ? (
          <>
            <button className="myButton specialButton" onClick={props.mint}>
              Mint NFT - 100 tokens
            </button>
            <br></br>
            {props.hasNft ? (
              <button
                className="myButton specialButton"
                onClick={() => props.setRoute("game")}
              >
                Play Game
              </button>
            ) : (
              <></>
            )}
          </>
        ) : (
          <p className="whiteText">loading...</p>
        )
      ) : (
        <PlugConnect
          whitelist={props.whitelist}
          onConnectCallback={() => {
            props.setLoggedIn(true);
            window.ic.plug.agent.getPrincipal().then((val) => {
              props.setPrincipal(val.toText());
            });
          }}
        />
      )}
    </div>
  );
};

export default Home;
