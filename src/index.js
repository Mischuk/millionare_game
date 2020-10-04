import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Game from "./components/Game";
import { store } from "./store";
import "../node_modules/ress/ress.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Game />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);
