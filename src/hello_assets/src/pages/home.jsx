import * as React from "react";
import PlugConnect from "@psychedelic/plug-connect";
import "../../assets/main.css";

const Home = (props) => {
  return (
    <div id="body">
      <h2 className="title">Welcome</h2>
      {props.loggedIn ? (
        <>
          <button className="myButton specialButton">
            Mint NFT - 100 tokens
          </button>
          <br></br>
          <button
            className="myButton specialButton"
            onClick={() => props.setRoute("game")}
          >
            Play Game
          </button>
        </>
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
