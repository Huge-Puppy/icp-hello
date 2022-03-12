import * as React from "react";
import Unity from "react-unity-webgl";
import "../../assets/main.css";

const Game = (props) => {
  return (
    <div id="body">
      <Unity
        unityContext={props.unityContext}
        style={{
          //   height: "100%",
          width: "100%",
          border: "2px solid black",
          background: "grey",
        }}
      />
    </div>
  );
};

export default Game;
