import * as React from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import "../../assets/main.css";

const Game = () => {
  const unityContext = new UnityContext({
    loaderUrl: "../../icp-webgl/Build/Desktop.loader.js",
    dataUrl: "../../icp-webgl/Build/Desktop.data",
    frameworkUrl: "../../icp-webgl/Build/Desktop.framework.js",
    codeUrl: "../../icp-webgl/Build/Desktop.wasm",
  });
  return (
    <div id="body">
      <Unity
        style={{
        //   height: "100%",
          width: "100%",
          border: "2px solid black",
          background: "grey",
        }}
        unityContext={unityContext}
      />
    </div>
  );
};

export default Game;
